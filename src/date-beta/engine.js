// engine.js: date-beta scene loader + sequencer. Pure data in, pure data out, no DOM (node --test drives it).
// A scene is a list of beats. Each beat = the layers the player draws for one click:
//   bg (art id), props (art state, carried forward), text (<= 12 words), sfx (placeholder cue), rmAlt (reduced motion),
//   scare (0|1|2 dread level; beat > scene > 0), choices ([{ text, side?, go? }], the beat then waits for a pick).
// OR (UXUI R2b rule C): only an explicit "{OR}" token in a line or choice is an OR. The engine never guesses from words
// like "for" / "sorry" / a bare "OR"; a line with a marked OR renders on the dark scrim box.
// Position = { s, b, done }. next() walks beats then scenes; skip() (Esc) jumps to the next scene.
export const MAX_WORDS = 12;
export const MIN_HOLD = 500; // every beat holds >= 500 ms before a click can move on (script HARD RULES)
export const RM_ALTS = ['same', 'hard-cut', 'static', 'skip']; // skip = drop this beat when motion is reduced
export const WAITS = ['click', 'start', 'auto', 'choice']; // start = START button/keys; auto = timer; choice = a pick
export const SCARES = [0, 1, 2];
export const SIDES = ['pink', 'purple']; // pink = toward her, purple = leave
export const OR_MARK = '{OR}';

export const words = (text) => (text.trim() ? text.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0);

function fail(where, msg) { throw new Error(`date-beta scenes: ${where}: ${msg}`); }

// "f{OR}ever" -> [{ t: 'f' }, { t: 'OR', or: true }, { t: 'ever' }]. Any other brace is a typo and fails loudly.
export function orParts(text, where = 'text') {
  const bits = text.split(OR_MARK);
  if (bits.some((b) => /[{}]/.test(b))) fail(where, `stray brace in "${text}" (the only mark is ${OR_MARK})`);
  const out = [];
  bits.forEach((t, i) => { if (i) out.push({ t: 'OR', or: true }); if (t) out.push({ t }); });
  return out;
}
const plain = (parts) => parts.map((p) => p.t).join('');

// "NANDA: line" -> speaker + line. No prefix = narration (who = null).
export function parseLine(text, where) {
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/s.exec(text);
  const parts = orParts(m ? m[2] : text, where);
  return Object.freeze({ who: m ? m[1] : null, parts: Object.freeze(parts), plain: plain(parts), hasOr: parts.some((p) => p.or) });
}

export function loadScenes(data) {
  if (!data || !Array.isArray(data.scenes) || !data.scenes.length) fail('root', 'need a non-empty "scenes" array');
  const ids = new Set(), pending = [];
  const scenes = data.scenes.map((s) => {
    if (!s.id) fail('scene', 'missing id');
    if (ids.has(s.id)) fail(s.id, 'duplicate scene id');
    ids.add(s.id);
    if (!Array.isArray(s.beats) || !s.beats.length) fail(s.id, 'needs at least one beat');
    const sceneScare = s.scare ?? 0;
    if (!SCARES.includes(sceneScare)) fail(s.id, `scare ${sceneScare} is not one of ${SCARES.join('|')}`);
    let bg = s.bg, props = {};
    const beats = s.beats.map((b, i) => {
      const at = `${s.id}[${i}]`;
      bg = b.bg ?? bg;
      if (!bg) fail(at, 'no bg (set it on the scene or the beat)');
      props = { ...props, ...b.props };
      const text = b.text ?? '';
      if (words(text) > MAX_WORDS) fail(at, `text has ${words(text)} words, max ${MAX_WORDS}`);
      const rmAlt = b.rmAlt ?? 'same';
      if (!RM_ALTS.includes(rmAlt)) fail(at, `rmAlt "${rmAlt}" is not one of ${RM_ALTS.join('|')}`);
      if (b.motion && rmAlt === 'same') fail(at, 'a beat with motion needs a reduced-motion alt');
      const scare = b.scare ?? sceneScare;
      if (!SCARES.includes(scare)) fail(at, `scare ${scare} is not one of ${SCARES.join('|')}`);
      const choices = b.choices == null ? null : loadChoices(b.choices, at);
      const wait = b.wait ?? (choices ? 'choice' : b.auto ? 'auto' : 'click');
      if (!WAITS.includes(wait)) fail(at, `wait "${wait}" is not one of ${WAITS.join('|')}`);
      if ((wait === 'choice') !== !!choices) fail(at, 'a beat with choices waits for a pick (wait "choice"), and only that beat');
      if (choices && b.auto != null) fail(at, 'a choice beat cannot also auto-advance');
      const hold = Math.max(MIN_HOLD, b.hold ?? 0);
      const auto = b.auto ?? null;
      if (auto !== null && auto < hold) fail(at, `auto ${auto} ms is shorter than the ${hold} ms hold`);
      if (wait === 'auto' && auto === null) fail(at, 'wait "auto" needs an auto time');
      return Object.freeze({ scene: s.id, index: i, bg, props: Object.freeze({ ...props }), text, line: parseLine(text, at),
        sfx: b.sfx ?? null, rmAlt, motion: !!b.motion, hold, auto, wait, scare, choices });
    });
    for (const b of beats) for (const c of b.choices ?? []) if (c.go != null) pending.push([`${b.scene}[${b.index}]`, c.go]);
    return Object.freeze({ id: s.id, title: s.title ?? s.id, enter: s.enter ?? 'cut', beats });
  });
  for (const [at, go] of pending) if (!ids.has(go)) fail(at, `choice goes to unknown scene "${go}"`);
  return scenes;
}

