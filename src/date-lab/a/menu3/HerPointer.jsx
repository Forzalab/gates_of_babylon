// Her pointer, round 3: not a UI arrow glyph but HER hand, drawn in the sprite's line (#3a1d3f, round joins), index finger
// out, red nail on the tip, pink cuff + lavender sleeve running off the bottom-right. The fingertip (0,0 of the art) sits on
// the caret. `tap` = 0/1, a held pose (the finger presses 5 px in on each swap); the caller steps it, never tweens it.
const LINE = '#3a1d3f', SKIN = '#ffe2d6', SKIN2 = '#f2c4b4';

export default function HerPointer({ tap = 0, className = '' }) {
  return (
    <svg className={`herpointer ${className}`} viewBox="-12 -12 150 190" aria-hidden="true" style={{ transform: `translate(${tap ? 5 : 0}px, ${tap ? 5 : 0}px)` }}>
      {/* sleeve + cuff, off to the bottom-right */}
      <path d="M78 124 L140 178 L150 150 L100 104Z" fill="#cfc7ff" stroke={LINE} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M72 128 L100 100 L112 112 L84 140Z" fill="#ff5fa2" stroke={LINE} strokeWidth="4.5" strokeLinejoin="round" />
      {/* back of the hand, knuckles curled under */}
      <path d="M30 58 C44 46 70 50 86 66 C98 80 98 104 84 118 C70 130 48 128 38 114 C28 100 22 72 30 58Z" fill={SKIN} stroke={LINE} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M52 80 C64 76 78 82 82 94 M48 96 C58 92 70 96 74 106 M46 110 C54 108 62 112 64 118" fill="none" stroke={LINE} strokeWidth="3.5" strokeLinecap="round" />
      {/* thumb tucked along the top */}
      <path d="M34 62 C40 52 56 50 62 58 C58 66 46 70 36 70Z" fill={SKIN2} stroke={LINE} strokeWidth="4" strokeLinejoin="round" />
      {/* the index finger, out to the caret: a slightly uneven hand line */}
      <path d="M-2 4 C-4 -4 6 -8 11 -2 L47 58 C50 64 44 72 37 70 C34 69 32 66 30 63 L-1 9Z" fill={SKIN} stroke={LINE} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M22 36 C26 34 30 36 31 39" fill="none" stroke={LINE} strokeWidth="3" strokeLinecap="round" opacity=".7" />
      {/* her nail, red */}
      <path d="M-1 3 C-2 -2 4 -5 8 -1 L13 7 C9 10 4 10 2 8Z" fill="#f0243f" stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="1" cy="0" r="1.6" fill="#fff" opacity=".8" />
    </svg>
  );
}
