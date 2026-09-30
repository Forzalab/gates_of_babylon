// face.js: Nanda's gacha face layers (RESEARCH.md §4 + ref 11). Still overlays positioned from her anchor points
// (art/nanda.js ANCHORS, gate units), never hardcoded to the stage. Each layer returns { under, over }:
//   under = drawn inside her body clip, after the face and before the fringe (so the bangs sit on top, as in ref 01);
//   over  = drawn after the whole figure (things that float over hair or outside her outline).
// Layers: vein (💢 at the temple, ref 03), puff (ref 11: puffed cheeks, blush hatching, a teardrop), shadow-eyes
// (refs 01/02/04: dark eye band under the bangs, two small white eyes), sparkle (ref 10: 4-point stars in the eyes + round her).
import { STAR4, VEIN4, VEIN2 } from './shapes.js';

export const FACE_IDS = ['vein', 'puff', 'shadow-eyes', 'sparkle'];
const DROP = 'M0 -11C4 -5 8 0 8 4.5A8 8 0 0 1 -8 4.5C-8 0 -4 -5 0 -11Z';
const star = (x, y, r, fill = '#fff', rot = 0) => `<path d="${STAR4}" transform="translate(${x} ${y}) rotate(${rot}) scale(${r})" fill="${fill}"/>`;
const mark = (x, y, s, rot, two = false) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="#e01010" stroke="#7a0606" stroke-width="${(1.2 / s).toFixed(3)}" stroke-linejoin="round">${two ? VEIN2 : VEIN4}</g>`;

let uid = 0;
const LAYERS = {
  // The 💢 mark on the fringe at her temple (+ a small one in the air next to her when she is furious).
  vein: (P, A, o) => ({ over: mark(A.temple[0], A.temple[1], o.furious ? 10 : 9, 12) + (o.furious ? mark(A.air[0], A.air[1], 7, -18) : '') }),
  // Ref 11: puffed cheeks = a rounder cheek contour bulging out on each side, big blush with hatching, and a small
  // teardrop at the outer corner of her right eye. (The squashed mouth and pouting brows are her `puff` face in nanda.js.)
  puff: (P, A) => {
    const [lx, ly] = A.cheekL, [rx, ry] = A.cheekR, ink = P.ink;
    const blush = P.blush === 'none' ? '#f5a0a0' : P.blush;
    const cheek = (x, y, dir) => `<ellipse cx="${x}" cy="${y}" rx="9.5" ry="6" fill="${blush}" opacity=".5"/>`
      + `<path d="M${x - 5},${y - 2} l-2,4 M${x - 1},${y - 2.5} l-2,4 M${x + 3},${y - 2} l-2,4" stroke="${ink}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>`
      + `<path d="M${x + dir * 9},${y - 6} Q${x + dir * 15},${y + 1} ${x + dir * 8},${y + 8}" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`
      + `<ellipse cx="${x - dir * 2}" cy="${y - 3.4}" rx="3" ry="1.5" fill="#fff" opacity=".55"/>`;
    const [tx, ty] = A.tear;
    return { under: cheek(lx, ly, -1) + cheek(rx, ry, 1)
      + `<path d="${DROP}" transform="translate(${tx} ${ty}) scale(.36)" fill="#bfe6ff" stroke="#1f5f96" stroke-width="3" stroke-linejoin="round"/>` };
  },
  // Hidden eyes: a dark band across both eyes, hard top edge under the bangs, soft lower edge (blurred), the upper face
  // darkened; two small white eyes glint through (ref 04's shrunken pupils). Nose/mouth stay visible.
  'shadow-eyes': (P, A) => {
    const n = ++uid, [x0, x1] = A.eyeBand.x, [y0, y1] = A.eyeBand.y, g = `emo-se${n}`, f = `emo-sef${n}`;
    const [lx, ly] = A.eyeL, [rx, ry] = A.eyeR;
    return { under: `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1418" stop-opacity=".92"/><stop offset=".7" stop-color="#1a1418" stop-opacity=".78"/><stop offset="1" stop-color="#1a1418" stop-opacity="0"/></linearGradient>`
      + `<filter id="${f}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter></defs>`
      + `<rect x="${x0}" y="${A.brow}" width="${x1 - x0}" height="${y0 - A.brow}" fill="#1a1418" opacity=".15"/>`
      + `<path d="M${x0},${y0} H${x1} V${y1 - 4} Q${(x0 + x1) / 2},${y1 + 4} ${x0},${y1 - 4} Z" fill="url(#${g})" filter="url(#${f})"/>`
      + `<ellipse cx="${lx}" cy="${ly + 1}" rx="2.6" ry="1.5" fill="#fff"/><ellipse cx="${rx}" cy="${ry + 1}" rx="2.6" ry="1.5" fill="#fff"/>` };
  },
  // Sparkle: a 4-point star in each eye's highlight (ref 05) + a few stars round her head (1 big 8-point, many small).
  sparkle: (P, A) => {
    const [lx, ly] = A.eyeL, [rx, ry] = A.eyeR;
    const under = star(lx + 2.6, ly - 3.6, 3.6) + star(rx + 2.6, ry - 3.6, 3.6);
    const over = A.halo.map(([x, y, r], i) => (i === 0 ? star(x, y, r * 0.6, '#fff', 45) : '') + `<circle cx="${x}" cy="${y}" r="${(r * 0.28).toFixed(1)}" fill="#ffc8e8" opacity=".6"/>` + star(x, y, r)).join('');
    return { under, over };
  },
};

// ids: face layer ids (gacha tier `face`). P: her palette, A: her anchors. Unknown ids are skipped (the loader rejects them).
export function faceLayers(ids = [], P, A) {
  const o = { furious: ids.includes('shadow-eyes') }; // rage = shadow-eyes + vein: the bigger vein pair
  const out = { under: '', over: '' };
  for (const id of FACE_IDS) {
    if (!ids.includes(id)) continue;
    const l = LAYERS[id](P, A, o);
    out.under += l.under ?? '';
    out.over += l.over ?? '';
  }
  return out;
}
