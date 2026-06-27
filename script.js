document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. FIXED HEADER ON SCROLL
  ------------------------------------------------------------- */
  const header = document.getElementById('main-header');
  
  const handleScrollHeader = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader(); // Executa inicial caso a página carregue no meio

  /* -------------------------------------------------------------
     2. MOBILE MENU & OVERLAY TOGGLE
  ------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileLinks = mobileDrawer.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    menuOverlay.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  };

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    mobileDrawer.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', closeMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* -------------------------------------------------------------
     3. ACTIVE NAVIGATION LINK ON SCROLL
  ------------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-menu .nav-link');

  const makeActiveNav = () => {
    let currentActiveId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Compensação da altura do header fixo
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveId = section.getAttribute('id');
      }
    });

    if (currentActiveId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', makeActiveNav);
  makeActiveNav();

  /* -------------------------------------------------------------
     4. REVEAL ANIMATIONS ON SCROLL (Intersection Observer)
  ------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez animado, não precisa observar novamente
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes do elemento entrar totalmente
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* -------------------------------------------------------------
     5. ENVIRONMENT IMAGE CAROUSEL (SLIDER)
  ------------------------------------------------------------- */
  const slider = document.getElementById('slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('slider-dots-container');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;

    // Gerar dots dinamicamente
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateSliderUI = () => {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    };

    const goToSlide = (index) => {
      currentSlide = index;
      // Tratar limites circulares
      if (currentSlide >= totalSlides) currentSlide = 0;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      updateSliderUI();
    };

    const nextSlide = () => {
      goToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      goToSlide(currentSlide - 1);
    };

    // Listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    // Autoplay
    const startAutoplay = () => {
      autoplayTimer = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    startAutoplay();

    // Suporte a gestos Swipe para Mobile
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const swipeDistance = startX - endX;
      
      if (swipeDistance > 50) {
        // Swipe Left -> Próximo
        nextSlide();
        resetAutoplay();
      } else if (swipeDistance < -50) {
        // Swipe Right -> Anterior
        prevSlide();
        resetAutoplay();
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------
     6. HERO SCROLL DOWN INDICATOR CLICK
  ------------------------------------------------------------- */
  const scrollIndicator = document.getElementById('scroll-to-about');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.getElementById('sobre');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* -------------------------------------------------------------
     7. DYNAMIC FOOD MENU
  ------------------------------------------------------------- */
  const menuItems = [
    {
      name: "Duplo Bacon",
      description: "Hambúrguer artesanal com dois blends suculentos, queijo derretido e muito bacon crocante.",
      image: "img/Food/optimized/duplo-bacon-2.jpg",
      category: "Lanches",
      badge: "Mais Pedido"
    },
    {
      name: "Espeto de Carne",
      description: "Espeto clássico de carne bovina selecionada, macia, suculenta e assada na brasa.",
      image: "img/Food/optimized/carne-2.jpg",
      category: "Espetos",
      badge: "Na Brasa"
    },
    {
      name: "Jantinha de Medalhão de Frango",
      description: "Espeto de medalhão de frango com bacon, servido com arroz, feijão tropeiro saboroso, vinagrete fresco e mandioca.",
      image: "img/Food/optimized/jantinha-medalhao-de-frango-2.jpg",
      category: "Jantinhas",
      badge: "Mais Completa"
    },
    {
      name: "Anéis de Cebola",
      description: "Porção super crocante, dourada por fora e macia por dentro. Perfeita para petiscar.",
      image: "img/Food/optimized/aneis-de-cebola-2.jpg",
      category: "Porções",
      badge: "Para Compartilhar"
    },
    {
      name: "Medalhão de Queijo",
      description: "Espeto de queijo coalho cremoso envolto em fatias crocantes de bacon na churrasqueira.",
      image: "img/Food/optimized/medalhao-de-queijo.jpg",
      category: "Espetos",
      badge: "Sucesso"
    },
    {
      name: "X-Tudo",
      description: "Lanche monstro completo com hambúrguer artesanal, ovo, bacon, queijo, presunto, alface, tomate e maionese.",
      image: "img/Food/optimized/xtudo.jpg",
      category: "Lanches",
      badge: "Gigante"
    },
    {
      name: "Espeto de Frango",
      description: "Espetinho de peito de frango marinado em tempero especial da casa, macio e dourado na brasa.",
      image: "img/Food/optimized/espeto-de-frango-2.jpg",
      category: "Espetos",
      badge: "Tradicional"
    },
    {
      name: "Pão de Alho",
      description: "Pão recheado com pasta cremosa de alho e ervas, grelhado até ficar dourado e crocante.",
      image: "img/Food/optimized/pao-de-alho-2.jpg",
      category: "Porções",
      badge: "Favorito"
    },
    {
      name: "Kafta",
      description: "Espeto de carne moída temperada com hortelã e especiarias árabes, grelhado na brasa.",
      image: "img/Food/optimized/kafta-2.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "Linguiça",
      description: "Espeto de linguiça toscana tradicional, bem assada por fora e suculenta por dentro.",
      image: "img/Food/optimized/linguica-2.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "Linguiça Apimentada",
      description: "Espeto de linguiça com toque de pimenta artesanal, grelhado para realçar o sabor picante.",
      image: "img/Food/optimized/linguica-apimentada-2.jpg",
      category: "Espetos",
      badge: "Picante"
    },
    {
      name: "Fraldinha",
      description: "Espeto de fraldinha selecionada com capa de gordura perfeita, assada lentamente na brasa.",
      image: "img/Food/optimized/fraldinha-2.jpg",
      category: "Espetos",
      badge: "Premium"
    },
    {
      name: "Camarão",
      description: "Espeto de camarão grelhado na churrasqueira, temperado na medida certa com limão e ervas.",
      image: "img/Food/optimized/camarao-2.jpg",
      category: "Espetos",
      badge: "Especial"
    },
    {
      name: "Espeto de Bacon",
      description: "Espeto de bacon premium defumado e grelhado na brasa, suculento e cheio de sabor.",
      image: "img/Food/optimized/bacon-2.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "X-Bacon",
      description: "Hambúrguer artesanal suculento com queijo derretido, bacon crocante, maionese artesanal no pão brioche.",
      image: "img/Food/optimized/xbacon.jpg",
      category: "Lanches",
      badge: ""
    },
    {
      name: "X-Salada",
      description: "Hambúrguer artesanal com queijo derretido, alface fresca, tomate, cebola e maionese especial.",
      image: "img/Food/optimized/x-salada-2.jpg",
      category: "Lanches",
      badge: ""
    },
    {
      name: "Jantinha de Camarão",
      description: "Prato completo com espeto de camarão, arroz soltinho, feijão tropeiro caseiro, vinagrete e mandioca cozida.",
      image: "img/Food/optimized/jantinha-camarao-2.jpg",
      category: "Jantinhas",
      badge: "Especial"
    },
    {
      name: "Medalhão de Carne",
      description: "Espeto de cubos de carne premium envoltos em fatias crocantes de bacon grelhado.",
      image: "img/Food/optimized/medalhao-de-carne-2.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "Medalhão de Frango",
      description: "Espeto de cubos de frango marinados envoltos em fatias crocantes de bacon assados na brasa.",
      image: "img/Food/optimized/medalhao-de-frango.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "Queijo Coalho",
      description: "Espeto de queijo coalho premium tostado por fora, derretendo por dentro.",
      image: "img/Food/optimized/queijo-2.jpg",
      category: "Espetos",
      badge: ""
    },
    {
      name: "Tulipa de Frango",
      description: "Espeto de meio da asa de frango (tulipa) bem temperado e dourado na brasa.",
      image: "img/Food/optimized/tulipa-2.jpg",
      category: "Espetos",
      badge: ""
    }
  ];

  const ITEMS_PER_PAGE = 8;
  let currentCategory = "Todos";
  let visibleCount = ITEMS_PER_PAGE;

  const cardapioGrid = document.getElementById('cardapio-grid');
  const btnVerMais = document.getElementById('btn-ver-mais');
  const verMaisContainer = document.getElementById('ver-mais-container');
  const filterBtns = document.querySelectorAll('#cardapio-filters .filter-btn');

  if (cardapioGrid) {
    // Variáveis globais para controle do Lightbox
    let activeItems = [];
    let currentLightboxIndex = -1;
    let lastFocusedElement = null;

    const lightbox = document.getElementById('cardapio-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxWhatsBtn = document.getElementById('lightbox-whats-btn');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = document.getElementById('lightbox-prev');
    const btnNext = document.getElementById('lightbox-next');

    const renderMenu = () => {
      // Filtrar itens pela categoria ativa
      const filteredItems = menuItems.filter(item => {
        return currentCategory === "Todos" || item.category === currentCategory;
      });

      // Pegar a fatia de itens visíveis
      const itemsToRender = filteredItems.slice(0, visibleCount);

      // Salvar os itens atualmente exibidos para navegação do Lightbox
      activeItems = itemsToRender;

      // Concatenar marcação HTML dos cards em memória para escrita única
      let gridHTML = '';

      itemsToRender.forEach((item, index) => {
        // Criar conteúdo do badge se existir
        const badgeHTML = item.badge 
          ? `<span class="cardapio-badge">${item.badge}</span>` 
          : '';

        // Formatar a mensagem do WhatsApp
        const waMessage = `Olá! Gostaria de pedir ou saber mais sobre o ${item.name} do Di Propósito.`;
        const waLink = `https://wa.me/5511968662940?text=${encodeURIComponent(waMessage)}`;

        gridHTML += `
          <div class="cardapio-item">
            <div class="cardapio-img-box" data-index="${index}" tabindex="0" role="button" aria-label="Ampliar foto de ${item.name}">
              ${badgeHTML}
              <img src="${item.image}" alt="${item.name} do Di Propósito" loading="lazy" width="300" height="220" style="aspect-ratio: 300/220; object-fit: cover;">
              <div class="cardapio-img-overlay">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
                <span>Ver Foto</span>
              </div>
            </div>
            <div class="cardapio-info">
              <h3 class="cardapio-title">${item.name}</h3>
              <p class="cardapio-desc">${item.description}</p>
              <a href="${waLink}" target="_blank" class="btn-card-whats">
                <i class="fab fa-whatsapp"></i> Pedir pelo WhatsApp
              </a>
            </div>
          </div>
        `;
      });

      // Atualizar o DOM com uma única operação (evita múltiplos reflows)
      cardapioGrid.innerHTML = gridHTML;

      // Controlar exibição do botão "Ver mais"
      if (filteredItems.length > visibleCount) {
        verMaisContainer.style.display = 'flex';
      } else {
        verMaisContainer.style.display = 'none';
      }
    };

    // Função para abrir o Lightbox
    const openLightbox = (index) => {
      if (index < 0 || index >= activeItems.length) return;
      
      // Salvar o elemento ativo antes de abrir o modal (gestão de foco/acessibilidade)
      if (currentLightboxIndex === -1) {
        lastFocusedElement = document.activeElement;
      }
      
      currentLightboxIndex = index;
      const item = activeItems[index];

      // Atualizar dados do modal
      lightboxImg.src = item.image;
      lightboxImg.alt = `${item.name} do Di Propósito - Foto Ampliada`;
      lightboxTitle.textContent = item.name;
      lightboxDesc.textContent = item.description;

      const waMessage = `Olá! Gostaria de pedir ou saber mais sobre o ${item.name} do Di Propósito.`;
      lightboxWhatsBtn.href = `https://wa.me/5511968662940?text=${encodeURIComponent(waMessage)}`;

      // Exibir o modal
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      
      // Mover o foco para o botão de fechar
      if (btnClose) btnClose.focus();
    };

    // Função para fechar o Lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      currentLightboxIndex = -1;

      // Devolver o foco para o elemento original
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };

    // Funções de navegação do Lightbox
    const showNext = () => {
      if (activeItems.length <= 1) return;
      const nextIndex = (currentLightboxIndex + 1) % activeItems.length;
      openLightbox(nextIndex);
    };

    const showPrev = () => {
      if (activeItems.length <= 1) return;
      const prevIndex = (currentLightboxIndex - 1 + activeItems.length) % activeItems.length;
      openLightbox(prevIndex);
    };

    // Event Delegation no cardapioGrid (Clique)
    cardapioGrid.addEventListener('click', (e) => {
      const imgBox = e.target.closest('.cardapio-img-box');
      if (imgBox) {
        const index = parseInt(imgBox.getAttribute('data-index'), 10);
        openLightbox(index);
      }
    });

    // Event Delegation no cardapioGrid (Teclado - Enter/Espaço para acessibilidade)
    cardapioGrid.addEventListener('keydown', (e) => {
      const imgBox = e.target.closest('.cardapio-img-box');
      if (imgBox && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); // Evitar rolagem da página com barra de espaço
        const index = parseInt(imgBox.getAttribute('data-index'), 10);
        openLightbox(index);
      }
    });

    // Ouvintes dos botões de controle do Lightbox
    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    if (btnNext) btnNext.addEventListener('click', showNext);
    if (btnPrev) btnPrev.addEventListener('click', showPrev);

    // Fechar ao clicar fora do conteúdo (no overlay)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Atalhos de teclado (acessibilidade e conveniência)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    });

    // Listener para o botão "Ver mais"
    if (btnVerMais) {
      btnVerMais.addEventListener('click', () => {
        visibleCount += ITEMS_PER_PAGE;
        renderMenu();
      });
    }

    // Listeners para os botões de filtro
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const activeBtn = e.target.closest('.filter-btn');
        if (!activeBtn) return;

        // Evitar processamento redundante se o filtro já estiver ativo
        const targetCategory = activeBtn.getAttribute('data-category');
        if (targetCategory === currentCategory) return;

        // Atualizar classe ativa
        filterBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        // Atualizar categoria e resetar paginação
        currentCategory = targetCategory;
        visibleCount = ITEMS_PER_PAGE;

        // Renderizar menu
        renderMenu();
      });
    });

    // Renderização inicial
    renderMenu();
  }

});
