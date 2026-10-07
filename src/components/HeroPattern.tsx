/**
 * Trame du hero : un module triangulaire (dérivé des jambages du monogramme)
 * répété et pivoté sur une grille 6 × 6, à la manière d'un tissage.
 * Tout est statique ; seule une apparition en séquence de 600 ms au total
 * est jouée en CSS au premier chargement (désactivée en mouvement réduit).
 */

const GRID = 6;
const CELL = 100;

// Les quatre orientations d'un demi-carré : coin plein en haut-gauche, haut-droite, bas-droite, bas-gauche.
// Chaque triangle déborde d'un demi-pixel de sa cellule : les voisins se chevauchent
// et aucune jointure claire n'apparaît à l'anticrénelage.
const TRIANGLES = ['M-.5 -.5H101L-.5 101Z', 'M-1 -.5H100.5V101Z', 'M100.5 -1V100.5H-1Z', 'M-.5 -1L101 100.5H-.5Z'];

// Dans un bloc 2 × 2, quatre triangles tournés vers le centre forment un losange ;
// tournés vers l'extérieur, ils se recomposent avec les blocs voisins.
const INWARD = [
  [2, 3],
  [1, 0],
];
const OUTWARD = [
  [0, 1],
  [3, 2],
];

interface Module {
  key: string;
  x: number;
  y: number;
  d: string;
  tone: 'ink' | 'accent';
}

function buildModules(): Module[] {
  const modules: Module[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const bi = Math.floor(row / 2);
      const bj = Math.floor(col / 2);
      const inward = (bi + bj) % 2 === 0;
      const rot = (inward ? INWARD : OUTWARD)[row % 2][col % 2];
      // Une seule diagonale en terre cuite : l'accent reste rare.
      const tone = inward && bi === bj ? 'accent' : 'ink';
      modules.push({ key: `${row}-${col}`, x: col * CELL, y: row * CELL, d: TRIANGLES[rot], tone });
    }
  }
  return modules;
}

const MODULES = buildModules();
const STEP = 360 / MODULES.length; // 36 modules × 10 ms + 240 ms d'apparition = 600 ms

export function HeroPattern({ label }: { label: string }) {
  return (
    <svg
      className="hero-pattern"
      viewBox={`0 0 ${GRID * CELL} ${GRID * CELL}`}
      role="img"
      aria-label={label}
      focusable="false"
    >
      {MODULES.map((m, i) => (
        // Le déplacement est sur le <g> : l'animation CSS du <path> ne l'écrase pas.
        <g key={m.key} transform={`translate(${m.x} ${m.y})`}>
          <path
            d={m.d}
            className={`hero-pattern__m hero-pattern__m--${m.tone}`}
            style={{ animationDelay: `${Math.round(i * STEP)}ms` }}
          />
        </g>
      ))}
    </svg>
  );
}
