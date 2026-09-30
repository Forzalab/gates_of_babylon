// SHOP aisles (SHOTLIST.md): the three mini-game aisles + their close-ups. All inside NAND MART, same 2:00 PM light.
// Refs: 7eeb457b (tomatoes), 3e2c3f6b (carrots), cc81cb95 (egg stand), 28b1b12e (egg racks), 708a5c2b (tableware),
// ebc36ef4 (tea bowls front-on), a2a61ba4 (tea tins).
import { ShopScene, Card, Price, Cup, pts } from './parts.jsx';

// R1. Produce aisle (7eeb457b): the caption + rings removed; the tomato packs under the caption redrawn.
export function AisleProduce({ children }) {
  const packs = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) packs.push([880 + c * 122 + (r % 2) * 30, 560 + r * 104]);
  return (
    <ShopScene id="produce" trace="aisle-produce" label="Aisle 1, fruit and vegetables: shelves of tomato packs with red price cards.">
      {packs.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="112" height="92" rx="10" fill="#f3e6e4" stroke="#8a6a6a" strokeWidth="3" />
          {[[28, 30], [62, 28], [92, 36], [40, 62], [76, 64]].map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r="17" fill={j % 2 ? '#d8262e' : '#e8453a'} />)}
          <circle cx={x + 24} cy={y + 24} r="5" fill="#fff" opacity=".7" />
        </g>
      ))}
      <Price x={300} y={2} w={310} h={116} label="トマト TOMATO" price="¥399" />
      <Price x={690} y={2} w={330} h={116} label="ミニトマト MINI" price="¥299" />
      <Price x={1190} y={2} w={340} h={116} label="トマト TOMATO" price="¥399" />
      <Price x={745} y={812} w={360} h={170} label="あかい RED ONLY" price="¥299" note="NOT GREEN" />
      {children}
    </ShopScene>
  );
}

// R1 close-up (3e2c3f6b): the carrot crate. The sign on top is ours.
export function ProduceCarrots() {
  return (
    <ShopScene id="carrots" trace="produce-carrots" label="Close-up: a green crate full of bagged carrots. The pink sign says carrots, 98 yen.">
      <Card x={700} y={-20} w={660} h={170} fill="#ffd9e6" stroke="#b8325a" lines={[['にんじん CARROTS', 52, '#b8325a', 'shop-jp'], ['¥98 · IN THE LIST = TRUE', 40, '#e0262e']]} />
    </ShopScene>
  );
}

// R2. Eggs aisle (cc81cb95): the egg stand, the loose-egg tub, the long aisle behind.
export function AisleEggs({ children }) {
  return (
    <ShopScene id="eggs" trace="aisle-eggs" label="Aisle 2, eggs: a tall stand of egg packs and a wooden tub of loose eggs. A long aisle goes back on the right.">
      <Card x={380} y={-10} w={400} h={170} rot={-6} fill="#f6e04a" stroke="#2d7a3a" lines={[['NAND EGGS', 58, '#2d7a3a'], ['たまご', 44, '#d8262e', 'shop-jp']]} />
      <Card x={505} y={328} w={410} h={82} fill="#f6e04a" stroke="#2d7a3a" lines={[['HAPPY EGGS', 50, '#d8262e']]} />
      <Card x={520} y={582} w={410} h={82} fill="#f6e04a" stroke="#2d7a3a" lines={[['HAPPY EGGS', 50, '#d8262e']]} />
      <Card x={1100} y={-10} w={220} h={500} fill="#f6d020" stroke="#2b2a33" lines={[['EGG', 60], ['AND', 60, '#d8262e'], ['EGG', 60], ['=', 60], ['EGG', 60]]} />
      <Card x={1060} y={960} w={560} h={110} fill="#fffaf0" stroke="#d8262e" lines={[['LOOSE EGGS ¥20', 56, '#d8262e']]} />
      {children}
    </ShopScene>
  );
}

// R2 close-up (28b1b12e): the egg racks with our price boards.
export function EggsRack() {
  return (
    <ShopScene id="eggs-rack" trace="eggs-rack" label="Close-up: two metal racks stacked with egg packs, price boards on top.">
      <Price x={610} y={-6} w={340} h={96} label="しろ WHITE EGGS" price="¥168" />
      <Price x={1100} y={-6} w={380} h={106} label="あか BROWN EGGS" price="¥188" />
      <Card x={40} y={20} w={80} h={170} fill="#d8262e" stroke="#7a1616" lines={[['E', 34, '#fff'], ['G', 34, '#fff'], ['G', 34, '#fff']]} />
    </ShopScene>
  );
}

// R3. Tableware aisle (708a5c2b): bowls and cups on wooden shelves; the "Enjoy Tea!" card is ours.
export function AisleCups({ children }) {
  return (
    <ShopScene id="cups" trace="aisle-cups" label="Aisle 3, cups and tea bowls on wooden shelves, with a big green card that says Enjoy Tea.">
      <polygon points={pts([[1290, 580], [1520, 530], [1520, 980], [1290, 1040]])} fill="#fbfbf6" />
      <text transform="translate(1570 860) rotate(-24)" textAnchor="middle" fontSize="80" fill="#2b2a33" className="shop-sign">Enjoy Tea!</text>
      <text transform="translate(1420 700) rotate(-24)" textAnchor="middle" fontSize="54" fill="#e0467f" className="shop-sign">CUPS FOR 2?</text>
      <text transform="translate(1440 780) rotate(-24)" textAnchor="middle" fontSize="54" fill="#e0467f" className="shop-sign">FOR 3!</text>
      {children}
    </ShopScene>
  );
}

// R3 close-up (ebc36ef4): the tea bowls front-on, and three matching cups set out in a row (her pick).
export function CupsFront({ three = true }) {
  return (
    <ShopScene id="cups-front" trace="cups-front" label="Close-up: two wooden shelves of tea bowls. In front, three matching white cups with pink bands stand in a row.">
      {['¥880', '¥880', '¥880', '¥1200'].map((p, i) => <Card key={i} x={180 + i * 420} y={622} w={150} h={56} r={4} lines={[[p, 36, '#d81e2a']]} />)}
      {three && [720, 960, 1200].map((x) => <Cup key={x} x={x} y={900} s={1.4} />)}
    </ShopScene>
  );
}

// OCPD frame (a2a61ba4): the tea tins, every row straightened to one line. Her card on the blank board.
export function TeaTins() {
  return (
    <ShopScene id="tins" trace="tea-tins" label="The tea tin shelf. Every tin stands in a perfect straight row. A handwritten card says: it goes here, always here.">
      <Card x={970} y={10} w={380} h={280} fill="#fffdf4" stroke="#e0467f" lines={[['IT GOES HERE.', 50, '#2b2a55', 'shop-hand'], ['ALWAYS', 50, '#2b2a55', 'shop-hand'], ['HERE. ♡', 50, '#e0467f', 'shop-hand']]} />
      {/* the straight edge she lined every row up to */}
      <line x1="0" y1="604" x2="1920" y2="604" stroke="#e0467f" strokeWidth="6" strokeDasharray="30 14" />
      <line x1="0" y1="330" x2="1920" y2="330" stroke="#e0467f" strokeWidth="6" strokeDasharray="30 14" />
      <Price x={1238} y={800} w={250} h={160} label="おちゃ TEA" price="¥350" />
    </ShopScene>
  );
}
