import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

/** Les trois pôles, suivis des engagements qui différencient le studio. */
export function Poles({ index }: { index: number }) {
  const { t } = useLanguage();
  const { poles, differentiators: diff } = t;
  return (
    <Section
      id="services"
      index={index}
      label={poles.label}
      title={poles.title}
      aside={<p className="lead">{poles.intro}</p>}
      className="poles"
    >
      <ol className="poles__list">
        {poles.list.map((pole) => (
          <li key={pole.code} className="pole cut">
            <p className="code">{pole.code}</p>
            <h3 className="pole__name">{pole.name}</h3>
            <p className="pole__intro">{pole.intro}</p>
            <ul className="pole__items">
              {pole.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="diff">
        <h3 className="diff__title">{diff.title}</h3>
        <ul className="diff__list">
          {diff.items.map((item, i) => (
            <li key={item.code} className={`diff__item ${i === diff.items.length - 1 ? 'diff__item--wide cut filet' : ''}`}>
              <p className="code">{item.code}</p>
              <h4 className="diff__name">{item.title}</h4>
              <p>{item.body}</p>
              {i === diff.items.length - 1 && <IconRow />}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/**
 * Quatre pictogrammes dessinés par le studio : portefeuille mobile money,
 * moto-taxi, étal de marché, franc CFA. Démonstration de l'engagement ENG—005.
 */
function IconRow() {
  const names = useLanguage().t.differentiators.iconNames;
  return (
    <ul className="icon-row">
      {ICONS.map((icon, i) => (
        <li key={i} className="icon-row__item">
          <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
            {icon}
          </svg>
          <span className="icon-row__name">{names[i]}</span>
        </li>
      ))}
    </ul>
  );
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinejoin: 'miter' as const };

const ICONS = [
  // Téléphone à clapet + pièce : le portefeuille mobile money
  <g key="wallet" {...stroke}>
    <path d="M12 5h18v38H12z" />
    <path d="M12 33h18" />
    <path d="M18 12h6M18 18h6M18 24h6" />
    <circle cx="37" cy="31" r="7" />
    <path d="M37 27v8" />
  </g>,
  // Moto-taxi de profil
  <g key="moto" {...stroke}>
    <circle cx="11" cy="34" r="7" />
    <circle cx="37" cy="34" r="7" />
    <path d="M11 34l9-12h10l7 12" />
    <path d="M20 22l-3-6h-5M30 22l3-8h5" />
    <path d="M22 28h10" />
  </g>,
  // Étal : auvent rayé, tréteaux, marchandises
  <g key="stall" {...stroke}>
    <path d="M5 8h38l-3 10H8z" />
    <path d="M14 8l-1 10M24 8v10M34 8l1 10" />
    <path d="M8 18v24M40 18v24M6 32h36" />
    <circle cx="16" cy="28" r="3" />
    <circle cx="24" cy="28" r="3" />
    <circle cx="32" cy="28" r="3" />
  </g>,
  // Billet en francs CFA
  <g key="cfa" {...stroke}>
    <path d="M4 12h40v24H4z" />
    <path d="M4 18c4 0 6-2 6-6M44 18c-4 0-6-2-6-6M4 30c4 0 6 2 6 6M44 30c-4 0-6 2-6 6" />
    <path d="M21 19h-3v10h3M29 19h-4v10M25 24h3" />
  </g>,
];
