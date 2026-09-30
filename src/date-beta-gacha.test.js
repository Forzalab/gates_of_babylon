// Gacha love (sprint 0930, research/sprint-0930/emotion-fx/SCHEMA.md): tier rules, determinism, pity, engine wiring, pack validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadGacha, rollGacha, freshLuck, nextRunLuck, unit, tierById, GACHA_FX, FACE_LAYERS } from './date-beta/gacha.js';
import { loadScenes, start, next, choose, beatAt, ending, EMOTES, swingCap, capSwing } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';
import gachaPack from './date-beta/packs/gacha.json' with { type: 'json' };

const RULES = gachaPack.gacha;
const G = loadGacha(RULES, { emotes: EMOTES });
const bad = (patch) => ({ ...structuredClone(RULES), ...patch });

test('gacha loader: the shipped rules load; every tier has an FX, face layers, a badge label', () => {
  assert.deepEqual(G.crit.map((t) => t.bonus), [10, 5]);
  assert.deepEqual(G.penalty.map((t) => t.bonus), [-5, -2]);
  assert.equal(G.pity.after, 2);
  for (const t of [...G.crit, ...G.penalty, G.pity]) {
    assert.ok(GACHA_FX.includes(t.fx), t.id);
    assert.ok(t.face.length && t.face.every((f) => FACE_LAYERS.includes(f)), t.id);
    assert.ok(/[+−-]\d/.test(t.label), `${t.id}: the badge names the signed number (colour is not the only cue)`);
  }
  // all four FX and all four face layers are used by some tier
  const all = [...G.crit, ...G.penalty, G.pity];
  assert.deepEqual([...new Set(all.map((t) => t.fx))].sort(), [...GACHA_FX].sort());
  assert.deepEqual([...new Set(all.flatMap((t) => t.face))].sort(), [...FACE_LAYERS].sort());
  assert.equal(loadGacha(null), null);
});

test('gacha loader: bad rules throw', () => {
  assert.throws(() => loadGacha(bad({ jackpot: 1 })), /unknown key "jackpot"/);
  assert.throws(() => loadGacha(bad({ seed: -1 })), /seed must be/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], bonus: -3 }] })), /bonus must be a whole number > 0/);
  assert.throws(() => loadGacha(bad({ penalty: [{ ...RULES.penalty[0], bonus: 2 }] })), /bonus must be a whole number < 0/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], bonus: 11 }] })), /outside -10\.\.\+10/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], rate: 0.7 }, { ...RULES.crit[1], rate: 0.6 }] })), /rates add up to 1\.300/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], rate: 0 }] })), /rate must be/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], fx: 'love-burst' }] })), /fx "love-burst" is not one of/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], face: ['blush'] }] })), /face must list layers/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], id: 'pity' }] })), /tier id "pity" is used twice/);
  assert.throws(() => loadGacha(bad({ pity: { ...RULES.pity, after: 0 } })), /pity\.after/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], emote: 'wink' }] }), { emotes: EMOTES }), /emote "wink"/);
  assert.throws(() => loadGacha(bad({ crit: [{ ...RULES.crit[0], label: '' }] })), /label/);
  assert.throws(() => freshLuck(G, { force: 'nope' }), /no tier "nope"/);
});

test('gacha roll: hash(seed, n) is deterministic, in [0,1), and the tier rates hold over many picks', () => {
  assert.equal(unit(930, 0), unit(930, 0));
  assert.notEqual(unit(930, 0), unit(931, 0));
  let luck = freshLuck(G, { seed: 7 });
  const count = {};
  for (let i = 0; i < 20000; i++) {
    const u = unit(7, i);
    assert.ok(u >= 0 && u < 1);
    const r = rollGacha({ ...G, pity: null }, luck, 1); // ♥ picks only, pity off
    luck = r.luck;
    count[r.tier?.id ?? 'none'] = (count[r.tier?.id ?? 'none'] ?? 0) + 1;
  }
  assert.ok(Math.abs(count.crit10 / 20000 - 0.07) < 0.01, `crit10 ${count.crit10}`);
  assert.ok(Math.abs(count.crit5 / 20000 - 0.15) < 0.01, `crit5 ${count.crit5}`);
  // same seed = same sequence
  const seq = (seed) => { let l = freshLuck(G, { seed }); return Array.from({ length: 40 }, (_, i) => { const r = rollGacha(G, l, i % 3 ? 2 : -1); l = r.luck; return r.tier?.id ?? '-'; }).join(','); };
  assert.equal(seq(12345), seq(12345));
  assert.notEqual(seq(12345), seq(12346));
});

