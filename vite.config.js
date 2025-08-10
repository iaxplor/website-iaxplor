import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: { port: 5173 },
  build: {
    target: 'es2018',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        conteudo: resolve(__dirname, 'conteudo.html'),
        templates: resolve(__dirname, 'templates.html'),
        curso: resolve(__dirname, 'curso.html'),
        termos: resolve(__dirname, 'termos.html'),
        privacidade: resolve(__dirname, 'privacidade.html')
      }
    }
  },
  preview: {
    allowedHosts: ['www.iaxplor.com', 'iaxplor.com'],
    host: '0.0.0.0',
  }
});

