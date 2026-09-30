// SHOP street side (FIX-LOG.md): the shop street establishing shot, the NAND MART front, and the way out.
// Hand-pass cel rebuilds from Tony's refs 16 (anime konbini under a sunny sky), 02 (konbini doors) and 01 (retro
// vending corner). Sun from the upper right (SP / LIGHT): lit faces right, shadows fall down-left on the pavement.
// Nanda's player slot (x 730-1190, y 424-920) is left clear: the focal door / machines sit to her right; no sign text
// above y 140 (HUD band).
import { ShopScene, Card, Hand, Carrot, Shadow, SP, pts } from './parts.jsx';

const Sky = () => (
  <g>
    <rect width="1920" height="620" fill={SP.sky} />
    <rect width="1920" height="260" fill="#6fb6ec" />
    {[[260, 180, 1], [700, 120, 0.8], [1560, 170, 1.2]].map(([x, y, s]) => (
      <g key={x} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
        <ellipse cx="0" cy="0" rx="90" ry="40" /><ellipse cx="70" cy="-20" rx="70" ry="44" /><ellipse cx="140" cy="4" rx="80" ry="36" />
        <rect x="-60" y="0" width="260" height="36" rx="18" />
      </g>
    ))}
  </g>
);
// the pavement: paving joints on the shared VP, the kerb line
const Pavement = ({ y = 820 }) => (
  <g>
    <rect y={y} width="1920" height={1080 - y} fill="#d9d2c4" />
    <rect y={y} width="1920" height="10" fill="#b9b0a0" />
    {[-800, -400, 0, 400, 800, 1200, 1600, 2000, 2400, 2800].map((x) => <line key={x} x1={x} y1="1080" x2={x + (960 - x) * ((1080 - y) / (1080 - 330))} y2={y} stroke="#c4bba9" strokeWidth="3" />)}
    {[900, 990].map((yy) => <line key={yy} x1="0" y1={yy} x2="1920" y2={yy} stroke="#c4bba9" strokeWidth="3" />)}
  </g>
);

// a vending machine (ref 01): body, a lit display window of drinks, a slot, a coin column. Verticals straight.
function Machine({ x, w = 220, h = 520, base = 820, body, label, ink = '#fff', sub }) {
  const y = base - h;
  return (
    <g>
      <Shadow x={x + w / 2} y={base} w={w * 1.3} h={40} op={0.3} />
      <rect x={x} y={y} width={w} height={h} rx="10" fill={body} stroke={SP.ink} strokeWidth="4" />
      <rect x={x + w - 14} y={y + 6} width="8" height={h - 12} fill="#fff" opacity=".3" />
      <rect x={x + 12} y={y + 16} width={w - 24} height="64" rx="6" fill="#fff" />
      <text x={x + w / 2} y={y + 62} textAnchor="middle" fontSize={w * 0.125} fill={ink === '#fff' ? body : ink} className="shop-sign">{label}</text>
      <rect x={x + 12} y={y + 94} width={w - 24} height={h * 0.42} rx="6" fill="#eaf6ff" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
        <rect key={`${r}${c}`} x={x + 22 + c * (w - 44) / 4} y={y + 106 + r * h * 0.13} width={(w - 44) / 4 - 8} height={h * 0.1} rx="4"
          fill={['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6'][(r + c) % 4]} />
      )))}
      <rect x={x + 30} y={base - 110} width={w - 60} height="60" rx="6" fill="#2b2a33" />
      {sub}
    </g>
  );
}

