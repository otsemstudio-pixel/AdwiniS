import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Site publié sur https://otsemstudio-pixel.github.io/AdwiniS/ : tous les chemins partent de ce sous-dossier.
  // Avec un domaine personnalisé, remettre base: '/'.
  base: '/AdwiniS/',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    // Les polices restent des fichiers séparés : mises en cache, jamais dans le JS.
    assetsInlineLimit: 0,
  },
});
