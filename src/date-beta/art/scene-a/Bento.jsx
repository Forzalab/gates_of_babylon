// The pink bento (refs 10 + 01 + 04; research/sprint-0930/scene-a/REF-ANALYSIS.md). Top-down 3/4: a thick pink
// rim, the front wall showing below it, rice on the left, the sides on the right. The sides (octopus sausages,
// potato salad on lettuce, kinpira) are the vtracer plate of ref 10 (public/date-beta/trace/bento-pink.svg); the
// rice, the umeboshi, the tamagoyaki, the rim and every edge are hand-drawn. Still art: no timers, no animation.
//
// <BentoBox> draws in a 1160 x 812 local box (origin top-left). Props:
//   lift:   null | 'ume' | 'tama'   that food is out of the box (the stain / the empty slot shows)
//   focus:  null | 'both' | 'ume' | 'tama'   those foods glow (static pink ring), everything else dims
//   onPick: (food) => void          optional: the umeboshi + tamagoyaki become focusable buttons (Enter/Space/click)
//   labels: { ume, tama }            button aria-labels (default 'Umeboshi' / 'Tamagoyaki')
import { rng } from '../util.js';
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { INK, Umeboshi, UmeStain, ShisoLeaf, TamaSlice, TamaLog, TamaBlock, Chopstick, Glint, HeldChopsticks } from './foods.jsx';

preloadTrace('bento-pink');

export const BOX = { w: 1160, h: 812 };
export const CAV = { x: 60, y: 58, w: 1040, h: 645 };
export const RICE = { x: 60, y: 58, w: 460, h: 645 };
export const UME = { x: 296, y: 380, r: 54 };
export const TAMA = { cell: [790, 58, 310, 262], a: [866, 214, -3], b: [1022, 222, 4], w: 148, h: 132, log: [945, 116] }; // slice centres + tilt

const PINK = { rim: '#fac5ce', rimHi: '#fff0f3', rimLo: '#eaa3b6', wall: '#d98aa3', wallLo: '#b8657f', lip: '#eeb2c3', gap: '#6e3a4c' };

function Rice({ uid }) {
  const rnd = rng(11), grains = [], sesame = [];
  for (let i = 0; i < 900; i++) {
    const x = RICE.x + 8 + rnd() * (RICE.w - 16), y = RICE.y + 8 + rnd() * (RICE.h - 16), a = rnd() * 180;
    grains.push(<ellipse key={i} cx={x} cy={y} rx="8" ry="4" transform={`rotate(${a} ${x} ${y})`} />);
  }
  // lumpy edge where the rice meets the walls: a ring of grain-sized bumps
  const bumps = [];
  for (let t = 0; t < 1; t += 0.012) {
    const per = 2 * (RICE.w + RICE.h), d = t * per;
    const [x, y] = d < RICE.w ? [RICE.x + d, RICE.y + 4] : d < RICE.w + RICE.h ? [RICE.x + RICE.w - 4, RICE.y + d - RICE.w]
      : d < 2 * RICE.w + RICE.h ? [RICE.x + RICE.w - (d - RICE.w - RICE.h), RICE.y + RICE.h - 4] : [RICE.x + 4, RICE.y + RICE.h - (d - 2 * RICE.w - RICE.h)];
    bumps.push(<circle key={t} cx={x} cy={y} r={7 + rnd() * 5} />);
  }
  for (let i = 0; i < 60; i++) {
    const x = RICE.x + 24 + rnd() * (RICE.w - 48), y = RICE.y + 24 + rnd() * (RICE.h - 48), a = rnd() * 180;
    if (Math.hypot(x - UME.x, y - UME.y) < UME.r * 1.9) continue;
    sesame.push(<ellipse key={i} cx={x} cy={y} rx="5" ry="2.6" transform={`rotate(${a} ${x} ${y})`} />);
  }
  return (
    <g>
      <radialGradient id={`${uid}-rice`} cx=".5" cy=".45" r=".7">
        <stop offset="0" stopColor="#ffffff" /><stop offset=".7" stopColor="#f7f5ef" /><stop offset="1" stopColor="#e4ddd6" />
      </radialGradient>
      <rect x={RICE.x} y={RICE.y} width={RICE.w} height={RICE.h} rx="26" fill={`url(#${uid}-rice)`} />
      <g fill="#ffffff" stroke="#ebe6dc" strokeWidth="1.3">{grains}</g>
      <g fill="#faf8f3" stroke="#ddd6cb" strokeWidth="1.4">{bumps}</g>
      <g fill="#2a2226">{sesame}</g>
    </g>
  );
}

