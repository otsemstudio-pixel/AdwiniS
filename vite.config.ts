import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openingOverlay, openingScript, openingStyle } from './src/opening';

const root = fileURLToPath(new URL('.', import.meta.url));

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

/**
 * Séquence d'ouverture (voir src/opening.ts), injectée dans le HTML de la page d'accueil
 * seulement : amorce et styles en tête de <head> (avant toute feuille de style), calque en tête
 * de <body>. Les pages /carte, /card et /brief n'en ont pas.
 */
function openingSequence(): Plugin {
  return {
    name: 'adwini:opening',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        // Accueil uniquement (« /index.html ») : pas « /carte/index.html » ni les autres.
        if (ctx.path.replace(/^\/+/, '') !== 'index.html') return html;
        return html
          .replace('<head>', `<head>\n    ${openingScript}\n    ${openingStyle}`)
          .replace('<body>', `<body>\n    ${openingOverlay()}`);
      },
    },
  };
}

export default defineConfig({
  // Site publié sur https://otsemstudio-pixel.github.io/AdwiniS/ : tous les chemins partent de ce sous-dossier.
  // Avec un domaine personnalisé, remettre base: '/'.
  base: '/AdwiniS/',
  plugins: [react(), preloadTitleFont(), openingSequence()],
  build: {
    target: 'es2019',
    // Site principal + pages autonomes (non liées, non indexées) : /carte, /card, /brief.
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        carte: resolve(root, 'carte/index.html'),
        card: resolve(root, 'card/index.html'),
        brief: resolve(root, 'brief/index.html'),
      },
    },
    cssCodeSplit: false,
    // Les polices restent des fichiers séparés : mises en cache, jamais dans le JS.
    assetsInlineLimit: 0,
  },
});
