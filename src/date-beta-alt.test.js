// Scenes 6-10 (platform -> genkan): the ALT-SPEC lines and rules, checked against the shipped scenes.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadScenes, start, next } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };

const ALT = ['platform', 'underpass', 'apartment', 'stairs', 'genkan'];
const scenes = loadScenes(data);
const byId = Object.fromEntries(scenes.map((s) => [s.id, s]));
const lines = (id) => byId[id].beats.map((b) => b.text);

test('date-beta alt: scenes 6-10 follow the blackout, in order', () => {
  const ids = scenes.map((s) => s.id);
  assert.deepEqual(ids.slice(ids.indexOf('blackout') + 1), ALT);
});

test('date-beta alt: every bg is registered in art/index.js and its file exists', () => {
  const index = readFileSync(new URL('./date-beta/art/index.js', import.meta.url), 'utf8');
  for (const id of ALT) {
    const bg = byId[id].beats[0].bg;
    const m = new RegExp(`\\b${bg}: (\\w+)`).exec(index);
    assert.ok(m, `${bg} not in ART`);
    const file = new RegExp(`import ${m[1]} from '\\./(\\w+\\.jsx)'`).exec(index)?.[1];
    assert.ok(file && existsSync(new URL(`./date-beta/art/${file}`, import.meta.url)), `${bg}: missing art file`);
  }
});

test('date-beta alt: the spec lines are there, word for word', () => {
  assert.ok(lines('apartment').includes("NANDA: That's mine. I left the light on for you."));
  assert.ok(lines('stairs').includes('NANDA: Just tea. Then you can go.'));
  assert.ok(lines('platform').some((t) => /\bOR\b/.test(t)), 'the platform names the OR');
});

test('date-beta alt: underpass footsteps are an EVEN count', () => {
  const steps = byId.underpass.beats.map((b) => b.sfx).filter((s) => s?.startsWith('footsteps-'));
  assert.ok(steps.length);
  for (const s of steps) assert.equal(Number(s.split('-')[1]) % 2, 0, s);
});

test('date-beta alt: the OR beats carry the breath cue', () => {
  for (const id of ['platform']) {
    const b = byId[id].beats.find((x) => /\bOR\b/.test(x.text));
    assert.equal(b.sfx, 'breath', `${id}: OR without her breath`);
  }
});

test('date-beta alt: genkan insert is a camera move with a hard-cut RM alt', () => {
  const ins = byId.genkan.beats.find((b) => b.props.insert);
  assert.ok(ins?.motion);
  assert.equal(ins.rmAlt, 'hard-cut');
  assert.equal(byId.genkan.beats.at(-1).props.insert, true, 'the shrine beat stays on the insert crop');
});

test('date-beta alt: clicking from the platform walks all 5 scenes to the end, RM included', () => {
  for (const rm of [false, true]) {
    let pos = start(scenes, { rm, at: 'platform' });
    const seen = new Set();
    while (!pos.done) { seen.add(scenes[pos.s].id); pos = next(scenes, pos, rm); }
    assert.deepEqual([...seen], ALT);
  }
});
