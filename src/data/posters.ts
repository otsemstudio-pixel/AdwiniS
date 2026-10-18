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

/**
 * Mise en volume des affiches (ordinateur uniquement, voir PosterScene.tsx et showcase.css).
 * Chaque affiche devient une dalle épaisse : l'image reste entière, des copies assombries
 * empilées vers l'arrière forment son épaisseur. Seul le mouvement change d'une affiche à l'autre,
 * choisi d'après son message (images-clés slab-* du CSS).
 */
export type PosterMotion = 'drift' | 'sway' | 'stairs' | 'flip' | 'lift' | 'nudge' | 'pull' | 'sink';

export const posterMotions: PosterMotion[] = [
  'drift', // 01 · le billet tourne lentement, comme une pièce
  'sway', // 02 · la foule oscille
  'stairs', // 03 · la dalle gravit les marches
  'flip', // 04 · mythe d'un côté, réalité de l'autre
  'lift', // 05 · la cloche se soulève
  'nudge', // 06 · un sursaut à la lecture du CV
  'pull', // 07 · le plan est tiré vers la femme qui le retient
  'sink', // 08 · la décision pèse, la dalle s'affaisse
];
