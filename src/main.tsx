// Polices auto-hébergées, sous-ensemble latin uniquement, font-display: swap.
import '@fontsource/outfit/latin-600.css';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/jetbrains-mono/latin-400.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './hooks/useLanguage';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);

// En production, le HTML est prérendu (scripts/prerender.mjs) : React s'y raccroche,
// mais seulement quand le navigateur est libre (après le premier affichage), pour ne pas
// le retarder sur un téléphone lent. Safari n'a pas requestIdleCallback : court délai.
const hydrate = () => hydrateRoot(root, app);
if (!root.hasChildNodes()) createRoot(root).render(app);
else if ('requestIdleCallback' in window) requestIdleCallback(hydrate, { timeout: 1500 });
else setTimeout(hydrate, 50);
