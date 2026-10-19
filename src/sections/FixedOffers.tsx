import { CountUp } from '../components/CountUp';
import { Section } from '../components/Section';
import { fixedPricing, site, upcomingOffer } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';
import { quickWhatsappUrl } from '../utils/brief';
import { formatUSD } from '../utils/format';

export function FixedOffers({ index }: { index: number }) {
  const { t, lang } = useLanguage();
  const f = t.fixed;
  return (
    <Section id="prix-fixe" index={index} label={f.label} title={f.title} aside={<p className="lead">{f.intro}</p>} className="fixed">
      <ul className="offers">
        {f.offers.map((offer) => {
          const data = fixedPricing[offer.id];
          return (
            <li key={offer.id} className="offer reveal">
              <p className="code">{data.code}</p>
              <h3 className="offer__name">{offer.name}</h3>
              <p className="offer__desc">{offer.description}</p>
              <p className="offer__price">
                <span className="offer__from">{f.from}</span>
                <span className="offer__amount">
                  <CountUp value={data.price} format={(n) => formatUSD(n, lang)} />
                </span>
              </p>
            </li>
          );
        })}
        <li className="offer offer--upcoming reveal">
          <p className="code">{upcomingOffer.code}</p>
          <h3 className="offer__name">{f.upcoming.name}</h3>
          <p className="offer__desc">{f.upcoming.description}</p>
          <div className="offer__price offer__soon">
            <span className="offer__badge">{f.upcoming.badge}</span>
            <a href={quickWhatsappUrl(site.whatsappNumber, f.upcoming.message)} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
              {f.upcoming.cta}
            </a>
          </div>
        </li>
      </ul>
    </Section>
  );
}
