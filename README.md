# Adwini Studio — site officiel

Site vitrine bilingue (FR / EN) d'Adwini Studio, Kigali. React + Vite + TypeScript, **100 % statique** : aucun backend, aucune base de données. Le HTML est prérendu au build : le contenu s'affiche avant le chargement du JavaScript.

**En ligne :** https://otsemstudio-pixel.github.io/AdwiniS/. Le site est publié automatiquement par GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.

```bash
npm install
npm run dev       # développement sur http://localhost:5173/AdwiniS/
npm run build     # build de production → dist/ (à déployer tel quel)
npm run preview   # sert dist/ sur http://localhost:4173/AdwiniS/
npm run check     # vérifications avant livraison (après un build)
npm run assets    # régénère l'image de partage, le favicon et les icônes PNG
```

`npm run check` et `npm run assets` utilisent Chrome ou Edge installé sur la machine. Sinon, définir `CHROME_PATH`.

---

## Modifier le contenu sans toucher aux composants

Tout le contenu se trouve dans `src/data/`.

| Je veux changer… | Fichier |
|---|---|
| Un texte, un titre, une description | `src/data/content.fr.ts` **et** `src/data/content.en.ts` |
| Un prix, un nombre de demandes, un délai | `src/data/site.ts` → `pricing` |
| Un prix fixe (« à partir de ») | `src/data/site.ts` → `fixedPricing` |
| Le numéro WhatsApp, l'e-mail, les réseaux, l'URL du site | `src/data/site.ts` → `site` |
| Les projets (concepts) | `content.*.ts` → `work.projects` |
| Le logo (symbole et wordmark) | `src/data/brand.ts`, `src/data/brand.wordmark.ts`, `public/brand/` |
| La structure commune des deux langues | `src/data/types.ts` |

**Les deux langues doivent garder la même structure.** Si une clé manque dans l'un des deux fichiers, `npm run build` échoue et indique laquelle. Les textes anglais sont rédigés comme des originaux : gardez cette règle.

Les prix sont des nombres (`1200`), et le format est appliqué selon la langue : « 1 200 $ » en français, « $1,200 » en anglais. Avec `price: null`, la formule affiche son texte `priceNote` (« Sur devis »).

### Emplacements à remplir avant la mise en ligne

Toute information manquante est un emplacement explicite entre crochets :

- dans `src/data/site.ts` :
  - `[NUMÉRO WHATSAPP]` : chiffres uniquement, format international sans « + » (ex. `250788123456`) ;
  - `[EMAIL]` ;
  - `[LIEN INSTAGRAM]`, `[LIEN LINKEDIN]`, `[LIEN BEHANCE]` ;
- dans `index.html` : `[@COMPTE X]` ;
- `[IMAGE PROJET 01]` à `03` : voir plus bas.

### Le logo

Le symbole (un trait continu et trois éclats) et le wordmark « Adwini Studio » sont **les fichiers officiels**, vectorisés à partir des visuels fournis.

- **Symbole** : `src/data/brand.ts`.
  - C'est la ligne centrale du trait (`strokes`) et des trois éclats (`sparks`), en coordonnées 0–100.
  - Le trait fait 6,45 unités d'épaisseur. Ses extrémités sont coupées net (`linecap: square`), comme sur le dessin d'origine.
  - Le site le dessine au chargement, en partant de la spirale.
- **Wordmark** : `src/data/brand.wordmark.ts`, ainsi que `public/brand/wordmark.svg`.
  - Dans la navigation, il est servi en fichier unique et coloré en CSS : il n'alourdit pas le HTML.
- **Fichiers prêts à l'emploi** dans `public/brand/` : `adwini-mark.svg` (encre) et `adwini-mark-white.svg` (blanc).
- **Mise à jour** : après toute modification de ces tracés, lancez `npm run assets`. L'image de partage, le favicon et les icônes sont régénérés.

### Ajouter les vrais visuels des projets

Les emplacements `[IMAGE PROJET 0X]` sont rendus par `src/sections/Works.tsx` et `src/components/ProjectPanel.tsx` (classe `.placeholder`). Pour chaque image :

- format WebP, avec `loading="lazy"` ;
- un `srcset` responsive ;
- des `width` et `height` explicites ;
- un `alt` descriptif.

Gardez la classe `wipe` et l'attribut `data-reveal` : le volet encre continuera de découvrir l'image.

