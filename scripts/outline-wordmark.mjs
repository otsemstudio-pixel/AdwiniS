/**
 * Outil ponctuel : génère un wordmark PROVISOIRE en tracé vectoriel (Outfit 500)
 * dans src/data/brand.wordmark.ts. À supprimer quand le wordmark officiel est fourni.
 * Usage : node scripts/outline-wordmark.mjs
 */
import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';

const buf = readFileSync('node_modules/@fontsource/outfit/files/outfit-latin-500-normal.woff');
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const size = 100;
// Mise en page glyphe par glyphe (le moteur de substitutions d'opentype.js ne gère pas cette police).
const line = (text, y, tracking = 0, x0 = 0) => {
  const scale = size / font.unitsPerEm;
  let x = x0;
  let d = '';
  let prev = null;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (prev) x += font.getKerningValue(prev, g) * scale;
    d += g.getPath(x, y, size).toPathData(1);
    x += g.advanceWidth * scale + tracking * size;
    prev = g;
  }
  return { d, width: x - x0 };
};
const one = line('Adwini Studio', 76, -0.01);
const wA = line('Adwini', 76, -0.01).width;
const wS = line('Studio', 176, -0.01).width;
const W = Math.max(wA, wS);
const adwini = line('Adwini', 76, -0.01, (W - wA) / 2);
const studio = line('Studio', 176, -0.01, (W - wS) / 2);
const out = `/* Généré par scripts/outline-wordmark.mjs — WORDMARK PROVISOIRE, à remplacer par le tracé officiel. */
export const wordmarkInline = { width: ${Math.ceil(one.width)}, height: 100, d: '${one.d}' };
export const wordmarkStacked = { width: ${Math.ceil(Math.max(adwini.width, studio.width))}, height: 200, d: '${adwini.d} ${studio.d}' };
`;
writeFileSync('src/data/brand.wordmark.ts', out);
console.log('ok', one.width, out.length);
