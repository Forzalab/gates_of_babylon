// r5-ume cel registry: id -> { Art, front }. Each Art draws in LOCAL coords around its anchor (0, 0); a beat places it
// with { id, x, y, k } (cels.jsx). front = drawn over her sprite (the BOOK plane), else over the bg, under her.
// Human hands (yours, and hers in the object close-ups) reuse the shop 5-finger Hand kit (art/shop/parts.jsx): wrist at
// (0, 0), fingers to -y; 'grip' wraps a bar at y -118. Your sleeve = the navy blazer (SP.player), in every shot.
// Her hands are her PIN LEADS: the sprite draws them (props.cut.arms); a cel only ever draws YOUR side of a touch.
import { Hand, SP } from '../shop/parts.jsx';
import { pinArmSVG } from '../nanda.js';
import { ChairBack } from './shots.jsx';

const rot2 = (x, y, deg) => { const r = (deg * Math.PI) / 180; return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]; };
// place the Hand kit so that its local point (lx, ly) lands on the anchor (0, 0)
const at = (lx, ly, rot, s) => { const [x, y] = rot2(lx * s, ly * s, rot); return [-x, -y]; };

// your blazer sleeve running on past the Hand kit's short forearm, off the frame edge (same frame as the Hand)
function Sleeve({ x, y, rot, s, len = 1600, wet = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={`M-66 470 L-76 ${len} L76 ${len} L66 470Z`} fill={SP.player} stroke={SP.playerLo} strokeWidth="4" />
      <path d={`M30 480 L36 ${len}`} stroke="#3d4870" strokeWidth="14" opacity=".6" />
      {wet && [560, 700, 860].map((yy) => <ellipse key={yy} cx={-20 + (yy % 3) * 14} cy={yy} rx="8" ry="12" fill="#cfe2ff" opacity=".7" />)}
    </g>
  );
}

// your hand from the right frame edge, holding HER pin nub: the anchor (0, 0) = the nub inside your grip
function McHandHold({ s = 0.8, rot = -62, bags = false }) {
  const [x, y] = at(0, -118, rot, s);
  return (
    <g>
      <Sleeve x={x} y={y} rot={rot} s={s} />
      {bags && <Bags x={x + 90} y={y + 40} />}
      <Hand x={x} y={y} rot={rot} s={s} pose="grip" thumb="right" sleeve={SP.player} />
    </g>
  );
}

// two NAND MART bags hanging from your wrist (their handles over it), carrots sticking out
function Bags({ x, y }) {
  const bag = (bx, by, r) => (
    <g transform={`translate(${bx} ${by}) rotate(${r})`}>
      <path d="M-40 -10 C-40 -70 40 -70 40 -10" fill="none" stroke="#9aa3ad" strokeWidth="8" />
      <path d="M-18 40 L-40 -60 M-6 36 L-14 -70" stroke="#ff8a2a" strokeWidth="12" strokeLinecap="round" />
      <path d="M-24 -48 l-10 -26 M-12 -58 l-4 -26" stroke="#3f9a3a" strokeWidth="8" strokeLinecap="round" />
      <path d="M-66 -12 L66 -12 L78 150 Q0 170 -78 150Z" fill="#f4f6fb" stroke="#8a93a0" strokeWidth="5" strokeLinejoin="round" />
      <text x="0" y="60" textAnchor="middle" fontFamily="Nunito Variable, Nunito, sans-serif" fontWeight="900" fontSize="30" fill="#d8262e">NAND</text>
      <text x="0" y="94" textAnchor="middle" fontFamily="Nunito Variable, Nunito, sans-serif" fontWeight="900" fontSize="30" fill="#d8262e">MART</text>
    </g>
  );
  return <g>{bag(x - 40, y + 70, 6)}{bag(x + 70, y + 90, -4)}</g>;
}

