// Beat contract (src/date-beta/SCENES.md): speaker, timer, set/if, go conditions, defaults on skip, asset ids, validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, next, skip, choose, beatAt, beatView, timeoutPick, tick, enabled, resolveGo } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const ART_NAMES = ['splash', 'rooftop', 'train', 'naan', 'blackout', 'basement'];
const tiny = (beats, extra = {}) => ({ scenes: [{ id: 'a', bg: 'x', beats, ...extra }] });
const pair = (a = {}, b = {}, beat = {}) =>
  loadScenes(tiny([{ timer: 5, ...beat, choices: [{ text: 'stay', ...a }, { text: 'leave', ...b }] }]))[0].beats[0];

test('date-beta contract: the shipped scenes validate against the manifest and art names', () => {
  assert.doesNotThrow(() => loadScenes(data, { manifest, art: ART_NAMES }));
  const roof = loadScenes(data).find((s) => s.id === 'rooftop').beats.find((b) => b.timer);
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

// vary + flags (bento echo rule). A declared flag's values drive per-beat overlays of look/words only.
const FLAGS = { bento: ['umeboshi', 'tamagoyaki'] };
const flagged = (beats, extra = {}) => ({ flags: FLAGS, ...tiny(beats), ...extra });
const both = (u, t) => ({ bento: { umeboshi: u, tamagoyaki: t } });

test('date-beta vary: load failures (missing variant, undeclared flag, unknown value, non-look key, bad entry)', () => {
  assert.throws(() => loadScenes(flagged([{ vary: { bento: { umeboshi: {} } } }])), /a\[0\]: vary\.bento is missing the variant for "tamagoyaki"/);
  assert.throws(() => loadScenes(tiny([{ vary: both({}, {}) }])), /vary on undeclared flag "bento"/);
  assert.throws(() => loadScenes(flagged([{ vary: { mood: { a: {} } } }])), /undeclared flag "mood"/);
  assert.throws(() => loadScenes(flagged([{ vary: { bento: { umeboshi: {}, tamagoyaki: {}, mochi: {} } } }])), /unknown value "mochi"/);
  assert.throws(() => loadScenes(flagged([{ choices: [{ text: 'a' }], vary: both({ choices: [] }, {}) }])), /vary\.bento\.umeboshi: "choices" cannot vary/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ timer: 3 }, {}) }])), /"timer" cannot vary/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ set: { x: 1 } }, {}) }])), /"set" cannot vary/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ text: 'one two three four five six seven eight nine ten eleven twelve thirteen' }, {}) }])), /umeboshi: text has 13 words/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ text: 'f{or}' }, {}) }])), /stray brace/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ speaker: '' }, {}) }])), /speaker/);
  assert.throws(() => loadScenes(flagged([{ vary: both({ props: [1] }, {}) }])), /props must be an object/);
  assert.throws(() => loadScenes(flagged([{ vary: {} }])), /"vary" must be/);
  const one = (beat) => ({ flags: FLAGS, scenes: [{ id: 'a', bg: 'rooftop', beats: [beat] }] });
  assert.throws(() => loadScenes(one({ vary: both({ sfx: 'kazoo' }, {}) }), { manifest, art: ART_NAMES }), /umeboshi: sfx "kazoo"/);
  assert.throws(() => loadScenes(one({ vary: both({}, { bg: 'BG-99' }) }), { manifest, art: ART_NAMES }), /tamagoyaki: bg "BG-99"/);
});

