// r5-ume shared cel parts (research/sprint-0930/r5-ume/AUDIT.md). Cel over vtrace: every shot here pushes into the
// scene's OWN traced bg (Backdrop = the same art id, a camera crop + a lens depth of field) and lays flat cels with a
// clean line on top: her legs + shoes (her sprite's own sock / shoe / strap design, grown to close-up size), your legs
// (navy trousers, brown loafers), 5-finger hands (the shop Hand kit), her pin arm (art/nanda.js pinArmSVG).
// One light per shot (the bg's), shadows away from it. No motion.
import { ART } from '../index.js';

export const HER = { sock: '#ffffff', sockLo: '#ffe3f1', rim: '#d1177f', band: '#ff5fa2', shoe: '#5a2350', shoeHi: '#8a3a78', sole: '#2a0f22', skirt: '#8a7ff0', skirt2: '#6152cf' };
export const YOU = { pants: '#2b3350', pantsLo: '#1b2238', pantsHi: '#3d4870', loafer: '#6b3f24', loaferHi: '#9a6238', sole: '#2e1a10', sock: '#1f2436', line: '#140e18' };
export const SKIN = { skin: '#fcd8c4', lo: '#e8b39b', line: '#7a4a3a', nail: '#e0467f', nailLo: '#7a1f40', cuff: '#ffb3cf', cuffLo: '#e58cb0' };
export const INK = '#2a0f22';

// the scene's own art, pushed in: centre (x, y) at zoom z, soft by `blur` px (the lens: the cels are the focus)
export function Backdrop({ of, x = 960, y = 540, zoom = 1, blur = 0, dim = 1, props = {}, rm }) {
  const Art = ART[of];
  const z = Math.max(1, zoom);
  const cx = Math.min(1920 - 960 / z, Math.max(960 / z, x)), cy = Math.min(1080 - 540 / z, Math.max(540 / z, y));
  return (
    <div className="shot-cam" style={{ filter: blur || dim !== 1 ? `blur(${blur}px) brightness(${dim})` : undefined }}>
      <div className="shot-cam-in" style={{ transform: `translate(960px, 540px) scale(${z}) translate(${-cx}px, ${-cy}px)` }}>{Art ? <Art props={props} rm={rm} /> : null}</div>
    </div>
  );
}

// a soft contact shadow, offset away from the light (dx = its lean)
export const Contact = ({ x, y, rx, ry, dx = 0, op = 0.34, ink = '#1a0c14' }) => <ellipse cx={x + dx} cy={y} rx={rx} ry={ry} fill={ink} opacity={op} />;

// HER leg seen from the front, toes to the lens: the sprite's white sock tube + pink band + the maroon shoe with its pink
// strap, at close-up size. (x, y) = the shoe's bottom centre, w = the sock width, top = where the leg leaves the frame.
export function HerLegFront({ x, y, w = 110, top = -40, lit = -1 }) {
  const sw = w * 1.72, sh = w * 0.98, legBot = y - sh * 0.62, sb = w * 0.08;
  const shoe = `M${x - sw / 2} ${y - sh * 0.36} C${x - sw / 2} ${y - sh * 0.98} ${x - sw * 0.22} ${y - sh * 1.04} ${x} ${y - sh * 1.04} C${x + sw * 0.22} ${y - sh * 1.04} ${x + sw / 2} ${y - sh * 0.98} ${x + sw / 2} ${y - sh * 0.36} C${x + sw / 2} ${y} ${x + sw * 0.3} ${y} ${x} ${y} C${x - sw * 0.3} ${y} ${x - sw / 2} ${y} ${x - sw / 2} ${y - sh * 0.36}Z`;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={legBot - top} rx={w * 0.3} fill={HER.sock} stroke={HER.rim} strokeWidth={sb} />
      {/* cel shade on the side away from the light */}
      <rect x={lit < 0 ? x + w * 0.14 : x - w * 0.42} y={top + sb} width={w * 0.28} height={legBot - top - sb * 2} fill={HER.sockLo} />
      <rect x={x - w / 2 + sb / 2} y={top + (legBot - top) * 0.2} width={w - sb} height={w * 0.2} fill={HER.band} />
      <path d={shoe} fill={HER.shoe} stroke={HER.rim} strokeWidth={sb} strokeLinejoin="round" />
      <path d={`M${x - sw * 0.44} ${y - sh * 0.64} Q${x} ${y - sh * 0.78} ${x + sw * 0.44} ${y - sh * 0.64}`} fill="none" stroke={HER.band} strokeWidth={w * 0.13} strokeLinecap="round" />
      <ellipse cx={x + lit * sw * 0.16} cy={y - sh * 0.38} rx={sw * 0.13} ry={sh * 0.1} fill={HER.shoeHi} />
      <path d={`M${x - sw * 0.44} ${y - sh * 0.1} Q${x} ${y + sh * 0.05} ${x + sw * 0.44} ${y - sh * 0.1}`} fill="none" stroke={HER.sole} strokeWidth={w * 0.07} strokeLinecap="round" />
    </g>
  );
}

