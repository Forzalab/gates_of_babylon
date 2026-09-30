// SHOP 1-4 + exit (SHOTLIST.md): the covered shop street, the shop doors, her list, the cart POV, and the way out.
// Refs: c91399ad (vending machines under the arcade roof), 16981cdc (konbini doors), 48d536e4 (cart POV).
import { ShopScene, Card, Hand, BasketBed, AisleVP, SP, VP, pts } from './parts.jsx';

// 1. SHOP STREET · 2:00 PM: the vending machines outside the shop, under the arcade roof (establishing + stamp).
export function ShopVending() {
  return (
    <ShopScene id="vending" trace="shop-vending" label="The shop street at 2:00 PM, under a covered roof: a row of vending machines outside the shop. Nanda stands in front of them.">
      {/* the arcade banner (establishes the place in words) */}
      <rect x="96" y="96" width="4" height="40" fill="#6d6a72" /><rect x="506" y="70" width="4" height="40" fill="#6d6a72" />
      <Card x={60} y={130} w={500} h={110} rot={-6} fill="#ffe7a8" stroke="#8a4b2a" lines={[['ようこそ 商店街', 40, '#8a4b2a', 'shop-jp'], ['WELCOME TO THE SHOP STREET', 26, '#b8322f']]} />
      {/* the cola machine's slanted logo panel: our own brand */}
      <polygon points={pts([[330, 520], [720, 322], [742, 420], [346, 612]])} fill="#d8262e" />
      <text x="0" y="0" transform="translate(540 492) rotate(-27)" textAnchor="middle" fontSize="84" fill="#fff" className="shop-sign">GATE-COLA</text>
      {/* the juice machine's slanted header */}
      <polygon points={pts([[792, 548], [1222, 372], [1232, 440], [800, 612]])} fill="#f6e7bf" />
      <text x="0" y="0" transform="translate(1012 522) rotate(-23)" textAnchor="middle" fontSize="60" fill="#3d4f9a" className="shop-sign">FRESH JUICE</text>
      {/* the "broken" card on the juice machine: broken = output 0 */}
      <Card x={916} y={736} w={128} h={226} lines={[['SORRY', 30], ['BROKEN', 30, '#d81e2a'], ['OUT: 0', 30]]} />
      {/* the snack machine's button column, redrawn clean: 0/1 buttons */}
      {['1', '0', '1', '1', '0', '0', '1', '0', '1'].map((d, i) => (
        <g key={i}>
          <rect x="1496" y={376 + i * 64} width="62" height="56" rx="4" fill="#f6e6c4" stroke="#5a4a3a" strokeWidth="3" />
          <text x="1527" y={420 + i * 64} textAnchor="middle" fontSize="40" fill="#5a4a3a" className="shop-sign">{d}</text>
        </g>
      ))}
    </ShopScene>
  );
}

// the doorway hole (the pre-pass removed a man, a girl and a clerk): the shop inside, seen through the open doors
function Inside({ out = false }) {
  if (out) {
    // from inside, looking out: the bright street through the glass
    return (
      <g>
        <rect x="440" y="220" width="720" height="860" fill="#fff4dc" />
        <rect x="440" y="220" width="720" height="120" fill="#ffe2a6" />
        <polygon points={pts([[440, 760], [1160, 760], [1160, 1080], [440, 1080]])} fill="#e9d9b8" />
        {[520, 700, 880, 1060].map((x) => <rect key={x} x={x} y="360" width="70" height="400" fill="#f3c98a" opacity=".6" />)}
        <rect x="1250" y="520" width="200" height="280" fill="#e3e8dc" />
        <rect x="1270" y="540" width="160" height="190" rx="6" fill="#fff6d8" stroke="#d8262e" strokeWidth="5" />
        <text x="1350" y="620" textAnchor="middle" fontSize="36" fill="#d8262e" className="shop-sign">OPEN</text>
        <text x="1350" y="680" textAnchor="middle" fontSize="30" fill="#2c57a8" className="shop-sign">10-21</text>
      </g>
    );
  }
  const goods = ['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6', '#f08fb8', '#fff2c8'];
  return (
    <g>
      <rect x="440" y="220" width="720" height="560" fill="#e4ecdf" />
      <rect x="440" y="258" width="720" height="40" fill="#e98aa0" />
      {/* two low shelf gondolas, flat cels */}
      {[[470, 430, 300], [860, 430, 290]].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height="330" fill="#f6f4ee" stroke="#9aa39a" strokeWidth="4" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={x} y={y + 76 + r * 80} width={w} height="8" fill="#9aa39a" />
              {Array.from({ length: Math.floor(w / 36) }, (_, i) => (
                <rect key={i} x={x + 8 + i * 36} y={y + 26 + r * 80} width="28" height="50" rx="3" fill={goods[(i + r * 2 + x) % goods.length]} />
              ))}
            </g>
          ))}
        </g>
      ))}
      <rect x="440" y="770" width="720" height="310" fill="#d3d8cd" />
      {/* the sliding doors, both panels slid open to the sides */}
      <rect x="440" y="220" width="60" height="860" fill="#cfe3e0" opacity=".55" stroke="#4d4a3e" strokeWidth="10" />
      <rect x="1100" y="220" width="60" height="860" fill="#cfe3e0" opacity=".55" stroke="#4d4a3e" strokeWidth="10" />
      <rect x="1250" y="520" width="200" height="280" fill="#e0e6da" />
      <rect x="1250" y="740" width="200" height="60" fill="#c4b9a5" />
      {/* a sale poster on the glass (covers the removed clerk) */}
      <rect x="1270" y="540" width="160" height="190" rx="6" fill="#fff6d8" stroke="#d8262e" strokeWidth="5" />
      <text x="1350" y="610" textAnchor="middle" fontSize="40" fill="#d8262e" className="shop-sign">EGGS</text>
      <text x="1350" y="680" textAnchor="middle" fontSize="44" fill="#2c57a8" className="shop-price">¥168</text>
    </g>
  );
}

