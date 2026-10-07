import { Section } from '../components/Section';
import { Logo } from '../components/Logo';
import { useLanguage } from '../hooks/useLanguage';

/** Le modèle du studio expliqué honnêtement : un noyau, un réseau d'indépendants. */
export function Network({ index }: { index: number }) {
  const { t } = useLanguage();
  const n = t.network;
  return (
    <Section id="reseau" index={index} label={n.label} title={n.title} className="network">
      <div className="network__grid">
        <div className="network__text">
          {n.body.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <p className="network__promise">{n.promise}</p>
        </div>
        <div className="network__diagram">
          <div className="network__core cut filet">
            <span className="network__core-logo">
              <Logo size={36} cut="var(--surface)" />
            </span>
            <h3 className="network__heading">{n.coreTitle}</h3>
            <p>{n.core}</p>
          </div>
          <div className="network__ring">
            <h3 className="network__heading network__heading--small">{n.specialistsTitle}</h3>
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
      </div>
    </Section>
  );
}
