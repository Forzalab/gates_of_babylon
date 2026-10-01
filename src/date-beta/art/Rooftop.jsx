// Rooftop establishing shot: a pink clock tower (maker: Figur), cherry blossoms, blue sky, the school railing.
// Palette sampled with Pillow from Tony's CC0 refs (research/date-beta-demo/compare.py). Flat fills, one sky gradient.
// Clock = the story clock (meta.js): the real time from 12:00 to 14:00, else 12:00. props.clock 'live' adds the
// second hand while the real time shows (hidden under reduced motion); 'noon' = no second hand.
import { rng, useNow } from './util.js';
import { storyTime } from '../meta.js';
import { OrSpans } from '../Say.jsx';

const SAKURA = ['#f6daef', '#f4c4e4', '#eeaee4', '#ef8ac9', '#e49fcc'];
const DEEP = ['#e17fbd', '#d86eb0', '#ef8ac9', '#e49fcc'];

function Cluster({ x, y, r, seed, deep = false, n = 16 }) {
  const rnd = rng(seed), pal = deep ? DEEP : SAKURA;
  return Array.from({ length: n }, (_, i) => {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * r;
    const cr = r * (0.28 + rnd() * 0.3);
    return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.8} r={cr} fill={pal[Math.floor(rnd() * pal.length)]} />;
  });
}

// five-petal blossoms dotted on top of the clusters, so the masses read as flowers, not bubbles
function Blossoms({ x0, y0, w, h, n, seed }) {
  const rnd = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = x0 + rnd() * w, y = y0 + rnd() * h, s = 7 + rnd() * 7;
    return (
      <g key={i} transform={`translate(${x} ${y}) rotate(${rnd() * 72})`}>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy={-s * 0.7} rx={s * 0.45} ry={s * 0.7} transform={`rotate(${a})`} fill="#fff0f8" />)}
        <circle r={s * 0.28} fill="#d65a9c" />
      </g>
    );
  });
}

const Cloud = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 60 C-10 30 30 10 60 26 C70 -6 130 -12 150 20 C175 0 225 8 228 44 C262 44 272 70 250 80 L10 80 C-8 80 -8 64 0 60Z" fill="#f3f7ff" />
    <path d="M10 80 L250 80 C262 76 268 70 262 64 C230 72 60 74 6 70 C0 76 4 80 10 80Z" fill="#c5d6f3" />
  </g>
);

const Dove = ({ x, y, s = 1, f = false }) => (
  <path transform={`translate(${x} ${y}) scale(${f ? -s : s} ${s})`} fill="#fbfbff"
    d="M0 0 C14 -4 22 -2 30 4 C38 -14 52 -26 72 -30 C62 -16 56 -4 46 8 C54 8 60 10 64 14 C52 16 40 16 30 14 C22 16 10 12 0 0Z" />
);

function Hands({ h, m, s, second }) {
  return (
    <g>
      <g transform={`rotate(${h})`}>
        <path d="M-6 14 L-5 -48 L0 -70 L5 -48 L6 14Z" fill="#2b2440" />
        <path d="M0 -52 L-9 -60 L0 -76 L9 -60Z" fill="#2b2440" />
      </g>
      <g transform={`rotate(${m})`}><path d="M-4 18 L-3 -86 L0 -102 L3 -86 L4 18Z" fill="#2b2440" /></g>
      {second && <g transform={`rotate(${s})`}><path d="M-1.6 24 L-1.2 -104 L1.2 -104 L1.6 24Z" fill="#ff5fa2" /><circle cy="16" r="5" fill="#ff5fa2" /></g>}
      <circle r="9" fill="#d6a93f" stroke="#8a6320" strokeWidth="3" />
    </g>
  );
}

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

