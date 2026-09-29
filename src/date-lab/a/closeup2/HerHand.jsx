// Her LEFT hand, OPEN, lying on the table plane (closeup-3-r2 fix: R1's hand was main's fist sprite gripping the cup).
// Authored top-down in local units, fingers pointing -x (toward the cup), wrist at +x, then laid onto the table with a
// y-squash (the Ozu low-table angle) by the caller. Two poses, both open:
//   'back'  = palm down, flat, fingertips on the saucer rim (she slides it; red nails read from the back row)
//   'palm'  = turned palm UP beside the saucer, fingers extended at the cup: the "for you" presenting gesture.
// Her hand is drawn once here as flat anime shapes with main's outline colour; no fist anywhere.
const INK = '#3a1d3f';
const SKIN = '#ffe2d6', SKIN2 = '#f2c4b4', PALM = '#ffd6cc', NAIL = '#f0243f';
const SLEEVE = '#fbf7ff', CUFF = '#ff5fa2';

// [centre y, length from the knuckle line] per finger, index (far side) -> pinky
const FINGERS = [[-50, 128], [-17, 150], [17, 138], [50, 108]];
const FW = 34;

function Finger({ y, len, nail, pad }) {
  const w = y === 50 ? FW - 4 : FW;
  return (
    <g>
      <rect x={-len} y={y - w / 2} width={len + 14} height={w} rx={w / 2} fill={pad ? PALM : SKIN} stroke={INK} strokeWidth="5" />
      {nail && <rect x={-len + 5} y={y - w / 2 + 6} width="28" height={w - 12} rx="9" fill={NAIL} stroke={INK} strokeWidth="2.5" />}
      {pad && <path d={`M${-len * 0.55} ${y - w / 2 + 6} L${-len * 0.55} ${y + w / 2 - 6} M${-len * 0.2} ${y - w / 2 + 6} L${-len * 0.2} ${y + w / 2 - 6}`} stroke={SKIN2} strokeWidth="3" strokeLinecap="round" />}
      {pad && <path d={`M${-len - 2} ${y - 7} q-5 7 0 14`} stroke={NAIL} strokeWidth="5" fill="none" strokeLinecap="round" />}
    </g>
  );
}

// thumb: a capsule angled off the far (back) or near (palm) side of the hand
function Thumb({ side, nail, pad }) {
  const s = side; // -1 far, +1 near
  return (
    <g transform={`translate(66 ${s * 58}) rotate(${s * -36})`}>
      <rect x="-108" y="-18" width="122" height="36" rx="18" fill={pad ? PALM : SKIN} stroke={INK} strokeWidth="5" />
      {nail && <rect x="-103" y="-12" width="28" height="24" rx="9" fill={NAIL} stroke={INK} strokeWidth="2.5" />}
    </g>
  );
}

export default function HerHand({ pose = 'back' }) {
  const palm = pose === 'palm';
  return (
    <g className="her-open-hand">
      {/* sleeve back toward her side of the table */}
      <path d="M160 -80 L720 -110 L720 110 L160 80 Z" fill={SLEEVE} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M160 -80 L206 -82 L206 82 L160 80 Z" fill={CUFF} stroke={INK} strokeWidth="4" />
      {/* fingers first, the hand body overlaps their roots */}
      {FINGERS.map(([y, len]) => <Finger key={y} y={y} len={len} nail={!palm} pad={palm} />)}
      <Thumb side={palm ? 1 : -1} nail={!palm} pad={palm} />
      <path d="M8 -68 C50 -78 120 -74 172 -62 L172 62 C120 74 50 78 8 68 C-8 34 -8 -34 8 -68 Z" fill={palm ? PALM : SKIN} stroke={INK} strokeWidth="5" />
      {palm ? (
        <g fill="none" stroke={SKIN2} strokeWidth="4" strokeLinecap="round">
          <ellipse cx="92" cy="0" rx="46" ry="30" fill="#ffc2c8" stroke="none" opacity=".55" />
          <path d="M22 -30 C60 -14 108 -22 150 -36" />
          <path d="M18 8 C60 22 104 14 140 4" />
          <path d="M150 40 C120 20 96 34 70 50" />
        </g>
      ) : (
        <g fill="none" stroke={SKIN2} strokeWidth="3.5" strokeLinecap="round">
          {FINGERS.map(([y]) => <path key={y} d={`M4 ${y - 7} q-6 7 0 14`} />)}
          <path d="M40 -36 L130 -28 M42 -10 L140 -6 M40 16 L134 18" opacity=".7" />
        </g>
      )}
    </g>
  );
}
