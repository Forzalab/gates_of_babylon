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
export const R2_FILES = ['menu2/CupTypes.jsx', 'menu2/Ddlc2.jsx', 'menu2/Tarot2.jsx'];
test('r2: every builder-A r2 line is <= 12 words', () => {
  for (const f of R2_FILES) {
    const src = readFileSync(new URL(`./date-lab/a/${f}`, import.meta.url), 'utf8');
    for (const m of src.matchAll(/'((?:NANDA|MC): [^']*)'|"((?:NANDA|MC): [^"]*)"/g)) {
      const line = (m[1] ?? m[2]).replace(/^[A-Z]+: /, '');
      assert.ok(words(line) <= 12, `${f}: ${line}`);
    }
  }
});

test('menu-3-r2: the cold-open tell edits MC\'s own line inside the first 3 s, on the 8 fps grid; RM = held cuts', async () => {
  const { mcLine, MC_FROM } = await import('./date-lab/a/menu2/script.js');
  const f = mcLine(false);
  assert.equal(textAt(f, 0), MC_FROM);
  assert.ok(f[1].at < 1000, 'first visible edit inside 1 s');
  assert.ok(endOf(f) <= 3000, `done by ${endOf(f)}`);
  assert.equal(textAt(f, 3000), "It's late. I should stay.");
  assert.ok(f.every((x) => x.at % TICK === 0));
  const r = mcLine(true);
  assert.ok(r.length === 3 && gaps(r).every((g) => g >= 1000) && endOf(r) <= 3000);
});

test('cam-h-r2-a: the loop is seamless: the last frame (phone screen at D.ZOOM 6x, rolled 86) maps the nested train to 1:1', async () => {
  const F = await import('./date-lab/a/camera2/frame.js');
  const last = F.SHOTS.at(-1);
  const end = F.poseOf(last, last.dur, false);
  assert.ok(Math.abs(end.s - 1 / F.PHONE.k) < 1e-6 && end.r === F.ROLL);
  // a train pixel q sits in the world at PHONE + R(phone.r) * k * (q - centre); the camera must put it back at q
  const a = (F.PHONE.r * Math.PI) / 180;
  for (const [qx, qy] of [[0, 0], [1920, 1080], [300, 900], [960, 540]]) {
    const dx = (qx - 960) * F.PHONE.k, dy = (qy - 540) * F.PHONE.k;
    const wx = F.PHONE.x + dx * Math.cos(a) - dy * Math.sin(a), wy = F.PHONE.y + dx * Math.sin(a) + dy * Math.cos(a);
    const [sx, sy] = F.toScreen(end, wx, wy);
    assert.ok(Math.hypot(sx - qx, sy - qy) < 1e-6, `${qx},${qy} -> ${sx},${sy}`);
  }
  const first = F.poseOf(F.SHOTS[0], 0, false);
  assert.deepEqual([first.x, first.y, first.s], [960, 540, 1]);
  // the D.ZOOM readout is continuous across the loop and across the nested cuts
  assert.equal(F.zoomReadout(F.SHOTS[0], first), F.zoomReadout(last, end));
  const irisEnd = F.poseOf(F.SHOTS[1], F.SHOTS[1].dur, false), posterStart = F.poseOf(F.SHOTS[2], 0, false);
  assert.equal(F.zoomReadout(F.SHOTS[1], irisEnd), F.zoomReadout(F.SHOTS[2], posterStart));
});

test('cam-h-r2-a: handheld <= 3 Hz, AF hunt and face count hold >= 500 ms, lines <= 12 words, total 20-40 s', async () => {
  const F = await import('./date-lab/a/camera2/frame.js');
  assert.ok(F.HANDHELD.every((h) => h.hz <= 3));
  assert.ok(F.total >= 20000 && F.total <= 40000, `${F.total}`);
  const hunt = F.SHOTS[0].hunt.map((h) => h[0]).concat(F.SHOTS[0].lock.from);
  assert.ok(gaps(hunt.map((at) => ({ at }))).every((g) => g >= POSE));
  assert.ok(F.COUNT_EVERY >= POSE);
  let prev = 0, since = 0;
  const fl = F.SHOTS.at(-1);
  for (let l = 0; l <= fl.dur; l += 25) { const n = F.countAt(fl, l); if (n !== prev) { if (prev) assert.ok(l - since >= POSE); prev = n; since = l; } }
  assert.equal(prev, 12);
  for (const s of F.SHOTS) for (const x of s.sub ?? []) assert.ok(words(x.text.replace(/^NANDA: /, '')) <= 12, x.text);
  const drop = F.SHOTS.find((s) => s.dropout).dropout;
  assert.ok(drop[1] - drop[0] >= 334, 'the dropout is one held state, not a strobe');
});
