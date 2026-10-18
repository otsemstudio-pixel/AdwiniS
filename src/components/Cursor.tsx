import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

/** Souris uniquement : jamais sur écran tactile. */
const MOUSE = '(hover: hover) and (pointer: fine)';
const LINK = 'a[href], button, [role="button"], label, summary, select, input[type="checkbox"], input[type="radio"]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

/** Éclats qui suivent la flèche, chacun avec son retard (part de la distance parcourue par image). */
const SHARDS = [0.3, 0.2, 0.13];

/**
 * Curseur du site, en éclats : une flèche taillée en facettes (comme du papier plié) dont la pointe
 * est exactement le point de clic, suivie de trois petits éclats qui la rattrapent avec retard.
 * Sur ce qui se clique, les facettes s'écartent ; au clic, elles se resserrent ; sur une affiche,
 * une étiquette « Voir » apparaît ; au-dessus d'un champ, le curseur texte reprend la main.
 * Les positions passent par transform, une fois par image ; aucune mise à jour React au mouvement.
 * Sans souris, sans JavaScript ou dans une fenêtre modale, le curseur du système reste en place.
 */
export function Cursor() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const shards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia(MOUSE);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('has-cursor');
    let x = -100;
    let y = -100;
    const trail = SHARDS.map(() => ({ x, y }));
    let frame = 0;

    const render = () => {
      frame = 0;
      arrow.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      let moving = false;
      trail.forEach((p, i) => {
        // Chaque éclat parcourt une part de la distance restante (aucun retard en mouvement réduit).
        p.x = still ? x : p.x + (x - p.x) * SHARDS[i];
        p.y = still ? y : p.y + (y - p.y) * SHARDS[i];
        if (Math.abs(x - p.x) > 0.3 || Math.abs(y - p.y) > 0.3) moving = true;
        shards.current[i]!.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      });
      if (moving) frame = requestAnimationFrame(render);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const setState = (target: Element | null) => {
      const b = box.current!;
      b.classList.toggle('is-link', Boolean(target?.closest(LINK)));
      b.classList.toggle('is-view', Boolean(target?.closest('.poster__inner')));
      root.classList.toggle('cursor-text', Boolean(target?.closest(TEXT)));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      root.classList.remove('cursor-out');
      setState(e.target instanceof Element ? e.target : null);
      request();
    };
    const onDown = (e: PointerEvent) => e.pointerType === 'mouse' && box.current!.classList.add('is-down');
    const onUp = () => box.current!.classList.remove('is-down');
    const onLeave = () => root.classList.add('cursor-out');

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    root.classList.add('cursor-out');
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
      root.classList.remove('has-cursor', 'cursor-out', 'cursor-text');
    };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={box} className="cursor" aria-hidden="true">
      {SHARDS.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            shards.current[i] = el;
          }}
          className={`cursor__shard cursor__shard--${i + 1}`}
        >
          <svg viewBox="0 0 20 20" focusable="false">
            <polygon points={['1,1 19,6 7,8', '2,2 17,4 6,18', '1,9 19,1 13,16'][i]} />
          </svg>
        </div>
      ))}
      <div ref={arrow} className="cursor__arrow">
        <svg viewBox="0 0 44 44" focusable="false">
          {/* Facettes de la flèche ; la pointe (1, 1) est le point de clic. */}
          <polygon className="facet facet--1" points="1,1 34,13 16,16" />
          <polygon className="facet facet--2" points="16,16 34,13 27,19" />
          <polygon className="facet facet--3" points="16,16 27,19 30,28" />
          <polygon className="facet facet--4" points="16,16 30,28 28,42 20,29" />
          <polygon className="facet facet--5" points="16,16 20,29 13,34" />
          <polygon className="facet facet--7" points="1,1 16,16 13,34" />
          <polygon className="facet facet--6" points="27,19 42,30 30,28" />
        </svg>
        <span className="cursor__label">{t.posters.open.split(' ')[0]}</span>
      </div>
    </div>
  );
}