function ClockFace({ time, live, rm }) {
  const [hh, mm] = storyTime(12, 0, time), real = time.getHours() === 12 || time.getHours() === 13;
  const ss = real ? time.getSeconds() : 0;
  const [h, m, s] = [((hh % 12) + mm / 60) * 30, (mm + ss / 60) * 6, ss * 6];
  return (
    <g transform="translate(1140 430)">
      <rect x="-142" y="-142" width="284" height="284" fill="#d6a93f" stroke="#8a6320" strokeWidth="5" />
      <rect x="-128" y="-128" width="256" height="256" fill="none" stroke="#f2d57a" strokeWidth="4" />
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => (
        <path key={`${a}${b}`} d={`M${a * 128} ${b * 128} Q${a * 100} ${b * 100} ${a * 128} ${b * 72} M${a * 128} ${b * 128} Q${a * 100} ${b * 100} ${a * 72} ${b * 128}`}
          fill="none" stroke="#8a6320" strokeWidth="4" />
      ))}
      <circle r="120" fill="#fbf7f1" stroke="#3b3350" strokeWidth="4" />
      <circle r="104" fill="none" stroke="#3b3350" strokeWidth="1.5" />
      {Array.from({ length: 60 }, (_, i) => (
        <line key={i} x1="0" y1={-104} x2="0" y2={i % 5 ? -112 : -118} stroke="#3b3350" strokeWidth={i % 5 ? 2 : 5} transform={`rotate(${i * 6})`} />
      ))}
      {ROMAN.map((n, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return <text key={n} x={Math.cos(a) * 80} y={Math.sin(a) * 80 + 8} textAnchor="middle" className="roman">{n}</text>;
      })}
      <text y="48" textAnchor="middle" className="figur-clock">Figur</text>
      <Hands h={h} m={m} s={s} second={live && real && !rm} />
    </g>
  );
}

// the side face (seen edge-on): same story time, hands squashed to the ellipse (rx 34 / ry 100)
function SideHands({ time }) {
  const [hh, mm] = storyTime(12, 0, time);
  const hand = (deg, len, w) => {
    const a = (deg * Math.PI) / 180;
    return <line x1="1392" y1="430" x2={1392 + Math.sin(a) * len * 0.34} y2={430 - Math.cos(a) * len} stroke="#2b2440" strokeWidth={w} strokeLinecap="round" />;
  };
  return <g>{hand(((hh % 12) + mm / 60) * 30, 52, 6)}{hand(mm * 6, 80, 4)}</g>;
}

