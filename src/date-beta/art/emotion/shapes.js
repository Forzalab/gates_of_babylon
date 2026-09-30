// shapes.js: the hand-built emotion-FX vocabulary (research/sprint-0930/emotion-fx/RESEARCH.md §2-4). Pure string builders,
// no DOM, no animation. Every random layout comes from a seeded PRNG, so the same FX always draws the same picture.
// Shapes are drawn fresh from the written shape grammar; no ref is traced (09 is watermarked stock, 01-07/11 are anime frames).

// mulberry32: a tiny seeded PRNG -> () => [0, 1)
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const f1 = (n) => Math.round(n * 10) / 10;
const f3 = (n) => Math.round(n * 1000) / 1000; // stroke widths inside a scaled group
export const W = 1920, H = 1080;
// Where Nanda's head sits on the 1920x1080 stage on a reaction frame (beta.css .db-nanda: left 730, bottom 160, 460x496;
// her face centre is viewBox (10, -148)). The FX keep this area clean (love) or stop their bolts at it (rage).
export const HEAD = { x: 931, y: 686 };
export const KEEP = { x: 960, y: 600, rx: 470, ry: 400 };
export const inKeep = (x, y, k = KEEP, grow = 0) => ((x - k.x) / (k.rx + grow)) ** 2 + ((y - k.y) / (k.ry + grow)) ** 2 < 1;

// 4-point star (ref 10): concave, pinched sides, long thin rays. Unit path, centre 0,0, tips at +-1.
export const STAR4 = 'M0 -1C.06 -.12 .12 -.06 1 0C.12 .06 .06 .12 0 1C-.06 .12 -.12 .06 -1 0C-.12 -.06 -.06 -.12 0 -1Z';
export function sparkle(x, y, r, { eight = false, glow = '#ffc8e8', fill = '#ffffff', rot = 0 } = {}) {
  const t = `translate(${f1(x)} ${f1(y)}) rotate(${rot})`;
  return `<g transform="${t}">`
    + (glow ? `<circle r="${f1(r * 0.34)}" fill="${glow}" opacity=".55"/>` : '')
    + (eight ? `<path d="${STAR4}" transform="rotate(45) scale(${f1(r * 0.6)})" fill="${fill}" opacity=".9"/>` : '')
    + `<path d="${STAR4}" transform="scale(${f1(r)})" fill="${fill}"/></g>`;
}

// Soap bubble (refs 05/06): circle, radial fill lighter at the centre, thin white rim, glint upper-left.
// Needs the <radialGradient id="emo-bub"> from bubbleDefs().
export const bubbleDefs = (edge = '#ffd0e4') => `<radialGradient id="emo-bub" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#ffffff" stop-opacity=".06"/>`
  + `<stop offset=".72" stop-color="${edge}" stop-opacity=".18"/><stop offset="1" stop-color="${edge}" stop-opacity=".5"/></radialGradient>`;
export function bubble(x, y, r, { rim = 0.75 } = {}) {
  return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#emo-bub)" stroke="#fff" stroke-opacity="${rim}" stroke-width="${f1(Math.max(2, r / 40))}"/>`
    + `<ellipse cx="${f1(x - r * 0.42)}" cy="${f1(y - r * 0.46)}" rx="${f1(r * 0.16)}" ry="${f1(r * 0.08)}" transform="rotate(-38 ${f1(x - r * 0.42)} ${f1(y - r * 0.46)})" fill="#fff" opacity=".85"/>`;
}
// Bokeh ring (ref 09 composition only): stroke-only cream ring.
export const ring = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="#f8f0a0" stroke-opacity=".7" stroke-width="3"/>`;

// Peony (ref 05): 3 rings of ruffled teardrop petals, pale outside, deep inside, gold stamen dots, two leaves behind.
const PETAL = 'M0 0C-.52 .18 -.74 .78 -.36 1Q-.18 .9 0 1.03Q.18 .9 .36 1C.74 .78 .52 .18 0 0Z';
export function peony(x, y, r, rot = 0) {
  const ringOf = (n, s, fill, off) => Array.from({ length: n }, (_, i) =>
    `<path d="${PETAL}" transform="rotate(${f1(off + (360 / n) * i)}) scale(${f1(r * s)})" fill="${fill}" stroke="#fff" stroke-opacity=".55" stroke-width="${f3(2 / (r * s))}"/>`).join('');
  const leaf = (a) => `<ellipse cx="0" cy="${f1(r * 0.95)}" rx="${f1(r * 0.28)}" ry="${f1(r * 0.62)}" transform="rotate(${a})" fill="#3a8a6a"/>`;
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2, d = r * 0.09;
    return `<circle cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(r * 0.04)}" fill="#f8e08a"/>`;
  }).join('');
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})">${leaf(140)}${leaf(215)}`
    + ringOf(7, 1, '#f7b8d0', 0) + ringOf(6, 0.74, '#ef9fc2', 25) + ringOf(5, 0.48, '#d96c9c', 8)
    + `<circle r="${f1(r * 0.16)}" fill="#e08a9a"/>${dots}</g>`;
}

