// fx/RainOverlay.jsx: the rain overlay for outdoor rain beats (level from fx/rain.js rainOf(beat)).
// Layer order in the stage: bg -> Nanda -> <RainOverlay> (umbrella cel = BOOK layer, streak layer, screen-glass drops)
// -> GUI -> <WetGui> (wet spots, beads, pool, drips on the dialogue box / HUD ribbon / choices; never over text).
// Cel-over-vtrace: every piece here is a flat cel with a clean line, tinted by the bg's time-of-day grade (tintOf).
// Motion: streak + glass layers swap 2-3 static frames every FRAME_MS (625 ms, < 2 Hz); reduced motion = frame 0.
import { useLayoutEffect, useMemo, useState } from 'react';
import { useStep } from '../art/util.js';
import { SPEC, SLANT, framesOf, streaksFor, glassFor, tintOf, wetMarks } from './rain.js';
import './rain.css';

const W = 1920, H = 1080;

// stage-px rects of the elements matching `sel` (the stage is scaled by a transform: divide by its scale)
function rectsIn(stage, sel) {
  const sr = stage.getBoundingClientRect(), k = sr.width / W || 1;
  return [...stage.querySelectorAll(sel)].map((el) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k };
  }).filter((r) => r.w > 0 && r.h > 0);
}
// measure after layout and again once the entry animations (nanda-in 320 ms, say-in 260 ms) have settled
function useMeasure(stageRef, measure, key) {
  const [v, setV] = useState(null);
  useLayoutEffect(() => {
    // the stage ref attaches after this child's layout effect on the first mount: read it lazily
    const run = () => { const st = stageRef?.current; if (st) setV(measure(st)); };
    run();
    const f = requestAnimationFrame(run), t = setTimeout(run, 380);
    addEventListener('resize', run);
    return () => { cancelAnimationFrame(f); clearTimeout(t); removeEventListener('resize', run); };
  }, [stageRef, measure, key]);
  return v;
}

