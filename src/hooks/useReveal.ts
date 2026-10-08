import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Révélations au défilement : un seul IntersectionObserver pour toute la page.
 * Chaque élément `[data-reveal]` reçoit la classe `is-in` une seule fois,
 * dès que 15 % de sa surface est visible. Le CSS fait le reste (masques, volets, tracés).
 * Relancé à chaque changement de langue pour capter les éléments recréés.
 */
export function useRevealAll(key: unknown) {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);
}