### Passer à un domaine personnalisé

Une fois le domaine acheté :

1. Dans `vite.config.ts`, remettez `base: '/'`.
2. Créez `public/CNAME` contenant le domaine (ex. `www.adwinistudio.com`).
3. Remplacez `https://otsemstudio-pixel.github.io/AdwiniS/` dans `index.html` et `src/data/site.ts`.
4. Dans `scripts/check.mjs`, remettez `const base = 'http://localhost:4173/'` et adaptez le motif `AdwiniS` du calcul de poids.
5. Chez le registraire, créez un enregistrement CNAME : `www` → `otsemstudio-pixel.github.io`.
6. Dans Settings → Pages, saisissez le domaine, puis cochez « Enforce HTTPS ».

---

## Direction visuelle — où elle vit dans le code

- **Échelle** (`src/styles/tokens.css`) : titres du hero et de section, sous-titre, corps et métadonnées suivent exactement les `clamp()` du brief.
  - Le titre du hero a un garde-fou de largeur : le mot le plus long tient toujours à l'écran, 320 px compris, en français comme en anglais.
- **Espace** : `--space` fixe l'espace entre sections, `--margin` les marges latérales.
- **Grille asymétrique** : 12 colonnes à partir de 1440 px, avec des placements décalés section par section.
  - En dessous, des retraits variables remplacent les colonnes.
  - Les filets de la grille sont visibles dans le hero et la philosophie (`GridLines`).
- **Le trait** : les séparateurs, contours de cartes, boutons capsule et numéros cerclés font 2 px, avec extrémités arrondies.
  - Le fil continu de la marge gauche (`Thread`) se dessine par paliers, au changement de section.
  - Les illustrations des pôles sont chacune **un seul tracé** (`LineArt`).
- **Révélations, jamais de fondu** (`components.css`, `useRevealAll`) :
  - mots qui montent sous un masque, avec 40 ms d'écart ;
  - blocs dont le masque s'ouvre ;
  - volet encre sur les images ;
  - tracés qui se dessinent.

  Un seul `IntersectionObserver` (seuil 0,15, une fois par élément) gère l'ensemble. Le titre du hero se révèle en CSS pur, sans attendre le JavaScript.
- **Tracé du logo** : 900 ms, puis les éclats, une fois par session (classe `intro` posée par le script de `index.html`).
- **Grain** : texture `feTurbulence` d'environ 300 octets, en position fixe, opacité 0,025.
- **Accent violet** :
  - les éclats, utilisés quatre fois : hero, formule mise en avant, engagement n° 5, pied de page ;
  - le contour de la formule mise en avant ;
  - le survol des cartes projet ;
  - « N'nahssé ».

  Jamais plus d'un élément à l'écran à la fois.

Il n'y a aucun `requestAnimationFrame` dans le code. L'hydratation de React attend `requestIdleCallback`, pour ne pas retarder le premier affichage.

## Séquence d'ouverture

Code : `src/opening.ts`, injecté au build dans la page d'accueil par le plugin `openingSequence` de `vite.config.ts`.

L'ouverture **ne retarde jamais le contenu, elle le recouvre**. Le HTML prérendu est déjà là ; un calque encre le couvre pendant environ 1 400 ms puis se lève.

