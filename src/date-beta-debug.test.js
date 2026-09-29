import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, jumpTo, beatAt, beatView } from './date-beta/engine.js';
import { graph, layout, prereqs, missing, schemaHash, storeKey, loadPicks, savePicks, createSession, bootDebug, LAYOUT } from './date-beta/debug.js';
import data from './date-beta/scenes.json' with { type: 'json' };

const S = loadScenes(data);
const decl = data.flags;
const G = graph(S);
const edge = (id) => G.edges.find((e) => e.id === id);
const byText = (t) => G.edges.find((e) => e.text === t);
function mockStore(init = {}) {
  const m = new Map(Object.entries(init)), log = [];
  return { log, map: m, getItem: (k) => (log.push(['get', k]), m.get(k) ?? null), setItem: (k, v) => (log.push(['set', k]), m.set(k, String(v))),
    removeItem: (k) => (log.push(['rm', k]), m.delete(k)) };
}

test('debug: bento pick is branching; stay/leave and Back to start are not', () => {
  assert.ok(byText('Take the tamagoyaki').branching);
  assert.ok(byText('Take the umeboshi').branching);
  assert.equal(byText('Just one more minute, then I really have to go').branching, false);
  assert.equal(edge('rooftop.6.1').branching, false, 'stay/leave: stayed is never read');
  for (const e of G.edges.filter((x) => x.text === 'Back to start')) { assert.equal(e.branching, false); assert.equal(e.kind, 'back'); }
});

test('debug: edge snapshot', () => {
  assert.deepEqual(G.edges.map((e) => `${e.id}>${e.to}:${e.kind}`), [
    'rooftop.1.0>train:branch', 'rooftop.1.1>train:branch', 'rooftop.6.0>train:choice', 'rooftop.6.1>train:choice',
    'train.fall>naan:fall', 'naan.fall>blackout:fall', 'blackout.fall>door:fall', 'door.2.0>cup:branch', 'door.2.1>leave:branch',
    'cup.3.0>steeped:branch', 'cup.3.1>unknown:branch', 'steeped.4.0>rooftop:back', 'unknown.fall>escape:fall',
    'escape.2.0>escape-win:branch', 'escape.2.1>escape-timeout:branch', 'escape-win.6.0>rooftop:back', 'escape-timeout.7.0>rooftop:back',
    'leave.3.0>leave-yeah:branch', 'leave.3.1>leave-fu:branch', 'leave-fu.4.0>rooftop:back', 'leave-yeah.4.0>rooftop:back']);
});

test('debug: layout keeps every node and edge pill inside 1920x1080, columns follow the longest path', () => {
  const L = layout(G);
  assert.equal(L.pos.rooftop.col, 0);
  assert.equal(L.pos.door.col, 4);
  assert.ok(L.pos['escape-timeout'].col > L.pos.escape.col);
  for (const [id, p] of Object.entries(L.pos)) {
    assert.ok(p.x - p.w / 2 >= 0 && p.x + p.w / 2 <= LAYOUT.W, `${id} x ${p.x}`);
    assert.ok(p.y - 25 >= LAYOUT.top && p.y + 25 <= LAYOUT.H, `${id} y ${p.y}`);
  }
  const all = Object.entries(L.pos);
  for (const [a, p] of all) for (const [b, q] of all) {
    if (a < b && Math.abs(p.y - q.y) < 50) assert.ok(p.x + p.w / 2 <= q.x - q.w / 2 || q.x + q.w / 2 <= p.x - p.w / 2, `${a} overlaps ${b}`);
  }
});

test('debug: jumping to escape-timeout needs bento; the bento edge itself does not', () => {
  const t = edge('escape.2.1');
  assert.deepEqual(prereqs(S, t, decl).map((n) => n.flag), ['bento']);
  assert.deepEqual(prereqs(S, t, decl)[0].options.map((o) => o.value), ['tamagoyaki', 'umeboshi']);
  assert.deepEqual(prereqs(S, edge('rooftop.1.0'), decl), [], "the edge's own set covers it");
  assert.deepEqual(prereqs(S, edge('leave.3.1'), decl), []);
  assert.deepEqual(missing(prereqs(S, t, decl), { bento: 'umeboshi' }), []);
});

test('debug: saved picks fill the prompts; a schema change drops them', () => {
  const h = schemaHash(S, decl);
  const store = mockStore();
  savePicks(store, h, { remember: true, choices: { bento: 'tamagoyaki' } });
  const p = loadPicks(store, h, S, decl);
  assert.deepEqual(p, { remember: true, choices: { bento: 'tamagoyaki' } });
  assert.deepEqual(missing(prereqs(S, edge('escape.2.1'), decl), p.choices), []);
  const flip = { bento: ['tamagoyaki', 'umeboshi'] };
  const other = loadScenes({ ...data, flags: flip });
  const h2 = schemaHash(other, flip);
  assert.notEqual(h2, h);
  assert.deepEqual(loadPicks(store, h2, other, {}), { remember: false, choices: {} });
  store.map.set(storeKey(h), JSON.stringify({ remember: true, choices: { bento: 'natto', ghost: 1 } }));
  assert.deepEqual(loadPicks(store, h, S, decl).choices, {}, 'stale values are dropped on read');
  savePicks(store, h, { remember: false, choices: { bento: 'umeboshi' } });
  assert.equal(store.map.has(storeKey(h)), false, 'remember off = nothing kept for the next reload');
});

test('debug: session trash clears picks, remember toggle persists', () => {
  const store = mockStore();
  const s = createSession(() => store, S, decl);
  s.pick('bento', 'umeboshi');
  assert.equal(store.map.size, 0, 'fresh by default');
  s.remember(true);
  assert.equal(JSON.parse(store.map.get(storeKey(s.hash))).choices.bento, 'umeboshi');
  s.clear();
  assert.deepEqual(s.get(), { remember: true, choices: {} });
  assert.deepEqual(JSON.parse(store.map.get(storeKey(s.hash))).choices, {});
});

test('debug: jumpTo lands where choose would, with the flags given', () => {
  const p = jumpTo(S, edge('escape.2.1'), { bento: 'tamagoyaki' });
  assert.equal(S[p.s].id, 'escape-timeout');
  assert.equal(p.b, 0);
  assert.deepEqual(p.flags, { bento: 'tamagoyaki' });
  const q = jumpTo(S, edge('rooftop.1.1'), {});
  assert.equal(S[q.s].id, 'rooftop');
  assert.equal(q.b, 2);
  assert.equal(q.flags.bento, 'umeboshi');
  // walk to the sweet couplet
  let r = p;
  for (let i = 0; i < 5; i++) r = { ...r, b: r.b + 1 };
  assert.equal(beatView(beatAt(S, r), r.flags).text, 'NANDA: One sweet bite…');
});

test('debug: a normal boot never reads the saved key; ?debug does', () => {
  const store = mockStore({ [storeKey(schemaHash(S, decl))]: JSON.stringify({ remember: true, choices: { bento: 'umeboshi' } }) });
  const s = createSession(() => store, S, decl);
  for (const q of ['', '?scene=door', '?still', '?scene=escape&beat=2']) assert.equal(bootDebug(new URLSearchParams(q), s), false);
  assert.deepEqual(store.log, [], 'storage untouched');
  assert.equal(bootDebug(new URLSearchParams('?debug'), s), true);
  assert.deepEqual(store.log.map((l) => l[0]), ['get']);
  // main.jsx touches localStorage only through the lazy session
  const src = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
  assert.equal(src.match(/localStorage/g).length, 1);
  assert.match(src, /createSession\(\(\) => localStorage/);
});
