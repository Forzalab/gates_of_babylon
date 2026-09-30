// rain-sidewalk (v2-rain 1, "Share my umbrella"): ref 04, a tree-lined sidewalk in the rain (portrait -> 16:9).
// The middle 688 px is the trace of the ref; the wings are hand-built on rays from its vanishing point (1090, 545):
// left = road, far block, a near tree in its grate, the white railing; right = white-pillar fence on a red-brick wall,
// the tall block behind. The Weibo watermark was cropped in prep. An umbrella,
// open over Nanda's spot (drawn behind her, so she holds it).
import { R3Scene, along, pts, depths, Canopy, Win, Puddle, WetBand, preloadTrace } from './parts.jsx';

preloadTrace('rain-sidewalk');
const VP = [1090, 545];
const TOD_ = 'rain-dusk';

// a side-wall plane that meets the frame edge `ex`: quad between edge heights ya/yb, depths t1..t2 (t = 1 at the edge)
const quad = (ex, ya, yb, t1, t2) => pts([along(VP, [ex, ya], t1), along(VP, [ex, ya], t2), along(VP, [ex, yb], t2), along(VP, [ex, yb], t1)]);

function LeftWing() {
  const floors = [-520, -380, -240, -100, 40, 180, 320, 460];
  const cols = depths(0.42, 9, 0.28);
  return (
    <g>
      {/* rain sky + the far block across the road (its face runs to the VP, roofline dropping toward it) */}
      <defs><linearGradient id="rsw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3446" /><stop offset="1" stopColor="#7b879a" /></linearGradient></defs>
      <polygon points={pts([[0, 0], [660, 0], [660, 560], [0, 640]])} fill="url(#rsw-sky)" />
      <polygon points={quad(0, -160, 640, 0.42, 1.2)} fill="#4a5669" />
      <polygon points={quad(0, -160, -110, 0.42, 1.2)} fill="#3a4556" />
      {floors.slice(2, -1).map((y, i) => cols.slice(0, -1).map((t, j) => ((i * 7 + j * 3) % 5 === 0
        ? <polygon key={`${i}${j}`} points={quad(0, y + 30, y + 100, t + 0.02, cols[j + 1] - 0.05)} fill="#ffd27a" opacity=".85" />
        : <polygon key={`${i}${j}`} points={quad(0, y + 30, y + 100, t + 0.02, cols[j + 1] - 0.05)} fill="#34404f" />)))}
      {/* the road behind the railing: wet asphalt between the far kerb and the rail */}
      <polygon points={pts([along(VP, [0, 640], 0.42), [0, 640], [0, 722], along(VP, [0, 722], 0.42)])} fill="#2e3544" />
      <polygon points={pts([along(VP, [0, 660], 0.42), [0, 660], [0, 676], along(VP, [0, 676], 0.42)])} fill="#8d9bb3" opacity=".35" />
      {/* a parked car nose, far left, behind the rail */}
      <path d="M0 610 L150 600 Q210 604 236 640 L250 700 L0 716Z" fill="#232a36" />
      <path d="M10 616 L140 608 Q180 612 196 636 L10 646Z" fill="#6d7d96" opacity=".6" />
    </g>
  );
}

