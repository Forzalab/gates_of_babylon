// v2-train 1: STATION · 4:30 PM (ref 12: platform 2, departure board, seats). Dry, overcast, clouds building.
// Trace = walls, seats, plants, tracks, houses. Hand pass: the departure board ("4:30 → OR", the group's board gag),
// the big wall ad (the ref's Chinese slogan -> our own poster), straight catenary poles, the yellow tactile strip and
// the floor joints toward the vanishing point. The board hangs at y 150-290: under the HUD bar, above the dialogue box.
import { R3Scene, Pole, preloadTrace, pts } from './parts.jsx';
import { Crowd, Shafts, WavyGuy, CapGuy, scatter } from './Crowd.jsx';
import { PlatformVending } from './Vending.jsx';

preloadTrace('station-gate-r3');

const VP = [1098, 452];

function Board() {
  // hung low (ref: top edge), so the HUD bar (y < 110) never covers it; the dialogue box starts at y 773
  return (
    <g>
      {/* hanger rods */}
      <rect x="1060" y="0" width="6" height="160" fill="#46505a" /><rect x="1390" y="0" width="6" height="150" fill="#46505a" />
      <rect x="990" y="156" width="330" height="134" rx="6" fill="#56636e" />
      <rect x="998" y="164" width="314" height="118" rx="3" fill="#15202b" />
      <text x="1155" y="212" textAnchor="middle" className="r3-led" fill="#ffc861" fontSize="46">4:30 → OR</text>
      <rect x="1010" y="226" width="290" height="2" fill="#2b3a47" />
      <text x="1016" y="264" className="r3-led" fill="#8dffb0" fontSize="24">つぎ NEXT</text>
      <text x="1300" y="264" textAnchor="end" className="r3-led" fill="#c9d8ff" fontSize="24">12 stops</text>
      {/* platform number box */}
      <rect x="1318" y="150" width="126" height="140" rx="6" fill="#56636e" />
      <rect x="1326" y="158" width="110" height="124" rx="3" fill="#1c2c45" />
      <text x="1381" y="262" textAnchor="middle" className="r3-sign" fill="#fff" fontSize="104">2</text>
    </g>
  );
}

function WallAd() {
  // the ref's big wall ad, facing the viewer at a slight angle: frame + our own poster (sky, hills, a pink train)
  const frame = [[0, 0], [510, 0], [510, 570], [0, 694]];
  const art = [[0, 0], [492, 0], [492, 556], [0, 676]];
  return (
    <g>
      <polygon points={pts(frame)} fill="#6f8290" />
      <clipPath id="r3sg-ad"><polygon points={pts(art)} /></clipPath>
      <g clipPath="url(#r3sg-ad)">
        <rect width="492" height="700" fill="#d9ecf3" />
        <rect y="0" width="492" height="260" fill="#bfe0ee" />
        <ellipse cx="150" cy="120" rx="120" ry="34" fill="#f4fafc" /><ellipse cx="330" cy="80" rx="90" ry="26" fill="#f4fafc" />
        <path d="M0 470 C120 400 260 420 492 380 L492 700 L0 700Z" fill="#9fcf8f" />
        <path d="M0 540 C160 480 330 500 492 470 L492 700 L0 700Z" fill="#7bb574" />
        {/* the little pink train on the hill */}
        <rect x="220" y="430" width="170" height="44" rx="12" fill="#ff8fc0" />
        {[236, 276, 316, 352].map((x) => <rect key={x} x={x} y="440" width="26" height="16" rx="3" fill="#fff6d8" />)}
        <text x="40" y="250" className="r3-sign" fill="#2d4d6a" fontSize="58">いつも いっしょ</text>
        <text x="42" y="310" className="r3-sign" fill="#e0467f" fontSize="40">NAND LINE ♡</text>
      </g>
      <polygon points={pts(frame)} fill="none" stroke="#a9bac4" strokeWidth="6" />
    </g>
  );
}

