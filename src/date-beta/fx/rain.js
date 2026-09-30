// fx/rain.js: the pure half of the rain overlay (RainOverlay.jsx draws it). No DOM, no React: node tests import it.
// A beat is rainy when props.rain names a level, else when its bg is an outdoor rain bg (RAIN_BG); props.rain
// 'off' | 'none' | false turns it off. Level -> SPEC: streak count / length / opacity, glass drops, wet-GUI marks.
// Motion rule: the streak + glass layers are 2-3 static frames swapped every FRAME_MS (>= 500 ms, <= 3 Hz);
// reduced motion = frame 0 only. Tints follow the bg's time-of-day grade (cel-over-vtrace rule 4).
import { rng } from '../art/util.js';

export const LEVELS = ['heavy', 'medium', 'drizzle', 'stopping'];
export const FRAME_MS = 625; // 5 ticks of the shared 125 ms clock

// outdoor rain bgs (r3-rain + r3-station ids, and the older rain beats that still play the 'rain' sfx outdoors)
export const RAIN_BG = {
  'crossing-night': 'heavy', 'rain-sidewalk': 'heavy', 'rain-alley': 'medium', 'rain-puddle': 'medium', 'rain-eave': 'medium', 'rain-ending': 'stopping',
  'platform-rain': 'heavy', platform: 'medium', 'escape-night': 'drizzle', 'apartment-trace': 'drizzle',
};

// time-of-day tint per bg: streak ink, glass rim, cel grade (colour + opacity laid over the umbrella cel)
const TOD_OF = { 'rain-ending': 'overcast', 'escape-night': 'night', 'apartment-trace': 'night' };
export const TINT = {
  'rain-dusk': { streak: '#dbe6ff', rim: '#1b2438', grade: '#2a3246', gradeO: 0.2 },
  overcast: { streak: '#eef3f8', rim: '#2a3844', grade: '#5f7280', gradeO: 0.12 },
  night: { streak: '#c9d4ff', rim: '#070b1c', grade: '#0d1433', gradeO: 0.3 },
};
export const tintOf = (bg) => TINT[TOD_OF[bg] ?? 'rain-dusk'];

// wet = 0..1 scale for the GUI marks; frames = how many static frames the layers swap between
export const SPEC = {
  heavy: { streaks: 170, len: [60, 170], op: [0.28, 0.75], near: 6, drops: 44, trails: 6, wet: 1, frames: 3 },
  medium: { streaks: 110, len: [50, 130], op: [0.22, 0.6], near: 3, drops: 30, trails: 3, wet: 0.7, frames: 3 },
  drizzle: { streaks: 55, len: [24, 70], op: [0.18, 0.45], near: 0, drops: 12, trails: 1, wet: 0.4, frames: 2 },
  stopping: { streaks: 18, len: [20, 50], op: [0.14, 0.32], near: 0, drops: 16, trails: 2, wet: 0.25, frames: 2 },
};

export function rainOf(beat) {
  const v = beat?.props?.rain;
  if (v === false || v === 'off' || v === 'none') return null;
  if (LEVELS.includes(v)) return v;
  return RAIN_BG[beat?.bg] ?? null;
}

// frame count for a level: reduced motion always holds one still frame
export const framesOf = (level, rm) => (!level ? 0 : rm ? 1 : SPEC[level].frames);

export const SLANT = -0.16; // dx per unit fall: the ref-01 lean (top right -> bottom left)

// seeded streak set for one frame: [x, y, len, opacity, width]
export function streaksFor(level, frame) {
  const s = SPEC[level];
  const r = rng(101 + frame * 977 + LEVELS.indexOf(level) * 31);
  const out = [];
  for (let i = 0; i < s.streaks; i++) {
    const len = s.len[0] + r() * (s.len[1] - s.len[0]);
    out.push([r() * 2040 - 20, r() * 1180 - 120, len, s.op[0] + r() * (s.op[1] - s.op[0]), 1.6 + r() * 1.6]);
  }
  // near, out-of-focus streaks: wide, soft, faint (ref 01's blurred ones)
  for (let i = 0; i < s.near; i++) out.push([100 + r() * 1720, r() * 700 - 80, 240 + r() * 200, 0.16 + r() * 0.1, 12 + r() * 8, 1]);
  return out;
}

