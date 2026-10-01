// CURRY rebuild (research/sprint-0930/curry/SHOTLIST.md): the choice is on the street, each pick walks its own chain
// street -> door -> inside (stamp 3:00) -> table -> dish -> eating -> exit (curry-street 3:40); ids registered, traces fit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { ART_NAMES } from './date-beta-art-names.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const INDEX = src('./date-beta/art/curry/index.js');
const IDS = [...INDEX.slice(INDEX.indexOf('export const CURRY')).matchAll(/'([\w-]+)': [A-Z]\w*/g)].map((m) => m[1]);
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const EXTRA = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night', 'cellar', 'park', 'apartment-trace', 'sitting-room', 'bedroom', 'genkan-in', 'genkan-v2', 'lock-game'];

test('curry: 24 art ids registered, each with a trace under 600 KB', () => {
  assert.equal(IDS.length, 24);
  assert.match(src('./date-beta/art/index.js'), /\.\.\.CURRY,/);
  for (const id of IDS) {
    assert.ok(ART_NAMES.includes(id), id);
    const f = new URL(`../public/date-beta/trace/curry/${id.replace(/^curry-/, '')}.svg`, import.meta.url);
    assert.ok(existsSync(f), `${id} trace`);
    assert.ok(statSync(f).size <= 600_000, `${id} trace size`);
  }
});

test('curry: in the play list before love; the pick is on the street; the three paths are coherent chains', () => {
  assert.ok(PLAY.indexOf('curry') > PLAY.indexOf('r3-rain') && PLAY.indexOf('curry') < PLAY.indexOf('love'));
  const packs = PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) }));
  const data = applyPacks(read('./date-beta/scenes.json'), packs);
  assert.ok(loadScenes(data, { manifest: read('./date-beta/assets.json'), art: [...ART_NAMES, ...EXTRA] }));
  const sc = (id) => data.scenes.find((s) => s.id === id);
  const bgs = (id) => sc(id).beats.map((b) => b.bg);
  const pick = sc('v2-curry').beats[1];
  assert.equal(pick.bg, 'curry-choice');
  assert.equal(sc('v2-curry').beats[0].props.time, '2:55 PM');
  assert.deepEqual(pick.choices.map((c) => c.go), [undefined, 'v2-curry-katsu', 'v2-curry-alone']);
  assert.deepEqual(bgs('v2-curry'), ['curry-choice', 'curry-choice', 'curry-butter-door', 'curry-butter-int', 'curry-butter-table', 'curry-thali',
    'curry-naan-lift', 'curry-sauce', 'curry-naan-dip', 'curry-naan-feed', 'curry-butter-bite', 'curry-lassi', 'curry-napkin', 'curry-street']);
  assert.deepEqual(bgs('v2-curry-katsu'), ['curry-katsu-door', 'curry-katsu-int', 'curry-katsu-counter', 'curry-katsu-dish', 'curry-katsu-cut', 'curry-katsu-pour',
    'curry-katsu-close', 'curry-katsu-feed', 'curry-katsu-bite', 'curry-katsu-water', 'curry-katsu-napkin', 'curry-street']);
  // M3 alone: "She eats alone" is shown at the counter with her katsu plate (the empty TV room showed no food)
  assert.deepEqual(bgs('v2-curry-alone'), ['curry-katsu-door', 'curry-katsu-counter', 'curry-napkin-fold', 'curry-street']);
  // katsu = butter, beat for beat (from the door on); the napkin is SHOWN on both paths, never told over the street
  assert.equal(sc('v2-curry').beats.length - 2, sc('v2-curry-katsu').beats.length);
  for (const id of ['v2-curry', 'v2-curry-katsu']) assert.match(sc(id).beats.at(-2).bg, /napkin/, id);
  // the feed + bite beats are full-frame art (no sprite frame for the box to clip)
  for (const [id, i] of [['v2-curry', 9], ['v2-curry', 10], ['v2-curry-katsu', 7], ['v2-curry-katsu', 8]]) assert.equal(sc(id).beats[i].props.cut.frame, 'off', `${id} ${i}`);
  for (const id of ['v2-curry', 'v2-curry-katsu', 'v2-curry-alone']) assert.equal(sc(id).beats.at(-1).choices[0].go, 'v2-train', id);
  // no beat borrows another scene's art (the old 'closeup of cafe' bug)
  for (const id of ['v2-curry', 'v2-curry-katsu', 'v2-curry-alone']) for (const b of sc(id).beats) assert.equal(b.props?.of, undefined);
});
