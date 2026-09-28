// closeup-1 BENTO PICK + SOUR (horror 1). School: food anime (*Shokugeki no Soma* reaction, *Yuru Camp* food inserts) x
// Itami's *Tampopo* top-down food cinema x a sweet-horror echo (the pick comes back tomorrow).
// Central theme: WHAT YOU PICK, SHE PACKS FOREVER (the echo rule). Script: SOUR MUST READ + HER 3 FOODS.
// Beats (12 s loop): top-down bento, her line "Pick one. Sweet OR sour." -> MC's chopsticks hover the tamagoyaki (pink),
// step over to the umeboshi (purple), pinch -> PUCKER: the frame squashes to scaleY .92, a damped camera shiver, a yellow-green
// tint held 334 ms, manga SFX "すっぱい! SOUR!" -> her reaction "Sour, ne?" -> "You smile for her anyway." -> back on the box:
// her chopsticks have already put a second umeboshi in. "Good. I'll pack sour. Every day."
// RM: chopsticks cut between poses (they are stepped anyway), no squash / shiver: a static tint + a hard cut, same SFX text.
import { useClock } from '../kit/hooks.js';
import { Line, Tag, Hud } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import { rng } from '../../../date-beta/art/util.js';
import { clamp } from '../kit/time.js';
import './closeup.css';

const LOOP = 12500;
const BEATS = [
  [0, 'NANDA: Pick one. Sweet OR sour.'], [4400, 'NANDA: Sour, ne?'], [6700, 'You smile for her anyway.'],
  [9300, "NANDA: Good. I'll pack sour. Every day."],
];
const lineAt = (t) => BEATS.reduce((a, [at, s]) => (t >= at ? s : a), '');

function Rice() {
  const r = rng(12);
  return (
    <g>
      <rect x="330" y="250" width="620" height="560" rx="26" fill="#fbfaf3" />
      {Array.from({ length: 170 }, (_, i) => {
        const x = 350 + r() * 580, y = 270 + r() * 520, a = r() * 180;
        return <ellipse key={i} cx={x} cy={y} rx="11" ry="5.5" transform={`rotate(${a} ${x} ${y})`} fill="#fff" stroke="#e7e2d2" strokeWidth="1.5" />;
      })}
      {Array.from({ length: 22 }, (_, i) => { const x = 360 + r() * 560, y = 290 + r() * 480; return <ellipse key={`s${i}`} cx={x} cy={y} rx="4" ry="2.4" transform={`rotate(${r() * 180} ${x} ${y})`} fill="#2a2222" />; })}
    </g>
  );
}
function Plum({ x, y, s = 1, glow }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <circle r="92" fill={glow} opacity=".35" className="cu-glow" />}
      <circle r="62" fill="#a8123e" /><circle r="62" fill="url(#cu-plum)" />
      <path d="M-22 -18 q14 16 0 34 M16 -28 q-10 22 6 44 M34 -4 q-12 10 -6 26" stroke="#6e0a26" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="-20" cy="-26" rx="18" ry="10" fill="#f07a9a" opacity=".8" />
    </g>
  );
}
function Tamago({ glow }) {
  return (
    <g>
      {glow && <rect x="990" y="250" width="560" height="300" rx="40" fill={glow} opacity=".3" className="cu-glow" />}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${1020 + i * 176} 280)`}>
          <rect width="160" height="240" rx="26" fill="#ffd84d" stroke="#e0a82a" strokeWidth="5" />
          <path d="M20 60 q60 -30 120 0 M20 120 q60 -30 120 0 M20 180 q60 -30 120 0" stroke="#f3b93a" strokeWidth="7" fill="none" />
          <rect x="6" y="6" width="148" height="18" rx="9" fill="#ffe98a" />
        </g>
      ))}
    </g>
  );
}
// MC's chopsticks from bottom-right. Poses: 0 over tamago, 1 between, 2 over umeboshi, 3 pinch + lift.
const STICKS = [[1250, 410, -28], [1000, 480, -34], [700, 540, -38], [700, 470, -38]];
function Sticks({ pose, her }) {
  const [x, y, a] = STICKS[pose];
  const col = her ? '#f0243f' : '#6b3a22';
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`} className="cu-sticks">
      <rect x="-8" y="0" width="16" height="900" rx="7" fill={col} stroke="#2a1510" strokeWidth="4" />
      <rect x={pose === 3 ? 14 : 34} y="6" width="16" height="900" rx="7" fill={col} stroke="#2a1510" strokeWidth="4" transform={`rotate(${pose === 3 ? 0 : 3})`} />
      {her && <circle cx="12" cy="600" r="10" fill="#ff5fa2" />}
    </g>
  );
}

