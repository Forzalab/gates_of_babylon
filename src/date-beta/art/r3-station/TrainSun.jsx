// v2-train 4: the loop line ("Twelve stops..."), 4:40 PM (ref 13: sunlit carriage, pink walls).
// Hand pass: windows = flat warm yellow with a soft glow, sun shafts on the floor as clean cel parallelograms, the
// light beam from the far right door, straight poles, the route map above the door (12 stops, NAND -> OR) and our
// own posters over the ref's. The aisle (Nanda's spot) stays open.
import { R3Scene, Pole, TOD, preloadTrace, pts } from './parts.jsx';

preloadTrace('train-sun');

const T = TOD.afternoon;
// window glass (flat warm), frames drawn around them
const GLASS = [
  [[0, 228], [236, 232], [236, 420], [0, 418]], [[0, 442], [236, 444], [236, 598], [0, 600]],
  [[548, 336], [608, 336], [608, 572], [548, 572]], [[700, 364], [746, 364], [746, 568], [700, 568]],
  [[888, 414], [938, 416], [938, 576], [888, 576]], [[948, 418], [998, 420], [998, 574], [948, 574]],
  [[1062, 442], [1080, 442], [1080, 560], [1062, 560]], [[1104, 446], [1118, 446], [1118, 558], [1104, 558]],
  [[1162, 470], [1178, 470], [1178, 556], [1162, 556]], [[1188, 472], [1202, 472], [1202, 556], [1188, 556]],
  [[1228, 480], [1238, 480], [1238, 552], [1228, 552]], [[1246, 482], [1256, 482], [1256, 552], [1246, 552]],
  [[1426, 488], [1448, 488], [1448, 556], [1426, 556]],
];
// sun patches on the floor (ref 13), far -> near
const SUN = [
  [[1372, 652], [1466, 652], [1452, 680], [1356, 680]], [[1322, 692], [1444, 692], [1428, 716], [1306, 716]],
  [[1262, 736], [1392, 736], [1372, 760], [1240, 760]], [[1222, 764], [1368, 764], [1350, 790], [1206, 790]],
  [[1098, 832], [1362, 840], [1352, 872], [1084, 862]], [[1000, 890], [1330, 902], [1318, 956], [988, 940]],
  [[804, 1062], [1010, 1066], [1004, 1080], [796, 1080]],
];

export default function TrainSun({ rm }) {
  return (
    <R3Scene id="train-sun" tone="afternoon" rm={rm}
      label="Inside a quiet train at 4:40 PM: pink walls, warm yellow windows, sun shafts across the floor, a route map of twelve stops.">
      <defs>
        <linearGradient id="r3ts-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.window} /><stop offset="1" stopColor={T.glow} />
        </linearGradient>
        <filter id="r3ts-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16" /></filter>
        <linearGradient id="r3ts-beam" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4d6" stopOpacity=".75" /><stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* window frames + glass + glow */}
      <rect x="0" y="212" width="252" height="404" fill="#8a6558" />
      {GLASS.map((g, i) => <polygon key={i} points={pts(g)} fill={T.glow} filter="url(#r3ts-soft)" opacity=".7" />)}
      {GLASS.map((g, i) => <polygon key={`g${i}`} points={pts(g)} fill="url(#r3ts-glass)" />)}
      {/* the sea line far away in the big window (flat, pale) */}
      <rect x="0" y="520" width="236" height="10" fill="#e9d6c0" opacity=".8" />
      {/* the aisle floor: one warm cel (dark near, lit far), a soft sheen down the middle */}
      <linearGradient id="r3ts-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e39a72" /><stop offset=".4" stopColor="#c46a4a" /><stop offset="1" stopColor="#8e3f2e" />
      </linearGradient>
      <polygon points="250,1080 640,822 1150,668 1350,640 1480,650 1396,762 1296,1080" fill="url(#r3ts-floor)" />
      <polygon points="1170,668 1290,660 1060,1080 780,1080" fill="#ffd9b0" opacity=".14" />
      {/* the beam from the far right door + the floor patches */}
      <polygon points="1640,380 1560,380 1180,960 1420,980" fill="url(#r3ts-beam)" filter="url(#r3ts-soft)" opacity=".8" style={{ mixBlendMode: 'screen' }} />
      {SUN.map((s, i) => <polygon key={i} points={pts(s)} fill="#fff0c8" opacity=".92" />)}
      {SUN.map((s, i) => <polygon key={`r${i}`} points={pts(s)} fill={T.glow} opacity=".45" filter="url(#r3ts-soft)" />)}
      {/* straight poles */}
      <Pole x={578} y0={160} y1={692} w={10} fill="#6b4a42" hi="#e8c2a8" />
      <Pole x={1502} y0={0} y1={748} w={16} fill="#6b4a42" hi="#ffe0c0" />
      {/* route map above the door: 12 stops, NAND -> OR (the ref's red strip) */}
      <g transform="translate(585 152) matrix(1 .3 0 1 0 0)">
        <rect width="192" height="52" fill="#fff8ee" stroke="#b58a78" strokeWidth="3" />
        <line x1="14" y1="30" x2="178" y2="30" stroke="#e0467f" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={14 + i * 14.9} cy="30" r={i === 0 || i === 11 ? 5.5 : 3.5} fill={i === 11 ? '#e0467f' : '#fff'} stroke="#e0467f" strokeWidth="2" />)}
        <text x="8" y="16" className="r3-sign" fill="#6b3a3a" fontSize="12">NAND</text>
        <text x="184" y="16" textAnchor="end" className="r3-sign" fill="#e0467f" fontSize="12">OR ♡</text>
        <text x="96" y="48" textAnchor="middle" className="r3-sign" fill="#6b3a3a" fontSize="10">12 stops</text>
      </g>
      {/* our posters over the ref's */}
      <rect x="314" y="314" width="138" height="202" fill="#bfe3ff" stroke="#fff" strokeWidth="5" />
      <path d="M314 460 C360 430 410 440 452 420 L452 516 L314 516Z" fill="#9fcf8f" />
      <rect x="338" y="436" width="92" height="30" rx="10" fill="#ff8fc0" />
      {[348, 370, 392, 412].map((x) => <rect key={x} x={x} y="443" width="14" height="10" rx="2" fill="#fff6d8" />)}
      <text x="383" y="366" textAnchor="middle" className="r3-jp" fill="#2d4d6a" fontSize="30">のってね</text>
      <text x="383" y="400" textAnchor="middle" className="r3-sign" fill="#e0467f" fontSize="20">RIDE WITH ME</text>
      <rect x="1808" y="128" width="70" height="368" fill="#ffc2dc" stroke="#fff" strokeWidth="4" />
      <text x="1843" y="190" textAnchor="middle" className="r3-jp" fill="#8a2a55" fontSize="30" writingMode="tb">ずっと</text>
      <rect x="266" y="194" width="48" height="104" rx="4" fill="#2a1f22" />
      <circle cx="290" cy="232" r="15" fill="#ffc861" />
      <text x="290" y="282" textAnchor="middle" className="r3-sign" fill="#ffc861" fontSize="14">4:40</text>
    </R3Scene>
  );
}
