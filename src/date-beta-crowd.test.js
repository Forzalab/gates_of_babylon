// crowd-eyes (sprint 1001): every CROWD-speaker beat draws the crowd layer (props.crowd, art/crowd), no other beat does.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { crowdOf, buildCrowd, CLEAR, EYE_TOP, EYE_BOTTOM } from './date-beta/art/crowd/crowd.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const scenes = loadScenes(applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) }))), { manifest: read('./date-beta/assets.json') });

test('crowd beats render the layer, other beats do not; the crowd is 3 bands, 30-80 heads, eyes clear of her + the HUD', () => {
  const on = [];
  for (const s of scenes) s.beats.forEach((b, i) => {
    const isCrowd = b.line?.who === 'CROWD';
    assert.equal(!!crowdOf(b.props), isCrowd, `${s.id} ${i}: crowd layer ${isCrowd ? 'missing' : 'leaks'}`);
    if (isCrowd) on.push(`${s.id}:${i}`);
  });
  assert.deepEqual(on, ['leave-fu:2', 'leave-fu:3', 'leave-yeah:2', 'leave-yeah:3']);
  assert.match(src('./date-beta/main.jsx'), /<CrowdBack[^>]*crowd=\{throng\}/);
  for (const d of [0.8, 1, 1.4, 1.6]) {
    const c = buildCrowd({ density: d });
    assert.deepEqual(c, buildCrowd({ density: d }), 'seeded, not random');
    assert.ok(c.count >= 30 && c.count <= 80, `count ${c.count} at density ${d}`);
    assert.ok(c.far.length && c.mid.length && c.near.length, 'three bands');
    for (const f of [...c.mid, ...c.near]) {
      assert.ok(f.x < CLEAR[0] || f.x > CLEAR[1], `head at x ${f.x} is in her column`);
      const ey = f.y + f.r * 0.1;
      assert.ok(ey >= EYE_TOP - 1 && ey <= EYE_BOTTOM + 1, `eyes at y ${ey}`);
    }
  }
  assert.doesNotMatch(src('./date-beta/art/crowd/CrowdLayer.jsx') + src('./date-beta/art/crowd/crowd.js'), /Math\.random/);
});
