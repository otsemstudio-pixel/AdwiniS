import { useEffect, useState } from 'react';
import { type PosterScene as Scene, posterSrc, posterSrcSet } from '../data/posters';

/** Mêmes conditions que la mise en scène du bureau (hooks/useScrollFx.ts). */
const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
/** Nombre de copies empilées pour une affiche en dalle. */
const SLAB = 7;

/** Vrai seulement sur ordinateur, après le montage : le HTML prérendu et les mobiles n'ont pas les plans. */
export function useDesktopScenes() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return on;
}

/**
 * L'affiche en volume : des plans découpés dans la même image, à des profondeurs différentes.
 * Purement décoratif (l'image d'origine, avec son texte alternatif, reste dessous).
 * Le même fichier que l'affiche est réutilisé : aucun téléchargement supplémentaire.
 */
export function PosterScene({ scene, file, sizes }: { scene: Scene; file: string; sizes: string }) {
  const img = (key: string | number, className: string, style: Record<string, string | number>) => (
    <img
      key={key}
      className={className}
      src={posterSrc(file, 800)}
      srcSet={posterSrcSet(file)}
      sizes={sizes}
      width={1080}
      height={1080}
      alt=""
      decoding="async"
      style={style}
    />
  );
  return (
    <div className="poster__scene" aria-hidden="true" style={{ ['--bg' as string]: scene.bg }}>
      {scene.slab
        ? Array.from({ length: SLAB }, (_, i) => SLAB - 1 - i).map((k) =>
            img(k, `scene__layer scene__slab${k === 0 ? ' scene__slab--face' : ''}`, { ['--k' as string]: k }),
          )
        : scene.layers.map((l, i) =>
            img(i, `scene__layer${l.fx ? ` scene--${l.fx}` : ''}`, {
              clipPath: l.clip,
              transformOrigin: l.origin ?? '50% 50%',
              ['--z' as string]: l.z,
              ['--delay' as string]: `${l.delay ?? 0}s`,
            }),
          )}
    </div>
  );
}
