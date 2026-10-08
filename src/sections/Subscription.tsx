import { CountUp } from '../components/CountUp';
import { Sparks } from '../components/Logo';
import { Section } from '../components/Section';
import { pricing } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';
import { formatUSD } from '../utils/format';

/** Formules d'abonnement. Prix à l'échelle d'un titre ; cartes empilées sur mobile. */
export function Subscription({ index }: { index: number }) {
  const { t, lang } = useLanguage();
  const s = t.subscription;
  return (
    <Section id="abonnement" index={index} label={s.label} title={s.title} aside={<p className="lead">{s.intro}</p>} className="subscription">
      <ul className="plans">
        {s.plans.map((plan, i) => {
          const data = pricing[plan.id];
          const headingId = `plan-${plan.id}`;
          return (
            <li
              key={plan.id}
              className={`card plan ${data.featured ? 'plan--featured' : ''}`}
              aria-labelledby={headingId}
              style={{ ['--i' as string]: i }}
            >
              <div className="plan__main">
              <div className="plan__top">
                <p className="code">{data.code}</p>
                {plan.featuredNote && (
                  <p className="plan__badge">
                    <Sparks className="plan__sparks" />
                    {plan.featuredNote}
                  </p>
                )}
              </div>
              <h3 id={headingId} className="plan__name">
                {plan.name}
              </h3>
              <p className="plan__audience">{plan.audience}</p>
              </div>
              <div className="plan__side">
              <p className="plan__price">
                {data.price === null ? (
                  <span className="plan__amount plan__amount--quote">{plan.priceNote}</span>
                ) : (
                  <>
                    <span className="plan__amount">
                      <CountUp value={data.price} format={(n) => formatUSD(n, lang)} />
                    </span>
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
                    <CountUp value={data.turnaroundHours} format={(n) => `${n} ${s.hours}`} />
                  </dd>
                </div>
              </dl>
              <a href="#contact" className={`btn ${data.featured ? 'btn--solid' : 'btn--outline'} plan__cta`}>
                {s.cta}
                <span className="visually-hidden"> — {plan.name}</span>
              </a>
              </div>
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
