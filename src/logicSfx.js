// logicSfx.js: Logic mode sound (Tony, 9/30 22:xx PT: "sound first, but subtle. Swiss style, not loud, satisfying").
// Pure WebAudio synth, no files. One family: sine + soft triangle, short, quiet (peaks <= 0.09, under Date's 0.18),
// 300 Hz..4 kHz like synth.js. Pairs mirror: make = up, break = down. The mute is shared with Date (one switch).
// Sound is feedback only: every call site already shows a visual, and a blocked context just stays silent.
import { tone, burst } from './date-beta/synth.js';

const KEY = 'gob-dejting-mute';
const GAP = 40; // ms: the same sound inside this window plays once (a wipe of 10 parts = one trash)

// Each recipe: (ctx, out, t, j) => length in s. j = pitch jitter (about +-3%) so repeats don't grate.
export const RECIPES = {
  // gate placed: a felt "tok" with a tiny tick on top
  place: (c, o, t, j) => { tone(c, o, t, 880 * j, 0.09, 0.05, 'triangle', 700 * j); burst(c, o, t, 2000, 4, 0.03, 0.008); return 0.06; },
  // wire in: a rising fifth, two quick blips
  connect: (c, o, t, j) => { tone(c, o, t, 1320 * j, 0.06, 0.06); tone(c, o, t + 0.03, 1760 * j, 0.06, 0.07); return 0.1; },
  // wire out: the same fifth falling, softer
  disconnect: (c, o, t, j) => { tone(c, o, t, 1760 * j, 0.045, 0.06); tone(c, o, t + 0.03, 1320 * j, 0.045, 0.07); return 0.1; },
  // switch on: a short glide up
  on: (c, o, t, j) => { tone(c, o, t, 660 * j, 0.07, 0.08, 'sine', 990 * j); return 0.08; },
  // switch off: the glide down, softer
  off: (c, o, t, j) => { tone(c, o, t, 990 * j, 0.055, 0.08, 'sine', 660 * j); return 0.08; },
  // part gone: a falling swish into a low tok
  trash: (c, o, t, j) => {
    for (let i = 0; i < 5; i++) burst(c, o, t + i * 0.02, (2500 - i * 450) * j, 3, 0.035, 0.03);
    tone(c, o, t + 0.11, 520 * j, 0.07, 0.06, 'triangle', 400 * j); return 0.17;
  },
  // refused wire: two flat low beeps, "nuh-uh"
  reject: (c, o, t) => { tone(c, o, t, 440, 0.07, 0.05, 'triangle'); tone(c, o, t + 0.07, 440, 0.07, 0.05, 'triangle'); return 0.12; },
};

let ctx = null;
let muted = false;
try { muted = localStorage.getItem(KEY) === '1'; } catch { /* storage blocked: default on */ }
const subs = new Set();
export const isMuted = () => muted;
export const onMute = (f) => { subs.add(f); return () => subs.delete(f); };
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* ignore */ }
  subs.forEach((f) => f(m));
}

// Browsers block audio until a gesture: the context is made inside the first pointerdown / keydown.
function unlock() {
  if (ctx) return;
  try { ctx = new (window.AudioContext || window.webkitAudioContext)(); ctx.resume?.(); } catch { ctx = null; }
}
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { capture: true, once: true });
  window.addEventListener('keydown', unlock, { capture: true, once: true });
}

const last = {};
export function play(id) {
  const r = RECIPES[id];
  if (!r || muted || !ctx) return;
  const now = performance.now();
  if (now - (last[id] ?? -Infinity) < GAP) return;
  last[id] = now;
  try { r(ctx, ctx.destination, ctx.currentTime + 0.005, 0.97 + Math.random() * 0.06); } catch { /* never fatal */ }
}
