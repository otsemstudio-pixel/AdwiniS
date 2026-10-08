import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/motion';

interface CountUpProps {
  value: number;
  /** Mise en forme d'une valeur intermédiaire (ex. « 1 200 $ »). */
  format?: (n: number) => string;
}

const DURATION = 1200;
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

/**
 * Chiffre qui compte de zéro à sa valeur à l'entrée dans l'écran, une seule fois.
 *
 * - La valeur finale est dans le HTML prérendu : sans JavaScript, le prix reste lisible.
 * - Un « fantôme » invisible réserve la largeur finale : le texte qui change ne décale rien.
 * - Les lecteurs d'écran lisent toujours la valeur finale, jamais le défilement des chiffres.
 * - requestAnimationFrame est justifié ici : un texte ne peut pas être interpolé en CSS
 *   de façon fiable sur tous les navigateurs (support inégal de @property <integer>).
 */
export function CountUp({ value, format = String }: CountUpProps) {
  const live = useRef<HTMLSpanElement>(null);
  const final = format(value);
  // La mise en forme change d'identité à chaque rendu : on la lit par référence.
  const fmt = useRef(format);
  fmt.current = format;

  useEffect(() => {
    const el = live.current?.firstChild;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    // Lecture de position unique, au montage : un chiffre déjà visible n'est pas animé.
    if (live.current!.getBoundingClientRect().top < window.innerHeight) return;
    // On modifie le nœud texte rendu par React, sans le remplacer : React garde la main sur lui.
    el.nodeValue = fmt.current(0);
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          el.nodeValue = fmt.current(Math.round(value * easeOutExpo(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(live.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.nodeValue = final;
    };
  }, [value, final]);

  return (
    <span className="count">
      <span className="count__ghost" aria-hidden="true">
        {final}
      </span>
      <span className="count__live" ref={live} aria-hidden="true">
        {final}
      </span>
      <span className="visually-hidden">{final}</span>
    </span>
  );
}
