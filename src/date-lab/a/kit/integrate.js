// Nanda integration maths (pure, node-tested). Each scene gets a LIGHT RIG measured from main's art: ambient colour, key light
// colour + direction, where the floor is, and a reference object for scale. From that we DERIVE (not hand-pick) her grade:
// every sprite role colour is multiplied toward the scene's ambient, then lifted by the key light, so she sits in the same light.
export const RAW = { // main's Kawaii role tokens (mockups A/theme.css), the un-integrated sprite
  hair: '#e9ebf6', hair2: '#aeb3d3', skin: '#ffece3', skin2: '#f7cdc0', cloth: '#ffffff', cloth2: '#cfc7ff', collar: '#8a7ff0',
  ribbon: '#ff5fa2', iris: '#d6337f', white: '#ffffff', blush: '#ff8fb8', mouth: '#c93d64', lash: '#3a1d3f', sil: '#05060c',
};

// Light rigs, measured from the scene components (colours sampled from the SVG fills, positions from their geometry).
export const RIGS = {
  // sample = a colour sampled from main's art right next to where she stands (the grade must pull her toward it)
  platform: { ambient: '#1d2f7a', key: '#9fc8ff', keyFrom: [-1, -0.4], keyAmt: 0.25, mix: 0.62, rim: '#9fc8ff', rimFrom: [-1, 0], sample: '#23347e',
    ref: { label: 'bench', px: 90 }, depth: 1.3, floorY: 1030 },
  door: { ambient: '#3a3440', key: '#ffe7b8', keyFrom: [0.35, -1], keyAmt: 0.18, mix: 0.34, rim: '#ffcf7a', rimFrom: [1, 0], sample: '#8e8a80',
    ref: { label: 'door', px: 660 }, depth: 4.9, floorY: 1080 },
  genkan: { ambient: '#6b5a48', key: '#fff1d6', keyFrom: [0, -1], keyAmt: 0.1, mix: 0.7, rim: '#ffe2a8', rimFrom: [0, -1], backlit: true, sample: '#b98a5a',
    ref: { label: 'hall doorway', px: 560 }, depth: 1.0, floorY: 545 },
  kitchen: { ambient: '#8a6a7a', key: '#ffd9a8', keyFrom: [0.2, -1], keyAmt: 0.2, mix: 0.22, rim: '#ffd9a8', rimFrom: [0.6, -0.8], sample: '#caa3b8',
    ref: { label: 'teacup', px: 110 }, depth: 0.8, floorY: 500 },
};

export const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const toHex = (rgb) => `#${rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0')).join('')}`;
const lin = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
// Relative luminance (WCAG), 0..1
export const luminance = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

// Grade one colour into a rig: multiply toward the ambient (by rig.mix), then add a little key light (screen, by keyAmt).
export function gradeColour(h, rig) {
  const c = hex(h), a = hex(rig.ambient), k = hex(rig.key);
  const mult = c.map((v, i) => v * (1 - rig.mix) + (v * a[i]) / 255 * rig.mix);
  const lit = mult.map((v, i) => 255 - (255 - v) * (1 - (k[i] / 255) * rig.keyAmt));
  return toHex(lit);
}
// The whole role palette for a scene, as CSS custom properties (--c-<role>).
export function gradeVars(rigName) {
  const rig = RIGS[rigName];
  const vars = {};
  for (const [role, h] of Object.entries(RAW)) vars[`--c-${role}`] = gradeColour(h, rig);
  vars['--art-stroke'] = gradeColour('#4a2347', { ...rig, mix: Math.min(1, rig.mix + 0.2) });
  vars['--s-lash'] = vars['--c-lash'];
  return vars;
}

// Scale: her standing height from a reference object AT A KNOWN DEPTH (real cm -> px), times the staging depth factor
// (1 = she stands in the reference's plane, 2 = twice as close to the lens). Placement is computed from this, never eyeballed.
export const REAL = { nanda: 158, door: 200, bench: 45, 'hall doorway': 200, teacup: 9 };
export const BUST_FULL = 2590; // main's bust: 7 heads x 370 local units = her full height in the bust's local units
export const SIL_FULL = 560;   // main's silhouette: feet to crown in local units
export function heightPx(rigName) {
  const { ref, depth } = RIGS[rigName];
  return (REAL.nanda / REAL[ref.label]) * ref.px * depth;
}
export const bustScale = (rigName) => heightPx(rigName) / BUST_FULL;
export const silScale = (rigName) => heightPx(rigName) / SIL_FULL;
// Rim light sits on the side facing the key/rim source; the cast shadow falls the opposite way.
export function shadowDir(rigName) {
  const [x, y] = RIGS[rigName].keyFrom;
  const l = Math.hypot(x, y) || 1;
  return [-x / l, -y / l];
}

// Contrast ratio (WCAG) between two colours: her graded skin vs the wall behind her should sit in the same light (not glow).
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
