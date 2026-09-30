// SHOP 6-12 (SHOTLIST.md): the basket, the snack aisle on the way, the checkout lanes, the register, her nails, the
// self-checkout. Refs: 8d83db1f (basket), 0a536433 (snacks), d110f421 (checkout wide), c6ec0ec2 (retro register),
// 8873611d (basket handle), b56aeeaa (self-checkout).
import { ShopScene, Card, Cup, HerHand, pts } from './parts.jsx';

// 6. Close-up: her hands lift the basket; three matching cups on top (8d83db1f).
export function BasketCups() {
  return (
    <ShopScene id="basket" trace="basket-cups" label="Close-up from above: a green shop basket full of food. Three matching white cups with pink bands sit on top.">
      <Cup x={700} y={430} s={1.5} /><Cup x={930} y={470} s={1.5} /><Cup x={1160} y={430} s={1.5} />
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

// 9. The register (c6ec0ec2): the shop lady rings you up. Our display + our posters.
export function Register() {
  return (
    <ShopScene id="register" trace="register" label="Close-up at lane 2: the shop lady's hand on the old cash register. The display reads 1,011 yen.">
      <rect x="500" y="-10" width="400" height="104" rx="8" fill="#1d2622" />
      <text x="880" y="74" textAnchor="end" fontSize="80" fill="#8dffb0" className="r3-led">¥1,011</text>
      <rect x="150" y="394" width="220" height="600" fill="#2c2a4a" />
      <text x="260" y="490" textAnchor="middle" fontSize="54" fill="#f2c14e" className="shop-sign">NAND</text>
      <text x="260" y="550" textAnchor="middle" fontSize="54" fill="#f2c14e" className="shop-sign">MAN 2</text>
      <path d="M190 640 H270 A70 70 0 0 1 270 780 H190 Z" fill="#f2c14e" /><circle cx="352" cy="710" r="12" fill="#f2c14e" />
      <text x="260" y="900" textAnchor="middle" fontSize="36" fill="#fff" className="shop-sign">IN CINEMAS</text>
      <rect x="0" y="370" width="100" height="530" fill="#d8262e" />
      <text transform="translate(66 640) rotate(-90)" textAnchor="middle" fontSize="54" fill="#fff" className="shop-sign">OR SALE</text>
    </ShopScene>
  );
}

// 10. Close-up: her nails press into the basket handle (8873611d).
export function BasketHandle() {
  return (
    <ShopScene id="handle" trace="basket-handle" label="Extreme close-up: Nanda's hand grips the grey basket handle. Her pink nails press in hard.">
      <HerHand x={880} y={130} rot={-24} s={1.45} press />
      <path d="M760 360 l-40 30 M1040 340 l40 30 M900 420 l0 40" stroke="#e0467f" strokeWidth="8" strokeLinecap="round" />
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
    <text transform="translate(792 196) rotate(-3.5)" textAnchor="middle" fontSize="44" fill="#1d3a6a" className="shop-sign">NO LADY HERE</text>
    <text transform="translate(796 268) rotate(-3.5)" textAnchor="middle" fontSize="40" fill="#e0467f" className="shop-sign">JUST YOU + ME ♡</text>
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
