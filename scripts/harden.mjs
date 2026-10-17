/**
 * Durcissement après le build (dernière étape de `npm run build`), sur chaque page de dist/ :
 *
 *  1. Scripts et styles en ligne minifiés : plus aucun commentaire de développement lisible.
 *  2. Commentaires HTML retirés (sauf les repères dont React a besoin pour reprendre le prérendu).
 *  3. Content-Security-Policy (balise meta, GitHub Pages n'autorisant pas les en-têtes) :
 *     seuls les fichiers du site et les scripts en ligne connus (empreinte sha256) s'exécutent ;
 *     Trusted Types interdit toute injection de HTML par script ; aucun plug-in, aucun <base>,
 *     aucun envoi de formulaire, aucune ressource tierce.
 *  4. Protection contre l'intégration dans un cadre (clickjacking) : la page reste invisible
 *     dans une <iframe> d'un autre site (frame-ancestors est ignoré dans une balise meta).
 *  5. Aucune adresse de provenance envoyée aux sites externes (referrer).
 *  6. Intégrité des fichiers (SRI, sha384) sur les scripts et la feuille de style chargés par la page :
 *     un fichier modifié sur le serveur ou en chemin est refusé par le navigateur.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import { minify } from 'rolldown/utils';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const BASE = '/AdwiniS/';

// Dans le cadre d'un autre site, la page reste invisible : un élément masqué ne reçoit aucun clic,
// le piège du « clickjacking » n'a donc rien à faire cliquer. (Les navigateurs interdisent à un cadre
// de rediriger la page qui l'intègre sans geste de l'utilisateur : s'en échapper n'est plus possible.)
const FRAME_GUARD = "if(window.top!==window.self){document.documentElement.style.visibility='hidden'}";

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) pages.push(p);
  }
})(dist);

const hash = (algo, data) => createHash(algo).update(data).digest('base64');

for (const file of pages) {
  let html = readFileSync(file, 'utf8');

  // 1. Scripts en ligne (sans src) : minifiés.
  const inline = [];
  for (const m of [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]) {
    const { code } = await minify('inline.js', m[1], { compress: true, mangle: true });
    const min = code.trim();
    html = html.replace(m[0], `<script>${min}</script>`);
    inline.push(min);
  }

  // Styles en ligne : minifiés.
  html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
    const { code } = transform({ filename: 'inline.css', code: Buffer.from(css), minify: true });
    return `<style>${code.toString()}</style>`;
  });

  // 2. Commentaires HTML, sauf les repères de React (<!-- -->, <!--$-->, <!--/$-->…).
  html = html.replace(/<!--([\s\S]*?)-->/g, (all, body) => (/^(\s|\$|\/\$|\$\?|\$!)?$/.test(body) ? all : ''));
  html = html.replace(/\n\s*\n+/g, '\n');

  // 6. Intégrité des fichiers locaux chargés par la page.
  html = html.replace(/<(script|link)\b([^>]*?)\s(src|href)="([^"]+\.(?:js|css))"([^>]*)>/g, (all, tag, before, attr, url, after) => {
    if (!url.startsWith(BASE) || /integrity=/.test(all)) return all;
    const body = readFileSync(join(dist, url.slice(BASE.length)));
    return `<${tag}${before} ${attr}="${url}" integrity="sha384-${hash('sha384', body)}"${after}>`;
  });

  // 3-5. En-tête de sécurité, inséré en tout premier dans <head> pour couvrir toute la page.
  const scripts = [FRAME_GUARD, ...inline].map((s) => `'sha256-${hash('sha256', s)}'`);
  const csp = [
    "default-src 'none'",
    `script-src 'self' ${scripts.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' data: blob:",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "worker-src 'none'",
    "require-trusted-types-for 'script'",
    "trusted-types 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
  const head =
    `<meta http-equiv="Content-Security-Policy" content="${csp}">` +
    '<meta name="referrer" content="no-referrer">' +
    `<script>${FRAME_GUARD}</script>`;
  // Tout en haut de <head>, avant le moindre script : <meta charset> d'abord (il doit rester dans
  // les 1 024 premiers octets), puis la politique de sécurité, qui couvre ainsi toute la page.
  const charset = html.match(/<meta charset="[^"]*"\s*\/?>/i);
  if (!charset || !/<head>/.test(html)) throw new Error(`<head> ou <meta charset> introuvable : ${file}`);
  html = html.replace(charset[0], '').replace(/<head>/, `<head>${charset[0]}${head}`);

  writeFileSync(file, html);
}
console.log(`✓ durcissement : ${pages.length} page(s) — CSP, Trusted Types, SRI, anti-cadre, commentaires retirés`);
