import type { ElementType, ReactNode } from 'react';

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** `scroll` : révélé à l'entrée dans l'écran. `load` : joué au premier affichage, sans JavaScript. */
  mode?: 'scroll' | 'load';
  /** Décalage de départ, en nombre de mots (pour enchaîner plusieurs lignes). */
  offset?: number;
  /** Élément accolé au dernier mot, sans retour à la ligne possible entre eux. */
  suffix?: ReactNode;
}

/**
 * Révélation mot par mot sous masque : chaque mot monte de 100 % à 0 dans un
 * conteneur `overflow: hidden`, 40 ms d'écart entre deux mots.
 * Le texte reste un texte normal pour les lecteurs d'écran et la recherche.
 */
export function RevealText({ text, as: Tag = 'span', className = '', id, mode = 'scroll', offset = 0, suffix }: RevealTextProps) {
  const words = text.split(' ');
  return (
    <Tag id={id} className={`split split--${mode} ${className}`} data-reveal={mode === 'scroll' ? '' : undefined}>
      {words.map((word, i) => (
        <span key={`${i}-${word}`} className={i === words.length - 1 && suffix ? 'w-last' : undefined}>
          <span className="w">
            <span className="w__i" style={{ ['--i' as string]: i + offset }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : suffix}
        </span>
      ))}
    </Tag>
  );
}
