// T1b INTERIORS pack: every patch hits a real scene/beat, every bg it sets is an interiors art id, and the patched
// script still loads (applyPacks lives on sprint/obbp; the `set`-only patch semantics are applied inline here).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { ART_NAMES } from './date-beta-art-names.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const base = read('./date-beta/scenes.json');
const manifest = read('./date-beta/assets.json');
const pack = read('./date-beta/packs/interiors.json');
const INDEX = readFileSync(new URL('./date-beta/art/interiors/index.js', import.meta.url), 'utf8');
const IDS = [...INDEX.slice(INDEX.indexOf('export const INTERIORS')).matchAll(/'?([\w-]+)'?: [A-Z]\w*/g)].map((m) => m[1]);

test('interiors: index exports art ids, each component file exists, art/index.js spreads the map', () => {
  assert.ok(IDS.includes('cellar'), 'cellar registered');
  for (const m of INDEX.matchAll(/import \w+ from '\.\/([\w.]+)'/g)) assert.ok(existsSync(new URL(`./date-beta/art/interiors/${m[1]}`, import.meta.url)), m[1]);
  assert.match(readFileSync(new URL('./date-beta/art/index.js', import.meta.url), 'utf8'), /\.\.\.INTERIORS \}/);
});

test('interiors pack: patches hit real beats, set only bg to interiors ids, script still loads', () => {
  assert.deepEqual(Object.keys(pack).filter((k) => !['note', 'patch', 'scenes', 'insert'].includes(k)), []);
  const data = structuredClone(base);
  for (const p of pack.patch) {
    const sc = data.scenes.find((s) => s.id === p.scene);
    assert.ok(sc, `scene ${p.scene}`);
    assert.ok(sc.beats[p.beat], `${p.scene}:${p.beat}`);
    assert.ok(IDS.includes(p.set.bg), `${p.scene}:${p.beat} bg ${p.set.bg} is an interiors id`);
    Object.assign(sc.beats[p.beat], p.set);
  }
  const scenes = loadScenes(data, { manifest, art: [...ART_NAMES, ...IDS] });
  const esc = scenes.find((s) => s.id === 'escape');
  assert.equal(esc.beats[0].bg, 'cellar');
  assert.equal(esc.beats[7].bg, 'blackout', 'blackouts untouched');
  assert.equal(esc.beats[12].bg, 'cellar');
  assert.equal(esc.beats[1].props.shelf, 'jars', 'shelf props carried as before');
});
