import type { Content } from '../data';

/** Liens de navigation : ancres stables, libellés traduits. */
export const navLinks = (t: Content) => [
  { href: '#travaux', label: t.nav.work },
  { href: '#services', label: t.nav.services },
  { href: '#studio', label: t.nav.studio },
  { href: '#carte', label: t.nav.card },
];
