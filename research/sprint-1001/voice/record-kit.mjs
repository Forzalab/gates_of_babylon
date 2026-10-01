// Records RECORD-KIT.md rows in Nanda's voice (Irohauta, eleven_v3; brain 2026-09-29T2330) that have no mp3 yet, and
// appends them to research/sprint-0930/voice/appendix-manifest.json. Then: node scripts/voice-gaps.mjs --wire, qa --fix.
// ELEVEN_ENV=<key file> node research/sprint-1001/voice/record-kit.mjs [n ...]   (no n = every missing row)
import fs from 'node:fs';
import { speak } from '../../../scripts/narration/eleven.mjs';
const U = (p) => new URL(`../../../${p}`, import.meta.url);
export const NANDA = { voice: 'uYwU1hsbnP5viqq9qhob', model: 'eleven_v3', settings: { stability: 0.5, similarity_boost: 0.75, style: 0.35 } };
const KIT = fs.readFileSync(new URL('./RECORD-KIT.md', import.meta.url), 'utf8');
const APPX = U('research/sprint-0930/voice/appendix-manifest.json');
const rows = [...KIT.matchAll(/^\| (\d+) \| ([\w-]+) \| ([^|]+?) \| ([^|]+?) \| `([^`]+)` \|$/gm)].map(([, n, scene, beat, file, text]) => ({ n: +n, scene, beat, file: `public/date-beta/voice/${file}`, text }));
const only = process.argv.slice(2).map(Number);
const appx = JSON.parse(fs.readFileSync(APPX, 'utf8'));
for (const r of rows) {
  if (only.length && !only.includes(r.n)) continue;
  if (fs.existsSync(U(r.file))) { console.log('have', r.n); continue; }
  const { mp3, ms } = await speak(NANDA.voice, r.text, { model: NANDA.model, settings: NANDA.settings });
  fs.mkdirSync(U(r.file.replace(/[^/]+$/, '')), { recursive: true });
  fs.writeFileSync(U(r.file), mp3);
  if (!appx.some((e) => e.file === r.file)) appx.push(r);
  fs.writeFileSync(APPX, JSON.stringify(appx, null, 1) + '\n');
  console.log('rec', r.n, r.scene, r.beat, `${mp3.length} B`, `${ms} ms`);
}