// ---- the umbrella cel over Nanda: canopy dome in front of her upper head (the rim dips over her hair = the BOOK
// layer), the shaft down beside her face into her raised hand, her hand redrawn over the shaft so she grips it.
// Geometry from her sprite box (fractions of the 460 x 496 sprite: hair top .28, hand .78/.54).
const measureNanda = (st) => rectsIn(st, '.db-nanda')[0] ?? null;
export function umbrellaGeom(n) {
  const s = n.h / 496;
  const hand = [n.x + n.w * 0.778, n.y + n.h * 0.536];
  const top = n.y + n.h * 0.284;
  const ry = top + 18 * s; // + the bow: the front rim dips ~45 px over her hair edge, above her eyes
  return { s, hand, cx: hand[0], ry, ay: ry - 190 * s, hw: 410 * s, bow: 28 * s, n: 8 };
}
function Umbrella({ g, tint, frame }) {
  const { s, cx, ay, ry, hw, bow, n, hand } = g;
  const rim = (k) => { const t = (k * Math.PI) / n; return [cx - hw * Math.cos(t), ry + bow * Math.sin(t)]; };
  const rib = (k) => { const [x, y] = rim(k); return [cx + (x - cx) * 0.9, ay + (y - ay) * 0.34]; };
  const P = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const gore = (k) => {
    const [x0, y0] = rim(k), [x1, y1] = rim(k + 1);
    return `M${cx} ${ay} Q${P(rib(k))} ${P([x0, y0])} Q${P([(x0 + x1) / 2, (y0 + y1) / 2 - 12 * s])} ${P([x1, y1])} Q${P(rib(k + 1))} ${cx} ${ay}Z`;
  };
  const dome = Array.from({ length: n }, (_, k) => gore(k)).join(' ');
  const under = `M${P(rim(0))} ${Array.from({ length: n }, (_, k) => `Q${P([(rim(k)[0] + rim(k + 1)[0]) / 2, (rim(k)[1] + rim(k + 1)[1]) / 2 + 2])} ${P(rim(k + 1))}`).join(' ')} Q${cx} ${ry + bow + 20 * s} ${P(rim(0))}Z`;
  const splash = [[-290, 40], [-180, 8], [-60, -2], [50, 6], [160, 34], [270, 72], [-230, 88], [210, 118]];
  // drops falling off the rim, a different set per frame (stepped, never tweened)
  const falls = [[0.3, 0], [7.6, 1], [1.4, 2], [6.5, 0], [4.8, 1], [2.6, 2]].filter(([, f]) => f === frame % 3);
  return (
    <g className="rn-umb">
      {/* its shadow on her hair + shoulders (light from the upper left: the shadow sits a little right) */}
      <ellipse cx={cx - 90 * s} cy={ry + 58 * s} rx={hw * 0.62} ry={52 * s} fill={tint.grade} opacity=".28" />
      <path d={`M${cx} ${ry + bow} L${hand[0]} ${hand[1]}`} stroke="#5a1f40" strokeWidth={11 * s} strokeLinecap="round" />
      <path d={`M${cx - 2 * s} ${ry + bow + 4} L${hand[0] - 2 * s} ${hand[1]}`} stroke="#c56a95" strokeWidth={3 * s} strokeLinecap="round" />
      <path d={under} fill="#6d2850" />
      {Array.from({ length: n }, (_, k) => <path key={k} d={gore(k)} fill={k % 2 ? '#fbc7db' : '#ee78a8'} stroke="#5e1240" strokeWidth={5 * s} strokeLinejoin="round" />)}
      {/* cel shade on the right flank, the lit streak on the left, then the scene grade over the whole canopy */}
      <path d={`M${cx + 60 * s} ${ay + 20 * s} Q${cx + 330 * s} ${ay + 70 * s} ${cx + hw - 6} ${ry - 4} L${cx + hw - 90 * s} ${ry + 14 * s} Q${cx + 230 * s} ${ay + 120 * s} ${cx + 60 * s} ${ay + 20 * s}Z`} fill="#5e1240" opacity=".2" />
      <path d={`M${cx - 110 * s} ${ay + 40 * s} Q${cx - 240 * s} ${ay + 96 * s} ${cx - 320 * s} ${ry - 28 * s}`} stroke="#fff" strokeWidth={9 * s} strokeLinecap="round" fill="none" opacity=".55" />
      <path d={dome} fill={tint.grade} opacity={tint.gradeO} />
      <path d={`M${cx - 6 * s} ${ay + 6 * s} L${cx} ${ay - 26 * s} L${cx + 6 * s} ${ay + 6 * s}Z`} fill="#5a1f40" />
      {splash.map(([dx, dy], i) => {
        const x = cx + dx * s, y = ay + (44 + dy + Math.abs(dx) * 0.16) * s;
        return (
          <g key={i} stroke={tint.streak} strokeWidth={4 * s} strokeLinecap="round" fill="none">
            <path d={`M${x - 11 * s} ${y + s} l${-4 * s} ${-11 * s}M${x} ${y}l0 ${-14 * s}M${x + 11 * s} ${y + s}l${4 * s} ${-11 * s}`} />
          </g>
        );
      })}
      {falls.map(([k, f]) => {
        const [x, y] = rim(k);
        return <g key={k} fill={tint.streak} opacity=".9"><ellipse cx={x} cy={y + 26 * s + f * 20 * s} rx={4 * s} ry={9 * s} /><ellipse cx={x - 3 * s} cy={y + 70 * s + f * 26 * s} rx={3 * s} ry={7 * s} /></g>;
      })}
      {/* her hand, over the shaft: the same white + pink-rim cel as her sprite */}
      <circle cx={hand[0]} cy={hand[1]} r={27 * s} fill="#fff" stroke="#d1177f" strokeWidth={6 * s} />
      <path d={`M${hand[0] - 15 * s} ${hand[1] + 2 * s} q${15 * s} ${10 * s} ${30 * s} 0`} fill="none" stroke="#ffc4e6" strokeWidth={5 * s} strokeLinecap="round" />
    </g>
  );
}
// the dry zone the streaks skip: the dome + the shelter under it, leaning with the rain
function shelterPath(g) {
  const { cx, ay, ry, hw } = g, drop = H - ry, lean = SLANT * drop;
  return `M${cx - hw - 12} ${ry + 10} Q${cx - hw * 0.7} ${ay} ${cx} ${ay - 30} Q${cx + hw * 0.7} ${ay} ${cx + hw + 12} ${ry + 10} L${cx + hw * 0.92 + lean} ${H} L${cx - hw * 0.92 + lean} ${H}Z`;
}

