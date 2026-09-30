// R5 umeboshi deep pass (Tony 09-30; plan: brain _drift/2026-09-30T0805-alt-R5-plan.md): the global fixes stay fixed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nandaSVG, pinArm, PAL } from './date-beta/art/nanda.js';

const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');

test('r5: the side-pony (read as a knife) is gone, the NOT circle stays as her joint', () => {
  const s = nandaSVG({ stage: 1 });
  assert.doesNotMatch(s, /M106 63C114 78/);
  assert.match(s, /<circle cx="112" cy="54" r="12"/);
});

test('r5: her hands = the two input pins, each a lead with a round nub tip', () => {
  const s = nandaSVG({ stage: 1 });
  assert.equal((s.match(/<circle cx="-9" cy="(33|75)" r="3.6"/g) ?? []).length, 2);
  assert.match(pinArm([0, 0], [40, 10], PAL[1], { bend: 8 }), /Q.*<circle cx="40" cy="10"/);
});

test('r5: "Click anywhere to continue" is a subtitle, never a pill button', () => {
  const rule = /\.db-hint \{[^}]*\}/.exec(src('./date-beta/beta.css'))[0];
  assert.match(rule, /background: none/);
  assert.doesNotMatch(rule, /border-radius/);
});

test('r5: the focus plane keeps the floor round her feet sharp (band + ellipse mask)', () => {
  const css = src('./date-beta/beta.css');
  assert.match(css, /\.db-fplane \{[^}]*backdrop-filter: blur\(3px\)[^}]*linear-gradient[^}]*radial-gradient/);
  assert.match(src('./date-beta/main.jsx'), /className="db-fplane"/);
});

test('r5: park beat 1 (feet close-up) cut; "Hold my hand" is on the real park bg with her pin reaching out', async () => {
  const { applyPacks } = await import('./date-beta/packs/index.js');
  const read = (p) => JSON.parse(src(p));
  const PLAY = /const PLAY = \[([^\]]+)\]/.exec(src('./date-beta/main.jsx'))[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
  const d = applyPacks(read('./date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`./date-beta/packs/${n}.json`) })));
  const park = d.scenes.find((s) => s.id === 'v2-park');
  assert.ok(!park.beats.some((b) => /Her feet\. Two small steps/.test(b.text)));
  const hold = park.beats[1];
  assert.match(hold.text, /^Hold my hand/);
  assert.equal(hold.props.shot, undefined);
  assert.equal(hold.props.cut.reach, true);
  assert.match(nandaSVG({ stage: 1, reach: true }), /<circle cx="-44" cy="66" r="17"/);
});

test('r5: auto faces: a beat without its own face gets one, never the same as the beat before', async () => {
  const { autoFaces } = await import('./date-beta/art/autoface.js');
  const beats = ['Hi.', 'We walk.', 'So many people. I will hold your arm. Tight.', 'Wow! A giant board!', 'Right?', 'Ok.', 'Ok.']
    .map((text) => ({ text, props: {} }));
  beats.push({ text: 'mine', props: { cut: { face: 'happy' } } });
  const f = autoFaces(beats, () => 1);
  assert.equal(f.at(-1), null);
  for (let i = 1; i < 7; i++) assert.notEqual(f[i], f[i - 1], `beat ${i}`);
  assert.equal(f[2], 'nervous');
  assert.equal(f[3], 'heart-laugh');
  assert.equal(autoFaces([{ text: 'x', props: {} }], () => 4)[0], null);
});
