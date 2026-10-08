import { GridLines } from '../components/GridLines';
import { RevealText } from '../components/RevealText';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

/** Une ligne à la fois : chaque affirmation monte sous son masque en entrant dans l'écran. */
export function Philosophy({ index }: { index: number }) {
  const { t } = useLanguage();
  const p = t.philosophy;
  return (
    <Section id="studio" index={index} label={p.label} title={p.title} className="philosophy">
      <GridLines />
      <ul className="philosophy__lines">
        {p.lines.map((line, i) => (
          <li key={line} className={`philosophy__line philosophy__line--${i + 1}`}>
            <RevealText text={line} />
          </li>
        ))}
      </ul>
      <div className="philosophy__conclusion" data-reveal="">
        <p>{p.conclusion}</p>
      </div>
    </Section>
  );
}
