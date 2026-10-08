import { forwardRef, useEffect, useState } from 'react';
import { mark, wordmark } from '../data/brand';
import { isPlaceholder } from '../data/site';
import type { CardData } from '../utils/card';
import type { QrShape } from '../utils/qr';

/**
 * Moteur de rendu des cartes Adwini, en SVG — un seul système, plusieurs variantes :
 *  - CardFront / CardBack : la carte de visite (856 × 540), recto et verso ;
 *  - CardSquare           : la même carte composée au carré (1080 × 1080) pour les réseaux ;
 *  - BriefCard            : la carte de brief (856 × 540), fond clair et filet d'accent.
 *
 * Couleurs en valeurs fixes (pas de variables CSS) : une carte est un objet dont
 * l'apparence ne dépend ni du thème ni de la page — et l'export PNG sérialise le SVG
 * hors de la page.
 */

export const CARD_W = 856;
export const CARD_H = 540;
export const SQUARE = 1080;
const M = 60; // marge intérieure
const RADIUS = 26; // ≈ 20 px à la taille d'affichage
const STROKE = 2.7; // ≈ 2 px à la taille d'affichage

export const CARD_COLORS = {
  ivory: '#FAF8F4',
  ink: '#16181C',
  accent: '#4B2A7B',
  accentLight: '#A68FDB',
  soft: '#D9D4CA',
  muted: '#9B968C',
  grey: '#5E5C55',
};
const C = CARD_COLORS;

const OUTFIT = "Outfit, 'Segoe UI', system-ui, sans-serif";
const ARCHIVO = "Archivo, 'Segoe UI', system-ui, sans-serif";
const MONO = "'JetBrains Mono', 'Courier New', monospace";

/* ═══ Primitives partagées ═══ */

/** Tronque un texte trop long pour sa ligne (largeur estimée en caractères). */
const fit = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Découpe un texte en lignes d'au plus `max` caractères, sur `lines` lignes au plus. */
function wrap(text: string, max: number, lines: number) {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= max) line = next;
    else {
      if (line) out.push(line);
      line = word.length > max ? fit(word, max) : word;
    }
  }
  if (line) out.push(line);
  if (out.length > lines) {
    const kept = out.slice(0, lines);
    kept[lines - 1] = fit(`${kept[lines - 1]} ${out[lines]}`, max - 1).replace(/…?$/, '…');
    return kept;
  }
  return out;
}

function Frame({ fill, stroke, w = CARD_W, h = CARD_H }: { fill: string; stroke: string; w?: number; h?: number }) {
  const s = STROKE / 2;
  return <rect x={s} y={s} width={w - STROKE} height={h - STROKE} rx={RADIUS} fill={fill} stroke={stroke} strokeWidth={STROKE} />;
}

/** Le logo est monochrome : trait et éclats de la même couleur. */
function Mark({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 100})`} fill="none" strokeWidth={mark.strokeWidth} strokeLinecap={mark.linecap} strokeLinejoin="round">
      {mark.strokes.concat(mark.sparks).map((d) => (
        <path key={d} d={d} stroke={color} />
      ))}
    </g>
  );
}

/** Le tracé du wordmark (15 Ko) n'est inséré qu'après chargement : il reste hors du HTML prérendu. */
function Wordmark({ x, y, h, color }: { x: number; y: number; h: number; color: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${h / wordmark.height})`} fill={color} fillRule="evenodd">
      <path d={wordmark.d} />
    </g>
  );
}

function QrPlate({ x, y, size, qr, text }: { x: number; y: number; size: number; qr: QrShape | null; text?: string }) {
  const inner = size - 32;
  return (
    <g data-qr-text={text}>
      <rect x={x} y={y} width={size} height={size} rx={18} fill={C.ivory} />
      {qr && (
        <g transform={`translate(${x + 16} ${y + 16}) scale(${inner / qr.size})`}>
          <path d={qr.path} fill={C.ink} shapeRendering="crispEdges" />
        </g>
      )}
    </g>
  );
}

/** Coordonnées affichées : les champs vides et les emplacements « [À REMPLIR] » sont omis. */
function contactRows(data: CardData) {
  return [
    { tag: 'MAIL', value: data.email },
    { tag: 'TEL', value: data.phone },
    { tag: 'WEB', value: data.website },
    { tag: 'IN', value: data.linkedin },
    { tag: 'IG', value: data.instagram },
  ].filter((r) => r.value.trim() && !isPlaceholder(r.value));
}

function Rows({ data, x, y, step, size, tagColor, color, max }: { data: CardData; x: number; y: number; step: number; size: number; tagColor: string; color: string; max: number }) {
  return (
    <>
      {contactRows(data).map((r, i) => (
        <g key={r.tag} transform={`translate(${x} ${y + i * step})`}>
          <text fontFamily={MONO} fontSize={size * 0.65} letterSpacing={2.4} fill={tagColor}>
            {r.tag}
          </text>
          <text x={size * 3.2} fontFamily={ARCHIVO} fontSize={size} fill={color}>
            {fit(r.value.trim(), max)}
          </text>
        </g>
      ))}
    </>
  );
}

