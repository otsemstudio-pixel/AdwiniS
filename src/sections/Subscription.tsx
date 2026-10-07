import { Section } from '../components/Section';
import { pricing } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';
import { formatUSD } from '../utils/format';

/** Formules d'abonnement. Cartes empilées sur mobile, jamais un tableau à faire défiler. */
export function Subscription({ index }: { index: number }) {
  const { t, lang } = useLanguage();
  const s = t.subscription;
  return (
    <Section
      id="abonnement"
      index={index}
      label={s.label}
      title={s.title}
      aside={<p className="lead">{s.intro}</p>}
      className="subscription"
    >
      <ul className="plans">
        {s.plans.map((plan) => {
          const data = pricing[plan.id];
          const headingId = `plan-${plan.id}`;
          return (
            <li key={plan.id} className={`plan cut ${data.featured ? 'plan--featured filet' : ''}`} aria-labelledby={headingId}>
              <div className="plan__top">
                <p className="code">{data.code}</p>
                {plan.featuredNote && <p className="plan__badge">{plan.featuredNote}</p>}
              </div>
              <h3 id={headingId} className="plan__name">
                {plan.name}
              </h3>
              <p className="plan__audience">{plan.audience}</p>
              <p className="plan__price">
                {data.price === null ? (
                  <span className="plan__amount plan__amount--quote">{plan.priceNote}</span>
                ) : (
                  <>
                    <span className="plan__amount">{formatUSD(data.price, lang)}</span>{' '}
                    <span className="plan__per">{s.perMonth}</span>
                  </>
                )}
              </p>
              <dl className="plan__facts">
                <div>
                  <dt>{s.activeRequests}</dt>
                  <dd>{data.activeRequests}</dd>
                </div>
                <div>
                  <dt>{s.turnaround}</dt>
                  <dd>
                    {data.turnaroundHours} {s.hours}
                  </dd>
                </div>
              </dl>
              <a href="#contact" className={`btn ${data.featured ? 'btn--solid' : 'btn--outline'} plan__cta`}>
                {s.cta}
                <span className="visually-hidden"> — {plan.name}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="terms">
        <div className="terms__col">
          <h3 className="terms__title">{s.includedTitle}</h3>
          <ul className="terms__list terms__list--in">
            {s.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="terms__col">
          <h3 className="terms__title">{s.excludedTitle}</h3>
          <ul className="terms__list terms__list--out">
            {s.excluded.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
