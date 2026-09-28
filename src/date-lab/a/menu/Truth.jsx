// menu-2 TRUTH TABLE (horror 1). School: KyoAni/Hyouka prop-detail inserts (anime) x Wes Anderson planimetric, dead-frontal
// framing (cinema) x Hitchcock's *Suspicion* glowing-milk-glass quiet wrongness (horror, dialled down to 1).
// Central theme: THE OUTPUT IS ALREADY WRITTEN. MC's lunch napkin (his truth-table habit) is taped to her door, Unit 12.
// You tick a row. Her column (B) is pre-filled in red pen, and so is the OUT column: NAND(stay,1) = 0 (calm, "0 ♡"),
// NAND(go,1) = 1 (she is awake, circled three times).
// Timer = 5 pencil tally marks, one a second (stepped), the fifth strikes through. Her red pen hangs on a string and swings
// in 2 stepped poses (500 ms). Timeout: the red pen ticks the pink row itself. Replay: the row you ticked is ruled out in red.
// RM: tallies + ticks still appear (they are hard cuts), the pen stops swinging, no fades.
import { useEffect, useState } from 'react';
import { useDoorMenu, useBeats, usePose } from '../kit/hooks.js';
import { OPTIONS, BLEED, isDisabled, secondsLeft } from '../kit/menu.js';
import { Line, Hud, Tag } from '../kit/ui.jsx';
import Rain from '../../../date-beta/art/Rain.jsx';
import './truth.css';

const NX = 470, NY = 196, NW = 980, NH = 620; // napkin box (stage px)
const COLS = [{ x: 40, w: 96 }, { x: 136, w: 470 }, { x: 606, w: 150 }, { x: 756, w: 190 }];
const ROW_Y = [214, 384]; // row tops inside the napkin
const ROW_H = 150;

function Napkin() {
  // crinkled edge: a seeded wobble, never animated
  const pts = [];
  const wob = (i) => Math.sin(i * 12.9898) * 4 + Math.cos(i * 4.1) * 3;
  for (let i = 0; i <= 20; i++) pts.push([NX + (i / 20) * NW, NY + wob(i)]);
  for (let i = 0; i <= 12; i++) pts.push([NX + NW + wob(i + 30), NY + (i / 12) * NH]);
  for (let i = 20; i >= 0; i--) pts.push([NX + (i / 20) * NW, NY + NH + wob(i + 60)]);
  for (let i = 12; i >= 0; i--) pts.push([NX + wob(i + 90), NY + (i / 12) * NH]);
  const d = `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`;
  return (
    <g>
      <path d={d} transform="translate(10 14)" fill="#000" opacity=".35" />
      <path d={d} fill="#f6f1e6" />
      {/* the embossed napkin border + a fold crease */}
      <rect x={NX + 22} y={NY + 22} width={NW - 44} height={NH - 44} fill="none" stroke="#e3dccb" strokeWidth="3" strokeDasharray="2 8" />
      <line x1={NX + NW / 2} y1={NY + 6} x2={NX + NW / 2} y2={NY + NH - 6} stroke="#e6dfcf" strokeWidth="4" />
      <line x1={NX + 6} y1={NY + NH / 2} x2={NX + NW - 6} y2={NY + NH / 2} stroke="#ebe4d4" strokeWidth="3" />
      {/* a tea ring from lunch */}
      <circle cx={NX + 860} cy={NY + 520} r="64" fill="none" stroke="#d9c7a0" strokeWidth="6" opacity=".55" />
      {/* tape */}
      {[[NX - 30, NY - 20, -24], [NX + NW - 70, NY - 16, 20], [NX - 24, NY + NH - 30, 18], [NX + NW - 80, NY + NH - 26, -16]].map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="110" height="40" fill="#f3e9b8" opacity=".78" transform={`rotate(${r} ${x + 55} ${y + 20})`} />
      ))}
    </g>
  );
}