function Railing() {
  const A = [0, 722], B = [0, 981], M = [0, 850];
  const posts = depths(0.41, 8, 0.36);
  return (
    <g>
      <polygon points={pts([along(VP, A, 0.41), along(VP, [0, A[1] - 16], 0.41), [0, A[1] - 16], [0, A[1] + 22], along(VP, [0, A[1] + 22], 0.41)])} fill="#e9edf2" />
      <polygon points={pts([along(VP, M, 0.41), [0, M[1]], [0, M[1] + 14], along(VP, [0, M[1] + 14], 0.41)])} fill="#d3d9e1" />
      <polygon points={pts([along(VP, B, 0.41), [0, B[1]], [0, B[1] + 18], along(VP, [0, B[1] + 18], 0.41)])} fill="#c7cdd6" />
      {posts.map((t) => {
        const [x, top] = along(VP, A, t), [, bot] = along(VP, [0, B[1] + 18], t);
        const w = 30 * t;
        return (
          <g key={t}>
            <rect x={x - w / 2} y={top - 22 * t} width={w} height={bot - top + 22 * t} fill="#f2f4f7" />
            <rect x={x + w * 0.1} y={top - 22 * t} width={w * 0.4} height={bot - top + 22 * t} fill="#aeb6c2" />
            <rect x={x - w * 0.8} y={top - 30 * t} width={w * 1.6} height={10 * t} fill="#f2f4f7" />
          </g>
        );
      })}
      {/* thin bars between the posts */}
      {depths(0.41, 30, 0.1).map((t) => {
        const [x, top] = along(VP, A, t), [, bot] = along(VP, B, t);
        return <rect key={t} x={x - 3 * t} y={top} width={6 * t} height={bot - top} fill="#dfe4ea" opacity=".9" />;
      })}
    </g>
  );
}

