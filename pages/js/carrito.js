// carrito independiente, para su uso en todas las páginas

const RUTA_ESTRELLA_CARRITO = 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2z';
 
class CarritoDrawer extends HTMLElement {
  constructor(){
    super();
 
    const shadow = this.attachShadow({ mode: 'open' });
 
    const linkFuentes = document.createElement('link');
    linkFuentes.setAttribute('rel', 'stylesheet');
    linkFuentes.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
 
    const estilos = document.createElement('style');
    estilos.textContent = `
      :host{
        --verde-oscuro:#1f5c3f;
        --verde:#2f8f5b;
        --naranja:#e07b1f;
        --texto:#22303c;
        --texto-suave:#64748b;
        --borde:#e4e7eb;
        --fondo:#f6f7f9;
        --blanco:#ffffff;
        font-family:'Inter', sans-serif;
      }
      *{box-sizing:border-box;}
      button{font-family:inherit;cursor:pointer;border:none;}
      img{max-width:100%;display:block;}
 
      .overlay{
        position:fixed;
        inset:0;
        background:rgba(15,23,32,.45);
        opacity:0;
        pointer-events:none;
        transition:opacity .25s ease;
        z-index:9998;
      }
      .overlay.show{opacity:1;pointer-events:auto;}
 
      .drawer{
        position:fixed;
        top:0;
        right:0;
        height:100vh;
        width:400px;
        max-width:92vw;
        background:var(--blanco);
        box-shadow:-12px 0 32px rgba(20,30,40,.14);
        z-index:9999;
        display:flex;
        flex-direction:column;
        transform:translateX(100%);
        transition:transform .3s ease;
      }
      .drawer.show{transform:translateX(0);}
 
      .drawer-header{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding:22px 24px;
        border-bottom:1px solid var(--borde);
      }
      .drawer-header h3{
        font-family:'Poppins', sans-serif;
        font-size:17px;
        font-weight:700;
        color:var(--texto);
        margin:0;
      }
      .cerrar{
        width:32px;height:32px;
        border-radius:8px;
        background:var(--fondo);
        color:var(--texto);
        display:flex;align-items:center;justify-content:center;
        transition:background .15s ease;
      }
      .cerrar:hover{background:var(--borde);}
      .cerrar svg{width:16px;height:16px;}
 
      .lista{
        flex:1;
        overflow-y:auto;
        padding:16px 24px;
        display:flex;
        flex-direction:column;
        gap:16px;
      }
      .vacio{
        color:var(--texto-suave);
        font-size:14px;
        text-align:center;
        padding:40px 0;
      }
 
      .item{
        display:grid;
        grid-template-columns:64px 1fr auto;
        gap:12px;
        align-items:start;
        padding-bottom:16px;
        border-bottom:1px solid var(--borde);
      }
      .item img{
        width:64px;height:64px;
        object-fit:contain;
        background:var(--fondo);
        border:1px solid var(--borde);
        border-radius:10px;
        padding:6px;
      }
      .item-nombre{
        font-size:13.5px;
        font-weight:600;
        line-height:1.35;
        margin:0 0 4px;
        color:var(--texto);
      }
      .item-precio{
        font-size:13px;
        color:var(--verde-oscuro);
        font-weight:700;
        margin:0 0 8px;
      }
      .item-qty{
        display:inline-flex;
        align-items:center;
        border:1.5px solid var(--borde);
        border-radius:8px;
        overflow:hidden;
        height:30px;
      }
      .item-qty button{
        width:28px;height:100%;
        background:var(--fondo);
        font-size:14px;
        color:var(--texto);
      }
      .item-qty button:hover{background:var(--borde);}
      .item-qty span{
        width:28px;
        text-align:center;
        font-size:13px;
        font-weight:600;
        color:var(--texto);
      }
      .eliminar{
        width:28px;height:28px;
        border-radius:7px;
        background:var(--fondo);
        color:var(--texto-suave);
        display:flex;align-items:center;justify-content:center;
        transition:background .15s ease, color .15s ease;
      }
      .eliminar:hover{background:#fde8e8;color:#c0392b;}
      .eliminar svg{width:14px;height:14px;}
 
      .drawer-footer{
        padding:20px 24px 24px;
        border-top:1px solid var(--borde);
      }
      .total{
        display:flex;
        justify-content:space-between;
        align-items:center;
        font-size:15px;
        font-weight:700;
        margin-bottom:16px;
        color:var(--texto);
      }
      .total span:last-child{
        color:var(--verde-oscuro);
        font-size:19px;
      }
      .btn-pagar{
        width:100%;
        height:46px;
        border-radius:10px;
        background:#f2b705;
        color:#2a2000;
        font-size:14.5px;
        font-weight:600;
      }
      .btn-pagar:hover{filter:brightness(.96);}
 
      .toast{
        position:fixed;
        left:50%;
        bottom:28px;
        transform:translateX(-50%) translateY(20px);
        background:#1c2b3a;
        color:#fff;
        padding:12px 22px;
        border-radius:10px;
        font-size:13.5px;
        font-weight:500;
        display:flex;
        align-items:center;
        gap:8px;
        opacity:0;
        pointer-events:none;
        transition:opacity .25s ease, transform .25s ease;
        z-index:10000;
      }
      .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
      .toast svg{width:16px;height:16px;color:var(--verde);}
 
      @media (max-width: 560px){
        .drawer{width:100vw;max-width:100vw;}
      }
    `;
 
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="overlay" id="overlay"></div>
 
      <aside class="drawer" id="drawer">
        <div class="drawer-header">
          <h3>Tu Carrito</h3>
          <button class="cerrar" id="btnCerrar" type="button" aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
 
        <div class="lista" id="lista"></div>
 
        <div class="drawer-footer">
          <div class="total">
            <span>Total</span>
            <span id="total">$0 COP</span>
          </div>
          <button class="btn-pagar" id="btnPagar" type="button">Proceder al Pago</button>
        </div>
      </aside>
 
      <div class="toast" id="toast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <span id="toastTexto">Producto agregado al carrito</span>
      </div>
    `;
 
    shadow.appendChild(linkFuentes);
    shadow.appendChild(estilos);
    shadow.appendChild(wrapper);
 
    this._el = {
      overlay:     shadow.getElementById('overlay'),
      drawer:      shadow.getElementById('drawer'),
      lista:       shadow.getElementById('lista'),
      total:       shadow.getElementById('total'),
      btnCerrar:   shadow.getElementById('btnCerrar'),
      btnPagar:    shadow.getElementById('btnPagar'),
      toast:       shadow.getElementById('toast'),
      toastTexto:  shadow.getElementById('toastTexto'),
    };
 
    this._el.btnCerrar.addEventListener('click', () => this.cerrar());
    this._el.overlay.addEventListener('click', () => this.cerrar());
    this._el.btnPagar.addEventListener('click', () => {
      this.mostrarToast('Redirigiendo al checkout...');
    });
  }
 
  connectedCallback(){
    this.actualizarContadorHeader();
    this._conectarConHeader();
  }
 
  /* Conexión con el ícono del carrito en <header-agro> */
 
  _conectarConHeader(){
    const intentar = () => {
      const header = document.querySelector('header-agro');
      if(!header || !header.shadowRoot) return false;
 
      const linkCarrito = header.shadowRoot.querySelector('.el-canasto');
      if(!linkCarrito) return false;
 
      linkCarrito.addEventListener('click', (evento) => {
        evento.preventDefault();
        this.abrir();
      });
      return true;
    };
 
    // El header puede tardar unos milisegundos en montarse según el orden de los <script defer>
    if(!intentar()){
      let intentos = 0;
      const intervalo = setInterval(() => {
        intentos++;
        if(intentar() || intentos > 20) clearInterval(intervalo);
      }, 100);
    }
  }
 
  _obtenerElementoContadorHeader(){
    const header = document.querySelector('header-agro');
    if(header && header.shadowRoot){
      return header.shadowRoot.querySelector('.notificacion-campanazo');
    }
    return null;
  }
 
  /* Utilidades */
 
  _formatearPrecio(valor, moneda = 'COP'){
    const formateado = Number(valor).toLocaleString('es-CO');
    return `$${formateado} ${moneda}`;
  }
 
  _generarEstrellas(cantidad){
    let html = '';
    for(let i = 0; i < 5; i++){
      html += i < cantidad
        ? `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="${RUTA_ESTRELLA_CARRITO}"/></svg>`
        : `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${RUTA_ESTRELLA_CARRITO}"/></svg>`;
    }
    return html;
  }
 
  /*localStorage */
 
  obtenerCarrito(){
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }
 
  guardarCarrito(carrito){
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
 
  /* API pública del carrito */
 
  agregar(producto, cantidad){
    const carrito = this.obtenerCarrito();
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
 
    this.guardarCarrito(carrito);
    this.actualizarContadorHeader();
    this._renderizar();
    this.mostrarToast(`${producto.nombre} agregado al carrito (${cantidad})`);
  }
 
  cambiarCantidad(id, delta){
    const carrito = this.obtenerCarrito();
    const item = carrito.find(i => i.id === id);
    if(!item) return;
 
    item.cantidad += delta;
 
    if(item.cantidad <= 0){
      this.eliminar(id);
      return;
    }
 
    this.guardarCarrito(carrito);
    this.actualizarContadorHeader();
    this._renderizar();
  }
 
  eliminar(id){
    const carrito = this.obtenerCarrito().filter(item => item.id !== id);
    this.guardarCarrito(carrito);
    this.actualizarContadorHeader();
    this._renderizar();
  }
 
  actualizarContadorHeader(){
    const contador = this._obtenerElementoContadorHeader();
    if(!contador) return;
 
    const carrito = this.obtenerCarrito();
    const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalUnidades;
  }
 
  abrir(){
    this._renderizar();
    this._el.drawer.classList.add('show');
    this._el.overlay.classList.add('show');
  }
 
  cerrar(){
    this._el.drawer.classList.remove('show');
    this._el.overlay.classList.remove('show');
  }
 
  mostrarToast(mensaje){
    this._el.toastTexto.textContent = mensaje;
    this._el.toast.classList.add('show');
    clearTimeout(this._temporizadorToast);
    this._temporizadorToast = setTimeout(() => {
      this._el.toast.classList.remove('show');
    }, 2200);
  }
 
  /* Render interno */
 
  _renderizar(){
    const carrito = this.obtenerCarrito();
 
    if(carrito.length === 0){
      this._el.lista.innerHTML = `<p class="vacio">Tu carrito está vacío</p>`;
    } else {
      this._el.lista.innerHTML = carrito.map(item => `
        <div class="item" data-id="${item.id}">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div>
            <p class="item-nombre">${item.nombre}</p>
            <p class="item-precio">${this._formatearPrecio(item.precio)}</p>
            <div class="item-qty">
              <button type="button" class="restar" data-id="${item.id}" aria-label="Restar">−</button>
              <span>${item.cantidad}</span>
              <button type="button" class="sumar" data-id="${item.id}" aria-label="Sumar">+</button>
            </div>
          </div>
          <button type="button" class="eliminar" data-id="${item.id}" aria-label="Eliminar producto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
          </button>
        </div>
      `).join('');
 
      this._el.lista.querySelectorAll('.sumar').forEach(btn => {
        btn.addEventListener('click', () => this.cambiarCantidad(Number(btn.dataset.id), 1));
      });
      this._el.lista.querySelectorAll('.restar').forEach(btn => {
        btn.addEventListener('click', () => this.cambiarCantidad(Number(btn.dataset.id), -1));
      });
      this._el.lista.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', () => this.eliminar(Number(btn.dataset.id)));
      });
    }
 
    const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    this._el.total.textContent = this._formatearPrecio(total);
  }
}
 
customElements.define('carrito-drawer', CarritoDrawer);
 

 
window.agregarAlCarrito = function(producto, cantidad = 1){
  const carritoDrawer = document.querySelector('carrito-drawer');
  if(carritoDrawer) carritoDrawer.agregar(producto, cantidad);
};
 
window.abrirCarrito = function(){
  const carritoDrawer = document.querySelector('carrito-drawer');
  if(carritoDrawer) carritoDrawer.abrir();
};
 
window.mostrarToastCarrito = function(mensaje){
  const carritoDrawer = document.querySelector('carrito-drawer');
  if(carritoDrawer) carritoDrawer.mostrarToast(mensaje);
};