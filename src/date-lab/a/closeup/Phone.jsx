// closeup-2 PHONE FACE-DOWN (horror 3). School: the Kuleshov effect (neutral face + insert = the audience writes the feeling)
// x Hitchcock's *Rear Window* inserts x yandere tells (she flips the phone without looking; the pin goes dark).
// Central theme: WHAT SHE HIDES FROM YOU, SHE HIDES WITHOUT LOOKING. Script 3.1: "her phone buzzes; she flips it face-down
// without looking." The lock screen is a candid photo of YOU, from behind. The message is XOR's.
// Beats (12.5 s loop): insert: phone in her hand, buzzing in 2 held poses (2 Hz), lock screen 12:00, "Unknown ⊕ · who's the new
// kid? 🙂" -> her thumb flips it face-down in 3 held poses -> Kuleshov cut: her face, blank, pin OFF, 3 s of nothing ->
// "Nobody. Nobody important." -> insert: it buzzes again face-down, purple light leaks round the edge, her thumb presses harder
// -> her face, smiling, pin humming: "Only you tonight. Come in."
// RM: no buzz offset (a static "bzz" caption instead), the flip is one cut, same beats.
import { useClock } from '../kit/hooks.js';
import { Line, Tag, Hud } from '../kit/ui.jsx';
import { Nanda, Frag, ART } from '../kit/Sprite.jsx';
import { stepAt } from '../kit/time.js';
import './closeup.css';

const LOOP = 12500;
const LINES = [[0, 'Her phone buzzes.'], [2000, 'She flips it face-down. Without looking.'], [3600, ''], [5600, 'NANDA: Nobody. Nobody important.'],
  [7200, 'It buzzes again. She presses it flatter.'], [9900, 'NANDA: Only you tonight. Come in.']];
const at = (t, list) => list.reduce((a, [k, v]) => (t >= k ? v : a), '');

function LockScreen() {
  return (
    <g>
      <defs>
        <linearGradient id="ph-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3553c0" /><stop offset="1" stopColor="#ffb3cf" /></linearGradient>
        <clipPath id="ph-scr"><rect x="-190" y="-380" width="380" height="760" rx="34" /></clipPath>
      </defs>
      <g clipPath="url(#ph-scr)">
        <rect x="-190" y="-380" width="380" height="760" fill="url(#ph-sky)" />
        {/* the wallpaper: a candid photo of you, from behind, on the rooftop railing */}
        <rect x="-190" y="160" width="380" height="16" fill="#4a3f5c" />
        {[-170, -120, -70, -20, 30, 80, 130].map((x) => <rect key={x} x={x} y="176" width="8" height="220" fill="#4a3f5c" />)}
        <Frag html={ART.sil('suit', 30, 400, 0.62)} className="ph-you" />
        <circle cx="130" cy="70" r="40" fill="#fff4d0" opacity=".7" />
        <text x="0" y="-250" textAnchor="middle" className="ph-time">12:00</text>
        <text x="0" y="-205" textAnchor="middle" className="ph-date">Tue · rain</text>
        {/* XOR's notification */}
        <g transform="translate(-170 -150)">
          <rect width="340" height="110" rx="20" fill="rgba(255,255,255,.88)" />
          <circle cx="44" cy="55" r="26" fill="#8a5cf6" /><text x="44" y="65" textAnchor="middle" className="ph-xor">⊕</text>
          <text x="84" y="44" className="ph-from">Unknown ⊕</text>
          <text x="84" y="80" className="ph-msg">who's the new kid? 🙂</text>
        </g>
      </g>
    </g>
  );
}

// her hand holding the phone (portrait). pose: 0 face-up, 1 on edge, 2 face-down. buzz = x offset.
function PhoneInsert({ pose, buzz, leak }) {
  return (
    <svg className="full" viewBox="0 0 1920 1080" aria-hidden="true">
      <rect width="1920" height="1080" fill="#23284a" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${i * 130 - 40} 0 L${i * 130 + 20} 1080`} stroke="#1a1e3a" strokeWidth="12" />)}
      <g transform={`translate(${960 + buzz} 520)`}>
        {pose === 0 && <><rect x="-210" y="-400" width="420" height="800" rx="50" fill="#3a1d3f" /><LockScreen /></>}
        {pose === 1 && <rect x="-210" y="-40" width="420" height="80" rx="30" fill="#ff9cc8" stroke="#3a1d3f" strokeWidth="10" />}
        {pose === 2 && (
          <g>
            {leak && <rect x="-230" y="-420" width="460" height="840" rx="60" fill="#8a5cf6" opacity=".45" style={{ filter: 'blur(18px)' }} />}
            <rect x="-210" y="-400" width="420" height="800" rx="50" fill="#ff9cc8" stroke="#3a1d3f" strokeWidth="10" />
            <circle cx="-120" cy="-310" r="34" fill="#2a2330" /><text x="0" y="40" textAnchor="middle" className="ph-figur">Figur</text>
          </g>
        )}
      </g>
      {/* her hand: thumb over the phone, pink cuff */}
      <g className="ph-hand"><Frag html={ART.hand(1010, 1020, 1.9, false, 'closed')} /></g>
    </svg>
  );
}

function Face({ face, pin }) {
  return (
    <svg className="full" viewBox="0 0 1920 1080" aria-hidden="true">
      <rect width="1920" height="1080" fill="#6b5a55" />
      <rect x="0" y="0" width="1920" height="1080" fill="#5a4a46" />
      <rect x="1540" y="0" width="30" height="1080" fill="#ffcf7a" opacity=".7" />
      <Nanda face={face} pin={pin} x={510} y={20} s={1.5} className="ph-bust" />
      <rect width="1920" height="1080" fill="url(#ph-lamp)" />
      <defs><radialGradient id="ph-lamp" cx="960" cy="-100" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#fff4d0" stopOpacity=".2" /><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".45" /></radialGradient></defs>
    </svg>
  );
}

export default function Phone({ rm }) {
  const [t, restart] = useClock({ loop: LOOP });
  const shot = t < 3600 ? 'insert' : t < 7200 ? 'face-blank' : t < 9900 ? 'insert-2' : 'face-smile';
  const pose = shot === 'insert' ? (rm ? (t < 2000 ? 0 : 2) : t < 2000 ? 0 : t < 2500 ? 1 : 2) : 2;
  const buzzing = (shot === 'insert' && t < 2000) || (shot === 'insert-2' && t > 7700 && t < 9100);
  const buzz = buzzing && !rm ? (stepAt(t, 2, 500) ? 8 : -8) : 0;
  const line = at(t, LINES);
  return (
    <div className={`aroot closeup phone shot-${shot}`} onClick={restart}>
      <div className="cu-frame">
        {shot.startsWith('insert') ? <PhoneInsert pose={pose} buzz={buzz} leak={shot === 'insert-2' && buzzing} />
          : <Face face={shot === 'face-blank' ? 'blank' : 'smile'} pin={shot === 'face-blank' ? 'off' : 'hum'} />}
        {buzzing && <div className="ph-bzz" aria-hidden="true">bzz</div>}
      </div>
      <div className="a-bars" style={{ '--bar': '70px' }} />
      <Line text={line} className="cu-line" />
      <span className="sr" aria-live="polite">{buzzing ? '[phone buzzes]' : ''}</span>
      <Tag>closeup-2 · phone face-down (kuleshov)</Tag>
      <Hud><span className="a-chip">click = restart</span></Hud>
    </div>
  );
}
