// SHOP cart POV + her list (FIX-LOG.md). Refs 13 + 15 (cart POV down an aisle, one vanishing point).
import { ShopScene, Hand, BasketBed, AisleVP, SP, VP, pts } from './parts.jsx';

// 4. Cart POV (refs 13 + 15; FIX-LOG): one vanishing point (VP) for the aisle AND the cart, the green shop basket in
// the cart, the red handle at y 560 (hands clear of the dialogue box top, y ~770), your two knit-sleeved hands wrapped round it (5 fingers,
// thumbs under the bar), and her hand coming in from the right, lying on top of your right hand.
export const HANDLE_Y = 560;
export function Cart({ items = false, hands = true, her = true, handle = true }) {
  const [vx, vy] = VP;
  const toVP = ([x, y], u) => [x + (vx - x) * u, y + (vy - y) * u];
  const nearL = [430, HANDLE_Y - 20], nearR = [1490, HANDLE_Y - 20], fl = [480, HANDLE_Y + 300], fr = [1440, HANDLE_Y + 300];
  const farL = toVP(nearL, 0.42), farR = toVP(nearR, 0.42), ffL = toVP(fl, 0.5), ffR = toVP(fr, 0.5);
  const wires = [];
  for (let i = 1; i < 12; i++) { const t = i / 12; const a = [farL[0] + (farR[0] - farL[0]) * t, farL[1]], b = [ffL[0] + (ffR[0] - ffL[0]) * t, ffL[1]]; wires.push([a, b]); }
  for (let i = 1; i < 6; i++) { const u = i / 6 * 0.42; wires.push([toVP(nearL, u), toVP(fl, u * 0.5 / 0.42)]); wires.push([toVP(nearR, u), toVP(fr, u * 0.5 / 0.42)]); }
  return (
    <g>
      <AisleVP />
      {/* the cart: inner floor, far wall, sides, wire mesh, rims on the VP */}
      <polygon points={pts([ffL, ffR, fr, fl])} fill={SP.metalLo} opacity=".35" />
      <g stroke={SP.metalLo} strokeWidth="4" opacity=".8">
        {wires.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)}
      </g>
      <polyline points={pts([ffL, ffR])} stroke={SP.metalLo} strokeWidth="5" fill="none" />
      <polygon points={pts([nearL, farL, farR, nearR])} fill="none" stroke={SP.metal} strokeWidth="12" strokeLinejoin="round" />
      <polygon points={pts([nearL, farL, farR, nearR])} fill="none" stroke={SP.metalHi} strokeWidth="4" strokeLinejoin="round" transform="translate(3 -4)" />
      <BasketBed x={960} y={items ? HANDLE_Y - 70 : HANDLE_Y - 10} s={items ? 0.62 : 0.56} items={items} />
      {/* the handle: red grip on two posts */}
      {handle && <rect x="380" y={HANDLE_Y - 20} width="1160" height="40" rx="20" fill={SP.red} stroke={SP.redLo} strokeWidth="4" />}
      {handle && <rect x="400" y={HANDLE_Y - 14} width="1120" height="8" rx="4" fill="#fff" opacity=".45" />}
      {hands && <Hand x={610} y={HANDLE_Y + 122} rot={10} pose="grip" thumb="right" />}
      {hands && <Hand x={1320} y={HANDLE_Y + 122} rot={-10} pose="grip" thumb="left" />}
      {hands && her && <Hand x={1355} y={HANDLE_Y + 87} rot={-72} s={0.92} her pose="flat" thumb="right" />}
    </g>
  );
}

export function ShopCart() {
  return (
    <ShopScene id="cart" trace={null}
      label="Your view down the aisle over a shopping cart with a green basket in it. Your two hands hold the red handle. Nanda's hand, with pink nails, lies on top of your right hand.">
      <Cart />
    </ShopScene>
  );
}

// the end card + react frame of the game: the same cart, her list in the basket (carrot, eggs, three cups)
export function ShopCartFull() {
  return (
    <ShopScene id="cart-full" trace={null}
      label="The cart again. In the green basket: a bag of carrots, a pack of eggs and three matching cups.">
      <Cart items her={false} />
    </ShopScene>
  );
}

// 3. Her list (insert, refs 13/03): the note on a little clipboard, hooked on the cart handle; the aisle soft behind.
// The paper sits LEFT of Nanda's slot (x 730-1190), so every line reads; a shadow falls down-left.
export function ShopList() {
  const over = (
    <g>
      <g transform="rotate(-3 440 460)">
        <rect x="150" y="190" width="560" height="620" rx="14" fill={SP.shade} opacity=".3" transform="translate(-22 16)" />
        <rect x="150" y="190" width="560" height="620" rx="14" fill={SP.plank} stroke={SP.plankLo} strokeWidth="5" />
        <rect x="178" y="226" width="504" height="556" rx="6" fill="#fffdf4" stroke="#b9a98a" strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="196" x2="664" y1={414 + i * 92} y2={414 + i * 92} stroke="#bcd3ee" strokeWidth="4" />)}
        <line x1="240" x2="240" y1="232" y2="776" stroke="#f3a0b0" strokeWidth="4" />
        <text x="440" y="300" textAnchor="middle" fontSize="60" fill={SP.pink} className="shop-hand">My list ♡</text>
        {['1. carrots', '2. eggs', '3. three cups', '4. you ♡'].map((t, i) => (
          <text key={t} x="262" y={402 + i * 92} fontSize={i === 3 ? 66 : 58} fill={i === 3 ? SP.pink : SP.navy} className="shop-hand">{t}</text>
        ))}
        {/* the clip, hooked over the handle */}
        <rect x="370" y="160" width="140" height="70" rx="12" fill={SP.metal} stroke={SP.metalLo} strokeWidth="4" />
        <rect x="380" y="166" width="120" height="12" rx="6" fill={SP.metalHi} />
      </g>
    </g>
  );
  return (
    <ShopScene id="list" trace={null} over={over}
      label="Close-up of Nanda's handwritten shopping list on a little clipboard hooked to the cart handle: 1 carrots, 2 eggs, 3 three cups, 4 you, with a heart.">
      <defs><filter id="shop-list-soft" x="0" y="0" width="1" height="1"><feGaussianBlur stdDeviation="9" /></filter></defs>
      <g filter="url(#shop-list-soft)" transform="translate(-480 -540) scale(1.5)">
        <Cart hands={false} handle={false} />
      </g>
      <rect width="1920" height="1080" fill={SP.shade} opacity=".12" />
      <rect x="0" y="150" width="1920" height="44" fill={SP.red} stroke={SP.redLo} strokeWidth="4" />
    </ShopScene>
  );
}
