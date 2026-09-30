// BEDROOM (art id `bedroom`): the `steeped` ending. You wake in her bed. Trace = the dusk bed-window ref (research/
// refs/bed-window-dusk), full height, centred (767 px). Hand overlay: the window wall continued at dusk on both
// sides, curtains (fairy lights strung down the right one, as in the ref), the navy duvet rumpled across the whole
// bottom of the frame (you are under it), her pillow with a plush of her on it, rain on the glass.
// Light: dusk through the window (cool indigo, peach at the horizon) + her small desk lamp (warm, left).
// Motion: rain only (Rain.jsx, 2 poses x 500 ms), clipped to the glass; rm = still.
import Rain from '../Rain.jsx';
import { rng } from '../util.js';
import { traceUrl, preloadTrace, Grade } from './kit.jsx';
import { SidePanes, Curtain } from './room.jsx';

preloadTrace('bedroom');

const f1 = (n) => n.toFixed(1);
const REF = { x: 576, w: 767 }, SILL = 760;

function Duvet() {
  // big soft folds; the fabric's top edge rides higher at the sides (the bed is wide, we lie in the middle)
  const edge = 'M0 880C140 850 260 900 400 872C520 850 560 900 640 905C800 930 1100 925 1300 905C1400 895 1480 860 1600 870C1740 882 1840 850 1920 862V1080H0Z';
  const folds = [
    'M40 1080C120 990 220 950 330 930', 'M300 1080C360 1000 470 960 560 950', 'M620 1080C700 1010 820 990 940 985',
    'M1020 1080C1080 1020 1180 990 1290 980', 'M1380 1080C1440 1000 1560 950 1690 930', 'M1640 1080C1720 1010 1820 960 1920 950',
  ];
  return (
    <g>
      <defs>
        <linearGradient id="bd-duvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a8a" /><stop offset=".35" stopColor="#23306a" /><stop offset="1" stopColor="#141a40" /></linearGradient>
      </defs>
      <path d={edge} fill="url(#bd-duvet)" />
      <path d="M0 880C140 850 260 900 400 872C520 850 560 900 640 905C800 930 1100 925 1300 905C1400 895 1480 860 1600 870C1740 882 1840 850 1920 862" stroke="#8a9ad8" strokeWidth="5" fill="none" opacity=".55" />
      {folds.map((d, i) => (
        <g key={i}>
          <path d={d} stroke="#0e1230" strokeWidth="26" fill="none" opacity=".5" strokeLinecap="round" />
          <path d={d} stroke="#6a7ac0" strokeWidth="5" fill="none" opacity=".45" strokeLinecap="round" transform="translate(-10 -12)" />
        </g>
      ))}
      {/* warm lamp spill on the left of the duvet */}
      <ellipse cx="420" cy="930" rx="380" ry="60" fill="#ffb070" opacity=".08" filter="url(#bd-soft)" />
    </g>
  );
}

function Pillow() {
  // her pillow at the left edge + a plush of her (chip body, silver hair, pink bow) propped on it, facing you
  return (
    <g>
      <path d="M-20 760C60 730 260 730 330 770C360 800 350 860 300 880C200 905 40 900 -20 880Z" fill="#e4e0f0" />
      <path d="M-20 760C60 730 260 730 330 770" stroke="#fff" strokeWidth="5" fill="none" opacity=".7" />
      <path d="M40 800C120 790 220 800 290 820" stroke="#b8b0d0" strokeWidth="6" fill="none" opacity=".6" />
      <g transform="translate(180 790)">
        <ellipse cx="0" cy="62" rx="70" ry="12" fill="#6a6490" opacity=".45" />
        <rect x="-56" y="-40" width="112" height="100" rx="26" fill="#fff6fa" stroke="#d6337f" strokeWidth="5" />
        <path d="M-60 -30C-70 -80 -10 -104 30 -84C70 -66 70 -24 60 20L52 -36Z" fill="#dfe2ee" stroke="#b8bccc" strokeWidth="3" />
        <circle cx="-18" cy="6" r="7" fill="#3a0a26" /><path d="M10 6q9 -8 18 0" stroke="#3a0a26" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="-30" cy="24" rx="11" ry="6" fill="#ffb3cc" /><ellipse cx="30" cy="24" rx="11" ry="6" fill="#ffb3cc" />
        <path d="M-8 34q8 8 16 0" stroke="#3a0a26" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M36 -70l20 -14l4 22l-20 -4zM36 -70l-8 -22l22 6z" fill="#ff6fa8" />
      </g>
    </g>
  );
}

