// B-03: the win card (100%) must be reachable on every errand x food route of the shipped play packs, and an all-worst run must not win.
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPacks } from './date-beta/packs/index.js';
import { loadScenes, enabled, resolveGo, start, next, choose, beatAt, ending, timeoutPick } from './date-beta/engine.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';
import story from './date-beta/packs/story.json' with { type: 'json' };
import meta from './date-beta/packs/meta.json' with { type: 'json' };
import mech from './date-beta/packs/mech.json' with { type: 'json' };
import lockgame from './date-beta/packs/lockgame.json' with { type: 'json' };
import obbp from './date-beta/packs/obbp.json' with { type: 'json' };
import sequences from './date-beta/packs/sequences.json' with { type: 'json' };
import v2 from './date-beta/packs/variant-v2.json' with { type: 'json' };
import sceneA from './date-beta/packs/scene-a.json' with { type: 'json' };
import love from './date-beta/packs/love.json' with { type: 'json' };

const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];
const S = loadScenes(applyPacks(base, [story, meta, mech, lockgame, obbp, sequences, v2, sceneA, love]), { manifest, art: [...ART_NAMES, ...ROMANCE, 'lock-game'] });
const goal = S.love.goal;

// Best total love per errand x food route (same walk as the loader's goal, but keyed by the flags at the ending).
function maxByRoute() {
  const first = S[0].id, index = new Map(S.map((sc, i) => [sc.id, i])), seen = new Set(), out = {};
  const land = (flags, love) => { const k = `${flags.errand}/${flags.food}`; out[k] = Math.max(out[k] ?? 0, love); };
  const visit = (s, b, flags, love) => {
    while (s < S.length && b >= S[s].beats.length) { s += 1; b = 0; }
    if (s >= S.length) return land(flags, love);
    const beat = S[s].beats[b];
    if (beat.set) flags = { ...flags, ...beat.set };
    if (beat.end) return land(flags, love);
    const key = `${s}/${b}/${JSON.stringify(flags)}/${love}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (!beat.choices) visit(s, b + 1, flags, love);
    for (const c of beat.choices ?? []) {
      if (!enabled(c, flags)) continue;
      const f = c.set ? { ...flags, ...c.set } : flags, l = Math.max(0, love + c.love), go = resolveGo(c.go, f);
      if (go === first) land(f, l); else if (go) visit(index.get(go), 0, f, l); else visit(s, b + 1, f, l);
    }
  };
  visit(0, 0, {}, S.love.start);
  return out;
}

test('B-03: every errand x food route can reach 100%', () => {
  const routes = maxByRoute();
  for (const errand of ['groceries', 'library']) for (const food of ['butter', 'katsu']) {
    const best = routes[`${errand}/${food}`];
    assert.ok(best != null, `no route ${errand}/${food}`);
    assert.ok(best >= goal, `${errand}/${food} tops out at ${best}/${goal}`);
  }
});

test('B-03: an all-worst run stays below 100%', () => {
  let p = start(S);
  for (let n = 0; n < 400; n++) {
    const b = beatAt(S, p);
    if (b.end) break;
    if (p.react || !b.choices) { p = next(S, p); continue; }
    let i = 0;
    b.choices.forEach((c, k) => { if (enabled(c, p.flags) && (!enabled(b.choices[i], p.flags) || c.love < b.choices[i].love)) i = k; });
    p = choose(S, p, i);
  }
  const e = ending(S, p);
  assert.ok(e && e.pct < 100, `all-worst ended at ${e?.pct}%`);
});

// Love audit: with every pick changing the score, a run that lets every timer run out (default picks) and one that always
// takes the last enabled option still cannot win. The goal stays reachable on every route (test above).
for (const [name, pickOf] of [
  ['every timer running out (default picks)', (b, flags) => timeoutPick(b, flags)],
  ['always the last enabled option', (b, flags) => b.choices.reduce((last, c, k) => (enabled(c, flags) ? k : last), 0)],
]) {
  test(`love audit: ${name} never reaches 100%`, () => {
    let p = start(S);
    for (let n = 0; n < 400; n++) {
      const b = beatAt(S, p);
      if (b.end) break;
      if (p.react || !b.choices) { p = next(S, p); continue; }
      p = choose(S, p, pickOf(b, p.flags));
    }
    const e = ending(S, p);
    assert.ok(e && e.pct < 100, `${name} ended at ${e?.pct}%`);
  });
}
