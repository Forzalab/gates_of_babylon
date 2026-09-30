// train-r4 (research/sprint-0930/train-r4/PLAN.md): v2-train = the 9-beat script Tony approved, one face per beat
// exactly as the table says, the {wavy:…} / {hat:…} styled spans, the vending beat echoing the bento pick, the loop
// variants kept (their voice takes still resolve), and the six traced faces.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, orParts, beatView, SPANS } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { nandaSVG, TRAIN_FACES } from './date-beta/art/nanda.js';
import { buildIndex, fileForLine } from './date-beta/voice/voice.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const PACKS = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences', 'variant-v2', 'r3-station'];
const data = applyPacks(read('./date-beta/scenes.json'), PACKS.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
const S = loadScenes(data);
const T = S.find((s) => s.id === 'v2-train');
// the PLAN.md table, beat by beat (index 0 = table row 1)
const FACES = ['heart-laugh', 'nervous', 'anya-smile', 'ticked-off', 'very-angry', 'content', 'happy', 'dazed-sleepy', 'smug-gloating'];

test('train-r4: v2-train is the 9-line script, a different face on every beat, exactly as the table', () => {
  assert.equal(T.beats.length, 9);
  T.beats.forEach((b, i) => assert.equal(b.props.cut?.face, FACES[i], `beat ${i}`));
  assert.equal(new Set(FACES).size, 9);
  assert.equal(T.beats[3].props.cut.face2, 'puff', 'ticked off -> puff at "They laugh."');
  assert.match(T.beats[0].line.plain, /Now we go to MY home\. On MY train\./);
  assert.match(T.beats[8].line.plain, /Home\. Come\./);
  assert.deepEqual(T.beats[8].choices.map((c) => c.go), ['v2-rain']);
});

test('train-r4: styled spans parse to plain words (voice / aria / OCR) and a stray brace still fails', () => {
  const line = T.beats[4].line;
  assert.equal(line.who, 'NANDA');
  assert.deepEqual(line.parts.filter((p) => p.span).map((p) => [p.span, p.t]), [['wavy', 'Wavy hair.'], ['hat', 'Hat boy, the gringo.']]);
  assert.equal(line.plain, 'Hey, you. Wavy hair. And you. Hat boy, the gringo. Stop pushing. He is MINE.');
  assert.deepEqual(SPANS, ['wavy', 'hat']);
  assert.throws(() => orParts('a {bold:x} b'), /stray brace/);
  assert.deepEqual(orParts('{OR} {hat:x}'), [{ t: 'OR', or: true }, { t: ' ' }, { t: 'x', span: 'hat' }]);
  const say = readFileSync(new URL('./date-beta/Say.jsx', import.meta.url), 'utf8');
  assert.match(say, /db-hat-chip" aria-hidden="true"/, 'the cap chip is decoration only');
});

test('train-r4: the vending beat echoes the bento pick (drink + words)', () => {
  const b = T.beats[2];
  const ume = beatView(b, { bento: 'umeboshi' }), tama = beatView(b, { bento: 'tamagoyaki' });
  assert.equal(ume.props.drink, 'umeboshi');
  assert.equal(tama.props.drink, 'tamagoyaki');
  assert.match(ume.line.plain, /plum drink\. Sour\./);
  assert.match(tama.line.plain, /Egg pudding drink\. Sweet\./);
  for (const v of [ume, tama]) assert.match(v.line.plain, /Like the one you picked\. I remember\./);
});

test('train-r4: the loop keeps its run 2/3 variants and their recorded takes', () => {
  const idx = buildIndex(read('./date-beta/voice/manifest.json'));
  const loop = T.beats[6];
  assert.match(beatView(loop, { run: '1' }).line.plain, /^12 stops to her home\./);
  for (const r of ['2', '3']) assert.ok(fileForLine(idx, 'v2-train', beatView(loop, { run: r }).line.plain), `run ${r} take`);
});

test('train-r4: the six traced faces render in her palette (distinct from each other)', () => {
  assert.deepEqual(TRAIN_FACES, ['nervous', 'ticked-off', 'very-angry', 'happy', 'dazed-sleepy', 'smug-gloating']);
  const svgs = TRAIN_FACES.map((f) => nandaSVG({ face: f, talk: false }).replace(/nd-\w+\d+|au\d+/g, ''));
  assert.equal(new Set(svgs).size, 6);
  for (const s of svgs) assert.match(s, /#6b0f45/, 'her ink');
  assert.match(nandaSVG({ face: 'very-angry' }), /#ff1414/, 'the vein layer');
  assert.match(nandaSVG({ face: 'dazed-sleepy' }), /#8fd3ff/, 'drool');
});
