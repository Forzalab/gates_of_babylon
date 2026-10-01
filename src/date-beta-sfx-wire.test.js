// sfx-wire (sprint 0930, M5): every sfx id fires somewhere (a beat, props.sfx or an event hook), beds loop one at a time
// and stop on a scene change, the lock game raises its sounds, levels stay under her voice.
// research/sprint-0930/sfx-wire/INVENTORY.md + QA.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadScenes, start, next, choose, beatAt, beatView, reactView, present, sceneIndex, FX } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { GACHA_FX } from './date-beta/gacha.js';
import { FRAMES as COLLAPSE } from './collapseFrames.js';
import { plan, createDirector, frameCues, propSfx, popSfx, emitSfx, onSfx, LOVE_SFX, GACHA_SFX, FX_SFX, LOCK_SFX, UMBRELLA_BED } from './date-beta/fx/sound.js';
import { createBeds, createLoader, makeAssets, BED_FADE } from './date-beta/assets.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const MAIN = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
const LOCK = readFileSync(new URL('./date-beta/game/LockGame.jsx', import.meta.url), 'utf8');
const PLAY = JSON.parse(MAIN.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const pack = (n) => ({ name: n, ...JSON.parse(readFileSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url), 'utf8')) });
const S = loadScenes(applyPacks(base, PLAY.map(pack)), { manifest });
const A = makeAssets(manifest);
const isBed = (c) => !!A.get(A.cueId(c))?.loop;
const sc = (id) => S[sceneIndex(S, id)];
const SFX_IDS = A.ids().filter((id) => A.get(id).kind === 'sfx');

// Sounds with no in-game hook, each with its reason. Empty: everything is wired (INVENTORY.md).
const ALLOW = {};

// every cue a beat can name in normal play: beat.sfx, vary sfx, props.sfx (+ vary props.sfx)
function beatCueNames() {
  const out = new Set();
  for (const s of S) for (const b of s.beats) {
    for (const c of frameCues(b)) out.add(c.cue);
    for (const m of Object.values(b.vary ?? {})) for (const e of Object.values(m)) {
      if (e.sfx) out.add(e.sfx);
      for (const c of propSfx(e.props)) out.add(c.cue);
    }
  }
  return out;
}
const EVENT_CUES = [...Object.values(LOVE_SFX), ...Object.values(GACHA_SFX), ...Object.values(FX_SFX), ...Object.values(LOCK_SFX), UMBRELLA_BED];

test('sfx-wire: every registered sfx id is fired by a beat, props.sfx, an event or the collapse (or is allowlisted)', () => {
  const used = new Set([...beatCueNames(), ...EVENT_CUES, ...COLLAPSE.map((f) => f.cue)].map((c) => A.cueId(c)).filter(Boolean));
  for (const [id, why] of Object.entries(ALLOW)) assert.ok(typeof why === 'string' && why.length > 10, `${id}: allowlist needs a reason`);
  const loose = SFX_IDS.filter((id) => !used.has(id) && !ALLOW[id]);
  assert.deepEqual(loose, [], `unwired sfx: ${loose.join(', ')}`);
});

test('sfx-wire: every cue the director can fire resolves to a manifest sfx with a file', () => {
  for (const c of new Set([...beatCueNames(), ...EVENT_CUES])) {
    const id = A.cueId(c);
    if (id === null) continue; // silence
    assert.equal(A.get(id)?.kind, 'sfx', `${c} -> ${id} is not an sfx`);
    assert.ok(existsSync(new URL(`../public/${A.get(id).path}`, import.meta.url)), `${c}: file missing`);
  }
});

test('sfx-wire: every gacha tier fx and every sounding pick FX has its sound', () => {
  for (const fx of GACHA_FX) assert.ok(GACHA_SFX[fx], `gacha fx ${fx} has no sound`);
  for (const fx of FX.filter((f) => f !== 'none' && f !== 'chosen-flash')) assert.ok(FX_SFX[fx], `pick fx ${fx} has no sound`);
  const g = pack('gacha').gacha;
  for (const t of [...g.crit, ...g.penalty, g.pity]) assert.ok(popSfx({ love: t.bonus, gacha: { fx: t.fx } }).length === 1, t.id);
});