/* ═══ Carte de visite : recto ═══ */

interface FrontProps {
  taglineLines: string[];
  label: string;
}

export const CardFront = forwardRef<SVGSVGElement, FrontProps>(function CardFront({ taglineLines, label }, ref) {
  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      <Frame fill={C.ivory} stroke={C.ink} />
      <Mark x={M - 12} y={M - 12} size={112} color={C.ink} />
      <Wordmark x={M} y={M + 124} h={30} color={C.ink} />
      {taglineLines.map((line, i) => (
        <text key={i} x={M} y={CARD_H - M - 40 - (taglineLines.length - 1 - i) * 34} fontFamily={OUTFIT} fontWeight={600} fontSize={28} letterSpacing={-0.5} fill={C.ink}>
          {line}
        </text>
      ))}
      <text x={CARD_W - M} y={M + 14} textAnchor="end" fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.grey}>
        ADWINI / 001
      </text>
      <text x={CARD_W - M} y={CARD_H - M + 6} textAnchor="end" fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.grey}>
        KIGALI — RWANDA
      </text>
    </svg>
  );
});

/* ═══ Carte de visite : verso ═══ */

interface BackProps {
  data: CardData;
  placeholders: Pick<CardData, 'name' | 'role' | 'company'>;
  qr: QrShape | null;
  /** Texte encodé dans le QR (exposé en attribut pour vérification). */
  qrText?: string;
  label: string;
}

const roleLineOf = (data: CardData) => [data.role.trim(), data.company.trim()].filter(Boolean).join(' · ');

export const CardBack = forwardRef<SVGSVGElement, BackProps>(function CardBack({ data, placeholders, qr, qrText, label }, ref) {
  const name = data.name.trim();
  const roleLine = roleLineOf(data);
  const plate = 200;
  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      <Frame fill={C.ink} stroke={C.ink} />
      <text x={M} y={M + 44} fontFamily={OUTFIT} fontWeight={600} fontSize={46} letterSpacing={-1.2} fill={C.ivory} opacity={name ? 1 : 0.4}>
        {fit(name || placeholders.name, 26)}
      </text>
      <text x={M} y={M + 84} fontFamily={ARCHIVO} fontSize={21} fill={C.soft} opacity={roleLine ? 1 : 0.5}>
        {fit(roleLine || `${placeholders.role} · ${placeholders.company}`, 52)}
      </text>
      <line x1={M} y1={M + 114} x2={M + 56} y2={M + 114} stroke={C.accentLight} strokeWidth={STROKE} strokeLinecap="round" />
      <Rows data={data} x={M} y={M + 180} step={40} size={20} tagColor={C.muted} color={C.ivory} max={36} />
      <QrPlate x={CARD_W - M - plate} y={CARD_H - M - plate} size={plate} qr={qr} text={qrText} />
      <text x={M} y={CARD_H - M + 6} fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.muted}>
        ADWINI STUDIO
      </text>
    </svg>
  );
});

/* ═══ Variante carrée 1080 × 1080 : recto et verso réunis, pour Instagram et LinkedIn ═══ */

interface SquareProps {
  data: CardData;
  qr: QrShape | null;
  taglineLines: string[];
  label: string;
}

export const CardSquare = forwardRef<SVGSVGElement, SquareProps>(function CardSquare({ data, qr, taglineLines, label }, ref) {
  const S = SQUARE;
  const P = 88;
  const split = 530; // hauteur de la partie claire (marque), le reste en encre (personne)
  return (
    <svg ref={ref} viewBox={`0 0 ${S} ${S}`} className="bcard__svg" role="img" aria-label={label}>
      <Frame fill={C.ivory} stroke={C.ink} w={S} h={S} />
      <path d={`M${STROKE} ${split}H${S - STROKE}V${S - RADIUS}Q${S - STROKE} ${S - STROKE} ${S - RADIUS} ${S - STROKE}H${RADIUS}Q${STROKE} ${S - STROKE} ${STROKE} ${S - RADIUS}Z`} fill={C.ink} />
      <Mark x={P - 14} y={P - 14} size={132} color={C.ink} />
      <Wordmark x={P} y={P + 146} h={38} color={C.ink} />
      {taglineLines.map((line, i) => (
        <text key={i} x={P} y={split - 62 - (taglineLines.length - 1 - i) * 42} fontFamily={OUTFIT} fontWeight={600} fontSize={34} letterSpacing={-0.6} fill={C.ink}>
          {line}
        </text>
      ))}
      <text x={S - P} y={P + 12} textAnchor="end" fontFamily={MONO} fontSize={16} letterSpacing={3} fill={C.grey}>
        ADWINI / 001
      </text>
      <text x={P} y={split + 112} fontFamily={OUTFIT} fontWeight={600} fontSize={58} letterSpacing={-1.6} fill={C.ivory}>
        {fit(data.name.trim(), 26)}
      </text>
      <text x={P} y={split + 160} fontFamily={ARCHIVO} fontSize={27} fill={C.soft}>
        {fit(roleLineOf(data), 52)}
      </text>
      <line x1={P} y1={split + 198} x2={P + 72} y2={split + 198} stroke={C.accentLight} strokeWidth={STROKE * 1.3} strokeLinecap="round" />
      <Rows data={data} x={P} y={split + 262} step={50} size={26} tagColor={C.muted} color={C.ivory} max={36} />
      <QrPlate x={S - P - 236} y={S - P - 236} size={236} qr={qr} />
      <text x={P} y={S - P + 8} fontFamily={MONO} fontSize={16} letterSpacing={3} fill={C.muted}>
        KIGALI — RWANDA
      </text>
    </svg>
  );
});

