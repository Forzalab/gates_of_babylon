// SHOP street side (CEL-LOG.md, multiplane): far = the pure vtrace of ref 16 (the sunny konbini face); cels on top =
// the vending machines (their gags: BROKEN / 1011), the NAND MART name band, the A-board, your hand + the bags, her
// pinch. The sun in ref 16 is high, behind the camera and to the right: cel shadows fall down-left (LIGHT), a cool
// sky tint on every cel. Nanda's slot (x 730-1190, y 424-920) stays clear; no sign text above y 140 (HUD band).
import { ShopScene, Card, Hand, Carrot, Shadow, SP } from './parts.jsx';

const SKY = '#e6efff'; // the cel tint: the cool fill of a clear 2:00 PM sky

// a vending machine (ref 01): body, a lit display window of drinks, a slot. Verticals straight. (cel: the gag carrier)
function Machine({ x, w = 200, h = 470, base = 900, body, label, ink = '#fff', sub }) {
  const y = base - h;
  return (
    <g>
      <Shadow x={x + w / 2} y={base} w={w * 1.4} h={36} op={0.34} />
      <rect x={x} y={y} width={w} height={h} rx="10" fill={body} stroke={SP.ink} strokeWidth="4" />
      <rect x={x + w - 14} y={y + 6} width="8" height={h - 12} fill="#fff" opacity=".3" />
      <rect x={x + 12} y={y + 16} width={w - 24} height="58" rx="6" fill="#fff" />
      <text x={x + w / 2} y={y + 58} textAnchor="middle" fontSize={w * 0.125} fill={ink === '#fff' ? body : ink} className="shop-sign">{label}</text>
      <rect x={x + 12} y={y + 86} width={w - 24} height={h * 0.42} rx="6" fill="#eaf6ff" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
        <rect key={`${r}${c}`} x={x + 22 + c * (w - 44) / 4} y={y + 98 + r * h * 0.13} width={(w - 44) / 4 - 8} height={h * 0.1} rx="4"
          fill={['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6'][(r + c) % 4]} />
      )))}
      <rect x={x + 30} y={base - 100} width={w - 60} height="54" rx="6" fill="#2b2a33" />
      {sub}
    </g>
  );
}

// 1. SHOP STREET · 2:00 PM (far: ref 16 whole; cels: three machines on the pavement, right of her slot)
export function ShopVending() {
  return (
    <ShopScene id="vending" trace="cel-vending" tint={SKY} label="The shop street at 2:00 PM on a sunny day: a convenience store under a big blue sky, and three vending machines on the pavement. Nanda stands in front.">
      <Machine x={1250} body={SP.red} label="GATE-COLA" />
      <Machine x={1460} body="#f6e7bf" label="FRESH JUICE" ink="#3d4f9a"
        sub={<Card x={1485} y={700} w={150} h={70} r={4} lines={[['故障中', 26, '#d81e2a', 'shop-jp'], ['OUT: 0', 22]]} />} />
      <Machine x={1670} body="#8fd3b0" label="SNACK" ink="#1d5e31"
        sub={['1', '0', '1', '1'].map((d, i) => <g key={i}><rect x={1686 + i * 44} y="686" width="36" height="36" rx="4" fill="#f6e6c4" stroke="#5a4a3a" strokeWidth="3" /><text x={1704 + i * 44} y="714" textAnchor="middle" fontSize="26" fill="#5a4a3a" className="shop-sign">{d}</text></g>)} />
    </ShopScene>
  );
}

// the name band cel over the traced (softened) sign above the doors
const NameBand = ({ x = 1100, y = 360, w = 500 }) => (
  <g>
    <rect x={x} y={y} width={w} height="100" rx="8" fill={SP.white} stroke={SP.green} strokeWidth="8" />
    <text x={x + w / 2} y={y + 72} textAnchor="middle" fontSize="66" fill={SP.red} className="shop-sign">NAND MART</text>
  </g>
);

// 2. The shop doors (far: ref 16, closer; the entrance lands right of her slot; an OPEN card cel was dropped: it
// floated on the glass, the trace reads better). Cels: the name band on the traced
// sign, the EGGS A-board on the pavement (shadow down-left).
export function ShopDoors() {
  return (
    <ShopScene id="doors" trace="cel-doors" tint={SKY} label="The front of the NAND MART shop on a sunny afternoon. The glass doors on the right stand open; an EGGS sign stands on the pavement by the door.">
      <NameBand x={1110} y={372} w={480} />
      <Shadow x={1800} y={930} w={200} h={30} />
      <path d="M1720 930 L1740 690 L1860 690 L1880 930" fill="none" stroke={SP.line} strokeWidth="8" />
      <rect x="1730" y="690" width="140" height="170" rx="6" fill="#fff6d8" stroke={SP.red} strokeWidth="5" />
      <text x="1800" y="752" textAnchor="middle" fontSize="40" fill={SP.red} className="shop-jp">たまご</text>
      <text x="1800" y="820" textAnchor="middle" fontSize="44" fill="#2c57a8" className="shop-price">¥168</text>
    </ShopScene>
  );
}

// 12. Exit: the reverse angle (far: ref 16 mirrored, the door now on the LEFT). BOOK: the inside door frame + the
// shop bell in front of the street (you are inside looking out). Cels: your hand carrying both bags, her pinch.
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
const DoorFrame = () => (
  <g>
    <path d="M0 0 H1920 V1080 H1860 V120 H60 V1080 H0 Z" fill="#4a4550" />
    <path d="M60 120 H1860" stroke="#6d6a72" strokeWidth="10" />
    <rect x="60" y="1040" width="1800" height="40" fill="#3a3640" />
    <rect x="1848" y="120" width="10" height="920" fill="#fff" opacity=".25" />
    <path d="M460 120 L460 150" stroke="#6d6a72" strokeWidth="4" />
    <path d="M436 188 C436 152 484 152 484 188 L492 198 L428 198Z" fill={SP.gold} stroke="#8a6a20" strokeWidth="4" />
    <Card x={700} y={150} w={520} h={56} fill={SP.white} stroke={SP.red} lines={[['ありがとうございました · THANK YOU', 26, '#2c57a8', 'shop-jp']]} />
  </g>
);
export function ShopExit() {
  return (
    <ShopScene id="exit" trace="cel-exit" tint={SKY} book={<DoorFrame />}
      label="From inside the shop door, looking out at the bright street and the sunny sky. The shop bell hangs in the door frame. Your hand carries two NAND MART bags; carrots stick out. Nanda holds your sleeve.">
      <path d="M1290 470 C1290 400 1350 400 1350 470 M1380 470 C1380 400 1440 400 1440 470" fill="none" stroke="#8a93a0" strokeWidth="8" />
      <Bag x={1320} y={530} /><Bag x={1440} y={546} />
      <Hand x={1520} y={420} rot={-90} s={0.7} pose="grip" thumb="right" />
      <Hand x={1440} y={330} rot={120} s={0.55} her pose="pinch" thumb="left" />
    </ShopScene>
  );
}
