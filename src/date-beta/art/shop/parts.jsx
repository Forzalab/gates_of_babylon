// SHOP (research/sprint-0930/shop/SHOTLIST.md + FIX-LOG.md): shared parts for every shop shot.
// One light for the whole scene: 2:00 PM, sun from the UPPER RIGHT (LIGHT below). Every lit edge is on the right/top,
// every contact shadow falls down-left (Shadow), every shot shares the SP palette tokens and the same ShopWash.
// A shot is either a vtracer trace (public/date-beta/trace/shop/<id>.svg) + a hand overlay, or (trace={null}) a clean
// hand-pass cel scene built from Tony's refs: straight verticals, one vanishing point (VP), flat cel regions.
// HUD-safe band: no sign text above y = HUD_SAFE. No animation.
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { pts } from '../r3-station/parts.jsx';
import './shop.css';

export { pts };

// the one light: key from the upper right; shadows fall this far per unit of height (down-left)
export const LIGHT = { dx: -0.3, dy: 0.12 };
export const HUD_SAFE = 140;
// the one vanishing point for every one-point shot inside the shop (eye height ~ y 330)
export const VP = [960, 330];

// shared palette tokens (all shop art)
export const SP = {
  wall: '#f5eee2', wallLo: '#e6dac8', ceil: '#fbf7ef', lamp: '#fffdf4',
  floor: '#ece4d4', floorLo: '#d9cdb8', floorLine: '#cbbda5', floorHi: '#fff8ea',
  plank: '#c99a66', plankTop: '#e2bb88', plankLo: '#8f6238', post: '#a87a4c',
  metal: '#aeb4bd', metalHi: '#eef1f5', metalLo: '#6f7680', white: '#fffdf6',
  ink: '#3a2a30', line: '#5a4640',
  cup: '#fbf8f2', cupIn: '#e9e2da', cupBand: '#ff8fb8',
  carrot: '#ff8a2a', carrotLo: '#d9621a', leaf: '#3f9a3a', leafLo: '#2a7030',
  egg: '#fff3dc', eggBrown: '#efc998', carton: '#e8dcc0',
  basket: '#2f8a4a', basketHi: '#4fb06a', basketLo: '#1d5e31',
  skin: '#fcd8c4', skinLo: '#e8b39b', skinLine: '#7a4a3a', nail: '#e0467f', nailLo: '#7a1f40',
  her: '#ffb3cf', herLo: '#e58cb0', player: '#2d3a5a', playerLo: '#1b2238', knit: '#3d6b4a', knitLo: '#2a4a34',
  red: '#d8262e', redLo: '#8a1a1a', pink: '#e0467f', navy: '#2b2a55', gold: '#f2c14e', green: '#2e8a4a',
  shade: '#4a1f24', sky: '#8cc8f2', skyHi: '#d9efff', sun: '#fff1c4',
};

// the scene grade (identical on every shop shot): warm key wash from the upper right, black point lifted ~15%,
// a light vignette (half the r3 interior strength)
export function ShopWash({ id }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <linearGradient id={`${id}-key`} x1="1" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor={SP.sun} stopOpacity=".34" />
          <stop offset=".55" stopColor={SP.sun} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-vig`} cx=".55" cy=".45" r=".78">
          <stop offset=".62" stopColor={SP.shade} stopOpacity="0" />
          <stop offset="1" stopColor={SP.shade} stopOpacity=".17" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="#2a2320" style={{ mixBlendMode: 'screen' }} opacity=".55" />
      <rect width="1920" height="1080" fill={`url(#${id}-key)`} />
      <rect width="1920" height="1080" fill={`url(#${id}-vig)`} />
    </g>
  );
}

