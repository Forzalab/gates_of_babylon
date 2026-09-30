// The town: the scramble crossing by day (flat-vector ref) and the rainy billboard crossing at night (after the train).
// Both refs are full of people, so the traced part stops at the building line and everything below it is hand-drawn:
// the plaza, the zebra stripes in perspective, long sun shadows (day) / wet neon reflections (night).
import { TraceScene, preloadTrace } from './Grade.jsx';
import Rain from '../Rain.jsx';

preloadTrace('crossing-day'); preloadTrace('crossing-night');

// zebra bands in perspective toward vanishing point (vx, vy): stripes run toward the viewer
function Zebra({ vx, vy, y0, y1, n, spread, fill, opacity = 1 }) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = -spread + (2 * spread * i) / (n - 1), b = a + (spread / n) * 0.9;
    const px = (t, y) => vx + t * (y - vy);
    out.push(<polygon key={i} points={`${px(a, y0)},${y0} ${px(b, y0)},${y0} ${px(b, y1)},${y1} ${px(a, y1)},${y1}`} fill={fill} opacity={opacity} />);
  }
  return <g>{out}</g>;
}

// horizontal crosswalk bars (the far walk across the frame)
const Bars = ({ y, h, fill, n = 14, skew = 0 }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const x = (1920 / n) * i + 18;
    return <polygon key={i} points={`${x},${y} ${x + 1920 / n - 50},${y} ${x + 1920 / n - 50 + skew},${y + h} ${x + skew},${y + h}`} fill={fill} />;
  })}</g>
);

export function CrossingDay({ rm }) {
  return (
    <TraceScene id="crossing-day" rm={rm} grade={{ tone: 'day', sun: [955, 440], sparkles: 20 }}
      label="A huge scramble crossing in town on a bright afternoon, empty for a moment: glass towers, billboards, the sun low between the buildings.">
      {/* building feet + far sidewalk (covers the inpainted crowd band) */}
      <rect x="0" y="470" width="1920" height="70" fill="#d8c9a6" />
      <rect x="0" y="470" width="1920" height="12" fill="#7d6a58" opacity=".5" />
      {/* plaza */}
      <polygon points="0,530 1920,530 1920,1080 0,1080" fill="#6b6f92" />
      <polygon points="700,530 1220,530 1920,1080 0,1080" fill="#7c7fa0" />
      <Bars y={548} h={34} fill="#f4efe2" n={16} skew={-6} />
      <Zebra vx={960} vy={450} y0={610} y1={1080} n={13} spread={2.6} fill="#f7f1e2" />
      {/* shopfront feet along the far walk (awnings + lit glass), in the ref's flat poster palette */}
      {[[20, '#c0533a'], [150, '#2f6fb0'], [300, '#e0a23a'], [460, '#5a4a8a'], [1300, '#2f6fb0'], [1450, '#c0533a'], [1600, '#e0a23a'], [1760, '#5a4a8a']].map(([x, c]) => (
        <g key={x}>
          <rect x={x} y="486" width="130" height="16" fill={c} />
          <rect x={x + 8} y="504" width="114" height="24" fill="#fff3cf" opacity=".75" />
        </g>
      ))}
      {/* long coloured building shadows raking across the stripes (the ref's warm/violet/blue bands) */}
      <g style={{ mixBlendMode: 'multiply' }} opacity=".35">
        <polygon points="0,700 700,560 760,560 0,860" fill="#6a4fb0" />
        <polygon points="1920,690 1200,560 1150,560 1920,880" fill="#3f6fc0" />
        <polygon points="0,960 820,600 860,600 120,1080 0,1080" fill="#e0a23a" />
      </g>
      {/* the sun's path: a warm lane down the middle */}
      <polygon points="930,530 990,530 1180,1080 740,1080" fill="#ffe6a8" opacity=".55" style={{ mixBlendMode: 'screen' }} />
      {/* long shadows of the street furniture (no people: the square is ours) */}
      <g fill="#3a3560" opacity=".45">
        <polygon points="228,540 244,540 520,1080 470,1080" />
        <polygon points="1680,540 1696,540 1460,1080 1410,1080" />
      </g>
      {/* traffic signal poles */}
      {[[228, 1], [1682, -1]].map(([x, s]) => (
        <g key={x}>
          <rect x={x} y="250" width="16" height="292" fill="#2d2b3f" />
          <rect x={x - (s > 0 ? 0 : 60)} y="250" width="76" height="30" rx="6" fill="#2d2b3f" />
          <circle cx={x + (s > 0 ? 28 : -28) + 8} cy="265" r="10" fill="#49e0a0" />
          <rect x={x - 14} y="330" width="44" height="64" rx="6" fill="#2d2b3f" />
          <rect x={x - 6} y="340" width="28" height="20" rx="3" fill="#ff6a5a" opacity=".5" />
          <rect x={x - 6} y="366" width="28" height="20" rx="3" fill="#6affc2" />
        </g>
      ))}
    </TraceScene>
  );
}

