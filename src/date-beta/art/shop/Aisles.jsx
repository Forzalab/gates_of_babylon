// SHOP aisles (SHOTLIST.md + FIX-LOG.md): the three HER LIST aisles, their close-ups and the OCPD tea-tin frame.
// Hand-pass cel rebuilds from Tony's refs (12 carrots bin, 11 egg display, 09/10 cup shelves): every aisle is ONE
// face-on ShelfBay (planks at y 300 / 560 / 850, a floor band from y 880 so Nanda's feet land on it, the floor tiles on
// the shared VP), the same 2:00 PM light (lit edges right, shadows down-left) and SP palette. The game draws its card
// row over x 110-1430, y 560-890 and its header chips at y 118-230 (centre), so signs hang on the top plank lip (y 316) and no
// sign text is above y 140. Nanda's slot in the game is x 1480-1880, feet y ~950: nothing focal goes there.
// MULTIPLANE (CEL-LOG.md): every aisle AND close-up is a pure vtrace far plane of Tony's refs (12 carrots, 11 egg
// display, 09 tea-ware stand, 10 tea-bowl shelf; cel-<id>.svg at 48 colours); the cels only add the JP shop POP signs
// (本日のおすすめ / 特売 / 3客セット), the floor band, THE three cups and her straight-edge. Overhead shop light: the
// cel shadows fall straight down (Shadow dx 0) and a warm fluorescent tint per aisle.
import { ShopScene, FloorBand, Price, Card, Cup, EggPack, SP } from './parts.jsx';

// R1. Produce aisle (ref 12 trace): the carrot pile, the handwritten card (blanked in prep, rewritten here in our text,
// between the header chips and the card row), a green crate lip + the floor band under Nanda. "RED ONLY" gag card left.
export function AisleProduce({ children }) {
  return (
    <ShopScene id="produce" trace="cel-produce" tint="#fff0dc" label="Aisle 1, vegetables: a heap of bagged carrots on green grass matting under a handwritten card: carrots, 99 yen a bag.">
      <g transform="rotate(3.7 990 400)" textAnchor="middle">
        <text x="990" y="336" fontSize="60" fill={SP.ink} className="shop-jp">にんじん</text>
        <text x="990" y="384" fontSize="34" fill={SP.ink} className="shop-jp">1袋 · 本日のおすすめ</text>
        <text x="1000" y="530" fontSize="150" fill={SP.red} className="shop-price">¥99</text>
      </g>
      <FloorBand lip={SP.basketLo} />
      <Card x={90} y={300} w={360} h={84} fill="#fff23a" stroke={SP.red} lines={[['特売 · 赤いのだけ！', 34, SP.red, 'shop-jp'], ['RED ONLY · NOT GREEN', 18, SP.ink]]} />
      {children}
    </ShopScene>
  );
}

// R1 close-up (far: ref 12, tight on the bagged pile). Cel: the hand-written POP card stuck in the pile.
export function ProduceCarrots() {
  return (
    <ShopScene id="carrots" trace="cel-carrots" tint="#fff0dc" label="Close-up: a heap of bagged carrots on green grass matting. A handwritten card says carrots, one bag, 99 yen.">
      <g transform="rotate(4 820 330)">
        <rect x="640" y="200" width="380" height="270" rx="8" fill={SP.shade} opacity=".25" transform="translate(0 14)" />
        <rect x="640" y="200" width="380" height="270" rx="8" fill="#fffdf4" stroke={SP.line} strokeWidth="4" />
        <text x="830" y="268" textAnchor="middle" fontSize="56" fill={SP.ink} className="shop-jp">にんじん</text>
        <text x="830" y="318" textAnchor="middle" fontSize="32" fill={SP.ink} className="shop-jp">1袋 · 彼女のリスト</text>
        <text x="830" y="436" textAnchor="middle" fontSize="110" fill={SP.red} className="shop-price">¥99</text>
      </g>
    </ShopScene>
  );
}

// R2. Eggs aisle (ref 11 trace): the 幸福タマゴ egg display on the left, the store floor on the right under Nanda. The
// tall text banner was softened in prep; our EGGS ¥198 card hangs on it (below the header chips).
export const EggsBanner = () => (
  <Card x={1090} y={250} w={220} h={250} fill={SP.gold} stroke={SP.green} lines={[['特売', 44, SP.red, 'shop-jp'], ['10個入', 40, SP.green, 'shop-jp'], ['¥198', 58, SP.red, 'shop-price']]} />
);
export function AisleEggs({ children }) {
  return (
    <ShopScene id="eggs" trace="cel-eggs" tint="#fff3d6" label="Aisle 2, eggs: a big display stacked with egg packs under yellow HAPPY EGGS signs, a tub of loose eggs, shop shelves behind.">
      <EggsBanner />
      <Card x={1480} y={300} w={360} h={84} fill={SP.gold} stroke={SP.green} lines={[['たまご AND たまご = たまご', 26, SP.green, 'shop-jp'], ['EGG AND EGG = EGG', 18, SP.ink]]} />
      {children}
    </ShopScene>
  );
}

