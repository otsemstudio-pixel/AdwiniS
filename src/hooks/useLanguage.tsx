import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { contents, type Content, type Lang } from '../data';

const STORAGE_KEY = 'adwini-lang';

/**
 * Ordre de priorité : choix mémorisé, puis langue du navigateur, puis français.
 * Même logique que le script en ligne de index.html (scripts/prerender.mjs),
 * qui choisit la version prérendue avant le premier affichage.
 */
function detectLanguage(): Lang {
  const preset = document.documentElement.dataset.lang;
  if (preset === 'fr' || preset === 'en') return preset;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible (navigation privée) : on continue */
  }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const pref of prefs) {
    const code = pref?.slice(0, 2).toLowerCase();
    if (code === 'fr' || code === 'en') return code;
  }
  return 'fr';
}

function setMeta(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value);
}

interface LanguageValue {
  lang: Lang;
  t: Content;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  /** Langue imposée lors du prérendu (pas de navigateur côté serveur). */
  initialLang?: Lang;
}

export function LanguageProvider({ children, initialLang }: ProviderProps) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? detectLanguage());
  const t = contents[lang];

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignoré */
    }
  }, []);

  // Le document suit la langue active : lang, titre, description, Open Graph.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    setMeta('meta[name="description"]', t.meta.description);
    setMeta('meta[property="og:title"]', t.meta.title);
    setMeta('meta[property="og:description"]', t.meta.description);
    setMeta('meta[property="og:locale"]', t.meta.locale);
    setMeta('meta[name="twitter:title"]', t.meta.title);
    setMeta('meta[name="twitter:description"]', t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être utilisé dans <LanguageProvider>');
  return ctx;
}
