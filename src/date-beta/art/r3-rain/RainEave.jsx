// rain-eave (v2-rain 3, "She looks up at you. Then down."): refs 06 + 07. The middle is ref 07's shop front (portrait),
// the wings are ref 06's lane (the blue banner left, the diamond boards right), colour-matched in prep. They shelter
// under an eave: our own eave edge runs across the top of the frame, dripping. Every sign is redrawn in our words:
// 雨やどり (shelter from the rain), うどん / そば, 毎日, 茶, だんご, all clear of the HUD (y < 110), the dialogue box and Nanda. G2's hidden logic gag: the shop is 「あんどん」,
// the red paper lantern on the left (an andon) says AND-ON.
import { R3Scene, Win, WetBand, Puddle, Plate, preloadTrace } from './parts.jsx';

preloadTrace('rain-eave');
const T = 'rain-dusk';
const JP = 'var(--jp, sans-serif)', EN = 'var(--cond, sans-serif)';

function Banner() {
  // the big blue noren on the left: 雨 + やどり, white, hand-lettered feel = plain bold
  return (
    <g>
      <path d="M96 330 L452 348 L470 1080 L110 1080Z" fill="#2c3f6a" />
      <path d="M96 330 L452 348 L456 380 L98 364Z" fill="#22335a" />
      {[180, 280, 380].map((x) => <path key={x} d={`M${x} 350 L${x + 8} 1080`} stroke="#253760" strokeWidth="4" />)}
      <g fill="#f4f7fc">
        <text x="222" y="610" textAnchor="middle" fontFamily={JP} fontWeight="800" fontSize="176">雨</text>
        <text x="392" y="560" textAnchor="middle" writingMode="tb" fontFamily={JP} fontWeight="700" fontSize="62">やどり</text>
      </g>
      <text x="270" y="420" textAnchor="middle" fontFamily={EN} fontWeight="800" fontSize="36" letterSpacing=".08em" fill="#f4f7fc">REST HERE</text>
    </g>
  );
}

function ShopSigns() {
  return (
    <g>
      {/* top-left board + red verticals */}
      <Plate x={196} y={140} w={210} h={124} bg="#3b3226" fg="#f0e2b4" jp="茶" en="TEA" jpSize={62} enSize={26} />
      <Plate x={432} y={150} w={66} h={220} bg="#9e2632" fg="#fff2ea" jp="うどん" vertical jpSize={46} />
      <Plate x={692} y={330} w={58} h={170} bg="#9e2632" fg="#fff2ea" jp="そば" vertical jpSize={44} />
      <Plate x={758} y={330} w={38} h={96} bg="#efe9dc" fg="#2c2530" jp="毎日" vertical jpSize={30} />
      {/* red lantern (left) */}
      <ellipse cx="490" cy="455" rx="46" ry="56" fill="#a8222e" />
      <path d="M454 414 Q490 404 526 414 M454 498 Q490 508 526 498" stroke="#6e1520" strokeWidth="3" fill="none" />
      <g fontFamily={EN} fontWeight="800" fill="#fff4e8" stroke="#5a0f18" strokeWidth="3" paintOrder="stroke" textAnchor="middle">
        <text x="490" y="456" fontSize="30">AND</text>
        <text x="490" y="486" fontSize="26">-ON</text>
      </g>
      {/* the lantern over the door */}
      <ellipse cx="866" cy="466" rx="34" ry="40" fill="#b8262f" />
      <rect x="834" y="430" width="64" height="8" fill="#2b2228" /><rect x="834" y="496" width="64" height="8" fill="#2b2228" />
      <text x="866" y="480" textAnchor="middle" fontFamily={JP} fontWeight="800" fontSize="36" fill="#fff4e8">茶</text>
      {/* main sign board: あんどん, on the eave fascia, above Nanda's head (she stands at y 560+ on this beat) */}
      <rect x="930" y="432" width="248" height="70" rx="4" fill="#3a2a1e" stroke="#6b5234" strokeWidth="5" />
      <text x="1054" y="482" textAnchor="middle" fontFamily={JP} fontWeight="800" fontSize="42" fill="#f0d27a">あんどん</text>
      {/* the blue noren behind Nanda: a white wave crest per panel, no text (she stands in front of it) */}
      <rect x="872" y="624" width="470" height="78" fill="#26407a" />
      {[1030, 1186].map((x) => <rect key={x} x={x} y="624" width="6" height="78" fill="#1a2c56" />)}
      {[951, 1107, 1263].map((x) => <path key={x} d={`M${x - 40} 676 q20 -26 40 0 q20 -26 40 0`} stroke="#eef2fa" strokeWidth="6" fill="none" />)}
      {/* the red parasol stays; the diamonds: だ / ん / ご on white discs */}
      {[[1690, 196, 'だ'], [1706, 428, 'ん'], [1722, 664, 'ご']].map(([x, y, c]) => (
        <g key={c}>
          <polygon points={`${x},${y - 112} ${x + 128},${y} ${x},${y + 112} ${x - 128},${y}`} fill="#b07a4a" stroke="#6e4a2a" strokeWidth="8" />
          <circle cx={x} cy={y} r="58" fill="#f1ede4" />
          <text x={x} y={y + 22} textAnchor="middle" fontFamily={JP} fontWeight="800" fontSize="64" fill="#2c2530">{c}</text>
        </g>
      ))}
      {/* the big red lantern top-right */}
      <ellipse cx="1500" cy="236" rx="70" ry="88" fill="#b8262f" />
      <path d="M1440 172 Q1500 160 1560 172 M1440 300 Q1500 312 1560 300" stroke="#7e1822" strokeWidth="4" fill="none" />
      <text x="1500" y="260" textAnchor="middle" fontFamily={JP} fontWeight="800" fontSize="66" fill="#fff2ea">茶</text>
    </g>
  );
}

