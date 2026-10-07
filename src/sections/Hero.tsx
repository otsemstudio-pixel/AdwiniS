import { HeroPattern } from '../components/HeroPattern';
import { useLanguage } from '../hooks/useLanguage';

export function Hero() {
  const { t } = useLanguage();
  // La taille du titre se calcule sur la ligne (bureau) ou le mot (mobile, tablette) le plus long :
  // il remplit la largeur sans jamais déborder, quelle que soit la langue.
  const lines = t.hero.titleLines;
  const chars = Math.max(...lines.map((l) => l.length));
  const word = Math.max(...lines.flatMap((l) => l.split(' ')).map((w) => w.length));
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__text">
          <p className="section-label">
            <span className="section-label__num">00</span>
            <span aria-hidden="true"> / </span>
            <span className="visually-hidden"> — </span>
            Adwini Studio
          </p>
          <h1 id="hero-title" className="hero__title" style={{ ['--chars' as string]: chars, ['--word' as string]: word }}>
            <span className="hero__line">{t.hero.titleLines[0]}</span>
            <span className="hero__line">{t.hero.titleLines[1]}</span>
          </h1>
          <p className="hero__subtitle">{t.hero.subtitle}</p>
          <div className="hero__actions">
            <a href="#contact" className="btn btn--solid">
              {t.hero.primary}
            </a>
            <a href="#studio" className="btn btn--outline">
              {t.hero.secondary}
            </a>
          </div>
        </div>
        <div className="hero__visual">
          <HeroPattern label={t.hero.visualLabel} />
          <p className="hero__meta meta-mono" aria-hidden="true">
            <span>ADWINI / 001</span>
            <span>KIGALI — RWANDA</span>
          </p>
        </div>
      </div>
    </section>
  );
}
