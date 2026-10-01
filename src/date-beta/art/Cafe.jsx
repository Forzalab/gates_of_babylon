// BG-X1 fallback: XOR Coffee, 7:00 AM. Morning light through the front window, the counter, a wall clock at 7:00,
// the sign. Two tables; the one by the window already has a cup at the seat facing yours.
// props.cups (leave-yeah 4, shot cafe-cups): "Every table has two cups. Every cup has your name." Both tables get a
// pair, each cup marked "you" in her pink marker; the tables move up 60 / 90 px so the low pan clears the box.
const Cup = ({ x, y, name }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-26 -34 H26 L20 0 H-20 Z" fill="#f4eef6" /><path d="M26 -26 Q44 -20 24 -8" fill="none" stroke="#f4eef6" strokeWidth="6" />
    <path d="M-8 -44 Q-16 -70 0 -86" fill="none" stroke="#fff" strokeWidth="4" opacity=".6" />
    {name && <text y="-11" textAnchor="middle" fontSize="15" fontWeight="800" fontStyle="italic" fill="#e0428a" transform="rotate(-6)">you</text>}
  </g>
);
export default function Cafe({ props = {} }) {
  return (
    <svg className="art cafe" viewBox="0 0 1920 1080" role="img" aria-label="XOR Coffee in the morning. The wall clock reads 7:00.">
      <defs>
        <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d7a8" /><stop offset="1" stopColor="#fdf0dc" /></linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="#efe2cc" />
      {/* window */}
      <rect x="80" y="140" width="820" height="560" fill="url(#cf-sky)" />
      <rect x="80" y="520" width="820" height="180" fill="#c9b79a" />
      {[[140, 380, 120, 140], [300, 320, 160, 200], [520, 400, 110, 120], [680, 340, 150, 180]].map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} fill="#d9c3a0" />)}
      <path d="M80 140 H900 V700 H80 Z M490 140 V700" fill="none" stroke="#3a2a22" strokeWidth="18" />
      <polygon points="900,140 1300,1080 480,1080 80,700" fill="#fff4d8" opacity=".35" />
      {/* sign */}
      <rect x="1040" y="70" width="700" height="210" rx="14" fill="#2a1a18" />
      <text x="1390" y="170" className="sign">XOR Coffee</text>
      <text x="1390" y="256" className="sign-sub">open 7:00</text>
      {/* clock at 7:00 */}
      <g transform="translate(1000 420)">
        <circle r="74" fill="#fbf7f1" stroke="#2a1a18" strokeWidth="8" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} y1="-58" y2="-66" stroke="#2a1a18" strokeWidth="5" transform={`rotate(${i * 30})`} />)}
        <line y2="-54" stroke="#2a1a18" strokeWidth="6" strokeLinecap="round" />
        <line y2="-34" stroke="#2a1a18" strokeWidth="9" strokeLinecap="round" transform="rotate(210)" />
      </g>
      {/* menu board */}
      <rect x="1180" y="320" width="560" height="300" fill="#3a3230" />
      {['drip ........ 0', 'latte ....... 1', 'or ... both ..?', 'xor .. one only'].map((t, i) => <text key={t} x="1220" y={380 + i * 60} className="menu">{t}</text>)}
      {/* counter */}
      <rect x="1080" y="700" width="840" height="380" fill="#8a5a3a" /><rect x="1060" y="680" width="860" height="30" fill="#5a3226" />
      <rect x="1600" y="590" width="140" height="90" rx="10" fill="#b8b0a8" /><rect x="1640" y="560" width="60" height="30" fill="#8a8680" />
      {/* floor + tables */}
      <rect y="880" width="1080" height="200" fill="#c9a37a" />
      {(props.cups ? [[330, 740], [800, 770]] : [[330, 800], [800, 860]]).map(([x, y]) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx="150" ry="30" fill="#5a3226" /><rect x={x - 10} y={y} width="20" height={1080 - y} fill="#3e2018" />
        </g>
      ))}
      {props.cups
        ? [[275, 730], [385, 730], [745, 760], [855, 760]].map(([x, y]) => <Cup key={x} x={x} y={y} name />)
        : <Cup x={380} y={780} />}
    </svg>
  );
}
