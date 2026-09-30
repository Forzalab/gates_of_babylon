// CURRY scene hand-pass parts (research/sprint-0930/curry/SHOTLIST.md; scenes-r3 PLAN.md "Art style": Shinkai-lite flat cel).
// No motion: steam and the TV are 2 static poses swapped on the stepped clock (5 ticks = 625 ms, >= 500 ms);
// reduced motion = pose 0 only. Screen direction: YOUR hand enters from the bottom-left, hers from the right.
import { R3Scene, preloadTrace } from '../r3-station/parts.jsx';
import { useStep } from '../util.js';
import './curry.css';

export { preloadTrace };
export { Plate } from '../r3-rain/parts.jsx';

// One light for the whole visit (2:55 -> 3:40 PM): every curry shot grades with the shared `afternoon` token.
export function CurryScene({ id, label, over = null, children }) {
  return <R3Scene id={`curry-${id}`} trace={`curry/${id}`} tone="afternoon" label={label} over={over}>{children}</R3Scene>;
}

export const usePose = (rm) => useStep(2, 5, !rm);

// static steam: 3 soft S-curves per pose, pose B shifted/curled differently (a swap, never a tween)
export function Steam({ x, y, h = 220, w = 70, rm, o = 0.5 }) {
  const pose = usePose(rm);
  const curl = (dx, k) => `M${x + dx} ${y}c${w * 0.5 * k} ${-h * 0.2} ${-w * 0.5 * k} ${-h * 0.45} 0 ${-h * 0.65}s${w * 0.4 * k} ${-h * 0.25} ${w * 0.1 * k} ${-h * 0.35}`;
  const set = (k) => [-w * 0.6, 0, w * 0.6].map((dx, i) => <path key={i} d={curl(dx, i % 2 ? -k : k)} />);
  return (
    <g className="cu-steam" fill="none" stroke="#fffaf0" strokeWidth="14" strokeLinecap="round" opacity={o} aria-hidden="true">
      <g visibility={pose === 0 ? 'visible' : 'hidden'}>{set(1)}</g>
      {!rm && <g visibility={pose === 1 ? 'visible' : 'hidden'}>{set(-0.8)}</g>}
    </g>
  );
}

// a wall / pole clock; h, m = the time it shows
export function Clock({ cx, cy, r = 50, h, m }) {
  const hand = (deg, len) => [cx + Math.sin((deg * Math.PI) / 180) * len, cy - Math.cos((deg * Math.PI) / 180) * len];
  const [hx, hy] = hand((h % 12) * 30 + m / 2, r * 0.56), [mx, my] = hand(m * 6, r * 0.8);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 7} fill="#3a2e2c" />
      <circle cx={cx} cy={cy} r={r} fill="#fbf6ea" />
      {Array.from({ length: 12 }, (_, i) => { const [x1, y1] = hand(i * 30, r - 4), [x2, y2] = hand(i * 30, r - 12); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2e2c" strokeWidth={i % 3 ? 3 : 5} />; })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#3a2e2c" strokeWidth="7" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#3a2e2c" strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#c2335a" />
    </g>
  );
}

// the door bell: a brass bell on a bracket (s = scale)
export function Bell({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 0h80" stroke="#4a3528" strokeWidth="8" strokeLinecap="round" />
      <path d="M0 0v22" stroke="#4a3528" strokeWidth="5" />
      <path d="M-30 78c0-40 8-56 30-56s30 16 30 56z" fill="#d9a441" />
      <path d="M-12 74c0-30 4-42 12-46" stroke="#f6d98a" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="-36" y="74" width="72" height="10" rx="5" fill="#b07f2c" />
      <circle cx="0" cy="92" r="9" fill="#8a5f1e" />
    </g>
  );
}

// YOUR hand, from the bottom-left (school-blazer sleeve), pinching a piece of food at (x, y)
export function YourHand({ x, y, s = 1, food = '#f1dcae', edge = '#c98a45' }) {
  return (
    <g transform={`translate(0 1080) scale(${s}) translate(0 -1080)`}>
      <path d={`M-40 1120L${x - 330} ${y + 250}L${x - 170} ${y + 390}L180 1120z`} fill="#26305a" />
      <path d={`M${x - 330} ${y + 250}l160 140l-20 22l-160-140z`} fill="#e9e4d8" />
      <path d={`M${x - 320} ${y + 235}C${x - 250} ${y + 120} ${x - 150} ${y + 60} ${x - 60} ${y + 40}C${x - 10} ${y + 30} ${x + 20} ${y + 60} ${x - 20} ${y + 90}C${x - 60} ${y + 120} ${x - 110} ${y + 150} ${x - 150} ${y + 200}L${x - 175} ${y + 385}z`} fill="#f2c9a8" />
      <path d={`M${x - 150} ${y + 190}C${x - 110} ${y + 150} ${x - 80} ${y + 140} ${x - 40} ${y + 150}`} stroke="#d59f80" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M${x - 70} ${y + 10}l${130} -60l60 70l-120 70z`} fill={food} stroke={edge} strokeWidth="8" strokeLinejoin="round" />
      <path d={`M${x - 10} ${y - 5}l40 -15M${x + 30} ${y + 30}l30 -12`} stroke={edge} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x - 90} ${y + 45}C${x - 60} ${y - 10} ${x - 20} ${y - 20} ${x + 10} ${y + 5}C${x - 10} ${y + 40} ${x - 50} ${y + 60} ${x - 90} ${y + 60}z`} fill="#f2c9a8" stroke="#d59f80" strokeWidth="4" />
    </g>
  );
}
