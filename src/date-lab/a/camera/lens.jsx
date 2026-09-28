// Optical layers for the camera pieces: lens flare (ghosts along the light->centre axis), bokeh petals, raindrops on the lens,
// bloom. All screen-space unless noted. Drawn motion (petal fall) steps on the 8 fps grid with >= 500 ms holds.
import { rng } from '../../../date-beta/art/util.js';
import { parallax } from '../kit/Camera.jsx';
import { camTransform, stepAt, clamp } from '../kit/time.js';

const HEX = (r) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');

// A flare from a light at screen (lx, ly). Ghosts sit on the line from the light through frame centre (real lens optics).
export function Flare({ lx, ly, strength = 1, ghost = 'hex', tint = '#ffe2b0', uid = 'f' }) {
  const off = Math.max(0, Math.hypot(Math.max(0, -lx, lx - 1920), Math.max(0, -ly, ly - 1080)));
  const a = clamp(strength * (1 - off / 420));
  if (a <= 0.01) return null;
  const G = [[0.32, 38, '#ffd9a8', 0.22], [0.62, 76, '#ff9ad0', 0.14], [0.98, 26, '#a8d8ff', 0.26], [1.35, 120, '#ffe9c9', 0.08], [1.7, 52, '#ff5fa2', 0.12]];
  return (
    <svg className="fg flare" viewBox="0 0 1920 1080" style={{ opacity: a }} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-core`}><stop offset="0" stopColor="#fff" stopOpacity="1" /><stop offset=".25" stopColor={tint} stopOpacity=".7" /><stop offset="1" stopColor={tint} stopOpacity="0" /></radialGradient>
        <linearGradient id={`${uid}-streak`} x1="0" x2="1"><stop offset="0" stopColor={tint} stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor={tint} stopOpacity="0" /></linearGradient>
      </defs>
      <circle cx={lx} cy={ly} r="260" fill={`url(#${uid}-core)`} />
      <ellipse cx={lx} cy={ly} rx="1100" ry="5" fill={`url(#${uid}-streak)`} />
      {G.map(([f, r, c, o], i) => {
        const gx = 960 + (960 - lx) * f, gy = 540 + (540 - ly) * f;
        return ghost === 'heart'
          ? <path key={i} transform={`translate(${gx} ${gy}) scale(${r / 11})`} d="M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z" fill={c} opacity={Math.min(0.4, o * 2)} />
          : <polygon key={i} points={HEX(r)} transform={`translate(${gx} ${gy})`} fill={c} opacity={o} />;
      })}
    </svg>
  );
}

// Out-of-focus foreground petals on a near plane (depth > 1), falling in held steps.
export function Petals({ pose, t, rm, depth = 1.9, blur = 7, n = 16, seed = 5, colour = '#f6b3d8' }) {
  const rnd = rng(seed);
  const p = parallax(pose, depth);
  const step = rm ? 0 : stepAt(t, 1000, 500);
  const items = Array.from({ length: n }, () => ({ x: rnd() * 2400 - 240, y: rnd() * 1500 - 300, r: 18 + rnd() * 44, a: rnd() * 180 }));
  return (
    <div className="fg" style={{ transform: camTransform(p), filter: `blur(${blur}px)` }} aria-hidden="true">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">
        {items.map((it, i) => {
          const y = ((it.y + step * (22 + (i % 3) * 10) + 300) % 1500) - 300;
          return <ellipse key={i} cx={it.x + step * 6} cy={y} rx={it.r} ry={it.r * 0.62} transform={`rotate(${it.a + step * 20} ${it.x} ${y})`} fill={colour} opacity=".8" />;
        })}
      </svg>
    </div>
  );
}

// Raindrops sitting on the lens (screen-fixed): refractive dots with a bright rim. Static; RM identical.
export function LensRain({ seed = 9, n = 26, opacity = 0.9 }) {
  const rnd = rng(seed);
  return (
    <svg className="fg lensrain" viewBox="0 0 1920 1080" style={{ opacity }} aria-hidden="true">
      <defs>
        <radialGradient id="lr-drop" cx=".4" cy=".35"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".45" stopColor="#bcd6ff" stopOpacity=".12" /><stop offset=".85" stopColor="#0a1030" stopOpacity=".18" /><stop offset="1" stopColor="#dfe9ff" stopOpacity=".6" /></radialGradient>
      </defs>
      {Array.from({ length: n }, (_, i) => {
        const x = rnd() * 1920, y = rnd() * 1080, r = 6 + rnd() * 22, near = rnd() > 0.6;
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 1.12} fill="url(#lr-drop)" style={near ? { filter: 'blur(3px)' } : undefined} />;
      })}
    </svg>
  );
}

// Soft bloom blobs in SCENE coordinates (drawn inside the camera plane, so they track the art). [[x, y, rx, ry, colour]]
export function Bloom({ spots, opacity = 0.55 }) {
  return (
    <svg className="fg bloom" viewBox="0 0 1920 1080" aria-hidden="true" style={{ opacity }}>
      <defs>
        <radialGradient id="bl-g"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      {spots.map(([x, y, rx, ry, c], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c} opacity=".35" style={{ filter: 'blur(24px)' }} />
          <ellipse cx={x} cy={y} rx={rx * 0.5} ry={ry * 0.6} fill="url(#bl-g)" opacity=".5" />
        </g>
      ))}
    </svg>
  );
}
