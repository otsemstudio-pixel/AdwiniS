import { useEffect } from 'react';

const TILT_VARS = ['--rx', '--ry', '--dx', '--dy', '--dm'];
/** Ordinateur avec souris uniquement : jamais sur écran tactile, jamais en mouvement réduit. */
const DESKTOP = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Effets de pointeur, bureau uniquement, un seul écouteur délégué pour toute la page :
 *  - [data-tilt], .card : l'élément s'incline en 3D vers la souris (--rx, --ry en degrés ; --dx, --dy,
 *    --dm en nombres pour la propriété `rotate` des cartes). La valeur de data-tilt règle l'amplitude ;
 *    un parent [data-tilt-zone] étend la zone sensible (le hero entier pilote le symbole 3D) ;
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

      const zone = target?.closest<HTMLElement>('[data-tilt-zone]') ?? null;
      const tilt = target?.closest<HTMLElement>('[data-tilt], .card') ?? zone?.querySelector<HTMLElement>('[data-tilt]') ?? null;
      if (tilt !== tilted) {
        reset(tilted, TILT_VARS);
        tilted = tilt;
      }
      if (tilt && !tilt.closest('dialog')) {
        const r = (zone && zone.contains(tilt) && !tilt.matches('.card') ? zone : tilt).getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const k = Number(tilt.dataset.tilt) || 1;
        tilt.classList.add('is-pointed');
        tilt.style.setProperty('--ry', `${(x * 14 * k).toFixed(2)}deg`);
        tilt.style.setProperty('--rx', `${(-y * 14 * k).toFixed(2)}deg`);
        tilt.style.setProperty('--dx', x.toFixed(3));
        tilt.style.setProperty('--dy', y.toFixed(3));
        tilt.style.setProperty('--dm', Math.hypot(x, y).toFixed(3));
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
      reset(tilted, TILT_VARS);
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
