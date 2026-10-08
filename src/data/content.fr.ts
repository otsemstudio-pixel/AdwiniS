import type { Content } from './types';

const fr: Content = {
  meta: {
    title: "Adwini Studio — Design d'identité et d'interfaces, Kigali",
    description:
      "Studio de design basé à Kigali. Identités de marque, interfaces et récits visuels pour la prochaine génération d'entreprises africaines. Abonnement à prix affichés, en français et en anglais.",
    locale: 'fr_FR',
  },
  skipLink: 'Aller au contenu',
  nav: {
    work: 'Travaux',
    services: 'Services',
    studio: 'Studio',
    card: 'Carte',
    cta: 'Démarrer un projet',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
    langLabel: 'Langue du site',
    primaryLabel: 'Navigation principale',
    themeToDark: 'Passer en mode sombre',
    themeToLight: 'Passer en mode clair',
  },
  hero: {
    titleLines: ['Des idées africaines.', 'Vues autrement.'],
    subtitle:
      "Adwini Studio développe les codes visuels de la prochaine génération d'entreprises africaines.",
    primary: 'Démarrer un projet',
    secondary: 'Explorer le studio',
    scroll: 'Défiler',
  },
  philosophy: {
    label: 'Philosophie',
    title: "Le design n'est pas de la décoration.",
    lines: [
      "C'est une interprétation.",
      "C'est une stratégie.",
      "C'est une culture.",
      "C'est une mémoire.",
      "C'est une émotion.",
      "C'est un commerce.",
    ],
    conclusion: 'Nous pensons que les entreprises africaines méritent leur propre langage visuel.',
  },
  poles: {
    label: 'Services',
    title: 'Trois pôles, un seul langage.',
    intro:
      'Chaque projet traverse les trois pôles du studio. Une marque cohérente se reconnaît autant sur un écran que dans un dossier investisseur.',
    list: [
      {
        code: 'POL—001',
        name: 'Identité',
        intro: 'Ce qui fait reconnaître une marque au premier regard.',
        items: ['Logotype et système de marque', 'Typographie sur mesure', 'Lettrage', 'Iconographie', 'Charte graphique'],
      },
      {
        code: 'POL—002',
        name: 'Interfaces',
        intro: "Ce qui rend un produit clair à l'usage.",
        items: ["Maquettes d'écrans", 'Parcours utilisateur', 'Design systems', 'Sites', 'Tableaux de bord'],
      },
      {
        code: 'POL—003',
        name: 'Récits',
        intro: 'Ce qui donne du mouvement et du sens à une histoire.',
        items: ['Identité animée', 'Motion design', 'Dossiers investisseurs', 'Visuels de données'],
      },
    ],
  },
  differentiators: {
    label: 'Engagements',
    title: 'Ce qui change avec nous.',
    intro: 'Cinq engagements, écrits noir sur blanc, valables pour chaque projet.',
    items: [
      {
        title: 'Mobile money accepté',
        body: 'Vous payez par mobile money autant que par carte. Aucune banque internationale requise.',
      },
      {
        title: 'Français et anglais',
        body: 'Chaque livrable existe dans les deux langues, rédigé et vérifié, pas traduit à la machine.',
      },
      {
        title: 'Vos fichiers sources',
        body: 'Les fichiers sources vous appartiennent. Vous repartez avec tout, sans frais de sortie.',
      },
      {
        title: 'Garantie de délai',
        body: 'Si nous livrons en retard, le retard est crédité sur votre abonnement.',
      },
      {
        title: 'Nos propres pictogrammes',
        body:
          "Les bibliothèques d'icônes existantes ont été dessinées pour un quotidien occidental : le portefeuille mobile money, la moto-taxi, l'étal de marché ou le franc CFA n'y figurent pas. Nous dessinons nos propres pictogrammes et typographies africains.",
      },
    ],
    iconNames: ['Portefeuille mobile money', 'Moto-taxi', 'Étal de marché', 'Franc CFA'],
  },
  subscription: {
    label: "L'abonnement",
    title: 'Un abonnement. Des prix affichés.',
    intro:
      'Vous soumettez vos demandes, nous les traitons une à une dans le délai annoncé. Vous suspendez quand vous voulez.',
    perMonth: '/ mois',
    activeRequests: 'Demandes actives',
    turnaround: 'Délai par livraison',
    hours: 'h',
    plans: [
      { id: 'launch', name: 'Lancement', audience: 'Pour une jeune marque qui pose ses fondations.' },
      {
        id: 'growth',
        name: 'Croissance',
        audience: 'Pour une entreprise qui produit en continu.',
        featuredNote: 'Le plus choisi',
      },
      { id: 'signature', name: 'Signature', audience: 'Pour une équipe qui avance sur plusieurs fronts.' },
      {
        id: 'whitelabel',
        name: 'Marque blanche',
        audience: 'Pour les agences qui veulent un studio de production discret.',
        priceNote: 'Sur devis',
      },
    ],
    includedTitle: 'Inclus dans toutes les formules',
    included: [
      'Logo animé offert le premier mois',
      'Paiement par mobile money',
      'Suspension à tout moment',
      'Fichiers sources au client',
      'Garantie de délai',
    ],
    excludedTitle: 'Non inclus',
    excluded: ["Développement d'applications", 'Impression', "Achat d'espace publicitaire", 'Tournages vidéo'],
    cta: 'Choisir cette formule',
  },
  fixed: {
    label: 'Prix fixe',
    title: 'Un projet précis ? Un prix fixe.',
    intro: "Pour un besoin ponctuel, sans abonnement. Le prix final dépend de l'étendue, jamais d'une surprise.",
    from: 'À partir de',
    offers: [
      {
        id: 'sprint',
        name: 'Sprint de conception',
        description: 'Cinq jours pour passer d’une idée à une direction testable : ateliers, pistes, maquettes.',
      },
      {
        id: 'identity',
        name: 'Identité complète',
        description: 'Logotype, typographie, couleurs, iconographie et charte, livrés en français et en anglais.',
      },
      {
        id: 'custom',
        name: 'Typographie ou jeu d’icônes sur mesure',
        description: 'Un caractère ou une famille de pictogrammes dessinés pour votre marque et votre marché.',
      },
    ],
  },
  work: {
    label: 'Travaux',
    title: 'Concepts du studio.',
    intro:
      'Le studio est jeune. Plutôt que d’inventer des clients, nous montrons notre manière de penser à travers des concepts auto-initiés.',
    tag: 'Concept Adwini',
    view: 'Voir',
    close: 'Fermer le projet',
    problem: 'Problème',
    insight: 'Intuition',
    direction: 'Direction créative',
    system: 'Système visuel',
    disclaimer: 'Projet conceptuel réalisé par le studio. Aucun client réel n’est associé à ce travail.',
    projects: [
      {
        code: 'PRJ—001',
        category: 'Identité',
        title: 'Une banque mobile pour les marchés',
        summary: 'Identité d’une néobanque pensée pour les commerçantes des marchés urbains.',
        imageLabel: '[IMAGE PROJET 01]',
        problem:
          'Les services financiers numériques empruntent presque tous l’esthétique des banques occidentales : bleu froid, cartes bancaires, gratte-ciel. Leurs utilisatrices réelles, souvent des commerçantes qui encaissent par mobile money, ne s’y reconnaissent pas.',
        insight:
          'Sur un marché, la confiance passe par la régularité : le même étal, la même place, les mêmes gestes chaque jour. Une marque financière peut parler ce langage de la constance plutôt que celui du prestige.',
        direction:
          'Une identité construite sur la grille des étals : modules rectangulaires répétés, typographie massive et lisible au soleil, une seule couleur d’accent réservée aux montants.',
        system:
          'Logotype modulaire, pictogrammes dédiés (portefeuille mobile money, étal, sac de marchandise), règles de lisibilité pour écrans d’entrée de gamme et reçus imprimés.',
      },
      {
        code: 'PRJ—002',
        category: 'Interfaces',
        title: 'Le tableau de bord d’une coopérative',
        summary: 'Interface de suivi des récoltes pour une coopérative agricole multilingue.',
        imageLabel: '[IMAGE PROJET 02]',
        problem:
          'Les membres d’une coopérative ne partagent ni la même langue, ni le même niveau de lecture, ni le même téléphone. Les tableaux de bord classiques supposent l’inverse.',
        insight:
          'Les agriculteurs comptent déjà en unités concrètes : sacs, paniers, parcelles. L’interface doit compter comme eux avant de compter en kilogrammes.',
        direction:
          'Des écrans construits autour de grands chiffres et de pictogrammes d’unités, une navigation à trois niveaux maximum, chaque libellé disponible en plusieurs langues.',
        system:
          'Design system léger : grille à quatre colonnes, trois tailles de texte, jeu de pictogrammes agricoles, composants testés sur écrans de 320 pixels.',
      },
      {
        code: 'PRJ—003',
        category: 'Récits',
        title: 'Raconter l’énergie solaire',
        summary: 'Dossier investisseur et visuels de données pour une entreprise de kits solaires.',
        imageLabel: '[IMAGE PROJET 03]',
        problem:
          'Les dossiers investisseurs d’entreprises africaines reprennent souvent des gabarits génériques qui effacent ce qui rend le projet singulier : le terrain, les usages, les gens.',
        insight:
          'Une installation solaire se raconte en heures gagnées le soir : lire, travailler, recharger. Le récit doit partir de ces heures plutôt que des watts.',
        direction:
          'Une narration en séquences jour / nuit, une typographie éditoriale, des visuels de données dessinés à la main plutôt que des graphiques par défaut.',
        system:
          'Gabarit de présentation, bibliothèque de visuels de données, animations courtes pour les réseaux sociaux, version française et anglaise de chaque page.',
      },
    ],
  },
  network: {
    label: 'Le réseau',
    title: 'Un studio. Plusieurs spécialistes.',
    body: [
      'Adwini Studio est un noyau resserré, entouré d’un réseau d’indépendants que nous connaissons et avec qui nous avons l’habitude de travailler.',
      'Selon votre projet, nous mobilisons les bonnes personnes, au bon moment. Vous ne gérez jamais plusieurs prestataires : le studio reste votre unique interlocuteur, responsable du résultat.',
    ],
    coreTitle: 'Le noyau',
    core: 'Direction de création, identité et interfaces. Il porte la vision et valide chaque livrable.',
    specialistsTitle: 'Le réseau, mobilisé selon les besoins',
    specialists: ['Motion designers', 'Illustrateurs', 'Traducteurs', 'Voix off', 'Développeurs'],
    promise: 'Un seul contrat. Un seul interlocuteur. Une seule exigence.',
  },
  tech: {
    label: 'Technologie',
    title: 'La technologie va vite. La culture va plus profond.',
    body: 'Nous utilisons la technologie pour accélérer le travail, pas pour remplacer le regard qui le dirige.',
  },
  name: {
    label: 'Le nom',
    title: 'Pourquoi Adwini',
    story:
      'Adwini, en twi, désigne l’ouvrage — le travail de celui qui façonne, dessine et orne. C’est le mot par lequel les cultures akan nomment le métier de créer une forme.',
    origin: 'TWI — LANGUE AKAN',
  },
  card: {
    label: 'Carte',
    title: 'Emportez Adwini avec vous.',
    intro:
      'Créez votre carte de visite numérique aux couleurs du studio. Elle se met à jour pendant que vous écrivez.',
    fields: [
      { key: 'name', label: 'Nom', placeholder: 'Amani Uwase', type: 'text', autoComplete: 'name' },
      { key: 'role', label: 'Rôle', placeholder: 'Fondatrice', type: 'text', autoComplete: 'organization-title' },
      { key: 'company', label: 'Entreprise', placeholder: 'Nom de l’entreprise', type: 'text', autoComplete: 'organization' },
      { key: 'email', label: 'E-mail', placeholder: 'nom@entreprise.com', type: 'email', autoComplete: 'email' },
      { key: 'phone', label: 'Téléphone', placeholder: '+250 7XX XXX XXX', type: 'tel', autoComplete: 'tel' },
      { key: 'website', label: 'Site', placeholder: 'entreprise.com', type: 'url', autoComplete: 'url' },
      { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/…', type: 'text', autoComplete: 'off' },
      { key: 'instagram', label: 'Instagram', placeholder: '@identifiant', type: 'text', autoComplete: 'off' },
    ],
    privacy:
      'Tout se passe dans votre navigateur. Rien de ce que vous saisissez n’est envoyé, enregistré ni collecté.',
    shareNote: 'Le lien de partage contient vos informations dans l’adresse elle-même : il ne transite par aucun serveur du studio.',
    flip: 'Retourner',
    download: 'Télécharger',
    share: 'Partager',
    vcard: 'Télécharger le contact',
    front: 'Recto',
    back: 'Verso',
    previewLabel: 'Aperçu de la carte',
    copied: 'Lien copié dans le presse-papiers.',
    shared: 'Carte partagée.',
    downloaded: 'Fichier téléchargé.',
    error: 'L’opération n’a pas abouti. Réessayez.',
    shareTitle: 'Ma carte Adwini',
    shareText: 'Ma carte de visite, créée avec Adwini Studio.',
    taglineLines: ['Les codes visuels', 'de la prochaine génération', 'd’entreprises africaines.'],
  },
  contact: {
    label: 'Contact',
    title: 'Une idée ? Rendons-la visible.',
    intro: 'Le plus simple est de nous écrire sur WhatsApp. Nous répondons en français et en anglais.',
    whatsapp: 'Écrire sur WhatsApp',
    email: 'Envoyer un e-mail',
    socials: 'Nous suivre',
    whatsappMessage: 'Bonjour Adwini Studio, j’aimerais parler d’un projet.',
  },
  brief: {
    fields: {
      name: { label: 'Nom', placeholder: 'Votre nom' },
      company: { label: 'Entreprise ou projet', placeholder: 'Votre entreprise ou votre projet' },
      sentence: { label: 'En une phrase', placeholder: 'Ce que vous voulez construire, en une phrase.' },
    },
    needsLabel: 'Ce dont vous avez besoin',
    deadlineLabel: 'Échéance',
    budgetLabel: 'Budget envisagé',
    needs: { id: 'Identité', ui: 'Interfaces', st: 'Récits', unk: 'Je ne sais pas encore' },
    deadlines: { urgent: 'Urgent', month: 'Ce mois-ci', quarter: 'Ce trimestre', none: 'Pas de date' },
    budgets: {
      lt600: 'Moins de 600 $/mois',
      '600-1200': '600–1 200 $',
      '1200-2200': '1 200–2 200 $',
      gt2200: 'Plus de 2 200 $',
      oneoff: 'Projet ponctuel',
      unknown: 'Je ne sais pas',
    },
    counter: '{n} / {max} caractères',
    required: 'obligatoire',
    optional: 'facultatif',
    send: 'Envoyer sur WhatsApp',
    copy: 'Copier le lien',
    download: 'Télécharger',
    quickTitle: 'Pas le temps pour un formulaire ?',
    quick: 'Écrire directement sur WhatsApp',
    privacy:
      'Rien n’est envoyé, stocké ni collecté. Vos réponses voyagent uniquement dans le lien que vous choisissez d’envoyer.',
    missing: 'Il manque : {fields}.',
    copied: 'Lien copié dans le presse-papiers.',
    downloaded: 'Carte téléchargée.',
    error: 'L’opération n’a pas abouti. Réessayez.',
    previewLabel: 'Aperçu de votre carte de brief',
    message: {
      hello: 'Bonjour Adwini Studio,',
      intro: 'Je suis {name}, de {company}.',
      needs: 'J’ai besoin de',
      sentence: 'En une phrase',
      deadline: 'Échéance',
      budget: 'Budget',
      link: 'Ma carte de brief',
      none: 'non précisé',
    },
    card: {
      label: 'CARTE DE BRIEF',
      needs: 'BESOINS',
      deadline: 'ÉCHÉANCE',
      budget: 'BUDGET',
      mention: 'Carte de brief générée sur adwini.studio',
      placeholderName: 'Votre nom',
      placeholderCompany: 'Entreprise ou projet',
      placeholderSentence: 'Votre projet, en une phrase.',
    },
  },
  briefPage: {
    title: 'Carte de brief — Adwini Studio',
    intro: 'Un brief reçu par WhatsApp, reconstitué depuis son lien. Rien n’a transité par un serveur.',
    errorTitle: 'Ce lien de brief est illisible.',
    errorBody:
      'Il est incomplet, a été modifié ou a été coupé lors de la copie. Demandez à son auteur de renvoyer le lien depuis le site.',
    back: 'Retour au site',
    download: 'Télécharger la carte',
  },
  founderPage: {
    title: 'Kouamé N’nahssé Jean-David — Adwini Studio',
    heading: 'Carte du fondateur',
    intro: 'La carte de visite de Kouamé N’nahssé Jean-David, fondateur d’Adwini Studio.',
    role: 'Fondateur',
    hd: 'Télécharger en haute définition',
    square: 'Format carré 1080 × 1080',
    squareLabel: 'Carte au format carré',
    note: 'Le QR code mène à la page d’accueil d’Adwini Studio. « Télécharger le contact » enregistre les coordonnées.',
    back: 'Découvrir le studio',
  },
  footer: {
    label: 'Fin',
    navTitle: 'Navigation',
    socialTitle: 'Réseaux',
    langTitle: 'Langue et affichage',
    thanksCaption: 'merci, en langue ivoirienne',
  },
  marquee: {
    primary: ['Identité', 'Interfaces', 'Récits', 'Kigali', 'FR / EN'],
    secondary: ['Mobile money', 'Français et anglais', 'Fichiers sources au client', 'Garantie de délai', 'Pictogrammes africains'],
  },
  tagline: "Adwini Studio développe les codes visuels de la prochaine génération d'entreprises africaines.",
};

export default fr;
