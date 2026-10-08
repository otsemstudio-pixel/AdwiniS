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
| Le logo (symbole et wordmark) | `src/data/brand.ts` et `src/data/brand.wordmark.ts` |
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
- `[IMAGE PROJET 01]` à `03` : voir plus bas ;
- **`[LOGO-MARK.SVG]`** : voir la section suivante.

### Remplacer le logo provisoire — `[LOGO-MARK.SVG]`

Le symbole (une main en trait continu et trois éclats) et le wordmark sont **provisoires**. Pour brancher les fichiers officiels :

1. **Symbole** : dans `src/data/brand.ts`, collez les attributs `d` des tracés.
   - Le trait continu va dans `strokes`, les trois éclats dans `sparks`.
   - Ajustez aussi `viewBox` et `strokeWidth`.
   - Les tracés doivent être des **traits** (`stroke`), pas des aplats : le site les colore en `currentColor`, les dessine au chargement et réutilise les éclats comme marqueur d'accent.
2. **Wordmark** : dans `src/data/brand.wordmark.ts`, remplacez les tracés `d` (version en ligne et version empilée) et leurs dimensions. Le wordmark reste un tracé figé, jamais du texte.
3. Lancez `npm run assets` : l'image de partage, le favicon et les icônes sont régénérés à partir de ces tracés.

`scripts/outline-wordmark.mjs` a servi à produire le wordmark provisoire. Il peut être supprimé ensuite, avec la dépendance `opentype.js`.

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
- **Accent terre cuite** :
  - les éclats, utilisés quatre fois : hero, formule mise en avant, engagement n° 5, pied de page ;
  - le contour de la formule mise en avant ;
  - le survol des cartes projet ;
  - « N'nahssé ».

  Jamais plus d'un élément à l'écran à la fois.

Il n'y a aucun `requestAnimationFrame` dans le code. L'hydratation de React attend `requestIdleCallback`, pour ne pas retarder le premier affichage.

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
  outline-wordmark.mjs outil ponctuel du wordmark provisoire
  check.mjs            vérifications automatiques
```

L'ordre des 13 sections est défini dans `SECTIONS` de `src/App.tsx`. Il alimente les numéros cerclés, le compteur « 02 / 13 » et le fil.

## Performance (mesurée)

- **JS initial : 66,4 Ko compressés** (budget : 150 Ko). CSS : 7,3 Ko. QR code (4 Ko) et export PNG (1 Ko) sont chargés à la demande.
- **Contenu utile en ≈ 1,1 s** sur 3G simulée (1,6 Mb/s, 150 ms de latence, CPU ×4), médiane de 3 chargements à froid.
- **Polices** : auto-hébergées, sous-ensemble latin, `font-display: swap`.
  - Seule la police de titre (Outfit 600) est préchargée : mesuré, aucun retard du premier affichage.
  - Corps : Archivo 400/500/600. Métadonnées : JetBrains Mono 400.

## Accessibilité et contrastes

| Couleurs | Ratio |
|---|---|
| Terre cuite `#9A5B36` sur `#FAF8F4` | 5,05:1, aucune correction nécessaire |
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
