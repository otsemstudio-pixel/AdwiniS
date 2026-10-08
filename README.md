# Adwini Studio — site officiel

Site vitrine bilingue (FR / EN) d'Adwini Studio, Kigali. React + Vite + TypeScript, **100 % statique** : aucun backend, aucune base de données. Le HTML est prérendu au build, donc le contenu s'affiche avant le chargement du JavaScript.

**En ligne :** https://otsemstudio-pixel.github.io/AdwiniS/ — publié automatiquement par GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.

```bash
npm install
npm run dev       # développement sur http://localhost:5173/AdwiniS/
npm run build     # build de production → dist/ (à déployer tel quel)
npm run check     # vérifications avant livraison (après un build)
npm run assets    # régénère l'image de partage et les icônes PNG
```

`npm run check` et `npm run assets` utilisent Chrome ou Edge installé sur la machine (sinon, définir `CHROME_PATH`).

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
| La structure commune des deux langues | `src/data/types.ts` |

**Les deux langues doivent garder la même structure.** Si une clé manque dans l'un des deux fichiers, `npm run build` échoue et indique laquelle. Les textes anglais sont rédigés comme des textes originaux, pas traduits mot à mot : gardez cette règle.

Les prix sont des nombres (`1200`), et le format est appliqué automatiquement selon la langue : « 1 200 $ » en français, « $1,200 » en anglais. Mettre `price: null` affiche le texte `priceNote` de la formule (« Sur devis »).

### Emplacements à remplir avant la mise en ligne

Toute information manquante est un emplacement explicite entre crochets. Pour tous les retrouver :

```bash
grep -rn "\[" src/data/site.ts index.html
```

- `[NUMÉRO WHATSAPP]` : chiffres uniquement, format international sans « + » (ex. `250788123456`)
- `[EMAIL]`, `[LIEN INSTAGRAM]`, `[LIEN LINKEDIN]`, `[LIEN BEHANCE]`
- `[@COMPTE X]` : dans `index.html`

### Passer à un domaine personnalisé

Une fois le domaine acheté :
1. dans `vite.config.ts`, remettre `base: '/'` ;
2. créer `public/CNAME` contenant le domaine (ex. `www.adwinistudio.com`) ;
3. remplacer `https://otsemstudio-pixel.github.io/AdwiniS/` dans `index.html` et `src/data/site.ts` ;
4. dans `scripts/check.mjs`, remettre `const base = 'http://localhost:4173/'` ;
5. chez le registraire, créer un enregistrement CNAME : `www` → `otsemstudio-pixel.github.io` ;
6. dans Settings → Pages, saisir le domaine, puis cocher « Enforce HTTPS ».

### Ajouter les vrais visuels des projets

Les emplacements `[IMAGE PROJET 01]` à `03` sont rendus par `src/sections/Works.tsx` et `src/components/ProjectPanel.tsx` (classe `.placeholder`). Pour chaque image :

- format WebP, avec `loading="lazy"` ;
- un `srcset` responsive ;
- des `width` et `height` explicites ;
- un `alt` descriptif.

### Ajouter un projet

Ajoutez une entrée dans `work.projects` des deux fichiers de contenu, avec un code `PRJ—004` (trois lettres, tiret long, trois chiffres). La mise en page bureau prévoit trois cartes : au-delà, ajustez `.works__grid` dans `src/styles/sections.css`.

---

## Architecture

```
src/
  data/        contenus FR/EN, prix, coordonnées, types partagés
  sections/    une section de page par fichier (Hero, Subscription, CardMaker…)
  components/  briques réutilisables (Logo, Section, Nav, MobileMenu, BusinessCard…)
  hooks/       langue (useLanguage), apparition au défilement, état de défilement
  utils/       formatage, vCard, QR code, export PNG
  styles/      tokens.css (palette, mode sombre), base, composants, sections
scripts/
  prerender.mjs      injecte le HTML FR + EN prérendu dans dist/index.html
  export-assets.mjs  génère og-image.png et les icônes à partir de SVG
  check.mjs          vérifications automatiques (voir plus bas)
```

L'ordre des sections et leur numéro (`01 / PHILOSOPHIE`…) sont définis dans la liste `SECTIONS` de `src/App.tsx`.

### Langue

Un petit script dans `index.html` choisit la langue avant le premier affichage, dans cet ordre : choix mémorisé (`localStorage`), langue du navigateur, sinon le français. Les deux versions sont prérendues, donc aucune langue ne s'affiche brièvement avant l'autre. L'attribut `lang`, le titre, la description et les balises Open Graph suivent chaque changement de langue.

### Carte de visite numérique

Tout est généré dans le navigateur et rien n'est envoyé.

- **Aperçu** : SVG mis à jour pendant la saisie.
- **Export PNG** : SVG converti via canvas, polices incorporées.
- **Contact** : fichier `.vcf` (vCard 3.0).
- **QR code** : encode la vCard, généré par `uqr` (≈ 4 Ko, chargé à la demande).
- **Lien de partage** : contient les champs dans l'adresse (`#carte?n=…`) et reconstruit la carte à l'ouverture.

---

## Choix de performance (mesurés)

- **JS initial : ≈ 62 Ko compressés** (budget : 150 Ko). Le QR code et l'export PNG sont chargés à la demande.
- **Premier affichage ≈ 1,1 s** sur 3G simulée (1,6 Mb/s, 150 ms de latence, CPU ×4), médiane de 3 chargements à froid.
- **Prérendu statique** : sans lui, l'affichage attendait le JS (≈ 3,3 s).
- **Hydratation après le premier affichage** : React ne retarde pas la première image sur un téléphone lent.
- **Polices non préchargées** : mesuré, le préchargement retardait le premier affichage d'environ 1 s. Elles arrivent en `font-display: swap`. Un repli Georgia aux métriques ajustées (`size-adjust`) limite le décalage quand Fraunces s'affiche.
- **Polices auto-hébergées, sous-ensemble latin uniquement** (`@fontsource`).

## Accessibilité et contrastes

| Couleurs | Ratio | Usage |
|---|---|---|
| Terre cuite `#9A5B36` sur ivoire | 4,75:1 | conforme au texte courant, couleur conservée |
| Texte tertiaire `#8C877C` sur ivoire | 3,17:1 | décor et texte ≥ 24 px uniquement en mode clair ; les métadonnées utilisent le texte secondaire (5,94:1) |

L'ensemble des contrastes est vérifié par `npm run check`.

## Ce que vérifie `npm run check`

- poids du bundle ;
- contrastes ;
- absence de défilement horizontal à 320, 375, 768 et 1440 px ;
- zones tactiles d'au moins 44 px ;
- hiérarchie des titres, un seul `h1`, labels des champs ;
- navigation au clavier et focus visible ;
- menu mobile ;
- panneau projet ;
- changement et mémorisation de la langue ;
- `prefers-reduced-motion` et mode sombre ;
- carte : aperçu, PNG, vCard, repli de partage, lien partagé ;
- temps d'affichage sur 3G simulée.

Les captures d'écran sont écrites dans `.check/`.
