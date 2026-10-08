/**
 * Contrôle d'alignement des blocs encadrés, à exécuter dans la page (page.evaluate).
 * Pour chaque carte (contour de 2 px) :
 *  1. aucun contenu ne touche le contour (marge intérieure ≥ 12 px) ;
 *  2. aucun contenu ne dépasse à droite ;
 *  3. les cartes sœurs ont la même marge intérieure gauche (texte aligné d'une carte à l'autre).
 * Retourne la liste des problèmes (vide si tout est aligné).
 */
export function auditAlignment() {
  const MIN_INSET = 12;
  const problems = [];
  const boxes = [...document.querySelectorAll('.card, .brief__quick')].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && !el.closest('dialog:not([open])');
  });
  const describe = (el) => `${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).split(' ').filter(Boolean).slice(0, 2).join('.')}`;
  const insetOf = new Map();

  for (const box of boxes) {
    const b = box.getBoundingClientRect();
    // Contenu « porteur » : éléments avec du texte propre, ou visuels (svg), hors décor absolu.
    const items = [...box.querySelectorAll('*')].filter((el) => {
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return false;
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' || cs.visibility === 'hidden' || cs.display === 'none') return false;
      if (el.classList.contains('visually-hidden') || el.closest('.visually-hidden')) return false;
      if (el.closest('.placeholder') || cs.textAlign === 'center') return false;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return own || el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'button';
    });
    let minLeft = Infinity;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      // Le texte réel d'un élément en ligne peut être plus étroit que sa boîte : on mesure le texte.
      let left = r.left;
      let right = r.right;
      const range = document.createRange();
      range.selectNodeContents(el);
      const tr = range.getBoundingClientRect();
      if (tr.width) {
        left = Math.max(left, tr.left);
        right = Math.min(right, tr.right);
      }
      minLeft = Math.min(minLeft, left);
      if (left - b.left < MIN_INSET - 0.5) problems.push(`${describe(box)} : « ${(el.textContent || el.tagName).trim().slice(0, 24)} » colle au bord gauche (${(left - b.left).toFixed(0)} px)`);
      if (b.right - right < MIN_INSET - 0.5) problems.push(`${describe(box)} : « ${(el.textContent || el.tagName).trim().slice(0, 24)} » colle ou dépasse à droite (${(b.right - right).toFixed(0)} px)`);
    }
    if (minLeft !== Infinity) insetOf.set(box, Math.round(minLeft - b.left));
  }

  // Cartes sœurs : même marge intérieure (à 2 px près).
  const byParent = new Map();
  for (const [box, inset] of insetOf) {
    const key = box.parentElement?.parentElement || box.parentElement;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push([box, inset]);
  }
  for (const group of byParent.values()) {
    if (group.length < 2) continue;
    const insets = group.map(([, i]) => i);
    if (Math.max(...insets) - Math.min(...insets) > 2) {
      problems.push(`${describe(group[0][0])} ×${group.length} : marges intérieures différentes (${insets.join(' / ')} px)`);
    }
  }
  return [...new Set(problems)];
}
