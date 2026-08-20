class HeaderAgro extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const linkCSS = document.createElement("link");
    linkCSS.setAttribute("rel", "stylesheet");
    linkCSS.setAttribute("href", "/index.css");

    const linkIcons = document.createElement("link");
    linkIcons.setAttribute("rel", "stylesheet");
    linkIcons.setAttribute(
      "href",
      "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    );

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <header class="techo-del-rancho">

        <div class="cinta-cazadora">
          <div class="contenedor-tinto">
            <form class="buscador-avispado" id="formulario-cazador">
              <i class="icono-lupa-firme"></i>
              <input type="text" id="campo-busqueda" name="q" placeholder="Buscar productos..." aria-label="Buscar productos">
            </form>

            <div class="opciones-de-una">
              <a href="/perfil" class="perfil-parcero" aria-label="Perfil de usuario">
                <i class="icono-compita"></i>
              </a>
              <span class="plata-lucas">COP</span>
            </div>
          </div>
        </div>

        <nav class="brujula-principal">
          <div class="contenedor-fino">

            <div class="sello-grafico">
              <a href="/">
                <img src="/img/logohorizontalletrasazules.png" alt="Logo de AgroAnima Colombia">
              </a>
            </div>

            <ul class="rutas-del-parche">
              <li><a id="inicio" href="/">Inicio</a></li>
              <li><a id="catalogo" href="/pages/html/catalogo.html">Catálogo</a></li>
              
              <li><a id="contacto" href="#footer-contacto">Contacto</a></li>
            </ul>

            <div class="movidas-rapidas">
              <a href="/pages/html/login.html" class="enlace-pilo" aria-label="Iniciar sesión">
                <i class='bx bx-user'></i>
              </a>
              <a href="/carrito" class="el-canasto" aria-label="Ver carrito">
                <i class='bx bx-cart'></i>
                <span class="notificacion-campanazo">0</span>
              </a>
            </div>

          </div>
        </nav>
      </header>
    `;

    shadow.appendChild(linkCSS);
    shadow.appendChild(linkIcons);
    shadow.appendChild(wrapper);

    const paginaActiva = this.getAttribute("pagina"); 
    const links = wrapper.querySelectorAll(".rutas-del-parche a");

    links.forEach((link) => {
      link.classList.remove("la-propia");
      if (link.id === paginaActiva) {
        link.classList.add("la-propia");
      }
    });
  }
}

customElements.define("header-agro", HeaderAgro);