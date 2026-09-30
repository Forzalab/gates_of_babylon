// The SANDWICH (Tony, 09-30; research/sprint-0930/sandwich/LOG.md), for the FARAWAY / establishing shots:
//   BACK  = the pure vtrace of the ref (the painterly layer, already in each scene wrapper as its <image>)
//   MID   = <Haze>: the same trace, gaussian-blurred and laid over at part opacity + a thin air wash. Its softness sits
//           halfway between the crisp front and the blobby back, so it reads as depth of field / atmosphere.
//   FRONT = crisp hand-traced cels (signs, 看板, neon, flags, lamps, landmarks), saturated for the time of day.
// Then the characters, the BOOK and the HUD (the player). A scene marks itself `.sw` so the player's focus blur
// (beta.css) only dims it: the mid layer already carries the depth, and the front must stay crisp under a line.
// Haze goes FIRST in a wrapper's children (every wrapper renders its trace <image> right before its children).
export function Haze({ id, href, blur = 3, op = 0.55, tint = '#e6eef6', wash = 0.08 }) {
  return (
    <g className="sw-mid" aria-hidden="true" pointerEvents="none">
      <filter id={`sw-hz-${id}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={blur} edgeMode="duplicate" />
      </filter>
      <image href={href} width="1920" height="1080" preserveAspectRatio="none" filter={`url(#sw-hz-${id})`} opacity={op} />
      {wash > 0 && <rect width="1920" height="1080" fill={tint} opacity={wash} />}
    </g>
  );
}

// the front's shared filters: a soft contact shadow in the scene's light, and (night) a neon bloom round the cel
export function FrontDefs({ id, dx = 0, dy = 3, blur = 3, a = 0.3, ink = '#22263e', glow = 0 }) {
  return (
    <defs>
      <filter id={`sw-f-${id}`} x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx={dx} dy={dy} stdDeviation={blur} floodColor={ink} floodOpacity={a} />
      </filter>
      {glow > 0 && (
        <filter id={`sw-g-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={glow} result="b" />
          <feColorMatrix in="b" type="saturate" values="1.6" result="c" />
          <feMerge><feMergeNode in="c" /><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      )}
    </defs>
  );
}
export const front = (id) => `url(#sw-f-${id})`;
export const neon = (id) => `url(#sw-g-${id})`;

const JP = { fontFamily: "'IPAGothic', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif", fontWeight: 700 };
const EN = { fontFamily: "'DejaVu Sans', 'Arial Black', sans-serif", fontWeight: 900 };
export const LINE = '#221c2b';
// vivid Akiba neon (saturation cranked)
export const NEON = { pink: '#ff1f8e', cyan: '#00c8ff', yellow: '#ffe100', violet: '#7b2cff', orange: '#ff5a14', green: '#12d96b', red: '#ff2238', white: '#fffdf6' };

// a vertical 縦看板 in a perspective plane (skewY = the facade slope). One glyph per cell; ー stands up in vertical text.
export function Tate({ x, y, w, text, bg, fg, rim, size = w * 0.7, skew = 0, stroke = LINE }) {
  const chars = [...text].map((c) => (c === 'ー' ? '｜' : c));
  const h = chars.length * size * 1.06 + size * 0.5;
  return (
    <g transform={`translate(${x} ${y}) skewY(${skew})`}>
      <rect width={w} height={h} rx="5" fill={bg} stroke={stroke} strokeWidth="4" />
      {rim && <rect x="6" y="6" width={w - 12} height={h - 12} rx="3" fill="none" stroke={rim} strokeWidth="3" />}
      {chars.map((c, i) => {
        const a = c.charCodeAt(0) < 128;
        return <text key={i} x={w / 2} y={size * 0.3 + (i + 0.82) * size * 1.06} textAnchor="middle" fontSize={size * (a ? 0.84 : 1)} fill={fg} style={a ? EN : JP}>{c}</text>;
      })}
    </g>
  );
}

// a horizontal board in a perspective plane; lines = [[text, size, fill?], ...] stacked from the top
export function Board({ x, y, w, h, lines, bg, rim, skew = 0, rx = 6, stroke = LINE, en = false }) {
  const tot = lines.reduce((s, [, sz]) => s + sz * 1.1, 0);
  let cy = h / 2 - tot / 2;
  return (
    <g transform={`translate(${x} ${y}) skewY(${skew})`}>
      <rect width={w} height={h} rx={rx} fill={bg} stroke={stroke} strokeWidth="5" />
      {rim && <rect x="7" y="7" width={w - 14} height={h - 14} rx={Math.max(0, rx - 2)} fill="none" stroke={rim} strokeWidth="3.5" />}
      {lines.map(([t, sz, fill], i) => { cy += sz * 1.1; return <text key={i} x={w / 2} y={cy - sz * 0.2} textAnchor="middle" fontSize={sz} fill={fill} style={en ? EN : JP}>{t}</text>; })}
    </g>
  );
}

// a のぼり flag on its pole (stands on the pavement at (x, base)); the flag faces the camera
export function Nobori({ x, base, h = 220, w = 44, text, bg, fg, pole = '#5b5e6c' }) {
  const top = base - h;
  return (
    <g>
      <rect x={x - 2} y={top - 8} width="5" height={h + 8} fill={pole} />
      <rect x={x - 2} y={top - 8} width={w + 8} height="5" fill={pole} />
      <Tate x={x + 4} y={top} w={w} text={text} bg={bg} fg={fg} size={w * 0.66} stroke={LINE} />
    </g>
  );
}

// a flat pedestrian cel (the crowd): head on the eye line `eye`, standing at `base`, a soft contact shadow under the feet
export function Walker({ x, base, eye, c = '#3b3f55', bag, flip = false, ink = '#22263e' }) {
  const h = (base - eye) / 0.92, head = h * 0.13, bw = h * 0.25;
  const top = base - h;
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <ellipse cx={x} cy={base} rx={bw * 0.8} ry={bw * 0.16} fill={ink} opacity=".3" />
      <circle cx={x} cy={top + head * 0.55} r={head * 0.55} fill="#2a2430" />
      <path d={`M${x - bw / 2} ${top + head * 1.2} h${bw} l${bw * 0.08} ${h * 0.44} h${-bw * 1.16} Z`} fill={c} />
      <rect x={x - bw * 0.4} y={top + head * 1.2 + h * 0.44} width={bw * 0.32} height={h * 0.42} fill="#2d2c38" />
      <rect x={x + bw * 0.08} y={top + head * 1.2 + h * 0.44} width={bw * 0.32} height={h * 0.42} fill="#2d2c38" />
      {bag && <rect x={x + bw * 0.5} y={top + h * 0.45} width={bw * 0.45} height={bw * 0.5} rx="3" fill={bag} />}
    </g>
  );
}
