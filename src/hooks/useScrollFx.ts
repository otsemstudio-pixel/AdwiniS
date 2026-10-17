import { useEffect } from 'react';

/** Ordinateur (≥ 1024 px), mouvement autorisé. Ailleurs, la page reste statique. */
const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/**
 * Plages de progression, de 0 à 1, selon la position de l'élément dans l'écran :
 *  - enter : du bas de l'écran (0) jusqu'à ce que son haut atteigne 45 % de la hauteur (1) ;
 *  - cover : de son entrée par le bas (0) à sa sortie par le haut (1) ;
 *  - exit  : de son haut collé au haut de l'écran (0) à sa sortie complète (1) ;
 *  - pin   : élément plus haut que l'écran, traversé pendant que son contenu reste collé.
 */
type Range = 'enter' | 'cover' | 'exit' | 'pin';

const TARGETS: [string, Range][] = [
  ['.hero', 'exit'],
  ['.section__head', 'enter'],
  ['.pole', 'enter'],
  ['.philosophy__line', 'enter'],
  ['.marquee', 'cover'],
  ['.plan', 'enter'],
  ['.offer', 'enter'],
  ['.posters__gallery', 'pin'],
  ['.diff__item', 'enter'],
  ['.network__diagram', 'enter'],
  ['.footer__giant', 'enter'],
];

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function progress(range: Range, r: DOMRect, vh: number) {
  switch (range) {
    case 'enter':
      return clamp((vh - r.top) / (vh * 0.55));
    case 'cover':
      return clamp((vh - r.top) / (vh + r.height));
    case 'exit':
      return clamp(-r.top / r.height);
    case 'pin':
      return clamp(-r.top / Math.max(1, r.height - vh));
  }
}

/**
 * Moteur de défilement du bureau : une seule boucle, au plus une fois par image, écrit
 * la progression de chaque élément dans `--p`. Le CSS (classe `fx` sur <html>) en déduit
 * les transformations 3D. Fonctionne dans tous les navigateurs, y compris ceux qui ne
 * gèrent pas encore les animations CSS pilotées par le défilement (Firefox).
 * Toutes les lectures de position précèdent toutes les écritures : une seule mise en page par image.
 */
export function useScrollFx(lang: string) {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const root = document.documentElement;
    let items: { el: HTMLElement; range: Range; last: number }[] = [];
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const values = items.map((it) => progress(it.range, it.el.getBoundingClientRect(), vh));
      items.forEach((it, i) => {
        const v = Math.round(values[i] * 1000) / 1000;
        if (v !== it.last) {
          it.last = v;
          it.el.style.setProperty('--p', String(v));
        }
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // `keep` : on relance seulement la liste (changement de langue) sans retirer la classe,
    // sinon la galerie figée perdrait sa hauteur un instant et la page sauterait.
    const stop = (keep = false) => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(frame);
      frame = 0;
      items.forEach((it) => it.el.style.removeProperty('--p'));
      items = [];
      if (!keep) root.classList.remove('fx');
    };
    const start = () => {
      stop(mq.matches);
      if (!mq.matches) return;
      items = TARGETS.flatMap(([sel, range]) =>
        [...document.querySelectorAll<HTMLElement>(sel)].map((el) => ({ el, range, last: -1 })),
      );
      root.classList.add('fx');
      window.addEventListener('scroll', request, { passive: true });
      window.addEventListener('resize', request);
      update();
    };

    start();
    mq.addEventListener('change', start);
    return () => {
      mq.removeEventListener('change', start);
      stop(true);
    };
  }, [lang]);
}