function Posts() {
  // straightened verticals: the shop's corner posts + the right-hand gate post
  return (
    <g>
      <rect x="788" y="112" width="20" height="850" fill="#2a2320" />
      <rect x="1300" y="112" width="18" height="850" fill="#2a2320" />
      <rect x="1484" y="300" width="36" height="700" fill="#3a2e26" /><rect x="1508" y="300" width="12" height="700" fill="#2a211c" />
    </g>
  );
}

// ref 07's shop front, merged into clean cel regions (the trace is mush there): upper floor + blinds + balcony,
// the tiled eave with its plants, the lit counter, five red stools, the stone step
function ShopFront() {
  return (
    <g>
      <rect x="800" y="104" width="506" height="330" fill="#342a24" />
      <rect x="760" y="96" width="590" height="22" fill="#2a2320" />
      <rect x="812" y="300" width="486" height="110" fill="#2e241f" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={818 + i * 20} y="304" width="7" height="100" fill="#4d3d33" />)}
      <rect x="806" y="296" width="498" height="10" fill="#57463a" />
      <polygon points="728,426 1336,426 1310,500 752,500" fill="#2e3834" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={742 + i * 20} y="430" width="3" height="66" fill="#222b27" />)}
      <rect x="740" y="494" width="584" height="14" fill="#1f1a18" />
      <path d="M736 430 q30 -34 70 -8 q30 -30 66 -2 q26 -22 60 2 q40 -26 80 0 q30 -20 64 4 q40 -26 76 0 q30 -18 64 2 q34 -24 70 4 q20 -10 50 0" fill="#35523f" />
      <rect x="806" y="700" width="498" height="250" fill="#3a2d25" />
      <rect x="806" y="700" width="498" height="110" fill="#e0a860" opacity=".22" />
      <rect x="806" y="800" width="498" height="18" fill="#3d2c21" />
      {[906, 1016, 1114, 1206, 1292].map((x) => (
        <g key={x}>
          <rect x={x - 32} y="812" width="64" height="20" rx="8" fill="#b52d3a" />
          <rect x={x - 26} y="830" width="6" height="140" fill="#2a1f1c" /><rect x={x + 20} y="830" width="6" height="140" fill="#2a1f1c" />
          <rect x={x - 24} y="900" width="48" height="5" fill="#2a1f1c" />
        </g>
      ))}
      <rect x="770" y="960" width="570" height="24" fill="#5d6468" />
    </g>
  );
}

// the eave they stand under: roof-tile edge across the top of the frame, drops hanging off it
function Eave() {
  return (
    <g>
      <rect x="0" y="0" width="1920" height="30" fill="#1d1a1c" />
      <rect x="0" y="26" width="1920" height="14" fill="#2c2628" />
      {Array.from({ length: 33 }, (_, i) => <path key={i} d={`M${i * 60} 40 q30 14 60 0`} fill="#2c2628" />)}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 40 + i * 122 + (i % 3) * 14, l = 26 + (i % 4) * 16;
        return <g key={i}><rect x={x - 2} y="50" width="4" height={l} rx="2" fill="#cfdcf2" opacity=".7" /><ellipse cx={x} cy={54 + l} rx="5" ry="8" fill="#cfdcf2" opacity=".8" /></g>;
      })}
    </g>
  );
}

export default function RainEave({ rm }) {
  return (
    <R3Scene id="rain-eave" tod={T} rm={rm} rain={{ n: 170, slant: 0.04, hole: [90, 320, 390, 760] }} top={<Eave />}
      label="Sheltering under an eave in the rain: across the lane an old noodle shop, red lanterns, a blue noren, red stools; a big blue banner reads 雨やどり.">
      <ShopFront />
      <Posts />
      <Banner />
      <ShopSigns />
      {/* the bamboo blinds, lit from inside: flat warm + slats */}
      <Win x={816} y={150} w={200} h={130} tod={T} o={0.4} />
      <Win x={1090} y={150} w={200} h={130} tod={T} o={0.4} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M816 ${156 + i * 10}h200M1090 ${156 + i * 10}h200`} stroke="#b88a3e" strokeWidth="2" opacity=".6" />)}
      <WetBand x={868} y={960} w={50} h={120} c="#e0505a" o={0.5} />
      <WetBand x={1526} y={940} w={70} h={140} c="#e0505a" o={0.4} />
      <WetBand x={1060} y={960} w={180} h={120} c="#ffd27a" o={0.3} />
      <Puddle x={640} y={1030} rx={200} ry={28} c="#141a28" rim="#9fb0cc" sky="#6c8098" />
      <Puddle x={1320} y={1048} rx={160} ry={20} c="#141a28" rim="#9fb0cc" />
    </R3Scene>
  );
}
