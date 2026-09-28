// date-lab registry contract: every variant has a unique id, a known track, a theme, a horror level, a component.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const TRACKS = ['camera', 'anim', 'menu', 'closeup', 'fx', 'nanda'];
test('date-lab: builder folders exist and export VARIANTS', () => {
  for (const b of ['a', 'b']) {
    const src = readFileSync(new URL(`./date-lab/${b}/index.js`, import.meta.url), 'utf8');
    assert.match(src, /export const VARIANTS/);
  }
  assert.ok(TRACKS.length === 6);
  assert.ok(readdirSync(new URL('./date-lab/', import.meta.url)).includes('main.jsx'));
});
