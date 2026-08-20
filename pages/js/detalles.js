const API_URL = 'https://6a7d0561f8b2ed99ca4dc907.mockapi.io/productos';
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ---------- Estado ---------- */
  let allProducts = []; // todos los productos de la API
 
  /* ---------- Referencias al DOM (todas dentro de <main>) ---------- */
  const els = {
    rutaActual: document.getElementById('rutaActual'),
    mainImage:  document.getElementById('mainImage'),
    thumbs:     document.getElementById('thumbs'),
    eyebrow:    document.getElementById('pEyebrow'),
    title:      document.getElementById('pTitle'),
    stars:      document.getElementById('pStars'),
    reviewCount:document.getElementById('pReviewCount'),
    price:      document.getElementById('pPrice'),
    desc:       document.getElementById('pDesc'),
    specsTable: document.getElementById('specsTable'),
    relatedGrid:document.getElementById('relatedGrid'),
  };
 
  const STAR_PATH = 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2z';
 
  /* ---------- Utilidades ---------- */
 
  function formatPrice(value, moneda){
    const formatted = Number(value).toLocaleString('es-CO');
    return `$${formatted} ${moneda || 'COP'}`;
  }
 
  function starsSVG(count, size = 15){
    let html = '';
    for(let i = 0; i < 5; i++){
      const filled = i < count;
      html += filled
        ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor"><path d="${STAR_PATH}"/></svg>`
        : `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5"><path d="${STAR_PATH}"/></svg>`;
    }
    return html;
  }
 
  /* ---------- Carga de datos desde la API ---------- */
 
  async function fetchProducts(){
    const response = await fetch(API_URL);
    if(!response.ok){
      throw new Error(`Error ${response.status} al consultar la API`);
    }
    return response.json();
  }
 
  async function init(){
    try {
      allProducts = await fetchProducts();
 
      // Producto principal: buscamos el suplemento lechero; si no existe, usamos el primero disponible
      const featured = allProducts.find(p => p.nombre.toLowerCase().includes('lechero'))
        || allProducts[0];
 
      if(!featured){
        throw new Error('No hay productos disponibles en la API');
      }
 
      renderMainProduct(featured);
      renderRelatedProducts(featured);
 
    } catch (err){
      console.error(err);
      els.title.textContent = 'No se pudo cargar el producto';
      els.desc.textContent = 'Ocurrió un problema al conectar con la API. Intenta recargar la página.';
      els.eyebrow.textContent = 'Error';
      els.price.textContent = '—';
    }
  }
 
  /* ---------- Render: producto principal ---------- */
 
  function renderMainProduct(product){
    document.title = `${product.nombre} | Agroanima`;
    els.rutaActual.textContent = product.nombre;
 
    els.eyebrow.textContent = product.categoria;
    els.title.textContent = product.nombre;
    els.desc.textContent = product.descripcion;
    els.price.textContent = formatPrice(product.precio, product.moneda);
 
    els.stars.innerHTML = starsSVG(product.calificacion, 15);
    els.reviewCount.textContent = `(${product.numeroResenas} valoraciones de clientes)`;
 
    els.mainImage.src = product.imagen;
    els.mainImage.alt = product.nombre;
 
    renderSpecs(product);
    renderThumbs(product);
  }
 
  function renderSpecs(product){
    const rows = [
      { label: 'Categoría',        value: product.categoria },
      { label: 'Precio',           value: formatPrice(product.precio, product.moneda) },
      { label: 'Calificación',     value: `${product.calificacion} / 5` },
      { label: 'Stock disponible', value: `${product.stock} unidades` },
      { label: 'Disponibilidad',   value: product.disponible ? 'Disponible' : 'Agotado' },
    ];
 
    els.specsTable.innerHTML = rows.map(row => `
      <div class="specs-row">
        <div class="label">${row.label}</div>
        <div class="value">${row.value}</div>
      </div>
    `).join('');
  }
 
  function renderThumbs(product){
    // Usamos el producto actual + otros productos de la misma categoría como miniaturas navegables
    const sameCategory = allProducts.filter(p => p.categoria === product.categoria && p.id !== product.id);
    const gallery = [product, ...sameCategory].slice(0, 4);
 
    els.thumbs.innerHTML = gallery.map(p => `
      <div class="thumb ${p.id === product.id ? 'active' : ''}" data-id="${p.id}" title="${p.nombre}">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
    `).join('');
 
    els.thumbs.querySelectorAll('.thumb').forEach(thumbEl => {
      thumbEl.addEventListener('click', () => {
        const id = Number(thumbEl.dataset.id);
        const selected = allProducts.find(p => p.id === id);
        if(selected){
          renderMainProduct(selected);
          renderRelatedProducts(selected);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
 
  /* ---------- Render: productos relacionados ---------- */
 
  function renderRelatedProducts(product){
    const related = allProducts
      .filter(p => p.categoria === product.categoria && p.id !== product.id)
      .slice(0, 3);
 
    // si no hay suficientes de la misma categoría, completamos con otros productos
    if(related.length < 3){
      const extra = allProducts
        .filter(p => p.id !== product.id && !related.includes(p))
        .slice(0, 3 - related.length);
      related.push(...extra);
    }
 
    els.relatedGrid.innerHTML = related.map(p => `
      <div class="card" data-id="${p.id}">
        <div class="card-img"><img src="${p.imagen}" alt="${p.nombre}"></div>
        <div class="card-body">
          <div class="card-eyebrow">${p.categoria}</div>
          <div class="card-title">${p.nombre}</div>
          <div class="card-stars">
            <span class="stars">${starsSVG(p.calificacion, 12)}</span>
            <span class="count">(${p.numeroResenas})</span>
          </div>
          <div class="card-foot">
            <span class="card-price">${formatPrice(p.precio, p.moneda)}</span>
          </div>
        </div>
      </div>
    `).join('');
 
    // Clic en la tarjeta
    els.relatedGrid.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.id);
        const selected = allProducts.find(p => p.id === id);
        if(selected){
          renderMainProduct(selected);
          renderRelatedProducts(selected);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
 
  /* ---------- Arranque ---------- */
  init();
 
});