import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Say from './Say.jsx';
import { draftPoints, polyD } from './Draft.jsx';

// First-visit coach marks (blind test: nobody found wiring or the switch). Five steps; the person's own action
// completes each one, so a step never times out while it waits for them. Only the last (read the table) asks for
// no action: it follows the balloon rule (gone after 3 s or at the next pointer/key). Esc or SKIP ends the tour.
// Two schools, one step list (VARIANT, set per branch; ?coach=a|b overrides for dogfood):
//   a  spotlight   : the page dims to ink 60%, the parts the step needs stay lit (Apple-style coach marks).
//   b  panels      : the page washes to paper 82%, each lit part gets a 3px ink panel frame + numbered caption box.
// A cartoon glove points AT the element on every step (Tony, issue 6: the dotted arrow read as a draggable wire).
export const VARIANT = 'a';
export const TOUR_KEY = 'gob.tour';
export const TOUR_MS = 3000;
const seen = () => { try { return localStorage.getItem(TOUR_KEY) === 'done'; } catch { return false; } };
const markSeen = () => { try { localStorage.setItem(TOUR_KEY, 'done'); localStorage.setItem('gob.paletteHint', '1'); } catch { /* private mode */ } };
export const tourPending = () => !seen();

export const STEPS = [
  { key: 'open', say: 'hint', help: 'Open the parts drawer' },
  { key: 'drag', say: 'tourDrag', help: 'Drag a part onto the canvas' },
  { key: 'wire', say: 'tourWire', help: 'Drag from a pin dot to a pin dot' },
  { key: 'click', say: 'tourClick', help: 'Click a switch square' },
  { key: 'read', say: 'tourRead', help: 'Read the truth table' },
];

