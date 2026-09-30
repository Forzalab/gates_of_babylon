// B-08: the blackout / ADORE ME auto sequence stays short (Tony: "16s, the adore me scene? trim it").
import test from 'node:test';
import assert from 'node:assert/strict';
import { start, next, beatAt } from './date-beta/engine.js';
import { FINAL } from './date-beta-final.js';
import { FLOOR_MS } from './collapseFrames.js';

const walk = (rm) => {
  const out = [];
  for (let p = start(FINAL, { at: 'blackout', rm }); FINAL[p.s].id === 'blackout'; p = next(FINAL, p, rm)) {
    const b = beatAt(FINAL, p);
    out.push({ phase: b.props.phase, ms: b.auto ?? b.hold });
  }
  return out;
};

for (const rm of [false, true]) {
  test(`B-08: blackout totals <= 8000 ms, every hold >= ${FLOOR_MS} ms (${rm ? 'reduced' : 'full'} motion)`, () => {
    const w = walk(rm);
    const sum = w.reduce((a, x) => a + x.ms, 0);
    assert.ok(sum <= 8000, `blackout ${sum} ms`);
    for (const x of w) assert.ok(x.ms >= FLOOR_MS, `${x.phase} ${x.ms} ms`);
    const phases = w.map((x) => x.phase);
    for (const ph of ['forecast', 'or', 'adoreme', 'cut']) assert.ok(phases.includes(ph), `story beat ${ph} kept`);
    if (!rm) assert.deepEqual(phases.slice(0, 9), ['dark', 'forecast', 'or', 'dor', 'ador', 'adore', 'adoreme', 'fade', 'cut']);
  });
}
