/**
 * Génère les images statiques à partir de SVG : image de partage (Open Graph / X)
 * et icônes PNG. Usage : `npm run assets` (nécessite Chrome ou Edge installé ;
 * chemin personnalisable via la variable CHROME_PATH).
 *
 * Sorties dans public/ : og-image.svg, og-image.png, favicon-32.png,
 * apple-touch-icon.png, icon-192.png, icon-512.png.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => resolve(root, 'public', f);

export function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error('Chrome introuvable : définissez CHROME_PATH.');
  return found;
}

// Polices incorporées en data URI : une page vierge ne peut pas charger de fichiers locaux.
const font = (pkg, file, family, weight) => {
  const data = readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};

const FONTS = [
  font('fraunces', 'fraunces-latin-700-normal.woff2', 'Fraunces', 700),
  font('archivo', 'archivo-latin-700-normal.woff2', 'Archivo', 700),
  font('space-mono', 'space-mono-latin-400-normal.woff2', 'Space Mono', 400),
].join('');

const C = { ivory: '#F5F1E8', ink: '#16181C', accent: '#9A5B36', grey: '#5E5C55' };
const TRI = ['M0 0H1L0 1Z', 'M0 0H1V1Z', 'M1 0V1H0Z', 'M0 0L1 1H0Z'];

/** Même trame que le hero : blocs 2 × 2 de demi-carrés, une diagonale en terre cuite. */
function weave(x, y, n, cell) {
  let out = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const bi = Math.floor(r / 2);
      const bj = Math.floor(c / 2);
      const inward = (bi + bj) % 2 === 0;
      const rot = inward ? [[2, 3], [1, 0]][r % 2][c % 2] : [[0, 1], [3, 2]][r % 2][c % 2];
      const fill = inward && bi === bj ? C.accent : C.ink;
      out += `<path d="${TRI[rot]}" transform="translate(${x + c * cell} ${y + r * cell}) scale(${cell})" fill="${fill}"/>`;
    }
  }
  return out;
}

const monogram = (x, y, size, color, cut, thick = false) =>
  `<g transform="translate(${x} ${y}) scale(${size / 100})">` +
  `<path d="M14 90 L44 10 L56 10 L26 90 Z" fill="${color}"/>` +
  `<path d="M86 90 L56 10 L44 10 L74 90 Z" fill="${color}"/>` +
  (thick
    ? `<rect x="24" y="54.5" width="52" height="14" fill="${cut}"/>`
    : `<rect x="24" y="56" width="52" height="11" fill="${cut}"/>`) +
  `</g>`;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<rect width="1200" height="630" fill="${C.ivory}"/>
${weave(880, 64, 6, 42)}
${monogram(64, 64, 88, C.ink, C.ivory)}
<text x="160" y="118" font-family="Fraunces" font-weight="700" font-size="42" fill="${C.ink}">Adwini</text>
<text x="162" y="144" font-family="Archivo" font-weight="700" font-size="14" letter-spacing="6" fill="${C.accent}">STUDIO</text>
<text x="72" y="430" font-family="Fraunces" font-weight="700" font-size="80" letter-spacing="-2" fill="${C.ink}">DES IDÉES AFRICAINES.</text>
<text x="72" y="512" font-family="Fraunces" font-weight="700" font-size="80" letter-spacing="-2" fill="${C.ink}">VUES AUTREMENT.</text>
<text x="72" y="578" font-family="Space Mono" font-size="17" letter-spacing="3" fill="${C.grey}">ADWINI / 001 — FR / EN</text>
<text x="1128" y="578" text-anchor="end" font-family="Space Mono" font-size="17" letter-spacing="3" fill="${C.grey}">KIGALI — RWANDA</text>
</svg>`;

/** Icône carrée : symbole encre sur ivoire, avec une marge (zone de respect). */
const iconSvg = (size, padding) => {
  const s = size - padding * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" fill="${C.ivory}"/>${monogram(padding, padding, s, C.ink, C.ivory, s < 24)}</svg>`;
};

async function render(page, svg, width, height, out) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><style>${FONTS}html,body{margin:0}svg{display:block}</style>${svg}`, {
    waitUntil: 'load',
  });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  console.log('✓', out.replace(root, '.'));
}

async function main() {
  writeFileSync(pub('og-image.svg'), ogSvg);
  const browser = await puppeteer.launch({ executablePath: findChrome() });
  const page = await browser.newPage();
  await render(page, ogSvg, 1200, 630, pub('og-image.png'));
  await render(page, iconSvg(32, 1), 32, 32, pub('favicon-32.png'));
  await render(page, iconSvg(180, 28), 180, 180, pub('apple-touch-icon.png'));
  await render(page, iconSvg(192, 30), 192, 192, pub('icon-192.png'));
  await render(page, iconSvg(512, 80), 512, 512, pub('icon-512.png'));
  await browser.close();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
