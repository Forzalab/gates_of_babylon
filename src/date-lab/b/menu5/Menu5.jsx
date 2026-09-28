// menu-5 · CIRCUIT WIRES (horror 3). Central theme: "her wire is already soldered". School: Serial Experiments Lain
// (the Wired, power-line hum, "PRESENT DAY, PRESENT TIME") on a Figur circuit board. Her door = chip U12.
// You hold a loose jumper wire from pin A (you). Two pads: pink "Just one cup." / purple "It's late. Goodnight."
// Her pink wire runs from her hair-clip pin to the pink pad and is ALREADY soldered. The 5 s timer = her current
// crawling down that wire (stepped on the 8 fps grid); when it reaches the pad your wire is pulled there (default pink).
// The drag lies to you: the wire end bends toward pink (more as time runs out). Wiring purple makes an OR:
// she hates OR -> bleed, her face goes wide, she desolders it and rewinds: purple pad scorched "NC", timer still runs.
// Reduced motion: board boots in one cut, the current jumps once a second, the wire snaps (no spring), bleed = edge.
// Keys: 1 / 2 connect, R = rewind. ?state=menu|replay|pink|purple for shots.
import { useEffect, useMemo, useRef, useState } from 'react';
import { LabRoot, Markup, OrText, useLater, param, toStage } from '../shared/ui.jsx';
import { play, bed } from '../shared/audio.js';
import { ART, placed } from '../shared/art.js';
import { rng } from '../../../date-beta/art/util.js';
import { DOOR, openMenu, tick, choose, remaining, replay, isDisabled } from '../shared/door.js';
import './menu5.css';

const PIN_A = { x: 330, y: 610 };
const REST = { x: 470, y: 820 };
const PADS = { pink: { x: 1250, y: 420 }, purple: { x: 1250, y: 740 } };
const HER = [[1046, 54], [1300, 40], [1020, 420], [1216, 420]]; // cubic: her hair-clip pin (inside DISP1) -> pink pad
const DISP = { x: 640, y: 36, w: 460, h: 270 }; // the display module her face is on
const HER_D = `M${HER[0]} C${HER[1]} ${HER[2]} ${HER[3]}`;
const SNAP = 95;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const bez = (p, t) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
};

// Decorative copper: seeded 45-degree traces, vias, a few parts. Index = boot order.
const TRACES = (() => {
  const r = rng(12), out = [];
  for (let i = 0; i < 46; i++) {
    let x = 80 + r() * 1760, y = 120 + r() * 880;
    const pts = [[x, y]];
    for (let k = 0; k < 3; k++) {
      const dir = Math.floor(r() * 4), len = 60 + r() * 240;
      if (dir === 0) x += len; else if (dir === 1) y += len; else if (dir === 2) { x += len * 0.7; y += len * 0.7; } else { x -= len * 0.7; y += len * 0.7; }
      pts.push([x, y]);
    }
    out.push(pts.map((p) => p.map((v) => v.toFixed(0)).join(',')).join(' '));
  }
  return out;
})();
const VIAS = (() => { const r = rng(99); return Array.from({ length: 70 }, () => [80 + r() * 1760, 110 + r() * 900]); })();
// the printed default route: pin A -> the pink pad (her design, not yours)
const DEFAULT_ROUTE = `${PIN_A.x + 40},${PIN_A.y} 700,${PIN_A.y} 700,470 1000,470 1100,${PADS.pink.y} ${PADS.pink.x - 40},${PADS.pink.y}`;

