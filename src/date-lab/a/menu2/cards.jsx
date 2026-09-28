// Round-2 tarot kit (menu-1-r2 + menu-h1-r2). Copied from round-1 Tarot.jsx and reworked per the verdict:
//  - the option text lives ONCE, on a typed paper slip tucked into each card (no duplicate under-labels);
//  - your face-down card can WARM toward pink in held steps (her influence), `warm` = 0..1, quantised by the caller;
//  - the replay-disabled state reads from the back row: a big hair-pin driven through the card, a red puncture ring,
//    the slip struck through in her red, a DRAWN stamp, the card dimmed.
// Round-1 files stay untouched.
import { useEffect, useId, useState } from 'react';
import { NAND_BODY } from '../../../date-beta/art/util.js';
import { usePose } from '../kit/hooks.js';

const mix = (a, b, k) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};
export const warmInk = (k) => mix('#b7a4e8', '#ffb3d4', k);

function Frame({ ink = '#d6a93f' }) {
  return (
    <>
      <rect x="14" y="14" width="412" height="712" rx="18" fill="none" stroke={ink} strokeWidth="5" />
      <rect x="28" y="28" width="384" height="684" rx="12" fill="none" stroke={ink} strokeWidth="2" />
      {[[28, 28], [412, 28], [28, 712], [412, 712]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill={ink} />)}
    </>
  );
}

// Her card: VI THE CUP. A teacup whose two steam strands (two inputs) rise into a NAND-gate sun. Text lives on the slip.
export function HerFace() {
  const u = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 440 740" className="face">
      <defs>
        <linearGradient id={`w${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb86b" /><stop offset=".55" stopColor="#ff8fb8" /><stop offset="1" stopColor="#c93d7a" /></linearGradient>
        <clipPath id={`a${u}`}><path d="M50 492 V200 A170 170 0 0 1 390 200 V492Z" /></clipPath>
      </defs>
      <rect width="440" height="740" rx="24" fill="#fff4e8" />
      <Frame />
      <text x="220" y="80" textAnchor="middle" className="t-num">VI</text>
      <g clipPath={`url(#a${u})`}>
        <rect x="40" y="30" width="360" height="480" fill={`url(#w${u})`} />
        <g transform="translate(160 140) scale(2.2)">
          <path d={NAND_BODY} fill="#fff1c9" stroke="#b0123e" strokeWidth="2.4" />
          <circle cx="48" cy="20" r="5.5" fill="#ff5fa2" stroke="#b0123e" strokeWidth="2.4" />
        </g>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <line key={i} x1={220 + Math.cos(a) * 92} y1={184 + Math.sin(a) * 92} x2={220 + Math.cos(a) * 128} y2={184 + Math.sin(a) * 128} stroke="#fff1c9" strokeWidth="6" strokeLinecap="round" opacity=".85" />;
        })}
        <path d="M196 392 C170 350 214 320 188 280 C176 260 178 240 160 228" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M244 392 C270 350 226 320 252 280 C262 262 250 242 260 228" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M40 460 Q140 410 220 442 Q300 410 400 458 V520 H40Z" fill="#8a3a6a" opacity=".55" />
        <path d="M136 398 H304 L288 468 Q220 496 152 468Z" fill="#fff" stroke="#6a1f4f" strokeWidth="6" />
        <path d="M302 410 q42 4 32 36 q-8 20 -42 16" fill="none" stroke="#6a1f4f" strokeWidth="6" />
        <ellipse cx="220" cy="398" rx="84" ry="15" fill="#fff" stroke="#6a1f4f" strokeWidth="6" />
        <ellipse cx="220" cy="400" rx="70" ry="9" fill="#c9e59a" />
        <path d="M146 432 H294" stroke="#ff5fa2" strokeWidth="7" />
      </g>
      <path d="M50 492 V200 A170 170 0 0 1 390 200 V492Z" fill="none" stroke="#d6a93f" strokeWidth="5" />
      <text x="220" y="545" textAnchor="middle" className="t-name">THE CUP</text>
    </svg>
  );
}