// glass drops for one frame: [x, y, r, stretch]; trails: [x, y0, y1, seed]. Frame k keeps ~80% of frame 0 (new beads
// land, a few run), so the swap reads as rain on the lens, not a flicker.
export function glassFor(level, frame) {
  const s = SPEC[level];
  const drop = (r) => [r() * 1920, r() * 1080, 5 + r() ** 1.7 * 26, 1 + r() * 0.35];
  const base = rng(7 + LEVELS.indexOf(level));
  const fresh = rng(500 + frame * 131 + LEVELS.indexOf(level));
  const drops = Array.from({ length: s.drops }, () => drop(base))
    .map((d, i) => (frame && i % 5 === frame ? drop(fresh) : d));
  const tr = rng(900 + LEVELS.indexOf(level));
  const trails = Array.from({ length: s.trails }, (_, i) => {
    const x = 60 + tr() * 1800, y0 = tr() * 500, len = 180 + tr() * 360;
    return [x, y0, y0 + len + 40 * ((frame + i) % 2) * (frame ? 1 : 0), 13 + i];
  });
  return { drops, trails };
}

// ---- wet GUI: marks placed on measured stage rects ({ x, y, w, h } in 1920x1080 stage px).
// gui = { say?, hud?, choices?: [rect], avoid: [rect] } where avoid = every text / chip / tag rect: no mark may touch one
// (readable text is sacred). Marks: blotch (a darker wet spot on the panel), bead (a drop sitting on a top edge),
// pool (a flat pool along the box's bottom edge, one drop hanging), drip (a drop hanging off the ribbon's lower edge).
const hit = (a, b, pad = 10) => a.x < b.x + b.w + pad && a.x + a.w > b.x - pad && a.y < b.y + b.h + pad && a.y + a.h > b.y - pad;
// a drip / pool hangs below its edge (the drop under it included); the rest are ellipses
const boxOf = (m) => (m.kind === 'drip' ? { x: m.x - m.rx, y: m.y, w: m.rx * 2, h: m.ry * 3 }
  : { x: m.x - m.rx, y: m.y - m.ry, w: m.rx * 2, h: m.ry * 2 + (m.kind === 'pool' ? 30 : 0) });
export const touchesText = (m, avoid) => avoid.some((a) => hit(boxOf(m), a));

export function wetMarks(gui, level, seed = 1) {
  if (!level) return [];
  const w = SPEC[level].wet, avoid = gui.avoid ?? [], r = rng(4242 + seed), out = [];
  const put = (m) => { if (!touchesText(m, avoid)) { out.push(m); return true; } return false; };
  const scatter = (b, n, size, tries = 40) => {
    for (let k = 0, t = 0; k < n && t < tries; t++) {
      const rx = size * (0.6 + r() * 0.8);
      if (put({ kind: 'blotch', x: b.x + rx + r() * (b.w - 2 * rx), y: b.y + rx + r() * (b.h - 2 * rx), rx, ry: rx * (0.62 + r() * 0.3) })) k++;
    }
  };
  const beads = (b, n, size) => {
    for (let k = 0, t = 0; k < n && t < 30; t++) {
      const rx = size * (0.7 + r() * 0.6);
      if (put({ kind: 'bead', x: b.x + 30 + r() * (b.w - 60), y: b.y - rx * 0.35, rx, ry: rx * 0.72 })) k++;
    }
  };
  if (gui.say) {
    const b = gui.say;
    beads(b, Math.round(1 + 6 * w), 11);
    scatter(b, Math.round(8 * w), 26);
    for (const fx of [0.74, 0.3]) if (put({ kind: 'pool', x: b.x + b.w * fx, y: b.y + b.h, rx: 30 + 70 * w, ry: 5 + 5 * w })) break;
  }
  if (gui.hud) {
    const b = gui.hud;
    for (let k = 0, t = 0, n = Math.round(1 + 5 * w); k < n && t < 30; t++) {
      if (put({ kind: 'drip', x: b.x + 150 + r() * (b.w - 220), y: b.y + b.h, rx: 5 + r() * 3, ry: 7 + r() * 5 })) k++;
    }
  }
  for (const b of gui.choices ?? []) {
    scatter(b, Math.round(3 * w), 20, 24);
    if (w >= 0.4) beads(b, 1, 10);
  }
  return out;
}
