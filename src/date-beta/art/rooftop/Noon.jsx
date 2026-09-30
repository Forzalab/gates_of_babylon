// School rooftop, 12:00 noon (ref 05; ref 06 = its meme labels: stairwell box + antenna, a fence so the kids don't
// fall, boring pale tiles). Trace = sky, clouds, floor wash, far city mush. Hand overlay = everything with an edge.
// Light from the upper right: box front lit cream, left faces in blue shade. The Figur tower stands on the skyline
// left of centre, above Nanda's head line (her medium shot tops out around y 560).
import { RoofSvg, FigurTower, TileJoints, Vignette, preloadTrace } from './parts.jsx';
import { Mid, RooftopFront } from '../sandwichFronts.jsx';

preloadTrace('rooftop-noon');

const STEEL = '#7d93a3', STEEL_HI = '#c6d6de', GLASS = '#e8f8fc';
// left fence: post x, rail top y, base y, width (perspective: nearer = taller + thicker)
const LEFT = [[0, 298, 742, 18], [160, 354, 718, 14], [297, 405, 702, 12], [383, 436, 694, 10], [455, 463, 690, 9], [503, 481, 688, 8], [545, 497, 686, 8]];
const BACK = [668, 808, 935, 1073, 1210];

function Skyline() {
  // flat far blocks in haze blue, sitting on the horizon behind the glass (the trace's city is mush)
  const b = [[560, 640, 30], [700, 630, 50], [790, 606, 40], [836, 626, 64], [912, 600, 34], [952, 616, 70], [1030, 604, 44], [1080, 628, 60], [1150, 610, 52]];
  return (
    <g aria-hidden="true">
      {b.map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={686 - y} fill={i % 2 ? '#b7d3de' : '#a9c8d5'} />)}
      {b.map(([x, y, w], i) => <rect key={`w${i}`} x={x + 6} y={y + 10} width={w - 12} height="3" fill="#d8ecf2" opacity=".8" />)}
      <rect x="0" y="664" width="560" height="30" fill="#b3cfda" opacity=".7" />
    </g>
  );
}

function Fence() {
  const railL = LEFT.map(([x, y]) => `${x},${y}`).join(' ');
  const baseL = LEFT.map(([x, , b]) => `${x},${b}`).reverse().join(' ');
  return (
    <g aria-hidden="true">
      {/* glass: a pale sheet, then two diagonal glints per run (the anime "this is glass" tell) */}
      <polygon points={`${railL} ${baseL}`} fill={GLASS} opacity=".26" />
      <rect x="545" y="504" width="690" height="182" fill={GLASS} opacity=".26" />
      <g fill="#fff" opacity=".32">
        <polygon points="60,420 110,430 40,720 -10,724" /><polygon points="130,444 150,448 90,712 70,714" />
        <polygon points="700,508 760,508 720,684 660,684" /><polygon points="780,508 796,508 756,684 740,684" />
        <polygon points="1100,508 1150,508 1110,684 1060,684" />
      </g>
      {/* posts: steel, lit edge on the right */}
      {LEFT.map(([x, y, b, w]) => (
        <g key={x}><rect x={x - w / 2} y={y} width={w} height={b - y} fill={STEEL} /><rect x={x + w / 2 - 3} y={y} width="3" height={b - y} fill={STEEL_HI} /></g>
      ))}
      {BACK.map((x) => <g key={x}><rect x={x - 5} y="504" width="10" height="182" fill={STEEL} /><rect x={x + 2} y="504" width="3" height="182" fill={STEEL_HI} /></g>)}
      {/* top rails + bottom frame */}
      <polyline points={`${railL} 1240,500`} fill="none" stroke={STEEL} strokeWidth="11" strokeLinejoin="round" />
      <polyline points={`${railL} 1240,500`} fill="none" stroke={STEEL_HI} strokeWidth="3" transform="translate(0 -4)" />
      <polyline points={`0,742 545,686 1240,686`} fill="none" stroke={STEEL} strokeWidth="8" />
      {/* the right run, behind the stairwell box */}
      <polygon points="1768,430 1920,398 1920,724 1784,720" fill={GLASS} opacity=".24" />
      <line x1="1768" y1="430" x2="1920" y2="396" stroke={STEEL} strokeWidth="10" />
      <rect x="1871" y="404" width="11" height="318" fill={STEEL} />
    </g>
  );
}

function Parapet() {
  // the low concrete wall the fence stands on: a lit cap and a shaded inner face
  return (
    <g aria-hidden="true">
      <polygon points="0,742 560,688 560,712 0,866" fill="#4d6474" />
      <polygon points="0,742 560,688 560,696 0,756" fill="#c9cdbd" />
      <rect x="560" y="686" width="690" height="14" fill="#c9cdbd" />
      <rect x="560" y="700" width="690" height="8" fill="#8f978c" />
    </g>
  );
}