// Which elements a step lights, where the hand points, and who speaks. All coordinates are client px.
// Lit areas are TIGHT (Tony, issue 6): a part is lit along its own drawn outline (body + knobs, the node's
// svg.shape path.body, re-drawn in the mask with the node's own screen matrix), never as a white box around it.
// hand = { at: fingertip [x, y], a: pointing angle in degrees, 0 = up, -90 = left, 90 = right }.
const q = (s) => document.querySelector(s);
const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return r.width ? r : null; };
const mid = (r) => [r.left + r.width / 2, r.top + r.height / 2];
const shapesOf = (root) => {
  const seen = new Set(), out = [];
  for (const p of root?.querySelectorAll('svg.shape path.body') ?? []) {
    const d = p.getAttribute('d'), m = p.getScreenCTM();
    if (!d || !m || seen.has(d)) continue;
    seen.add(d); out.push({ d, m: [m.a, m.b, m.c, m.d, m.e, m.f] });
  }
  return out;
};
const GAP = 4; // fingertip stops this far short of the thing it points at (the nudge closes it)
function measure(step, circuit, palOpen, k) { // k = app width / 1440
  const canvas = rect(q('.canvas'));
  if (!canvas) return null;
  if (step === 1 && !palOpen) step = 0; // drawer closed again mid-step: point back at the tab
  if (step === 0) {
    const tab = rect(q('.pal-tab')); if (!tab) return null;
    const [, y] = mid(tab);
    // Balloon sits ABOVE the hand (bug 7): hand top = glove x 90 (+2.5 stroke) turned up; balloon ink reaches 16 units below its tip.
    const lift = 42.5 * (HAND_L * Math.max(k, 0.8)) / HAND_H + 16 * Math.max(k, 0.95) + GAP;
    return { holes: [tab], shapes: [], hand: { at: [tab.right + GAP, y], a: -90 }, say: 'hint', tip: [tab.right, y - lift] };
  }
  if (step === 1) {
    const itemEl = q('.pal-group:nth-child(2) .pal-item') ?? q('.pal-item');
    const item = rect(itemEl); if (!item) return null;
    const glyph = itemEl.querySelector('.glyph'), label = [...itemEl.children].filter((c) => !c.classList.contains('glyph')).map(rect).filter(Boolean);
    const drop = { left: canvas.left + canvas.width * 0.42, top: canvas.top + canvas.height * 0.72, width: canvas.width * 0.16, height: canvas.height * 0.2 };
    drop.right = drop.left + drop.width; drop.bottom = drop.top + drop.height;
    const g = rect(glyph) ?? item;
    return { holes: [...label, drop], dropAt: label.length, shapes: shapesOf(glyph), drop: true,
      hand: { at: mid(g), a: -45, to: mid(drop), ghost: 'part' }, say: 'tourDrag', tip: [item.right - item.width * 0.2, item.top + item.height * 0.15] };
  }
  const nodes = Object.values(circuit.nodes), wires = Object.values(circuit.wires);
  const el = (id) => q(`.react-flow__node[data-id="${id}"]`);
  const hnd = (id, h) => rect(el(id)?.querySelector(`.react-flow__handle[data-handleid="${h}"]`));
  if (step === 2) {
    const sw = nodes.find((n) => n.kind === 'S' && !wires.some((w) => w.source === n.id)) ?? nodes.find((n) => n.kind === 'S');
    const pins = (n) => (n.kind === 'L' || n.type === 'NOT' ? [0] : [0, 1]);
    let dst = null;
    for (const n of nodes) if (n.kind === 'G') { const p = pins(n).find((i) => !wires.some((w) => w.target === n.id && w.pin === i)); if (p != null) { dst = [n.id, p]; break; } }
    if (!sw || !dst) return null;
    const a = hnd(sw.id, 'out'), b = hnd(dst[0], `in${dst[1]}`), sa = rect(el(sw.id));
    if (!a || !b || !sa) return null;
    // The two nubs: the source pin's knob and the target gate's free input knob, lit as disks and ringed.
    const z = a.width / 20, R = 17 * z; // handle box is 20 local px at zoom 1; knob ink reaches 12
    const [ax, ay] = mid(a);
    return { holes: [], shapes: [...shapesOf(el(sw.id)), ...shapesOf(el(dst[0]))], dots: [[ax, ay, R], [...mid(b), R]],
      hand: { at: [ax, ay], a: -45, to: mid(b), ghost: 'wire' }, say: 'tourWire', tip: [ax - 4, sa.top - 6] };
  }
  if (step === 3) {
    const sw = nodes.find((n) => n.kind === 'S' && wires.some((w) => w.source === n.id)) ?? nodes.find((n) => n.kind === 'S');
    const btn = sw && rect(el(sw.id)?.querySelector('.switch')), box = sw && rect(el(sw.id)); if (!btn || !box) return null;
    const [x, y] = mid(btn);
    return { holes: [], shapes: shapesOf(el(sw.id)), hand: { at: [x + btn.width * 0.12, y + btn.height * 0.12], a: -45 }, say: 'tourClick', tip: [x, box.top - 6] };
  }
  const t = rect(q('.truth')); if (!t) return null;
  const live = rect(q('.truth tr.live')) ?? t;
  return { holes: [t], shapes: [], hand: { at: [t.left - GAP, mid(live)[1]], a: 90 }, say: 'tourRead', tip: [t.left - 6, t.top + t.height * 0.12] };
}

