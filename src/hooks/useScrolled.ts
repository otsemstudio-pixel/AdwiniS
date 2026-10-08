import { useEffect, useState } from 'react';

/**
 * État de la navigation au défilement :
 * - `scrolled` : la page a défilé de plus de 100 px (barre rétractée) ;
 * - `hidden`   : on descend (la barre se retire), on remonte (elle revient).
 *
 * Limité à une comparaison toutes les 100 ms (throttle), jamais à chaque événement,
 * et sans aucune lecture de mise en page : seulement window.scrollY.
 */
export function useNavScroll(threshold = 100) {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let last = window.scrollY;
    let timer = 0;

    const check = () => {
      timer = 0;
      const y = window.scrollY;
      const scrolled = y > threshold;
      const goingDown = y > last + 4;
      const goingUp = y < last - 4;
      last = y;
      setState((prev) => {
        // Ne jamais masquer la barre près du haut, ni quand un de ses éléments a le focus.
        const navFocused = document.activeElement?.closest('.nav') != null;
        const hidden = !scrolled || navFocused ? false : goingDown ? true : goingUp ? false : prev.hidden;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
    };

    const onScroll = () => {
      if (!timer) timer = window.setTimeout(check, 100);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, [threshold]);

  return state;
}
