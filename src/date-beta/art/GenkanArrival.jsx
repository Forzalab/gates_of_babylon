// Scene 10, GENKAN ARRIVAL insert (art id 'genkan-in'). Setup for main's BG-D3 locked room (Genkan.jsx): the slippers set out here fill its empty spot.
//   BG   = the entry: stone tataki, the raised wood step, a shoe cabinet, her shoes lined up to the millimetre on a tape line.
//   PROP = a pair of men's slippers set out on the step, facing the door (for you), and a tiny shrine right by the shoes.
// The shrine frames a logic circuit. PLACEHOLDER: a fixed A,B -> NAND -> OUT. Later = the player's last Logic-mode circuit.
// props.insert: false (wide) | true (camera crops in on slippers + shrine; smooth 1.4 s, reduced motion = hard cut).
import './alt.css';

// One shoe seen from above, toe down (toward the camera/door). Pairs share one shape.
function Shoe({ x, y, fill, w = 58, h = 130 }) {
  return <path d={`M${x} ${y} q${w / 2} -14 ${w} 0 v${h * 0.62} q0 ${h * 0.38} -${w / 2} ${h * 0.38} q-${w / 2} 0 -${w / 2} -${h * 0.38}z`} fill={fill} stroke="#1b1512" strokeWidth="3" />;
}

// Placeholder circuit: two inputs into a NAND, output pin in her red.
function Circuit() {
  return (
    <g stroke="#2a2330" strokeWidth="4" fill="none">
      <path d="M10 30 H52 M10 70 H52" />
      <path d="M52 14 H82 A36 36 0 0 1 82 86 H52Z" fill="#fff8ea" />
      <circle cx="124" cy="50" r="6" fill="#fff8ea" />
      <path d="M130 50 H160" />
      <circle cx="10" cy="30" r="5" fill="#ff5fa2" stroke="none" /><circle cx="10" cy="70" r="5" fill="#ff5fa2" stroke="none" />
      <circle cx="162" cy="50" r="7" fill="#f0243f" stroke="none" />
    </g>
  );
}

function Shrine() {
  return (
    <g transform="translate(1400 600)" className="gk-shrine">
      <path d="M-20 0 L100 -60 L220 0Z" fill="#6b4a2f" />
      <rect x="-6" y="0" width="212" height="12" fill="#4e3421" />
      <rect x="10" y="12" width="180" height="190" fill="#c79d6b" stroke="#6b4a2f" strokeWidth="4" />
      <rect x="18" y="36" width="164" height="122" fill="#fbf4e6" stroke="#8a6a44" strokeWidth="3" />
      <g transform="translate(16 46)"><Circuit /></g>
      {/* shide paper zigzags + a candle */}
      <path d="M40 12 l10 16 l-10 10 l10 16" stroke="#fff" strokeWidth="5" fill="none" />
      <path d="M160 12 l-10 16 l10 10 l-10 16" stroke="#fff" strokeWidth="5" fill="none" />
      <rect x="0" y="202" width="200" height="16" fill="#4e3421" />
      <rect x="86" y="218" width="28" height="50" fill="#f4efe4" /><path d="M100 196 q-8 12 0 22 q8 -10 0 -22z" fill="#ffcf7a" />
    </g>
  );
}

export default function Genkan({ props }) {
  return (
    <div className={`art genkan-in cam${props.insert ? ' insert' : ''}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={props.insert
        ? 'Close up: a pair of men\'s slippers, set out and waiting. Beside them, a tiny shrine holding a logic circuit.'
        : 'Her entryway. Her shoes stand in a perfect line on a strip of tape.'}>
        <g className="gk-bg">
          {/* back wall + hallway light */}
          <rect width="1920" height="1080" fill="#e8dcc6" />
          <rect x="760" y="0" width="420" height="560" fill="#f6ecd8" />
          <rect x="760" y="0" width="420" height="560" fill="none" stroke="#b69a73" strokeWidth="10" />
          <rect x="930" y="40" width="80" height="24" rx="12" fill="#fff6dc" />
          {/* raised wood floor + the step edge (kamachi) */}
          <rect x="0" y="540" width="1920" height="170" fill="#b98a5a" />
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1={560 + i * 20} x2="1920" y2={560 + i * 20} stroke="#a67a4c" strokeWidth="2" />)}
          <rect x="0" y="700" width="1920" height="40" fill="#8a5f36" />
          {/* stone tataki */}
          <rect x="0" y="740" width="1920" height="340" fill="#7e7c78" />
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 200} y1="740" x2={i * 200 - 60} y2="1080" stroke="#6c6a66" strokeWidth="3" />)}
          <line x1="0" y1="900" x2="1920" y2="900" stroke="#6c6a66" strokeWidth="3" />
          {/* shoe cabinet */}
          <rect x="40" y="220" width="380" height="520" fill="#d8c4a0" stroke="#a88e66" strokeWidth="6" />
          <line x1="230" y1="220" x2="230" y2="740" stroke="#a88e66" strokeWidth="4" />
          <circle cx="210" cy="480" r="8" fill="#8a7050" /><circle cx="250" cy="480" r="8" fill="#8a7050" />
          {/* the tape line her shoes toe up to, and the shoes: 4 pairs, equal gaps */}
          <line x1="470" y1="780" x2="1360" y2="780" stroke="#e9e1a6" strokeWidth="6" strokeDasharray="30 10" />
          {['#1d1a24', '#a8123e', '#f4efe4', '#3a5a8a'].map((c, i) => (
            <g key={c}>
              <Shoe x={490 + i * 220} y={790} fill={c} />
              <Shoe x={560 + i * 220} y={790} fill={c} />
            </g>
          ))}
          {/* a ruler left on the floor: she measured */}
          <g transform="rotate(-4 700 990)">
            <rect x="520" y="970" width="420" height="36" fill="#f2e3a0" stroke="#b39c4e" strokeWidth="3" />
            {Array.from({ length: 29 }, (_, i) => <line key={i} x1={530 + i * 14} y1="970" x2={530 + i * 14} y2={i % 5 ? 982 : 990} stroke="#6b5a2a" strokeWidth="2" />)}
          </g>
        </g>
        <g className="gk-prop">
          {/* men's slippers on the step, toes toward the door = set out for a guest */}
          <g transform="translate(1100 560)">
            <path d="M0 10 q40 -16 80 0 v100 q0 30 -40 30 q-40 0 -40 -30z" fill="#4a5f86" stroke="#22304a" strokeWidth="4" />
            <path d="M100 10 q40 -16 80 0 v100 q0 30 -40 30 q-40 0 -40 -30z" fill="#4a5f86" stroke="#22304a" strokeWidth="4" />
            <path d="M4 70 h72 v36 q-36 16 -72 0z M104 70 h72 v36 q-36 16 -72 0z" fill="#33466a" />
            <rect x="60" y="-8" width="60" height="16" rx="4" fill="#fff" stroke="#c9c2b8" strokeWidth="2" />
          </g>
          <Shrine />
        </g>
      </svg>
    </div>
  );
}