test('sfx-wire: the named beats carry their sounds (vending, IC card, crunch, umbrella)', () => {
  const cues = (id, b) => frameCues(sc(id).beats[b]).map((c) => c.cue);
  assert.ok(cues('v2-train', 2).includes('vending-clunk'));
  assert.deepEqual(frameCues(sc('v2-train').beats[5]).filter((c) => c.cue === 'ic-beep').map((c) => c.at), [0, 700], 'two taps, two beeps');
  assert.deepEqual(frameCues(sc('seq-station').beats[1]).filter((c) => c.cue === 'ic-beep').map((c) => c.at), [0, 700]);
  for (const [id, b] of [['v2-curry-katsu', 4], ['v2-curry-katsu', 8], ['seq-katsu', 2], ['seq-katsu', 4]]) assert.ok(cues(id, b).includes('crunch'), `${id}[${b}]`);
  assert.ok(cues('v2-rain', 2).includes(UMBRELLA_BED) && cues('v2-rain', 3).includes(UMBRELLA_BED), 'under the umbrella in live rain');
  assert.ok(!cues('v2-rain', 1).includes(UMBRELLA_BED), 'beat 1: she holds it, you are not under yet');
  assert.ok(!cues('v2-rain', 4).includes(UMBRELLA_BED), 'rain stopping: the canopy goes quiet');
  assert.ok(cues('rain-crossing', 2).includes(UMBRELLA_BED));
  // the reaction frame after the seq-katsu pick re-shows that beat: no second crunch
  const at4 = { s: sceneIndex(S, 'seq-katsu'), b: 4, done: false, flags: {}, love: 0, path: [] };
  const rv = reactView(S, choose(S, at4, 0));
  assert.ok(rv?.react, 'a reaction frame');
  assert.ok(!frameCues(rv).some((c) => c.cue === 'crunch'));
});

test('sfx-wire: props.sfx is beat-local (never carried to the next beat)', () => {
  const s = loadScenes({ scenes: [{ id: 'a', bg: 'x', beats: [{ text: 'One.', props: { sfx: 'crunch', near: 'n' } }, { text: 'Two.' }] }] });
  assert.equal(s[0].beats[0].props.sfx, 'crunch');
  assert.equal(s[0].beats[1].props.sfx, undefined);
  assert.equal(s[0].beats[1].props.near, 'n');
  assert.deepEqual(propSfx({ sfx: ['a', 'b@300', 7, 'bad cue'] }), [{ cue: 'a', at: 0 }, { cue: 'b', at: 300 }]);
});

test('sfx-wire: events -> sounds (love chime, gacha replaces chime + pick FX, once per pop)', () => {
  const up = { love: 3 }, down = { love: -3 }, crit = { love: 13, gacha: { fx: 'love-crit' } }, rage = { love: -8, gacha: { fx: 'rage' } };
  const burst = { kind: 'love-burst' }, quake = { kind: 'hate-quake' };
  const shots = (st, input) => plan(st, { scene: 'a', ...input }, isBed).shots.map((s) => s.cue);
  const st = { scene: 'a' };
  assert.deepEqual(shots(st, { pop: up, fx: burst }), ['love-up', 'heart-pop']);
  assert.deepEqual(shots(st, { pop: down, fx: quake }), ['love-down', 'hate-quake']);
  assert.deepEqual(shots(st, { pop: crit, fx: burst }), ['gacha-crit']);
  assert.deepEqual(shots(st, { pop: rage }), ['rage-thunder']);
  assert.deepEqual(shots(st, { pop: { love: 15, gacha: { fx: 'love-bomb' } } }), ['love-bomb']);
  assert.deepEqual(shots(st, { pop: { love: -2, gacha: { fx: 'anger' } } }), ['anger-pop']);
  assert.deepEqual(shots({ scene: 'a', pop: up, fx: burst }, { pop: up, fx: burst }), [], 'the same pop / FX object never fires twice');
  assert.deepEqual(shots(st, { fx: { kind: 'chosen-flash' } }), [], 'the chosen card is silent');
});

test('sfx-wire: beds loop one at a time, stop on a scene change, never start twice', () => {
  const B = (sfx, props = {}) => ({ sfx, props });
  let r = plan({}, { scene: 'a', beat: B('wind') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: 'wind' }]);
  r = plan(r.state, { scene: 'a', beat: B('tick') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: 'wind' }], 'same scene: the bed runs on (re-asserted, idempotent)');
  assert.deepEqual(r.shots.map((s) => s.cue), ['tick']);
  r = plan(r.state, { scene: 'a', beat: B('rain') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: 'rain' }], 'a new bed replaces the old one');
  r = plan(r.state, { scene: 'a', beat: B('silence') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: null }], 'silence ends the bed');
  r = plan(plan({}, { scene: 'a', beat: B('wind') }, isBed).state, { scene: 'b', beat: B('thump') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: null }, { at: 0, cue: null }], 'scene change: the bed stops');
  r = plan(plan({}, { scene: 'a', beat: B('rain') }, isBed).state, { scene: 'b', beat: B('rain') }, isBed);
  assert.deepEqual(r.beds, [{ at: 0, cue: 'rain' }], 'the next scene asks for the same bed: it keeps running, no stop, no second copy');
  r = plan(plan({}, { scene: 'a', beat: B('wind') }, isBed).state, { scene: null }, isBed);
  assert.equal(r.beds.at(-1).cue, null, 'run over: silence');
  r = plan({}, { scene: 'a', beat: B('rain', { underUmbrella: true, rain: 'medium' }) }, isBed);
  assert.equal(r.beds.at(-1).cue, UMBRELLA_BED, 'under the umbrella the canopy bed wins');
});

