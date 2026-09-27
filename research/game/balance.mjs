// research/game/balance.mjs: headless balance check of the bagging-area rules (no browser).
// node research/game/balance.mjs  -> for a random and a greedy player: run length, 7/7 wins, identity shares, ending spread.
import * as R from '../../src/date/game/rules.js';

function runOne(seed, mode) {
  const r = R.rng(seed); let cols = R.emptyGrid(); const merges = []; let drops = 0;
  while (!R.overflow(cols) && drops < 400) {
    const g = R.gate(R.randomType(r)); let c;
    if (mode === 'random') { do { c = Math.floor(r() * 7); } while (!R.canDrop(cols, c)); }
    else {
      let best = -1e9;
      for (let k = 0; k < 7; k++) {
        if (!R.canDrop(cols, k)) continue;
        const p = R.preview(cols, k, g.t);
        const sc = (p.pairs.some((x) => x.glow) ? 10 : 0) - p.pairs.filter((x) => !x.glow).length * 2 - cols[k].length * 0.5 + r();
        if (sc > best) { best = sc; c = k; }
      }
    }
    const res = R.dropAndResolve(cols, c, g, r); cols = res.cols; merges.push(...res.merges); drops++;
    if (Object.keys(R.countIdentities(merges)).length === 7) break;
  }
  return { drops, merges, over: R.overflow(cols) };
}
for (const mode of ['random', 'greedy']) {
  const base = {}, ends = {}; let drops = 0, wins = 0;
  for (let s = 1; s <= 300; s++) {
    const o = runOne(s, mode); drops += o.drops; if (!o.over) wins++;
    const c = R.countIdentities(o.merges);
    for (const k in c) base[k] = (base[k] || 0) + c[k];
    const e = R.pickEnding(c); ends[e] = (ends[e] || 0) + 1;
  }
  const tot = Object.values(base).reduce((a, b) => a + b, 0);
  console.log(mode, 'avg drops', (drops / 300).toFixed(1), '7/7 wins', wins, '/300');
  console.log('  share', JSON.stringify(Object.fromEntries(Object.entries(base).map(([k, v]) => [k, +(v / tot).toFixed(3)]))));
  console.log('  endings', JSON.stringify(ends));
}
