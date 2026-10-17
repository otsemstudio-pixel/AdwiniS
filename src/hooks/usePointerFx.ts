import { useEffect } from 'react';

/** Ordinateur avec souris uniquement : jamais sur écran tactile, jamais en mouvement réduit. */
const DESKTOP = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Effets de pointeur, bureau uniquement, un seul écouteur délégué pour toute la page :
 *  - [data-tilt]   : l'élément s'incline en 3D vers la souris (--rx, --ry) et un reflet la suit (--px, --py) ;
 *  - [data-magnet] : l'élément est attiré de quelques pixels vers la souris (--mx, --my).
 * Les variables sont écrites au plus une fois par image (rAF) et seuls transform/translate
 * les consomment en CSS : rien ne déclenche de mise en page.
 */
export function usePointerFx() {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const reset = (el: HTMLElement | null, vars: string[]) => {
      if (!el) return;
      el.classList.remove('is-pointed');
      vars.forEach((v) => el.style.removeProperty(v));
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tilt !== tilted) {
        reset(tilted, ['--rx', '--ry', '--px', '--py']);
        tilted = tilt;
      }
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        tilt.classList.add('is-pointed');
        tilt.style.setProperty('--ry', `${((x - 0.5) * 14).toFixed(2)}deg`);
        tilt.style.setProperty('--rx', `${((0.5 - y) * 14).toFixed(2)}deg`);
        tilt.style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
        tilt.style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
      }

      const mag = target?.closest<HTMLElement>('[data-magnet], .btn') ?? null;
      if (mag !== magnet) {
        reset(magnet, ['--mx', '--my']);
        magnet = mag;
      }
      if (mag && !mag.closest('dialog, .menu')) {
        const r = mag.getBoundingClientRect();
        mag.classList.add('is-pointed');
        mag.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
        mag.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      reset(tilted, ['--rx', '--ry', '--px', '--py']);
      reset(magnet, ['--mx', '--my']);
      tilted = magnet = null;
    };

    const bind = () => {
      if (mq.matches) {
        document.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
      } else {
        document.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        onLeave();
      }
    };
    bind();
    mq.addEventListener('change', bind);
    return () => {
      mq.removeEventListener('change', bind);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);
}