// a shoe in profile, toe to the right: (x, y) = the sole's centre on the ground; L = its length; lift (deg) = the heel up
function shoeProfile(x, y, L, H) {
  return `M${x - L * 0.46} ${y} L${x + L * 0.3} ${y} C${x + L * 0.56} ${y} ${x + L * 0.58} ${y - H * 0.78} ${x + L * 0.22} ${y - H * 0.86} L${x - L * 0.28} ${y - H} C${x - L * 0.5} ${y - H * 0.96} ${x - L * 0.52} ${y - H * 0.34} ${x - L * 0.46} ${y}Z`;
}
// HER leg walking (side view): sock tube + her shoe in profile; lift raises the heel (a step), about the toe
export function HerLegSide({ x, y, L = 150, lift = 0, top = 300, lean = 0 }) {
  const H = L * 0.46, w = L * 0.36, sb = L * 0.055;
  const ank = [x - L * 0.12, y - H * 0.9];
  return (
    <g transform={lift ? `rotate(${-lift} ${x + L * 0.36} ${y})` : undefined}>
      <path d={`M${ank[0] - w / 2} ${ank[1]} L${ank[0] - w / 2 + lean} ${top} L${ank[0] + w / 2 + lean} ${top} L${ank[0] + w / 2} ${ank[1]}Z`} fill={HER.sock} stroke={HER.rim} strokeWidth={sb} strokeLinejoin="round" />
      <path d={`M${ank[0] + w * 0.1} ${ank[1] - 6} L${ank[0] + w * 0.1 + lean * 0.9} ${top + 6}`} stroke={HER.sockLo} strokeWidth={w * 0.34} />
      <path d={`M${ank[0] - w / 2 + lean * 0.3} ${ank[1] - (ank[1] - top) * 0.72} l${w} 0`} stroke={HER.band} strokeWidth={w * 0.2} />
      <path d={shoeProfile(x, y, L, H)} fill={HER.shoe} stroke={HER.rim} strokeWidth={sb} strokeLinejoin="round" />
      <path d={`M${x - L * 0.22} ${y - H * 0.9} Q${x + L * 0.02} ${y - H * 0.55} ${x + L * 0.2} ${y - H * 0.82}`} fill="none" stroke={HER.band} strokeWidth={L * 0.06} strokeLinecap="round" />
      <path d={`M${x - L * 0.44} ${y - sb * 0.6} L${x + L * 0.34} ${y - sb * 0.6}`} stroke={HER.sole} strokeWidth={sb * 1.4} strokeLinecap="round" />
      <ellipse cx={x + L * 0.26} cy={y - H * 0.55} rx={L * 0.09} ry={H * 0.12} fill={HER.shoeHi} />
    </g>
  );
}
// YOUR leg walking (side view): navy trouser with a cuff + a brown loafer
export function YouLegSide({ x, y, L = 230, lift = 0, top = 200, lean = 0 }) {
  const H = L * 0.36, w = L * 0.52, sb = L * 0.03;
  const ank = [x - L * 0.14, y - H * 0.86];
  return (
    <g transform={lift ? `rotate(${-lift} ${x + L * 0.38} ${y})` : undefined}>
      <path d={`M${ank[0] - w * 0.3} ${ank[1] + 2} L${ank[0] + w * 0.34} ${ank[1] + 2} L${ank[0] + w * 0.3} ${ank[1] - H * 0.5}Z`} fill={YOU.sock} />
      <path d={`M${ank[0] - w / 2} ${ank[1] - H * 0.28} L${ank[0] - w / 2 + lean} ${top} L${ank[0] + w / 2 + lean} ${top} L${ank[0] + w / 2 + 6} ${ank[1] - H * 0.2}Z`} fill={YOU.pants} stroke={YOU.line} strokeWidth={sb} strokeLinejoin="round" />
      <path d={`M${ank[0] + w * 0.16} ${ank[1] - H * 0.4} L${ank[0] + w * 0.16 + lean} ${top}`} stroke={YOU.pantsHi} strokeWidth={w * 0.1} opacity=".7" />
      <path d={`M${ank[0] - w / 2} ${ank[1] - H * 0.28} L${ank[0] + w / 2 + 6} ${ank[1] - H * 0.2}`} stroke={YOU.pantsLo} strokeWidth={H * 0.16} />
      <path d={shoeProfile(x, y, L, H)} fill={YOU.loafer} stroke={YOU.line} strokeWidth={sb * 1.2} strokeLinejoin="round" />
      <path d={`M${x - L * 0.1} ${y - H * 0.95} Q${x + L * 0.08} ${y - H * 0.7} ${x + L * 0.24} ${y - H * 0.84}`} fill="none" stroke={YOU.sole} strokeWidth={L * 0.025} />
      <path d={`M${x - L * 0.45} ${y - sb} L${x + L * 0.34} ${y - sb}`} stroke={YOU.sole} strokeWidth={sb * 3} strokeLinecap="round" />
      <ellipse cx={x + L * 0.25} cy={y - H * 0.55} rx={L * 0.07} ry={H * 0.1} fill={YOU.loaferHi} />
    </g>
  );
}

