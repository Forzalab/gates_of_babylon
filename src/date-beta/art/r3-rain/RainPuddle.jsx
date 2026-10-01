// rain-puddle (v2-rain 2, "Close-up. Her shoes are wet. She walks in the puddles for you."): the camera looks straight
// DOWN at a big puddle on the wet asphalt (puddle refs 05 + 06). research/sprint-0930/puddle/PLAN.md.
// The multiplane sandwich: BACK = the vtrace (refs 03 asphalt + 01 Shinkai upside-down sky / pole / wires, graded to
// rain-dusk; puddle/pipeline/prep.py) | MID = the reflection plane, soft + rippled (feTurbulence -> feDisplacementMap,
// a 1.2 px blur, 3 slipped bands): the street lamps, the umbrella underside, you, and Nanda = her own sprite flipped
// (pin hands on the shaft, the NOT circle, no side-pony), her face in the upper-middle, clear of the dialogue box |
// FRONT = sharp cels: the real wet shoes at the top edge (hers + yours) stepping in, rain rings, petals + leaves.
// Motion: none but the stepped clock: 2 ring / ripple poses swapped every 625 ms (>= 500 ms), pose 0 only under rm.
import { useMemo } from 'react';
import { R3Scene, preloadTrace } from './parts.jsx';
import { TOD } from './tokens.js';
import { nandaSVG } from '../nanda.js';
import { useStep } from '../util.js';

preloadTrace('rain-puddle');
const T = 'rain-dusk';
// her reflection: sprite ground (0, 0) at her soles (x 800, y 330); flipped (sy < 0) and a little foreshortened
const RX = 800, RY = 330, SX = 1.75, SY = 1.6;
const HUB = [700, 800], UR = 440; // the umbrella's hub + canopy radius in the reflection (behind her: farthest up)
const f1 = (v) => Math.round(v * 10) / 10;

