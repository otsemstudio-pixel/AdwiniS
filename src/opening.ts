/**
 * Séquence d'ouverture du site (page d'accueil uniquement), injectée dans le HTML au build
 * par le plugin de vite.config.ts — jamais par l'application React.
 *
 * Principe : l'ouverture ne retarde jamais le contenu, elle le RECOUVRE. Le HTML prérendu est
 * déjà dans le document ; un calque encre le couvre pendant 1 400 ms puis se lève.
 *
 *  - Le calque est masqué par défaut ; il ne s'affiche que sous la classe `ouverture`, posée par
 *    l'amorce. Sans JavaScript, en cas d'erreur, ou si la séquence est sautée : le site, directement.
 *  - Sautée si : déjà vue dans la session, mouvement réduit, économie de données, connexion 2G.
 *  - Garde-fou : quoi qu'il arrive, la classe est retirée après 2 500 ms.
 *  - Aucun faux pourcentage, aucun indicateur d'attente, aucun son.
 *
 * Calendrier (ms) : 0 encre · 60→760 tracé du logo · 700→900 « ADWINI » se resserre ·
 * 900→1400 le calque se lève (le logo monte 15 % plus vite) · dès 1100 le titre du hero monte.
 */
import { mark } from './data/brand';

/** Amorce : synchrone, en tête de <head>, avant toute feuille de style. */
export const openingScript = `<script>
(function () {
  var h = document.documentElement;
  var done = function () {
    h.classList.remove('ouverture');
    try { sessionStorage.setItem('adwini-vu', '1'); } catch (e) {}
  };
  // Garde-fou, posé avant tout le reste : le site n'est jamais bloqué derrière le calque.
  setTimeout(done, 2500);
  try {
    var c = navigator.connection;
    var skip =
      sessionStorage.getItem('adwini-vu') === '1' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (c && (c.saveData === true || ['slow-2g', '2g'].indexOf(c.effectiveType) > -1));
    if (!skip) {
      h.classList.add('ouverture', 'ouverture-jouee');
      // Fin réelle : quand le calque a fini de se lever (et non une durée supposée).
      document.addEventListener('animationend', function (e) {
        if (e.animationName === 'ouverture-lever') done();
      });
    }
  } catch (e) { /* en cas d'erreur : aucune classe, aucune animation */ }
})();
</script>`;

/** Styles du calque : critiques, en ligne, minimes. Seuls transform et opacity sont animés
 *  (plus le tracé SVG du trait). Le calque est invisible sans la classe `ouverture`. */
export const openingStyle = `<style>
.ouverture-calque{display:none}
.ouverture body{overflow:hidden}
.ouverture .ouverture-calque{position:fixed;inset:0;z-index:200;display:grid;place-items:center;background:#16181c;color:#f2efe9;pointer-events:none;animation:ouverture-lever .5s cubic-bezier(.76,0,.24,1) .9s forwards}
.ouverture-logo{display:grid;justify-items:center;gap:1.4rem;animation:ouverture-logo .5s cubic-bezier(.76,0,.24,1) .9s forwards}
.ouverture-logo svg{width:clamp(72px,14vw,112px);height:auto;overflow:visible}
.ouverture-logo path{stroke-dasharray:1;stroke-dashoffset:1;animation:ouverture-tracer .7s cubic-bezier(.65,0,.35,1) 60ms forwards}
.ouverture-mot{display:flex;font:600 clamp(1rem,2.4vw,1.35rem)/1 Outfit,'Segoe UI',system-ui,sans-serif;letter-spacing:.12em}
.ouverture-mot span{display:inline-block;opacity:0;transform:translateX(calc(var(--d)*.28em));animation:ouverture-serrer .2s cubic-bezier(.16,1,.3,1) .7s forwards}
.ouverture-jouee .split--load .w__i{animation-delay:calc(1.1s + var(--i)*40ms)!important}
@keyframes ouverture-tracer{to{stroke-dashoffset:0}}
@keyframes ouverture-serrer{to{opacity:1;transform:none}}
@keyframes ouverture-lever{to{transform:translateY(-100%)}}
@keyframes ouverture-logo{to{transform:translateY(-15vh)}}
</style>`;

/** Le calque : le symbole (tracés normalisés par pathLength="1") et le mot ADWINI. */
export function openingOverlay() {
  const paths = mark.strokes
    .concat(mark.sparks)
    .map((d) => `<path pathLength="1" d="${d}"/>`)
    .join('');
  // « ADWINI » : le resserrement de l'interlettrage est rendu par translateX de chaque lettre
  // vers sa place (transform), plutôt qu'en animant letter-spacing (propriété de mise en page).
  const letters = 'ADWINI'
    .split('')
    .map((ch, i) => `<span style="--d:${i - 2.5}">${ch}</span>`)
    .join('');
  return `<div class="ouverture-calque" aria-hidden="true" inert>
  <div class="ouverture-logo">
    <svg viewBox="${mark.viewBox}" fill="none" stroke="currentColor" stroke-width="${mark.strokeWidth}" stroke-linecap="${mark.linecap}" stroke-linejoin="round" focusable="false">${paths}</svg>
    <div class="ouverture-mot">${letters}</div>
  </div>
</div>`;
}