export function ShopScene({ id, trace = id, label, cam, over, children }) {
  if (trace) preloadTrace(`shop/${trace}`);
  const sid = `shop-${id}`;
  return (
    <div className={`art r3 r3-${sid}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <g transform={cam}>
          {trace && <image href={traceUrl(`shop/${trace}`)} width="1920" height="1080" preserveAspectRatio="none" />}
          {children}
        </g>
        <ShopWash id={`r3-${sid}`} />
        {over}
      </svg>
    </div>
  );
}

// a contact shadow under something standing at (x, y): offset down-left, away from the upper-right sun
export const Shadow = ({ x, y, w, h = w * 0.16, op = 0.28 }) => (
  <ellipse cx={x + w * LIGHT.dx * 0.5} cy={y + h * 0.25} rx={w / 2} ry={h / 2} fill={SP.shade} opacity={op} />
);

// A flat sign card: a board with 1..n centred lines. lines = [[text, size, fill?, cls?], ...]
export function Card({ x, y, w, h, fill = SP.white, stroke = '#2b2a33', sw = 5, r = 8, rot = 0, lines = [], cls = 'shop-sign', ink = '#2b2a33' }) {
  const total = lines.reduce((a, l) => a + l[1] * 1.08, 0);
  let yy = y + (h - total) / 2;
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={sw} />
      {lines.map(([t, s, f = ink, c = cls], i) => {
        yy += s * 1.08;
        return <text key={i} x={x + w / 2} y={yy - s * 0.18} textAnchor="middle" fontSize={s} fill={f} className={c}>{t}</text>;
      })}
    </g>
  );
}

// A price card in the supermarket style: white card, red label strip, big red price. Clipped to a plank lip.
export function Price({ x, y, w = 330, h = 150, label, price, note }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={SP.white} stroke="#3b3a40" strokeWidth="4" />
      <rect x={x} y={y} width={w} height={h * 0.3} rx="6" fill="#e8363c" />
      <text x={x + w / 2} y={y + h * 0.24} textAnchor="middle" fontSize={h * 0.2} fill="#fff" className="shop-jp">{label}</text>
      <text x={x + w - 16} y={y + h * 0.86} textAnchor="end" fontSize={h * 0.5} fill="#d81e2a" className="shop-price">{price}</text>
      {note && <text x={x + 14} y={y + h * 0.84} fontSize={h * 0.16} fill="#3b3a40" className="shop-sign">{note}</text>}
    </g>
  );
}

// THE cup (the three-cups gag): one drawing, used everywhere, always identical. (x, y) = the base centre on its surface.
// s = scale (s 1 = 100 px wide). Rim ellipse = the eye-level view; the shadow falls down-left.
export function Cup({ x, y, s = 1, shadow = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {shadow && <ellipse cx="-14" cy="3" rx="50" ry="9" fill={SP.shade} opacity=".26" />}
      <path d="M-50 -96 L-40 -12 Q0 6 40 -12 L50 -96 Z" fill={SP.cup} stroke={SP.line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M30 -94 L22 -14 Q32 -12 40 -12 L50 -96 Z" fill="#fff" opacity=".9" />
      <path d="M-47 -66 L47 -66 L45.3 -52 L-45.3 -52 Z" fill={SP.cupBand} />
      <ellipse cx="0" cy="-96" rx="50" ry="12" fill={SP.cupIn} stroke={SP.line} strokeWidth="4" />
      <path d="M0 -30 C-7 -37 -13 -31 -7 -25 L0 -19 L7 -25 C13 -31 7 -37 0 -30Z" fill={SP.pink} />
    </g>
  );
}

// the carrot (one colour everywhere: SP.carrot). (x, y) = the tip; len along angle a (deg, 0 = pointing right)
export function Carrot({ x, y, len = 120, a = -30 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d={`M0 0 L${-len} ${-len * 0.13} Q${-len - 8} 0 ${-len} ${len * 0.13} Z`} fill={SP.carrot} stroke={SP.carrotLo} strokeWidth="3" strokeLinejoin="round" />
      {[0.35, 0.6, 0.8].map((t) => <path key={t} d={`M${-len * t} ${-len * 0.1 * (1 - t * 0.8)} l6 5`} stroke={SP.carrotLo} strokeWidth="3" />)}
      <path d={`M${-len} 0 l-34 -18 M${-len} 0 l-40 0 M${-len} 0 l-32 18`} stroke={SP.leaf} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

// an egg pack (clear lid, 2 x 5 eggs), seen from 3/4 above. (x, y) = the front-bottom centre; w = width
export function EggPack({ x, y, w = 240, brown = false }) {
  const h = w * 0.42, d = w * 0.22;
  return (
    <g transform={`translate(${x - w / 2} ${y - h})`}>
      <rect x="0" y={d} width={w} height={h - d} rx="6" fill={SP.carton} stroke={SP.line} strokeWidth="3" />
      <polygon points={pts([[0, d], [w * 0.06, 0], [w * 1.06, 0], [w, d]])} fill="#f4efe4" stroke={SP.line} strokeWidth="3" />
      {[0, 1].map((r) => [0, 1, 2, 3, 4].map((c) => (
        <ellipse key={`${r}${c}`} cx={w * 0.14 + c * w * 0.19 + (1 - r) * w * 0.03} cy={d * (0.35 + r * 0.55)} rx={w * 0.075} ry={d * 0.34}
          fill={brown ? SP.eggBrown : SP.egg} stroke={SP.line} strokeWidth="2" />
      )))}
      <rect x={w * 0.12} y={d + (h - d) * 0.28} width={w * 0.76} height={(h - d) * 0.44} rx="4" fill={SP.gold} />
      <text x={w / 2} y={d + (h - d) * 0.62} textAnchor="middle" fontSize={(h - d) * 0.34} fill={SP.red} className="shop-jp">たまご</text>
    </g>
  );
}

// A hand (5 fingers, attached wrist + forearm + sleeve). Local frame: the wrist at (0, 0), fingers point to -y.
// pose: 'flat' (open, fingertips at y = -(96 + finger)), 'grip' (fingers wrap a bar at y = -118, tips end on its far
// edge), 'pinch' (thumb + index meet at the tip point (0, -150)). her = pink cuff + pink nails. thumb = which side.
// The tip of the middle finger in 'flat' is at (0, -170); 'grip' puts the knuckles on y = -108.
export function Hand({ x, y, rot = 0, s = 1, her = false, pose = 'flat', thumb = 'left', sleeve, press = false }) {
  const sl = sleeve ?? (her ? SP.her : SP.knit);
  const slLo = her ? SP.herLo : sleeve ? SP.playerLo : SP.knitLo;
  const ol = { stroke: SP.skinLine, strokeWidth: 3.5, strokeLinejoin: 'round' };
  const tx = thumb === 'left' ? 1 : -1;
  const fx = [-30, -10, 10, 30];
  const flen = pose === 'grip' ? [40, 44, 42, 36] : pose === 'pinch' ? [46, 70, 64, 50] : [60, 74, 70, 54];
  const fw = her ? 17 : 19;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* forearm + sleeve (runs off the frame edge) */}
      <path d="M-36 0 L-42 420 L42 420 L36 0 Z" fill={SP.skin} {...ol} />
      <path d={`M-52 ${her ? 26 : 40} L-66 520 L66 520 L52 ${her ? 26 : 40} Z`} fill={sl} stroke={slLo} strokeWidth="4" />
      {her ? <path d="M-54 26 L54 26 L55 56 L-55 56 Z" fill={SP.white} stroke={slLo} strokeWidth="4" />
        : [60, 84, 108].map((yy) => <path key={yy} d={`M-54 ${yy} L54 ${yy}`} stroke={slLo} strokeWidth="4" />)}
      {/* thumb (drawn first: it sits at the side of the palm) */}
      <path d={pose === 'grip' ? `M${-40 * tx} -26 C${-70 * tx} -44 ${-66 * tx} -86 ${-40 * tx} -104 L${-22 * tx} -92 C${-36 * tx} -76 ${-40 * tx} -56 ${-24 * tx} -40 Z`
        : pose === 'pinch' ? `M${-40 * tx} -30 C${-70 * tx} -70 ${-40 * tx} -130 ${-8 * tx} -150 L${4 * tx} -138 C${-20 * tx} -118 ${-40 * tx} -80 ${-22 * tx} -44 Z`
          : `M${-40 * tx} -26 C${-76 * tx} -50 ${-90 * tx} -86 ${-92 * tx} -116 L${-72 * tx} -122 C${-66 * tx} -92 ${-50 * tx} -68 ${-22 * tx} -50 Z`}
        fill={SP.skin} {...ol} />
      {her && pose !== 'grip' && <path d={pose === 'pinch' ? `M${-8 * tx} -150 L${4 * tx} -138 L${-4 * tx} -134 Z` : `M${-92 * tx} -116 L${-72 * tx} -122 L${-74 * tx} -110 L${-90 * tx} -106 Z`} fill={SP.nail} stroke={SP.nailLo} strokeWidth="2" />}
      {/* palm (back of the hand) */}
      <path d="M-42 0 C-50 -40 -48 -70 -44 -100 L44 -100 C48 -70 50 -40 42 0 Z" fill={SP.skin} {...ol} />
      <path d="M22 -96 L40 -96 C44 -70 46 -40 40 -4 L30 -4 C34 -40 32 -70 22 -96Z" fill="#fff" opacity=".35" />
      {/* four fingers */}
      {fx.map((f, i) => {
        const L = flen[i], top = -96 - L;
        return (
          <g key={f}>
            <path d={`M${f - fw / 2} -92 L${f - fw / 2} ${top + fw / 2} Q${f} ${top - fw / 3} ${f + fw / 2} ${top + fw / 2} L${f + fw / 2} -92 Z`} fill={SP.skin} {...ol} />
            {pose === 'grip' && <path d={`M${f - fw / 2 + 3} ${top + 14} Q${f} ${top + 20} ${f + fw / 2 - 3} ${top + 14}`} stroke={SP.skinLo} strokeWidth="3" fill="none" />}
            {her && <path d={`M${f - fw / 2 + 2} ${top + 14} L${f - fw / 2 + 2} ${top + fw / 2 - 2} Q${f} ${top - fw / 2 - 2} ${f + fw / 2 - 2} ${top + fw / 2 - 2} L${f + fw / 2 - 2} ${top + 14} Z`}
              fill={SP.nail} stroke={SP.nailLo} strokeWidth="2" />}
            {press && <path d={`M${f} ${top - 14} l0 -14`} stroke={SP.white} strokeWidth="5" strokeLinecap="round" />}
          </g>
        );
      })}
      {/* knuckle creases */}
      {fx.map((f) => <path key={`k${f}`} d={`M${f - 5} -86 q5 3 10 0`} stroke={SP.skinLo} strokeWidth="3" fill="none" />)}
    </g>
  );
}

// THE basket bed (one sprite for the end card, the react frame, the cups insert, the counter and the nails shot):
// a green shop basket seen 3/4 from above with her list inside: a carrot bag, an egg pack and the three cups.
// Local frame: (0, 0) = the centre of the basket floor; the rim is 600 wide. items = false draws it empty.
// handles: 'down' (folded on the rim) | 'up' (standing; the grip bar at y -330).
export const BASKET = { rimBack: -170, rimFront: 60, floor: 30, cupsY: 20, cupsX: [70, 170, 270], handleY: -330 };
export function BasketBed({ x, y, s = 1, rot = 0, items = true, cups = 3, handles = 'down', hand = null }) {
  const holes = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 11; c++) holes.push([-262 + c * 48 + r * 2, 86 + r * 52, 36 - r * 2, 34]);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx="-60" cy="250" rx="330" ry="36" fill={SP.shade} opacity=".24" />
      {/* inside: back wall + floor */}
      <polygon points={pts([[-270, -170], [270, -170], [300, 60], [-300, 60]])} fill={SP.basketLo} />
      <polygon points={pts([[-250, -120], [250, -120], [270, 40], [-270, 40]])} fill="#2a7442" />
      {[-200, -100, 0, 100, 200].map((xx) => <path key={xx} d={`M${xx} -165 L${xx * 1.1} 50`} stroke={SP.basket} strokeWidth="6" opacity=".6" />)}
      {items && (
        <g>
          {/* the carrot bag (back left) */}
          <Carrot x={-10} y={-60} len={210} a={16} /><Carrot x={20} y={-96} len={220} a={12} /><Carrot x={-30} y={-24} len={200} a={22} />
          {/* the egg pack (front left, tipped against the side) */}
          <EggPack x={-150} y={40} w={210} />
          {/* the three cups on the basket floor, one baseline */}
          {BASKET.cupsX.slice(0, cups).map((cx) => <Cup key={cx} x={cx} y={BASKET.cupsY} s={0.9} />)}
        </g>
      )}
      {hand}
      {/* front wall with the lattice (occludes the bottoms of everything inside) */}
      <polygon points={pts([[-300, 60], [300, 60], [262, 250], [-262, 250]])} fill={SP.basket} stroke={SP.basketLo} strokeWidth="5" />
      {holes.map(([hx, hy, hw, hh], i) => <rect key={i} x={hx} y={hy} width={hw} height={hh} rx="4" fill={SP.basketLo} />)}
      <path d="M-300 60 L300 60" stroke={SP.basketHi} strokeWidth="14" strokeLinecap="round" />
      <path d="M-270 -170 L270 -170" stroke={SP.basketHi} strokeWidth="10" strokeLinecap="round" />
      <path d="M-270 -170 L-300 60 M270 -170 L300 60" stroke={SP.basket} strokeWidth="12" strokeLinecap="round" />
      {handles === 'down'
        ? <g stroke={SP.basketLo} strokeWidth="14" fill="none" strokeLinecap="round"><path d="M-300 60 Q-340 -60 -270 -170" /><path d="M300 60 Q340 -60 270 -170" /></g>
        : <g fill="none" strokeLinecap="round">
          <path d={`M-286 -60 L-120 ${BASKET.handleY} L120 ${BASKET.handleY} L286 -60`} stroke={SP.basketLo} strokeWidth="18" strokeLinejoin="round" />
          <path d={`M-120 ${BASKET.handleY} L120 ${BASKET.handleY}`} stroke={SP.metal} strokeWidth="26" />
          <path d={`M-120 ${BASKET.handleY - 7} L120 ${BASKET.handleY - 7}`} stroke={SP.metalHi} strokeWidth="6" />
        </g>}
    </g>
  );
}

// A one-point store aisle (ref 15): shelves left + right on the SAME vanishing point VP, verticals straight, a tiled
// floor, ceiling light strips. Products = flat cel boxes on each plank.
const GOODS = ['#e8574e', '#f2c14e', '#6fb56b', '#5b8fd6', '#f08fb8', '#fff2c8', '#ff8a2a', '#b98adf'];
export function AisleVP({ vp = VP, far = 0.86 }) {
  const [vx, vy] = vp;
  const at = (e, u) => [e[0] + (vx - e[0]) * u, e[1] + (vy - e[1]) * u];
  const planks = [120, 330, 540, 750, 960];
  const us = [0, 0.18, 0.33, 0.45, 0.55, 0.63, 0.7, 0.76, 0.81, far];
  const side = (sx) => {
    const edge = (yy) => [sx, yy];
    const g = [];
    const top = edge(-40), bot = edge(1180);
    g.push(<polygon key="face" points={pts([top, at(top, far), at(bot, far), bot])} fill={SP.wallLo} />);
    planks.forEach((py, pi) => {
      const prev = pi ? planks[pi - 1] : -40;
      for (let k = 0; k < us.length - 1; k++) {
        const u0 = us[k] + 0.012, u1 = us[k + 1] - 0.012;
        const b0 = at(edge(py), u0), b1 = at(edge(py), u1);
        const t0 = at(edge(py - (py - prev) * 0.72), u0), t1 = at(edge(py - (py - prev) * 0.72), u1);
        g.push(<polygon key={`g${pi}-${k}`} points={pts([b0, b1, t1, t0])} fill={GOODS[(pi * 3 + k + (sx ? 1 : 0)) % GOODS.length]} />);
      }
      g.push(<polygon key={`p${pi}`} points={pts([edge(py), at(edge(py), far), at(edge(py + 22), far), edge(py + 22)])} fill={SP.metal} />);
      g.push(<line key={`l${pi}`} x1={sx} y1={py} x2={at(edge(py), far)[0]} y2={at(edge(py), far)[1]} stroke={SP.metalHi} strokeWidth="4" />);
    });
    us.slice(1, -1).forEach((u) => { const a = at(top, u), b = at(bot, u); g.push(<line key={`v${u}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={SP.metalLo} strokeWidth="2" opacity=".35" />); });
    return g;
  };
  const L = at([0, 1180], far), R = at([1920, 1180], far);
  return (
    <g>
      <rect width="1920" height="1080" fill={SP.ceil} />
      {/* ceiling light strips on the VP */}
      {[-600, -200, 200, 600].map((x) => <polygon key={x} points={pts([[960 + x - 60, -10], [960 + x + 60, -10], at([960 + x + 60, -10], 0.8), at([960 + x - 60, -10], 0.8)])} fill={SP.lamp} stroke={SP.wallLo} strokeWidth="3" />)}
      {/* far wall */}
      <rect x={at([0, 0], far)[0]} y={at([0, -40], far)[1]} width={at([1920, 0], far)[0] - at([0, 0], far)[0]} height={L[1] - at([0, -40], far)[1]} fill={SP.wall} />
      {/* floor */}
      <polygon points={pts([[0, 1180], L, R, [1920, 1180]])} fill={SP.floor} />
      {[0.2, 0.4, 0.55, 0.67, 0.76].map((u) => { const a = at([0, 1180], u), b = at([1920, 1180], u); return <line key={u} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={SP.floorLine} strokeWidth="3" />; })}
      {[400, 760, 1160, 1520].map((x) => { const b = at([x, 1180], far); return <line key={x} x1={x} y1="1180" x2={b[0]} y2={b[1]} stroke={SP.floorLine} strokeWidth="3" />; })}
      {/* the sun patch from the upper right (a window beyond the far end) on the floor */}
      <polygon points={pts([at([1100, 1180], 0.5), at([1500, 1180], 0.5), at([1500, 1180], 0.72), at([1100, 1180], 0.72)])} fill={SP.floorHi} opacity=".9" />
      {side(0)}{side(1920)}
    </g>
  );
}

