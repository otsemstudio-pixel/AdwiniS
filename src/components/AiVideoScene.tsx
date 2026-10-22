/**
 * Fond animé de l'offre « Vidéo IA professionnelle » : un produit en préparation, montré en train
 * de se faire. Une pellicule défile, des images se génèrent une à une sous une ligne de balayage,
 * un réseau de points se relie (la réflexion), un bouton lecture bat, et une barre d'avancement
 * se remplit lentement sans jamais atteindre la fin.
 * Aucun fichier vidéo : du SVG animé en CSS (transform, opacity, tracé du trait).
 * Ne joue que sur ordinateur et à l'écran (classe is-playing) ; ailleurs, une image fixe.
 * Purement décoratif : masqué aux lecteurs d'écran.
 */

/** Points du réseau (fixes : le rendu serveur et le navigateur doivent coïncider). */
const NODES: [number, number][] = [
  [820, 70],
  [900, 40],
  [960, 110],
  [1040, 60],
  [1100, 130],
  [880, 160],
  [1000, 190],
  [1140, 50],
];
const LINKS: [number, number][] = [
  [0, 1],
  [1, 3],
  [0, 5],
  [5, 2],
  [2, 3],
  [3, 7],
  [2, 6],
  [6, 4],
  [4, 7],
  [1, 2],
];

export function AiVideoScene() {
  return (
    <div className="aiscene" aria-hidden="true">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" focusable="false">
        {/* Pellicule : deux rangées de perforations qui défilent. */}
        <g className="aiscene__film">
          {Array.from({ length: 34 }, (_, i) => (
            <g key={i}>
              <rect x={i * 40} y="14" width="18" height="10" rx="2" />
              <rect x={i * 40} y="276" width="18" height="10" rx="2" />
            </g>
          ))}
        </g>
        <line className="aiscene__rail" x1="0" y1="34" x2="1200" y2="34" />
        <line className="aiscene__rail" x1="0" y1="266" x2="1200" y2="266" />

        {/* Images en cours de génération, révélées l'une après l'autre. */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} className="aiscene__frame" style={{ ['--i' as string]: i }}>
            <rect x={60 + i * 130} y="70" width="110" height="160" rx="10" />
            <rect className="aiscene__fill" x={60 + i * 130} y="70" width="110" height="160" rx="10" />
          </g>
        ))}
        <line className="aiscene__scan" x1="60" y1="60" x2="60" y2="240" />

        {/* La réflexion : un réseau de points qui se relient. */}
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            className="aiscene__link"
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
            pathLength={1}
            style={{ ['--i' as string]: i }}
          />
        ))}
        {NODES.map(([x, y], i) => (
          <circle key={i} className="aiscene__node" cx={x} cy={y} r="6" style={{ ['--i' as string]: i }} />
        ))}

        {/* Lecture, et avancement qui ne finit jamais : le produit se prépare. */}
        <g className="aiscene__play">
          <circle cx="760" cy="200" r="30" />
          <path d="M752 186 L774 200 L752 214 Z" />
        </g>
        <rect className="aiscene__track" x="60" y="250" width="1080" height="4" rx="2" />
        <rect className="aiscene__progress" x="60" y="250" width="1080" height="4" rx="2" />
      </svg>
    </div>
  );
}
