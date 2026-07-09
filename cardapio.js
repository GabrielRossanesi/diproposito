document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '5511968662940';
  const CART_KEY = 'dp_cart';
  const items = (typeof MENU_ITEMS !== 'undefined') ? MENU_ITEMS : [];
  const itemById = Object.fromEntries(items.map(i => [i.id, i]));

  /* -------------------------------------------------------------
     HEADER ON SCROLL
  ------------------------------------------------------------- */
  const header = document.getElementById('main-header');
  const handleScrollHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader();

  /* -------------------------------------------------------------
     MOBILE MENU & OVERLAY
  ------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuOverlay = document.getElementById('menu-overlay');

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  menuToggle.addEventListener('click', () => {
    const willOpen = !mobileDrawer.classList.contains('open');
    menuToggle.classList.toggle('open', willOpen);
    mobileDrawer.classList.toggle('open', willOpen);
    menuOverlay.classList.toggle('open', willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
  });
  menuOverlay.addEventListener('click', closeMenu);
  mobileDrawer.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));

  /* -------------------------------------------------------------
     CART STATE (persistido em localStorage)
  ------------------------------------------------------------- */
  const loadCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY)) || {};
      const clean = {};
      // Mantém apenas ids válidos e quantidades positivas
      Object.keys(raw).forEach(id => {
        const q = parseInt(raw[id], 10);
        if (itemById[id] && q > 0) clean[id] = q;
      });
      return clean;
    } catch (e) {
      return {};
    }
  };

  let cart = loadCart();
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

  const setQty = (id, qty) => {
    if (!itemById[id]) return;
    if (qty <= 0) {
      delete cart[id];
    } else {
      cart[id] = qty;
    }
    saveCart();
    syncUI();
  };
  const inc = (id) => setQty(id, (cart[id] || 0) + 1);
  const dec = (id) => setQty(id, (cart[id] || 0) - 1);

  /* -------------------------------------------------------------
     RENDER DA LISTA DE ITENS
  ------------------------------------------------------------- */
  const menuList = document.getElementById('menu-list');
  const filterBtns = document.querySelectorAll('#cardapio-filters .filter-btn');
  let currentCategory = 'Todos';
  let activeItems = [];

  const controlHTML = (id) => {
    const qty = cart[id] || 0;
    if (qty > 0) {
      return `
        <div class="stepper" data-control="${id}">
          <button type="button" class="stepper-btn" data-dec="${id}" aria-label="Remover um">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="stepper-qty">${qty}</span>
          <button type="button" class="stepper-btn" data-inc="${id}" aria-label="Adicionar um">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>`;
    }
    return `
      <div class="stepper stepper--empty" data-control="${id}">
        <button type="button" class="add-btn" data-add="${id}">
          <i class="fa-solid fa-plus"></i> Adicionar
        </button>
      </div>`;
  };

  const renderMenu = () => {
    activeItems = items.filter(i => currentCategory === 'Todos' || i.category === currentCategory);
    let html = '';
    activeItems.forEach((item, index) => {
      const badge = item.badge ? `<span class="menu-row-badge">${item.badge}</span>` : '';
      html += `
        <div class="menu-row" data-index="${index}">
          <div class="menu-row-info">
            <h3 class="menu-row-title">${item.name}</h3>
            <p class="menu-row-desc">${item.description}</p>
            <div class="menu-row-actions" data-control-wrap="${item.id}">
              <button type="button" class="menu-row-photo" data-photo="${index}">
                <i class="fa-solid fa-magnifying-glass-plus"></i> Ver foto
              </button>
              ${controlHTML(item.id)}
            </div>
          </div>
          <button type="button" class="menu-row-thumb" data-photo="${index}" aria-label="Ampliar foto de ${item.name}">
            ${badge}
            <img src="${item.image}" alt="${item.name} do Di Propósito" loading="lazy" width="104" height="104">
          </button>
        </div>`;
    });
    menuList.innerHTML = html;
  };

  /* -------------------------------------------------------------
     SINCRONIZAÇÃO DE UI (steppers, barra e sheet)
  ------------------------------------------------------------- */
  const refreshControls = () => {
    document.querySelectorAll('[data-control-wrap]').forEach(wrap => {
      const id = wrap.getAttribute('data-control-wrap');
      const control = wrap.querySelector('[data-control]');
      if (control) control.outerHTML = controlHTML(id);
    });
    if (lightboxIndex > -1) renderLightboxControl();
  };

  const syncUI = () => {
    refreshControls();
    updateCartBar();
    if (cartSheet.classList.contains('active')) renderCart();
  };

  // Delegação de eventos na lista: foto ou stepper
  menuList.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const incBtn = e.target.closest('[data-inc]');
    const decBtn = e.target.closest('[data-dec]');
    const photo = e.target.closest('[data-photo]');
    if (add) { inc(add.getAttribute('data-add')); return; }
    if (incBtn) { inc(incBtn.getAttribute('data-inc')); return; }
    if (decBtn) { dec(decBtn.getAttribute('data-dec')); return; }
    if (photo) { openLightbox(parseInt(photo.getAttribute('data-photo'), 10)); }
  });

  // Filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      if (cat === currentCategory) return;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = cat;
      renderMenu();
    });
  });

  /* -------------------------------------------------------------
     BARRA FLUTUANTE DO CARRINHO
  ------------------------------------------------------------- */
  const cartBar = document.getElementById('cart-bar');
  const cartBarCount = document.getElementById('cart-bar-count');

  const updateCartBar = () => {
    const n = cartCount();
    if (n > 0) {
      cartBar.hidden = false;
      cartBarCount.textContent = n;
      document.body.classList.add('has-cart-bar');
    } else {
      cartBar.hidden = true;
      document.body.classList.remove('has-cart-bar');
    }
  };

  cartBar.addEventListener('click', openCart);

  /* -------------------------------------------------------------
     SHEET DO PEDIDO
  ------------------------------------------------------------- */
  const cartSheet = document.getElementById('cart-sheet');
  const cartItemsBox = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartOrderBox = document.getElementById('cart-order-box');
  const cartError = document.getElementById('cart-error');
  const fieldsDelivery = document.getElementById('fields-delivery');
  const fieldsMesa = document.getElementById('fields-mesa');
  const orderToggle = document.getElementById('order-type-toggle');
  let orderMode = 'delivery';

  const renderCart = () => {
    const lines = items.filter(i => cart[i.id] > 0);
    if (lines.length === 0) {
      cartEmpty.hidden = false;
      cartItemsBox.innerHTML = '';
      cartOrderBox.hidden = true;
      return;
    }
    cartEmpty.hidden = true;
    cartOrderBox.hidden = false;
    cartItemsBox.innerHTML = lines.map(i => `
      <div class="cart-line">
        <span class="cart-line-name">${i.name}</span>
        <div class="stepper" data-control="${i.id}">
          <button type="button" class="stepper-btn" data-dec="${i.id}" aria-label="Remover um">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="stepper-qty">${cart[i.id]}</span>
          <button type="button" class="stepper-btn" data-inc="${i.id}" aria-label="Adicionar um">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>`).join('');
  };

  cartItemsBox.addEventListener('click', (e) => {
    const incBtn = e.target.closest('[data-inc]');
    const decBtn = e.target.closest('[data-dec]');
    if (incBtn) inc(incBtn.getAttribute('data-inc'));
    else if (decBtn) dec(decBtn.getAttribute('data-dec'));
  });

  function openCart() {
    renderCart();
    cartSheet.classList.add('active');
    cartSheet.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  const closeCart = () => {
    cartSheet.classList.remove('active');
    cartSheet.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartError.hidden = true;
  };

  document.getElementById('cart-close').addEventListener('click', closeCart);
  cartSheet.addEventListener('click', (e) => { if (e.target === cartSheet) closeCart(); });

  document.getElementById('cart-clear').addEventListener('click', () => {
    cart = {};
    saveCart();
    syncUI();
  });

  // Alternância Delivery / Mesa
  orderToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.order-type-btn');
    if (!btn) return;
    orderMode = btn.getAttribute('data-mode');
    orderToggle.querySelectorAll('.order-type-btn').forEach(b => b.classList.toggle('active', b === btn));
    fieldsDelivery.hidden = orderMode !== 'delivery';
    fieldsMesa.hidden = orderMode !== 'mesa';
    cartError.hidden = true;
  });

  const showError = (msg) => {
    cartError.textContent = msg;
    cartError.hidden = false;
  };

  document.getElementById('cart-send').addEventListener('click', () => {
    const lines = items.filter(i => cart[i.id] > 0);
    if (lines.length === 0) { showError('Adicione ao menos um item ao pedido.'); return; }

    let extra = '';
    if (orderMode === 'delivery') {
      const nome = document.getElementById('field-nome').value.trim();
      const endereco = document.getElementById('field-endereco').value.trim();
      if (!nome) { showError('Informe seu nome para a entrega.'); return; }
      if (!endereco) { showError('Informe o endereço de entrega.'); return; }
      extra = `*Tipo:* Delivery\n*Nome:* ${nome}\n*Endereço:* ${endereco}`;
    } else {
      const mesa = document.getElementById('field-mesa').value.trim();
      if (!mesa) { showError('Informe o número da mesa.'); return; }
      extra = `*Tipo:* Consumo no local\n*Mesa:* ${mesa}`;
    }

    const itemLines = lines.map(i => `${cart[i.id]}x ${i.name}`).join('\n');
    const msg = `*Novo pedido — Di Propósito Gastrobar*\n\n${itemLines}\n\n${extra}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  /* -------------------------------------------------------------
     LIGHTBOX (foto do item) + adicionar ao pedido
  ------------------------------------------------------------- */
  const lightbox = document.getElementById('cardapio-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbBadge = document.getElementById('lightbox-badge');
  const lbControl = document.getElementById('lightbox-cart-control');
  let lightboxIndex = -1;

  const renderLightboxControl = () => {
    if (lightboxIndex < 0) return;
    const item = activeItems[lightboxIndex];
    if (!item) return;
    lbControl.innerHTML = controlHTML(item.id);
  };

  function openLightbox(index) {
    if (index < 0 || index >= activeItems.length) return;
    lightboxIndex = index;
    const item = activeItems[index];
    lbImg.src = item.image;
    lbImg.alt = `${item.name} do Di Propósito — foto ampliada`;
    lbTitle.textContent = item.name;
    lbDesc.textContent = item.description;
    if (item.badge) {
      lbBadge.textContent = item.badge;
      lbBadge.classList.add('show');
    } else {
      lbBadge.textContent = '';
      lbBadge.classList.remove('show');
    }
    renderLightboxControl();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    if (!cartSheet.classList.contains('active')) document.body.style.overflow = 'hidden';
  }
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxIndex = -1;
    if (!cartSheet.classList.contains('active')) document.body.style.overflow = '';
  };
  const showNext = () => { if (activeItems.length > 1) openLightbox((lightboxIndex + 1) % activeItems.length); };
  const showPrev = () => { if (activeItems.length > 1) openLightbox((lightboxIndex - 1 + activeItems.length) % activeItems.length); };

  lbControl.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    const incBtn = e.target.closest('[data-inc]');
    const decBtn = e.target.closest('[data-dec]');
    if (add) inc(add.getAttribute('data-add'));
    else if (incBtn) inc(incBtn.getAttribute('data-inc'));
    else if (decBtn) dec(decBtn.getAttribute('data-dec'));
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', showNext);
  document.getElementById('lightbox-prev').addEventListener('click', showPrev);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (cartSheet.classList.contains('active') && e.key === 'Escape') { closeCart(); return; }
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });

  /* -------------------------------------------------------------
     INIT
  ------------------------------------------------------------- */
  renderMenu();
  updateCartBar();
});
