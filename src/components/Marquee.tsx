import { mark } from '../data/brand';

/**
 * Bandeaux défilants : deux pistes pleine largeur, la seconde en sens inverse et plus lente.
 * Chaque séquence est dupliquée dans le DOM et la piste glisse de 0 à −50 % en boucle :
 * le doublon rend la jointure invisible. Seul `transform` est animé (compositeur).
 * Décoratif : masqué aux lecteurs d'écran (les mêmes informations sont dans les sections).
 *
 * Le symbole séparateur est déclaré une seule fois (<symbol>) puis réutilisé (<use>) :
 * vingt copies du tracé complet alourdiraient le HTML d'environ 50 Ko.
 */
export function Marquee({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <svg width="0" height="0" className="marquee__defs" focusable="false">
        <symbol id="marquee-mark" viewBox={mark.viewBox}>
          <g fill="none" stroke="currentColor" strokeWidth={mark.strokeWidth} strokeLinecap={mark.linecap} strokeLinejoin="round">
            {mark.strokes.concat(mark.sparks).map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </symbol>
      </svg>
      <Track items={primary} className="marquee__track--primary" />
      <Track items={secondary} className="marquee__track--secondary" />
    </div>
  );
}

function Track({ items, className }: { items: string[]; className: string }) {
  const sequence = (copy: number) =>
    items.map((item, i) => (
      <span key={`${copy}-${i}`} className="marquee__item">
        {item}
        <svg className="marquee__sep" focusable="false">
          <use href="#marquee-mark" />
        </svg>
      </span>
    ));
  return (
    <div className="marquee__row">
      <div className={`marquee__track ${className}`}>
        {sequence(0)}
        {sequence(1)}
      </div>
    </div>
  );
}
