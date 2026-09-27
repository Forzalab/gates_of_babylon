import { useRef, useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, useStore, useStoreApi } from '@xyflow/react';
import { toPath, midpoint, stepFallback, EDGE, MARGIN } from './route.js';
import { routeAll, shares, JN, DOT_R } from './junction.js';
import { crossings, hopPath } from './hop.js';
import { STROKE, ZOOM_EXP } from './nodes/geom.js';
import Remove from './Remove.jsx';

// All wires are routed together (junction.js): fan-out siblings share a trunk, and shared runs / junction dots need
// every route at once. One computation per store change, shared by every Wire through a module cache.
const boxOf = (n) => ({ x: n.internals.positionAbsolute.x, y: n.internals.positionAbsolute.y, w: n.measured?.width ?? 0, h: n.measured?.height ?? 0 });
const pin = (n, id, src) => { const h = (src ? n.internals.handleBounds?.source : n.internals.handleBounds?.target)?.find((k) => k.id === id); if (!h) return null;
  const p = n.internals.positionAbsolute; return [p.x + h.x + (src ? h.width : 0), p.y + h.y + h.height / 2]; };
// Canvas top edge + EDGE in flow units (pane origin = canvas top), or null while no part is near enough for a route
// to reach it (routes never climb above the highest box - MARGIN): keeps panning from re-routing every frame.
const topOf = (s) => {
  const top = Math.round(-s.transform[1] / s.transform[2]) + EDGE;
  for (const n of s.nodeLookup.values()) if (n.internals.positionAbsolute.y - MARGIN < top) return top;
  return null;
};
const cache = { key: null, val: null };
function compute(s) {
  const list = [], nets = {}, top = topOf(s);
  for (const e of s.edges) {
    const a = s.nodeLookup.get(e.source), b = s.nodeLookup.get(e.target); if (!a || !b) continue;
    const sp = pin(a, e.sourceHandle, true), tp = pin(b, e.targetHandle, false); if (!sp || !tp) continue;
    const others = []; for (const n of s.nodeLookup.values()) if (n.id !== a.id && n.id !== b.id) others.push(boxOf(n));
    list.push({ id: e.id, source: e.source, s: sp, t: tp, src: boxOf(a), dst: boxOf(b), others, top });
    nets[e.id] = { source: e.source, on: e.className === 'on' };
  }
  const routes = routeAll(list), share = shares(routes, nets);
  return { routes, src: Object.fromEntries(list.map((w) => [w.id, w.source])), ends: Object.fromEntries(list.map((w) => [w.id, [w.s, w.t]])), share,
    bundles: bundlesOf(routes, share, nets) };
}
// Tony: a count tag on bunched wires. A bundle = one shared stretch; its wires = every route that runs along all of it.
// One tag per stretch >= 40 flow px, owned (rendered) by the bundle's first wire id; lit = every wire in it carries 1.
const k2 = (p) => `${Math.round(p[0])},${Math.round(p[1])}`;
function bundlesOf(routes, share, nets) {
  const by = new Map();
  for (const [id, sh] of Object.entries(share)) for (const r of sh.runs) {
    const key = [k2(r.a), k2(r.b)].sort().join('|');
    if (!by.has(key)) by.set(key, { a: r.a, b: r.b, ids: new Set() });
    by.get(key).ids.add(id);
  }
  // One tag per bundle (same set of wires), on its longest straight stretch: a trunk that turns a corner is still one bundle.
  const best = new Map();
  for (const b of by.values()) {
    const len = Math.abs(b.a[0] - b.b[0]) + Math.abs(b.a[1] - b.b[1]); if (len < 40 || b.ids.size < 2) continue;
    const ids = [...b.ids].sort(), key = ids.join(',');
    if (!best.has(key) || best.get(key).len < len) best.set(key, { len, owner: ids[0], ids, n: ids.length, lit: ids.every((i) => nets[i]?.on), at: [(b.a[0] + b.b[0]) / 2, (b.a[1] + b.b[1]) / 2] });
  }
  return [...best.values()];
}
const keyOf = (s) => {
  let k = `${topOf(s)};`;
  for (const n of s.nodeLookup.values()) { const p = n.internals.positionAbsolute; k += `${n.id}:${p.x},${p.y},${n.measured?.width},${n.measured?.height},${n.internals.handleBounds ? 1 : 0};`; }
  for (const e of s.edges) k += `${e.id}>${e.source}.${e.target}.${e.targetHandle}.${e.className};`;
  return k;
};
function useRoutes() {
  const key = useStore(keyOf);
  const api = useStoreApi();
  if (cache.key !== key) { cache.key = key; cache.val = compute(api.getState()); }
  return cache.val;
}

