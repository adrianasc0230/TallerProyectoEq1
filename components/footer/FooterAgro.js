class FooterAgro extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const linkCSS = document.createElement("link");
    linkCSS.setAttribute("rel", "stylesheet");
    linkCSS.setAttribute("href", "\\components\\footer\\footer-agro.css");

    const linkIcons = document.createElement("link");
    linkIcons.setAttribute("rel", "stylesheet");
    linkIcons.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    );

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-logo">
            <img src="/img/logoverticalletras blancas.png" alt="Agroanima Logo Vertical" />
            <div class="footer-social">
              <a href="urlface"><i class="fab fa-facebook-f"></i></a>
              <a href="urlinsta"><i class="fab fa-instagram"></i></a>
              <a href="urlyt"><i class="fab fa-youtube"></i></a>
              <a href="urltwi"><i class="fab fa-twitter"></i></a>
            </div>
          </div>

          <div class="footer-section">
            <h3>Categorías</h3>
            <ul>
              <li><a>Nutrición Animal</a></li>
              <li><a>Salud y Bienestar</a></li>
              <li><a>Equipos Agrícolas</a></li>
              <li><a>Semillas y Fertilizantes</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Compañía</h3>
            <ul>
              <li><a>Sobre Nosotros</a></li>
              <li><a>Contacto</a></li>
              <li><a>Blog</a></li>
              <li><a>Sostenibilidad</a></li>
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
  }
}

customElements.define("footer-agro", FooterAgro);
