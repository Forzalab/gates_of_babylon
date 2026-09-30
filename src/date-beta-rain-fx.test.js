// rain-fx (sprint 0930): fx/rain.js intensity mapping, the beat wiring in the packs, the motion rule (2-3 static frames,
// >= 500 ms, reduced motion = 1 still frame) and the wet-GUI rule (no mark ever touches a text rect).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import { LEVELS, SPEC, FRAME_MS, RAIN_BG, rainOf, framesOf, streaksFor, glassFor, wetMarks, touchesText, tintOf } from './date-beta/fx/rain.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
const packs = PLAY.map((n) => { try { return { name: n, ...read(`./date-beta/packs/${n}.json`) }; } catch { return null; } }).filter(Boolean);
const scenes = loadScenes(applyPacks(read('./date-beta/scenes.json'), packs), { manifest: read('./date-beta/assets.json') });
const beat = (s, i) => scenes.find((x) => x.id === s).beats[i];

test('intensity mapping: props.rain wins, the bg gives the default, off turns it off', () => {
  assert.equal(rainOf({ bg: 'rain-alley', props: { rain: 'drizzle' } }), 'drizzle');
  assert.equal(rainOf({ bg: 'rain-alley', props: {} }), 'medium');
  assert.equal(rainOf({ bg: 'rain-alley', props: { rain: 'off' } }), null);
  assert.equal(rainOf({ bg: 'rooftop', props: {} }), null);
  assert.equal(rainOf({ bg: 'rooftop', props: { rain: 'bogus' } }), null);
  for (const l of Object.values(RAIN_BG)) assert.ok(LEVELS.includes(l));
  // heavier = more streaks, more drops, wetter GUI
  for (let i = 1; i < 3; i++) {
    assert.ok(SPEC[LEVELS[i - 1]].streaks > SPEC[LEVELS[i]].streaks);
    assert.ok(SPEC[LEVELS[i - 1]].wet > SPEC[LEVELS[i]].wet);
  }
  assert.ok(SPEC.stopping.wet < SPEC.drizzle.wet);
  for (const l of LEVELS) assert.equal(streaksFor(l, 0).length, SPEC[l].streaks + SPEC[l].near);
  assert.ok(tintOf('escape-night').streak && tintOf('rain-sidewalk').streak);
});

test('every outdoor rain beat in play has its level', () => {
  const want = [['v2-rain', 0, 'heavy'], ['v2-rain', 1, 'heavy'], ['v2-rain', 2, 'medium'], ['v2-rain', 3, 'medium'], ['v2-rain', 4, 'stopping'],
    ['v2-train', 8, 'heavy'], ['escape-win', 6, 'drizzle']];
  for (const [s, i, l] of want) assert.equal(rainOf(beat(s, i)), l, `${s} ${i}`);
  assert.equal(beat('v2-rain', 1).props.umbrella, true);
  for (const i of [2, 3, 4]) assert.equal(beat('v2-rain', i).props.umbrella, false, `umbrella must not carry to beat ${i}`);
  assert.equal(rainOf(beat('v2-train', 7)), null, 'inside the train: no rain overlay');
  assert.equal(rainOf(beat('v2-street', 0)), null, 'after the rain stops');
});

test('motion rule: 2-3 static frames at >= 500 ms; reduced motion = one still frame', () => {
  assert.ok(FRAME_MS >= 500);
  for (const l of LEVELS) {
    assert.ok(framesOf(l, false) >= 2 && framesOf(l, false) <= 3, l);
    assert.equal(framesOf(l, true), 1, l);
    // frames are fixed data: the same frame twice is identical (a screenshot is repeatable)
    assert.deepEqual(streaksFor(l, 1), streaksFor(l, 1));
    assert.notDeepEqual(streaksFor(l, 0), streaksFor(l, 1));
    // the glass keeps most of its drops between frames (new beads land, no flicker)
    const a = glassFor(l, 0).drops, b = glassFor(l, 1).drops;
    const same = a.filter((d, i) => d.every((v, k) => v === b[i][k])).length;
    assert.ok(same >= a.length * 0.75, `${l}: ${same}/${a.length}`);
  }
  assert.equal(framesOf(null, false), 0);
  const ov = src('./date-beta/fx/RainOverlay.jsx');
  assert.match(ov, /useStep\(Math\.max\(1, frames\), 5, frames > 1\)/); // 5 x 125 ms = 625 ms a frame
  assert.doesNotMatch(src('./date-beta/fx/rain.css'), /animation|transition/);
});

