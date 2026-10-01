// End cards (sprint 0930 UX fix pack): real endings keep their card; the fail card is only a real loss; its line varies.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, startAt, beatAt, ending } from './date-beta/engine.js';
import { REAL_ENDINGS, FAIL_LINES, cardFor, failLine, failPool, bandOf } from './date-beta/endcard.js';
import { fill } from './date-beta/meta.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';

const S = loadScenes(data, { manifest, art: ART_NAMES });
const endAt = (id, love) => {
  const sc = S.find((x) => x.id === id);
  const p = startAt(S, { at: id, beat: sc.beats.length - 1 });
  assert.ok(beatAt(S, p).end, `${id} last beat is an end beat`);
  return ending(S, { ...p, love });
};

test('end card: STEEPED / ESCAPE / ESCAPE? keep their own card at any love below 100%', () => {
  for (const id of Object.keys(REAL_ENDINGS)) {
    for (const love of [0, 3, 10, 15]) {
      const e = endAt(id, love);
      assert.equal(e.scene, id);
      assert.equal(cardFor(e), 'ending', `${id} at love ${love}`);
    }
  }
});

test('end card: 100% is the win card on any ending; a leave ending below 100% is the fail card', () => {
  const g = endAt('steeped', 0).goal;
  for (const id of ['steeped', 'escape-win', 'leave-fu']) assert.equal(cardFor(endAt(id, g)), 'win', id);
  for (const id of ['leave-fu', 'leave-yeah']) for (const love of [0, g - 1]) assert.equal(cardFor(endAt(id, love)), 'fail', `${id} ${love}`);
});

test('fail lines: about 8, short, grade-2 words, each (ending, band) has several to pick from', () => {
  assert.ok(FAIL_LINES.length >= 7 && FAIL_LINES.length <= 10);
  for (const l of FAIL_LINES) {
    const words = fill(l.text, { n: 3 }).split(/\s+/);
    assert.ok(words.length <= 9, `short: ${l.text}`);
    assert.ok(words.every((w) => w.replace(/[^a-z]/gi, '').length <= 8), `plain words: ${l.text}`);
  }
  const g = endAt('steeped', 0).goal;
  for (const id of ['leave-fu', 'leave-yeah']) for (const love of [0, g - 1]) {
    const e = endAt(id, love);
    assert.ok(failPool(e).length >= 4, `${id} ${bandOf(e)}`);
  }
});

test('fail lines: same seed + run = same line; different seeds / runs show different lines; ending and band change the pool', () => {
  const g = endAt('steeped', 0).goal;
  const low = endAt('leave-fu', 0), almost = endAt('leave-yeah', g - 1);
  assert.equal(bandOf(low), 'low');
  assert.equal(bandOf(almost), 'almost');
  assert.equal(failLine(low, { seed: 7, run: 2 }), failLine(low, { seed: 7, run: 2 }));
  const seen = new Set();
  for (let seed = 0; seed < 40; seed++) seen.add(failLine(low, { seed, run: 1 }));
  assert.ok(seen.size >= 3, 'seeds spread over the pool');
  const byRun = new Set(Array.from({ length: 20 }, (_, run) => failLine(low, { seed: 1, run: run + 1 })));
  assert.ok(byRun.size >= 3, 'runs spread over the pool');
  assert.notDeepEqual(failPool(low).map((l) => l.text), failPool(almost).map((l) => l.text));
  assert.ok(failPool(low).some((l) => l.at === 'leave-fu') && !failPool(low).some((l) => l.at === 'leave-yeah'));
  assert.ok(!failPool(almost).some((l) => l.band === 'low'));
  assert.equal(fill("Day {RUN}. You still don't know which door.", { n: 4 }), "Day 4. You still don't know which door.");
});
