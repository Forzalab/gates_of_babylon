// UX fix pack (sprint 0930, Agent 3): basement jar + curry house wiring. The .jsx art can't load under node --test, so these
// read the sources (same approach as date-beta-art-names.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SHOT_ALIASES } from './date-beta/art/shots/aliases.js';
import { ART_NAMES } from './date-beta-art-names.js';

const src = (p) => readFileSync(new URL(`./date-beta/${p}`, import.meta.url), 'utf8');

test('basement: old jars keep only their dates; today\'s jar is "Kemey" + today\'s date, under a second lamp', () => {
  for (const f of ['art/Basement.jsx', 'art/interiors/Cellar.jsx']) {
    const s = src(f);
    assert.match(s, /TODAY_NAME = 'Kemey'/, f);
    const jars = s.slice(s.indexOf('const JARS'), s.indexOf(';', s.indexOf('const JARS')));
    assert.doesNotMatch(jars, /[A-Z][a-z]+'/, `${f}: no names left on the old jars`);
    assert.doesNotMatch(s, /name="you"/, `${f}: today's jar is not "you" any more`);
  }
  const cellar = src('art/interiors/Cellar.jsx');
  assert.match(cellar, /function TodayLamp/);
  assert.match(cellar, /<TodayTag z=\{zs\[0\]\} date=\{today\(\)\} \/>/);
  assert.match(src('art/Basement.jsx'), /function Lamp/);
  // the labels are the payoff: the focus blur skips the basement (dim only)
  assert.match(src('beta.css'), /\.stage\.focus \.scene:has\(\.art\.basement, \.art\.cellar\) \{ filter: brightness\(\.86\); \}/);
});

test('curry house: its own art (noren, menu, clock at 3:00), wired to v2-curry, not the café', () => {
  assert.ok(ART_NAMES.includes('curry-house'));
  const s = src('art/CurryHouse.jsx');
  assert.match(s, /const hour = 3, minute = 0;/);
  assert.match(s, /'カレー'\[i\]/, 'noren panels');
  assert.match(s, /CURRY MENU/);
  assert.doesNotMatch(s, /XOR|Coffee|latte/i);
  for (const id of ['curry-house-int', 'dish-butter', 'dish-katsu', 'nanda-eat-butter', 'nanda-eat-katsu']) {
    assert.equal(SHOT_ALIASES[id].props.of, 'curry-house', id);
  }
  const v2 = JSON.parse(src('packs/variant-v2.json'));
  const find = (o) => (o && typeof o === 'object' ? (o.id === 'v2-curry' && o.beats ? o : Object.values(o).map(find).find(Boolean)) : null);
  const curry = find(v2);
  assert.equal(curry?.bg, 'curry-house');
});
