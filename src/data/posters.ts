/**
 * Réalisations : la série d'affiches « Understand, Become, Build ».
 * Fichiers dans public/realisations/ (WebP 480, 800 et 1080 px). Les textes (titre, thème,
 * description, parti pris, texte alternatif) sont dans content.*.ts → posters.items,
 * dans le même ordre que cette liste.
 *
 * Ajouter une affiche : déposer aff-NN-480.webp, -800.webp, -1080.webp, ajouter une ligne ici
 * et une entrée dans posters.items des deux fichiers de langue.
 */
export const posterFiles = [
  { code: 'AFF—001', file: 'aff-01' },
  { code: 'AFF—002', file: 'aff-02' },
  { code: 'AFF—003', file: 'aff-03' },
  { code: 'AFF—004', file: 'aff-04' },
  { code: 'AFF—005', file: 'aff-05' },
  { code: 'AFF—006', file: 'aff-06' },
  { code: 'AFF—007', file: 'aff-07' },
  { code: 'AFF—008', file: 'aff-08' },
] as const;

export const POSTER_SIZES = [480, 800, 1080] as const;

const base = import.meta.env.BASE_URL;
export const posterSrc = (file: string, size: number) => `${base}realisations/${file}-${size}.webp`;
export const posterSrcSet = (file: string) => POSTER_SIZES.map((s) => `${posterSrc(file, s)} ${s}w`).join(', ');
