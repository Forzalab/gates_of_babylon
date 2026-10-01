// Reviewer A: the list of (scene, beat, choice) to shoot for the branch traverse: every reachable beat with 2+ choices,
// minus GAME / lock beats (shot in routes A and endings). Writes <outdir>/choices.json with the expected react + go.
import fs from 'node:fs';
import { applyPacks } from '../../../src/date-beta/packs/index.js';
import { loadScenes, routeTo, resolveGo } from '../../../src/date-beta/engine.js';
const ROOT = new URL('../../../', import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, ROOT), 'utf8'));
const main = fs.readFileSync(new URL('src/date-beta/main.jsx', ROOT), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(main)[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const sc = loadScenes(applyPacks(read('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`src/date-beta/packs/${n}.json`) }))));
const out = [];
sc.forEach((s, i) => {
  if (i && !routeTo(sc, i).length) return;
  s.beats.forEach((b, j) => {
    if (!b.choices || b.choices.length < 2 || b.props?.secs && b.bg === 'shop-game' || b.bg === 'lock-game') return;
    b.choices.forEach((c, k) => out.push({ scene: s.id, beat: j, k, plain: c.plain, love: c.love, react: c.react?.plain ?? c.react ?? null,
      go: resolveGo(c.go, { ...(c.set ?? {}) }) ?? null, fake: !!c.fake }));
  });
});
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(out.length, 'choices');
