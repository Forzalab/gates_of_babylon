// SHOP 6-12 (SHOTLIST.md + FIX-LOG.md; all hand-pass cel rebuilds on the shared light/VP/palette): the basket, the snack aisle on the way, the checkout lanes, the register, her nails, the
// self-checkout. Refs: 8d83db1f (basket), 0a536433 (snacks), d110f421 (checkout wide), c6ec0ec2 (retro register),
// 8873611d (basket handle), b56aeeaa (self-checkout).
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { ShopScene, ShelfBay, Card, Cup, Hand, BasketBed, BasketGoods, BASKET, Shadow, SP, VP, pts } from './parts.jsx';

// vtrace r2: the basket is the trace of ref 03 (the green basket full of groceries, 3/4 from above); her list sits on
// top (the shared BasketGoods: carrot bag, egg pack, cups 1 + 2 on one baseline) and her hand lowers cup 3.
// THE cup: one tea bowl traced by vtracer from the shop ref (research/sprint-0930/fix3/cups/trace_cup.py), re-projected to
// the basket's top-down camera (rim ~a circle, a sliver of wall). Three identical copies, so they match; sprite 300 x 286.
preloadTrace('shop/r2-cup');
const CUPS = [[1195, 300, 0.56, -8], [1340, 455, 0.56, 6], [1150, 560, 0.56, 3]]; // x, y = sprite centre, scale, tilt
function BasketCupBowls() {
  return (
    <g>
      {CUPS.map(([x, y, k, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse cx={22 * k} cy={112 * k} rx={150 * k} ry={70 * k} fill="#1c0c08" opacity=".5" />
          <image href={traceUrl('shop/r2-cup')} x={-150 * k} y={-143 * k} width={300 * k} height={286 * k} />
        </g>
      ))}
    </g>
  );
}

export function BasketCups() {
  return (
    <ShopScene id="basket" trace="r2-basket" label="Close-up from above: a green shop basket full of groceries. On top: carrots.">
      <Shadow x={980} y={690} w={640} h={60} op={0.28} />
      <BasketGoods x={930} y={620} s={1.25} />
      <BasketCupBowls />
    </ShopScene>
  );
}

// 7. On the way to the checkout (ref 04): the strawberry-snack shelf, face-on (one ShelfBay, the shared VP), the
// NAND BITES header hung level from the plank lip on two hangers.
const SnackBag = ({ x, y, c = '#ff9ab8' }) => (
  <g>
    <rect x={x - 12} y={y - 4} width="120" height="8" fill={SP.shade} opacity=".2" />
    <path d={`M${x} ${y} L${x + 4} ${y - 150} L${x + 116} ${y - 150} L${x + 120} ${y} Z`} fill={c} stroke={SP.line} strokeWidth="3" strokeLinejoin="round" />
    <rect x={x + 4} y={y - 150} width="112" height="14" fill="#fff" opacity=".6" />
    <circle cx={x + 60} cy={y - 76} r="26" fill={SP.red} /><path d={`M${x + 50} ${y - 102} l10 -10 l10 10`} stroke={SP.leaf} strokeWidth="5" fill="none" />
    <text x={x + 60} y={y - 20} textAnchor="middle" fontSize="20" fill="#fff" className="shop-jp">いちご</text>
  </g>
);
export function ShopSnacks() {
  return (
    <ShopScene id="snacks" trace={null} label="Aisle 4, a snack shelf: strawberry sweets in pink bags, under a level NAND BITES sign.">
      <ShelfBay planks={[380, 620]} top={180}>
        {Array.from({ length: 13 }, (_, i) => <SnackBag key={i} x={80 + i * 136} y={380} c={['#ff9ab8', '#f6c1d4', '#e8574e'][i % 3]} />)}
        {Array.from({ length: 13 }, (_, i) => <SnackBag key={`b${i}`} x={80 + i * 136} y={620} c={['#f6c1d4', '#e8574e', '#ff9ab8'][i % 3]} />)}
        {Array.from({ length: 13 }, (_, i) => <SnackBag key={`c${i}`} x={80 + i * 136} y={850} c={['#e8574e', '#ff9ab8', '#f6c1d4'][i % 3]} />)}
      </ShelfBay>
      <path d="M1320 412 L1320 440 M1520 412 L1520 440" stroke={SP.metalLo} strokeWidth="5" />
      <Card x={1260} y={440} w={320} h={110} r={20} fill="#fff4f6" stroke={SP.pink} lines={[['いちご', 40, SP.pink, 'shop-jp'], ['NAND BITES', 36, SP.red]]} />
      <Card x={200} y={396} w={150} h={50} r={4} lines={[['¥128', 34, '#d81e2a']]} />
      <Card x={420} y={636} w={170} h={60} r={4} lines={[['NOT ON', 22], ['THE LIST', 22]]} />
    </ShopScene>
  );
}

// 8. The checkout lanes (refs 07 + 08): one-point view down the front of the shop. Counters on the left run to the
// shared VP; the lane boards hang on the same lines, so they shrink monotonically (2 nearest). Floor with lane
// markings, two shopper silhouettes for scale, your basket on the lane-2 counter (x 1250-1700).
function Board({ x, y, n, s, on }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="-300" x2="0" y2="0" stroke={SP.metalLo} strokeWidth="4" />
      <rect x="-50" y="0" width="100" height="120" rx="8" fill="#1f1d26" />
      <circle cx="0" cy="44" r="32" fill={on ? '#fff3b0' : '#6a6870'} />
      <text x="0" y="58" textAnchor="middle" fontSize="44" fill="#1f1d26" className="shop-sign">{n}</text>
      <text x="0" y="108" textAnchor="middle" fontSize="26" fill="#fff" className="shop-jp">レジ</text>
    </g>
  );
}
export function CheckoutWide() {
  const [vx, vy] = VP;
  const lane = (x0, u) => [x0 + (vx - x0) * u, 1080 + (vy - 1080) * u];
  const counters = [[1500, 0.05], [1500, 0.35], [1500, 0.55], [1500, 0.68]];
  return (
    <ShopScene id="checkout" trace={null} label="The checkout lanes: counters in a row under hanging lane boards. Lane 2 is lit and open; your basket is on its counter.">
      <rect width="1920" height="1080" fill={SP.wall} />
      <rect width="1920" height="90" fill={SP.ceil} />
      {[-500, 0, 500].map((x) => <polygon key={x} points={pts([[960 + x - 60, 0], [960 + x + 60, 0], [vx + x * 0.2 + 12, vy - 150], [vx + x * 0.2 - 12, vy - 150]])} fill={SP.lamp} />)}
      <rect y={vy} width="1920" height={1080 - vy} fill={SP.floor} />
      {[-600, -100, 400, 900, 1400, 1900, 2400].map((x) => <line key={x} x1={x} y1="1080" x2={vx} y2={vy} stroke={SP.floorLine} strokeWidth="3" />)}
      {[0.3, 0.55, 0.72].map((u) => <line key={u} x1="0" y1={1080 + (vy - 1080) * u} x2="1920" y2={1080 + (vy - 1080) * u} stroke={SP.floorLine} strokeWidth="3" />)}
      {/* shelving far back */}
      <rect x="0" y="200" width="1920" height={vy - 200} fill={SP.wallLo} />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80 + 10} y="230" width="60" height="80" rx="4" fill={['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6', '#f08fb8'][i % 5]} opacity=".7" />)}
      {/* shoppers (flat silhouettes) */}
      {[[300, 0.5], [620, 0.35]].map(([x, u]) => { const [px, fy] = lane(x, u); const k = 1 - u; return <g key={x} fill="#8a93a0"><path d={`M${px - 50 * k} ${fy} L${px - 60 * k} ${fy - 330 * k} Q${px} ${fy - 400 * k} ${px + 60 * k} ${fy - 330 * k} L${px + 50 * k} ${fy} Z`} /><circle cx={px} cy={fy - 430 * k} r={46 * k} /></g>; })}
      {/* counters from far to near (right side), all on the VP */}
      {counters.slice().reverse().map(([x0, u], i) => {
        const k = 1 - u;
        const [x, y] = lane(x0, u);
        return (
          <g key={u}>
            <polygon points={pts([[x - 40 * k, y - 380 * k], [x + 440 * k, y - 380 * k], [x + 440 * k, y], [x - 40 * k, y]])} fill={SP.plank} stroke={SP.plankLo} strokeWidth="3" />
            <rect x={x - 40 * k} y={y - 390 * k} width={480 * k} height={16 * k} fill={SP.plankTop} />
          </g>
        );
      })}
      {[[0.63, '5'], [0.5, '4'], [0.3, '3'], [0, '2']].map(([u, n]) => (
        <Board key={n} x={1470 + (vx - 1470) * u} y={170 + (vy - 170) * u} n={n} s={0.9 * (1 - u)} on={n === '2'} />
      ))}
      {/* your basket on the lane-2 counter */}
      <BasketBed x={1560} y={566} s={0.42} />
      <Card x={140} y={600} w={440} h={80} rot={0} fill="#2f2f3a" stroke={SP.gold} lines={[['LANE 2 OPEN · 1 IS NOT', 34, SP.gold]]} />
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

