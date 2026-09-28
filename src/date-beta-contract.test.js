// Beat contract (src/date-beta/SCENES.md): speaker, timer, set/if, go conditions, defaults on skip, asset ids, validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, next, skip, choose, beatAt, timeoutPick, tick, enabled, resolveGo } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const ART_NAMES = ['splash', 'rooftop', 'train', 'naan', 'blackout'];
const tiny = (beats, extra = {}) => ({ scenes: [{ id: 'a', bg: 'x', beats, ...extra }] });
const pair = (a = {}, b = {}, beat = {}) =>
  loadScenes(tiny([{ timer: 5, ...beat, choices: [{ text: 'stay', ...a }, { text: 'leave', ...b }] }]))[0].beats[0];

test('date-beta contract: the shipped scenes validate against the manifest and art names', () => {
  assert.doesNotThrow(() => loadScenes(data, { manifest, art: ART_NAMES }));
  const roof = loadScenes(data)[1].beats[2];
  assert.equal(roof.timer, 10);
  assert.equal(timeoutPick(roof), 0);
});

test('date-beta contract: explicit speaker wins; "NANDA:" prefix is the fallback', () => {
  const [s] = loadScenes(tiny([{ text: 'Hi there.', speaker: 'NANDA' }, { text: 'NANDA: Hi there.' }, { text: 'Rain.' }]));
  assert.equal(s.beats[0].line.who, 'NANDA');
  assert.equal(s.beats[0].line.plain, 'Hi there.');
  assert.equal(s.beats[1].line.who, 'NANDA');
  assert.equal(s.beats[1].line.plain, 'Hi there.');
  assert.equal(s.beats[2].line.who, null);
  assert.throws(() => loadScenes(tiny([{ text: 'x', speaker: '' }])), /speaker/);
});

test('date-beta timer: 0 picks the default, else pink; disabled default -> the other; none enabled -> no pick', () => {
  assert.equal(timeoutPick(pair()), 0, 'no default: pink');
  assert.equal(timeoutPick(pair({}, { default: true })), 1, 'marked default');
  assert.equal(timeoutPick(pair({ side: 'purple' }, { side: 'pink' })), 1, 'pink by side, not by order');
  const gated = pair({}, { default: true, if: { brave: true } });
  assert.equal(timeoutPick(gated, {}), 0, 'default disabled -> the other enabled one');
  assert.equal(timeoutPick(gated, { brave: true }), 1);
  const none = pair({ if: { a: 1 } }, { if: { b: 1 } });
  assert.equal(timeoutPick(none, {}), -1, 'nothing enabled -> no auto-pick');
  assert.throws(() => pair({ default: true }, { default: true }), /only one choice/);
  assert.throws(() => loadScenes(tiny([{ timer: 5 }])), /choice beat/);
  assert.throws(() => pair({}, {}, { timer: 0 }), /positive/);
});

test('date-beta timer: countdown freezes while paused / hidden and clamps at 0', () => {
  assert.equal(tick(5, 1000), 4);
  assert.equal(tick(5, 1000, true), 5, 'frozen');
  assert.equal(tick(0.5, 1000), 0);
});

test('date-beta flags: beat set + choice set merge; if disables a choice and choose() refuses it', () => {
  const scenes = loadScenes({ scenes: [{ id: 'a', bg: 'x', beats: [
    { set: { met: true } },
    { choices: [{ text: 'kiss', if: { brave: true }, set: { kissed: true } }, { text: 'wave', set: { kissed: false, brave: true } }] },
    {}] }] });
  let p = start(scenes);
  assert.deepEqual(p.flags, { met: true });
  p = next(scenes, p);
  const beat = beatAt(scenes, p);
  assert.equal(enabled(beat.choices[0], p.flags), false);
  assert.deepEqual(choose(scenes, p, 0), p, 'disabled choice = no move');
  const q = choose(scenes, p, 1);
  assert.deepEqual(q.flags, { met: true, kissed: false, brave: true });
  assert.equal(q.b, 2);
  assert.equal(enabled(beat.choices[0], q.flags), true);
});

