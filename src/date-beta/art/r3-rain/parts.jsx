// Shared hand-pass parts for the R3 rain walk + her street ("Shinkai-lite flat cel", scenes-r3 PLAN.md "Art style").
// No animation: rain = 2 static streak layers swapped on the stepped clock (>= 600 ms a pose); reduced motion = layer A.
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { rng, useStep } from '../util.js';
import { TOD } from './tokens.js';
import { Wash } from '../r3-station/parts.jsx';
import './r3-rain.css';

export { preloadTrace };

// ---- perspective: every wing line runs on a ray from the vanishing point, so hand-built wings meet the trace.
export const along = (vp, p, t) => [vp[0] + (p[0] - vp[0]) * t, vp[1] + (p[1] - vp[1]) * t];
export const pts = (list) => list.map((p) => p.map((v) => Math.round(v)).join(',')).join(' ');
// depths evenly spaced in the world (1/t), from the far t0 out to past the frame edge
export const depths = (t0, n, step) => Array.from({ length: n }, (_, k) => 1 / (1 / t0 - k * step)).filter((t) => t > 0 && t < 4);

// ---- the grade: G1's static wash + vignette (shared token, shared formula: no flare, no sparkles, no motion)
export const CelGrade = ({ id, tod }) => <Wash id={id} tone={tod} />;

// ---- rain: two seeded streak layers, built once; the pose picks which one is visible
const LAYERS = new Map();
function streaks(seed, n, slant, len) {
  const key = `${seed}/${n}/${slant}/${len}`;
  if (!LAYERS.has(key)) {
    const r = rng(seed);
    LAYERS.set(key, Array.from({ length: n }, () => {
      const x = r() * 2000 - 40, y = r() * 1120 - 40, l = len * (0.6 + r() * 0.8);
      return `M${x | 0} ${y | 0}l${(-l * slant) | 0} ${l | 0}`;
    }).join(''));
  }
  return LAYERS.get(key);
}
// hole = [x, y, w, h]: a dry area (under an eave) the streaks skip, so a sign there stays readable
export function RainLayers({ tod, n = 170, slant = 0.12, len = 70, width = 2.2, rm, k = 1, hole = null }) {
  const t = TOD[tod];
  const pose = useStep(2, 5, !rm); // 5 ticks x 125 ms = 625 ms a pose (>= 600 ms), none under reduced motion
  const [c, o] = t.rain ?? ['#dfe8f5', 0.3];
  const mid = hole ? `r3-dry-${hole.join('-')}` : null;
  return (
    <g className="r3-rain" aria-hidden="true" pointerEvents="none" stroke={c} strokeWidth={width} strokeLinecap="round" opacity={o * k} mask={mid ? `url(#${mid})` : undefined}>
      {mid && <defs><mask id={mid} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><rect width="1920" height="1080" fill="#fff" /><rect x={hole[0]} y={hole[1]} width={hole[2]} height={hole[3]} fill="#000" /></mask></defs>}
      <path d={streaks(11, n, slant, len)} visibility={pose === 0 ? 'visible' : 'hidden'} />
      {!rm && <path d={streaks(29, n, slant, len)} visibility={pose === 1 ? 'visible' : 'hidden'} />}
    </g>
  );
}

// ---- wet ground: vertical reflection bands under a light / a lit window, and mirrored dark puddles
export function WetBand({ x, y, w, h, c, o = 0.5, seed = 1 }) {
  // a broken vertical streak: horizontal slices stacked down, narrowing + fading (ripples break the mirror image)
  const r = rng(seed + (x | 0));
  const n = Math.max(4, Math.round(h / 22));
  return (
    <g fill={c}>
      {Array.from({ length: n }, (_, i) => {
        const k = i / n, sw = w * (0.45 + r() * 0.55) * (1 - k * 0.5), sh = (h / n) * (0.45 + r() * 0.3);
        return <rect key={i} x={x - sw / 2 + (r() - 0.5) * w * 0.2} y={y + (i * h) / n} width={sw} height={sh} rx={sh / 2} opacity={o * (1 - k * 0.85)} />;
      })}
    </g>
  );
}
// a puddle: a flat darker ellipse-ish shape with a thin light rim (the sky mirrored in it)
export function Puddle({ x, y, rx, ry, c = '#141a2c', rim = '#9fb0cc', sky = null }) {
  return (
    <g>
      <path d={`M${x - rx} ${y} C${x - rx} ${y - ry} ${x - rx * 0.2} ${y - ry * 1.1} ${x + rx * 0.3} ${y - ry * 0.9} C${x + rx} ${y - ry * 0.7} ${x + rx * 1.05} ${y + ry * 0.4} ${x + rx * 0.4} ${y + ry} C${x - rx * 0.2} ${y + ry * 1.2} ${x - rx} ${y + ry * 0.6} ${x - rx} ${y}Z`}
        fill={c} opacity=".78" stroke={rim} strokeOpacity=".5" strokeWidth="2" />
      {sky && <ellipse cx={x + rx * 0.1} cy={y - ry * 0.15} rx={rx * 0.55} ry={ry * 0.35} fill={sky} opacity=".32" />}
    </g>
  );
}

