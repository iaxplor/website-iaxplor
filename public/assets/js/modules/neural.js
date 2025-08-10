export function initNeural() {
  try {
    function boot(canvas) {
      const ctx = canvas.getContext('2d');
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      let width = 0;
      let height = 0;
      let rafId = 0;
      const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const NODE_SPEED = 0.22;
      const NUM_NODES = 36;
      const LINK_RADIUS = 240;
      const PACKET_SPEED = 0.012;
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

      const nodes = Array.from({ length: NUM_NODES }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
      }));
      const packets = [];
      function spawnPacket(biasToMouse = false) {
        let a = nodes[Math.floor(Math.random() * nodes.length)];
        if (biasToMouse && mouse.active) {
          let best = a;
          let bestD2 = Infinity;
          for (const n of nodes) {
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
              bestD2 = d2;
              best = n;
            }
          }
          a = best;
        }
        let b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a === b) b = nodes[(nodes.indexOf(a) + 1) % nodes.length];
        packets.push({ x: a.x, y: a.y, tx: b.x, ty: b.y, t: 0 });
      }

      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        mouse.x = x;
        mouse.y = y;
      });
      window.addEventListener('mouseleave', () => {
        mouse.active = false;
      });

      function step() {
        ctx.clearRect(0, 0, width, height);

        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(103, 65, 217, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        nodes.forEach((n) => {
          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
              n.vx += dx * MOUSE_FORCE;
              n.vy += dy * MOUSE_FORCE;
            }
          }
          n.vx *= DAMPING;
          n.vy *= DAMPING;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < LINK_RADIUS * LINK_RADIUS) {
              const alpha = 1 - Math.min(1, dist2 / (LINK_RADIUS * LINK_RADIUS));
              ctx.strokeStyle = `rgba(103, 65, 217, ${0.18 * alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        nodes.forEach((n) => {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(103,65,217,0.35)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });

        const spawnChance = mouse.active ? 0.28 : 0.16;
        if (packets.length < MAX_PACKETS && Math.random() < spawnChance) spawnPacket(mouse.active);
        for (let i = packets.length - 1; i >= 0; i--) {
          const p = packets[i];
          p.t += PACKET_SPEED;
          if (p.t >= 1) {
            packets.splice(i, 1);
            continue;
          }
          const x = p.x + (p.tx - p.x) * p.t;
          const y = p.y + (p.ty - p.y) * p.t;
          ctx.fillStyle = 'rgba(103,65,217,0.9)';
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(103,65,217,0.25)';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        rafId = requestAnimationFrame(step);
      }

      if (!prefersReduce) step();
      else {
        ctx.clearRect(0, 0, width, height);
      }

      function onVisibility() {
        if (document.hidden) cancelAnimationFrame(rafId);
        else rafId = requestAnimationFrame(step);
      }
      document.addEventListener('visibilitychange', onVisibility);
    }

    const canvases = document.querySelectorAll('.neural-canvas, #hero-neural');
    canvases.forEach((c) => boot(c));
  } catch (_) {}
}