// 1. SHOP STREET · 2:00 PM (refs 16 + 01): a sunny street, the shop row behind, three vending machines on the right.
export function ShopVending() {
  return (
    <ShopScene id="vending" trace={null} label="The shop street at 2:00 PM on a sunny day: shop fronts under a blue sky, and three vending machines on the pavement. Nanda stands in front.">
      <Sky />
      {/* the shop row behind (flat fronts, straight verticals) */}
      <rect y="300" width="1920" height="520" fill={SP.wall} />
      <rect y="300" width="1920" height="40" fill={SP.red} />
      {[40, 520].map((x) => (
        <g key={x}>
          <rect x={x} y="400" width="380" height="330" fill="#cfe3ea" stroke={SP.line} strokeWidth="4" />
          <rect x={x + 330} y="410" width="16" height="310" fill="#fff" opacity=".6" />
          {[0, 1, 2].map((r) => <rect key={r} x={x + 20} y={470 + r * 90} width="340" height="10" fill="#9fb6c0" />)}
        </g>
      ))}
      <rect y="730" width="1920" height="90" fill={SP.wallLo} />
      {/* the street banner, flat, below the HUD band */}
      <Card x={60} y={160} w={560} h={110} fill="#ffe7a8" stroke="#8a4b2a" lines={[['ようこそ 商店街', 40, '#8a4b2a', 'shop-jp'], ['WELCOME TO THE SHOP STREET', 26, '#b8322f']]} />
      <rect x="140" y="270" width="8" height="30" fill="#6d6a72" /><rect x="532" y="270" width="8" height="30" fill="#6d6a72" />
      <Pavement />
      {/* the vending machines (x 1230-1900): GATE-COLA, FRESH JUICE (broken: output 0), the 1/0 snack machine */}
      <Machine x={1230} body={SP.red} label="GATE-COLA" />
      <Machine x={1455} body="#f6e7bf" label="FRESH JUICE" ink="#3d4f9a"
        sub={<Card x={1490} y={640} w={150} h={70} r={4} lines={[['BROKEN', 26, '#d81e2a'], ['OUT: 0', 22]]} />} />
      <Machine x={1680} body="#8fd3b0" label="SNACK" ink="#1d5e31"
        sub={['1', '0', '1', '1'].map((d, i) => <g key={i}><rect x={1700 + i * 46} y="610" width="38" height="38" rx="4" fill="#f6e6c4" stroke="#5a4a3a" strokeWidth="3" /><text x={1719 + i * 46} y="640" textAnchor="middle" fontSize="28" fill="#5a4a3a" className="shop-sign">{d}</text></g>)} />
    </ShopScene>
  );
}

// the NAND MART front (refs 16 + 02): a flat shop face, the name band, windows with shelves, the automatic doors
// (door opening x 1260-1660, right of Nanda's slot), one threshold line at y 820 under the doors and the poster stand.
function Front({ open = true }) {
  const goods = ['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6', '#f08fb8', '#fff2c8'];
  return (
    <g>
      <Sky />
      <rect y="200" width="1920" height="620" fill={SP.wall} />
      <rect y="200" width="1920" height="14" fill={SP.wallLo} />
      {/* the name band (text at y >= 150) */}
      <rect y="214" width="1920" height="120" fill={SP.white} />
      <rect y="334" width="1920" height="24" fill={SP.red} /><rect y="358" width="1920" height="12" fill={SP.green} />
      <text x="1460" y="300" textAnchor="middle" fontSize="80" fill={SP.red} className="shop-sign">NAND MART</text>
      <text x="400" y="296" textAnchor="middle" fontSize="44" fill="#2c57a8" className="shop-sign">OPEN · NOT CLOSED</text>
      {/* windows: shelves seen through the glass */}
      {[[60, 1140], [1720, 180]].map(([x, w]) => (
        <g key={x}>
          <rect x={x} y="400" width={w} height="400" fill="#e4ecdf" stroke={SP.line} strokeWidth="6" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={x} y={480 + r * 80} width={w} height="8" fill="#9aa39a" />
              {Array.from({ length: Math.floor(w / 40) }, (_, i) => <rect key={i} x={x + 8 + i * 40} y={430 + r * 80} width="30" height="50" rx="3" fill={goods[(i + r * 2) % goods.length]} />)}
            </g>
          ))}
          <polygon points={pts([[x + w - 160, 400], [x + w - 100, 400], [x + w - 220, 800], [x + w - 280, 800]])} fill="#fff" opacity=".35" />
        </g>
      ))}
      {/* the doorway: inside lit, the two glass panels slid open to the sides */}
      <rect x="1260" y="400" width="400" height="420" fill="#f1efe6" />
      <rect x="1260" y="400" width="400" height="40" fill="#e98aa0" />
      {[0, 1, 2].map((r) => <rect key={r} x="1300" y={500 + r * 90} width="320" height="10" fill="#9aa39a" />)}
      {[0, 1, 2].map((r) => Array.from({ length: 8 }, (_, i) => <rect key={`${r}${i}`} x={1306 + i * 40} y={452 + r * 90} width="30" height="48" rx="3" fill={goods[(i + r) % goods.length]} />))}
      <rect x="1260" y="740" width="400" height="80" fill="#d3d8cd" />
      <rect x="1300" y="790" width="320" height="22" rx="6" fill="#6d6a72" />
      <Card x={1360} y={560} w={200} h={46} r={6} fill={SP.white} stroke={SP.green} lines={[["AUTO DOOR", 26, SP.green]]} />
      {open
        ? [1200, 1660].map((x) => <rect key={x} x={x} y="400" width="60" height="420" fill="#cfe3e0" opacity=".7" stroke={SP.line} strokeWidth="6" />)
        : [1260, 1460].map((x) => <rect key={x} x={x} y="400" width="200" height="420" fill="#cfe3e0" opacity=".55" stroke={SP.line} strokeWidth="6" />)}
      <rect x="1250" y="390" width="420" height="12" fill={SP.line} />
      {/* the threshold: one line under the door AND the poster stand */}
      <rect y="812" width="1920" height="14" fill={SP.green} />
    </g>
  );
}

