// Reviewer A: every reachable beat line (any speaker, base + vary text) -> wired take or SILENT, per scene.
import fs from 'node:fs';
import { applyPacks } from '../../../src/date-beta/packs/index.js';
import { loadScenes, routeTo } from '../../../src/date-beta/engine.js';
import { buildIndex, fileForLine, norm } from '../../../src/date-beta/voice/voice.js';
const ROOT = new URL('../../../', import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, ROOT), 'utf8'));
const main = fs.readFileSync(new URL('src/date-beta/main.jsx', ROOT), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(main)[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const sc = loadScenes(applyPacks(read('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`src/date-beta/packs/${n}.json`) }))));
const slim = read('src/date-beta/voice/manifest.json'), idx = buildIndex(slim);
sc.forEach((s, i) => {
  if (i && !routeTo(sc, i).length) return;
  s.beats.forEach((b, j) => {
    const texts = [];
    if (b.line?.plain) texts.push(['base', b.line.plain]);
    for (const [f, vals] of Object.entries(b.vary ?? {})) for (const [v, ov] of Object.entries(vals)) if (ov.text) texts.push([`${f}=${v}`, ov.text]);
    for (const [k, t] of texts) {
      const f = fileForLine(idx, s.id, t);
      if (!f) {
        const near = slim.filter((e) => e.scene === s.id && /narration/.test(e.file) && String(e.beat).startsWith(`N ${j}`));
        console.log(`SILENT ${s.id}:${j} ${k} "${t}"${near.length ? '  | take says: ' + near.map((e) => `"${e.text}"`).join(' / ') : ''}`);
      }
    }
  });
});
