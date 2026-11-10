import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Application unique : toutes les URL (/tg/fr/…) sont servies par index.html (repli SPA)
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: { port: 5173, host: true },
});
