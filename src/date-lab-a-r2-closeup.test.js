// Builder A round 2 close-ups (closeup-3-r2, closeup-1-r2): pure timing tests + source line audits.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TICK, POSE, words } from './date-lab/a/kit/time.js';
import { PUSH, PUSH_DUR, PUSH_SUB, pushAt, HAND } from './date-lab/a/closeup2/third.js';

const src = (f) => readFileSync(new URL(`./date-lab/a/${f}`, import.meta.url), 'utf8');
const lines = (f) => [...src(f).matchAll(/'((?:NANDA|MC): [^']*)'|"((?:NANDA|MC): [^"]*)"/g)].map((m) => (m[1] ?? m[2]).replace(/^[A-Z]+: /, ''));

test('closeup-3-r2: her hand slides the saucer in held poses on the 8 fps grid, then turns palm up', () => {
  assert.ok(PUSH.every((p) => p.at % TICK === 0));
  const holds = PUSH.map((p, i) => (PUSH[i + 1]?.at ?? PUSH_DUR) - p.at);
  assert.ok(holds.every((h) => h >= POSE), `holds ${holds}`);
  assert.deepEqual(PUSH.map((p) => p.push), [0, 1, 2, 2], 'slides toward the lens, never back');
  assert.equal(PUSH.at(-1).hand, 'palm', 'ends on the open palm, not a grip');
  assert.ok(PUSH.every((p) => p.hand === 'back' || p.hand === 'palm'), 'only open-hand poses exist');
  assert.ok(HAND.back && HAND.palm);
});

test('closeup-3-r2: the fist is gone (no main hand sprite in the r2 cup), RM = the palm pose in one cut', () => {
  const s = src('closeup2/ThirdCup2.jsx');
  assert.ok(!/ART\.hand\(/.test(s), 'R1 used ART.hand(..., "closed")');
  assert.ok(!/closed/.test(src('closeup2/HerHand.jsx')));
  assert.equal(pushAt(0, true), PUSH.at(-1));
  assert.equal(pushAt(PUSH_DUR, false), PUSH.at(-1));
});

test('closeup-3-r2: the kept payoff lines, each <= 12 words; the tea is never named', () => {
  const all = PUSH_SUB.map((x) => x.text).join(' ');
  assert.match(all, /For Input B\. Silly\./);
  assert.match(all, /It's always three of us\./);
  for (const l of lines('closeup2/ThirdCup2.jsx').concat(lines('closeup2/third.js'))) assert.ok(words(l) <= 12, l);
  for (const f of ['closeup2/ThirdCup2.jsx', 'closeup2/third.js', 'closeup2/HerHand.jsx']) {
    assert.ok(!/poison|drug|sedative|sleeping pill/i.test(src(f).replace(/tea drug|never named/gi, '')), f);
  }
});
