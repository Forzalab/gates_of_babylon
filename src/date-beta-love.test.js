// Love score + HUD contract (research/date-beta-mockups/hud/SPEC.txt, SCENES.md "Love"): loader rules, the goal walk,
// scoring + clamp, the reaction frame, the deferred pop, skip scoring, ending tiers, "present", the route trail.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, startAt, next, skip, choose, beatAt, emoteFor, lovePct, tierFor, ending, present, reactView,
  trail, clampLove, jumpTo, canAdvance, MIN_HOLD } from './date-beta/engine.js';
import data from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };
import { ART_NAMES } from './date-beta-art-names.js';

const S = loadScenes(data, { manifest, art: ART_NAMES });
const tiny = (beats, extra = {}) => ({ scenes: [{ id: 'a', bg: 'x', beats, ...extra }] });
const one = (choice) => tiny([{ choices: [{ text: 'a', ...choice }] }]);
const id = (p) => S[p.s].id;

// Walk the shipped script from scene 1: at each choice beat take the label from `picks` (a map "scene:beat" -> label),
// else the first choice. Returns the position on the ending title beat.
function play(picks = {}, { bento = 'tamagoyaki', rm = false } = {}) {
  let p = start(S, { rm });
  for (let n = 0; n < 300; n++) {
    const b = beatAt(S, p);
    if (b.end) return p;
    if (p.react || !b.choices) { p = next(S, p, rm); continue; }
    const want = b.choices.some((c) => c.set?.bento) ? `Take the ${bento}` : picks[`${id(p)}:${p.b}`];
    const i = want == null ? 0 : b.choices.findIndex((c) => c.plain === want);
    assert.ok(i >= 0, `no choice "${want}" at ${id(p)}:${p.b}`);
    p = choose(S, p, i, rm);
  }
  assert.fail('no ending');
}

test('love loader: love is a whole number -5..+5; emote / react / tell need a non-zero love', () => {
  for (const love of [6, -6, 1.5, '2']) assert.throws(() => loadScenes(one({ love })), /love .* must be a whole number -5\.\.5/);
  assert.doesNotThrow(() => loadScenes(one({ love: -5 })));
  assert.throws(() => loadScenes(one({ emote: 'heart' })), /need a non-zero love/);
  assert.throws(() => loadScenes(one({ love: 0, react: 'Hi.' })), /need a non-zero love/);
  assert.throws(() => loadScenes(one({ tell: false })), /need a non-zero love/);
  assert.throws(() => loadScenes(one({ love: 1, emote: 'wink' })), /emote "wink" is not one of heart\|hearts\|sweat\|pout\|or\|crack/);
  assert.throws(() => loadScenes(one({ love: 1, tell: 'no' })), /tell must be true or false/);
  assert.throws(() => loadScenes(one({ love: 1, react: '' })), /react must be a non-empty string/);
  assert.throws(() => loadScenes(one({ love: 1, react: Array.from({ length: 31 }, (_, i) => 'w' + i).join(' ') })), /react has 31 words, max 30/);
  assert.throws(() => loadScenes({ flags: { bento: ['umeboshi', 'tamagoyaki'] }, ...one({ love: 1, react: 'You ate the umeboshi.' }) }), /react: "umeboshi" is an echo word/);
  assert.throws(() => loadScenes(one({ love: 1, react: 'f{or}ever' })), /stray brace/);
});

test('love loader: emote defaults from love; react is her line; tell defaults on for a scored pick', () => {
  assert.deepEqual([5, 3, 2, 1, 0, -1, -2, -3, -5].map(emoteFor), ['hearts', 'hearts', 'heart', 'sweat', null, 'pout', 'or', 'crack', 'crack']);
  const [c] = loadScenes(one({ love: -2, react: 'Sit. {OR} stay.' }))[0].beats[0].choices;
  assert.equal(c.emote, 'or');
  assert.equal(c.react.who, 'NANDA');
  assert.equal(c.react.hasOr, true);
  assert.equal(c.tell, true);
  const [z] = loadScenes(one({}))[0].beats[0].choices;
  assert.deepEqual([z.love, z.emote, z.react, z.tell], [0, null, null, false]);
  assert.equal(loadScenes(one({ love: 2, emote: 'hearts', tell: false }))[0].beats[0].choices[0].emote, 'hearts');
});

