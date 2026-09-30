// Variable reward (Tony): the love chip shows "??" on about half of the choice beats, and on every consequential choice.
// The score still changes: `loveHidden` only changes what the chip shows. List: research/sprint-0930/alt-test/LOVE-AUDIT.md
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes } from './date-beta/engine.js';
import { FINAL } from './date-beta-final.js';
import { choiceBeats } from './date-beta-love-audit.js';

const beats = choiceBeats(FINAL);
const hidden = beats.filter((x) => x.beat.loveHidden);

test('loveHidden: 45-60% of the choice beats are hidden', () => {
  const pct = (100 * hidden.length) / beats.length;
  assert.ok(pct >= 45 && pct <= 60, `${hidden.length}/${beats.length} = ${pct.toFixed(1)}%`);
});

test('loveHidden: every consequential choice is hidden (door, cup, errand, lock game, leave, ...)', () => {
  const conseq = beats.filter((x) => x.consequential);
  assert.ok(conseq.length >= 6);
  for (const x of conseq) assert.ok(x.beat.loveHidden, `${x.id} is consequential but shows its number`);
  for (const id of ['cup:4', 'escape:14', 'v2-park:4', 'door:3', 'leave:3']) assert.ok(conseq.some((x) => x.id === id), `${id} should count as consequential`);
});

test('loveHidden: spread evenly, never 3 shown beats in a row in play order, on the live path too', () => {
  for (const list of [beats, beats.filter((x) => x.live)]) {
    let run = 0;
    for (const x of list) { run = x.beat.loveHidden ? 0 : run + 1; assert.ok(run <= 2, `3 shown in a row at ${x.id}`); }
    const pct = (100 * list.filter((x) => x.beat.loveHidden).length) / list.length;
    assert.ok(pct >= 40 && pct <= 70, `${pct.toFixed(0)}% hidden`);
  }
});

test('loveHidden: the score still changes on a hidden beat', () => {
  const x = hidden.find((h) => h.id === 'v2-park:4');
  assert.ok(x.beat.choices.every((c) => c.love !== 0));
});

test('loveHidden: loader takes a boolean on a choice beat only', () => {
  const S = (extra, choices = [{ text: 'a', love: 1 }, { text: 'b', love: -1 }]) => loadScenes({ version: 1, scenes: [{ id: 'x', bg: 'blackout', beats: [{ ...extra, choices }] }] }, { manifest: { assets: [] }, art: ['blackout'] });
  assert.equal(S({ loveHidden: true })[0].beats[0].loveHidden, true);
  assert.equal(S({})[0].beats[0].loveHidden, false);
  assert.throws(() => S({ loveHidden: 'yes' }), /loveHidden/);
});