// the player's frame (main.jsx): scene, beat, pop exactly as Player computes them
function frame(pos) {
  const scene = S[pos.react ? pos.react.s : pos.s];
  const beat = reactView(S, pos) ?? beatView(beatAt(S, pos), pos.flags);
  const here = !pos.done && present(scene, beat);
  return { scene: pos.done ? null : scene.id, beat: pos.done ? null : beat, pop: pos.react ?? (here && pos.pending ? pos.pending : null), fx: pos.fx ?? null };
}

// a fake WebAudio context: enough for createBeds + the loader
function fakeCtx() {
  const sources = [], gains = [];
  const param = (v) => ({ value: v, setValueAtTime(x) { this.value = x; }, linearRampToValueAtTime(x, t) { this.value = x; this.end = t; },
    cancelScheduledValues() {}, setTargetAtTime(x) { this.value = x; } });
  return {
    sources, gains, currentTime: 5, state: 'running', destination: { dest: true },
    createGain() { const g = { gain: param(1), to: null, connect(d) { g.to = d; return d; } }; gains.push(g); return g; },
    createBufferSource() { const s = { loop: false, started: null, stopAt: null, connect(d) { return d; }, start(t = 0) { s.started = t; }, stop(t) { s.stopAt = t; } }; sources.push(s); return s; },
    createOscillator() { return { frequency: {}, connect: (d) => d, start() {}, stop() {} }; },
    decodeAudioData() { return Promise.resolve({}); },
  };
}

test('sfx-wire: the bed mixer loops seamlessly, fades out <= 300 ms, never doubles', () => {
  const ctx = fakeCtx(), out = { out: true };
  const beds = createBeds(ctx, out, { buffer: (id) => ({ id }), gainOf: () => 0.4 });
  beds.set('SX-15'); beds.set('SX-15'); beds.set('SX-15');
  assert.equal(ctx.sources.length, 1, 'asked three times, started once');
  assert.equal(ctx.sources[0].loop, true, 'a buffer loop (the files are crossfade-looped)');
  beds.set('SX-20');
  assert.equal(ctx.sources.length, 2);
  assert.ok(ctx.sources[0].stopAt != null && ctx.sources[0].stopAt - ctx.currentTime <= 0.3, 'the old bed fades out within 300 ms');
  assert.ok(BED_FADE <= 0.3);
  beds.set(null);
  assert.ok(ctx.sources[1].stopAt - ctx.currentTime <= 0.3);
  assert.equal(beds.current(), null);
  assert.equal(ctx.sources.filter((s) => s.stopAt == null).length, 0);
});

test('sfx-wire: a whole run of the game never holds two beds, and every scene change drops the old one', () => {
  for (let seed = 0; seed < 12; seed++) {
    const ctx = fakeCtx();
    const beds = createBeds(ctx, {}, { buffer: (id) => ({ id }) });
    const D = createDirector(isBed);
    let pos = start(S, { seed }), last = null, changes = 0, picks = 0, pops = 0;
    for (let step = 0; step < 400; step++) {
      const f = frame(pos);
      const r = D.step({ ...f, sfxAt: 0 });
      for (const b of r.beds) beds.set(A.cueId(b.cue));
      pops += r.shots.filter((s) => ['love-up', 'love-down', ...Object.values(GACHA_SFX)].includes(s.cue)).length;
      const running = ctx.sources.filter((s) => s.stopAt == null);
      assert.ok(running.length <= 1, `seed ${seed} step ${step}: ${running.length} beds at once`);
      if (f.scene !== last && last !== null) {
        const claimed = f.beat ? frameCues(f.beat).filter((c) => isBed(c.cue)).map((c) => A.cueId(c.cue)) : [];
        assert.ok(beds.current() === null || claimed.includes(beds.current()), `seed ${seed}: ${last} -> ${f.scene} kept ${beds.current()}`);
        changes++;
      }
      last = f.scene;
      if (pos.done) break;
      const b = beatAt(S, pos);
      if (!pos.react && b.choices) {
        const i = (seed + step) % b.choices.length;
        if (b.choices[i].love) picks++;
        pos = choose(S, pos, i);
      } else pos = next(S, pos);
    }
    assert.ok(changes > 3, `seed ${seed}: walked ${changes} scene changes`);
    assert.ok(pops <= picks && pops >= Math.min(1, picks), `seed ${seed}: ${pops} pop sounds for ${picks} scored picks`);
    assert.ok(ctx.sources.length > 0, `seed ${seed}: some bed played`);
  }
});

