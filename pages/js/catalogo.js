const API_URL = "https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos";

let productos = [];


const estado = {
  texto: "",
  categorias: new Set(),   // varias categorías pueden estar activas a la vez
  soloDisponibles: false,
  precioMin: 0,
  precioMax: Infinity,
  paginaActual: 1,
  porPagina: 6,
  cargando: true,
  error: null,
};

const carrito = [];


const gridProductos   = document.getElementById("gridProductos");
const paginacionEl    = document.getElementById("paginacion");
const inputBuscar     = document.getElementById("inputBuscar");
const filtroCategorias = document.getElementById("filtroCategorias");
const carritoContador   = document.getElementById("carritoContador");


function inicializarFiltros() {
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

  filtroCategorias.innerHTML = categoriasUnicas.map(cat => {
    const cantidad = productos.filter(p => p.categoria === cat).length;
    return `
      <li>
        <label>
          <input type="checkbox" data-tipo="categoria" value="${cat}">
          ${cat}
          <span class="filtro-contador">(${cantidad})</span>
        </label>
      </li>`;
  }).join("");
}


function obtenerProductosFiltrados() {
  return productos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(estado.texto.toLowerCase());
    const coincideCategoria = estado.categorias.size === 0 || estado.categorias.has(p.categoria);
    const coincideDisponibilidad = !estado.soloDisponibles || p.disponible;
    const coincidePrecio = p.precio >= estado.precioMin && p.precio <= estado.precioMax;
    return coincideTexto && coincideCategoria && coincideDisponibilidad && coincidePrecio;
  });
}


function crearEstrellas(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? "★" : `<span class="vacia">★</span>`;
  }
  return html;
}

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CO") + " COP";
}

function renderProductos() {
  // Estado de carga
  if (estado.cargando) {
    gridProductos.innerHTML = `<p class="sin-resultados">Cargando productos...</p>`;
    paginacionEl.innerHTML = "";
    return;
  }

  // Estado de error
  if (estado.error) {
    gridProductos.innerHTML = `<p class="sin-resultados">No pudimos cargar el catálogo. Intenta recargar la página.</p>`;
    paginacionEl.innerHTML = "";
    return;
  }

  const filtrados = obtenerProductosFiltrados();

  // paginación sobre el resultado ya filtrado
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / estado.porPagina));
  if (estado.paginaActual > totalPaginas) estado.paginaActual = totalPaginas;

  const inicio = (estado.paginaActual - 1) * estado.porPagina;
  const pagina = filtrados.slice(inicio, inicio + estado.porPagina);

  if (pagina.length === 0) {
    gridProductos.innerHTML = `<p class="sin-resultados">No encontramos productos con esos filtros.</p>`;
  } else {
    gridProductos.innerHTML = pagina.map(p => `
      <article class="producto-card">
        <img class="producto-imagen" src="${p.imagen}" alt="${p.nombre}" loading="lazy">
        <div class="producto-info">
          <span class="producto-categoria">${p.categoria}</span>
          <h3 class="producto-nombre">${p.nombre}</h3>
          <div class="producto-rating">${crearEstrellas(p.calificacion)}</div>
          <div class="producto-footer">
            <span class="producto-precio">${formatearPrecio(p.precio)}</span>
            <button class="producto-agregar" data-id="${p.id}" aria-label="Agregar al carrito" ${p.disponible ? "" : "disabled"}>
              ${p.disponible ? "🛒" : "Agotado"}
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  renderPaginacion(totalPaginas);
}


function renderPaginacion(totalPaginas) {
  let html = `<button ${estado.paginaActual === 1 ? "disabled" : ""} data-pagina="anterior">Anterior</button>`;

  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="${i === estado.paginaActual ? "activo" : ""}" data-pagina="${i}">${i}</button>`;
  }

  html += `<button ${estado.paginaActual === totalPaginas ? "disabled" : ""} data-pagina="siguiente">Siguiente</button>`;
  paginacionEl.innerHTML = html;
}



// Buscador de texto
inputBuscar.addEventListener("input", (e) => {
  estado.texto = e.target.value;
  estado.paginaActual = 1;
  renderProductos();
});

// Checkboxes de categoría y marca
document.querySelector(".filtros").addEventListener("change", (e) => {
  const el = e.target;

  if (el.dataset.tipo === "categoria") {
    el.checked ? estado.categorias.add(el.value) : estado.categorias.delete(el.value);
  }

  if (el.id === "checkDisponibles") {
    estado.soloDisponibles = el.checked;
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

// Clicks en la paginación (delegación de eventos)
paginacionEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || btn.disabled) return;

  const valor = btn.dataset.pagina;
  const totalPaginas = Math.max(1, Math.ceil(obtenerProductosFiltrados().length / estado.porPagina));

  if (valor === "anterior") estado.paginaActual = Math.max(1, estado.paginaActual - 1);
  else if (valor === "siguiente") estado.paginaActual = Math.min(totalPaginas, estado.paginaActual + 1);
  else estado.paginaActual = Number(valor);

  renderProductos();
  gridProductos.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Clicks en "agregar al carrito" (delegación de eventos, porque las tarjetas se recrean)
gridProductos.addEventListener("click", (e) => {
  const btn = e.target.closest(".producto-agregar");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  actualizarContadorCarrito();
});

function actualizarContadorCarrito() {
  carritoContador.textContent = carrito.length;
}


async function cargarProductos() {
  estado.cargando = true;
  renderProductos();

  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error("Respuesta no exitosa: " + respuesta.status);

    productos = await respuesta.json();
    estado.cargando = false;
    estado.error = null;

    inicializarFiltros();
    renderProductos();
  } catch (err) {
    console.error("Error al cargar productos:", err);
    estado.cargando = false;
    estado.error = err;
    renderProductos();
  }
}


cargarProductos();
actualizarContadorCarrito();