function Board({ boot, lit, rm }) {
  const n = rm ? TRACES.length : Math.round(boot * TRACES.length);
  return (
    <g className="m5-board">
      <rect width="1920" height="1080" fill="url(#m5-sub)" />
      <g className="m5-grid">{Array.from({ length: 25 }, (_, i) => <line key={i} x1={i * 80} y1="0" x2={i * 80} y2="1080" />)}</g>
      <g className={`m5-traces${lit ? ' lit' : ''}`}>
        {TRACES.map((d, i) => <polyline key={i} points={d} className={i < n ? 'on' : ''} />)}
      </g>
      <g className="m5-vias">{VIAS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 5 : 8} />)}</g>
      <polyline points={DEFAULT_ROUTE} className={`m5-route${n > 10 ? ' on' : ''}${lit ? ' lit' : ''}`} />
      {/* silkscreen */}
      <text x="80" y="1040" className="m5-silk">FIGUR · DOOR BOARD · REV.12</text>
      <text x="1840" y="1040" textAnchor="end" className="m5-silk dim">PRESENT DAY · PRESENT TIME · 12:00</text>
      <text x={PIN_A.x - 70} y={PIN_A.y + 120} className="m5-silk big">A · YOU</text>
      <g transform="translate(160 250)" className="m5-part">
        <rect width="120" height="44" rx="6" /><text x="60" y="30" textAnchor="middle" className="m5-silk">R12 · 1k</text>
      </g>
      <g transform="translate(250 900)" className="m5-part">
        <circle r="46" /><circle r="30" className="in" /><text y="80" textAnchor="middle" className="m5-silk">C7 · 1000µF</text>
      </g>
    </g>
  );
}

function Chip({ lit }) {
  return (
    <g transform="translate(700 560)" className={`m5-chip${lit ? ' lit' : ''}`}>
      {Array.from({ length: 7 }, (_, i) => <rect key={`t${i}`} x={16 + i * 34} y="-18" width="16" height="20" className="leg" />)}
      {Array.from({ length: 7 }, (_, i) => <rect key={`b${i}`} x={16 + i * 34} y="148" width="16" height="20" className="leg" />)}
      <rect width="260" height="150" rx="8" className="body" />
      <circle cx="22" cy="22" r="7" className="dot" />
      <text x="130" y="72" textAnchor="middle" className="m5-chip-t">U12</text>
      <text x="130" y="112" textAnchor="middle" className="m5-chip-s">74HC00 · FIGUR</text>
    </g>
  );
}

function Pad({ id, p, off, hot, label }) {
  return (
    <g className={`m5-pad ${id}${off ? ' off' : ''}${hot ? ' hot' : ''}`} transform={`translate(${p.x} ${p.y})`}>
      <circle r="58" className="ring" />
      <circle r="34" className="tin" />
      <circle r="12" className="hole" />
      {off && (
        <g className="burn">
          <circle r="70" /><path d="M-60 -60 L60 60 M60 -60 L-60 60" />
          <text x="0" y="104" textAnchor="middle" className="m5-silk nc">NC · LOCKED</text>
        </g>
      )}
      <text x="96" y="16" className={`m5-label ${id}`}>{label}</text>
    </g>
  );
}

// a jumper cable from a to b that sags under its own weight; a dupont connector at the end
function Cable({ a, b, color, className = '', sag = 180, end = true }) {
  const mx = (a.x + b.x) / 2, dy = Math.max(60, sag - Math.abs(a.x - b.x) * 0.08);
  const d = `M${a.x} ${a.y} C${a.x + 40} ${a.y + dy} ${mx} ${Math.max(a.y, b.y) + dy} ${b.x - 70} ${b.y}  L${b.x} ${b.y}`;
  return (
    <g className={`m5-cable ${className}`}>
      <path d={d} className="shadow" transform="translate(8 12)" />
      <path d={d} className="body" style={{ stroke: color }} />
      <path d={d} className="hl" />
      {end && <rect x={b.x - 74} y={b.y - 14} width="46" height="28" rx="4" className="plug" />}
    </g>
  );
}

const START = param('state');

