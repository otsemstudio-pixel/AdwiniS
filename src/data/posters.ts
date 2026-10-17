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
 * Mise en volume des affiches (ordinateur uniquement, voir Posters.tsx et showcase.css).
 * Chaque affiche est découpée en plans qui ne se chevauchent pas (`clip`, en % de l'image),
 * posés à des profondeurs différentes (`z`, en px) : en bougeant, ils ne dévoilent jamais
 * de doublon, seulement le fond de l'affiche (`bg`). `fx` nomme le mouvement propre au plan
 * (images-clés scene-* du CSS), `origin` son point d'ancrage, `delay` son décalage (s).
 * `slab` : l'affiche entière devient une dalle épaisse (copies empilées vers l'arrière).
 */
export interface PosterLayer {
  clip: string;
  z: number;
  fx?: 'float' | 'book-l' | 'book-r' | 'cloche' | 'bob' | 'pull' | 'pulse' | 'breathe';
  origin?: string;
  delay?: number;
}

export interface PosterScene {
  bg: string;
  slab?: boolean;
  layers: PosterLayer[];
}

const band = (top: number, bottom: number) => `polygon(0 ${top}%, 100% ${top}%, 100% ${bottom}%, 0 ${bottom}%)`;

export const posterScenes: PosterScene[] = [
  // 01 · Le billet reste au fond, le titre et sa phrase dorée flottent devant.
  {
    bg: '#161616',
    layers: [
      { clip: band(0, 31), z: 0 },
      { clip: band(31, 77.5), z: 60, fx: 'float' },
      { clip: band(77.5, 100), z: 0 },
    ],
  },
  // 02 · Les lignes du titre avancent l'une après l'autre, comme des lames.
  {
    bg: '#121212',
    layers: [
      { clip: band(0, 34), z: 20, fx: 'float', delay: 0 },
      { clip: band(34, 48), z: 40, fx: 'float', delay: 0.4 },
      { clip: band(48, 63.5), z: 60, fx: 'float', delay: 0.8 },
      { clip: band(63.5, 75.3), z: 80, fx: 'float', delay: 1.2 },
      { clip: band(75.3, 100), z: 10 },
    ],
  },
  // 03 · L'escalier : l'affiche devient une dalle épaisse qui gravit les marches.
  { bg: 'transparent', slab: true, layers: [{ clip: band(0, 100), z: 0 }] },
  // 04 · Mythe et réalité s'ouvrent comme un livre ; l'homme se tient devant.
  {
    bg: '#101010',
    layers: [
      { clip: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', z: 0, fx: 'book-l', origin: '100% 50%' },
      { clip: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)', z: 0, fx: 'book-r', origin: '0 50%' },
      {
        clip: 'polygon(45% 51%, 52% 49.5%, 58% 52%, 59% 64%, 56% 69%, 68% 72%, 74% 80%, 74% 96%, 28% 96%, 29% 82%, 35% 74%, 42% 72%, 41% 68%, 43% 64%)',
        z: 80,
      },
    ],
  },
  // 05 · La cloche se soulève vraiment au-dessus de l'assiette vide.
  {
    bg: '#f3f3f3',
    layers: [
      { clip: band(0, 50), z: 50, fx: 'cloche', origin: '50% 0' },
      { clip: band(50, 71), z: 25 },
      { clip: band(71, 100), z: 10, fx: 'bob', delay: 0.5 },
    ],
  },
  // 06 · Le titre flotte au-dessus de l'homme ; « CV » bat comme une alerte.
  {
    bg: '#d9e8f7',
    layers: [
      // Le titre, avec une encoche à la place de « CV », qui vit sur son propre plan (jamais en double).
      { clip: 'polygon(0 0, 100% 0, 100% 19%, 81% 19%, 81% 32%, 100% 32%, 100% 38%, 0 38%)', z: 50, fx: 'float' },
      { clip: band(38, 100), z: 0 },
      { clip: 'polygon(81% 19%, 100% 19%, 100% 32%, 81% 32%)', z: 50, fx: 'pulse', origin: '88% 25.5%' },
    ],
  },
  // 07 · Le grand plan bleu bascule, tiré par la femme qui le retient.
  {
    bg: '#ffffff',
    layers: [
      { clip: 'polygon(0 0, 100% 0, 100% 18%, 65.5% 70.5%, 0 43%)', z: 50, fx: 'pull', origin: '65.5% 70.5%' },
      { clip: 'polygon(0 43%, 65.5% 70.5%, 100% 18%, 100% 100%, 0 100%)', z: 0 },
    ],
  },
  // 08 · La colonne de texte s'avance ; la silhouette respire, seule.
  {
    bg: '#ffffff',
    layers: [
      { clip: 'polygon(0 0, 65% 0, 65% 100%, 0 100%)', z: 0, fx: 'breathe', origin: '30% 100%' },
      { clip: 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)', z: 70, fx: 'float', delay: 0.6 },
    ],
  },
];
