class FooterAgro extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Detectar entorno en local o en github
    const BASE = location.hostname.includes("github.io")
      ? "/TallerProyectoEq1/"
      : "/";

    const linkCSS = document.createElement("link");
    linkCSS.setAttribute("rel", "stylesheet");
    linkCSS.setAttribute("href", BASE + "components/footer/footer-agro.css");

    const linkIcons = document.createElement("link");
    linkIcons.setAttribute("rel", "stylesheet");
    linkIcons.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    );

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <footer class="footer" id="sobre-mi">
        <div class="footer-container">
          <div class="footer-logo">
            <img src="${BASE}img/logoverticalletras blancas.png" alt="Agroanima Logo Vertical" />
            <div class="footer-social">
              <a id="facebook"><i class="fab fa-facebook-f"></i></a>
              <a id="instagram"><i class="fab fa-instagram"></i></a>
              <a id="youtube"><i class="fab fa-youtube"></i></a>
              <a id="twitter"><i class="fab fa-twitter"></i></a>
            </div>
          </div>

          <div class="footer-section">
            <h3>Categorías</h3>
            <ul>
              <li><a id="cat-nutricion">Nutrición Animal</a></li>
              <li><a id="cat-salud">Salud y Bienestar</a></li>
              <li><a id="cat-equipos">Equipos Agrícolas</a></li>
              <li><a id="cat-semillas">Semillas y Fertilizantes</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Compañía</h3>
            <ul>
              <li><a href="#">Sobre Nosotros</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Sostenibilidad</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Contacto</h3>
            <ul>
              <li><i class="fas fa-phone-alt"></i> +57 (312) 456-7890</li>
              <li><i class="fas fa-envelope"></i> contacto@agroanima.com</li>
              <li><i class="fas fa-map-marker-alt"></i> Bogotá, Colombia – Distribución Nacional</li>
            </ul>
          </div>
        </div>
      </footer>
    `;

    shadow.appendChild(linkCSS);
    shadow.appendChild(linkIcons);
    shadow.appendChild(wrapper);

    // Asignar href dinámicamente para github pages 
    wrapper.querySelector("#facebook").href = "https://facebook.com/agroanima";
    wrapper.querySelector("#instagram").href = "https://instagram.com/agroanima";
    wrapper.querySelector("#youtube").href = "https://youtube.com/agroanima";
    wrapper.querySelector("#twitter").href = "https://twitter.com/agroanima";

    wrapper.querySelector("#cat-nutricion").href =
      BASE + "pages/html/catalogo.html?filter=Nutrición%20Animal";
    wrapper.querySelector("#cat-salud").href =
      BASE + "pages/html/catalogo.html?filter=Salud%20y%20Bienestar";
    wrapper.querySelector("#cat-equipos").href =
      BASE + "pages/html/catalogo.html?filter=Equipos%20Agrícolas";
    wrapper.querySelector("#cat-semillas").href =
      BASE + "pages/html/catalogo.html?filter=Semillas%20y%20Fertilizantes";
  }
}

customElements.define("footer-agro", FooterAgro);