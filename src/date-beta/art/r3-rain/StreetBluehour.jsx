// street-bluehour (v2-street 2, "7:00 PM. Orange, then dark blue."): ref 16, a riverside street at blue hour (portrait,
// 168 px wide: the middle 724 px is its trace). Hand-built wings on rays from the vanishing point (1000, 640):
// left = the row of old shop houses coming toward us (a lit cafe, an awning, upper windows); right = the river: the
// sky's orange band under dark blue, the far bank's lit blocks, the water, the parapet and the next two lamps.
// Signs redrawn: 茶 / CAFE (the ref's vertical board), 本 / BOOKS.
import { R3Scene, along, pts, depths, Win, Lamp, WetBand, Stars, Plate, preloadTrace } from './parts.jsx';
import { rng } from '../util.js';

preloadTrace('street-bluehour');
const VP = [1000, 640];
const T = 'bluehour';
const L = (y600) => [0, VP[1] + (y600 - VP[1]) * 2.5]; // the left facade edge at x=0 for a height seen at x=600
const quadL = (ya, yb, t1, t2) => pts([along(VP, L(ya), t1), along(VP, L(ya), t2), along(VP, L(yb), t2), along(VP, L(yb), t1)]);

function LeftRow() {
  const t0 = 0.4; // x = 600
  const bays = depths(t0, 5, 0.45);
  return (
    <g>
      {/* facade plane, upper floor + shop floor, the walkway */}
      <polygon points={quadL(-200, 780, t0, 1.05)} fill="#5d5f84" />
      <polygon points={quadL(-200, 150, t0, 1.05)} fill="#54567a" />
      <polygon points={quadL(505, 530, t0, 1.05)} fill="#3d4461" />
      {/* upper windows: two lit, the rest dim */}
      {bays.slice(0, -1).map((t, i) => (
        <polygon key={i} points={quadL(220, 400, t + 0.03, bays[i + 1] - 0.05)} fill={i === 1 ? '#ffd98a' : '#44466a'} />
      ))}
      <polygon points={quadL(220, 400, bays[1] + 0.03, bays[2] - 0.05)} fill="#ffd98a" />
      <polygon points={quadL(180, 214, bays[3] + 0.02, bays[4] - 0.02)} fill="#3d4461" />
      {/* the shop floor: a lit cafe window + door, an awning */}
      <polygon points={quadL(560, 770, bays[0] + 0.02, bays[2] - 0.02)} fill="#ffcf7a" />
      <polygon points={quadL(560, 770, bays[2] + 0.03, bays[3] - 0.03)} fill="#34324a" />
      <polygon points={quadL(470, 540, bays[0], bays[3])} fill="#8a4658" />
      {[0.25, 0.5, 0.75].map((k) => {
        const t = bays[0] + (bays[3] - bays[0]) * k;
        return <polygon key={k} points={quadL(470, 540, t, t + 0.02)} fill="#6e3848" />;
      })}
      {/* a cafe table outside, like the ref's */}
      <rect x="220" y="880" width="170" height="16" fill="#3a3040" /><rect x="296" y="896" width="16" height="110" fill="#3a3040" />
      <WetBand x={280} y={960} w={120} h={110} c="#ffcf7a" o={0.35} />
    </g>
  );
}

