import { pad } from '../utils/format';

/** Compteur discret en bas à droite : « 02 / 13 ». Décoratif : la structure est portée par les titres. */
export function ScrollCounter({ active, total }: { active: number; total: number }) {
  return (
    <p className="counter" aria-hidden="true">
      <span className="counter__now">{pad(active)}</span> / {pad(total)}
    </p>
  );
}
