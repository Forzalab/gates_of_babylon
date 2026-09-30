// redteam.test.js: adversarial checks for the Thu demo (research/redteam/REPORT.md). Tests marked KNOWN-FAIL
// document a live demo risk; they are expected to fail until the matching REPORT item is fixed.
import { SYNTH } from './date-beta/synth.js';
import { BG_FALLBACK } from './date-beta/art/fallbacks.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadScenes, start, next, skip, choose, beatAt, enabled, timeoutPick } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { timeline, FLOOR_MS } from './collapseFrames.js';
import { ART_NAMES } from './date-beta-art-names.js';

const ART = ART_NAMES;
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

// R1 (was KNOWN-FAIL): most asset files are not in the repo yet. Every id must still have EITHER its file under
// public/ OR a registered fallback (sfx: a synth recipe in synth.js, bg: an art component via art/fallbacks.js), so the
// demo never shows a grey box or plays the placeholder beep. A dropped-in file still wins (assets.js / main.jsx).
test('redteam R1: every asset id has a file under public/ or a registered fallback', () => {
  const art = fs.readFileSync(new URL('./date-beta/art/index.js', import.meta.url), 'utf8');
  const uncovered = Object.entries(manifest.assets).filter(([k, a]) => {
    if (a.path && fs.existsSync(new URL(`../public/${a.path}`, import.meta.url))) return false;
    if (a.kind === 'sfx') return !(k in SYNTH);
    const name = BG_FALLBACK[k];
    return !(name && new RegExp(`\\b${name}:`).test(art));
  });
  assert.deepEqual(uncovered.map(([k]) => k), []);
});

test('redteam R1: synth recipes stay in the ceiling-speaker band and every one schedules without throwing', () => {
  for (const [id, r] of Object.entries(SYNTH)) {
    const hz = [];
    const param = (v = 0) => ({ value: v, setValueAtTime(f) { if (this.freq) hz.push(f); }, linearRampToValueAtTime(f) { if (this.freq) hz.push(f); }, exponentialRampToValueAtTime(f) { if (this.freq) hz.push(f); } });
    const node = () => ({ connect: (n) => n, start() {}, stop() {}, gain: param(), Q: param(), frequency: Object.defineProperty(Object.assign(param(), { freq: true }), 'value', { set(f) { hz.push(f); }, get() { return 0; } }) });
    const ctx = { sampleRate: 8000, currentTime: 0, destination: node(), createGain: node, createOscillator: node, createBiquadFilter: node,
      createBufferSource: node, createBuffer: (c, n) => ({ getChannelData: () => new Float32Array(n) }) };
    const len = r(ctx, ctx.destination, 0);
    assert.ok(len > 0 && len <= 6, `${id} length ${len}`);
    assert.ok(hz.length > 0, `${id} sets no frequency`);
    for (const f of hz) assert.ok(f >= 300 && f <= 4000, `${id} uses ${f} Hz`);
  }
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

// the door scene in a raw scenes.json clone: beat 0 = the stairs, 3 = the kettle pick
const door = (d) => d.scenes.find((s) => s.id === 'door');

test('redteam: malformed scenes.json fails loudly at load (missing go target, bad vary, bad flag value)', () => {
  const clone = () => structuredClone(data);
  let d = clone(); door(d).beats[3].choices[0].go = 'cupp';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /unknown scene "cupp"/);
  d = clone(); delete d.scenes[0].beats[2].vary.bento.tamagoyaki;
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /missing the variant/);
  d = clone(); d.scenes[0].beats[1].choices[0].set.bento = 'natto';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /not one of/);
  d = clone(); door(d).bg = 'BG-ZZ';
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /not in the asset manifest/);
  d = clone(); door(d).beats[3].choices[0].default = true; door(d).beats[3].choices[1].default = true;
  assert.throws(() => loadScenes(d, { manifest, art: ART }), /only one choice/);
});

test('redteam: timeoutPick falls to the other enabled choice when the default is disabled', () => {
  const d = structuredClone(data);
  const pick = door(d).beats[3];
  pick.choices[0].if = { bento: 'tamagoyaki' };
  const sc = loadScenes(d, { manifest, art: ART });
  const b = sc.find((s) => s.id === 'door').beats[3];
  assert.equal(timeoutPick(b, { bento: 'umeboshi' }), 1);
  assert.equal(timeoutPick(b, { bento: 'tamagoyaki' }), 0);
});

test('redteam R3: Esc before the door choice lands on it; Esc on a branch beat stays put', () => {
  const p = skip(scenes, start(scenes, { at: 'door' }));
  assert.equal(id(p), 'door');
  assert.ok(beatAt(scenes, p).choices.some((c) => c.go === 'leave'));
  assert.deepEqual(skip(scenes, p), p);
  const e = skip(scenes, start(scenes, { at: 'escape' }));
  assert.equal(id(e), 'escape');
  assert.deepEqual(beatAt(scenes, e).choices.map((c) => c.go), ['escape-timeout', 'escape-win']);
});

test('redteam R2: Esc on the done stage restarts at scene 1', () => {
  const done = { ...start(scenes), done: true };
  assert.equal(skip(scenes, done).s, 0);
  assert.equal(skip(scenes, done).done, false);
});

test('redteam R5: a cue asked for before the first gesture plays once the audio unlocks', async () => {
  const { createLoader } = await import('./date-beta/assets.js');
  const played = [];
  class Ctx {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
    decodeAudioData() { return Promise.resolve({}); }
    createOscillator() { return { frequency: {}, connect: (g) => g, start: () => played.push('beep'), stop() {} }; }
    createGain() { return { gain: {}, connect: (d) => d }; }
    createBufferSource() { return { connect() {}, start: () => played.push('buffer') }; }
  }
  const saved = globalThis.AudioContext;
  globalThis.AudioContext = Ctx;
  try {
    const L = createLoader({ assets: { 'SX-1': { kind: 'sfx' } }, cues: { wind: 'SX-1' } });
    L.play('wind'); // mount: no context yet
    assert.deepEqual(played, []);
    await L.unlock(); // first click / key
    assert.equal(played.length, 1, 'the pending first-beat cue plays after unlock');
    await L.unlock();
    assert.equal(played.length, 1, 'and only once');
  } finally { globalThis.AudioContext = saved; }
});

test('redteam: ?beat is clamped (1e9, negative, junk) and never walks off into done', async () => {
  const { startAt } = await import('./date-beta/engine.js');
  const t = Date.now();
  const big = startAt(scenes, { at: 'door', beat: 1e9 });
  assert.ok(Date.now() - t < 500);
  assert.equal(big.done, false);
  assert.deepEqual(startAt(scenes, { at: 'door', beat: -3 }), start(scenes, { at: 'door' }));
  assert.deepEqual(startAt(scenes, { at: 'door', beat: 'x' }), start(scenes, { at: 'door' }));
  assert.equal(beatAt(scenes, startAt(scenes, { at: 'door', beat: 2 })).index, 2);
});
