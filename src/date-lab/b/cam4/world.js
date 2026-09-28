// cam-4 worlds (pure): the outdoor walkway to her door, and her genkan + hallway. Metres; see shared/persp.js.
// Palette sampled from main's Stairs/Genkan scenes so the 3D shots cut with the 2D ones.
import { quadX, quadY, quadZ } from '../shared/persp.js';
import { rng } from '../../../date-beta/art/util.js';

// ---------- the 4th-floor walkway (ref 16): rail + night city on the left, steel doors on the right, hers at the end ----------
export const WALK = { len: 16, halfW: 1.0, ceil: 2.6, door: { x0: -0.5, x1: 0.5, y1: 2.1 } };

export function walkway({ open = false } = {}) {
  const F = [], { len, halfW: w, ceil: c } = WALK;
  const r = rng(7);
  // city backdrop far left (lit windows ignore fog)
  F.push({ pts: quadX(-60, -30, 40, -40, 80), fill: '#0d1020', fogK: 0, depthBias: 300 });
  for (let i = 0; i < 26; i++) {
    const z0 = -30 + i * 4.4, h = 6 + r() * 26;
    F.push({ pts: quadX(-48 + r() * 6, -30, h, z0, z0 + 3.6), fill: '#1c2544', fogK: 0.1, depthBias: 200 });
    for (let k = 0; k < 12; k++) if (r() < 0.6) {
      const y = -8 + r() * (h + 6), z = z0 + 0.3 + r() * 2.6;
      F.push({ pts: quadX(-47, y, y + 1.2, z, z + 0.8), fill: ['#ffd27a', '#8fd0ff', '#ff9ad0'][k % 3], lit: true, depthBias: 199, opacity: 0.8 });
    }
  }
  // the Figur clock tower across the tracks: stuck at 12:00 (the script's clock gun), lit, far away
  F.push({ pts: quadX(-40, -30, 18, 22, 30), fill: '#262e4c', fogK: 0.1, depthBias: 150 });
  const face = [];
  for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2; face.push([-39.9, 12 + Math.sin(a) * 3.2, 26 + Math.cos(a) * 3.2]); }
  F.push({ pts: face, fill: '#fff4dc', lit: true, depthBias: 149 });
  F.push({ pts: quadX(-39.8, 12, 14.6, 25.85, 26.15), fill: '#2b2440', lit: true, depthBias: 148 });
  F.push({ pts: quadX(-39.8, 12, 13.9, 25.8, 26.2), fill: '#2b2440', lit: true, depthBias: 147 });
  for (let z = -4; z < len; z += 1) {
    const shade = z % 2 ? '#5e6270' : '#595d6b';
    F.push({ pts: quadY(0, -w, w, z, z + 1), fill: shade });                        // floor
    F.push({ pts: quadY(c, -w - 0.4, w, z, z + 1), fill: '#4a4d56' });              // ceiling slab
    F.push({ pts: quadX(w, 0, c, z, z + 1), fill: '#8e8a80' });                     // right wall
    F.push({ pts: quadX(w - 0.01, 0, 0.12, z, z + 1), fill: '#6d6a62', depthBias: -0.01 }); // baseboard
    F.push({ pts: quadX(-w, 0, 0.5, z, z + 1), fill: '#7b776e' });                   // parapet
    F.push({ pts: [[-w, 0.5, z], [-w + 0.12, 0.5, z], [-w + 0.12, 0.5, z + 1], [-w, 0.5, z + 1]], fill: '#9a968c' });
    F.push({ pts: quadY(1.1, -w - 0.03, -w + 0.05, z, z + 1), fill: '#aab3c6', depthBias: -0.02 }); // hand rail
    for (let k = 0; k < 4; k++) {
      const zz = z + k * 0.25;
      F.push({ pts: quadX(-w + 0.01, 0.5, 1.1, zz, zz + 0.03), fill: '#8a93a6', depthBias: -0.03 });
    }
    // wet floor sheen
    if (z % 2 === 0) F.push({ pts: quadY(0.001, -0.5, 0.3, z + 0.2, z + 0.7), fill: '#7f89a8', opacity: 0.25, depthBias: -0.01 });
  }
  // neighbours' steel doors + nameplates
  for (const z of [2.2, 6.2, 10.2]) {
    F.push({ pts: quadX(w - 0.02, 0, 2.05, z, z + 0.95), fill: '#3a3d4a', depthBias: -0.02 });
    F.push({ pts: quadX(w - 0.03, 0.95, 1.05, z + 0.08, z + 0.14), fill: '#c9c2b8', depthBias: -0.03 });
    F.push({ pts: quadX(w - 0.03, 1.5, 1.62, z + 1.05, z + 1.35), fill: '#d8d2c4', depthBias: -0.03 });
  }
  // fluorescent tubes + their light pools
  for (const z of [1.5, 5.5, 9.5, 13.5]) {
    F.push({ pts: quadY(c - 0.01, -0.25, 0.25, z, z + 0.7), fill: '#f2fbf6', lit: true, depthBias: -0.02 });
    F.push({ pts: quadY(0.002, -0.9, 0.9, z - 0.8, z + 1.5), fill: '#fff4d0', opacity: 0.1, lit: true, depthBias: -0.02 });
  }
  // end wall + HER door (lit by its own lamp: no fog)
  F.push({ pts: quadZ(len, -w, w, 0, c), fill: '#8e8a80', fogK: 0.55 });
  const d = WALK.door;
  F.push({ pts: quadZ(len - 0.01, d.x0 - 0.08, d.x1 + 0.08, 0, d.y1 + 0.08), fill: '#6b5a55', lit: true, depthBias: -0.01 });
  F.push({ pts: quadZ(len - 0.02, d.x0, d.x1, 0, d.y1), fill: open ? '#ffcf7a' : '#5a4a46', lit: true, depthBias: -0.02, id: 'door' });
  if (!open) {
    F.push({ pts: quadZ(len - 0.03, d.x1 - 0.14, d.x1 - 0.1, 0.9, 1.3), fill: '#c9c2b8', lit: true, depthBias: -0.03 });
    F.push({ pts: quadZ(len - 0.03, -0.18, 0.18, 1.5, 1.56), fill: '#3c302d', lit: true, depthBias: -0.03 });
  } else {
    F.push({ pts: quadY(0.003, d.x0, d.x1 + 0.6, len - 2.2, len - 0.02), fill: '#ffcf7a', opacity: 0.35, lit: true, depthBias: -0.5 });
  }
  F.push({ pts: quadZ(len - 0.01, 0.62, 0.92, 1.45, 1.62), fill: '#eee8dc', lit: true, depthBias: -0.02, id: 'plate' });
  F.push({ pts: quadZ(len - 0.01, -0.12, 0.12, 2.22, 2.3), fill: '#fff4d0', lit: true, depthBias: -0.02 });
  return F;
}

