// Figur collapse (src/collapse.js + collapseFrames.js) and the date-beta entry it lands on (spec: START-COLLAPSE v1).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { FRAMES, FRAME_MS, FLOOR_MS, VOID_MS, timeline, PILE, PILE_F4, GLITCH_TILES } from './collapseFrames.js';
import { makeAssets, beepHz } from './date-beta/assets.js';
import manifest from './date-beta/assets.json' with { type: 'json' };
import data from './date-beta/scenes.json' with { type: 'json' };

test('collapse: f1 tilt, f2 slip, f3 fall, f4 glitch, f5 void, 500 ms each, then the cut', () => {
  assert.deepEqual(FRAMES.map((f) => `${f.id} ${f.name}`), ['f1 tilt', 'f2 slip', 'f3 fall', 'f4 glitch', 'f5 void']);
  assert.equal(FRAME_MS, 500);
  const t = timeline();
  assert.deepEqual(t.filter((s) => !s.go).map((s) => s.frame), ['f1', 'f2', 'f3', 'f4', 'f5']);
  assert.equal(t.at(-1).go, true);
  assert.equal(t.at(-1).at, 4 * FRAME_MS + VOID_MS);
  assert.ok(VOID_MS >= 500 && VOID_MS <= 1000, 'void + silence 0.5-1 s');
});

test('collapse safety: every frame holds >= 334 ms, never more than 3 changes in any 1 s', () => {
  const at = timeline().map((s) => s.at); // the cut counts as a change too
  for (let i = 1; i < at.length; i++) assert.ok(at[i] - at[i - 1] >= FLOOR_MS, `step ${i} after ${at[i] - at[i - 1]} ms`);
  for (const t0 of at) assert.ok(at.filter((t) => t >= t0 && t < t0 + 1000).length <= 3, `window at ${t0}`);
});

test('collapse: the wordmark falls with the rest (no survivor variant, Tony 9/29 18:05)', () => {
  const src = readFileSync(new URL('./collapse.js', import.meta.url), 'utf8') + readFileSync(new URL('./collapse.css', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /survivor=|data-alone|cx-solo/);
});

test('collapse pile: all 16 tiles land; glitch stays under 25% of the viewport', () => {
  assert.deepEqual(Object.keys(PILE).map(Number).sort((a, b) => a - b), [...Array(16).keys()]);
  for (const i of Object.keys(PILE_F4)) assert.ok(i in PILE);
  assert.ok(GLITCH_TILES.length / 16 < 0.25);
});

test('collapse sfx: one cue per frame via assets.json; f1-f4 are crack/clack slots, f5 is silence', () => {
  const A = makeAssets(manifest);
  const ids = FRAMES.map((f) => A.cueId(f.cue));
  assert.deepEqual(ids, ['SX-C1', 'SX-C2', 'SX-C3', 'SX-C4', null]);
  for (const id of ids.filter(Boolean)) assert.equal(A.get(id).kind, 'sfx');
  assert.equal(new Set(ids.filter(Boolean).map(beepHz)).size, 4, 'placeholder beeps are told apart');
});

test('Logic mode: the Figur wordmark is the only way into Date', () => {
  const files = readdirSync(new URL('.', import.meta.url)).filter((f) => /\.(jsx?|css)$/.test(f) && !f.includes('.test.'));
  const hits = files.filter((f) => /date-(beta|aleph)\.html|\?game=|location\.(href|assign|replace)/.test(readFileSync(new URL(f, import.meta.url), 'utf8')));
  assert.deepEqual(hits, ['collapse.js']);
  const app = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8');
  assert.match(app, /<h1 className="wordmark"[^>]*\{\.\.\.wordmarkProps\}/);
  assert.equal(app.match(/wordmarkProps/g).length, 2, 'import + the h1, nothing else');
});

test('date-beta entry: scene 1 is the rooftop, as if START was pressed; the fake-site splash is out of the play path', () => {
  assert.equal(data.scenes[0].id, 'rooftop');
  assert.doesNotMatch(JSON.stringify(data.scenes), /"(bg|sprite|go|to)":"(splash|title)"/);
  const backs = data.scenes.flatMap((s) => s.beats.flatMap((b) => (b.choices ?? []).filter((c) => c.text === 'Back to start')));
  assert.equal(backs.length, 5);
  for (const c of backs) assert.equal(c.go, 'rooftop');
});