export default function Rooftop({ props, rm }) {
  const live = props.clock !== 'noon';
  const now = useNow(true);
  const stamp = storyTime(12, 0, now).map((v) => String(v).padStart(2, '0')).join(':');
  return (
    <svg className="art rooftop" viewBox="0 0 1920 1080" data-time={stamp} role="img"
      aria-label={`A pink clock tower in cherry blossoms. The clock reads ${stamp}.`}>
      <defs>
        <linearGradient id="rt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3558d8" /><stop offset=".55" stopColor="#4d78e2" /><stop offset="1" stopColor="#b6d4f2" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#rt-sky)" />
      <Cloud x={-60} y={470} s={2.3} />
      <Cloud x={620} y={300} s={0.9} />
      <Cloud x={1560} y={150} s={1.5} />

      {/* spire */}
      <polygon points="945,205 1335,205 1150,-40" fill="#c3b1e3" />
      <polygon points="1335,205 1462,205 1150,-40" fill="#8e7cc0" />
      {[990, 1035, 1080, 1125, 1170, 1215, 1260, 1300].map((x) => <line key={x} x1="1150" y1="-40" x2={x} y2="205" stroke="#7a67ad" strokeWidth="4" />)}
      <line x1="1150" y1="-40" x2="1102" y2="205" stroke="#e3d8f5" strokeWidth="6" />
      {[1370, 1415].map((x) => <line key={x} x1="1150" y1="-40" x2={x} y2="205" stroke="#6d5aa3" strokeWidth="4" />)}
      {/* crown + gold finials */}
      <rect x="930" y="198" width="420" height="68" fill="#f3cfe6" />
      <rect x="1350" y="198" width="118" height="68" fill="#b77aa6" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={948 + i * 44} y="216" width="26" height="38" rx="13" fill="#653f61" />)}
      {Array.from({ length: 3 }, (_, i) => <rect key={i} x={1364 + i * 34} y="216" width="18" height="38" rx="9" fill="#4a2f58" />)}
      <rect x="930" y="258" width="538" height="10" fill="#976c94" />
      {[945, 1335, 1462].map((x) => <path key={x} d={`M${x - 11} 200 L${x - 8} 172 Q${x} 140 ${x} 118 Q${x} 140 ${x + 8} 172 L${x + 11} 200Z`} fill="#d6a93f" stroke="#8a6320" strokeWidth="3" />)}

      {/* clock stage */}
      <rect x="960" y="266" width="360" height="340" fill="#f4d2ea" />
      <rect x="1320" y="266" width="140" height="340" fill="#c98fbb" />
      <rect x="960" y="266" width="30" height="340" fill="#e7a8d3" /><rect x="1290" y="266" width="30" height="340" fill="#e7a8d3" />
      <rect x="968" y="266" width="5" height="340" fill="#fbe8f4" /><rect x="1298" y="266" width="5" height="340" fill="#fbe8f4" />
      <rect x="1320" y="266" width="14" height="340" fill="#976c94" />
      <ellipse cx="1392" cy="430" rx="46" ry="118" fill="#d6a93f" stroke="#8a6320" strokeWidth="4" />
      <ellipse cx="1392" cy="430" rx="34" ry="100" fill="#efe6ee" stroke="#3b3350" strokeWidth="3" />
      <SideHands time={now} />
      <ClockFace time={now} live={live} rm={rm} />

      {/* ledge, belfry, ledge */}
      <rect x="944" y="600" width="392" height="36" fill="#fbe3f2" /><rect x="1336" y="600" width="130" height="36" fill="#b77aa6" />
      <rect x="944" y="628" width="522" height="8" fill="#976c94" />
      <rect x="960" y="636" width="360" height="170" fill="#f4d2ea" /><rect x="1320" y="636" width="140" height="170" fill="#c98fbb" />
      {[990, 1095, 1200].map((x) => (
        <g key={x}>
          <path d={`M${x} 800 V${690} a45 45 0 0 1 90 0 V800Z`} fill="#4a2f58" />
          {[700, 718, 736, 754, 772, 790].map((y) => <rect key={y} x={x + 6} y={y} width="78" height="6" fill="#8b6a95" />)}
        </g>
      ))}
      {[1345, 1405].map((x) => <path key={x} d={`M${x} 800 V690 a18 30 0 0 1 36 0 V800Z`} fill="#3a2446" />)}
      <rect x="944" y="800" width="392" height="32" fill="#fbe3f2" /><rect x="1336" y="800" width="130" height="32" fill="#b77aa6" />
      <rect x="944" y="824" width="522" height="8" fill="#976c94" />
      {/* lower gothic windows */}
      <rect x="960" y="832" width="360" height="260" fill="#f4d2ea" /><rect x="1320" y="832" width="140" height="260" fill="#c98fbb" />
      {[995, 1100, 1205].map((x) => (
        <g key={x}>
          <path d={`M${x} 1090 V930 Q${x} 870 ${x + 40} 850 Q${x + 80} 870 ${x + 80} 930 V1090Z`} fill="#3e2a52" />
          <path d={`M${x + 40} 852 V1090 M${x} 960 H${x + 80}`} stroke="#b98fc2" strokeWidth="4" fill="none" />
        </g>
      ))}

      {/* doves, still (reference 2) */}
      <Dove x={1540} y={330} s={1.1} /><Dove x={1640} y={280} s={0.9} f /><Dove x={1720} y={360} s={1.2} />
      <Dove x={1800} y={250} s={0.8} f /><Dove x={1480} y={420} s={0.7} /><Dove x={860} y={150} s={0.8} f />

      <SignPosts />
      {/* sakura: top-left branch, lower-left branch, big mass bottom-right */}
      <path d="M-20 150 C80 160 180 190 330 215 M150 180 C190 150 230 120 262 92 M60 160 C40 200 30 240 20 262" stroke="#6b4a5e" strokeWidth="14" fill="none" strokeLinecap="round" />
      {[[40, 150, 70, 1], [130, 196, 58, 2], [220, 170, 62, 3], [310, 214, 50, 4], [256, 96, 48, 5], [22, 262, 46, 6]].map(([x, y, r, sd]) => <Cluster key={sd} x={x} y={y} r={r} seed={sd} />)}
      <path d="M-20 650 C100 630 250 600 430 548 M200 610 C250 650 300 680 340 690 M90 640 C110 690 120 720 118 760" stroke="#6b4a5e" strokeWidth="16" fill="none" strokeLinecap="round" />
      {[[50, 630, 64, 11], [170, 596, 68, 12], [300, 590, 56, 13], [410, 548, 46, 14], [330, 688, 52, 15], [118, 752, 50, 16]].map(([x, y, r, sd]) => <Cluster key={sd} x={x} y={y} r={r} seed={sd} />)}
      <Blossoms x0={0} y0={90} w={360} h={200} n={16} seed={7} />
      <Blossoms x0={0} y0={540} w={440} h={240} n={18} seed={17} />
      <g>
        {[[1560, 620, 140, 21, true], [1760, 560, 150, 22], [1900, 700, 150, 23, true], [1480, 820, 150, 24, true], [1700, 800, 170, 25],
          [1880, 930, 160, 26, true], [1560, 1000, 150, 27], [1400, 1000, 120, 28, true], [1820, 440, 110, 29]].map(([x, y, r, sd, deep]) => (
          <Cluster key={sd} x={x} y={y} r={r} seed={sd} deep={deep} n={34} />
        ))}
        <Blossoms x0={1420} y0={460} w={500} h={560} n={40} seed={31} />
      </g>
      {/* loose petals, still */}
      {[[520, 240], [700, 520], [860, 700], [1500, 300], [620, 820], [300, 420]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="9" ry="5" transform={`rotate(${i * 37} ${x} ${y})`} fill="#f6daef" />
      ))}

      {/* rooftop railing + the Figur Weather sign (plants the f-OR-ecast gun) */}
      <rect x="0" y="946" width="1920" height="16" fill="#5b5577" />
      {Array.from({ length: 41 }, (_, i) => <rect key={i} x={i * 48 + 6} y="962" width="9" height="90" fill="#5b5577" />)}
      <rect x="0" y="1040" width="1920" height="40" fill="#c9c3d6" /><rect x="0" y="1040" width="1920" height="6" fill="#e6e1ee" />
      <Sign />
    </svg>
  );
}

