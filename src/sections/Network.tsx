import { useRef } from 'react';
import { LogoMark } from '../components/Logo';
import { NetworkScene, type SceneKind } from '../components/NetworkScene';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import { usePlayWhenVisible } from '../hooks/usePlayWhenVisible';

/** Une scène animée par métier, dans l'ordre de network.specialists (identique en français et en anglais). */
const SCENES: SceneKind[] = ['motion', 'illustration', 'translation', 'voice', 'code'];

/** Le modèle du studio, honnêtement : un noyau, un réseau d'indépendants, un seul interlocuteur. */
export function Network({ index }: { index: number }) {
  const { t } = useLanguage();
  const n = t.network;
  const list = useRef<HTMLUListElement>(null);

  usePlayWhenVisible(list);
  return (
    <Section id="reseau" index={index} label={n.label} title={n.title} className="network">
      <div className="network__text reveal">
        {n.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <div className="network__diagram reveal">
        <div className="card network__core">
          <LogoMark size={44} />
          <h3 className="network__heading">{n.coreTitle}</h3>
          <p>{n.core}</p>
        </div>
        <div className="network__ring">
          <h3 className="network__subheading">{n.specialistsTitle}</h3>
          <ul className="network__list" ref={list}>
            {n.specialists.map((s, i) => (
              <li key={s} className="network__item">
                <NetworkScene kind={SCENES[i]} />
                <span className="code" aria-hidden="true">
                  RES—00{i + 1}
                </span>
                <span className="network__name">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="network__promise reveal">
        <p>{n.promise}</p>
      </div>
    </Section>
  );
}
