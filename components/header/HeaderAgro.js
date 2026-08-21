class HeaderAgro extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Detectar entorno local o github
    const BASE = location.hostname.includes("github.io")
      ? "/TallerProyectoEq1/"
      : "/";

    const linkCSS = document.createElement("link");
    linkCSS.setAttribute("rel", "stylesheet");
    linkCSS.setAttribute("href", BASE + "index.css");

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
              <a id="perfil" class="perfil-parcero" aria-label="Perfil de usuario">
                <i class="icono-compita"></i>
              </a>
              <span class="plata-lucas">COP</span>
            </div>
          </div>
        </div>

        <nav class="brujula-principal">
          <div class="contenedor-fino">
            <div class="sello-grafico">
              <a id="logo">
                <img src="${BASE}img/logohorizontalletrasazules.png" alt="Logo de AgroAnima Colombia">
              </a>
            </div>

            <ul class="rutas-del-parche">
              <li><a id="inicio">Inicio</a></li>
              <li><a id="catalogo">Catálogo</a></li>
              <li><a id="contacto" href="#footer-contacto">Contacto</a></li>
            </ul>

            <div class="movidas-rapidas">
              <a id="login" class="enlace-pilo" aria-label="Iniciar sesión">
                <i class='bx bx-user'></i>
              </a>
              <a id="carrito" class="el-canasto" aria-label="Ver carrito">
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

    wrapper.querySelector("#perfil").href = BASE + "perfil";
    wrapper.querySelector("#logo").href = BASE;
    wrapper.querySelector("#inicio").href = BASE;
    wrapper.querySelector("#catalogo").href = BASE + "pages/html/catalogo.html";
    wrapper.querySelector("#login").href = BASE + "pages/html/login.html";
    wrapper.querySelector("#carrito").href = BASE + "carrito";

    const paginaActiva = this.getAttribute("pagina");
    const links = wrapper.querySelectorAll(".rutas-del-parche a");
    links.forEach((link) => {
      link.classList.remove("la-propia");
      if (link.id === paginaActiva) {
        link.classList.add("la-propia");
      }
    });

    // Buscador con base dinámica para github y que funcione en local tambien las rutas
    const formularioBuscador = wrapper.querySelector("#formulario-cazador");
    const campoBusqueda = wrapper.querySelector("#campo-busqueda");

    formularioBuscador.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const loQueBusco = campoBusqueda.value.trim();
      if (loQueBusco !== "") {
        window.location.href =
          BASE + `pages/html/catalogo.html?filter=${encodeURIComponent(loQueBusco)}`;
      } else {
        console.log("El compa no escribió nada para buscar.");
      }
    });
  }
}

customElements.define("header-agro", HeaderAgro);