// the plastic divider between the rice and the sides, and the dark gaps where food meets a wall
function Divider() {
  return (
    <g>
      <rect x="516" y={CAV.y} width="34" height={CAV.h} fill={PINK.gap} />
      <rect x="522" y={CAV.y - 4} width="20" height={CAV.h + 8} rx="6" fill={PINK.rim} stroke={INK} strokeWidth="3" />
      <rect x="526" y={CAV.y} width="5" height={CAV.h} fill={PINK.rimHi} opacity=".8" />
    </g>
  );
}

// Tamagoyaki cell: box floor, a green baran (the plastic grass divider) on the kinpira side, the two slices.
function TamaCell({ lift }) {
  const [cx, cy, cw, ch] = TAMA.cell;
  const baran = Array.from({ length: 13 }, (_, i) => `${cx + 6 + i * 24},${cy + ch - 12} ${cx + 18 + i * 24},${cy + ch - 34}`).join(' ');
  return (
    <g>
      <rect x={cx} y={cy} width={cw} height={ch} fill="#c77d95" />
      <rect x={cx} y={cy} width={cw} height="20" fill={PINK.gap} opacity=".55" />
      <polygon points={`${cx},${cy + ch} ${cx},${cy + ch - 12} ${baran} ${cx + cw},${cy + ch - 12} ${cx + cw},${cy + ch}`} fill="#3fae4f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {lift === 'tama' && (
        <g>{/* the slot the lifted slice left: a greasy print + two crumbs */}
          <rect x={TAMA.b[0] - TAMA.w / 2 + 6} y={TAMA.b[1] - TAMA.h / 2 + 18} width={TAMA.w - 12} height={TAMA.h - 12} rx="30" fill="#f2c24a" opacity=".14" transform={`rotate(${TAMA.b[2]} ${TAMA.b[0]} ${TAMA.b[1]})`} />
          <ellipse cx={TAMA.b[0] - 20} cy={TAMA.b[1] + 30} rx="7" ry="5" fill="#ffd95a" stroke={INK} strokeWidth="1.6" />
          <ellipse cx={TAMA.b[0] + 26} cy={TAMA.b[1] - 12} rx="5" ry="4" fill="#ffd95a" stroke={INK} strokeWidth="1.4" />
        </g>
      )}
    </g>
  );
}

function Hot({ children, on, food, onPick, label, ring }) {
  const btn = onPick ? {
    role: 'button', tabIndex: 0, 'aria-label': label, className: `sa-food sa-food-${food}`, style: { cursor: 'pointer' },
    onClick: () => onPick(food),
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(food); } },
  } : { className: `sa-food sa-food-${food}` };
  return (
    <g {...btn} data-food={food} data-hot={on ? 1 : 0}>
      {on && ring}
      {children}
    </g>
  );
}

