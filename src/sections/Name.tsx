import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

/** Le récit du nom. Le mot est composé très grand, comme une entrée de dictionnaire. */
export function Name({ index }: { index: number }) {
  const { t } = useLanguage();
  const n = t.name;
  return (
    <Section id="nom" index={index} label={n.label} title={n.title} className="name">
      <div className="name__entry">
        <p className="name__word" lang="tw">
          {n.word}
        </p>
        <p className="name__meta">
          <span className="code">{n.phonetic}</span>
          <span className="meta-mono">{n.origin}</span>
        </p>
        <blockquote className="name__story">
          <p>{n.story}</p>
        </blockquote>
      </div>
    </Section>
  );
}