function Streaks({ level, frame, tint, dry }) {
  const list = streaksFor(level, frame);
  return (
    <g className="rn-streaks" mask={dry ? 'url(#rn-dry)' : undefined}>
      {list.map(([x, y, len, o, w, near], i) => (
        <line key={i} x1={x} y1={y} x2={x + SLANT * len} y2={y + len} stroke={near ? 'url(#rn-soft)' : 'url(#rn-fade)'} strokeWidth={w} strokeOpacity={o}
          strokeLinecap="round" filter={near ? 'url(#rn-blur)' : undefined} />
      ))}
      <g fill={tint.streak} opacity=".55">{list.slice(0, Math.round(list.length / 6)).map(([x, y, len], i) => <circle key={i} cx={x + 30 + (i % 7) * 13} cy={y + len * 1.4} r="1.6" />)}</g>
    </g>
  );
}

// a lens drop (refs 02-04): dark refraction rim, a pale inverted-sky crescent low inside, a hard highlight up left
function Drop({ x, y, r, k, rim }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * k} fill={rim} fillOpacity=".12" stroke={rim} strokeOpacity=".5" strokeWidth={Math.max(1.2, r * 0.14)} />
      <ellipse cx={x + r * 0.08} cy={y + r * k * 0.34} rx={r * 0.62} ry={r * k * 0.36} fill="#fff" opacity=".42" />
      <ellipse cx={x - r * 0.36} cy={y - r * k * 0.42} rx={Math.max(1.2, r * 0.2)} ry={Math.max(1, r * 0.14)} fill="#fff" opacity=".92" />
    </g>
  );
}
function Glass({ level, frame, tint }) {
  const { drops, trails } = glassFor(level, frame);
  return (
    <g className="rn-glass">
      {trails.map(([x, y0, y1, sd]) => {
        const d = `M${x} ${y0} C${x + 8} ${(y0 * 2 + y1) / 3} ${x - 10} ${(y0 + y1 * 2) / 3} ${x + (sd % 3) - 1} ${y1}`;
        return (
          <g key={sd}>
            <path d={d} fill="none" stroke={tint.rim} strokeOpacity=".28" strokeWidth="5" transform="translate(1.5 0)" />
            <path d={d} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="3" />
            {[0.2, 0.45, 0.7].map((f) => <Drop key={f} x={x + (sd % 2 ? 2 : -2)} y={y0 + (y1 - y0) * f} r={3} k={1} rim={tint.rim} />)}
            <Drop x={x + (sd % 3) - 1} y={y1 + 6} r={10} k={1.25} rim={tint.rim} />
          </g>
        );
      })}
      {drops.map(([x, y, r, k], i) => <Drop key={i} x={x} y={y} r={r} k={k} rim={tint.rim} />)}
    </g>
  );
}