// ---- lights: flat warm window with a soft glow; a street lamp head with its pool
export function Win({ x, y, w, h, tod, frame = null, o = 1 }) {
  const t = TOD[tod];
  return (
    <g opacity={o}>
      <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 1.1} ry={h * 1.1} fill={`url(#r3-glow-${tod})`} />
      <rect x={x} y={y} width={w} height={h} fill={t.win} />
      {frame && <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h * 0.5}h${w}`} stroke={frame} strokeWidth={Math.max(2, w * 0.05)} />}
    </g>
  );
}
export function Lamp({ x, y, r = 16, tod, pool = 0, poolY = 0 }) {
  const t = TOD[tod];
  return (
    <g>
      <circle cx={x} cy={y} r={r * 6} fill={`url(#r3-glow-${tod})`} />
      <ellipse cx={x} cy={y} rx={r * 1.4} ry={r * 0.7} fill={t.lamp} />
      {pool > 0 && <ellipse cx={x} cy={poolY} rx={pool} ry={pool * 0.22} fill={t.glow} opacity=".2" />}
    </g>
  );
}
// stars: seeded 4-point glints + dots, only in the given sky polygon (clipPath)
const STAR = 'M0 -1L.2 -.2L1 0L.2 .2L0 1L-.2 .2L-1 0L-.2 -.2Z';
export function Stars({ id, clip, n = 90, seed = 5, h = 520 }) {
  const r = rng(seed);
  return (
    <g clipPath={`url(#${id})`}>
      <defs><clipPath id={id}><polygon points={clip} /></clipPath></defs>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * 1920, y = r() * h, s = r();
        return s > 0.9 ? <path key={i} d={STAR} transform={`translate(${x | 0} ${y | 0}) scale(${(7 + s * 6) | 0})`} fill="#fff8e8" opacity=".9" />
          : <circle key={i} cx={x | 0} cy={y | 0} r={s > 0.6 ? 2.4 : 1.5} fill="#eef2ff" opacity={0.45 + s * 0.4} />;
      })}
    </g>
  );
}

// ---- a cel tree canopy: leafy clusters (jagged polygons) in 3 flat tones: dark mass, mid clusters up-left, light tips
function leafy(r, cx, cy, rx, ry, k = 18) {
  return pts(Array.from({ length: k }, (_, i) => {
    const a = (i / k) * Math.PI * 2, m = i % 2 ? 0.72 + r() * 0.12 : 0.92 + r() * 0.16;
    return [cx + Math.cos(a) * rx * m, cy + Math.sin(a) * ry * m];
  }));
}
export function Canopy({ x, y, rx, ry, seed = 3, tones = ['#1f3a36', '#2d5249', '#3f6b5a'], n = 16 }) {
  const r = rng(seed);
  const cl = Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r());
    return [x + Math.cos(a) * rx * d * 0.78, y + Math.sin(a) * ry * d * 0.78, rx * (0.26 + r() * 0.2), ry * (0.26 + r() * 0.18)];
  });
  return (
    <g>
      {cl.map(([cx, cy, crx, cry], i) => <polygon key={`d${i}`} points={leafy(r, cx, cy, crx, cry)} fill={tones[0]} />)}
      {cl.map(([cx, cy, crx, cry], i) => <polygon key={`m${i}`} points={leafy(r, cx - crx * 0.12, cy - cry * 0.16, crx * 0.74, cry * 0.66, 14)} fill={tones[1]} />)}
      {cl.filter((_, i) => i % 3 === 0).map(([cx, cy, crx, cry], i) => <polygon key={`l${i}`} points={leafy(r, cx - crx * 0.24, cy - cry * 0.34, crx * 0.4, cry * 0.3, 12)} fill={tones[2]} />)}
    </g>
  );
}

// ---- a sign plate (our own text): flat board + JP line + EN line
export function Plate({ x, y, w, h, bg, fg, jp, en, jpSize, enSize, rx = 6, vertical = false }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={bg} />
      {vertical
        ? <text x={x + w / 2} y={y + h / 2} textAnchor="middle" writingMode="tb" letterSpacing=".08em" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize={jpSize ?? w * 0.62} fill={fg}>{jp}</text>
        : jp && <text x={x + w / 2} y={y + h * (en ? 0.5 : 0.68)} textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize={jpSize ?? h * 0.4} fill={fg}>{jp}</text>}
      {en && !vertical && <text x={x + w / 2} y={y + h * 0.84} textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize={enSize ?? h * 0.24} fill={fg} letterSpacing=".06em">{en}</text>}
    </g>
  );
}

// ---- the scene wrapper: trace <image> + hand overlay + grade (+ rain on top of the grade so it stays crisp)
export function R3Scene({ id, tod, label, rain = null, rm, children, top = null }) {
  return (
    <div className={`art rom r3 r3g23 r3-${id}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <defs>
          <radialGradient id={`r3-glow-${tod}`}>
            <stop offset="0" stopColor={TOD[tod].glow} stopOpacity=".55" /><stop offset=".45" stopColor={TOD[tod].glow} stopOpacity=".18" />
            <stop offset="1" stopColor={TOD[tod].glow} stopOpacity="0" />
          </radialGradient>
        </defs>
        <image href={traceUrl(id)} width="1920" height="1080" preserveAspectRatio="none" />
        {children}
        <CelGrade id={`r3g-${id}`} tod={tod} />
        {top}
        {rain && <RainLayers tod={tod} rm={rm} {...rain} />}
      </svg>
    </div>
  );
}
