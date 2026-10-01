// M5 sfx wiring: every sfx id anything references resolves to a file on disk, the once-unused sounds are all wired to
// a beat or event, and the ambient beds loop one at a time and stop on a scene change.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { applyPacks } from './date-beta/packs/index.js';
import { loadScenes } from './date-beta/engine.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';
import { createLoader, makeAssets, beatCues, popCues, propSfx, isBedId, BEDS, BED_FADE } from './date-beta/assets.js';
import { watchLock, LOCK_CUES } from './date-beta/fx/lockSfx.js';

const A = makeAssets(manifest);
// The play order main.jsx uses (read from it, so this follows PLAY), and the extra art names the shop test lists.
const PLAY = JSON.parse(readFileSync('src/date-beta/main.jsx', 'utf8').match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const EXTRA_ART = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night', 'cellar', 'park', 'apartment-trace', 'sitting-room',
  'bedroom', 'genkan-in', 'genkan-v2', 'lock-game'];
const packs = PLAY.map((n) => ({ name: n, ...JSON.parse(readFileSync(`src/date-beta/packs/${n}.json`, 'utf8')) }));
const data = applyPacks(base, packs);
const scenes = loadScenes(data, { manifest, art: [...ART_NAMES, ...EXTRA_ART] });

const resolves = (cue) => {
  const id = A.cueId(cue);
  if (id === null) return true; // silence
  const a = A.get(id);
  return !!(a?.path && existsSync(`public/${a.path}`));
};

// Every cue name the code or the data can ask for.
const referenced = () => {
  const out = new Map(); // cue -> where
  const add = (c, where) => { if (c && !out.has(c)) out.set(c, where); };
  for (const sc of scenes) for (const b of sc.beats) {
    add(b.sfx, `${sc.id}:${b.index} sfx`);
    for (const e of propSfx(b.props)) add(e.cue, `${sc.id}:${b.index} props.sfx`);
  }
  for (const sc of data.scenes) for (const b of sc.beats) for (const m of Object.values(b.vary ?? {})) for (const e of Object.values(m)) {
    add(e.sfx, `${sc.id} vary sfx`);
    for (const x of propSfx(e.props)) add(x.cue, `${sc.id} vary props.sfx`);
  }
  const pops = [
    { love: 3 }, { love: -3 }, { love: -3, emote: 'hate' },
    { love: 13, gacha: { fx: 'love-crit' } }, { love: 15, gacha: { fx: 'love-bomb' } }, { love: -2, gacha: { fx: 'anger' } }, { love: -5, gacha: { fx: 'rage' } },
  ];
  for (const p of pops) for (const e of popCues(p)) add(e.cue, 'popCues');
  for (const e of popCues({ love: -3 }, { kind: 'hate-quake' })) add(e.cue, 'popCues hate-quake');
  for (const c of Object.values(LOCK_CUES)) add(c, 'lock game');
  return out;
};

test('every sfx id that is referenced resolves to a file', () => {
  const refs = referenced();
  assert.ok(refs.size >= 20);
  for (const [cue, where] of refs) assert.ok(resolves(cue), `${cue} (${where}) has no file on disk`);
});

test('the once-unused sounds are all wired to a beat or an event', () => {
  const refs = referenced();
  const unused = ['love-up', 'love-down', 'gacha-crit', 'love-bomb', 'anger-pop', 'rage-thunder', 'hate-quake', 'lock-click', 'lock-win', 'lock-fail',
    'vending-clunk', 'ic-beep', 'crunch', 'heart-pop', 'umbrella-rain'];
  for (const id of unused) assert.ok(refs.has(id), `${id} is not referenced by any beat, pop or game event`);
  // and every sfx in the manifest that is not a Figur-collapse slot is reachable
  for (const id of A.ids()) if (A.get(id).kind === 'sfx' && !id.startsWith('SX-C')) {
    const viaCue = Object.entries(manifest.cues).filter(([, v]) => v === id).map(([k]) => k);
    assert.ok(refs.has(id) || viaCue.some((c) => refs.has(c)), `${id} is unreferenced`);
  }
});

test('props.sfx: a name, a list, or { cue, at }; props.sfx on a reaction frame never fires; an inherited one-shot does not repeat', () => {
  assert.deepEqual(propSfx({ sfx: 'a' }), [{ cue: 'a' }]);
  assert.deepEqual(propSfx({ sfx: ['a', { cue: 'b', at: 5 }] }), [{ cue: 'a' }, { cue: 'b', at: 5 }]);
  assert.deepEqual(propSfx({ sfx: null }), []);
  assert.deepEqual(propSfx(undefined), []);
  const bed = (c) => c === 'rain' || c === 'umbrella-rain';
  const one = { sfx: 'thump', props: { sfx: 'crunch' } };
  assert.deepEqual(beatCues(one).map((e) => e.cue), ['thump', 'crunch']);
  assert.deepEqual(beatCues({ sfx: null, props: { sfx: 'crunch' } }, one).map((e) => e.cue), [], 'carried from the beat before');
  assert.deepEqual(beatCues({ ...one, react: {} }).map((e) => e.cue), ['thump']);
  // a bed in props.sfx replaces the beat's own bed (one bed per beat) but keeps its one-shot
  assert.deepEqual(beatCues({ sfx: 'rain', props: { sfx: 'umbrella-rain' } }, null, bed).map((e) => e.cue), ['umbrella-rain']);
  assert.deepEqual(beatCues({ sfx: 'tick', props: { sfx: 'umbrella-rain' } }, null, bed).map((e) => e.cue), ['tick', 'umbrella-rain']);
});

