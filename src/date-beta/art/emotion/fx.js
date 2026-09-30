// fx.js: the four gacha FX backdrops as static SVG strings (viewBox 0 0 1920 1080). research/sprint-0930/emotion-fx/RESEARCH.md §3.
// Each is one baked still: no <animate>, no CSS motion; layouts come from fixed seeds. Nanda + the dialogue box draw over them.
//   love-crit (A): pastel "bubble + sparkle background"; big (+10) = more bubbles/sparkles + 2 peonies.
//   love-bomb (B, pity): pink > lavender > cyan, ribbon, glass hexagons, bubbles + bokeh, peonies, sakura petals, sparkles.
//   anger (C, ref 11): white > pink halftone polka dots, two small veins in the air.
//   rage (D, ref 04): black, yellow-white lightning with a yellow-green halo, red marks at the temples.
import { rng, W, H, HEAD, KEEP, inKeep, sparkle, bubble, bubbleDefs, ring, peony, petal, hexagon, vein, halftone, bolts } from './shapes.js';

// What covers the backdrop on a reaction frame: the HUD ribbon (top) and the dialogue box (bottom). Shapes placed
// there would be wasted, so scatter() skips them (their centre may not sit under either).
const COVERED = [[0, 0, 1600, 100], [250, 810, 1670, 1080]];
const covered = (x, y) => COVERED.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1);
// n positions from a seeded PRNG, pushed out of the keep area (the face stays clean). bias > 1 = hug the edges.
function scatter(seed, n, { keep = KEEP, grow = 0, bias = 1.15, minGap = 0, rMin = 0, rMax = 0 } = {}) {
  const R = rng(seed), out = [];
  for (let tries = 0; out.length < n && tries < n * 80; tries++) {
    const ex = (R() - 0.5) * 2, ey = (R() - 0.5) * 2;
    const x = W / 2 + Math.sign(ex) * Math.abs(ex) ** (1 / bias) * (W / 2 + 40);
    const y = H / 2 + Math.sign(ey) * Math.abs(ey) ** (1 / bias) * (H / 2 + 40);
    const r = rMin + (rMax - rMin) * R() ** 2; // power law: few big, many small
    if (inKeep(x, y, keep, grow + r * 0.5) || covered(x, y)) continue;
    if (minGap && out.some((p) => Math.hypot(p.x - x, p.y - y) < (p.r + r) * minGap)) continue;
    out.push({ x, y, r, rot: R() * 360 });
  }
  return out;
}
const svg = (defs, body) => `<svg class="emo-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs>${defs}</defs>${body}</svg>`;

export function loveCritSVG({ big = false } = {}) {
  const defs = `<linearGradient id="emo-lc-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8a0c8"/><stop offset="1" stop-color="#c8a0f0"/></linearGradient>
    <radialGradient id="emo-lc-glow" cx="${HEAD.x / W}" cy="${(HEAD.y - 60) / H}" r=".55"><stop offset="0" stop-color="#fff4e0" stop-opacity=".8"/><stop offset=".55" stop-color="#fff4e0" stop-opacity="0"/></radialGradient>${bubbleDefs()}`;
  const bubbles = scatter(big ? 51 : 50, big ? 16 : 12, { rMin: 24, rMax: 140, minGap: 0.75 }).map((b) => bubble(b.x, b.y, b.r)).join('');
  const stars = scatter(big ? 61 : 60, big ? 9 : 7, { rMin: 20, rMax: 70, grow: -140 }).map((s, i) => sparkle(s.x, s.y, s.r, { eight: i === 0 && big })).join('');
  const flowers = big ? peony(230, 600, 175, -12) + peony(1700, 560, 160, 20) : '';
  return svg(defs, `<rect width="${W}" height="${H}" fill="url(#emo-lc-bg)"/><rect width="${W}" height="${H}" fill="url(#emo-lc-glow)"/>${bubbles}${flowers}${stars}`);
}

