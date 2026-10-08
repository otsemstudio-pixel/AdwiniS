import { LogoMark } from '../components/Logo';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

/** Le modèle du studio, honnêtement : un noyau, un réseau d'indépendants, un seul interlocuteur. */
export function Network({ index }: { index: number }) {
  const { t } = useLanguage();
  const n = t.network;
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
          <ul className="network__list">
            {n.specialists.map((s, i) => (
              <li key={s}>
                <span className="code" aria-hidden="true">
                  RES—00{i + 1}
                </span>
                {s}
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
