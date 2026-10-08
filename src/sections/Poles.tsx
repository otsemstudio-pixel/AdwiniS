import { LineArt, type ArtName } from '../components/LineArt';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

const ARTS: ArtName[] = ['identity', 'interfaces', 'stories'];

/** Les trois pôles, chacun avec son illustration en trait continu. Placés en escalier. */
export function Poles({ index }: { index: number }) {
  const { t } = useLanguage();
  const p = t.poles;
  return (
    <Section id="services" index={index} label={p.label} title={p.title} aside={<p className="lead">{p.intro}</p>} className="poles">
      <ol className="poles__list">
        {p.list.map((pole, i) => (
          <li key={pole.code} className={`pole pole--${i + 1}`}>
            <LineArt name={ARTS[i]} />
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
    </Section>
  );
}