export default function Menu5({ rm }) {
  const root = useRef(null);
  const [phase, setPhase] = useState(START === 'pink' || START === 'purple' ? START : START ? 'menu' : 'boot');
  const [boot, setBoot] = useState(START ? 1 : 0);
  const [menu, setMenu] = useState(() => {
    const m = openMenu(DOOR, { disabled: START === 'replay' ? ['purple'] : [] });
    return START === 'pink' || START === 'purple' ? { ...m, t: 1500, picked: START, via: 'click', done: true } : m;
  });
  const [end, setEnd] = useState(START === 'pink' || START === 'purple' ? PADS[START] : REST);
  const [drag, setDrag] = useState(null);
  const [snapped, setSnapped] = useState(START === 'pink' || START === 'purple' ? START : null);
  const [face, setFace] = useState(START === 'purple' ? 'wide' : 'smile');
  const [sub, setSub] = useState(START === 'replay' ? 'NANDA: Try again. Carefully.' : START ? DOOR.prompt : '');
  const [bleed, setBleed] = useState(false);
  const [lit, setLit] = useState(START === 'pink');
  const [later, clear] = useLater();
  const tw = useRef(0);

  useEffect(() => { bed('cicada', true); }, []);

  // boot: the board lights trace by trace on the 125 ms grid (reduced motion: one cut)
  useEffect(() => {
    if (phase !== 'boot') return undefined;
    play('static', { caption: '[board powers on: hum]' });
    if (rm) { setBoot(1); later(() => { setSub(DOOR.prompt); setPhase('menu'); }, 800); return undefined; }
    let k = 0;
    const id = setInterval(() => { k += 1; setBoot(Math.min(1, k / 10)); if (k >= 10) clearInterval(id); }, 125);
    later(() => setSub('NANDA: I wired it already. So you don’t have to.'), 400);
    later(() => { setSub(DOOR.prompt); setPhase('menu'); }, 3000);
    return () => clearInterval(id);
  }, [phase === 'boot']); // eslint-disable-line react-hooks/exhaustive-deps

  // timer
  useEffect(() => {
    if (phase !== 'menu' || menu.done || param('pause') !== null) return undefined;
    let raf, prev = performance.now();
    const f = (now) => { const dt = now - prev; prev = now; setMenu((s) => tick(s, dt)); raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [phase, menu.done]);

  // smooth wire moves (reduced motion: a hard cut)
  function tween(to, ms, then) {
    cancelAnimationFrame(tw.current);
    if (rm) { setEnd(to); then?.(); return; }
    const from = { ...endRef.current }, t0 = performance.now();
    const f = (now) => {
      const q = Math.min(1, (now - t0) / ms), e = 1 - (1 - q) ** 3;
      setEnd({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      if (q < 1) tw.current = requestAnimationFrame(f); else then?.();
    };
    tw.current = requestAnimationFrame(f);
  }
  const endRef = useRef(end);
  endRef.current = end;
  useEffect(() => () => cancelAnimationFrame(tw.current), []);

  // result beats (click or timeout)
  useEffect(() => {
    if (phase !== 'menu' || !menu.done) return;
    const id = menu.picked;
    setDrag(null);
    tween(PADS[id], 450, () => {
      setSnapped(id);
      play('wire');
      if (id === 'pink') {
        play('pink');
        setPhase('pink'); setFace('smile'); setLit(true);
        setSub(menu.via === 'timeout' ? "NANDA: You didn't say no." : 'NANDA: Good input.');
        later(() => { setSub('NANDA: The water’s still warm.'); play('door'); }, 2600);
      } else {
        play('purple'); play('bleed');
        setPhase('purple'); setFace('wide'); setBleed(true);
        later(() => setBleed(false), 334);
        setSub('NANDA: That’s an OR. You know I hate OR.');
        later(() => { play('static', { caption: '[snip: she desolders it]' }); setSnapped(null); setEnd(REST); setSub('NANDA: There. Fixed it.'); }, 2600);
        later(() => doRewind(), 4400);
      }
    });
  }, [menu.done]); // eslint-disable-line react-hooks/exhaustive-deps

  function doRewind() {
    clear();
    play('rewind');
    setPhase('rewind');
    setLit(false); setSnapped(null); setBleed(false);
    later(() => {
      play('whisper');
      setEnd(REST);
      setMenu((s) => replay(s.picked ? s : { ...s, picked: 'purple' }));
      setFace('smile');
      setSub(menu.picked === 'pink' ? 'NANDA: Again? Same wire, then.' : 'NANDA: Try again. Carefully.');
      setPhase('menu');
      later(() => setSub(DOOR.prompt), 2000);
    }, rm ? 900 : 1200);
  }

  // drag: the wire end lies. It bends toward her pad, more as the timer runs out.
  const pull = (p) => {
    const k = 0.14 + 0.24 * (1 - remaining(menu));
    return { x: p.x + (PADS.pink.x - p.x) * k, y: p.y + (PADS.pink.y - p.y) * k };
  };
  const onDown = (e) => {
    if (phase !== 'menu' || menu.done) return;
    const p = toStage(e, root.current);
    if (dist(p, end) > 130 && dist(p, PIN_A) > 130) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    cancelAnimationFrame(tw.current);
    setDrag(p); setEnd(pull(p));
    play('tick', { caption: '[you pick up the wire]' });
  };
  const onMove = (e) => {
    if (!drag) return;
    const p = toStage(e, root.current), q = pull(p);
    setDrag(p); setEnd(q);
    setFace(dist(q, PADS.purple) < 260 ? 'blank' : 'smile');
  };
  const drop = (id) => {
    if (isDisabled(menu, id)) { play('static', { caption: '[no contact: the pad is dead]' }); tween(REST, 300); return; }
    const next = choose(menu, id);
    if (next === menu) { tween(REST, 300); return; }
    setMenu(next);
  };
  const onUp = () => {
    if (!drag) return;
    setDrag(null);
    const hit = Object.keys(PADS).find((id) => dist(end, PADS[id]) < SNAP);
    if (hit) drop(hit); else { setFace('smile'); tween(REST, 300); }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      const o = DOOR.options.find((x) => x.key === e.key);
      if (o && phase === 'menu' && !menu.done) {
        if (isDisabled(menu, o.id)) { drop(o.id); return; }
        if (menu.t < DOOR.hold) return;
        tween(PADS[o.id], 450, () => drop(o.id));
      } else if ((e.key === 'r' || e.key === 'R') && (phase === 'pink' || phase === 'purple')) doRewind();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  // her current: stepped to 125 ms (reduced motion: one jump a second)
  const stepMs = rm ? 1000 : 125;
  const q = phase === 'menu' ? Math.min(1, Math.floor(menu.t / stepMs) * stepMs / DOOR.timeout) : phase === 'pink' ? 1 : 0;
  const [sx, sy] = bez(HER, q);
  const nearPurple = drag && dist(end, PADS.purple) < 260;
  // her breath on the OR: when the menu opens, and again each time your wire drifts toward purple
  useEffect(() => { if (phase === 'menu') play('breath'); }, [phase]);
  useEffect(() => { if (nearPurple) play('breath', { caption: '[her breath, sharper]' }); }, [!!nearPurple]); // eslint-disable-line react-hooks/exhaustive-deps
  const bust = useMemo(() => placed(ART.nanda({ face }), 495, -205, 750, 1125), [face]);

  return (
    <LabRoot rm={rm} className={`m5 ph-${phase}`} captions="tl">
      <div ref={root} className="m5-hit" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <svg className="art" viewBox="0 0 1920 1080" role="img" aria-label="A circuit board. Your loose wire at pin A. Two pads: pink, just one cup; purple, it's late, goodnight. Her pink wire is already soldered to the pink pad.">
          <defs>
            <radialGradient id="m5-sub" cx="50%" cy="45%" r="75%">
              <stop offset="0" stopColor="#12302a" /><stop offset=".7" stopColor="#0a1c18" /><stop offset="1" stopColor="#050c0b" />
            </radialGradient>
            <pattern id="m5-lines" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#c8f0ff" /><rect width="6" height="2" fill="#6d8fa0" />
            </pattern>
            <radialGradient id="m5-glow"><stop offset="0" stopColor="#fff" /><stop offset=".3" stopColor="#ff9cc8" /><stop offset="1" stopColor="#ff5fa2" stopOpacity="0" /></radialGradient>
          </defs>
          <Board boot={boot} lit={lit} rm={rm} />
          <Chip lit={lit} />
          {/* DISP1: a display module soldered to the board; her face fills it, her wire comes out of the screen */}
          <g className="m5-disp">
            <rect x={DISP.x - 26} y={DISP.y - 22} width={DISP.w + 52} height={DISP.h + 64} rx="10" className="pcb" />
            {[[-12, -8], [DISP.w + 12, -8], [-12, DISP.h + 28], [DISP.w + 12, DISP.h + 28]].map(([x, y]) => <circle key={`${x}${y}`} cx={DISP.x + x} cy={DISP.y + y} r="8" className="hole" />)}
            <clipPath id="m5-dclip"><rect x={DISP.x} y={DISP.y} width={DISP.w} height={DISP.h} /></clipPath>
            <rect x={DISP.x} y={DISP.y} width={DISP.w} height={DISP.h} className="glass" />
            <g clipPath="url(#m5-dclip)"><Markup html={bust} className={`m5-her face-${face}`} /><rect x={DISP.x} y={DISP.y} width={DISP.w} height={DISP.h} className="tint" /></g>
            <text x={DISP.x} y={DISP.y + DISP.h + 34} className="m5-silk">DISP1 · FIGUR</text>
          </g>
          {/* her wire: already soldered; the current crawling down it is the timer */}
          <g className="m5-herwire">
            <path d={HER_D} className="shadow" transform="translate(8 12)" />
            <path d={HER_D} className="body" />
            <path d={HER_D} className="hot" pathLength="1" strokeDasharray={`${q} 1`} />
            <path d={HER_D} className="hl" />
            <ellipse cx={PADS.pink.x - 22} cy={PADS.pink.y} rx="34" ry="26" className="solder" />
            {phase === 'menu' && <circle cx={sx} cy={sy} r="46" fill="url(#m5-glow)" className="spark" />}
          </g>
          <Pad id="pink" p={PADS.pink} off={isDisabled(menu, 'pink')} hot={lit || (drag && dist(end, PADS.pink) < SNAP)} label="Just one cup." />
          <Pad id="purple" p={PADS.purple} off={isDisabled(menu, 'purple')} hot={nearPurple} label="It's late. Goodnight." />
          <text x={PADS.pink.x + 140} y={(PADS.pink.y + PADS.purple.y) / 2 + 20} className={`m5-or${nearPurple || phase === 'purple' ? ' loud' : ''}`}>
            <tspan className="or-svg" dx="1" dy="1">OR</tspan>
          </text>
          {/* pin A header + your wire */}
          <g transform={`translate(${PIN_A.x - 40} ${PIN_A.y - 40})`} className="m5-header">
            <rect width="80" height="80" rx="6" /><rect x="30" y="-40" width="20" height="60" className="gold" />
          </g>
          <Cable a={{ x: PIN_A.x, y: PIN_A.y - 20 }} b={end} color={snapped === 'purple' || nearPurple ? '#8a5cf6' : snapped === 'pink' ? '#ff5fa2' : '#e9e4f0'} sag={drag ? 120 : 220} />
          {phase === 'menu' && !drag && !snapped && <g className="m5-grab"><circle cx={end.x - 50} cy={end.y} r="70" /></g>}
        </svg>
      </div>
      <div className="m5-scan" />
      {phase === 'rewind' && <div className="m5-rew"><b>◀◀</b></div>}
      <div className={`bleed${bleed ? (rm ? ' edge' : ' on') : ''}`} />
      {sub && <p className="m5-sub"><SubText text={sub} /></p>}
      {phase === 'menu' && !drag && <p className="hint m5-hint">drag your wire to a pad · or press 1 / 2</p>}
      {(phase === 'pink' || phase === 'purple') && <button type="button" className="lab m5-rewbtn" onClick={(e) => { e.stopPropagation(); doRewind(); }}>◀◀ R · rewind</button>}
    </LabRoot>
  );
}

function SubText({ text }) {
  const m = /^([A-Z]+):\s*(.*)$/.exec(text);
  return <>{m && <span className="m5-who">{m[1]}</span>}<OrText text={m ? m[2] : text} /></>;
}
