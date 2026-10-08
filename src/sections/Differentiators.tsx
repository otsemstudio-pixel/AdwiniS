import { Pictograms } from '../components/LineArt';
import { Sparks } from '../components/Logo';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import { pad } from '../utils/format';

/** Cinq engagements numérotés, posés en diagonale ; le cinquième montre les pictogrammes du studio. */
export function Differentiators({ index }: { index: number }) {
  const { t } = useLanguage();
  const d = t.differentiators;
  return (
    <Section id="engagements" index={index} label={d.label} title={d.title} aside={<p className="lead">{d.intro}</p>} className="diff">
      <ol className="diff__list">
        {d.items.map((item, i) => {
          const last = i === d.items.length - 1;
          return (
            <li key={item.title} className={`diff__item diff__item--${i + 1}`}>
              <span className="diff__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div className="diff__text">
                <h3 className="diff__title">
                  {item.title}
                  {last && <Sparks className="diff__sparks" />}
                </h3>
                <p>{item.body}</p>
                {last && <Pictograms names={d.iconNames} />}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
