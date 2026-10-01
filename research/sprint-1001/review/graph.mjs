// Reviewer A graph dump: every scene, beat, choice (go/if/love/react), stamp, as the shipped PLAY packs build it.
// node research/sprint-1001/review/graph.mjs [out.txt]
import fs from 'node:fs';
import { applyPacks } from '../../../src/date-beta/packs/index.js';
import { loadScenes, routeTo } from '../../../src/date-beta/engine.js';
const ROOT = new URL('../../../', import.meta.url);
const read = (p) => JSON.parse(fs.readFileSync(new URL(p, ROOT), 'utf8'));
const main = fs.readFileSync(new URL('src/date-beta/main.jsx', ROOT), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(main)[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const data = applyPacks(read('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`src/date-beta/packs/${n}.json`) })));
const sc = loadScenes(data);
const out = [];
sc.forEach((s, i) => {
  const reach = i === 0 || routeTo(sc, i).length > 0;
  out.push(`## [${i}] ${s.id} short=${s.short} ${s.ending ? 'ENDING' : ''} ${reach ? '' : 'UNREACHABLE'} route=${routeTo(sc, i).join('>')} defaults=${JSON.stringify(s.defaults ?? {})}`);
  s.beats.forEach((b, j) => {
    const p = b.props ?? {};
    out.push(`  ${s.id}:${j} [${b.wait}${b.timer ? ' t' + b.timer : ''}${b.auto ? ' auto' + b.auto : ''}] bg=${b.bg} shot=${p.shot ?? ''}${p.place ? ' ' + p.place + ' ' + p.time + (p.fixed ? ' fixed' : '') : ''} ${b.line?.who ?? b.speaker ?? ''}: ${b.text ?? b.line?.plain ?? ''}${b.vary ? ' VARY' + JSON.stringify(b.vary).slice(0, 400) : ''}${b.end ? ' END=' + JSON.stringify(b.end) : ''}${b.game ? ' GAME=' + JSON.stringify(b.game).slice(0, 80) : ''}${b.if ? ' IF=' + JSON.stringify(b.if) : ''}`);
    (b.choices ?? []).forEach((c, k) => out.push(`     c${k} [${c.side}${c.default ? ' default' : ''}${c.fake ? ' FAKE' : ''}] love=${c.love ?? ''} go=${JSON.stringify(c.go ?? null)} if=${JSON.stringify(c.if ?? null)} set=${JSON.stringify(c.set ?? null)} "${c.plain}" -> react: ${c.react?.plain ?? c.react ?? ''}`));
  });
});
fs.writeFileSync(process.argv[2] ?? '/dev/stdout', out.join('\n') + '\n');
