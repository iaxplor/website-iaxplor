export function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      e.preventDefault();
      const headerEl = document.querySelector('.header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}

export function initHeader() {
  const header = document.querySelector('.header');
  window.addEventListener(
    'scroll',
    () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (!header) return;
      if (scrollTop > 100) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    },
    { passive: true }
  );
}

export function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open');
    });
  }
}

export function initMetrics() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const metricEls = document.querySelectorAll('.metric-number');
  fetch(new URL('data/trilhas.json', document.baseURI))
    .then((r) => r.json())
    .then((trilhas) => {
      try {
        const totalTrilhas = Array.isArray(trilhas) ? trilhas.length : 0;
        const aulas = (trilhas || []).flatMap((t) => (t.modulos || []).flatMap((m) => m.aulas || []));
        const aulasComVideo = aulas.filter((a) => typeof a.youtubeId === 'string' && a.youtubeId.length === 11).length;
        const materiais = aulas.reduce(
          (acc, a) => acc + (Array.isArray(a.materiais) ? a.materiais.length : 0),
          0
        );
        const keyToValue = { trilhas: totalTrilhas, aulasComVideo, materiais };
        metricEls.forEach((el) => {
          const key = el.getAttribute('data-key');
          if (key && keyToValue[key] != null) {
            el.setAttribute('data-value', String(keyToValue[key]));
          }
        });
      } catch (__) {}
    })
    .catch(() => {});

  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-value') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = parseInt(el.getAttribute('data-duration') || '1000', 10);
        if (reduceMotion || !target) {
          el.textContent = `${prefix}${target}${suffix}`;
          metricObserver.unobserve(el);
          return;
        }
        const start = performance.now();
        const startVal = 0;
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const current = Math.floor(startVal + (target - startVal) * progress);
          el.textContent = `${prefix}${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
          else metricObserver.unobserve(el);
        }
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.3 }
  );
  metricEls.forEach((el) => metricObserver.observe(el));
}

export function initLucide() {
  try {
    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim() || '#6741d9';

    const apply = () => {
      try { window.lucide.createIcons({ attrs: { stroke: primary, 'stroke-width': 1.75 } }); } catch (_) {}
    };

    // Já disponível
    if (window.lucide && typeof window.lucide.createIcons === 'function') apply();
    else {
      // Aguarda o script UMD carregar
      const lucideScript = document.querySelector('script[src*="lucide"]');
      if (lucideScript) lucideScript.addEventListener('load', apply, { once: true });
      // Fallback por polling (até 5s)
      let tries = 0; const iv = setInterval(() => {
        tries += 1;
        if (window.lucide && typeof window.lucide.createIcons === 'function') { clearInterval(iv); apply(); }
        if (tries > 50) clearInterval(iv);
      }, 100);
    }

    // Reaplica para nós inseridos dinamicamente
    document.addEventListener('DOMNodeInserted', (e) => {
      if (e.target && (e.target.matches?.('i[data-lucide]') || e.target.querySelector?.('i[data-lucide]'))) {
        apply();
      }
    });
  } catch (_) {}
}