// The Figur Weather sign, up on tall posts (board top-left at SIGN, 470 x 124). It sits above the dialogue box's
// highest spot: on choice beats the box lifts to bottom 318px (box top ~572, pins + NANDA pill ~548), so the board ends
// at y 528. Posts stand on the railing and pass behind the lower-left sakura branch (drawn in SignPosts, earlier).
export const SIGN = { x: 80, y: 402, w: 470, h: 124 };

function SignPosts() {
  const top = SIGN.y + 110, h = 946 - top;
  return (
    <g fill="#3a3550">
      <rect x={SIGN.x + 46} y={top} width="12" height={h} /><rect x={SIGN.x + 410} y={top} width="12" height={h} />
      <rect x={SIGN.x + 46} y="880" width="376" height="10" />
    </g>
  );
}

function Sign() {
  return (
    <g className="sign" transform={`translate(${SIGN.x} ${SIGN.y})`}>
      <rect width={SIGN.w} height={SIGN.h} rx="10" fill="#fdfbf2" stroke="#2a2440" strokeWidth="5" />
      <path d="M0 10 a10 10 0 0 1 10 -10 h450 a10 10 0 0 1 10 10 v30 h-470z" fill="#2a2440" />
      <text x="20" y="31" className="sign-head">Figur Weather</text>
      <text x="22" y="92" className="sign-body" textLength="360" lengthAdjust="spacingAndGlyphs"><OrSpans text="Today's f-{OR}-ecast: rain" /></text>
      <g transform="translate(422 76)">
        <path d="M-22 6 C-30 6 -32 -8 -20 -10 C-18 -24 4 -26 8 -12 C22 -14 26 6 12 6Z" fill="#8e9ab8" />
        {[-14, -2, 10].map((x) => <line key={x} x1={x} y1="14" x2={x - 4} y2="26" stroke="#4d78e2" strokeWidth="4" strokeLinecap="round" />)}
      </g>
    </g>
  );
}