function StairBox() {
  // the stairwell entrance ("with some antenna on top"), redrawn crisp from the trace's 8x ref crop
  return (
    <g aria-hidden="true">
      {/* antenna: pole + a two-boom yagi */}
      <line x1="1288" y1="486" x2="1288" y2="236" stroke="#51646f" strokeWidth="5" />
      {[[250, 74], [290, 54]].map(([y, w]) => (
        <g key={y} stroke="#51646f" strokeLinecap="round">
          <line x1={1288 - w} y1={y} x2={1288 + w} y2={y} strokeWidth="5" />
          {Array.from({ length: 7 }, (_, i) => { const x = 1288 - w + (i * w) / 3; return <line key={i} x1={x} y1={y - 11} x2={x} y2={y + 11} strokeWidth="2.5" />; })}
        </g>
      ))}
      <line x1="1288" y1="262" x2="1222" y2="506" stroke="#51646f" strokeWidth="2" opacity=".6" />
      {/* roof tank + small cylinder */}
      <rect x="1404" y="376" width="100" height="70" fill="#8d9ba0" />
      <ellipse cx="1454" cy="376" rx="50" ry="12" fill="#c5ccc6" />
      <polygon points="1496,306 1590,296 1590,436 1496,440" fill="#6f7f86" />
      <rect x="1590" y="296" width="164" height="140" fill="#b8c0bb" />
      {[1632, 1674, 1714].map((x) => <line key={x} x1={x} y1="300" x2={x} y2="434" stroke="#8d9895" strokeWidth="4" />)}
      <rect x="1590" y="296" width="164" height="6" fill="#e4e7dc" />
      {/* roof slab: shaded left run, lit cream front, dark soffit */}
      <polygon points="1216,512 1462,436 1462,528 1216,558" fill="#48667f" />
      <rect x="1460" y="434" width="404" height="80" fill="#d9dac4" />
      <rect x="1460" y="434" width="404" height="7" fill="#f2f2e2" />
      <rect x="1460" y="514" width="392" height="26" fill="#7d8b8c" />
      {/* body: left face in shade with the door, lit front with the window */}
      <polygon points="1246,556 1470,530 1470,798 1246,742" fill="#5a7c98" />
      <polygon points="1290,556 1352,549 1352,760 1290,746" fill="#2f4a64" />
      <polygon points="1296,562 1346,556 1346,752 1296,740" fill="#3d5d7a" />
      <rect x="1470" y="540" width="382" height="258" fill="#e4e4d6" />
      <rect x="1470" y="740" width="382" height="58" fill="#d2d3c2" />
      <rect x="1470" y="540" width="14" height="258" fill="#c4c7b8" />
      <rect x="1744" y="516" width="40" height="280" fill="#9aa5a2" />
      <rect x="1596" y="556" width="120" height="124" fill="#8e9a98" />
      <rect x="1604" y="564" width="104" height="108" fill="#3e5a74" />
      <polygon points="1604,564 1650,564 1604,640" fill="#6f95b3" opacity=".7" />
      <line x1="1656" y1="564" x2="1656" y2="672" stroke="#8e9a98" strokeWidth="5" />
      {/* brace pipe + ground contact */}
      <line x1="1790" y1="790" x2="1836" y2="560" stroke="#8b9690" strokeWidth="7" strokeLinecap="round" />
      <line x1="1794" y1="788" x2="1839" y2="562" stroke="#c9d0c8" strokeWidth="2" />
      <polygon points="1246,742 1470,798 1866,798 1866,806 1470,806 1246,750" fill="#4e6070" opacity=".6" />
    </g>
  );
}

export default function RooftopNoon({ props = {} }) {
  const [h, m] = props.tower ?? [12, 0];
  return (
    <RoofSvg id="rooftop-noon" label="A school rooftop at noon: glass fence, pale tiles, the stairwell box with an antenna. Far off, a pink clock tower reads twelve.">
      <Mid id="rooftop-noon" blur={3} op={0.5} tint="#e4f1f8" wash={0.06} />
      <FigurTower x={630} y={522} s={0.22} h={h} m={m} haze={0.66} />
      <Skyline />
      <RooftopFront />
      <Fence />
      <Parapet />
      <TileJoints id="rn" vp={[900, 625]} y0={712} step={60}
        clip="0,866 560,712 1250,708 1250,742 1420,800 1920,806 1920,1080 0,1080" ink="#6f7466" op={0.32} />
      <StairBox />
      <Vignette id="rn" color="#1d3448" op={0.28} />
    </RoofSvg>
  );
}
