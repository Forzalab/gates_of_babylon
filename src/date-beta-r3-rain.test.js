// Scenes R3 G2 RAIN WALK + G3 HER STREET -> NIGHT (research/sprint-0930/scenes-r3/PLAN.md, G23-NOTES.md): the r3-rain
// pack gives each rain / street beat its own background (8 ids), the ids are registered, the traces exist and fit the
// 600 KB budget, the rain swaps its 2 static layers no faster than every 600 ms, escape-win's street is night + stamped.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { ART_NAMES } from './date-beta-art-names.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const base = read('./date-beta/scenes.json');
const manifest = read('./date-beta/assets.json');
const INDEX = src('./date-beta/art/r3-rain/index.js');
const IDS = [...INDEX.slice(INDEX.indexOf('export const R3_RAIN')).matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]);
// v2-curry 13 = its exit (was 5 until packs/curry.json put the street -> door -> table -> dish shots before it)
const BEATS = [['v2-rain', 1, 'rain-sidewalk'], ['v2-rain', 2, 'rain-alley'], ['v2-rain', 3, 'rain-eave'], ['v2-rain', 4, 'rain-ending'],
  ['v2-street', 2, 'street-bluehour'], ['v2-street', 5, 'her-building'], ['v2-curry', 13, 'curry-street'], ['escape-win', 6, 'escape-night']];
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];

test('r3-rain: 8 ids registered, spread into ART, pack runs right after variant-v2 / r3-station', () => {
  assert.deepEqual([...IDS].sort(), BEATS.map((b) => b[2]).sort());
  for (const id of IDS) assert.ok(ART_NAMES.includes(id), `${id} reaches the art-name list`);
  assert.match(src('./date-beta/art/index.js'), /\.\.\.R3_RAIN,/);
  const i = PLAY.indexOf('r3-rain');
  assert.ok(i > 0 && ['variant-v2', 'r3-station'].includes(PLAY[i - 1]), `r3-rain follows ${PLAY[i - 1]}`);
  for (const m of INDEX.matchAll(/from '\.\/([\w.]+)'/g)) assert.ok(existsSync(new URL(`./date-beta/art/r3-rain/${m[1]}`, import.meta.url)), m[1]);
});

test('r3-rain: every beat shows its own bg in normal play (no later pack overrides it), script loads', () => {
  const packs = PLAY.filter((n) => existsSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url))).map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) }));
  const data = applyPacks(base, packs); // the full play order: a later pack must not take these beats back
  // validate up to this pack (later packs bring interiors / shot ids this helper list does not parse)
  const S = loadScenes(applyPacks(base, packs.slice(0, PLAY.indexOf('r3-rain') + 1)), { manifest, art: [...ART_NAMES, ...ROMANCE, 'lock-game'] });
  for (const [scene, i, bg] of BEATS) {
    const b = data.scenes.find((s) => s.id === scene).beats[i];
    assert.equal(b.bg, bg, `${scene}[${i}]`);
    // R5: a close-up ON its own bg (the door 12 close-up) is still its own bg, only a different camera
    assert.ok([undefined, 'stamp'].includes(b.props?.shot) || (b.props.shot === 'closeup' && b.props.of === bg), `${scene}[${i}] frames its own bg (no borrowed shot)`);
    assert.ok(b.props?.of === undefined || b.props.of === bg, `${scene}[${i}] no borrowed 'of'`);
  }
  const esc = data.scenes.find((s) => s.id === 'escape-win').beats[6];
  assert.deepEqual([esc.props.shot, esc.props.place, esc.props.time], ['stamp', 'HER STREET', '8:40 PM'], 'escape street: night stamp');
  assert.ok(S, 'loads');
});

test('r3-rain: traces <= 600 KB; rain = 2 static layers swapped >= 600 ms (1 under reduced motion); no animation', () => {
  for (const id of IDS) {
    const f = new URL(`../public/date-beta/trace/${id}.svg`, import.meta.url);
    assert.ok(existsSync(f), `${id}.svg`);
    assert.ok(statSync(f).size <= 600_000, `${id}.svg ${statSync(f).size} B`);
  }
  const parts = src('./date-beta/art/r3-rain/parts.jsx');
  const m = /useStep\(2, (\d+), !rm\)/.exec(parts);
  assert.ok(m, 'RainLayers steps 2 poses, off under reduced motion');
  assert.match(parts, /\{!rm && <path/, 'reduced motion renders one layer');
  const TICK = +/export const TICK = (\d+)/.exec(src('./date-beta/art/util.js'))[1];
  assert.ok(TICK * Math.max(4, +m[1]) >= 600, `swap every ${TICK * m[1]} ms`);
  for (const m2 of INDEX.matchAll(/from '\.\/([\w]+)\.jsx'/g)) {
    assert.doesNotMatch(src(`./date-beta/art/r3-rain/${m2[1]}.jsx`), /<animate|@keyframes|animation:|transition:/, `${m2[1]}: no animation`);
  }
  assert.match(src('./date-beta/art/r3-rain/RainEave.jsx'), /AND<\/text>/, 'G2 logic gag: the AND-ON lantern');
  assert.match(src('./date-beta/art/r3-rain/HerBuilding.jsx'), />XNOR</, 'G3 logic gag: メゾン XNOR');
  assert.match(src('./date-beta/art/r3-rain/HerBuilding.jsx'), />12</, 'door 12');
});
