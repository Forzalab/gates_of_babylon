// TOWN walk (research/sprint-0930/town/NOTES.md): v2-shop and v2-library both walk into v2-town (AKIBA 2:45 PM), which
// walks into the curry street choice (v2-curry); 3 traced shots registered, a face + a plant on every Nanda beat.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { ART_NAMES } from './date-beta-art-names.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const EXTRA = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night', 'cellar', 'park', 'apartment-trace', 'sitting-room', 'bedroom', 'genkan-in', 'genkan-v2', 'lock-game'];
const data = applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
const sc = (id) => data.scenes.find((s) => s.id === id);
const gos = (id) => sc(id).beats.flatMap((b) => (b.choices ?? []).flatMap((c) => [c.go].flat())).filter(Boolean).map((g) => g.to ?? g);
const SHOTS = ['town-street', 'town-crossing', 'town-board'];

test('town: in PLAY after shop, before love; the scenes load with the town art', () => {
  assert.ok(PLAY.indexOf('town') > PLAY.indexOf('shop') && PLAY.indexOf('town') < PLAY.indexOf('love'));
  assert.ok(loadScenes(data, { manifest: read('./date-beta/assets.json'), art: [...ART_NAMES, ...EXTRA, 'shop-game'] }));
});

test('town routing: shop -> town, library -> town, town -> the curry street choice; nothing skips the walk', () => {
  assert.deepEqual(gos('v2-shop').filter((g) => /curry|town/.test(g)), ['v2-town']);
  assert.deepEqual(gos('v2-library').filter((g) => /curry|town/.test(g)), ['v2-town']);
  assert.deepEqual(gos('v2-town'), ['v2-curry']);
  assert.equal(sc('v2-curry').beats[1].bg, 'curry-choice', 'v2-curry opens on the street choice');
  const ids = data.scenes.map((s) => s.id);
  assert.equal(ids.indexOf('v2-town'), ids.indexOf('v2-library') + 1, 'sits between the errands and curry');
  // only the walk leads into curry now
  const into = data.scenes.filter((s) => gos(s.id).includes('v2-curry')).map((s) => s.id);
  assert.deepEqual(into, ['v2-town']);
});

test('town beats: 3-5, the AKIBA 2:45 PM stamp, 3 shots, a different face per Nanda beat, all planted', () => {
  const beats = sc('v2-town').beats;
  assert.ok(beats.length >= 3 && beats.length <= 5);
  assert.deepEqual(beats[0].props && [beats[0].props.shot, beats[0].props.place, beats[0].props.time], ['stamp', 'AKIBA', '2:45 PM']);
  assert.deepEqual([...new Set(beats.map((b) => b.bg))], SHOTS);
  const her = beats.filter((b) => b.speaker === 'NANDA');
  const faces = her.map((b) => b.props.cut.face);
  assert.equal(new Set(faces).size, her.length, 'one face per beat');
  for (const b of her) { assert.equal(b.props.cut.frame, 'medium'); assert.ok(b.props.cut.plant > 0, 'planted, not floating'); }
  for (const b of her) assert.ok(b.text.split(/[.!?]\s/).length <= 4 && b.text.length <= 60, b.text);
  assert.match(her.at(-1).text, /cute/);
});

test('town art: 3 ids registered, each trace <= 700 KB, the pun signs are in the art', () => {
  assert.match(src('./date-beta/art/index.js'), /\.\.\.TOWN,/);
  for (const id of SHOTS) {
    assert.ok(ART_NAMES.includes(id), id);
    const f = new URL(`../public/date-beta/trace/town/${id.replace(/^town-/, '')}.svg`, import.meta.url);
    assert.ok(existsSync(f), `${id} trace`);
    assert.ok(statSync(f).size <= 700_000, `${id} trace size`);
  }
  const jsx = src('./date-beta/art/town/Town.jsx');
  for (const pun of ['メイド・イン・NAND', 'NANDでも推せる！', 'ANDロイド']) assert.ok(jsx.includes(pun), pun);
});

test('town pure: live traces are the pure vtrace, the hybrids stay exported, cels + BOOK + town shadows', () => {
  for (const k of ['street', 'crossing', 'board']) {
    assert.ok(ART_NAMES.includes(`town-${k}-hybrid`), `${k} hybrid id`);
    assert.ok(existsSync(new URL(`../public/date-beta/trace/town/${k}-hybrid.svg`, import.meta.url)), `${k} hybrid trace`);
  }
  assert.ok(ART_NAMES.includes('town-street-book'));
  assert.ok(existsSync(new URL('../public/date-beta/trace/town/gate-chan.svg', import.meta.url)));
  const jsx = src('./date-beta/art/town/Town.jsx');
  assert.ok(jsx.includes('オア電') && jsx.includes('ゲートちゃん'));
  const css = src('./date-beta/beta.css');
  assert.match(css, /\.stage\[data-bg\^="town-"\] \.db-plant \{ z-index: auto;[^}]*transform: none;/);
});

