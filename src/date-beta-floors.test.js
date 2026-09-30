// Float guard (research/sprint-0930/float-audit/REPORT.md): every bg / insert shot that a Nanda-visible beat of the two
// routes uses has a floor entry in art/floors.js (a y, or crop: true), so no new beat can float her by default.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyPacks } from './date-beta/packs/index.js';
import { FLOORS, floorOf } from './date-beta/art/floors.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const data = applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
const ROUTE = /^(v2-.*|rooftop|cup|steeped|escape.*|.*town.*|.*shop.*|.*curry.*)$/;

test('floors: every bg a Nanda-visible route beat uses has a floor entry (y or crop)', () => {
  const miss = new Set();
  for (const sc of data.scenes.filter((s) => ROUTE.test(s.id) && !s.offstage)) {
    let bg = null;
    for (const b of sc.beats) {
      bg = b.bg ?? bg;
      const cut = b.props?.cut ?? {};
      const frame = cut.frame ?? 'medium';
      if (frame !== 'medium' || cut.plant || b.present === false) continue;
      const { key } = floorOf(bg, b.props?.shot);
      if (key && !FLOORS[key]) miss.add(key);
    }
  }
  assert.deepEqual([...miss].sort(), [], `add these to src/date-beta/art/floors.js: ${[...miss].join(', ')}`);
});

test('floors: entries are sane and the renderer uses them', () => {
  for (const [k, f] of Object.entries(FLOORS)) assert.ok(f.crop === true || (f.y > 400 && f.y <= 1080), k);
  const main = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
  assert.match(main, /floorOf\(beat\.bg, beat\.props\?\.shot\)/);
});
