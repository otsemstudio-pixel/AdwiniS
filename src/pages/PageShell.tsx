import type { ReactNode } from 'react';
import { LockupHorizontal } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * Gabarit des pages hors parcours (/carte, /card, /brief) : la marque qui ramène à l'accueil,
 * la bascule de thème, le contenu. Pas de navigation du site : ces pages ne sont liées nulle part.
 */
export function PageShell({ backLabel, children }: { backLabel: string; children: ReactNode }) {
  const home = import.meta.env.BASE_URL;
  return (
    <>
      <a href="#main" className="skip-link">
        Aller au contenu / Skip to content
      </a>
      <header className="page-head">
        <a href={home} className="page-head__brand" aria-label={`Adwini Studio — ${backLabel}`}>
          <LockupHorizontal size={34} />
        </a>
        <ThemeToggle />
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
    </>
  );
}
