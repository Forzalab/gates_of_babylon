// Emotion FX art (src/date-beta/art/emotion/): every gacha fx has a renderer, stills only, seeded, within the node budget.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { EMOTION_FX } from './date-beta/art/emotion/index.js';
import { GACHA_FX, loadGacha } from './date-beta/gacha.js';
import gachaPack from './date-beta/packs/gacha.json' with { type: 'json' };

const nodes = (s) => (s.match(/<(path|circle|ellipse|rect|polygon|g|line)\b/g) ?? []).length;
const G = loadGacha(gachaPack.gacha);
const all = [...G.crit, ...G.penalty, G.pity];

test('emotion fx: one renderer per gacha fx id, and every tier in the pack has one', () => {
  assert.deepEqual(Object.keys(EMOTION_FX).sort(), [...GACHA_FX].sort());
  for (const t of all) assert.equal(typeof EMOTION_FX[t.fx], 'function', t.id);
});

test('emotion fx: stills only (no SMIL, no CSS motion), decorative (aria-hidden), seeded = the same picture every time', () => {
  for (const t of all) {
    const a = EMOTION_FX[t.fx](t), b = EMOTION_FX[t.fx](t);
    assert.equal(a, b, `${t.id}: same tier, same markup`);
    assert.doesNotMatch(a, /<animate|<set\b|animation|transition|@keyframes/i, t.id);
    assert.match(a, /^<svg class="emo-art" viewBox="0 0 1920 1080"[^>]*aria-hidden="true"/, t.id);
    assert.ok(nodes(a) <= 300, `${t.id}: ${nodes(a)} nodes (budget 300)`);
    assert.ok((a.match(/<filter/g) ?? []).length <= 2, `${t.id}: blur on at most 2 groups`);
  }
  assert.notEqual(EMOTION_FX['love-crit']({ bonus: 10 }), EMOTION_FX['love-crit']({ bonus: 5 }), '+10 draws denser than +5');
});

test('emotion fx: the palette split holds (love = light pastel, rage = black + yellow-white bolts, anger = pink halftone)', () => {
  assert.match(EMOTION_FX['love-crit']({ bonus: 5 }), /#f8a0c8/);
  assert.match(EMOTION_FX['love-bomb'](), /#90e0f0/, 'pity adds the cyan drift');
  assert.match(EMOTION_FX['love-bomb'](), /<polygon/, 'glass hexagons');
  const rage = EMOTION_FX.rage();
  assert.match(rage, /<rect width="1920" height="1080" fill="#000"\/>/);
  assert.match(rage, /stroke="#f4f8c8"/);
  assert.match(EMOTION_FX.anger(), /fill="#f4a8c8"/);
});

test('emotion css + component: nothing animates or transitions', () => {
  const dir = new URL('./date-beta/art/emotion/', import.meta.url);
  for (const f of readdirSync(dir).filter((n) => /\.(css|jsx)$/.test(n))) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    assert.doesNotMatch(src, /animation\s*:|transition\s*:|@keyframes|setInterval/, f);
  }
});

// ---------- face layers (art/emotion/face.js on art/nanda.js anchors)
import { faceLayers, FACE_IDS } from './date-beta/art/emotion/face.js';
import { nandaSVG, ANCHORS, PAL, EMOTES as NANDA_EMOTES } from './date-beta/art/nanda.js';
import { FACE_LAYERS } from './date-beta/gacha.js';
import { EMOTES } from './date-beta/engine.js';

test('face layers: the four ids match the gacha list; each draws something; stills only', () => {
  assert.deepEqual([...FACE_IDS].sort(), [...FACE_LAYERS].sort());
  for (const id of FACE_IDS) {
    const { under, over } = faceLayers([id], PAL[1], ANCHORS);
    assert.ok((under + over).length > 40, id);
    assert.doesNotMatch(under + over, /<animate|<set\b|animation|transition/i, id);
  }
  assert.deepEqual(faceLayers([], PAL[1], ANCHORS), { under: '', over: '' });
});

test('face layers: positioned from her anchors (move an anchor, the layer moves); rage gets the bigger vein pair', () => {
  const moved = { ...ANCHORS, temple: [40, 30] };
  assert.notEqual(faceLayers(['vein'], PAL[1], ANCHORS).over, faceLayers(['vein'], PAL[1], moved).over);
  assert.match(faceLayers(['vein'], PAL[1], moved).over, /translate\(40 30\)/);
  const furious = faceLayers(['shadow-eyes', 'vein'], PAL[5], ANCHORS).over;
  assert.equal((furious.match(/<g transform/g) ?? []).length, 4, 'temple vein + one in the air, each small + big');
});

test('anger vein grows by ONE stepped swap (small -> 1.25x big), big only under reduced motion', () => {
  const over = faceLayers(['vein'], PAL[1], ANCHORS).over;
  assert.match(over, /class="emo-v-s"[^]*scale\(13\)[^]*class="emo-v-b"[^]*scale\(16\.25\)/);
  assert.match(EMOTION_FX.anger(), /class="emo-v-s"[^]*class="emo-v-b"/);
  const css = readFileSync(new URL('./date-beta/art/emotion/emotion.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce\)\s*\{\s*\.emo-v-s \{ display: none/);
  const jsx = readFileSync(new URL('./date-beta/art/emotion/EmotionFx.jsx', import.meta.url), 'utf8');
  const ms = Number(jsx.match(/setTimeout\([^]*?, (\d+)\)/)[1]);
  assert.ok(ms >= 500, 'each step >= 500 ms (<= 2 Hz)');
});

test('face layers in nandaSVG: under sits after the face and before the fringe (bangs on top); over after the figure', () => {
  const svg = nandaSVG({ emote: 'hate', overlay: (P, A) => faceLayers(['shadow-eyes', 'vein'], P, A) });
  const face = svg.indexOf('translate(57 52)'), band = svg.indexOf('emo-se'), fringe = svg.indexOf('V0Z" fill'), vein = svg.indexOf('#ff1414');
  assert.ok(face < band && band < fringe && fringe < vein, `${face} < ${band} < ${fringe} < ${vein}`);
  assert.equal(nandaSVG({ emote: 'hearts' }).includes('emo-'), false, 'no layers = the old figure');
});

test('puff: a Nanda emote (ref 11 face) the engine accepts', () => {
  assert.ok(EMOTES.includes('puff'));
  assert.deepEqual(NANDA_EMOTES.puff, { pal: 1, face: 'puff', bubble: 'pout' });
  assert.match(nandaSVG({ emote: 'puff' }), /#e05a8a/, 'the squashed mouth');
});
