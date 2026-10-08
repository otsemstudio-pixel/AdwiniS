import type { Content } from './types';

const en: Content = {
  meta: {
    title: 'Adwini Studio — Brand identity and interface design, Kigali',
    description:
      'A design studio in Kigali building brand identities, interfaces and visual stories for the next generation of African companies. Published subscription prices, work delivered in English and French.',
    locale: 'en_GB',
  },
  skipLink: 'Skip to content',
  nav: {
    work: 'Work',
    services: 'Services',
    studio: 'Studio',
    card: 'Card',
    cta: 'Start a project',
    menu: 'Open menu',
    close: 'Close menu',
    langLabel: 'Site language',
    primaryLabel: 'Main navigation',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
  },
  hero: {
    titleLines: ['African ideas.', 'Seen differently.'],
    subtitle: 'Adwini Studio builds the visual codes of the next generation of African companies.',
    primary: 'Start a project',
    secondary: 'Explore the studio',
    scroll: 'Scroll',
  },
  philosophy: {
    label: 'Philosophy',
    title: 'Design is not decoration.',
    lines: [
      'It is interpretation.',
      'It is strategy.',
      'It is culture.',
      'It is memory.',
      'It is emotion.',
      'It is business.',
    ],
    conclusion: 'We believe African companies deserve a visual language of their own.',
  },
  poles: {
    label: 'Services',
    title: 'Three disciplines. One language.',
    intro:
      'Every project moves through all three. A coherent brand should feel the same on a phone screen as it does in an investor deck.',
    list: [
      {
        code: 'POL—001',
        name: 'Identity',
        intro: 'What makes a brand recognisable at a glance.',
        items: ['Logotype and brand system', 'Custom typefaces', 'Lettering', 'Iconography', 'Brand guidelines'],
      },
      {
        code: 'POL—002',
        name: 'Interfaces',
        intro: 'What makes a product obvious to use.',
        items: ['Screen design', 'User journeys', 'Design systems', 'Websites', 'Dashboards'],
      },
      {
        code: 'POL—003',
        name: 'Stories',
        intro: 'What gives a story motion and meaning.',
        items: ['Motion identity', 'Motion design', 'Investor decks', 'Data visualisation'],
      },
    ],
  },
  differentiators: {
    label: 'Commitments',
    title: 'What changes with us.',
    intro: 'Five commitments, in writing, on every single project.',
    items: [
      {
        title: 'Pay with mobile money',
        body: 'Mobile money works just as well as a card. No international bank account needed.',
      },
      {
        title: 'English and French',
        body: 'Every deliverable ships in both languages, written and checked by people — never machine-translated and left at that.',
      },
      {
        title: 'Your source files',
        body: 'You own the source files. Walk away with everything, no exit fee.',
      },
      {
        title: 'On-time guarantee',
        body: 'If we deliver late, the delay is credited back to your subscription.',
      },
      {
        title: 'Icons drawn for here',
        body:
          'Off-the-shelf icon sets were drawn for a Western everyday. The mobile money wallet, the moto-taxi, the market stall and the CFA franc are missing. So we draw our own African icons and typefaces.',
      },
    ],
    iconNames: ['Mobile money wallet', 'Moto-taxi', 'Market stall', 'CFA franc'],
  },
  subscription: {
    label: 'Subscription',
    title: 'One subscription. Prices on the table.',
    intro: 'Send requests, we work through them one by one within the stated turnaround. Pause whenever you like.',
    perMonth: '/ month',
    activeRequests: 'Active requests',
    turnaround: 'Turnaround per delivery',
    hours: 'h',
    plans: [
      { id: 'launch', name: 'Launch', audience: 'For a young brand laying its foundations.' },
      {
        id: 'growth',
        name: 'Growth',
        audience: 'For a business that ships design every week.',
        featuredNote: 'Most popular',
      },
      { id: 'signature', name: 'Signature', audience: 'For teams moving on several fronts at once.' },
      {
        id: 'whitelabel',
        name: 'White label',
        audience: 'For agencies that need a quiet production studio behind them.',
        priceNote: 'Custom quote',
      },
    ],
    includedTitle: 'Included in every plan',
    included: [
      'Animated logo free in your first month',
      'Mobile money payments',
      'Pause any time',
      'You own the source files',
      'On-time guarantee',
    ],
    excludedTitle: 'Not included',
    excluded: ['App development', 'Printing', 'Media buying', 'Video shoots'],
    cta: 'Choose this plan',
  },
  fixed: {
    label: 'Fixed price',
    title: 'A defined project? A fixed price.',
    intro: 'For one-off needs, no subscription. The final price follows the scope — never a surprise.',
    from: 'From',
    offers: [
      {
        id: 'sprint',
        name: 'Design sprint',
        description: 'Five days from idea to a direction you can test: workshops, routes, mock-ups.',
      },
      {
        id: 'identity',
        name: 'Full identity',
        description: 'Logotype, type, colour, iconography and guidelines, delivered in English and French.',
      },
      {
        id: 'custom',
        name: 'Custom typeface or icon set',
        description: 'A typeface or a family of icons drawn for your brand and your market.',
      },
    ],
  },
  work: {
    label: 'Work',
    title: 'Studio concepts.',
    intro:
      'The studio is new. Rather than invent clients, we show how we think through self-initiated concepts.',
    tag: 'Adwini concept',
    view: 'View',
    close: 'Close project',
    problem: 'Problem',
    insight: 'Insight',
    direction: 'Creative direction',
    system: 'Visual system',
    disclaimer: 'Concept project by the studio. No real client is attached to this work.',
    projects: [
      {
        code: 'PRJ—001',
        category: 'Identity',
        title: 'A mobile bank for market traders',
        summary: 'Identity for a neobank built around women who trade in city markets.',
        imageLabel: '[IMAGE PROJET 01]',
        problem:
          'Digital finance tends to borrow the look of Western banks — cold blues, plastic cards, skylines. The people actually using it, often traders taking payments by mobile money, don’t see themselves in any of it.',
        insight:
          'In a market, trust comes from showing up: same stall, same spot, same rituals every day. A financial brand can speak that language of constancy instead of prestige.',
        direction:
          'An identity built on the grid of market stalls: repeated rectangular modules, heavy type that stays legible in full sun, one accent colour reserved for amounts.',
        system:
          'Modular logotype, dedicated icons (mobile money wallet, stall, produce sack), legibility rules for entry-level screens and printed receipts.',
      },
      {
        code: 'PRJ—002',
        category: 'Interfaces',
        title: 'A dashboard for a farming cooperative',
        summary: 'Harvest tracking for a cooperative whose members speak several languages.',
        imageLabel: '[IMAGE PROJET 02]',
        problem:
          'Members of a cooperative don’t share a language, a reading level or a phone model. Most dashboards assume they do.',
        insight:
          'Farmers already count in concrete units: sacks, baskets, plots. The interface should count the way they do before it counts in kilograms.',
        direction:
          'Screens built around large numbers and unit icons, navigation never more than three levels deep, every label available in several languages.',
        system:
          'A lean design system: four-column grid, three text sizes, an agricultural icon set, components tested on 320-pixel screens.',
      },
      {
        code: 'PRJ—003',
        category: 'Stories',
        title: 'Telling the story of solar',
        summary: 'Investor deck and data visuals for a solar home kit company.',
        imageLabel: '[IMAGE PROJET 03]',
        problem:
          'Investor decks from African companies often lean on generic templates that flatten what makes the venture distinct: the ground, the habits, the people.',
        insight:
          'A solar install is best told in the evening hours it gives back — reading, working, charging. The story should start from those hours, not from watts.',
        direction:
          'A day-and-night narrative structure, editorial typography, hand-drawn data visuals instead of default charts.',
        system:
          'Deck template, data-visual library, short animations for social media, every page in English and French.',
      },
    ],
  },
  network: {
    label: 'The network',
    title: 'One studio. Many specialists.',
    body: [
      'Adwini Studio is a small core team, backed by a network of independents we know well and have worked with before.',
      'Depending on the project, we bring in the right people at the right time. You never juggle freelancers: the studio stays your single point of contact and owns the result.',
    ],
    coreTitle: 'The core',
    core: 'Creative direction, identity and interfaces. Holds the vision and signs off every deliverable.',
    specialistsTitle: 'The network, brought in as needed',
    specialists: ['Motion designers', 'Illustrators', 'Translators', 'Voice-over artists', 'Developers'],
    promise: 'One contract. One contact. One standard.',
  },
  tech: {
    label: 'Technology',
    title: 'Technology moves fast. Culture runs deeper.',
    body: 'We use technology to speed up the work — never to replace the eye that directs it.',
  },
  name: {
    label: 'The name',
    title: 'Why Adwini',
    story:
      'Adwini is the Twi word for craft — the work of the one who shapes, draws and adorns. It is how Akan cultures name the act of giving something form.',
    origin: 'TWI — AKAN LANGUAGE',
  },
  card: {
    label: 'Card',
    title: 'Take Adwini with you.',
    intro: 'Make your own digital business card in the studio’s colours. It updates as you type.',
    fields: [
      { key: 'name', label: 'Name', placeholder: 'Amani Uwase', type: 'text', autoComplete: 'name' },
      { key: 'role', label: 'Role', placeholder: 'Founder', type: 'text', autoComplete: 'organization-title' },
      { key: 'company', label: 'Company', placeholder: 'Company name', type: 'text', autoComplete: 'organization' },
      { key: 'email', label: 'Email', placeholder: 'name@company.com', type: 'email', autoComplete: 'email' },
      { key: 'phone', label: 'Phone', placeholder: '+250 7XX XXX XXX', type: 'tel', autoComplete: 'tel' },
      { key: 'website', label: 'Website', placeholder: 'company.com', type: 'url', autoComplete: 'url' },
      { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/…', type: 'text', autoComplete: 'off' },
      { key: 'instagram', label: 'Instagram', placeholder: '@handle', type: 'text', autoComplete: 'off' },
    ],
    privacy: 'Everything happens in your browser. Nothing you type is sent, stored or collected.',
    shareNote: 'The share link carries your details inside the address itself — it never passes through a studio server.',
    flip: 'Flip',
    download: 'Download',
    share: 'Share',
    vcard: 'Download contact',
    front: 'Front',
    back: 'Back',
    previewLabel: 'Card preview',
    copied: 'Link copied to clipboard.',
    shared: 'Card shared.',
    downloaded: 'File downloaded.',
    error: 'That didn’t work. Please try again.',
    shareTitle: 'My Adwini card',
    shareText: 'My business card, made with Adwini Studio.',
    taglineLines: ['The visual codes', 'of the next generation', 'of African companies.'],
  },
  contact: {
    label: 'Contact',
    title: 'Got an idea? Let’s make it visible.',
    intro: 'WhatsApp is the quickest way to reach us. We reply in English and French.',
    whatsapp: 'Message us on WhatsApp',
    email: 'Send an email',
    socials: 'Follow us',
    whatsappMessage: 'Hello Adwini Studio, I’d like to talk about a project.',
  },
  footer: {
    label: 'End',
    navTitle: 'Navigate',
    socialTitle: 'Social',
    langTitle: 'Language & display',
    thanksCaption: 'thank you, in an Ivorian language',
  },
  marquee: {
    primary: ['Identity', 'Interfaces', 'Stories', 'Kigali', 'EN / FR'],
    secondary: ['Mobile money', 'English and French', 'You own the source files', 'On-time guarantee', 'African icons'],
  },
  tagline: 'Adwini Studio builds the visual codes of the next generation of African companies.',
};

export default en;
