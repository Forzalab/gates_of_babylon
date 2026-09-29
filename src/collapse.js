// collapse.js: the Figur wordmark 4th-wall "house of cards" (spec: brain date-beta-START-COLLAPSE.md, LOCKED v1).
// The ONLY way from Logic into Date: click / Enter / Space on h1.wordmark. The Logic page itself breaks in held frames
// (500 ms each, never under 334 ms = at most 3 changes per second), transitions and animations forced off, then a hard
// cut into date-beta.html, which starts at scene 1 (the rooftop) exactly as if START had been pressed there.
//   f1 tilt    panels rotate a few degrees, each a different way
//   f2 slip    panels drop and slide, overlapping
//   f3 fall    the page is cut into 4x4 tiles that land in a house-of-cards pile (the void shows behind)
//   f4 glitch  the top card falls flat; 3 tiles swap palette at similar luminance (3/16 < 25% of the viewport)
//   f5 void    black, silence. The wordmark falls with the rest (Tony, 9/29 18:05: no lone survivor).
// Reduced motion: the same frames, because every frame is already a hard cut for everyone (no tween, no animation).
// Esc skips straight to Date at any frame. Pure timeline data lives in collapseFrames.js (node --test).
import manifest from './date-beta/assets.json';
import { createLoader } from './date-beta/assets.js';
import { timeline, FRAMES, PILE, PILE_F4, GLITCH_TILES } from './collapseFrames.js';

export const DATE_URL = 'date-beta.html';

// Only the collapse cues' own files are fetched from Logic (the rest of the Date manifest is not its business).
const CUE_IDS = FRAMES.map((f) => manifest.cues[f.cue]).filter(Boolean);
const SFX_MANIFEST = { cues: manifest.cues, assets: Object.fromEntries(CUE_IDS.filter((id) => manifest.assets[id]).map((id) => [id, manifest.assets[id]])) };

let running = false;
let cancel = null;

// Back button from Date: a bfcache restore would show the frozen void. Put the page back as it was.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  cancel?.();
  const html = document.documentElement;
  for (const k of ['collapse', 'frame']) delete html.dataset[k];
  document.querySelector('.cx-pile')?.remove();
  running = false;
});

export function collapse({ base = import.meta.env.BASE_URL } = {}) {
  if (running) return;
  running = true;
  const html = document.documentElement;
  const sfx = createLoader(SFX_MANIFEST, base);
  sfx.unlock(); // inside the click / key gesture, so the context may start
  sfx.preload();
  const go = () => { clearTimers(); location.href = `${base}${DATE_URL}`; };
  const timers = [];
  const clearTimers = () => { for (const t of timers) clearTimeout(t); removeEventListener('keydown', onKey, true); };
  // Esc = skip to Date. Other plain keys are held off the dead page (no Backspace deleting a part mid-fall); browser
  // shortcuts (Ctrl / Cmd / Alt) still work, so nothing is really broken.
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); go(); } else if (!e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); e.stopPropagation(); }
  };
  addEventListener('keydown', onKey, true);
  cancel = clearTimers;
  html.dataset.collapse = '';
  document.activeElement?.blur?.();
  let pile = null;
  for (const step of timeline()) {
    timers.push(setTimeout(() => {
      if (step.go) { go(); return; }
      if (step.frame === 'f3' && !pile) pile = buildPile();
      if (step.frame === 'f4' && pile) settlePile(pile, PILE_F4, true);
      html.dataset.frame = step.frame;
      if (step.cue) { sfx.play(step.cue); navigator.vibrate?.(step.frame === 'f5' ? 0 : 40); }
    }, step.at));
  }
}

// Slice the (already slipped) page into 16 static clones, each clipped to its tile, and drop them on the pile.
function buildPile() {
  const root = document.getElementById('root');
  const W = innerWidth, H = innerHeight, tw = W / 4, th = H / 4;
  const layer = document.createElement('div');
  layer.className = 'cx-pile';
  layer.setAttribute('aria-hidden', 'true');
  const tiles = [];
  for (let i = 0; i < 16; i++) {
    const x = (i % 4) * tw, y = Math.floor(i / 4) * th;
    const tile = document.createElement('div');
    tile.className = 'cx-tile';
    Object.assign(tile.style, { left: `${x}px`, top: `${y}px`, width: `${tw}px`, height: `${th}px` });
    const inner = document.createElement('div');
    inner.className = 'cx-inner';
    Object.assign(inner.style, { left: `${-x}px`, top: `${-y}px`, width: `${W}px`, height: `${H}px` });
    inner.append(root.cloneNode(true));
    tile.append(inner);
    layer.append(tile);
    tiles.push({ tile, x, y });
  }
  document.body.append(layer);
  const pile = { tiles, tw, th, H };
  settlePile(pile, PILE, false);
  return pile;
}

function settlePile({ tiles, tw, th, H }, poses, glitch) {
  for (const [i, [px, lift, r]] of Object.entries(poses)) {
    const t = tiles[i];
    const dx = px * tw - t.x, dy = H - lift * th - t.y;
    t.tile.style.transform = `translate(${dx}px, ${dy}px) rotate(${r}deg)`;
  }
  if (glitch) for (const i of GLITCH_TILES) tiles[i].tile.classList.add('cx-glitch');
}

// Wordmark wiring for App.jsx: click, or Enter / Space while focused.
export const wordmarkProps = {
  tabIndex: 0,
  onClick: () => collapse(),
  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); collapse(); } },
};
