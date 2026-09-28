import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Two entries: index.html = Logic mode (graded), date-aleph.html = the Date-mode gag prototype (pit3, stashed).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        date: resolve(import.meta.dirname, 'date-aleph.html'),
      },
    },
  },
});
