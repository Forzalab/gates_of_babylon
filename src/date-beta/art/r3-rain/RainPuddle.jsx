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
      <path d="M1124 380 L1136 480 L1164 480 L1176 380Z M1264 384 L1258 480 L1288 480 L1316 384Z" fill="#2b3550" />
      <path d="M1110 480 Q1220 450 1330 480 L1350 760 Q1220 800 1090 760Z" fill="url(#pd-you)" />
      
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

// ---- FRONT: the real shoes, seen from above and a little in front (toes toward the camera's bottom edge).
// research/sprint-0930/legs (R7): built on a grid, local (0, 0) = the toe's water contact; the leg rises from the
// ankle opening (y ~ -80) toward the lens and leaves the frame under the umbrella rim (y < 190), so it is foreshortened:
// wider the nearer it gets. Her canon (nanda.js): pin leg 6 u : shoe 18 u -> 26 px : 78 px here; the pink band near the
// top of the pin; the plum shoe + the pink strap. Your sneaker is 1.3x her shoe (a man's foot = a head; hers = her canon).
// Light: the dusk sky above (a cool lilac sheen on the top planes), the warm lamp reflected at the lower right (a warm
// glint on the right-hand toe edges), no cast shadow on water: a dark contact line, a meniscus ring, the toe's own
// flipped reflection just below it (darker, rippled by the plane's rings).
function WaterLine({ w }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx={w * 0.62} ry={w * 0.13} fill="#141828" opacity=".55" />
      <ellipse cx="0" cy="-2" rx={w * 0.5} ry={w * 0.08} fill="#0b0d18" opacity=".75" />
      <ellipse cx="0" cy="2" rx={w * 0.62} ry={w * 0.13} fill="none" stroke="#e4ebf8" strokeWidth="2.4" opacity=".65" />
    </g>
  );
}
function HerShoe({ x, y, r, k = 0.9 }) {
  const shoe = 'M-35 -84 Q-44 -46 -36 -16 Q-22 6 0 6 Q22 6 36 -16 Q44 -46 35 -84 Q0 -100 -35 -84Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`}>
      {/* the toe's reflection (flipped, darker, short: the water drinks it) */}
      <path d={shoe} transform="translate(0 8) scale(1 -.42)" fill="#2a0f2c" opacity=".6" />
      <WaterLine w={84} />
      {/* the pin leg (her canon: white lead, pink rim, the pink band near the top), widening toward the lens */}
      {/* (the leg stays plumb on screen: only the foot turns in, the shin does not follow the toe) */}
      <g transform={`rotate(${-r} 0 -82)`}>
        <path d="M-13 -80 L-16 -260 L16 -260 L13 -80Z" fill="#fff" stroke="#d1177f" strokeWidth="5" strokeLinejoin="round" />
        <path d="M-15 -186 L15 -186 L15 -172 L-15 -172Z" fill="#ff5fa2" />
        <path d="M-6 -84 L-8 -256" stroke="#e9d9f4" strokeWidth="5" opacity=".9" />
      </g>
      {/* the shoe: plum dome, the sole lip at the toe, the ankle opening the pin stands in */}
      <path d={shoe} fill="#5a2350" stroke="#d1177f" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M-34 -18 Q-20 4 0 4 Q20 4 34 -18" stroke="#1a0612" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-82" rx="21" ry="9" fill="#24081e" />
      <path d="M-13 -82 L-13.5 -100 L13.5 -100 L13 -82Z" fill="#fff" />
      <path d="M-13 -83 Q0 -77 13 -83" stroke="#d1177f" strokeWidth="3" fill="none" />
      {/* the strap across the instep + its button (outer side) */}
      <path d="M-38 -60 Q0 -70 38 -60" stroke="#ff5fa2" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="-62" r="5.5" fill="#ffc4e6" stroke="#6b0f45" strokeWidth="2" />
      {/* wet: the toe drinks the water (darker), the sky sheen on the dome, the warm lamp glint, drops */}
      <path d="M-32 -26 Q0 -12 32 -26 Q24 2 0 3 Q-24 2 -32 -26Z" fill="#2a0a26" opacity=".5" />
      <path d="M-24 -50 Q-26 -30 -16 -18" stroke="#d8c8f0" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M26 -30 Q30 -18 22 -10" stroke="#ffd9a0" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx="10" cy="-40" r="3" fill="#fff" opacity=".9" /><circle cx="-6" cy="-10" r="2.2" fill="#fff" opacity=".8" />
    </g>
  );
}
function YourShoe({ x, y, r }) {
  const sole = 'M-46 -118 Q-54 -50 -44 -12 Q-24 10 0 10 Q24 10 44 -12 Q54 -50 46 -118 Q0 -134 -46 -118Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={sole} transform="translate(0 12) scale(1 -.38)" fill="#1a1e36" opacity=".6" />
      <WaterLine w={106} />
      {/* the jeans: from the hem break over the tongue up out of frame, widening toward the lens; a light crease */}
      <path d="M-44 -104 L-58 -330 L58 -330 L44 -104 Q0 -92 -44 -104Z" fill="#2b3550" />
      <path d="M-44 -104 L-58 -330 L-40 -330 L-30 -106Z" fill="#1f273e" />
      <path d="M8 -112 L12 -330" stroke="#4a5878" strokeWidth="6" opacity=".7" />
      {/* the sneaker: white sole rim (its thickness shows at the toe), purple upper, white toe cap, tongue + laces */}
      <path d={sole} fill="#d9d4de" stroke="#232033" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-44 -20 Q0 6 44 -20" stroke="#b9b3c8" strokeWidth="5" fill="none" />
      <path d="M-40 -112 Q-46 -54 -36 -26 Q0 -14 36 -26 Q46 -54 40 -112 Q0 -124 -40 -112Z" fill="#6c62c4" stroke="#232033" strokeWidth="3" />
      <path d="M-35 -30 Q0 -44 35 -30 Q32 -12 0 -6 Q-32 -12 -35 -30Z" fill="#e2dde6" stroke="#232033" strokeWidth="2.5" />
      <path d="M-14 -112 L-15 -58 Q0 -52 15 -58 L14 -112Z" fill="#4b4298" />
      {[-100, -86, -72].map((v) => <path key={v} d={`M-18 ${v} L18 ${v + 8} M18 ${v} L-18 ${v + 8}`} stroke="#f4f0e8" strokeWidth="4.5" strokeLinecap="round" />)}
      {/* the jeans hem breaks over the tongue (drawn after the laces) */}
      <path d="M-46 -108 Q0 -90 46 -108 L44 -124 Q0 -110 -44 -124Z" fill="#35415f" />
      {/* wet: darker toe, the sky sheen on the vamp, the warm glint on the right-hand toe edge, drops */}
      <path d="M-34 -30 Q0 -16 34 -30 Q30 -8 0 -4 Q-30 -8 -34 -30Z" fill="#1c2238" opacity=".35" />
      <path d="M-28 -90 Q-32 -64 -26 -44" stroke="#c9c2f6" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".65" />
      <path d="M38 -34 Q42 -20 34 -10" stroke="#ffd9a0" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx="-20" cy="-52" r="3" fill="#fff" opacity=".9" /><circle cx="18" cy="-18" r="2.4" fill="#fff" opacity=".8" />
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
      <HerShoe x={772} y={374} r={-12} /><HerShoe x={852} y={370} r={-2} />
      <YourShoe x={1150} y={380} r={6} /><YourShoe x={1290} y={384} r={-8} />
    </R3Scene>
  );
}
