import { useEffect, useMemo, useState } from 'react';
import { Marquee } from './components/Marquee';
import { Nav } from './components/Nav';
import { ScrollCounter } from './components/ScrollCounter';
import { Thread } from './components/Thread';
import { useActiveSection } from './hooks/useActiveSection';
import { useLanguage } from './hooks/useLanguage';
import { useRevealAll } from './hooks/useReveal';
import { CardMaker } from './sections/CardMaker';
import { Contact } from './sections/Contact';
import { Differentiators } from './sections/Differentiators';
import { FixedOffers } from './sections/FixedOffers';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Name } from './sections/Name';
import { Network } from './sections/Network';
import { Philosophy } from './sections/Philosophy';
import { Poles } from './sections/Poles';
import { Subscription } from './sections/Subscription';
import { TechCulture } from './sections/TechCulture';
import { Works } from './sections/Works';

/**
 * Ordre des sections. Le hero est la n° 1, le pied de page la n° 13 :
 * ces numéros alimentent les cercles, le compteur « 02 / 13 » et le fil continu.
 */
const SECTIONS = [Poles, Philosophy, Subscription, FixedOffers, Works, Differentiators, TechCulture, Network, Name, CardMaker, Contact];
const TOTAL = SECTIONS.length + 2;

export default function App() {
  const { t, lang } = useLanguage();
  const active = useActiveSection();
  useRevealAll(lang);

  // Signale au script de secours (index.html) que l'application a bien démarré.
  useEffect(() => {
    document.documentElement.classList.add('app');
  }, []);

  // Le fil descend jusqu'au bas de la section active. Positions relues seulement
  // quand la section active change (paliers), jamais à chaque image.
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const main = document.getElementById('main');
    const section = document.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!main || !section) return;
    const end = section.offsetTop + section.offsetHeight - main.offsetTop;
    setProgress(Math.min(1, Math.max(0, end / main.offsetHeight)));
  }, [active]);

  // Le bandeau défilant s'insère entre les pôles et la philosophie (il n'est pas une section numérotée).
  const sections = useMemo(
    () =>
      SECTIONS.flatMap((S, i) => {
        const section = <S key={i} index={i + 2} />;
        return S === Poles ? [section, <Marquee key="marquee" primary={t.marquee.primary} secondary={t.marquee.secondary} />] : [section];
      }),
    [t.marquee],
  );

  return (
    <>
      <a href="#main" className="skip-link">
        {t.skipLink}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Thread progress={progress} />
        <Hero />
        {sections}
      </main>
      <Footer index={TOTAL} />
      <ScrollCounter active={active} total={TOTAL} />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
