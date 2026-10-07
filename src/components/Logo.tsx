interface LogoProps {
  /** Hauteur rendue en pixels. Sous 24 px, la réserve est épaissie pour ne pas se refermer. */
  size?: number;
  /** Couleur de la barre-réserve : doit être celle du fond sur lequel le logo est posé. */
  cut?: string;
  /** Laisser vide quand le logo est accompagné du nom écrit (évite une double lecture). */
  label?: string;
  className?: string;
}

/** Monogramme A en trois pièces ; la barre est une réserve qui reprend la couleur du fond. */
export function Logo({ size = 40, cut = 'var(--bg)', label, className }: LogoProps) {
  const thick = size < 24;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d="M14 90 L44 10 L56 10 L26 90 Z" fill="currentColor" />
      <path d="M86 90 L56 10 L44 10 L74 90 Z" fill="currentColor" />
      {thick ? (
        <rect x="24" y="54.5" width="52" height="14" fill={cut} />
      ) : (
        <rect x="24" y="56" width="52" height="11" fill={cut} />
      )}
    </svg>
  );
}

/** Verrouillage horizontal : symbole, « Adwini » en Fraunces, « STUDIO » espacé en terre cuite. */
export function Lockup({ size = 40, cut }: { size?: number; cut?: string }) {
  return (
    <span className="lockup" style={{ fontSize: `${size}px` }}>
      <Logo size={size} cut={cut} />
      <span className="lockup__words">
        <span className="lockup__name">Adwini</span>
        <span className="lockup__studio">Studio</span>
      </span>
    </span>
  );
}
