// SHOP aisles (SHOTLIST.md + FIX-LOG.md): the three HER LIST aisles, their close-ups and the OCPD tea-tin frame.
// Hand-pass cel rebuilds from Tony's refs (12 carrots bin, 11 egg display, 09/10 cup shelves): every aisle is ONE
// face-on ShelfBay (planks at y 300 / 560 / 850, a floor band from y 880 so Nanda's feet land on it, the floor tiles on
// the shared VP), the same 2:00 PM light (lit edges right, shadows down-left) and SP palette. The game draws its card
// row over x 110-1430, y 560-890 and its header chips at y 118-230 (centre), so signs hang on the top plank lip (y 316) and no
// sign text is above y 140. Nanda's slot in the game is x 1480-1880, feet y ~950: nothing focal goes there.
// vtrace r2 (research/sprint-0930/shop/vtrace-r2): the three game aisles + the OCPD frame are back on vtracer traces
// of Tony's refs (12 carrots, 11 egg display, 09 tea-ware stand); the overlays only redraw the signs in our text, add
// the floor band, THE three cups and her straight-edge. The close-ups (carrots, eggs-rack, cups-front) stay cel.
import { ShopScene, ShelfBay, FloorBand, Price, Card, Cup, Carrot, EggPack, Shadow, SP } from './parts.jsx';

// R1. Produce aisle (ref 12 trace): the carrot pile, the handwritten card (blanked in prep, rewritten here in our text,
// between the header chips and the card row), a green crate lip + the floor band under Nanda. "RED ONLY" gag card left.
export function AisleProduce({ children }) {
  return (
    <ShopScene id="produce" trace="r2-produce" label="Aisle 1, vegetables: a heap of bagged carrots on green grass matting under a handwritten card: carrots, 99 yen a bag.">
      <g transform="rotate(3.7 990 400)" textAnchor="middle">
        <text x="990" y="336" fontSize="60" fill={SP.ink} className="shop-jp">にんじん</text>
        <text x="990" y="384" fontSize="32" fill={SP.ink} className="shop-sign">CARROTS · 1 BAG</text>
        <text x="1000" y="530" fontSize="150" fill={SP.red} className="shop-price">¥99</text>
      </g>
      <FloorBand lip={SP.basketLo} />
      <Card x={90} y={316} w={360} h={56} fill="#fffdf4" stroke={SP.red} lines={[['RED ONLY · NOT GREEN', 30, SP.red]]} />
      {children}
    </ShopScene>
  );
}

// R1 close-up (ref 12): the carrot crate on its shelf; the hand-written ¥99 card stuck in the pile.
export function ProduceCarrots() {
  const cs = [];
  for (let r = 0; r < 6; r++) for (let i = 0; i < 12; i++) cs.push(<Carrot key={`${r}${i}`} x={170 + i * 100 + (r % 2) * 50} y={390 + r * 46} len={260} a={r % 2 ? 186 : 174} />);
  return (
    <ShopScene id="carrots" trace={null} label="Close-up: a green crate full of carrots on the shelf. A handwritten card says carrots, 99 yen.">
      <ShelfBay planks={[]} top={150}>
        <rect x="100" y="250" width="1500" height="600" fill={SP.wallLo} />
        {cs}
        <rect x="140" y="620" width="1440" height="230" rx="10" fill={SP.green} stroke="#1d5e31" strokeWidth="6" />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={176 + i * 106} y="660" width="70" height="150" rx="8" fill="#1d5e31" />)}
        <rect x="140" y="620" width="1440" height="14" fill={SP.basketHi} />
        <Shadow x={860} y={850} w={1440} h={40} op={0.24} />
      </ShelfBay>
      <g transform="rotate(4 820 330)">
        <rect x="640" y="200" width="360" height="260" rx="8" fill="#fffdf4" stroke={SP.line} strokeWidth="4" />
        <text x="820" y="270" textAnchor="middle" fontSize="56" fill={SP.ink} className="shop-jp">にんじん</text>
        <text x="820" y="320" textAnchor="middle" fontSize="30" fill={SP.ink} className="shop-sign">CARROTS · ON HER LIST</text>
        <text x="820" y="430" textAnchor="middle" fontSize="110" fill={SP.red} className="shop-price">¥99</text>
      </g>
    </ShopScene>
  );
}

// R2. Eggs aisle (ref 11 trace): the 幸福タマゴ egg display on the left, the store floor on the right under Nanda. The
// tall text banner was softened in prep; our EGGS ¥198 card hangs on it (below the header chips).
export const EggsBanner = () => (
  <Card x={1090} y={250} w={220} h={250} fill={SP.gold} stroke={SP.green} lines={[['たまご', 50, SP.red, 'shop-jp'], ['EGGS', 40, SP.green], ['¥198', 58, SP.red, 'shop-price']]} />
);
export function AisleEggs({ children }) {
  return (
    <ShopScene id="eggs" trace="r2-eggs" label="Aisle 2, eggs: a big display stacked with egg packs under yellow HAPPY EGGS signs, a tub of loose eggs, shop shelves behind.">
      <EggsBanner />
      <Card x={1480} y={316} w={360} h={56} fill={SP.gold} stroke={SP.green} lines={[['EGG AND EGG = EGG', 30, SP.green]]} />
      {children}
    </ShopScene>
  );
}

