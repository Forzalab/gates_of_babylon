// Narration takes + voice timing (research/sprint-0930/narration/TIMING.md, QA.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildIndex, fileForLine, planFor, PAD } from './date-beta/voice/voice.js';
import { mp3Ms } from '../scripts/narration/timing.mjs';
import { narrationLines } from '../scripts/narration/lines.mjs';

const read = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const manifest = read('./date-beta/voice/manifest.json');
const timing = read('./date-beta/voice/timing.json');
const qa = read('../research/sprint-0930/narration/qa/qa.json');
const idx = buildIndex(manifest);

test('every take has a timing row: hold >= audio + pad, audio matches the file, file > 5 KB', () => {
  for (const e of manifest) {
    const t = timing.files[e.file];
    assert.ok(t, `no timing for ${e.file}`);
    const buf = fs.readFileSync(new URL(`../public/${e.file}`, import.meta.url));
    assert.ok(buf.length > 5000, `${e.file} is ${buf.length} B`);
    assert.equal(t.audioMs, mp3Ms(buf), `${e.file}: stale timing (re-run scripts/narration/timing-table.mjs)`);
    assert.ok(t.audioMs > 300 && t.audioMs < 30000, `${e.file}: ${t.audioMs} ms`);
    assert.ok(t.holdMs >= t.audioMs + PAD, `${e.file}: hold ${t.holdMs} < audio ${t.audioMs} + ${PAD}`);
    for (const [w, ms] of Object.entries(t.marks ?? {})) assert.ok(ms >= 0 && ms < t.audioMs, `${e.file}: mark "${w}" at ${ms}`);
  }
});

test('every narration/MC line on the live packs has a take the lookup finds', () => {
  const miss = narrationLines().filter((l) => !/^NANDA/.test(l.who ?? '') && !fileForLine(idx, l.scene, l.text));
  assert.deepEqual(miss.map((l) => `${l.scene}[${l.beat}] ${l.text}`), []);
});

test('the forecast split reveals on the aligned word', () => {
  const p = planFor(idx, timing, 'rooftop', "Technically, rain wasn't f-OR-ecast.");
  assert.ok(p.ms > 0 && p.hold === p.ms + PAD);
  assert.ok(p.mark('f-') > 300 && p.mark('f-') < p.ms);
});

test('plan: muted / unrecorded = authored timing, lead + line = one queue', () => {
  const quiet = planFor(idx, timing, 'rooftop', 'Her shoes by the fence. Toes pointed at you.', null, false);
  assert.deepEqual([quiet.ms, quiet.hold, quiet.stepMs], [0, 0, null]);
  const none = planFor(idx, timing, 'rooftop', 'A line nobody recorded.');
  assert.equal(none.hold, 0);
  const two = planFor(idx, timing, 'rooftop', 'Sweet. Like me. Good input.', 'Her shoes by the fence. Toes pointed at you.');
  const a = timing.files[fileForLine(idx, 'rooftop', 'Sweet. Like me. Good input.')].audioMs;
  const b = timing.files[fileForLine(idx, 'rooftop', 'Her shoes by the fence. Toes pointed at you.')].audioMs;
  assert.equal(two.stepMs, a);
  assert.equal(two.ms, a + b);
});

test('audio QA: no hard errors (clipping, clipped edges, loudness off target), every take measured', () => {
  assert.deepEqual(qa.hard, []);
  const seen = new Set(qa.rows.map((r) => r.file));
  for (const e of manifest) assert.ok(seen.has(e.file), `QA never measured ${e.file} (run scripts/narration/qa.py)`);
  for (const r of qa.rows) assert.ok(Math.abs(r.dLufs) <= qa.tolDb, `${r.file} ${r.dLufs} dB`);
});

test('route timeline: no voice overlaps, every beat holds its take', () => {
  const tl = read('../research/sprint-0930/narration/qa/timeline.json');
  assert.deepEqual(tl.errors, []);
});
