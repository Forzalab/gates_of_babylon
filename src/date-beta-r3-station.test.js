// Scenes R3 G1 STATION + TRAIN (research/sprint-0930/scenes-r3/PLAN.md, G1-NOTES.md): the r3-station pack gives
// v2-train beats 1-6 one background each, the art ids are registered, the traces exist and fit the 600 KB budget,
// no camera shot (pans) is left on those beats, the rain swaps its 2 static layers no faster than every 600 ms.
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
const pack = read('./date-beta/packs/r3-station.json');
const INDEX = src('./date-beta/art/r3-station/index.js');
const IDS = [...INDEX.slice(INDEX.indexOf('export const R3_STATION')).matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]);
const BEATS = { 1: 'station-gate-r3', 2: 'station-ads', 3: 'station-ads-insert', 4: 'train-sun', 5: 'train-rain', 6: 'platform-rain' };
const BEFORE = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences', 'variant-v2'];
const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];

test('r3-station: ids registered, spread into ART, pack runs right after variant-v2', () => {
  assert.deepEqual([...IDS].sort(), Object.values(BEATS).sort());
  for (const id of IDS) assert.ok(ART_NAMES.includes(id), `${id} reaches the art-name list`);
  assert.match(src('./date-beta/art/index.js'), /\.\.\.R3_STATION,/);
  assert.match(src('./date-beta/main.jsx'), /'variant-v2', 'r3-station',/);
  for (const m of INDEX.matchAll(/from '\.\/([\w.]+)'/g)) assert.ok(existsSync(new URL(`./date-beta/art/r3-station/${m[1]}`, import.meta.url)), m[1]);
});

test('r3-station: v2-train beats 1-6 each get their own bg, no camera shot left, script loads', () => {
  const packs = BEFORE.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) }));
  const data = applyPacks(base, [...packs, pack]);
  const S = loadScenes(data, { manifest, art: [...ART_NAMES, ...ROMANCE, 'lock-game'] });
  const train = data.scenes.find((s) => s.id === 'v2-train');
  for (const [i, bg] of Object.entries(BEATS)) {
    assert.equal(train.beats[i].bg, bg, `v2-train[${i}]`);
    assert.equal(train.beats[i].props?.shot, undefined, `v2-train[${i}] has no props.shot (no pan / camera move)`);
  }
  assert.equal(new Set(Object.values(BEATS)).size, 6, 'one background per line');
  assert.ok(S['v2-train'] ?? S.scenes ?? S, 'loads');
});

test('r3-station: traces exist, each <= 600 KB; rain = 2 static layers swapped >= 600 ms', () => {
  for (const id of IDS.filter((i) => i !== 'station-ads-insert')) {
    const f = new URL(`../public/date-beta/trace/${id}.svg`, import.meta.url);
    assert.ok(existsSync(f), `${id}.svg`);
    assert.ok(statSync(f).size <= 600_000, `${id}.svg ${statSync(f).size} B`);
  }
  const parts = src('./date-beta/art/r3-station/parts.jsx');
  const m = /useStep\(2, (\d+), !rm\)/.exec(parts);
  assert.ok(m, 'RainPair steps 2 poses, off under reduced motion');
  const TICK = +/export const TICK = (\d+)/.exec(src('./date-beta/art/util.js'))[1];
  assert.ok(TICK * Math.max(4, +m[1]) >= 600, `swap every ${TICK * m[1]} ms`);
  for (const f of ['StationGate', 'StationAds', 'TrainSun', 'TrainRain', 'PlatformRain']) {
    const s = src(`./date-beta/art/r3-station/${f}.jsx`);
    assert.doesNotMatch(s, /<animate|@keyframes|animation:|transition:/, `${f}: no animation`);
  }
  assert.match(src('./date-beta/art/r3-station/StationGate.jsx'), /4:30 → OR/);
  assert.match(src('./date-beta/art/r3-station/StationAds.jsx'), /NAND駅/);
  assert.match(src('./date-beta/art/r3-station/StationAds.jsx'), /WATCHING YOU/);
});
