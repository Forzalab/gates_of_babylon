// escape-night (escape-win's wide street beat, "Her street at night. One window lit."): ref 15, the starry street with
// the rail crossing (the library route, seen at night). Replaces the old sunset closeup: it is 8 PM+, clear, stars.
// Portrait ref -> the middle 776 px; hand-built wings on rays from the vanishing point (1100, 620): the near blocks on
// both sides, one window lit (hers), a sky wedge with stars. Crossing redrawn crisp: yellow/black posts, crossbucks,
// unlit red lamps, gate arms UP (no train: the way is open). Signs: としょかん / LIBRARY, the OR-SON neon.
// The place/time stamp comes from the beat (props.shot "stamp" over this art, packs/r3-rain.json).
import { R3Scene, along, pts, depths, Lamp, WetBand, Stars, preloadTrace } from './parts.jsx';
import { Mid, EscapeFront } from '../sandwichFronts.jsx';

preloadTrace('escape-night');
const VP = [1100, 620];
const T = 'night';
const edgeL = (y) => [0, VP[1] + (y - VP[1]) * (1100 / 520)]; // a height seen at the left seam (x 580) -> the frame edge
const edgeR = (y) => [1920, VP[1] + (y - VP[1]) * (820 / 248)]; // right seam (x 1348) -> edge
const qL = (ya, yb, t1, t2) => pts([along(VP, edgeL(ya), t1), along(VP, edgeL(ya), t2), along(VP, edgeL(yb), t2), along(VP, edgeL(yb), t1)]);
const qR = (ya, yb, t1, t2) => pts([along(VP, edgeR(ya), t1), along(VP, edgeR(ya), t2), along(VP, edgeR(yb), t2), along(VP, edgeR(yb), t1)]);
const TL = 520 / 1100, TR = 248 / 820;

function LeftBlock() {
  const cols = depths(TL, 6, 0.22);
  const floors = [240, 340, 440, 540];
  return (
    <g>
      <defs><linearGradient id="en-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2a78" /><stop offset="1" stopColor="#3653b0" /></linearGradient></defs>
      <polygon points={pts([[0, 0], [580, 0], [580, 236], edgeL(236)])} fill="url(#en-sky)" />
      <Stars id="en-starsL" clip="260,0 580,0 580,236" n={60} seed={21} h={240} />
      <polygon points={qL(236, 850, TL - 0.01, 1.02)} fill="#141c52" />
      <polygon points={qL(226, 250, TL - 0.01, 1.02)} fill="#27336f" />
      {floors.map((y, i) => cols.slice(0, -1).map((t, j) => {
        const lit = i === 1 && j === 2; // the one lit window
        return <polygon key={`${i}${j}`} points={qL(y + 20, y + 80, t + 0.02, cols[j + 1] - 0.03)} fill={lit ? '#ffd27a' : '#0e1540'} />;
      }))}
      <polygon points={qL(750, 850, TL - 0.01, 1.02)} fill="#141d4d" />
      {/* the kerb + pavement below the block */}
      <polygon points={pts([along(VP, edgeL(850), TL), edgeL(850), [0, 1080], [480, 1080]])} fill="#39437e" />
      {/* the library sign on its own post */}
      <rect x="506" y="600" width="12" height="220" fill="#1c2250" />
      <rect x="470" y="590" width="84" height="150" rx="5" fill="#e9e4d6" />
      <text x="492" y="665" textAnchor="middle" writingMode="tb" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize="24" fill="#1d2238">としょかん</text>
      <text x="532" y="646" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="15" fill="#1d2238" transform="rotate(90 532 646)">LIBRARY</text>
      <path d="M522 712 h20 l-8 -8 m8 8 l-8 8" stroke="#c2335a" strokeWidth="4" fill="none" />
    </g>
  );
}

function RightBlock() {
  const cols = depths(TR, 5, 0.8);
  const floors = [60, 170, 280, 390, 500];
  return (
    <g>
      <polygon points={qR(-400, 760, TR - 0.01, 1.02)} fill="#16205a" />
      {floors.map((y, i) => cols.slice(0, -1).map((t, j) => (
        <polygon key={`${i}${j}`} points={qR(y + 20, y + 80, t + 0.02, cols[j + 1] - 0.04)} fill={(i + j) % 5 === 3 ? '#3a4a8c' : '#101848'} />
      )))}
      <polygon points={pts([along(VP, edgeR(760), TR), edgeR(760), [1920, 1080], [1700, 1080]])} fill="#2c3672" />
    </g>
  );
}

