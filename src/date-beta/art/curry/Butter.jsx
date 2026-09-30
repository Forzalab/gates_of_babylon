// CURRY street (the choice) + the BUTTER-CHICKEN chain: NAND HOUSE, a Nepali-run Indian shop in Japan.
// Refs + order: research/sprint-0930/curry/SHOTLIST.md. Every sign is ours; people and watermarks are gone (prep.py).
import { CurryScene, Plate, Steam, Clock, Bell, usePose, preloadTrace } from './parts.jsx';
import { Hand } from '../shop/parts.jsx';

['choice', 'butter-door', 'butter-int', 'butter-table', 'thali', 'naan-lift', 'sauce', 'naan-dip', 'naan-feed', 'butter-bite', 'lassi', 'napkin']
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
      {/* our sign, on the slanted sign band over the old shop name (kept below the y=140 HUD band) */}
      <g transform="rotate(-13 1180 232)">
        <rect x="950" y="178" width="460" height="108" rx="10" fill="#fbf7ef" stroke="#c8202e" strokeWidth="6" />
        <text className="cu-sign" x="1180" y="256" textAnchor="middle" fontSize="66" fill="#c8202e">NAND HOUSE</text>
      </g>
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

// Every shot below is HAND-DRAWN flat cel (research/sprint-0930/curry/pipeline/draw.py): one window light from the upper
// left, cast shadows down-right, the SAME thali sprite in every close-up (crops of the hero), 5-finger hands on sleeves.

// the two-shot: the window on the left, her booth in the middle (she sits on its seat, her shadow falls right), our table
export function CurryButterTable() {
  return <CurryScene id="butter-table" label="A small table for two by the window in NAND HOUSE: the lunch tray on an orange tablecloth, a red booth seat, a mango lassi." />;
}

// HERO DISH: the steel thali (teardrop naan draped over the edge, butter pat), static steam over the butter chicken
export function CurryThali({ rm }) {
  return (
    <CurryScene id="thali" label="The lunch set on a steel tray: butter chicken, green saag, yellow dal, rice, and one giant teardrop naan with a butter pat, hanging over the edge. Steam rises.">
      <Steam x={560} y={270} h={150} w={50} rm={rm} o={0.45} />
    </CurryScene>
  );
}

// her hand (from the right) lifts the piece she tore off the naan tip
export function CurryNaanLift() {
  return <CurryScene id="naan-lift" label="Close: her fingers hold up a piece of naan. She tore it off the tip of the big naan." />;
}

// a small steel boat pours more butter sauce into the butter chicken cup
export function CurrySauce({ rm }) {
  return (
    <CurryScene id="sauce" label="Close: her hand tips a small steel boat by its handle; more butter sauce pours into the cup of butter chicken. It is thick, orange, and shiny.">
      <Steam x={620} y={330} h={170} rm={rm} o={0.35} />
      {/* r5 (AUDIT 050): her hand holds the boat by its handle (top right), her pink cuff off the frame edge */}
      <Hand x={1860} y={280} rot={250} s={1} her pose="grip" thumb="left" />
    </CurryScene>
  );
}

// her fingers dip the same piece into the butter chicken; the sauce drips
export function CurryNaanDip() {
  return <CurryScene id="naan-dip" label="Very close: her fingers dip the piece of naan in the butter chicken. The sauce drips off it." />;
}

// POV, extreme close-up: YOUR hand (bottom-left) holds the sauced naan at her open mouth. All of it sits above the box.
export function CurryNaanFeed() {
  return <CurryScene id="naan-feed" label="Your view, very close: your fingers hold the piece of naan with sauce at her open mouth. Her eyes look at you." />;
}

// she eats from your fingers: the butter sauce at the corner of her mouth, her eyes on you
export function CurryButterBite() {
  return <CurryScene id="butter-bite" label="Very close: she eats the naan from your fingers. There is orange sauce at the corner of her mouth. Her eyes look at you." />;
}

// the mango lassi on the same orange cloth, the same tray at the left edge; ONE straw
export function CurryLassi() {
  return (
    <CurryScene id="lassi" label="A mango lassi in a tall glass with one pink straw, on the orange tablecloth next to the lunch tray. A menu card says LASSI.">
      <g transform="translate(1440 420)">
        <path d="M0 150L40 0H260L300 150z" fill="#fbf6ea" stroke="#c8202e" strokeWidth="6" />
        <text className="cu-sign" x="150" y="70" textAnchor="middle" fontSize="46" fill="#c8202e">LASSI</text>
        <text className="cu-jp" x="150" y="128" textAnchor="middle" fontSize="32" fill="#5a3a2a">マンゴー ¥300</text>
      </g>
    </CurryScene>
  );
}

// the napkin: her hand (from the right) wipes the sauce off your fingers with a white napkin, over the tray
export function CurryNapkin() {
  return <CurryScene id="napkin" label="Close: her hand wipes the orange sauce off your fingers with a white paper napkin, over the lunch tray." />;
}
