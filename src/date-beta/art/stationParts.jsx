// stationParts.jsx: reusable station pieces for the naan platform (NaanPlatform.jsx) and any later station scene
// (alt's night platform can mount NaanPlatform time="night", or build from these parts).
// Flat fills + one gradient per sky, like Rooftop / Train. Traced by eye from Tony's 4 BY-NC refs (never committed,
// see research/date-beta-demo/naan/COMPOSITION.txt + CREDITS.txt).
// Time of day: every non-emitting colour goes through k(). Dusk: k = identity. Night: k = nightify (navy ramp, keeps a
// little of the hue). Light sources (tubes, signs, lit windows, the vending machine) skip k, so they stay lit.
import { rng, useStep } from './util.js';
import NaanAd, { NAAN_AD_W, NAAN_AD_H, NANDA_FRAME } from './NaanAd.jsx';

export const AD_RATIO = NAAN_AD_W / NAAN_AD_H; // 2:1

// Dusk palette: Pillow samples from the refs, lifted to flat fills (COMPOSITION.txt lists the raw samples).
export const P = {
  canopy: '#2d2542', canopyLit: '#4a3a66', fascia: '#3b2f55', rib: '#5a4a7e',
  far: '#8a78c8', mid: '#a47bbd', near: '#b4739e', lit: '#eea2c4', shade: '#6d58a0', deep: '#3d2c5e',
  winOn: '#ffd9a8', winOff: '#5c4b8c', winNight: '#ffd98a',
  silver: '#d9c9df', silverShade: '#a693bf', glass: '#34294f', glassSky: '#c889cf', glassLit: '#ffe9b0',
  floor: '#3b2b58', tactile: '#e0a24e', steel: '#6e5b8e', steelLit: '#b9a6cf', ink: '#1c1830',
  tube: '#eef0ff', rain: '#a9b8ee',
};

const memo = new Map();
export function nightify(hex) {
  if (!hex || hex[0] !== '#') return hex;
  if (memo.has(hex)) return memo.get(hex);
  const n = parseInt(hex.slice(1), 16), c = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  const L = 0.3 * c[0] + 0.55 * c[1] + 0.15 * c[2];
  const ramp = [0.04 + 0.34 * L, 0.06 + 0.4 * L, 0.16 + 0.55 * L];
  const out = `#${c.map((v, i) => Math.round(Math.min(1, ramp[i] * 0.8 + v * 0.11) * 255).toString(16).padStart(2, '0')).join('')}`;
  memo.set(hex, out);
  return out;
}
export const tint = (night) => (night ? nightify : (c) => c);
export const NIGHT_SKY = [[0, '#070a22'], [0.35, '#0f1638'], [0.58, '#1c2450'], [1, '#232a52']];

