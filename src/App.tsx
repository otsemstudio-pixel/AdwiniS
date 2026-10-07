import { Nav } from './components/Nav';
import { useLanguage } from './hooks/useLanguage';
import { CardMaker } from './sections/CardMaker';
import { Contact } from './sections/Contact';
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

/** Ordre des sections ; leur numéro d'étiquette (01, 02…) découle de cette liste. */
const SECTIONS = [Philosophy, Poles, Subscription, FixedOffers, Works, Network, TechCulture, Name, CardMaker, Contact];

export default function App() {
  const { t } = useLanguage();
  return (
    <>
      <a href="#main" className="skip-link">
        {t.skipLink}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        {SECTIONS.map((S, i) => (
          <S key={i} index={i + 1} />
        ))}
      </main>
      <Footer />
      <div className="corner-meta" aria-hidden="true">
        <span>ADWINI / 001</span>
        <span>FR / EN</span>
      </div>
    </>
  );
}
