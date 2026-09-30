// T1b INTERIORS shared kit: a pinhole camera for the hand overlay (so every hand-drawn prop sits in the trace's
// one-point perspective), the trace <image> loader, and the Your-Name grade with a horror-dimmed tone.
// Motion is stepped via util.useStep (>= 500 ms per pose, <= 2 Hz); under rm everything holds pose 0.
import { rng, useStep } from '../util.js';

// ---------- camera: metres -> stage px. X right, Y up (floor 0), Z depth away from the lens.
export function camera({ vx, vy, f = 1000, eye = 1.6 }) {
  const P = (X, Y, Z) => [vx + (f * X) / Z, vy - (f * (Y - eye)) / Z];
  const pts = (list) => list.map((p) => P(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
  return { P, pts, f, eye, vx, vy };
}

// convex hull of screen points (monotone chain) -> "x,y x,y"
export function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cross(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
export const ptsOf = (list) => list.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
export function inside([x, y], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// ---------- traces (vtracer SVGs in public/date-beta/trace/, 576x324 viewBox stretched to the stage)
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'date-beta/trace/';
export const traceUrl = (id) => `${BASE}${id}.svg`;
const seen = new Set();
export function preloadTrace(id) {
  if (seen.has(id) || typeof Image === 'undefined') return;
  seen.add(id);
  new Image().src = traceUrl(id);
}
export const Trace = ({ id, opacity = 1 }) => (
  <image href={traceUrl(id)} width="1920" height="1080" preserveAspectRatio="none" opacity={opacity} />
);

// ---------- the grade. horror = Your-Name dimmed: cold wash, heavy vignette, a small cold flare at the one light.
export const TONES = {
  magic: { top: '#ffb3d1', mid: '#ffd6a0', glow: '#fff0c8', shade: '#3a1f4a', wash: 0.42, vig: 0.3, flare: 1 },
  horror: { top: '#10163a', mid: '#2c3c72', glow: '#bcd6ff', shade: '#030208', wash: 0.55, vig: 0.78, flare: 0.3 },
  night: { top: '#141a48', mid: '#5a4a9a', glow: '#ffd08a', shade: '#06041a', wash: 0.4, vig: 0.55, flare: 0.6 },
};
const STAR = 'M0 -1L.16 -.16L1 0L.16 .16L0 1L-.16 .16L-1 0L-.16 -.16Z';
const PETAL = 'M0 -6C5 -6 7 0 0 7C-7 0 -5 -6 0 -6Z';

export function Grade({ id, tone = 'magic', sun = [1500, 180], sparkles = 0, petals = 0, rm, flareR = 420 }) {
  const t = TONES[tone];
  const pose = useStep(6, 4, !rm);
  const [sx, sy] = sun;
  const rs = rng(31), rp = rng(47);
  const ghosts = [0.35, 0.62, 1.2, 1.55].map((k, i) => ({ x: sx + (960 - sx) * k, y: sy + (540 - sy) * k, r: [22, 50, 16, 70][i] * (flareR / 420) }));
  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.top} /><stop offset=".6" stopColor={t.mid} stopOpacity=".55" /><stop offset="1" stopColor={t.mid} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".2" stopColor={t.glow} stopOpacity=".5" /><stop offset="1" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-ghost`}>
          <stop offset="0" stopColor={t.glow} stopOpacity=".04" /><stop offset=".8" stopColor={t.glow} stopOpacity=".18" /><stop offset="1" stopColor="#fff" stopOpacity=".26" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".5" r=".72">
          <stop offset=".45" stopColor={t.shade} stopOpacity="0" /><stop offset="1" stopColor={t.shade} stopOpacity={t.vig} />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill={`url(#${id}-wash)`} opacity={t.wash} style={{ mixBlendMode: 'soft-light' }} />
      <g style={{ mixBlendMode: 'screen' }} opacity={t.flare}>
        <circle cx={sx} cy={sy} r={flareR} fill={`url(#${id}-sun)`} opacity=".8" />
        <ellipse cx={sx} cy={sy} rx={flareR * 1.7} ry="4" fill="#fff" opacity=".3" />
        <ellipse cx={sx} cy={sy} rx={flareR * 0.7} ry="1.6" fill="#fff" opacity=".55" />
        {ghosts.map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={`url(#${id}-ghost)`} />)}
      </g>
      <rect width="1920" height="1080" fill={`url(#${id}-vig)`} />
      {sparkles > 0 && (
        <g fill="#fff" style={{ mixBlendMode: 'screen' }}>
          {Array.from({ length: sparkles }, (_, i) => {
            const x = rs() * 1920, y = rs() * 700, s = 6 + rs() * 14, on = (pose + Math.floor(rs() * 3)) % 3;
            return <path key={i} d={STAR} transform={`translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(s * (on ? 1 : 0.55)).toFixed(1)})`} opacity={on ? 0.8 : 0.28} />;
          })}
        </g>
      )}
      {petals > 0 && (
        <g fill="#ffd3ea" stroke="#f4a3cb" strokeWidth=".8">
          {Array.from({ length: petals }, (_, i) => {
            const x0 = rp() * 1920, y0 = rp() * 1080, r0 = rp() * 360, sc = 0.8 + rp() * 1.1;
            const x = (x0 + pose * 22) % 1920, y = (y0 + pose * 16) % 1080;
            return <path key={i} d={PETAL} transform={`translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(r0 + pose * 40).toFixed(0)}) scale(${sc.toFixed(2)})`} opacity=".9" />;
          })}
        </g>
      )}
    </g>
  );
}
