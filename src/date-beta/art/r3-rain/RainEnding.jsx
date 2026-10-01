// rain-ending (v2-rain 4, "The rain stops. Wet shoes walk to her street."): ref 02, a suburban curve in light rain.
// Hand pass: the utility pole + lamp arm straightened, the orange corner mirror + its post, a 止まれ (STOP) sign on it,
// the white road lines redrawn clean, mirrored puddles, the sky brightening in the gap at the top, drizzle only.
import { R3Scene, Puddle, WetBand, preloadTrace } from './parts.jsx';

preloadTrace('rain-ending');
const T = 'overcast';

function SkyGap() {
  return (
    <g>
      <defs>
        <linearGradient id="ren-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".85" /><stop offset=".6" stopColor="#f1f0e4" stopOpacity=".35" /><stop offset="1" stopColor="#e6ebee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="1086,0 1640,0 1596,70 1420,190 1300,236 1210,300 1092,318" fill="url(#ren-sky)" />
      {/* a thin warm rim on the cloud edge: the light is coming back */}
      <path d="M1100 120 Q1240 80 1380 110 Q1480 60 1600 40" stroke="#fff3cf" strokeWidth="6" fill="none" opacity=".55" />
    </g>
  );
}

function Pole() {
  return (
    <g>
      <rect x="1036" y="0" width="38" height="722" fill="#4a5454" />
      <rect x="1060" y="0" width="14" height="722" fill="#3a4242" />
      <path d="M1072 170 L1150 142" stroke="#4a5454" strokeWidth="9" />
      <rect x="1134" y="136" width="40" height="12" rx="5" fill="#d9dfdf" />
      {[250, 330].map((y) => <rect key={y} x="1022" y={y} width="66" height="8" fill="#4a5454" />)}
    </g>
  );
}

function Mirror() {
  return (
    <g>
      <rect x="1680" y="280" width="16" height="800" fill="#c98a3a" />
      <rect x="1690" y="280" width="6" height="800" fill="#9c6a2a" />
      <ellipse cx="1700" cy="182" rx="76" ry="112" fill="#e0782c" />
      <ellipse cx="1700" cy="182" rx="62" ry="96" fill="#dfe6e8" />
      <path d="M1660 150 Q1700 110 1740 140 L1740 200 Q1700 170 1660 210Z" fill="#b8c4c8" />
      {/* 止まれ: the red inverted triangle, white text (止 = grade 2) */}
      {/* above the dialogue box (a choice beat: the box runs y 560-775 out to x 1660) */}
      <polygon points="1606,330 1770,330 1688,470" fill="#d8303a" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <text x="1688" y="378" textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="800" fontSize="30" fill="#fff">止まれ</text>
      <text x="1688" y="414" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="22" fill="#fff">STOP</text>
    </g>
  );
}

function Road() {
  const W = '#e9eef0';
  return (
    <g fill="none" stroke={W} strokeLinecap="round" strokeLinejoin="round" opacity=".72">
      <path d="M1170 572 Q1300 650 1480 740 Q1580 790 1540 900 L1440 1080" strokeWidth="30" />
      <path d="M1096 610 Q1110 700 1128 752" strokeWidth="12" />
      <path d="M410 800 Q800 800 1110 770" strokeWidth="8" />
      <path d="M520 866 Q720 880 740 930 Q700 990 540 1040 L420 1080" strokeWidth="30" />
      <path d="M150 1080 L540 940" strokeWidth="26" />
      <path d="M1024 822 L1236 822" strokeWidth="14" />
      <polygon points="1236,806 1310,806 1270,840 1228,840" fill={W} stroke="none" />
    </g>
  );
}

export default function RainEnding({ rm }) {
  return (
    <R3Scene id="rain-ending" tod={T} rm={rm} rain={{ n: 70, len: 44, width: 1.6, slant: 0.05, k: 0.7 }}
      label="A quiet suburban road curving between hedges and houses after the rain: the sky is brightening, puddles on the road, an orange corner mirror with a STOP sign.">
      <SkyGap />
      <Road />
      <Pole />
      <Mirror />
      <Puddle x={820} y={960} rx={150} ry={22} c="#56636c" rim="#dfe8ec" sky="#f4f2e4" />
      <Puddle x={1250} y={1010} rx={120} ry={18} c="#56636c" rim="#dfe8ec" sky="#f4f2e4" />
      <WetBand x={1055} y={760} w={40} h={260} c="#28302f" o={0.35} />
      <WetBand x={1300} y={760} w={60} h={180} c="#f4f2e4" o={0.35} />
    </R3Scene>
  );
}
