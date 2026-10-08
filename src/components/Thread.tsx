/**
 * Le fil : un trait continu vertical le long de la marge gauche, qui relie toutes
 * les sections et se dessine par paliers jusqu'au bas de la section active.
 * La progression ne change que lorsque la section active change (IntersectionObserver),
 * jamais à chaque image : la transition CSS fait le mouvement (transform, composité).
 */
export function Thread({ progress }: { progress: number }) {
  return (
    <div className="thread" aria-hidden="true">
      <span className="thread__line" style={{ transform: `scaleY(${progress})` }} />
    </div>
  );
}
