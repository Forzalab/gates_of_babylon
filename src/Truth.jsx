import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { evaluate } from './sim.js';
import TTBox from './TTBox.jsx';
import TTPopup, { OpenIcon } from './TTPopup.jsx';
import { partNames } from './names.js';

// Truth table built from the circuit (Kerney req. 2). Inputs = switches ordered top-to-bottom on the canvas (then
// left-to-right), outputs = lamps in the same order. 2^n rows, MSB = the top switch. Rows are computed once per circuit
// SHAPE (wires, parts, order), not per toggle; only a window of rows is rendered, so 13 switches (8,192 rows) stay cheap.
// The live row = the switches' current values. Clicking a row sets the switches to it.

export default memo(Truth);
function Truth({ circuit, view, fig, setSwitches }) {
  const byPos = (kind) => view.filter((n) => circuit.nodes[n.id]?.kind === kind)
    .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x).map((n) => n.id);
  const ins = byPos('S'), outs = byPos('L');
  const shape = JSON.stringify([ins, outs, circuit.wires, Object.values(circuit.nodes).map((n) => [n.id, n.kind, n.type])]);
  const rows = useMemo(() => {
    const n = ins.length, all = [];
    for (let r = 0; r < 2 ** n; r++) {
      const bits = ins.map((_, i) => (r >> (n - 1 - i)) & 1);
      const nodes = { ...circuit.nodes };
      ins.forEach((id, i) => { nodes[id] = { ...nodes[id], value: !!bits[i] }; });
      const v = evaluate({ ...circuit, nodes });
      all.push([...bits, ...outs.map((id) => +!!v[id])]);
    }
    return all;
  }, [shape]); // eslint-disable-line react-hooks/exhaustive-deps

  const live = ins.reduce((acc, id) => acc * 2 + (circuit.nodes[id].value ? 1 : 0), 0);
  const names = partNames(view, circuit); // same function the canvas plates use
  const heads = [...ins, ...outs].map((id) => names[id]);
  const classic = ins.length === 2 && outs.length === 1; // the fitted A / B / OUT header glyphs apply only here

  const [open, setOpen] = useState(false), openBtn = useRef(null);
  const close = useCallback(() => { setOpen(false); requestAnimationFrame(() => openBtn.current?.focus()); }, []);

  // Inline cell: the box ends 32u above the row-03 rule (combo-2, Tony), the same margin as under TRUTH TABLE.
  // J-6 anchors the block at the top, so it fills downward.
  const limit = (el) => el.closest('.truth').getBoundingClientRect().bottom - 32 * (el.closest('.frame').clientWidth / 1440);

  // T4-tt: no switch or no lamp = nothing to tabulate. Show an empty state, never stale rows or a stale live row.
  if (!ins.length || !outs.length) return (
    <aside className="cell c-side r2 truth" aria-label="Truth table">
      <h2 className="label">Truth table</h2>
      <div className="tt-empty" role="img" aria-label="Empty: add a switch and a lamp">
        <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100"><line x1="0" y1="0" x2="100" y2="100" /><line x1="100" y1="0" x2="0" y2="100" /></svg>
      </div>
    </aside>
  );
  return (
    <aside className="cell c-side r2 truth" aria-label="Truth table">
      <h2 className="label">Truth table</h2>
      <button className="tt-ico" ref={openBtn} aria-label="Open full truth table" aria-haspopup="dialog" onClick={() => setOpen(true)}><OpenIcon /></button>
      <TTBox rows={rows} ins={ins} heads={heads} live={live} setSwitches={setSwitches} fig={fig} classic={classic} limit={limit} />
      {open && openBtn.current?.closest('.app') && <TTPopup host={openBtn.current.closest('.app')} onClose={close}
        rows={rows} ins={ins} heads={heads} live={live} setSwitches={setSwitches} fig={fig} classic={classic} />}
    </aside>
  );
}
