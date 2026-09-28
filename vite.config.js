import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Entries: index.html = Logic mode (graded), date-beta.html = the Date-mode scene engine (v5 script), date-aleph.html = the Date-mode gag prototype (pit3, stashed).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        date: resolve(import.meta.dirname, 'date-aleph.html'),
        beta: resolve(import.meta.dirname, 'date-beta.html'),
      },
    },
  },
});
