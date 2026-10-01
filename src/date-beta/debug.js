// debug.js: the secret branch map (`~` or ?debug). Pure data, no DOM, no React (node --test drives it).
// graph(scenes)   -> nodes (scenes) + edges. A choice edge is `branching` when its beat's choices lead to different
//                    scenes, or it sets a flag something reads (if / go.if / vary). Everything else is drawn thin and is
//                    not clickable: fall-through, faux-pas picks (stay/leave: `stayed` is never read), Back to start.
// layout(g, o, legacy) -> boxes for every scene node and branching pill on a canvas sized to the script (no overlaps).
// prereqs(...)    -> the flags an edge's downstream reads that the edge does not set itself, in script order, each with
//                    the options its setter choices offer. The UI asks for each one still unset.
// storage         -> localStorage `dateBeta.debug.<schema hash>` = { remember, choices }. Only the tree reads it; a
//                    normal boot never does. A new flag schema = a new key, so old picks drop on their own.

const goTargets = (go) => (go == null ? [] : typeof go === 'string' ? [go] : go.map((g) => (typeof g === 'string' ? g : g.to)));
const goFlags = (go) => (Array.isArray(go) ? go.flatMap((g) => (typeof g === 'string' ? [] : Object.keys(g.if ?? {}))) : []);
const always = (go) => go != null && (typeof go === 'string' || go.some((g) => typeof g === 'string' || !g.if));

// Flags a beat reads: vary keys, choice `if`s, conditional go.
const beatReads = (beat) => [...Object.keys(beat.vary ?? {}),
  ...(beat.choices ?? []).flatMap((c) => [...Object.keys(c.if ?? {}), ...goFlags(c.go)])];

// Where a choice lands: its scene targets, or (no unconditional go) the next beat in this scene.
function landings(scenes, s, b, c) {
  const out = goTargets(c.go).map((id) => ({ s: scenes.findIndex((x) => x.id === id), b: 0 }));
  if (!always(c.go)) out.push({ s, b: b + 1 });
  return out;
}

// Walk forward from a spot (beats, then scenes) collecting flags read, never entering `skipScenes` (the start).
function downstream(scenes, from, skipScenes) {
  const seen = new Set(), reads = [];
  const stack = [...from];
  while (stack.length) {
    let { s, b } = stack.pop();
    if (s < 0) continue;
    for (;;) {
      if (s >= scenes.length) break;
      if (b >= scenes[s].beats.length) { s += 1; b = 0; continue; }
      if (b === 0 && skipScenes.has(scenes[s].id)) break;
      const key = `${s}:${b}`;
      if (seen.has(key)) break;
      seen.add(key);
      const beat = scenes[s].beats[b];
      for (const f of beatReads(beat)) if (!reads.includes(f)) reads.push(f);
      if (beat.choices) {
        for (const c of beat.choices) stack.push(...landings(scenes, s, b, c));
        break;
      }
      b += 1;
    }
  }
  return reads;
}

export function graph(scenes) {
  const first = scenes[0].id;
  const read = new Set(scenes.flatMap((sc) => sc.beats.flatMap(beatReads)));
  const nodes = scenes.map((sc, s) => ({ id: sc.id, title: sc.title, s }));
  const edges = [];
  scenes.forEach((sc, s) => {
    sc.beats.forEach((beat, b) => {
      if (!beat.choices) return;
      const split = new Set(beat.choices.map((c) => landings(scenes, s, b, c).map((l) => `${l.s}:${l.b}`).join(','))).size > 1;
      beat.choices.forEach((c, i) => {
        const sets = Object.keys(c.set ?? {});
        const back = goTargets(c.go).includes(first);
        const branching = !back && (split || sets.some((f) => read.has(f)));
        // A choice with no go lands later in its own scene; the drawn edge goes to where the scene falls through to.
        // A lone no-go, non-branching pick is a step (open the hatch, climb down): nothing to draw.
        if (beat.choices.length === 1 && c.go == null && !branching) return;
        const to = goTargets(c.go)[0] ?? scenes[s + 1]?.id ?? null;
        edges.push({ id: `${sc.id}.${b}.${i}`, from: sc.id, to, s, b, i, text: c.plain, side: c.side, set: c.set ?? null,
          kind: back ? 'back' : branching ? 'branch' : 'choice', branching });
      });
    });
    // Fall-through: the scene can end without a go (its last choice beat, if any, has a choice with no unconditional go).
    const lastChoice = sc.beats.findLastIndex((x) => x.choices);
    const falls = lastChoice < 0 || sc.beats[lastChoice].choices.some((c) => !always(c.go)) || lastChoice < sc.beats.length - 1;
    if (falls && s + 1 < scenes.length && !edges.some((e) => e.from === sc.id && e.to === scenes[s + 1].id)) {
      edges.push({ id: `${sc.id}.fall`, from: sc.id, to: scenes[s + 1].id, s, kind: 'fall', branching: false });
    }
  });
  return { nodes, edges, first };
}