// ---------- her genkan (ref 27): stone tataki, the raised step, a hallway to a dark doorway. She stands in it. ----------
export const GENKAN = { step: 1.2, stepH: 0.2, halfW: 0.6, end: 6.0, ceil: 2.4, slippers: 1.5, her: 6.35 };

export function genkan() {
  const F = [], { step: s, stepH: h, halfW: w, end: e, ceil: c } = GENKAN;
  // front door frame (the camera starts inside it and pulls back through it): wall at z=0 with an opening
  F.push({ pts: quadZ(0, -3, -0.46, -1, 3), fill: '#2a2530' });
  F.push({ pts: quadZ(0, 0.46, 3, -1, 3), fill: '#2a2530' });
  F.push({ pts: quadZ(0, -0.46, 0.46, 2.05, 3), fill: '#2a2530' });
  // tataki (stone), tape line, her shoes lined to the millimetre
  for (let z = 0; z < s; z += 0.3) F.push({ pts: quadY(0, -w, w, z, z + 0.3), fill: z % 0.6 < 0.3 ? '#7e7c78' : '#76746f' });
  F.push({ pts: quadY(0.002, -w + 0.05, w - 0.05, 0.92, 0.94), fill: '#e9e1a6', depthBias: -0.01 });
  for (let i = 0; i < 4; i++) {
    const x = -0.52 + i * 0.27, col = ['#1d1a24', '#a8123e', '#f4efe4', '#3a5a8a'][i];
    for (const dx of [0, 0.11]) F.push({ pts: quadY(0.004, x + dx, x + dx + 0.09, 0.62, 0.9), fill: col, depthBias: -0.02 });
  }
  // walls, step face, wood floor, ceiling
  F.push({ pts: quadX(-w, 0, c, 0, s), fill: '#e8dcc6' });
  F.push({ pts: quadX(w, 0, c, 0, s), fill: '#e2d5bd' });
  F.push({ pts: quadZ(s, -w, w, 0, h), fill: '#8a5f36' });
  for (let z = s; z < e; z += 0.4) {
    F.push({ pts: quadY(h, -w, w, z, z + 0.4), fill: (z - s) % 0.8 < 0.4 ? '#b98a5a' : '#b1834f' });
    F.push({ pts: quadX(-w, h, c, z, z + 0.4), fill: '#e8dcc6' });
    F.push({ pts: quadX(w, h, c, z, z + 0.4), fill: '#e2d5bd' });
    F.push({ pts: quadY(c, -w, w, z, z + 0.4), fill: '#d8ccb6' });
  }
  F.push({ pts: quadY(c, -w, w, 0, s), fill: '#d8ccb6' });
  F.push({ pts: quadY(c - 0.01, -0.15, 0.15, 0.5, 0.8), fill: '#fff6dc', lit: true, depthBias: -0.02 });
  // shoe cabinet on the right + the tiny shrine on it
  F.push({ pts: quadX(w - 0.25, 0, 0.9, 0.15, 1.1), fill: '#d8c4a0', depthBias: -0.05 });
  F.push({ pts: quadY(0.9, w - 0.25, w, 0.15, 1.1), fill: '#e6d4b0', depthBias: -0.05 });
  F.push({ pts: quadZ(0.15, w - 0.25, w, 0, 0.9), fill: '#cbb690', depthBias: -0.06 });
  F.push({ pts: quadZ(0.7, w - 0.22, w - 0.04, 0.9, 1.12), fill: '#c79d6b', depthBias: -0.08 });
  F.push({ pts: quadZ(0.69, w - 0.2, w - 0.06, 0.93, 1.08), fill: '#fbf4e6', depthBias: -0.09, id: 'shrine' });
  // the end: a dark doorway; the room beyond has a low red-pink light
  F.push({ pts: quadZ(e, -w, -0.42, h, c), fill: '#e0d3ba' });
  F.push({ pts: quadZ(e, 0.42, w, h, c), fill: '#e0d3ba' });
  F.push({ pts: quadZ(e, -0.42, 0.42, 2.15, c), fill: '#e0d3ba' });
  F.push({ pts: quadZ(e + 2.5, -1.5, 1.5, 0, 3), fill: '#3a0c1c', lit: true });
  F.push({ pts: quadY(h, -1.5, 1.5, e, e + 2.5), fill: '#240812', lit: true });
  // the men's slippers, toes toward the door (toward you)
  const S = GENKAN.slippers;
  for (const x0 of [-0.13, 0.02]) {
    const sole = [];
    for (let k = 0; k <= 8; k++) { const a = Math.PI * (k / 8); sole.push([x0 + 0.055 - Math.cos(a) * 0.055, h + 0.012, S - 0.12 - Math.sin(a) * 0.04]); }
    sole.push([x0 + 0.11, h + 0.012, S + 0.14], [x0, h + 0.012, S + 0.14]);
    F.push({ pts: sole, fill: '#7d8fb3', lit: true, depthBias: -0.3, id: 'slipper' });
    F.push({ pts: [[x0 - 0.004, h + 0.014, S - 0.15], [x0 + 0.114, h + 0.014, S - 0.15], [x0 + 0.114, h + 0.07, S + 0.01], [x0 - 0.004, h + 0.07, S + 0.01]], fill: '#33466a', lit: true, depthBias: -0.35 });
    F.push({ pts: [[x0 - 0.004, h + 0.07, S + 0.01], [x0 + 0.114, h + 0.07, S + 0.01], [x0 + 0.114, h + 0.072, S + 0.03], [x0 - 0.004, h + 0.072, S + 0.03]], fill: '#e8e4dc', lit: true, depthBias: -0.36 });
  }
  return F;
}