// ---- MID: what the water mirrors (drawn once into <defs>, used by the plane + the slipped bands)
function StreetLamp({ x, y, to, k = 1 }) {
  const t = TOD[T];
  return (
    <g>
      <path d={`M${x} ${y} L${to[0]} ${to[1]}`} stroke="#1a2032" strokeWidth={9 * k} strokeLinecap="round" opacity=".85" />
      <circle cx={x} cy={y} r={170 * k} fill={`url(#r3-glow-${T})`} />
      <circle cx={x} cy={y} r={60 * k} fill={`url(#r3-glow-${T})`} />
      <ellipse cx={x} cy={y} rx={22 * k} ry={14 * k} fill={t.lamp} />
      <ellipse cx={x} cy={y} rx={10 * k} ry={6 * k} fill="#fffaf0" />
    </g>
  );
}
function UmbrellaUnder() {
  // seen from below (the water shows its underside): 8 gores round the hub, darker toward the hub, ribs, a scalloped hem
  const n = 8, rim = (k, r = UR) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / n + 0.2; return [HUB[0] + Math.cos(a) * r, HUB[1] + Math.sin(a) * r * 0.92]; };
  const gore = (k) => {
    const [x0, y0] = rim(k), [x1, y1] = rim(k + 1), [mx, my] = rim(k + 0.5, UR * 0.9);
    return `M${HUB[0]} ${HUB[1]} L${f1(x0)} ${f1(y0)} Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}Z`;
  };
  return (
    <g>
      {Array.from({ length: n }, (_, k) => <path key={k} d={gore(k)} fill={k % 2 ? '#f0a6c6' : '#b04a78'} stroke="#4a0f30" strokeWidth="6" strokeLinejoin="round" />)}
      <circle cx={HUB[0]} cy={HUB[1]} r={UR * 0.55} fill="#4a0f30" opacity=".22" />
      <circle cx={HUB[0]} cy={HUB[1]} r={UR * 0.3} fill="#4a0f30" opacity=".22" />
      {Array.from({ length: n }, (_, k) => { const [x, y] = rim(k); return <path key={k} d={`M${HUB[0]} ${HUB[1]} L${f1(x)} ${f1(y)}`} stroke="#3a0a26" strokeWidth="7" />; })}
      <circle cx={HUB[0]} cy={HUB[1]} r="16" fill="#3a0a26" />
      {/* the shaft: from the hub up to her two pin hands (the pin nubs sit on it) */}
      <path d={`M${HUB[0]} ${HUB[1]} L588 460`} stroke="#5a1f40" strokeWidth="12" strokeLinecap="round" />
      <path d={`M${HUB[0] - 3} ${HUB[1]} L585 460`} stroke="#c56a95" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
function You() {
  // you, beside her under the same umbrella: dark jeans + jacket, soles at your shoes, fading down (farther = dimmer)
  return (
    <g opacity=".78">
      <defs>
        <linearGradient id="pd-you" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#222a40" /><stop offset="1" stopColor="#222a40" stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M1136 332 L1150 470 L1178 470 L1190 332Z M1238 336 L1232 470 L1262 470 L1290 336Z" fill="#2b3550" />
      <path d="M1120 470 Q1210 440 1300 470 L1330 760 Q1210 800 1096 760Z" fill="url(#pd-you)" />
      <ellipse cx="1164" cy="340" rx="30" ry="12" fill="#5a4fb8" /><ellipse cx="1262" cy="344" rx="30" ry="12" fill="#5a4fb8" />
    </g>
  );
}
function Plane({ her }) {
  return (
    <g id="pd-refl">
      {/* the wires (ref 01): thin dark lines across the upside-down sky, behind everyone */}
      <path d="M960 140 Q1380 380 1930 520 M1010 90 Q1420 330 1930 450 M-10 300 Q260 380 560 330" stroke="#1a2032" strokeWidth="4" fill="none" opacity=".8" />
      <StreetLamp x={330} y={560} to={[520, 470]} />
      <StreetLamp x={1590} y={640} to={[1420, 560]} k={0.8} />
      <UmbrellaUnder />
      <You />
      <g transform={`translate(${RX} ${RY}) scale(${SX} ${-SY})`} dangerouslySetInnerHTML={{ __html: her }} />
      {/* the water takes a little light out of everything it mirrors (slate), the far umbrella most */}
      <circle cx={HUB[0]} cy={HUB[1]} r={UR} fill="#2a3246" opacity=".18" />
    </g>
  );
}

// ---- FRONT: the real shoes, seen from straight above (toes toward the water / the camera's bottom edge)
function HerShoe({ x, y, r }) {
  // her plum shoe (her sprite's shoe + its pink strap) with the white sock rising out of frame; wet: dark toe, glints
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-50 -400 Q-40 -260 -34 -128 L34 -128 Q40 -260 50 -400Z" fill="#fff" stroke="#d1177f" strokeWidth="5" />
      <path d="M-24 -400 Q-20 -260 -18 -140" stroke="#ffe3f1" strokeWidth="12" fill="none" />
      <path d="M-37 -196 L37 -196 L36 -184 L-36 -184Z" fill="#ff5fa2" />
      <path d="M-56 -118 Q-64 -60 -52 -24 Q-30 10 0 10 Q30 10 52 -24 Q64 -60 56 -118 Q30 -140 0 -140 Q-30 -140 -56 -118Z" fill="#5a2350" stroke="#d1177f" strokeWidth="5" strokeLinejoin="round" />
      <path d="M-34 -128 Q0 -104 34 -128 L32 -136 Q0 -122 -32 -136Z" fill="#fff" />
      <path d="M-58 -100 Q0 -114 58 -100" stroke="#ff5fa2" strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="-104" r="8" fill="#ffc4e6" stroke="#6b0f45" strokeWidth="2.5" />
      <path d="M-44 -34 Q0 -12 44 -34 Q40 -10 0 6 Q-40 -10 -44 -34Z" fill="#2f0f2a" opacity=".55" />
      <path d="M-30 -62 Q-34 -38 -24 -22" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".75" />
      <circle cx="18" cy="-40" r="4" fill="#fff" opacity=".9" /><circle cx="-8" cy="-14" r="3" fill="#fff" opacity=".8" />
    </g>
  );
}
function YourShoe({ x, y, r }) {
  // your purple sneaker (the feet insert's colours): white toe cap + sole rim, laces, the jeans cuff rising out of frame
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-40 -380 L-38 -150 L40 -150 L42 -380Z" fill="#2b3550" />
      <path d="M-44 -170 L44 -170 L42 -146 L-42 -146Z" fill="#3a4768" />
      <path d="M-58 -150 Q-64 -40 -46 -6 Q0 20 46 -6 Q64 -40 58 -150 Q0 -170 -58 -150Z" fill="#fdfbf5" />
      <path d="M-50 -148 Q-56 -50 -40 -24 Q0 -6 40 -24 Q56 -50 50 -148 Q0 -164 -50 -148Z" fill="#8a7ff0" />
      <path d="M-40 -34 Q0 -48 40 -34 Q34 -8 0 2 Q-34 -8 -40 -34Z" fill="#fdfbf5" />
      <path d="M-16 -150 L-18 -70 L18 -70 L16 -150Z" fill="#5a4fb8" />
      {[-136, -116, -96, -78].map((v) => <path key={v} d={`M-20 ${v} l40 6`} stroke="#fdfbf5" strokeWidth="6" strokeLinecap="round" />)}
      <path d="M-40 -32 Q0 -12 40 -32 Q34 -6 0 4 Q-34 -6 -40 -32Z" fill="#1c2238" opacity=".4" />
      <circle cx="-26" cy="-60" r="4" fill="#fff" opacity=".9" /><circle cx="22" cy="-22" r="3" fill="#fff" opacity=".8" />
    </g>
  );
}
// a rain ring set: 2-4 thin light ellipses (top-down, a touch oblique), fainter outward
function Rings({ x, y, r, n = 3, o = 0.7 }) {
  return (
    <g fill="none" stroke="#e4ebf8">
      {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={x} cy={y} rx={r * (0.35 + (0.65 * (i + 1)) / n)} ry={r * 0.62 * (0.35 + (0.65 * (i + 1)) / n)} strokeWidth={3.2 - i * 0.7} opacity={o * (1 - i * 0.22)} />)}
    </g>
  );
}
// pose-keyed rings: the shoes' own step rings stay, the drop rings land somewhere else each pose (none on her face)
const RINGS = [
  [[806, 346, 150, 4, 0.75], [1212, 350, 130, 3, 0.6], [470, 430, 70, 3], [1010, 470, 60, 3], [540, 760, 80, 3], [1450, 420, 90, 3], [350, 690, 60, 2], [1640, 300, 50, 2]],
  [[806, 346, 170, 4, 0.7], [1212, 350, 150, 3, 0.55], [540, 520, 80, 3], [940, 440, 60, 3], [1100, 640, 70, 3], [1520, 520, 80, 3], [300, 400, 55, 2], [1700, 680, 60, 2]],
];
// petals + leaves floating ON the water (sharp, with a dark reflection under each)
const PETAL = 'M0 -14 C9 -12 12 -2 8 8 C5 14 -5 14 -8 8 C-12 -2 -9 -12 0 -14Z M0 -14 L-3 -8 L0 -10 L3 -8Z';
const LEAF = 'M0 -30 C18 -18 20 12 0 30 C-20 12 -18 -18 0 -30Z';
const FLOAT = [
  ['p', 1036, 560, 34, 1.6], ['p', 1070, 590, 160, 1.3], ['p', 470, 640, -40, 1.5], ['p', 360, 380, 70, 1.3], ['p', 1380, 470, 10, 1.6],
  ['p', 1500, 690, -80, 1.4], ['p', 980, 300, 120, 1.2], ['p', 250, 560, 30, 1.4], ['l', 1690, 420, 40, 1.6, '#9a4f45'], ['l', 180, 470, -30, 1.5, '#6f7a4a'],
  ['l', 1330, 700, 110, 1.3, '#a4603f'], ['p', 1580, 250, -20, 1.3],
];
function Floaters() {
  return (
    <g>
      {FLOAT.map(([k, x, y, rot, s, c], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
          <path d={k === 'p' ? PETAL : LEAF} transform="translate(2 4)" fill="#1a2032" opacity=".35" />
          <path d={k === 'p' ? PETAL : LEAF} fill={k === 'p' ? '#f6c3d4' : c} stroke={k === 'p' ? '#c2708f' : '#3a2420'} strokeWidth="1.6" />
          {k === 'l' && <path d="M0 -26 L0 26" stroke="#3a2420" strokeWidth="1.6" opacity=".7" />}
        </g>
      ))}
    </g>
  );
}

