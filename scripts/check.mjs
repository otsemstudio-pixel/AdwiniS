/**
 * Vérifications avant livraison, sur le build de production (lancer `npm run build` d'abord).
 * Usage : `npm run check`. Captures d'écran écrites dans .check/.
 *
 *  1. Poids du bundle initial (JS + CSS compressés)
 *  2. Contrastes de la palette
 *  3. Aucun débordement horizontal à 320, 375, 768 et 1440 px
 *  4. Structure : un seul h1, hiérarchie des titres, boutons nommés, labels
 *  5. Navigation au clavier (lien d'évitement, focus visible)
 *  6. Menu mobile (ouverture, Échap, retour du focus)
 *  7. Panneau projet
 *  8. Changement de langue (lang, titre, mémorisation)
 *  9. prefers-reduced-motion
 * 10. Mode sombre
 * 11. Carte : aperçu en direct, PNG, vCard, partage (repli copie)
 * 12. Chargement sur 3G simulée
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { findChrome } from './export-assets.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, '.check');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

let failures = 0;
const ok = (cond, label, detail = '') => {
  console.log(`${cond ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};
const section = (title) => console.log(`\n— ${title}`);

/* 1. Bundle ------------------------------------------------------------- */
section('Poids du bundle');
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const initial = [...html.matchAll(/(?:src|href)="\/(?:AdwiniS\/)?(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
let jsGz = 0;
let cssGz = 0;
for (const file of initial) {
  const size = gzipSync(readFileSync(resolve(root, 'dist', file))).length;
  if (file.endsWith('.js')) jsGz += size;
  else cssGz += size;
}
const lazy = readdirSync(resolve(root, 'dist/assets'))
  .filter((f) => f.endsWith('.js') && !initial.includes(`assets/${f}`))
  .map((f) => `${f} ${(gzipSync(readFileSync(resolve(root, 'dist/assets', f))).length / 1024).toFixed(1)} Ko`);
ok(jsGz < 150 * 1024, 'JS initial < 150 Ko compressé', `${(jsGz / 1024).toFixed(1)} Ko`);
console.log(`  CSS initial : ${(cssGz / 1024).toFixed(1)} Ko — chargés à la demande : ${lazy.join(', ')}`);

section('Mouvement : garde-fous');
{
  const css = initial.filter((f) => f.endsWith('.css')).map((f) => readFileSync(resolve(root, 'dist', f), 'utf8')).join('');
  ok(/@supports not \(animation-timeline:\s?view\(\)\)/.test(css), 'Repli @supports not (animation-timeline: view()) présent');
  // Seuls transform et opacity sont animés : aucune transition ni image-clé sur une propriété de mise en page.
  const layoutProps = /\b(width|height|top|left|right|bottom|margin|padding|box-shadow|filter|background-position|letter-spacing|clip-path)\b/;
  let m = null;
  for (const t of css.matchAll(/transition(?:-property)?:([^;{}]+)/g)) if (layoutProps.test(t[1])) m = m || t[0];
  for (const k of css.matchAll(/@keyframes[^{]+\{((?:[^{}]*\{[^{}]*\})*)\}/g)) {
    for (const decl of k[1].matchAll(/([a-z-]+)\s*:/g)) if (layoutProps.test(decl[1])) m = m || k[0];
  }
  ok(!m, 'Aucune animation de propriété de mise en page', m ? m.slice(0, 90) : '');
  ok(/1\s?200\s?\$|\$1,200/.test(html) && /2\s?200\s?\$/.test(html) && />48 h</.test(html), 'Prix et délais présents dans le HTML prérendu');
  const before = Number(process.env.JS_BEFORE_KB || 70.3);
  ok(jsGz / 1024 - before <= 10, 'JavaScript : moins de 10 Ko ajoutés', `+${(jsGz / 1024 - before).toFixed(1)} Ko (avant ${before} Ko)`);
}

/* 2. Contrastes --------------------------------------------------------- */
section('Contrastes');
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const pairs = [
  ['Violet / fond clair', '#4B2A7B', '#FAF8F4', 4.5],
  ['Violet / blanc (cartes)', '#4B2A7B', '#FFFFFF', 4.5],
  ['Texte / fond clair', '#16181C', '#FAF8F4', 4.5],
  ['Secondaire / fond clair', '#5E5C55', '#FAF8F4', 4.5],
  ['Secondaire / blanc (cartes)', '#5E5C55', '#FFFFFF', 4.5],
  ['Secondaire / emplacements image', '#5E5C55', '#ECE8E0', 4.5],
  ['Texte sombre / fond sombre', '#F2EFE9', '#0D0E10', 4.5],
  ['Secondaire sombre / fond sombre', '#9B968C', '#0D0E10', 4.5],
  ['Secondaire sombre / cartes sombres', '#9B968C', '#16181C', 4.5],
  ['Secondaire sombre / emplacements image', '#9B968C', '#1F2226', 4.5],
  ['Violet clair / fond sombre', '#A68FDB', '#0D0E10', 4.5],
  ['Violet clair / encre (section Technologie)', '#A68FDB', '#16181C', 4.5],
  ['Secondaire / ivoire (section inversée, sombre)', '#5E5C55', '#F2EFE9', 4.5],
];
for (const [label, fg, bg, min] of pairs) {
  const r = ratio(fg, bg);
  ok(r >= min, label, `${r.toFixed(2)}:1 (min ${min})`);
}

/* Navigateur ------------------------------------------------------------ */
// Serveur dans un processus séparé : il ne dispute pas le CPU au pilote du navigateur.
const server = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'preview', '--port', '4173', '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
});
const base = 'http://localhost:4173/AdwiniS/';
for (let i = 0; i < 50; i++) {
  try {
    await fetch(base);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}
const browser = await puppeteer.launch({ executablePath: findChrome() });

async function newPage({ width = 1440, height = 900, lang = 'fr-FR', media = [{ name: 'prefers-color-scheme', value: 'light' }] } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.on('pageerror', (err) => ok(false, 'Erreur JS', err.message));
  // Une erreur d'hydratation (prérendu ≠ rendu client) apparaît en console.
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/favicon|Failed to load resource/.test(msg.text())) ok(false, 'Erreur console', msg.text().slice(0, 160));
  });
  await page.setExtraHTTPHeaders({ 'Accept-Language': lang });
  await page.evaluateOnNewDocument((l) => {
    Object.defineProperty(navigator, 'language', { get: () => l });
    Object.defineProperty(navigator, 'languages', { get: () => [l] });
  }, lang);
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
  if (media.length) await page.emulateMediaFeatures(media);
  return { page, context };
}

