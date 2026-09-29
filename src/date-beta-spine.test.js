// Demo spine (DEMO PATH v1): walk the shipped scenes from START through the engine to each of the 4 endings,
// then check the ending card goes back to the title (never a black `done` dead end).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, next, skip, choose, beatAt, beatView, enabled } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const scenes = loadScenes(data, { manifest, art: ['splash', 'rooftop', 'train', 'naan', 'blackout'] });

// picks: choice labels in the order they come up (the rooftop bento pick is taken from `bento`, not the queue).
// Returns the scene ids visited, every line shown (after vary), and the final card position.
function walk(picks, rm = false, bento = 'umeboshi') {
  const queue = [...picks], seen = [], lines = [];
  let p = start(scenes, { rm });
  for (let steps = 0; steps < 200; steps++) {
    assert.equal(p.done, false, `fell off the end after ${seen.join(' > ')}`);
    const id = scenes[p.s].id;
    if (seen.at(-1) !== id) seen.push(id);
    const beat = beatView(beatAt(scenes, p), p.flags);
    if (beat.text) lines.push(`${id}: ${beat.line.plain}`);
    if (!beat.choices) { p = next(scenes, p, rm); continue; }
    if (beat.choices.length === 1 && beat.choices[0].go === 'splash') return { seen, lines, card: beat.text, p };
    const label = beat.choices.some((c) => c.set?.bento) ? `Take the ${bento}` : queue.shift();
    const i = label == null ? 0 : beat.choices.findIndex((c) => c.plain === label);
    assert.ok(i >= 0 && enabled(beat.choices[i], p.flags), `${id}: no enabled choice "${label}"`);
    p = choose(scenes, p, i, rm);
  }
  assert.fail('no ending within 200 steps');
}

const SHARED = ['splash', 'rooftop', 'train', 'naan', 'blackout', 'door'];
const PATHS = {
  STEEPED: { picks: [null, 'Just one cup', 'Drink'], via: ['cup', 'steeped'], card: 'STEEPED.' },
  'ESCAPE-win': { picks: [null, 'Just one cup', 'Stand up', '[win]'], via: ['cup', 'unknown', 'escape', 'escape-win'], card: 'ESCAPE.' },
  'ESCAPE-timeout': { picks: [null, 'Just one cup', 'Stand up', '[timeout]'], via: ['cup', 'unknown', 'escape', 'escape-timeout'], card: 'ESCAPE?' },
  'LEAVE (refuse)': { picks: [null, "It's late. Goodnight", "FUCK YOU. I'm leaving"], via: ['leave', 'leave-fu'], card: 'LEAVE.' },
  'LEAVE (agree)': { picks: [null, "It's late. Goodnight", 'uhmmm yeah ig'], via: ['leave', 'leave-yeah'], card: 'LEAVE.' },
};

for (const [name, { picks, via, card }] of Object.entries(PATHS)) {
  for (const [rm, bento] of [[false, 'umeboshi'], [true, 'umeboshi'], [false, 'tamagoyaki'], [true, 'tamagoyaki']]) {
    test(`date-beta spine: ${name} (${bento}${rm ? ', reduced motion' : ''}) is reachable and returns to the title`, () => {
      const r = walk(picks, rm, bento);
      assert.equal(r.p.flags.bento, bento);
      assert.deepEqual(r.seen, [...SHARED, ...via]);
      assert.equal(r.card, card);
      const back = choose(scenes, r.p, 0, rm);
      assert.equal(back.done, false);
      assert.equal(scenes[back.s].id, 'splash');
    });
  }
}

test('date-beta spine: the ??? beat is one marked placeholder, and it falls through to the escape stub', () => {
  const s = scenes.find((x) => x.id === 'unknown');
  assert.equal(s.beats.length, 1);
  assert.equal(s.beats[0].text, '[??? — RP pending]');
  const p = next(scenes, start(scenes, { at: 'unknown' }));
  assert.equal(scenes[p.s].id, 'escape');
});

