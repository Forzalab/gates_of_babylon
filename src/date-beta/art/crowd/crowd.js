// art/crowd/crowd.js: the CROWD layer's data (plain JS, so node --test can check it). Sprint 1001, Tony: "add ppl
// silhouettes with red eyes, a LOT of silhouettes at different depth, from very near bokeh to faraway".
// A beat opts in through pack data: props.crowd = true | { density } (packs/crowd-eyes.json). Beat-local (engine.js
// carried() drops it), so the crowd only stands there while the CROWD speaks.
// Three depth bands, all seeded (mulberry32), no unseeded randomness at render:
//   far  = many small flat heads on a horizon line, dot eyes, low contrast, haze
//   mid  = head + shoulders, scribble-hatched edges, glowing eyes (small glow), a few faint jagged grins
//   near = 2-3 huge out-of-focus heads cut by the frame edges (CSS blur), big ring-detail eyes, strong red bloom
// Keep-outs (stage px, 1920x1080): Nanda's column (x CLEAR), the HUD ribbon (eyes below EYE_TOP) and the dialogue
// box / name tag / choices (eyes above EYE_BOTTOM; the bodies run down BEHIND the box, which is opaque).

export const CLEAR = [700, 1220]; // her column: no mid / near figure's eyes or head inside it
export const FAR_CLEAR = [820, 1100]; // the far row may stand behind her, high over her head (y < 470), never above her face
export const EYE_TOP = 140; // under the love ribbon
export const EYE_BOTTOM = 760; // over the box top (--boxtop ~ 800-823 on a crowd beat)

export function crowdOf(props) {
  const c = props?.crowd;
  if (!c) return null;
  const density = typeof c === 'object' && Number.isFinite(c.density) ? Math.min(1.6, Math.max(0.8, c.density)) : 1;
  return { density, seed: typeof c === 'object' && Number.isInteger(c.seed) ? c.seed : 1001 };
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// x in the left or right wing (never the clear column), spread evenly by slot then jittered
const wingX = (r, i, n, lo, hi, pad, clear = CLEAR) => {
  const left = i % 2 === 0;
  const k = Math.floor(i / 2), m = Math.ceil(n / 2);
  const [a, b] = left ? [lo, clear[0] - pad] : [clear[1] + pad, hi];
  return a + ((k + 0.15 + r() * 0.7) / m) * (b - a);
};

// one figure: head centre (x, y), head radius r. Eyes sit at y + .1r, mouth at y + .62r.
export function buildCrowd({ density = 1, seed = 1001 } = {}) {
  const r = rng(seed);
  const far = [], mid = [], near = [];
  const nFar = Math.round(34 * density);
  for (let i = 0; i < nFar; i++) {
    const hr = 9 + r() * 6;
    far.push({ x: wingX(r, i, nFar, 10, 1910, 14, FAR_CLEAR), y: 385 + r() * 40 + (i % 3) * 16, r: hr, tone: 0.6 + r() * 0.35, blink: r() * 9, dur: 6 + r() * 6 });
  }
  far.sort((a, b) => a.y - b.y);
  const nMid = Math.round(14 * density);
  for (let i = 0; i < nMid; i++) {
    const hr = 30 + r() * 26;
    mid.push({ x: wingX(r, i, nMid, -20, 1940, hr * 1.4), y: 330 + r() * 280, r: hr, grin: r() < 0.28, blink: r() * 9, dur: 5 + r() * 5, look: r() < 0.5 ? 1 : -1, sway: r() * 6 });
  }
  mid.sort((a, b) => a.r - b.r); // smaller (further) first
  near.push({ x: 90, y: 330, r: 215, grin: true, look: 1, blink: 1.3, dur: 8 });
  near.push({ x: 1850, y: 250, r: 190, grin: false, look: -1, blink: 4.1, dur: 9.5 });
  if (density > 1.15) near.push({ x: 1560, y: 610, r: 120, grin: true, look: -1, blink: 6.7, dur: 7 });
  for (const f of [...far, ...mid, ...near]) {
    f.x = Math.round(f.x); f.y = Math.round(f.y); f.r = Math.round(f.r * 10) / 10;
    // the eyes stay out of the clear column, under the ribbon and over the box
    const ey = f.y + f.r * 0.1;
    f.y = Math.round(Math.min(Math.max(ey, EYE_TOP), EYE_BOTTOM) - f.r * 0.1);
  }
  return { far, mid, near, count: far.length + mid.length + near.length };
}

// head + shoulders silhouette, head centre (x, y), head radius r, the body runs down to `base`
export function personPath(x, y, r, base = y + r * 9) {
  const f = (n) => Math.round(n * 10) / 10;
  return `M${f(x - 3.4 * r)} ${f(base)}C${f(x - 3.3 * r)} ${f(y + 2.4 * r)} ${f(x - 2.2 * r)} ${f(y + 1.9 * r)} ${f(x - 0.7 * r)} ${f(y + 1.6 * r)}` +
    `L${f(x - 0.55 * r)} ${f(y + r)}A${f(r)} ${f(1.15 * r)} 0 1 1 ${f(x + 0.55 * r)} ${f(y + r)}L${f(x + 0.7 * r)} ${f(y + 1.6 * r)}` +
    `C${f(x + 2.2 * r)} ${f(y + 1.9 * r)} ${f(x + 3.3 * r)} ${f(y + 2.4 * r)} ${f(x + 3.4 * r)} ${f(base)}Z`;
}

// a faint jagged grin under the eyes: a crescent with a zigzag of teeth along it
export function grinPath(x, y, r) {
  const f = (n) => Math.round(n * 10) / 10;
  const w = 0.5 * r, my = y + 0.62 * r, n = 7;
  let teeth = '';
  for (let i = 0; i <= n; i++) teeth += `${i ? 'L' : 'M'}${f(x - w + (2 * w * i) / n)} ${f(my + (i % 2 ? 0.16 * r : 0.02 * r) + Math.sin((i / n) * Math.PI) * 0.12 * r)}`;
  return { mouth: `M${f(x - w)} ${f(my)}Q${f(x)} ${f(my + 0.5 * r)} ${f(x + w)} ${f(my)}Q${f(x)} ${f(my + 0.16 * r)} ${f(x - w)} ${f(my)}Z`, teeth };
}
