import { useEffect, useRef } from 'react';
import { posterFiles, posterSrc, posterSrcSet } from '../data/posters';
import { useLanguage } from '../hooks/useLanguage';

interface PosterViewerProps {
  index: number | null;
  onChange: (index: number | null) => void;
}

/**
 * Visionneuse d'affiche : <dialog> modal (focus piégé, Échap ferme, focus rendu au bouton
 * d'origine). Flèches gauche / droite ou boutons pour passer d'une affiche à l'autre.
 */
export function PosterViewer({ index, onChange }: PosterViewerProps) {
  const { t } = useLanguage();
  const p = t.posters;
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const n = posterFiles.length;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) {
      opener.current = document.activeElement;
      el.showModal();
      document.documentElement.classList.add('is-locked');
    } else if (index === null && el.open) {
      el.close();
    }
  }, [index]);

  const handleClose = () => {
    document.documentElement.classList.remove('is-locked');
    (opener.current as HTMLElement | null)?.focus();
    onChange(null);
  };

  const go = (step: number) => index !== null && onChange((index + step + n) % n);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  };

  const f = index !== null ? posterFiles[index] : null;
  const item = index !== null ? p.items[index] : null;

  return (
    <dialog ref={dialog} className="viewer" aria-labelledby="viewer-title" onClose={handleClose} onKeyDown={onKeyDown}>
      {f && item && (
        <div className="viewer__inner" key={f.code}>
          <div className="viewer__media">
            <img
              className="viewer__img"
              src={posterSrc(f.file, 1080)}
              srcSet={posterSrcSet(f.file)}
              sizes="(min-width: 1024px) min(52vw, 82vh), 92vw"
              width={1080}
              height={1080}
              alt={item.alt}
            />
          </div>
          <div className="viewer__text">
            <div className="viewer__top">
              <p className="code">
                {f.code} · {item.theme}
              </p>
              <button type="button" className="btn btn--outline btn--small" onClick={() => dialog.current?.close()}>
                {p.close}
              </button>
            </div>
            <h2 id="viewer-title" className="viewer__title">
              {item.title}
            </h2>
            <section className="viewer__block">
              <h3 className="viewer__label">{p.message}</h3>
              <p>{item.description}</p>
            </section>
            <section className="viewer__block">
              <h3 className="viewer__label">{p.design}</h3>
              <p>{item.design}</p>
            </section>
            <div className="viewer__nav">
              <button type="button" className="btn btn--outline btn--small" onClick={() => go(-1)} aria-label={p.prev}>
                ←
              </button>
              <span className="meta" aria-hidden="true">
                {String(index! + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <button type="button" className="btn btn--outline btn--small" onClick={() => go(1)} aria-label={p.next}>
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