/** Défile toute la page pour déclencher les apparitions au défilement. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 700));
}

/* 3. Débordements ------------------------------------------------------- */
section('Responsive');
for (const width of [320, 375, 768, 1440, 1920]) {
  const { page, context } = await newPage({ width, height: width < 768 ? 740 : 900 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await scrollThrough(page);
  const res = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll('body *')]
      .filter((el) => {
        // Les bandeaux défilants dépassent volontairement, rognés par leur rangée.
        if (el.closest('dialog:not([open])') || el.closest('.corner-meta') || el.closest('.marquee__row')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 1 || r.left < -1);
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60));
    const small = [...document.querySelectorAll('a, button, input')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || el.closest('dialog:not([open])') || el.classList.contains('skip-link')) return false;
        // Le titre-bouton d'une carte projet couvre toute la carte via ::after.
        if (el.classList.contains('work__open')) return el.closest('.work__card').getBoundingClientRect().height < 44;
        // Les liens dans un paragraphe sont exemptés (WCAG 2.5.8) ; les commandes autonomes doivent faire 44 px.
        return r.height < 44 && getComputedStyle(el).display !== 'inline';
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className} (${Math.round(el.getBoundingClientRect().height)}px)`);
    return { scroll: document.documentElement.scrollWidth, vw, offenders, small };
  });
  ok(res.scroll <= res.vw, `${width} px : pas de défilement horizontal`, res.offenders.join(', '));
  if (width < 768) ok(res.small.length === 0, `${width} px : zones tactiles ≥ 44 px`, res.small.join(', '));
  await page.screenshot({ path: resolve(out, `page-${width}.png`), fullPage: true });
  await page.screenshot({ path: resolve(out, `hero-${width}.png`) });
  await context.close();
}

/* 4. Structure ---------------------------------------------------------- */
section('Structure et accessibilité');
{
  const { page, context } = await newPage();
  await page.goto(base, { waitUntil: 'networkidle0' });
  const s = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1, h2, h3, h4')].filter((h) => !h.closest('dialog'));
    let skips = [];
    let prev = 1;
    for (const h of headings) {
      const level = Number(h.tagName[1]);
      if (level > prev + 1) skips.push(`${h.tagName} « ${h.textContent.slice(0, 30)} »`);
      prev = level;
    }
    const unnamedButtons = [...document.querySelectorAll('button, a')].filter(
      (b) => !(b.getAttribute('aria-label') || b.textContent.trim()),
    ).length;
    const unlabeled = [...document.querySelectorAll('input')].filter((i) => !document.querySelector(`label[for="${i.id}"]`)).length;
    const clickableDivs = [...document.querySelectorAll('div[onclick], div[role="button"]')].length;
    const imgsNoAlt = [...document.querySelectorAll('img:not([alt])')].length;
    return {
      h1: document.querySelectorAll('h1').length,
      skips,
      unnamedButtons,
      unlabeled,
      clickableDivs,
      imgsNoAlt,
      lang: document.documentElement.lang,
    };
  });
  ok(s.h1 === 1, 'Un seul h1', String(s.h1));
  ok(s.skips.length === 0, 'Hiérarchie des titres sans saut', s.skips.join(', '));
  ok(s.unnamedButtons === 0, 'Boutons et liens nommés', String(s.unnamedButtons));
  ok(s.unlabeled === 0, 'Chaque champ a un label', String(s.unlabeled));
  ok(s.clickableDivs === 0, 'Aucune div cliquable');
  ok(s.imgsNoAlt === 0, 'Images avec alt');

  /* 5. Clavier ---------------------------------------------------------- */
  section('Clavier');
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return { cls: el.className, transform: cs.transform };
  });
  ok(first.cls.includes('skip-link') && first.transform === 'none', 'Premier Tab : lien d’évitement visible');
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 300));
  ok(await page.evaluate(() => document.activeElement.id === 'main'), 'Lien d’évitement → contenu principal');
  const stops = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        const cs = getComputedStyle(el.matches('.work__open') ? el : el, el.matches('.work__open') ? '::after' : null);
        return {
          name: (el.getAttribute('aria-label') || el.textContent || el.id || '').trim().slice(0, 28),
          outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2,
        };
      }),
    );
  }
  ok(stops.every((s) => s.outline), 'Focus visible sur chaque arrêt', stops.map((s) => s.name).join(' → '));
  await page.screenshot({ path: resolve(out, 'focus.png') });

  /* 7. Panneau projet --------------------------------------------------- */
  section('Panneau projet');
  await page.evaluate(() => document.querySelector('#travaux').scrollIntoView());
  await page.focus('.work__open');
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 400));
  const panel = await page.evaluate(() => {
    const d = document.querySelector('dialog.panel');
    return { open: d.open, text: d.textContent };
  });
  ok(panel.open && /Problème/.test(panel.text) && /Système visuel/.test(panel.text), 'Ouverture au clavier, 4 rubriques');
  ok(/\[IMAGE PROJET 01\]/.test(panel.text), 'Emplacement [IMAGE PROJET 01] présent');
  await page.screenshot({ path: resolve(out, 'panel-1440.png') });
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));
  const after = await page.evaluate(() => ({
    open: document.querySelector('dialog.panel').open,
    focus: document.activeElement.className,
  }));
  ok(!after.open && after.focus.includes('work__open'), 'Échap ferme et rend le focus à la carte');

  /* 8. Langue ----------------------------------------------------------- */
  section('Langue');
  ok(s.lang === 'fr', 'Navigateur français → site en français');
  // La barre se retire quand on descend : on remonte en haut avant de l'utiliser.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.click('.nav__desktop .lang-switch__btn[lang="en"]');
  const en = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    h1: document.querySelector('h1').textContent,
    title: document.title,
    desc: document.querySelector('meta[name="description"]').content,
    stored: localStorage.getItem('adwini-lang'),
  }));
  ok(en.lang === 'en', 'Attribut lang mis à jour', en.lang);
  ok(/African ideas/i.test(en.h1), 'Titre traduit', en.h1);
  ok(/Brand identity/.test(en.title) && /design studio in Kigali/.test(en.desc), 'Titre et description traduits');
  ok(en.stored === 'en', 'Choix mémorisé');
  await page.reload({ waitUntil: 'networkidle0' });
  ok((await page.evaluate(() => document.documentElement.lang)) === 'en', 'Choix conservé après rechargement');
  await context.close();
}
{
  const { page, context } = await newPage({ lang: 'en-US' });
  await page.goto(base, { waitUntil: 'networkidle0' });
  ok((await page.evaluate(() => document.documentElement.lang)) === 'en', 'Navigateur anglais → site en anglais');
  await scrollThrough(page);
  await page.screenshot({ path: resolve(out, 'page-1440-en.png'), fullPage: true });
  await context.close();
}

/* 6. Menu mobile -------------------------------------------------------- */
section('Menu mobile');
{
  const { page, context } = await newPage({ width: 375, height: 740 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.click('.nav__menu-btn');
  await new Promise((r) => setTimeout(r, 450));
  const m = await page.evaluate(() => ({
    open: document.querySelector('#mobile-menu').open,
    expanded: document.querySelector('.nav__menu-btn').getAttribute('aria-expanded'),
    inMenu: !!document.activeElement.closest('#mobile-menu'),
  }));
  ok(m.open && m.expanded === 'true' && m.inMenu, 'Ouverture, aria-expanded, focus dans le menu');
  await page.screenshot({ path: resolve(out, 'menu-375.png') });
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 1100));
  const c = await page.evaluate(() => ({
    open: document.querySelector('#mobile-menu').open,
    focus: document.activeElement.className,
    locked: document.documentElement.classList.contains('is-locked'),
  }));
  ok(!c.open && c.focus.includes('nav__menu-btn') && !c.locked, 'Échap ferme, focus rendu, défilement débloqué');
  await page.click('.nav__menu-btn');
  await new Promise((r) => setTimeout(r, 450));
  await page.click('.menu__link[href="#carte"]');
  await new Promise((r) => setTimeout(r, 2500));
  const nav = await page.evaluate(() => ({
    open: document.querySelector('#mobile-menu').open,
    top: Math.round(document.querySelector('#carte').getBoundingClientRect().top),
  }));
  ok(!nav.open && nav.top < 120, 'Un lien du menu ferme le menu et mène à la section', `top ${nav.top}`);
  await context.close();
}

/* 9. Mouvement réduit --------------------------------------------------- */
section('prefers-reduced-motion');
{
  const { page, context } = await newPage({ media: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page.goto(base, { waitUntil: 'networkidle0' });
  const r = await page.evaluate(() => {
    // Aucun mot sous masque, aucun bloc rogné, aucun volet : tout est visible sans défiler.
    const hidden = [...document.querySelectorAll('.split--scroll .w__i')].filter((el) => getComputedStyle(el).transform !== 'none').length +
      [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity !== '1' || getComputedStyle(el).transform !== 'none').length;
    const moving = [...document.querySelectorAll('.marquee__track, .parallax, .poles .pole, .reveal')].filter((el) => getComputedStyle(el).animationName !== 'none').length;
    const anim = getComputedStyle(document.querySelector('.split--load .w__i')).animationName;
    const smooth = getComputedStyle(document.documentElement).scrollBehavior;
    return { hidden, anim, smooth, moving };
  });
  ok(r.hidden === 0, 'Tous les textes visibles sans défilement ni animation', String(r.hidden));
  ok(r.anim === 'none', 'Titre du hero sans animation');
  ok(r.smooth === 'auto', 'Pas de défilement animé');
  ok(r.moving === 0, 'Bandeaux, parallaxe, cartes : aucune animation', String(r.moving));
  await context.close();
}

/* 10. Mode sombre ------------------------------------------------------- */
section('Mode sombre');
for (const width of [375, 1440]) {
  const { page, context } = await newPage({ width, height: 800, media: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await page.goto(base, { waitUntil: 'networkidle0' });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(bg === 'rgb(13, 14, 16)', `${width} px : fond sombre (système)`, bg);
  await scrollThrough(page);
  await page.screenshot({ path: resolve(out, `dark-${width}.png`), fullPage: true });
  await context.close();
}

section('Bascule de thème');
{
  const { page, context } = await newPage();
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.click('.nav__desktop .icon-btn');
  const t1 = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, stored: localStorage.getItem('adwini-theme') }));
  ok(t1.bg === 'rgb(13, 14, 16)' && t1.stored === 'dark', 'Clair → sombre, choix mémorisé', t1.bg);
  await page.reload({ waitUntil: 'networkidle0' });
  ok((await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'Thème conservé après rechargement');
  await context.close();
}

/* 11. Carte ------------------------------------------------------------- */
section('Carte de visite');
{
  const { page, context } = await newPage({ width: 1440 });
  const downloads = resolve(out, 'downloads');
  mkdirSync(downloads, { recursive: true });
  const cdp = await browser.target().createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads, browserContextId: context.id });
  await context.overridePermissions(base.replace(/\/$/, ''), ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelector('#carte').scrollIntoView());
  await new Promise((r) => setTimeout(r, 500));
  const fill = { name: 'Amani Uwase', role: 'Fondatrice', company: 'Kivu Coffee', email: 'amani@kivu.rw', phone: '+250 788 000 000', website: 'kivu.rw', linkedin: 'amani-uwase', instagram: '@kivucoffee' };
  for (const [k, v] of Object.entries(fill)) await page.type(`#card-${k}`, v);
  await page.waitForSelector('.bcard__face--back path[shape-rendering]', { timeout: 10000 }).catch(() => {});
  const live = await page.evaluate(() => {
    const back = document.querySelector('.bcard__face--back svg');
    return { text: back.textContent, qr: back.querySelector('path[shape-rendering]')?.getAttribute('d').length ?? 0 };
  });
  ok(/Amani Uwase/.test(live.text) && /Kivu Coffee/.test(live.text), 'Aperçu mis à jour pendant la saisie');
  ok(live.qr > 100, 'QR code généré (vCard)');
  // Boutons centrés à l'écran et page stabilisée avant de cliquer (la barre se retire au défilement).
  await page.evaluate(() => document.querySelector('.cardmaker__actions').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.click('.cardmaker__actions .btn:nth-child(1)'); // Retourner
  await new Promise((r) => setTimeout(r, 800));
  ok(await page.evaluate(() => document.querySelector('.bcard').classList.contains('is-flipped')), 'Retourner affiche le verso');
  await page.screenshot({ path: resolve(out, 'card-back.png') });
  await page.click('.cardmaker__actions .btn:nth-child(2)'); // Télécharger
  await page.waitForFunction(() => /téléchargé/.test(document.querySelector('.cardmaker__status').textContent), { timeout: 10000 }).catch(() => {});
  await page.click('.cardmaker__actions .btn:nth-child(4)'); // vCard
  await new Promise((r) => setTimeout(r, 1500));
  const files = readdirSync(downloads);
  ok(files.includes('adwini-amani-uwase.png'), 'PNG téléchargé', files.join(', '));
  ok(files.includes('adwini-amani-uwase.vcf'), 'vCard téléchargé');
  if (files.includes('adwini-amani-uwase.vcf')) {
    const vcf = readFileSync(resolve(downloads, 'adwini-amani-uwase.vcf'), 'utf8');
    ok(/FN:Amani Uwase/.test(vcf) && /ORG:Kivu Coffee/.test(vcf) && /URL;TYPE=Instagram:https:\/\/instagram.com\/kivucoffee/.test(vcf), 'Contenu vCard correct');
  }
  // Partage : Chrome de bureau sans Web Share → repli sur la copie du lien.
  await page.evaluate(() => {
    // @ts-ignore
    delete Navigator.prototype.share;
  });
  await page.click('.cardmaker__actions .btn:nth-child(3)');
  await new Promise((r) => setTimeout(r, 1500));
  const shared = await page.evaluate(async () => ({
    status: document.querySelector('.cardmaker__status').textContent,
    clip: await navigator.clipboard.readText().catch(() => ''),
  }));
  ok(/copié/.test(shared.status) && shared.clip.includes('#carte?n=Amani+Uwase'), 'Partage : repli copie du lien', shared.clip);
  // Le lien partagé reconstruit la carte.
  const { page: p2, context: c2 } = await newPage({ width: 375, height: 740 });
  await p2.goto(shared.clip || `${base}#carte?n=Test`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  ok(await p2.evaluate(() => document.querySelector('#card-name').value === 'Amani Uwase'), 'Le lien partagé pré-remplit la carte');
  await p2.screenshot({ path: resolve(out, 'card-375.png') });
  await c2.close();
  await context.close();
}

/* 12. 3G ---------------------------------------------------------------- */
/* Cartes : fondateur et brief ---------------------------------------- */
const pngSize = (file) => {
  const b = readFileSync(file);
  return `${b.readUInt32BE(16)}×${b.readUInt32BE(20)}`;
};

section('Carte du fondateur (/carte, /card)');
{
  const { page, context } = await newPage({ width: 1440 });
  const downloads = resolve(out, 'founder');
  mkdirSync(downloads, { recursive: true });
  const cdp = await browser.target().createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads, browserContextId: context.id });
  await context.overridePermissions(base.replace(/\/AdwiniS\/$/, ''), ['clipboard-read', 'clipboard-write', 'clipboard-sanitized-write']);
  await page.goto(base + 'carte/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.bcard__face--back path[shape-rendering]', { timeout: 10000 }).catch(() => {});
  const info = await page.evaluate(() => ({
    robots: document.querySelector('meta[name="robots"]')?.content,
    lang: document.documentElement.lang,
    back: document.querySelector('.bcard__face--back svg').textContent,
    qr: document.querySelector('[data-qr-text]')?.getAttribute('data-qr-text'),
    inputs: document.querySelectorAll('main input, main textarea').length,
  }));
  ok(info.robots === 'noindex, nofollow', '/carte : noindex, nofollow');
  ok(/Kouamé N'nahssé Jean-David/.test(info.back) && /Fondateur · Adwini Studio/.test(info.back) && /\+250 799 496 971/.test(info.back) && /otsemstudio-pixel\.github\.io\/AdwiniS/.test(info.back), 'Informations exactes du fondateur');
  ok(!/\[/.test(info.back), 'Emplacements « [À REMPLIR] » absents de la carte');
  ok(info.inputs === 0, 'Carte non modifiable (aucun champ)');
  ok(info.qr === 'https://otsemstudio-pixel.github.io/AdwiniS/', 'QR code → page d’accueil', info.qr);
  const click = async (text) => {
    await page.evaluate((t) => [...document.querySelectorAll('.founder button')].find((b) => b.textContent.trim().startsWith(t)).click(), text);
    await new Promise((r) => setTimeout(r, 1800));
  };
  await click('Retourner');
  ok(await page.evaluate(() => document.querySelector('.bcard').classList.contains('is-flipped')), 'Retourner');
  await click('Télécharger');
  await click('Télécharger le contact');
  await click('Télécharger en haute définition');
  await click('Format carré');
  await page.evaluate(() => {
    // @ts-ignore
    delete Navigator.prototype.share;
  });
  await click('Partager');
  const files = readdirSync(downloads);
  const has = (f) => files.includes(f);
  const stem = 'adwini-kouame-n-nahsse-jean-david';
  ok(has(`${stem}.png`), 'Export PNG standard', has(`${stem}.png`) ? pngSize(resolve(downloads, `${stem}.png`)) : files.join(', '));
  ok(has(`${stem}-hd.png`), 'Export haute définition (×3)', has(`${stem}-hd.png`) ? pngSize(resolve(downloads, `${stem}-hd.png`)) : '');
  ok(has(`${stem}-1080.png`) && pngSize(resolve(downloads, `${stem}-1080.png`)) === '1080×1080', 'Export carré 1080 × 1080', has(`${stem}-1080.png`) ? pngSize(resolve(downloads, `${stem}-1080.png`)) : '');
  if (has(`${stem}.vcf`)) {
    const vcf = readFileSync(resolve(downloads, `${stem}.vcf`), 'utf8');
    ok(/FN:Kouamé N'nahssé Jean-David/.test(vcf) && /TEL;TYPE=CELL:\+250 799 496 971/.test(vcf) && !/\[/.test(vcf), 'Contact .vcf (sans emplacements)');
  } else ok(false, 'Contact .vcf');
  const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok(clip.endsWith('/carte/'), 'Partager : repli copie du lien', clip);
  await page.goto(base + 'card/', { waitUntil: 'networkidle0' });
  ok(await page.evaluate(() => document.documentElement.lang === 'en' && /Founder · Adwini Studio/.test(document.querySelector('.bcard__face--back svg').textContent)), '/card : version anglaise');
  await context.close();
  // Non liée et non indexée.
  const homeHtml = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
  ok(!/href="[^"]*\/(carte|card)\/?"/.test(homeHtml), 'Aucun lien vers /carte depuis le site');
  const robots = readFileSync(resolve(root, 'dist/robots.txt'), 'utf8');
  const sitemap = readFileSync(resolve(root, 'dist/sitemap.xml'), 'utf8');
  ok(!/carte|card|brief/.test(robots) && !/carte|card|brief/.test(sitemap.replace(/<!--[\s\S]*?-->/g, '')), 'Absente du robots.txt et du sitemap.xml');
}

section('Carte de brief (contact)');
{
  const { page, context } = await newPage({ width: 1440 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.getElementById('contact').scrollIntoView({ behavior: 'instant' }));
  await new Promise((r) => setTimeout(r, 1200));
  const quick = await page.evaluate(() => [...document.querySelectorAll('.brief__quick a')].map((a) => a.href)[0]);
  ok(/^https:\/\/wa\.me\/250799496971\?text=/.test(quick), 'Sortie rapide WhatsApp sans formulaire');
  ok(await page.evaluate(() => [...document.querySelectorAll('.choice')].every((b) => b.tagName === 'BUTTON' && b.hasAttribute('aria-pressed'))), 'Choix en <button aria-pressed>');
  ok(await page.evaluate(() => !document.querySelector('#contact select')), 'Aucune liste déroulante');
  await page.click('.brief__send');
  await new Promise((r) => setTimeout(r, 300));
  ok(await page.evaluate(() => document.activeElement.id === 'brief-name' && /Il manque/.test(document.querySelector('.brief__aside [role=status]').textContent)), 'Envoi incomplet : champs manquants annoncés, focus placé');
  await page.type('#brief-name', 'Amani Uwase');
  await page.type('#brief-company', 'Kivu Coffee');
  await page.type('#brief-sentence', 'Une identité et un site pour lancer notre café de spécialité à Kigali.');
  const choose = (g, t) => page.evaluate((g, t) => [...document.querySelectorAll(`[aria-labelledby="${g}-label"] .choice`)].find((x) => x.textContent === t).click(), g, t);
  await choose('brief-needs', 'Identité');
  await choose('brief-needs', 'Interfaces');
  await choose('brief-deadline', 'Ce mois-ci');
  await choose('brief-budget', '600–1 200 $');
  await new Promise((r) => setTimeout(r, 500));
  const preview = await page.evaluate(() => document.querySelector('.brief__aside svg').textContent);
  ok(/Amani Uwase/.test(preview) && /Kivu Coffee/.test(preview) && /BRF—/.test(preview) && /Ce mois-ci/.test(preview), 'Aperçu en direct de la carte de brief');
  const wa = await page.evaluate(() => document.querySelector('.brief__send').href);
  const text = new URL(wa).searchParams.get('text');
  const link = text.match(/https?:\/\/\S+/)[0];
  ok(wa.startsWith('https://wa.me/250799496971?text=') && /Je suis Amani Uwase, de Kivu Coffee\./.test(text) && /J’ai besoin de : Identité, Interfaces/.test(text) && /Budget : 600–1 200 \$/.test(text), 'Message WhatsApp lisible et structuré');
  ok(text.length - link.length <= 600 && link.length <= 800 && wa.length <= 1500, 'Longueurs : message ≤ 600, lien ≤ 800, URL ≤ 1 500', `${text.length - link.length} / ${link.length} / ${wa.length}`);
  await context.close();

  // Le lien reconstitue la carte dans un autre contexte (aucun stockage partagé).
  const other = await newPage({ width: 1100 });
  await other.page.goto(link, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));
  const rebuilt = await other.page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent,
    card: document.querySelector('.brief-page__card svg')?.textContent,
    robots: document.querySelector('meta[name="robots"]')?.content,
  }));
  ok(rebuilt.h1 === 'Amani Uwase — Kivu Coffee' && rebuilt.card?.replace(/\s/g, '') === preview.replace(/\s/g, ''), 'Le lien reconstitue la carte à l’identique');
  ok(rebuilt.robots === 'noindex, nofollow', '/brief : noindex, nofollow');
  // Paramètres corrompus ou hostiles : page d'erreur propre, aucun HTML injecté.
  const hostile = 'j' + Buffer.from('{"n":"<img src=x onerror=alert(1)>","c":"x","b":["hack"],"s":"x","e":"","g":""}').toString('base64url');
  let clean = 0;
  for (const q of ['', '?d=', '?d=zAAAA', '?d=%%%', `?d=${hostile}`, `?d=${link.split('d=')[1].slice(0, -10)}`, `?d=j${'A'.repeat(1600)}`]) {
    await other.page.goto(base + 'brief/' + q, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 200));
    if (await other.page.evaluate(() => /illisible/.test(document.querySelector('h1')?.textContent || '') && !document.querySelector('main img'))) clean++;
  }
  ok(clean === 7, 'Liens corrompus : page d’erreur propre (7/7)', `${clean}/7`);
  await other.context.close();

  // Pire cas : champs remplis au maximum avec un texte peu compressible.
  const { page: mp, context: mc } = await newPage({ width: 1440 });
  await mp.goto(base, { waitUntil: 'networkidle0' });
  const fill = (sel, v) => mp.$eval(sel, (el, v) => { Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  let seed = 11;
  const rnd = (abc, n) => Array.from({ length: n }, (_, i) => (i % 8 === 7 ? ' ' : abc[(seed = (seed * 16807) % 2147483647) % abc.length])).join('');
  let worst = 0;
  for (const abc of ['éèàùçêôîœabcdefghijklmnopqrstuvwxyz', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJ0123456789', '漢字仮名交じり文日本語中文한국어']) {
    await fill('#brief-name', rnd(abc, 40));
    await fill('#brief-company', rnd(abc, 60));
    await fill('#brief-sentence', rnd(abc, 140));
    await mp.evaluate(() => document.querySelectorAll('.choice').forEach((c) => c.getAttribute('aria-pressed') !== 'true' && !/sais pas encore/.test(c.textContent) && c.click()));
    await new Promise((r) => setTimeout(r, 400));
    worst = Math.max(worst, (await mp.evaluate(() => document.querySelector('.brief__send').href)).length);
  }
  ok(worst <= 1500, 'Aucune URL générée au-delà de 1 500 caractères (champs au maximum)', `pire cas ${worst}`);
  await mc.close();
}

section('Fluidité du défilement (CPU ×4)');
for (const width of [375, 1440]) {
  const { page, context } = await newPage({ width, height: width < 768 ? 740 : 900 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const fps = await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const frames = [];
    let last = performance.now();
    await new Promise((done) => {
      const step = (now) => {
        frames.push(now - last);
        last = now;
        window.scrollBy(0, 24);
        if (scrollY >= max - 2) done();
        else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const sorted = frames.slice(5).sort((a, b) => a - b);
    const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    return { mean: 1000 / mean, p95: 1000 / p95, frames: sorted.length };
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  ok(fps.mean >= 50, `${width} px : défilement ≥ 50 images/s en moyenne`, `moyenne ${fps.mean.toFixed(0)} i/s, 95e centile ${fps.p95.toFixed(0)} i/s, ${fps.frames} images`);
  await context.close();
}

section('3G simulée (1,6 Mb/s, 150 ms RTT, CPU ×4) — médiane de 3 chargements à froid');
{
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const { page, context } = await newPage({ width: 375, height: 740 });
    const cdp = await page.createCDPSession();
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(base, { waitUntil: 'networkidle0', timeout: 60000 });
    runs.push(
      await page.evaluate(() => ({
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0,
        lcp: window.__lcp,
        interactive: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        bytes: performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0) +
          performance.getEntriesByType('navigation')[0].transferSize,
      })),
    );
    await context.close();
  }
  const med = (k) => runs.map((r) => r[k]).sort((a, b) => a - b)[1];
  ok(med('lcp') < 2000, 'Contenu utile (LCP) < 2 s', `FCP ${Math.round(med('fcp'))} ms, LCP ${Math.round(med('lcp'))} ms (essais : ${runs.map((r) => Math.round(r.lcp)).join(' / ')} ms)`);
  console.log(`  DOMContentLoaded ${Math.round(med('interactive'))} ms — ${(med('bytes') / 1024).toFixed(0)} Ko transférés au total`);
}

await browser.close();
server.kill();
console.log(failures ? `\n${failures} vérification(s) en échec.` : '\nToutes les vérifications passent.');
process.exit(failures ? 1 : 0);