test('date-beta go: conditional list picks the first matching target, a plain id is the fallback', () => {
  const go = [{ if: { stayed: true }, to: 'good' }, 'bad'];
  assert.equal(resolveGo(go, { stayed: true }), 'good');
  assert.equal(resolveGo(go, {}), 'bad');
  assert.equal(resolveGo([{ if: { x: 1 }, to: 'good' }], {}), null, 'nothing matches = carry on');
  const scenes = loadScenes({ scenes: [
    { id: 'a', bg: 'x', beats: [{ choices: [{ text: 'stay', set: { stayed: true }, go }, { text: 'leave', go }] }] },
    { id: 'good', bg: 'x', beats: [{}] }, { id: 'bad', bg: 'x', beats: [{}] }] });
  assert.equal(scenes[choose(scenes, start(scenes), 0).s].id, 'good', 'set applies before go is resolved');
  assert.equal(scenes[choose(scenes, start(scenes), 1).s].id, 'bad');
  assert.throws(() => loadScenes(tiny([{ choices: [{ text: 'a', go: [{ if: { x: 1 }, to: 'nope' }] }] }])), /unknown scene "nope"/);
  assert.throws(() => loadScenes(tiny([{ choices: [{ text: 'a', go: [{ when: {}, to: 'a' }] }] }])), /unknown go key "when"/);
});

test('date-beta skip: skipping a scene leaves flags at its declared defaults', () => {
  const scenes = loadScenes({ scenes: [
    { id: 'a', bg: 'x', defaults: { stayed: false }, beats: [{ set: { stayed: true, seen: 1 } }, { choices: [{ text: 'x', set: { stayed: true } }] }] },
    { id: 'b', bg: 'x', beats: [{}] }] });
  const p = skip(scenes, start(scenes));
  assert.equal(scenes[p.s].id, 'b');
  assert.deepEqual(p.flags, { stayed: false, seen: 1 });
});

test('date-beta validation: unknown keys, bad go targets, bad asset ids fail at load with a clear message', () => {
  const opts = { manifest, art: ART_NAMES };
  assert.throws(() => loadScenes(tiny([{ txt: 'typo' }])), /a\[0\]: unknown beat key "txt"/);
  assert.throws(() => loadScenes(tiny([{}], { mood: 'x' })), /a: unknown scene key "mood"/);
  assert.throws(() => loadScenes({ ...tiny([{}]), extra: 1 }), /unknown root key "extra"/);
  assert.throws(() => loadScenes(tiny([{ choices: [{ text: 'a', goto: 'b' }] }])), /choices\[0\]: unknown choice key "goto"/);
  assert.throws(() => loadScenes(tiny([{ choices: [{ text: 'a', go: 'nope' }] }])), /unknown scene "nope"/);
  const one = (beat) => ({ scenes: [{ id: 'a', bg: 'rooftop', beats: [beat] }] });
  assert.throws(() => loadScenes(one({ bg: 'BG-99' }), opts), /bg "BG-99" is not in the asset manifest/);
  assert.throws(() => loadScenes(one({ bg: 'SX-37' }), opts), /bg "SX-37" is a sfx asset, not bg/);
  assert.throws(() => loadScenes(one({ sprite: 'SP-01' }), opts), /sprite "SP-01" is not in the asset manifest/);
  assert.throws(() => loadScenes(one({ sfx: 'SX-99' }), opts), /sfx "SX-99" is not in the asset manifest/);
  assert.throws(() => loadScenes(one({ sfx: 'kazoo' }), opts), /sfx "kazoo" is neither a manifest id nor one of/);
  assert.throws(() => loadScenes(one({ bg: 'moon' }), opts), /bg "moon" is neither/);
  assert.throws(() => loadScenes(tiny([{ set: { a: [1] } }])), /flat object/);
  const ok = loadScenes(one({ bg: 'BG-03', sfx: 'SX-37', text: 'x' }), opts)[0].beats[0];
  assert.equal(ok.bg, 'BG-03');
  assert.equal(ok.sfx, 'SX-37');
});
