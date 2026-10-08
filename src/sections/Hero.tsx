import { GridLines } from '../components/GridLines';
import { Sparks } from '../components/Logo';
import { RevealText } from '../components/RevealText';
import { useLanguage } from '../hooks/useLanguage';

/**
 * Le hero : aucun visuel, seulement l'échelle typographique et le vide.
 * Le titre se révèle mot par mot au premier affichage, en CSS pur (sans attendre le JS).
 */
export function Hero() {
  const { t } = useLanguage();
  const [l1, l2] = t.hero.titleLines;
  // Garde-fou de largeur : le mot le plus long tient toujours sur l'écran (320 px compris).
  // Le dernier mot porte les éclats : ils comptent pour environ un caractère.
  const lastWord = l2.split(' ').pop()!.length + 1;
  const word = Math.max(lastWord, ...`${l1} ${l2}`.split(' ').map((w) => w.length));
  const offset = l1.split(' ').length;
  return (
    <section id="top" className="hero" data-section={1} aria-labelledby="hero-title">
      <GridLines />
      <div className="wrap hero__inner">
        <h1 id="hero-title" className="hero__title" style={{ ['--word' as string]: word }}>
          <RevealText mode="load" className="hero__line" text={l1} />{' '}
          <span className="hero__line hero__line--2">
            <RevealText mode="load" text={l2} offset={offset} suffix={<Sparks className="hero__sparks" />} />
          </span>
        </h1>
        <div className="hero__below">
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
        <div className="hero__foot">
          <p className="meta hero__meta">
            <span>ADWINI / 001</span>
            <span>KIGALI — RWANDA</span>
            <span>01°56′S 30°03′E</span>
          </p>
          <a href="#services" className="hero__scroll">
            <span className="meta">{t.hero.scroll}</span>
            <svg viewBox="0 0 24 72" width="18" height="54" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2V68M4 60L12 68L20 60" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
