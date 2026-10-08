import { useEffect, useState } from 'react';

/**
 * Index (1 à 13) de la section qui traverse le milieu de l'écran.
 * IntersectionObserver uniquement : aucun calcul à chaque image de défilement.
 */
export function useActiveSection() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.section));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}
