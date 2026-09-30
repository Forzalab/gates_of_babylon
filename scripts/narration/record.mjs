// Step 2: record every narration/MC line (scripts/narration/lines.mjs) that has no take yet, with alignment.
// node scripts/narration/record.mjs [limit]   (idempotent: skips lines already in the manifest)
// Writes public/date-beta/voice/narration/<scene>/<nnn>.mp3, research/sprint-0930/narration/align/<same>.json and
// appends the entries to research/sprint-0930/voice/audio-manifest.json + src/date-beta/voice/manifest.json.
import fs from 'node:fs';
import { narrationLines } from './lines.mjs';
import { speak } from './eleven.mjs';
import { mp3Ms } from './timing.mjs';
import { buildIndex, fileForLine } from '../../src/date-beta/voice/voice.js';

export const NARRATOR = { voice: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel - Steady Broadcaster', model: 'eleven_multilingual_v2',
  settings: { stability: 0.6, similarity_boost: 0.8, style: 0, speed: 1.08 } };
const U = (p) => new URL(`../../${p}`, import.meta.url);
const FULL = U('research/sprint-0930/voice/audio-manifest.json'), SLIM = U('src/date-beta/voice/manifest.json');
const full = JSON.parse(fs.readFileSync(FULL, 'utf8')), slim = JSON.parse(fs.readFileSync(SLIM, 'utf8'));
// Nanda-labelled offstage lines are hers, not the narrator's.
const todo = narrationLines().filter((l) => !/^NANDA/.test(l.who ?? '') && !fileForLine(buildIndex(slim), l.scene, l.text));
const limit = Number(process.argv[2] ?? Infinity);
console.log(`${todo.length} lines to record`);
// What is said: the shown words; the stamp dot reads as a stop. (Alignment indexes this exact string.)
export const spoken = (t) => t.replace(/\s*·\s*/g, '. ');
let n = full.reduce((m, e) => Math.max(m, e.n ?? 0), 0);
for (const l of todo.slice(0, limit)) {
  const say = spoken(l.text);
  const { mp3, alignment } = await speak(NARRATOR.voice, say, { model: NARRATOR.model, settings: NARRATOR.settings });
  const ms = mp3Ms(mp3);
  if (mp3.length < 5000 || ms < 300 || ms > 30000) { console.error(`BAD take ${l.scene} ${l.beat}: ${mp3.length} B ${ms} ms`); process.exit(2); }
  n += 1;
  const rel = `date-beta/voice/narration/${l.scene}/${String(n).padStart(3, '0')}_${l.beat}${l.k ? `-${l.k.replace(/[^a-z0-9]+/gi, '-')}` : ''}.mp3`;
  fs.mkdirSync(U(`public/${rel}`.replace(/[^/]+$/, '')), { recursive: true });
  fs.writeFileSync(U(`public/${rel}`), mp3);
  const al = U(`research/sprint-0930/narration/align/${rel.slice('date-beta/voice/narration/'.length).replace(/\.mp3$/, '.json')}`);
  fs.mkdirSync(new URL('./', al), { recursive: true });
  fs.writeFileSync(al, JSON.stringify({ text: say, alignment }));
  const beat = `N ${l.beat}${l.k ? ` ${l.k}` : ''}`;
  full.push({ n, scene: l.scene, beat, file: `public/${rel}`, text: l.text, voice: 'narrator' });
  slim.push({ scene: l.scene, beat, file: rel, text: l.text });
  fs.writeFileSync(FULL, JSON.stringify(full, null, 1) + '\n');
  fs.writeFileSync(SLIM, JSON.stringify(slim, null, 1) + '\n');
  console.log(`${rel}  ${mp3.length} B  ${ms} ms  | ${l.text.slice(0, 70)}`);
}