function NearTree() {
  return (
    <g>
      {/* the tree pit grate on the sidewalk edge */}
      <polygon points="120,1080 420,952 700,948 560,1080" fill="#161b26" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${170 + i * 60} 1080 L${440 + i * 38} 954`} stroke="#39414f" strokeWidth="7" />)}
      {/* trunk: straight, forked like the ref's */}
      <path d="M392 960 L404 560 L380 400 L398 398 L420 540 L452 420 L470 426 L428 580 L424 962Z" fill="#2a2a30" />
      <path d="M410 960 L416 580 L428 580 L424 962Z" fill="#4a4a54" />
      <Canopy x={360} y={170} rx={420} ry={260} seed={4} tones={['#1c3531', '#2a4b44', '#3b6356']} n={20} />
      <Canopy x={700} y={40} rx={260} ry={150} seed={9} tones={['#1c3531', '#2a4b44', '#3b6356']} n={10} />
    </g>
  );
}

function RightWing() {
  const pb = [1920, 830], ptop = [1920, 0], ground = [1920, 1157];
  const posts = depths(0.19, 7, 0.9);
  const floors = [-760, -600, -440, -280, -120];
  const cols = depths(0.2, 8, 0.7);
  return (
    <g>
      {/* the tall block behind the fence (its face on a ray plane further right) */}
      <polygon points={quad(1920, -1400, 260, 0.2, 1.4)} fill="#46505f" />
      {floors.map((y, i) => cols.slice(0, -1).map((t, j) => (
        <polygon key={`${i}${j}`} points={quad(1920, y + 40, y + 120, t + 0.02, cols[j + 1] - 0.04)} fill={(i + j * 2) % 4 === 1 ? '#ffd27a' : '#323b49'} opacity={(i + j * 2) % 4 === 1 ? 0.85 : 1} />)))}
      {/* hedge behind the fence */}
      <polygon points={pts([along(VP, [1920, 420], 0.19), [1920, 420], [1920, 830], along(VP, pb, 0.19)])} fill="#243a33" />
      <Canopy x={1560} y={470} rx={300} ry={110} seed={12} tones={['#1f3530', '#2b4a41', '#3a5f52']} n={12} />
      {/* red-brick wall face, brick courses on rays */}
      <polygon points={pts([along(VP, pb, 0.19), pb, ground, along(VP, ground, 0.19)])} fill="#6a4146" />
      {[900, 970, 1040, 1110].map((y) => <polyline key={y} points={pts([along(VP, [1920, y], 0.19), [1920, y]])} stroke="#553338" strokeWidth="4" fill="none" />)}
      <polygon points={pts([along(VP, pb, 0.19), pb, [1920, 856], along(VP, [1920, 856], 0.19)])} fill="#8c5a5c" />
      {/* white pillars + dark iron bars between */}
      {depths(0.19, 40, 0.13).map((t) => {
        const [x, top] = along(VP, [1920, 260], t), [, bot] = along(VP, pb, t);
        return <rect key={t} x={x - 3 * t} y={top} width={6 * t} height={bot - top} fill="#1a2420" />;
      })}
      {posts.map((t) => {
        const [x, top] = along(VP, ptop, t), [, bot] = along(VP, pb, t);
        const w = 70 * t;
        return (
          <g key={t}>
            <rect x={x - w / 2} y={top} width={w} height={bot - top} fill="#eef1f4" />
            <rect x={x - w / 2} y={top} width={w * 0.34} height={bot - top} fill="#c3cad3" />
            <rect x={x - w * 0.62} y={top - 8 * t} width={w * 1.24} height={24 * t} fill="#f7f8fa" />
          </g>
        );
      })}
    </g>
  );
}

// the sidewalk, clean cel over the trace mush: wet grey tiles on rays + depth lines, the yellow tactile strip
function Sidewalk() {
  const L = [316, 1080], R = [1815, 1080], T0 = 0.06;
  const rows = depths(0.08, 14, 1.1).filter((t) => t <= 1);
  return (
    <g>
      <polygon points={pts([along(VP, L, T0), along(VP, R, T0), R, L])} fill="#5e6473" />
      {[0.2, 0.4, 0.6, 0.8].map((k) => <polyline key={k} points={pts([VP, [L[0] + (R[0] - L[0]) * k, 1080]].map((p) => p))} stroke="#4e5462" strokeWidth="3" fill="none" />)}
      {rows.map((t) => <polyline key={t} points={pts([along(VP, L, t), along(VP, R, t)])} stroke="#4e5462" strokeWidth={Math.max(1.5, 4 * t)} fill="none" />)}
      {/* tactile strip (grade-A braille blocks), yellow, dotted */}
      <polygon points={pts([along(VP, [1098, 1080], T0), along(VP, [1236, 1080], T0), [1236, 1080], [1098, 1080]])} fill="#c7a640" />
      {rows.map((t) => [0.25, 0.5, 0.75].map((k) => {
        const [x, y] = along(VP, [1098 + 138 * k, 1080], t);
        return <rect key={`${t}${k}`} x={x - 10 * t} y={y - 22 * t} width={20 * t} height={10 * t} rx={5 * t} fill="#a4852c" />;
      }))}
      {/* wet sheen: the vertical reflection bands of the lit windows + the sky gap down the path */}
      <WetBand x={1150} y={640} w={60} h={360} c="#ffd27a" o={0.22} />
      <WetBand x={1060} y={600} w={120} h={460} c="#b9c6dc" o={0.3} />
      <WetBand x={1560} y={860} w={40} h={200} c="#ffd27a" o={0.18} />
    </g>
  );
}

// the umbrella, open over both of them (Nanda + you): a clean anime canopy seen from slightly below, 8 gores with
// ribs meeting at the tip, a scalloped rim whose front arc bows toward the viewer (perspective), a shaft that runs
// down behind her raised hand, rain beading and splashing on the top. Drawn behind Nanda, so she holds it.
const UMB = { cx: 1080, ay: 112, ry: 318, hw: 450, bow: 30, n: 8 };
function Umbrella() {
  const { cx, ay, ry, hw, bow, n } = UMB;
  const rim = (k) => { const t = (k * Math.PI) / n; return [cx - hw * Math.cos(t), ry + bow * Math.sin(t)]; };
  const rib = (k) => { const [x, y] = rim(k); return [cx + (x - cx) * 0.9, ay + (y - ay) * 0.34]; };
  const P = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const gores = [];
  for (let k = 0; k < n; k++) {
    const [x0, y0] = rim(k); const [x1, y1] = rim(k + 1);
    const mx = (x0 + x1) / 2; const my = (y0 + y1) / 2 - 12; // scallop sags up between the ribs
    gores.push(
      <path key={k} d={`M${cx} ${ay} Q${P(rib(k))} ${x0.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} Q${P(rib(k + 1))} ${cx} ${ay}Z`}
        fill={k % 2 ? '#fbc7db' : '#ee78a8'} stroke="#5e1240" strokeWidth="5" strokeLinejoin="round" />,
    );
  }
  const drops = [[-300, 40], [-190, 8], [-70, -2], [40, 6], [150, 34], [270, 72], [-240, 88], [220, 118]];
  return (
    <g>
      {/* shaft, behind her raised hand */}
      <path d={`M${cx} ${ry + 6} L1094 560`} stroke="#5a1f40" strokeWidth="11" strokeLinecap="round" />
      <path d={`M${cx - 2} ${ry + 12} L1091 560`} stroke="#c56a95" strokeWidth="3" strokeLinecap="round" />
      {/* the underside sliver under the front rim, so the canopy has depth */}
      <path d={`M${P(rim(0))} ${gores.map((_, k) => `Q${((rim(k)[0] + rim(k + 1)[0]) / 2).toFixed(1)} ${((rim(k)[1] + rim(k + 1)[1]) / 2 + 2).toFixed(1)} ${P(rim(k + 1))}`).join(' ')} L${P(rim(n))} Q${cx} ${ry + bow + 18} ${P(rim(0))}Z`} fill="#6d2850" opacity=".55" />
      {gores}
      {/* soft highlight streak on the upper left and a shaded right flank */}
      <path d={`M${cx - 120} ${ay + 40} Q${cx - 250} ${ay + 96} ${cx - 330} ${ry - 26}`} stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".55" />
      <path d={`M${cx + 60} ${ay + 20} Q${cx + 330} ${ay + 70} ${cx + hw - 6} ${ry - 4} L${cx + hw - 90} ${ry + 14} Q${cx + 230} ${ay + 120} ${cx + 60} ${ay + 20}Z`} fill="#8a2a5e" opacity=".14" />
      {/* tip: ferrule */}
      <path d={`M${cx - 6} ${ay + 6} L${cx} ${ay - 26} L${cx + 6} ${ay + 6}Z`} fill="#5a1f40" />
      <circle cx={cx} cy={ay - 27} r="4.5" fill="#5a1f40" />
      {/* rain hitting the top: splash ticks on the dome, beads running to the rim */}
      {drops.map(([dx, dy], i) => {
        const x = cx + dx; const y = ay + 44 + dy + Math.abs(dx) * 0.16;
        return (
          <g key={i} stroke="#dbe8ff" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity=".95">
            <path d={`M${x - 11} ${y + 1} L${x - 15} ${y - 10}`} /><path d={`M${x} ${y} L${x} ${y - 14}`} /><path d={`M${x + 11} ${y + 1} L${x + 15} ${y - 10}`} />
          </g>
        );
      })}
      {[-3, -1, 1, 3, 5].map((k, i) => { const [x, y] = rim(4 + k * 0.85 > n ? n - 1 : 4 + k * 0.85 < 1 ? 1 : 4 + k * 0.85);
        return <ellipse key={i} cx={x} cy={y + 12 + (i % 2) * 16} rx="3.5" ry="8" fill="#cfdcf2" opacity=".8" />; })}
    </g>
  );
}

export default function RainSidewalk({ rm }) {
  return (
    <R3Scene id="rain-sidewalk" tod={TOD_} rm={rm} rain={{ n: 190 }}
      label="A tree-lined sidewalk in heavy rain at dusk: a white railing and trees on the left, a white-pillar fence on a red-brick wall on the right, a pink umbrella open over the middle.">
      <LeftWing />
      <Sidewalk />
      <Railing />
      <RightWing />
      <NearTree />
      <Win x={1150} y={330} w={20} h={26} tod={TOD_} o={0.8} />
      <Puddle x={1330} y={1010} rx={120} ry={20} c="#1a2030" rim="#aebcd4" sky="#8494b0" />
      <Puddle x={880} y={1045} rx={90} ry={14} c="#1a2030" rim="#aebcd4" />
      <Umbrella />
    </R3Scene>
  );
}
