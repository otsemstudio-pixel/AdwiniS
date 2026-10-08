/** Grille de 12 colonnes rendue visible : filets de 1 px à 8 % d'opacité, par endroits seulement. */
export function GridLines() {
  return (
    <div className="gridlines" aria-hidden="true">
      {Array.from({ length: 13 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
