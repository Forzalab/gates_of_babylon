// Builder A (date-lab): pure kit tests. The DOOR menu state machine (timeout -> pink, replay disables the last pick,
// timer still runs), the timeline maths (shots, keyframes, stepped poses, flash safety) and the registry contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createMenu, tickMenu, pickMenu, replayMenu, progress, secondsLeft, isDisabled, optionForKey, OPTIONS, DUR, BLEED } from './date-lab/a/kit/menu.js';
import { retype, textAt, endOf } from './date-lab/a/kit/retype.js';
import { shotAt, keyAt, stepAt, rmPose, total, flashSafe, words, camTransform, POSE, TICK } from './date-lab/a/kit/time.js';

test('menu: the two DOOR options, pink = toward her, purple = leave', () => {
  assert.equal(OPTIONS.pink.text, 'Just one cup.');
  assert.equal(OPTIONS.purple.text, "It's late. Goodnight.");
  assert.equal(OPTIONS.pink.colour, '#FF5FA2');
  assert.equal(OPTIONS.purple.colour, '#8A5CF6');
  assert.equal(DUR, 5000);
  assert.ok(BLEED >= 334);
  assert.equal(optionForKey('1'), 'pink');
  assert.equal(optionForKey('2'), 'purple');
  assert.equal(optionForKey('x'), null);
});

test('menu: timeout picks pink (silence = consent)', () => {
  let m = createMenu();
  m = tickMenu(m, 2500);
  assert.equal(m.phase, 'open');
  assert.equal(secondsLeft(m), 3);
  assert.equal(progress(m), 0.5);
  m = tickMenu(m, 2600);
  assert.equal(m.phase, 'picked');
  assert.equal(m.picked, 'pink');
  assert.equal(m.how, 'timeout');
  assert.equal(m.forced, false);
  assert.equal(tickMenu(m, 1000), m, 'a resolved menu no longer ticks');
});

test('menu: a click picks, a second click is ignored', () => {
  let m = pickMenu(tickMenu(createMenu(), 1200), 'purple');
  assert.equal(m.picked, 'purple');
  assert.equal(m.how, 'click');
  assert.equal(pickMenu(m, 'pink'), m);
  assert.equal(pickMenu(createMenu(), 'nope').phase, 'open');
});

test('menu: replay disables the last pick, the timer still runs, timeout still goes pink', () => {
  let m = pickMenu(createMenu(), 'purple');
  m = replayMenu(m);
  assert.equal(m.run, 2);
  assert.equal(m.phase, 'open');
  assert.ok(isDisabled(m, 'purple'));
  assert.equal(pickMenu(m, 'purple'), m, 'the disabled option cannot be picked');
  m = tickMenu(m, 3000);
  assert.equal(m.phase, 'open', 'timer keeps running on replay');
  m = tickMenu(m, 2000);
  assert.equal(m.picked, 'pink');
  assert.deepEqual([...m.history], ['purple', 'pink']);
});

test('menu: if YOU picked pink last run, pink is disabled for you but she still takes it on timeout (forced)', () => {
  let m = replayMenu(pickMenu(createMenu(), 'pink'));
  assert.ok(isDisabled(m, 'pink'));
  assert.equal(pickMenu(m, 'pink'), m);
  m = tickMenu(m, DUR);
  assert.equal(m.picked, 'pink');
  assert.equal(m.forced, true);
  const p = pickMenu(replayMenu(pickMenu(createMenu(), 'pink')), 'purple');
  assert.equal(p.picked, 'purple', 'the other option is still yours to take');
});

test('menu: replay only resets from a resolved state, and only the LAST pick is disabled', () => {
  let m = replayMenu(pickMenu(createMenu(), 'purple'));
  m = replayMenu(tickMenu(m, DUR));
  assert.deepEqual([...m.disabled], ['pink']);
  assert.equal(m.run, 3);
});

test('time: shotAt walks a shot list and clamps at the end', () => {
  const shots = [{ id: 'a', dur: 1000 }, { id: 'b', dur: 2000 }, { id: 'c', dur: 500 }];
  assert.equal(total(shots), 3500);
  assert.equal(shotAt(shots, 0).shot.id, 'a');
  assert.equal(shotAt(shots, 999).shot.id, 'a');
  assert.equal(shotAt(shots, 1000).shot.id, 'b');
  assert.equal(shotAt(shots, 2000).k, 0.5);
  assert.equal(shotAt(shots, 99999).shot.id, 'c');
  assert.equal(shotAt(shots, 99999).k, 1);
});

test('time: keyframes ease between poses; rm = the end pose, cut in hard', () => {
  const keys = [{ t: 0, x: 0, s: 1 }, { t: 1000, x: 100, s: 2, e: 'linear' }];
  assert.deepEqual(keyAt(keys, -5), { x: 0, s: 1 });
  assert.deepEqual(keyAt(keys, 500), { x: 50, s: 1.5 });
  assert.deepEqual(keyAt(keys, 5000), { x: 100, s: 2 });
  assert.deepEqual(rmPose(keys), { x: 100, s: 2 });
  assert.match(camTransform({ x: 960, y: 540, s: 2 }), /scale\(2\)/);
});

