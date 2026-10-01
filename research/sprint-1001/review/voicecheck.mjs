// Reviewer A: reachable Nanda lines with no wired take (read-only use of scripts/voice-gaps.mjs gaps()), plus
// manifest entries whose text no longer matches any reachable line (stale takes = voice says old words).
import fs from 'node:fs';
import { gaps, liveLines } from '../../../scripts/voice-gaps.mjs';
import { norm } from '../../../src/date-beta/voice/voice.js';
const ROOT = new URL('../../../', import.meta.url);
const { lines, miss } = gaps();
console.log(`reachable Nanda lines ${lines}, silent ${miss.length}`);
for (const m of miss) console.log(`MISS ${m.cls} ${m.scene}:${m.beat} [${m.kind}] ${m.text}${m.take ? '  ~take: ' + m.take.text : ''}`);
const live = liveLines();
const liveKeys = new Set(live.map((l) => `${l.scene}|${norm(l.text)}`));
const slim = JSON.parse(fs.readFileSync(new URL('src/date-beta/voice/manifest.json', ROOT), 'utf8'));
const scenes = new Set(live.map((l) => l.scene));
const stale = slim.filter((e) => scenes.has(e.scene) && !liveKeys.has(`${e.scene}|${norm(e.text)}`));
console.log(`manifest entries ${slim.length}; in live scenes but matching no live line: ${stale.length}`);
for (const e of stale) console.log(`STALE ${e.scene}:${e.beat} ${e.file} "${e.text}"`);
