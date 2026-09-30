// The KATSU chain: OR OR CURRY, a Japanese curry shop (counter seats, a spoon on the tray). Also the not-hungry path.
// Refs + order: research/sprint-0930/curry/SHOTLIST.md.
import { CurryScene, Plate, Steam, Bell, usePose, preloadTrace } from './parts.jsx';

['katsu-door', 'katsu-int', 'katsu-dish', 'katsu-close', 'katsu-spoon'].forEach((k) => preloadTrace(`curry/${k}`));

// the yellow door (da264766): our sign, a glass door, a bell
export function CurryKatsuDoor() {
  return (
    <CurryScene id="katsu-door" label="Insert: the yellow front of OR OR CURRY, a glass door with a brass bell above it.">
      <rect x="180" y="84" width="1500" height="220" rx="10" fill="#c8202e" />
      <text className="cu-jp" x="930" y="232" textAnchor="middle" fontSize="130" fill="#fff4d0">OR OR カレー</text>
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

// HERO DISH (d612440e + a katsu cutlet on top): curry rice, the water jug, a spoon on the napkin
export function CurryKatsuDish({ rm }) {
  return (
    <CurryScene id="katsu-dish" label="The katsu curry: rice, brown curry, a golden fried cutlet cut in strips on top, red pickles, a water jug and a spoon on a napkin.">
      {/* the cutlet: one breaded oval, cut in 6 strips (dark cut lines, pale pork showing at each cut), laid over rice + roux */}
      <g transform="rotate(-18 900 560)">
        <rect x="660" y="450" width="500" height="230" rx="110" fill="#b8702a" />
        <rect x="672" y="460" width="476" height="206" rx="100" fill="#dc9c44" />
        {[1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={660 + i * 83 - 5} y="452" width="12" height="226" fill="#f3e2c0" />
            <rect x={660 + i * 83 - 9} y="452" width="5" height="226" fill="#7a4418" />
          </g>
        ))}
        {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={690 + ((i * 137) % 440)} cy={478 + ((i * 71) % 170)} r={i % 3 ? 5 : 7} fill={i % 2 ? '#a8641e' : '#f0bf6a'} />)}
      </g>
      <g fill="#c8202e">{[[1110, 760], [1136, 748], [1128, 780], [1156, 770], [1100, 790]].map(([x, y]) => <rect key={x + y} x={x} y={y} width="26" height="16" rx="5" />)}</g>
      <Steam x={940} y={380} rm={rm} />
    </CurryScene>
  );
}

// close-up: the roux and the chunks by a glass of water (eb6e7a8f)
export function CurryKatsuClose({ rm }) {
  return (
    <CurryScene id="katsu-close" label="Extreme close-up: thick brown curry, soft potato and carrot, white rice, a cold glass of water.">
      <Steam x={1300} y={420} h={200} rm={rm} o={0.4} />
    </CurryScene>
  );
}

// "not the spoon": the tray with the milk carton and a spoon on the rim (21dbf8f4)
export function CurryKatsuSpoon({ rm }) {
  return (
    <CurryScene id="katsu-spoon" label="The tray: curry rice, a milk carton, a bowl of fruit, and a silver spoon lying on the tray.">
      <text className="cu-jp" x="188" y="836" textAnchor="middle" fontSize="32" fill="#2a6ab0" transform="rotate(-8 188 836)">ぎゅうにゅう</text>
      <text className="cu-sign" x="188" y="890" textAnchor="middle" fontSize="40" fill="#2a6ab0" transform="rotate(-8 188 890)">MILK</text>
      <g transform="rotate(-4 1450 176)">
        <ellipse cx="1290" cy="176" rx="58" ry="30" fill="#dfe6ec" stroke="#8a96a4" strokeWidth="5" />
        <ellipse cx="1280" cy="170" rx="28" ry="12" fill="#ffffff" opacity=".8" />
        <rect x="1340" y="166" width="300" height="20" rx="10" fill="#dfe6ec" stroke="#8a96a4" strokeWidth="5" />
      </g>
      <Steam x={800} y={320} h={180} rm={rm} o={0.35} />
    </CurryScene>
  );
}