test('gacha roll: ♥ picks crit only up, 💔 picks punish only down; 0 love never rolls', () => {
  for (let seed = 0; seed < 300; seed++) {
    const l = freshLuck(G, { seed });
    const up = rollGacha(G, l, 3), down = rollGacha(G, l, -2);
    assert.ok(up.bonus >= 0 && [null, 'crit10', 'crit5'].includes(up.tier?.id ?? null));
    assert.ok(down.bonus <= 0 && [null, 'rage', 'anger'].includes(down.tier?.id ?? null));
  }
  const l = freshLuck(G, { seed: 1 });
  assert.deepEqual(rollGacha(G, l, 0), { tier: null, bonus: 0, luck: l, u: null });
});

test('gacha pity: after 2 💔 picks in a row the next ♥ pick is the love-bomb; a ♥ pick resets the streak', () => {
  let l = freshLuck(G, { seed: 99 });
  l = rollGacha(G, l, -1).luck;
  assert.equal(l.streak, 1);
  const early = rollGacha(G, l, 2); // only 1 in a row: not armed
  assert.notEqual(early.tier?.id, 'pity');
  assert.equal(early.luck.streak, 0);
  l = rollGacha(G, rollGacha(G, early.luck, -1).luck, -3).luck;
  assert.equal(l.streak, 2);
  const bomb = rollGacha(G, l, 1);
  assert.equal(bomb.tier.id, 'pity');
  assert.equal(bomb.tier.fx, 'love-bomb');
  assert.equal(bomb.bonus, 15);
  assert.equal(bomb.luck.streak, 0);
  assert.notEqual(rollGacha(G, bomb.luck, 1).tier?.id, 'pity', 'spent once');
});

test('gacha force (?gacha=<id>): every pick of that sign lands on the tier; the other sign rolls normally', () => {
  let l = freshLuck(G, { seed: 3, force: 'rage' });
  for (let i = 0; i < 10; i++) { const r = rollGacha(G, l, -1); assert.equal(r.tier.id, 'rage'); l = r.luck; }
  assert.notEqual(rollGacha(G, l, 1).tier?.id, 'rage');
  assert.equal(nextRunLuck(l).force, 'rage');
  assert.equal(nextRunLuck(l).seed, 4);
  assert.equal(nextRunLuck(null), null);
  assert.equal(tierById(G, 'anger').bonus, -2);
});

// ---------- engine wiring (a tiny script: she is present, a ♥ and a 💔 pick, then a way home)
const tiny = (gacha, love0 = 0) => loadScenes({
  love: { start: love0 },
  gacha,
  scenes: [{ id: 'a', bg: 'x', nanda: true, beats: [
    { text: 'Pick.', choices: [{ text: 'Kind', love: 3, fx: 'love-burst' }, { text: 'Cold', love: -2, fx: 'hate-quake' }] },
    { text: 'Again.', choices: [{ text: 'Kind', love: 3 }, { text: 'Cold', love: -2 }] },
    { text: 'Again.', choices: [{ text: 'Kind', love: 3 }, { text: 'Cold', love: -2 }] },
    { text: 'Last.', choices: [{ text: 'Kind', love: 3 }, { text: 'Cold', love: -2 }] },
    { text: 'Bye.', end: 'leave', choices: [{ text: 'Back to start', go: 'a' }] },
  ] }],
});

test('engine: no root gacha = no luck on the position, base love only (old behaviour)', () => {
  const S = tiny(undefined);
  const p = start(S);
  assert.equal('luck' in p, false);
  const q = choose(S, p, 0);
  assert.equal(q.react.love, 3);
  assert.equal(q.react.gacha, undefined);
  assert.equal(q.fx.kind, 'love-burst');
});

test('engine: a forced crit adds its bonus, tags the reaction, replaces the pick fx; the goal walk ignores bonuses', () => {
  const S = tiny(RULES);
  assert.equal(S.love.goal, 12, 'goal = base love only');
  const p = start(S, { force: 'crit10' });
  const q = choose(S, p, 0);
  assert.equal(swingCap(12), 5, 'ux-six: one pick moves at most max(5, 25% of goal)');
  assert.equal(q.love, 5, '3 + 10 = 13, capped at +5 in one pick');
  assert.equal(q.react.love, 5, 'the pop shows the capped change');
  assert.deepEqual({ ...q.react.gacha, face: [...q.react.gacha.face] }, { id: 'crit10', fx: 'love-crit', face: ['sparkle'], label: 'CRITICAL +10', bonus: 10, base: 3 });
  assert.equal(q.react.emote, 'hearts');
  assert.equal(q.fx, undefined, 'the gacha FX replaces the pick fx (love-burst)');
  assert.equal(q.luck.n, 1);
});

