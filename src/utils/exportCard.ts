/**
 * SVG → PNG, entièrement dans le navigateur.
 * Un SVG dessiné dans un canvas ne peut pas charger de polices externes :
 * on incorpore donc les fichiers woff2 en data URI dans une balise <style>.
 * Ce module (et les polices qu'il référence) n'est chargé qu'au clic sur « Télécharger ».
 */
import fraunces400 from '@fontsource/fraunces/files/fraunces-latin-400-normal.woff2?url';
import fraunces700 from '@fontsource/fraunces/files/fraunces-latin-700-normal.woff2?url';
import archivo400 from '@fontsource/archivo/files/archivo-latin-400-normal.woff2?url';
import archivo700 from '@fontsource/archivo/files/archivo-latin-700-normal.woff2?url';
import mono400 from '@fontsource/space-mono/files/space-mono-latin-400-normal.woff2?url';

const FONTS = [
  { family: 'Fraunces', weight: 400, url: fraunces400 },
  { family: 'Fraunces', weight: 700, url: fraunces700 },
  { family: 'Archivo', weight: 400, url: archivo400 },
  { family: 'Archivo', weight: 700, url: archivo700 },
  { family: 'Space Mono', weight: 400, url: mono400 },
];

let fontCss: Promise<string> | null = null;

async function toDataUri(url: string) {
  const blob = await (await fetch(url)).blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const embeddedFonts = () =>
  (fontCss ??= Promise.all(
    FONTS.map(
      async (f) =>
        `@font-face{font-family:'${f.family}';font-weight:${f.weight};font-style:normal;src:url(${await toDataUri(f.url)}) format('woff2');}`,
    ),
  ).then((rules) => rules.join('')));

async function svgToImage(svg: SVGSVGElement, css: string, width: number, height: number) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.removeAttribute('class');
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = css;
  clone.insertBefore(style, clone.firstChild);
  const source = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // L'image est décodée : l'URL peut être libérée après le dessin.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/**
 * Dessine les faces fournies l'une sous l'autre dans un PNG.
 * `width`/`height` : dimensions du viewBox d'une face ; `scale` : densité de sortie.
 */
export async function facesToPng(faces: SVGSVGElement[], width: number, height: number, background: string, scale = 2) {
  const css = await embeddedFonts();
  const gap = 40;
  const canvas = document.createElement('canvas');
  canvas.width = (width + gap * 2) * scale;
  canvas.height = (height * faces.length + gap * (faces.length + 1)) * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas indisponible');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  for (let i = 0; i < faces.length; i++) {
    const img = await svgToImage(faces[i], css, width * scale, height * scale);
    ctx.drawImage(img, gap, gap + i * (height + gap), width, height);
  }
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('export PNG impossible'))), 'image/png'),
  );
}
