// CURRY street (the choice) + the BUTTER-CHICKEN chain: NAND HOUSE, a Nepali-run Indian shop in Japan.
// Refs + order: research/sprint-0930/curry/SHOTLIST.md. Every sign is ours; people and watermarks are gone (prep.py).
import { CurryScene, Plate, Steam, Clock, Bell, YourHand, usePose, preloadTrace } from './parts.jsx';

['choice', 'butter-door', 'butter-int', 'butter-table', 'thali', 'naan-lift', 'sauce', 'naan-dip', 'naan-feed', 'lassi']
  .forEach((k) => preloadTrace(`curry/${k}`));

// 2:55 PM street: NAND HOUSE (left, 37f7e6cf) | OR OR CURRY (right, da264766). The pole hides the seam, its clock says 2:55.
export function CurryChoice() {
  return (
    <CurryScene id="choice" label="A street at 2:55 in the afternoon with two curry shops side by side: NAND HOUSE, an Indian shop with a turban chef sign, on the left; OR OR CURRY, a yellow katsu curry shop, on the right. A clock on the pole between them.">
      {/* left: the NAND HOUSE sign where インデアン was */}
      <g>
        <text className="cu-sign" x="420" y="600" textAnchor="middle" fontSize="118" fill="#c8202e" stroke="#7a1018" strokeWidth="4" letterSpacing=".05em">NAND</text>
        <text className="cu-sign" x="420" y="690" textAnchor="middle" fontSize="70" fill="#c8202e">HOUSE</text>
        <text className="cu-jp" x="420" y="742" textAnchor="middle" fontSize="36" fill="#5a3a2a">インド カレー・ナン</text>
      </g>
      {/* right: our sign over the gorilla shop's name + its promo strip */}
      <g>
        <rect x="1110" y="378" width="650" height="132" rx="10" fill="#f6d014" stroke="#c8202e" strokeWidth="8" />
        <text className="cu-jp" x="1435" y="470" textAnchor="middle" fontSize="84" fill="#c8202e" stroke="#6a1010" strokeWidth="3">OR OR カレー</text>
        <rect x="1110" y="528" width="650" height="84" rx="6" fill="#c8202e" />
        <text className="cu-jp" x="1435" y="585" textAnchor="middle" fontSize="44" fill="#fff4d0">カツカレー · KATSU CURRY</text>
      </g>
      {/* the doorway: a glass door, people-free */}
      <g>
        <rect x="1210" y="736" width="376" height="344" fill="#7a5a3c" />
        <rect x="1232" y="758" width="154" height="322" fill="#e8d7a8" opacity=".75" />
        <rect x="1410" y="758" width="154" height="322" fill="#e8d7a8" opacity=".75" />
        <rect x="1370" y="880" width="10" height="60" rx="4" fill="#3a2e2c" />
        <rect x="1416" y="880" width="10" height="60" rx="4" fill="#3a2e2c" />
      </g>
      <Plate x={1612} y={740} w={80} h={300} bg="#c8202e" fg="#fff4d0" jp="カツカレー" vertical jpSize={50} />
      {/* the seam pole + its clock at 2:55 */}
      <rect x="936" y="0" width="48" height="1080" fill="#d8d2c8" />
      <rect x="966" y="0" width="18" height="1080" fill="#b9b1a4" />
      <rect x="952" y="236" width="16" height="30" fill="#5a4a44" />
      <Clock cx={960} cy={320} r={56} h={2} m={55} />
    </CurryScene>
  );
}

// the door + bell: the pink awning, the glass door, a brass bell on the frame
export function CurryButterDoor() {
  return (
    <CurryScene id="butter-door" label="Insert: the glass door of NAND HOUSE under its pink awning, a brass bell hanging on the frame.">
      <rect x="930" y="0" width="560" height="74" rx="8" fill="#fbf7ef" />
      <text className="cu-sign" x="1210" y="58" textAnchor="middle" fontSize="60" fill="#c8202e">NAND HOUSE</text>
      <Bell x={520} y={420} s={1.6} />
      <Plate x={1340} y={560} w={230} h={120} bg="#c8202e" fg="#fff4ea" jp="営業中" en="OPEN" jpSize={50} enSize={30} />
    </CurryScene>
  );
}

// the wide interior: orange tables, lanterns, a TV playing a dance video (two static poses, swapped)
function DanceTv({ rm }) {
  const pose = usePose(rm);
  const dancer = (arm) => (
    <g fill="#ffcf4a">
      <circle cx="0" cy="-54" r="16" />
      <path d="M-14 -36h28l14 70h-56z" fill="#e0306a" />
      <path d={arm ? 'M-12 -30l-40 -30M12 -30l40 -30' : 'M-12 -30l-44 10M12 -30l30 -44'} stroke="#ffcf4a" strokeWidth="9" strokeLinecap="round" />
      <path d="M-10 34l-12 36M10 34l14 36" stroke="#ffcf4a" strokeWidth="9" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <rect x="306" y="300" width="300" height="190" rx="10" fill="#1d1b22" />
      <rect x="320" y="314" width="272" height="150" fill="#6a2a7a" />
      <rect x="320" y="420" width="272" height="44" fill="#e08a2a" />
      <g transform="translate(456 402)">
        <g visibility={pose === 0 ? 'visible' : 'hidden'}>{dancer(true)}</g>
        {!rm && <g visibility={pose === 1 ? 'visible' : 'hidden'}>{dancer(false)}</g>}
      </g>
      <rect x="446" y="490" width="20" height="30" fill="#1d1b22" />
    </g>
  );
}
export function CurryButterInt({ rm }) {
  return (
    <CurryScene id="butter-int" label="Inside NAND HOUSE at 3:00: orange tablecloths, hanging lanterns, bright windows, and a TV on the wall playing a dance video.">
      {/* the poster panel: a dancer silhouette + ナマステ */}
      <rect x="70" y="258" width="150" height="322" fill="#7a2a4a" />
      <circle cx="145" cy="340" r="28" fill="#f6c14a" />
      <path d="M145 370l-40 120h80z" fill="#f6c14a" />
      <text className="cu-jp" x="145" y="548" textAnchor="middle" fontSize="30" fill="#fff4d0">ナマステ</text>
      <DanceTv rm={rm} />
    </CurryScene>
  );
}

