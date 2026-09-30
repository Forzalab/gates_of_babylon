// node research/sprint-0930/story/check-pack.mjs [pack.json]
import fs from 'node:fs';
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const base = read('src/date-beta/scenes.json');
const pack = read(process.argv[2] || 'src/date-beta/packs/story.json');
const beats = new Map(base.scenes.map((s) => [s.id, s.beats.length]));
for (const s of pack.scenes) beats.set(s.id, s.beats.length);
const errs = [];
const need = (id, where) => { if (!beats.has(id)) errs.push(`${where}: unknown scene ${id}`); };
for (const i of pack.insert) { need(i.after, 'insert.after'); i.ids.forEach((x) => need(x, 'insert.ids')); }
for (const p of pack.patch) {
  need(p.scene, 'patch');
  if (beats.has(p.scene) && p.beat >= beats.get(p.scene)) errs.push(`patch ${p.scene}[${p.beat}] out of range`);
}
for (const s of pack.scenes) s.beats.forEach((b, n) => {
  if (b.choices && b.choices.length > 3) errs.push(`${s.id}[${n}] >3 choices`);
  (b.choices || []).forEach((c) => c.go && need(c.go, `${s.id}[${n}].go`));
});
for (const p of pack.patch) {
  const c = p.set.choices || [];
  if (c.length > 3) errs.push(`patch ${p.scene}[${p.beat}] >3 choices`);
  c.forEach((x) => x.go && need(x.go, `patch ${p.scene}[${p.beat}].go`));
}
console.log(errs.length ? errs.join('\n') : 'pack ok', `(${pack.scenes.length} scenes, ${pack.patch.length} patches)`);
process.exit(errs.length ? 1 : 0);
