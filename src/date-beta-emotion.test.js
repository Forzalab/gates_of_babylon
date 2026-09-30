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
