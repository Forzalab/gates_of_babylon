// The "Your Name" cinematic grade shared by every romance scene: magic-hour gradient, warm lens flare,
// drifting sparkles + petals. Motion is stepped (useStep: one pose per 500 ms, >= 334 ms), still under reduced motion.
import { rng, useStep } from '../util.js';

export const TONES = {
  // sky wash top -> clear; glow = flare + haze colour; shade = vignette edge
  day: { top: '#ffd2e6', mid: '#ffe6c2', glow: '#fff1d0', shade: '#2a2350', wash: 0.34, vig: 0.28 },
  dusk: { top: '#7a4bb8', mid: '#ff9a6b', glow: '#ffc27a', shade: '#2b1440', wash: 0.5, vig: 0.42 },
  night: { top: '#1a1450', mid: '#ff6fb5', glow: '#ffb6e1', shade: '#070420', wash: 0.36, vig: 0.5 },
};

// 4-point star (the anime glint)
const STAR = 'M0 -1L.18 -.18L1 0L.18 .18L0 1L-.18 .18L-1 0L-.18 -.18Z';
const PETAL = 'M0 -6C5 -6 7 0 0 7C-7 0 -5 -6 0 -6Z';

export function Grade({ id, tone = 'day', sun = [1500, 180], petals = 0, sparkles = 22, rm }) {
  const t = TONES[tone];
  const pose = useStep(6, 4, !rm);
  const [sx, sy] = sun;
  const rs = rng(31), rp = rng(47);
  // ghosts sit on the line sun -> screen centre -> beyond (classic anamorphic chain)
  const ghosts = [0.35, 0.62, 1.2, 1.55, 1.9].map((k, i) => ({ x: sx + (960 - sx) * k, y: sy + (540 - sy) * k, r: [26, 60, 18, 90, 40][i], hex: i % 2 === 1 }));
  const hex = (r) => Array.from({ length: 6 }, (_, i) => `${r * Math.cos((i * Math.PI) / 3)},${r * Math.sin((i * Math.PI) / 3)}`).join(' ');
  return (
    <g className="rom-grade" aria-hidden="true" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.top} stopOpacity="1" />
          <stop offset=".55" stopColor={t.mid} stopOpacity=".55" />
          <stop offset="1" stopColor={t.mid} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".18" stopColor={t.glow} stopOpacity=".6" />
          <stop offset="1" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-ghost`}>
          <stop offset="0" stopColor={t.glow} stopOpacity=".05" />
          <stop offset=".8" stopColor={t.glow} stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity=".32" />
        </radialGradient>
        <radialGradient id={`${id}-vig`} cx=".5" cy=".48" r=".75">
          <stop offset=".55" stopColor={t.shade} stopOpacity="0" />
          <stop offset="1" stopColor={t.shade} stopOpacity={t.vig} />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill={`url(#${id}-wash)`} opacity={t.wash} style={{ mixBlendMode: 'soft-light' }} />
      <rect width="1920" height="1080" fill={`url(#${id}-wash)`} opacity={t.wash * 0.2} style={{ mixBlendMode: 'screen' }} />
      <g style={{ mixBlendMode: 'screen' }}>
        <circle cx={sx} cy={sy} r="420" fill={`url(#${id}-sun)`} opacity=".85" />
        <ellipse cx={sx} cy={sy} rx="760" ry="5" fill="#fff" opacity=".35" />
        <ellipse cx={sx} cy={sy} rx="300" ry="2" fill="#fff" opacity=".6" />
        {ghosts.map((g, i) => (g.hex
          ? <polygon key={i} points={hex(g.r)} transform={`translate(${g.x} ${g.y}) rotate(12)`} fill={`url(#${id}-ghost)`} />
          : <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={`url(#${id}-ghost)`} />))}
      </g>
      <rect width="1920" height="1080" fill={`url(#${id}-vig)`} />
      <g fill="#fff" style={{ mixBlendMode: 'screen' }}>
        {Array.from({ length: sparkles }, (_, i) => {
          const x = rs() * 1920, y = rs() * 760, s = 6 + rs() * 16, ph = Math.floor(rs() * 3);
          const on = (pose + ph) % 3; // 0 = dim, 1/2 = lit: a slow twinkle, never a full-screen flash
          return <path key={i} d={STAR} transform={`translate(${x} ${y}) scale(${s * (on ? 1 : 0.55)})`} opacity={on ? 0.85 : 0.3} />;
        })}
      </g>
      {petals > 0 && (
        <g fill="#ffd3ea" stroke="#f4a3cb" strokeWidth=".8">
          {Array.from({ length: petals }, (_, i) => {
            const x0 = rp() * 1920, y0 = rp() * 1080, r0 = rp() * 360, sc = 0.8 + rp() * 1.1;
            const x = (x0 + pose * 22) % 1920, y = (y0 + pose * 16) % 1080; // drift down-right one step per pose
            return <path key={i} d={PETAL} transform={`translate(${x} ${y}) rotate(${r0 + pose * 40}) scale(${sc})`} opacity=".9" />;
          })}
        </g>
      )}
    </g>
  );
}

// Trace + hand overlay + grade in one 1920x1080 svg. The trace is an <image> (vtracer SVG in public/date-beta/trace/).
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'date-beta/trace/';
export const traceUrl = (id) => `${BASE}${id}.svg`;
const seen = new Set();
export function preloadTrace(id) {
  if (seen.has(id) || typeof Image === 'undefined') return;
  seen.add(id);
  new Image().src = traceUrl(id);
}

export function TraceScene({ id, trace = id, label, grade, rm, children, under = null }) {
  return (
    <div className={`art rom rom-${id}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <image href={traceUrl(trace)} width="1920" height="1080" preserveAspectRatio="none" />
        {under}
        {children}
        <Grade id={`rg-${id}`} rm={rm} {...grade} />
      </svg>
    </div>
  );
}
