import { LanguageSwitch } from '../components/LanguageSwitch';
import { navLinks } from '../components/navLinks';
import { site } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="footer__giant">
          <span>Adwini</span> <span>Studio</span>
        </p>
        <p className="footer__tagline">{t.tagline}</p>

        <div className="footer__cols">
          <nav aria-label={t.footer.navTitle}>
            <h2 className="footer__heading">{t.footer.navTitle}</h2>
            <ul className="footer__list">
              {navLinks(t).map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#contact">{t.contact.label}</a>
              </li>
            </ul>
          </nav>
          <div>
            <h2 className="footer__heading">{t.footer.socialTitle}</h2>
            <ul className="footer__list">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">{t.footer.langTitle}</h2>
            <LanguageSwitch />
          </div>
        </div>

        <div className="footer__bottom">
          <p className="meta-mono">
            © {site.year} ADWINI STUDIO — {site.city.replace(' — ', ', ')}
          </p>
          <p className="footer__thanks">
            <span className="footer__thanks-word">
              N’nahssé.
            </span>
            <span className="footer__thanks-caption">{t.footer.thanksCaption}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
