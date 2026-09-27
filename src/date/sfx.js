// sfx.js: Dejting-only sound (Kenney CC0, public/sfx). No library. Locked until the first gesture (autoplay policy),
// muted state remembered per viewer. Sound is feedback only: every sound has a visual twin.
const BASE = import.meta.env.BASE_URL + 'sfx/';
const SETS = {
  hover: ['rollover1'], click: ['click_001'], chat: ['select_001', 'select_002', 'tick_001', 'tick_002'],
  slide: ['card-slide-1', 'card-slide-2'], pluck: ['pluck_001'], error: ['error_001'], hurt: ['phaserDown1'],
  confirm: ['confirmation_001'], match: ['jingles_PIZZI00'], streak: ['powerUp1'],
};
const cache = {};
let unlocked = false, last = {};
let muted = (() => { try { return localStorage.getItem('dejting-mute') === '1'; } catch { return false; } })();
const unlock = () => { unlocked = true; };
addEventListener('pointerdown', unlock, { once: true, capture: true });
addEventListener('keydown', unlock, { once: true, capture: true });

export const isMuted = () => muted;
export function setMuted(m) { muted = m; try { localStorage.setItem('dejting-mute', m ? '1' : '0'); } catch { /* private mode */ } }

export function play(name, { rate = 1, vol = .4, gap = 80 } = {}) {
  if (muted || !unlocked || !SETS[name]) return;
  const now = performance.now();
  if (now - (last[name] ?? -1e9) < gap) return; // debounce: one sound per event
  last[name] = now;
  const pick = SETS[name][Math.floor(Math.random() * SETS[name].length)];
  const src = (cache[pick] ??= new Audio(BASE + pick + '.ogg'));
  const a = src.cloneNode();
  a.volume = vol; a.preservesPitch = false; a.playbackRate = Math.min(1.6, rate);
  a.play().catch(() => {});
}
