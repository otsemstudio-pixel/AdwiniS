/**
 * Fonds animés du réseau : une petite scène de motion design par métier, en trait, dans les
 * couleurs du site. Aucun fichier vidéo : du SVG et du texte animés en CSS (transform, opacity,
 * et tracé du trait pour l'illustration). Purement décoratif : masqué aux lecteurs d'écran.
 * Les scènes ne jouent que lorsque la liste est à l'écran (classe is-playing, voir Network.tsx).
 */
export type SceneKind = 'motion' | 'illustration' | 'translation' | 'voice' | 'code';

/** Salutations de langues parlées sur le continent et au-delà : le métier de traducteur, en mouvement. */
const GREETINGS = ['Bonjour', 'Hello', 'Muraho', 'Habari', 'Akwaaba', 'Sannu', 'Mbote', 'Dumela', 'Sawubona', 'Salaam'];

const CODE = [
  ['const', " studio = 'Adwini';"],
  ['export function', ' Hero() {'],
  ['  return', ' <Title lang="fr" />;'],
  ['}', ''],
  ['await', " deploy({ to: 'Kigali' });"],
  ['const', ' ideas = africa.map(see);'],
  ['if', ' (brief.ready) build();'],
  ['import', " { culture } from 'roots';"],
];

/** Hauteurs des barres de l'onde (fixes : le rendu serveur et le navigateur doivent coïncider). */
const BARS = [3, 5, 8, 6, 9, 12, 7, 10, 14, 9, 6, 11, 15, 10, 7, 12, 16, 11, 8, 13, 9, 6, 10, 14, 12, 8, 11, 7, 5, 9, 12, 8, 6, 10, 7, 4];

export function NetworkScene({ kind }: { kind: SceneKind }) {
  return (
    <div className={`nscene nscene--${kind}`} aria-hidden="true">
      {kind === 'motion' && (
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" focusable="false">
          <path className="nscene__curve" d="M0 92 C 80 92, 110 24, 200 24 S 320 98, 400 58" pathLength={1} />
          <line className="nscene__track" x1="0" y1="108" x2="400" y2="108" />
          {[40, 140, 240, 340].map((x) => (
            <rect key={x} className="nscene__key" x={x - 4} y={104} width="8" height="8" transform={`rotate(45 ${x} 108)`} />
          ))}
          <line className="nscene__playhead" x1="0" y1="10" x2="0" y2="114" />
          <rect className="nscene__shape nscene__shape--square" x="262" y="40" width="26" height="26" />
          <circle className="nscene__shape nscene__shape--circle" cx="320" cy="52" r="13" />
          <path className="nscene__shape nscene__shape--tri" d="M360 66 L376 38 L392 66 Z" />
        </svg>
      )}
      {kind === 'illustration' && (
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" focusable="false">
          <path
            className="nscene__draw"
            d="M8 96 C 40 26, 82 22, 104 62 S 152 112, 182 62 S 232 4, 262 52 S 322 112, 350 44 C 360 20, 384 18, 392 40"
            pathLength={1}
          />
          <path className="nscene__draw nscene__draw--2" d="M150 100 C 170 80, 196 82, 210 98 M222 30 C 236 16, 258 16, 270 30" pathLength={1} />
          <g className="nscene__sparks">
            <path d="M300 18 L304 6 M312 22 L322 14 M314 32 L326 32" />
          </g>
        </svg>
      )}
      {kind === 'translation' && (
        <div className="nscene__words">
          {[0, 1].map((row) => (
            <div key={row} className={`nscene__row nscene__row--${row + 1}`}>
              {[0, 1].map((copy) => (
                <span key={copy}>
                  {(row ? [...GREETINGS].reverse() : GREETINGS).map((w) => (
                    <span key={w} className="nscene__word">
                      {w}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
      {kind === 'voice' && (
        <svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" focusable="false">
          <circle className="nscene__pulse" cx="34" cy="60" r="16" />
          <circle className="nscene__pulse nscene__pulse--2" cx="34" cy="60" r="16" />
          <circle className="nscene__mic" cx="34" cy="60" r="6" />
          {BARS.map((h, i) => (
            <rect
              key={i}
              className="nscene__bar"
              x={72 + i * 9}
              y={60 - h * 2.6}
              width="4"
              height={h * 5.2}
              rx="2"
              style={{ ['--i' as string]: i }}
            />
          ))}
        </svg>
      )}
      {kind === 'code' && (
        <div className="nscene__code">
          <div className="nscene__lines">
            {[0, 1].map((copy) =>
              CODE.map(([kw, rest], i) => (
                <p key={`${copy}-${i}`}>
                  <b>{kw}</b>
                  {rest}
                </p>
              )),
            )}
          </div>
          <span className="nscene__caret" />
        </div>
      )}
    </div>
  );
}
