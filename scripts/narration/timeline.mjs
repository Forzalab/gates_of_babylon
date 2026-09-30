// Render the whole route to a timeline: every beat (+ its vary views + choice reactions) of the live packs in play order,
// with the voice start/end, the reveal step, the sfx cue, when NEXT shows / the beat auto-advances, and the gaps.
// Pacing model: the player clicks the moment NEXT shows. Uses the engine's own beatTiming (voice/voice.js).
// node scripts/narration/timeline.mjs -> research/sprint-0930/narration/qa/timeline.json (errors[] fail the test)
import fs from 'node:fs';
import { applyPacks } from '../../src/date-beta/packs/index.js';
import { loadScenes, parseLine, MIN_HOLD } from '../../src/date-beta/engine.js';
import { buildIndex, fileForLine, planFor, beatTiming, PAD } from '../../src/date-beta/voice/voice.js';
import { PLAY } from './lines.mjs';

const U = (p) => new URL(`../../${p}`, import.meta.url);
const R = (p) => JSON.parse(fs.readFileSync(U(p), 'utf8'));
const scenes = loadScenes(applyPacks(R('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...R(`src/date-beta/packs/${n}.json`) }))), {});
const manifest = R('src/date-beta/voice/manifest.json'), timing = R('src/date-beta/voice/timing.json');
const idx = buildIndex(manifest);
const out = { pad: PAD, scenes: [], errors: [], warnings: [], stats: { beats: 0, voiced: 0, spokenMs: 0, totalMs: 0 } };

for (const s of scenes) {
  let t = 0;
  const rows = [];
  const add = (label, beat, plain, { react = false } = {}) => {
    const cut = beat.props?.cut ?? {};
    const lead = !react && cut.lead ? cut.lead : null;
    const splitAt = !react && cut.at ? cut.at : null;
    const plan = planFor(idx, timing, s.id, lead ?? plain, lead ? plain : null);
    const vt = beatTiming(react ? { ...beat, hold: MIN_HOLD, auto: null } : beat, plan, { lead: !!lead, splitAt, step: lead || splitAt ? Math.max(500, cut.step ?? 600) : null });
    const end = vt.autoAt ?? (beat.choices && !react ? Math.max(vt.readyAt, beat.hold) : vt.readyAt);
    const files = [fileForLine(idx, s.id, lead ?? plain), lead ? fileForLine(idx, s.id, plain) : null].filter(Boolean);
    const row = { label, start: t, end: t + end, text: plain, chars: (plain ?? '').length, files, voice: plan.ms ? [t, t + plan.ms] : null,
      step: vt.stepAt != null ? t + vt.stepAt : null, sfx: beat.sfx && !react ? { id: beat.sfx, at: t + vt.sfxAt } : null,
      readyAt: t + vt.readyAt, autoAt: vt.autoAt != null ? t + vt.autoAt : null, gap: plan.ms ? end - plan.ms : null };
    const err = (m) => out.errors.push(`${s.id} ${label}: ${m}`);
    if (plan.ms) {
      if (vt.readyAt < plan.ms + PAD) err(`NEXT at ${vt.readyAt} before the take ends (${plan.ms} + ${PAD})`);
      if (vt.autoAt != null && vt.autoAt < plan.ms + PAD) err(`auto-advance at ${vt.autoAt} cuts the take (${plan.ms})`);
      if (vt.stepAt != null && vt.stepAt > plan.ms) err(`second line reveals at ${vt.stepAt}, after the take ended (${plan.ms})`);
      if (vt.sfxAt > plan.ms) err(`sfx at ${vt.sfxAt} after the take`);
      if (beat.timer && !react && beat.timer * 1000 < plan.ms + PAD) out.warnings.push(`${s.id} ${label}: the ${beat.timer} s timer can auto-pick before the ${plan.ms} ms take ends`);
      out.stats.voiced++; out.stats.spokenMs += plan.ms;
    }
    // overlap: the next row starts at `end`; the take must be over by then (the queue stops it otherwise = cut off)
    if (row.voice && row.voice[1] > row.end) err(`take runs ${row.voice[1] - row.end} ms past the beat end (would be cut)`);
    rows.push(row);
    out.stats.beats++;
    t += end;
  };
  for (const b of s.beats) {
    add(`[${b.index}]`, b, b.line?.plain);
    for (const [f, v] of Object.entries(b.vary ?? {})) for (const [val, e] of Object.entries(v)) {
      if (e.text) add(`[${b.index}] ${f}=${val}`, { ...b, ...(e.sfx ? { sfx: e.sfx } : {}) }, parseLine(e.text, 'x', e.speaker ?? b.speaker).plain);
    }
    for (const [i, c] of (b.choices ?? []).entries()) {
      const r = c.react?.plain ?? (typeof c.react === 'string' ? c.react : null);
      if (r) add(`[${b.index}] react ${i}`, b, r, { react: true });
    }
  }
  out.scenes.push({ id: s.id, ms: t, rows });
  out.stats.totalMs += t;
}
fs.mkdirSync(U('research/sprint-0930/narration/qa/'), { recursive: true });
fs.writeFileSync(U('research/sprint-0930/narration/qa/timeline.json'), JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out.stats), out.errors.length, 'errors', out.warnings.length, 'warnings');
for (const w of out.warnings) console.log('WARN', w);
for (const e of out.errors.slice(0, 20)) console.log('ERR', e);
