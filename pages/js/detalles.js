const URL_API = 'https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos';
 
document.addEventListener('DOMContentLoaded', () => {
 

  let todosLosProductos = [];
  let productoActual    = null;
  let cantidadSeleccionada = 1;
 
  /* Referencias al DOM */
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
  };
 
  const RUTA_ESTRELLA = 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2z';
 
  /* Utilidades */
 
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
 
  /* Selector de cantidad */
 
  function cambiarCantidad(delta){
    cantidadSeleccionada = Math.max(1, cantidadSeleccionada + delta);
    el.cantidadValor.textContent = cantidadSeleccionada;
  }
 
  el.btnDisminuir.addEventListener('click', () => cambiarCantidad(-1));
  el.btnAumentar.addEventListener('click', () => cambiarCantidad(1));
 
  /* Carrito*/
 
  el.btnAgregar.addEventListener('click', () => {
    if(productoActual) window.agregarAlCarrito(productoActual, cantidadSeleccionada);
  });
 
  el.btnComprar.addEventListener('click', () => {
    if(!productoActual) return;
    window.agregarAlCarrito(productoActual, cantidadSeleccionada);
    window.mostrarToastCarrito('Redirigiendo al checkout...');
  });
 
  /* Carga de datos desde la API  */
 
  async function obtenerProductos(){
    const respuesta = await fetch(URL_API);
    if(!respuesta.ok){
      throw new Error(`Error ${respuesta.status} al consultar la API`);
    }
    return respuesta.json();
  }
 
  async function iniciar(){
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
 
  /* producto principal */
 
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
 
  /* productos relacionados */
 
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
   iniciar();
 
});