export default function Bento({ rm }) {
  const [t, restart] = useClock({ loop: LOOP });
  const pose = t < 2600 ? 0 : t < 3100 ? 1 : t < 4200 ? 2 : 3;
  const pucker = t >= 4200 && t < 6700;
  const react = t >= 6700 && t < 9300;
  const echo = t >= 9300;
  const tint = t >= 4200 && t < 4200 + 334;
  // camera: squash + damped shiver (smooth camera move; RM = none)
  const k = t - 4200;
  const squash = !rm && k >= 0 && k < 900 ? 1 - 0.08 * Math.exp(-k / 500) : 1;
  const shx = !rm && k >= 0 && k < 1200 ? Math.sin((k / 1000) * Math.PI * 2 * 2.5) * 14 * Math.exp(-k / 400) : 0;
  const line = lineAt(t);
  return (
    <div className="aroot closeup bento" onClick={restart}>
      <div className="cu-frame" style={{ transform: `translateX(${shx}px) scaleY(${squash})` }}>
        {!react ? (
          <svg className="full" viewBox="0 0 1920 1080" aria-hidden="true">
            <defs>
              <radialGradient id="cu-plum" cx=".35" cy=".3"><stop offset="0" stopColor="#e8335c" /><stop offset="1" stopColor="#8a0d30" stopOpacity="0" /></radialGradient>
              <linearGradient id="cu-lac" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a0d14" /><stop offset="1" stopColor="#1a0508" /></linearGradient>
            </defs>
            {/* the table: her gingham cloth */}
            <rect width="1920" height="1080" fill="#ffe3f0" />
            {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y="0" width="40" height="1080" fill="#ff9cc8" opacity=".35" />)}
            {Array.from({ length: 14 }, (_, i) => <rect key={`h${i}`} x="0" y={i * 80} width="1920" height="40" fill="#ff9cc8" opacity=".35" />)}
            {/* lacquer box */}
            <rect x="290" y="200" width="1320" height="660" rx="44" fill="url(#cu-lac)" stroke="#120306" strokeWidth="8" />
            <rect x="310" y="222" width="1280" height="616" rx="34" fill="none" stroke="#b0123e" strokeWidth="6" />
            <Rice />
            {(pose < 3 || echo) && <Plum x={640} y={530} glow={pose === 2 ? '#8a5cf6' : null} />}
            {echo && <Plum x={760} y={420} s={0.9} />}
            <rect x="970" y="236" width="10" height="590" fill="#120306" />
            <Tamago glow={pose === 0 ? '#ff5fa2' : null} />
            <rect x="990" y="560" width="600" height="10" fill="#120306" />
            {/* her mochi, labelled */}
            <g transform="translate(1290 700)"><path d="M-110 50 C-120 -30 -60 -80 0 -80 C60 -80 120 -30 110 50 C70 80 -70 80 -110 50Z" fill="#fff4f8" stroke="#f3c6d8" strokeWidth="5" /><ellipse cx="0" cy="-20" rx="36" ry="18" fill="#ff8fb8" opacity=".6" /></g>
            <text x="1470" y="790" className="cu-note" textAnchor="middle">mine ♡</text>
            <g transform="translate(1110 700)"><circle r="46" fill="#e8455a" /><path d="M-40 20 q-10 40 6 50 M-14 30 q-4 40 10 46 M14 30 q6 40 -4 46 M40 20 q10 40 -6 50" stroke="#e8455a" strokeWidth="14" fill="none" strokeLinecap="round" /><circle cx="-14" cy="-6" r="6" fill="#2a1510" /><circle cx="14" cy="-6" r="6" fill="#2a1510" /></g>
            {!echo && <Sticks pose={pose} />}
            {pose === 3 && !echo && <Plum x={STICKS[3][0] + 30} y={STICKS[3][1] + 40} s={0.95} />}
            {echo && <Sticks pose={2} her />}
          </svg>
        ) : (
          <svg className="full" viewBox="0 0 1920 1080" aria-hidden="true">
            <rect width="1920" height="1080" fill="#fff0f7" />
            {Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return <line key={i} x1={960 + Math.cos(a) * 380} y1={500 + Math.sin(a) * 380} x2={960 + Math.cos(a) * 1400} y2={500 + Math.sin(a) * 1400} stroke="#ffd0e4" strokeWidth={i % 2 ? 10 : 22} />; })}
            <Nanda face="smile" pin="hum" x={630} y={80} s={1.1} />
          </svg>
        )}
        {pucker && (
          <div className="cu-sfx" aria-hidden="true">
            <span className="jp">すっぱい！</span>
            <span className="en">SOUR!</span>
          </div>
        )}
      </div>
      {(tint || (rm && pucker && t < 5200)) && <div className="cu-tint" />}
      <div className="a-bars" style={{ '--bar': '70px' }} />
      <Line text={line} className="cu-line" />
      <Tag>closeup-1 · bento pick + SOUR</Tag>
      <Hud><span className="a-chip">click = restart</span></Hud>
    </div>
  );
}
export { clamp };
