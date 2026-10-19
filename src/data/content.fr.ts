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
    soundOn: 'Activer les sons',
    soundOff: 'Couper les sons',
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
    upcoming: {
      name: 'Vidéo IA professionnelle',
      description:
        'Des vidéos de marque produites avec l’intelligence artificielle, dirigées et finalisées par le studio. Ce service arrive bientôt : si vous êtes intéressé, contactez-nous et nous vous préviendrons en premier.',
      badge: 'Bientôt disponible',
      cta: 'Je suis intéressé',
      message: 'Bonjour Adwini Studio, je suis intéressé par la vidéo IA professionnelle. Pouvez-vous me prévenir dès que le service est disponible ?',
    },
  },
  posters: {
    label: 'Réalisations',
    title: 'Des vérités dures, mises en forme.',
    intro:
      'Une série d’affiches pour les réseaux sociaux sur l’entrepreneuriat. Un message par affiche, une composition par message : chaque visuel est construit pour être compris en une seconde et retenu longtemps.',
    series: 'Série « Understand, Become, Build »',
    hint: 'Faites défiler pour parcourir la série',
    open: 'Voir l’affiche',
    close: 'Fermer',
    prev: 'Affiche précédente',
    next: 'Affiche suivante',
    message: 'Le message',
    design: 'Le parti pris',
    items: [
      {
        title: 'Plus d’argent peut accélérer une mauvaise décision',
        theme: 'Capital',
        description:
          'Lever des fonds ne corrige pas une stratégie : le capital amplifie ce qui est déjà là, le bon comme le mauvais.',
        design:
          'Gros plan sur la gravure d’un billet, en niveaux de gris : l’argent devient matière, presque menaçant. Capitales condensées massives, et un seul accent doré sur la phrase qui donne la clé.',
        alt: 'Gros plan en noir et blanc sur la gravure d’un billet de banque, avec le titre en grandes capitales blanches et une phrase dorée en dessous.',
      },
      {
        title: 'Votre idée n’est pas unique',
        theme: 'Exécution',
        description:
          'Quelqu’un, quelque part, y a déjà pensé. Ce qui est rare, c’est l’exécution quand elle devient ennuyeuse, difficile, et que personne ne regarde.',
        design:
          'Une foule en arrière-plan, pour rendre la phrase concrète : vous êtes nombreux. Une capitale à empattements dorée, et le mot « SPECIAL » qui s’éteint de l’or vers le noir.',
        alt: 'Une foule photographiée en noir et blanc, recouverte du titre en grandes lettres dorées à empattements et d’un court texte blanc.',
      },
      {
        title: 'Une bonne idée ne suffit pas',
        theme: 'Fondations',
        description:
          'Rêver vient naturellement. Valider la demande, protéger la trésorerie, tenir l’effort et s’adapter quand l’exécution s’écarte du plan : c’est là que se fait le vrai travail.',
        design:
          'Des lettres en volume, posées comme les marches d’un escalier : la phrase se lit en montant, comme on construit. Un bleu franc et un seul bloc de texte pour l’argument.',
        alt: 'Les mots « Great idea is not enough » en lettres blanches en relief disposées en escalier sur fond bleu, avec un paragraphe en bas à droite.',
      },
      {
        title: 'Mythe et réalité : l’entreprise n’est pas un raccourci',
        theme: 'Idées reçues',
        description:
          'Entreprendre peut mener à une vie meilleure, mais ce n’est pas un raccourci : c’est un chemin exigeant.',
        design:
          'Une composition coupée en deux, gris contre jaune, le mythe face à la réalité. Une flèche les relie, et un personnage songeur fait le pont entre les deux moitiés.',
        alt: 'Affiche divisée en deux : à gauche en gris « Mythe », à droite sur fond jaune « Réalité », avec un homme pensif au centre.',
      },
      {
        title: 'Tout le monde aime votre idée… Qui paie ?',
        theme: 'Validation',
        description: 'Les applaudissements ne sont pas une validation du marché. Seul le client qui paie valide une idée.',
        design:
          'Une cloche de service soulevée au-dessus d’une assiette vide : la promesse est servie, le plat n’existe pas encore. Beaucoup de blanc, et la question en doré, à la place du plat.',
        alt: 'Deux mains noires soulèvent une cloche de service au-dessus d’une assiette vide, avec la question « Who is paying ? » en doré.',
      },
      {
        title: 'Le marché ne lit pas votre CV',
        theme: 'Marché',
        description: 'Le marché répond à ce que vous savez comprendre, construire et livrer, pas à vos diplômes.',
        design:
          'Un homme qui grimace en lisant une feuille, sur un bleu clair et calme. Le titre lourd, avec une ombre décalée, et un seul mot en rouge : « CV ».',
        alt: 'Un homme qui grimace en lisant une feuille, sur fond bleu clair, sous le titre « The market does not read your CV ».',
      },
      {
        title: 'On peut être brillant et échouer quand même',
        theme: 'Incertitude',
        description:
          'L’intelligence n’élimine pas l’incertitude. Savoir reconnaître quand ses connaissances ne suffisent plus est une compétence d’entrepreneur à part entière.',
        design:
          'Un grand plan bleu incliné, retenu par une femme qui tire de tout son poids : l’effort se voit. Le titre suit la pente, et une ampoule-cerveau rappelle ce qui ne suffit pas.',
        alt: 'Une femme retient un grand pan bleu incliné portant le titre « You can be brilliant and still fail », avec une ampoule contenant un cerveau.',
      },
      {
        title: 'La solitude de celui qui décide',
        theme: 'Décision',
        description: 'Certains choix concernent tout le monde et reposent pourtant sur une seule personne.',
        design:
          'Une silhouette à contre-jour, tête dans les mains, à gauche ; à droite, le titre empilé mot à mot, aligné à droite comme une colonne. Le doré n’arrive qu’à la toute fin.',
        alt: 'Silhouette d’un homme assis, la tête dans les mains, sur fond blanc, avec le titre empilé à droite en capitales noires.',
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
