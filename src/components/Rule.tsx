/** Séparateur : un trait de 2 px à extrémités arrondies, jamais une bordure de 1 px. */
export function Rule({ className = '' }: { className?: string }) {
  return <hr className={`rule ${className}`} />;
}