// billboard panel with its own clean art (covers the traced faces/text)
function Panel({ x, y, w, h, bg, children }) {
  return (
    <g opacity=".92">
      <rect x={x - 30} y={y - 30} width={w + 60} height={h + 60} rx="30" fill={bg} filter="url(#cn-halo)" opacity=".7" />
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} fill="#2a2046" />
      <rect x={x} y={y} width={w} height={h} fill={bg} />
      <rect x={x} y={y} width={w} height={h} fill="url(#cn-glass)" />
      {children}
    </g>
  );
}

const HEART = 'M0 -30C-40 -90 -130 -50 -84 18L0 90L84 18C130 -50 40 -90 0 -30Z';

export function CrossingNight({ rm }) {
  return (
    <TraceScene id="crossing-night" rm={rm} grade={{ tone: 'night', sun: [1105, 290], sparkles: 30 }}
      label="A rainy night crossing lit by giant screens: pink hearts and the words ずっと一緒, wet asphalt full of neon reflections.">
      <defs>
        <filter id="cn-halo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24" /></filter>
        <linearGradient id="cn-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".25" /><stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cn-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2350" /><stop offset="1" stopColor="#120e2a" />
        </linearGradient>
      </defs>
      {/* top screen: a heart */}
      <Panel x={958} y={176} w={294} h={236} bg="#ffe3f1">
        <path d={HEART} transform="translate(1105 285) scale(.9)" fill="#ff5fa2" />
      </Panel>
      {/* mid screen: ずっと一緒 ("together forever") */}
      <Panel x={962} y={632} w={306} h={186} bg="#ff8fc4">
        <text x="1115" y="748" textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="800" fontSize="54" fill="#fff">ずっと一緒</text>
      </Panel>
      {/* the mascot screen, left: a moon + stars instead of a face */}
      <Panel x={398} y={704} w={270} h={220} bg="#8fb8ff">
        <circle cx="533" cy="800" r="62" fill="#fff6d8" />
        <circle cx="560" cy="780" r="58" fill="#8fb8ff" />
        <path d="M450 740l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="#fff" />
      </Panel>
      <Panel x={1088} y={852} w={156} h={90} bg="#ffd27a" />
      {/* wet road: base, far walk, zebra, neon reflections */}
      <rect x="0" y="880" width="1920" height="200" fill="url(#cn-road)" />
      <rect x="0" y="876" width="1920" height="8" fill="#ff9ad0" opacity=".6" />
      <Zebra vx={960} vy={760} y0={900} y1={1080} n={15} spread={4.2} fill="#d7d3f2" opacity=".55" />
      <g style={{ mixBlendMode: 'screen' }} opacity=".7">
        {[[1105, '#ff5fa2', 70], [1115, '#ff8fc4', 40], [533, '#8fb8ff', 60], [1166, '#ffd27a', 30], [310, '#ff6a3a', 24], [1640, '#ffcf6a', 30]].map(([x, c, w], i) => (
          <rect key={i} x={x - w / 2} y="890" width={w} height="190" fill={c} opacity={0.55 - i * 0.04} />
        ))}
      </g>
      <Rain rm={rm} n={120} opacity={0.3} color="#cfd6ff" />
    </TraceScene>
  );
}
