import { useLanguage } from '../hooks/useLanguage';
import { useSoundSetting } from '../hooks/useUiSounds';

/** Bouton haut-parleur : coupe ou rétablit les sons de l'interface. Icône en trait. */
export function SoundToggle({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const { on, toggle } = useSoundSetting();
  const label = on ? t.nav.soundOff : t.nav.soundOn;
  return (
    <button type="button" className={`icon-btn ${className}`} onClick={toggle} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        {on ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
    </button>
  );
}
