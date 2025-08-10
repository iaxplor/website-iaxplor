/* IAxplor Service Worker (Workbox) */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Versão para controle manual de cache bust
const VERSION = 'v2.2.0';

// Ativa imediatamente a nova versão
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Precache manual (sem build injectManifest)
workbox.precaching.precacheAndRoute([
  { url: '/', revision: VERSION },
  { url: '/index.html', revision: VERSION },
  { url: '/conteudo.html', revision: VERSION },
  { url: '/templates.html', revision: VERSION },
  { url: '/curso.html', revision: VERSION },
  { url: '/styles.css', revision: VERSION },
  { url: '/assets/css/content.css', revision: VERSION },
  { url: '/assets/js/main.js', revision: VERSION },
  { url: '/assets/js/modules/ui.js', revision: VERSION },
  { url: '/assets/js/modules/downloads.js', revision: VERSION },
  { url: '/assets/js/modules/neural.js', revision: VERSION },
  { url: '/assets/img/logo.svg', revision: VERSION },
  { url: '/assets/img/favicon.svg', revision: VERSION },
  { url: '/assets/img/icon-192.svg', revision: VERSION },
  { url: '/assets/img/icon-512.svg', revision: VERSION },
  { url: '/assets/img/covers/fundamentos.svg', revision: VERSION },
  { url: '/assets/img/covers/agentes.svg', revision: VERSION },
  { url: '/assets/img/covers/automacoes.svg', revision: VERSION },
  // Dados não devem ser precacheados para evitar stale
  { url: '/manifest.json', revision: VERSION }
]);

// Documentos: NetworkFirst com fallback
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 4,
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 20 })]
  })
);

// CSS/JS: StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Imagens: CacheFirst com limites
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
  })
);

// Dados: StaleWhileRevalidate para JSON dinâmico
workbox.routing.registerRoute(
  ({ url }) => url.pathname === '/data/trilhas.json',
  new workbox.strategies.StaleWhileRevalidate({ cacheName: 'data-trilhas' })
);

// Downloads de materiais (GitHub/raw): CacheFirst
workbox.routing.registerRoute(
  ({ url }) => /github\.com$/.test(url.hostname) || /raw\.githubusercontent\.com$/.test(url.hostname),
  new workbox.strategies.CacheFirst({
    cacheName: 'materials',
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 365 * 24 * 60 * 60 })]
  })
);


