import { Section } from '../components/Section';
import { useLanguage } from '../hooks/useLanguage';

export function TechCulture({ index }: { index: number }) {
  const { t } = useLanguage();
  return (
    <Section id="technologie" index={index} label={t.tech.label} title={t.tech.title} tone="ink" className="tech">
      <p className="tech__body">{t.tech.body}</p>
    </Section>
  );
}
