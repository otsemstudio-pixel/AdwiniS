import { forwardRef, useEffect, useState } from 'react';
import { mark, wordmark } from '../data/brand';
import type { CardData } from '../utils/card';
import type { QrShape } from '../utils/qr';

/**
 * Les deux faces de la carte, en SVG.
 * Couleurs en valeurs fixes (pas de variables CSS) : la carte est un objet
 * dont l'apparence ne dépend ni du thème, ni de la page — et l'export PNG
 * sérialise le SVG hors de la page.
 */

export const CARD_W = 856;
export const CARD_H = 540;
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
};
const C = CARD_COLORS;

const OUTFIT = "Outfit, 'Segoe UI', system-ui, sans-serif";
const ARCHIVO = "Archivo, 'Segoe UI', system-ui, sans-serif";
const MONO = "'JetBrains Mono', 'Courier New', monospace";

/** Tronque un texte trop long pour sa ligne (largeur estimée en caractères). */
const fit = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function Frame({ fill, stroke }: { fill: string; stroke: string }) {
  const s = STROKE / 2;
  return (
    <rect x={s} y={s} width={CARD_W - STROKE} height={CARD_H - STROKE} rx={RADIUS} fill={fill} stroke={stroke} strokeWidth={STROKE} />
  );
}

/** Le logo est monochrome : trait et éclats de la même couleur. */
function Mark({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${size / 100})`}
      fill="none"
      strokeWidth={mark.strokeWidth}
      strokeLinecap={mark.linecap}
      strokeLinejoin="round"
    >
      {mark.strokes.map((d) => (
        <path key={d} d={d} stroke={color} />
      ))}
      {mark.sparks.map((d) => (
        <path key={d} d={d} stroke={color} />
      ))}
    </g>
  );
}

interface FrontProps {
  taglineLines: string[];
  label: string;
}

export const CardFront = forwardRef<SVGSVGElement, FrontProps>(function CardFront({ taglineLines, label }, ref) {
  const wmH = 30;
  // Le tracé du wordmark (15 Ko) n'est inséré qu'après chargement : il reste hors du HTML prérendu.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      <Frame fill={C.ivory} stroke={C.ink} />
      <Mark x={M - 12} y={M - 12} size={112} color={C.ink} />
      {mounted && (
        <g transform={`translate(${M} ${M + 124}) scale(${wmH / wordmark.height})`} fill={C.ink} fillRule="evenodd">
          <path d={wordmark.d} />
        </g>
      )}
      {taglineLines.map((line, i) => (
        <text key={i} x={M} y={CARD_H - M - 40 - (taglineLines.length - 1 - i) * 34} fontFamily={OUTFIT} fontWeight={600} fontSize={28} letterSpacing={-0.5} fill={C.ink}>
          {line}
        </text>
      ))}
      <text x={CARD_W - M} y={M + 14} textAnchor="end" fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill="#5E5C55">
        ADWINI / 001
      </text>
      <text x={CARD_W - M} y={CARD_H - M + 6} textAnchor="end" fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill="#5E5C55">
        KIGALI — RWANDA
      </text>
    </svg>
  );
});

interface BackProps {
  data: CardData;
  placeholders: Pick<CardData, 'name' | 'role' | 'company'>;
  qr: QrShape | null;
  label: string;
}

export const CardBack = forwardRef<SVGSVGElement, BackProps>(function CardBack({ data, placeholders, qr, label }, ref) {
  const name = data.name.trim();
  const roleLine = [data.role.trim(), data.company.trim()].filter(Boolean).join(' · ');
  const rows = [
    { tag: 'MAIL', value: data.email },
    { tag: 'TEL', value: data.phone },
    { tag: 'WEB', value: data.website },
    { tag: 'IN', value: data.linkedin },
    { tag: 'IG', value: data.instagram },
  ].filter((r) => r.value.trim());

  const plate = 200;
  const px = CARD_W - M - plate;
  const py = CARD_H - M - plate;
  const qrInner = plate - 32;

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
      {rows.map((r, i) => (
        <g key={r.tag} transform={`translate(${M} ${M + 180 + i * 40})`}>
          <text fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.muted}>
            {r.tag}
          </text>
          <text x={64} fontFamily={ARCHIVO} fontSize={20} fill={C.ivory}>
            {fit(r.value.trim(), 32)}
          </text>
        </g>
      ))}
      <rect x={px} y={py} width={plate} height={plate} rx={18} fill={C.ivory} />
      {qr && (
        <g transform={`translate(${px + 16} ${py + 16}) scale(${qrInner / qr.size})`}>
          <path d={qr.path} fill={C.ink} shapeRendering="crispEdges" />
        </g>
      )}
      <text x={M} y={CARD_H - M + 6} fontFamily={MONO} fontSize={13} letterSpacing={2.4} fill={C.muted}>
        ADWINI STUDIO
      </text>
    </svg>
  );
});
