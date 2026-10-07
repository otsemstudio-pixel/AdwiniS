import { useState } from 'react';
import { ProjectPanel } from '../components/ProjectPanel';
import { Section } from '../components/Section';
import type { Project } from '../data/types';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Concepts du studio. Chaque carte est un <article> dont le titre contient un
 * vrai <button> étendu à toute la carte : cliquable, tactile et accessible au clavier.
 */
export function Works({ index }: { index: number }) {
  const { t } = useLanguage();
  const w = t.work;
  const [openCode, setOpenCode] = useState<string | null>(null);
  const project: Project | null = w.projects.find((p) => p.code === openCode) ?? null;

  return (
    <Section
      id="travaux"
      index={index}
      label={w.label}
      title={w.title}
      aside={<p className="lead">{w.intro}</p>}
      className="works"
    >
      <ul className="works__grid">
        {w.projects.map((p, i) => (
          <li key={p.code} className={`work work--${i + 1}`}>
            <article className="work__card cut">
              <div className="placeholder work__image" aria-hidden="true">
                <span>{p.imageLabel}</span>
              </div>
              <div className="work__body">
                <p className="work__tag">{w.tag}</p>
                <p className="work__category">{p.category}</p>
                <h3 className="work__title">
                  <button type="button" className="work__open" onClick={() => setOpenCode(p.code)}>
                    {p.title}
                  </button>
                </h3>
                <p className="work__summary">{p.summary}</p>
                <p className="work__reveal" aria-hidden="true">
                  <span className="code">{p.code}</span>
                  <span className="work__view">{w.view} →</span>
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <ProjectPanel project={project} onClose={() => setOpenCode(null)} />
    </Section>
  );
}
