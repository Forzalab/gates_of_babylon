// rain-alley (v2-rain 2, "Her shoes are wet. Puddles."): ref 01, a low wet lane between block walls in the rain.
// Hand pass: poles straightened (grey pole, green pipe, the utility pole + far pole, wires), the lit windows + wall lamps
// flat warm with a glow, their vertical reflection bands on the wet road, mirrored puddles, the white road edge line,
// and the red vertical sign redrawn (こめや / RICE).
import { R3Scene, Win, Lamp, WetBand, Puddle, Plate, preloadTrace } from './parts.jsx';

preloadTrace('rain-alley');
const T = 'rain-dusk';

function Poles() {
  return (
    <g>
      {/* wires first, behind the poles */}
      <g stroke="#141a28" strokeWidth="3" fill="none">
        <path d="M1030 0 Q1150 150 1244 272" /><path d="M1100 0 Q1190 160 1244 300" /><path d="M1244 280 Q1290 380 1312 440" />
        <path d="M1500 110 Q1400 150 1256 272" />
      </g>
      {/* utility pole + crossarms, and the far one */}
      <rect x="1236" y="176" width="16" height="530" fill="#262c3b" />
      <rect x="1180" y="266" width="98" height="8" fill="#262c3b" /><rect x="1196" y="318" width="74" height="7" fill="#262c3b" />
      <rect x="1302" y="430" width="8" height="250" fill="#2e3546" /><rect x="1286" y="440" width="40" height="5" fill="#2e3546" />
      {/* the grey concrete pole, left of centre, with its rust band */}
      <rect x="592" y="0" width="62" height="890" fill="#3e4654" />
      <rect x="628" y="0" width="26" height="890" fill="#2c3340" />
      <rect x="592" y="500" width="62" height="12" fill="#2c3340" />
      <rect x="606" y="512" width="26" height="370" fill="#4f3438" opacity=".7" />
      {/* the green pipe pole, right */}
      <rect x="1702" y="0" width="90" height="1000" fill="#2f6a62" />
      <rect x="1702" y="0" width="22" height="1000" fill="#4f8f84" />
      <rect x="1760" y="0" width="32" height="1000" fill="#23504a" />
      {[70, 330, 640].map((y) => <rect key={y} x="1694" y={y} width="106" height="16" fill="#23504a" />)}
    </g>
  );
}

function Lights() {
  return (
    <g>
      <Win x={322} y={232} w={88} h={122} tod={T} frame="#4a4238" />
      <Win x={1016} y={422} w={74} h={30} tod={T} frame="#4a4238" />
      <Win x={1590} y={495} w={66} h={120} tod={T} o={0.85} />
      <Lamp x={958} y={562} r={14} tod={T} />
      <Lamp x={1024} y={565} r={8} tod={T} />
      <Lamp x={1818} y={338} r={14} tod={T} />
    </g>
  );
}

// wet road: the white edge line, the kerb, reflection bands under each light, puddles (the sky mirrored, darker)
function Wet() {
  return (
    <g>
      <polygon points="1236,698 1250,698 452,1080 410,1080" fill="#c9d2e2" opacity=".85" />
      <polygon points="1452,690 1466,690 1780,1080 1738,1080" fill="#b7c2d6" opacity=".7" />
      <WetBand x={962} y={800} w={50} h={250} c="#ffd27a" o={0.6} />
      <WetBand x={1134} y={760} w={44} h={300} c="#dfe7f5" o={0.55} />
      <WetBand x={1624} y={800} w={84} h={280} c="#ffd27a" o={0.5} />
      <WetBand x={1385} y={660} w={110} h={240} c="#aab8d4" o={0.4} />
      <WetBand x={366} y={900} w={70} h={170} c="#ffd27a" o={0.35} />
      <Puddle x={760} y={1004} rx={170} ry={30} c="#0f1422" rim="#8d9bb8" sky="#51607e" />
      <Puddle x={1330} y={930} rx={120} ry={22} c="#0f1422" rim="#8d9bb8" sky="#51607e" />
      <Puddle x={1080} y={1056} rx={110} ry={18} c="#0f1422" rim="#8d9bb8" />
      {/* rings where the drops land (static) */}
      {[[720, 1000], [800, 1012], [1310, 928], [1350, 936], [1060, 1054]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="18" ry="4" fill="none" stroke="#c9d6ec" strokeWidth="2" opacity=".55" />)}
    </g>
  );
}

export default function RainAlley({ rm }) {
  return (
    <R3Scene id="rain-alley" tod={T} rm={rm} rain={{ n: 200, slant: 0.06 }}
      label="A narrow lane in heavy rain at dusk, seen low: block walls, lit windows, wall lamps shining on the wet road, puddles, a red shop sign.">
      <Poles />
      <Lights />
      <Wet />
      <Plate x={1644} y={236} w={56} h={200} bg="#8e1f2e" fg="#fff4ea" jp="こめや" vertical jpSize={38} />
      <text x="1672" y="442" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="15" fill="#fff4ea">RICE</text>
      <Plate x={1618} y={622} w={34} h={46} bg="#d9d2c4" fg="#3a3140" jp="7" jpSize={24} rx={3} />
    </R3Scene>
  );
}