// R2 close-up (ref 11): two rows of egg packs on two planks, one straight-on view, price boards on the plank lips.
export function EggsRack() {
  return (
    <ShopScene id="eggs-rack" trace={null} label="Close-up: two shelves stacked with egg packs, white eggs above, brown eggs below, price boards on the shelf edges.">
      <ShelfBay planks={[480]} top={170}>
        {Array.from({ length: 6 }, (_, i) => <EggPack key={i} x={240 + i * 270} y={480} w={250} />)}
        {Array.from({ length: 6 }, (_, i) => <EggPack key={`b${i}`} x={240 + i * 270} y={850} w={250} brown />)}
      </ShelfBay>
      <Price x={140} y={492} w={300} h={100} label="しろ WHITE EGGS" price="¥168" />
      <Price x={1180} y={492} w={300} h={100} label="あか BROWN EGGS" price="¥188" />
      <Card x={500} y={190} w={560} h={70} fill={SP.gold} stroke={SP.green} lines={[['HAPPY EGGS · FOR YOUR LUNCH', 34, SP.red]]} />
    </ShopScene>
  );
}

// a tea bowl (the "other" tableware; always smaller than THE cup and never pink-banded)
const Bowl = ({ x, y, c = '#8fb3c9', w = 84 }) => (
  <g>
    <ellipse cx={x - 10} cy={y + 2} rx={w / 2} ry="6" fill={SP.shade} opacity=".2" />
    <path d={`M${x - w / 2} ${y - w * 0.5} Q${x - w / 2} ${y} ${x} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - w * 0.5} Z`} fill={c} stroke={SP.line} strokeWidth="3" />
    <ellipse cx={x} cy={y - w * 0.5} rx={w / 2} ry={w * 0.1} fill="#f4efe4" stroke={SP.line} strokeWidth="3" />
  </g>
);
const BOWLS = ['#8fb3c9', '#c9a27a', '#6f8f6a', '#e6d8c0', '#3f4a5a', '#c98a8a'];

// R3. Cups aisle (ref 09 trace): the tea-ware stand. Its row of four odd cups (y 440-520) is covered by a clean shelf
// face: one pale back panel, one plank, THE three identical cups (same drawing as the answer icons), a ¥880 tag each.
export function AisleCups({ children }) {
  return (
    <ShopScene id="cups" trace="r2-cups" label="Aisle 3, cups: a wooden tea-ware stand with iron teapots and glass pots. On one clean shelf stand three matching white cups with pink bands.">
      <rect x="520" y="400" width="460" height="134" fill={SP.wall} />
      <rect x="520" y="400" width="460" height="10" fill={SP.shade} opacity=".18" />
      <rect x="512" y="530" width="476" height="10" fill={SP.plankTop} />
      <rect x="512" y="540" width="476" height="22" fill={SP.plank} />
      {[620, 750, 880].map((x) => <Cup key={x} x={x} y={530} s={1} />)}
      <Card x={1470} y={316} w={380} h={56} fill="#e8f3e2" stroke={SP.green} lines={[['CUPS FOR 2? FOR 3!', 30, SP.pink]]} />
      {children}
    </ShopScene>
  );
}

// R3 close-up (refs 09 + 10): exactly three identical cups (~130 px) on ONE plank, centred x 600-1300, a ¥880 tag on
// the plank lip under each. Every other piece on the shelf is dimmed back to 35 %. Nothing at x > 1450 (her slot).
export function CupsFront({ three = true }) {
  return (
    <ShopScene id="cups-front" trace={null} label="Close-up: three matching white cups with pink bands stand in a row on one shelf, a 880 yen tag under each. The rest of the shelf is soft behind.">
      <ShelfBay planks={[340, 640]} top={170}>
        <g opacity=".35">
          {Array.from({ length: 12 }, (_, i) => <Bowl key={i} x={150 + i * 150} y={340} c={BOWLS[i % BOWLS.length]} w={100} />)}
          {[150, 300, 1500, 1650].map((x, i) => <Bowl key={`m${x}`} x={x} y={640} c={BOWLS[(i + 3) % BOWLS.length]} w={100} />)}
        </g>
        {three && [720, 960, 1200].map((x) => <Cup key={x} x={x} y={640} s={1.3} />)}
      </ShelfBay>
      {[720, 960, 1200].map((x) => <Card key={x} x={x - 70} y={652} w={140} h={44} r={4} lines={[['¥880', 32, '#d81e2a']]} />)}
    </ShopScene>
  );
}

// OCPD frame (ref 11 trace, the egg aisle she is in): she has re-stacked the display. One clean plank across the middle,
// identical egg packs in a dead-straight row, her dashed straight-edge ON the plank lip, the price tag hung square.
export function TeaTins() {
  return (
    <ShopScene id="tins" trace="r2-eggs" label="The egg display again. One shelf now holds identical egg packs in a perfectly straight row, a dashed line along the edge. A handwritten card says: it goes here, always here.">
      <rect x="480" y="360" width="980" height="170" fill={SP.wall} opacity=".92" />
      {Array.from({ length: 6 }, (_, i) => <EggPack key={i} x={520 + i * 152} y={530} w={140} />)}
      <rect x="470" y="530" width="1000" height="10" fill={SP.plankTop} />
      <rect x="470" y="540" width="1000" height="22" fill={SP.plank} />
      <line x1="480" y1="551" x2="1460" y2="551" stroke={SP.pink} strokeWidth="6" strokeDasharray="30 14" />
      <Price x={900} y={572} w={300} h={110} label="たまご EGGS" price="¥198" />
      <Card x={90} y={330} w={380} h={200} fill="#fffdf4" stroke={SP.pink} lines={[['IT GOES HERE.', 44, SP.navy, 'shop-hand'], ['ALWAYS HERE. ♡', 44, SP.pink, 'shop-hand']]} />
    </ShopScene>
  );
}
