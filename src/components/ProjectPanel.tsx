import { useEffect, useRef } from 'react';
import type { Project } from '../data/types';
import { useLanguage } from '../hooks/useLanguage';

interface ProjectPanelProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Panneau plein écran d'un concept. <dialog> modal : focus piégé, Échap ferme,
 * le focus revient automatiquement à la carte qui l'a ouvert.
 */
export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  const { t } = useLanguage();
  const w = t.work;
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (project && !el.open) {
      opener.current = document.activeElement;
      el.showModal();
      el.scrollTop = 0;
      document.documentElement.classList.add('is-locked');
    } else if (!project && el.open) {
      el.close();
    }
  }, [project]);

  const handleClose = () => {
    document.documentElement.classList.remove('is-locked');
    (opener.current as HTMLElement | null)?.focus();
    onClose();
  };

  const blocks = project
    ? [
        { title: w.problem, body: project.problem },
        { title: w.insight, body: project.insight },
        { title: w.direction, body: project.direction },
        { title: w.system, body: project.system },
      ]
    : [];

  return (
    <dialog ref={dialog} className="panel" aria-labelledby="panel-title" onClose={handleClose}>
      {project && (
        <div className="panel__inner wrap">
          <div className="panel__top">
            <p className="code">
              {project.code} · {w.tag}
            </p>
            <button type="button" className="btn btn--outline btn--small" onClick={() => dialog.current?.close()}>
              {w.close}
            </button>
          </div>
          <p className="panel__category">{project.category}</p>
          <h2 id="panel-title" className="panel__title">
            {project.title}
          </h2>
          <p className="lead panel__summary">{project.summary}</p>
          <div className="placeholder panel__image" role="img" aria-label={project.imageLabel}>
            <span>{project.imageLabel}</span>
          </div>
          <div className="panel__blocks">
            {blocks.map((b, i) => (
              <section key={b.title} className="panel__block">
                <p className="code">0{i + 1}</p>
                <h3 className="panel__block-title">{b.title}</h3>
                <p>{b.body}</p>
              </section>
            ))}
          </div>
          <p className="panel__disclaimer">{w.disclaimer}</p>
        </div>
      )}
    </dialog>
  );
}
