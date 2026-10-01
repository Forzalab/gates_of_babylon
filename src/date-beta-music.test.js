import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { musicFor, MUSIC_GAIN } from './date-beta/assets.js';
import manifest from './date-beta/assets.json' with { type: 'json' };
import data from './date-beta/scenes.json' with { type: 'json' };

test('music: sweet by default, dark from the cup on, null keeps the current track', () => {
  assert.equal(musicFor(manifest, 'rooftop'), 'bgm-sweet');
  assert.equal(musicFor(manifest, 'v2-curry'), 'bgm-sweet');
  for (const s of ['cup', 'steeped', 'unknown', 'escape', 'leave-fu']) assert.equal(musicFor(manifest, s), 'bgm-dark', s);
  assert.equal(musicFor(manifest, null), null);
  assert.equal(musicFor({}, 'rooftop'), null);
});

test('music: both tracks are music assets with a file, every dark scene exists, the bed stays subtle', () => {
  for (const id of [manifest.music.default, manifest.music.dark]) {
    assert.equal(manifest.assets[id]?.kind, 'music', id);
    assert.ok(existsSync(new URL(`../public/${manifest.assets[id].path}`, import.meta.url)), id);
  }
  const ids = new Set(data.scenes.map((s) => s.id));
  for (const s of manifest.music.darkScenes) assert.ok(ids.has(s), s);
  assert.ok(MUSIC_GAIN > 0 && MUSIC_GAIN <= 0.5);
});