// pencil grid + header, MC's hand (mono, a little crooked)
function Grid() {
  const x0 = NX + COLS[0].x, x1 = NX + COLS[3].x + COLS[3].w;
  const y0 = NY + 134, y1 = NY + ROW_Y[1] + ROW_H + 10;
  return (
    <g className="pencil">
      <text x={NX + 60} y={NY + 90} className="p-title">DOOR?  (Unit 12, 23:47)</text>
      <line x1={x0} y1={y0 + 70} x2={x1} y2={y0 + 72} strokeWidth="4" />
      {[COLS[1].x, COLS[2].x, COLS[3].x].map((cx, i) => <line key={i} x1={NX + cx} y1={y0 - 2} x2={NX + cx + (i - 1) * 2} y2={y1} strokeWidth={i === 2 ? 5 : 3} />)}
      <line x1={x0} y1={NY + ROW_Y[1] - 8} x2={x1} y2={NY + ROW_Y[1] - 6} strokeWidth="2.5" />
      <text x={NX + COLS[1].x + 22} y={y0 + 50} className="p-head">A <tspan className="p-sub">you</tspan></text>
      <text x={NX + COLS[2].x + 22} y={y0 + 50} className="p-head">B <tspan className="p-sub">her</tspan></text>
      <text x={NX + COLS[3].x + 22} y={y0 + 50} className="p-head">OUT</text>
      <text x={NX + COLS[3].x + 108} y={y0 + 48} className="p-note">NAND</text>
    </g>
  );
}

// her red pen: pre-filled B and OUT columns
function HerInk({ picked }) {
  const bx = NX + COLS[2].x + 56, ox = NX + COLS[3].x + 50;
  const y = (r) => NY + ROW_Y[r] + 98;
  return (
    <g className="redpen">
      <text x={bx} y={y(0)} className="r-num">1</text>
      <text x={bx} y={y(1)} className="r-num">1</text>
      <text x={ox} y={y(0)} className="r-num">0</text>
      <path transform={`translate(${ox + 74} ${y(0) - 30}) scale(2.2)`} d="M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z" className="r-heart" />
      <text x={ox} y={y(1)} className="r-num">1</text>
      {/* the 1 is circled, three times, harder each time */}
      {[0, 1, 2].map((i) => <ellipse key={i} cx={ox + 22} cy={y(1) - 30} rx={42 + i * 7} ry={48 + i * 5} transform={`rotate(${-12 + i * 9} ${ox + 22} ${y(1) - 30})`}
        fill="none" strokeWidth={2.5 + i} className="r-circle" />)}
      <text x={NX + NW - 60} y={NY + NH - 44} textAnchor="end" className="r-note">{picked === 'purple' ? '1 = awake. all night.' : 'make it 0 ♡'}</text>
    </g>
  );
}

// a tick drawn in 3 stepped poses (500 ms each); rm = the final pose at once
function Tick({ x, y, red, rm }) {
  const [p, setP] = useState(rm ? 2 : 0);
  useEffect(() => {
    if (rm) return undefined;
    const a = setTimeout(() => setP(1), 500), b = setTimeout(() => setP(2), 1000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [rm]);
  const d = ['M0 30 L16 44', 'M0 30 L22 56 L40 20', 'M0 30 L22 56 L70 -18'][p];
  return <path d={d} transform={`translate(${x} ${y})`} className={red ? 'tick red' : 'tick'} />;
}

// timer: pencil tally marks (one a second, stepped), the fifth strikes through
function Tally({ n, live }) {
  const x = NX + NW - 250, y = NY + 44;
  return (
    <g className="pencil tally" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => i < n && <line key={i} x1={x + 24 + i * 26} y1={y + 8} x2={x + 20 + i * 26} y2={y + 72} strokeWidth="5" />)}
      {n >= 5 && <line x1={x + 4} y1={y + 62} x2={x + 126} y2={y + 14} strokeWidth="5" />}
      {live && <text x={x + 150} y={y + 56} className="p-note">{Math.max(0, 5 - n)} s</text>}
    </g>
  );
}

