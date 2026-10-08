import { LanguageSwitch } from '../components/LanguageSwitch';
import { navLinks } from '../components/navLinks';
import { Rule } from '../components/Rule';
import { ThemeToggle } from '../components/ThemeToggle';
import { site } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';

/** Pied de page : « ADWINI » à la largeur de l'écran, coupé par le bas, puis l'essentiel. */
export function Footer({ index }: { index: number }) {
  const { t } = useLanguage();
  return (
    <footer className="footer" data-section={index}>
      <p className="footer__giant" aria-hidden="true">
        <span>Adwini</span>
      </p>
      <div className="wrap">
        <p className="footer__tagline">{t.tagline}</p>
        <Rule />
        <div className="footer__cols">
          <nav aria-label={t.footer.navTitle}>
            <h2 className="footer__heading">{t.footer.navTitle}</h2>
            <ul className="footer__list">
              {navLinks(t).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-draw">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="link-draw">
                  {t.contact.label}
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="footer__heading">{t.footer.socialTitle}</h2>
            <ul className="footer__list">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-draw" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">{t.footer.langTitle}</h2>
            <div className="footer__prefs">
              <LanguageSwitch />
              <ThemeToggle />
            </div>
          </div>
        </div>
        <Rule />
        <div className="footer__bottom">
          <p className="meta">
            © {site.year} ADWINI STUDIO — KIGALI, RWANDA
            <span className="footer__coords"> · 01°56′S 30°03′E</span>
          </p>
        </div>
        <p className="footer__thanks">
          <span className="footer__thanks-word">N’nahssé.</span>
          <span className="footer__thanks-caption">{t.footer.thanksCaption}</span>
        </p>
      </div>
    </footer>
  );
}
