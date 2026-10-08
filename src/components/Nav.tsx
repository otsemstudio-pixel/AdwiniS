import { useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useScrolled } from '../hooks/useScrolled';
import { LanguageSwitch } from './LanguageSwitch';
import { LockupHorizontal } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { navLinks } from './navLinks';

export function Nav() {
  const { t } = useLanguage();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
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
            {t.nav.cta}
          </a>
        </nav>
        <div className="nav__mobile">
          <button
            ref={menuButton}
            type="button"
            className="btn btn--outline btn--small nav__menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            aria-label={t.nav.menu}
          >
            Menu
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} returnFocus={menuButton} />
    </header>
  );
}
