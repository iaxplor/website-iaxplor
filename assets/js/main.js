import { initDownloads } from './modules/downloads.js';
import { initNeural } from './modules/neural.js';
import { initHeader, initSmoothScroll, initMetrics, initMobileMenu, initLucide } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initHeader();
  initMobileMenu();
  initMetrics();
  initDownloads();
  initNeural();
  initLucide();
});

