// Tree.jsx: the secret branch map overlay (`~` / ?debug). Data comes from debug.js; this file only draws it.
// Click a pink/purple edge pill = play that choice. Prior picks the branch needs (bento) are asked for one at a time;
// the "Remember this choice at reload" tick keeps them in localStorage (off by default, so a guest boots fresh).
import { useEffect, useMemo, useRef, useState } from 'react';
import { graph, layout, prereqs, missing, LAYOUT } from './debug.js';

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled)';

export function Tree({ scenes, decl, sess, k, here, onJump, onClose }) {
  const g = useMemo(() => graph(scenes), [scenes]);
  const L = useMemo(() => layout(g), [g]);
  const [picks, setPicks] = useState(() => sess.get());
  const [ask, setAsk] = useState(null); // { edge, needs }
  const box = useRef(null);

  // Focus: the dialog's first option when asking, else the close button. Tab stays inside (focus trap).
  useEffect(() => { box.current?.querySelector(ask ? '.db-ask .db-choice' : '.db-tree-close')?.focus(); }, [ask]);
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

  const go = (edge, choices) => {
    const left = missing(prereqs(scenes, edge, decl), choices);
    if (left.length) setAsk({ edge, need: left[0] });
    else { setAsk(null); onJump(edge, choices); }
  };
  const answer = (value) => { const p = sess.pick(ask.need.flag, value); setPicks(p); go(ask.edge, p.choices); };
  const remember = (on) => setPicks(sess.remember(on));
  const trash = () => setPicks(sess.clear());
  const stop = (e) => e.stopPropagation();

  // Pills for edges sharing a from->to pair fan out vertically around the midpoint.
  const drawn = g.edges.filter((e) => e.kind !== 'back' && e.to);
  const place = {};
  const branches = drawn.filter((e) => e.branching);
  for (const e of branches) {
    const twins = branches.filter((x) => x.from === e.from && x.to === e.to);
    const a = L.pos[e.from], b = L.pos[e.to], n = twins.indexOf(e);
    place[e.id] = { x: (a.x + a.w / 2 + b.x - b.w / 2) / 2, y: (a.y + b.y) / 2 + (n - (twins.length - 1) / 2) * 64 };
  }
  const Remember = (
    <label className="db-remember"><input type="checkbox" checked={picks.remember} onChange={(e) => remember(e.target.checked)} />
      Remember this choice at reload</label>
  );

  return (
    <div className="db-tree" ref={box} role="dialog" aria-modal="true" aria-label="Branch map" onClick={stop}>
      <div className="db-tree-stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }}>
        <header className="db-tree-head">
          <h2>BRANCH MAP</h2>
          <span className="db-tree-picks">
            {Object.entries(picks.choices).map(([f, v]) => <span key={f} className="db-tree-chip">{f}: {v}</span>)}
            {!Object.keys(picks.choices).length && <span className="db-tree-chip off">no picks yet</span>}
          </span>
          {Remember}
          <button type="button" className="db-tree-btn" onClick={trash} title="Clear every pick">🗑 Reset picks</button>
          <button type="button" className="db-tree-btn db-tree-close" onClick={onClose} title="Close (Esc or ~)">✕ Close</button>
        </header>
        <p className="db-tree-hint">Click a pink or purple pill to play that choice · thin lines play on their own · every ending returns to splash</p>
        <svg className="db-tree-lines" width={LAYOUT.W} height={LAYOUT.H} aria-hidden="true">
          {drawn.map((e) => {
            const a = L.pos[e.from], b = L.pos[e.to], m = place[e.id];
            const d = m ? `M${a.x} ${a.y} Q${2 * m.x - (a.x + b.x) / 2} ${2 * m.y - (a.y + b.y) / 2} ${b.x} ${b.y}` : `M${a.x} ${a.y} L${b.x} ${b.y}`;
            return <path key={e.id} d={d} className={e.branching ? `br ${e.side}` : 'thin'} />;
          })}
        </svg>
        {g.nodes.map((n) => (
          <span key={n.id} className={`db-tree-node${n.id === here ? ' here' : ''}`} title={n.title}
            style={{ left: L.pos[n.id].x, top: L.pos[n.id].y }}>{n.id}</span>
        ))}
        {branches.map((e) => (
          <button type="button" key={e.id} className={`db-tree-edge ${e.side}`} style={{ left: place[e.id].x, top: place[e.id].y }}
            title={`${e.from} → ${e.to}`} onClick={() => go(e, picks.choices)} data-edge={e.id}>{e.text.replace('{OR}', 'OR')}</button>
        ))}
        {ask && (
          <div className="db-ask-scrim">
            <div className="db-ask" role="dialog" aria-modal="true" aria-labelledby="db-ask-q">
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
    </div>
  );
}
