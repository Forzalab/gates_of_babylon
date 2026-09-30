// The library route: a small rail crossing under a weeping sakura. The girl + bike in the ref are inpainted out
// (prep.py); the overlay rebuilds what the inpaint smeared: the road, the hedge, the striped gate arm, the rails,
// the crossbuck + its two lamps, and the left gate arm.
import { TraceScene, preloadTrace } from './Grade.jsx';

preloadTrace('rail-crossing');

const ARM = (x1, y1, x2, y2, w = 18) => (
  <g strokeLinecap="round">
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1d1b24" strokeWidth={w} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd23a" strokeWidth={w - 4} strokeDasharray="34 34" />
  </g>
);

export default function RailCrossing({ rm }) {
  return (
    <TraceScene id="rail-crossing" rm={rm} grade={{ tone: 'day', sun: [1780, 40], petals: 34, sparkles: 16 }}
      label="A small rail crossing on a spring morning: a weeping cherry tree over a white wall, the gate arm up, petals drifting, green hills far away.">
      {/* road + hedge where the girl stood (colours sampled from the traced road/grass around the hole) */}
      <defs>
        <linearGradient id="rc-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4c3cc" /><stop offset="1" stopColor="#a9a6b6" />
        </linearGradient>
      </defs>
      <polygon points="1050,690 1262,690 1450,1080 880,1080" fill="url(#rc-road)" />
      <g>
        {[[1300, 720, 58, '#4f7f45'], [1360, 700, 64, '#5b8f4c'], [1420, 730, 56, '#4a7a40'], [1330, 790, 70, '#679d55'],
          [1410, 820, 62, '#5b8f4c'], [1380, 880, 60, '#4f7f45'], [1300, 860, 40, '#7aae5e']].map(([x, y, r, c], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c} />
        ))}
        {[[1320, 700], [1370, 690], [1340, 780], [1405, 800]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="18" fill="#9ccf78" opacity=".7" />)}
      </g>
      {/* blossom tint over the traced canopy (the 24-colour trace greys the pale pink out) */}
      <g fill="#f7bfdc" opacity=".45" style={{ mixBlendMode: 'multiply' }}>
        {[[330, 180, 190], [520, 150, 170], [620, 330, 180], [430, 380, 150], [700, 520, 110], [250, 320, 120], [800, 250, 110]].map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} />
        ))}
      </g>
      {/* petal shadows on the road */}
      <g fill="#b3a6c7" opacity=".55">
        {[[980, 900], [1090, 960], [1210, 870], [1320, 1010], [1010, 1030]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="46" ry="10" />)}
      </g>
      {/* the rails, crossing the whole frame */}
      <g>
        <polygon points="0,1000 1920,985 1920,1060 0,1080" fill="#8f8898" />
        <rect x="0" y="1004" width="1920" height="9" fill="#dcdce6" />
        <rect x="0" y="1050" width="1920" height="9" fill="#dcdce6" />
        <rect x="0" y="1013" width="1920" height="4" fill="#4b4656" />
      </g>
      {/* gate arms: right one raised, left one on its post */}
      {ARM(1138, 228, 1240, 705)}
      <rect x="1214" y="690" width="56" height="70" rx="6" fill="#dcdce6" stroke="#2a2830" strokeWidth="4" />
      {ARM(378, 318, 220, 1000, 16)}
      {/* crossing signal: pole, crossbuck, two red lamps, a round sign */}
      <rect x="1455" y="300" width="26" height="740" fill="#e9c93a" />
      <rect x="1455" y="300" width="26" height="740" fill="none" stroke="#1d1b24" strokeWidth="3" />
      <g transform="translate(1468 345)">
        <rect x="-110" y="-20" width="220" height="40" rx="6" fill="#ffd23a" stroke="#1d1b24" strokeWidth="4" transform="rotate(35)" />
        <rect x="-110" y="-20" width="220" height="40" rx="6" fill="#ffd23a" stroke="#1d1b24" strokeWidth="4" transform="rotate(-35)" />
      </g>
      {[520, 630].map((y) => (
        <g key={y}>
          <rect x="1350" y={y - 6} width="110" height="12" fill="#2a2830" />
          <circle cx="1352" cy={y} r="42" fill="#2a2830" />
          <circle cx="1352" cy={y} r="30" fill="#b3263a" />
          <circle cx="1344" cy={y - 8} r="9" fill="#ff8a8a" opacity=".8" />
        </g>
      ))}
      <circle cx="1540" cy="520" r="36" fill="#f4f6fb" stroke="#d23a3a" strokeWidth="8" />
      <rect x="1536" y="556" width="8" height="120" fill="#b8b8c4" />
    </TraceScene>
  );
}