// A pannable canvas whose W x H grow with the script (no fixed stage). Columns = longest path from the first scene
// (back-edges ignored). Each scene is a block: its node, then its branching pills stacked under it in one column, so
// nodes and pills never share space. A block sits at its parents' mean y (the pill's own y when a pill leads there),
// pushed down past the block above it. `legacy` (scenes the game cannot reach from scene 1) get their own lane under
// the main map, on the same column grid. Box sizes are estimated from the text (mono ids, bold pill labels) and the
// UI draws every box at exactly that size, so the estimate is the box.
export const LAYOUT = { margin: 60, colGap: 150, laneGap: 150, blockGap: 36, nodeH: 48, pillH: 38, pillGap: 10, indent: 30,
  ch: 10.8, pad: 44, pillCh: 10.5, pillPad: 40 };
export const nodeWidth = (id, o = LAYOUT) => Math.ceil(id.length * o.ch + o.pad);
export const pillText = (e) => String(e.text ?? '').replace('{OR}', 'OR');
export const pillWidth = (e, o = LAYOUT) => Math.ceil(pillText(e).length * o.pillCh + o.pillPad);
export function layout(g, o = LAYOUT, legacy = new Set()) {
  const fwd = g.edges.filter((e) => e.kind !== 'back' && e.to);
  const idx = Object.fromEntries(g.nodes.map((n, i) => [n.id, i]));
  const lane = (id) => (legacy.has(id) ? 1 : 0);
  const col = Object.fromEntries(g.nodes.map((n) => [n.id, 0]));
  // Scenes are in script order and forward edges only point later, so one pass in order settles longest paths.
  // A lane's columns count only edges inside that lane.
  for (const n of g.nodes) {
    for (const e of fwd) {
      if (e.from === n.id && idx[e.to] > idx[n.id] && lane(e.to) === lane(n.id)) col[e.to] = Math.max(col[e.to], col[n.id] + 1);
    }
  }
  const pillsOf = Object.fromEntries(g.nodes.map((n) => [n.id, fwd.filter((e) => e.branching && e.from === n.id)]));
  const blockW = (n) => Math.max(nodeWidth(n.id, o), ...pillsOf[n.id].map((e) => o.indent + pillWidth(e, o)));
  const blockH = (n) => o.nodeH + pillsOf[n.id].length * (o.pillGap + o.pillH);
  const cols = Math.max(...Object.values(col)) + 1;
  const left = [];
  let x = o.margin;
  for (let c = 0; c < cols; c++) {
    left.push(x);
    x += Math.max(0, ...g.nodes.filter((n) => col[n.id] === c).map(blockW)) + o.colGap;
  }
  const W = x - o.colGap + o.margin;
  const pos = {}, pills = {}, anchor = {}; // anchor: node id / pill edge id -> the y its outgoing edge leaves from
  const lanes = [];
  let top = o.margin;
  for (const l of [0, 1]) {
    const mine = g.nodes.filter((n) => lane(n.id) === l);
    if (!mine.length) continue;
    let bottom = top;
    for (let c = 0; c < cols; c++) {
      const want = (n) => {
        const ys = fwd.filter((e) => e.to === n.id && lane(e.from) === l && pos[e.from]).map((e) => anchor[e.branching ? e.id : e.from]);
        return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length - o.nodeH / 2 : top;
      };
      const here = mine.filter((n) => col[n.id] === c).map((n) => ({ n, y: want(n) }));
      here.sort((a, b) => a.y - b.y || idx[a.n.id] - idx[b.n.id]);
      let cursor = top;
      for (const { n, y: wy } of here) {
        const y = Math.max(wy, cursor), w = nodeWidth(n.id, o);
        pos[n.id] = { x: left[c] + w / 2, y: y + o.nodeH / 2, col: c, w, h: o.nodeH, legacy: l === 1 };
        anchor[n.id] = pos[n.id].y;
        pillsOf[n.id].forEach((e, i) => {
          const pw = pillWidth(e, o), py = y + o.nodeH + o.pillGap + i * (o.pillGap + o.pillH) + o.pillH / 2;
          pills[e.id] = { x: left[c] + o.indent + pw / 2, y: py, w: pw, h: o.pillH };
          anchor[e.id] = py;
        });
        cursor = y + blockH(n) + o.blockGap;
      }
      bottom = Math.max(bottom, cursor - o.blockGap);
    }
    lanes.push({ legacy: l === 1, top, bottom });
    top = bottom + o.laneGap;
  }
  return { cols, W, H: lanes.at(-1).bottom + o.margin, left, lanes, pos, pills };
}

