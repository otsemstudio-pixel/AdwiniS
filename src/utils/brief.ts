/**
 * Carte de brief : modèle, encodage dans l'URL, validation, message WhatsApp.
 * Rien n'est envoyé à un serveur : les réponses voyagent dans le lien que le visiteur envoie.
 */

export const NEEDS = ['id', 'ui', 'st', 'unk'] as const; // identité, interfaces, récits, je ne sais pas
export const DEADLINES = ['urgent', 'month', 'quarter', 'none'] as const;
export const BUDGETS = ['lt600', '600-1200', '1200-2200', 'gt2200', 'oneoff', 'unknown'] as const;

export type Need = (typeof NEEDS)[number];
export type Deadline = (typeof DEADLINES)[number];
export type Budget = (typeof BUDGETS)[number];

export interface Brief {
  name: string;
  company: string;
  needs: Need[];
  sentence: string;
  deadline: Deadline | '';
  budget: Budget | '';
}

/** Longueurs maximales : elles bornent aussi la taille des liens générés. */
export const LIMITS = { name: 40, company: 60, sentence: 140 } as const;

export const emptyBrief = (): Brief => ({ name: '', company: '', needs: [], sentence: '', deadline: '', budget: '' });

export type BriefField = 'name' | 'company' | 'sentence';

/** Champs obligatoires manquants, dans l'ordre du formulaire. */
export function missingFields(b: Brief): BriefField[] {
  const out: BriefField[] = [];
  if (!b.name.trim()) out.push('name');
  if (!b.company.trim()) out.push('company');
  if (!b.sentence.trim()) out.push('sentence');
  return out;
}

/* ─── Encodage : JSON compact → (deflate si disponible) → base64 sûr pour les URL ─── */

const toB64Url = (bytes: Uint8Array) => {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromB64Url = (s: string) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

const compact = (b: Brief) => ({
  n: b.name.trim(),
  c: b.company.trim(),
  b: b.needs,
  s: b.sentence.trim(),
  e: b.deadline,
  g: b.budget,
});

/**
 * Sérialise un brief pour le paramètre `d`. Préfixe « z » : compressé (deflate-raw),
 * « j » : JSON brut (navigateur sans CompressionStream). On garde le plus court.
 */
export async function encodeBrief(b: Brief): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(compact(b)));
  const plain = 'j' + toB64Url(json);
  if (typeof CompressionStream === 'undefined') return plain;
  try {
    const packed = 'z' + toB64Url(await pipe(json, new CompressionStream('deflate-raw')));
    return packed.length < plain.length ? packed : plain;
  } catch {
    return plain;
  }
}

export class BriefError extends Error {}

const isStr = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;

/**
 * Lit et VALIDE un paramètre `d`. Lève BriefError si le paramètre est absent, malformé,
 * ou si un champ sort de ses bornes. Le résultat n'est jamais injecté en HTML brut :
 * il est affiché comme texte par React.
 */
export async function decodeBrief(d: string | null): Promise<Brief> {
  if (!d || d.length > 1500 || !/^[jz][A-Za-z0-9_-]+$/.test(d)) throw new BriefError('format');
  let raw: unknown;
  try {
    let bytes = fromB64Url(d.slice(1));
    if (d[0] === 'z') {
      if (typeof DecompressionStream === 'undefined') throw new BriefError('unsupported');
      bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
    }
    if (bytes.length > 4000) throw new BriefError('size');
    raw = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch (err) {
    throw err instanceof BriefError ? err : new BriefError('format');
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new BriefError('shape');
  const o = raw as Record<string, unknown>;
  const needs = o.b;
  if (
    !isStr(o.n, LIMITS.name) ||
    !isStr(o.c, LIMITS.company) ||
    !isStr(o.s, LIMITS.sentence) ||
    !Array.isArray(needs) ||
    needs.length > NEEDS.length ||
    !needs.every((n) => (NEEDS as readonly unknown[]).includes(n)) ||
    !(o.e === '' || (DEADLINES as readonly unknown[]).includes(o.e)) ||
    !(o.g === '' || (BUDGETS as readonly unknown[]).includes(o.g))
  ) {
    throw new BriefError('shape');
  }
  const brief: Brief = {
    name: o.n,
    company: o.c,
    needs: [...new Set(needs as Need[])],
    sentence: o.s,
    deadline: o.e as Deadline | '',
    budget: o.g as Budget | '',
  };
  if (missingFields(brief).length) throw new BriefError('incomplete');
  return brief;
}

/** Identifiant court et stable (FNV-1a) : la même carte garde le même code partout. */
export function briefCode(b: Brief) {
  let h = 0x811c9dc5;
  for (const ch of JSON.stringify(compact(b))) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(6, '0').slice(-4);
}

/* ─── Message WhatsApp ─── */

export interface MessageLabels {
  hello: string;
  /** « Je suis {name}, de {company}. » */
  intro: string;
  needs: string;
  sentence: string;
  deadline: string;
  budget: string;
  link: string;
  none: string;
}

export const MAX_MESSAGE = 600;
export const MAX_URL = 1500;

/**
 * Construit l'URL wa.me. Le message reste lisible et sous 600 caractères (hors lien) ;
 * l'URL complète reste sous 1 500 caractères. Si besoin, le message tronque d'abord la phrase
 * libre, puis l'entreprise, puis le nom (écritures non latines : 9 caractères par signe une fois
 * encodés) — le lien de la carte, lui, porte toujours la version complète.
 */
export function whatsappUrl(
  number: string,
  b: Brief,
  link: string,
  labels: MessageLabels,
  names: { needs: string; deadline: string; budget: string },
) {
  const parts = { sentence: b.sentence.trim(), company: b.company.trim(), name: b.name.trim() };
  const cut = { sentence: false, company: false, name: false };
  const show = (k: keyof typeof parts) => (cut[k] ? `${parts[k]}…` : parts[k]);
  const build = () =>
    [
      labels.hello,
      '',
      labels.intro.replace('{name}', show('name')).replace('{company}', show('company')),
      `${labels.needs} : ${names.needs || labels.none}`,
      `${labels.sentence} : ${show('sentence')}`,
      `${labels.deadline} : ${names.deadline || labels.none}`,
      `${labels.budget} : ${names.budget || labels.none}`,
      '',
      `${labels.link} : `,
    ].join('\n');
  const url = (msg: string) => `https://wa.me/${number}?text=${encodeURIComponent(msg + link)}`;
  const tooLong = (msg: string) => msg.length > MAX_MESSAGE || url(msg).length > MAX_URL;
  let msg = build();
  for (const k of ['sentence', 'company', 'name'] as const) {
    const floor = k === 'sentence' ? 0 : 8; // nom et entreprise gardent au moins quelques signes
    while (tooLong(msg) && [...parts[k]].length > floor) {
      parts[k] = [...parts[k]].slice(0, -5).join('').trimEnd();
      cut[k] = true;
      msg = build();
    }
  }
  return url(msg);
}

/** Message d'accueil de la sortie rapide (sans formulaire). */
export const quickWhatsappUrl = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