// Pointing hand: an original cartoon white glove (four fingers, three back stitches, rolled cuff), drawn pointing UP
// with the index fingertip at (50, 0) of a 100 x 142 box. Motion (from Tony's ref gif, measured with Pillow: 20 frames
// x 40 ms = 0.8 s loop, pure translation along the pointing axis, no rotation, 38% of the hand's length; 8 frames in,
// 11 frames back, easing out at the far end) = the .coach-hand .nudge keyframes in theme.css.
const HAND_H = 142;
const HAND_L = 88; // px long at 1440
function Glove({ k }) {
  return (
    <g transform={`scale(${(HAND_L * k) / HAND_H}) translate(-50 0)`}>
      <path className="glove" d="M32 78C20 70 8 62 10 52C12 44 22 44 30 52L40 62Z" />
      <path className="glove" d="M36 58C26 56 20 64 22 76L24 98C26 110 36 116 50 116H70C82 116 90 108 88 96L86 70C85 58 74 52 62 56Z" />
      <path className="fill" d="M38 66V13A12 12 0 0 1 62 13V66Z" />
      <path className="line" d="M38 68V13A12 12 0 0 1 62 13V60" />
      <path className="line thin" d="M62 70C70 66 80 67 86 74M62 84C70 80 80 81 87 88" />
      <path className="line thin" d="M44 94V106M52 92V106M60 94V106" />
      <path className="glove" d="M26 114H86A8 8 0 0 1 86 130H26A8 8 0 0 1 26 114Z" />
      <path className="line thin" d="M30 122H82" />
    </g>
  );
}
// Tap loop (steps 1, 4, 5): the fingertip backs off by amp and nudges back in to touch the target (the ref gif).
function Hand({ at, a, k, cls = '' }) {
  return (
    <g className={`coach-hand ${cls}`} transform={`translate(${at[0]} ${at[1]}) rotate(${a})`} data-tip={`${at[0]},${at[1]}`} data-a={a}>
      <g className="nudge" style={{ '--amp': `${8 * k}px` }}><Glove k={k} /></g>
    </g>
  );
}
// Demo (steps 2, 3; Tony: a video-game tutorial): press on the source, glide to the target carrying a ghost (the real
// draft wire's right-angle pencil path, or a faint copy of the part), release, pause, loop. 2.6 s.
// Tony: the wire ghost is grid-like, never a diagonal, and the hand rides the same path: its glide keyframes are made
// per geometry, each leg's share of 12-60% = its share of the path length (linear, so hand tip = pencil tip).
// Reduced motion / logic mode: no glide; a still hand at the source and a still hand at the target.
function Demo({ at, to, a, k, ghost, shapes }) {
  const dx = to[0] - at[0], dy = to[1] - at[1];
  const pts = ghost === 'wire' ? draftPoints(at, to, 0) : [at, to];
  const legs = pts.slice(1).map((p, i) => Math.abs(p[0] - pts[i][0]) + Math.abs(p[1] - pts[i][1]));
  const tot = legs.reduce((x, y) => x + y, 0) || 1;
  let acc = 0;
  const frames = pts.map((p, i) => { if (i) acc += legs[i - 1];
    return `${(12 + (48 * acc) / tot).toFixed(2)}% { transform: translate(${p[0] - at[0]}px, ${p[1] - at[1]}px); }`; });
  const name = `coach-glide-${Math.round(dx)}-${Math.round(dy)}`.replace(/-(?=-)/g, 'm');
  const kf = ghost === 'wire' ? `@keyframes ${name} { 0% { transform: translate(0, 0); } ${frames.join(' ')} 97% { transform: translate(${dx}px, ${dy}px); } 100% { transform: translate(0, 0); } }
    @media (prefers-reduced-motion: no-preference) { .coach-demo .glide.path { animation: ${name} 2.6s linear infinite; } .coach-demo .ghost-wire path { animation: coach-draw-lin 2.6s infinite; } }` : '';
  return (
    <g className="coach-demo" style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--amp': `${8 * k}px` }}>
      {kf && <style>{kf}</style>}
      {ghost === 'wire' && <g className="ghost-wire">
        <path className="casing" d={polyD(pts)} pathLength="1" />
        <path className="pencil" d={polyD(pts)} pathLength="1" />
      </g>}
      <g className={`glide ${kf ? 'path' : ''}`}>
        {ghost === 'part' && <g className="ghost-part">
          {shapes.map((s, i) => <path key={i} d={s.d} transform={`matrix(${s.m.join(' ')})`} />)}</g>}
        <g className="coach-hand" transform={`translate(${at[0]} ${at[1]}) rotate(${a})`} data-tip={`${at[0]},${at[1]}`} data-to={`${to[0]},${to[1]}`} data-a={a}>
          <g className="press"><Glove k={k} /></g>
        </g>
      </g>
      <Hand at={to} a={a} k={k} cls="rm-only" />
    </g>
  );
}

