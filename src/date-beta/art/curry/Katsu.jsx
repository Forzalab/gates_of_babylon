// The KATSU chain: OR OR CURRY, a Japanese curry shop (counter seats, a spoon on the tray). Also the not-hungry path.
// Refs + order: research/sprint-0930/curry/SHOTLIST.md.
import { CurryScene, Plate, Steam, Bell, usePose, preloadTrace } from './parts.jsx';

['katsu-door', 'katsu-int', 'katsu-counter', 'katsu-dish', 'katsu-cut', 'katsu-pour', 'katsu-close', 'katsu-feed', 'katsu-bite', 'katsu-water', 'katsu-napkin', 'napkin-fold'].forEach((k) => preloadTrace(`curry/${k}`));

// the yellow door (da264766): our sign, a glass door, a bell
export function CurryKatsuDoor() {
  return (
    <CurryScene id="katsu-door" label="Insert: the yellow front of OR OR CURRY, a glass door with a brass bell above it.">
      <rect x="180" y="84" width="1500" height="250" rx="10" fill="#c8202e" />
      <text className="cu-jp" x="930" y="292" textAnchor="middle" fontSize="120" fill="#fff4d0">OR OR カレー</text>
      <rect x="392" y="572" width="896" height="508" fill="#7a5a3c" />
      <rect x="420" y="600" width="410" height="480" fill="#e8d7a8" opacity=".78" />
      <rect x="850" y="600" width="410" height="480" fill="#e8d7a8" opacity=".78" />
      <rect x="800" y="780" width="16" height="110" rx="6" fill="#3a2e2c" />
      <rect x="864" y="780" width="16" height="110" rx="6" fill="#3a2e2c" />
      <Bell x={840} y={604} s={1.3} />
      <Plate x={1370} y={330} w={120} h={330} bg="#c8202e" fg="#fff4d0" jp="カツカレー" vertical jpSize={56} />
    </CurryScene>
  );
}

// the counter (0da0fa86's wood + posters, set as a counter): a TV cooking show, two posters, the counter front
function CookingTv({ rm }) {
  const pose = usePose(rm);
  return (
    <g>
      <rect x="770" y="206" width="365" height="248" fill="#3a6a9a" />
      <ellipse cx="952" cy="380" rx="120" ry="40" fill="#fbf6ea" />
      <path d="M842 380c20 40 200 40 220 0z" fill="#7a3a14" />
      <g stroke="#fffaf0" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".8">
        <path d={pose === 0 || rm ? 'M920 330c20-30-20-50 0-80M985 330c-20-30 20-50 0-80' : 'M930 330c-20-30 20-50 0-80M975 330c20-30-20-50 0-80'} />
      </g>
      <rect x="770" y="206" width="365" height="36" fill="#1d1b22" opacity=".6" />
      <text className="cu-sign" x="952" y="234" textAnchor="middle" fontSize="26" fill="#fff4d0">CURRY TIME</text>
    </g>
  );
}
export function CurryKatsuInt({ rm }) {
  return (
    <CurryScene id="katsu-int" label="Inside OR OR CURRY at 3:00: a wooden counter with two stools, posters, and a TV showing a cooking show.">
      <CookingTv rm={rm} />
      <Plate x={484} y={336} w={148} h={204} bg="#f6d014" fg="#c8202e" jp="カレー" en="¥980" jpSize={46} enSize={40} />
      <Plate x={1080} y={392} w={148} h={166} bg="#fbf6ea" fg="#3a2e2c" jp="カツ" en="KATSU" jpSize={52} enSize={34} />
      <rect x="0" y="742" width="1920" height="34" fill="#c89a62" />
      <rect x="0" y="776" width="1920" height="304" fill="#7a4e2c" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 240 + 10} y="790" width="220" height="290" fill="#6a4226" />)}
      <g transform="translate(300 700)">
        <path d="M0 0h70l-10 42h-50z" fill="#e8eef2" opacity=".8" />
        <rect x="120" y="-10" width="46" height="52" rx="8" fill="#c23a1a" />
      </g>
    </CurryScene>
  );
}

