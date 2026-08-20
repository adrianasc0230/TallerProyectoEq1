const URL_API = 'https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos';
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- Estado ---------- */
  let todosLosProductos = [];   // productos traídos de la API
  let productoActual    = null; // producto que se muestra como principal
  let cantidadSeleccionada = 1;
 
  /* ---------- Referencias al DOM ---------- */
  const el = {
    rutaActual:       document.getElementById('rutaActual'),
    mainImage:        document.getElementById('mainImage'),
    thumbs:           document.getElementById('thumbs'),
    eyebrow:          document.getElementById('pEyebrow'),
    titulo:           document.getElementById('pTitle'),
    estrellas:        document.getElementById('pStars'),
    numeroResenas:    document.getElementById('pReviewCount'),
    precio:           document.getElementById('pPrice'),
    descripcion:      document.getElementById('pDesc'),
    tablaEspecs:      document.getElementById('specsTable'),
    gridRelacionados: document.getElementById('relatedGrid'),
    cantidadValor:    document.getElementById('qtyValue'),
    btnDisminuir:     document.getElementById('btnDisminuir'),
    btnAumentar:      document.getElementById('btnAumentar'),
    btnAgregar:       document.getElementById('btnAgregarCarrito'),
    btnComprar:       document.getElementById('btnComprarAhora'),
    toast:            document.getElementById('toast'),
    toastTexto:       document.getElementById('toastTexto'),
    carritoOverlay:   document.getElementById('carritoOverlay'),
    carritoDrawer:    document.getElementById('carritoDrawer'),
    carritoLista:     document.getElementById('carritoLista'),
    carritoTotal:     document.getElementById('carritoTotal'),
    btnCerrarCarrito: document.getElementById('btnCerrarCarrito'),
    btnIrPagar:       document.getElementById('btnIrPagar'),
  };
 
  const RUTA_ESTRELLA = 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2z';
 
  /* ---------- Utilidades ---------- */
 
  function formatearPrecio(valor, moneda){
    const formateado = Number(valor).toLocaleString('es-CO');
    return `$${formateado} ${moneda || 'COP'}`;
  }
 
  function generarEstrellas(cantidad, tamano = 15){
    let html = '';
    for(let i = 0; i < 5; i++){
      const llena = i < cantidad;
      html += llena
        ? `<svg viewBox="0 0 24 24" width="${tamano}" height="${tamano}" fill="currentColor"><path d="${RUTA_ESTRELLA}"/></svg>`
        : `<svg viewBox="0 0 24 24" width="${tamano}" height="${tamano}" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${RUTA_ESTRELLA}"/></svg>`;
    }
    return html;
  }
 
  /* ---------- Contador del carrito (dentro del Shadow DOM de <header-agro>) ---------- */
 
  function obtenerElementoContador(){
    const header = document.querySelector('header-agro');
    if(header && header.shadowRoot){
      return header.shadowRoot.querySelector('.notificacion-campanazo');
    }
    return null;
  }
 
  /* ---------- Carrito (localStorage) ---------- */
 
  function obtenerCarrito(){
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }
 
  function guardarCarrito(carrito){
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
 
  function agregarAlCarrito(producto, cantidad){
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);
 
    if(existente){
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad,
      });
    }
 
    guardarCarrito(carrito);
 
    actualizarContadorCarrito();
    renderizarCarritoDrawer();
    mostrarToast(`${producto.nombre} agregado al carrito (${cantidad})`);
  }
 
  function cambiarCantidadItemCarrito(id, delta){
    const carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    if(!item) return;
 
    item.cantidad += delta;
 
    if(item.cantidad <= 0){
      eliminarDelCarrito(id);
      return;
    }
 
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    renderizarCarritoDrawer();
  }
 
  function eliminarDelCarrito(id){
    const carrito = obtenerCarrito().filter(item => item.id !== id);
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    renderizarCarritoDrawer();
  }
 
  function calcularTotalCarrito(carrito){
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
 
  /* ---------- Drawer del carrito ---------- */
 
  function abrirCarrito(){
    renderizarCarritoDrawer();
    el.carritoDrawer.classList.add('show');
    el.carritoOverlay.classList.add('show');
  }
 
  function cerrarCarrito(){
    el.carritoDrawer.classList.remove('show');
    el.carritoOverlay.classList.remove('show');
  }
 
  function renderizarCarritoDrawer(){
    const carrito = obtenerCarrito();
 
    if(carrito.length === 0){
      el.carritoLista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
    } else {
      el.carritoLista.innerHTML = carrito.map(item => `
        <div class="carrito-item" data-id="${item.id}">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div>
            <p class="carrito-item-nombre">${item.nombre}</p>
            <p class="carrito-item-precio">${formatearPrecio(item.precio)}</p>
            <div class="carrito-item-qty">
              <button type="button" class="carrito-restar" data-id="${item.id}" aria-label="Restar">−</button>
              <span>${item.cantidad}</span>
              <button type="button" class="carrito-sumar" data-id="${item.id}" aria-label="Sumar">+</button>
            </div>
          </div>
          <button type="button" class="carrito-eliminar" data-id="${item.id}" aria-label="Eliminar producto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
          </button>
        </div>
      `).join('');
 
      el.carritoLista.querySelectorAll('.carrito-sumar').forEach(btn => {
        btn.addEventListener('click', () => cambiarCantidadItemCarrito(Number(btn.dataset.id), 1));
      });
      el.carritoLista.querySelectorAll('.carrito-restar').forEach(btn => {
        btn.addEventListener('click', () => cambiarCantidadItemCarrito(Number(btn.dataset.id), -1));
      });
      el.carritoLista.querySelectorAll('.carrito-eliminar').forEach(btn => {
        btn.addEventListener('click', () => eliminarDelCarrito(Number(btn.dataset.id)));
      });
    }
 
    el.carritoTotal.textContent = formatearPrecio(calcularTotalCarrito(carrito));
  }
 
  el.btnCerrarCarrito.addEventListener('click', cerrarCarrito);
  el.carritoOverlay.addEventListener('click', cerrarCarrito);
  el.btnIrPagar.addEventListener('click', () => {
    mostrarToast('Redirigiendo al checkout...');
  });
 
  function conectarBotonCarritoDelHeader(){
    const header = document.querySelector('header-agro');
    if(!header || !header.shadowRoot) return;
 
    const linkCarrito = header.shadowRoot.querySelector('.el-canasto');
    if(linkCarrito){
      linkCarrito.addEventListener('click', (evento) => {
        evento.preventDefault();
        abrirCarrito();
      });
    }
  }
 
  function actualizarContadorCarrito(){
    const contador = obtenerElementoContador();
    if(!contador) return; // el header aún no está listo en el DOM
 
    const carrito = obtenerCarrito();
    const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalUnidades;
  }
 
  function mostrarToast(mensaje){
    el.toastTexto.textContent = mensaje;
    el.toast.classList.add('show');
    clearTimeout(mostrarToast._temporizador);
    mostrarToast._temporizador = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2200);
  }
 
  /* ---------- Selector de cantidad ---------- */
 
  function cambiarCantidad(delta){
    cantidadSeleccionada = Math.max(1, cantidadSeleccionada + delta);
    el.cantidadValor.textContent = cantidadSeleccionada;
  }
 
  el.btnDisminuir.addEventListener('click', () => cambiarCantidad(-1));
  el.btnAumentar.addEventListener('click', () => cambiarCantidad(1));
 
  el.btnAgregar.addEventListener('click', () => {
    if(productoActual) agregarAlCarrito(productoActual, cantidadSeleccionada);
  });
 
  el.btnComprar.addEventListener('click', () => {
    if(!productoActual) return;
    agregarAlCarrito(productoActual, cantidadSeleccionada);
    mostrarToast('Redirigiendo al checkout...');
  });
 
  /* ---------- Carga de datos desde la API ---------- */
 
  async function obtenerProductos(){
    const respuesta = await fetch(URL_API);
    if(!respuesta.ok){
      throw new Error(`Error ${respuesta.status} al consultar la API`);
    }
    return respuesta.json();
  }
 
  async function iniciar(){
    actualizarContadorCarrito(); // refleja lo que ya estaba guardado en localStorage
    conectarBotonCarritoDelHeader();
 
    try {
      todosLosProductos = await obtenerProductos();
 
      const destacado = todosLosProductos.find(p => p.nombre.toLowerCase().includes('lechero'))
        || todosLosProductos[0];
 
      if(!destacado){
        throw new Error('No hay productos disponibles en la API');
      }
 
      renderizarProductoPrincipal(destacado);
      renderizarRelacionados(destacado);
 
    } catch (error){
      console.error(error);
      el.titulo.textContent = 'No se pudo cargar el producto';
      el.descripcion.textContent = 'Ocurrió un problema al conectar con la API. Intenta recargar la página.';
      el.eyebrow.textContent = 'Error';
      el.precio.textContent = '—';
    }
  }
 
  /* ---------- Render: producto principal ---------- */
 
  function renderizarProductoPrincipal(producto){
    productoActual = producto;
    cantidadSeleccionada = 1;
    el.cantidadValor.textContent = cantidadSeleccionada;
 
    document.title = `${producto.nombre} | Agroanima`;
    el.rutaActual.textContent = producto.nombre;
 
    el.eyebrow.textContent = producto.categoria;
    el.titulo.textContent = producto.nombre;
    el.descripcion.textContent = producto.descripcion;
    el.precio.textContent = formatearPrecio(producto.precio, producto.moneda);
 
    el.estrellas.innerHTML = generarEstrellas(producto.calificacion, 15);
    el.numeroResenas.textContent = `(${producto.numeroResenas} valoraciones de clientes)`;
 
    el.mainImage.src = producto.imagen;
    el.mainImage.alt = producto.nombre;
 
    renderizarEspecificaciones(producto);
    renderizarMiniaturas(producto);
 
    const disponible = producto.disponible && producto.stock > 0;
    el.btnAgregar.disabled = !disponible;
    el.btnComprar.disabled = !disponible;
    el.btnAgregar.style.opacity = disponible ? '1' : '.5';
    el.btnComprar.style.opacity = disponible ? '1' : '.5';
  }
 
  function renderizarEspecificaciones(producto){
    const filas = [
      { etiqueta: 'Categoría',        valor: producto.categoria },
      { etiqueta: 'Precio',           valor: formatearPrecio(producto.precio, producto.moneda) },
      { etiqueta: 'Calificación',     valor: `${producto.calificacion} / 5` },
      { etiqueta: 'Stock disponible', valor: `${producto.stock} unidades` },
      { etiqueta: 'Disponibilidad',   valor: producto.disponible ? 'Disponible' : 'Agotado' },
    ];
 
    el.tablaEspecs.innerHTML = filas.map(fila => `
      <div class="specs-row">
        <div class="label">${fila.etiqueta}</div>
        <div class="value">${fila.valor}</div>
      </div>
    `).join('');
  }
 
  function renderizarMiniaturas(producto){
    const mismaCategoria = todosLosProductos.filter(p => p.categoria === producto.categoria && p.id !== producto.id);
    const galeria = [producto, ...mismaCategoria].slice(0, 4);
 
    el.thumbs.innerHTML = galeria.map(p => `
      <div class="thumb ${p.id === producto.id ? 'active' : ''}" data-id="${p.id}" title="${p.nombre}">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
    `).join('');
 
    el.thumbs.querySelectorAll('.thumb').forEach(miniatura => {
      miniatura.addEventListener('click', () => {
        const id = Number(miniatura.dataset.id);
        const seleccionado = todosLosProductos.find(p => p.id === id);
        if(seleccionado){
          renderizarProductoPrincipal(seleccionado);
          renderizarRelacionados(seleccionado);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
 
  /* ---------- Render: productos relacionados ---------- */
 
  function renderizarRelacionados(producto){
    const relacionados = todosLosProductos
      .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
      .slice(0, 3);
 
    if(relacionados.length < 3){
      const extra = todosLosProductos
        .filter(p => p.id !== producto.id && !relacionados.includes(p))
        .slice(0, 3 - relacionados.length);
      relacionados.push(...extra);
    }
 
    el.gridRelacionados.innerHTML = relacionados.map(p => `
      <div class="card" data-id="${p.id}">
        <div class="card-img"><img src="${p.imagen}" alt="${p.nombre}"></div>
        <div class="card-body">
          <div class="card-eyebrow">${p.categoria}</div>
          <div class="card-title">${p.nombre}</div>
          <div class="card-stars">
            <span class="stars">${generarEstrellas(p.calificacion, 12)}</span>
            <span class="count">(${p.numeroResenas})</span>
          </div>
          <div class="card-foot">
            <span class="card-price">${formatearPrecio(p.precio, p.moneda)}</span>
          </div>
        </div>
      </div>
    `).join('');
 
    el.gridRelacionados.querySelectorAll('.card').forEach(tarjeta => {
      tarjeta.addEventListener('click', () => {
        const id = Number(tarjeta.dataset.id);
        const seleccionado = todosLosProductos.find(p => p.id === id);
        if(seleccionado){
          renderizarProductoPrincipal(seleccionado);
          renderizarRelacionados(seleccionado);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
 
  /* ---------- Arranque ---------- */
  iniciar();
 
});