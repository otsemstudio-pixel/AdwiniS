/**
 * Structure commune des contenus FR et EN.
 * Toute clé ajoutée ici doit exister dans content.fr.ts ET content.en.ts —
 * TypeScript refusera de compiler sinon.
 */

export type Lang = 'fr' | 'en';

export interface SectionHead {
  /** Nom court affiché dans l'étiquette numérotée : « 01 / PHILOSOPHIE ». */
  label: string;
  title: string;
}

export interface Pole {
  code: string;
  name: string;
  intro: string;
  items: string[];
}

export interface Plan {
  /** Identifiant stable, relié aux prix dans data/pricing.ts. */
  id: 'launch' | 'growth' | 'signature' | 'whitelabel';
  name: string;
  audience: string;
  /** Texte affiché à la place du prix (« Sur devis »). Vide si le prix est chiffré. */
  priceNote?: string;
  featuredNote?: string;
}

export interface FixedOffer {
  id: 'sprint' | 'identity' | 'custom';
  name: string;
  description: string;
}

export interface Project {
  code: string;
  category: string;
  title: string;
  summary: string;
  imageLabel: string;
  problem: string;
  insight: string;
  direction: string;
  system: string;
}

export interface CardField {
  key: 'name' | 'role' | 'company' | 'email' | 'phone' | 'website' | 'linkedin' | 'instagram';
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'tel' | 'url';
  autoComplete: string;
}

export interface Content {
  meta: {
    title: string;
    description: string;
    locale: string;
  };
  skipLink: string;
  nav: {
    work: string;
    services: string;
    studio: string;
    card: string;
    cta: string;
    menu: string;
    close: string;
    langLabel: string;
    primaryLabel: string;
  };
  hero: {
    titleLines: [string, string];
    subtitle: string;
    primary: string;
    secondary: string;
    visualLabel: string;
  };
  philosophy: SectionHead & {
    lines: string[];
    conclusion: string;
  };
  poles: SectionHead & {
    intro: string;
    list: Pole[];
  };
  subscription: SectionHead & {
    intro: string;
    perMonth: string;
    activeRequests: string;
    turnaround: string;
    hours: string;
    plans: Plan[];
    includedTitle: string;
    included: string[];
    excludedTitle: string;
    excluded: string[];
    cta: string;
  };
  fixed: SectionHead & {
    intro: string;
    from: string;
    offers: FixedOffer[];
  };
  work: SectionHead & {
    intro: string;
    tag: string;
    view: string;
    close: string;
    problem: string;
    insight: string;
    direction: string;
    system: string;
    disclaimer: string;
    projects: Project[];
  };
  network: SectionHead & {
    body: string[];
    coreTitle: string;
    core: string;
    specialistsTitle: string;
    specialists: string[];
    promise: string;
  };
  tech: SectionHead & {
    body: string;
  };
  name: SectionHead & {
    word: string;
    phonetic: string;
    story: string;
    origin: string;
  };
  differentiators: SectionHead & {
    items: { code: string; title: string; body: string }[];
    /** Noms des pictogrammes dessinés par le studio, dans l'ordre du dessin. */
    iconNames: [string, string, string, string];
  };
  card: SectionHead & {
    intro: string;
    fields: CardField[];
    privacy: string;
    shareNote: string;
    flip: string;
    download: string;
    share: string;
    vcard: string;
    front: string;
    back: string;
    previewLabel: string;
    copied: string;
    shared: string;
    downloaded: string;
    error: string;
    shareTitle: string;
    shareText: string;
    taglineLines: string[];
  };
  contact: SectionHead & {
    intro: string;
    whatsapp: string;
    email: string;
    socials: string;
    whatsappMessage: string;
  };
  footer: {
    navTitle: string;
    socialTitle: string;
    langTitle: string;
    thanksCaption: string;
  };
  tagline: string;
}
