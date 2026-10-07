import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';
import { useReveal } from '../hooks/useReveal';

export function Philosophy({ index }: { index: number }) {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();
  const p = t.philosophy;
  return (
    <Section id="studio" index={index} label={p.label} title={p.title} className="philosophy">
      <div ref={ref} className="philosophy__body">
        <ul className="philosophy__lines">
          {p.lines.map((line) => (
            <li key={line} data-reveal className="philosophy__line reveal">
              {line}
            </li>
          ))}
        </ul>
        <p data-reveal className="philosophy__conclusion reveal">
          {p.conclusion}
        </p>
      </div>
    </Section>
  );
}