// 2. The shop doors slide open (16981cdc): NAND MART.
export function ShopDoors() {
  return (
    <ShopScene id="doors" trace="shop-doors" label="The front of the NAND MART shop. The glass doors are open. Nanda stands in the doorway.">
      <Inside />
      <rect x="440" y="700" width="720" height="36" fill="#2e8a4a" /><rect x="440" y="736" width="720" height="12" fill="#b9dcc0" />
      {/* the banner over the door: our own shop name + a sale strip with the gate gag */}
      <rect x="440" y="0" width="690" height="160" fill="#fffaf2" />
      <text x="785" y="84" textAnchor="middle" fontSize="80" fill="#e0262e" className="shop-sign">NAND MART</text>
      <text x="785" y="140" textAnchor="middle" fontSize="36" fill="#2c57a8" className="shop-sign">OPEN · NOT CLOSED</text>
      <rect x="1130" y="0" width="360" height="112" fill="#e0262e" />
      <text x="1310" y="50" textAnchor="middle" fontSize="36" fill="#fff" className="shop-jp">おかいもの</text>
      <text x="1310" y="96" textAnchor="middle" fontSize="36" fill="#fff" className="shop-sign">SALE TODAY</text>
    </ShopScene>
  );
}

// 12. Exit: the same doors from inside, looking out at the bright street; you carry the bags.
function Bag({ x, y, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      {/* carrot tops + one carrot sticking out (the list, paid for) */}
      <path d="M-10 -40 L20 -150 L40 -40Z" fill="#ff8a2a" stroke="#8a3a10" strokeWidth="4" />
      <path d="M22 -150 l-20 -40 M22 -150 l0 -46 M22 -150 l22 -38" stroke="#3f9a3a" strokeWidth="8" strokeLinecap="round" />
      <path d="M-120 -60 L120 -60 L140 200 L-140 200Z" fill="#f4f6f8" stroke="#8a93a0" strokeWidth="5" strokeLinejoin="round" />
      <path d="M-70 -60 C-70 -140 -10 -140 -10 -60 M10 -60 C10 -140 70 -140 70 -60" fill="none" stroke="#8a93a0" strokeWidth="8" />
      <text x="0" y="60" textAnchor="middle" fontSize="40" fill="#e0262e" className="shop-sign" transform={flip ? 'scale(-1 1)' : undefined}>NAND</text>
      <text x="0" y="104" textAnchor="middle" fontSize="40" fill="#e0262e" className="shop-sign" transform={flip ? 'scale(-1 1)' : undefined}>MART</text>
    </g>
  );
}

export function ShopExit() {
  const over = (
    <g>
      {/* the back of the banner, from inside: a thank-you strip */}
      <rect x="790" y="0" width="690" height="160" fill="#fffaf2" />
      <text x="1135" y="70" textAnchor="middle" fontSize="54" fill="#e0262e" className="shop-jp">ありがとう</text>
      <text x="1135" y="132" textAnchor="middle" fontSize="40" fill="#2c57a8" className="shop-sign">THANK YOU · COME BACK</text>
      <Bag x={300} y={900} /><Bag x={1640} y={920} flip />
      {/* the shop bell over the door */}
      <path d="M1135 170 L1135 200" stroke="#6d6a72" strokeWidth="4" />
      <path d="M1105 250 C1105 210 1165 210 1165 250 L1175 262 L1095 262Z" fill="#f2c14e" stroke="#8a6a20" strokeWidth="4" />
      <circle cx="1135" cy="270" r="8" fill="#8a6a20" />
    </g>
  );
  return (
    <ShopScene id="exit" trace="shop-doors" cam="translate(1920 0) scale(-1 1)" over={over}
      label="Inside the shop by the open doors, looking out at the bright street. The shop bell hangs over the door. You carry two NAND MART bags; carrots stick out of one.">
      <Inside out />
      <rect x="440" y="700" width="720" height="36" fill="#2e8a4a" /><rect x="440" y="736" width="720" height="12" fill="#b9dcc0" />
    </ShopScene>
  );
}

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
