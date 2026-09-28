// Demo spine (DEMO PATH v1): walk the shipped scenes from START through the engine to each of the 4 endings,
// then check the ending card goes back to the title (never a black `done` dead end).
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, next, choose, beatAt, enabled } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const scenes = loadScenes(data, { manifest, art: ['splash', 'rooftop', 'train', 'naan', 'blackout'] });

// picks: choice labels in the order they come up. Returns the scene ids visited and the final card position.
function walk(picks, rm = false) {
  const queue = [...picks], seen = [];
  let p = start(scenes, { rm });
  for (let steps = 0; steps < 200; steps++) {
    assert.equal(p.done, false, `fell off the end after ${seen.join(' > ')}`);
    const id = scenes[p.s].id;
    if (seen.at(-1) !== id) seen.push(id);
    const beat = beatAt(scenes, p);
    if (!beat.choices) { p = next(scenes, p, rm); continue; }
    if (beat.choices.length === 1 && beat.choices[0].go === 'splash') return { seen, card: beat.text, p };
    const label = queue.shift();
    const i = label == null ? 0 : beat.choices.findIndex((c) => c.plain === label);
    assert.ok(i >= 0 && enabled(beat.choices[i], p.flags), `${id}: no enabled choice "${label}"`);
    p = choose(scenes, p, i, rm);
  }
  assert.fail('no ending within 200 steps');
}

const SHARED = ['splash', 'rooftop', 'train', 'naan', 'blackout', 'door'];
const PATHS = {
  STEEPED: { picks: [null, 'Just one cup.', 'Drink.'], via: ['cup', 'steeped'], card: 'STEEPED.' },
  'ESCAPE-win': { picks: [null, 'Just one cup.', 'Stand up.', '[win]'], via: ['cup', 'unknown', 'escape', 'escape-win'], card: 'ESCAPE.' },
  'ESCAPE-timeout': { picks: [null, 'Just one cup.', 'Stand up.', '[timeout]'], via: ['cup', 'unknown', 'escape', 'escape-timeout'], card: 'ESCAPE.' },
  'LEAVE (refuse)': { picks: [null, "It's late. Goodnight.", "FUCK YOU. I'm leaving."], via: ['leave', 'leave-fu'], card: 'LEAVE.' },
  'LEAVE (agree)': { picks: [null, "It's late. Goodnight.", 'uhmmm yeah ig'], via: ['leave', 'leave-yeah'], card: 'LEAVE.' },
};

for (const [name, { picks, via, card }] of Object.entries(PATHS)) {
  for (const rm of [false, true]) {
    test(`date-beta spine: ${name}${rm ? ' (reduced motion)' : ''} is reachable and returns to the title`, () => {
      const r = walk(picks, rm);
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
