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
- `assets/css/` – estilos por página e globais (`styles.css` ainda na raiz por compatibilidade)
- `assets/js/` – scripts por página + utilidades
- `data/trilhas.json` – fonte de dados
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
# 🚀 IAxplor - Site da Comunidade

Site profissional para a comunidade IAxplor, focada em compartilhar conhecimento sobre Inteligência Artificial para negócios.

## 📋 Sobre o Projeto

O site da IAxplor foi desenvolvido para:

- **Capturar leads** através de formulário otimizado
- **Organizar conteúdo** em trilhas de aprendizado estruturadas
- **Centralizar recursos** como vídeos, templates e arquivos
- **Facilitar networking** entre membros da comunidade
- **Preparar terreno** para futura monetização

## 🎯 Funcionalidades Principais

### ✅ Landing Page (index.html)
- **Hero Section** com formulário de captura
- **Seção Sobre** explicando a comunidade
- **Preview de Trilhas** de conteúdo
- **Depoimentos** de membros
- **Call-to-Actions** estratégicos

### ✅ Central de Conteúdo (conteudo.html)
- **Trilhas organizadas** por nível de dificuldade
- **Módulos expansíveis** com vídeos e downloads
- **Sidebar** com progresso e links rápidos
- **Sistema de progresso** visual
- **Downloads** de templates e arquivos

### ✅ Funcionalidades Técnicas
- **Design responsivo** para todos os dispositivos
- **Navegação suave** entre seções
- **Animações** e transições fluidas
- **Formulário funcional** com validação
- **SEO otimizado** com meta tags

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com CSS Grid e Flexbox
- **JavaScript** - Interatividade e funcionalidades
- **Google Fonts** - Tipografia Inter
- **Design System** - Variáveis CSS para consistência

## 📁 Estrutura de Arquivos

```
website/
├── index.html          # Landing page principal
├── conteudo.html       # Central de conteúdo
├── styles.css          # Estilos globais
├── script.js           # Funcionalidades JavaScript
└── README.md           # Documentação
```

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Clone ou baixe** os arquivos para seu servidor
2. **Personalize** as informações de contato no footer
3. **Atualize** os links do WhatsApp e redes sociais
4. **Configure** a integração com Tally (formulário)

### 2. Personalização

#### Cores e Branding
Edite as variáveis CSS no arquivo `styles.css`:

```css
:root {
    --primary-color: #2563eb;    /* Cor principal */
    --secondary-color: #7c3aed;  /* Cor secundária */
    --accent-color: #06b6d4;     /* Cor de destaque */
}
```

#### Conteúdo
- **index.html**: Atualize textos, depoimentos e informações da comunidade
- **conteudo.html**: Adicione suas trilhas, vídeos e downloads
- **script.js**: Configure links do WhatsApp e integrações

### 3. Integrações

#### Formulário de Captura
No arquivo `script.js`, linha 25, configure:

```javascript
// Redireciona para o grupo do WhatsApp (substitua pelo link real)
window.open('https://wa.me/SEUNUMERO?text=Olá! Vim do site IAxplor e quero entrar na comunidade!', '_blank');
```

#### Tally Forms
Para integrar com Tally:

1. Crie seu formulário no Tally
2. Substitua o JavaScript do formulário pela integração real
3. Configure webhooks para redirecionamento

#### YouTube
Para integrar vídeos do YouTube:

1. Substitua os placeholders `▶️` por thumbnails reais
2. Adicione links diretos para os vídeos
3. Considere usar a API do YouTube para dados dinâmicos

## 📊 SEO e Performance

### Meta Tags Configuradas
- Title otimizado para cada página
- Description com palavras-chave relevantes
- Viewport para responsividade
- Charset UTF-8

### Performance
- Fontes otimizadas com preconnect
- CSS e JS minificados (recomendado para produção)
- Imagens com lazy loading (preparado)
- Animações otimizadas com CSS transforms

## 🎨 Design System

### Cores
- **Primária**: Azul (#2563eb) - Ações principais
- **Secundária**: Roxo (#7c3aed) - Gradientes e destaque
- **Sucesso**: Verde (#10b981) - Progresso e confirmações
- **Erro**: Vermelho (#ef4444) - Alertas e erros

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Hierarquia**: 300, 400, 500, 600, 700
- **Responsiva**: Escala de tamanhos para mobile

### Componentes
- **Botões**: Primário, secundário e grande
- **Cards**: Feature cards, trilha cards, depoimento cards
- **Formulários**: Inputs com validação visual
- **Navegação**: Header fixo com scroll suave

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🔧 Funcionalidades JavaScript

### Formulário de Captura
- Validação de campos obrigatórios
- Validação de e-mail
- Mensagens de feedback
- Redirecionamento para WhatsApp

### Navegação
- Scroll suave entre seções
- Header com efeito de scroll
- Menu ativo baseado na seção visível

### Animações
- Fade in de elementos no scroll
- Hover effects em cards
- Transições suaves

### Central de Conteúdo
- Módulos expansíveis/colapsáveis
- Sistema de progresso simulado
- Links para downloads

## 🚀 Próximos Passos

### Funcionalidades Futuras
1. **Sistema de Login** para membros
2. **Progresso Real** baseado em atividade
3. **Integração com YouTube API**
4. **Sistema de Notificações**
5. **Área de Membros Premium**

### Monetização
1. **Área de Cursos Pagos**
2. **Mentorias Individuais**
3. **Consultoria Empresarial**
4. **Eventos e Workshops**

## 📞 Suporte

Para dúvidas ou sugestões:

- **Email**: bruno@iaxplor.com
- **WhatsApp**: [Link do grupo]
- **YouTube**: [Canal IAxplor]

## 📄 Licença

Este projeto foi desenvolvido para a comunidade IAxplor. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a comunidade IAxplor**