// her pen on a string, swinging in 2 held poses (a pendulum clock, 2 Hz max)
function Pen({ swing, rm }) {
  const pose = usePose(2, 500, swing && !rm);
  const deg = swing && !rm ? (pose ? 7 : -7) : 0;
  return (
    <g className="pen" transform={`rotate(${deg} ${NX + NW + 90} ${NY - 60})`}>
      <path d={`M${NX + NW + 90} ${NY - 60} Q${NX + NW + 110} ${NY + 150} ${NX + NW + 96} ${NY + 330}`} fill="none" stroke="#f0243f" strokeWidth="3" />
      <g transform={`translate(${NX + NW + 96} ${NY + 330}) rotate(8)`}>
        <rect x="-11" y="0" width="22" height="200" rx="8" fill="#f0243f" />
        <rect x="-11" y="0" width="22" height="46" rx="8" fill="#c01a33" />
        <rect x="8" y="10" width="7" height="70" rx="3" fill="#ffd0dc" />
        <path d="M-9 200 L0 236 L9 200Z" fill="#f4e6e8" /><path d="M-2 228 L0 238 L2 228Z" fill="#2a0610" />
        <text x="0" y="140" transform="rotate(-90 0 140)" textAnchor="middle" className="pen-brand">Figur</text>
      </g>
    </g>
  );
}

function Door({ open }) {
  return (
    <g>
      <rect width="1920" height="1080" fill="#8e8a80" />
      {Array.from({ length: 40 }, (_, r) => <line key={r} x1="0" y1={r * 28} x2="1920" y2={r * 28} stroke="#7d796f" strokeWidth="2" />)}
      {/* open walkway at both edges: rain + night */}
      <rect x="0" y="0" width="150" height="1080" fill="#141722" /><rect x="1770" y="0" width="150" height="1080" fill="#141722" />
      <rect x="150" y="0" width="20" height="1080" fill="#5c5f68" /><rect x="1750" y="0" width="20" height="1080" fill="#5c5f68" />
      {/* the door, dead centre */}
      <rect x="390" y="40" width="1140" height="1040" fill="#6b5a55" />
      <rect x="420" y="70" width="1080" height="1010" fill="#5a4a46" />
      <rect x="446" y="96" width="1028" height="984" fill="none" stroke="#4a3c38" strokeWidth="4" />
      <rect x="1400" y="560" width="26" height="130" rx="8" fill="#c9c2b8" />
      <rect x="880" y="120" width="160" height="22" rx="6" fill="#3c302d" />
      {/* lamp spill, top centre */}
      <rect x="860" y="0" width="200" height="24" rx="4" fill="#fff4d0" />
      <path d="M860 24 L560 1080 H1360 L1060 24Z" fill="#fff4d0" opacity=".07" />
      {/* nameplate */}
      <rect x="1560" y="190" width="170" height="74" rx="4" fill="#eee8dc" stroke="#b8ad99" strokeWidth="3" />
      <text x="1645" y="240" textAnchor="middle" className="plate">Unit 12</text>
      {/* warm sliver: the door is ajar on the hinge side */}
      {open !== 'shut' && <path d={open === 'wide' ? 'M420 70 H470 V1080 H420Z' : 'M420 70 H436 V1080 H420Z'} fill="#ffcf7a" opacity=".85" />}
    </g>
  );
}

const OUTCOME = {
  pink: [{ at: 0, text: 'NANDA: Output zero. See? We agree.' }, { at: 2400, text: 'NANDA: Shoes off. The kettle is already on.' }],
  timeout: [{ at: 0, text: 'NANDA: I ticked it for you. You were thinking.' }, { at: 2600, text: 'NANDA: Output zero. Good input.' }],
  forced: [{ at: 0, text: 'NANDA: That row is crossed out. For you. Not me.' }, { at: 2800, text: 'NANDA: Output zero. Again.' }],
  purple: [{ at: 0, text: 'NANDA: That row outputs one. One means awake.' }, { at: 2600, text: 'NANDA: …Goodnight, then. Text me. So I know.' }],
};

