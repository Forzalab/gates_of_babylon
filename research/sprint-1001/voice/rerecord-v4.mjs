// Re-record every WIRED take (src/date-beta/voice/manifest.json) on eleven_v4, in place (same path: manifests unchanged).
// Tony, Oct 1: "use v4, all of them"; the narrator (was Daniel, British) -> "Sean - Squeaky voice". Nanda stays Irohauta.
// Resumable: done files go to rerecord-v4.done.json. Then: qa.py --fix, timing-table.mjs, npm test.
// ELEVEN_ENV=<key file> node research/sprint-1001/voice/rerecord-v4.mjs [limit] [--only <substr>]
import fs from 'node:fs';
import { speak } from '../../../scripts/narration/eleven.mjs';
import { mp3Ms } from '../../../scripts/narration/timing.mjs';
const U = (p) => new URL(`../../../${p}`, import.meta.url);
const R = (p) => JSON.parse(fs.readFileSync(U(p), 'utf8'));
export const MODEL = 'eleven_v4';
export const SEAN = { voice: '4NJLA7OQNVkeKe4jVdHw', settings: { stability: 0.5, similarity_boost: 0.8, style: 0, speed: 1.05 } };
export const NANDA = { voice: 'uYwU1hsbnP5viqq9qhob', settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35 } };
const spoken = (t) => t.replace(/\s*·\s*/g, '. '); // record.mjs: the stamp dot reads as a stop (alignment indexes this string)
const DONE = new URL('./rerecord-v4.done.json', import.meta.url);
const done = new Set(fs.existsSync(DONE) ? JSON.parse(fs.readFileSync(DONE, 'utf8')) : []);
const wired = new Set(R('src/date-beta/voice/manifest.json').map((e) => `public/${e.file}`));
const src = new Map();
for (const e of [...R('research/sprint-0930/voice/audio-manifest.json'), ...R('research/sprint-0930/voice/appendix-manifest.json')]) if (wired.has(e.file) && !src.has(e.file)) src.set(e.file, e);
const args = process.argv.slice(2), oi = args.indexOf('--only'), only = oi >= 0 ? args[oi + 1] : null;
const limit = Number(args.find((a, i) => /^\d+$/.test(a) && i !== oi + 1) ?? Infinity);
let n = 0;
for (const [file, e] of src) {
  if (n >= limit) break;
  if (done.has(file) || (only && !file.includes(only))) continue;
  const narr = e.voice === 'narrator' || file.includes('/narration/');
  const v = narr ? SEAN : NANDA, say = narr ? spoken(e.text) : e.text;
  const { mp3, alignment } = await speak(v.voice, say, { model: MODEL, settings: v.settings });
  const ms = mp3Ms(mp3);
  if (mp3.length < 3000 || ms < 300 || ms > 30000) { console.error(`BAD take ${file}: ${mp3.length} B ${ms} ms`); process.exit(2); }
  fs.writeFileSync(U(file), mp3);
  if (narr) fs.writeFileSync(U(`research/sprint-0930/narration/align/${file.slice('public/date-beta/voice/narration/'.length).replace(/\.mp3$/, '.json')}`), JSON.stringify({ text: say, alignment }));
  done.add(file); fs.writeFileSync(DONE, JSON.stringify([...done], null, 1) + '\n');
  n++; console.log(`${done.size}/${src.size}`, narr ? 'SEAN ' : 'NANDA', file.split('/voice/')[1], `${ms} ms`);
}
console.log('left', [...src.keys()].filter((f) => !done.has(f)).length);
