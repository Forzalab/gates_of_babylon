// SHOP 6-12 (SHOTLIST.md): the basket, the snack aisle on the way, the checkout lanes, the register, her nails, the
// self-checkout. Refs: 8d83db1f (basket), 0a536433 (snacks), d110f421 (checkout wide), c6ec0ec2 (retro register),
// 8873611d (basket handle), b56aeeaa (self-checkout).
import { ShopScene, Card, Cup, Hand, BasketBed, BASKET, Shadow, SP, pts } from './parts.jsx';

// 6. Close-up (refs 03 + 05): THE basket bed in the cart. Cups 1 + 2 already stand on the basket floor (one baseline,
// one shadow direction); her hand, from the upper right, lowers cup 3 into its slot, fingers round the rim.
export function BasketCups() {
  const hand = (
    <g>
      <Cup x={BASKET.cupsX[2]} y={BASKET.cupsY - 46} s={0.9} shadow={false} />
      <ellipse cx={BASKET.cupsX[2] - 10} cy={BASKET.cupsY + 3} rx="40" ry="7" fill={SP.shade} opacity=".16" />
      <Hand x={BASKET.cupsX[2] + 40} y={BASKET.cupsY - 46 - 86 - 128} rot={188} s={0.78} her thumb="right" />
    </g>
  );
  return (
    <ShopScene id="basket" trace={null} label="Close-up from above: the green shop basket in the cart, with carrots and a pack of eggs. Two matching cups stand in it. Nanda's hand puts the third cup in.">
      <rect width="1920" height="1080" fill={SP.floor} />
      <g stroke={SP.metalLo} strokeWidth="6" opacity=".55">
        {Array.from({ length: 21 }, (_, i) => <line key={i} x1={i * 96} y1="0" x2={960 + (i * 96 - 960) * 1.25} y2="1080" />)}
        {[120, 300, 500, 720, 960].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} />)}
      </g>
      <rect x="0" y="0" width="1920" height="36" fill={SP.metal} />
      <BasketBed x={900} y={590} s={1.4} cups={2} hand={hand} />
    </ShopScene>
  );
}

// 7. On the way to the checkout: the snack shelf (0a536433). Our own package names.
export function ShopSnacks() {
  return (
    <ShopScene id="snacks" trace="shop-snacks" label="Aisle 4, a snack shelf: strawberry sweets in pink bags, with little price tags.">
      <g transform="rotate(-8 1270 440)">
        <rect x="1060" y="360" width="420" height="140" rx="30" fill="#fff4f6" stroke="#e0467f" strokeWidth="6" />
        <text x="1270" y="428" textAnchor="middle" fontSize="54" fill="#e0467f" className="shop-jp">いちご</text>
        <text x="1270" y="484" textAnchor="middle" fontSize="44" fill="#d8262e" className="shop-sign">NAND BITES</text>
      </g>
      <Card x={400} y={870} w={170} h={70} r={4} rot={-6} lines={[['¥128', 44, '#d81e2a']]} />
      <Card x={800} y={790} w={170} h={70} r={4} rot={-6} lines={[['NOT ON', 26], ['THE LIST', 26]]} />
    </ShopScene>
  );
}

// 8. The checkout lanes (d110f421): hanging lane boards redrawn; lane 2 lit.
function Hang({ x, y, n, on, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="-400" x2="0" y2="0" stroke="#3a3440" strokeWidth="3" />
      <rect x="-44" y="0" width="88" height="130" rx="6" fill="#1f1d26" />
      <circle cx="0" cy="40" r="30" fill={on ? '#fff3b0' : '#6a6870'} />
      <text x="0" y="54" textAnchor="middle" fontSize="40" fill="#1f1d26" className="shop-sign">{n}</text>
      <text x="0" y="112" textAnchor="middle" fontSize="28" fill="#fff" className="shop-jp">レジ</text>
    </g>
  );
}

export function CheckoutWide() {
  return (
    <ShopScene id="checkout" trace="checkout-wide" label="The checkout lanes: wooden counters under hanging lane boards. Lane 2 is lit and open.">
      <Hang x={1595} y={44} n="2" on s={1.2} />
      <Hang x={1468} y={206} n="3" s={0.8} />
      <Hang x={1065} y={180} n="4" s={0.75} />
      <Hang x={787} y={236} n="5" s={0.5} />
      <Card x={640} y={950} w={520} h={100} rot={-4} fill="#2f2f3a" stroke="#f2c14e" lines={[['LANE 2 OPEN · 1 IS NOT', 40, '#f2c14e']]} />
    </ShopScene>
  );
}