test('love loader: scene nanda / short, beat card / end, root love keys', () => {
  assert.throws(() => loadScenes(tiny([{}], { nanda: 'yes' })), /"nanda" must be true or false/);
  assert.throws(() => loadScenes(tiny([{}], { short: 'rooftop' })), /short "rooftop" must be 1-8 uppercase/);
  assert.throws(() => loadScenes(tiny([{}], { short: 'TOOLONGNAME' })), /1-8 uppercase/);
  assert.throws(() => loadScenes(tiny([{ card: 'intro' }])), /card "intro" is not one of goal/);
  assert.throws(() => loadScenes(tiny([{ card: 'goal', choices: [{ text: 'a' }] }])), /a card beat waits for a click/);
  assert.throws(() => loadScenes(tiny([{ card: 'goal', auto: 900 }])), /a card beat waits for a click/);
  assert.throws(() => loadScenes(tiny([{ end: 'steeped' }])), /an end beat needs its "Back to start" choice/);
  assert.throws(() => loadScenes(tiny([{ end: 'STEEPED', choices: [{ text: 'a' }] }])), /end must be a lowercase ending name/);
  assert.throws(() => loadScenes({ ...tiny([{}]), love: { start: 0, max: 3 } }), /unknown love key "max"/);
  assert.throws(() => loadScenes({ ...tiny([{}]), love: { start: -1 } }), /love.start must be a whole number/);
  assert.throws(() => loadScenes({ ...tiny([{}]), love: { goal: 'most' } }), /love.goal must be "auto" or a whole number/);
  const [a] = loadScenes(tiny([{ text: 'NANDA: hi' }, { choices: [{ text: 'x' }], end: 'leave' }]));
  assert.deepEqual([a.nanda, a.short, a.ending], [true, 'END', true]);
  const [b] = loadScenes({ scenes: [{ id: 'genkan-in', bg: 'x', beats: [{ text: 'MC: hi' }] }] });
  assert.deepEqual([b.nanda, b.short, b.ending], [false, 'GENKAN I', false]);
});

test('love goal: "auto" = the best total on any path to an ending; a written goal must equal it', () => {
  const g = {
    scenes: [
      { id: 'a', bg: 'x', beats: [{ choices: [{ text: 'up', love: 3 }, { text: 'down', love: -3 }] },
        { choices: [{ text: 'go b', love: 1, go: 'b' }, { text: 'go c', love: 5, go: 'c' }] }] },
      { id: 'b', bg: 'x', beats: [{ choices: [{ text: 'home', go: 'a' }], end: 'escape' }] },
      { id: 'c', bg: 'x', beats: [{ choices: [{ text: 'meh', love: -4 }] }, { choices: [{ text: 'home', go: 'a' }], end: 'leave' }] },
    ],
  };
  // up then b: 3+1 = 4. up then c: 3+5-4 = 4. down (clamps to 0) then b: 1, then c: 5-4 = 1. Ending b and c are both 4.
  assert.equal(loadScenes(g).love.goal, 4);
  assert.deepEqual(loadScenes({ ...g, love: { start: 0, goal: 4 } }).love, { start: 0, goal: 4 });
  assert.throws(() => loadScenes({ ...g, love: { goal: 12 } }), /love.goal is 12 but the best reachable score is 4/);
  assert.equal(loadScenes({ ...g, love: { start: 2 } }).love.goal, 6, 'the walk starts at love.start');
});

