// nearblur (sprint 0930): which beats carry props.near (fx/NearLens.jsx, the near-lens foreground cel), after all packs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const packs = PLAY.map((n) => { try { return { name: n, ...read(`./date-beta/packs/${n}.json`) }; } catch { return null; } }).filter(Boolean);
const scenes = loadScenes(applyPacks(read('./date-beta/scenes.json'), packs), { manifest: read('./date-beta/assets.json') });
const nearOf = (id) => scenes.find((s) => s.id === id).beats.map((b) => b.props?.near ?? null);
const IDS = /export const NEAR_IDS = \[([^\]]+)\]/.exec(src('./date-beta/fx/NearLens.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));

test('station crowd: beats 2-3 crowd, 4-5 crowd-bump (hat boy), and nothing else in v2-train but the 5:20 nap', () => {
  assert.deepEqual(nearOf('v2-train'), [null, null, 'crowd', 'crowd', 'crowd-bump', 'crowd-bump', null, 'hair', null]);
});

test('basement: every cellar beat of escape has the shelves; the blackout beats never do', () => {
  scenes.find((s) => s.id === 'escape').beats.forEach((b, i) => {
    if (b.bg === 'cellar') assert.equal(b.props?.near, 'shelves', `escape ${i}`);
    if (b.bg === 'blackout') assert.equal(b.props?.near ?? null, null, `escape ${i}`);
  });
});

test('rooftop fence only on the establishing beats (the handout + choice beats stay clean); genkan on v2-home 0', () => {
  const roof = nearOf('rooftop');
  assert.deepEqual(roof.slice(0, 3), ['fence', 'fence', 'fence']);
  assert.ok(roof.slice(3).every((n) => n === null));
  scenes.find((s) => s.id === 'rooftop').beats.forEach((b, i) => { if (b.choices) assert.equal(roof[i], null, `rooftop ${i}`); });
  assert.deepEqual(nearOf('v2-home'), ['genkan', null, null, null, null]);
});

test('every props.near in the game names a cel NearLens draws; the layer is static (no animation / keyframes)', () => {
  for (const s of scenes) for (const b of s.beats) if (b.props?.near) assert.ok(IDS.includes(b.props.near), `${s.id}: ${b.props.near}`);
  assert.doesNotMatch(src('./date-beta/fx/nearlens.css'), /animation|@keyframes|transition/);
  assert.doesNotMatch(src('./date-beta/fx/NearLens.jsx'), /useStep|setInterval|requestAnimationFrame/);
});