test('the beats the sounds were wired to carry them (katsu crunch, IC card x2, vending clunk, umbrella rain)', () => {
  const at = (sc, i) => scenes.find((s) => s.id === sc).beats[i];
  const cues = (sc, i) => beatCues(at(sc, i), at(sc, i - 1) ?? null, (c) => isBedId(A.cueId(c))).map((e) => e.cue);
  assert.ok(cues('seq-katsu', 2).includes('crunch'));
  assert.ok(cues('v2-curry-katsu', 4).includes('crunch'));
  assert.deepEqual(cues('seq-station', 1).filter((c) => c === 'ic-beep').length, 2);
  assert.deepEqual(cues('v2-train', 5).filter((c) => c === 'ic-beep').length, 2);
  assert.ok(cues('v2-train', 2).includes('vending-clunk'));
  assert.ok(!cues('v2-train', 3).includes('vending-clunk'), 'a carried one-shot does not fire on the next beat');
  for (const i of [1, 2, 4]) assert.deepEqual(cues('v2-rain', i).filter((c) => A.cueId(c) === 'umbrella-rain'), ['umbrella-rain'], `v2-rain ${i}`);
  assert.ok(!cues('v2-rain', 3).includes('umbrella-rain'), 'the eave beat stays on its silence');
});

test('pop cues: love chimes, gacha crit / love-bomb, anger / rage / hate, heart pop', () => {
  const c = (p, fx) => popCues(p, fx).map((e) => e.cue);
  assert.deepEqual(c({ love: 3 }), ['love-up', 'heart-pop']);
  assert.deepEqual(c({ love: -3 }), ['love-down']);
  assert.deepEqual(c({ love: 13, gacha: { fx: 'love-crit' } }), ['gacha-crit', 'heart-pop']);
  assert.deepEqual(c({ love: 15, gacha: { fx: 'love-bomb' } }), ['love-bomb', 'heart-pop']);
  assert.deepEqual(c({ love: -2, gacha: { fx: 'anger' } }), ['anger-pop']);
  assert.deepEqual(c({ love: -5, gacha: { fx: 'rage' } }), ['rage-thunder']);
  assert.deepEqual(c({ love: -3 }, { kind: 'hate-quake' }), ['hate-quake']);
  assert.deepEqual(c({ love: -3, emote: 'hate' }), ['hate-quake']);
  assert.deepEqual(c(null), []);
  assert.deepEqual(c({ love: 0 }), []);
});

// ---- beds: a fake WebAudio ----
function fakeAudio() {
  const ctx = {
    currentTime: 0, state: 'running', destination: {}, sources: [],
    createGain: () => ({ gain: { value: 1, cancelScheduledValues() {}, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v) { this.value = v; }, setTargetAtTime(v) { this.value = v; } }, connect: (n) => n }),
    createBufferSource: () => { const s = { loop: false, buffer: null, startedAt: null, stopAt: null, connect: (n) => n, start() { s.startedAt = ctx.currentTime; }, stop(t) { s.stopAt = t; } }; ctx.sources.push(s); return s; },
    createOscillator: () => ({ frequency: {}, connect: (n) => n, start() {}, stop() {} }),
    decodeAudioData: async (ab) => ({ file: ab }),
    live: () => ctx.sources.filter((s) => s.loop && s.startedAt != null && (s.stopAt == null || s.stopAt > ctx.currentTime)),
  };
  return ctx;
}
const M = {
  cues: { rain: 'SX-20', wind: 'SX-15', silence: null },
  assets: { 'SX-20': { kind: 'sfx', path: 'x/rain.wav' }, 'SX-15': { kind: 'sfx', path: 'x/wind.wav' }, 'umbrella-rain': { kind: 'sfx', path: 'x/u.wav' }, tick: { kind: 'sfx', path: 'x/tick.wav' } },
};
const flush = () => new Promise((r) => setTimeout(r, 5));
async function boot(opts = {}) {
  const ctx = fakeAudio();
  const save = { fetch: globalThis.fetch, AudioContext: globalThis.AudioContext, addEventListener: globalThis.addEventListener };
  globalThis.fetch = async (u) => ({ ok: !(opts.missing ?? []).some((m) => u.includes(m)), arrayBuffer: async () => u });
  globalThis.AudioContext = function AC() { return ctx; };
  globalThis.addEventListener = () => {};
  const L = createLoader(M, '/');
  L.preload();
  await flush();
  if (!opts.late) await L.unlock();
  return { L, ctx, restore: () => Object.assign(globalThis, save) };
}