function Crossing() {
  const post = (x, top, bot) => (
    <g>
      {Array.from({ length: Math.ceil((bot - top) / 24) }, (_, i) => <rect key={i} x={x - 6} y={top + i * 24} width="12" height="24" fill={i % 2 ? '#1b1b22' : '#f2c230'} />)}
    </g>
  );
  const buck = (x, y, s) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-40" y="-7" width="80" height="14" fill="#f2c230" stroke="#1b1b22" strokeWidth="3" transform="rotate(35)" />
      <rect x="-40" y="-7" width="80" height="14" fill="#f2c230" stroke="#1b1b22" strokeWidth="3" transform="rotate(-35)" />
    </g>
  );
  return (
    <g>
      {post(1283, 480, 760)}
      {buck(1283, 494, 1)}
      <rect x="1238" y="540" width="92" height="12" fill="#1b1b22" />
      <circle cx="1252" cy="556" r="16" fill="#5a1a24" stroke="#1b1b22" strokeWidth="4" />
      <circle cx="1314" cy="556" r="16" fill="#5a1a24" stroke="#1b1b22" strokeWidth="4" />
      {post(1302, 600, 740)}
      {post(902, 520, 750)}
      {buck(902, 530, 0.75)}
      <circle cx="886" cy="578" r="11" fill="#5a1a24" stroke="#1b1b22" strokeWidth="3" />
      <circle cx="918" cy="578" r="11" fill="#5a1a24" stroke="#1b1b22" strokeWidth="3" />
      {post(920, 610, 740)}
      {/* the rails across the road */}
      <path d="M940 736 L1300 736 M930 752 L1310 752" stroke="#9aa6d8" strokeWidth="4" opacity=".7" />
    </g>
  );
}

// the middle, merged into clean cel regions over the (hazy) trace: the road + lane lines + the diamond, the utility
// pole + wires, the lit block at the end of the street, the cumulus with its warm rim
function Middle() {
  const road = [[590, 1080], [1560, 1080], along(VP, [1560, 1080], 0.2), along(VP, [590, 1080], 0.2)];
  return (
    <g>
      <path d="M1000 330 C960 300 980 240 1030 240 C1040 190 1100 180 1130 214 C1160 170 1230 180 1236 230 C1290 230 1320 280 1300 320 C1330 340 1320 380 1280 380 L1010 380Z" fill="#5f7fc6" />
      <path d="M1130 214 C1160 170 1230 180 1236 230 C1290 230 1320 280 1300 320" stroke="#f0b8c8" strokeWidth="7" fill="none" opacity=".75" />
      <rect x="1058" y="380" width="176" height="230" fill="#8ea5d6" />
      {/* its windows dark tonight (cool glass): the line says ONE window lit, and that one is on the left block */}
      {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={1070 + c * 42} y={396 + r * 42} width="26" height="16" fill={(r + c) % 3 ? '#5d74ad' : '#6f88c2'} />))}
      <polygon points={pts(road)} fill="#6f84bf" />
      <polygon points={pts([[590, 1080], [700, 1080], along(VP, [700, 1080], 0.2), along(VP, [590, 1080], 0.2)])} fill="#8a9ad0" />
      {[[640, 1080], [1470, 1080]].map((p) => <polyline key={p[0]} points={pts([along(VP, p, 0.22), p])} stroke="#dfe6ff" strokeWidth="10" fill="none" opacity=".7" />)}
      <polygon points="1150,850 1210,818 1290,876 1230,910" fill="none" stroke="#dfe6ff" strokeWidth="12" opacity=".6" />
      {/* the utility pole, straight, and its wires */}
      <rect x="826" y="100" width="22" height="720" fill="#1b2350" />
      <rect x="796" y="150" width="84" height="9" fill="#1b2350" /><rect x="806" y="206" width="64" height="8" fill="#1b2350" />
      <rect x="814" y="330" width="46" height="60" rx="6" fill="#26306a" />
      <g stroke="#101640" strokeWidth="3" fill="none">
        <path d="M580 150 Q700 190 826 154" /><path d="M848 154 Q1000 230 1340 190" /><path d="M848 210 Q1050 300 1340 270" /><path d="M870 330 Q1080 380 1340 330" />
      </g>
    </g>
  );
}

export default function EscapeNight({ rm }) {
  return (
    <R3Scene id="escape-night" tod={T} rm={rm}
      label="A clear night street with stars over the rooftops, street lamps, a rail crossing at the end with its gates up; one window is lit.">
      <Mid id="escape-night" blur={3} op={0.5} tint="#1c1a48" wash={0.06} />
      <Stars id="en-starsM" clip="970,0 1340,0 1340,250 1250,300 1170,330 1000,300 960,200" n={70} seed={8} h={330} />
      <Middle />
      <LeftBlock />
      <RightBlock />
      <Crossing />
      <Lamp x={650} y={140} r={22} tod={T} />
      <Lamp x={745} y={266} r={12} tod={T} />
      <Lamp x={1034} y={596} r={9} tod={T} />
      {/* OR-SON neon (the konbini from her street), small on the left block down the road */}
      <rect x="880" y="462" width="100" height="30" rx="4" fill="#1c1440" />
      <text x="930" y="485" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="22" fill="#ff7ab6">OR-SON</text>
      <EscapeFront />
      <WetBand x={650} y={840} w={80} h={200} c="#ffe8a8" o={0.18} />
      <WetBand x={1060} y={760} w={140} h={220} c="#ffe8a8" o={0.2} />
    </R3Scene>
  );
}