function loadChoices(list, at) {
  if (!Array.isArray(list) || !list.length || list.length > SIDES.length) fail(at, `choices must be 1..${SIDES.length} items`);
  const sides = new Set();
  return Object.freeze(list.map((c, i) => {
    const where = `${at}.choices[${i}]`;
    if (!c || typeof c.text !== 'string' || !c.text.trim()) fail(where, 'needs text');
    if (words(c.text) > MAX_WORDS) fail(where, `text has ${words(c.text)} words, max ${MAX_WORDS}`);
    const side = c.side ?? SIDES[i];
    if (!SIDES.includes(side)) fail(where, `side "${side}" is not one of ${SIDES.join('|')}`);
    if (sides.has(side)) fail(where, `two choices on the ${side} side`);
    sides.add(side);
    const parts = Object.freeze(orParts(c.text, where));
    return Object.freeze({ text: c.text, side, go: c.go ?? null, parts, plain: plain(parts), hasOr: parts.some((p) => p.or) });
  }));
}

export const beatAt = (scenes, pos) => scenes[pos.s].beats[pos.b];
export const sceneIndex = (scenes, id) => scenes.findIndex((s) => s.id === id);

// Move forward from (s, b) inclusive until a beat that plays under this motion setting.
function settle(scenes, s, b, rm) {
  for (;;) {
    if (s >= scenes.length) return { s: scenes.length - 1, b: scenes.at(-1).beats.length - 1, done: true };
    if (b >= scenes[s].beats.length) { s += 1; b = 0; continue; }
    if (rm && scenes[s].beats[b].rmAlt === 'skip') { b += 1; continue; }
    return { s, b, done: false };
  }
}

export function start(scenes, { rm = false, at = null } = {}) {
  const i = at == null ? 0 : sceneIndex(scenes, at);
  return settle(scenes, i < 0 ? 0 : i, 0, rm);
}
export const next = (scenes, pos, rm = false) => (pos.done ? pos : settle(scenes, pos.s, pos.b + 1, rm));
// Pick choice i: jump to its scene when it has `go`, else carry on to the next beat.
export function choose(scenes, pos, i, rm = false) {
  const c = pos.done ? null : scenes[pos.s].beats[pos.b].choices?.[i];
  if (!c) return pos;
  return c.go ? start(scenes, { rm, at: c.go }) : next(scenes, pos, rm);
}
export const skip = (scenes, pos, rm = false) => (pos.done ? pos : settle(scenes, pos.s + 1, 0, rm));

// A pick is allowed once the beat's hold has passed.
export const canChoose = (beat, ms) => !!beat.choices && ms >= beat.hold;

// May a click (or key) move on from this beat, `ms` after it appeared? `button` = the START button or a key.
export function canAdvance(beat, ms, { button = false } = {}) {
  if (ms < beat.hold) return false;
  if (beat.wait === 'auto' || beat.wait === 'choice') return false;
  if (beat.wait === 'start') return button;
  return true;
}
