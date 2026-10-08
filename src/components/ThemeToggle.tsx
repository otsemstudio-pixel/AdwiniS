import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

/** Bascule clair / sombre. Icône en trait : un cercle et sa moitié. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const { theme, toggle } = useTheme();
  const label = theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark;
  return (
    <button type="button" className={`icon-btn ${className}`} onClick={toggle} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
