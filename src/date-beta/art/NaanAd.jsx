// NaanAd: the Hot NAAN ad as ONE hand-built SVG, fixed 2:1 (1600 x 800 units). Mount it anywhere: a station billboard,
// a light-box, a full-screen card. <NaanAd x y width rm /> renders a nested <svg>, so it drops into another scene's SVG
// as is, or stands alone in HTML (then size it with CSS; the viewBox keeps the ratio).
// Look: warm orange on teal (Tony's naan-plate ref 9963f075), an S-bend curry river with cream swirls and clouds
// (cleared ref e1dce3a3), a black plate of blistered naan + a black bowl of curry. The kadai/roti ref only fed the
// shape idea (bowl rim, blister rings); no pixels copied. The chicken pieces are NAND gates with faces.
// Headline glitch: NAAN -> NAND -> one NANDA frame, on a 500 ms step (<= 2 swaps a second, WCAG 2.3.1 safe).
// Reduced motion: a static "NAN D" with the D in her red; the gates and the steam stop.
import { rng, useStep, HEART } from './util.js';

export const NAAN_AD_W = 1600;
export const NAAN_AD_H = 800;

const C = {
  teal: '#46d9d1', tealMid: '#2fbfb7', tealDeep: '#1c9a93', ink: '#0b3431',
  cloud: '#fbfffd', cloudShade: '#c7efe9',
  dough: '#f9eacd', doughEdge: '#e2bd84', doughRim: '#f0d7a8', puff: '#fffaf0',
  toast: '#e6aa66', char: '#b35e27', burnt: '#733211', freckle: '#d49a5c',
  curry: '#f47a0c', curryDeep: '#c2520f', curryLight: '#fb9d3a', cream: '#fff3dc',
  black: '#17140f', blackRim: '#2c2721', blackHi: '#4a443b',
  leaf: '#3e8a28', leafLight: '#78b83a', brown: '#3a1500', pink: '#ff5fa2', gateInk: '#5a1f00',
};

const f1 = (n) => n.toFixed(1);
// Catmull-Rom through points -> cubic Bezier path (closed blobs or open strokes): hand-drawn curves, no jaggies.
function smooth(pts, closed = true) {
  const n = pts.length, P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}
// an irregular round blob (blister, fleck, cloud lobe)
function blob(cx, cy, rx, ry, rnd, n = 9, j = 0.2) {
  const a0 = rnd() * Math.PI;
  return smooth(Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2, k = 1 + (rnd() - 0.5) * 2 * j;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  }));
}

/* ---------------- naan ---------------- */
// Teardrop outline, long axis on x: the round end at +a, the tapered end at -a.
function naanPts(a, b, rnd) {
  return Array.from({ length: 30 }, (_, i) => {
    const t = (i / 30) * Math.PI * 2, k = 1 + (rnd() - 0.5) * 0.05;
    return [a * Math.cos(t) * k, b * Math.sin(t) * (0.74 + 0.26 * Math.cos(t)) * k];
  });
}
// is (x, y) inside the teardrop, with a margin (0..1)?
const inNaan = (x, y, a, b, m) => { const t = Math.acos(Math.max(-1, Math.min(1, x / (a * m)))); return Math.abs(y) < b * m * Math.sin(t) * (0.74 + 0.26 * Math.cos(t)); };

function Blister({ x, y, r, rnd }) {
  return (
    <g>
      <path d={blob(x + r * 0.15, y + r * 0.1, r * 1.45, r * 1.2, rnd, 9, 0.16)} fill={C.toast} />
      <path d={blob(x, y, r, r * 0.82, rnd, 8, 0.22)} fill={C.char} />
      <path d={blob(x - r * 0.22, y - r * 0.12, r * 0.52, r * 0.42, rnd, 7, 0.25)} fill={C.burnt} />
      <ellipse cx={x + r * 0.55} cy={y - r * 1.05} rx={r * 0.55} ry={r * 0.26} fill={C.puff} transform={`rotate(-14 ${x} ${y})`} />
    </g>
  );
}

