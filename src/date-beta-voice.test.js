// Voice lookup: manifest scene+beat -> mp3, and the player's scene + shown line -> the same mp3.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildIndex, fileForBeat, fileForLine, norm } from './date-beta/voice/voice.js';
import { applyPacks } from './date-beta/packs/index.js';
import { loadScenes } from './date-beta/engine.js';

const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const manifest = read('./date-beta/voice/manifest.json');
const full = read('../research/sprint-0930/voice/audio-manifest.json');
const idx = buildIndex(manifest);

test('slim manifest matches the research manifest', () => {
  assert.equal(manifest.length, full.length);
  full.forEach((e, i) => assert.equal(`public/${manifest[i].file}`, e.file));
});

test('scene + beat -> file', () => {
  assert.equal(fileForBeat(idx, 'rooftop', '1'), 'date-beta/voice/01-rooftop/001_1.mp3');
  assert.equal(fileForBeat(idx, 'rooftop', '1 R+'), 'date-beta/voice/01-rooftop/002_1-r.mp3');
  assert.equal(fileForBeat(idx, 'cup', '3 R−'), 'date-beta/voice/10-cup/055_3-r.mp3');
  assert.equal(fileForBeat(idx, 'rooftop', '99'), null);
  assert.equal(fileForBeat(idx, 'nope', '1'), null);
});

test('every manifest file exists on disk', () => {
  for (const e of manifest) assert.ok(fs.existsSync(new URL(`../public/${e.file}`, import.meta.url)), e.file);
});

test('scene + shown line -> file (tags and pauses ignored, missing = null)', () => {
  assert.equal(fileForLine(idx, 'rooftop', "I made two. One's for you. Don't look at me like that."), 'date-beta/voice/01-rooftop/001_1.mp3');
  assert.equal(fileForLine(idx, 'rooftop', 'A line nobody recorded.'), null);
  assert.equal(fileForLine(idx, 'rooftop', ''), null);
  assert.equal(fileForLine(idx, 'rooftop', undefined), null);
  assert.equal(norm('[whispers] Hi… there!'), 'hithere');
});

test('recorded lines are reachable: most manifest takes resolve from the live V2 pack text', () => {
  const R = (p) => read(`./date-beta/${p}`);
  const packs = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences', 'variant-v2', 'r3-station', 'r3-rain', 'scene-a', 'interiors', 'curry', 'shop', 'town', 'love', 'ux-six', 'r5', 'r6'].map((n) => ({ name: n, ...R(`packs/${n}.json`) }));
  const scenes = loadScenes(applyPacks(R('scenes.json'), packs));
  const seen = new Set();
  for (const s of scenes) {
    for (const b of s.beats) {
      const lines = [b.line?.plain, ...(b.choices ?? []).map((c) => c.react?.plain ?? c.react)];
      for (const v of Object.values(b.vary ?? {})) for (const e of Object.values(v)) if (e.text) lines.push(e.text);
      for (const t of lines) { const f = typeof t === 'string' ? fileForLine(idx, s.id, t) : null; if (f) seen.add(f); }
    }
  }
  assert.ok(seen.size >= manifest.length * 0.8, `only ${seen.size}/${manifest.length} takes reachable`);
});
