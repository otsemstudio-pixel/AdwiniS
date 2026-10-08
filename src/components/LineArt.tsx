/**
 * Illustrations des trois pôles : chacune est UNE seule ligne qui serpente,
 * comme le trait du logo. Elles se tracent à l'apparition (stroke-dashoffset, CSS).
 */

const ART = {
  // Identité : la ligne dessine un cercle, s'en échappe en forme de lettre, puis signe.
  identity:
    'M14 128C40 128 52 118 60 98C70 72 62 36 96 26C128 16 156 44 150 78C144 110 106 122 92 100C80 80 104 60 124 70C140 78 138 100 146 112C154 124 170 124 180 106L204 40L214 128C216 138 226 138 232 128',
  // Interfaces : un écran tracé d'un trait, ses blocs, puis le parcours vers une action.
  interfaces:
    'M58 140V34C58 26 63 21 71 21H125C133 21 138 26 138 34V140C138 148 133 153 125 153H71C63 153 58 148 58 140V44H138H74V62H122V78H74V94H106V112H122C130 112 132 120 132 124C134 132 160 132 176 112C188 98 200 98 210 108C220 118 214 132 202 132C190 132 186 118 196 110',
  // Récits : une courbe de données qui monte, s'enroule, et finit en bouton de lecture.
  stories:
    'M12 132C34 132 38 104 56 104C74 104 76 120 92 120C112 120 112 70 134 70C150 70 150 92 162 92C176 92 176 40 196 40V122L232 81L196 40',
} as const;

export type ArtName = keyof typeof ART;

export function LineArt({ name }: { name: ArtName }) {
  return (
    <svg
      viewBox="0 0 240 160"
      className="line-art"
      data-reveal=""
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ART[name]} pathLength={1} />
    </svg>
  );
}

/**
 * Pictogrammes dessinés par le studio (engagement n° 5) :
 * portefeuille mobile money, moto-taxi, étal de marché, franc CFA.
 */
const ICONS = [
  'M14 6h16v36H14zM14 33h16M20 13h4M20 19h4M20 25h4M43 31a6 6 0 1 1-12 0a6 6 0 0 1 12 0M37 28v6',
  'M18 34a6 6 0 1 1-12 0a6 6 0 0 1 12 0M42 34a6 6 0 1 1-12 0a6 6 0 0 1 12 0M12 34l9-12h10l5 12M21 22l-3-6h-5M31 22l3-8h5M23 28h9',
  'M5 9h38l-3 9H8zM14 9l-1 9M24 9v9M34 9l1 9M8 18v24M40 18v24M6 32h36M16 27a2 2 0 1 0 0 .1M24 27a2 2 0 1 0 0 .1M32 27a2 2 0 1 0 0 .1',
  'M4 12h40v24H4zM4 18c4 0 6-2 6-6M44 18c-4 0-6-2-6-6M4 30c4 0 6 2 6 6M44 30c-4 0-6 2-6 6M21 19h-3v10h3M29 19h-4v10M25 24h3',
];

export function Pictograms({ names }: { names: readonly string[] }) {
  return (
    <ul className="pictos">
      {ICONS.map((d, i) => (
        <li key={i} className="pictos__item">
          <svg
            viewBox="0 0 48 48"
            width="56"
            height="56"
            aria-hidden="true"
            focusable="false"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={d} />
          </svg>
          <span>{names[i]}</span>
        </li>
      ))}
    </ul>
  );
}
