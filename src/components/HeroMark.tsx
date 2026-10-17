/** Nombre de couches : leur empilement en profondeur donne son épaisseur au symbole. */
const LAYERS = 8;

/**
 * Le symbole Adwini en volume, dans le hero (ordinateur uniquement, masqué ailleurs en CSS).
 * Huit copies du tracé, espacées en profondeur (translateZ), forment un objet 3D qui se balance
 * doucement, suit la souris sur tout le hero et pivote quand on quitte le hero.
 * Le tracé est le <symbol> déclaré une fois par le bandeau défilant (#marquee-mark).
 * Purement décoratif : masqué aux lecteurs d'écran.
 */
export function HeroMark() {
  return (
    <div className="hero-mark" data-tilt="2.2" aria-hidden="true">
      <div className="hero-mark__body">
        {/* De l'arrière vers l'avant : la face (k = 0) est peinte en dernier, donc toujours au-dessus. */}
        {Array.from({ length: LAYERS }, (_, i) => LAYERS - 1 - i).map((k) => (
          // Chaque couche est un <span> : Chrome aplatit un <svg> placé directement dans un espace 3D.
          <span key={k} className="hero-mark__layer" style={{ ['--k' as string]: k }}>
            <svg viewBox="0 0 100 100" focusable="false">
              <use href="#marquee-mark" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
