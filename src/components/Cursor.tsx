import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

/** Souris uniquement : jamais sur écran tactile. */
const MOUSE = '(hover: hover) and (pointer: fine)';
const LINK = 'a[href], button, [role="button"], label, summary, select, input[type="checkbox"], input[type="radio"]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

/**
 * Curseur du site : une main taillée en facettes, index levé ; le bout du doigt est exactement
 * le point de clic. Sur ce qui se clique, la main s'incline pour pointer ; au clic, elle appuie ;
 * sur une affiche, une étiquette « Voir » apparaît ; au-dessus d'un champ, le curseur texte reprend la main.
 * Les positions passent par transform, une fois par image ; aucune mise à jour React au mouvement.
 * Sans souris, sans JavaScript ou dans une fenêtre modale, le curseur du système reste en place.
 */
export function Cursor() {
  const { t } = useLanguage();
  const [on, setOn] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const hand = useRef<HTMLDivElement>(null);

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
    root.classList.add('has-cursor');
    let x = -100;
    let y = -100;
    let frame = 0;

    const render = () => {
      frame = 0;
      hand.current!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
      <div ref={hand} className="cursor__hand">
        <svg viewBox="0 0 40 40" focusable="false">
          {/* Facettes de la main ; le bout de l'index (16, 0.5) est le point de clic. */}
          <polygon className="facet facet--2" points="16,0.5 13,3 13,20 16,20" />
          <polygon className="facet facet--1" points="16,0.5 19,3 19,20 16,20" />
          <polygon className="facet facet--3" points="19,13 24,12.5 24.5,22 19,22" />
          <polygon className="facet facet--5" points="24,14 29,14 29.5,23 24.5,22" />
          <polygon className="facet facet--3" points="29,16 33,17 33,24 29.5,23" />
          <polygon className="facet facet--7" points="13,20 22,22 20,38 14,38 10,31 9,26 13,27" />
          <polygon className="facet facet--4" points="13,20 33,24 32,31 27,38 20,38 22,22" />
          <polygon className="facet facet--6" points="13,20 8,16.5 5.5,18.5 9,26 13,27" />
        </svg>
        <span className="cursor__label">{t.posters.open.split(' ')[0]}</span>
      </div>
    </div>
  );
}
