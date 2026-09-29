// Builder B (date-lab round 3): pure parts of the round-3 variants.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DOOR, openMenu, tick, choose, replay } from './date-lab/b/shared/door.js';
import { EDIT3, purpleLabel3, retyped3, labelChanges, maxPerSecond, slabWidths, pinkPour, PREPOUR3, handPose, HAND, boxOffset, ECU, ECU_LEAVE, beatAt, outcome3, tally3 } from './date-lab/b/menur3/r3.js';
import { purpleLabel as purpleLabelR2 } from './date-lab/b/menur2/edit.js';
import { words } from './date-beta/engine.js';

const run = (s, ms) => { let x = s; for (let t = 0; t < ms; t += 25) x = tick(x, 25); return x; };
const spoken = (l) => l.replace(/^[A-Z]+:\s*/, '');

test('menu-h2-r3: the R2 defect is fixed: <= 2 glyph swaps per second (r2 ran 8/s)', () => {
  const r3 = labelChanges((t) => purpleLabel3(t));
  assert.ok(maxPerSecond(r3) <= 2, `r3 swaps/s = ${maxPerSecond(r3)}`);
  const r2 = labelChanges((t) => purpleLabelR2(t));
  assert.ok(maxPerSecond(r2) > 2, 'the round-2 edit really was too fast (sanity)');
  assert.equal(EDIT3.selectAt - EDIT3.glitchAt >= 500, true);
  assert.equal(EDIT3.swapAt - EDIT3.selectAt >= 500, true);
  assert.ok(EDIT3.swapAt < DOOR.timeout);
  assert.equal(purpleLabel3(0).word, 'Goodnight.');
  assert.equal(purpleLabel3(3200).stage, 'glitch');
  assert.equal(purpleLabel3(3700).stage, 'select');
  assert.equal(purpleLabel3(3999).word, 'Goodnight.');
  assert.equal(purpleLabel3(4000).word, 'Stay.', 'one whole-word swap, no per-key typing');
  assert.ok(words(EDIT3.keep + EDIT3.to) <= 12);
});

test('menu-h2-r3: reduced motion = one hard cut at 3 s; purple after the edit reads Stay', () => {
  assert.equal(purpleLabel3(3000, true).word, 'Stay.');
  assert.equal(maxPerSecond(labelChanges((t) => purpleLabel3(t, true))), 1);
  assert.equal(retyped3(3000, true), true);
  assert.equal(retyped3(3999), false);
  const early = choose(run(openMenu(DOOR), 1000), 'purple');
  assert.equal(outcome3(early, false, 'h2'), 'leave');
  const late = choose(run(openMenu(DOOR), 4100), 'purple');
  assert.equal(outcome3(late, false, 'h2'), 'stay');
  assert.equal(outcome3(run(openMenu(DOOR), 6000), false, 'h2'), 'stay');
});

test('menu-h2-r3 / h3-r3: same slab, only colour + squeeze differ; pink grows as the time pours', () => {
  const a = slabWidths(1), b = slabWidths(0);
  assert.equal(a.pink + a.purple, b.pink + b.purple);
  assert.ok(a.pink > a.purple && b.pink > a.pink && b.purple < a.purple);
  assert.ok(b.purple >= 440, 'purple stays wide enough for its label');
  assert.equal(pinkPour(1), PREPOUR3);
  assert.equal(pinkPour(0), 1);
});

test('menu-h3-r3: her hand holds purple 6 px down; hover lifts pink 22, purple only 6; poses held >= 500 ms', () => {
  assert.equal(boxOffset('purple', false), 6);
  assert.equal(boxOffset('purple', true), 0);
  assert.equal(boxOffset('pink', true), -22);
  assert.equal(boxOffset('pink', false), 0);
  assert.equal(boxOffset('purple', false, false), 0, 'she lets go');
  assert.equal(HAND.poses[1] - HAND.poses[0] >= 500, true);
  assert.equal(handPose(0), 1);
  assert.equal(handPose(499), 1);
  assert.equal(handPose(500), 2);
  assert.equal(handPose(0, true), 2, 'RM: resting at once');
});

test('menu-h3-r3: timeout = ECU on the box, one held cut into the lens; the timer never picks leave', () => {
  assert.equal(beatAt(ECU, 0).look, 'box');
  assert.equal(beatAt(ECU, 1499).look, 'box');
  assert.equal(beatAt(ECU, 1500).look, 'lens');
  assert.equal(beatAt(ECU, 1500).line, 'NANDA: Not him. You.');
  assert.equal(beatAt(ECU, 1500).under, 'The one clicking.');
  for (const B of [ECU, ECU_LEAVE]) {
    for (let i = 1; i < B.length; i++) assert.ok(B[i].at - B[i - 1].at >= 1000, 'each look is a held cut');
    for (const b of B) { if (b.line) assert.ok(words(spoken(b.line)) <= 12); if (b.under) assert.ok(words(b.under) <= 12); }
  }
  const to = run(openMenu(DOOR), 6000);
  assert.equal(to.via, 'timeout');
  assert.equal(outcome3(to, false, 'h3'), 'stay');
  assert.equal(outcome3(choose(run(openMenu(DOOR), 4800), 'purple'), false, 'h3'), 'leave', 'purple is always reachable by a click');
  // replay after pink: pink is pinned, the timer still runs out, and still does not pick leave
  const r = replay(choose(run(openMenu(DOOR), 600), 'pink'));
  assert.deepEqual(r.disabled, ['pink']);
  const rt = run(r, 6000);
  assert.equal(rt.picked, 'purple');
  assert.equal(outcome3(rt, false, 'h3'), 'stay');
});

test('round-3 menus: room tally', () => {
  assert.deepEqual(tally3([]), { pink: 0, n: 0 });
  assert.deepEqual(tally3(['stay', 'leave', 'stay']), { pink: 2, n: 3 });
});
