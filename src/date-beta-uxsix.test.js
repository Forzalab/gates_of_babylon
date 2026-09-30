// ux-six (sprint 0930): endings route to their own card, steeped has no lone OR beat, offstage Nanda keeps the HUD in
// unknown / escape / lock game, stamps (kitchen stand-up, escape-win, clock moves on "Minutes gone"), synonym pairs
// differ in her reaction, one pick never swings the meter more than 25% of the goal.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, start, next, choose, beatAt, ending, present, sceneIndex, swingCap } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { cardFor } from './date-beta/endcard.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const MAIN = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
const PLAY = JSON.parse(MAIN.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const pack = (n) => ({ name: n, ...JSON.parse(readFileSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url), 'utf8')) });
const S = loadScenes(applyPacks(base, PLAY.map(pack)), { manifest });
const sc = (id) => S[sceneIndex(S, id)];
const at = (id, b = 0, extra = {}) => ({ s: sceneIndex(S, id), b, done: false, flags: {}, love: 0, path: [], ...extra });

test('ux-six: ux-six is in PLAY, before gacha', () => {
  assert.ok(PLAY.includes('ux-six'));
  assert.equal(PLAY.at(-1), 'gacha');
});

test('ux-six 1: lock-game win goes to escape-win and its end beat shows the ESCAPE ending card at low love, never GAME OVER', () => {
  const esc = sc('escape'), lock = esc.beats.findIndex((b) => b.bg === 'lock-game');
  assert.ok(lock > 0);
  const lb = esc.beats[lock];
  // LockGame: win -> onPick(props.win), timeout -> onPick(props.lose)
  assert.equal(lb.choices[lb.props.win].go, 'escape-win');
  assert.equal(lb.choices[lb.props.lose].go, 'escape-timeout');
  assert.ok(lb.choices[lb.props.win].pass && lb.choices[lb.props.lose].pass, 'no reaction frame over the game (it would replay)');
  for (const id of ['escape-win', 'escape-timeout', 'steeped']) {
    let p = choose(S, at('escape', lock, { love: 2 }), id === 'escape-win' ? lb.props.win : lb.props.lose);
    if (id === 'steeped') p = at('steeped');
    for (let i = 0; i < 20 && !ending(S, p); i++) p = next(S, p);
    const e = ending(S, p);
    assert.equal(e.scene, id);
    assert.equal(cardFor(e), 'ending', `${id} at ${e.pct}% shows its own ending card`);
  }
});

test('ux-six 1: steeped has no lone {OR} beat and still opens in the bedroom', () => {
  const st = sc('steeped');
  assert.ok(!st.beats.some((b) => b.line.plain.trim() === 'OR'));
  assert.equal(st.beats[0].bg, 'bedroom');
});

test('ux-six 4: unknown + escape are offstage: HUD present, no NANDA speaker, voice from above', () => {
  for (const id of ['unknown', 'escape']) {
    const s = sc(id);
    assert.equal(s.offstage, true);
    assert.ok(present(s, s.beats[0]));
  }
  assert.ok(sc('unknown').beats.some((b) => b.line.who === 'NANDA (UPSTAIRS)'));
  assert.ok(sc('escape').beats.some((b) => b.line.who === 'NANDA (ABOVE)'));
  assert.match(MAIN, /AUTO_LINE = '⏳ Her clock is running…'/);
});

test('ux-six 2: the cute-synonym pairs differ in her reaction (react + emote), not only the number', () => {
  const pairs = [['unknown', 'Open the hatch'], ['unknown', 'Climb down'], ['escape', 'Look at the shelves'], ['escape', 'Keep looking']];
  for (const [id, first] of pairs) {
    const b = sc(id).beats.find((x) => x.choices?.[0].text === first);
    const [a, c] = b.choices;
    assert.ok(a.react && c.react && a.react.plain !== c.react.plain, `${id}: ${first}`);
    assert.notEqual(a.emote, c.emote);
    assert.notEqual(a.love, c.love);
  }
});

test('ux-six 3: stamps on the kitchen stand-up + escape-win; the basement clock moves forward on "Minutes gone"', () => {
  assert.equal(sc('unknown').beats[0].props.shot, 'stamp');
  assert.equal(sc('escape-win').beats[0].props.shot, 'stamp');
  const esc = sc('escape').beats;
  const t0 = esc[0].props.time, gone = esc.find((b) => /^Minutes gone/.test(b.text));
  assert.equal(gone.props.shot, 'stamp');
  assert.notEqual(gone.props.time, t0);
});

test('ux-six 6: one pick never moves the meter more than 25% of the goal (pity love-bomb included)', () => {
  const cap = swingCap(S.love.goal);
  assert.ok(cap <= Math.max(5, Math.floor(S.love.goal / 4)));
  let p = start(S, { force: 'pity', seed: 3 });
  for (let i = 0; i < 400 && !p.done; i++) {
    const b = beatAt(S, p);
    const was = p.love;
    p = b.choices ? choose(S, p, 0) : next(S, p);
    if (p.react) assert.ok(Math.abs(p.love - was) <= cap, `swing ${p.love - was} > ${cap}`);
    if (ending(S, p)) break;
  }
});
