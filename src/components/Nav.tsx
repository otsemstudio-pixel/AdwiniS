import { useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useScrolled } from '../hooks/useScrolled';
import { Lockup } from './Logo';
import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';
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
          <Lockup size={30} />
        </a>
        <nav className="nav__desktop" aria-label={t.nav.primaryLabel}>
          <ul className="nav__links">
            {navLinks(t).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="nav__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitch />
          <a href="#contact" className="btn btn--solid btn--small">
            {t.nav.cta}
          </a>
        </nav>
        <button
          ref={menuButton}
          type="button"
          className="nav__menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.nav.menu}
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true">Menu</span>
        </button>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} returnFocus={menuButton} />
    </header>
  );
}
