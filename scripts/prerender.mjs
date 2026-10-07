/**
 * Prérendu statique : injecte le HTML des deux langues dans dist/index.html.
 * Le contenu s'affiche dès l'arrivée du HTML et du CSS, sans attendre le JavaScript
 * (décisif sur 3G). React s'y raccroche ensuite (hydrateRoot dans src/main.tsx).
 *
 * Le français est dans #root ; l'anglais dans un <template>. Un court script en ligne
 * remplace l'un par l'autre avant le premier affichage si la langue détectée est l'anglais.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'dist/index.html');
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);

const fr = render('fr');
const en = render('en');
const swap =
  "<script>(function(){var r=document.getElementById('root'),t=document.getElementById('ssr-en');" +
  "if(document.documentElement.getAttribute('data-lang')==='en'){r.innerHTML=t.innerHTML;r.setAttribute('data-ssr','en')}" +
  't.parentNode.removeChild(t)})();</script>';

const html = readFileSync(htmlPath, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('#root introuvable dans dist/index.html');
writeFileSync(
  htmlPath,
  html.replace('<div id="root"></div>', `<div id="root" data-ssr="fr">${fr}</div><template id="ssr-en">${en}</template>${swap}`),
);
rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`✓ prérendu FR (${(fr.length / 1024).toFixed(0)} Ko) + EN (${(en.length / 1024).toFixed(0)} Ko) injecté dans dist/index.html`);
