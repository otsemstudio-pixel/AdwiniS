import { languages } from '../data';
import { useLanguage } from '../hooks/useLanguage';

/** Sélecteur FR / EN. Deux vrais boutons ; l'état actif est annoncé via aria-pressed. */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t.nav.langLabel}>
      {languages.map((code, i) => (
        <span key={code} className="lang-switch__item">
          {i > 0 && (
            <span aria-hidden="true" className="lang-switch__sep">
              /
            </span>
          )}
          <button
            type="button"
            className="lang-switch__btn"
            aria-pressed={lang === code}
            lang={code}
            aria-label={code === 'fr' ? 'Français' : 'English'}
            onClick={() => setLang(code)}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