export default function Coach({ circuit, palOpen, parts, slot, variant: v0 = VARIANT }) {
  const variant = (import.meta.env.DEV && new URLSearchParams(location.search).get('coach')) || v0;
  const [step, setStep] = useState(() => (seen() ? -1 : 0));
  const [geo, setGeo] = useState(null);
  const box = useRef(null);
  const base = useRef({ parts, wires: Object.keys(circuit.wires).length, sw: '' });
  const swSig = Object.values(circuit.nodes).filter((n) => n.kind === 'S').map((n) => `${n.id}${+!!n.value}`).join();
  const nWires = Object.keys(circuit.wires).length;
  const end = () => { setStep(-1); markSeen(); };
  // Tony: a refresh mid-tour must not restart it. Mark it seen the moment it first starts; "Show me how" replays.
  useEffect(() => { if (step === 0) markSeen(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const replay = () => { base.current = { parts, wires: nWires, sw: swSig }; setStep(0); }; // row 03 help button
  // Advance on the person's own action.
  useEffect(() => {
    const b = base.current;
    if (step === 0 && palOpen) setStep(1);
    else if (step === 1 && parts > b.parts) setStep(2);
    else if (step === 2 && nWires > b.wires) { b.sw = swSig; setStep(3); }
    else if (step === 3 && swSig !== b.sw) setStep(4);
    if (step < 2) { b.parts = Math.min(b.parts, parts); b.wires = nWires; } // a delete before the step still counts the next add
    if (step === 2) b.sw = swSig;
  }, [step, palOpen, parts, nWires, swSig]);
  // Last step: the balloon rule (3 s or the next action). Esc ends any step.
  useEffect(() => {
    if (step < 0) return;
    const esc = (e) => { if (e.key === 'Escape') end(); };
    addEventListener('keydown', esc);
    if (step !== 4) return () => removeEventListener('keydown', esc);
    const t = setTimeout(end, TOUR_MS);
    const any = (e) => { if (!e.target.closest?.('.coach-bar')) end(); };
    addEventListener('pointerdown', any, true); addEventListener('keydown', any, true);
    return () => { clearTimeout(t); removeEventListener('keydown', esc); removeEventListener('pointerdown', any, true); removeEventListener('keydown', any, true); };
  }, [step]);
  // Track the targets every frame while the tour runs (parts move, the drawer slides); state only changes on a change.
  useLayoutEffect(() => {
    if (step < 0) return setGeo(null);
    let raf, last = '';
    const tick = () => {
      const par = box.current?.parentElement, app = par?.getBoundingClientRect();
      const m = app && measure(step, circuit, palOpen, app.width / 1440);
      // Tony: the lit silhouettes sat 2px down-right. The overlay is inset:0 in .app = inside its 2px border, so the
      // origin is the padding box (clientLeft/Top), not the border box.
      if (m) { const o = [app.left + par.clientLeft, app.top + par.clientTop];
        const sh = (r) => ({ x: r.left - o[0], y: r.top - o[1], w: r.width, h: r.height });
        const g = { ...m, holes: m.holes.map(sh), W: app.width, H: app.height,
          shapes: m.shapes.map(({ d, m: t }) => ({ d, m: [t[0], t[1], t[2], t[3], t[4] - o[0], t[5] - o[1]] })),
          dots: m.dots?.map(([x, y, r]) => [x - o[0], y - o[1], r]), tip: [m.tip[0] - o[0], m.tip[1] - o[1]],
          hand: { ...m.hand, at: [m.hand.at[0] - o[0], m.hand.at[1] - o[1]], to: m.hand.to && [m.hand.to[0] - o[0], m.hand.to[1] - o[1]] } };
        const s = JSON.stringify(g); if (s !== last) { last = s; setGeo(g); } }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [step, circuit, palOpen]);

  const bar = slot && createPortal(step < 0 ? <button className="coach-replay" onClick={replay}>Show me how</button> : (
    <div className="coach-bar" role="status">
      <span className="n">{step + 1}/{STEPS.length}</span>
      {variant === 'c' && <span className="what">{STEPS[step].help}</span>}
      <span className="sr">{variant === 'c' ? '' : STEPS[step].help}</span>
      <button onClick={end}>Skip</button>
    </div>), slot);
  // Bug 8: no delete X while the tour runs (the pointer often rests on the part just dropped).
  const noX = step >= 0 && <style>{'.node .remove { opacity: 0 !important; pointer-events: none !important; }'}</style>;
  if (step < 0 || !geo) return <><div ref={box} hidden />{noX}{bar}</>;
  const k = geo.W / 1440;
  const w = Math.max(1, Math.round(2 * k)); // the 2u rule, whole px
  const pad = Math.max(2, Math.round(4 * k)); // lit margin around a rect target (tab, table, drop spot)
  const holes = geo.holes.map((r, i) => (geo.drop && i === geo.dropAt ? r : { x: r.x - pad, y: r.y - pad, w: r.w + 2 * pad, h: r.h + 2 * pad }));
  const mid = `coach-cut-${step}`;
  return (
    <>
      <div ref={box} className={`coach coach-${variant}`} aria-hidden="true">
        <svg width={geo.W} height={geo.H}>
          <defs>
            <mask id={mid} maskUnits="userSpaceOnUse" x="0" y="0" width={geo.W} height={geo.H}>
              <rect width={geo.W} height={geo.H} fill="#fff" />
              {holes.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="#000" />)}
              {/* the part's own outline, filled and fattened by 4 local px each side of its 3px ink: tight, border intact */}
              {geo.shapes.map((s, i) => <path key={i} d={s.d} transform={`matrix(${s.m.join(' ')})`} fill="#000" stroke="#000" strokeWidth={11} strokeLinejoin="round" />)}
              {geo.dots?.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r + 5 * w} fill="#000" />)}
            </mask>
          </defs>
          {variant !== 'c' && <rect className="veil" width={geo.W} height={geo.H} mask={`url(#${mid})`} />}
          {variant === 'b' && holes.map((r, i) => <rect key={i} className="panel" x={r.x} y={r.y} width={r.w} height={r.h} />)}
          {geo.drop && <rect className="drop" x={geo.holes[geo.dropAt].x} y={geo.holes[geo.dropAt].y} width={geo.holes[geo.dropAt].w} height={geo.holes[geo.dropAt].h}
            strokeWidth={w} strokeDasharray={`${w} ${2 * w}`} />}
          {geo.dots?.map(([x, y, r], i) => <circle key={i} className="coach-nub" cx={x} cy={y} r={r + 3 * w} strokeWidth={1.5 * w} />)} {/* Tony: = the used-pin mark (solid ink ring, still) */}
          {geo.hand.to ? <Demo {...geo.hand} k={Math.max(k, 0.8)} shapes={geo.shapes} /> : <Hand {...geo.hand} k={Math.max(k, 0.8)} />}
        </svg>
        {variant === 'b' && <span className="cap" style={{ left: holes[0].x, top: holes[0].y }}>{step + 1}</span>}
        {variant !== 'c' && <Say phrase={geo.say} role="presentation" className="coach-say"
          text="" key={step} />}
        <style>{`.coach-say{--ax:${geo.tip[0]}px;--ay:${geo.tip[1]}px}`}</style>
      </div>
      {noX}{bar}
    </>
  );
}
