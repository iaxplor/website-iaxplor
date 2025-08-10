// Aguarda o DOM estar carregado
document.addEventListener('DOMContentLoaded', function() {
  // Navegação suave para links internos
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
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

  // Header com scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (!header) return;
    if (scrollTop > 100) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // Animação de entrada simples (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const animatedElements = document.querySelectorAll('.feature-card, .trilha-card, .depoimento-card, .section-header');
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observer.observe(el);
  });

  // Tracking básico de CTAs
  function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
    } else {
      console.log('track', eventName, eventData);
    }
  }

  document.querySelectorAll('[data-tally-open], .btn').forEach((el) => {
    el.addEventListener('click', () => {
      const buttonText = (el.textContent || '').trim();
      const buttonLocation = el.closest('section')?.id || 'global';
      trackEvent('cta_click', { button_text: buttonText, button_location: buttonLocation });
    });
  });

  // Downloads diretos (links com .download-direct)
  function transformGithubUrl(url){
    try {
      const u = new URL(url);
      if (u.hostname === 'github.com' && u.pathname.includes('/blob/')) {
        // https://github.com/org/repo/blob/branch/path -> https://raw.githubusercontent.com/org/repo/branch/path
        const parts = u.pathname.split('/');
        const org = parts[1]; const repo = parts[2]; const branch = parts[4];
        const rest = parts.slice(5).join('/');
        return `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${rest}`;
      }
      return url;
    } catch(_) { return url; }
  }
  function guessExt(url){ try { const u = new URL(transformGithubUrl(url)); const m = u.pathname.match(/\.([a-z0-9]+)$/i); return m?('.'+m[1].toLowerCase()):''; } catch(_) { return ''; } }
  async function downloadFromRemote(url, filename){
    try {
      const fixed = transformGithubUrl(url);
      const res = await fetch(fixed, { mode: 'cors' });
      if (!res.ok) return false;
      const blob = await res.blob();
      const link = document.createElement('a');
      const href = URL.createObjectURL(blob);
      link.href = href;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(href), 2000);
      return true;
    } catch(e) { return false; }
  }
  document.addEventListener('click', async (e) => {
    const a = e.target.closest('a.download-direct');
    if (!a) return;
    e.preventDefault();
    const url = a.getAttribute('data-url');
    const filename = a.getAttribute('data-filename') || ('arquivo'+guessExt(url));
    a.setAttribute('aria-busy','true');
    const original = a.textContent;
    a.textContent = 'Baixando…';
    try {
      const ok = await downloadFromRemote(url, filename);
      if (!ok) window.open(url, '_blank', 'noopener');
    } catch(_) { window.open(url, '_blank', 'noopener'); }
    finally { a.removeAttribute('aria-busy'); a.textContent = original; }
  });

  // Toggle do menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('open');
    });
  }

  // Métricas com animação a partir de data-attributes
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const metricEls = document.querySelectorAll('.metric-number');
  // Se disponível, calcula valores dinâmicos a partir de data/trilhas.json
  fetch('data/trilhas.json').then(r => r.json()).then((trilhas) => {
    try {
      const totalTrilhas = Array.isArray(trilhas) ? trilhas.length : 0;
      const aulas = (trilhas||[]).flatMap(t => (t.modulos||[]).flatMap(m => m.aulas||[]));
      const aulasComVideo = aulas.filter(a => typeof a.youtubeId === 'string' && a.youtubeId.length === 11).length;
      const materiais = aulas.reduce((acc, a) => acc + (Array.isArray(a.materiais) ? a.materiais.length : 0), 0);
      const keyToValue = { trilhas: totalTrilhas, aulasComVideo, materiais };
      metricEls.forEach(el => {
        const key = el.getAttribute('data-key');
        if (key && keyToValue[key] != null) {
          el.setAttribute('data-value', String(keyToValue[key]));
        }
      });
    } catch(_){}
  }).catch(()=>{});
  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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
  }, { threshold: 0.3 });
  metricEls.forEach(el => metricObserver.observe(el));

  // Carrega Tally caso esteja presente (fallback)
  if (!window.Tally) {
    const s = document.createElement('script');
    s.src = 'https://tally.so/widgets/embed.js';
    s.async = true;
    s.onload = s.onreadystatechange = function() {
      const rs = this.readyState; if (rs && rs !== 'complete' && rs !== 'loaded') return; if (typeof Tally !== 'undefined') Tally.loadEmbeds();
    };
    document.body.appendChild(s);
  }

  console.log('IAxplor loaded');

  // Inicializa ícones Lucide (garante render em todas as páginas que importam script.js)
  try {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim() || '#00D4FF';
      lucide.createIcons({ attrs: { stroke: primary, 'stroke-width': 1.5 } });
    }
  } catch (_) {}

  // Fundo neural animado (rede de pontos + conexões com tráfego)
  try {
    function initNeural(canvas) {
      const ctx = canvas.getContext('2d');
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      let width = 0, height = 0, rafId = 0;
      const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Parâmetros ajustáveis
      const NODE_SPEED = 0.22; // velocidade menor dos nós
      const NUM_NODES = 36;
      const LINK_RADIUS = 240;
      const PACKET_SPEED = 0.012; // pacotes mais lentos
      const MAX_PACKETS = 12;
      const DAMPING = 0.985;
      const MOUSE_RADIUS = 180;
      const MOUSE_FORCE = 0.0006;

      const mouse = { x: 0, y: 0, active: false };

      function resize() {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = Math.floor(width * DPR);
        canvas.height = Math.floor(height * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      // Nós (neurônios)
      const nodes = Array.from({ length: NUM_NODES }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
      }));

      // Pacotes de energia trafegando nas conexões
      const packets = [];
      function spawnPacket(biasToMouse = false) {
        let a = nodes[Math.floor(Math.random() * nodes.length)];
        if (biasToMouse && mouse.active) {
          let best = a, bestD2 = Infinity;
          for (const n of nodes) {
            const dx = n.x - mouse.x, dy = n.y - mouse.y; const d2 = dx*dx + dy*dy;
            if (d2 < bestD2) { bestD2 = d2; best = n; }
          }
          a = best;
        }
        let b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a === b) b = nodes[(nodes.indexOf(a) + 1) % nodes.length];
        packets.push({ x: a.x, y: a.y, tx: b.x, ty: b.y, t: 0 });
      }

      // Mouse interatividade (sem capturar cliques)
      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        mouse.x = x; mouse.y = y;
      });
      window.addEventListener('mouseleave', () => { mouse.active = false; });

      function step() {
        ctx.clearRect(0, 0, width, height);

        // Fundo sutil
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(0, 212, 255, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

        // Atualiza nós com leve atração ao mouse
        nodes.forEach(n => {
          if (mouse.active) {
            const dx = mouse.x - n.x, dy = mouse.y - n.y;
            const d2 = dx*dx + dy*dy;
            if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
              n.vx += dx * MOUSE_FORCE; n.vy += dy * MOUSE_FORCE;
            }
          }
          n.vx *= DAMPING; n.vy *= DAMPING;
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = width + 20; if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20; if (n.y > height + 20) n.y = -20;
        });

        // Ligações por proximidade
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist2 = dx*dx + dy*dy;
            if (dist2 < LINK_RADIUS * LINK_RADIUS) {
              const alpha = 1 - Math.min(1, dist2 / (LINK_RADIUS * LINK_RADIUS));
              ctx.strokeStyle = `rgba(0, 212, 255, ${0.18 * alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }

        // Nós
        nodes.forEach(n => {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(0,212,255,0.35)';
          ctx.beginPath(); ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2); ctx.fill();
        });

        // Pacotes de energia (mais frequentes quando mouse ativo)
        const spawnChance = mouse.active ? 0.28 : 0.16;
        if (packets.length < MAX_PACKETS && Math.random() < spawnChance) spawnPacket(mouse.active);
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          p.t += PACKET_SPEED;
          if (p.t >= 1) { packets.splice(i, 1); continue; }
          const x = p.x + (p.tx - p.x) * p.t;
          const y = p.y + (p.ty - p.y) * p.t;
          ctx.fillStyle = 'rgba(0,212,255,0.9)';
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(0,212,255,0.25)';
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        }

        rafId = requestAnimationFrame(step);
      }

      if (!prefersReduce) step();
      else {
        ctx.clearRect(0, 0, width, height);
        nodes.slice(0, 12).forEach(n => { ctx.fillStyle = 'rgba(0,212,255,0.35)'; ctx.fillRect(n.x, n.y, 1, 1); });
      }

      // Cleanup
      window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
    }

    const canvases = document.querySelectorAll('.neural-canvas, #hero-neural');
    canvases.forEach((c) => initNeural(c));
  } catch(_){}
});