// HER open hand, palm UP, from the lower left (the pink cuff): (x, y) = the palm centre, s = scale. The fingers rise to the
// upper right, the thumb to the left. Lit from the upper left.
export function HerPalmUp({ x, y, s = 1, rot = 0, marks = null, children }) {
  const o = { stroke: SKIN.line, strokeWidth: 4, strokeLinejoin: 'round' };
  const fingers = [[-58, -150, -14, 30], [-12, -176, -6, 32], [34, -168, 4, 31], [74, -136, 14, 27]];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* forearm + the pink cuff, off the lower left */}
      <path d="M-120 60 L-420 420 L-250 520 L10 120Z" fill={SKIN.skin} {...o} />
      <path d="M-250 250 L-470 470 L-300 600 L-130 360Z" fill={SKIN.cuff} stroke={SKIN.cuffLo} strokeWidth="6" />
      <path d="M-250 250 L-130 360" stroke="#fff" strokeWidth="18" />
      {/* fingers first (the palm's heel sits over their roots) */}
      {fingers.map(([fx, fy, a, fw], i) => (
        <g key={i} transform={`rotate(${a} ${fx} -40)`}>
          <path d={`M${fx - fw / 2} -40 L${fx - fw / 2} ${fy + fw / 2} Q${fx} ${fy - fw * 0.6} ${fx + fw / 2} ${fy + fw / 2} L${fx + fw / 2} -40Z`} fill={SKIN.skin} {...o} />
          <path d={`M${fx - fw * 0.3} ${fy + fw * 1.3} q${fw * 0.3} ${fw * 0.25} ${fw * 0.6} 0 M${fx - fw * 0.3} ${fy + fw * 2.5} q${fw * 0.3} ${fw * 0.25} ${fw * 0.6} 0`} stroke={SKIN.lo} strokeWidth="3" fill="none" />
        </g>
      ))}
      {/* thumb, to the left, bent in a little */}
      <path d="M-96 10 C-150 -10 -190 -50 -206 -96 L-176 -112 C-160 -74 -128 -46 -80 -34Z" fill={SKIN.skin} {...o} />
      {/* the palm: a cupped oval, its heel toward you */}
      <path d="M-104 -46 C-110 -92 -60 -110 0 -108 C62 -106 104 -86 104 -40 C104 30 64 86 -4 90 C-70 92 -104 44 -104 -46Z" fill={SKIN.skin} {...o} />
      <path d="M-80 -36 C-50 -8 20 0 70 -30 M-60 30 C-20 10 30 20 58 44 M-40 -80 C-60 -30 -40 40 -20 70" stroke={SKIN.lo} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M-90 -60 C-96 -90 -60 -100 -30 -100" stroke="#fff" strokeWidth="8" fill="none" opacity=".5" strokeLinecap="round" />
      {marks}
      {children}
    </g>
  );
}

// a small key (brass, her heart charm + a "12" tag): (0, 0) = the bow centre, the blade to +x. s = scale.
export function Key({ x = 0, y = 0, s = 1, rot = 0, tag = true }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {tag && (
        <g>
          <path d="M-26 -8 C-60 -20 -86 -8 -104 20" fill="none" stroke="#b9913a" strokeWidth="4" />
          <path d="M-104 20 C-122 4 -146 18 -128 40 L-104 64 L-80 40 C-62 18 -86 4 -104 20Z" fill="#ff5fa2" stroke="#8a1f4f" strokeWidth="4" />
          <text x="-104" y="44" textAnchor="middle" fontFamily="Nunito Variable, Nunito, sans-serif" fontWeight="900" fontSize="22" fill="#fff">12</text>
        </g>
      )}
      <circle r="36" fill="#e7b64a" stroke="#6e4a10" strokeWidth="5" />
      <circle r="13" fill="#3a2a1a" opacity=".85" />
      <path d="M-22 -18 A28 28 0 0 1 14 -28" stroke="#fff3c4" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M30 -12 H176 V12 H150 V26 H132 V12 H116 V24 H98 V12 H30Z" fill="#e7b64a" stroke="#6e4a10" strokeWidth="5" strokeLinejoin="round" />
      <path d="M40 -4 H170" stroke="#fff3c4" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
