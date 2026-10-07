import { pad } from '../utils/format';

/** Étiquette numérotée en Space Mono : « 01 / PHILOSOPHIE ». */
export function SectionLabel({ index, label }: { index: number; label: string }) {
  return (
    <p className="section-label">
      <span className="section-label__num">{pad(index)}</span>
      <span aria-hidden="true"> / </span>
      <span className="visually-hidden"> — </span>
      {label}
    </p>
  );
}
