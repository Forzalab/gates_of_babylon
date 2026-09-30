// Scene A rebuild (plan R2 wave 2; packs/scene-a.json, SceneA.jsx, Nanda frames + faces): Tony's 8 shot points on the
// shipped rooftop, the smile tag's +1, the two-step lines, the voice takes still matching, and still (reduced-motion-first) art.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FINAL } from './date-beta-final.js';
import { beatView, start, next, choose, beatAt, splitParts, parseLine, loadScenes, MIN_HOLD } from './date-beta/engine.js';
import { nandaSVG, SCENE_FACES, FACE_DECOR } from './date-beta/art/nanda.js';
import { buildIndex, fileForLine } from './date-beta/voice/voice.js';
import voice from './date-beta/voice/manifest.json' with { type: 'json' };

const src = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const roof = FINAL.find((s) => s.id === 'rooftop');
const B = roof.beats;
const cut = (b, flags = {}) => beatView(b, flags).props.cut ?? {};
const views = (b) => ['umeboshi', 'tamagoyaki'].flatMap((bento) => ['best', 'good', 'salty'].map((yum) => beatView(b, { bento, yum })));
const FRAMES = ['off', 'medium', 'handout', 'pov', 'eyes', 'peek', 'close'];

test('scene A: 12 beats, every beat sets its own cut (props carry forward), frames are known', () => {
  assert.equal(B.length, 12);
  for (const b of B) {
    assert.ok(b.props.cut, `rooftop[${b.index}] has no cut`);
    for (const v of views(b)) assert.ok(FRAMES.includes(v.props.cut.frame), `rooftop[${b.index}] frame ${v.props.cut.frame}`);
  }
  assert.deepEqual(B.map((b) => cut(b, { bento: 'tamagoyaki' }).frame),
    ['off', 'off', 'medium', 'handout', 'off', 'off', 'pov', 'eyes', 'peek', 'medium', 'medium', 'close']);
});

test('scene A 1-2: establishing = the new rooftop, bg only, the stamp once (never in the dialogue); then she is there', () => {
  assert.equal(B[1].bg, 'rooftop-noon');
  assert.equal(B[1].props.shot, 'stamp');
  assert.equal(B[1].props.place, 'SCHOOL ROOFTOP');
  assert.equal(B[1].props.time, '12:00 NOON');
  assert.equal(B[1].text, '');
  for (const b of B) for (const v of views(b)) assert.doesNotMatch(v.text, /SCHOOL ROOFTOP|12:00/, `rooftop[${b.index}] repeats the stamp`);
  assert.equal(B.filter((b) => b.props.shot === 'stamp').length, 1);
  assert.equal(cut(B[2]).frame, 'medium');
  assert.ok(B[2].text);
  for (const b of B) assert.match(b.bg, /^(rooftop-noon|bento-)/);
});

test('scene A 3: the handout: her bento is the choice (tamagoyaki / umeboshi buttons map to the picks that set them)', () => {
  const h = B[3], m = cut(h).handout;
  assert.equal(h.choices[m.tama].set.bento, 'tamagoyaki');
  assert.equal(h.choices[m.ume].set.bento, 'umeboshi');
  assert.deepEqual([m.tama, m.ume], [0, 1], 'keys 1 / 2 = tamagoyaki / umeboshi');
  assert.ok(h.timer >= 12);
  const shell = src('./date-beta/main.jsx');
  assert.match(shell, /handout && !pos\.done && !end && <Handout/);
  assert.match(shell, /beat\.choices && !tag && !handout/, '<Choices> is not drawn on the handout');
  assert.match(src('./date-beta/SceneA.jsx'), /focus=\{hot \?\? 'both'\}/, 'both foods glow, the hovered one alone when pointed at');
});

