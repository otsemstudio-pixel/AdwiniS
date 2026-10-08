import { useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useNavScroll } from '../hooks/useScrolled';
import { LanguageSwitch } from './LanguageSwitch';
import { LockupHorizontal } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { navLinks } from './navLinks';

export function Nav() {
  const { t } = useLanguage();
  const { scrolled, hidden } = useNavScroll();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Barre de progression de lecture : pilotée par le défilement, en CSS pur. */}
      <div className="progress" aria-hidden="true" />
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${hidden && !open ? 'nav--hidden' : ''}`}>
        <div className="nav__bar">
          <a href="#top" className="nav__brand" aria-label="Adwini Studio">
            <LockupHorizontal size={36} intro />
          </a>
          <nav className="nav__desktop" aria-label={t.nav.primaryLabel}>
            <ul className="nav__links">
              {navLinks(t).map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-draw nav__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <LanguageSwitch />
            <ThemeToggle />
            <a href="#contact" className="btn btn--solid btn--small">
              <span>{t.nav.cta}</span>
            </a>
          </nav>
          <button
            ref={menuButton}
            type="button"
            className="burger nav__menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t.nav.menu}
            onClick={() => setOpen(true)}
          >
            <span className="burger__line" />
            <span className="burger__line" />
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} returnFocus={menuButton} />
    </>
  );
}