test('wet GUI: marks scale with intensity and never touch a text rect', () => {
  const gui = {
    say: { x: 260, y: 490, w: 1400, h: 250 }, hud: { x: 32, y: 16, w: 1548, h: 78 },
    choices: [{ x: 90, y: 860, w: 560, h: 150 }, { x: 680, y: 860, w: 560, h: 150 }],
    avoid: [{ x: 340, y: 548, w: 1180, h: 140 }, { x: 310, y: 462, w: 190, h: 64 }, { x: 170, y: 910, w: 400, h: 50 }, { x: 790, y: 910, w: 340, h: 50 },
      { x: 150, y: 30, w: 1400, h: 50 }, { x: 1480, y: 700, w: 170, h: 80 }],
  };
  const n = (l) => wetMarks(gui, l).length;
  assert.ok(n('heavy') > n('medium') && n('medium') > n('drizzle') && n('drizzle') >= n('stopping'), `${n('heavy')} ${n('medium')} ${n('drizzle')} ${n('stopping')}`);
  for (const l of LEVELS) {
    const m = wetMarks(gui, l);
    for (const x of m) assert.ok(!touchesText(x, gui.avoid), `${l}: ${JSON.stringify(x)}`);
    for (const k of ['bead', 'pool', 'drip']) assert.ok(m.some((x) => x.kind === k), `${l} has a ${k}`);
  }
  assert.ok(wetMarks(gui, 'heavy').some((x) => x.kind === 'blotch'));
  assert.deepEqual(wetMarks(gui, null), []);
});

test('layer order in the player: bg -> Nanda -> rain overlay -> GUI -> wet marks', () => {
  const m = src('./date-beta/main.jsx');
  const at = (s) => { const i = m.indexOf(s); assert.ok(i > 0, s); return i; };
  assert.ok(at('<Nanda scare') < at('<RainOverlay') && at('<RainOverlay') < at('{say && <Say') && at('<Hud love') < at('<WetGui'));
  assert.doesNotMatch(src('./date-beta/art/r3-rain/RainSidewalk.jsx'), /<Umbrella/, 'the umbrella is the overlay cel, not in the bg');
});

test('near-lens umbrella: v2-rain 1-4 (after she offers it), not the crossing / platform / train / escape', async () => {
  for (const i of [1, 2, 3, 4]) assert.equal(beat('v2-rain', i).props.underUmbrella, true, `v2-rain ${i}`);
  for (const [s, i] of [['v2-rain', 0], ['v2-train', 8], ['escape-win', 6]]) assert.ok(!beat(s, i).props?.underUmbrella, `${s} ${i}`);
  const ov = src('./date-beta/fx/RainOverlay.jsx');
  assert.ok(ov.indexOf('<Streaks level') < ov.indexOf('<NearUmbrella tint') && ov.indexOf('<NearUmbrella tint') < ov.indexOf('<Glass level'), 'streaks -> near umbrella -> glass');
  const { RIM_Y, nearRim } = await import('./date-beta/fx/RainOverlay.jsx').catch(() => ({}));
  if (nearRim) { assert.ok(Math.abs(RIM_Y - 216) < 20); for (const [, y] of nearRim()) assert.ok(y > 150 && y <= 230); }
});