// Your card, face-down: a closed door (Unit 12) with her pin-dot for a peephole, in a lattice of tiny NAND glyphs.
// warm 0..1: the lattice, frame and door heat from cold purple toward her pink (held steps, the caller quantises).
export function Back({ warm = 0 }) {
  const u = useId().replace(/:/g, '');
  const bg = mix('#221338', '#5a1238', warm), glyph = mix('#6b4fb8', '#ff5fa2', warm), ink = warmInk(warm);
  const door = mix('#2e1c4a', '#6a1f4f', warm), hole = mix('#170b28', '#2a0616', warm);
  return (
    <svg viewBox="0 0 440 740" className="face back">
      <defs>
        <pattern id={`l${u}`} width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="44" height="44" fill={bg} />
          <g transform="translate(12 14) scale(.3)"><path d={NAND_BODY} fill="none" stroke={glyph} strokeWidth="5" /><circle cx="48" cy="20" r="6" fill="none" stroke={glyph} strokeWidth="5" /></g>
        </pattern>
      </defs>
      <rect width="440" height="740" rx="24" fill={`url(#l${u})`} />
      <Frame ink={ink} />
      <ellipse cx="220" cy="300" rx="140" ry="210" fill={hole} stroke={ink} strokeWidth="4" />
      <rect x="164" y="170" width="112" height="240" rx="4" fill={door} stroke={ink} strokeWidth="4" />
      <rect x="180" y="188" width="80" height="92" fill="none" stroke={glyph} strokeWidth="2.5" />
      <rect x="180" y="296" width="80" height="92" fill="none" stroke={glyph} strokeWidth="2.5" />
      <circle cx="252" cy="300" r="7" fill={ink} />
      <circle cx="220" cy="222" r="9" fill="#f0243f" />
      <text x="220" y="156" textAnchor="middle" className="t-12" style={{ fill: ink }}>12</text>
    </svg>
  );
}

// Your card, revealed: XVI THE DOOR, drawn REVERSED (the whole face is upside down).
export function DoorFace() {
  return (
    <svg viewBox="0 0 440 740" className="face">
      <g transform="rotate(180 220 370)">
        <rect width="440" height="740" rx="24" fill="#e9e2f6" />
        <Frame ink="#6b4fb8" />
        <text x="220" y="80" textAnchor="middle" className="t-num dark">XVI</text>
        <path d="M50 500 V200 A170 170 0 0 1 390 200 V500Z" fill="#1c1430" stroke="#6b4fb8" strokeWidth="5" />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={60 + ((i * 67) % 320)} y1={110 + ((i * 131) % 370)} x2={52 + ((i * 67) % 320)} y2={140 + ((i * 131) % 370)} stroke="#9f8fd6" strokeWidth="2" opacity=".6" />)}
        <rect x="150" y="240" width="140" height="260" fill="#3a2a5a" stroke="#b7a4e8" strokeWidth="5" />
        <path d="M290 240 V500 L312 490 V252Z" fill="#8a5cf6" opacity=".6" />
        <circle cx="266" cy="380" r="8" fill="#b7a4e8" />
        <text x="220" y="562" textAnchor="middle" className="t-name dark">THE DOOR</text>
        <text x="220" y="700" textAnchor="middle" className="t-maker">reversed</text>
      </g>
    </svg>
  );
}

// ---------- candle timer: wax = smooth UI timer, flame = 3 stepped poses at 500 ms ----------
const FLAMES = ['M0 0 C14 -22 8 -46 0 -64 C-8 -46 -14 -22 0 0Z', 'M0 0 C16 -20 4 -44 4 -66 C-10 -48 -14 -20 0 0Z', 'M0 0 C12 -24 12 -44 -4 -62 C-8 -40 -16 -22 0 0Z'];
export function Candle({ k, lit, rm }) {
  const pose = usePose(3, 500, lit && !rm);
  const u = useId().replace(/:/g, '');
  const wax = 300 * (1 - k) + 26;
  const top = 440 - wax;
  return (
    <svg viewBox="0 0 200 520" className="candle">
      <defs><radialGradient id={`g${u}`}><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient></defs>
      {lit && <circle cx="100" cy={top - 30} r="120" fill={`url(#g${u})`} />}
      <rect x="64" y={top} width="72" height={wax} rx="6" fill="#f4e6d6" />
      <path d={`M64 ${top + 8} q10 30 4 60 M136 ${top + 6} q-8 20 -2 44`} stroke="#e0cdb6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <line x1="100" y1={top} x2="100" y2={top - 14} stroke="#2a1d1a" strokeWidth="4" />
      {lit ? (
        <g transform={`translate(100 ${top - 10})`}>
          <path d={FLAMES[pose]} fill="#ffb13d" /><path d={FLAMES[pose]} transform="scale(.5) translate(0 -6)" fill="#fff4c9" />
        </g>
      ) : (
        <path d={`M100 ${top - 16} c-10 -20 12 -30 0 -50 c-8 -14 6 -24 2 -34`} stroke="#9aa0b0" strokeWidth="4" fill="none" opacity=".6" />
      )}
      <ellipse cx="100" cy="452" rx="84" ry="16" fill="#3b2a20" /><rect x="40" y="440" width="120" height="16" rx="6" fill="#6b4a2f" />
    </svg>
  );
}