test('beds loop, never double, and crossfade without a gap', async () => {
  const { L, ctx, restore } = await boot();
  try {
    assert.ok(BEDS.every((id) => isBedId(id)) && !isBedId('tick'));
    L.scene('a'); L.play('rain');
    assert.equal(ctx.live().length, 1);
    assert.equal(ctx.live()[0].loop, true, 'a bed loops');
    L.play('rain'); L.play('SX-20'); L.play('rain');
    assert.equal(ctx.live().length, 1, 'the same bed asked again does not double');
    L.play('tick');
    assert.equal(ctx.live().length, 1, 'a one-shot is not a bed');
    // another bed: the new one is already running when the old one is told to stop (no gap), and the old one ends after the fade (no double)
    ctx.currentTime = 10;
    L.play('wind');
    const [old, nu] = ctx.sources.filter((s) => s.loop);
    assert.equal(nu.startedAt, 10);
    assert.ok(old.stopAt > 10 && old.stopAt <= 10 + BED_FADE + 0.1);
    assert.equal(L.bedId(), 'SX-15');
    ctx.currentTime = 11;
    assert.equal(ctx.live().length, 1);
    assert.equal(ctx.live()[0], nu);
  } finally { restore(); }
});

test('beds stop on a scene change (and not within the same scene)', async () => {
  const { L, ctx, restore } = await boot();
  try {
    L.scene('a'); L.play('rain');
    L.scene('a'); L.scene('a');
    assert.equal(L.bedId(), 'SX-20', 'same scene: the bed runs on');
    ctx.currentTime = 5;
    L.scene('b');
    assert.equal(L.bedId(), null);
    ctx.currentTime = 6;
    assert.equal(ctx.live().length, 0, 'the bed is gone after the fade');
    // the new scene brings its own, alone
    L.play('wind');
    assert.equal(L.bedId(), 'SX-15');
    ctx.currentTime = 7;
    assert.equal(ctx.live().length, 1);
    // an authored silence ends a bed too; the run ending (scene null) lets go
    L.play('silence'); ctx.currentTime = 9;
    assert.equal(ctx.live().length, 0);
    L.play('rain'); L.scene(null); ctx.currentTime = 11;
    assert.equal(ctx.live().length, 0);
  } finally { restore(); }
});

test('a bed asked for before the first gesture starts once on unlock; one asked before its file decodes starts when it does', async () => {
  const early = await boot({ late: true });
  try {
    early.L.scene('a'); early.L.play('rain'); early.L.play('rain');
    await early.L.unlock();
    assert.equal(early.ctx.live().length, 1);
    assert.equal(early.L.bedId(), 'SX-20');
  } finally { early.restore(); }
  // a scene change before the gesture drops the pending bed
  const gone = await boot({ late: true });
  try {
    gone.L.scene('a'); gone.L.play('rain'); gone.L.scene('b');
    await gone.L.unlock();
    assert.equal(gone.ctx.live().length, 0);
  } finally { gone.restore(); }
  // a missing bed file: falls back to the one-shot stand-in, not a loop, and never throws
  const miss = await boot({ missing: ['wind'] });
  try {
    miss.L.scene('a'); miss.L.play('wind');
    assert.equal(miss.L.bedId(), null);
  } finally { miss.restore(); }
});

// ---- lock game events ----
test('lock game: tile tap, mismatch, open, time-out', () => {
  const played = [];
  const listeners = {};
  const kids = { title: { textContent: 'THE DOOR IS LOCKED' }, time: { textContent: '12s' } };
  const root = { querySelector: (q) => (q === '.is-bad' ? null : q === '.lg-title' ? kids.title : q === '.lg-time' ? kids.time : null) };
  const doc = { body: {}, addEventListener: (t, f) => { listeners[t] = f; }, removeEventListener() {}, querySelector: (q) => (q === '.lg-root' ? root : null) };
  let observe;
  class Obs { constructor(f) { observe = f; } observe() {} disconnect() {} }
  const off = watchLock(doc, (c) => played.push(c), Obs);
  const tile = (open) => ({ target: { closest: (q) => (q === '.lg-tile' ? { disabled: false, classList: { contains: () => open }, closest: () => root } : null) } });
  listeners.click(tile(false));
  listeners.click(tile(true));
  listeners.click({ target: { closest: () => null } });
  assert.deepEqual(played, ['lock-click']);
  observe([{ type: 'attributes', attributeName: 'class', target: { classList: { contains: (c) => c === 'is-bad' } }, oldValue: 'lg-tile is-sel' }]);
  assert.deepEqual(played, ['lock-click', 'lock-fail']);
  kids.title.textContent = 'THE DOOR IS OPEN';
  observe([]); observe([]);
  assert.deepEqual(played, ['lock-click', 'lock-fail', 'lock-win'], 'win plays once');
  off();
  // time-out
  const p2 = [];
  kids.title.textContent = 'THE DOOR IS LOCKED'; kids.time.textContent = '0s';
  const root2 = { querySelector: (q) => (q === '.lg-title' ? kids.title : q === '.lg-time' ? kids.time : null) };
  watchLock({ ...doc, querySelector: () => root2 }, (c) => p2.push(c), Obs);
  observe([]); observe([]);
  assert.deepEqual(p2, ['lock-fail']);
});
