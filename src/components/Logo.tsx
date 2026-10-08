import { mark, sparksMarker, wordmarkInline, wordmarkStacked } from '../data/brand';

interface MarkProps {
  size?: number;
  /** Nom accessible ; laisser vide quand le nom du studio est écrit à côté. */
  label?: string;
  /** Joue le tracé d'introduction (une fois par session, voir index.html). */
  intro?: boolean;
  className?: string;
}

/**
 * Le symbole : une main en trait continu et trois éclats.
 * `pathLength="1"` normalise chaque tracé pour l'animation stroke-dashoffset,
 * quelle que soit sa longueur réelle.
 */
export function LogoMark({ size = 40, label, intro, className = '' }: MarkProps) {
  // Sous 24 px, le trait est épaissi pour rester lisible.
  const width = size < 24 ? mark.strokeWidth * 1.4 : mark.strokeWidth;
  return (
    <svg
      viewBox={mark.viewBox}
      width={size}
      height={size}
      className={`mark ${intro ? 'mark--intro' : ''} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {mark.strokes.map((d) => (
        <path key={d} d={d} pathLength={1} className="mark__stroke" />
      ))}
      {mark.sparks.map((d, i) => (
        <path key={d} d={d} pathLength={1} className="mark__spark" style={{ ['--i' as string]: i }} />
      ))}
    </svg>
  );
}

/** Marqueur d'accent : les trois éclats seuls, en terre cuite. À utiliser au plus quatre fois. */
export function Sparks({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={sparksMarker.viewBox}
      className={`sparks ${className}`}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
    >
      {sparksMarker.paths.map((d, i) => (
        <path key={d} d={d} pathLength={1} style={{ ['--i' as string]: i }} />
      ))}
    </svg>
  );
}

/** Wordmark en tracé figé (jamais recomposé en police web). */
export function Wordmark({ stacked = false, height }: { stacked?: boolean; height: number }) {
  const w = stacked ? wordmarkStacked : wordmarkInline;
  return (
    <svg
      viewBox={`0 0 ${w.width} ${w.height}`}
      height={height}
      width={(height * w.width) / w.height}
      className="wordmark"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d={w.d} />
    </svg>
  );
}

/** Verrouillage horizontal (navigation) : symbole à gauche, nom à droite. */
export function LockupHorizontal({ size = 36, intro }: { size?: number; intro?: boolean }) {
  return (
    <span className="lockup lockup--h">
      <LogoMark size={size} intro={intro} />
      <Wordmark height={size * 0.42} />
    </span>
  );
}

/** Verrouillage vertical (formats carrés) : symbole au-dessus, nom centré. */
export function LockupVertical({ size = 96 }: { size?: number }) {
  return (
    <span className="lockup lockup--v">
      <LogoMark size={size} />
      <Wordmark stacked height={size * 0.6} />
    </span>
  );
}
