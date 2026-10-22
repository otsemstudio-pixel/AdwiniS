import { type RefObject, useEffect } from 'react';

/**
 * Pose la classe `is-playing` sur l'élément tant qu'il est à l'écran, sur ordinateur et si le
 * mouvement est autorisé. Les animations décoratives ne sont déclarées que sous cette classe :
 * rien n'est préparé au chargement de la page, tout s'arrête hors de l'écran, et sur téléphone
 * la scène reste une image fixe (le défilement reste fluide).
 */
export function usePlayWhenVisible(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    let visible = false;
    const sync = () => el.classList.toggle('is-playing', visible && mq.matches);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    mq.addEventListener('change', sync);
    return () => {
      io.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, [ref]);
}
