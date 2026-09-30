// Step 3: the timing table the engine reads (src/date-beta/voice/timing.json). See research/sprint-0930/narration/TIMING.md.
// node scripts/narration/timing-table.mjs  (re-run after any re-take or QA fix)
import fs from 'node:fs';
import { mp3Ms, charStartMs } from './timing.mjs';
import { narrationLines } from './lines.mjs';
import { PAD } from '../../src/date-beta/voice/voice.js';

const U = (p) => new URL(`../../${p}`, import.meta.url);
const slim = JSON.parse(fs.readFileSync(U('src/date-beta/voice/manifest.json'), 'utf8'));
// reveal points wanted per scene: cut.at split text + props.sfxAt words (from the live packs)
const want = new Map();
for (const l of narrationLines({ all: true })) for (const w of [l.at, l.sfxAt]) if (w) want.set(l.scene, [...(want.get(l.scene) ?? []), w]);
const files = {}, rows = [];
for (const e of slim) {
  const buf = fs.readFileSync(U(`public/${e.file}`));
  const audioMs = mp3Ms(buf);
  const row = { audioMs, holdMs: audioMs + PAD };
  const al = U(`research/sprint-0930/narration/align/${e.file.replace('date-beta/voice/narration/', '').replace(/\.mp3$/, '.json')}`);
  if (e.file.includes('/narration/') && fs.existsSync(al)) {
    const { text, alignment } = JSON.parse(fs.readFileSync(al, 'utf8'));
    for (const w of want.get(e.scene) ?? []) {
      const i = text.indexOf(w);
      if (i >= 0) (row.marks ??= {})[w] = charStartMs(alignment, i);
    }
  }
  files[e.file] = row;
  rows.push({ scene: e.scene, beat: e.beat, chars: e.text.replace(/\[[^\]]*\]/g, '').trim().length, file: e.file, ...row });
}
fs.writeFileSync(U('src/date-beta/voice/timing.json'), JSON.stringify({ pad: PAD, files }, null, 1) + '\n');
fs.writeFileSync(U('research/sprint-0930/narration/timing-table.json'), JSON.stringify(rows, null, 1) + '\n');
console.log(rows.length, 'rows,', rows.filter((r) => r.marks).length, 'with marks', JSON.stringify(rows.filter((r) => r.marks).map((r) => [r.file, r.marks])));
