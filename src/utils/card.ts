import type { CardField } from '../data/types';

export type CardKey = CardField['key'];
export type CardData = Record<CardKey, string>;

export const CARD_KEYS: CardKey[] = ['name', 'role', 'company', 'email', 'phone', 'website', 'linkedin', 'instagram'];

export const emptyCard = (): CardData =>
  Object.fromEntries(CARD_KEYS.map((k) => [k, ''])) as CardData;

export const hasContent = (data: CardData) => CARD_KEYS.some((k) => data[k].trim() !== '');

/** Ajoute https:// si besoin, pour les liens du vCard. */
function toUrl(value: string, base?: string) {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  if (base && !v.includes('.')) return base + v.replace(/^@/, '');
  return `https://${v.replace(/^\/+/, '')}`;
}

export const linkedinUrl = (v: string) => toUrl(v, 'https://www.linkedin.com/in/');
export const instagramUrl = (v: string) => toUrl(v, 'https://instagram.com/');

/** Échappement vCard 3.0 : antislash, virgule, point-virgule, retours à la ligne. */
const esc = (v: string) => v.trim().replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\r?\n/g, '\\n');

/** vCard 3.0, compris par Android, iOS et les clients de messagerie. */
export function buildVCard(d: CardData) {
  const name = d.name.trim();
  const parts = name.split(/\s+/);
  const last = parts.length > 1 ? parts.pop()! : '';
  const first = parts.join(' ');
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`N:${esc(last)};${esc(first)};;;`);
  lines.push(`FN:${esc(name || d.company || 'Contact')}`);
  if (d.company.trim()) lines.push(`ORG:${esc(d.company)}`);
  if (d.role.trim()) lines.push(`TITLE:${esc(d.role)}`);
  if (d.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${esc(d.email)}`);
  if (d.phone.trim()) lines.push(`TEL;TYPE=CELL:${esc(d.phone)}`);
  if (d.website.trim()) lines.push(`URL:${esc(toUrl(d.website))}`);
  if (d.linkedin.trim()) lines.push(`URL;TYPE=LinkedIn:${esc(linkedinUrl(d.linkedin))}`);
  if (d.instagram.trim()) lines.push(`URL;TYPE=Instagram:${esc(instagramUrl(d.instagram))}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/** Données ↔ fragment d'URL « #carte?n=…&r=… ». Les données restent dans l'adresse, jamais sur un serveur. */
const SHORT: Record<CardKey, string> = {
  name: 'n',
  role: 'r',
  company: 'c',
  email: 'e',
  phone: 'p',
  website: 'w',
  linkedin: 'l',
  instagram: 'i',
};

export const HASH_PREFIX = '#carte?';

export function cardToHash(d: CardData) {
  const params = new URLSearchParams();
  for (const k of CARD_KEYS) if (d[k].trim()) params.set(SHORT[k], d[k].trim());
  return HASH_PREFIX + params.toString();
}

export function cardFromHash(hash: string): CardData | null {
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const params = new URLSearchParams(hash.slice(HASH_PREFIX.length));
  const data = emptyCard();
  for (const k of CARD_KEYS) data[k] = (params.get(SHORT[k]) ?? '').slice(0, 120);
  return data;
}

/** Déclenche le téléchargement d'un fichier généré côté client. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** « Amani Uwase » → « amani-uwase » pour les noms de fichiers. */
export const slug = (v: string) =>
  v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'carte';

/** Copie dans le presse-papiers, avec repli pour les contextes non sécurisés. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}