function River() {
  const r = rng(8);
  const blocks = Array.from({ length: 11 }, (_, i) => ({ x: 1322 + i * 56 + r() * 10, w: 40 + r() * 30, h: 30 + r() * 110 }));
  return (
    <g>
      <defs>
        <linearGradient id="sbh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4c73" /><stop offset=".3" stopColor="#3f6483" /><stop offset=".44" stopColor="#9b8c9c" /><stop offset=".56" stopColor="#b8a0a8" />
          <stop offset=".66" stopColor="#667191" /><stop offset=".8" stopColor="#3a5b7b" /><stop offset="1" stopColor="#3f6583" />
        </linearGradient>
      </defs>
      <rect x="1322" y="0" width="598" height="624" fill="url(#sbh-sky)" />
      {/* cloud masses: dark blue over the orange band, a lit rim */}
      <path d="M1322 250 C1450 230 1560 262 1680 236 C1780 216 1860 240 1920 232 L1920 330 C1800 350 1700 322 1580 344 C1480 360 1400 330 1322 340Z" fill="#34507a" />
      <path d="M1322 340 C1400 330 1480 360 1580 344 C1700 322 1800 350 1920 330" stroke="#e8b0a0" strokeWidth="5" fill="none" opacity=".7" />
      <path d="M1322 90 C1500 50 1700 96 1920 70 L1920 150 C1700 176 1500 132 1322 146Z" fill="#2c4a70" />
      <Stars id="sbh-stars" clip="1322,0 1920,0 1920,200 1322,200" n={26} seed={16} h={200} />
      {/* far bank: lit blocks */}
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={624 - b.h} width={b.w} height={b.h} fill="#2c3f62" />
          {Array.from({ length: Math.floor(b.h / 18) }, (_, k) => (r() > 0.45
            ? <rect key={k} x={b.x + 6 + (k % 2) * (b.w / 2 - 4)} y={624 - b.h + 8 + Math.floor(k / 1) * 16} width="8" height="7" fill={r() > 0.3 ? '#ffd98a' : '#9fd4ff'} /> : null))}
        </g>
      ))}
      {/* the water: dark, with the far lights as broken vertical bands */}
      <polygon points={pts([[1322, 624], [1920, 624], [1920, 824], along(VP, [1920, 824], 0.12)])} fill="#1f3e5d" />
      {blocks.filter((_, i) => i % 2 === 0).map((b) => <WetBand key={b.x} x={b.x + b.w / 2} y={630} w={b.w * 0.5} h={110} c="#ffd98a" o={0.45} />)}
      {/* parapet: top face, river-side face, walkway-side face */}
      <polygon points={pts([along(VP, [1920, 810], 0.08), [1920, 810], [1920, 846], along(VP, [1920, 846], 0.08)])} fill="#b9bfd0" />
      <polygon points={pts([along(VP, [1920, 846], 0.08), [1920, 846], [1920, 1010], along(VP, [1920, 1010], 0.08)])} fill="#4f596c" />
      <polygon points={pts([along(VP, [1920, 1010], 0.08), [1920, 1010], [1920, 1080], [1560, 1080]])} fill="#697091" />
      {/* the walkway floor across the frame (clean cel over the tiny ref's mush), lamp-lit toward the far end */}
      <defs><linearGradient id="sbh-walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b3b3cc" /><stop offset=".3" stopColor="#7d86a6" /><stop offset="1" stopColor="#6a7396" /></linearGradient></defs>
      <polygon points={pts([along(VP, [0, 990], 0.08), along(VP, [1920, 1010], 0.08), [1920, 1010], [1920, 1080], [0, 1080], [0, 990]])} fill="url(#sbh-walk)" />
      {[0.2, 0.3, 0.45, 0.7].map((t) => <polyline key={t} points={pts([along(VP, [0, 990], t), along(VP, [1920, 1010], t)])} stroke="#5f6789" strokeWidth={3 * t + 1} fill="none" />)}
    </g>
  );
}

function Lamps() {
  // the ref's lamp row, straightened, then two more posts toward us on the parapet line; heads glow warm
  return (
    <g>
      {[[1218, 340, 752, 12, 1094], [1143, 452, 716, 9, 1066], [1102, 505, 700, 6, 1046]].map(([x, top, bot, w, hx]) => (
        <g key={x}>
          <rect x={x - w / 2} y={top} width={w} height={bot - top} fill="#2a3450" />
          <rect x={hx} y={top} width={x - hx} height={w * 0.5} fill="#2a3450" />
          <Lamp x={hx + w} y={top + w * 0.9} r={w * 0.9} tod={T} />
        </g>
      ))}
      {[[1480, 120, 832, 14], [1790, -40, 900, 20]].map(([x, top, bot, w]) => (
        <g key={x}>
          <rect x={x - w / 2} y={top} width={w} height={bot - top} fill="#2a3450" />
          <rect x={x - w * 4} y={top} width={w * 4.5} height={w * 0.7} fill="#2a3450" />
          <Lamp x={x - w * 3.4} y={top + w * 1.6} r={w * 1.1} tod={T} />
        </g>
      ))}
    </g>
  );
}

export default function StreetBluehour({ rm }) {
  return (
    <R3Scene id="street-bluehour" tod={T} rm={rm}
      label="A riverside street at 7 PM: the sky orange at the bottom and dark blue on top, old shop houses with lit windows on the left, street lamps along the river, the far bank lit up.">
      <River />
      <LeftRow />
      <Lamps />
      <Plate x={836} y={312} w={38} h={130} bg="#f2eee6" fg="#2b2f5a" jp="茶" en="" vertical jpSize={30} />
      <text x="855" y="432" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="12" fill="#8a4658">CAFE</text>
      <Plate x={104} y={560} w={120} h={150} bg="#f2eee6" fg="#2b2f5a" jp="本" en="BOOKS" jpSize={70} enSize={26} />
      <WetBand x={1060} y={740} w={180} h={120} c="#fff0c0" o={0.3} />
    </R3Scene>
  );
}