test('date-beta spine: the DOOR timer defaults to going in (pink)', () => {
  const b = scenes.find((x) => x.id === 'door').beats.find((x) => x.choices);
  assert.equal(b.timer, 5);
  assert.equal(b.choices.find((c) => c.default).go, 'cup');
});

// Echo rule: the rooftop pick changes what every ending says. Same path, other bento = other lines.
const ending = (name, bento) => walk(PATHS[name].picks, false, bento).lines.filter((l) => l.startsWith(PATHS[name].via.at(-1)));
for (const [name, ume, egg] of [
  ['ESCAPE-timeout', ['One sour hour…', '…then every hour is ours.'], ['One sweet bite…', "…then sleep. You're mine to keep."]],
  ['ESCAPE-win', ['You picked sour.', 'Now every hour is ours.'], ['Home is warm, and sweet.', "Sleep now. You're mine to keep."]],
  ['STEEPED', ['Bitter cup, sour hour. Every hour is ours.'], ["Warm cup, sweet sleep. You're mine to keep."]],
]) {
  test(`date-beta echo: ${name} says the umeboshi lines on umeboshi and the tamagoyaki lines on tamagoyaki`, () => {
    const u = ending(name, 'umeboshi').join('\n'), t = ending(name, 'tamagoyaki').join('\n');
    assert.notEqual(u, t);
    for (const l of ume) { assert.ok(u.includes(l), `umeboshi missing "${l}"`); assert.ok(!t.includes(l), `tamagoyaki shows "${l}"`); }
    for (const l of egg) { assert.ok(t.includes(l), `tamagoyaki missing "${l}"`); assert.ok(!u.includes(l), `umeboshi shows "${l}"`); }
  });
}

test('date-beta echo: no line on a tamagoyaki run names umeboshi or sour (and vice versa), old basement jars aside', () => {
  const all = (bento) => Object.values(PATHS).flatMap(({ picks }) => walk(picks, false, bento).lines).join('\n');
  assert.doesNotMatch(all('tamagoyaki'), /umeboshi|\bsour\b|すっぱい/i);
  assert.doesNotMatch(all('umeboshi'), /tamagoyaki|\bsweet\b|甘い/i);
});

test('date-beta echo: skipping the rooftop (Esc) lands on bento = umeboshi, and the train ad follows it', () => {
  const p = skip(scenes, start(scenes, { at: 'rooftop' }));
  assert.equal(scenes[p.s].id, 'train');
  assert.equal(p.flags.bento, 'umeboshi');
  assert.equal(beatView(beatAt(scenes, p), p.flags).props.ad, 'umeboshi');
});

test('date-beta echo: the rooftop pick is a real two-way choice with no timer and no jump', () => {
  const b = scenes.find((x) => x.id === 'rooftop').beats.find((x) => x.choices?.some((c) => c.set?.bento));
  assert.equal(b.timer, null);
  assert.deepEqual(b.choices.map((c) => [c.plain, c.side, c.set.bento, c.go]),
    [['Take the tamagoyaki', 'pink', 'tamagoyaki', null], ['Take the umeboshi', 'purple', 'umeboshi', null]]);
});

test('date-beta echo: basement old jars stay umeboshi; only the newest jar follows the pick', () => {
  const esc = scenes.find((x) => x.id === 'escape');
  const old = esc.beats.find((b) => b.props.jars);
  const newest = esc.beats.find((b) => b.vary?.bento.umeboshi.props?.jar);
  for (const bento of ['umeboshi', 'tamagoyaki']) {
    assert.equal(beatView(old, { bento }).props.jars, 'umeboshi');
    assert.equal(beatView(newest, { bento }).props.jar, bento);
    assert.match(beatView(newest, { bento }).text, new RegExp(bento));
  }
});

test('date-beta echo: the timeout reuses the kitchen with four cups', () => {
  const b = scenes.find((x) => x.id === 'escape-timeout').beats.find((x) => x.props.cups);
  assert.equal(b.bg, 'BG-D2');
  assert.equal(b.props.cups, 4);
});