export default function Truth({ rm }) {
  const [bleed, setBleed] = useState(false);
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 800 : 1600, replayHold: rm ? 500 : 900,
    onPick: (s) => { if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); } },
  });
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const beat = useBeats(kind ? OUTCOME[kind] : null, `${m.run}-${kind}`);
  const tallies = armed ? Math.min(5, 5 - secondsLeft(m)) : 0;
  const picked = m.phase === 'picked' ? m.picked : null;
  const line = beat?.text ?? (m.run > 1 ? 'NANDA: I crossed that row out. Tidier.' : armed ? 'NANDA: Tick one. I did my column already.' : 'NANDA: I kept your napkin. I finished it.');

  const rowX = NX + COLS[0].x, rowW = COLS[3].x + COLS[3].w - COLS[0].x;
  return (
    <div className={`aroot truth${picked ? ` picked-${picked}` : ''}${rm ? ' is-rm' : ''}`} data-phase={m.phase} data-run={m.run}>
      <svg className="full" viewBox="0 0 1920 1080" aria-hidden="true">
        <Door open={picked === 'purple' ? 'shut' : picked === 'pink' ? 'wide' : 'ajar'} />
        <Rain seed={31} rm={rm} x={0} w={150} n={30} opacity={0.45} />
        <Rain seed={37} rm={rm} x={1770} w={150} n={30} opacity={0.45} />
        <Napkin />
        <Grid />
        <HerInk picked={picked} />
        {/* A column in pencil: the two options */}
        <g className="pencil">
          <text x={NX + COLS[1].x + 24} y={NY + ROW_Y[0] + 96} className="p-opt pink">{OPTIONS.pink.text}</text>
          <text x={NX + COLS[1].x + 24} y={NY + ROW_Y[1] + 96} className="p-opt purple">{OPTIONS.purple.text}</text>
          {ROW_Y.map((ry, i) => <rect key={i} x={NX + COLS[0].x + 22} y={NY + ry + 52} width="54" height="54" rx="4" fill="none" strokeWidth="4" />)}
        </g>
        {/* ruled-out rows (replay) */}
        {m.disabled.map((o) => {
          const ry = NY + ROW_Y[o === 'pink' ? 0 : 1] + 78;
          return <line key={o} x1={rowX + 6} y1={ry + 4} x2={rowX + rowW - 6} y2={ry - 4} className="ruleout" />;
        })}
        {picked && <Tick key={`${m.run}${picked}`} rm={rm} red={m.how === 'timeout'} x={NX + COLS[0].x + 30} y={NY + ROW_Y[picked === 'pink' ? 0 : 1] + 44} />}
        {picked === 'pink' && <ellipse cx={NX + COLS[3].x + 100} cy={NY + ROW_Y[0] + 70} rx="98" ry="62" className="r-circle wide" />}
        <Tally n={tallies} live={m.phase === 'open'} />
        <Pen swing={m.phase === 'open' && armed} rm={rm} />
      </svg>
      {/* the rows are the buttons (keyboard 1 / 2) */}
      {['pink', 'purple'].map((o, i) => (
        <button key={o} type="button" className={`row row-${o}`} disabled={m.phase !== 'open' || isDisabled(m, o)} onClick={() => pick(o)}
          style={{ left: rowX, top: NY + ROW_Y[i], width: rowW, height: ROW_H }} aria-label={`${OPTIONS[o].text} (${o}, key ${OPTIONS[o].key})`} />
      ))}
      {picked === 'pink' && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      <div className="a-vig" />
      <Line text={line} />
      <Tag>menu-2 · truth table · her door, 5 s</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
