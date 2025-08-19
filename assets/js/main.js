// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Inyecta HTML y devuelve una Promesa
  const inject = (selector, url) => new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (!el) return resolve();
    fetch(url, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.text(); })
      .then(html => { el.outerHTML = html; resolve(); })
      .catch(err => { console.warn(`No se pudo cargar ${url}:`, err); resolve(); });
  });

  const navP  = inject('#nav-placeholder',    'assets/includes/nav.html');
  const footP = inject('#footer-placeholder', 'assets/includes/footer.html');

  // --- helpers ---
  const setNavHeightVar = () => {
    const nav = document.querySelector('.banner-nav');
    const h = nav?.offsetHeight || 100;
    document.documentElement.style.setProperty('--nav-h', `${h}px`);
  };

  const adjustAndScrollToHash = () => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;
    requestAnimationFrame(() => {
      // 1) intento normal (usa scroll-margin-top)
      el.scrollIntoView({ block: 'start' });
      // 2) fallback (algunos navegadores)
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, left: 0, behavior: 'auto' });
    });
  };

  Promise.all([navP, footP]).then(() => {
    // Navbar sólido al hacer scroll (si te interesa)
    const nav = document.querySelector('.banner-nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
      onScroll();
      window.addEventListener('scroll', onScroll);
    }

    // Altura real del nav → variable CSS
    setNavHeightVar();
    window.addEventListener('resize', setNavHeightVar);

    // Si llegamos con #hash, re-ajustar después de inyectar
    adjustAndScrollToHash();
    window.addEventListener('hashchange', adjustAndScrollToHash);
    window.addEventListener('load',       adjustAndScrollToHash);
  });
});


