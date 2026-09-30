// Groceries: the sakura shop street. Overlay = clean hand-lettered signs over the traced kanji mush, the two utility
// poles + wires redrawn crisp, the awning stripes, and a greengrocer's crates on the left (the errand).
import { TraceScene, preloadTrace } from './Grade.jsx';

preloadTrace('shop-street');

const JP = 'var(--jp, sans-serif)';

function Board({ x, y, w, h, text, fill = '#f6e2b8', ink = '#7a2a2a', size = 56, vertical = false, rot = 0 }) {
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke="#3a2618" strokeWidth="7" />
      <text x={x + w / 2} y={vertical ? y + h / 2 : y + h / 2 + size * 0.36} textAnchor="middle" fontFamily={JP} fontWeight="700" fontSize={size}
        fill={ink} writingMode={vertical ? 'tb' : undefined} letterSpacing={vertical ? 6 : 2}>{text}</text>
    </g>
  );
}

function Lantern({ x, y, t }) {
  return (
    <g>
      <rect x={x - 10} y={y - 58} width="20" height="10" fill="#2a1e1a" />
      <ellipse cx={x} cy={y} rx="36" ry="50" fill="#f6efe2" />
      <ellipse cx={x} cy={y} rx="36" ry="50" fill="none" stroke="#d23a3a" strokeWidth="5" />
      <text x={x} y={y + 16} textAnchor="middle" fontFamily={JP} fontWeight="700" fontSize="44" fill="#d23a3a">{t}</text>
      <rect x={x - 10} y={y + 48} width="20" height="10" fill="#2a1e1a" />
    </g>
  );
}

function Crates() {
  const fruit = [['#ff8a3a', 400], ['#e2463f', 490], ['#9ccf4a', 580]];
  return (
    <g>
      {fruit.map(([c, x], i) => (
        <g key={x}>
          <polygon points={`${x},${840 + i * 6} ${x + 88},${840 + i * 6} ${x + 80},${900 + i * 6} ${x + 8},${900 + i * 6}`} fill="#b07a45" stroke="#6b4222" strokeWidth="4" />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={x + 16 + k * 19} cy={836 + i * 6} r="12" fill={c} stroke="#00000033" strokeWidth="2" />)}
          <rect x={x + 22} y={870 + i * 6} width="44" height="20" rx="3" fill="#fff" />
          <text x={x + 44} y={886 + i * 6} textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="700" fontSize="16" fill="#3a2a2a">¥{100 + i * 50}</text>
        </g>
      ))}
    </g>
  );
}

export default function ShopStreet({ rm }) {
  const pole = '#6f6a72';
  return (
    <TraceScene id="shop-street" rm={rm} grade={{ tone: 'day', sun: [1180, -40], petals: 30, sparkles: 18 }}
      label="A narrow shopping street in spring: cherry trees, hanging lanterns, a greengrocer's crates, bicycles by the doors, power lines above.">
      <g fill="none" stroke="#3c3f4e" strokeWidth="3">
        {['M640 300 Q800 150 930 130', 'M640 340 Q800 210 930 180', 'M930 130 Q1150 60 1320 20', 'M930 180 Q1150 120 1320 90', 'M1320 90 Q1650 40 1920 0', 'M200 260 Q430 330 640 300'].map((d) => <path key={d} d={d} />)}
      </g>
      <rect x="1308" y="0" width="30" height="900" fill={pole} />
      <rect x="1326" y="0" width="12" height="900" fill="#000" opacity=".18" />
      <rect x="626" y="290" width="22" height="440" fill="#3f3a44" />
      <rect x="918" y="70" width="18" height="700" fill={pole} />
      {[120, 190].map((y) => <rect key={y} x="880" y={y} width="94" height="8" fill={pole} />)}
      {/* awning edge redrawn */}
      <path d="M1470 408 L1880 170" stroke="#f4f0ea" strokeWidth="14" />
      <Board x={255} y={105} w={130} h={230} text="八百屋" vertical size={58} rot={-10} />
      <Board x={150} y={0} w={120} h={110} text="花" size={70} fill="#e8a33a" ink="#3a1e10" />
      <Board x={1372} y={250} w={140} h={120} text="和菓子" size={38} fill="#f4e6d8" ink="#b0243a" rot={-6} />
      <Board x={1200} y={372} w={58} h={120} text="パン" vertical size={36} fill="#f4efe6" ink="#2a2a52" />
      <Lantern x={1596} y={122} t="団" />
      <Lantern x={1596} y={210} t="子" />
      <Crates />
    </TraceScene>
  );
}
