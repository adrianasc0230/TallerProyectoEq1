
const contenedorVitrina = document.getElementById('vitrina-dinamica');


const urlAPI = 'https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos';

async function cargarProductos() {
  
  try {
    
    const respuesta = await fetch(urlAPI);
    const productos = await respuesta.json();

    let htmlAcumulado = '';

     
    productos.slice(0, 6).forEach(producto => {
      
      htmlAcumulado += `
        <article class="tarjeta-articulo">
          <div class="zona-foto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
          </div>
          <div class="info-articulo">
            <span class="etiqueta-categoria">${producto.categoria}</span>
            <h3 class="nombre-producto">${producto.nombre}</h3>
            <div class="las-estrellitas">
              <i class='bx bxs-star'></i><i class='bx bxs-star'></i><i class='bx bxs-star'></i><i class='bx bxs-star'></i><i class='bx bxs-star'></i>
            </div>
            <p class="precio-firme">$${producto.precio} COP</p>
            <button class="boton-pa-la-bolsa">AÑADIR AL CARRITO <i class='bx bx-cart'></i></button>
          </div>
        </article>
      `;
    });

    
    contenedorVitrina.innerHTML = htmlAcumulado;

  } catch (error) {
    console.error("Hubo un chicharrón trayendo los datos: ", error);
    contenedorVitrina.innerHTML = `
      <p class="la-carreta-suave" style="grid-column: span 3; text-align: center;">
        Uy, tuvimos un problema cargando el catálogo. Por favor, recarga la página.
      </p>
    `;
  }
}
cargarProductos();



// LÓGICA DEL HEADER (El Techo del Rancho)


const techoPrincipal = document.getElementById('techo-principal');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { 
    techoPrincipal.classList.add('techo-con-sombra');
  } else {
    techoPrincipal.classList.remove('techo-con-sombra');
  }
});


const enlacesMenu = document.querySelectorAll('#menu-navegacion a');
const rutaActual = window.location.pathname;

enlacesMenu.forEach(enlace => { 
  enlace.classList.remove('la-propia'); 
  const hrefDelEnlace = enlace.getAttribute('href'); 
  if (rutaActual === hrefDelEnlace || (rutaActual === '/' && hrefDelEnlace === '/')) {   
    enlace.classList.add('la-propia');
  }
});


// LÓGICA DEL BUSCADOR 

const formularioBuscador = document.getElementById('formulario-cazador');
const campoBusqueda = document.getElementById('campo-busqueda');

formularioBuscador.addEventListener('submit', (evento) => {
   
  evento.preventDefault();

  const loQueBusco = campoBusqueda.value.trim();
  if (loQueBusco !== '') {  
    window.location.href = `/pages/html/catalogo.html?filter=${loQueBusco}`;  
  } else {
    console.log("El compa no escribió nada para buscar.");
  }
  
});