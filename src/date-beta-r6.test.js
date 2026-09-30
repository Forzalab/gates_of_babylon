// R6 umeboshi critic pass (Tony 09-30, research/sprint-0930/r6/CRITIC.md): the fixes stay fixed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { applyPacks } from './date-beta/packs/index.js';

const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const read = (p) => JSON.parse(src(p));
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const D = applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
const sc = (id) => D.scenes.find((s) => s.id === id);
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = `${dir}/${f}`; return statSync(p).isDirectory() ? walk(p) : [p]; });

test('r6 HARD RULE: no stitched insert card anywhere (no .shot-card, no dashed card frame in the shot/insert code)', () => {
  const root = new URL('./date-beta', import.meta.url).pathname;
  for (const f of walk(root).filter((p) => /\.(jsx|js|css)$/.test(p))) {
    assert.doesNotMatch(readFileSync(f, 'utf8'), /shot-card/, `${f}: the stitched insert card is back`);
  }
  const ins = /export function Insert[\s\S]*?\n}\n/.exec(src('./date-beta/art/shots/Shots.jsx'))[0];
  assert.doesNotMatch(ins, /<rect|dasharray|Dasharray/, 'Insert must draw the item as the close-up, no card rect / stitched frame');
  assert.doesNotMatch(src('./date-beta/art/shots/shots.css'), /dasharray/);
  // every route: no beat's shot resolves to a card-style insert that carries its own frame
  const aliases = src('./date-beta/art/shots/aliases.js');
  assert.doesNotMatch(aliases, /card:\s*true|frame:\s*'card'/);
});

test('r6: park feet insert ("Two pairs of shoes walk out of the park") is cut; the errand pick routes on', () => {
  const park = sc('v2-park');
  assert.ok(!park.beats.some((b) => /Two pairs of shoes/.test(b.text ?? '') || b.props?.shot === 'feet-park'));
  for (const c of park.beats.at(-1).choices) assert.deepEqual(c.go, [{ if: { errand: 'groceries' }, to: 'v2-shop' }, { to: 'v2-library' }]);
});

test('r6: the shop beat says plainly you are there to shop her list; curry -> train clock runs in order', () => {
  assert.match(sc('v2-shop').beats[2].text, /here to shop/);
  assert.match(sc('v2-curry').beats[13].text, /3:40 PM/);
  const t0 = sc('v2-train').beats[0];
  assert.match(t0.text, /^4:30 PM/);
  assert.equal(t0.bg, 'station-gate-r3');
  assert.notEqual(t0.props.shot, 'match');
});

test('r6: the bento food picks are the normal choice buttons (db-choice), not their own pill style', () => {
  const s = src('./date-beta/SceneA.jsx');
  assert.match(s, /className=\{`db-choice \$\{c\.side\} sa-mini/);
  assert.doesNotMatch(s, /sa-food-tag|sa-other/);
});

test('r6: rain 1 react after stepping under = the near-lens umbrella (one umbrella)', () => {
  assert.match(src('./date-beta/main.jsx'), /const shared = !!\(beat\.react && beat\.props\?\.umbrella/);
});
