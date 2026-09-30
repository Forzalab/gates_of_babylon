// SHOP 1-4 + exit (SHOTLIST.md): the covered shop street, the shop doors, her list, the cart POV, and the way out.
// Refs: c91399ad (vending machines under the arcade roof), 16981cdc (konbini doors), 48d536e4 (cart POV).
import { ShopScene, Card, PlayerHand, HerHand, pts } from './parts.jsx';

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

// 4. Cart POV (48d536e4): the empty cart, your hands on the handle, her hand slides on top of yours.
function EmptyCart() {
  // the pre-pass flattened the cart contents; redraw the empty wire basket toward the far red corners
  const far = [[792, 132], [1188, 142]], near = [[430, 930], [1440, 940]];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  return (
    <g>
      <polygon points={pts([[700, 280], [1160, 290], [1260, 930], [600, 930]])} fill="#d9d6cf" />
      {[0.15, 0.3, 0.45, 0.6, 0.75].map((t) => (
        <line key={t} x1={640 + t * 40} y1={200 + t * 700} x2={1210 + t * 40} y2={210 + t * 700} stroke="#e3e5e8" strokeWidth="3" opacity=".5" />
      ))}
      <g stroke="#8d9097" strokeWidth="5" opacity=".9">
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => {
          const a = lerp(far[0], far[1], t), b = lerp(near[0], near[1], t);
          return <line key={t} x1={a[0]} y1={a[1] + 150} x2={b[0]} y2={b[1]} />;
        })}
        {[0.25, 0.5, 0.75].map((t) => <line key={`h${t}`} x1={660 - t * 60} y1={300 + t * 620} x2={1180 + t * 70} y2={306 + t * 620} />)}
      </g>
      {/* the right-hand cold case (covers the removed shopper's arm) */}
      <polygon points={pts([[1250, 0], [1920, 0], [1920, 480], [1550, 560], [1330, 330]])} fill="#e6ecef" />
      {[80, 180, 280, 380].map((y) => <line key={y} x1={1300 + (y / 330) * 20} y1={y} x2="1920" y2={y + 40} stroke="#b9c3ca" strokeWidth="8" />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={1420 + i * 80} y={110 + (i % 2) * 100} width="54" height="60" rx="6" fill={['#ffffff', '#f2d7a0', '#d8e8f5'][i % 3]} stroke="#9aa4ab" strokeWidth="3" />)}
    </g>
  );
}

export function ShopCart() {
  const over = (
    <g>
      <rect x="250" y="1004" width="1400" height="30" rx="14" fill="#c9372f" stroke="#6a1a16" strokeWidth="4" />
      <PlayerHand x={640} y={1000} flip />
      <PlayerHand x={1260} y={1000} />
      <HerHand x={1300} y={930} rot={-40} />
    </g>
  );
  return (
    <ShopScene id="cart" trace="shop-cart" over={over}
      label="Your view down at an empty shopping cart in a bright aisle. Your two hands hold the red handle. Nanda's hand, with pink nails, rests on top of your right hand.">
      <EmptyCart />
    </ShopScene>
  );
}

// 3. Her list (insert): a handwritten note clipped to the cart handle.
export function ShopList() {
  const over = (
    <g>
      <rect width="1920" height="1080" fill="#1a1420" opacity=".35" />
      <g transform="rotate(-4 960 540)">
        <rect x="620" y="130" width="680" height="820" rx="10" fill="#fffdf4" stroke="#b9a98a" strokeWidth="5" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1="650" x2="1270" y1={300 + i * 92} y2={300 + i * 92} stroke="#bcd3ee" strokeWidth="4" />)}
        <line x1="720" x2="720" y1="140" y2="940" stroke="#f3a0b0" strokeWidth="4" />
        <text x="960" y="240" textAnchor="middle" fontSize="64" fill="#e0467f" className="shop-hand">My list ♡</text>
        {['1. carrots', '2. eggs', '3. three cups', '4. you ♡'].map((t, i) => (
          <text key={t} x="750" y={378 + i * 138} fontSize={i === 3 ? 84 : 70} fill={i === 3 ? '#e0467f' : '#2b2a55'} className="shop-hand">{t}</text>
        ))}
        {/* the clip */}
        <rect x="900" y="100" width="120" height="70" rx="10" fill="#c9372f" stroke="#6a1a16" strokeWidth="4" />
        <path d="M1150 820 C1130 800 1100 812 1116 840 L1150 872 L1184 840 C1200 812 1170 800 1150 820Z" fill="#ff7aa8" />
      </g>
    </g>
  );
  return (
    <ShopScene id="list" trace="shop-cart" cam="translate(-960 -1080) scale(2)" over={over}
      label="Close-up of Nanda's handwritten shopping list, clipped to the cart handle: 1 carrots, 2 eggs, 3 three cups, 4 you, with a heart.">
      <EmptyCart />
    </ShopScene>
  );
}
