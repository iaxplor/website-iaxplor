document.addEventListener('DOMContentLoaded', () => {
  fetch('/data/trilhas.json')
    .then((r) => r.json())
    .then((trilhas) => { renderCards(trilhas); initLessonSearch(trilhas); })
    .catch(() => {});

  function renderCards(trilhas) {
    const cardsRoot = document.getElementById('cards-root');
    if (!cardsRoot || !Array.isArray(trilhas)) return;
    cardsRoot.innerHTML = '';
    trilhas.forEach((t) => {
      const a = document.createElement('a');
      a.href = `curso.html?trilha=${encodeURIComponent(t.slug)}`;
      a.className = 'trilha-card-thumb';
      const img = document.createElement('img');
      img.alt = t.titulo;
      img.loading = 'lazy';
      img.src = t.cover || '/assets/img/og-content.svg';
      const body = document.createElement('div');
      body.className = 'trilha-card-body';
      const title = document.createElement('div');
      title.className = 'trilha-card-title';
      title.textContent = t.titulo;
      const meta = document.createElement('div');
      meta.className = 'trilha-card-meta';
      meta.textContent = `${(t.modulos||[]).length} módulos • ${(t.modulos||[]).reduce((acc,m)=>acc+(m.aulas?m.aulas.length:0),0)} aulas`;
      body.appendChild(title); body.appendChild(meta);
      a.appendChild(img); a.appendChild(body);
      cardsRoot.appendChild(a);
    });
  }

  function initLessonSearch(trilhas) {
    const input = document.getElementById('lesson-search');
    const root = document.getElementById('lesson-results');
    if (!input || !root) return;
    const all = [];
    (trilhas||[]).forEach(t => (t.modulos||[]).forEach(m => (m.aulas||[]).forEach(a => {
      all.push({ trilha: t, modulo: m, aula: a });
    })));
    function render(list) {
      root.innerHTML = '';
      if (!list.length) { root.innerHTML = '<p style="color:var(--text-secondary)">Nenhuma aula encontrada.</p>'; return; }
      list.slice(0,30).forEach(({ trilha, modulo, aula }) => {
        const card = document.createElement('div');
        card.className = 'trilha-card';
        const h = document.createElement('div');
        h.className = 'trilha-header';
        h.innerHTML = `<h3>${aula.titulo}</h3><span class="badge">${trilha.titulo}</span>`;
        const p = document.createElement('p');
        p.textContent = `${modulo.titulo} • ${aula.duracao || ''}`;
        const actions = document.createElement('div');
        actions.style.marginTop = '0.5rem';
        const link = document.createElement('a');
        link.className = 'btn btn-primary';
        link.href = `curso.html?trilha=${encodeURIComponent(trilha.slug)}`;
        link.textContent = 'Abrir no curso';
        actions.appendChild(link);
        card.appendChild(h); card.appendChild(p); card.appendChild(actions);
        root.appendChild(card);
      });
    }
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const q = input.value.toLowerCase().trim();
        if (!q) { root.innerHTML = ''; return; }
        const filtered = all.filter(({ trilha, modulo, aula }) =>
          aula.titulo.toLowerCase().includes(q) ||
          (aula.duracao||'').toLowerCase().includes(q) ||
          (modulo.titulo||'').toLowerCase().includes(q) ||
          (trilha.titulo||'').toLowerCase().includes(q)
        );
        render(filtered);
      }, 220);
    });
  }
});


