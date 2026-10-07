import { useEffect, useRef } from 'react';

/**
 * Ajoute la classe `is-visible` aux éléments `[data-reveal]` contenus dans la
 * référence quand ils entrent dans l'écran. Un seul observateur par conteneur,
 * déconnecté dès que tout est apparu. Avec `prefers-reduced-motion`, le CSS
 * affiche déjà tout : on ne fait rien.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    let remaining = targets.length;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          if (--remaining === 0) observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
