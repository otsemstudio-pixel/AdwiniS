import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Précharge la police de titre seule (Outfit 600) : c'est celle du hero.
 * Mesuré sur 3G simulée + CPU ×4 : aucun retard du premier affichage (≈ 1,17 s).
 */
function preloadTitleFont(): Plugin {
  let base = '/';
  return {
    name: 'adwini:preload-title-font',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find((f) => /outfit-latin-600-normal-.*\.woff2$/.test(f));
        if (!file) return [];
        return [
          {
            tag: 'link',
            attrs: { rel: 'preload', href: `${base}${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head' as const,
          },
        ];
      },
    },
  };
}

export default defineConfig({
  // Site publié sur https://otsemstudio-pixel.github.io/AdwiniS/ : tous les chemins partent de ce sous-dossier.
  // Avec un domaine personnalisé, remettre base: '/'.
  base: '/AdwiniS/',
  plugins: [react(), preloadTitleFont()],
  build: {
    target: 'es2019',
    cssCodeSplit: false,
    // Les polices restent des fichiers séparés : mises en cache, jamais dans le JS.
    assetsInlineLimit: 0,
  },
});