export default function RainPuddle({ rm }) {
  const pose = useStep(2, 5, !rm); // 625 ms a pose; none under reduced motion
  const her = useMemo(() => nandaSVG({ stage: 1, talk: false }), []);
  // slipped bands only across the legs / skirt and the umbrella hem, never across her face or fringe (y 500-720)
  const bands = pose ? [[430, 12, 9], [470, 8, -6], [740, 12, 7]] : [[410, 10, -8], [456, 12, 7], [760, 12, -7]];
  return (
    <R3Scene id="rain-puddle" tod={T} rm={rm}
      label="Close-up, looking down at a big puddle on wet asphalt at dusk. Two pairs of wet shoes step in at the top, hers and yours. In the water, upside down, Nanda under her pink umbrella, the evening sky, wires and street lamps, broken by rain rings. Petals float.">
      <defs>
        <filter id={`pd-ripple-${pose}`} filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
          <feTurbulence type="turbulence" baseFrequency="0.004 0.04" numOctaves="2" seed={pose ? 19 : 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.2" />
        </filter>
        {bands.map(([y, h], i) => <clipPath key={i} id={`pd-band-${i}`}><rect x="0" y={y} width="1920" height={h} /></clipPath>)}
      </defs>
      {/* MID: the reflection plane (rippled + soft), then its slipped bands (the image breaks where the rings pass) */}
      <g filter={`url(#pd-ripple-${pose})`} opacity=".92">
        <Plane her={her} />
      </g>
      {bands.map(([, , dx], i) => <use key={i} href="#pd-refl" clipPath={`url(#pd-band-${i})`} transform={`translate(${dx} 0)`} opacity=".45" />)}
      {/* FRONT: rings on the water, then the floaters, then the real shoes standing in it */}
      {RINGS[pose].map(([x, y, r, n, o], i) => <Rings key={i} x={x} y={y} r={r} n={n} o={o} />)}
      <Floaters />
      <HerShoe x={726} y={354} r={9} /><HerShoe x={884} y={348} r={-7} />
      <YourShoe x={1160} y={362} r={-4} /><YourShoe x={1272} y={366} r={5} />
    </R3Scene>
  );
}