// 2. The shop doors slide open (refs 16 + 02).
export function ShopDoors() {
  return (
    <ShopScene id="doors" trace={null} label="The front of the NAND MART shop on a sunny afternoon. The glass doors on the right are open; an EGGS sign stands by the door.">
      <Front />
      <Pavement y={826} />
      {/* the A-board by the door, standing on the threshold line, its shadow down-left */}
      <Shadow x={1790} y={826} w={180} h={30} />
      <path d="M1720 826 L1740 600 L1860 600 L1880 826" fill="none" stroke={SP.line} strokeWidth="8" />
      <rect x="1730" y="600" width="140" height="170" rx="6" fill="#fff6d8" stroke={SP.red} strokeWidth="5" />
      <text x="1800" y="668" textAnchor="middle" fontSize="40" fill={SP.red} className="shop-sign">EGGS</text>
      <text x="1800" y="730" textAnchor="middle" fontSize="44" fill="#2c57a8" className="shop-price">¥168</text>
    </ShopScene>
  );
}

// 12. Exit: the same doors from inside (screen direction reversed: the door is now on the LEFT, x 260-660), the bright
// street outside. Your arm comes in from the right holding both bag handles (the bags hang from your hand); her
// fingers pinch your sleeve.
function Bag({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Carrot x={10} y={-60} len={120} a={-100} />
      <path d="M-110 -60 L110 -60 L126 190 L-126 190Z" fill="#f4f6f8" stroke="#8a93a0" strokeWidth="5" strokeLinejoin="round" />
      <text x="0" y="50" textAnchor="middle" fontSize="40" fill="#e0262e" className="shop-sign">NAND</text>
      <text x="0" y="94" textAnchor="middle" fontSize="40" fill="#e0262e" className="shop-sign">MART</text>
    </g>
  );
}
export function ShopExit() {
  return (
    <ShopScene id="exit" trace={null} label="Inside the shop by the open doors, looking out at the bright street. The shop bell hangs over the door. Your hand carries two NAND MART bags; carrots stick out. Nanda holds your sleeve.">
      <rect width="1920" height="1080" fill={SP.wall} />
      <rect y="0" width="1920" height="70" fill={SP.ceil} />
      {/* the doorway on the left, the street outside */}
      <rect x="260" y="230" width="400" height="600" fill="#fff4dc" />
      <rect x="260" y="230" width="400" height="200" fill={SP.sky} />
      <rect x="260" y="700" width="400" height="130" fill="#d9d2c4" />
      {[200, 660].map((x) => <rect key={x} x={x} y="230" width="60" height="600" fill="#cfe3e0" opacity=".7" stroke={SP.line} strokeWidth="6" />)}
      <rect x="190" y="220" width="540" height="12" fill={SP.line} />
      {/* the back of the name band: thank-you strip (y >= 150) */}
      <Card x={210} y={150} w={500} h={60} fill={SP.white} stroke={SP.red} lines={[['THANK YOU · COME BACK', 32, '#2c57a8']]} />
      {/* the bell */}
      <path d="M460 232 L460 256" stroke="#6d6a72" strokeWidth="4" />
      <path d="M436 294 C436 258 484 258 484 294 L492 304 L428 304Z" fill={SP.gold} stroke="#8a6a20" strokeWidth="4" />
      {/* shelves on the right wall */}
      <rect x="1300" y="160" width="620" height="660" fill={SP.wallLo} />
      {[300, 460, 620].map((y) => <rect key={y} x="1300" y={y} width="620" height="16" fill={SP.plank} />)}
      <rect y="830" width="1920" height="250" fill={SP.floor} />
      <rect y="830" width="1920" height="6" fill={SP.floorLo} />
      {/* your arm from the right: the hand holds both bag handles; the bags hang below it */}
      <path d="M1290 470 C1290 400 1350 400 1350 470 M1380 470 C1380 400 1440 400 1440 470" fill="none" stroke="#8a93a0" strokeWidth="8" />
      <Bag x={1320} y={530} /><Bag x={1440} y={546} />
      <Hand x={1520} y={420} rot={-90} s={0.7} pose="grip" thumb="right" />
      {/* her fingers pinch your sleeve, from her side (left) */}
      <Hand x={1440} y={330} rot={120} s={0.55} her pose="pinch" thumb="left" />
    </ShopScene>
  );
}
