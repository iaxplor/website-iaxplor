IAxplor Website
================

Projeto do site estático com conteúdo dinâmico via `data/trilhas.json`, PWA e efeitos visuais.

Scripts
-------

- `npm run dev` – servidor local com Vite
- `npm run build` – gera `dist/`
- `npm run preview` – serve o build localmente
- `npm run lint` – eslint
- `npm run format` – prettier

Estrutura
---------

- `index.html`, `conteudo.html`, `templates.html`, `curso.html`
- `public/assets/css/` – estilos por página e globais (`styles.css` ainda na raiz por compatibilidade)
- `public/assets/js/` – scripts por página + utilidades
- `public/data/trilhas.json` – fonte de dados
- `public/manifest.json` – configuração PWA
- `sw.js` – service worker

Desenvolvimento
---------------

1. `npm i`
2. `npm run dev`

Build/Deploy
------------

1. `npm run build`
2. Publique `dist/` (GitHub Pages/Netlify/Vercel)

Qualidade
---------

- ESLint + Prettier
- Lighthouse (sugestão: adicionar CI)

Notas
-----

- Efeito neural respeita `prefers-reduced-motion`
- Downloads diretos usam fetch/Blob com fallback para nova aba

## 📞 Suporte

Para dúvidas ou sugestões:

- **Email**: bruno@iaxplor.com
- **WhatsApp**: [Link do grupo]
- **YouTube**: [Canal IAxplor]

## 📄 Licença

Este projeto foi desenvolvido para a comunidade IAxplor. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a comunidade IAxplor**
