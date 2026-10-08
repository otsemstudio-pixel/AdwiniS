/**
 * Tracés de la marque Adwini.
 *
 * [LOGO-MARK.SVG] — MARQUE PROVISOIRE. Quand le fichier officiel est fourni :
 *  1. copier dans `strokes` les attributs `d` des tracés du trait continu (la main) ;
 *  2. copier dans `sparks` les trois éclats ;
 *  3. ajuster `viewBox` et `strokeWidth` à ceux du fichier.
 * Les tracés doivent être des traits (stroke), pas des aplats : le site les colore
 * en `currentColor`, les dessine à l'apparition (stroke-dashoffset) et réutilise
 * les éclats comme marqueur d'accent.
 *
 * Le wordmark (« Adwini Studio ») est un tracé figé : voir brand.wordmark.ts.
 */
export { wordmarkInline, wordmarkStacked } from './brand.wordmark';

export const mark = {
  viewBox: '0 0 100 100',
  strokeWidth: 5,
  /** Trait continu : la main. */
  strokes: [
    'M34 94C33 84 32 76 30 68C26 62 18 56 15 50C13 46 17 42 21 45C25 48 29 53 32 56L31 24C31 19 38 19 38 24L39 46L40 16C40 11 47 11 47 16L48 44L50 20C50 15 57 15 57 20L57 47L60 30C61 25 67 26 66 31L64 60C63 72 60 82 58 94',
  ],
  /** Les trois éclats, en éventail, en haut à droite. */
  sparks: ['M70 17L71 8', 'M74 22L80 14', 'M77 30L86 27'],
};

/** Les éclats seuls, recadrés : marqueur d'accent posé à côté d'un mot. */
export const sparksMarker = {
  viewBox: '66 4 24 30',
  paths: mark.sparks,
};
