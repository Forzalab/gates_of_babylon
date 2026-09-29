// BG-D3 fallback (the locked room): her genkan from inside. Front door chained and double-locked, a row of men's
// shoes on the step (one pair per name, like the jars), and one empty spot at the end, swept clean. Flat fills.
const SHOES = ['#3a2a22', '#1f2230', '#5a4636', '#2c2c2c', '#6b3a2a'];

const Pair = ({ x, c }) => (
  <g transform={`translate(${x} 860)`}>
    {[0, 70].map((dx) => (
      <g key={dx} transform={`translate(${dx} 0)`}>
        <path d="M0 0 Q0 -60 26 -64 Q52 -60 52 0 Z" fill={c} />
        <ellipse cx="26" cy="-40" rx="14" ry="18" fill="#141014" />
        <rect x="-2" y="-4" width="56" height="8" rx="3" fill="#0e0b0e" />
      </g>
    ))}
  </g>
);

export default function Genkan() {
  return (
    <svg className="art genkan" viewBox="0 0 1920 1080" role="img" aria-label="A front hall. The door is chained shut. A row of shoes, and one empty spot.">
      <rect width="1920" height="1080" fill="#e8dcc6" />
      <rect width="1920" height="200" fill="#d8cab0" />
      {/* door, chained */}
      <rect x="700" y="120" width="520" height="640" fill="#4a3a3a" />
      <rect x="730" y="150" width="460" height="610" fill="#6a5250" />
      <circle cx="960" cy="330" r="12" fill="#1a1216" />
      <rect x="1120" y="420" width="26" height="110" rx="6" fill="#b5a37a" />
      <circle cx="1133" cy="380" r="16" fill="#b5a37a" /><circle cx="1133" cy="570" r="16" fill="#b5a37a" />
      <rect x="1180" y="330" width="60" height="30" fill="#8a7a55" />
      <path d="M1210 345 Q1160 380 1110 350" fill="none" stroke="#c9b98a" strokeWidth="8" strokeDasharray="14 6" />
      <rect x="1100" y="338" width="30" height="24" fill="#8a7a55" />
      {/* shoe cabinet + slippers rack */}
      <rect x="1300" y="360" width="480" height="400" fill="#b89a74" /><rect x="1300" y="360" width="480" height="24" fill="#a3845e" />
      <line x1="1540" y1="384" x2="1540" y2="760" stroke="#8e7050" strokeWidth="4" />
      {/* a single vase, one stem */}
      <rect x="1510" y="290" width="40" height="70" rx="10" fill="#f4eef6" /><path d="M1530 290 Q1520 220 1550 180" fill="none" stroke="#4a6a3a" strokeWidth="4" />
      <circle cx="1552" cy="176" r="12" fill="#f0243f" />
      {/* step edge + stone floor */}
      <rect x="0" y="760" width="1920" height="40" fill="#8e7050" />
      <rect x="0" y="800" width="1920" height="280" fill="#7a7672" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={i * 260 + 60} y1="800" x2={i * 300 - 100} y2="1080" stroke="#6a6662" strokeWidth="3" />)}
      {/* the row: five pairs, then one empty spot, swept */}
      {SHOES.map((c, i) => <Pair key={i} x={120 + i * 250} c={c} />)}
      <rect x="1370" y="780" width="180" height="96" rx="8" fill="#8a8680" />
      <rect x="1370" y="780" width="180" height="96" rx="8" fill="none" stroke="#f4eef6" strokeWidth="3" strokeDasharray="10 8" opacity=".7" />
    </svg>
  );
}
