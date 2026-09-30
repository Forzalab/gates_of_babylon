// Test helper: the art ids = the keys of ART in src/date-beta/art/index.js, parsed from the source (the .jsx art can't
// load under node --test). Keeps the tests' loadScenes(data, { manifest, art }) in step with main.jsx's Object.keys(ART).
import { readFileSync } from 'node:fs';

export const ART_INDEX = readFileSync(new URL('./date-beta/art/index.js', import.meta.url), 'utf8');
export const ART_NAMES = [...ART_INDEX.slice(ART_INDEX.indexOf('export const ART')).matchAll(/'?([\w-]+)'?: [A-Z]\w*/g)].map((m) => m[1]);
// ...SCENE_A (art/scene-a/index.js, which spreads ...ROOFTOP from art/rooftop/index.js) adds its own ids.
const idsOf = (p, from) => { const s = readFileSync(new URL(p, import.meta.url), 'utf8'); return [...s.slice(s.indexOf(from)).matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]); };
if (ART_INDEX.includes('...SCENE_A')) ART_NAMES.push(...idsOf('./date-beta/art/rooftop/index.js', 'ROOFTOP'), ...idsOf('./date-beta/art/scene-a/index.js', 'export const SCENE_A'));
// ...R3_STATION (art/r3-station/index.js, scenes-r3 G1 station + train) adds its own ids.
if (ART_INDEX.includes('...R3_STATION')) ART_NAMES.push(...idsOf('./date-beta/art/r3-station/index.js', 'export const R3_STATION'));
// ...R3_RAIN (art/r3-rain/index.js, scenes-r3 G2 rain walk + G3 her street -> night) adds its own ids.
if (ART_INDEX.includes('...R3_RAIN')) ART_NAMES.push(...idsOf('./date-beta/art/r3-rain/index.js', 'export const R3_RAIN'));
// ...CURRY (art/curry/index.js, the curry rebuild: street choice + butter-chicken / katsu chains) adds its own ids.
if (ART_INDEX.includes('...CURRY')) ART_NAMES.push(...idsOf('./date-beta/art/curry/index.js', 'export const CURRY'));
// ...SHOP (art/shop/index.js, the v2-shop rebuild) adds its own ids, plus the HER LIST game id (game/index.js).
if (ART_INDEX.includes('...SHOP')) ART_NAMES.push(...idsOf('./date-beta/art/shop/index.js', 'export const SHOP'), 'shop-game');
