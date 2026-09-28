// CircuitView: draws a real {nodes, wires} circuit with the real Shape, lit by sim.evaluate. Used by the identity cards,
// the match pop-up and the Date canvas, so what you see on every screen is the same evaluated circuit.
import { evaluate, pinCount } from '../../sim.js';
import { Shape, GATE_GEOM } from '../../nodes/index.jsx';
import { switchGeom, lampGeom } from '../../nodes/geom.js';

const SWG = switchGeom(), LG = lampGeom();
export const geomOf = (n) => (n.kind === 'S' ? SWG : n.kind === 'L' ? LG : GATE_GEOM[n.type]);
const insOf = (g) => (!g.in ? [] : Array.isArray(g.in[0]) ? g.in : [g.in]);
const outTip = (g) => [g.out[0] + (g.bubble ? 0 : 12), g.out[1]];
const GAPX = 64, GAPY = 26, LABEL = 30;

// Layer = longest path from a switch; lamps sit in the last layer. Each layer is a column, centred vertically.
export function layoutCircuit(c) {
  const ids = Object.keys(c.nodes);
  const into = {};
  for (const w of Object.values(c.wires)) (into[w.target] ??= []).push(w);
  const layer = {};
  const L = (id, depth = 0) => {
    if (id in layer) return layer[id];
    if (depth > 64) return 0;
    const ws = into[id] ?? [];
    return (layer[id] = ws.length ? 1 + Math.max(...ws.map((w) => L(w.source, depth + 1))) : 0);
  };
  ids.forEach((id) => L(id));
  const last = Math.max(0, ...ids.map((id) => layer[id]));
  ids.forEach((id) => { if (c.nodes[id].kind === 'L') layer[id] = Math.max(layer[id], last); });
  const cols = [];
  ids.forEach((id) => (cols[layer[id]] ??= []).push(id));
  const colW = cols.map((col) => Math.max(...(col ?? []).map((id) => geomOf(c.nodes[id]).w)));
  const colH = cols.map((col) => (col ?? []).reduce((s, id) => s + geomOf(c.nodes[id]).h, 0) + GAPY * ((col?.length ?? 1) - 1));
  const H = Math.max(...colH);
  const pos = {};
  let x = LABEL;
  cols.forEach((col, k) => {
    let y = (H - colH[k]) / 2;
    (col ?? []).forEach((id) => { const g = geomOf(c.nodes[id]); pos[id] = [x + (colW[k] - g.w) / 2, y]; y += g.h + GAPY; });
    x += colW[k] + GAPX;
  });
  return { pos, w: x - GAPX + 8, h: H };
}

export function CircuitView({ circuit, onToggle, className = 'cv', hurt, label }) {
  const v = evaluate(circuit);
  const { pos, w, h } = layoutCircuit(circuit);
  const bits = {};
  for (const wr of Object.values(circuit.wires)) (bits[wr.target] ??= [])[wr.pin] = v[wr.source];
  return (
    <svg className={hurt ? `${className} hurt` : className} viewBox={`-4 -8 ${w + 8} ${h + 16}`} role="img"
      aria-label={label ?? 'circuit'}>
      {Object.values(circuit.wires).map((wr) => {
        const s = circuit.nodes[wr.source], t = circuit.nodes[wr.target];
        const gs = geomOf(s), gt = geomOf(t);
        const [ox, oy] = outTip(gs), [ix, iy] = insOf(gt)[wr.pin];
        const sx = pos[s.id][0] + ox, sy = pos[s.id][1] + oy, tx = pos[t.id][0] + ix - 12, ty = pos[t.id][1] + iy;
        const mx = Math.round(tx - 18 - wr.pin * 10);
        return <path key={wr.id} className={v[s.id] ? 'w on' : 'w'} d={`M${sx} ${sy}H${mx}V${ty}H${tx}`} />;
      })}
      {Object.values(circuit.nodes).map((n) => {
        const g = geomOf(n), [x, y] = pos[n.id], on = v[n.id];
        const lit = n.kind === 'S' ? { out: on } : n.kind === 'L' ? { in: [on] } : { in: Array.from({ length: pinCount(n) }, (_, i) => !!bits[n.id]?.[i]), out: on };
        const tog = n.kind === 'S' && onToggle && n.id !== 'one';
        return (
          <g key={n.id} transform={`translate(${x} ${y})`} className={`nd k${n.kind}${tog ? ' tog' : ''}${on ? ' is-on' : ''}`}
            {...(tog ? { role: 'button', tabIndex: 0, 'aria-label': `switch ${n.label ?? n.id} is ${on ? 1 : 0}`, onClick: () => onToggle(n.id),
              onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(n.id); } } } : {})}>
            <Shape g={g} on={on} lit={lit} />
            {n.kind === 'S' && <text className="sw-l" x={-6} y={g.h / 2 + 7} textAnchor="end">{n.label ?? n.id.replace(/^.*:/, '')}</text>}
            {n.kind === 'S' && <text className="sw-v" x={g.w / 2 - 6} y={g.h / 2 + 9} textAnchor="middle">{on ? 1 : 0}</text>}
            {n.kind === 'G' && <text className="g-l" x={g.w / 2 - 8} y={g.h + 4} textAnchor="middle">{n.type}</text>}
          </g>
        );
      })}
    </svg>
  );
}
