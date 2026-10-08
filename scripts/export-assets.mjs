/**
 * Génère les images statiques à partir de SVG : image de partage (Open Graph / X)
 * et icônes PNG. Usage : `npm run assets` (nécessite Chrome ou Edge ; chemin
 * personnalisable via CHROME_PATH).
 *
 * Les tracés de la marque sont relus dans src/data/brand.ts et brand.wordmark.ts :
 * quand le logo officiel y est collé, relancer ce script met tout à jour.
 *
 * Sorties dans public/ : og-image.svg, og-image.png, favicon.svg, favicon-32.png,
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

/* Tracés de la marque, lus dans les sources TypeScript. */
function readBrand() {
  const brand = readFileSync(resolve(root, 'src/data/brand.ts'), 'utf8');
  const list = (key) => {
    const block = brand.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`))[1];
    return [...block.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  };
  const wm = readFileSync(resolve(root, 'src/data/brand.wordmark.ts'), 'utf8');
  const inline = wm.match(/wordmark = \{ width: (\d+), height: (\d+), d: '([^']+)'/);
  return {
    strokes: list('strokes'),
    sparks: list('sparks'),
    strokeWidth: Number(brand.match(/strokeWidth:\s*([\d.]+)/)[1]),
    wordmark: { width: Number(inline[1]), height: Number(inline[2]), d: inline[3] },
  };
}

const C = { bg: '#FAF8F4', ink: '#16181C', accent: '#4B2A7B', grey: '#5E5C55' };

const font = (pkg, file, family, weight) => {
  const data = readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
};

async function main() {
  const brand = readBrand();
  // Le logo est monochrome : trait et éclats de la même couleur.
  const mark = (x, y, size, { color = C.ink, width = brand.strokeWidth } = {}) =>
    `<g transform="translate(${x} ${y}) scale(${size / 100})" fill="none" stroke-width="${width}" stroke-linecap="square" stroke-linejoin="round">` +
    brand.strokes.concat(brand.sparks).map((d) => `<path d="${d}" stroke="${color}"/>`).join('') +
    `</g>`;
  const wordmark = (x, y, h) =>
    `<g transform="translate(${x} ${y}) scale(${h / brand.wordmark.height})" fill="${C.ink}" fill-rule="evenodd"><path d="${brand.wordmark.d}"/></g>`;

  const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<rect width="1200" height="630" fill="${C.bg}"/>
${mark(64, 52, 92)}
${wordmark(172, 86, 28)}
<text x="1136" y="96" text-anchor="end" font-family="JetBrains Mono" font-size="15" letter-spacing="2.7" fill="${C.grey}">ADWINI / 001</text>
<text x="64" y="402" font-family="Outfit" font-weight="600" font-size="104" letter-spacing="-4" fill="${C.ink}">DES IDÉES AFRICAINES.</text>
<text x="64" y="496" font-family="Outfit" font-weight="600" font-size="104" letter-spacing="-4" fill="${C.ink}">VUES AUTREMENT.</text>
<line x1="64" y1="552" x2="1136" y2="552" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
<text x="64" y="586" font-family="JetBrains Mono" font-size="15" letter-spacing="2.7" fill="${C.grey}">KIGALI — RWANDA · 01°56′S 30°03′E</text>
<text x="1136" y="586" text-anchor="end" font-family="JetBrains Mono" font-size="15" letter-spacing="2.7" fill="${C.grey}">FR / EN</text>
</svg>`;

  // Symbole seul, encre sur fond clair, avec une marge (zone de respect). Trait épaissi en petit.
  const icon = (size, pad) => {
    const s = size - pad * 2;
    const width = size <= 32 ? brand.strokeWidth * 1.3 : brand.strokeWidth;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${C.bg}"/>${mark(pad, pad, s, { width })}</svg>`;
  };

  writeFileSync(pub('og-image.svg'), og);
  writeFileSync(pub('favicon.svg'), icon(64, 1));

  const fonts = [
    font('outfit', 'outfit-latin-600-normal.woff2', 'Outfit', 600),
    font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2', 'JetBrains Mono', 400),
  ].join('');

  const browser = await puppeteer.launch({ executablePath: findChrome() });
  const page = await browser.newPage();
  const render = async (svg, w, h, file) => {
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><style>${fonts}html,body{margin:0}svg{display:block}</style>${svg}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: pub(file), clip: { x: 0, y: 0, width: w, height: h }, omitBackground: true });
    console.log('✓', `public/${file}`);
  };
  await render(og, 1200, 630, 'og-image.png');
  await render(icon(32, 0.5), 32, 32, 'favicon-32.png');
  await render(icon(180, 26), 180, 180, 'apple-touch-icon.png');
  await render(icon(192, 28), 192, 192, 'icon-192.png');
  await render(icon(512, 76), 512, 512, 'icon-512.png');
  await browser.close();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
