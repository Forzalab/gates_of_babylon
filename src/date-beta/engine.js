// engine.js: date-beta scene loader + sequencer. Pure data in, pure data out, no DOM (node --test drives it).
// A scene is a list of beats. Each beat = the layers the player draws for one click:
//   bg (art id), props (art state, carried forward), text (<= 12 words), sfx (placeholder cue), rmAlt (reduced motion).
// Position = { s, b, done }. next() walks beats then scenes; skip() (Esc) jumps to the next scene.
export const MAX_WORDS = 12;
export const MIN_HOLD = 500; // every beat holds >= 500 ms before a click can move on (script HARD RULES)
export const RM_ALTS = ['same', 'hard-cut', 'static', 'skip']; // skip = drop this beat when motion is reduced
export const WAITS = ['click', 'start', 'auto']; // start = only the START button/keys; auto = timer only

export const words = (text) => (text.trim() ? text.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0);

function fail(where, msg) { throw new Error(`date-beta scenes: ${where}: ${msg}`); }

export function loadScenes(data) {
  if (!data || !Array.isArray(data.scenes) || !data.scenes.length) fail('root', 'need a non-empty "scenes" array');
  const ids = new Set();
  return data.scenes.map((s) => {
    if (!s.id) fail('scene', 'missing id');
    if (ids.has(s.id)) fail(s.id, 'duplicate scene id');
    ids.add(s.id);
    if (!Array.isArray(s.beats) || !s.beats.length) fail(s.id, 'needs at least one beat');
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
      const wait = b.wait ?? (b.auto ? 'auto' : 'click');
      if (!WAITS.includes(wait)) fail(at, `wait "${wait}" is not one of ${WAITS.join('|')}`);
      const hold = Math.max(MIN_HOLD, b.hold ?? 0);
      const auto = b.auto ?? null;
      if (auto !== null && auto < hold) fail(at, `auto ${auto} ms is shorter than the ${hold} ms hold`);
      if (wait === 'auto' && auto === null) fail(at, 'wait "auto" needs an auto time');
      return Object.freeze({ scene: s.id, index: i, bg, props: Object.freeze({ ...props }), text,
        sfx: b.sfx ?? null, rmAlt, motion: !!b.motion, hold, auto, wait });
    });
    return Object.freeze({ id: s.id, title: s.title ?? s.id, enter: s.enter ?? 'cut', beats });
  });
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
export const skip = (scenes, pos, rm = false) => (pos.done ? pos : settle(scenes, pos.s + 1, 0, rm));

// May a click (or key) move on from this beat, `ms` after it appeared? `button` = the START button or a key.
export function canAdvance(beat, ms, { button = false } = {}) {
  if (ms < beat.hold) return false;
  if (beat.wait === 'auto') return false;
  if (beat.wait === 'start') return button;
  return true;
}
