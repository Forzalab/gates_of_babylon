// SHOP aisles (SHOTLIST.md + FIX-LOG.md): the three HER LIST aisles, their close-ups and the OCPD tea-tin frame.
// Hand-pass cel rebuilds from Tony's refs (12 carrots bin, 11 egg display, 09/10 cup shelves): every aisle is ONE
// face-on ShelfBay (planks at y 300 / 560 / 850, a floor band from y 880 so Nanda's feet land on it, the floor tiles on
// the shared VP), the same 2:00 PM light (lit edges right, shadows down-left) and SP palette. The game draws its card
// row over x 110-1430, y 560-890 and its header chips at y 118-230 (centre), so signs hang on the top plank lip (y 316) and no
// sign text is above y 140. Nanda's slot in the game is x 1480-1880, feet y ~950: nothing focal goes there.
import { ShopScene, ShelfBay, Price, Card, Cup, Carrot, EggPack, Shadow, SP, pts } from './parts.jsx';

const Tomatoes = ({ x, y }) => (
  <g>
    <Shadow x={x + 60} y={y} w={120} h={14} op={0.2} />
    <rect x={x} y={y - 70} width="120" height="70" rx="8" fill="#f3e6e4" stroke={SP.line} strokeWidth="3" />
    {[[24, -44], [60, -50], [96, -44], [40, -22], [80, -22]].map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r="17" fill={j % 2 ? '#d8262e' : '#e8453a'} />)}
  </g>
);
const Radish = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-8)`}>
    <path d="M-16 0 Q-20 -120 0 -150 Q20 -120 16 0 Q0 16 -16 0Z" fill="#f6f4ee" stroke={SP.line} strokeWidth="3" />
    <path d="M0 -148 l-20 -40 M0 -148 l0 -46 M0 -148 l20 -40" stroke={SP.leaf} strokeWidth="8" strokeLinecap="round" />
  </g>
);
const Potato = ({ x, y }) => <ellipse cx={x} cy={y - 22} rx="46" ry="24" transform={`rotate(-12 ${x} ${y - 22})`} fill="#a0405a" stroke={SP.line} strokeWidth="3" />;
// a crate of carrots (ref 12): a green crate front, carrots piled above its lip
function CarrotCrate({ x, y, w = 360, n = 9 }) {
  const cs = [];
  const len = w * 0.42, span = w - len - 60;
  for (let i = 0; i < n; i++) cs.push(<Carrot key={i} x={x + 14 + (i * span) / (n - 1)} y={y - 64 - (i % 3) * 16} len={len} a={i % 2 ? 188 : 172} />);
  return (
    <g>
      <Shadow x={x + w / 2} y={y} w={w} h={20} op={0.22} />
      {cs}
      <rect x={x} y={y - 70} width={w} height="70" rx="6" fill={SP.green} stroke="#1d5e31" strokeWidth="4" />
      {Array.from({ length: Math.floor(w / 50) }, (_, i) => <rect key={i} x={x + 16 + i * 50} y={y - 54} width="32" height="38" rx="4" fill="#1d5e31" />)}
      <rect x={x} y={y - 70} width={w} height="8" fill={SP.basketHi} />
    </g>
  );
}

// R1. Produce aisle: carrots (the list item), radishes, sweet potatoes, tomatoes. The "RED ONLY" gag card is flat on
// the left, below the header chips.
export function AisleProduce({ children }) {
  return (
    <ShopScene id="produce" trace={null} label="Aisle 1, vegetables: a crate of carrots, white radishes, sweet potatoes and tomato packs on wooden shelves.">
      <ShelfBay>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <Tomatoes key={i} x={90 + i * 146} y={300} />)}
        <CarrotCrate x={90} y={560} w={420} />
        {[560, 620, 680, 740].map((x) => <Radish key={x} x={x} y={560} />)}
        {[860, 950, 1040, 1130].map((x) => <Potato key={x} x={x} y={560} />)}
        <CarrotCrate x={1460} y={560} w={380} />
        <CarrotCrate x={1460} y={850} w={380} />
        <Price x={1500} y={582} w={250} h={96} label="にんじん CARROTS" price="¥99" />
      </ShelfBay>
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

// an egg pack stack (ref 11: rows of packs on the display, gold "happy eggs" headers)
const Packs = ({ x, y, n, brown }) => Array.from({ length: n }, (_, i) => <EggPack key={i} x={x + i * 190} y={y} w={176} brown={brown && i % 2 === 0} />);

// R2. Eggs aisle (ref 11): the egg display, gold HAPPY EGGS headers flat on the plank lips, a milk case on the right.
export function AisleEggs({ children }) {
  return (
    <ShopScene id="eggs" trace={null} label="Aisle 2, eggs: shelves of egg packs under gold HAPPY EGGS headers, milk cartons on the right.">
      <ShelfBay>
        <Packs x={170} y={300} n={9} />
        <Packs x={170} y={560} n={9} brown />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M${1500 + i * 90} 850 L${1500 + i * 90} 730 L${1540 + i * 90} 700 L${1580 + i * 90} 730 L${1580 + i * 90} 850 Z`} fill="#fff" stroke={SP.line} strokeWidth="3" />
            <rect x={1500 + i * 90} y="770" width="80" height="34" fill="#5b8fd6" />
          </g>
        ))}
      </ShelfBay>
      <Card x={80} y={316} w={330} h={56} fill={SP.gold} stroke={SP.green} lines={[['HAPPY EGGS · たまご', 30, SP.red, 'shop-jp']]} />
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