export function RainOverlay({ level, bg, rm = false, umbrella = false, stageRef, beatKey }) {
  const frames = framesOf(level, rm);
  const frame = useStep(Math.max(1, frames), 5, frames > 1);
  const nanda = useMeasure(stageRef, measureNanda, `${beatKey}/${umbrella}`);
  if (!level) return null;
  const tint = tintOf(bg);
  const g = umbrella && nanda ? umbrellaGeom(nanda) : null;
  return (
    <svg className={`rn-overlay rn-${level}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" data-rain={level} data-frame={frame} data-frames={frames}>
      <defs>
        <linearGradient id="rn-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={tint.streak} stopOpacity="0" /><stop offset=".55" stopColor={tint.streak} stopOpacity=".7" /><stop offset="1" stopColor={tint.streak} /></linearGradient>
        <linearGradient id="rn-soft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={tint.streak} stopOpacity="0" /><stop offset=".5" stopColor={tint.streak} /><stop offset="1" stopColor={tint.streak} stopOpacity="0" /></linearGradient>
        <filter id="rn-blur" x="-2" y="-.2" width="5" height="1.4"><feGaussianBlur stdDeviation="5" /></filter>
        {g && <mask id="rn-dry" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}><rect width={W} height={H} fill="#fff" /><path d={shelterPath(g)} fill="#000" /></mask>}
      </defs>
      {g && <Umbrella g={g} tint={tint} frame={frame} />}
      <Streaks level={level} frame={frame} tint={tint} dry={!!g} />
      <Glass level={level} frame={frame} tint={tint} />
    </svg>
  );
}

// ---- wet GUI: measured each beat; marks placed by wetMarks (never on a text / chip / tag rect)
const AVOID = ['.db-say .line', '.db-say .who', '.hud-next', '.db-choice .line', '.db-chip', '.db-deftag', '.db-timebar', '.db-legend', '.db-stamp',
  '.hud-a .lv-badge', '.hud-a .lv-label', '.hud-a .lv-trail', '.hud-a .lv-num', '.hud-a .lv-meter', '.lv-pop'].join(',');
const measureGui = (st) => ({
  say: rectsIn(st, '.db-say')[0] ?? null, hud: rectsIn(st, '.hud-a')[0] ?? null,
  choices: rectsIn(st, '.db-choice'), avoid: rectsIn(st, AVOID),
});
const INK = '#6a1f4f';
export function WetGui({ level, stageRef, beatKey, seed = 1 }) {
  const gui = useMeasure(stageRef, measureGui, `${beatKey}/${level}`);
  const marks = useMemo(() => (level && gui ? wetMarks(gui, level, seed) : []), [gui, level, seed]);
  if (!level || !marks.length) return null;
  return (
    <svg className="rn-wet" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" data-wet={SPEC[level].wet} data-marks={marks.length}>
      {marks.map((m, i) => {
        if (m.kind === 'blotch') {
          return (
            <g key={i}>
              <ellipse cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill={INK} fillOpacity=".13" stroke={INK} strokeOpacity=".24" strokeWidth="2.5" />
              <path d={`M${m.x - m.rx * 0.55} ${m.y - m.ry * 0.2} q${m.rx * 0.2} ${-m.ry * 0.5} ${m.rx * 0.6} ${-m.ry * 0.55}`} stroke="#fff" strokeOpacity=".6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          );
        }
        if (m.kind === 'bead') {
          return (
            <g key={i}>
              <ellipse cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill="#fff" fillOpacity=".55" stroke={INK} strokeOpacity=".55" strokeWidth="2" />
              <ellipse cx={m.x} cy={m.y + m.ry * 0.4} rx={m.rx * 0.6} ry={m.ry * 0.3} fill={INK} fillOpacity=".18" />
              <circle cx={m.x - m.rx * 0.38} cy={m.y - m.ry * 0.38} r={Math.max(1.5, m.rx * 0.2)} fill="#fff" />
            </g>
          );
        }
        if (m.kind === 'pool') {
          const hx = m.x + m.rx * 0.35;
          return (
            <g key={i}>
              <ellipse cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill="#fff" fillOpacity=".5" stroke={INK} strokeOpacity=".5" strokeWidth="2" />
              <path d={`M${hx - 6} ${m.y + m.ry - 1} Q${hx - 8} ${m.y + m.ry + 14} ${hx} ${m.y + m.ry + 18} Q${hx + 8} ${m.y + m.ry + 14} ${hx + 6} ${m.y + m.ry - 1}Z`}
                fill="#fff" fillOpacity=".7" stroke={INK} strokeOpacity=".55" strokeWidth="2" />
              <path d={`M${m.x - m.rx * 0.6} ${m.y - m.ry * 0.2} h${m.rx * 0.5}`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          );
        }
        // drip: a teardrop hanging off the ribbon's lower edge
        return (
          <g key={i}>
            <path d={`M${m.x - m.rx * 0.6} ${m.y - 2} Q${m.x - m.rx} ${m.y + m.ry * 1.3} ${m.x} ${m.y + m.ry * 2} Q${m.x + m.rx} ${m.y + m.ry * 1.3} ${m.x + m.rx * 0.6} ${m.y - 2}Z`}
              fill="#fff" fillOpacity=".72" stroke={INK} strokeOpacity=".6" strokeWidth="2" />
            <circle cx={m.x - m.rx * 0.3} cy={m.y + m.ry * 1.1} r="1.8" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
}
export default RainOverlay;