// A face-on shelf bay (the game aisles): the wall, a wooden shelf unit with planks, and a floor band (y base..1080)
// so Nanda's feet land on the floor. Floor tile lines run to VP. children = what sits on the planks.
export function ShelfBay({ base = 880, planks = [300, 560], x0 = 60, x1 = 1860, top = 150, children, wall = SP.wall }) {
  const [vx, vy] = VP;
  return (
    <g>
      <rect width="1920" height="1080" fill={wall} />
      <rect y="0" width="1920" height="70" fill={SP.ceil} />
      <rect y="70" width="1920" height="8" fill={SP.wallLo} />
      {/* shelf unit */}
      <rect x={x0} y={top} width={x1 - x0} height={base - top} fill={SP.wallLo} />
      <rect x={x0} y={top} width={x1 - x0} height="22" fill={SP.plankLo} />
      {[x0, x1 - 26].map((x) => <rect key={x} x={x} y={top} width="26" height={base - top} fill={SP.post} />)}
      <rect x={x1 - 8} y={top} width="8" height={base - top} fill={SP.plankTop} />
      {[...planks, base - 30].map((py) => (
        <g key={py}>
          <rect x={x0} y={py} width={x1 - x0} height="10" fill={SP.plankTop} />
          <rect x={x0} y={py + 10} width={x1 - x0} height="22" fill={SP.plank} />
          <rect x={x0} y={py + 32} width={x1 - x0} height="10" fill={SP.shade} opacity=".18" />
        </g>
      ))}
      {/* floor band */}
      <rect y={base} width="1920" height={1080 - base} fill={SP.floor} />
      <rect y={base} width="1920" height="6" fill={SP.floorLo} />
      {[-400, 0, 400, 800, 1200, 1600, 2000, 2400].map((x) => {
        const t = (base - 1080) / (vy - 1080);
        return <line key={x} x1={x} y1="1080" x2={x + (vx - x) * t} y2={base} stroke={SP.floorLine} strokeWidth="3" />;
      })}
      {[960, 1010].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke={SP.floorLine} strokeWidth="3" />)}
      <polygon points={pts([[1180, base + 20], [1700, base + 20], [1560, 1080], [980, 1080]])} fill={SP.floorHi} opacity=".7" />
      {children}
    </g>
  );
}