const line = ([a, b], cls, key) => <path key={key} className={cls} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} />;

// Wire = right-angle route. Hover shows the delete X at the path midpoint; hovering the X previews the result
// (the wire goes dotted, like a free pin's stub). A click on the wire itself does nothing.
export default function Wire({ id, sourceX, sourceY, targetX, targetY, data }) {
  const all = useRoutes();
  const pts = all.routes[id], sh = all.share[id] ?? { runs: [], dots: [] };
  const sw = useStore((s) => STROKE * (s.transform[2] / (s.width / 906)) ** (ZOOM_EXP - 1));
  const z = useStore((s) => s.transform[2]); // bundle tags scale like the X (Remove.jsx --rs)
  let path, mx, my;
  if (pts) {
    // combo-1 ownership: hops only over FOREIGN nets (a same-net overlap is a junction trunk, not a crossing), and never
    // within one hop footprint (5sw) + DOT_R of any junction dot: the dot owns that spot.
    const lines = Object.entries(all.routes).filter(([k, r]) => r && k !== id && all.src[k] !== all.src[id]).map(([, r]) => r);
    const dots = Object.values(all.share).flatMap((v) => v.dots ?? []);
    const cx = crossings(pts, lines, sw).map((c) => ({ ...c, ok: c.ok && !dots.some(([x, y]) => Math.hypot(x - c.x, y - c.y) < 5 * sw + DOT_R) }));
    path = hopPath(pts, cx, sw); [mx, my] = midpoint(pts);
  }
  else { const f = stepFallback([sourceX, sourceY], [targetX, targetY]); path = toPath(f); [mx, my] = midpoint(f); } // img12: no zero-radius Q corners
  const [hover, setHover] = useState(false), [arm, setArm] = useState(false);
  const t = useRef(0);
  const enter = () => { clearTimeout(t.current); setHover(true); };
  const leave = () => { t.current = setTimeout(() => setHover(false), 150); }; // lets the pointer travel onto the X
  return (
    <>
      <g className={arm ? 'armed' : ''}><BaseEdge id={id} path={path} interactionWidth={24} /></g>
      {!arm && pts && <g className="jn">
        {sh.runs.map((r, i) => r.same
          ? (JN === 'a' ? line([r.a, r.b], 'trunk', i) : JN === 'b' ? [line([r.a, r.b], 'twin', i + 't'), line([r.a, r.b], 'twin-gap', i + 'g')] : null)
          : r.mix ? [line([r.a, r.b], 'mix0', i + 'm0'), line([r.a, r.b], 'mix1', i + 'm1')] : null)}
        {sh.dots.map(([x, y], i) => <circle key={'d' + i} className="dot" cx={x} cy={y} r={DOT_R} />)}
      </g>}
      <path className="wire-hit" d={path} fill="none" stroke="transparent" strokeWidth={24} onPointerEnter={enter} onPointerLeave={leave} />
      {all.bundles?.filter((b) => b.owner === id && !hover).map((b, i) => (
        <EdgeLabelRenderer key={'bt' + i}>
          <span className={`bundle-tag ${b.lit ? 'on' : ''}`} aria-label={`${b.n} wires`}
            style={{ '--rs': 1 / Math.sqrt(z), transform: `translate(-50%, -50%) translate(${b.at[0]}px, ${b.at[1]}px) scale(var(--rs))` }}>{b.n}</span>
        </EdgeLabelRenderer>))}
      {hover && (
        <EdgeLabelRenderer>
          <Remove label="Delete wire" onRemove={() => data.onRemove(id)}
            onHover={(on) => { setArm(on); on ? enter() : leave(); }}
            style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${mx}px, ${my}px) scale(var(--rs))` }} />
        </EdgeLabelRenderer>
      )}
    </>
  );
}
