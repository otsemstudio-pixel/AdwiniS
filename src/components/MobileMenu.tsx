import { useEffect, useRef, type MouseEvent, type RefObject } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { prefersReducedMotion } from '../utils/motion';
import { LanguageSwitch } from './LanguageSwitch';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark } from './Logo';
import { navLinks } from './navLinks';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement>;
}

/**
 * Menu plein écran sur fond encre. Basé sur <dialog> en mode modal :
 * piège de focus, touche Échap et couche supérieure fournis par le navigateur.
 * Le volet monte en CSS ; la fermeture attend la fin de la transition.
 */
export function MobileMenu({ open, onClose, returnFocus }: MobileMenuProps) {
  const { t } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.classList.add('is-locked');
      // Lecture de mise en page forcée : l'état fermé est appliqué avant d'ajouter
      // la classe d'ouverture, donc la transition du volet joue (sans requestAnimationFrame).
      void el.offsetHeight;
      el.classList.add('is-open');
    } else if (!open && el.open) {
      el.classList.remove('is-open');
      const finish = () => {
        el.close();
        document.documentElement.classList.remove('is-locked');
        returnFocus.current?.focus();
      };
      if (prefersReducedMotion()) finish();
      // Les liens sortent dans l'ordre inverse, puis le volet redescend : 850 ms en tout.
      else window.setTimeout(finish, 850);
    }
  }, [open, returnFocus]);

  // Un lien ferme le menu puis mène à sa section. La fermeture du <dialog> rendrait
  // le focus au bouton « Menu » : on le place plutôt sur la section ciblée.
  const followLink = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = dialog.current;
    const hash = e.currentTarget.hash;
    const target = document.querySelector<HTMLElement>(hash);
    if (!el || !target) return;
    e.preventDefault();
    el.classList.remove('is-open');
    el.close();
    document.documentElement.classList.remove('is-locked');
    onClose();
    history.pushState(null, '', hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <dialog
      ref={dialog}
      id="mobile-menu"
      className="menu"
      aria-label={t.nav.primaryLabel}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="menu__top">
        <span className="menu__logo">
          <LogoMark size={36} />
        </span>
        {/* Même icône que le bouton d'ouverture, à la même place : ses deux traits pivotent en croix. */}
        <button type="button" className="burger burger--close" onClick={onClose} aria-label={t.nav.close}>
          <span className="burger__line" />
          <span className="burger__line" />
        </button>
      </div>
      <nav aria-label={t.nav.primaryLabel}>
        <ul className="menu__links">
          {navLinks(t).map((link, i, all) => (
            <li key={link.href} className="menu__mask" style={{ ['--i' as string]: i, ['--ri' as string]: all.length - 1 - i }}>
              <a href={link.href} className="menu__link" onClick={followLink}>
                <span className="menu__num" aria-hidden="true">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu__foot">
        <a href="#contact" className="btn btn--light" onClick={followLink}>
          {t.nav.cta}
        </a>
        <LanguageSwitch className="lang-switch--on-ink" />
        <ThemeToggle className="icon-btn--on-ink" />
        <p className="meta">KIGALI — RWANDA</p>
      </div>
    </dialog>
  );
}