// Every shot below is HAND-DRAWN flat cel (pipeline/draw.py, KATSU-ANALYSIS.md): the window light from the upper left, the
// SAME plate sprite in every close-up, 5-finger hands on sleeves. Beat for beat the same chain as the butter path.

// the counter two-shot: she sits on the red stool at the counter; her plate is on the counter at the left
export function CurryKatsuCounter() {
  return (
    <CurryScene id="katsu-counter" label="Two seats at the wooden counter of OR OR CURRY. A red stool, a plate of katsu curry on the counter, menu boards on the wall.">
      <text className="cu-jp" x="655" y="258" textAnchor="middle" fontSize="54" fill="#c8202e">カレー</text>
      <text className="cu-jp" x="875" y="258" textAnchor="middle" fontSize="54" fill="#c8202e">カツ</text>
      <text className="cu-sign" x="1495" y="256" textAnchor="middle" fontSize="50" fill="#3a2e2c">¥980</text>
      <text className="cu-sign" x="1715" y="256" textAnchor="middle" fontSize="46" fill="#2a6ab0">WATER</text>
    </CurryScene>
  );
}

// HERO DISH: rice, glossy roux, the sliced cutlet fanned across the seam, fukujinzuke, a spoon on a napkin
export function CurryKatsuDish({ rm }) {
  return (
    <CurryScene id="katsu-dish" label="The katsu curry on a white plate: white rice, glossy brown curry with potato and carrot, a golden fried pork cutlet cut in slices with pink insides, red pickles, and a spoon on a napkin.">
      <Steam x={620} y={420} h={200} rm={rm} o={0.4} />
    </CurryScene>
  );
}

// she cuts one small piece with the edge of her spoon (crunch lines, no text)
export function CurryKatsuCut() {
  return <CurryScene id="katsu-cut" label="Close: her hand presses the edge of a spoon through the end of the cutlet. One small piece comes off. Crunch." />;
}

// a steel boat pours more roux onto the rice
export function CurryKatsuPour({ rm }) {
  return (
    <CurryScene id="katsu-pour" label="Close: more brown curry pours from a small steel boat onto the white rice. It is thick and hot.">
      <Steam x={780} y={460} h={180} rm={rm} o={0.35} />
    </CurryScene>
  );
}

// her fingers dip the small piece in the roux; the roux drips
export function CurryKatsuClose() {
  return <CurryScene id="katsu-close" label="Very close: her fingers dip the small piece of cutlet in the brown curry. The curry drips off it." />;
}

// POV, extreme close-up: your hand holds the piece at her open mouth
export function CurryKatsuFeed() {
  return <CurryScene id="katsu-feed" label="Your view, very close: your fingers hold the piece of cutlet with curry at her open mouth. Her eyes look at you." />;
}

// she eats from your fingers: roux at the corner of her mouth
export function CurryKatsuBite() {
  return <CurryScene id="katsu-bite" label="Very close: she eats the cutlet from your fingers. There is brown curry at the corner of her mouth. Her eyes look at you." />;
}

// her lemon water: one glass, one straw, on the counter by the plate
export function CurryKatsuWater() {
  return <CurryScene id="katsu-water" label="A tall glass of water with ice, a lime slice and one pink straw, on the wooden counter next to the katsu plate." />;
}

// the napkin: her hand wipes the curry off your fingers
export function CurryKatsuNapkin() {
  return <CurryScene id="katsu-napkin" label="Close: her hand wipes the brown curry off your fingers with a white paper napkin, over the katsu plate." />;
}

// not hungry: she holds up her folded napkin (you got no food, so no fingers to wipe)
export function CurryNapkinFold() {
  return <CurryScene id="napkin-fold" label="Close: her hand holds up her folded paper napkin over the counter, next to her empty katsu plate." />;
}
