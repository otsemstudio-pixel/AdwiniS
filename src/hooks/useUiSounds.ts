import { useEffect, useSyncExternalStore } from 'react';
import { onSoundChange, play, setSoundEnabled, soundEnabled } from '../utils/sound';

/** Éléments qui « cliquent » : liens, boutons, choix, étiquettes de case, poignées. */
const CLICKABLE = 'a[href], button, [role="button"], label, summary, input[type="checkbox"], input[type="radio"], select';
/** Champs où l'on écrit. */
const TYPING = 'input:not([type]), input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="search"], textarea';

/**
 * Sons de l'interface, un seul jeu d'écouteurs délégués pour tout le site :
 * clic (souris, toucher, ou Entrée / Espace sur un bouton) et frappe dans les champs.
 */
export function useUiSounds() {
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.button !== 0 || !(e.target instanceof Element)) return;
      const el = e.target.closest(CLICKABLE);
      if (el && !el.matches(':disabled, [aria-disabled="true"]')) play('click');
    };
    // Activation au clavier (detail === 0) : le clic n'a pas été précédé d'un pointerdown.
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0 && e.target instanceof Element && e.target.closest(CLICKABLE)) play('click');
    };
    const onInput = (e: Event) => {
      const el = e.target;
      if (!(el instanceof Element) || !el.matches(TYPING)) return;
      const ie = e as InputEvent;
      if (ie.inputType?.startsWith('delete')) play('delete');
      else if (ie.inputType === 'insertLineBreak') play('enter');
      else if (ie.data === ' ') play('space');
      else play('key');
    };
    // Entrée dans un champ d'une ligne : pas d'événement input, mais le son de la touche.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target instanceof Element && e.target.matches(TYPING) && !e.target.matches('textarea')) play('enter');
    };
    document.addEventListener('pointerdown', onPointer, { passive: true });
    document.addEventListener('click', onClick, true);
    document.addEventListener('input', onInput, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('input', onInput, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, []);
}

/** État des sons pour le bouton haut-parleur (faux au prérendu : le HTML ne présume rien). */
export function useSoundSetting() {
  const on = useSyncExternalStore(onSoundChange, soundEnabled, () => true);
  return { on, toggle: () => setSoundEnabled(!soundEnabled()) };
}
