// Builder A round 3 (date-lab): pure tests for the r3 menus (chunk-swap edits), camera final and SOUR close-up.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wordEdit, halves, swapsSafe, textAt, endOf, doneAt, GAP } from './date-lab/a/menu3/chunks.js';
import { cupScript, ddlcScript, mcLine, leaEdit, STAY, MC_FROM } from './date-lab/a/menu3/script3.js';
import { OPTIONS, DUR } from './date-lab/a/kit/menu.js';
import { POSE, words } from './date-lab/a/kit/time.js';

const src = (f) => readFileSync(new URL(`./date-lab/a/${f}`, import.meta.url), 'utf8');
const lines = (f) => [...src(f).matchAll(/'((?:NANDA|MC): [^']*)'|"((?:NANDA|MC): [^"]*)"/g)].map((m) => (m[1] ?? m[2]).replace(/^[A-Z]+: /, ''));
const gaps = (frames) => frames.slice(1).map((f, i) => f.at - frames[i].at);

test('r3 chunks: an edit is select -> delete -> <= 2 typed chunks, each swap held >= 500 ms (<= 2 swaps/s)', () => {
  const f = wordEdit("It's late. Goodnight.", "It's late. ", 'Stay.', 250);
  assert.deepEqual(f.map((x) => x.text), ["It's late. Goodnight.", "It's late. Goodnight.", "It's late. ", "It's late. Sta", STAY]);
  assert.equal(f[1].sel, 'Goodnight.'.length, 'the doomed word is shown selected in her red first');
  assert.ok(gaps(f).every((g) => g >= GAP && g >= POSE));
  assert.ok(swapsSafe([f]));
  assert.deepEqual(halves('take your time ♡'), ['take ', 'take your time ♡']);
  assert.deepEqual(halves(' ♡'), [' ♡']);
  const rm = wordEdit("It's late. Goodnight.", "It's late. ", 'Stay.', 250, { rm: true });
  assert.ok(rm.length <= 3 && gaps(rm).every((g) => g >= 1000), 'RM: <= 3 hard cuts held 1 s');
  assert.throws(() => wordEdit('abc', 'x', 'y'));
});

test('menu-h1-r3: run 1 retypes your slip to "Stay." before the 5 s timer, <= 2 swaps/s; warmth steps with her swaps', () => {
  const s = cupScript(1, [], false);
  assert.equal(textAt(s.purple, 0), OPTIONS.purple.text);
  assert.equal(textAt(s.purple, 99999), STAY);
  assert.ok(endOf(s.purple) < DUR);
  assert.ok(swapsSafe([s.purple, s.pink]));
  assert.deepEqual([0, 800, 1300, 1800, 2300].map((t) => doneAt(s.purple, t)), [0, 0.25, 0.5, 0.75, 1]);
  for (const [run, dis] of [[2, ['purple']], [2, ['pink']]]) {
    const r = cupScript(run, dis, false);
    assert.ok(swapsSafe([r.purple, r.pink]) && endOf(r[r.typing]) < DUR);
  }
  assert.equal(textAt(cupScript(2, ['pink']).purple, 99999), OPTIONS.pink.text, 'pink disabled: both cards say pink');
  assert.equal(textAt(leaEdit(false), 99999), "It's late. lea—");
  assert.ok(swapsSafe([leaEdit(false)]));
});

test('menu-h1-r3: the source keeps the brand print, her drawn hand (no UI arrow glyph), lines <= 12 words', () => {
  const s = src('menu3/CupTypes3.jsx');
  assert.match(s, /Figur Arcana/);
  assert.match(s, /HerPointer/);
  assert.ok(!/HerArrow/.test(s));
  assert.ok(!/\bretype\(/.test(s), 'no per-key retype in r3');
  for (const l of lines('menu3/CupTypes3.jsx')) assert.ok(words(l) <= 12, l);
});
