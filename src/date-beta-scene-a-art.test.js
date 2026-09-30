// Scene A art (Agent 1): the rooftop plates + the pink bento are registered, their traces exist within budget, and the
// art is still (reduced motion first: no timers, no stepped clocks, no CSS animation in these files).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';

const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const INDEX = src('./date-beta/art/scene-a/index.js');
const IDS = [...INDEX.slice(INDEX.indexOf('export const SCENE_A')).matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]);
const ROOF = src('./date-beta/art/rooftop/index.js');
const ROOF_IDS = [...ROOF.matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]);
const FILES = ['rooftop/parts.jsx', 'rooftop/Noon.jsx', 'rooftop/Warm.jsx', 'scene-a/Bento.jsx', 'scene-a/foods.jsx'];

test('scene-a: ids registered, spread into ART', () => {
  assert.deepEqual(ROOF_IDS, ['rooftop-noon', 'rooftop-warm']);
  for (const id of ['bento-insert', 'bento-lift', 'bento-lift-tama', 'bento-lift-ume']) assert.ok(IDS.includes(id), id);
  assert.match(INDEX, /\.\.\.ROOFTOP/);
  assert.match(src('./date-beta/art/index.js'), /\.\.\.SCENE_A,/);
  for (const f of FILES) assert.ok(existsSync(new URL(`./date-beta/art/${f}`, import.meta.url)), f);
});

test('scene-a: traced plates exist and fit the 600 KB budget', () => {
  for (const id of ['rooftop-noon', 'rooftop-warm', 'bento-pink']) {
    const u = new URL(`../public/date-beta/trace/${id}.svg`, import.meta.url);
    assert.ok(existsSync(u), id);
    assert.ok(statSync(u).size < 600_000, `${id} ${statSync(u).size} B`);
  }
});

test('scene-a: the art is still (no timers, no stepped clock, no animation)', () => {
  for (const f of FILES) {
    const s = src(`./date-beta/art/${f}`);
    for (const bad of [/setInterval|setTimeout|requestAnimationFrame/, /useStep|useNow/, /<animate|animation:|transition:/]) assert.doesNotMatch(s, bad, `${f} ${bad}`);
  }
});

test('scene-a: bento buttons are keyboard reachable and labelled', () => {
  const s = src('./date-beta/art/scene-a/Bento.jsx');
  assert.match(s, /role: 'button', tabIndex: 0, 'aria-label': label/);
  assert.match(s, /e\.key === 'Enter' \|\| e\.key === ' '/);
  assert.match(s, /labels\.ume \?\? 'Umeboshi'/);
  assert.match(s, /labels\.tama \?\? 'Tamagoyaki'/);
});
