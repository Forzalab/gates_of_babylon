// Love audit (Tony, PR #27): "does each multiple choice path (inconsequential one included) all affect points?"
// Every choice with 2+ options in the shipped graph gives every option a love value, and the options differ.
// Table: research/sprint-0930/alt-test/LOVE-AUDIT.md
import test from 'node:test';
import assert from 'node:assert/strict';
import { FINAL } from './date-beta-final.js';
import { choiceBeats } from './date-beta-love-audit.js';

const beats = choiceBeats(FINAL);

test('love audit: the audit sees the multi-choice beats (46 at the time of writing)', () => {
  assert.ok(beats.length >= 40, `only ${beats.length} choice beats found`);
  assert.ok(beats.some((x) => x.live) && beats.some((x) => x.consequential));
});

test('love audit: every option of every multi-option choice has a non-zero love value', () => {
  for (const { id, beat } of beats) {
    beat.choices.forEach((c, i) => assert.ok(Number.isInteger(c.love) && c.love !== 0, `${id} option ${i} "${c.text}" has love ${c.love}`));
  }
});

test('love audit: the options of a choice do not all share one value', () => {
  for (const { id, beat } of beats) {
    assert.ok(new Set(beat.choices.map((c) => c.love)).size > 1, `${id}: every option is ${beat.choices[0].love}`);
  }
});

test('love audit: every choice has a pleasing (positive) and a displeasing (negative) option', () => {
  for (const { id, beat } of beats) {
    const max = Math.max(...beat.choices.map((c) => c.love)), min = Math.min(...beat.choices.map((c) => c.love));
    assert.ok(max > 0 && min < 0, `${id}: needs a positive and a negative option (${beat.choices.map((c) => c.love)})`);
  }
});
