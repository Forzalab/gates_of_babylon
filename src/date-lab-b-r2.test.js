// Builder B (date-lab round 2): pure parts of the round-2 variants.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DOOR, openMenu, tick, choose } from './date-lab/b/shared/door.js';
import { EDIT, editDone, purpleLabel, retyped, outcome, pinkFill, widths, tally, PREPOUR } from './date-lab/b/menur2/edit.js';
import { words } from './date-beta/engine.js';
import { SHOTS as CH, TOTAL as CH_TOTAL, HER as CH_HER, NEST, eyeOf, toScreen as chScreen, poseFor, HEAD } from './date-lab/b/camh/shots.js';
import { HANDHELD } from './date-lab/b/shared/timeline.js';
import { ROOM, POSE_MS, initRoom, roomTick, roomBlink, eyePose } from './date-lab/b/anim3r2/room.js';

const run = (s, ms) => { let x = s; for (let t = 0; t < ms; t += 25) x = tick(x, 25); return x; };

test('menu-h2-r2: her edit runs on the 8 fps grid, every held state >= 334 ms, done before the timeout', () => {
  assert.equal(EDIT.selectAt - EDIT.glitchAt >= 334, true);
  assert.equal(EDIT.typeAt - EDIT.selectAt >= 334, true);
  assert.equal(EDIT.key, 125);
  assert.ok(editDone < DOOR.timeout, 'she finishes typing before the timer ends');
  assert.equal(purpleLabel(0).word, 'Goodnight.');
  assert.equal(purpleLabel(2999).stage, 'clean');
  assert.equal(purpleLabel(3100).stage, 'glitch');
  assert.equal(purpleLabel(3500).stage, 'select');
  assert.equal(purpleLabel(3900).word, 'S');
  assert.equal(purpleLabel(editDone).word, 'Stay.');
  assert.equal(purpleLabel(editDone).stage, 'done');
  // glitch <= 2 swaps a second: clean->glitch->select happen >= 334 ms apart
  const swaps = [EDIT.glitchAt, EDIT.selectAt, EDIT.typeAt];
  for (let i = 1; i < swaps.length; i++) assert.ok(swaps[i] - swaps[i - 1] >= 334);
  assert.ok(words(EDIT.keep + EDIT.to) <= 12);
});

test('menu-h2-r2: reduced motion = one hard cut to the finished edit at 3 s', () => {
  assert.equal(purpleLabel(2999, true).word, 'Goodnight.');
  const L = purpleLabel(3000, true);
  assert.equal(L.word, 'Stay.');
  assert.equal(L.struck, 'Goodnight.');
  assert.equal(retyped(3000, true), true);
  assert.equal(retyped(3000, false), false);
});

test('menu-h2-r2: purple before her edit leaves; after it, purple reads Stay; timeout = pink', () => {
  let s = choose(run(openMenu(), 1000), 'purple');
  assert.equal(outcome(s), 'leave');
  s = choose(run(openMenu(), EDIT.typeAt + 50), 'purple');
  assert.equal(outcome(s), 'stay');
  assert.equal(outcome(s, false, 'm4'), 'leave', 'menu-4-r2 has no edit');
  s = run(openMenu(), 5200);
  assert.equal(s.picked, 'pink');
  assert.equal(outcome(s), 'stay');
  // replay with pink disabled: the timer takes purple, which she has retyped to Stay.
  s = run(openMenu(DOOR, { disabled: ['pink'] }), 5200);
  assert.equal(s.picked, 'purple');
  assert.equal(outcome(s), 'stay');
});

test('menu-4-r2: the lean is visible at t = 0 (pre-poured cup, unequal boxes) and only grows', () => {
  assert.ok(pinkFill(1) >= 0.2, 'pink cup opens pre-poured');
  assert.equal(pinkFill(1), PREPOUR);
  assert.equal(pinkFill(0), 1);
  const a = widths(1), b = widths(0.5), c = widths(0);
  assert.ok(a.pink > a.purple, 'unequal from the first frame');
  assert.ok(b.pink > a.pink && c.pink > b.pink);
  assert.ok(c.purple >= 380, 'purple stays readable');
  assert.equal(a.pink + a.purple, 1260);
});

// ---------- cam-h-r2-b: the seams ----------
const byId = (id) => CH.find((s) => s.id === id);
const near = (a, b, eps = 0.5) => Math.abs(a - b) <= eps;
function sameFace(pA, fA, pB, fB) {
  const a = chScreen(pA, eyeOf(fA).x, eyeOf(fA).y), b = chScreen(pB, eyeOf(fB).x, eyeOf(fB).y);
  assert.ok(near(a.x, b.x) && near(a.y, b.y), `face lands at the same spot (${a.x},${a.y}) vs (${b.x},${b.y})`);
  assert.ok(near(a.k * fA.s, b.k * fB.s, 1e-6), 'same face size on screen');
  assert.ok(near(pA.r ?? 0, pB.r ?? 0, 1e-6), 'same roll');
}