export function BentoBox({ lift = null, focus = null, onPick, labels = {}, uid = 'bx' }) {
  const hot = (f) => focus === 'both' || focus === f;
  const dim = focus ? `url(#${uid}-dim)` : undefined;
  const [sa, sb] = [TAMA.a, TAMA.b];
  const glow = `url(#${uid}-glow)`;
  return (
    <g className="sa-bento" data-lift={lift ?? ''} data-focus={focus ?? ''}>
      <defs>
        <clipPath id={`${uid}-cav`}><rect x={CAV.x} y={CAV.y} width={CAV.w} height={CAV.h} rx="30" /></clipPath>
        <clipPath id={`${uid}-sides`}><rect x="544" y={CAV.y} width={CAV.x + CAV.w - 544} height={CAV.h} /></clipPath>
        <filter id={`${uid}-dim`}><feColorMatrix type="saturate" values=".3" />
          <feComponentTransfer><feFuncR type="linear" slope=".5" /><feFuncG type="linear" slope=".5" /><feFuncB type="linear" slope=".5" /></feComponentTransfer></filter>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16" /></filter>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={PINK.wall} /><stop offset="1" stopColor={PINK.wallLo} /></linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={PINK.rimHi} /><stop offset=".25" stopColor={PINK.rim} /><stop offset="1" stopColor={PINK.rimLo} /></linearGradient>
        <linearGradient id={`${uid}-inner`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a1422" stopOpacity=".42" /><stop offset=".12" stopColor="#3a1422" stopOpacity="0" /></linearGradient>
      </defs>
      {/* contact shadow, front wall, rim, inner lip */}
      <ellipse cx="590" cy="790" rx="600" ry="54" fill="#2a1a2a" opacity=".3" filter={`url(#${uid}-soft)`} />
      <rect x="0" y="52" width={BOX.w} height="760" rx="76" fill={`url(#${uid}-wall)`} stroke={INK} strokeWidth="5" />
      <path d="M70,780 Q580,800 1090,780" fill="none" stroke="#f6c3d2" strokeWidth="8" strokeLinecap="round" opacity=".7" />
      <rect x="0" y="0" width={BOX.w} height="760" rx="76" fill={`url(#${uid}-rim)`} stroke={INK} strokeWidth="5" />
      <rect x="36" y="34" width="1088" height="693" rx="50" fill={PINK.lip} stroke={INK} strokeWidth="3" />
      <rect x={CAV.x} y={CAV.y} width={CAV.w} height={CAV.h} rx="30" fill={PINK.gap} />

      <g clipPath={`url(#${uid}-cav)`}>
        <g filter={dim}>
          <Rice uid={uid} />
          <image href={traceUrl('bento-pink')} x="544" y={CAV.y} width={CAV.x + CAV.w - 544} height={CAV.h} preserveAspectRatio="none" clipPath={`url(#${uid}-sides)`} />
          <Divider />
          <TamaCell lift={lift} />
          {lift === 'ume' && (
            <g transform={`translate(${UME.x} ${UME.y})`}><UmeStain r={UME.r} gone /><ShisoLeaf x={UME.r * 0.55} y={UME.r * 0.2} /></g>
          )}
          {lift !== 'ume' && <g transform={`translate(${UME.x} ${UME.y})`} opacity=".7"><UmeStain r={UME.r * 0.92} /></g>}
        </g>
        {/* the rim's shadow falling into the box, over the food */}
        <rect x={CAV.x} y={CAV.y} width={CAV.w} height={CAV.h} fill={`url(#${uid}-inner)`} />
      </g>

      {lift !== 'ume' && (
        <Hot food="ume" on={hot('ume')} onPick={onPick} label={labels.ume ?? 'Umeboshi'}
          ring={<g><circle cx={UME.x} cy={UME.y} r="86" fill="#ff5fa2" opacity=".55" filter={glow} /><circle cx={UME.x} cy={UME.y} r="78" fill="none" stroke="#fff" strokeWidth="6" /></g>}>
          <g transform={`translate(${UME.x} ${UME.y})`} filter={focus && !hot('ume') ? dim : undefined}><Umeboshi r={UME.r} uid={`${uid}-u`} /></g>
        </Hot>
      )}
      <Hot food="tama" on={hot('tama')} onPick={onPick} label={labels.tama ?? 'Tamagoyaki'}
        ring={<g><rect x={TAMA.cell[0] - 4} y={TAMA.cell[1] + 2} width={TAMA.cell[2] - 2} height={TAMA.cell[3] - 22} rx="40" fill="#ff5fa2" opacity=".55" filter={glow} />
          <rect x={TAMA.cell[0] + 2} y={TAMA.cell[1] + 6} width={TAMA.cell[2] - 14} height={TAMA.cell[3] - 30} rx="36" fill="none" stroke="#fff" strokeWidth="6" /></g>}>
        <g filter={focus && !hot('tama') ? dim : undefined}>
          <g transform={`translate(${TAMA.log[0]} ${TAMA.log[1]})`}><TamaLog uid={`${uid}-tl`} /></g>
          <g transform={`translate(${sa[0]} ${sa[1]}) rotate(${sa[2]})`}><TamaSlice uid={`${uid}-ta`} w={TAMA.w} h={TAMA.h} /></g>
          {lift !== 'tama' && <g transform={`translate(${sb[0]} ${sb[1]}) rotate(${sb[2]})`}><TamaSlice uid={`${uid}-tb`} w={TAMA.w} h={TAMA.h} /></g>}
        </g>
      </Hot>

      {/* gloss: a rim streak + glints (ref 11), static */}
      <path d="M110,18 Q560,4 1040,18" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".75" />
      <path d="M18,120 Q10,380 18,640" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".5" />
      <Glint x={1060} y={22} s={18} /><Glint x={140} y={108} s={11} op={0.8} /><Glint x={470} y={640} s={9} op={0.7} />
    </g>
  );
}

// Standalone <svg> of the box for HTML layouts (the handout beat). Same props as BentoBox + className/style.
export function BentoSvg({ className = '', style, ...p }) {
  return (
    <svg className={`sa-bento-svg ${className}`} viewBox={`-20 -20 ${BOX.w + 40} ${BOX.h + 60}`} style={style} role="group" aria-label="Nanda's bento">
      <BentoBox {...p} />
    </svg>
  );
}

// ---------- full-frame shots (bg ids) ----------
// Backdrop: her lap, out of focus: a dark pleated uniform like refs 10 / 01, tinted to Nanda's lavender skirt.
function Lap({ uid }) {
  return (
    <g aria-hidden="true">
      <linearGradient id={`${uid}-lap`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#57507a" /><stop offset="1" stopColor="#2e2944" /></linearGradient>
      <rect width="1920" height="1080" fill={`url(#${uid}-lap)`} />
      {Array.from({ length: 11 }, (_, i) => (
        <polygon key={i} points={`${i * 190 - 40},0 ${i * 190 + 40},0 ${i * 210 - 10},1080 ${i * 210 - 120},1080`} fill={i % 2 ? '#3f3960' : '#6a6392'} opacity=".5" />
      ))}
    </g>
  );
}

export function BentoInsert({ props = {} }) {
  return (
    <div className="art sa-bento-shot">
      <svg viewBox="0 0 1920 1080" role="img" style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label="Nanda's pink bento: white rice with an umeboshi, two tamagoyaki slices, octopus sausages, potato salad, kinpira.">
        <Lap uid="bi" />
        <g transform="translate(960 552) rotate(-3) scale(1.16) translate(-580 -406)">
          <BentoBox uid="bi" lift={props.lift ?? null} focus={props.focus ?? null} />
        </g>
      </svg>
    </div>
  );
}

// The extreme close-up: one piece up in her chopsticks (ref 01), the box big and low, the gap it left in view.
const LIFT = {
  tama: { box: 'translate(-300 408) rotate(-4) scale(1.5)', at: [930, 370], shadow: [1250, 660, 120, 44], grip: [190, 470], hs: 1.3 },
  ume: { box: 'translate(300 330) rotate(-4) scale(1.5)', at: [860, 400], shadow: [800, 870, 120, 46], grip: [200, 560], hs: 1.3 },
};

export function BentoLift({ props = {} }) {
  const food = props.lift === 'ume' ? 'ume' : 'tama';
  const L = LIFT[food], [ax, ay] = L.at, [sx, sy, srx, sry] = L.shadow;
  return (
    <div className="art sa-bento-shot">
      <svg viewBox="0 0 1920 1080" role="img" style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label={food === 'ume' ? 'Chopsticks lift the umeboshi off the rice. A pink stain stays where it sat.' : 'Chopsticks lift a tamagoyaki slice. Its rolled layers swirl on the cut face.'}>
        <defs><filter id="bl-sh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
          <radialGradient id="bl-key" cx="0.47" cy="0.3" r=".7"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#2a1630" stopOpacity=".4" /></radialGradient></defs>
        <Lap uid="bl" />
        <g transform={L.box}><BentoBox uid="bl" lift={food} /></g>
        <rect width="1920" height="1080" fill="url(#bl-key)" />
        <ellipse cx={sx} cy={sy} rx={srx} ry={sry} fill="#2a1022" opacity=".42" filter="url(#bl-sh)" />
        {/* H1: the sticks are held: YOUR hand comes in from the lower left (the green knit sleeve off the frame edge) */}
        {food === 'tama' ? (
          <g>
            <HeldChopsticks tips={[[ax + 10, ay + 30], [ax - 10, ay - 158]]} grip={L.grip} s={L.hs}>
              <g transform={`translate(${ax} ${ay}) rotate(-6)`}><TamaBlock uid="bl-t" /></g>
            </HeldChopsticks>
            <Glint x={ax - 130} y={ay - 150} s={26} /><Glint x={ax + 250} y={ay - 60} s={16} op={0.8} />
          </g>
        ) : (
          <g>
            <HeldChopsticks tips={[[ax + 10, ay + 50], [ax - 20, ay - 92]]} grip={L.grip} s={L.hs}>
              <g transform={`translate(${ax} ${ay})`}><Umeboshi r={128} uid="bl-u" leaf={false} /></g>
            </HeldChopsticks>
            <Glint x={ax - 150} y={ay - 130} s={24} /><Glint x={ax + 160} y={ay - 40} s={14} op={0.8} />
          </g>
        )}
      </svg>
    </div>
  );
}

export const BentoLiftTama = ({ props = {}, rm }) => <BentoLift rm={rm} props={{ ...props, lift: 'tama' }} />;
export const BentoLiftUme = ({ props = {}, rm }) => <BentoLift rm={rm} props={{ ...props, lift: 'ume' }} />;