/* ---------------- camera + planes (one-point perspective) ---------------- */
// VP (cx, cy), focal f (px), eye height (m). World: x right, y up (floor 0), z away from us.
export const cam = (cx, cy, f, eye) => (x, y, z) => [cx + (f * x) / z, cy + (f * (eye - y)) / z];
const pts = (pr, list) => list.map((p) => pr(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
// Rectangle on a plane of constant x (a side wall, a train side): y in [ya, yb], z in [za, zb].
export const sideQuad = (pr, x, ya, yb, za, zb) => pts(pr, [[x, yb, za], [x, yb, zb], [x, ya, zb], [x, ya, za]]);
// Rectangle on a plane of constant y (floor, ceiling): x in [xa, xb], z in [za, zb].
export const flatQuad = (pr, y, xa, xb, za, zb) => pts(pr, [[xa, y, za], [xb, y, za], [xb, y, zb], [xa, y, zb]]);

/* ---------------- sky, clouds, city ---------------- */
export function Sky({ id, stops, night, h = 1080 }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
          {(night ? NIGHT_SKY : stops).map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width="1920" height={h} fill={`url(#${id})`} />
    </>
  );
}

// Dusk cumulus: lit pink top, lilac belly (the rooftop cloud's outline, so the two scenes rhyme). Night: rain cloud.
export const Cloud = ({ x, y, s = 1, flip = false, k = (c) => c }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M0 60 C-10 30 30 10 60 26 C70 -6 130 -12 150 20 C175 0 225 8 228 44 C262 44 272 70 250 80 L10 80 C-8 80 -8 64 0 60Z" fill={k('#f6b1dc')} />
    <path d="M10 80 L250 80 C262 76 268 70 262 64 C230 72 60 74 6 70 C0 76 4 80 10 80Z" fill={k('#b98ad8')} />
  </g>
);

// A row of flat buildings standing on `base`: front face, a warm-lit right face (low sun from the right, refs 1 + 2),
// sparse windows. Night: more windows on, and those skip k (they are the light). b = [x, w, top, side?].
export function Blocks({ b, base, tone = 'mid', seed = 1, win = 0.18, k = (c) => c, night = false }) {
  const rnd = rng(seed);
  const face = { far: P.far, mid: P.mid, near: P.near }[tone];
  const side = { far: '#b48fd0', mid: P.lit, near: '#f4b0c6' }[tone];
  const p = night ? Math.min(0.5, win * 2) : win;
  return b.map(([x, w, top, sd = 0], i) => {
    const cols = Math.max(1, Math.floor((w - 16) / 26)), rows = Math.max(1, Math.floor((base - top - 20) / 30));
    return (
      <g key={i}>
        <rect x={x} y={top} width={w} height={base - top} fill={k(face)} />
        {sd > 0 && <rect x={x + w} y={top + 6} width={sd} height={base - top - 6} fill={k(side)} />}
        <rect x={x} y={top} width={w} height="6" fill={k(tone === 'far' ? '#9d8bd6' : P.lit)} />
        {(tone !== 'far' || night) && Array.from({ length: rows * cols }, (_, j) => {
          const r = Math.floor(j / cols), c = j % cols, on = rnd() < p;
          if (tone === 'far' && !on) return null;
          return <rect key={j} x={x + 10 + c * 26} y={top + 18 + r * 30} width="14" height="16"
            fill={on ? (night ? P.winNight : P.winOn) : k(P.winOff)} opacity={on ? 0.9 : 0.55} />;
        })}
      </g>
    );
  });
}

/* ---------------- trains ---------------- */
// A train side in perspective: cars of 20 m, 4 doors each, windows between. stripe = [ya, yb, colour].
// Night: windows are lit from inside (they skip k).
export function PerspTrain({ pr, x, z0, cars, body, shade, stripe, stripe2, win = P.glass, sky = P.glassSky, k = (c) => c, night = false }) {
  const out = [];
  const W = night ? P.glassLit : k(win);
  const DOORS = [2.2, 7.0, 11.8, 16.6], WINS = [[0.5, 1.8], [3.8, 6.6], [8.6, 11.4], [13.4, 16.2], [18.2, 19.5]];
  for (let c = 0; c < cars; c++) {
    const a = z0 + c * 20.6;
    out.push(<polygon key={`b${c}`} points={sideQuad(pr, x, -0.3, 2.95, a, a + 20)} fill={k(body)} />);
    out.push(<polygon key={`r${c}`} points={sideQuad(pr, x, 2.95, 3.2, a, a + 20)} fill={k(shade)} />);
    if (stripe) out.push(<polygon key={`s${c}`} points={sideQuad(pr, x, stripe[0], stripe[1], a, a + 20)} fill={k(stripe[2])} />);
    if (stripe2) out.push(<polygon key={`t${c}`} points={sideQuad(pr, x, stripe2[0], stripe2[1], a, a + 20)} fill={k(stripe2[2])} />);
    WINS.forEach(([u, v], i) => {
      out.push(<polygon key={`w${c}-${i}`} points={sideQuad(pr, x, 1.05, 2.1, a + u, a + v)} fill={W} />);
      if (!night) out.push(<polygon key={`g${c}-${i}`} points={sideQuad(pr, x, 1.7, 2.1, a + u, a + v)} fill={sky} opacity=".55" />);
    });
    DOORS.forEach((d, i) => {
      out.push(<polygon key={`d${c}-${i}`} points={sideQuad(pr, x, -0.2, 2.35, a + d, a + d + 1.3)} fill={k(shade)} />);
      out.push(<polygon key={`dw${c}-${i}`} points={sideQuad(pr, x, 1.1, 2.0, a + d + 0.12, a + d + 0.58)} fill={W} />);
      out.push(<polygon key={`dv${c}-${i}`} points={sideQuad(pr, x, 1.1, 2.0, a + d + 0.72, a + d + 1.18)} fill={W} />);
      out.push(<polygon key={`ds${c}-${i}`} points={sideQuad(pr, x, -0.2, 2.35, a + d + 0.63, a + d + 0.67)} fill={k(P.deep)} />);
    });
    out.push(<polygon key={`gap${c}`} points={sideQuad(pr, x, -0.3, 3.2, a + 20, a + 20.6)} fill={P.ink} />);
  }
  return <g>{out}</g>;
}

/* ---------------- rain (night) ---------------- */
// Stepped like every loop in the demo: 3 poses x 500 ms, the streaks drop a third of their period per pose, so the
// loop is seamless. Reduced motion: one still pose. clip = a clipPath id (rain only falls outside the canopy).
const RAIN_PERIOD = 120;
export function Rain({ clip, rm, seed = 7, slant = -8 }) {
  const pose = useStep(3, 4, !rm);
  const rnd = rng(seed), lines = [];
  for (let cx = -40; cx < 1960; cx += 26) {
    const off = rnd() * RAIN_PERIOD, len = 22 + rnd() * 16;
    for (let y = -RAIN_PERIOD * 2 + off; y < 1080 + RAIN_PERIOD; y += RAIN_PERIOD) {
      lines.push(`M${(cx + rnd() * 10).toFixed(1)} ${y.toFixed(1)}l${slant} ${len.toFixed(1)}`);
    }
  }
  return (
    <g clipPath={clip ? `url(#${clip})` : undefined} className="np-rain">
      <path d={lines.join('')} transform={`translate(${(-slant * pose) / 3} ${(RAIN_PERIOD * pose) / 3})`} stroke={P.rain} strokeWidth="2.2" strokeLinecap="round" opacity=".5" />
    </g>
  );
}

/* ---------------- the ad ---------------- */
// The Hot NAAN ad (NaanAd.jsx, 2:1), mounted at width w. Night: unlit (a navy scrim over it) and the headline
// held on the NANDA frame (static, no glitch loop).
export function AdSlot({ x, y, w, rm, night }) {
  const h = w / AD_RATIO;
  return (
    <g data-ad="naan">
      <NaanAd x={x} y={y} width={w} rm={rm} hold={night ? NANDA_FRAME : undefined} />
      {night && <rect x={x} y={y} width={w} height={h} fill="#070b22" opacity=".58" />}
    </g>
  );
}

/* ---------------- signs (lit: they skip k) ---------------- */
// Station line sign, JR style (refs 3 + 4): big track number, JP line, EN line. dark = navy box (ref 3), else white (ref 4).
// rods = [[dx, topY]]: hangers from the sign's top edge up into the canopy (topY must land inside the canopy shape).
export function LineSign({ x, y, w, h, num, jp, jp2, en, dark = false, rods, k = (c) => c }) {
  const bg = dark ? '#1d2c3e' : '#f4f1ea', ink = dark ? '#f4f1ea' : '#1c1830', rim = dark ? '#0e1622' : '#23202c';
  return (
    <g className="np-sign">
      {rods.map(([dx, top]) => <rect key={dx} x={x + dx - 4} y={top} width="8" height={y - top} fill={k(P.ink)} />)}
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx="6" fill={rim} />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={bg} />
      {dark && <rect x={x} y={y} width={w} height="6" fill="#2f4660" />}
      <text x={x + h * 0.36} y={y + h * 0.77} textAnchor="middle" className="sg-num" style={{ fill: ink, fontSize: h * 0.78 }}>{num}</text>
      <rect x={x + h * 0.72} y={y + h * 0.14} width="4" height={h * 0.72} fill={dark ? '#3c5470' : '#c9c3d6'} />
      <text x={x + h * 0.84} y={y + h * 0.36} className="sg-jp" style={{ fill: ink, fontSize: h * 0.22 }}>{jp}</text>
      {jp2 && <text x={x + w - h * 0.1} y={y + h * 0.36} textAnchor="end" className="sg-jp2" style={{ fill: ink, fontSize: h * 0.17 }}>{jp2}</text>}
      <text x={x + h * 0.84} y={y + h * 0.66} className="sg-en" style={{ fill: ink, fontSize: h * 0.16 }}>{en}</text>
    </g>
  );
}

// Station name board (駅名標, JR-East style): white, green line band, station number badge.
export function NameBoard({ x, y, w = 400, h = 160, rods, k = (c) => c }) {
  const g = '#6cbb3c';
  return (
    <g className="np-sign">
      {rods.map(([dx, top]) => <rect key={dx} x={x + dx - 4} y={top} width="8" height={y - top} fill={k(P.ink)} />)}
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="6" fill="#23202c" />
      <rect x={x} y={y} width={w} height={h} fill="#f6f4ee" />
      <g transform={`translate(${x + 16} ${y + 20})`}>
        <rect width="54" height="54" rx="6" fill="#fff" stroke={g} strokeWidth="5" />
        <text x="27" y="23" textAnchor="middle" className="nb-code">JY</text>
        <text x="27" y="46" textAnchor="middle" className="nb-codenum">13</text>
      </g>
      <text x={x + w / 2 + 26} y={y + 66} textAnchor="middle" className="nb-jp">池NOR袋</text>
      <text x={x + w / 2 + 26} y={y + 96} textAnchor="middle" className="nb-en">Ike-NOR-kuro</text>
      <rect x={x} y={y + h - 44} width={w} height="44" fill={g} />
      <rect x={x + w / 2 - 22} y={y + h - 44} width="44" height="44" fill="#4f9a2a" />
      <text x={x + 12} y={y + h - 15} className="nb-next">◀ 目白 Mejiro</text>
      <text x={x + w - 12} y={y + h - 15} textAnchor="end" className="nb-next">Ōtsuka 大塚 ▶</text>
    </g>
  );
}

// Platform vending machine (lit day and night, so no k). kind = props.vending (the bento echo): that drink's slot
// in the top row is the umeboshi red or the tamagoyaki yellow.
export function Vending({ x, y, w, h, kind }) {
  const hot = kind === 'tamagoyaki' ? '#ffd23f' : '#d7263d';
  const cols = 5, bw = (w - 16) / cols;
  return (
    <g className="np-vending" data-kind={kind ?? 'umeboshi'}>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#c8243c" />
      <rect x={x + w - 8} y={y} width="8" height={h} fill="#f28a9a" />
      <rect x={x + 8} y={y + 10} width={w - 16} height={h * 0.5} fill="#f4f1ea" />
      {[0, 1, 2].map((r) => Array.from({ length: cols }, (_, c) => (
        <rect key={`${r}${c}`} x={x + 8 + c * bw + bw * 0.25} y={y + 18 + r * h * 0.16} width={bw * 0.5} height={h * 0.1} rx="2"
          fill={r === 0 && c === 2 ? hot : ['#5b7fc0', '#6fae6a', '#e0a24e', '#a57cc6', '#6c8aa8'][(r + c) % 5]} />
      )))}
      <rect x={x + 8} y={y + h * 0.66} width={w * 0.34} height={h * 0.1} fill="#3a1a22" />
      <rect x={x + w * 0.2} y={y + h * 0.84} width={w * 0.5} height={h * 0.08} fill="#2a1016" />
    </g>
  );
}

// A fluorescent tube (lit at night: a soft halo). pts = polygon points string.
export const Tube = ({ points, night }) => (
  <>
    {night && <polygon points={points} fill={P.tube} opacity=".35" stroke={P.tube} strokeWidth="14" strokeLinejoin="round" />}
    <polygon points={points} fill={night ? '#ffffff' : P.tube} />
  </>
);