test('scene A 4: the four food shots: insert -> the chosen piece lifted -> POV -> her eyes; no blur on the close-ups', () => {
  for (const [bento, food, lift] of [['tamagoyaki', 'tama', 'bento-lift-tama'], ['umeboshi', 'ume', 'bento-lift-ume']]) {
    const f = { bento };
    assert.equal(beatView(B[4], f).bg, 'bento-insert');
    assert.equal(beatView(B[4], f).props.focus, food);
    assert.equal(beatView(B[5], f).bg, lift);
    assert.equal(cut(B[6], f).frame, 'pov');
    assert.equal(cut(B[6], f).food, food);
    assert.equal(cut(B[7], f).frame, 'eyes');
    assert.equal(cut(B[7], f).face, 'big-eyes-peek');
  }
  for (const i of [4, 5, 7]) assert.equal(cut(B[i]).sharp, true, `rooftop[${i}] must stay sharp`);
  assert.match(src('./date-beta/main.jsx'), /!cut\.sharp && !!\(beat\.text/);
});

test('scene A 5: one merged beat, one box, two stepped lines (>= 500 ms), big eyes then the Anya smile, per bento', () => {
  const m = B[8];
  for (const [bento, lead, text] of [['tamagoyaki', 'Sweet. Like me. Good input.', "Sweet, ne? I rolled it myself."], ['umeboshi', 'Sour. Hm. You like things that bite?', 'Sour, neee?']]) {
    const v = beatView(m, { bento }), c = v.props.cut;
    assert.equal(c.lead, lead);
    assert.equal(v.line.plain, text);
    assert.equal(v.line.who, 'NANDA');
    assert.equal(c.frame, 'peek');
    assert.ok(c.step >= MIN_HOLD, 'the step is a stepped swap >= 500 ms');
    assert.ok(m.hold >= c.step, 'no pick before the lower line is up');
    assert.equal(c.face, 'big-eyes-peek');
    assert.equal(c.face2, 'anya-smile');
  }
  for (const b of B) for (const v of views(b)) assert.doesNotMatch(v.text, /You smile for her/, 'the "You smile for her" beat is gone');
});

test('scene A 6: "Don\'t stare" = eyes back out, the >///< face, and a smile tag (+1) in place of NEXT', () => {
  const d = B[9];
  assert.equal(d.choices.length, 1);
  assert.equal(d.choices[0].love, 1);
  assert.equal(d.choices[0].pass, true);
  const best = beatView(d, { yum: 'best' });
  assert.equal(best.line.plain, "…Obviously. Don't stare.");
  assert.equal(best.props.cut.face, 'blush-embarrassed');
  assert.equal(best.props.cut.tag, true);
  assert.equal(best.props.cut.frame, 'medium');
  assert.equal(beatView(d, { yum: 'good' }).line.plain, "Good is a start. Tomorrow I'll do better.");
  assert.equal(beatView(d, { yum: 'salty' }).line.plain, 'Salty. Noted. Forever.');
});

test('scene A engine: best / good move straight on (pop rides along); the smile tag adds +1 and advances to the forecast', () => {
  let p = start(FINAL, { at: 'rooftop', seed: 1 });
  while (beatAt(FINAL, p).index !== 3) p = next(FINAL, p);
  p = next(FINAL, choose(FINAL, p, 0)); // tamagoyaki, close its reaction frame
  while (beatAt(FINAL, p).index !== 8) p = next(FINAL, p);
  const before = p.love;
  const q = choose(FINAL, p, 0); // "Best I've ever had" (+2): no reaction frame
  assert.equal(q.react, undefined);
  assert.equal(beatAt(FINAL, q).index, 9);
  assert.equal(q.pending.base ?? q.pending.love - (q.pending.gacha?.bonus ?? 0), 2);
  assert.equal(q.flags.yum, 'best');
  const r = choose(FINAL, q, 0); // smile ♥ +1
  assert.equal(beatAt(FINAL, r).index, 10, 'the tag advances to the forecast');
  assert.equal(r.react, undefined);
  assert.ok(r.love >= before + 3);
  const s = choose(FINAL, p, 2); // salty keeps its reaction frame (take 011), then the salty line on beat 9
  assert.ok(s.react?.line);
  assert.equal(beatView(beatAt(FINAL, next(FINAL, s)), next(FINAL, s).flags).line.plain, 'Salty. Noted. Forever.');
});

test('scene A 7: the forecast splits at "f-" 0.5 s in, where she laughs (heart-laugh)', () => {
  const f = B[10], c = cut(f);
  assert.equal(f.line.plain, "Technically, rain wasn't f-OR-ecast.");
  assert.equal(c.at, 'f-');
  assert.equal(c.step, 500);
  assert.equal(c.face2, 'heart-laugh');
  const [head, tail] = splitParts(f.line.parts, c.at);
  assert.equal(head.map((p) => p.t).join(''), "Technically, rain wasn't ");
  assert.equal(tail.map((p) => p.t).join(''), 'f-OR-ecast.');
  assert.ok(tail.some((p) => p.or), 'the OR token stays in the second half');
  assert.deepEqual(splitParts(parseLine('no marker here', 'x').parts, 'f-')[1], []);
});

test('scene A 8: stay forever = the Content face, the close frame (over the box, HUD shoved), a hard cut', () => {
  const s = B[11], c = cut(s);
  assert.equal(c.frame, 'close');
  assert.equal(c.face, 'content');
  assert.equal(s.motion, false);
  const css = src('./date-beta/scene-a.css');
  assert.match(css, /\.stage \.db-nanda\.frame-close \{[^}]*z-index: 5/);
  assert.match(css, /\.stage\.frame-close \.hud-a \{ transform:/);
  assert.match(css, /\.stage\.frame-close \.db-choices \{ z-index: 7; \}/);
});

test('scene A faces: 5 new faces, drawn in her palette on her body; decor where the refs have it', () => {
  assert.deepEqual(SCENE_FACES, ['anya-smile', 'blush-embarrassed', 'heart-laugh', 'content', 'big-eyes-peek']);
  const base = nandaSVG({ emote: 'heart', talk: false });
  for (const f of SCENE_FACES) {
    const svg = nandaSVG({ emote: 'heart', talk: false, face: f });
    assert.notEqual(svg, base, f);
    assert.match(svg, /#d1177f/, `${f} keeps her rim`);
    assert.match(svg, /#6b0f45/, `${f} keeps her ink`);
    assert.doesNotMatch(svg, /<image|href="http/, `${f} is pure SVG`);
  }
  assert.ok(FACE_DECOR['blush-embarrassed'] && FACE_DECOR['heart-laugh']);
  assert.equal(nandaSVG({ emote: 'heart', talk: false, face: 'nope' }).length > 0, true, 'an unknown face falls back to the emote face');
});

test('scene A voice: every recorded NANDA line on the rooftop still finds its take (bento x yum), the lead lines too', () => {
  const idx = buildIndex(voice);
  const want = new Set(voice.filter((e) => e.scene === 'rooftop' && !e.file.includes('/narration/')).map((e) => e.file));
  const got = new Set();
  for (const b of B) for (const v of views(b)) {
    if (v.line.who === 'NANDA') { const f = fileForLine(idx, 'rooftop', v.line.plain); assert.ok(f, `no take for "${v.line.plain}"`); got.add(f); }
    if (v.props.cut?.lead) { const f = fileForLine(idx, 'rooftop', v.props.cut.lead); assert.ok(f, `no take for lead "${v.props.cut.lead}"`); got.add(f); }
    for (const c of b.choices ?? []) if (c.react) got.add(fileForLine(idx, 'rooftop', c.react.plain));
  }
  assert.deepEqual([...want].filter((f) => !got.has(f)), [], 'every rooftop take is still reachable');
});

test('scene A engine: pass is a boolean and never has a react line', () => {
  const one = (c) => loadScenes({ scenes: [{ id: 'a', bg: 'rooftop', beats: [{ choices: [c] }] }] });
  assert.equal(one({ text: 'smile', love: 1, pass: true })[0].beats[0].choices[0].pass, true);
  assert.throws(() => one({ text: 'smile', love: 1, pass: 'yes' }), /pass must be true or false/);
  assert.throws(() => one({ text: 'smile', love: 1, pass: true, react: 'Hm.' }), /no react line/);
});

test('scene A is still: no animation / transition in its CSS, one setTimeout (the step), frames drop the entrance', () => {
  const css = src('./date-beta/scene-a.css').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /@keyframes|animation:(?!\s*none)|transition:/);
  assert.match(css, /\.db-nanda:not\(\.frame-medium\) \{ animation: none; \}/);
  const js = src('./date-beta/SceneA.jsx');
  assert.equal((js.match(/setTimeout|setInterval|requestAnimationFrame/g) ?? []).length, 1);
});
