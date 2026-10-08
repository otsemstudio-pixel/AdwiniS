// Point d'entrée des pages hors parcours (/carte, /card, /brief).
// Mêmes polices et styles que le site ; la page à afficher est donnée par <body data-page>.
import '@fontsource/outfit/latin-600.css';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/jetbrains-mono/latin-400.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './hooks/useLanguage';
import { BriefPage } from './pages/BriefPage';
import { FounderPage } from './pages/FounderPage';

const page = document.body.dataset.page;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>{page === 'brief' ? <BriefPage /> : <FounderPage />}</LanguageProvider>
  </StrictMode>,
);
