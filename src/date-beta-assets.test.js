import test from 'node:test';
import assert from 'node:assert/strict';
import { makeAssets, placeholderImg } from './date-beta/assets.js';
import manifest from './date-beta/assets.json' with { type: 'json' };
import data from './date-beta/scenes.json' with { type: 'json' };

test('date-beta assets: manifest lookup by id and cue name', () => {
  const A = makeAssets({ cues: { rain: 'SX-20' }, assets: { 'SX-20': { kind: 'sfx', path: 'a/05_SX-20_rain.mp3' } } });
  assert.equal(A.get('SX-20').kind, 'sfx');
  assert.equal(A.url('SX-20'), '/a/05_SX-20_rain.mp3');
  assert.equal(A.cueId('rain'), 'SX-20');
  assert.equal(A.cueId('SX-20'), 'SX-20');
});

test('date-beta assets: missing ids fall back, never throw', () => {
  const A = makeAssets(undefined);
  assert.equal(A.get('BG-99'), null);
  assert.equal(A.url('BG-99'), null);
  assert.equal(A.cueId(null), null);
  assert.match(decodeURIComponent(placeholderImg('BG-99')), /BG-99/);
});

test('date-beta assets: every shipped sfx cue maps to a manifest id (or null = silence)', () => {
  const A = makeAssets(manifest);
  const cues = new Set(data.scenes.flatMap((s) => s.beats.flatMap((b) => [b.sfx,
    ...Object.values(b.vary ?? {}).flatMap((m) => Object.values(m).map((e) => e.sfx))])).filter(Boolean));
  for (const c of cues) { const id = A.cueId(c); assert.ok(id === null || A.get(id), `cue ${c} -> ${id}`); }
  for (const id of A.ids()) assert.ok(['sfx', 'bg', 'sprite', 'music'].includes(A.get(id).kind), id);
});
