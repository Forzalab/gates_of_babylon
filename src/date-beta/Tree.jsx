// Tree.jsx: the secret branch map overlay (`~` / ?debug). Data comes from debug.js; this file only draws it.
// Click a pink/purple edge pill = play that choice. Prior picks the branch needs (bento) are asked for one at a time;
// the "Remember this choice at reload" tick keeps them in localStorage (off by default, so a guest boots fresh).
// The map is an opaque layer: a fixed header over a canvas the size of the script. Scroll or drag to pan; Fit / - / +
// / 100% zoom it. It opens at 100% centred on the current scene. Scenes the game cannot reach from scene 1 sit dimmed
// in their own lane at the bottom (still clickable).
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { graph, layout, prereqs, missing, pillText, LAYOUT } from './debug.js';
import { routeTo } from './engine.js';

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled)';
const ZMIN = 0.1, ZMAX = 2, STEP = 1.25;
// Left/right-to-left bezier between two side points; loose enough that fan-ins stay apart.
const curve = (x1, y1, x2, y2) => {
  const d = Math.max(60, Math.abs(x2 - x1) / 2);
  return `M${x1} ${y1} C${x1 + d} ${y1} ${x2 - d} ${y2} ${x2} ${y2}`;
};

export function Tree({ scenes, decl, sess, k, here, onJump, onClose }) {
  const g = useMemo(() => graph(scenes), [scenes]);
  const legacy = useMemo(() => new Set(scenes.filter((_, i) => i > 0 && !routeTo(scenes, i).length).map((s) => s.id)), [scenes]);
  const L = useMemo(() => layout(g, LAYOUT, legacy), [g, legacy]);
  const [picks, setPicks] = useState(() => sess.get());
  const [ask, setAsk] = useState(null); // { edge, needs }
  const [z, setZ] = useState(1);
  const box = useRef(null), pan = useRef(null), drag = useRef(null);
  // Canvas point to centre on after the next zoom render; on open, the current scene.
  const want = useRef(L.pos[here] ? { cx: L.pos[here].x, cy: L.pos[here].y } : null);
  const [dragging, setDragging] = useState(false);

  // Focus: the dialog's first option when asking, else the close button. Tab stays inside (focus trap).
  useEffect(() => { box.current?.querySelector(ask ? '.db-ask .db-choice' : '.db-tree-close')?.focus({ preventScroll: true }); }, [ask]);
  useEffect(() => {
    const onKey = (e) => {
      // Own Esc/Tab outright: the game's handler must never see them (it would skip the scene once we re-render).
      if (e.key === 'Escape' || e.key === 'Tab') e.stopImmediatePropagation();
      if (e.key === 'Escape') { e.preventDefault(); if (ask) setAsk(null); else onClose(); return; }
      if (e.key !== 'Tab') return;
      const root = box.current?.querySelector('.db-ask') ?? box.current;
      const els = [...(root?.querySelectorAll(FOCUSABLE) ?? [])];
      if (!els.length) return;
      const i = els.indexOf(document.activeElement);
      const j = e.shiftKey ? (i <= 0 ? els.length - 1 : i - 1) : (i < 0 || i === els.length - 1 ? 0 : i + 1);
      e.preventDefault();
      els[j].focus();
    };
    addEventListener('keydown', onKey, true);
    return () => removeEventListener('keydown', onKey, true);
  }, [ask, onClose]);

  // Zoom keeps the view's centre still (or lands on `want` when set, e.g. on open).
  useLayoutEffect(() => {
    const el = pan.current, w = want.current;
    if (!el || !w) return;
    el.scrollLeft = w.cx * z - el.clientWidth / 2;
    el.scrollTop = w.cy * z - el.clientHeight / 2;
    want.current = null;
  }, [z]);
  const zoom = (next) => {
    const el = pan.current;
    if (el) want.current = { cx: (el.scrollLeft + el.clientWidth / 2) / z, cy: (el.scrollTop + el.clientHeight / 2) / z };
    setZ(Math.min(ZMAX, Math.max(ZMIN, next)));
  };
  const fit = () => { const el = pan.current; if (el) zoom(Math.min(el.clientWidth / L.W, el.clientHeight / L.H)); };

  // Drag to pan: anywhere on the canvas but a button (so a pill click is always a click).
  const down = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    drag.current = { x: e.clientX, y: e.clientY, l: pan.current.scrollLeft, t: pan.current.scrollTop };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    pan.current.scrollLeft = d.l - (e.clientX - d.x);
    pan.current.scrollTop = d.t - (e.clientY - d.y);
  };
  const up = () => { drag.current = null; setDragging(false); };

  const go = (edge, choices) => {
    const left = missing(prereqs(scenes, edge, decl), choices);
    if (left.length) setAsk({ edge, need: left[0] });
    else { setAsk(null); onJump(edge, choices); }
  };
  const answer = (value) => { const p = sess.pick(ask.need.flag, value); setPicks(p); go(ask.edge, p.choices); };
  const remember = (on) => setPicks(sess.remember(on));
  const trash = () => setPicks(sess.clear());
  const stop = (e) => e.stopPropagation();

  const drawn = g.edges.filter((e) => e.kind !== 'back' && e.to);
  const branches = drawn.filter((e) => e.branching);
  // Plain edges: one line per from->to pair, node side to node side.
  const thin = [...new Map(drawn.filter((e) => !e.branching).map((e) => [`${e.from}>${e.to}`, e])).values()];
  const side = (id, right) => L.pos[id].x + (right ? 1 : -1) * L.pos[id].w / 2;
  const dim = (id) => (legacy.has(id) ? ' legacy' : '');
  const Remember = (
    <label className="db-remember"><input type="checkbox" checked={picks.remember} onChange={(e) => remember(e.target.checked)} />
      Remember this choice at reload</label>
  );

  return (
    <div className="db-tree" ref={box} role="dialog" aria-modal="true" aria-label="Branch map" onClick={stop}>
      <header className="db-tree-head" style={{ zoom: k }}>
        <h2>BRANCH MAP</h2>
        <span className="db-tree-picks">
          {Object.entries(picks.choices).map(([f, v]) => <span key={f} className="db-tree-chip">{f}: {v}</span>)}
          {!Object.keys(picks.choices).length && <span className="db-tree-chip off">no picks yet</span>}
        </span>
        {Remember}
        <button type="button" className="db-tree-btn" onClick={trash} title="Clear every pick">🗑 Reset picks</button>
        <button type="button" className="db-tree-btn db-tree-close" onClick={onClose} title="Close (Esc or ~)">✕ Close</button>
        <p className="db-tree-hint">Click a pink or purple pill to play that choice · thin lines play on their own · every ending returns to the rooftop</p>
        <span className="db-tree-zoom">
          <button type="button" className="db-tree-btn" data-zoom="fit" onClick={fit} title="Fit the whole map">Fit</button>
          <button type="button" className="db-tree-btn" data-zoom="out" onClick={() => zoom(z / STEP)} title="Zoom out">−</button>
          <output aria-label="Zoom">{Math.round(z * 100)}%</output>
          <button type="button" className="db-tree-btn" data-zoom="in" onClick={() => zoom(z * STEP)} title="Zoom in">+</button>
          <button type="button" className="db-tree-btn" data-zoom="1" onClick={() => zoom(1)} title="Actual size">100%</button>
        </span>
      </header>
      <div className={`db-tree-pan${dragging ? ' dragging' : ''}`} ref={pan} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div style={{ width: L.W * z, height: L.H * z }}>
          <div className="db-tree-canvas" style={{ width: L.W, height: L.H, transform: `scale(${z})` }}>
            {L.lanes.filter((l) => l.legacy).map((l) => (
              <div key="legacy" className="db-tree-lane" style={{ top: l.top - 100, height: L.H - l.top + 100 }}><span>Legacy · not reachable from scene 1</span></div>
            ))}
            <svg className="db-tree-lines" width={L.W} height={L.H} aria-hidden="true">
              {g.nodes.filter((n) => branches.some((e) => e.from === n.id)).map((n) => {
                const p = L.pos[n.id], x = p.x - p.w / 2 + LAYOUT.indent / 2;
                const ys = branches.filter((e) => e.from === n.id).map((e) => L.pills[e.id].y);
                return <path key={`s-${n.id}`} className={`spine${dim(n.id)}`} d={`M${x} ${p.y + p.h / 2} V${ys.at(-1)} ${ys.map((y) => `M${x} ${y} H${x + LAYOUT.indent / 2}`).join(' ')}`} />;
              })}
              {thin.map((e) => <path key={e.id} className={`thin${dim(e.from)}`} d={curve(side(e.from, true), L.pos[e.from].y, side(e.to, false), L.pos[e.to].y)} />)}
              {branches.map((e) => {
                const p = L.pills[e.id];
                return <path key={e.id} className={`br ${e.side}${dim(e.from)}`} d={curve(p.x + p.w / 2, p.y, side(e.to, false), L.pos[e.to].y)} />;
              })}
            </svg>
            {g.nodes.map((n) => {
              const p = L.pos[n.id];
              return (
                <span key={n.id} className={`db-tree-node${n.id === here ? ' here' : ''}${dim(n.id)}`} title={n.title} data-node={n.id}
                  style={{ left: p.x - p.w / 2, top: p.y - p.h / 2, width: p.w, height: p.h }}>{n.id}</span>
              );
            })}
            {branches.map((e) => {
              const p = L.pills[e.id];
              return (
                <button type="button" key={e.id} className={`db-tree-edge ${e.side}${dim(e.from)}`} title={`${e.from} → ${e.to}`}
                  style={{ left: p.x - p.w / 2, top: p.y - p.h / 2, width: p.w, height: p.h }}
                  onClick={() => go(e, picks.choices)} data-edge={e.id}>{pillText(e)}</button>
              );
            })}
          </div>
        </div>
      </div>
      {ask && (
        <div className="db-ask-scrim">
          <div className="db-ask" role="dialog" aria-modal="true" aria-labelledby="db-ask-q" style={{ zoom: k }}>
            <p className="db-ask-kicker">This branch needs an earlier pick</p>
            <h3 id="db-ask-q">{ask.need.flag}?</h3>
            <div className="db-ask-opts">
              {ask.need.options.map((o) => (
                <button type="button" key={o.value} className={`db-choice ${o.side}`} onClick={() => answer(o.value)}>
                  <span className="line">{o.label}</span></button>
              ))}
            </div>
            {Remember}
            <button type="button" className="db-tree-btn" onClick={() => setAsk(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