// two seats by the window: the same orange cloth as the room, a cruet stand
export function CurryButterTable() {
  return (
    <CurryScene id="butter-table" label="A small table for two by the window in NAND HOUSE, an orange tablecloth, a cruet stand.">
      <path d="M740 640L1920 470V1080H960z" fill="#d6603a" />
      <path d="M740 640L1920 470V496L770 668z" fill="#e8844e" />
      <path d="M740 640L960 1080H920L720 660z" fill="#a8452a" />
      <g transform="translate(1560 450)">
        <rect x="-60" y="60" width="120" height="16" rx="6" fill="#8a6a4a" />
        <rect x="-44" y="-10" width="26" height="72" rx="8" fill="#c23a1a" />
        <rect x="-10" y="0" width="26" height="62" rx="8" fill="#e8d8b8" />
        <rect x="24" y="10" width="22" height="52" rx="8" fill="#5a3a1a" />
      </g>
    </CurryScene>
  );
}

// HERO DISH (b6b74858): the steel thali. Butter sheen on the curry, static steam.
export function CurryThali({ rm }) {
  return (
    <CurryScene id="thali" label="The lunch set on a steel tray: butter chicken, green saag, rice, an orange-dressing salad, and one giant naan hanging off the edge. Steam rises.">
      <ellipse cx="1110" cy="250" rx="70" ry="22" fill="#fff4d8" opacity=".55" />
      <path d="M1060 240c20-18 60-18 80 0" stroke="#fffaf0" strokeWidth="8" fill="none" opacity=".7" strokeLinecap="round" />
      <Steam x={1110} y={170} rm={rm} />
      <Steam x={720} y={160} h={180} rm={rm} o={0.4} />
    </CurryScene>
  );
}

// her hand (from the right) tears the naan into the curry (acc8479f)
export function CurryNaanLift({ rm }) {
  return (
    <CurryScene id="naan-lift" label="Close-up: her fingers tear a piece of naan and dip it in the butter chicken.">
      <Steam x={760} y={300} h={200} rm={rm} o={0.4} />
    </CurryScene>
  );
}

// the gravy boat pours: the glossy sauce (59cee883)
export function CurrySauce({ rm }) {
  return (
    <CurryScene id="sauce" label="Close-up: more butter sauce pours from a small silver boat. It is thick, orange and shiny.">
      <path d="M340 470c60-40 200-50 300-10" stroke="#fff3d8" strokeWidth="10" fill="none" opacity=".6" strokeLinecap="round" />
      <Steam x={520} y={330} h={200} rm={rm} o={0.4} />
    </CurryScene>
  );
}

// extreme close-up: the naan dips, the sauce strings off it (c8b36373)
export function CurryNaanDip({ rm }) {
  return (
    <CurryScene id="naan-dip" label="Extreme close-up: a piece of naan dips into the copper bowl of curry. The sauce drips, glossy.">
      <Steam x={1320} y={500} h={220} rm={rm} o={0.35} />
    </CurryScene>
  );
}

// POV: YOUR hand (bottom-left) holds out a piece of naan over the tray (d791b70f)
export function CurryNaanFeed() {
  return (
    <CurryScene id="naan-feed" label="Your view: your hand holds out a piece of naan over the steel tray." over={<YourHand x={420} y={560} s={1.5} />} />
  );
}

// the mango lassi insert: one glass, one straw, on the same orange cloth
export function CurryLassi() {
  return (
    <CurryScene id="lassi" label="Insert: a mango lassi in a tall cup with a straw on the orange tablecloth. A menu card says LASSI.">
      <path d="M790 60l-60 180" stroke="#f2f2f2" strokeWidth="18" strokeLinecap="round" />
      <path d="M790 60l-60 180" stroke="#e0306a" strokeWidth="6" strokeDasharray="20 22" strokeLinecap="round" />
      <path d="M560 250c20-70 440-70 470 0z" fill="#f8f4ec" opacity=".55" stroke="#ffffff" strokeWidth="6" />
      <g fill="#fffaf0" opacity=".7">{[[640, 360], [700, 470], [900, 420], [960, 560], [660, 600]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="8" ry="12" />)}</g>
      <g transform="translate(1380 380)">
        <path d="M0 220L60 0H300L360 220z" fill="#fbf6ea" stroke="#c8202e" strokeWidth="6" />
        <text className="cu-sign" x="180" y="100" textAnchor="middle" fontSize="54" fill="#c8202e">LASSI</text>
        <text className="cu-jp" x="180" y="170" textAnchor="middle" fontSize="40" fill="#5a3a2a">マンゴー ¥300</text>
      </g>
    </CurryScene>
  );
}