// Sakura petal (ref 07): rounded oval, notch at one end, flat fill, thin bright rim, shade line at the notch.
const SAKURA = 'M0 -1C.62 -.9 .74 .32 .16 .96L0 .78L-.16 .96C-.74 .32 -.62 -.9 0 -1Z';
export function petal(x, y, len, rot, { fill = '#ffe6ef', shade = '#f5a3c0' } = {}) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f3(len / 2)})"><path d="${SAKURA}" fill="${fill}" stroke="#fff" stroke-opacity=".7" stroke-width="${f3(3 / (len / 2))}"/>`
    + `<path d="M0 .78L0 .45" stroke="${shade}" stroke-width="${f3(3 / (len / 2))}" stroke-linecap="round"/></g>`;
}

// Frosted-glass hexagon (ref 09 composition only; built fresh): 6 points, white fill 0.22, white rim.
export function hexagon(x, y, r, rot = 0) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i + rot) * Math.PI) / 180;
    return `${f1(x + Math.cos(a) * r)},${f1(y + Math.sin(a) * r)}`;
  }).join(' ');
  return `<polygon points="${pts}" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-opacity=".62" stroke-width="2.5" stroke-linejoin="round"/>`;
}

// Anger vein (ref 03 icon 1, the 💢 mark): 4 crescents in the diagonal corners, each bowing in toward the centre with
// its two tips pointing out along the axes; fat in the middle, pointed tips, and the pieces never touch. Unit box -1..1.
const WEDGE = 'M-.2 -1Q-.22 -.22 -1 -.2Q-.52 -.52 -.2 -1Z';
export const VEIN4 = [0, 90, 180, 270].map((a) => `<path d="${WEDGE}" transform="rotate(${a})"/>`).join('');
// Two opposing wedges (ref 03 icon 8): the small "vein in the air".
export const VEIN2 = [0, 180].map((a) => `<path d="${WEDGE}" transform="rotate(${a})"/>`).join('');
export function vein(x, y, size, { rot = 12, two = false, fill = '#e01010', edge = '#9a0808' } = {}) {
  const sw = f3(2.5 / (size / 2));
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${f1(size / 2)})" fill="${fill}" stroke="${edge}" stroke-width="${sw}" stroke-linejoin="round">${two ? VEIN2 : VEIN4}</g>`;
}

// Halftone polka dots (ref 11): a hex grid of dots in ONE path (one node), radius growing with the distance from `c`
// (the clean face area), so the field is white at the centre and dense pink at the edges.
export function halftone({ c = HEAD, step = 54, rMin = 2, rMax = 19, inner = 300, outer = 1100 } = {}) {
  let d = '';
  for (let row = 0, y = 0; y <= H + step; row++, y += step * 0.866) {
    for (let x = row % 2 ? step / 2 : 0; x <= W + step; x += step) {
      const t = Math.min(1, Math.max(0, (Math.hypot(x - c.x, (y - c.y) * 1.25) - inner) / (outer - inner)));
      const r = f1(rMin + (rMax - rMin) * t ** 0.9);
      if (t <= 0) continue;
      d += `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${f1(2 * r)} 0a${r} ${r} 0 1 0 ${f1(-2 * r)} 0`;
    }
  }
  return d;
}

// Lightning (ref 04): jagged polylines from the frame edge toward the head, lots of short side spurs, forks at 30-60
// degrees, stopping at the keep-out ellipse around her (she is drawn over them anyway). Returns { trunk, spur } path data
// (trunks are stroked wider than spurs; halo + core share the data).
export function bolts(seed, { main = 9, keep = { x: HEAD.x, y: HEAD.y - 40, rx: 280, ry: 320 } } = {}) {
  const R = rng(seed);
  const trunk = [], spur = [];
  const out = (x, y) => x < -60 || x > W + 60 || y < -60 || y > H + 60;
  const walk = (x, y, ang, segs, lenMin, lenMax, depth) => {
    const pts = [[x, y]];
    for (let i = 0; i < segs; i++) {
      const turn = (i % 2 ? 1 : -1) * (0.25 + R() * 0.5); // alternating zig-zag, ~15-45 degrees
      const a = ang + turn, len = lenMin + R() * (lenMax - lenMin);
      x += Math.cos(a) * len; y += Math.sin(a) * len;
      pts.push([x, y]);
      if (inKeep(x, y, keep) || out(x, y)) break;
      if (depth < 2 && R() < (depth ? 0.35 : 0.75)) {
        const side = R() < 0.5 ? -1 : 1, fa = ang + side * (0.55 + R() * 0.5);
        walk(x, y, fa, 1 + Math.floor(R() * (depth ? 2 : 4)), lenMin * 0.45, lenMax * 0.5, depth + 1);
      }
    }
    (depth ? spur : trunk).push(pts);
  };
  for (let i = 0; i < main; i++) {
    const t = (i + R() * 0.6) / main, per = 2 * (W + H), p = t * per;
    let x, y;
    if (p < W) { x = p; y = -20; } else if (p < W + H) { x = W + 20; y = p - W; } else if (p < 2 * W + H) { x = 2 * W + H - p; y = H + 20; } else { x = -20; y = per - p; }
    const ang = Math.atan2(keep.y - y, keep.x - x) + (R() - 0.5) * 0.6;
    walk(x, y, ang, 14 + Math.floor(R() * 6), 40, 95, 0);
  }
  const d = (list) => list.map((pts) => `M${pts.map(([a, b]) => `${f1(a)} ${f1(b)}`).join('L')}`).join('');
  return { trunk: d(trunk), spur: d(spur) };
}