test('engine: a penalty takes love down and clamps at 0; streak of 2 then a ♥ pick = love-bomb', () => {
  const S = tiny(RULES, 6);
  let p = start(S, { force: 'rage' });
  p = choose(S, p, 1);
  assert.equal(p.react.gacha.id, 'rage');
  assert.equal(p.love, 1, '6 - 2 - 5 = -7, capped at -5 in one pick');
  assert.equal(p.react.love, -5);
  p = choose(S, next(S, p), 1);
  assert.equal(p.luck.streak, 2);
  const before = next(S, p).love;
  p = choose(S, next(S, p), 0);
  assert.equal(p.react.gacha.id, 'pity');
  assert.equal(p.react.gacha.fx, 'love-bomb');
  assert.equal(S.love.goal, 18);
  assert.equal(p.love, before + swingCap(18), 'the love-bomb 3 + 15 is capped at +swingCap');
  assert.equal(capSwing(40, 100), 25, 'cap = 25% of the goal');
  assert.equal(capSwing(-40, 100), -25);
});

test('engine: the same seed replays the same luck; a go back to scene 1 starts the next seed', () => {
  const S = tiny(RULES);
  const run = (seed) => {
    let p = start(S, { seed });
    const out = [];
    for (const i of [0, 1, 1, 0]) { p = choose(S, p, i); out.push(`${p.react.love}/${p.react.gacha?.id ?? '-'}`); p = next(S, p); }
    return { out: out.join(' '), p };
  };
  assert.equal(run(42).out, run(42).out);
  const { p } = run(42);
  assert.ok(ending(S, p));
  const again = choose(S, p, 0);
  assert.equal(again.s, 0);
  assert.deepEqual({ seed: again.luck.seed, n: again.luck.n, streak: again.luck.streak }, { seed: 43, n: 0, streak: 0 });
});

// ---------- the shipped pack
const PLAY_SRC = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
const PLAY = JSON.parse(PLAY_SRC.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const packs = Object.fromEntries(PLAY.map((n) => [n, JSON.parse(readFileSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url), 'utf8'))]));
const ROMANCE = ['street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night'];
const INTERIORS = ['cellar', 'park', 'apartment-trace', 'sitting-room', 'bedroom', 'genkan-in', 'genkan-v2']; // art/interiors (packs/interiors.json)
const ARTS = [...ART_NAMES, ...ROMANCE, ...INTERIORS, 'lock-game'];

test('pack: gacha is LAST in main.jsx PLAY; applyPacks carries it to the root; later packs replace it', () => {
  assert.equal(PLAY.at(-1), 'gacha');
  assert.equal(PLAY.at(-3), 'love', 'love keeps its final beat numbers, gacha adds no patches');
  assert.equal(PLAY.at(-2), 'ux-six', 'ux-six patches after love (its inserts never shift love\'s beat numbers)');
  assert.deepEqual(Object.keys(gachaPack).sort(), ['gacha', 'name', 'note']);
  const d = applyPacks(base, [gachaPack]);
  assert.deepEqual(d.gacha, RULES);
  assert.equal(base.gacha, undefined, 'base untouched');
  const e = applyPacks(base, [gachaPack, { gacha: { ...RULES, seed: 1 } }]);
  assert.equal(e.gacha.seed, 1);
  assert.throws(() => loadScenes(applyPacks(base, [{ gacha: { seed: 1, crit: 'x' } }])), /crit must be a list/);
});

test('pack: the full play list loads with gacha; the goal is the same as without it', () => {
  const withG = loadScenes(applyPacks(base, PLAY.map((n) => ({ name: n, ...packs[n] }))), { manifest, art: ARTS });
  const without = loadScenes(applyPacks(base, PLAY.slice(0, -1).map((n) => ({ name: n, ...packs[n] }))), { manifest, art: ARTS });
  assert.ok(withG.gacha);
  assert.equal(withG.love.goal, without.love.goal);

  // A seeded playthrough of the shipped script: always the first enabled choice, then the worst (lowest love) run.
  const play = (S, seed, side) => {
    let p = start(S, { seed });
    const tiers = [];
    for (let n = 0; n < 400; n++) {
      const b = beatAt(S, p);
      if (b.end) return { p, tiers };
      if (p.react || !b.choices) { p = next(S, p); continue; }
      const on = b.choices.map((c, k) => k).filter((k) => !b.choices[k].if || Object.entries(b.choices[k].if).every(([f, v]) => (p.flags[f] ?? null) === v));
      const i = side === 'worst' ? on.reduce((m, k) => (b.choices[k].love < b.choices[m].love ? k : m), on[0]) : on[0];
      p = choose(S, p, i);
      const r = p.react ?? p.pending;
      if (r?.gacha) tiers.push(r.gacha.id);
    }
    assert.fail('no ending');
  };
  const a = play(withG, 2026, 'first'), b = play(withG, 2026, 'first');
  assert.deepEqual(a.tiers, b.tiers, 'same seed, same tiers');
  assert.equal(a.p.love, b.p.love);
  for (let seed = 0; seed < 25; seed++) {
    const worst = play(withG, seed, 'worst');
    assert.notEqual(ending(withG, worst.p)?.tier, 'win', `seed ${seed}: an all-worst run must not win`);
  }
});