// 9. The register (ref 06), over your shoulder at lane 2: the old cash register on the left, the shop lady waist-up
// behind the counter on the right (a visible smile, a small wave: 5 fingers), your basket on the counter. The film
// poster and the FOR SALE card hang flat on the back wall, fully in frame. Nanda (pout) stands in her slot between.
function Lady({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* body: white shirt + green shop apron */}
      <path d="M-150 520 L-130 250 Q-120 200 -60 190 L60 190 Q120 200 130 250 L150 520 Z" fill={SP.white} stroke={SP.line} strokeWidth="4" />
      <path d="M-96 520 L-86 260 L86 260 L96 520 Z" fill={SP.green} stroke="#1d5e31" strokeWidth="4" />
      <rect x="-50" y="300" width="100" height="44" rx="6" fill={SP.white} />
      <text x="0" y="332" textAnchor="middle" fontSize="28" fill={SP.red} className="shop-sign">NAND</text>
      <path d="M-40 190 L0 236 L40 190" fill="none" stroke={SP.line} strokeWidth="4" />
      {/* neck + head */}
      <rect x="-24" y="150" width="48" height="50" fill={SP.skin} stroke={SP.skinLine} strokeWidth="3" />
      <path d="M-100 20 Q-110 -110 0 -118 Q110 -110 100 20 L106 130 L-106 130 Z" fill="#3a2a30" />
      <ellipse cx="0" cy="40" rx="84" ry="100" fill={SP.skin} stroke={SP.skinLine} strokeWidth="4" />
      <path d="M-86 10 Q-60 -80 0 -84 Q60 -80 86 10 Q40 -30 0 -20 Q-40 -30 -86 10Z" fill="#3a2a30" />
      {/* the smile: closed happy eyes, blush, an open smile */}
      <path d="M-52 46 Q-34 26 -16 46 M16 46 Q34 26 52 46" fill="none" stroke={SP.ink} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="-50" cy="76" rx="16" ry="8" fill="#ff9ab8" opacity=".7" /><ellipse cx="50" cy="76" rx="16" ry="8" fill="#ff9ab8" opacity=".7" />
      <path d="M-24 90 Q0 118 24 90 Z" fill="#b8325a" stroke={SP.ink} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

export function Register() {
  return (
    <ShopScene id="register" trace={null} label="At lane 2: an old cash register reads 1,011 yen. Behind the counter the shop lady smiles and waves. Your green basket sits on the counter.">
      {/* back wall + a shelf of cigarettes-free goods behind the lady */}
      <rect width="1920" height="1080" fill={SP.wall} />
      <rect y="0" width="1920" height="70" fill={SP.ceil} />
      <rect x="1180" y="150" width="740" height="16" fill={SP.plank} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <rect key={i} x={1196 + i * 80} y="88" width="60" height="62" rx="4" fill={['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6', '#f08fb8'][i % 5]} />)}
      {/* the film poster, flat on the wall, 60 % */}
      <g transform="translate(620 -20)">
      <rect x="170" y="170" width="200" height="290" fill="#2c2a4a" stroke={SP.line} strokeWidth="4" />
      <text x="270" y="236" textAnchor="middle" fontSize="40" fill={SP.gold} className="shop-sign">NAND</text>
      <text x="270" y="282" textAnchor="middle" fontSize="40" fill={SP.gold} className="shop-sign">MAN 2</text>
      <path d="M220 320 H270 A48 48 0 0 1 270 416 H220 Z" fill={SP.gold} /><circle cx="330" cy="368" r="9" fill={SP.gold} />
      <text x="270" y="448" textAnchor="middle" fontSize="22" fill="#fff" className="shop-sign">IN CINEMAS</text>
      </g>
      <Card x={30} y={200} w={120} h={170} fill={SP.red} stroke={SP.redLo} lines={[['FOR', 36, '#fff'], ['SALE', 36, '#fff']]} />
      {/* the shop lady behind the counter (x 1250-1700), waving */}
      <Lady x={1470} y={250} />
      <Hand x={1680} y={560} rot={16} s={0.46} sleeve={SP.white} thumb="left" />
      {/* the counter: top + front, one VP */}
      <polygon points={pts([[0, 690], [1920, 690], [1920, 760], [0, 760]])} fill={SP.plankTop} />
      <rect y="760" width="1920" height="320" fill={SP.plank} />
      <rect y="690" width="1920" height="8" fill="#fff" opacity=".5" />
      {/* the register (x 120-640) with its customer display */}
      <Shadow x={420} y={694} w={540} h={40} op={0.28} />
      <path d="M130 700 L170 420 L610 420 L650 700 Z" fill="#b8b2a4" stroke={SP.line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M170 420 L610 420 L600 480 L180 480 Z" fill="#d6d0c2" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4, 5].map((c) => <rect key={`${r}${c}`} x={206 + c * 62 + r * 4} y={500 + r * 44} width="46" height="32" rx="5" fill={c === 5 ? SP.red : SP.white} stroke={SP.line} strokeWidth="2" />))}
      <rect x="360" y="220" width="30" height="200" fill="#8a857a" />
      <rect x="240" y="170" width="300" height="100" rx="10" fill="#1d2622" stroke={SP.line} strokeWidth="5" />
      <text x="520" y="245" textAnchor="end" fontSize="64" fill="#8dffb0" className="r3-led">¥1,011</text>
      {/* your basket, set down on the counter */}
      <BasketBed x={1560} y={600} s={0.5} />
    </ShopScene>
  );
}