/* ═══ Carte de brief : fond clair, filet d'accent, code BRF ═══ */

export interface BriefCardLabels {
  label: string;
  needs: string;
  deadline: string;
  budget: string;
  mention: string;
}

interface BriefCardProps {
  name: string;
  company: string;
  sentence: string;
  /** Réponses déjà traduites (libellés des choix). */
  needs: string[];
  deadline: string;
  budget: string;
  code: string;
  labels: BriefCardLabels;
  /** Les champs vides affichent un texte d'exemple atténué. */
  placeholders: { name: string; company: string; sentence: string };
  label: string;
}

/** Une étiquette : capsule à contour de 2 px, largeur estimée d'après le texte. */
function Tag({ x, y, text, h = 34 }: { x: number; y: number; text: string; h?: number }) {
  const w = Math.round(text.length * 9.6 + 30);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={h / 2} fill="none" stroke={C.ink} strokeWidth={2} />
      <text x={w / 2} y={h / 2 + 6} textAnchor="middle" fontFamily={ARCHIVO} fontSize={16} fill={C.ink}>
        {text}
      </text>
    </g>
  );
}

const tagWidth = (text: string) => Math.round(text.length * 9.6 + 30);

export const BriefCard = forwardRef<SVGSVGElement, BriefCardProps>(function BriefCard(props, ref) {
  const { name, company, sentence, needs, deadline, budget, code, labels, placeholders, label } = props;
  const lines = wrap(sentence.trim() || placeholders.sentence, 52, 3);
  const L = M + 14; // décalage après le filet

  // Trois groupes d'étiquettes, posés en ligne puis renvoyés à la ligne s'ils débordent.
  const groups = [
    { title: labels.needs, items: needs },
    { title: labels.deadline, items: deadline ? [deadline] : [] },
    { title: labels.budget, items: budget ? [budget] : [] },
  ].filter((g) => g.items.length);
  let gx = L;
  let gy = 340;
  const placed = groups.map((g) => {
    const width = Math.max(g.title.length * 8.4, g.items.reduce((s, it) => s + tagWidth(it) + 8, -8));
    if (gx > L && gx + width > CARD_W - M) {
      gx = L;
      gy += 74;
    }
    const at = { ...g, x: gx, y: gy };
    gx += width + 28;
    return at;
  });

  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      <Frame fill={C.ivory} stroke={C.ink} />
      <line x1={M - 22} y1={M - 14} x2={M - 22} y2={CARD_H - M + 14} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
      <text x={L} y={M + 8} fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.grey}>
        {labels.label}
      </text>
      <text x={CARD_W - M} y={M + 8} textAnchor="end" fontFamily={MONO} fontSize={14} letterSpacing={2.4} fill={C.accent}>
        BRF—{code}
      </text>
      <text x={L} y={M + 70} fontFamily={OUTFIT} fontWeight={600} fontSize={42} letterSpacing={-1.1} fill={C.ink} opacity={name.trim() ? 1 : 0.35}>
        {fit(name.trim() || placeholders.name, 30)}
      </text>
      <text x={L} y={M + 106} fontFamily={ARCHIVO} fontSize={22} fill={C.grey} opacity={company.trim() ? 1 : 0.5}>
        {fit(company.trim() || placeholders.company, 58)}
      </text>
      {lines.map((line, i) => (
        <text key={i} x={L} y={M + 160 + i * 30} fontFamily={OUTFIT} fontWeight={600} fontSize={23} letterSpacing={-0.3} fill={C.ink} opacity={sentence.trim() ? 1 : 0.35}>
          {line}
        </text>
      ))}
      {placed.map((g) => (
        <g key={g.title}>
          <text x={g.x} y={g.y} fontFamily={MONO} fontSize={11} letterSpacing={2.2} fill={C.grey}>
            {g.title}
          </text>
          {g.items.reduce<{ x: number; nodes: JSX.Element[] }>(
            (acc, item) => {
              acc.nodes.push(<Tag key={item} x={acc.x} y={g.y + 10} text={item} />);
              acc.x += tagWidth(item) + 8;
              return acc;
            },
            { x: g.x, nodes: [] },
          ).nodes}
        </g>
      ))}
      <Mark x={L - 8} y={CARD_H - M - 50} size={60} color={C.ink} />
      <text x={CARD_W - M} y={CARD_H - M + 6} textAnchor="end" fontFamily={ARCHIVO} fontSize={13} fill={C.grey}>
        {labels.mention}
      </text>
    </svg>
  );
});
