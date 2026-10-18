/**
 * Sons de l'interface, synthétisés à la volée (Web Audio) : aucun fichier à télécharger.
 *  - clic : un « toc » bref et sec sur les éléments cliquables ;
 *  - frappe : un léger cliquetis de clavier dans les champs, plus grave pour l'espace et
 *    la touche Entrée, plus sec pour l'effacement, jamais deux fois exactement le même.
 * Activés par défaut, coupables à tout moment (bouton haut-parleur), choix mémorisé.
 * Le contexte audio n'est créé qu'au premier geste du visiteur (règle des navigateurs).
 */

const KEY = 'adwini-sound';
type Listener = (on: boolean) => void;

let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== 'off';
} catch {
  /* stockage indisponible : sons actifs pour la visite */
}

const listeners = new Set<Listener>();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let lastKey = 0;

export const soundEnabled = () => enabled;

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* le choix vaut pour la visite */
  }
  listeners.forEach((l) => l(on));
  if (on) play('click');
}

export function onSoundChange(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    // Bruit blanc de 60 ms, réutilisé pour chaque frappe.
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Enveloppe percussive : montée en 2 ms, extinction exponentielle. */
function envelope(c: AudioContext, peak: number, length: number) {
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + length);
  g.connect(master!);
  return g;
}

function burst(c: AudioContext, freq: number, q: number, peak: number, length: number, rate = 1) {
  const src = c.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = rate;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = freq;
  band.Q.value = q;
  src.connect(band).connect(envelope(c, peak, length));
  src.start();
  src.stop(c.currentTime + length + 0.01);
}

function tone(c: AudioContext, from: number, to: number, peak: number, length: number, type: OscillatorType = 'triangle') {
  const osc = c.createOscillator();
  osc.type = type;
  const t = c.currentTime;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + length * 0.8);
  osc.connect(envelope(c, peak, length));
  osc.start();
  osc.stop(t + length + 0.01);
}

export type Sound = 'click' | 'key' | 'space' | 'enter' | 'delete';

export function play(sound: Sound) {
  if (!enabled || document.hidden) return;
  if (sound !== 'click') {
    // Frappes très rapides (touche maintenue) : un son toutes les 25 ms au plus.
    const now = performance.now();
    if (now - lastKey < 25) return;
    lastKey = now;
  }
  const c = audio();
  if (!c || !noise) return;
  const jitter = 0.9 + Math.random() * 0.2;
  switch (sound) {
    case 'click':
      tone(c, 950, 430, 0.22, 0.07);
      burst(c, 3200, 1.2, 0.07, 0.018);
      break;
    case 'key':
      burst(c, 2900 * jitter, 2.5, 0.16, 0.035, jitter);
      tone(c, 320 * jitter, 180, 0.035, 0.03, 'sine');
      break;
    case 'space':
      burst(c, 1300 * jitter, 1.6, 0.18, 0.05, 0.85);
      tone(c, 190, 120, 0.06, 0.05, 'sine');
      break;
    case 'enter':
      burst(c, 1000, 1.4, 0.2, 0.06, 0.8);
      tone(c, 160, 90, 0.09, 0.08, 'sine');
      break;
    case 'delete':
      burst(c, 4300 * jitter, 3, 0.12, 0.025, 1.15);
      break;
  }
}