function Flecks({ spots }) {
  return spots.map(([x, y, s, r, g], i) => (
    <g key={i} transform={`translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${f1(s)})`} fill={g ? C.leafLight : C.leaf}>
      <ellipse cx="-3" cy="0" rx="4" ry="2.6" /><ellipse cx="3" cy="-1" rx="3.4" ry="2.4" transform="rotate(50)" /><ellipse cx="2" cy="3" rx="3" ry="2" />
    </g>
  ));
}

function Naan({ id, x, y, a, b, rot, seed }) {
  const rnd = rng(seed), outline = smooth(naanPts(a, b, rnd));
  const spots = [], big = [], dots = [], flecks = [];
  const pick = (m) => { for (let k = 0; k < 40; k++) { const px = (rnd() * 2 - 1) * a, py = (rnd() * 2 - 1) * b; if (inNaan(px, py, a, b, m)) return [px, py]; } return [0, 0]; };
  for (let i = 0; i < 7; i++) { const [px, py] = pick(0.72); if (big.every(([qx, qy]) => Math.hypot(px - qx, py - qy) > a * 0.36)) big.push([px, py, 14 + rnd() * 14]); }
  for (let i = 0; i < 9; i++) { const [px, py] = pick(0.82); spots.push([px, py, 5 + rnd() * 6]); }
  for (let i = 0; i < 22; i++) { const [px, py] = pick(0.9); dots.push([px, py, 1.6 + rnd() * 2.6]); }
  for (let i = 0; i < 16; i++) { const [px, py] = pick(0.84); flecks.push([px, py, 0.8 + rnd() * 0.7, rnd() * 360, rnd() < 0.4]); }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs><clipPath id={id}><path d={outline} /></clipPath></defs>
      <path d={outline} transform="translate(4 14)" fill={C.doughEdge} />
      <path d={outline} fill={C.dough} />
      <g clipPath={`url(#${id})`}>
        <path d={outline} fill="none" stroke={C.doughRim} strokeWidth="26" />
        <path d={smooth([[-a * 0.55, -b * 0.25], [-a * 0.1, -b * 0.62], [a * 0.45, -b * 0.6], [a * 0.78, -b * 0.2]], false)} fill="none" stroke={C.puff} strokeWidth="16" strokeLinecap="round" opacity=".85" />
        {dots.map(([px, py, r], i) => <circle key={i} cx={f1(px)} cy={f1(py)} r={f1(r)} fill={C.freckle} />)}
        {spots.map(([px, py, r], i) => <g key={i}><path d={blob(px, py, r * 1.3, r, rnd, 7, 0.25)} fill={C.toast} /><path d={blob(px, py, r * 0.7, r * 0.55, rnd, 6, 0.3)} fill={C.char} /></g>)}
        {big.map(([px, py, r], i) => <Blister key={i} x={px} y={py} r={r} rnd={rnd} />)}
        <Flecks spots={flecks} />
      </g>
    </g>
  );
}

/* ---------------- NAND gate with a face (the chicken pieces) ---------------- */
function Gate({ x, y, s, tilt, sink = 0.45 }) {
  // origin = the waterline centre; the body is 70 wide, 52 tall, so the bottom `sink` of it is under the curry
  const top = -52 * (1 - sink);
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      <g transform={`translate(-40 ${f1(top)})`}>
        <line x1="-16" y1="14" x2="4" y2="14" stroke={C.gateInk} strokeWidth="6" strokeLinecap="round" />
        <line x1="-16" y1="38" x2="4" y2="38" stroke={C.gateInk} strokeWidth="6" strokeLinecap="round" />
        <path d="M4 0 H40 A26 26 0 0 1 40 52 H4Z" fill={C.cream} stroke={C.gateInk} strokeWidth="6" strokeLinejoin="round" />
        <circle cx="76" cy="26" r="8" fill={C.cream} stroke={C.gateInk} strokeWidth="6" />
        <circle cx="24" cy="20" r="4.6" fill={C.gateInk} /><circle cx="42" cy="20" r="4.6" fill={C.gateInk} />
        <ellipse cx="17" cy="30" rx="5" ry="3" fill={C.pink} opacity=".7" /><ellipse cx="50" cy="30" rx="5" ry="3" fill={C.pink} opacity=".7" />
        <path d="M27 29 Q33 35 39 29" stroke={C.gateInk} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
      {/* the curry closes over the bottom of the body */}
      <path d="M-66 0 Q-40 -7 -8 -2 Q30 5 60 -2 L60 40 H-66Z" fill={C.curry} />
      <path d="M-70 1 Q-40 -8 -8 -3 Q30 5 64 -3" fill="none" stroke={C.cream} strokeWidth="5" strokeLinecap="round" opacity=".9" />
    </g>
  );
}

