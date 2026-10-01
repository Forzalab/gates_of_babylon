// APARTMENT, traced (art id `apartment-trace`): "Four floors. One window lit." Trace = the rainy walk-up ref
// (research/refs/rainy-apartment-street), full height on the left (812 px, its own viewBox). The hand overlay builds
// the right 1108 px on the ref's vanishing point (739, 626): the near side of the street (two-storey houses, a block
// wall, the sidewalk), the wet road with light reflections, a utility pole with a street lamp and wires strung back
// to the ref's pole, far towers, a stormy sky. On the ref: ONE lit window on the top floor (hers), a clean
// vertical sign (コーポ NAND).
// Light: the street lamp (warm) + windows; rain is the only motion (Rain.jsx, 2 poses x 500 ms; rm = still).
import Rain from '../Rain.jsx';
import { rng } from '../util.js';
import { camera, traceUrl, preloadTrace, Grade } from './kit.jsx';

preloadTrace('apartment');

const C = camera({ vx: 739, vy: 626, f: 900, eye: 1.5 });
const { P, pts } = C;
const f1 = (n) => n.toFixed(1);
// street (metres): road X -0.2 .. 3.8, sidewalk to 5.2, block wall at 5.2, house fronts at 6
const RD0 = -0.2, RD1 = 3.8, WALL = 5.2, HX = 6, ZN = 2.4, ZF = 70;
const HOUSES = [{ z0: 6, z1: 13, lit: [[0, 1], [1, 2]] }, { z0: 14, z1: 21, lit: [[0, 0], [1, 1]] }, { z0: 22, z1: 29, lit: [[1, 0]] }, { z0: 30, z1: 36, lit: [[0, 1]] }];
const EAVE = 5.4;

function House({ z0, z1, lit, k }) {
  const face = pts([[HX, 0, z0], [HX, 0, z1], [HX, EAVE, z1], [HX, EAVE, z0]]);
  const wins = [];
  for (const fl of [0, 1]) for (let i = 0; i < 3; i++) {
    const za = z0 + 1 + i * ((z1 - z0 - 2) / 3), zb = za + 1.3, ya = fl ? 3.3 : 0.9, yb = ya + 1.1;
    const on = lit.some(([a, b]) => a === fl && b === i);
    wins.push(<polygon key={`${fl}${i}`} points={pts([[HX - 0.01, ya, za], [HX - 0.01, ya, zb], [HX - 0.01, yb, zb], [HX - 0.01, yb, za]])} fill={on ? '#ffc070' : '#121826'} opacity={on ? 0.95 : 1} filter={on ? 'url(#ap-glow)' : undefined} />);
    if (on) wins.push(<polyline key={`c${fl}${i}`} points={pts([[HX - 0.02, ya, (za + zb) / 2], [HX - 0.02, yb, (za + zb) / 2]])} stroke="#7a4a2a" strokeWidth="3" />);
  }
  return (
    <g>
      <polygon points={face} fill={k % 2 ? '#1c2332' : '#222a3b'} />
      {/* lamp-side rim on the near edge + a door with its own small lamp */}
      <polygon points={pts([[HX - 0.01, 0, z0], [HX - 0.01, 0, z0 + 0.25], [HX - 0.01, EAVE, z0 + 0.25], [HX - 0.01, EAVE, z0]])} fill="#ffc98a" opacity=".08" />
      <polygon points={pts([[HX - 0.01, 0, z1 - 1.6], [HX - 0.01, 0, z1 - 0.7], [HX - 0.01, 2.1, z1 - 0.7], [HX - 0.01, 2.1, z1 - 1.6]])} fill="#10141e" />
      <circle cx={f1(P(HX - 0.02, 2.35, z1 - 1.15)[0])} cy={f1(P(HX - 0.02, 2.35, z1 - 1.15)[1])} r={f1(Math.max(2, 900 * 0.1 / z1))} fill="#ffe0a0" filter="url(#ap-glow)" />
      {/* 2nd-floor balcony rail */}
      <polygon points={pts([[HX - 0.5, 2.9, z0 + 1], [HX - 0.5, 2.9, z1 - 1], [HX - 0.5, 3.8, z1 - 1], [HX - 0.5, 3.8, z0 + 1]])} fill="none" stroke="#3a4458" strokeWidth="3" />
      {/* floor band + eave overhang (dark underside, we are below it) */}
      <polygon points={pts([[HX - 0.02, 2.7, z0], [HX - 0.02, 2.7, z1], [HX - 0.02, 2.85, z1], [HX - 0.02, 2.85, z0]])} fill="#2a3242" />
      <polygon points={pts([[HX - 0.6, EAVE, z0 - 0.4], [HX - 0.6, EAVE, z1 + 0.4], [HX, EAVE, z1 + 0.4], [HX, EAVE, z0 - 0.4]])} fill="#141a26" />
      <polygon points={pts([[HX - 0.6, EAVE, z0 - 0.4], [HX - 0.6, EAVE, z1 + 0.4], [HX - 0.6, EAVE + 0.25, z1 + 0.4], [HX - 0.6, EAVE + 0.25, z0 - 0.4]])} fill="#2e3a52" />
      {wins}
    </g>
  );
}

