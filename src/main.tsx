// Polices auto-hébergées, sous-ensemble latin uniquement, font-display: swap.
import '@fontsource/fraunces/latin-400.css';
import '@fontsource/fraunces/latin-700.css';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-700.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';

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
// mais seulement après le premier affichage, pour ne pas le retarder sur un téléphone lent.
if (root.hasChildNodes()) requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, app), 0));
else createRoot(root).render(app);
