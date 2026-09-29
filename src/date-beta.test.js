import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, next, skip, beatAt, canAdvance, words, MIN_HOLD } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };

const tiny = (beats, extra = {}) => ({ scenes: [{ id: 'a', bg: 'x', beats, ...extra }] });

test('date-beta: the shipped scenes.json loads, 10 scenes in demo order', () => {
  const scenes = loadScenes(data);
  assert.deepEqual(scenes.map((s) => s.id), ['splash', 'rooftop', 'train', 'naan', 'blackout',
    'platform', 'underpass', 'apartment', 'stairs', 'genkan-in']);
});

test('date-beta: every shipped beat obeys the hard rules (<=12 words, >=500 ms, motion has an RM alt)', () => {
  for (const s of loadScenes(data)) {
    for (const b of s.beats) {
      assert.ok(words(b.text) <= 12, `${s.id}[${b.index}] too long`);
      assert.ok(b.hold >= MIN_HOLD, `${s.id}[${b.index}] holds < 500 ms`);
      if (b.motion) assert.notEqual(b.rmAlt, 'same', `${s.id}[${b.index}] has motion but no RM alt`);
      if (b.auto) assert.ok(b.auto >= MIN_HOLD);
    }
  }
});

test('date-beta loader: bg and props carry forward from beat to beat', () => {
  const [s] = loadScenes(tiny([{ props: { clock: 'live', sky: 'day' } }, { props: { clock: 'noon' } }]));
  assert.equal(s.beats[1].bg, 'x');
  assert.deepEqual(s.beats[1].props, { clock: 'noon', sky: 'day' });
  assert.deepEqual(s.beats[0].props, { clock: 'live', sky: 'day' }, 'earlier beat is not mutated');
});

test('date-beta loader: rejects a 13-word line, a motion beat without an RM alt, a duplicate id', () => {
  assert.throws(() => loadScenes(tiny([{ text: 'one two three four five six seven eight nine ten eleven twelve thirteen' }])), /13 words/);
  assert.throws(() => loadScenes(tiny([{ motion: true }])), /reduced-motion/);
  assert.throws(() => loadScenes({ scenes: [{ id: 'a', bg: 'x', beats: [{}] }, { id: 'a', bg: 'x', beats: [{}] }] }), /duplicate/);
  assert.throws(() => loadScenes({ scenes: [] }), /non-empty/);
  assert.throws(() => loadScenes({ scenes: [{ id: 'a', beats: [{}] }] }), /no bg/);
});

test('date-beta loader: word count ignores lone punctuation; hold is clamped up to 500 ms', () => {
  assert.equal(words('MC: Technically, rain wasn\'t f-OR-ecast.'), 5);
  assert.equal(words('— … !'), 0);
  const [s] = loadScenes(tiny([{ hold: 100 }]));
  assert.equal(s.beats[0].hold, MIN_HOLD);
});

test('date-beta sequencer: next walks beats, then scenes, then reports done', () => {
  const scenes = loadScenes({ scenes: [{ id: 'a', bg: 'x', beats: [{}, {}] }, { id: 'b', bg: 'y', beats: [{}] }] });
  let p = start(scenes);
  assert.deepEqual(p, { s: 0, b: 0, done: false });
  p = next(scenes, p); assert.deepEqual(p, { s: 0, b: 1, done: false });
  p = next(scenes, p); assert.deepEqual(p, { s: 1, b: 0, done: false });
  assert.equal(beatAt(scenes, p).bg, 'y');
  p = next(scenes, p); assert.equal(p.done, true);
  assert.deepEqual(next(scenes, p), p, 'done is sticky');
});

test('date-beta sequencer: skip (Esc) jumps to the next scene; start can jump to a scene id', () => {
  const scenes = loadScenes(data);
  const p = skip(scenes, start(scenes));
  assert.equal(scenes[p.s].id, 'rooftop');
  assert.equal(scenes[start(scenes, { at: 'naan' }).s].id, 'naan');
  assert.equal(start(scenes, { at: 'nope' }).s, 0, 'unknown id falls back to the first scene');
  assert.equal(scenes[skip(scenes, start(scenes, { at: 'blackout' })).s].id, 'platform');
  assert.equal(skip(scenes, start(scenes, { at: scenes.at(-1).id })).done, true);
});

test('date-beta sequencer: reduced motion drops rmAlt "skip" beats (ADORE ME = 3 hard-cut states)', () => {
  const scenes = loadScenes(data);
  const phases = (rm) => {
    const out = [];
    for (let p = start(scenes, { at: 'blackout', rm }); !p.done && scenes[p.s].id === 'blackout'; p = next(scenes, p, rm)) out.push(beatAt(scenes, p).props.phase);
    return out.filter((ph, i) => ph !== out[i - 1]);
  };
  assert.deepEqual(phases(true), ['dark', 'forecast', 'or', 'ador', 'adoreme', 'cut']);
  assert.deepEqual(phases(false), ['dark', 'forecast', 'or', 'dor', 'ador', 'adore', 'adoreme', 'fade', 'cut']);
});

test('date-beta canAdvance: hold gate, START-only beats, auto beats ignore clicks', () => {
  const [s] = loadScenes(tiny([{ hold: 800 }, { wait: 'start' }, { auto: 1000 }]));
  assert.equal(canAdvance(s.beats[0], 700), false);
  assert.equal(canAdvance(s.beats[0], 800), true);
  assert.equal(canAdvance(s.beats[1], 900), false, 'a stray click does not press START');
  assert.equal(canAdvance(s.beats[1], 900, { button: true }), true);
  assert.equal(canAdvance(s.beats[2], 5000, { button: true }), false);
});
