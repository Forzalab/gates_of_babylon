import fs from 'fs';
const W = '/home/user/gates_of_babylon/.claude/worktrees/agent-a35b0a88943dc6b78/';
const { applyPacks } = await import(W + 'src/date-beta/packs/index.js');
const R = (p) => JSON.parse(fs.readFileSync(W + 'src/date-beta/' + p));
const d = applyPacks(R('scenes.json'), ['story', 'meta', 'mech', 'lockgame', 'obbp'].map((n) => R('packs/' + n + '.json')));
fs.writeFileSync(W + 'research/sprint-0930/alt-test/graph.json', JSON.stringify(d, null, 1));
console.log(JSON.stringify(d.flags), JSON.stringify(d.love));
for (const s of d.scenes) {
  console.log('\n##', s.id, s.beats.length, 'beats');
  s.beats.forEach((b, i) => {
    let l = `${i}: ${b.speaker || ''} ${(b.text || '').slice(0, 60)}${b.end ? ' END:' + b.end : ''}${b.timer ? ' T' + b.timer : ''}`;
    if (b.choices) l += '\n     ' + b.choices.map((c) => `[${c.text}|love${c.love ?? 0}|${c.emote || ''}|${JSON.stringify(c.go || '')}|${JSON.stringify(c.set || '')}${c.if ? '|if' + JSON.stringify(c.if) : ''}${c.default ? '|D' : ''}${c.fake ? '|fake' : ''}]`).join(' ');
    console.log(l);
  });
}
