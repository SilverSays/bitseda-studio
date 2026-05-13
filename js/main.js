/* ============================================================
   BIT-SEDA STUDIO | main.js
   Interactividad global: nav, scroll, counters, filters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HAMBURGER MENU ──────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // Cerrar al hacer click en un link
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL TO TOP ───────────────────────────────────────── */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── STATS COUNTER ───────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;

          const update = () => {
            current += step;
            if (current < target) {
              el.textContent = Math.floor(current) + suffix;
              requestAnimationFrame(update);
            } else {
              el.textContent = target + suffix;
            }
          };
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  /* ── INVENTORY FILTER (insumos.html) ────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const inventoryCards = document.querySelectorAll('.inventory-card[data-cat]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        inventoryCards.forEach(card => {
          const match = cat === 'all' || card.dataset.cat === cat;
          card.setAttribute('data-hidden', !match);
          if (match) {
            card.style.animation = 'none';
            requestAnimationFrame(() => {
              card.style.animation = '';
            });
          }
        });
      });
    });
  }

  /* ── PORTFOLIO FILTER (portafolio.html) ─────────────────── */
  const pfFilterBtns = document.querySelectorAll('.pf-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-cat]');

  if (pfFilterBtns.length > 0) {
    pfFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pfFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        portfolioItems.forEach(item => {
          const match = cat === 'all' || item.dataset.cat === cat;
          item.setAttribute('data-hidden', !match);
        });
      });
    });
  }

  /* ── CONTACT FORM ─────────────────────────────────────────── */
  const contactForm = document.querySelector('.contact-form form');
  const formSuccess  = document.querySelector('.form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit span');
      btn.textContent = 'PROCESANDO...';

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1200);
    });
  }

  /* ── PARALLAX SCROLL (insumos floating items) ───────────── */
  const floatingItems = document.querySelectorAll('.floating-item');
  if (floatingItems.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      floatingItems.forEach((item, i) => {
        const speed = (i + 1) * 0.12;
        item.style.marginTop = -(scrollY * speed) + 'px';
      });
    });
  }

  /* ── ACTIVE NAV LINK ──────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── HEADER SECTION COLOR ─────────────────────────────────── */
  const header = document.querySelector('header');
  if (header) {
    const sectionClass = document.body.dataset.section;
    if (sectionClass) header.classList.add(`section-${sectionClass}`);
  }

  /* ── POLAROID TILT ON HOVER (nosotros) ───────────────────── */
  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
      card.style.transform = `scale(1.05) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