test('love goal: the walk follows flags (if / go conditions) and clamps at 0 like play', () => {
  const g = {
    scenes: [
      { id: 'a', bg: 'x', beats: [{ choices: [{ text: 'brave', set: { brave: true }, love: -4 }, { text: 'shy', love: 1 }] },
        { choices: [{ text: 'kiss', if: { brave: true }, love: 5 }, { text: 'wave', love: 0 }] }] },
    ],
  };
  // brave: -4 clamps to 0, then kiss +5 = 5. shy: 1, kiss disabled, wave = 1.
  assert.equal(loadScenes(g).love.goal, 5);
  assert.throws(() => loadScenes({ scenes: [{ id: 'a', bg: 'x', beats: [{ choices: [{ text: 'again', love: 1, go: 'b' }] }] },
    { id: 'b', bg: 'x', beats: [{ choices: [{ text: 'back', go: 'b' }] }] }] }), /loops back here/);
  assert.deepEqual(loadScenes(tiny([{}])).love, { start: 0, goal: 0 }, 'no love anywhere = goal 0 (no HUD score)');
});

test('love goal: the shipped script tops out at 16 and only the STEEPED route reaches it', () => {
  assert.deepEqual(S.love, { start: 0, goal: 16 });
  assert.equal(data.love.goal, 'auto');
  const best = { steeped: 0, escape: 0, leave: 0 };
  const walk = (p) => {
    for (;;) {
      const b = beatAt(S, p);
      if (b.end) { best[b.end] = Math.max(best[b.end], p.love); return; }
      if (p.react || !b.choices) { p = next(S, p); continue; }
      b.choices.forEach((_, i) => walk(choose(S, p, i)));
      return;
    }
  };
  walk(start(S));
  assert.deepEqual(best, { steeped: 16, escape: 12, leave: 8 });
  assert.deepEqual(Object.values(best).map((n) => tierFor(lovePct(n, 16))), ['win', 'almost', 'low']);
});

test('love scoring: a pick adds its love, clamped 0..goal; a go back to scene 1 starts a new run at love 0', () => {
  const g = loadScenes({ scenes: [
    { id: 'a', bg: 'x', nanda: true, beats: [{ choices: [{ text: 'up', love: 4 }, { text: 'down', love: -5 }] }, { choices: [{ text: 'more', love: 3 }] },
      { choices: [{ text: 'again', go: 'a' }], end: 'steeped' }] }] });
  assert.equal(g.love.goal, 7);
  let p = start(g);
  assert.equal(p.love, 0);
  const down = next(g, choose(g, p, 1));
  assert.equal(down.love, 0, 'clamped at 0');
  p = next(g, choose(g, p, 0));
  assert.equal(p.love, 4);
  p = next(g, choose(g, p, 0));
  assert.equal(p.love, 7);
  assert.equal(clampLove(12, 7), 7);
  assert.equal(clampLove(-3, 7), 0);
  const again = choose(g, p, 0);
  assert.deepEqual([again.s, again.b, again.love, again.react], [0, 0, 0, undefined]);
  assert.equal(startAt(g, { love: 99 }).love, 7, '?love= is clamped too');
});

test('love reaction frame: a scored pick where she is present returns pos.react; next() closes it, then play goes on', () => {
  const p0 = startAt(S, { at: 'cup' });
  assert.equal(beatAt(S, p0).choices?.length, 2);
  const p = choose(S, { ...p0, love: 9 }, 1); // "I'm not hungry" -1 pout
  assert.deepEqual({ ...p.react }, { love: -1, from: 9, to: 8, emote: 'pout', line: p.react.line, tell: true, s: p0.s, b: 0 });
  assert.equal(p.react.line.plain, 'You will be. Later.');
  assert.equal(p.love, 8);
  const v = reactView(S, p);
  assert.deepEqual([v.choices, v.timer, v.wait, v.hold, v.sfx, v.line.who, v.bg], [null, null, 'click', MIN_HOLD, null, 'NANDA', 'BG-D2']);
  assert.equal(canAdvance(v, MIN_HOLD - 1), false);
  assert.equal(canAdvance(v, MIN_HOLD), true);
  assert.equal(ending(S, p), null);
  const q = next(S, p);
  assert.equal(q.react, undefined);
  assert.deepEqual([id(q), q.b, q.love], ['cup', 1, 8], 'the frame closes onto the beat the pick went to');
  const noLine = choose(S, startAt(S, { at: 'door', beat: 3 }), 1); // Say goodnight: no react line = the question stays
  assert.equal(reactView(S, noLine).line.plain, 'I already boiled the water. This morning. Just in case.');
  assert.equal(id(noLine), 'leave', 'the pick already jumped; only the frame shows the door');
  assert.equal(trail(S, noLine).stops.find((x) => x.state === 'here').id, 'door');
  assert.equal(skip(S, noLine).react, undefined, 'Esc on the frame just closes it');
});