/* ---------------- curry river (S-bend, far = thin, near = wide) ---------------- */
const RIVER = [[1270, 150, 14], [1390, 178, 26], [1440, 222, 44], [1330, 262, 64], [1130, 300, 86], [1060, 356, 112],
  [1220, 430, 160], [1450, 520, 240], [1500, 640, 380], [1300, 760, 640], [1100, 860, 900]];
function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return p1.map((_, i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
function pos(u) {
  const n = RIVER.length - 1, v = Math.max(0, Math.min(u * n, n - 1e-6)), i = Math.floor(v), t = v - i;
  const P = (k) => RIVER[Math.max(0, Math.min(n, k))];
  return cr(P(i - 1), P(i), P(i + 1), P(i + 2), t);
}
function at(u) {
  const [x, y, w] = pos(u), a = pos(u - 0.004), b = pos(u + 0.004);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return { x, y, w, nx: -dy / l, ny: dx / l };
}
const poly = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
function bank(off0, off1, u0 = 0, u1 = 1, N = 140) {
  const pts = [];
  for (let k = 0; k <= N; k++) { const u = u0 + (u1 - u0) * k / N, p = at(u), o = off0 + (off1 - off0) * k / N; pts.push([p.x + p.nx * p.w * o, p.y + p.ny * p.w * o]); }
  return pts;
}
const RIVER_D = `${poly(bank(0.5, 0.5))}${poly(bank(-0.5, -0.5).reverse()).replace('M', 'L')}Z`;
const SWIRLS = [[0.2, 0.02, 0.2, 5], [-0.22, 0.08, 0.34, 6], [0.14, 0.28, 0.5, 8], [-0.28, 0.42, 0.62, 9], [0.3, 0.52, 0.74, 11],
  [0.02, 0.62, 0.86, 13], [-0.3, 0.72, 0.97, 16], [0.36, 0.8, 0.99, 18]]
  .map(([o, a, b, w]) => ({ d: smooth(bank(o, o * 0.7, a, b, 24).filter((_, i) => i % 3 === 0), false), w }));
const onRiver = (u, off) => { const p = at(u); return { x: p.x + p.nx * p.w * off, y: p.y + p.ny * p.w * off, s: 0.3 + p.w / 700 }; };

function Chunk({ x, y, s, seed }) {
  const rnd = rng(seed);
  return (
    <g transform={`translate(${f1(x)} ${f1(y)}) scale(${f1(s)})`}>
      <path d={blob(0, -10, 42, 30, rnd, 8, 0.18)} fill={C.curryDeep} />
      <path d={blob(-8, -18, 22, 12, rnd, 7, 0.2)} fill="#e06a1c" />
      <path d="M-58 4 Q-10 -6 56 4" fill="none" stroke={C.cream} strokeWidth="5" strokeLinecap="round" opacity=".8" />
    </g>
  );
}

function Sprig({ x, y, s = 1, r = 0 }) {
  const leaf = 'M0 0 C-10 -8 -12 -22 -4 -30 C-2 -24 4 -24 6 -30 C14 -22 12 -8 0 0Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 L0 22" stroke={C.leaf} strokeWidth="3.5" strokeLinecap="round" />
      {[-62, -8, 48].map((a) => <path key={a} d={leaf} transform={`rotate(${a})`} fill={a === -8 ? C.leafLight : C.leaf} stroke="#2c6a1c" strokeWidth="1.5" />)}
    </g>
  );
}

/* ---------------- clouds (ref 1: puffs sitting on the river banks) ---------------- */
function Cloud({ x, y, w, seed }) {
  const rnd = rng(seed), n = Math.max(3, Math.round(w / 70));
  const lobes = Array.from({ length: n }, (_, i) => { const cx = x + (i + 0.5) * (w / n), r = (w / n) * (0.55 + rnd() * 0.35) * (i === 0 || i === n - 1 ? 0.8 : 1.15); return [cx, y - r * 0.55, r]; });
  return (
    <g>
      {lobes.map(([cx, cy, r], i) => <circle key={`s${i}`} cx={f1(cx + 6)} cy={f1(cy + 10)} r={f1(r)} fill={C.cloudShade} />)}
      <rect x={x + 6} y={y - 14} width={w} height="24" rx="12" fill={C.cloudShade} />
      {lobes.map(([cx, cy, r], i) => <circle key={i} cx={f1(cx)} cy={f1(cy)} r={f1(r)} fill={C.cloud} />)}
      <rect x={x} y={y - 24} width={w} height="24" rx="12" fill={C.cloud} />
    </g>
  );
}

/* ---------------- bowl + plate ---------------- */
function Bowl({ x, y, bob, rm }) {
  const rx = 176, ry = 58, h = 118;
  // cream swirl: a squashed spiral from the centre out
  const sw = Array.from({ length: 40 }, (_, i) => { const t = i / 39, a = t * Math.PI * 3.4 + 0.6, r = 12 + t * 106; return [Math.cos(a) * r, Math.sin(a) * r * 0.34]; });
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-rx} 0 C${-rx} ${h * 0.7} ${-rx * 0.62} ${h} ${-rx * 0.5} ${h} H${rx * 0.5} C${rx * 0.62} ${h} ${rx} ${h * 0.7} ${rx} 0Z`} fill={C.black} />
      <path d={`M${-rx * 0.84} ${h * 0.18} C${-rx * 0.84} ${h * 0.6} ${-rx * 0.62} ${h * 0.86} ${-rx * 0.46} ${h * 0.9}`} fill="none" stroke={C.blackHi} strokeWidth="10" strokeLinecap="round" />
      {[0.42, 0.66].map((k) => <path key={k} d={`M${-rx * (0.97 - k * 0.3)} ${h * k} Q0 ${h * k + ry * (1 - k * 0.6)} ${rx * (0.97 - k * 0.3)} ${h * k}`} fill="none" stroke={C.blackRim} strokeWidth="3" />)}
      <ellipse rx={rx} ry={ry} fill={C.blackRim} />
      <ellipse rx={rx - 14} ry={ry - 9} fill={C.curryDeep} />
      <ellipse cy="6" rx={rx - 20} ry={ry - 16} fill={C.curry} />
      <path d={`M${-rx + 40} ${ry - 26} Q0 ${ry - 4} ${rx - 40} ${ry - 26}`} fill="none" stroke={C.curryLight} strokeWidth="8" strokeLinecap="round" />
      <path d={smooth(sw, false)} fill="none" stroke={C.cream} strokeWidth="8" strokeLinecap="round" />
      <Gate x={-80} y={10 + (bob ? -3 : 0)} s={0.62} tilt={-8} sink={0.5} />
      <Gate x={70} y={16 + (bob ? 0 : -3)} s={0.56} tilt={7} sink={0.55} />
      <Sprig x={-6} y={-6} s={0.8} r={10} />
      <Flecks spots={[[-40, 20, 0.8, 20, 0], [30, -10, 0.7, 100, 1], [110, 2, 0.8, 60, 0], [-120, -4, 0.7, 150, 1], [8, 30, 0.7, 10, 1]]} />
      {/* steam: 3 wavy lines, stepped with the gates */}
      {[-60, 0, 60].map((dx, i) => {
        const up = rm ? 0 : ((bob + i) % 2) * 8;
        return <path key={dx} d={`M${dx} ${-ry - 20 - up} c-16 -22 16 -38 0 -60 c-16 -22 16 -38 0 -60`} fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" opacity=".9" />;
      })}
    </g>
  );
}

/* ---------------- headline with the glitch ---------------- */
// 8 ticks x 500 ms = 4 s loop. Letters after "NA": plain, or glitched (black tile, her red, pink sliver).
const GLITCH = [['A', 'N'], ['A', 'N'], ['A', 'N'], ['A', 'N'], ['N', 'D'], ['N', 'D'], ['N', 'D', 'A'], ['N', 'D']];
const CELL = 96, WORD_X = 700; // NAAN word: 4 cells centred on WORD_X; NANDA spills half a cell each side
function Letter({ ch, x, glitch }) {
  if (!glitch) {
    return (
      <g>
        <text x={x + 8} y="8" textAnchor="middle" className="na-naan na-naan-shadow">{ch}</text>
        <text x={x} y="0" textAnchor="middle" className="na-naan">{ch}</text>
      </g>
    );
  }
  return (
    <g transform={`translate(${x + 3} -4) skewX(-6)`}>
      <rect x={-CELL / 2 - 6} y="-136" width="6" height="152" fill={C.pink} />
      <rect x={-CELL / 2} y="-136" width={CELL} height="152" fill="#111" />
      <text x="0" y="0" textAnchor="middle" className="na-naan na-gl">{ch}</text>
    </g>
  );
}
function Headline({ rm }) {
  const f = useStep(GLITCH.length, 4, !rm);
  const letters = rm ? [['N'], ['A'], ['N'], ['D', true]] : [['N'], ['A'], ...GLITCH[f].map((c) => [c, GLITCH[f][0] !== 'A'])];
  const n = letters.length, x0 = WORD_X - (n * CELL) / 2 + CELL / 2;
  return (
    <g className="hl" data-glitch={rm ? 'NAN D' : `NA${GLITCH[f].join('')}`} transform="translate(0 168)">
      <path d={HEART} transform="translate(150 -58) scale(4.2)" fill={C.pink} stroke={C.brown} strokeWidth="1.2" />
      <text x="400" y="-18" textAnchor="middle" className="na-hot" transform="rotate(-7 400 -18)">Hot</text>
      {letters.map(([ch, g], i) => <Letter key={i} ch={ch} glitch={!!g} x={x0 + i * CELL + (rm && i === 3 ? 24 : 0)} />)}
      <text x="946" y="-22" className="na-area">in your area</text>
      <path d={HEART} transform="translate(1486 -58) scale(4.2)" fill={C.pink} stroke={C.brown} strokeWidth="1.2" />
    </g>
  );
}

/* ---------------- the ad ---------------- */
export default function NaanAd({ x = 0, y = 0, width = NAAN_AD_W, rm = false, label = 'Ad: Hot NAAN in your area. Naan and a bowl of curry on a black plate, a curry river with swimming NAND gates. 980 yen, all-you-can-eat naan.' }) {
  const bob = useStep(2, 4, !rm);
  const gates = [[0.34, 0.05, 11], [0.62, -0.22, 12], [0.8, 0.16, 13], [0.9, -0.3, 14]];
  const chunks = [[0.2, -0.1], [0.48, 0.2], [0.72, 0.34], [0.86, -0.02]];
  return (
    <svg className="naan-ad" x={x} y={y} width={width} height={width / 2} viewBox={`0 0 ${NAAN_AD_W} ${NAAN_AD_H}`} role="img" aria-label={label}>
      <defs><clipPath id="na-frame"><rect width={NAAN_AD_W} height={NAAN_AD_H} /></clipPath></defs>
      <g clipPath="url(#na-frame)">
        <rect width={NAAN_AD_W} height={NAAN_AD_H} fill={C.teal} />
        {/* back clouds on the far bends */}
        <Cloud x={1420} y={214} w={220} seed={3} />
        <Cloud x={930} y={330} w={200} seed={4} />
        {/* the river: bank (depth), body, lit streak, cream swirls, chunks, gates, leaves */}
        <path d={RIVER_D} transform="translate(0 16)" fill={C.curryDeep} />
        <path d={RIVER_D} fill={C.curry} />
        {SWIRLS.map(({ d, w }, i) => <path key={i} d={d} fill="none" stroke={C.cream} strokeWidth={w} strokeLinecap="round" opacity=".92" />)}
        {chunks.map(([u, o], i) => <Chunk key={i} {...onRiver(u, o)} seed={20 + i} />)}
        {gates.map(([u, o, sd], i) => { const p = onRiver(u, o); return <Gate key={sd} x={p.x} y={p.y + ((bob + i) % 2 ? -4 : 0)} s={p.s * 1.1} tilt={(bob + i) % 2 ? -6 : 5} />; })}
        <Sprig x={1180} y={470} s={1.3} r={-30} /><Sprig x={1370} y={690} s={1.8} r={24} />
        <Cloud x={1480} y={420} w={180} seed={5} />

        {/* the plate: shadow, black plate, rim light */}
        <ellipse cx="590" cy="588" rx="470" ry="150" fill={C.tealDeep} />
        <ellipse cx="570" cy="566" rx="470" ry="150" fill={C.black} />
        <ellipse cx="570" cy="560" rx="400" ry="116" fill="none" stroke={C.blackRim} strokeWidth="10" />
        <path d="M160 520 C200 460 360 424 560 418" fill="none" stroke={C.blackHi} strokeWidth="6" strokeLinecap="round" />
        <Naan id="na-n1" x={380} y={470} a={250} b={140} rot={-16} seed={7} />
        <Naan id="na-n2" x={430} y={580} a={270} b={150} rot={7} seed={11} />
        <Bowl x={830} y={500} bob={bob} rm={rm} />
        {/* motion swooshes (ref 2) */}
        <path d="M86 330 Q170 290 250 300" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
        <path d="M110 360 Q200 318 290 330" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />

        {/* price sticker */}
        <g transform="translate(1320 360) rotate(-8)">
          <circle r="132" fill={C.brown} transform="translate(8 10)" />
          <circle r="132" fill={C.curry} stroke={C.brown} strokeWidth="6" />
          <circle r="114" fill="none" stroke={C.cream} strokeWidth="4" strokeDasharray="10 9" />
          <text y="-50" textAnchor="middle" className="na-tabe">ナン食べ放題</text>
          <text y="56" textAnchor="middle" className="na-price">¥980</text>
          <text y="92" textAnchor="middle" className="na-tax">税込</text>
        </g>
        {/* vertical tag */}
        <g transform="translate(36 220)">
          <rect width="84" height="440" fill={C.black} />
          <rect x="6" y="6" width="72" height="428" fill="none" stroke={C.curry} strokeWidth="3" />
          <text x="42" y="30" className="na-tag" writingMode="tb">本格インドカレー</text>
        </g>

        <Headline rm={rm} />

        {/* footer band */}
        <rect y="716" width={NAAN_AD_W} height="84" fill={C.ink} />
        <rect y="712" width={NAAN_AD_W} height="6" fill={C.curry} />
        <g transform="translate(40 734)">
          <path d="M0 0h26a24 24 0 0 1 0 48H0z" fill="none" stroke={C.curry} strokeWidth="6" strokeLinejoin="round" />
          <circle cx="58" cy="24" r="7" fill="none" stroke={C.curry} strokeWidth="6" />
        </g>
        <text x="126" y="776" className="na-house">NAND HOUSE</text>
        <text x="520" y="772" className="na-walk">渋谷駅 徒歩3分</text>
        <text x="1368" y="770" textAnchor="end" className="na-spons">sponsored by</text>
        <text x="1560" y="776" textAnchor="end" className="na-figur">Figur</text>
      </g>
    </svg>
  );
}
