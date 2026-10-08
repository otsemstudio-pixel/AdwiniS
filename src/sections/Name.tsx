import { LogoMark } from '../components/Logo';
import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

/** Le nom, traité comme une page de livre : beaucoup de vide, le texte seul, le symbole en filigrane. */
export function Name({ index }: { index: number }) {
  const { t } = useLanguage();
  const n = t.name;
  return (
    <Section id="nom" index={index} label={n.label} title={n.title} hideTitle className="name">
      <div className="name__page">
        <LogoMark size={480} className="name__watermark" />
        <blockquote className="name__story" data-reveal="">
          <p>{n.story}</p>
        </blockquote>
        <p className="meta name__origin">{n.origin}</p>
      </div>
    </Section>
  );
}