test('love deferred pop: a pick where she is absent scores at once; the pop waits for the next beat she is present on', () => {
  const door = startAt(S, { at: 'escape', beat: 13 });
  assert.equal(present(S[door.s], beatAt(S, door)), false, 'the basement: she is not there');
  const p = choose(S, { ...door, love: 5 }, 1); // Leave her house -3
  assert.equal(p.react, undefined);
  assert.equal(p.love, 2);
  assert.deepEqual([p.pending.love, p.pending.emote], [-3, 'crack']);
  assert.equal(id(p), 'escape-win');
  assert.equal(present(S[p.s], beatAt(S, p)), true);
  const q = next(S, p);
  assert.equal(q.pending, undefined, 'spent once shown on a present beat');
  // carried across a blackout beat: pending stays until she is on screen
  const g = loadScenes({ scenes: [
    { id: 'a', bg: 'x', nanda: false, beats: [{ choices: [{ text: 'x', love: 2, go: 'b' }] }] },
    { id: 'b', bg: 'blackout', nanda: true, beats: [{}, { bg: 'y', text: 'NANDA: hi' }, {}] }] });
  let r = choose(g, start(g), 0);
  assert.equal(r.pending.love, 2);
  r = next(g, r);
  assert.equal(r.pending.love, 2, 'still waiting through the blackout beat');
  r = next(g, r);
  assert.equal(r.pending, undefined);
});

test('love skip: skipped picks score as the timer would pick them (default, else pink); no free points', () => {
  // Rooftop from the top: bento (default = umeboshi +1), draft C (no default = pink +1), stay (default Stay +3).
  const p = skip(S, start(S));
  assert.deepEqual([id(p), p.love, p.flags.bento], ['train', 5, 'umeboshi']);
  // Skip lands on a branch without taking it: nothing scored on the landing beat.
  const d = skip(S, startAt(S, { at: 'door' }));
  assert.deepEqual([id(d), d.b, d.love], ['door', 3, 2], 'door draft A (pink +2) skipped over, the tea branch waits');
  assert.equal(skip(S, d), d, 'already on the branch: nothing');
  // Scene with a disabled default: the other enabled choice scores.
  const g = loadScenes({ scenes: [
    { id: 'a', bg: 'x', beats: [{ choices: [{ text: 'kiss', default: true, if: { brave: true }, love: 5 }, { text: 'wave', love: 2 }] }] },
    { id: 'b', bg: 'x', beats: [{}] }] });
  assert.equal(skip(g, start(g)).love, 2);
  assert.equal(skip(g, start(g)).s, 1);
});