// your sleeve she pinches: your forearm comes in from the right edge, the hand hanging; anchor = the pinched cloth
function McSleeveTug({ s = 0.78, rot = -76, wet = false }) {
  const [x, y] = at(0, 150, rot, s);
  return (
    <g>
      <Sleeve x={x} y={y} rot={rot} s={s} wet={wet} />
      <Hand x={x} y={y} rot={rot} s={s} pose="flat" thumb="left" sleeve={SP.player} />
      {/* the cloth bunches where she pinches it */}
      <path d="M-26 -22 q14 12 0 26 M4 -28 q14 14 0 30" stroke={SP.playerLo} strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

// your arm from the LEFT edge, bent at the elbow (walking beside her); anchor = where her pin arm hooks round it
function McArmHook({ s = 0.8 }) {
  const rot = 96, [x, y] = at(0, 240, rot, s);
  return (
    <g>
      <Sleeve x={x} y={y} rot={rot} s={s} />
      <Hand x={x} y={y} rot={rot} s={s} pose="flat" thumb="left" sleeve={SP.player} />
    </g>
  );
}

// a comic impact star with a lettered sound (the bump, the hit); anchor = its centre
function Impact({ text = 'ドン', r = 70, fill = '#fffbe8', ink = '#c8102e' }) {
  const pts = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.55 : r; return `${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
  return (
    <g>
      <polygon points={pts} fill={fill} stroke={ink} strokeWidth="6" strokeLinejoin="round" />
      <text x="0" y={r * 0.2} textAnchor="middle" fontFamily="M PLUS Rounded 1c, sans-serif" fontWeight="900" fontSize={r * 0.62} fill={ink}>{text}</text>
    </g>
  );
}

// the rooftop before the rain (AUDIT 012): a grey cloud bank sliding over the noon sky from the right
function CloudBank() {
  const puff = (x, y, r, c) => <circle cx={x} cy={y} r={r} fill={c} />;
  const row = [[980, 150, 90], [1080, 120, 110], [1210, 140, 120], [1350, 110, 130], [1500, 150, 120], [1640, 120, 140], [1800, 150, 130], [1920, 130, 120], [1140, 220, 90], [1300, 230, 100], [1470, 240, 110], [1650, 250, 110], [1840, 250, 120]];
  return (
    <g opacity=".9">
      <rect width="1920" height="430" fill="#5c6678" opacity=".16" />
      {row.map(([x, y, r], i) => puff(x, y + 14, r, '#6f7a8c'))}
      {row.map(([x, y, r], i) => puff(x, y, r * 0.94, '#9aa4b4'))}
      {row.map(([x, y, r], i) => puff(x - r * 0.25, y - r * 0.3, r * 0.5, '#c8cfda'))}
    </g>
  );
}

// her street at 6 PM (AUDIT 072): the low sun from the left throws LONG shadows right across the wet road
function LongShadows() {
  const q = (pts) => pts.map((p) => p.join(',')).join(' ');
  return (
    <g fill="#2a1c3a" opacity=".24">
      <polygon points={q([[250, 620], [290, 620], [1300, 700], [1300, 740]])} />
      <polygon points={q([[120, 900], [180, 900], [1500, 980], [1500, 1040]])} />
      <polygon points={q([[560, 560], [580, 560], [1150, 610], [1150, 630]])} />
      {/* her own shadow, from her shoes, long toward the right */}
      <polygon points={q([[920, 744], [1000, 744], [1560, 700], [1520, 684]])} opacity=".9" />
    </g>
  );
}

// your back in the middle chair (AUDIT 083): seen from behind, head + blazer shoulders, the chair back over your waist;
// her pin arm (from her lower input pin, the sprite at dx 430 behind the table) rests its nub on your back
const HER_L2 = [1202, 690]; // her L2 pin in stage px at cut.dx 430, floor 854 (sitting-room)
function McBackSeated() {
  const U = 2 * 1.4375; // gate units -> stage px in the medium shot
  const to = [1030, 640];
  const arm = pinArmSVG({ from: [0, 0], to: [(to[0] - HER_L2[0]) / U, (to[1] - HER_L2[1]) / U], c1: [-30, -26], c2: [-54, -20], w: [3, 3.2], r: 6.5, fingers: [200, 250] });
  return (
    <g>
      {/* shoulders + blazer back */}
      <path d="M560 1080 C560 820 640 660 900 640 C1160 660 1240 820 1240 1080Z" fill={SP.player} stroke={SP.playerLo} strokeWidth="6" />
      <path d="M900 660 L900 1080" stroke={SP.playerLo} strokeWidth="5" opacity=".7" />
      <path d="M1100 700 C1180 760 1210 860 1216 1000" stroke="#3d4870" strokeWidth="18" fill="none" opacity=".6" strokeLinecap="round" />
      {/* white shirt collar + neck + dark hair */}
      <path d="M840 648 L900 690 L960 648 L940 630 L860 630Z" fill="#f4f1ea" stroke="#9a948a" strokeWidth="4" />
      <rect x="862" y="560" width="76" height="80" rx="20" fill="#e8b39b" />
      <path d="M770 520 C770 380 1030 380 1030 520 C1030 600 990 610 900 606 C810 610 770 600 770 520Z" fill="#241c28" stroke="#0e0a12" strokeWidth="6" />
      <path d="M800 470 C830 420 900 410 960 430" stroke="#4a3e52" strokeWidth="12" fill="none" strokeLinecap="round" />
      <ChairBack x={900} y={760} s={1.25} />
      <g transform={`translate(${HER_L2[0]} ${HER_L2[1]}) scale(${U})`} dangerouslySetInnerHTML={{ __html: arm }} />
    </g>
  );
}

// your knee touching hers under the booth table (AUDIT 047): your navy trouser knee from the lower left + a small touch mark
function McKnee() {
  return (
    <g>
      <path d="M-420 260 C-360 120 -200 40 -60 30 C20 26 40 60 30 100 C10 170 -160 230 -300 330Z" fill={SP.player} stroke={SP.playerLo} strokeWidth="6" />
      <path d="M-180 70 C-120 50 -60 44 -10 50" stroke="#3d4870" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".7" />
      <text x="-250" y="-10" fontFamily="M PLUS Rounded 1c, sans-serif" fontWeight="900" fontSize="46" fill="#fff" stroke="#b0103e" strokeWidth="9" paintOrder="stroke">ぴと</text>
      <path d="M52 20 C46 8 30 12 36 26 L52 42 L68 26 C74 12 58 8 52 20Z" fill="#ff5fa2" stroke="#b0103e" strokeWidth="3" />
    </g>
  );
}

// your feet in navy socks on the genkan floor, the right one already in the pink slipper she brought (AUDIT 080)
function McFeet() {
  const leg = (x, slip) => (
    <g>
      <path d={`M${x - 60} -560 L${x + 60} -560 L${x + 56} -40 L${x - 56} -40Z`} fill={SP.player} stroke={SP.playerLo} strokeWidth="5" />
      <path d={`M${x - 58} -80 L${x + 58} -80`} stroke={SP.playerLo} strokeWidth="10" />
      <path d={`M${x - 50} -44 C${x - 60} -10 ${x - 40} 22 ${x} 24 C${x + 50} 24 ${x + 70} 0 ${x + 58} -44Z`} fill="#1f2436" stroke="#0e1018" strokeWidth="4" />
      {slip && <path d={`M${x - 72} -6 C${x - 80} 30 ${x + 80} 34 ${x + 76} -8 C${x + 60} -24 ${x - 60} -24 ${x - 72} -6Z`} fill="#f6c6d8" stroke="#d1177f" strokeWidth="5" />}
      {slip && <path d={`M${x - 54} -18 C${x - 20} -40 ${x + 30} -40 ${x + 56} -18`} fill="none" stroke="#ff8fc0" strokeWidth="12" strokeLinecap="round" />}
    </g>
  );
  return (
    <g>
      <ellipse cx="0" cy="30" rx="210" ry="26" fill="#0d0806" opacity=".35" />
      {leg(-90, false)}{leg(90, true)}
    </g>
  );
}

export const CEL = {
  'mc-hand-hold': { Art: McHandHold, front: true },
  'mc-hand-bags': { Art: (p) => <McHandHold {...p} bags />, front: true },
  'mc-sleeve-tug': { Art: McSleeveTug, front: false },
  'mc-arm-hook': { Art: McArmHook, front: false },
  impact: { Art: Impact, front: true },
  'cloud-bank': { Art: CloudBank, front: false },
  'long-shadows': { Art: LongShadows, front: false },
  'chair-mid': { Art: () => <ChairBack x={960} y={690} s={1.2} />, front: true },
  'mc-back-seated': { Art: McBackSeated, front: true },
  'mc-knee': { Art: McKnee, front: true },
  'mc-feet': { Art: McFeet, front: true },
};
