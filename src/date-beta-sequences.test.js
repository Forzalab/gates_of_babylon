import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPacks } from './date-beta/packs/index.js';
import { loadScenes } from './date-beta/engine.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';
import story from './date-beta/packs/story.json' with { type: 'json' };
import meta from './date-beta/packs/meta.json' with { type: 'json' };
import mech from './date-beta/packs/mech.json' with { type: 'json' };
import lockgame from './date-beta/packs/lockgame.json' with { type: 'json' };
import obbp from './date-beta/packs/obbp.json' with { type: 'json' };
import sequences from './date-beta/packs/sequences.json' with { type: 'json' };

const ROMANCE_NAMES = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];

test('sequences pack loads on top of the play packs', () => {
  const data = applyPacks(base, [story, meta, mech, lockgame, obbp, sequences]);
  const s = loadScenes(data, { manifest, art: [...ART_NAMES, ...ROMANCE_NAMES, 'lock-game'] });
  assert.ok(s);
  const hungry = data.scenes.find((x) => x.id === 'hungry');
  assert.deepEqual(hungry.beats[0].choices.map((c) => c.go), ['seq-butter', 'seq-katsu', 'seq-katsu']);
});
