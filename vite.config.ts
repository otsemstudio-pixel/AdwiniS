import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    // Les polices restent des fichiers séparés : mises en cache, jamais dans le JS.
    assetsInlineLimit: 0,
  },
});