export function loveBombSVG() {
  const defs = `<linearGradient id="emo-lb-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8a0c8"/><stop offset=".55" stop-color="#c8a0f0"/><stop offset="1" stop-color="#90e0f0"/></linearGradient>
    <linearGradient id="emo-lb-rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff9fd0"/><stop offset=".5" stop-color="#fff2a8"/><stop offset="1" stop-color="#9fe8f4"/></linearGradient>
    <radialGradient id="emo-lb-glow" cx="${HEAD.x / W}" cy="${(HEAD.y - 60) / H}" r=".5"><stop offset="0" stop-color="#fff4e0" stop-opacity=".85"/><stop offset=".6" stop-color="#fff4e0" stop-opacity="0"/></radialGradient>
    <radialGradient id="emo-lb-vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#f8a0c8" stop-opacity="0"/><stop offset="1" stop-color="#e85aa0" stop-opacity=".35"/></radialGradient>
    <filter id="emo-lb-soft" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>${bubbleDefs()}`;
  const ribbon = `<path d="M-60 300C380 120 700 520 1100 330S1700 90 1990 250" fill="none" stroke="url(#emo-lb-rib)" stroke-width="64" stroke-linecap="round" opacity=".38" filter="url(#emo-lb-soft)"/>`;
  const hexes = scatter(71, 9, { rMin: 50, rMax: 120, grow: -40, minGap: 0.5 }).map((h) => hexagon(h.x, h.y, h.r, h.rot % 60)).join('');
  const bubbles = scatter(72, 22, { rMin: 20, rMax: 130, minGap: 0.7 }).map((b) => bubble(b.x, b.y, b.r)).join('');
  // bokeh rings on the right side (ref 09's composition: rings top-right / bottom-right)
  const rings = [[1640, 160, 34], [1780, 300, 22], [1540, 420, 18], [1700, 760, 40], [1840, 620, 16], [1600, 980, 26]].map(([x, y, r]) => ring(x, y, r)).join('');
  const flowers = peony(250, 600, 200, -18) + peony(1680, 560, 185, 16) + peony(1840, 900, 120, 40);
  const R = rng(74);
  const petals = Array.from({ length: 44 }, () => {
    const x = R() * W, y = H * (0.12 + 0.88 * Math.sqrt(R())), len = 22 + 70 * R() ** 2;
    return inKeep(x, y, KEEP, -120) || covered(x, y) ? '' : petal(x, y, len, R() * 360);
  }).join('');
  const stars = sparkle(170, 150, 92, { eight: true }) + scatter(75, 14, { rMin: 14, rMax: 58, grow: -90 }).map((s) => sparkle(s.x, s.y, s.r, { glow: '#fff2a8' })).join('');
  return svg(defs, `<rect width="${W}" height="${H}" fill="url(#emo-lb-bg)"/>${ribbon}<rect width="${W}" height="${H}" fill="url(#emo-lb-glow)"/>`
    + `${hexes}${rings}${bubbles}${flowers}${petals}${stars}<rect width="${W}" height="${H}" fill="url(#emo-lb-vig)"/>`);
}

export function angerSVG() {
  const defs = `<radialGradient id="emo-an-bg" cx="${HEAD.x / W}" cy="${HEAD.y / H}" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#fff0f5"/><stop offset="1" stop-color="#ffd9e7"/></radialGradient>`;
  const dots = `<path d="${halftone()}" fill="#f4a8c8"/>`;
  // Stepped grow (no tween): small set first, big set (1.25x) once the stage says data-emo-step="big" (emotion.css).
  const set = (k) => vein(HEAD.x + 330, HEAD.y - 280, 118 * k, { rot: 18, fill: '#ff1414', edge: '#6a0000', bold: true })
    + vein(HEAD.x - 330, HEAD.y - 210, 86 * k, { rot: -24, fill: '#ff1414', edge: '#6a0000', bold: true });
  const flush = `<rect width="${W}" height="${H}" fill="url(#emo-an-flush)"/>`;
  const fdefs = `<radialGradient id="emo-an-flush" cx="${HEAD.x / W}" cy="${HEAD.y / H}" r=".35"><stop offset="0" stop-color="#ff3a4a" stop-opacity=".22"/><stop offset="1" stop-color="#ff3a4a" stop-opacity="0"/></radialGradient>`;
  return svg(defs + fdefs, `<rect width="${W}" height="${H}" fill="url(#emo-an-bg)"/>${dots}${flush}<g class="emo-v-s">${set(1)}</g><g class="emo-v-b">${set(1.25)}</g>`);
}

export function rageSVG() {
  const { trunk, spur } = bolts(404);
  const defs = `<filter id="emo-rg-halo" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="9"/></filter>
    <radialGradient id="emo-rg-dim" cx="${HEAD.x / W}" cy="${HEAD.y / H}" r=".45"><stop offset="0" stop-color="#2a1016"/><stop offset="1" stop-color="#000"/></radialGradient>`;
  const line = (d, w, color, op = 1) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="miter" stroke-miterlimit="3" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
  const marks = vein(HEAD.x + 280, HEAD.y - 310, 84, { rot: 14 }) + vein(HEAD.x - 320, HEAD.y - 250, 60, { rot: -20 });
  return svg(defs, `<rect width="${W}" height="${H}" fill="#000"/><rect width="${W}" height="${H}" fill="url(#emo-rg-dim)"/>`
    + `<g filter="url(#emo-rg-halo)" opacity=".6">${line(trunk, 34, '#b8d820')}${line(spur, 20, '#b8d820')}</g>`
    + line(trunk, 16, '#d8ec60', 0.55) + line(spur, 9, '#d8ec60', 0.55)
    + line(trunk, 8, '#f4f8c8') + line(spur, 4, '#f4f8c8') + marks);
}
