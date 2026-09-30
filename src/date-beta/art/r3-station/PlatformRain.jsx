// v2-train 6: Her stop. Doors open. She pulls you out. (ref 09: orange train, wet platform; 08 + 10 = the same
// composition: train on the left, the lit platform running to the vanishing point, rain on the right.)
// The ref's umbrella girl is inpainted in prep and the train side + wet floor are redrawn here, so her spot is EMPTY:
// Nanda stands in the middle of the platform instead (the red umbrella comes back in v2-rain 1).
// Hand pass: the train side as clean cels in perspective (orange body, lit warm windows, the teal stripe, an OPEN door),
// the wet floor = vertical reflection bands under every window + mirrored darker puddles, the hanging sign 「OR駅」
// (the train from the board, 4:30 → OR, arrives), rain = 2 static layers beyond the canopy (reduced motion: 1).
import { R3Scene, RainPair, Pole, TOD, preloadTrace, pts } from './parts.jsx';

preloadTrace('platform-rain');

const T = TOD['rain-dusk'];
// the train's long lines, as y at x = 0 and x = 1040 (they meet far off toward the station's end)
const L = { roof: [95, 470], wtop: [190, 465], wbot: [520, 540], stT: [540, 546], stB: [592, 556], bot: [790, 570], edge: [880, 572] };
const y = (k, x) => L[k][0] + ((L[k][1] - L[k][0]) * x) / 1040;
const quad = (a, b, k0, k1) => [[a, y(k0, a)], [b, y(k0, b)], [b, y(k1, b)], [a, y(k1, a)]];
// windows (x ranges, near -> far) and doors; door 0 is the open one she pulls you out of
const WINDOWS = [[270, 452], [480, 652], [760, 836], [850, 902], [955, 992], [1004, 1030]];
const DOORS = [[70, 236], [688, 746], [912, 946]];

function Train() {
  return (
    <g>
      <polygon points={pts([[0, 0], [1040, 470], [1040, 572], [0, 900]])} fill="#1b2a2e" />
      <polygon points={pts([[0, y('roof', 0) - 40], [1040, y('roof', 1040) - 4], [1040, y('roof', 1040)], [0, y('roof', 0)]])} fill="#d9c7a6" />
      <polygon points={pts(quad(0, 1040, 'roof', 'bot'))} fill="#e8913e" />
      <polygon points={pts(quad(0, 1040, 'wbot', 'bot'))} fill="#cf7431" />
      <polygon points={pts(quad(0, 1040, 'stT', 'stB'))} fill="#1f4a4c" />
      {WINDOWS.map(([a, b]) => (
        <g key={a}>
          <polygon points={pts(quad(a, b, 'wtop', 'wbot'))} fill={T.glow} opacity=".55" filter="url(#r3pr-soft)" />
          <polygon points={pts(quad(a, b, 'wtop', 'wbot'))} fill={T.window} stroke="#9a5a26" strokeWidth="5" />
          <polygon points={pts(quad(a, b, 'wtop', 'wtop').map(([x, yy], i) => [x, i < 2 ? yy : yy + (y('wbot', x) - y('wtop', x)) * 0.18]))} fill="#fff4d6" opacity=".6" />
        </g>
      ))}
      {DOORS.map(([a, b], i) => {
        const m = (a + b) / 2;
        return (
          <g key={a}>
            <polygon points={pts(quad(a, b, 'wtop', 'bot'))} fill={i === 0 ? '#ffe6a8' : '#d98537'} stroke="#8a4a1e" strokeWidth="5" />
            {i === 0 ? (
              // the open door: warm light spills out onto the wet floor
              <polygon points={pts([[a, y('bot', a)], [b, y('bot', b)], [b + 90, y('edge', b + 90) + 60], [a - 40, y('edge', a) + 120]])} fill="#ffd98a" opacity=".35" />
            ) : (
              <>
                <line x1={m} y1={y('wtop', m)} x2={m} y2={y('bot', m)} stroke="#8a4a1e" strokeWidth="4" />
                <polygon points={pts(quad(a + 6, m - 6, 'wtop', 'wbot'))} fill={T.window} />
                <polygon points={pts(quad(m + 6, b - 6, 'wtop', 'wbot'))} fill={T.window} />
              </>
            )}
          </g>
        );
      })}
      <polygon points={pts(quad(0, 1040, 'bot', 'edge'))} fill="#16211f" />
    </g>
  );
}

