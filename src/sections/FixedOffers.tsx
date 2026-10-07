import { Section } from '../components/Section';
import { fixedPricing } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';
import { formatUSD } from '../utils/format';

export function FixedOffers({ index }: { index: number }) {
  const { t, lang } = useLanguage();
  const f = t.fixed;
  return (
    <Section
      id="prix-fixe"
      index={index}
      label={f.label}
      title={f.title}
      aside={<p className="lead">{f.intro}</p>}
      className="fixed"
    >
      <ul className="offers">
        {f.offers.map((offer) => {
          const data = fixedPricing[offer.id];
          return (
            <li key={offer.id} className="offer">
              <p className="code">{data.code}</p>
              <h3 className="offer__name">{offer.name}</h3>
              <p className="offer__desc">{offer.description}</p>
              <p className="offer__price">
                <span className="offer__from">{f.from}</span> <strong>{formatUSD(data.price, lang)}</strong>
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
