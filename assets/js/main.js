// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Haz que inject devuelva una Promesa
  const inject = (selector, url) => {
    const el = document.querySelector(selector);
    if (!el) return Promise.resolve();
    return fetch(url, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); })
      .then(html => { el.outerHTML = html; });
  };

  // Inyecta nav y footer
  inject('#nav-placeholder', 'assets/includes/nav.html')
    .then(() => {
      // Inicializa comportamiento para submenús en móviles (tap para abrir/cerrar)
      initDropdownSubmenus();
    })
    .catch(err => console.warn(`No se pudo cargar nav:`, err));

  inject('#footer-placeholder', 'assets/includes/footer.html')
    .catch(err => console.warn(`No se pudo cargar footer:`, err));

  // Si usas carrusel en index
  const carouselEl = document.querySelector('#dirinfCarousel');
  if (carouselEl && window.bootstrap) {
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: 5000, wrap: true });
    carousel.cycle();
  }
});

// —— función de apoyo —— //
function initDropdownSubmenus() {
  // Toggle por click en móviles / colapsado
  document.querySelectorAll('.dropdown-submenu > .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // Evita que navegue y que cierre todo el dropdown
      e.preventDefault();
      e.stopPropagation();
      const submenu = toggle.nextElementSibling;
      if (submenu && submenu.classList.contains('dropdown-menu')) {
        submenu.classList.toggle('show');
      }
    });
  });

  // Al cerrar un dropdown padre, cierra submenús abiertos
  document.querySelectorAll('.dropdown').forEach(dd => {
    dd.addEventListener('hide.bs.dropdown', function () {
      this.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
    });
  });

  (function () {
    const els = document.querySelectorAll('.kpi-number[data-target]');
    if (!('IntersectionObserver' in window)) return; // sin animación en navegadores muy antiguos

    const animate = (el) => {
      const target = +el.getAttribute('data-target');
      const duration = 1100; // ms
      const start = performance.now();
      const startVal = 0;

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = Math.floor(startVal + (target - startVal) * p);
        el.textContent = val.toLocaleString('es-CL');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    els.forEach(el => {
      // si quieres que muestren 0 antes de animar, descomenta la siguiente línea:
      // el.textContent = '0';
      io.observe(el);
    });
  })();

}
