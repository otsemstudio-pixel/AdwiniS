import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'adwini-theme';

/** Thème courant : choix mémorisé (posé par le script de index.html), sinon celui du système. */
function current(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(current());
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(current());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* stockage indisponible : le choix vaut pour la visite */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
