const API_URL = "https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos";

let productos = [];

const estado = {
  texto: "",
  categorias: new Set(),
  soloDisponibles: false,
  precioMin: 0,
  precioMax: Infinity,
  paginaActual: 1,
  porPagina: 3,
};

const gridProductos = document.getElementById("gridProductos");
const paginacionEl = document.getElementById("paginacion");
const inputBuscar = document.getElementById("inputBuscar");
const filtroCategorias = document.getElementById("filtroCategorias");

function inicializarFiltros() {
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))];

  filtroCategorias.innerHTML = categoriasUnicas
    .map((cat) => {
      const cantidad = productos.filter((p) => p.categoria === cat).length;
      return `
      <li>
        <label>
          <input type="checkbox" data-tipo="categoria" value="${cat}">
          ${cat}
          <span class="filtro-contador">(${cantidad})</span>
        </label>
      </li>`;
    })
    .join("");
}

function obtenerProductosFiltrados() {
  return productos.filter((p) => {
    const coincideTexto = p.nombre
      .toLowerCase()
      .includes(estado.texto.toLowerCase()) || p.categoria
      .toLowerCase()
      .includes(estado.texto.toLowerCase()) ;
    const coincideCategoria =
      estado.categorias.size === 0 || estado.categorias.has(p.categoria);
    const coincidePrecio =
      p.precio >= estado.precioMin && p.precio <= estado.precioMax;
    return (
      coincideTexto &&
      coincideCategoria &&
      coincidePrecio
    );
  });
}

function crearEstrellas(calificacionRating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= calificacionRating) {
      html += "★";
    } else {
      html += `<span class="vacia">★</span>`;
    }
  }
  return html;
}

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CO") + " COP";
}

function renderProductos() {
  const filtrados = obtenerProductosFiltrados();

  if (filtrados.length === 0) {
    gridProductos.innerHTML = `<p class="sin-resultados">No encontramos productos con esos filtros.</p>`;
    paginacionEl.innerHTML = "";
  } else {
    const totalPaginas = Math.max(
      1,
      Math.ceil(filtrados.length / estado.porPagina),
    );
    if (estado.paginaActual > totalPaginas) {
      estado.paginaActual = totalPaginas;
    }

    const pocisionProductoInicial =
      (estado.paginaActual - 1) * estado.porPagina;
    const productosPaginaActual = filtrados.slice(
      pocisionProductoInicial,
      pocisionProductoInicial + estado.porPagina,
    );
    gridProductos.innerHTML = productosPaginaActual
      .map(
        (p) => `
      <article class="producto-card">
        <img class="producto-imagen" src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <div class="producto-info">
          <span class="producto-categoria">${p.categoria}</span>
          <h3 class="producto-nombre">${p.nombre}</h3>
          <div class="producto-rating">${crearEstrellas(p.calificacion)}</div>
          <div class="producto-footer">
            <span class="producto-precio">${formatearPrecio(p.precio)}</span>
            <button class="producto-agregar" data-id="${p.id}" aria-label="Agregar al carrito" ${p.disponible ? "" : "disabled"}>
              ${p.disponible ? "+" : "Agotado"}
            </button>
          </div>
        </div>
      </article>
    `,
      )
      .join("");
    renderPaginacion(totalPaginas);
  }
}

function renderPaginacion(totalPaginas) {
  let html = `<button ${estado.paginaActual === 1 ? "disabled" : ""} data-pagina="anterior">Anterior</button>`;

  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="${i === estado.paginaActual ? "activo" : ""}" data-pagina="${i}">${i}</button>`;
  }

  html += `<button ${estado.paginaActual === totalPaginas ? "disabled" : ""} data-pagina="siguiente">Siguiente</button>`;
  paginacionEl.innerHTML = html;
}

inputBuscar.addEventListener("input", (e) => {
  estado.texto = e.target.value;
  estado.paginaActual = 1;
  renderProductos();
});

document.querySelector(".filtros").addEventListener("change", (e) => {
  const el = e.target;

  if (el.dataset.tipo === "categoria") {
    if (el.checked) {
      estado.categorias.add(el.value);
    } else {
      estado.categorias.delete(el.value);
    }
  }

  if (el.name === "precio") {
    if (!el.value) {
      estado.precioMin = 0;
      estado.precioMax = Infinity;
    } else {
      const [min, max] = el.value.split("-").map(Number);
      estado.precioMin = min;
      estado.precioMax = max;
    }
  }

  estado.paginaActual = 1;
  renderProductos();
});

paginacionEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || btn.disabled) {
    return;
  }

  const valor = btn.dataset.pagina;
  const totalPaginas = Math.max(
    1,
    Math.ceil(obtenerProductosFiltrados().length / estado.porPagina),
  );

  if (valor === "anterior") {
    estado.paginaActual = Math.max(1, estado.paginaActual - 1);
  } else if (valor === "siguiente") {
    estado.paginaActual = Math.min(totalPaginas, estado.paginaActual + 1);
  } else {
    estado.paginaActual = Number(valor);
  }

  renderProductos();
});

gridProductos.addEventListener("click", (e) => {
  //redirección detalle producto
  window.location.href = "/pages/html/detalle.html";
});

async function cargarProductos() {
  gridProductos.innerHTML = `<p class="sin-resultados">Cargando productos...</p>`;
  paginacionEl.innerHTML = "";
  debugger;
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error("Respuesta no exitosa: " + respuesta.status);
    }
    productos = await respuesta.json();
    inicializarFiltros();
    renderProductos();
  } catch (err) {
    console.error("Error al cargar productos:", err);
    gridProductos.innerHTML = `<p class="sin-resultados">No pudimos cargar el catálogo. Intenta recargar la página.</p>`;
  }
}

function filtroURL() {

  const params = new URLSearchParams(window.location.search);

  const filtro = params.get("filter");

  if (filtro) {
    estado.texto = filtro;
    inputBuscar.value = filtro;
    console.log("buscador header:", filtro);
  } else {
    console.log("no hay filtro en la URL");
    
  }
}
filtroURL();
cargarProductos();