test('cam-h-r2-b: 20-40 s, every shot >= 500 ms, lines <= 12 words, handheld <= 3 Hz', () => {
  assert.ok(CH_TOTAL >= 20000 && CH_TOTAL <= 40000, `${CH_TOTAL}`);
  for (const s of CH) {
    assert.ok(s.dur >= 500);
    for (const [, line] of s.lines ?? []) assert.ok(words(line) <= 12, line);
    if (s.text) assert.ok(words(s.text) <= 12);
  }
  for (const h of HANDHELD) assert.ok(h.hz <= 3);
});

test('cam-h-r2-b: loop seam = the last counted face (genkan) is the first face (train window), same size + roll', () => {
  const fall = byId('fall'), train = byId('train');
  sameFace(fall.pose(fall.dur), CH_HER.genkan, train.pose(0), CH_HER.train);
  assert.equal(fall.jit(fall.dur), 0);
  assert.equal(train.jit(0), 0, 'no handheld on either side of the seam');
  assert.equal(fall.count(fall.dur), 12);
  assert.equal(train.count(0), 12, 'the counter carries over the seam');
  sameFace(poseFor(fall, fall.dur - 1, true), CH_HER.genkan, poseFor(train, 0, true), CH_HER.train);
});

test('cam-h-r2-b: Kon match cut tunnel face -> lit-window face; platform -> poster pull-back is seamless', () => {
  const u = byId('underpass'), a = byId('apartment'), p = byId('platform');
  sameFace(u.pose(u.dur), CH_HER.tunnel, a.pose(0), CH_HER.window);
  const pe = p.pose(p.dur), us = u.pose(0);
  for (const [x, y] of [[0, 0], [1342, 500], [1920, 1080], [960, 540]]) {
    const A = chScreen(pe, x, y), B = chScreen(us, NEST.x + x * NEST.k, NEST.y + y * NEST.k);
    assert.ok(near(A.x, B.x) && near(A.y, B.y), `poster pixel ${x},${y}`);
  }
  assert.ok(Math.abs(p.dzoom(p.dur) - 1 / NEST.k) < 1e-9, 'the OSD already reads the poster zoom on the platform');
  assert.ok(near(HEAD, 3.2, 1e-9));
});

// ---------- anim-3-r2: the room looks away ----------
test('anim-3-r2: hands-off, the room creeps one step every 6 s; the eye drains in 4 poses >= 500 ms', () => {
  assert.ok(POSE_MS >= 500);
  let s = initRoom(), steps = 0, poses = new Set();
  for (let t = 0; t < 18000; t += 125) {
    let a; [s, a] = roomTick(s, 125, {});
    poses.add(eyePose(s));
    if (a === 'step') steps++;
  }
  assert.equal(s.mode, 'room', 'no mouse = room mode from the start');
  assert.equal(steps, 3);
  assert.deepEqual([...poses].sort(), [0, 1, 2, 3]);
});

test('anim-3-r2: moving the mouse = hand mode (2.5 s off the anchor); idle 6 s hands it back to the room', () => {
  let s = initRoom(), a;
  [s, a] = roomTick(s, 125, { moved: true, onAnchor: true });
  assert.equal(s.mode, 'hand');
  for (let t = 0; t < 5000; t += 125) { [s, a] = roomTick(s, 125, { onAnchor: true }); assert.equal(a, null, 'looking at the anchor: nothing moves'); }
  let fired = 0;
  for (let t = 0; t < 1000; t += 125) { [s, a] = roomTick(s, 125, { onAnchor: false }); if (a) fired++; }
  assert.equal(s.mode, 'room', 'idle >= 6 s -> the room takes over');
  s = initRoom();
  [s] = roomTick(s, 125, { moved: true, onAnchor: false });
  for (let t = 0; t < 2600; t += 125) { [s, a] = roomTick(s, 125, { moved: true, onAnchor: false }); if (a) fired++; }
  assert.ok(fired >= 1, 'off the anchor for 2.5 s = a step');
  assert.equal(roomBlink(s).sinceStep, 0);
});

test('anim-3-r2: a fully crept scene holds 6 s, then the tour moves on', () => {
  let s = initRoom(), a, next = 0;
  for (let t = 0; t < 12000; t += 125) { [s, a] = roomTick(s, 125, { atMax: true }); if (a === 'next') next++; assert.notEqual(a, 'step'); }
  assert.equal(next, 2);
  assert.equal(ROOM.holdAtMax, 6000);
});

test('menu-4-r2: the room tally', () => {
  assert.deepEqual(tally([]), { pink: 0, n: 0, pct: 0 });
  assert.deepEqual(tally(['stay', 'stay', 'leave', 'stay']), { pink: 3, n: 4, pct: 75 });
});