function Reflection({ X, Y, Z, w = 0.5, color = '#ffc070', o = 0.35 }) {
  // a light's streak on the wet road: from its foot down toward the viewer, as long as the light is high
  const [x, gy] = P(X, 0, Z), [, ly] = P(X, Y, Z);
  const len = (gy - ly) * 0.8, ww = (C.f * w * 0.5) / Z;
  return <ellipse cx={f1(x)} cy={f1(gy + len / 2)} rx={f1(ww)} ry={f1(len / 2)} fill={color} opacity={o * 0.6} filter="url(#ap-blur)" />;
}

export default function ApartmentTrace({ rm }) {
  const lamp = P(3.3, 5.1, 7);
  const r = rng(21);
  const towers = Array.from({ length: 7 }, (_, i) => ({ x: 800 + i * 48 + r() * 20, w: 34 + r() * 30, h: 120 + r() * 200 }));
  // wires: sag between the ref's pole (stage ~564, top) and ours
  const pole = { X: 4.4, Z: 7 };
  const [px, pb] = P(pole.X, 0, pole.Z), pw = (C.f * 0.3) / pole.Z;
  const [, ptop] = P(pole.X, 10, pole.Z);
  const wire = (y0, y1, sag, x0 = 564, x1 = px) => `M${x0} ${y0}Q${(x0 + x1) / 2} ${Math.max(y0, y1) + sag} ${x1} ${y1}`;
  return (
    <div className="art apartment-trace">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" role="img"
        aria-label="Night, rain: a four-floor walk-up on the left with one warm window lit on the top floor, bikes under a shelter, a wet narrow street with low houses and a street lamp on a utility pole.">
        <defs>
          <linearGradient id="ap-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2433" /><stop offset=".45" stopColor="#34435c" /><stop offset=".6" stopColor="#4d5a70" /></linearGradient>
          <linearGradient id="ap-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4458" /><stop offset=".2" stopColor="#262e3e" /><stop offset="1" stopColor="#141a26" /></linearGradient>
          <linearGradient id="ap-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="1" /></linearGradient>
          <mask id="ap-seam" maskContentUnits="userSpaceOnUse"><rect x="700" y="0" width="1220" height="1080" fill="#fff" /></mask>
          <radialGradient id="ap-lamp"><stop offset="0" stopColor="#fff0c8" stopOpacity=".95" /><stop offset=".2" stopColor="#ffb860" stopOpacity=".35" /><stop offset="1" stopColor="#ffb860" stopOpacity="0" /></radialGradient>
          <radialGradient id="ap-win"><stop offset="0" stopColor="#ffd890" stopOpacity=".8" /><stop offset="1" stopColor="#ffb050" stopOpacity="0" /></radialGradient>
          <filter id="ap-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="ap-soft"><feGaussianBlur stdDeviation="0.9" /></filter>
          <linearGradient id="ap-tfade" x1="0" y1="0" x2="1" y2="0"><stop offset=".93" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="ap-trace-edge" maskContentUnits="userSpaceOnUse"><rect x="0" y="0" width="812" height="1080" fill="url(#ap-tfade)" /></mask>
          <filter id="ap-blur" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width="1920" height="1080" fill="#1a2030" />
        {/* the right side, built on the ref's vanishing point, feathered over the trace's right edge */}
        <g mask="url(#ap-seam)" filter="url(#ap-soft)">
          <rect width="1920" height="700" fill="url(#ap-sky)" />
          <g fill="#243047" opacity=".9">
            <path d="M780 120C1000 90 1300 140 1560 100C1700 80 1860 110 1920 96V190C1700 220 1400 170 1100 214C960 234 860 200 780 214Z" />
            <path d="M780 300C1000 270 1260 320 1500 286C1700 262 1860 300 1920 290V340C1700 360 1400 330 1150 360C980 380 860 350 780 360Z" opacity=".6" />
          </g>
          <ellipse cx="760" cy="600" rx="420" ry="90" fill="#ffb070" opacity=".12" />
          {towers.map((t, i) => (
            <g key={i}>
              <rect x={f1(t.x)} y={f1(626 - t.h)} width={f1(t.w)} height={f1(t.h)} fill="#3b465c" opacity=".85" />
              {Array.from({ length: 6 }, (_, j) => r() < 0.35 && <rect key={j} x={f1(t.x + 6 + (j % 2) * (t.w / 2 - 4))} y={f1(626 - t.h + 14 + Math.floor(j / 2) * 24)} width="6" height="8" fill={r() < 0.5 ? '#ffd27a' : '#bfe8ff'} opacity=".8" />)}
            </g>
          ))}
          {/* road, sidewalk, block wall (far to near order is inherent: all on the ground plane) */}
          <polygon points={pts([[RD0, 0, ZN], [RD1, 0, ZN], [RD1, 0, ZF], [RD0, 0, ZF]])} fill="url(#ap-road)" />
          <polygon points={pts([[RD1, 0, ZN], [WALL, 0, ZN], [WALL, 0, ZF], [RD1, 0, ZF]])} fill="#2c3446" />
          <polyline points={pts([[RD1, 0.001, ZN], [RD1, 0.001, ZF]])} stroke="#8a94a8" strokeWidth="3" opacity=".6" />
          <polyline points={pts([[RD1 - 0.3, 0.001, ZN], [RD1 - 0.3, 0.001, ZF]])} stroke="#dfe6f0" strokeWidth="4" opacity=".55" />
          {[...HOUSES].reverse().map((h, k) => <House key={h.z0} {...h} k={k} />)}
          <polygon points={pts([[WALL, 0, ZN], [WALL, 0, ZF], [WALL, 1.3, ZF], [WALL, 1.3, ZN]])} fill="#5a6274" />
          <polygon points={pts([[WALL, 1.3, ZN], [WALL, 1.3, ZF], [WALL + 0.15, 1.3, ZF], [WALL + 0.15, 1.3, ZN]])} fill="#8a92a4" />
          {[3, 4, 5, 6, 7, 8, 10, 12, 16].map((z) => <polyline key={z} points={pts([[WALL - 0.01, 0, z], [WALL - 0.01, 1.3, z]])} stroke="#3e4658" strokeWidth="2" />)}
          {[0.43, 0.86].map((y) => <polyline key={y} points={pts([[WALL - 0.01, y, ZN], [WALL - 0.01, y, ZF]])} stroke="#3e4658" strokeWidth="2" />)}
          {/* gates in the wall */}
          {[13.4, 21.4].map((z) => <polygon key={z} points={pts([[WALL - 0.02, 0, z - 0.5], [WALL - 0.02, 0, z + 0.5], [WALL - 0.02, 1.3, z + 0.5], [WALL - 0.02, 1.3, z - 0.5]])} fill="#1a1e2a" />)}
          {/* reflections on the wet road: the lamp + lit windows */}
          <Reflection X={3.0} Y={5.1} Z={7} w={0.6} o={0.45} />
          <Reflection X={3.6} Y={4} Z={11} w={0.4} o={0.25} />
          <Reflection X={3.6} Y={1.4} Z={17} w={0.3} o={0.25} />
          <Reflection X={1.6} Y={3} Z={30} w={0.5} color="#bfe8ff" o={0.2} />
          {/* puddles */}
          {[[1.0, 4.2, 0.8], [2.4, 6, 0.6], [0.6, 9, 0.5]].map(([x, z, s]) => <polygon key={z} points={pts([[x - s, 0.002, z - s * 0.4], [x + s, 0.002, z - s * 0.4], [x + s * 0.8, 0.002, z + s * 0.4], [x - s * 0.7, 0.002, z + s * 0.4]])} fill="#5a6a88" opacity=".35" />)}
          {/* the utility pole, its lamp and transformer */}
          <rect x={f1(px - pw / 2)} y={f1(ptop)} width={f1(pw)} height={f1(pb - ptop)} fill="#2a2e38" />
          <rect x={f1(px - pw / 2 + pw * 0.62)} y={f1(ptop)} width={f1(pw * 0.2)} height={f1(pb - ptop)} fill="#ffc98a" opacity=".2" />
          <rect x={f1(px - pw * 1.8)} y={f1(P(pole.X, 8.2, pole.Z)[1])} width={f1(pw * 3.6)} height="12" fill="#22262e" />
          <rect x={f1(px + pw * 0.5)} y={f1(P(pole.X, 7.4, pole.Z)[1])} width={f1(pw * 1.4)} height={f1(pw * 1.8)} rx="8" fill="#39404c" />
          <path d={`M${f1(px)} ${f1(P(pole.X, 5.4, pole.Z)[1])}Q${f1(lamp[0] + 30)} ${f1(lamp[1] - 40)} ${f1(lamp[0])} ${f1(lamp[1] - 6)}`} stroke="#22262e" strokeWidth="8" fill="none" />
          <ellipse cx={f1(lamp[0])} cy={f1(lamp[1])} rx="22" ry="9" fill="#fff4d8" />
          <circle cx={f1(lamp[0])} cy={f1(lamp[1])} r="260" fill="url(#ap-lamp)" style={{ mixBlendMode: 'screen' }} />
          <polygon points={pts([[2.9, 5.0, 7], [3.7, 5.0, 7], [4.6, 0, 8.2], [1.6, 0, 8.2]])} fill="#ffd8a0" opacity=".07" />
        </g>
        {/* wires: back to the ref's pole and off the right edge */}
        <g stroke="#0e1118" strokeWidth="2.5" fill="none" opacity=".9">
          <path d={wire(22, P(pole.X, 8.25, pole.Z)[1], 70)} />
          <path d={wire(40, P(pole.X, 8.1, pole.Z)[1] + 4, 110)} />
          <path d={wire(62, P(pole.X, 7.6, pole.Z)[1], 150)} />
          <path d={`M${f1(px)} ${f1(P(pole.X, 8.25, pole.Z)[1])}Q1700 120 1920 60`} />
          <path d={`M${f1(px)} ${f1(P(pole.X, 7.6, pole.Z)[1])}Q1720 200 1920 170`} />
        </g>

        {/* the trace (the ref, own viewBox) on top of the left: the building + bike shelter */}
        <image href={traceUrl('apartment')} x="0" y="0" width="812" height="1080" preserveAspectRatio="none" mask="url(#ap-trace-edge)" />
        {/* hand fixes over the trace (the 324 px ref loses its thin structure): walkway lamps, rails, stair flights,
            the bike-shelter roof edge, the vending machine */}
        <g style={{ mixBlendMode: 'screen' }}>
          {[[482, 138], [307, 294], [482, 376], [307, 514]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="70" fill="url(#ap-win)" opacity=".7" />)}
        </g>
        {[[482, 138], [307, 294], [482, 376], [307, 514]].map(([x, y]) => <rect key={`l${x}${y}`} x={x - 9} y={y - 4} width="18" height="8" rx="3" fill="#fff0c8" />)}
        <g stroke="#15171f" strokeWidth="4" fill="none">
          <rect x="113" y="318" width="126" height="170" />
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={113 + i * 14} y1="318" x2={113 + i * 14} y2="488" strokeWidth="2.5" />)}
          <path d="M313 188L426 288M313 206L426 306" />
          <path d="M313 414L439 551M313 432L439 569" />
          <rect x="426" y="250" width="113" height="112" />
          {Array.from({ length: 8 }, (_, i) => <line key={`b${i}`} x1={426 + i * 16} y1="250" x2={426 + i * 16} y2="362" strokeWidth="2.5" />)}
        </g>
        <g stroke="#ffcf8a" strokeWidth="1.6" opacity=".55" fill="none">
          <path d="M113 317H239M313 187L426 287M313 413L439 550M426 249H539" />
        </g>
        <rect x="0" y="488" width="300" height="16" fill="#23262f" /><rect x="0" y="486" width="300" height="3" fill="#ffcf8a" opacity=".4" />
        {/* under the shelter it is dark: the bikes read as a mass, a few wet rims catch the vending light */}
        <linearGradient id="ap-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0f16" stopOpacity=".2" /><stop offset=".5" stopColor="#0c0f16" stopOpacity=".6" /><stop offset="1" stopColor="#0c0f16" stopOpacity=".8" /></linearGradient>
        <path d="M200 1080L230 700C300 660 520 650 690 690L760 1080Z" fill="url(#ap-under)" />
        <g stroke="#bfe8ff" strokeWidth="2.5" fill="none" opacity=".45">
          {[[300, 900, 70], [420, 860, 62], [540, 830, 54], [640, 800, 46], [360, 1010, 80]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={r * 0.55} ry={r} />)}
        </g>
        {/* bike shelter: the wet curved roof edge catching the lamps */}
        <path d="M262 628C420 622 560 640 680 668C720 678 740 700 748 740" stroke="#10131a" strokeWidth="14" fill="none" />
        <path d="M262 622C420 616 560 634 680 662C718 672 738 694 746 734" stroke="#bcd0f0" strokeWidth="3" fill="none" opacity=".6" />
        {/* the vending machine, lit (drinks, one Figur can) */}
        <g>
          <rect x="44" y="640" width="112" height="262" rx="6" fill="#2a3040" />
          <rect x="54" y="652" width="92" height="150" rx="3" fill="#dff4ff" />
          {[0, 1, 2, 3].map((row) => Array.from({ length: 5 }, (_, i) => <rect key={`${row}${i}`} x={58 + i * 18} y={660 + row * 35} width="12" height="24" rx="3" fill={['#ff7fb4', '#7fb8ff', '#ffd27a', '#8fe0b0', '#ff9a6b'][(i + row) % 5]} />))}
          <rect x="54" y="812" width="92" height="30" fill="#f4f8ff" opacity=".7" /><text x="100" y="833" textAnchor="middle" fontSize="15" fontWeight="800" fill="#2f5aa8" fontFamily="var(--cond, sans-serif)">Figur</text>
          <rect x="70" y="858" width="60" height="22" rx="3" fill="#10131a" />
          <circle cx="100" cy="760" r="140" fill="#bfe8ff" opacity=".12" style={{ mixBlendMode: 'screen' }} />
        </g>
        {/* HER window: the one lit window, top floor, behind the balcony rail */}
        <circle cx="163" cy="62" r="150" fill="url(#ap-win)" style={{ mixBlendMode: 'screen' }} />
        <rect x="118" y="6" width="92" height="104" fill="#ffcf7a" />
        <rect x="124" y="12" width="80" height="92" fill="#fff0c2" opacity=".55" />
        <path d="M124 12Q138 60 130 104H124Z M204 12Q190 60 198 104H204Z" fill="#ff9ad0" opacity=".7" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={116 + i * 13} y="40" width="4" height="74" fill="#2a2830" />)}
        <rect x="110" y="36" width="108" height="6" fill="#2a2830" />
        {/* clean vertical sign over the traced one */}
        <rect x="16" y="290" width="58" height="122" rx="4" fill="#2f5aa8" stroke="#dfe8ff" strokeWidth="3" />
        <text x="45" y="312" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" fontFamily="var(--jp, sans-serif)" style={{ writingMode: 'vertical-rl' }}>コーポ</text>
        <text x="45" y="378" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="var(--cond, sans-serif)">NAND</text>
        <text x="45" y="400" textAnchor="middle" fontSize="11" fontWeight="700" fill="#cfe0ff" fontFamily="var(--cond, sans-serif)">GATE HTS</text>

        <Rain rm={rm} seed={31} n={170} opacity={0.3} />
        <Grade id="ap-grade" tone="night" sun={lamp} flareR={200} rm={rm} />
      </svg>
    </div>
  );
}
