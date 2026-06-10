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

});
