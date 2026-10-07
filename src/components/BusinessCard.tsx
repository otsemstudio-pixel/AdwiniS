import { forwardRef } from 'react';
import type { CardData } from '../utils/card';
import type { QrShape } from '../utils/qr';

/**
 * Les deux faces de la carte, en SVG.
 * Couleurs en valeurs fixes (pas de variables CSS) : la carte est un objet
 * imprimable dont l'apparence ne dépend ni du mode sombre, ni de la page.
 */

export const CARD_W = 856;
export const CARD_H = 540;
const CUT = 36;
const M = 56; // marge intérieure

export const CARD_COLORS = {
  ivory: '#F5F1E8',
  ink: '#16181C',
  accent: '#9A5B36',
  accentLight: '#C98A5E',
  border: '#DDD6C7',
  muted: '#A39E92',
  soft: '#D9D3C6',
};
const C = CARD_COLORS;

const SHAPE = `M0 0H${CARD_W - CUT}L${CARD_W} ${CUT}V${CARD_H}H0Z`;

const FRAUNCES = "Fraunces, Georgia, 'Times New Roman', serif";
const ARCHIVO = "Archivo, 'Helvetica Neue', Helvetica, sans-serif";
const MONO = "'Space Mono', 'Courier New', monospace";

/** Tronque un texte trop long pour sa ligne (largeur estimée en caractères). */
const fit = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

const TRI = ['M0 0H1L0 1Z', 'M0 0H1V1Z', 'M1 0V1H0Z', 'M0 0L1 1H0Z'];

/** Trame discrète : demi-carrés pivotés, même logique que le hero. */
function Weave({ x, y, cols, rows, cell, color }: { x: number; y: number; cols: number; rows: number; cell: number; color: string }) {
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inward = (Math.floor(r / 2) + Math.floor(c / 2)) % 2 === 0;
      const rot = inward ? [[2, 3], [1, 0]][r % 2][c % 2] : [[0, 1], [3, 2]][r % 2][c % 2];
      items.push(
        <path key={`${r}-${c}`} d={TRI[rot]} transform={`translate(${x + c * cell} ${y + r * cell}) scale(${cell})`} fill={color} />,
      );
    }
  }
  return <g>{items}</g>;
}

function Monogram({ x, y, size, color, cut }: { x: number; y: number; size: number; color: string; cut: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 100})`}>
      <path d="M14 90 L44 10 L56 10 L26 90 Z" fill={color} />
      <path d="M86 90 L56 10 L44 10 L74 90 Z" fill={color} />
      <rect x="24" y="56" width="52" height="11" fill={cut} />
    </g>
  );
}

interface FrontProps {
  taglineLines: string[];
  label: string;
}

export const CardFront = forwardRef<SVGSVGElement, FrontProps>(function CardFront({ taglineLines, label }, ref) {
  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      {/* Filet de contour : la carte se détache d'un fond de même couleur, angle coupé compris. */}
      <path d={SHAPE} fill={C.ivory} stroke={C.border} strokeWidth={2} />
      <Weave x={560} y={96} cols={5} rows={4} cell={48} color={C.border} />
      <Monogram x={M - 6} y={M - 8} size={72} color={C.ink} cut={C.ivory} />
      <text x={M + 76} y={M + 38} fontFamily={FRAUNCES} fontWeight={700} fontSize={40} fill={C.ink}>
        Adwini
      </text>
      <text x={M + 78} y={M + 62} fontFamily={ARCHIVO} fontWeight={700} fontSize={14} letterSpacing={6} fill={C.accent}>
        STUDIO
      </text>
      {taglineLines.map((line, i) => (
        <text key={i} x={M} y={378 + i * 40} fontFamily={FRAUNCES} fontWeight={400} fontSize={32} fill={C.ink}>
          {line}
        </text>
      ))}
      <text x={M} y={CARD_H - 34} fontFamily={MONO} fontSize={13} letterSpacing={2} fill="#5E5C55">
        KIGALI — RWANDA
      </text>
      <text x={CARD_W - M} y={CARD_H - 34} textAnchor="end" fontFamily={MONO} fontSize={13} letterSpacing={2} fill="#5E5C55">
        ADWINI / 001
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

  const plate = 208;
  const px = CARD_W - M - plate;
  const py = CARD_H - M - plate;
  const qrInner = plate - 32;

  return (
    <svg ref={ref} viewBox={`0 0 ${CARD_W} ${CARD_H}`} className="bcard__svg" role="img" aria-label={label}>
      <path d={SHAPE} fill={C.ink} stroke="#34373D" strokeWidth={2} />
      <text
        x={M}
        y={M + 56}
        fontFamily={FRAUNCES}
        fontWeight={700}
        fontSize={46}
        fill={C.ivory}
        opacity={name ? 1 : 0.4}
      >
        {fit(name || placeholders.name, 26)}
      </text>
      <text x={M} y={M + 96} fontFamily={ARCHIVO} fontSize={22} fill={C.soft} opacity={roleLine ? 1 : 0.5}>
        {fit(roleLine || `${placeholders.role} · ${placeholders.company}`, 52)}
      </text>
      <rect x={M} y={M + 124} width={48} height={3} fill={C.accentLight} />
      {rows.map((r, i) => (
        <g key={r.tag} transform={`translate(${M} ${M + 196 + i * 40})`}>
          <text fontFamily={MONO} fontSize={13} letterSpacing={2} fill={C.muted}>
            {r.tag}
          </text>
          <text x={64} fontFamily={ARCHIVO} fontSize={20} fill={C.ivory}>
            {fit(r.value.trim(), 34)}
          </text>
        </g>
      ))}
      <rect x={px} y={py} width={plate} height={plate} fill={C.ivory} />
      {qr && (
        <g transform={`translate(${px + 16} ${py + 16}) scale(${qrInner / qr.size})`}>
          <path d={qr.path} fill={C.ink} shapeRendering="crispEdges" />
        </g>
      )}
      <text x={M} y={CARD_H - 34} fontFamily={MONO} fontSize={13} letterSpacing={2} fill={C.muted}>
        ADWINI STUDIO
      </text>
    </svg>
  );
});
