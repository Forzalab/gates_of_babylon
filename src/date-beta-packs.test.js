import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPacks } from './date-beta/packs/index.js';
import { loadScenes } from './date-beta/engine.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';

const ids = (d) => d.scenes.map((s) => s.id);
const ok = (d) => loadScenes(d, { manifest, art: ART_NAMES });
const first = base.scenes[0].id, second = base.scenes[1].id;
const extra = (id) => ({ id, bg: base.scenes[0].bg, beats: [{ text: 'Hi there.' }] });

test('no packs = same data, base untouched', () => {
  assert.deepEqual(applyPacks(base, []), base);
});
test('scenes append, insert moves them after anchor', () => {
  const d = applyPacks(base, [{ scenes: [extra('x1'), extra('x2')], insert: [{ after: first, ids: ['x1', 'x2'] }] }]);
  assert.deepEqual(ids(d).slice(0, 4), [first, 'x1', 'x2', second]);
  assert.equal(ids(base).includes('x1'), false);
  ok(d);
});
test('patch sets and removes beat fields', () => {
  const d = applyPacks(base, [{ patch: [{ scene: first, beat: 0, set: { scare: 1 } }] }]);
  assert.equal(d.scenes[0].beats[0].scare, 1);
  const e = applyPacks(d, [{ patch: [{ scene: first, beat: 0, set: { scare: null } }] }]);
  assert.equal('scare' in e.scenes[0].beats[0], false);
});
test('bad packs throw', () => {
  assert.throws(() => applyPacks(base, [{ scenes: [extra(first)] }]), /already exists/);
  assert.throws(() => applyPacks(base, [{ patch: [{ scene: 'nope', beat: 0, set: {} }] }]), /unknown scene/);
  assert.throws(() => applyPacks(base, [{ patch: [{ scene: first, beat: 999, set: {} }] }]), /no beat/);
  assert.throws(() => applyPacks(base, [{ insert: [{ after: first, ids: ['zz'] }] }]), /unknown scene/);
  assert.throws(() => applyPacks(base, [{ bogus: 1 }]), /unknown key/);
});