function FairyLights() {
  const r = rng(8);
  const pts = Array.from({ length: 18 }, (_, i) => [1640 + Math.sin(i * 0.9) * 30 + r() * 10, 40 + i * 46]);
  return (
    <g>
      <path d={`M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')}`} stroke="#2a2438" strokeWidth="2" fill="none" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={f1(x)} cy={f1(y)} r="16" fill="#ffc070" opacity=".18" />
          <circle cx={f1(x)} cy={f1(y)} r="4.5" fill="#fff0c0" />
        </g>
      ))}
    </g>
  );
}

export default function Bedroom({ rm }) {
  return (
    <div className="art bedroom">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" role="img"
        aria-label="Her bedroom at dusk, seen from her bed: a big rainy window over the city, peach light at the horizon, a desk lamp, fairy lights, the navy duvet pulled up over you, a plush of her on the pillow.">
        <defs>
          <linearGradient id="bd-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".05" stopColor="#fff" /><stop offset=".95" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <filter id="bd-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="24" /></filter>
          <mask id="bd-refmask" maskContentUnits="userSpaceOnUse"><rect x={REF.x} y="0" width={REF.w} height="1080" fill="url(#bd-edge)" /></mask>
          <radialGradient id="bd-lamp"><stop offset="0" stopColor="#ffd9a0" stopOpacity=".7" /><stop offset=".3" stopColor="#ff9a50" stopOpacity=".2" /><stop offset="1" stopColor="#ff9a50" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#101530" />
        <SidePanes x0={0} x1={REF.x + 20} sill={SILL} seed={12} sky={['#1b2552', '#3a3a78', '#c98a7a', '#2a2f5e']} lights={['#ffd27a', '#9fc0ff', '#ffe0b0']} mullions={[30, 400]} />
        <SidePanes x0={REF.x + REF.w - 20} x1={1920} sill={SILL} seed={13} sky={['#1b2552', '#3a3a78', '#c98a7a', '#2a2f5e']} lights={['#ffd27a', '#9fc0ff', '#ffe0b0']} mullions={[1520, 1880]} />
        <rect x="0" y={SILL} width="1920" height={1080 - SILL} fill="#1a1a30" />
        <rect x="0" y={SILL + 6} width="1920" height="60" fill="#3a2a22" opacity=".8" />
        <image href={traceUrl('bedroom')} x={REF.x} y="0" width={REF.w} height="1080" preserveAspectRatio="none" mask="url(#bd-refmask)" />
        <Rain rm={rm} seed={17} n={90} x={0} y={0} w={1920} h={SILL - 40} opacity={0.22} color="#dfe6ff" />
        <Curtain x0={0} x1={300} hem={SILL + 60} side="left" seed={21} tint="#6a6aa8" shade="#262a58" />
        <Curtain x0={1600} x1={1920} hem={SILL + 60} side="right" seed={22} tint="#7a78b8" shade="#2a2c5c" />
        <FairyLights />
        <circle cx="619" cy="708" r="300" fill="url(#bd-lamp)" style={{ mixBlendMode: 'screen' }} />
        <Pillow />
        <Duvet />
        <Grade id="bd-grade" tone="night" sun={[1180, 330]} flareR={180} rm={rm} />
      </svg>
    </div>
  );
}
