// cam-2 KUBRICK SYMMETRY (horror 3). School: Kubrick (*The Shining* hallway tracking shots, intertitles, dead-centre one-point
// framing) x Ozu-still symmetry in anime (Shaft / Evangelion corridor holds) x slow-dread corridor horror.
// Central theme: EVERYTHING IN ITS PLACE — the world is perfectly symmetrical because she arranged it.
// Grammar: intertitle -> a TRUE one-point dolly down the underpass (per-depth perspective, not a zoom: near tiles grow faster
// than far ones), mirrored ad pairs, a yellow tactile line dead centre; the ceiling tubes die far -> near one per 600 ms (held),
// and each time one dies she is one hard cut nearer. Intertitle "12:00" -> dolly into her genkan (her shoes, millimetre-perfect)
// -> the Kubrick stare, dead centre, chin down, eyes up.
// RM: the corridor is two held frames (lit / dark with her near); every other shot one held frame; hard cuts only.
import { memo } from 'react';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import CameraPiece from '../kit/Camera.jsx';
import { Frag, Nanda, ART } from '../kit/Sprite.jsx';
import { clamp, lerp, ease } from '../kit/time.js';
import { project, pt, quad, TUBES, tubesOut, herZ, HALF_W as W, FLOOR, CEIL, F } from './corridor.js';
import './kubrick.css';

const Black = memo(function Black() { return <div className="art kb-black" />; });

// light at depth z from the tubes still lit (gaussian falloff) + a little from the exit + fog
function lightAt(z, out) {
  let l = 0.08;
  TUBES.forEach((tz, i) => { const dead = i >= TUBES.length - out; if (!dead) l += Math.exp(-((z - tz) ** 2) / 5) * 0.9; });
  l += Math.exp(-((z - 40) ** 2) / 30) * 0.5;
  return clamp(l, 0, 1.1);
}
const mix = (rgb, l) => `rgb(${rgb.map((c) => Math.round(clamp(c * l, 0, 255))).join(',')})`;
const TILE = [207, 211, 204], TILE2 = [196, 201, 193], FLOORC = [84, 88, 86], CEILC = [52, 56, 55], STRIP = [232, 194, 30];

const ADS = [
  { z: 7, bg: '#fff8ea', band: '#d7102b', a: 'NOT', b: 'Sweet™', ink: '#b0123e' },
  { z: 13, bg: '#1f5fbf', band: '#ffffff', a: 'OR-SON', b: '24h', ink: '#ffffff' },
  { z: 19, bg: '#14100c', band: '#c9a878', a: 'XOR', b: 'Coffee', ink: '#f3e2c4' },
  { z: 25, bg: '#e9eef2', band: '#1e7fd6', a: 'BUFFER', b: 'in = out', ink: '#1e3a5a' },
  { z: 31, bg: '#fff8ea', band: '#d7102b', a: 'NOT', b: 'Sweet™', ink: '#b0123e' },
];

// text on a side wall: an affine approximation of the projection at the panel centre (fine for panels this size)
function WallText({ side, zc, yc, camZ, children, size = 0.34, cls }) {
  const x = side * W;
  const [cx, cy, k] = project(x, yc, zc, camZ);
  const [dx, dy] = project(x, yc, zc + 0.01, camZ);
  const u = side < 0 ? 1 : -1; // reading direction: left wall reads toward the vanishing point, right wall toward us
  const a = ((dx - cx) / 0.01) * u * 0.01, b = ((dy - cy) / 0.01) * u * 0.01;
  const d = k * 0.01;
  return <text transform={`matrix(${a} ${b} 0 ${d} ${cx} ${cy})`} textAnchor="middle" className={cls} style={{ fontSize: `${size * 100}px` }}>{children}</text>;
}