// ---------- her hand, sliding her card to you: 3 stepped poses (500 ms each). RM: straight to the last pose ----------
export function HerHand({ on, rm }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!on) { setP(0); return undefined; }
    if (rm) { setP(2); return undefined; }
    const a = setTimeout(() => setP(1), 0), b = setTimeout(() => setP(2), 500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [on, rm]);
  if (!on) return null;
  return (
    <svg viewBox="0 0 300 560" className={`herhand p${p}`}>
      <path d="M90 0 H230 L218 300 H104Z" fill="#fbf7ff" stroke="#3a1d3f" strokeWidth="5" />
      <path d="M100 250 H224" stroke="#8a7ff0" strokeWidth="18" />
      <path d="M110 296 C100 360 110 420 128 470 C140 500 178 506 196 470 C214 420 222 360 214 296Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="5" />
      {[128, 152, 176, 198].map((x, i) => <rect key={x} x={x - 10} y={440 + (i % 2) * 8} width="20" height={70 - Math.abs(i - 1.5) * 10} rx="10" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="4" />)}
      <circle cx="162" cy="270" r="8" fill="#ff5fa2" />
    </svg>
  );
}

// ---------- DISABLED (replay): her hair-pin driven through the card. Sized to read from the back row. ----------
// A 1:1 scale of main's pin (NAND body + mood bubble) blown up, a steel shaft, a red puncture ring where it goes in.
export function BigPin() {
  return (
    <svg viewBox="0 0 400 400" className="bigpin" aria-hidden="true">
      {/* puncture: a dark hole, a red ring, four short tear lines in the card stock */}
      <g transform="translate(118 282)">
        {[20, 110, 200, 290].map((a) => <path key={a} d="M20 0 L52 0" transform={`rotate(${a})`} stroke="#f0243f" strokeWidth="7" strokeLinecap="round" />)}
        <circle r="22" fill="#12040a" stroke="#f0243f" strokeWidth="9" />
      </g>
      {/* shaft (in front of the hole, going in) */}
      <line x1="118" y1="282" x2="266" y2="134" stroke="#3a1d3f" strokeWidth="20" strokeLinecap="round" />
      <line x1="118" y1="282" x2="266" y2="134" stroke="#e4def0" strokeWidth="12" strokeLinecap="round" />
      <line x1="126" y1="268" x2="256" y2="138" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      {/* head: her NAND pin, 5x */}
      <g transform="translate(284 116) rotate(-45) scale(3.2)">
        <path d="M-18,-14 L0,-14 A14,14 0 0 1 0,14 L-18,14 Z" fill="#fff" stroke="#3a1d3f" strokeWidth="3" />
        <circle cx="20" cy="0" r="7" fill="#f0243f" stroke="#3a1d3f" strokeWidth="3" />
        <circle cx="18" cy="-2" r="2" fill="#fff" opacity=".9" />
      </g>
    </svg>
  );
}

// The disabled overlay for a card: pin + DRAWN stamp. The slip handles its own strike-through.
export function Disabled({ note }) {
  return (
    <span className="disabled" aria-hidden="true">
      <BigPin />
      <b className="stamp">DRAWN</b>
      {note && <em className="dnote">{note}</em>}
    </span>
  );
}