test('time: stepped poses never hold under 500 ms and sit on the 8 fps grid', () => {
  assert.equal(TICK, 125);
  assert.equal(POSE, 500);
  assert.equal(stepAt(0, 3), 0);
  assert.equal(stepAt(499, 3), 0);
  assert.equal(stepAt(500, 3), 1);
  assert.equal(stepAt(1500, 3), 0);
  assert.equal(stepAt(260, 3, 125), 0, 'a hold under 500 ms is raised to 500 ms');
});

test('time: flash audit: holds >= 334 ms and <= 3 flashes a second', () => {
  assert.ok(flashSafe([{ at: 0, dur: 334 }]));
  assert.ok(!flashSafe([{ at: 0, dur: 100 }]), 'too short');
  assert.ok(flashSafe([{ at: 0, dur: 334 }, { at: 1000, dur: 334 }]));
  assert.ok(flashSafe([0, 340, 680, 1020].map((at) => ({ at, dur: 334 }))), 'exactly 3 a second is the limit, allowed');
  assert.ok(!flashSafe([0, 250, 500, 750].map((at) => ({ at, dur: 334 }))), '4 flashes inside one second = over 3 Hz');
});

test('time: <= 12 words per click counter matches the engine rule', () => {
  assert.equal(words('NANDA: Come in? Just for tea.'), 6);
  assert.equal(words("That's… fine."), 2);
});

test('retype (menu-3): she backspaces and retypes on the 8 fps grid; rm = one hard cut held >= 500 ms', () => {
  const f = retype("It's late. Goodnight.", "It's late. ", 'Stay.', 700);
  assert.equal(f[0].text, "It's late. Goodnight.");
  assert.equal(f.at(-1).text, "It's late. Stay.");
  for (let i = 1; i < f.length; i++) assert.ok(f[i].at - f[i - 1].at >= 125, 'no keystroke faster than one 125 ms tick');
  assert.equal(textAt(f, 0), "It's late. Goodnight.");
  assert.equal(textAt(f, 700 + 125), "It's late. Goodnight");
  assert.equal(textAt(f, 1e9), "It's late. Stay.");
  const r = retype("It's late. Goodnight.", "It's late. ", 'lea—', 0, { rm: true });
  assert.equal(r.length, 2);
  assert.ok(r[1].at - r[0].at >= 500);
  assert.equal(endOf(r), 500);
  assert.throws(() => retype('abc', 'x', 'y'));
});

test('cam-2 corridor: a true dolly (near grows faster than far), tubes die far->near held >= 500 ms, she only steps nearer', async () => {
  const { project, tubesOut, herZ, TUBES, HER_FAR, HER_LAST } = await import('./date-lab/a/camera/corridor.js');
  assert.deepEqual(project(0, 0, 10, 0).slice(0, 2), [960, 540], 'the centre line projects to the vanishing point');
  const grow = (z) => project(1, 0, z, 2)[2] / project(1, 0, z, 0)[2];
  assert.ok(grow(4) > grow(30), 'dolly: a near plane scales up more than a far one (a zoom would scale both alike)');
  let prev = 0;
  for (let t = 0; t < 20000; t += 100) { const n = tubesOut(t); assert.ok(n >= prev); prev = n; }
  assert.equal(tubesOut(0), 0);
  assert.equal(tubesOut(1e9), TUBES.length);
  assert.ok(tubesOut(5200 + 499) === tubesOut(5200), 'each dark step holds >= 500 ms');
  assert.equal(herZ(0), HER_FAR);
  assert.equal(herZ(TUBES.length), HER_LAST);
  assert.ok(herZ(3) < herZ(2), 'she only ever comes nearer');
});

test('camera fit: frames never leave the 1920x1080 art', async () => {
  const { fit } = await import('./date-lab/a/kit/fit.js');
  assert.deepEqual(fit({ x: 1900, y: 1000, s: 2 }), { x: 1440, y: 810, s: 2 });
  assert.deepEqual(fit({ x: 0, y: 0, s: 1 }), { x: 960, y: 540, s: 1 });
  assert.deepEqual(fit({ x: 5, y: 5, s: 0.5 }), { x: 5, y: 5, s: 0.5 }, 'zoomed out = free');
});

test('registry: every builder-A variant is builder A with a unique id and a known track', () => {
  const src = readFileSync(new URL('./date-lab/a/index.js', import.meta.url), 'utf8');
  const rows = [...src.matchAll(/A\('([\w-]+)', '(\w+)'/g)].map((r) => ({ id: r[1], track: r[2] }));
  assert.ok(rows.length >= 1);
  const TR = ['camera', 'anim', 'menu', 'closeup', 'fx', 'nanda'];
  for (const r of rows) assert.ok(TR.includes(r.track), r.id);
  assert.equal(new Set(rows.map((r) => r.id)).size, rows.length);
});
