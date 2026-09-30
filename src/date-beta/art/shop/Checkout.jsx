// SHOP 6-12 (CEL-LOG.md, multiplane): far = pure vtraces of Tony's refs (03 basket, 04 snacks, 07 checkout lanes,
// 06 retro register, 05 basket + hand, 08 self-checkout); cels = THE cups, the POP cards, the LED total, the shop lady,
// her hand, the self-checkout screen. Overhead shop light everywhere (cel shadows straight down) + a per-scene tint.
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { ShopScene, Card, Hand, BasketBed, BasketGoods, Shadow, SP } from './parts.jsx';

// vtrace r2: the basket is the trace of ref 03 (the green basket full of groceries, 3/4 from above); her list sits on
// top (the shared BasketGoods: carrot bag, egg pack, cups 1 + 2 on one baseline) and her hand lowers cup 3.
// THE cup: one tea bowl traced by vtracer from the shop ref (research/sprint-0930/fix3/cups/trace_cup.py), re-projected to
// the basket's top-down camera (rim ~a circle, a sliver of wall). Three identical copies, so they match; sprite 300 x 286.
preloadTrace('shop/r2-cup');
const CUPS = [[1195, 300, 0.56, -8], [1340, 455, 0.56, 6], [1150, 560, 0.56, 3]]; // x, y = sprite centre, scale, tilt
// r5 (AUDIT 029): "Her hand puts one cup in the basket": cup 3 is still in her fingers, a hand's width above its place
// (its shadow already on the goods below); her thumb + index pinch its far rim from behind, so the cup covers the tips.
const HELD = [1175, 440];
function BasketCupBowls() {
  return (
    <g>
      {CUPS.map(([x, y, k, r], i) => {
        const held = i === 2, [cx, cy] = held ? HELD : [x, y];
        return (
          <g key={i}>
            {held && <ellipse cx={x + 22 * k} cy={y + 112 * k} rx={150 * k} ry={70 * k} fill="#1c0c08" opacity=".3" />}
            {held && <Hand x={cx + 92} y={cy - 240} rot={200} s={1.15} her pose="pinch" thumb="right" />}
            <g transform={`translate(${cx} ${cy}) rotate(${r})`}>
              {!held && <ellipse cx={22 * k} cy={112 * k} rx={150 * k} ry={70 * k} fill="#1c0c08" opacity=".5" />}
              <image href={traceUrl('shop/r2-cup')} x={-150 * k} y={-143 * k} width={300 * k} height={286 * k} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function BasketCups() {
  return (
    <ShopScene id="basket" trace="cel-basket" tint="#fff0e0" label="Close-up from above: a green shop basket full of groceries. On top: carrots.">
      <Shadow x={980} y={690} w={640} h={60} op={0.28} dx={0} />
      <BasketGoods x={930} y={620} s={1.25} />
      <BasketCupBowls />
    </ShopScene>
  );
}

// 7. On the way to the checkout (far: ref 04, the strawberry-snack shelf). Cels: the NAND BITES POP card, the
// NOT-ON-THE-LIST card; BOOK: the white price-tag rail across the bottom (the shelf lip nearest you).
const TagRail = () => (
  <g>
    <rect x="0" y="968" width="1920" height="112" fill="#f4f1ea" />
    <rect x="0" y="968" width="1920" height="10" fill="#fff" />
    <rect x="0" y="1060" width="1920" height="20" fill={SP.shade} opacity=".25" />
    {[140, 520, 1400, 1760].map((x) => <g key={x}><rect x={x} y="986" width="170" height="64" rx="4" fill={SP.white} stroke="#3b3a40" strokeWidth="3" /><text x={x + 85} y="1031" textAnchor="middle" fontSize="34" fill="#d81e2a" className="shop-price">¥128</text></g>)}
  </g>
);
export function ShopSnacks() {
  return (
    <ShopScene id="snacks" trace="cel-snacks" tint="#ffe9ee" book={<TagRail />} label="Aisle 4, a snack shelf: strawberry sweets in pink bags, a NAND BITES card, price tags along the shelf edge.">
      <Card x={1330} y={180} w={420} h={130} r={20} fill="#fff4f6" stroke={SP.pink} lines={[['いちご 新発売', 44, SP.pink, 'shop-jp'], ['NAND BITES', 36, SP.red]]} />
      <Card x={220} y={640} w={230} h={80} r={4} fill="#fff23a" stroke={SP.red} lines={[['リスト外', 32, SP.red, 'shop-jp'], ['NOT ON THE LIST', 16, SP.ink]]} />
    </ShopScene>
  );
}

// 8. The checkout lanes (far: ref 07, a real front-of-store with its lanes; the shoppers blurred pre-trace). Cels:
// the LANE 2 POP board and your basket on the lane counter.
export function CheckoutWide() {
  return (
    <ShopScene id="checkout" trace="cel-checkout" tint="#fff4e4" label="The checkout lanes of a bright supermarket: counters in a row under hanging boards. Lane 2 is open; your basket is on its counter.">
      <Card x={140} y={600} w={460} h={100} fill="#2f2f3a" stroke={SP.gold} lines={[['2番レジ 営業中', 40, SP.gold, 'shop-jp'], ['LANE 2 OPEN · 1 IS NOT', 22, SP.gold]]} />
      <BasketBed x={1370} y={500} s={0.3} />
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
    <ShopScene id="register" trace="cel-register" tint="#f6e8ee" label="At lane 2: an old cash register, its display reads 1,011 yen, snacks on the counter. The shop lady behind it smiles and waves. Your green basket sits on the counter.">
      {/* the LED total over the traced display */}
      <rect x="440" y="130" width="420" height="120" rx="10" fill="#1d2622" stroke={SP.line} strokeWidth="5" />
      <text x="810" y="218" textAnchor="end" fontSize="72" fill="#8dffb0" className="r3-led">¥1,011</text>
      {/* the shop lady (character plane) over the traced uniform, waving: 5 fingers */}
      <Lady x={1480} y={170} />
      <Hand x={1700} y={500} rot={16} s={0.46} sleeve={SP.white} thumb="left" />
      <BasketBed x={1560} y={860} s={0.42} />
    </ShopScene>
  );
}

// 10. Extreme close-up (far: ref 05, the grey basket packed with goods, its hand removed pre-trace). Character cel:
// her hand on the traced handle bar (its top grip runs down-right at ~18 deg): the fingers wrap it, four nail tips press ON it
// (an indent under each), the forearm comes in from the top.
export function BasketHandle() {
  const X = 1400, BAR = 420, A = 18;
  return (
    <ShopScene id="handle" trace="cel-handle" tint="#fff0e0" label="Extreme close-up: a grey shop basket packed with groceries. Nanda's hand grips its handle. Her four pink nails press into the bar, hard.">
      <g transform={`rotate(${A} ${X} ${BAR})`}>
        {/* r5 (AUDIT 033): the hand hangs from above, its fingers go round the bar: the bar (a cel strip over the traced one)
            crosses the middle of her fingers, so the handle is over the finger pads and only the nail tips show under it */}
        <Hand x={X} y={BAR - 196} rot={180} s={1.6} her pose="grip" thumb="left" />
        <rect x={X - 520} y={BAR - 34} width="1100" height="68" rx="30" fill="#b7aea4" stroke="#6f665e" strokeWidth="6" />
        <rect x={X - 500} y={BAR - 26} width="1060" height="14" rx="7" fill="#e6e0d8" opacity=".85" />
        {[-48, -16, 16, 48].map((f) => (
          <g key={f}>
            <path d={`M${X + f - 12} ${BAR + 30} q12 26 24 0`} fill={SP.nail} stroke={SP.nailLo} strokeWidth="3" />
            <path d={`M${X + f - 14} ${BAR + 36} q14 10 28 0`} stroke="#6f665e" strokeWidth="3" fill="none" opacity=".7" />
          </g>
        ))}
      </g>
    </ShopScene>
  );
}

// 11. The self-checkout lane (far: ref 08, the lanes of machines; the promo lettering removed pre-trace). Cels: our
// screen on the near machine's post (NO LADY HERE), the lane-0 flag.
function Screen() {
  return (
    <g>
      <rect x="1428" y="420" width="26" height="160" fill={SP.metalLo} />
      <rect x="1250" y="170" width="430" height="270" rx="12" fill="#2a3240" stroke="#141820" strokeWidth="6" />
      <rect x="1270" y="188" width="390" height="234" rx="6" fill="#dff3ff" />
      <text x="1465" y="262" textAnchor="middle" fontSize="34" fill="#1d3a6a" className="shop-jp">セルフレジ</text>
      <text x="1465" y="320" textAnchor="middle" fontSize="36" fill="#1d3a6a" className="shop-sign">NO LADY HERE</text>
      <text x="1465" y="384" textAnchor="middle" fontSize="32" fill={SP.pink} className="shop-sign">JUST YOU + ME ♡</text>
      <rect x="1720" y="160" width="70" height="84" fill={SP.red} />
      <text x="1755" y="224" textAnchor="middle" fontSize="60" fill="#fff" className="shop-sign">0</text>
    </g>
  );
}

export function SelfCheckout() {
  return (
    <ShopScene id="self" trace="cel-self" tint="#eaf0f6" label="The self-checkout lanes: a row of machines, no staff. The near screen says: no lady here, just you and me.">
      <Screen />
    </ShopScene>
  );
}

// 11b. Closer on the same machine: the far plane AND the cels scaled 1.35x about one point, so nothing slides.
export function SelfCheckoutClose() {
  return (
    <ShopScene id="self-close" trace="cel-self" tint="#eaf0f6" cam="translate(1400 480) scale(1.35) translate(-1400 -480)" label="Closer at the self-checkout machine. Its screen says: no lady here, just you and me.">
      <Screen />
    </ShopScene>
  );
}
