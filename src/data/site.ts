/**
 * Données indépendantes de la langue : coordonnées, prix, liens.
 * Remplacez les valeurs entre crochets avant la mise en ligne.
 */

export const site = {
  /** Numéro au format international, chiffres uniquement, sans « + » ni espaces (ex. 250788123456). */
  whatsappNumber: '[NUMÉRO WHATSAPP]',
  email: '[EMAIL]',
  /** URL publique du site, utilisée pour le QR code par défaut et le lien de partage. */
  url: 'https://www.adwinistudio.com/',
  city: 'KIGALI — RWANDA',
  year: 2026,
  socials: [
    { label: 'Instagram', href: '[LIEN INSTAGRAM]' },
    { label: 'LinkedIn', href: '[LIEN LINKEDIN]' },
    { label: 'Behance', href: '[LIEN BEHANCE]' },
  ],
} as const;

/** Prix mensuels en dollars US. `null` = sur devis. */
export const pricing = {
  launch: { price: 600, activeRequests: 1, turnaroundHours: 72, featured: false, code: 'ABO—001' },
  growth: { price: 1200, activeRequests: 2, turnaroundHours: 48, featured: true, code: 'ABO—002' },
  signature: { price: 2200, activeRequests: 3, turnaroundHours: 48, featured: false, code: 'ABO—003' },
  whitelabel: { price: null, activeRequests: 2, turnaroundHours: 48, featured: false, code: 'ABO—004' },
} as const;

/** Prestations à prix fixe — prix « à partir de », en dollars US. */
export const fixedPricing = {
  sprint: { price: 2500, code: 'FIX—001' },
  identity: { price: 3500, code: 'FIX—002' },
  custom: { price: 4000, code: 'FIX—003' },
} as const;

/** Un emplacement non rempli contient encore des crochets. */
export const isPlaceholder = (value: string) => value.includes('[');
