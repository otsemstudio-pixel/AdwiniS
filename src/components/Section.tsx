import type { ReactNode } from 'react';
import { SectionLabel } from './SectionLabel';

interface SectionProps {
  id: string;
  index: number;
  label: string;
  title: ReactNode;
  className?: string;
  /** Contenu placé à côté du titre sur grand écran (chapeau, introduction). */
  aside?: ReactNode;
  children?: ReactNode;
  tone?: 'default' | 'ink';
}

/** Gabarit commun : étiquette numérotée, titre h2, contenu. */
export function Section({ id, index, label, title, aside, className = '', tone = 'default', children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`section section--${tone} ${className}`}>
      <div className="wrap">
        <header className="section__head">
          <SectionLabel index={index} label={label} />
          <h2 id={headingId} className="section__title">
            {title}
          </h2>
          {aside && <div className="section__aside">{aside}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}
