import type { Lang } from '../data';

/** 1200 → « 1 200 $ » en français, « $1,200 » en anglais. */
export function formatUSD(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Numéro d'étiquette de section : 1 → « 01 ». */
export const pad = (n: number, size = 2) => String(n).padStart(size, '0');
