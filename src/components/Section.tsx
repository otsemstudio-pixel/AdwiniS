import type { ReactNode } from 'react';
import { pad } from '../utils/format';
import { RevealText } from './RevealText';

interface SectionProps {
  id: string;
  /** Position dans la page (1 à 13) : numéro cerclé, compteur de défilement, fil continu. */
  index: number;
  label: string;
  title: string;
  /** Titre présent pour la structure et les lecteurs d'écran, mais masqué à l'écran. */
  hideTitle?: boolean;
  className?: string;
  aside?: ReactNode;
  children?: ReactNode;
  tone?: 'default' | 'ink';
}

/** Gabarit commun : numéro tracé dans un cercle, nom de section, titre révélé mot par mot. */
export function Section({ id, index, label, title, hideTitle, aside, className = '', tone = 'default', children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} data-section={index} aria-labelledby={headingId} className={`section section--${tone} ${className}`}>
      <div className="wrap">
        <header className="section__head">
          <p className="section__label">
            <span className="num" aria-hidden="true">
              {pad(index)}
            </span>
            <span>{label}</span>
          </p>
          {hideTitle ? (
            <h2 id={headingId} className="visually-hidden">
              {title}
            </h2>
          ) : (
            <RevealText as="h2" id={headingId} className="section__title" text={title} />
          )}
          {aside && (
            <div className="section__aside" data-reveal="">
              {aside}
            </div>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
