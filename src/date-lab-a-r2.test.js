// Builder A round 2 (date-lab): pure tests for the r2 menu scripts, camera hybrid timeline and close-up beats.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { slowRetype, warmAt, cupScript, textAt, endOf, STAY, SLOW } from './date-lab/a/menu2/script.js';
import { OPTIONS, DUR } from './date-lab/a/kit/menu.js';
import { TICK, POSE, words } from './date-lab/a/kit/time.js';

const onGrid = (frames) => frames.every((f) => f.at % TICK === 0 || f.at === frames[0].at);
const gaps = (frames) => frames.slice(1).map((f, i) => f.at - frames[i].at);

test('h1-r2: run 1, her cursor retypes YOUR slip "Goodnight." -> "Stay." slowly, and finishes before the 5 s timer', () => {
  const s = cupScript(1, [], false);
  assert.equal(s.typing, 'purple');
  assert.equal(textAt(s.purple, 0), OPTIONS.purple.text);
  assert.equal(textAt(s.purple, 99999), STAY);
  assert.ok(endOf(s.purple) < DUR, `ends at ${endOf(s.purple)}`);
  assert.ok(gaps(s.purple).every((g) => g >= SLOW), 'one key every >= 250 ms (slow enough to watch)');
  assert.ok(onGrid(s.purple));
  assert.equal(textAt(s.pink, 99999), OPTIONS.pink.text, 'her card is never edited on run 1');
});

test('h1-r2: your card warms in held steps (>= 500 ms each), 0 -> 1', () => {
  const s = cupScript(1, [], false);
  let prev = warmAt(s.purple, 0), since = 0, steps = 0;
  assert.equal(prev, 0);
  for (let t = 0; t <= DUR; t += 25) {
    const w = warmAt(s.purple, t);
    if (w !== prev) { assert.ok(w > prev); assert.ok(t - since >= POSE, `step at ${t} held ${t - since}`); since = t; prev = w; steps++; }
  }
  assert.equal(prev, 1);
  assert.ok(steps >= 3);
});

test('h1-r2: replay states: purple disabled keeps the struck retyped text; pink disabled -> both cards say pink', () => {
  const a = cupScript(2, ['purple'], false);
  assert.equal(textAt(a.purple, 4000), STAY);
  const b = cupScript(2, ['pink'], false);
  assert.equal(textAt(b.purple, 99999), OPTIONS.pink.text);
  assert.ok(endOf(b.purple) < DUR);
  assert.ok(onGrid(b.purple));
});

test('h1-r2: reduced motion = at most 3 hard cuts, each held >= 1 s', () => {
  for (const [run, dis] of [[1, []], [2, ['pink']], [2, ['purple']]]) {
    const s = cupScript(run, dis, true);
    for (const f of [s.pink, s.purple]) {
      assert.ok(f.length <= 3);
      assert.ok(gaps(f).every((g) => g >= 1000));
    }
  }
  assert.deepEqual(slowRetype('ab', 'a', 'c', 0, { rm: true }).map((f) => f.text), ['ab', 'a', 'ac']);
});

// every quoted "NANDA: ..." / "MC: ..." line in the r2 sources obeys <= 12 words per click
export const R2_FILES = ['menu2/CupTypes.jsx'];
test('r2: every builder-A r2 line is <= 12 words', () => {
  for (const f of R2_FILES) {
    const src = readFileSync(new URL(`./date-lab/a/${f}`, import.meta.url), 'utf8');
    for (const m of src.matchAll(/'((?:NANDA|MC): [^']*)'|"((?:NANDA|MC): [^"]*)"/g)) {
      const line = (m[1] ?? m[2]).replace(/^[A-Z]+: /, '');
      assert.ok(words(line) <= 12, `${f}: ${line}`);
    }
  }
});