// train-r4 crowd (refs 07-08): back layer near the vanishing point, front layer at the right edge, the two bumpers
// mid-right (they bump her in beat 4), still sun shafts, and the platform vending machine in front of the wall ad.
const BACK = scatter(41, 16, [1010, 1420], [470, 560], [80, 150]);
const FRONT = [[1760, 1120, 700], [1900, 1100, 640], [70, 1130, 660]];
const SHAFTS = ['1480,0 1600,0 1120,1080 930,1080', '1700,0 1760,0 1420,1080 1330,1080', '1260,0 1310,0 700,1080 640,1080'];

export default function StationGate({ props, rm }) {
  // yellow tactile strip + floor joints, both toward VP
  const joints = [-900, -560, -300, -80, 120, 330];
  return (
    <R3Scene id="station-gate-r3" tone="overcast" rm={rm}
      label="Station platform 2 at 4:30 PM, full of people going home: flat silhouette commuters, sun shafts, a wavy-haired guy and a guy in an orange cap, a drink vending machine, the departure board reads 4:30 to OR.">
      {/* canopy underside: one clean slate cel, slats toward VP */}
      <polygon points="780,0 1305,0 1300,140 1160,252 1004,338 986,332 800,128" fill="#43535c" />
      <g stroke="#5d6f78" strokeWidth="4">
        {[820, 900, 980, 1060, 1140, 1220, 1290].map((x) => <line key={x} x1={x} y1="0" x2={VP[0] - (VP[0] - x) * 0.18} y2={VP[1] - 150} />)}
      </g>
      <polygon points="1300,140 1160,252 1004,338 1010,344 1168,262 1310,150" fill="#aebfc6" />
      {/* the platform floor: one dry cel, lit far / grey near */}
      <defs>
        <linearGradient id="r3sg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b5dcdc" /><stop offset=".35" stopColor="#86a5a8" /><stop offset="1" stopColor="#686f70" />
        </linearGradient>
      </defs>
      <polygon points="1002,466 1140,468 1825,1080 760,1080 748,760" fill="url(#r3sg-floor)" />
      <polygon points="1060,470 1100,470 1210,1080 940,1080" fill="#e8f6f4" opacity=".12" />
      <WallAd />
      <clipPath id="r3sg-fl"><polygon points="1002,466 1140,468 1825,1080 760,1080 748,760" /></clipPath>
      <g opacity=".22" stroke="#26343f" strokeWidth="3" clipPath="url(#r3sg-fl)">
        {joints.map((dx) => <line key={dx} x1={VP[0]} y1={VP[1]} x2={VP[0] + dx * 1.6} y2="1080" />)}
        {[560, 620, 700, 800, 940].map((y) => <line key={y} x1={VP[0] - (y - VP[1]) * 1.9} y1={y} x2={VP[0] + (y - VP[1]) * 1.05} y2={y} />)}
      </g>
      <polygon points="1138,468 1148,468 1933,1080 1825,1080" fill="#f0c23a" />
      <g stroke="#c89a1c" strokeWidth="3" opacity=".7">
        {[560, 640, 720, 800, 880, 960, 1040].map((y) => <line key={y} x1={1138 + (y - 468) * 1.16} y1={y} x2={1148 + (y - 468) * 1.34} y2={y} />)}
      </g>
      <Pole x={1383} y0={150} y1={500} w={10} fill="#6d7a84" hi="#c9d3d9" />
      <Pole x={1628} y0={0} y1={548} w={18} fill="#6d7a84" hi="#c9d3d9" />
      <Crowd seed={41} back={BACK} front={[]} />
      <WavyGuy x={1310} y={760} h={330} />
      <CapGuy x={1520} y={800} h={370} />
      <Crowd seed={43} back={[]} front={FRONT} />
      <Shafts id="r4sg" bands={SHAFTS} op={0.22} />
      <PlatformVending x={322} y={404} w={190} h={362} drink={props?.drink} />
      <Board />
      {/* the far board above the platform end */}
      <rect x="1030" y="324" width="100" height="32" rx="3" fill="#15202b" />
      <text x="1080" y="348" textAnchor="middle" className="r3-led" fill="#ffc861" fontSize="18">4:30 OR</text>
    </R3Scene>
  );
}
