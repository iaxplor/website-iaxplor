import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: { target: 'es2018' },
  preview: {
    allowedHosts: ['www.iaxplor.com', 'iaxplor.com'],
    host: '0.0.0.0',
  }
});