// 10. Extreme close-up (ref 05): her hand on the basket handle. The fingers wrap the bar; the four nail tips land ON
// it (indents under each), the thumb hooks under; the forearm comes in from the top right. The basket rolls 6 deg.
export function BasketHandle() {
  const X = 980, BAR = 400, S = 1.9;
  return (
    <ShopScene id="handle" trace={null} label="Extreme close-up: Nanda's hand grips the basket handle. Her four pink nails press into the grey bar, hard.">
      <rect width="1920" height="1080" fill={SP.floor} />
      <rect y="0" width="1920" height="420" fill={SP.wallLo} />
      <rect y="400" width="1920" height="30" fill={SP.plank} />
      <g transform={`rotate(6 ${X} ${BAR})`}>
        <BasketBed x={X} y={BAR - BASKET.handleY * S} s={S} handles="up" />
        {/* the indents under the fingertips */}
        {[-30, -10, 10, 30].map((f) => <ellipse key={f} cx={X - 30 - f * 2} cy={BAR + 26} rx="14" ry="6" fill={SP.metalLo} opacity=".7" />)}
        <Hand x={X + 41} y={BAR - 232} rot={190} s={2} her pose="grip" thumb="left" press />
      </g>
    </ShopScene>
  );
}

// 11. The self-checkout lane (b56aeeaa): the caption + the man removed; the near machine and the cold case redrawn.
function Machine({ screen }) {
  return (
    <g>
      {/* cold case at the back */}
      <polygon points={pts([[880, 150], [1500, 120], [1500, 600], [880, 600]])} fill="#f1f5f8" />
      {[230, 330, 430, 530].map((y) => <rect key={y} x="900" y={y} width="590" height="10" fill="#c7d2da" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [190, 290, 390, 490].map((y, j) => <rect key={`${i}${j}`} x={912 + i * 72} y={y} width="52" height="36" rx="4" fill={['#bde0f5', '#fff', '#f5c8a8', '#d8f0c8'][(i + j) % 4]} />))}
      {/* the near machine: pole + a tilted screen + the bag scale */}
      <rect x="760" y="110" width="22" height="360" fill="#7a818c" />
      <polygon points={pts([[620, 110], [940, 90], [960, 330], [640, 350]])} fill="#2a3240" stroke="#141820" strokeWidth="6" />
      <polygon points={pts([[640, 126], [924, 108], [940, 314], [656, 332]])} fill="#dff3ff" />
      {screen}
      <polygon points={pts([[560, 440], [1260, 420], [1300, 600], [600, 620]])} fill="#c9d5e2" stroke="#6c7887" strokeWidth="5" />
      <polygon points={pts([[1500, 300], [1920, 280], [1920, 1080], [1500, 1080]])} fill="#e8ecef" />
      <rect x="1500" y="560" width="420" height="30" fill="#b4bec8" />
      {/* the lane number flag: ours */}
      <rect x="752" y="0" width="70" height="84" fill="#d8262e" />
      <text x="787" y="66" textAnchor="middle" fontSize="60" fill="#fff" className="shop-sign">0</text>
    </g>
  );
}

const SCREEN = (
  <g>
    <text transform="translate(792 196) rotate(-3.5)" textAnchor="middle" fontSize="36" fill="#1d3a6a" className="shop-sign">NO LADY HERE</text>
    <text transform="translate(796 268) rotate(-3.5)" textAnchor="middle" fontSize="32" fill="#e0467f" className="shop-sign">JUST YOU + ME ♡</text>
  </g>
);

export function SelfCheckout() {
  return (
    <ShopScene id="self" trace="self-checkout" label="The self-checkout lane: machines in a row, no staff. The near machine's screen says: no lady here, just you and me.">
      <Machine screen={SCREEN} />
    </ShopScene>
  );
}

// 11b. Closer on the same machine (her line to you): the screen fills the left third.
export function SelfCheckoutClose() {
  return (
    <ShopScene id="self-close" trace="self-checkout" cam="translate(-560 -60) scale(1.6)" label="Closer at the self-checkout machine. Its screen says: no lady here, just you and me.">
      <Machine screen={SCREEN} />
    </ShopScene>
  );
}