// 11. The self-checkout lane (ref 08): the near machine stands RIGHT of Nanda's slot (x 1240-1760) on a pedestal, its
// bag tray level (horizontal, like the shelf rows behind), the monitor on a post with a base. Tiled floor with one
// window reflection from the upper right. 11b = the same layers scaled about ONE point (960, 600).
function Machine({ screen }) {
  return (
    <g>
      <rect width="1920" height="1080" fill={SP.wall} />
      <rect width="1920" height="80" fill={SP.ceil} />
      {/* the cold case at the back: level rows */}
      <rect x="80" y="170" width="1100" height="520" fill="#f1f5f8" stroke={SP.metalLo} strokeWidth="4" />
      {[270, 380, 490, 600].map((y) => <rect key={y} x="80" y={y} width="1100" height="10" fill="#c7d2da" />)}
      {Array.from({ length: 14 }, (_, i) => [210, 320, 430, 540].map((y, j) => <rect key={`${i}${j}`} x={100 + i * 76} y={y + 6} width="56" height="54" rx="4" fill={['#bde0f5', '#fff', '#f5c8a8', '#d8f0c8'][(i + j) % 4]} />))}
      {/* floor + the window reflection */}
      <rect y="760" width="1920" height="320" fill={SP.floor} />
      {[-600, -200, 200, 600, 1000, 1400, 1800, 2200, 2600].map((x) => <line key={x} x1={x} y1="1080" x2={x + (VP[0] - x) * (320 / 750)} y2="760" stroke={SP.floorLine} strokeWidth="3" />)}
      {[840, 950].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke={SP.floorLine} strokeWidth="3" />)}
      <polygon points={pts([[1300, 770], [1760, 770], [1640, 1080], [1080, 1080]])} fill={SP.floorHi} opacity=".8" />
      {/* the machine: pedestal, body, level tray, post + monitor */}
      <Shadow x={1500} y={780} w={560} h={50} op={0.3} />
      <rect x="1300" y="560" width="400" height="220" fill="#dfe4ea" stroke={SP.metalLo} strokeWidth="5" />
      <rect x="1680" y="566" width="14" height="208" fill="#fff" opacity=".6" />
      <rect x="1240" y="520" width="520" height="44" rx="6" fill="#c9d5e2" stroke="#6c7887" strokeWidth="5" />
      <rect x="1480" y="250" width="26" height="270" fill={SP.metalLo} />
      <rect x="1440" y="506" width="106" height="16" rx="4" fill={SP.metalLo} />
      <rect x="1310" y="150" width="380" height="250" rx="12" fill="#2a3240" stroke="#141820" strokeWidth="6" />
      <rect x="1330" y="168" width="340" height="214" rx="6" fill="#dff3ff" />
      {screen}
      {/* the lane number flag: ours */}
      <rect x="1720" y="160" width="70" height="84" fill={SP.red} />
      <text x="1755" y="224" textAnchor="middle" fontSize="60" fill="#fff" className="shop-sign">0</text>
    </g>
  );
}

const SCREEN = (
  <g>
    <text x="1500" y="250" textAnchor="middle" fontSize="36" fill="#1d3a6a" className="shop-sign">NO LADY HERE</text>
    <text x="1500" y="320" textAnchor="middle" fontSize="32" fill={SP.pink} className="shop-sign">JUST YOU + ME ♡</text>
  </g>
);

export function SelfCheckout() {
  return (
    <ShopScene id="self" trace={null} label="The self-checkout lane: a machine on a pedestal, no staff. Its screen says: no lady here, just you and me.">
      <Machine screen={SCREEN} />
    </ShopScene>
  );
}

// 11b. Closer on the same machine: every layer scaled 1.35x about one point (1500, 600), so the tray keeps its level.
export function SelfCheckoutClose() {
  return (
    <ShopScene id="self-close" trace={null} cam="translate(1400 480) scale(1.35) translate(-1400 -480)" label="Closer at the self-checkout machine. Its screen says: no lady here, just you and me.">
      <Machine screen={SCREEN} />
    </ShopScene>
  );
}
