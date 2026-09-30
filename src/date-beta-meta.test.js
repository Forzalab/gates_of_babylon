import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, beatView, beatAt } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { fill, clock, daypart, runBucket, setCrowd } from './date-beta/meta.js';

const json = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url)));
const base = json('./date-beta/scenes.json');
const meta = json('./date-beta/packs/meta.json');
const crowd = json('./date-beta/packs/crowd.json');

test('meta pack loads on top of scenes.json with tokens allowed', () => {
  const s = loadScenes(applyPacks(base, [{ name: 'meta', ...meta }]));
  assert.ok(s.find((x) => x.id === 'meta-loop'));
});

test('clock, daypart, run bucket', () => {
  assert.equal(clock(new Date(2026, 8, 30, 14, 41)), '2:41 PM');
  assert.equal(clock(new Date(2026, 8, 30, 0, 5)), '12:05 AM');
  assert.equal(daypart(new Date(2026, 8, 30, 9)), 'morning');
  assert.equal(daypart(new Date(2026, 8, 30, 14)), 'afternoon');
  assert.equal(daypart(new Date(2026, 8, 30, 19)), 'evening');
  assert.equal(daypart(new Date(2026, 8, 30, 23)), 'night');
  assert.deepEqual([1, 2, 3, 9].map(runBucket), ['1', '2', '3', '3']);
});

test('fill replaces every token, leaves other text', () => {
  setCrowd(crowd);
  const now = new Date(2026, 8, 30, 14, 41);
  assert.equal(fill('{CLOTHES} {CROWD.4} {RUN} {TIME} {DAYPART} {OR}', { now, n: 3 }),
    `${crowd.CLOTHES} ${crowd.CROWD[3]} 3 2:41 PM afternoon {OR}`);
});

test('loop lines differ per run bucket', () => {
  const s = loadScenes(applyPacks(base, [{ name: 'meta', ...meta }]));
  const i = s.findIndex((x) => x.id === 'meta-loop');
  const texts = ['1', '2', '3'].map((run) => beatView(beatAt(s, { s: i, b: 0 }), { run }).text);
  assert.equal(new Set(texts).size, 3);
});