| Temps | Séquence |
|---|---|
| 0 ms | fond encre |
| 60 → 760 ms | le trait du logo se trace (`pathLength="1"`) |
| 700 → 900 ms | « ADWINI » se resserre (lettres en `translateX`, pas `letter-spacing`) et apparaît |
| 900 → 1 400 ms | le calque se lève (`translateY(-100%)`), le logo monte 15 % plus vite |
| dès 1 100 ms | le titre du hero monte mot par mot (40 ms d'écart), sous le calque qui se lève encore |

**Les sécurités :**
- **Calque masqué par défaut :** il ne s'affiche que sous la classe `ouverture`, posée par l'amorce en tête de `<head>`. Sans JavaScript ou en cas d'erreur, on voit directement le site.
- **Séquence sautée** si elle a déjà été vue dans la session (`sessionStorage`), en mouvement réduit, en économie de données ou en connexion 2G.
- **Garde-fou :** la classe est retirée à 2 500 ms quoi qu'il arrive. Sur une connexion très lente (première peinture après 2,5 s), l'ouverture ne joue donc pas.
- **Calque inerte** (`aria-hidden`, `inert`) : le premier `Tab` atteint le lien d'évitement.
- **Pas d'ouverture** sur `/carte`, `/card` ni `/brief`.

Poids ajouté à la page d'accueil : **1 257 octets compressés (gzip)**, dont environ 550 octets de JavaScript, 670 de CSS et 1 270 de calque une fois isolés.

## Carte du fondateur et carte de brief

### Carte du fondateur — `/carte` (français) et `/card` (anglais)

Adresses : https://otsemstudio-pixel.github.io/AdwiniS/carte/ et `…/card/`.

- **Accès** : la page n'est liée nulle part, sans mot de passe. Elle porte `noindex, nofollow` et n'apparaît ni dans `robots.txt` ni dans `sitemap.xml`.
- **Contenu** : pré-rempli, non modifiable (le site affiché est l'adresse GitHub Pages). Il se trouve dans `src/data/site.ts` → `founder`, et le rôle traduit dans `content.*.ts` → `founderPage.role`.
- **Emplacements à compléter** : `[EMAIL À REMPLIR]`, `[LIEN À REMPLIR]`, `[COMPTE À REMPLIR]`. Tant qu'ils restent entre crochets, ils n'apparaissent ni sur la carte ni dans le `.vcf`.
- **QR code** : il mène à la page d'accueil (`site.url`), pas aux coordonnées.
- **Exports** :
  - PNG standard ;
  - PNG haute définition (×3) ;
  - format carré 1080 × 1080 ;
  - contact `.vcf` ;
  - partage natif, avec repli sur la copie du lien.

### Carte de brief — la section contact

- **Saisie** : six champs (nom, entreprise, besoins, phrase de 140 caractères, échéance, budget). Les choix sont des boutons, sans liste déroulante, et la carte se compose en direct.
- **« Envoyer sur WhatsApp »** ouvre `wa.me/250799496971` avec un message lisible et un lien `/brief/?d=…`.
  - Le paramètre `d` contient les réponses en JSON compact, compressé (`deflate-raw` natif) puis encodé en base64 sûr pour les URL.
  - Aucun serveur n'intervient.
- **Longueurs garanties** :
  - message ≤ 600 caractères (hors lien) ;
  - lien ≤ 800 ;
  - URL WhatsApp ≤ 1 500, même avec des champs remplis au maximum : le message tronque alors la phrase, puis l'entreprise, puis le nom ; le lien garde la version complète.
- **`/brief/?d=…`** (`noindex`) décode et **valide** chaque champ : forme, valeurs autorisées, longueurs.
  - Un lien absent, coupé ou modifié affiche une page d'erreur propre.
  - Le contenu est toujours rendu comme texte, jamais en HTML brut.
- **La sortie rapide** « Écrire directement sur WhatsApp » ouvre une conversation sans formulaire.

### Où modifier

| Quoi | Où |
|---|---|
| Numéro WhatsApp | `src/data/site.ts` → `site.whatsappNumber` |
| Textes du formulaire, du message, des pages | `content.*.ts` → `brief`, `briefPage`, `founderPage` |
| Choix proposés (besoins, échéances, budgets) | `src/utils/brief.ts` (codes) + `content.*.ts` (libellés) |
| Visuels des cartes (un seul moteur) | `src/components/BusinessCard.tsx` : `CardFront`, `CardBack`, `CardSquare`, `BriefCard` |

## Mouvement

Règle : **une animation forte par section**, et **seuls `transform` et `opacity` sont animés**. Seule exception : le tracé des traits SVG du logo et des illustrations (`stroke-dashoffset`). Aucune bibliothèque d'animation. Le CSS se trouve en fin de `src/styles/components.css` et de `src/styles/sections.css`.

| Où | Quoi | Technique |
|---|---|---|
| Partout | Blocs, cartes, engagements : montée + apparition | `.reveal`, `animation-timeline: view()` (CSS pur) |
| Titres | Mot par mot sous masque, 35 ms d'écart (400 ms max), 700 ms | `RevealText` + un seul `IntersectionObserver` |
| Hero | Titre révélé au chargement, logo tracé en 900 ms puis éclats (1 fois par session) | CSS au chargement, `sessionStorage` |
| Pôles (≥ 1024 px) | Titre collé, cartes qui grandissent de 0,96 à 1 à leur passage | `position: sticky` + `view()` |
| Entre pôles et philosophie | Deux bandeaux défilants en sens opposés (40 s et 60 s) | `translateX(-50%)` en boucle, séquence doublée |
| Formules (≥ 1024 px) | Cartes empilées, chacune collée 2 rem plus bas | `position: sticky`, `top` croissant |
| Prix et délais | Comptent de 0 à leur valeur en 1,2 s (easeOutExpo) | `CountUp` : valeur finale déjà dans le HTML |
| Nom, pied de page (≥ 1024 px) | Filigrane du logo et mot « ADWINI » en parallaxe | `view()`, jamais sur du texte à lire |
| Toute la page | Fil de la marge et barre de progression (2 px, violet) | `animation-timeline: scroll(root)` |
| Navigation | Se rétracte après 100 px, se retire en descendant, revient en remontant | JS limité à une lecture toutes les 100 ms |
| Menu mobile | Volet qui monte, liens un par un (60 ms), sortie inverse, icône qui pivote en croix | CSS |
| Survols | Soulignement qui se dessine puis se replie à droite ; fond de bouton qui monte ; carte soulevée de 6 px ; liens voisins à 40 % | CSS, 250–350 ms |

**Sans support des animations pilotées par le défilement** (bloc `@supports not (animation-timeline: view())`), tout le contenu est visible immédiatement. **Avec `prefers-reduced-motion`**, rien ne bouge : bandeaux, parallaxe et révélations sont coupés.

## Architecture

```
src/
  data/        contenus FR/EN, prix, coordonnées, tracés de la marque, types
  sections/    une section par fichier (Hero, Poles, Subscription, CardMaker…)
  components/  briques du système (Logo, Section, RevealText, Thread, LineArt, BusinessCard…)
  hooks/       langue, thème, révélations, section active, défilement
  utils/       formatage, vCard, QR code, export PNG
  styles/      tokens (palette, échelle, clair/sombre), base, composants, sections
scripts/
  prerender.mjs        injecte le HTML FR + EN prérendu dans dist/index.html
  export-assets.mjs    image de partage et icônes, à partir des tracés de la marque
  check.mjs            vérifications automatiques
```

L'ordre des 13 sections est défini dans `SECTIONS` de `src/App.tsx`. Il alimente les numéros cerclés, le compteur « 02 / 13 » et le fil.

## Performance (mesurée)

- **JS initial : 70,3 Ko compressés** (budget : 150 Ko). CSS : 7,3 Ko. QR code (4 Ko) et export PNG (1 Ko) sont chargés à la demande.
- **Contenu utile en ≈ 1,1 s** sur 3G simulée (1,6 Mb/s, 150 ms de latence, CPU ×4), médiane de 3 chargements à froid.
- **Polices** : auto-hébergées, sous-ensemble latin, `font-display: swap`.
  - Seule la police de titre (Outfit 600) est préchargée : mesuré, aucun retard du premier affichage.
  - Corps : Archivo 400/500/600. Métadonnées : JetBrains Mono 400.

## Accessibilité et contrastes

| Couleurs | Ratio |
|---|---|
| Violet `#4B2A7B` sur `#FAF8F4` | 10,33:1 |
| Violet clair `#A68FDB` sur `#0D0E10` (mode sombre) | 6,96:1 |
| Texte secondaire `#5E5C55` sur `#FAF8F4` | 6,29:1 |
| Texte secondaire sombre `#9B968C` sur `#0D0E10` | 6,98:1 |

Tous les couples de couleurs sont vérifiés par `npm run check`.

## Ce que vérifie `npm run check`

- poids du bundle ;
- contrastes ;
- absence de défilement horizontal à 320, 375, 768, 1440 et 1920 px ;
- zones tactiles d'au moins 44 px ;
- titres (un seul `h1`, hiérarchie) et labels des champs ;
- navigation au clavier et focus visible ;
- menu mobile ;
- panneau projet ;
- langue (détection, bascule, mémorisation) ;
- `prefers-reduced-motion` ;
- mode sombre (système et bascule manuelle) ;
- carte : aperçu en direct, PNG, vCard, repli de partage, lien partagé ;
- affichage sur 3G simulée.

Les captures d'écran sont écrites dans `.check/`.
