import { useRef, useState } from 'react';
import { PosterScene, useDesktopScenes } from '../components/PosterScene';
import { PosterViewer } from '../components/PosterViewer';
import { Section } from '../components/Section';
import { posterFiles, posterScenes, posterSrc, posterSrcSet } from '../data/posters';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Réalisations : la série d'affiches. Sur ordinateur, la section se fige et la série
 * défile à l'horizontale, en carrousel 3D piloté par le défilement (CSS pur).
 * Sur mobile et tablette, une simple rangée qui se balaie au doigt.
 * Chaque affiche ouvre une visionneuse avec le message et le parti pris graphique.
 */
export function Posters({ index }: { index: number }) {
  const { t } = useLanguage();
  const p = t.posters;
  const [open, setOpen] = useState<number | null>(null);
  const n = posterFiles.length;
  const gallery = useRef<HTMLDivElement>(null);
  const scenes = useDesktopScenes();
  const sizes = '(min-width: 1024px) min(34vw, 62vh), (min-width: 768px) 46vw, 82vw';

  // Carrousel figé (bureau) : les affiches défilent selon la position verticale de la page.
  // Au clavier seulement (focus visible), l'affiche qui reçoit le focus est ramenée au centre ;
  // un clic de souris ne doit jamais faire défiler la page.
  const center = (i: number, target: EventTarget) => {
    const el = gallery.current;
    if (!el || !document.documentElement.classList.contains('fx')) return;
    if (!(target instanceof Element) || !target.matches(':focus-visible')) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (run * i) / (n - 1), behavior: 'instant' as ScrollBehavior });
  };

  return (
    <Section
      id="realisations"
      index={index}
      label={p.label}
      title={p.title}
      aside={<p className="lead">{p.intro}</p>}
      className="posters"
    >
      <div ref={gallery} className="posters__gallery" style={{ ['--n' as string]: n }}>
        <div className="posters__stage">
          <p className="posters__giant" aria-hidden="true">
            <span>Understand</span> <span>Become</span> <span>Build</span>
          </p>
          <div className="posters__meta">
            <p className="code">{p.series}</p>
            <p className="posters__count" aria-hidden="true">
              <span className="posters__count-window">
                <span className="posters__count-strip">
                  {posterFiles.map((f, i) => (
                    <span key={f.code}>{String(i + 1).padStart(2, '0')}</span>
                  ))}
                </span>
              </span>
              <span>/ {String(n).padStart(2, '0')}</span>
            </p>
            <p className="meta posters__hint" aria-hidden="true">
              {p.hint}
            </p>
          </div>
          <ul className="posters__track">
            {posterFiles.map((f, i) => {
              const item = p.items[i];
              return (
                <li key={f.code} className="poster" style={{ ['--i' as string]: i }} onFocus={(e) => center(i, e.target)}>
                  <article className="poster__inner">
                    <div className="poster__frame" data-tilt="">
                      <img
                        className="poster__img"
                        src={posterSrc(f.file, 800)}
                        srcSet={posterSrcSet(f.file)}
                        sizes={sizes}
                        width={1080}
                        height={1080}
                        loading="lazy"
                        decoding="async"
                        alt={item.alt}
                      />
                      {scenes && <PosterScene scene={posterScenes[i]} file={f.file} sizes={sizes} />}
                    </div>
                    <div className="poster__caption">
                      <p className="poster__line">
                        <span className="code">{f.code}</span>
                        <span className="poster__theme">{item.theme}</span>
                      </p>
                      <h3 className="poster__title">
                        <button type="button" className="poster__open" onClick={() => setOpen(i)}>
                          {item.title}
                        </button>
                      </h3>
                      <p className="poster__desc">{item.description}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <div className="posters__bar" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      <PosterViewer index={open} onChange={setOpen} />
    </Section>
  );
}
