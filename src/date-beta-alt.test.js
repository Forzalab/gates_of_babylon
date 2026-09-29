// Alt's night walk (platform -> underpass -> apartment, the stairs beat in door, the genkan-in insert), merged into
// main's spine: checked against the shipped scenes.json with main's loadScenes(data, { manifest, art }) contract.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadScenes, start, next, choose, beatAt } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_INDEX as INDEX, ART_NAMES } from './date-beta-art-names.js';

const WALK = ['platform', 'underpass', 'apartment']; // right after the blackout
const ALT_ART = ['platform', 'underpass', 'apartment', 'stairs', 'genkan-in'];
const scenes = loadScenes(data, { manifest, art: ART_NAMES });
const byId = Object.fromEntries(scenes.map((s) => [s.id, s]));
const lines = (id) => byId[id].beats.map((b) => b.text).filter(Boolean);
const ids = scenes.map((s) => s.id);

test('date-beta alt: the night walk follows the blackout, then door -> genkan-in -> cup', () => {
  const b = ids.indexOf('blackout');
  assert.deepEqual(ids.slice(b + 1, b + 5), [...WALK, 'door']);
  assert.equal(ids[ids.indexOf('genkan-in') + 1], 'cup', 'genkan-in falls through to cup (file order)');
  const pink = byId.door.beats.at(-1).choices.find((c) => c.side === 'pink');
  assert.equal(pink.go, 'genkan-in');
});

test('date-beta alt: every alt art id is registered in art/index.js and its file exists', () => {
  for (const id of ALT_ART) {
    const m = new RegExp(`['"]?${id}['"]?: (\\w+)`).exec(INDEX);
    assert.ok(m, `${id} not in ART`);
    const file = new RegExp(`import ${m[1]} from '\\./(\\w+\\.jsx)'`).exec(INDEX)?.[1];
    assert.ok(file && existsSync(new URL(`./date-beta/art/${file}`, import.meta.url)), `${id}: missing art file`);
  }
  assert.equal(byId.platform.beats[0].bg, 'platform');
  assert.equal(byId['genkan-in'].beats[0].bg, 'genkan-in');
  assert.equal(byId.door.beats[0].bg, 'stairs', 'door opens on the stairs beat');
  assert.equal(byId.door.beats[1].bg, 'BG-D1', 'then main\'s Door');
});

test('date-beta alt: the night platform is the naan station (NaanPlatform v3, night)', () => {
  const src = readFileSync(new URL('./date-beta/art/Platform.jsx', import.meta.url), 'utf8');
  assert.match(src, /import \{ NaanPlatform \} from '\.\/NaanPlatform\.jsx'/);
  assert.match(src, /<NaanPlatform variant="v3" time="night"/);
  assert.equal(byId.naan.beats[0].bg, 'naan', 'the naan scene keeps its own wiring (dusk)');
});

test('date-beta alt: the spec lines are there, word for word', () => {
  assert.ok(lines('apartment').includes("NANDA: That's mine. I left the light on for you."));
  assert.ok(lines('underpass').includes("NANDA: Don't read the ads. Read me."));
  assert.ok(lines('platform').some((t) => t.includes('{OR}')), 'the platform names the OR (as the explicit token)');
});

test('date-beta alt: every OR in alt art signage is the explicit {OR} token', () => {
  for (const f of ['Platform', 'Underpass', 'ApartmentExt', 'Stairs', 'GenkanArrival']) {
    const src = readFileSync(new URL(`./date-beta/art/${f}.jsx`, import.meta.url), 'utf8');
    for (const [, t] of src.matchAll(/<OrSpans text="([^"]*)"/g)) assert.match(t, /\{OR\}/, `${f}: "${t}" needs {OR}`);
    assert.doesNotMatch(src, /\bor-svg\b/, `${f}: use db-or-svg`);
  }
});

test('date-beta alt: the OR beats carry the breath cue', () => {
  for (const id of ['platform']) {
    const b = byId[id].beats.find((x) => x.text?.includes('{OR}'));
    assert.equal(b.sfx, 'breath', `${id}: OR without her breath`);
  }
});

test('date-beta alt: the train leave and the genkan insert are motion beats with a hard-cut RM alt', () => {
  const leave = byId.platform.beats.find((b) => b.props.train === 'gone');
  assert.ok(leave?.motion);
  assert.equal(leave.rmAlt, 'hard-cut');
  const ins = byId['genkan-in'].beats.find((b) => b.props.insert);
  assert.ok(ins?.motion);
  assert.equal(ins.rmAlt, 'hard-cut');
  assert.equal(byId['genkan-in'].beats.at(-1).props.insert, true, 'the shrine beat stays on the insert crop');
});

test('date-beta alt: clicking from the platform walks platform -> underpass -> apartment -> door -> genkan-in -> cup, RM included', () => {
  for (const rm of [false, true]) {
    let pos = start(scenes, { rm, at: 'platform' });
    const seen = [];
    for (let i = 0; i < 200 && !pos.done && scenes[pos.s].id !== 'cup'; i++) {
      const id = scenes[pos.s].id;
      if (seen.at(-1) !== id) seen.push(id);
      const beat = beatAt(scenes, pos);
      pos = beat.choices ? choose(scenes, pos, 0, rm) : next(scenes, pos, rm);
    }
    assert.deepEqual(seen, [...WALK, 'door', 'genkan-in']);
    assert.equal(scenes[pos.s].id, 'cup');
  }
});