function Corridor({ camZ, out }) {
  const segs = [];
  const z0 = Math.max(0, Math.floor(camZ + 0.4));
  for (let z = 40 - 1; z >= z0; z--) {
    const za = Math.max(z, camZ + 0.4), zb = z + 1;
    const l = lightAt(z + 0.5, out) * (1 - clamp((z - camZ) / 60) * 0.6);
    const tile = (z % 2 ? TILE : TILE2);
    segs.push(
      <g key={z}>
        <polygon points={quad([-W, FLOOR, za], [-W, CEIL, za], [-W, CEIL, zb], [-W, FLOOR, zb], camZ)} fill={mix(tile, l)} />
        <polygon points={quad([W, FLOOR, za], [W, CEIL, za], [W, CEIL, zb], [W, FLOOR, zb], camZ)} fill={mix(tile, l)} />
        <polygon points={quad([-W, FLOOR, za], [W, FLOOR, za], [W, FLOOR, zb], [-W, FLOOR, zb], camZ)} fill={mix(FLOORC, l)} />
        <polygon points={quad([-0.26, FLOOR, za], [0.26, FLOOR, za], [0.26, FLOOR, zb], [-0.26, FLOOR, zb], camZ)} fill={mix(STRIP, l)} />
        <polygon points={quad([-W, CEIL, za], [W, CEIL, za], [W, CEIL, zb], [-W, CEIL, zb], camZ)} fill={mix(CEILC, l)} />
        {/* tile joints (vertical) + the tactile studs */}
        <polyline points={`${pt(-W, FLOOR, zb, camZ)} ${pt(-W, CEIL, zb, camZ)} ${pt(W, CEIL, zb, camZ)} ${pt(W, FLOOR, zb, camZ)}`} fill="none" stroke={mix([150, 155, 148], l)} strokeWidth="1.5" />
      </g>,
    );
  }
  // horizontal tile courses on both walls (straight lines to the vanishing point)
  const courses = [];
  for (let y = FLOOR + 0.3; y < CEIL; y += 0.3) {
    for (const s of [-1, 1]) courses.push(<line key={`${s}${y}`} x1={project(s * W, y, camZ + 0.4, camZ)[0]} y1={project(s * W, y, camZ + 0.4, camZ)[1]} x2="960" y2="540" stroke="rgba(0,0,0,.18)" strokeWidth="1.5" />);
  }
  // mirrored ads: identical pairs on both walls (the symmetry is hers)
  const ads = ADS.filter((ad) => ad.z + 2.2 > camZ + 0.5).map((ad) => {
    const za = Math.max(ad.z, camZ + 0.5), zb = ad.z + 2.2, lit = 0.95;
    return [-1, 1].map((s) => (
      <g key={`${ad.z}${s}`}>
        <polygon points={quad([s * W * 0.999, -0.62, za], [s * W * 0.999, 0.92, za], [s * W * 0.999, 0.92, zb], [s * W * 0.999, -0.62, zb], camZ)} fill="#3a3f3c" />
        <polygon points={quad([s * W * 0.998, -0.54, za], [s * W * 0.998, 0.84, za], [s * W * 0.998, 0.84, zb], [s * W * 0.998, -0.54, zb], camZ)} fill={ad.bg} opacity={lit} />
        <polygon points={quad([s * W * 0.997, -0.54, za], [s * W * 0.997, -0.2, za], [s * W * 0.997, -0.2, zb], [s * W * 0.997, -0.54, zb], camZ)} fill={ad.band} />
        {za === ad.z && <>
          <WallText side={s} zc={ad.z + 1.1} yc={0.36} camZ={camZ} size={0.42} cls="kb-ad" ><tspan fill={ad.ink}>{ad.a}</tspan></WallText>
          <WallText side={s} zc={ad.z + 1.1} yc={0.02} camZ={camZ} size={0.24} cls="kb-ad2"><tspan fill={ad.ink}>{ad.b}</tspan></WallText>
        </>}
      </g>
    ));
  });
  // ceiling tubes
  const tubes = TUBES.map((tz, i) => {
    if (tz + 0.5 < camZ + 0.5) return null;
    const dead = i >= TUBES.length - out;
    const za = Math.max(tz - 0.5, camZ + 0.5);
    return <polygon key={tz} points={quad([-0.55, CEIL - 0.01, za], [0.55, CEIL - 0.01, za], [0.55, CEIL - 0.01, tz + 0.5], [-0.55, CEIL - 0.01, tz + 0.5], camZ)} fill={dead ? '#3a3e3c' : '#f2fbf6'} className={dead ? '' : 'kb-tube'} />;
  });
  // the exit at the far end: warm stair light, the only constant
  const exit = quad([-0.8, FLOOR, 40], [-0.8, 0.6, 40], [0.8, 0.6, 40], [0.8, FLOOR, 40], camZ);
  const endwall = quad([-W, FLOOR, 40], [-W, CEIL, 40], [W, CEIL, 40], [W, FLOOR, 40], camZ);
  // Nanda, dead centre, backlit
  const hz = herZ(out);
  const [fx, fy, k] = project(0, FLOOR, hz, camZ);
  const s = (1.62 * k) / 560;
  return (
    <svg className="fg kb-corridor" viewBox="0 0 1920 1080" aria-hidden="true">
      <rect width="1920" height="1080" fill="#050505" />
      <polygon points={endwall} fill={mix([90, 92, 90], lightAt(39, out))} />
      <polygon points={exit} fill="#ffe7b0" className="kb-exit" />
      {segs}
      {courses}
      {ads}
      {tubes}
      <Frag html={ART.sil('nanda', fx, fy, s)} className="kb-her" />
    </svg>
  );
}

