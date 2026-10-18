import { useEffect, useState } from 'react';
import { type PosterMotion, posterSrc, posterSrcSet } from '../data/posters';

/** Mêmes conditions que la mise en scène du bureau (hooks/useScrollFx.ts). */
const DESKTOP = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
/** Nombre de copies empilées : la face, puis l'épaisseur. */
const SLAB = 7;

/** Vrai seulement sur ordinateur, après le montage : le HTML prérendu et les mobiles n'ont pas les couches. */
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
 * L'affiche en dalle : l'image entière en façade, et derrière elle des copies assombries,
 * espacées en profondeur, qui forment l'épaisseur. Jamais découpée.
 * Purement décoratif (l'image d'origine, avec son texte alternatif, reste dessous).
 * Le même fichier que l'affiche est réutilisé : aucun téléchargement supplémentaire.
 */
export function PosterScene({ motion, file, sizes }: { motion: PosterMotion; file: string; sizes: string }) {
  return (
    <div className={`poster__scene slab--${motion}`} aria-hidden="true">
      {Array.from({ length: SLAB }, (_, i) => SLAB - 1 - i).map((k) => (
        <img
          key={k}
          className={`scene__slab${k === 0 ? ' scene__slab--face' : ''}`}
          src={posterSrc(file, 800)}
          srcSet={posterSrcSet(file)}
          sizes={sizes}
          width={1080}
          height={1080}
          alt=""
          decoding="async"
          style={{ ['--k' as string]: k }}
        />
      ))}
    </div>
  );
}