function WetFloor() {
  // floor between the train's edge and the tactile strip, then the reflections
  const floor = [[0, y('edge', 0)], [1060, 572], [1086, 560], [822, 1080], [0, 1080]];
  return (
    <g>
      <linearGradient id="r3pr-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0a85a" /><stop offset=".45" stopColor="#bf7440" /><stop offset="1" stopColor="#5a3a30" />
      </linearGradient>
      <clipPath id="r3pr-floor-clip"><polygon points={pts(floor)} /></clipPath>
      <polygon points={pts(floor)} fill="url(#r3pr-floor)" />
      <g clipPath="url(#r3pr-floor-clip)">
        {/* vertical reflection bands: each lit window mirrored straight down, fading */}
        {[...WINDOWS, [70, 236]].map(([a, b]) => (
          <polygon key={a} points={pts([[a, y('edge', a)], [b, y('edge', b)], [b + (b - 540) * 0.15, 1080], [a + (a - 540) * 0.15, 1080]])} fill={T.window} opacity=".42" />
        ))}
        {/* the train's teal stripe, mirrored */}
        <polygon points={pts([[0, 960], [1060, 580], [1060, 586], [0, 990]])} fill="#1f4a4c" opacity=".45" />
        {/* puddles: mirrored, darker shapes with one bright rim each */}
        {[[300, 990, 150, 26], [620, 880, 110, 18], [180, 1060, 120, 20], [870, 700, 60, 10]].map(([cx, cy, rx, ry]) => (
          <g key={cx}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#23282f" opacity=".55" />
            <ellipse cx={cx - rx * 0.2} cy={cy - ry * 0.3} rx={rx * 0.5} ry={ry * 0.25} fill={T.window} opacity=".35" />
          </g>
        ))}
        {/* tile joints toward the far end */}
        <g stroke="#2a1d1e" strokeWidth="2" opacity=".3">
          {[640, 700, 780, 880, 1000].map((yy) => <line key={yy} x1="0" y1={yy} x2="1100" y2={yy} />)}
        </g>
      </g>
      {/* the wet strip past the tactile line, down to the track edge (teal, streaked by the far lamps) */}
      <polygon points="1000,1080 1098,560 1114,560 1184,1080" fill="#23413f" />
      <g stroke="#9fd0c4" strokeWidth="3" opacity=".35">
        <line x1="1060" y1="1080" x2="1104" y2="600" /><line x1="1120" y1="1080" x2="1110" y2="640" />
      </g>
      {/* the yellow tactile strip + its wet shine */}
      <polygon points="822,1080 1000,1080 1098,560 1086,560" fill="#e9b53a" />
      <polygon points="930,1080 960,1080 1094,560 1091,560" fill="#fff0b0" opacity=".5" />
    </g>
  );
}

export default function PlatformRain({ rm }) {
  return (
    <R3Scene id="platform-rain" tone="rain-dusk" rm={rm}
      label="Her stop in the rain: an orange train with its door open on the left, the wet platform shining with window light, an empty spot in the middle.">
      <defs>
        <filter id="r3pr-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
        <clipPath id="r3pr-sky"><polygon points="560,0 1920,0 1920,1080 1150,1080 1100,560" /></clipPath>
      </defs>
      <Train />
      <WetFloor />
      {/* canopy post, straight */}
      <Pole x={1165} y0={262} y1={720} w={14} fill="#d8a46a" hi="#ffe0a8" />
      {/* the hanging station sign: 「OR駅」 */}
      {/* (moved left of the ref's spot so Nanda's raised choice pose, x 730-1190, never hides it) */}
      <rect x="560" y="262" width="4" height="40" fill="#2a2a2a" /><rect x="660" y="262" width="4" height="40" fill="#2a2a2a" />
      <rect x="540" y="300" width="148" height="52" rx="4" fill="#f2c64a" stroke="#6a4a10" strokeWidth="3" />
      <text x="614" y="339" textAnchor="middle" className="r3-jp" fill="#2a1d10" fontSize="36">OR駅</text>
      <rect x="540" y="300" width="148" height="52" rx="4" fill={T.glow} opacity=".25" filter="url(#r3pr-soft)" />
      <RainPair seed={5} n={220} box={[560, 0, 1360, 1080]} len={[40, 90]} slant={0.06} color={T.rain} opacity={0.45} width={2} clip="r3pr-sky" rm={rm} />
    </R3Scene>
  );
}
