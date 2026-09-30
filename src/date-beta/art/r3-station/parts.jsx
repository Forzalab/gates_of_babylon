// G1 STATION + TRAIN (scenes-r3/PLAN.md): shared parts for the traced scenes.
// - TOD: the time-of-day palette tokens (afternoon | overcast | rain-dusk | bluehour | night), one wash per token, so
//   neighbouring beats grade the same way (4:30 station = overcast, 4:40 train = afternoon, 5:20 on = rain-dusk).
// - R3Scene: traced SVG <image> (public/date-beta/trace/<id>.svg) + the hand overlay + a STATIC wash + vignette.
//   No Grade() here: it twinkles, and G1 has no animation.
// - RainPair: rain = 2 static streak layers swapped every 750 ms (>= 600 ms); reduced motion = layer 0 only.
// Nanda stands in x 730-1190, y 424-920 (beta.css .db-nanda); the dialogue box covers about x 260-1660, y 800-1016.
import { rng, useStep } from '../util.js';
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import './r3.css';

export { preloadTrace };

export const TOD = {
  afternoon: { top: '#ffd9a0', bottom: '#ffb98a', top_op: 0.16, bottom_op: 0.1, shade: '#4a1f24', vig: 0.34, window: '#fff1c4', glow: '#ffe7a8' },
  overcast: { top: '#c7d2da', bottom: '#8fa1ae', top_op: 0.22, bottom_op: 0.08, shade: '#1d2a36', vig: 0.3, window: '#fff3cf', glow: '#fff1c4' },
  'rain-dusk': { top: '#56637a', bottom: '#2a3246', top_op: 0.22, bottom_op: 0.18, shade: '#0c1220', vig: 0.46, window: '#ffd98a', glow: '#ffcf7a', rain: '#dbe6ff' },
  bluehour: { top: '#2b3f7a', bottom: '#f2a26b', top_op: 0.3, bottom_op: 0.12, shade: '#0b1030', vig: 0.44, window: '#ffd27a', glow: '#ffc26a' },
  night: { top: '#0d1433', bottom: '#1c2450', top_op: 0.36, bottom_op: 0.2, shade: '#03050f', vig: 0.55, window: '#ffd27a', glow: '#ffb85a' },
};

// static grade: a top-to-bottom tone wash + a vignette (ids unique per scene: several scenes can be mounted at once)
export function Wash({ id, tone }) {
  const t = TOD[tone];
  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.top} stopOpacity={t.top_op} />
          <stop offset=".55" stopColor={t.top} stopOpacity="0" />
          <stop offset="1" stopColor={t.bottom} stopOpacity={t.bottom_op} />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".5" r=".75">
          <stop offset=".6" stopColor={t.shade} stopOpacity="0" />
          <stop offset="1" stopColor={t.shade} stopOpacity={t.vig} />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill={`url(#${id}-wash)`} />
      <rect width="1920" height="1080" fill={`url(#${id}-vig)`} />
    </g>
  );
}

export function R3Scene({ id, trace = id, tone, label, rm, children }) {
  return (
    <div className={`art r3 r3-${id}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <image href={traceUrl(trace)} width="1920" height="1080" preserveAspectRatio="none" />
        {children}
        <Wash id={`r3-${id}`} tone={tone} rm={rm} />
      </svg>
    </div>
  );
}

// seeded streaks inside a box: slant = dx per unit length (rain falls slightly left)
function streaks(seed, n, [x, y, w, h], len, slant) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < n; i++) {
    const x1 = x + r() * w, y1 = y + r() * h, l = len[0] + r() * (len[1] - len[0]);
    d += `M${x1.toFixed(0)} ${y1.toFixed(0)}l${(-l * slant).toFixed(1)} ${l.toFixed(0)}`;
  }
  return d;
}

// two static layers; pose = which one shows. clip = optional clipPath id (rain on the window glass only).
export function RainPair({ seed = 11, n = 120, box = [0, 0, 1920, 1080], len = [30, 70], slant = 0.18, color = '#dbe6ff', opacity = 0.4, width = 2, clip, rm }) {
  const pose = useStep(2, 6, !rm); // 6 ticks x 125 ms = 750 ms per layer
  const layers = [streaks(seed, n, box, len, slant), streaks(seed + 57, n, box, len, slant)];
  return (
    <g className="r3-rain" clipPath={clip ? `url(#${clip})` : undefined} aria-hidden="true">
      {layers.map((d, i) => (
        <path key={i} d={d} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity} visibility={(rm ? 0 : pose) === i ? 'visible' : 'hidden'} />
      ))}
    </g>
  );
}

// a straight pole (verticals straightened in the hand pass): body + a lit edge
export const Pole = ({ x, y0, y1, w = 12, fill = '#8d8f98', hi = '#e8e6ea', lit = 'right' }) => (
  <g>
    <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill={fill} />
    <rect x={lit === 'right' ? x + w / 2 - Math.max(2, w / 4) : x - w / 2} y={y0} width={Math.max(2, w / 4)} height={y1 - y0} fill={hi} />
  </g>
);

// points helper: [[x,y],...] -> "x,y x,y"
export const pts = (a) => a.map(([x, y]) => `${x},${y}`).join(' ');