// R3. Cups aisle (refs 09 + 10): tableware shelves, each cup <= 90 px (Nanda's head is ~190), THE cup (same drawing
// as the answer icons) in rows of three on the top plank, bowls below. "CUPS FOR 3!" hangs flat on the plank lip, right.
export function AisleCups({ children }) {
  return (
    <ShopScene id="cups" trace={null} label="Aisle 3, cups: wooden shelves of tea cups and bowls. A flat card says: cups for two? For three!">
      <ShelfBay>
        {Array.from({ length: 15 }, (_, i) => <Cup key={i} x={130 + i * 112 + Math.floor(i / 3) * 14} y={300} s={0.8} />)}
        {Array.from({ length: 16 }, (_, i) => <Bowl key={i} x={130 + i * 108} y={560} c={BOWLS[i % BOWLS.length]} />)}
        {Array.from({ length: 4 }, (_, i) => <Bowl key={`f${i}`} x={1500 + i * 96} y={850} c={BOWLS[(i + 2) % BOWLS.length]} />)}
      </ShelfBay>
      <Card x={1470} y={316} w={380} h={56} fill="#e8f3e2" stroke={SP.green} lines={[['CUPS FOR 2? FOR 3!', 30, SP.pink]]} />
      <Card x={80} y={316} w={300} h={56} fill="#e8f3e2" stroke={SP.green} lines={[['ENJOY TEA · お茶', 30, SP.green, 'shop-jp']]} />
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

// OCPD frame: the tea-tin shelf, every tin identical and lined up on three planks; her dashed straight-edge runs ON each
// plank lip. The TEA ¥350 tag hangs from the middle plank at x 900-1200; her card sits flat on the left.
const Tin = ({ x, y }) => (
  <g>
    <rect x={x - 11} y={y - 4} width="70" height="6" fill={SP.shade} opacity=".2" />
    <rect x={x} y={y - 110} width="70" height="110" rx="6" fill="#3d6b4a" stroke={SP.line} strokeWidth="3" />
    <rect x={x} y={y - 110} width="70" height="16" rx="4" fill={SP.metal} />
    <rect x={x + 56} y={y - 94} width="8" height="94" fill="#fff" opacity=".25" />
    <rect x={x + 10} y={y - 76} width="50" height="36" fill={SP.gold} />
    <text x={x + 35} y={y - 50} textAnchor="middle" fontSize="22" fill={SP.ink} className="shop-jp">茶</text>
  </g>
);
export function TeaTins() {
  const planks = [300, 560];
  return (
    <ShopScene id="tins" trace={null} label="The tea tin shelf. Every tin is the same and stands in a perfectly straight row. A handwritten card says: it goes here, always here.">
      <ShelfBay planks={planks}>
        {[...planks, 850].map((py) => Array.from({ length: 19 }, (_, i) => <Tin key={`${py}${i}`} x={100 + i * 92} y={py} />))}
        {[...planks, 850].map((py) => <line key={py} x1="60" y1={py + 20} x2="1860" y2={py + 20} stroke={SP.pink} strokeWidth="6" strokeDasharray="30 14" />)}
      </ShelfBay>
      <Price x={900} y={576} w={300} h={110} label="おちゃ TEA" price="¥350" />
      <Card x={90} y={330} w={380} h={200} fill="#fffdf4" stroke={SP.pink} lines={[['IT GOES HERE.', 44, SP.navy, 'shop-hand'], ['ALWAYS HERE. ♡', 44, SP.pink, 'shop-hand']]} />
    </ShopScene>
  );
}
