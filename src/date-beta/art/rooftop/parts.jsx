// Shared parts of the two school-rooftop plates (Noon = ref 05, Warm = ref 07; research/sprint-0930/scene-a/).
// The vtracer plate is an <image> (public/date-beta/trace/rooftop-*.svg). Everything the trace smears is redrawn here:
// fence, stairwell box, antenna, tile joints, far skyline, and the Figur clock tower from the goal card in the distance.
// Still art: no timers, no animation (reduced motion first).
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';

export { preloadTrace };

export function RoofSvg({ id, label, children }) {
  return (
    <div className={`art sa-roof sa-${id}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label} style={{ width: '100%', height: '100%', display: 'block' }}>
        <image href={traceUrl(id)} width="1920" height="1080" preserveAspectRatio="none" />
        {children}
      </svg>
    </div>
  );
}

// The Figur clock tower (Rooftop.jsx, the goal card) boiled down to its silhouette: lavender spire with gold finials,
// pink crown with dark slots, gold-framed clock, belfry arches. Local origin = spire base centre; ~540 wide at s = 1.
// Hands are fixed (h, m): noon = both up. `haze` = group opacity, so the sky shows through like air, not like glass.
export function FigurTower({ x, y, s = 0.15, h = 12, m = 0, haze = 0.78, tint = 'day' }) {
  const warm = tint === 'warm';
  const c = warm
    ? { spL: '#d9b2c8', spD: '#9c7aa6', crown: '#f6c6c6', crownD: '#b98096', body: '#f1c4c8', bodyD: '#b58398', gold: '#e8b35a', slot: '#5d3a5a', face: '#fff1dc' }
    : { spL: '#c3b1e3', spD: '#8e7cc0', crown: '#f3cfe6', crownD: '#b77aa6', body: '#f4d2ea', bodyD: '#c98fbb', gold: '#d6a93f', slot: '#653f61', face: '#fbf7f1' };
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={haze} aria-hidden="true">
      <polygon points="-205,0 185,0 0,-245" fill={c.spL} />
      <polygon points="185,0 312,0 0,-245" fill={c.spD} />
      {[-160, -110, -60, -10, 40, 90, 140].map((bx) => <line key={bx} x1="0" y1="-245" x2={bx} y2="0" stroke={c.spD} strokeWidth="7" />)}
      {[-205, 185, 312].map((fx) => <path key={fx} d={`M${fx - 14} 0 L${fx - 10} -34 Q${fx} -74 ${fx} -96 Q${fx} -74 ${fx + 10} -34 L${fx + 14} 0Z`} fill={c.gold} />)}
      <rect x="-220" y="-6" width="420" height="70" fill={c.crown} />
      <rect x="200" y="-6" width="118" height="70" fill={c.crownD} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-198 + i * 50} y="10" width="28" height="40" rx="14" fill={c.slot} />)}
      <rect x="-190" y="64" width="360" height="560" fill={c.body} />
      <rect x="170" y="64" width="140" height="560" fill={c.bodyD} />
      <rect x="-152" y="92" width="284" height="284" fill={c.gold} />
      <circle cx="-10" cy="234" r="120" fill={c.face} />
      <g transform="translate(-10 234)" stroke="#3b3350" strokeLinecap="round">
        <line x1="0" y1="0" x2="0" y2="-66" strokeWidth="16" transform={`rotate(${ha})`} />
        <line x1="0" y1="0" x2="0" y2="-100" strokeWidth="10" transform={`rotate(${ma})`} />
      </g>
      {[-150, -45, 60].map((ax) => <path key={ax} d={`M${ax} 624 V470 a45 45 0 0 1 90 0 V624Z`} fill={c.slot} opacity=".85" />)}
    </g>
  );
}

// Floor tile joints in one-point perspective: rows spaced by 1/depth, rails radiating from the vanishing point.
// clip = the floor polygon (keeps joints off the parapet and the stairwell box).
export function TileJoints({ id, vp, y0, clip, ink, cols = 24, step = 55, op = 0.4 }) {
  const [vx, vy] = vp;
  const rows = [];
  for (let d = y0 - vy; vy + d < 1100; d *= 1.32) rows.push(vy + d);
  const xs = [];
  for (let i = -cols; i <= cols; i++) xs.push(vx + i * step);
  return (
    <g aria-hidden="true">
      <clipPath id={`${id}-floor`}><polygon points={clip} /></clipPath>
      <g clipPath={`url(#${id}-floor)`} stroke={ink} fill="none" opacity={op} strokeLinecap="round">
        {rows.map((y, i) => <line key={`r${i}`} x1="-200" y1={y} x2="2120" y2={y} strokeWidth={1.2 + i * 0.7} />)}
        {xs.map((bx, i) => {
          // a rail through (bx, y0) from the vanishing point, extended to the bottom edge
          const t = (1100 - vy) / (y0 - vy);
          return <line key={`c${i}`} x1={vx} y1={vy} x2={vx + (bx - vx) * t} y2="1100" strokeWidth="2.2" />;
        })}
      </g>
    </g>
  );
}

// Soft edge shade, static.
export function Vignette({ id, color, op }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      <radialGradient id={`${id}-vig`} cx=".5" cy=".46" r=".78">
        <stop offset=".6" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor={color} stopOpacity={op} />
      </radialGradient>
      <rect width="1920" height="1080" fill={`url(#${id}-vig)`} />
    </g>
  );
}
