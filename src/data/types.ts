/**
 * Structure commune des contenus FR et EN.
 * Toute clé ajoutée ici doit exister dans content.fr.ts ET content.en.ts —
 * TypeScript refusera de compiler sinon.
 */

export type Lang = 'fr' | 'en';

export interface SectionHead {
  /** Nom affiché à côté du numéro cerclé : « PHILOSOPHIE ». */
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
  /** Identifiant stable, relié aux prix dans data/site.ts. */
  id: 'launch' | 'growth' | 'signature' | 'whitelabel';
  name: string;
  audience: string;
  /** Texte affiché à la place du prix (« Sur devis »). */
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
  meta: { title: string; description: string; locale: string };
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
    themeToDark: string;
    themeToLight: string;
  };
  hero: {
    titleLines: [string, string];
    subtitle: string;
    primary: string;
    secondary: string;
    scroll: string;
  };
  poles: SectionHead & { intro: string; list: Pole[] };
  philosophy: SectionHead & { lines: string[]; conclusion: string };
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
  fixed: SectionHead & { intro: string; from: string; offers: FixedOffer[] };
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
  differentiators: SectionHead & {
    intro: string;
    items: { title: string; body: string }[];
    /** Noms des pictogrammes dessinés par le studio, dans l'ordre du dessin. */
    iconNames: [string, string, string, string];
  };
  tech: SectionHead & { body: string };
  network: SectionHead & {
    body: string[];
    coreTitle: string;
    core: string;
    specialistsTitle: string;
    specialists: string[];
    promise: string;
  };
  name: SectionHead & { story: string; origin: string };
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
  /** Carte de brief : formulaire de la section contact, message WhatsApp, visuel. */
  brief: {
    fields: Record<'name' | 'company' | 'sentence', { label: string; placeholder: string }>;
    needsLabel: string;
    deadlineLabel: string;
    budgetLabel: string;
    needs: Record<'id' | 'ui' | 'st' | 'unk', string>;
    deadlines: Record<'urgent' | 'month' | 'quarter' | 'none', string>;
    budgets: Record<'lt600' | '600-1200' | '1200-2200' | 'gt2200' | 'oneoff' | 'unknown', string>;
    /** « {n} / {max} caractères » */
    counter: string;
    required: string;
    optional: string;
    send: string;
    copy: string;
    download: string;
    quickTitle: string;
    quick: string;
    privacy: string;
    /** « Il manque : {fields}. » */
    missing: string;
    copied: string;
    downloaded: string;
    error: string;
    previewLabel: string;
    message: {
      hello: string;
      /** « Je suis {name}, de {company}. » */
      intro: string;
      needs: string;
      sentence: string;
      deadline: string;
      budget: string;
      link: string;
      none: string;
    };
    card: {
      label: string;
      needs: string;
      deadline: string;
      budget: string;
      mention: string;
      placeholderName: string;
      placeholderCompany: string;
      placeholderSentence: string;
    };
  };
  /** Page /brief : la carte reconstituée depuis le lien. */
  briefPage: {
    title: string;
    intro: string;
    errorTitle: string;
    errorBody: string;
    back: string;
    download: string;
  };
  /** Pages /carte et /card : la carte du fondateur. */
  founderPage: {
    title: string;
    heading: string;
    intro: string;
    role: string;
    hd: string;
    square: string;
    squareLabel: string;
    note: string;
    back: string;
  };
  footer: {
    label: string;
    navTitle: string;
    socialTitle: string;
    langTitle: string;
    thanksCaption: string;
  };
  /** Bandeaux défilants : deux séquences, la seconde défile en sens inverse. */
  marquee: { primary: string[]; secondary: string[] };
  tagline: string;
}
