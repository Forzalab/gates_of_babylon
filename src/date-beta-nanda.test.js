// Nanda V1b sprite (art/nanda.js): pure SVG, no raster refs, stage follows dread, and she is on screen for every NANDA line.
import test from 'node:test';
import assert from 'node:assert/strict';
import { nandaSVG, stageFor, PAL } from './date-beta/art/nanda.js';
import { loadScenes, beatView } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';

test('nanda: SVG only (no <image>, no url() to files, no raster), ids unique per call', () => {
  const a = nandaSVG({ stage: 1 }), b = nandaSVG({ stage: 1 });
  for (const s of [a, b, nandaSVG({ stage: 3 }), nandaSVG({ stage: 4 })]) {
    assert.doesNotMatch(s, /<image|\.png|\.jpe?g|\.webp|href=/i);
  }
  const ids = (s) => [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids(a).filter((x) => ids(b).includes(x)).length, 0);
});

test('nanda: V1b keeps the real NAND orientation (bubble tie at the output, right of the D)', () => {
  const s = nandaSVG({ stage: 1 });
  assert.match(s, /<circle cx="112" cy="54" r="12"/); // NOT bubble at the true output = side-pony tie
  assert.match(s, /M12 12H58A42 42 0 0 1 58 96H12/); // flat back left, curved front right
});

test('nanda: stage follows scare (0 sweet, 1 clingy, 2 possessive); possessive thinks OR on the dark panel', () => {
  assert.deepEqual([0, 1, 2].map(stageFor), [1, 2, 3]);
  assert.match(nandaSVG({ stage: 3 }), />OR</);
  assert.equal(PAL[1].bow, '#ff5fa2');
});

test('nanda: she speaks in the rooftop, door, cup, steeped, escape-win, escape-timeout and leave scenes', () => {
  const S = loadScenes(data, { manifest, art: ART_NAMES });
  const who = new Set();
  for (const sc of S) for (const b of sc.beats) for (const v of ['umeboshi', 'tamagoyaki']) {
    if (beatView(b, { bento: v }).line.who === 'NANDA') who.add(sc.id);
  }
  for (const id of ['rooftop', 'door', 'cup', 'steeped', 'escape-win', 'escape-timeout', 'leave']) assert.ok(who.has(id), id);
});
