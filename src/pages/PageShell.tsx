import type { ReactNode } from 'react';
import { Cursor } from '../components/Cursor';
import { LockupHorizontal } from '../components/Logo';
import { SoundToggle } from '../components/SoundToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { useUiSounds } from '../hooks/useUiSounds';

/**
 * Gabarit des pages hors parcours (/carte, /card, /brief) : la marque qui ramène à l'accueil,
 * les bascules de thème et de son, le contenu. Pas de navigation du site : ces pages ne sont liées nulle part.
 */
export function PageShell({ backLabel, children }: { backLabel: string; children: ReactNode }) {
  const home = import.meta.env.BASE_URL;
  useUiSounds();
  return (
    <>
      <a href="#main" className="skip-link">
        Aller au contenu / Skip to content
      </a>
      <header className="page-head">
        <a href={home} className="page-head__brand" aria-label={`Adwini Studio — ${backLabel}`}>
          <LockupHorizontal size={34} />
        </a>
        <div className="page-head__prefs">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </header>
      <main id="main" tabIndex={-1} className="page">
        {children}
      </main>
      <footer className="page-foot">
        <a href={home} className="link-draw">
          {backLabel}
        </a>
        <span className="meta">KIGALI — RWANDA</span>
      </footer>
      <Cursor />
    </>
  );
}