test('date-beta flags: the root declaration is checked, and declared flags only take declared values', () => {
  assert.throws(() => loadScenes(flagged([{}], { flags: { bento: [] } })), /flags\.bento must be a non-empty list/);
  assert.throws(() => loadScenes(flagged([{}], { flags: { bento: ['a', 'a'] } })), /distinct/);
  assert.throws(() => loadScenes(flagged([{}], { flags: [] })), /"flags" must be an object/);
  assert.throws(() => loadScenes(flagged([{ set: { bento: 'mochi' } }])), /flag bento = "mochi" is not one of umeboshi\|tamagoyaki/);
  assert.throws(() => loadScenes(flagged([{ choices: [{ text: 'a', set: { bento: 'egg' } }] }])), /not one of/);
  assert.throws(() => loadScenes(flagged([{ choices: [{ text: 'a', if: { bento: 'egg' } }] }])), /not one of/);
  assert.throws(() => loadScenes({ flags: FLAGS, scenes: [{ id: 'a', bg: 'x', defaults: { bento: 'egg' }, beats: [{}] }] }), /not one of/);
  assert.doesNotThrow(() => loadScenes(flagged([{ set: { bento: null, other: 'anything' } }])));
});

test('date-beta echo lint: pick words need a text variant per value; the picking choices are exempt', () => {
  for (const w of ['umeboshi', 'Tamagoyaki', 'SOUR', 'sweet', 'すっぱい', '甘い']) {
    assert.throws(() => loadScenes(flagged([{ text: `NANDA: so ${w}!` }])), /is an echo word/, w);
  }
  assert.doesNotThrow(() => loadScenes(flagged([{ text: 'sweetheart, sourdough' }])), 'whole words only');
  assert.throws(() => loadScenes(tiny([{ text: 'Sour.' }])), /echo word/, 'lints even with no flags declared');
  assert.throws(() => loadScenes(flagged([{ text: 'Sour.', vary: both({ props: { a: 1 } }, { text: 'Sweet.' }) }])), /echo word/,
    'a variant without its own text would show the base echo word');
  assert.doesNotThrow(() => loadScenes(flagged([{ text: 'Sour.', vary: both({ text: 'Sour!' }, { text: 'Sweet!' }) }])));
  assert.throws(() => loadScenes(flagged([{ choices: [{ text: 'Eat the umeboshi' }] }])), /choices\[0\]: "umeboshi" is an echo word/);
  assert.doesNotThrow(() => loadScenes(flagged([{ choices: [{ text: 'Take the umeboshi', set: { bento: 'umeboshi' } },
    { text: 'Take the tamagoyaki', set: { bento: 'tamagoyaki' } }] }])));
});

test('date-beta beatView: overlays text/speaker/props/bg/sfx per value; unset or unknown = first value; no vary = same beat', () => {
  const [s] = loadScenes(flagged([
    { props: { clock: 'noon', ad: 'none' }, text: 'Base.', sfx: 'tick',
      vary: both({ text: 'NANDA: Sour.', props: { ad: 'ume' } }, { text: 'Sweet.', speaker: 'MC', props: { ad: 'egg' }, bg: 'y', sfx: 'bell' }) },
    { text: 'Plain.' }]));
  const [b, plain] = s.beats;
  const u = beatView(b, { bento: 'umeboshi' }), t = beatView(b, { bento: 'tamagoyaki' });
  assert.deepEqual([u.line.who, u.line.plain, u.props, u.bg, u.sfx], ['NANDA', 'Sour.', { clock: 'noon', ad: 'ume' }, 'x', 'tick']);
  assert.deepEqual([t.line.who, t.line.plain, t.props, t.bg, t.sfx], ['MC', 'Sweet.', { clock: 'noon', ad: 'egg' }, 'y', 'bell']);
  assert.deepEqual(beatView(b, {}).line.plain, 'Sour.', 'unset -> first declared value');
  assert.deepEqual(beatView(b, { bento: 'mochi' }).line.plain, 'Sour.', 'unknown -> first declared value');
  assert.deepEqual(b.props, { clock: 'noon', ad: 'none' }, 'the loaded beat is not mutated');
  assert.equal(beatView(plain, { bento: 'tamagoyaki' }), plain);
  assert.deepEqual(plain.props, { clock: 'noon', ad: 'none' }, 'variant props do not carry to the next beat');
  assert.equal(u.choices, b.choices);
  assert.equal(u.hold, b.hold);
});
