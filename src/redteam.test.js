// redteam.test.js: adversarial checks for the Thu demo (research/redteam/REPORT.md). Tests marked KNOWN-FAIL
// document a live demo risk; they are expected to fail until the matching REPORT item is fixed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadScenes, start, next, skip, choose, beatAt, enabled, timeoutPick } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { timeline, FLOOR_MS } from './collapseFrames.js';

const ART = ['splash', 'rooftop', 'train', 'naan', 'blackout'];
const scenes = loadScenes(data, { manifest, art: ART });
const id = (p) => scenes[p.s].id;
const ENDINGS = ['steeped', 'escape-win', 'escape-timeout', 'leave-fu', 'leave-yeah'];

// Exhaustive DFS over every enabled choice (and every timeout pick) from scene 1, both motion modes.
// Every leaf must be an ending card whose choice returns to rooftop; nothing may reach `done`.
for (const rm of [false, true]) {
  test(`redteam: every branch (all picks + timeouts${rm ? ', reduced motion' : ''}) ends back at scene 1`, () => {
    const endings = new Set();
    const stack = [{ p: start(scenes, { rm }), steps: 0 }];
    let leaves = 0;
    while (stack.length) {
      let { p, steps } = stack.pop();
      for (;;) {
        assert.ok(steps++ < 300, `loop without ending at ${id(p)}`);
        assert.equal(p.done, false, `dead end (done) after ${id(p)}`);
        const beat = beatAt(scenes, p);
        if (!beat.choices) { p = next(scenes, p, rm); continue; }
        if (beat.choices.length === 1 && beat.choices[0].go === scenes[0].id) {
          endings.add(id(p)); leaves++;
          const back = choose(scenes, p, 0, rm);
          assert.equal(back.s, 0); assert.equal(back.b, 0); assert.equal(back.done, false);
          break;
        }
        const opts = beat.choices.map((c, i) => i).filter((i) => enabled(beat.choices[i], p.flags));
        assert.ok(opts.length, `no enabled choice at ${id(p)}[${p.b}]`);
        if (beat.timer) assert.ok(timeoutPick(beat, p.flags) >= 0, `timer at ${id(p)} has no pick`);
        for (const i of opts) stack.push({ p: choose(scenes, p, i, rm), steps });
        break;
      }
    }
    assert.deepEqual([...endings].sort(), [...ENDINGS].sort());
    assert.ok(leaves >= 10, `only ${leaves} leaves`);
  });
}

test('redteam: every scene is reachable from scene 1 by playing (no orphan scenes)', () => {
  const seen = new Set([0]), q = [0];
  while (q.length) {
    const s = q.shift();
    const last = scenes[s].beats.at(-1);
    const outs = new Set(last.choices?.every((c) => c.go) ? [] : [s + 1]);
    for (const b of scenes[s].beats) for (const c of b.choices ?? []) {
      const g = typeof c.go === 'string' ? c.go : null;
      if (g) outs.add(scenes.findIndex((x) => x.id === g));
    }
    for (const o of outs) if (o < scenes.length && !seen.has(o)) { seen.add(o); q.push(o); }
  }
  assert.deepEqual(scenes.filter((_, i) => !seen.has(i)).map((x) => x.id), []);
});

// KNOWN-FAIL (REPORT R2): Esc/S/"skip" on an ending walks into the NEXT scene in file order, i.e. into a different
// ending (steeped -> ??? placeholder -> escape puzzle; leave-fu -> leave-yeah) and off the end into a black `done` stage.
for (const e of ENDINGS) {
  test(`redteam KNOWN-FAIL R2: Esc during the ${e} ending goes back to scene 1, not into another ending`, () => {
    const p = skip(scenes, start(scenes, { at: e }));
    assert.equal(p.done, false, 'Esc on the last scene lands on the blank done stage');
    assert.equal(id(p), scenes[0].id, `Esc during ${e} lands in "${id(p)}"`);
  });
}

// KNOWN-FAIL (REPORT R3): Esc on the door choice skips the choice and silently takes "cup", bypassing LEAVE.
test('redteam KNOWN-FAIL R3: Esc on the cup scene does not drop the player straight into the STEEPED ending', () => {
  const p = skip(scenes, start(scenes, { at: 'cup' }));
  assert.notEqual(id(p), 'steeped');
});

// KNOWN-FAIL (REPORT R1): every manifest file path points at a file that is not in the repo -> grey "BG-D1" boxes and
// beeps for the whole second half of the demo.
test('redteam KNOWN-FAIL R1: every asset path in assets.json exists under public/', () => {
  const missing = Object.entries(manifest.assets).filter(([, a]) => a.path && !fs.existsSync(new URL(`../public/${a.path}`, import.meta.url)));
  assert.deepEqual(missing.map(([k]) => k), []);
});

test('redteam: the collapse never changes frame faster than 334 ms', () => {
  const t = timeline();
  for (let i = 1; i < t.length; i++) assert.ok(t[i].at - t[i - 1].at >= FLOOR_MS, `step ${i}: ${t[i].at - t[i - 1].at} ms`);
});

test('redteam: blackout auto beats each hold >= 334 ms (flash floor), in both motion modes', () => {
  for (const rm of [false, true]) {
    let p = start(scenes, { rm, at: 'blackout' });
    while (id(p) === 'blackout') {
      const b = beatAt(scenes, p);
      assert.ok((b.auto ?? b.hold) >= FLOOR_MS, `blackout[${b.index}]`);
      p = next(scenes, p, rm);
    }
  }
});

test('redteam: an unknown ?scene= id falls back to scene 1 instead of crashing', () => {
  const p = start(scenes, { at: 'nope' });
  assert.equal(p.s, 0); assert.equal(p.done, false);
});

test('redteam: malformed scenes.json fails loudly at load (missing go target, bad vary, bad flag value)', () => {
  const clone = () => structuredClone(data);
  let d = clone(); d.scenes.find((s) => s.id === 'door').beats[2].choices[0].go = 'cupp';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /unknown scene "cupp"/);
  d = clone(); delete d.scenes[0].beats[2].vary.bento.tamagoyaki;
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /missing the variant/);
  d = clone(); d.scenes[0].beats[1].choices[0].set.bento = 'natto';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /not one of/);
  d = clone(); d.scenes[4].bg = 'BG-ZZ';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /not in the asset manifest/);
  d = clone(); d.scenes[4].beats[2].choices[0].default = true; d.scenes[4].beats[2].choices[1].default = true;
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /only one choice/);
});

test('redteam: timeoutPick falls to the other enabled choice when the default is disabled', () => {
  const d = structuredClone(data);
  const door = d.scenes.find((s) => s.id === 'door').beats[2];
  door.choices[0].if = { bento: 'tamagoyaki' };
  const sc = loadScenes(d, { manifest, art: ART });
  const b = sc.find((s) => s.id === 'door').beats[2];
  assert.equal(timeoutPick(b, { bento: 'umeboshi' }), 1);
  assert.equal(timeoutPick(b, { bento: 'tamagoyaki' }), 0);
});
