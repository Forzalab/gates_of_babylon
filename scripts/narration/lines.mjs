// Narration script: every non-Nanda line (narration, place/time stamps, MC) on the live PLAY packs, in play order.
// node scripts/narration/lines.mjs [out.json]  -> [{ scene, beat, k, who, text }]
import fs from 'node:fs';
import { applyPacks } from '../../src/date-beta/packs/index.js';
import { loadScenes, parseLine } from '../../src/date-beta/engine.js';

const D = new URL('../../src/date-beta/', import.meta.url);
const R = (p) => JSON.parse(fs.readFileSync(new URL(p, D), 'utf8'));
// same list + order as main.jsx PLAY
export const PLAY = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences', 'variant-v2', 'r3-station', 'r3-rain', 'scene-a', 'interiors', 'curry', 'shop', 'town', 'love', 'ux-six', 'r5', 'gacha']
  .filter((n) => fs.existsSync(new URL(`packs/${n}.json`, D)));

export function narrationLines() {
  const data = applyPacks(R('scenes.json'), PLAY.map((n) => ({ name: n, ...R(`packs/${n}.json`) })));
  const scenes = loadScenes(data, {});
  const out = [], seen = new Set();
  for (const s of scenes) for (const b of s.beats) {
    const views = [{ line: b.line, k: '' }];
    for (const [f, v] of Object.entries(b.vary ?? {})) for (const [val, e] of Object.entries(v)) {
      if (e.text) views.push({ line: parseLine(e.text, 'x', e.speaker ?? b.speaker), k: `${f}=${val}` });
    }
    const cut = b.props?.cut ?? {};
    if (cut.lead) views.push({ line: { who: null, plain: cut.lead }, k: 'lead' });
    for (const { line, k } of views) {
      const text = line.plain?.trim();
      if (!text || line.who === 'NANDA') continue;
      const key = `${s.id}|${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ scene: s.id, beat: b.index, k, who: line.who, text, ...(cut.at ? { at: cut.at } : {}), ...(b.props?.sfxAt ? { sfxAt: b.props.sfxAt } : {}) });
    }
  }
  return out;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const out = narrationLines();
  const who = {};
  for (const l of out) who[l.who] = (who[l.who] ?? 0) + 1;
  console.log(out.length, 'lines', JSON.stringify(who), out.reduce((n, l) => n + l.text.length, 0), 'chars');
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
}