test('love endings: 100% = win, 60..99% = almost, below 60% = low; 100 only when full', () => {
  assert.equal(lovePct(16, 16), 100);
  assert.equal(lovePct(15, 16), 94);
  assert.equal(lovePct(199, 200), 99, 'a near miss never rounds up to 100');
  assert.equal(lovePct(0, 16), 0);
  assert.equal(lovePct(3, 0), 0);
  assert.deepEqual([100, 99, 60, 59, 0].map(tierFor), ['win', 'almost', 'almost', 'low', 'low']);
  const end = startAt(S, { at: 'steeped', beat: 4 });
  assert.equal(beatAt(S, end).end, 'steeped');
  const at = (love) => ending(S, { ...end, love });
  assert.deepEqual({ ...at(16) }, { kind: 'steeped', scene: 'steeped', pct: 100, tier: 'win', love: 16, goal: 16 });
  assert.equal(at(15).tier, 'almost');
  assert.equal(at(10).pct, 63);
  assert.equal(at(10).tier, 'almost');
  assert.equal(at(9).pct, 56);
  assert.equal(at(9).tier, 'low');
  assert.equal(ending(S, startAt(S, { at: 'steeped' })), null, 'only on the end beat');
  for (const e of ['escape-win', 'escape-timeout', 'leave-fu', 'leave-yeah']) {
    const b = S.find((x) => x.id === e).beats.at(-1);
    assert.ok(b.end && b.choices[0].go === 'rooftop', e);
  }
});

test('love playthrough: the all-pink STEEPED run fills her heart; umeboshi and a timer default miss it', () => {
  const win = play({ 'door:3': 'Just one cup', 'cup:3': 'Drink' });
  assert.deepEqual([id(win), win.love, ending(S, win).tier], ['steeped', 16, 'win']);
  const ume = play({}, { bento: 'umeboshi' });
  assert.deepEqual([ume.love, ending(S, ume).pct, ending(S, ume).tier], [14, 88, 'almost']);
  const low = play({ 'door:3': 'Say goodnight', 'leave:3': "FUCK YOU. I'm leaving" });
  assert.deepEqual([id(low), low.love, ending(S, low).tier], ['leave-fu', 2, 'low']);
  const rm = play({ 'door:3': 'Just one cup', 'cup:3': 'Drink' }, { rm: true });
  assert.equal(rm.love, 16, 'reduced motion scores the same');
});

test('love present: the bar and the sprite follow the scene flag; blackout beats hide her', () => {
  const on = S.filter((sc) => sc.nanda).map((sc) => sc.id);
  assert.deepEqual(on, ['rooftop', 'underpass', 'apartment', 'door', 'cup', 'steeped', 'escape-win', 'escape-timeout', 'leave', 'leave-fu', 'leave-yeah']);
  const win = S.find((x) => x.id === 'escape-win');
  assert.equal(present(win, win.beats[4]), false, 'the blackout beat inside escape-win');
  assert.equal(present(win, win.beats[0]), true);
  assert.equal(present(S[1], S[1].beats[0]), false, 'train');
});

test('love trail: done stops, here with beat pips, the shortest way to an ending; ?scene= fills the route before it', () => {
  const t = trail(S, start(S));
  assert.deepEqual(t.stops.map((x) => `${x.short}:${x.state}${x.end ? '♥' : ''}`),
    ['ROOF:here', 'TRAIN:next', 'STATION:next', 'NIGHT:next', 'STATION:next', 'NIGHT:next', 'HER HOME:next', 'HER HOME:next', 'LEAVE:next', 'END:next♥']);
  assert.deepEqual([t.beat, t.beats], [0, 7]);
  const cup = startAt(S, { at: 'cup', beat: 2 });
  const c = trail(S, cup);
  assert.equal(c.stops.filter((x) => x.state === 'done').length, 9, 'rooftop .. genkan-in');
  assert.deepEqual(c.stops.slice(-2).map((x) => x.id), ['cup', 'steeped']);
  assert.deepEqual([c.beat, c.beats], [2, 4]);
  const end = trail(S, startAt(S, { at: 'leave-fu', beat: 4 }));
  assert.deepEqual(end.stops.at(-1), { id: 'leave-fu', short: 'END', state: 'here', end: true });
  const j = jumpTo(S, { s: 7, b: 3, i: 0 }, {}, false, 6);
  assert.deepEqual([id(j), j.love, j.path.at(-1)], ['genkan-in', 8, 'genkan-in']);
});
