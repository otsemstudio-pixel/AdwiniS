/**
 * QR code → un seul chemin SVG. L'encodeur (uqr, ~4 Ko compressé) est chargé
 * à la demande, hors du bundle initial.
 */

export interface QrShape {
  size: number;
  path: string;
}

type Encode = typeof import('uqr').encode;
let encoder: Promise<Encode> | null = null;

export const loadQr = () => (encoder ??= import('uqr').then((m) => m.encode));

export function qrToPath(encode: Encode, text: string): QrShape {
  const { data, size } = encode(text, { ecc: 'M', border: 0 });
  let path = '';
  for (let y = 0; y < size; y++) {
    // Les modules contigus d'une ligne sont fusionnés en un seul rectangle.
    let x = 0;
    while (x < size) {
      if (!data[y][x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && data[y][x]) x++;
      path += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  }
  return { size, path };
}
