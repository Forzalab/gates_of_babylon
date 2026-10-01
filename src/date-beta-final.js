// The shipped scene graph (normal-play pack order, same as main.jsx PLAY) for tests that audit the final applied data.
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
import v2 from './date-beta/packs/variant-v2.json' with { type: 'json' };
import sceneA from './date-beta/packs/scene-a.json' with { type: 'json' };
import love from './date-beta/packs/love.json' with { type: 'json' };

const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];
export const RAW = applyPacks(base, [story, meta, mech, lockgame, obbp, sequences, v2, sceneA, love]);
export const FINAL = loadScenes(RAW, { manifest, art: [...ART_NAMES, ...ROMANCE, 'lock-game'] });
