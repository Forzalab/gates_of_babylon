// Her hand holding the purple box down (menu-h3-r3). The drawing is Builder A's menu-1-r2 "HoldingHand" (a/menu2/Tarot2.jsx,
// not exported, so copied here and credited), mirrored so the sleeve comes in from the RIGHT edge of the frame over the
// letterbox and the two red-nailed fingertips rest on the top edge of the purple box.
// pose: 1 = reaching (held 500 ms), 2 = resting, pressing; 'lift' = she lets go. Poses are held states, never tweened.
import { useId } from 'react';

// fingertip 1 (local 302,252) lands on stage (TIP_X, TIP_Y) in pose 2
export const TIP_X = 1560, TIP_Y = 916, K = 1.3;
const POSE = { 1: [70, -90], 2: [0, 0], lift: [40, -150] };

export default function Hand({ pose = 2 }) {
  const u = useId().replace(/:/g, '');
  const [ox, oy] = POSE[pose] ?? POSE[2];
  const tx = TIP_X + K * 302 + ox, ty = TIP_Y - K * 252 + oy;
  return (
    <svg className={`r3-hand p-${pose}`} viewBox="0 0 1920 1080" aria-label="Her hand, from the right edge, two fingertips holding the purple box down">
      <defs>
        <linearGradient id={`${u}-f`} x1="0" y1="0" x2="1" y2="0"><stop offset=".02" stopColor="#fff" stopOpacity="0" /><stop offset=".3" stopColor="#fff" stopOpacity="1" /></linearGradient>
        <mask id={`${u}-m`} maskUnits="userSpaceOnUse" x="-40" y="0" width="480" height="300"><rect x="-40" width="480" height="300" fill={`url(#${u}-f)`} /></mask>
        <filter id={`${u}-sh`} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="9" floodColor="#000" floodOpacity=".6" /></filter>
      </defs>
      <g transform={`translate(${tx} ${ty}) scale(${-K} ${K})`} filter={`url(#${u}-sh)`}>
        <g mask={`url(#${u}-m)`}>
          <path d="M0 40 L170 118 L150 176 L-20 110Z" fill="#fbf7ff" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
          <path d="M150 112 L136 180" stroke="#8a7ff0" strokeWidth="20" />
          <path d="M160 116 C210 118 262 140 300 176 C318 194 300 214 278 206 L250 196 C236 204 214 206 196 196 C176 186 158 176 150 170Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
          <path d="M276 168 C300 190 314 222 312 252 C311 266 294 268 290 254 C286 232 276 212 262 196Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
          <path d="M244 184 C262 208 270 236 266 262 C264 276 246 276 244 262 C242 240 236 220 224 204Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
          <ellipse cx="302" cy="252" rx="9" ry="7" fill="#f0243f" /><ellipse cx="255" cy="262" rx="9" ry="7" fill="#f0243f" />
          <circle cx="146" cy="146" r="9" fill="#ff5fa2" />
        </g>
      </g>
      {/* where her nails press: two small dents in the box's top edge (only while resting) */}
      {pose === 2 && (
        <g fill="none" stroke="#2a0f28" strokeWidth="3" opacity=".7">
          <path d={`M${TIP_X - 18} ${TIP_Y + 12} q18 8 36 0`} />
          <path d={`M${TIP_X + 43} ${TIP_Y + 25} q18 8 36 0`} />
        </g>
      )}
    </svg>
  );
}