test('sfx-wire: the loader starts the first bed on unlock, keeps it single, routes it through the mute / duck bus', async () => {
  let ctx = null;
  const saved = globalThis.AudioContext;
  globalThis.AudioContext = function Ctx() { ctx = fakeCtx(); return ctx; };
  try {
    const L = createLoader({ cues: { wind: 'W', tick: 'T' }, assets: { W: { kind: 'sfx', loop: true, gain: 0.3 }, T: { kind: 'sfx' } } });
    assert.equal(L.isBed('wind'), true);
    assert.equal(L.isBed('tick'), false);
    L.bed('wind'); // mount: no context yet
    assert.equal(L.bedId, null);
    await L.unlock();
    assert.equal(L.bedId, 'W', 'the bed asked for before the first gesture starts on unlock');
    const n = ctx.gains.length;
    L.bed('wind'); L.bed('wind');
    assert.equal(ctx.gains.length, n, 'no second copy');
    const master = ctx.gains[0];
    assert.equal(master.to, ctx.destination);
    assert.equal(ctx.gains[1].to, master, 'the bed sits on the master bus');
    L.setMuted(true);
    assert.equal(master.gain.value, 0, 'M mutes the bed too');
    L.setMuted(false); L.duck(true);
    assert.ok(master.gain.value < 0.5, 'ducked under a voice take');
    L.bed(null);
    assert.equal(L.bedId, null);
  } finally { globalThis.AudioContext = saved; }
});

test('sfx-wire: levels: beds and one-shots sit under her voice (levels.json, measured by levels.py)', () => {
  for (const id of SFX_IDS.filter((i) => A.get(i).loop)) assert.ok(A.get(id).gain > 0 && A.get(id).gain <= 0.5, `${id} bed gain`);
  assert.match(MAIN, /createVoice\(.*ASSETS\.duck/, 'the sfx bus ducks under a voice take');
  const LV = JSON.parse(readFileSync(new URL('../research/sprint-0930/sfx-wire/levels.json', import.meta.url), 'utf8'));
  const rows = Object.fromEntries(LV.sfx.map((r) => [r.id, r]));
  for (const id of SFX_IDS.filter((i) => A.get(i).path)) {
    const r = rows[id];
    assert.ok(r, `${id}: not measured (rerun research/sprint-0930/sfx-wire/levels.py)`);
    assert.ok(Math.abs(20 * Math.log10(A.get(id).gain ?? 1) - r.gain_db) < 0.06, `${id}: levels.json is stale (gain changed)`);
    if (/^SX-C/.test(id)) continue; // the Logic-side collapse: no voice there
    if (r.bed) {
      assert.ok(r.I <= LV.voice_I_median - 5, `${id}: bed ${r.I} LUFS is not under the voice (${LV.voice_I_median})`);
      assert.ok(r.I_ducked <= LV.voice_I_median - 12, `${id}: ducked bed ${r.I_ducked} LUFS`);
    } else {
      assert.ok(r.M <= -15, `${id}: one-shot momentary max ${r.M} LUFS > -15`);
      assert.ok(r.M + LV.duck_db <= LV.voice_M_max_median - 3, `${id}: ducked it would ride over her line`);
    }
  }
});

test('sfx-wire: the player and the lock game are hooked up', () => {
  assert.match(MAIN, /SOUND\.step\(/);
  assert.match(MAIN, /onSfx\(cue\)/);
  for (const k of ['match', 'win', 'lose']) assert.match(LOCK, new RegExp(`LOCK_SFX\\.${k}`), `lock game raises ${k}`);
  const heard = [];
  const off = onSfx((c) => heard.push(c));
  emitSfx('lock-click');
  off();
  emitSfx('lock-win');
  assert.deepEqual(heard, ['lock-click']);
});