const CORRIDOR_DUR = 13000;
const SHOTS = [
  { id: 'intertitle', dur: 2600, Scene: Black, props: {}, cut: 'hard', keys: [{ t: 0 }], layers: () => <div className="kb-title"><b>THE UNDERPASS</b><span>23 : 52</span></div> },
  {
    id: 'dolly', dur: CORRIDOR_DUR, Scene: Black, props: {}, cut: 'hard', keys: [{ t: 0 }],
    sub: [{ at: 1200, text: 'Your steps, her steps. Always an even count.' }, { at: 6200, text: '' }, { at: 9000, text: "NANDA: Don't read the ads. Read me." }],
    layers: ({ local, rm }) => {
      const t = rm ? (local < CORRIDOR_DUR / 2 ? 2000 : CORRIDOR_DUR) : local;
      const camZ = lerp(0, 21, ease.linear(clamp(t / CORRIDOR_DUR))); // Kubrick: a constant, patient track
      return <><Corridor camZ={camZ} out={tubesOut(t)} /><div className="a-vig kb-vig" /></>;
    },
  },
  { id: 'intertitle-2', dur: 2000, Scene: Black, props: {}, cut: 'hard', keys: [{ t: 0 }], layers: () => <div className="kb-title"><b>12 : 00</b></div> },
  {
    id: 'genkan', dur: 6400, Scene: Genkan, props: { insert: false }, cut: 'hard',
    keys: [{ t: 0, x: 970, y: 520, s: 1.0 }, { t: 6400, x: 970, y: 560, s: 1.32, e: 'linear' }],
    sub: [{ at: 900, text: 'Her shoes. Lined up to the millimetre.' }],
    layers: () => <div className="kb-cold" />,
  },
  {
    id: 'stare', dur: 6600, Scene: Black, props: {}, cut: 'hard', keys: [{ t: 0 }],
    sub: [{ at: 1800, text: 'NANDA: Shoes off. Everything in its place.' }],
    layers: ({ local, rm }) => {
      const k = rm ? 1 : ease.linear(clamp(local / 6600));
      const sc = lerp(1.35, 1.6, k);
      return (
        <svg className="fg kb-stare" viewBox="0 0 1920 1080" aria-hidden="true">
          <defs><radialGradient id="kb-top" cx="960" cy="90" r="700" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient></defs>
          {/* her hallway: symmetric frames receding */}
          {[0, 1, 2, 3, 4].map((i) => { const w = 1500 - i * 260, h = 1000 - i * 170; return <rect key={i} x={960 - w / 2} y={540 - h / 2 - 20} width={w} height={h} fill="none" stroke="#3a2e28" strokeWidth={10 - i * 1.6} />; })}
          <rect x="880" y="360" width="160" height="200" fill="#ffe7b0" opacity=".4" />
          <Nanda face="wide" pin="red" x={960 - 300 * sc} y={560 - 430 * sc} s={sc} className="kb-bust" />
          <rect width="1920" height="1080" fill="url(#kb-top)" />
        </svg>
      );
    },
  },
];

export default function Kubrick({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="kubrick" tag="cam-2 · kubrick symmetry" />;
}
export { F };
