// sfx.js: Dejting-only sound (Logic mode stays silent). Kenney CC0 files in public/sfx (see CREDITS.md).
// WebAudio buffers, unlocked on the first pointerdown/keydown (autoplay policy). Mute lives in localStorage.
// Sound is feedback, never information: every call site also shows a visual.
import { useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL + 'sfx/';
const FILES = {
  pick: ['card-slide-1'],
  land: ['chip-lay-1', 'chip-lay-2'],
  merge: ['pluck_001', 'pluck_002'],
  chips: ['chips-collide-1'],
  stack: ['chips-stack-1'],
  power: ['powerUp2', 'powerUp8'],
  error: ['error_004'],
  trombone: ['sad-trombone.wav'],
  phaser: ['phaserDown1'],
  barcode: ['barcode.wav'],
  bagvoice: ['unexpected-bagging.mp3'],
  print: ['card-shuffle'],
  match: ['confirmation_002'],
  sax: ['jingles_SAX03'],
  nes: ['jingles_NES03'],
  click: ['click_002'],
  open: ['maximize_003'],
  // ONE announcer (Kenney Voiceover, female), big events only.
  ready: ['ready'], go: ['go'], levelup: ['level_up'], highscore: ['new_highscore'], hurry: ['hurry_up'],
};
const VOL = 0.4;
let ctx = null, gain = null, unlocked = false, loadedP = null, loadedResolve;
const loadedWait = new Promise((r) => { loadedResolve = r; });
const buffers = {};
const listeners = new Set();
let muted = (() => { try { return localStorage.getItem('gob.mute') === '1'; } catch { return false; } })();

export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('gob.mute', m ? '1' : '0'); } catch { /* private mode */ }
  if (gain) gain.gain.value = m ? 0 : VOL;
  listeners.forEach((f) => f(m));
}

async function load(name) {
  try {
    const res = await fetch(BASE + (name.includes('.') ? name : name + '.ogg'));
    buffers[name] = await ctx.decodeAudioData(await res.arrayBuffer());
  } catch { /* a missing sound is never fatal */ }
}
function unlock() {
  if (unlocked) return;
  unlocked = true;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    gain = ctx.createGain(); gain.gain.value = muted ? 0 : VOL; gain.connect(ctx.destination);
    ctx.resume?.();
    loadedP = Promise.all(Object.values(FILES).flat().map(load)).then(loadedResolve);
  } catch { ctx = null; }
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { once: true, capture: true });
  window.addEventListener('keydown', unlock, { once: true, capture: true });
}

// Resolves once the buffers are decoded (after the first gesture).
export const loaded = () => loadedWait;

// play('merge', { rate: 1.16 }): picks a random numbered variant so repeats don't grate.
export function play(kind, { rate = 1, vol = 1, delay = 0 } = {}) {
  if (!ctx || muted) return;
  const list = FILES[kind];
  const name = list?.[Math.floor(Math.random() * list.length)];
  const buf = buffers[name];
  if (!buf) return;
  try {
    const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
    const g = ctx.createGain(); g.gain.value = vol; src.connect(g); g.connect(gain);
    src.start(ctx.currentTime + delay / 1000);
  } catch { /* ignore */ }
}
// Rule 7: the core dopamine trick. The same merge sound pitched up per combo step, capped at 1.6.
export const comboRate = (combo) => Math.min(1.6, 1 + 0.08 * combo);

export function useMute() {
  const [m, set] = useState(muted);
  useEffect(() => { listeners.add(set); return () => listeners.delete(set); }, []);
  return [m, () => { setMuted(!muted); if (!muted) play('click'); }];
}