// Flags the edge's downstream reads, minus what the edge sets, in script order; options = the choices that set them.
export function prereqs(scenes, edge, decl = {}) {
  const c = scenes[edge.s].beats[edge.b].choices[edge.i];
  const reads = downstream(scenes, landings(scenes, edge.s, edge.b, c), new Set([scenes[0].id]));
  const own = new Set(Object.keys(c.set ?? {}));
  const order = scriptOrder(scenes);
  return reads.filter((f) => !own.has(f)).sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((flag) => ({ flag, options: setters(scenes, flag, decl) }));
}
function scriptOrder(scenes) {
  const out = [];
  for (const sc of scenes) for (const b of sc.beats) {
    for (const f of [...Object.keys(b.set ?? {}), ...(b.choices ?? []).flatMap((c) => Object.keys(c.set ?? {})), ...beatReads(b)]) {
      if (!out.includes(f)) out.push(f);
    }
  }
  return out;
}
export function setters(scenes, flag, decl = {}) {
  const out = [];
  for (const sc of scenes) for (const b of sc.beats) for (const c of b.choices ?? []) {
    const v = c.set?.[flag];
    if (v != null && !out.some((o) => o.value === v)) out.push({ value: v, label: c.plain, side: c.side });
  }
  for (const v of decl[flag] ?? []) if (!out.some((o) => o.value === v)) out.push({ value: v, label: String(v), side: out.length % 2 ? 'purple' : 'pink' });
  return out;
}
// Which prereqs still need an answer, given the picks so far.
export const missing = (needs, picks = {}) => needs.filter((n) => picks[n.flag] == null);

// Storage. The key hashes the flag schema (declared flags + every setter), so editing the script drops stale picks.
export function schemaHash(scenes, decl = {}) {
  const src = JSON.stringify([decl, scenes.flatMap((sc) => sc.beats.flatMap((b) => (b.choices ?? []).map((c) => c.set ?? null)))]);
  let h = 0x811c9dc5;
  for (let i = 0; i < src.length; i++) { h ^= src.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return (h >>> 0).toString(36);
}
export const storeKey = (hash) => `dateBeta.debug.${hash}`;
export function loadPicks(store, hash, scenes, decl = {}) {
  let raw = null;
  try { raw = JSON.parse(store?.getItem(storeKey(hash)) ?? 'null'); } catch { raw = null; }
  if (!raw || typeof raw !== 'object' || !raw.remember) return { remember: false, choices: {} };
  const choices = {};
  for (const [k, v] of Object.entries(raw.choices ?? {})) if (setters(scenes, k, decl).some((o) => o.value === v)) choices[k] = v;
  return { remember: true, choices };
}
export function savePicks(store, hash, { remember, choices }) {
  try {
    if (remember) store?.setItem(storeKey(hash), JSON.stringify({ remember: true, choices }));
    else store?.removeItem(storeKey(hash));
  } catch { /* private mode: picks just stay in memory */ }
}

// One picks session per page. Nothing touches storage until the tree first needs the picks (lazy `get`).
export function createSession(getStore, scenes, decl = {}) {
  const hash = schemaHash(scenes, decl);
  let st = null;
  const store = () => { try { return getStore(); } catch { return null; } };
  const get = () => (st ??= loadPicks(store(), hash, scenes, decl));
  const put = (next) => { st = next; savePicks(store(), hash, st); return st; };
  return {
    hash, get,
    pick: (flag, value) => put({ ...get(), choices: { ...get().choices, [flag]: value } }),
    remember: (on) => put({ ...get(), remember: !!on }),
    clear: () => put({ ...get(), choices: {} }),
  };
}
// Boot: the tree opens (and reads storage) only for ?debug. A plain boot never calls the session.
export function bootDebug(params, sess) {
  if (!params.has('debug')) return false;
  sess.get();
  return true;
}