// R2 close-up (far: ref 11, tight on the egg-pack stack). Cels: our POP price boards hung on the traced shelf lips.
export function EggsRack() {
  return (
    <ShopScene id="eggs-rack" trace="cel-eggs-rack" tint="#fff3d6" label="Close-up: a stacked display of egg packs under yellow HAPPY EGGS boards, price cards on the shelf edges.">
      <Price x={140} y={560} w={300} h={100} label="しろ 10個入" price="¥168" />
      <Price x={1180} y={560} w={300} h={100} label="あか 10個入" price="¥188" />
      <Card x={560} y={170} w={620} h={78} fill={SP.gold} stroke={SP.green} lines={[['本日のおすすめ · お弁当に', 40, SP.red, 'shop-jp']]} />
    </ShopScene>
  );
}

// R3. Cups aisle (ref 09 trace): the tea-ware stand. Its row of four odd cups (y 440-520) is covered by a clean shelf
// face: one pale back panel, one plank, THE three identical cups (same drawing as the answer icons), a ¥880 tag each.
export function AisleCups({ children }) {
  return (
    <ShopScene id="cups" trace="cel-cups" tint="#f8ead8" label="Aisle 3, cups: a wooden tea-ware stand with iron teapots and glass pots. On one clean shelf stand three matching pink tea bowls.">
      <rect x="520" y="400" width="460" height="134" fill={SP.wall} />
      <rect x="520" y="400" width="460" height="10" fill={SP.shade} opacity=".18" />
      <rect x="512" y="530" width="476" height="10" fill={SP.plankTop} />
      <rect x="512" y="540" width="476" height="22" fill={SP.plank} />
      {[620, 750, 880].map((x) => <Cup key={x} x={x} y={530} s={0.8} />)}
      <Card x={1470} y={290} w={380} h={100} fill="#fff23a" stroke={SP.red} lines={[['3客セット 特価！', 40, SP.red, 'shop-jp'], ['ペアより お得 · SET OF 3', 20, SP.ink, 'shop-jp']]} />
      {children}
    </ShopScene>
  );
}

// R3 close-up (far: ref 10, the tea-bowl shelf). Mid cel: one clean plank across the middle with exactly THE three
// identical cups (x 720/960/1200), a ¥880 tag each on the lip. Nothing at x > 1450 (her slot).
export function CupsFront({ three = true }) {
  return (
    <ShopScene id="cups-front" trace="cel-cups-front" tint="#f8ead8" label="Close-up: a shelf of tea bowls in many glazes. On one clean plank stand three matching pink tea bowls, a 880 yen tag under each.">
      <rect x="560" y="470" width="820" height="200" fill={SP.wall} />
      <rect x="560" y="470" width="820" height="12" fill={SP.shade} opacity=".2" />
      <rect x="548" y="640" width="844" height="12" fill={SP.plankTop} />
      <rect x="548" y="652" width="844" height="28" fill={SP.plank} />
      <rect x="548" y="680" width="844" height="10" fill={SP.shade} opacity=".25" />
      {three && [720, 960, 1200].map((x) => <Cup key={x} x={x} y={640} s={1.15} />)}
      {[720, 960, 1200].map((x) => <Card key={x} x={x - 70} y={656} w={140} h={44} r={4} lines={[['¥880', 32, '#d81e2a']]} />)}
      <Card x={600} y={400} w={260} h={56} r={6} fill="#fff23a" stroke={SP.red} lines={[['3客セット', 34, SP.red, 'shop-jp']]} />
    </ShopScene>
  );
}

// OCPD frame (ref 11 trace, the egg aisle she is in): she has re-stacked the display. One clean plank across the middle,
// identical egg packs in a dead-straight row, her dashed straight-edge ON the plank lip, the price tag hung square.
export function TeaTins() {
  return (
    <ShopScene id="tins" trace="cel-eggs" tint="#fff3d6" label="The egg display again. One shelf now holds identical egg packs in a perfectly straight row, a dashed line along the edge. A handwritten card says: it goes here, always here.">
      <rect x="480" y="360" width="980" height="170" fill={SP.wall} opacity=".92" />
      {Array.from({ length: 6 }, (_, i) => <EggPack key={i} x={520 + i * 152} y={530} w={140} />)}
      <rect x="470" y="530" width="1000" height="10" fill={SP.plankTop} />
      <rect x="470" y="540" width="1000" height="22" fill={SP.plank} />
      <line x1="480" y1="551" x2="1460" y2="551" stroke={SP.pink} strokeWidth="6" strokeDasharray="30 14" />
      <Price x={900} y={572} w={300} h={110} label="たまご 10個入" price="¥198" />
      <Card x={90} y={330} w={380} h={200} fill="#fffdf4" stroke={SP.pink} lines={[['ここに置く。', 40, SP.navy, 'shop-jp'], ['IT GOES HERE.', 30, SP.navy, 'shop-hand'], ['ALWAYS HERE. ♡', 30, SP.pink, 'shop-hand']]} />
    </ShopScene>
  );
}
