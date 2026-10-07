import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import type { Lang } from './data';
import { LanguageProvider } from './hooks/useLanguage';

/** Prérendu statique d'une langue, utilisé au build par scripts/prerender.mjs. */
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <LanguageProvider initialLang={lang}>
        <App />
      </LanguageProvider>
    </StrictMode>,
  );
}
