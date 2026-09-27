// sfx.js: Dejting-only sound (Kenney CC0, public/sfx). Logic mode never imports this.
// Rules (SOUND.md): one sound per event, numbered variants at random, pitch-up combos, a visible mute
// remembered in localStorage, default volume 0.4. Browsers block audio until the first gesture: a blocked
// play() is swallowed, because sound is feedback only and every sound has a visual twin.
const BASE = `${import.meta.env.BASE_URL}sfx/`;
const FILES = {
  glitch: ['glitch_001', 'glitch_002'], error: ['error_001', 'error_002'], confirm: ['confirmation_001'],
  chips: ['chips-stack-1', 'chips-stack-2'], grade: ['jingles_HIT00'], click: ['click_001', 'click_002'],
  match: ['jingles_SAX00'], hover: ['rollover2'],
};
const cache = {};
let muted = false;
try { muted = localStorage.getItem('gob-dejting-mute') === '1'; } catch { /* storage blocked: default unmuted */ }
const subs = new Set();
export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('gob-dejting-mute', m ? '1' : '0'); } catch { /* ignore */ }
  subs.forEach((f) => f(m));
}
export const onMute = (f) => { subs.add(f); return () => subs.delete(f); };

const file = (f) => (cache[f] ??= Object.assign(new Audio(`${BASE}${f}.ogg`), { preload: 'auto' }));
Object.values(FILES).flat().forEach(file);

let lastHover = 0;
export function play(name, { rate = 1, vol = 0.4 } = {}) {
  if (muted) return;
  if (name === 'hover') { const now = performance.now(); if (now - lastHover < 80) return; lastHover = now; }
  const list = FILES[name];
  const a = file(list[Math.floor(Math.random() * list.length)]).cloneNode();
  a.volume = vol; a.playbackRate = Math.min(rate, 1.6); a.preservesPitch = false;
  a.play().catch(() => {});
}
// Two sounds as one event (e.g. confirmation then the chips payout).
export const then = (a, b, ms) => { play(a); setTimeout(() => play(b), ms); };
