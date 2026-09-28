// sfx.js: Dejting-only sound (Kenney CC0, public/sfx). Logic mode never imports this.
// Rules (scratchpad/assets/SOUND.md): unlock on the first gesture, one sound per event, numbered variants picked at
// random, hover debounce, a visible mute remembered in localStorage, default volume 0.4. Sound is never information.
const BASE = import.meta.env.BASE_URL + 'sfx/';
const FAMILIES = {
  tick: ['tick_001', 'tick_002'],
  select: ['select_001', 'select_002', 'select_003'],
  confirm: ['confirmation_001', 'confirmation_002'],
  creep: ['spaceTrash1'],
  back: ['back_001'],
  sax: ['jingles_SAX04'],
  toggle: ['switch1'],
  boom: ['vine-boom.mp3'], // h2 K1 payoff (freesound BY-NC, credited on the page + CREDITS.md)
};
const KEY = 'gob.date.mute';
let muted = (() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } })();
let unlocked = false;
const last = {};
const subs = new Set();

let ctx = null;
const buf = {}; // decoded WebAudio buffers (fetch + decode: no media-element range requests, exact pitch control)
function load(f) {
  return (buf[f] ??= fetch(BASE + f + (f.includes('.') ? '' : '.ogg')).then((r) => r.arrayBuffer()).then((b) => ctx.decodeAudioData(b)).catch(() => null));
}
function unlock() {
  unlocked = true;
  try { ctx = new AudioContext(); Object.values(FAMILIES).flat().forEach(load); } catch { ctx = null; } removeEventListener('pointerdown', unlock, true); removeEventListener('keydown', unlock, true); }
// h2: after ENTER (a same-origin click) Chrome lets a fresh page start audio without a new gesture. Try it; if the
// context comes up 'running', unlock now so the K1 boom can land even if the viewer never touches the player.
export function tryUnlock() {
  if (unlocked) return;
  try { const c = new AudioContext(); if (c.state === 'running') { ctx = c; unlocked = true; Object.values(FAMILIES).flat().forEach(load); } else c.close(); } catch { /* no audio */ }
}
addEventListener('pointerdown', unlock, true);
addEventListener('keydown', unlock, true);

export function play(name, { rate = 1, vol = 0.4, gap = 80 } = {}) {
  if (muted || !unlocked) return;
  const now = performance.now();
  if (now - (last[name] ?? -1e9) < gap) return; // debounce: at most one per event burst
  last[name] = now;
  const list = FAMILIES[name]; if (!list) return;
  const f = list[Math.floor(Math.random() * list.length)];
  if (!ctx) return;
  load(f).then((b) => {
    if (!b || muted) return;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.playbackRate.value = Math.min(rate, 1.6); g.gain.value = vol;
    src.connect(g).connect(ctx.destination); src.start();
  });
}
export const isMuted = () => muted;
export function setMuted(m) { muted = m; try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* private mode */ } subs.forEach((f) => f(m)); }
export function onMute(f) { subs.add(f); return () => subs.delete(f); }
