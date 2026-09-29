// engine.js: date-beta scene loader + sequencer. Pure data in, pure data out, no DOM (node --test drives it).
// A scene is a list of beats. Each beat = the layers the player draws for one click. The full beat contract
// (text, speaker, choices, timer, scare, set/if/go, bg/sprite/sfx asset ids) is the table in SCENES.md.
// OR (UXUI R2b rule C): only an explicit "{OR}" token in a line or choice is an OR. The engine never guesses from words
// like "for" / "sorry" / a bare "OR"; a line with a marked OR renders on the dark scrim box.
// Position = { s, b, done, flags }. next() walks beats then scenes; skip() (Esc) jumps to the next scene.
// Flags are one flat object: `set` merges into it, `if` tests it (every listed key must equal; missing reads as null).
// Declared flags (root `flags`, e.g. bento) may drive `vary`: per-value overlays of a beat's look/words (never its
// choices, timer or set, so the scene graph stays static). beatView(beat, flags) applies them; unset = first value.
export const MAX_WORDS = 12;
export const MIN_HOLD = 500; // every beat holds >= 500 ms before a click can move on (script HARD RULES)
export const RM_ALTS = ['same', 'hard-cut', 'static', 'skip']; // skip = drop this beat when motion is reduced
export const WAITS = ['click', 'start', 'auto', 'choice']; // start = START button/keys; auto = timer; choice = a pick
export const SCARES = [0, 1, 2];
export const SIDES = ['pink', 'purple']; // pink = toward her, purple = leave
export const OR_MARK = '{OR}';
export const ASSET_ID = /^[A-Z]{2}-[A-Z0-9]+$/; // manifest ids look like "BG-03" / "SX-37"; anything else is a name
export const VARY_KEYS = ['text', 'speaker', 'props', 'sprite', 'bg', 'sfx'];
// Echo rule (script v5): a line naming the bento pick must vary on it. Text that uses these words without a `vary`
// on the flag (or with a variant that falls back to that text) fails at load. The picking choices are exempt.
export const ECHO = { bento: /\b(umeboshi|tamagoyaki|sour|sweet)\b|すっぱい|甘い/iu };
const KEYS = {
  root: ['version', 'note', 'flags', 'scenes'],
  scene: ['id', 'title', 'bg', 'enter', 'scare', 'beats', 'defaults'],
  beat: ['bg', 'sprite', 'props', 'text', 'speaker', 'sfx', 'rmAlt', 'motion', 'hold', 'auto', 'wait', 'scare', 'choices', 'timer', 'set', 'vary'],
  choice: ['text', 'side', 'go', 'if', 'set', 'default'],
};

export const words = (text) => (text.trim() ? text.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0);

function fail(where, msg) { throw new Error(`date-beta scenes: ${where}: ${msg}`); }
function keys(o, kind, where) {
  for (const k of Object.keys(o)) if (!KEYS[kind].includes(k)) fail(where, `unknown ${kind} key "${k}" (allowed: ${KEYS[kind].join(', ')})`);
}
const isFlags = (v) => v != null && typeof v === 'object' && !Array.isArray(v)
  && Object.values(v).every((x) => x === null || ['string', 'number', 'boolean'].includes(typeof x));
function flagsField(v, where, name) {
  if (v == null) return null;
  if (!isFlags(v)) fail(where, `"${name}" must be a flat object of string/number/boolean/null flags`);
  return Object.freeze({ ...v });
}

// A declared flag may only be set/tested with one of its declared values (or null).
function declared(decl, obj, where) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (decl[k] && v !== null && !decl[k].includes(v)) fail(where, `flag ${k} = ${JSON.stringify(v)} is not one of ${decl[k].join('|')}`);
  }
  return obj;
}
function loadFlagDecl(v) {
  if (v == null) return Object.freeze({});
  if (typeof v !== 'object' || Array.isArray(v)) fail('root', '"flags" must be an object of flag -> [values]');
  const out = {};
  for (const [k, vals] of Object.entries(v)) {
    if (!Array.isArray(vals) || !vals.length || vals.some((x) => typeof x !== 'string' || !x) || new Set(vals).size !== vals.length) {
      fail('root', `flags.${k} must be a non-empty list of distinct non-empty strings`);
    }
    out[k] = Object.freeze([...vals]);
  }
  return Object.freeze(out);
}

// Every key in `cond` must equal its flag (a missing flag reads as null, so { met: null } = "met not set").
export const matches = (cond, flags = {}) => !cond || Object.entries(cond).every(([k, v]) => (flags[k] ?? null) === v);
// go: "scene" | [ "scene" | { if, to }, ... ]. First matching entry wins; none = carry on to the next beat.
export function resolveGo(go, flags = {}) {
  if (go == null || typeof go === 'string') return go ?? null;
  for (const g of go) {
    if (typeof g === 'string') return g;
    if (matches(g.if, flags)) return g.to;
  }
  return null;
}
function loadGo(go, where, decl = {}) {
  if (go == null) return null;
  if (typeof go === 'string') return go;
  if (!Array.isArray(go) || !go.length) fail(where, '"go" must be a scene id or a non-empty list');
  return Object.freeze(go.map((g, i) => {
    if (typeof g === 'string') return g;
    if (!g || typeof g !== 'object' || typeof g.to !== 'string') fail(where, `go[${i}] must be a scene id or { if, to }`);
    for (const k of Object.keys(g)) if (k !== 'if' && k !== 'to') fail(where, `unknown go key "${k}" (allowed: if, to)`);
    return Object.freeze({ if: declared(decl, flagsField(g.if, where, 'if'), where), to: g.to });
  }));
}
const goTargets = (go) => (go == null ? [] : typeof go === 'string' ? [go] : go.map((g) => (typeof g === 'string' ? g : g.to)));

// An asset field is a manifest id (must exist, with this kind) or a name (art component / sfx cue).
// Checks run only against what the caller passed: manifest for ids, names for the rest.
function assetField(v, kind, where, manifest, names) {
  if (v == null) return;
  if (typeof v !== 'string' || !v) fail(where, `${kind} must be a non-empty string`);
  if (ASSET_ID.test(v)) {
    if (!manifest) return;
    const a = manifest.assets?.[v];
    if (!a) fail(where, `${kind} "${v}" is not in the asset manifest`);
    if (a.kind !== kind) fail(where, `${kind} "${v}" is a ${a.kind} asset, not ${kind}`);
  } else if (names && !names.includes(v)) fail(where, `${kind} "${v}" is neither a manifest id nor one of ${names.join('|')}`);
}
export const isAssetId = (v) => typeof v === 'string' && ASSET_ID.test(v);

// "f{OR}ever" -> [{ t: 'f' }, { t: 'OR', or: true }, { t: 'ever' }]. Any other brace is a typo and fails loudly.
export function orParts(text, where = 'text') {
  const bits = text.split(OR_MARK);
  if (bits.some((b) => /[{}]/.test(b))) fail(where, `stray brace in "${text}" (the only mark is ${OR_MARK})`);
  const out = [];
  bits.forEach((t, i) => { if (i) out.push({ t: 'OR', or: true }); if (t) out.push({ t }); });
  return out;
}
const plain = (parts) => parts.map((p) => p.t).join('');

// "NANDA: line" -> speaker + line. No prefix = narration (who = null). An explicit `speaker` wins and the text is
// then taken as-is (no prefix parse).
export function parseLine(text, where, speaker = null) {
  const m = speaker ? null : /^([A-Z][A-Z ]{0,11}):\s*(.*)$/s.exec(text);
  const parts = orParts(m ? m[2] : text, where);
  return Object.freeze({ who: speaker ?? (m ? m[1] : null), parts: Object.freeze(parts), plain: plain(parts), hasOr: parts.some((p) => p.or) });
}

// opts.manifest (assets.json) validates id-shaped bg/sprite/sfx and supplies the cue names for non-id sfx;
// opts.art (art component names) validates non-id bg/sprite. Without them only shapes are checked.
export function loadScenes(data, { manifest = null, art = null } = {}) {
  if (!data || !Array.isArray(data.scenes) || !data.scenes.length) fail('root', 'need a non-empty "scenes" array');
  keys(data, 'root', 'root');
  const decl = loadFlagDecl(data.flags);
  const cueNames = manifest?.cues ? Object.keys(manifest.cues) : null;
  const ids = new Set(), pending = [];
  const scenes = data.scenes.map((s) => {
    if (!s || !s.id) fail('scene', 'missing id');
    keys(s, 'scene', s.id);
    if (ids.has(s.id)) fail(s.id, 'duplicate scene id');
    ids.add(s.id);
    if (!Array.isArray(s.beats) || !s.beats.length) fail(s.id, 'needs at least one beat');
    const sceneScare = s.scare ?? 0;
    if (!SCARES.includes(sceneScare)) fail(s.id, `scare ${sceneScare} is not one of ${SCARES.join('|')}`);
    assetField(s.bg, 'bg', s.id, manifest, art);
    const defaults = declared(decl, flagsField(s.defaults, s.id, 'defaults'), s.id) ?? Object.freeze({});
    let bg = s.bg, props = {};
    const beats = s.beats.map((b, i) => {
      const at = `${s.id}[${i}]`;
      if (!b || typeof b !== 'object') fail(at, 'a beat must be an object');
      keys(b, 'beat', at);
      assetField(b.bg, 'bg', at, manifest, art);
      assetField(b.sprite, 'sprite', at, manifest, art);
      assetField(b.sfx, 'sfx', at, manifest, cueNames);
      bg = b.bg ?? bg;
      if (!bg) fail(at, 'no bg (set it on the scene or the beat)');
      if (b.speaker != null && (typeof b.speaker !== 'string' || !b.speaker.trim())) fail(at, 'speaker must be a non-empty string');
      props = { ...props, ...b.props };
      const text = b.text ?? '';
      if (words(text) > MAX_WORDS) fail(at, `text has ${words(text)} words, max ${MAX_WORDS}`);
      const rmAlt = b.rmAlt ?? 'same';
      if (!RM_ALTS.includes(rmAlt)) fail(at, `rmAlt "${rmAlt}" is not one of ${RM_ALTS.join('|')}`);
      if (b.motion && rmAlt === 'same') fail(at, 'a beat with motion needs a reduced-motion alt');
      const scare = b.scare ?? sceneScare;
      if (!SCARES.includes(scare)) fail(at, `scare ${scare} is not one of ${SCARES.join('|')}`);
      const choices = b.choices == null ? null : loadChoices(b.choices, at, decl);
      const wait = b.wait ?? (choices ? 'choice' : b.auto ? 'auto' : 'click');
      if (!WAITS.includes(wait)) fail(at, `wait "${wait}" is not one of ${WAITS.join('|')}`);
      if ((wait === 'choice') !== !!choices) fail(at, 'a beat with choices waits for a pick (wait "choice"), and only that beat');
      if (choices && b.auto != null) fail(at, 'a choice beat cannot also auto-advance');
      const hold = Math.max(MIN_HOLD, b.hold ?? 0);
      const auto = b.auto ?? null;
      if (auto !== null && auto < hold) fail(at, `auto ${auto} ms is shorter than the ${hold} ms hold`);
      if (wait === 'auto' && auto === null) fail(at, 'wait "auto" needs an auto time');
      const timer = b.timer ?? null;
      if (timer !== null && (!choices || typeof timer !== 'number' || !(timer > 0))) fail(at, 'timer must be a positive number of seconds, on a choice beat');
      const base = { bg, sprite: b.sprite ?? null, props: Object.freeze({ ...props }), text, speaker: b.speaker ?? null,
        line: parseLine(text, at, b.speaker ?? null), sfx: b.sfx ?? null };
      const vary = loadVary(b.vary, base, at, decl, manifest, art, cueNames);
      echoLint(text, vary, at);
      for (const [j, c] of (choices ?? []).entries()) {
        if (!Object.keys(c.set ?? {}).some((k) => ECHO[k])) echoLint(c.text, null, `${at}.choices[${j}]`);
      }
      return Object.freeze({ scene: s.id, index: i, ...base, rmAlt, motion: !!b.motion, hold, auto, wait, scare, choices, timer,
        set: declared(decl, flagsField(b.set, at, 'set'), at), vary });
    });
    for (const b of beats) for (const c of b.choices ?? []) for (const t of goTargets(c.go)) pending.push([`${b.scene}[${b.index}]`, t]);
    return Object.freeze({ id: s.id, title: s.title ?? s.id, enter: s.enter ?? 'cut', defaults, beats });
  });
  for (const [at, go] of pending) if (!ids.has(go)) fail(at, `choice goes to unknown scene "${go}"`);
  return scenes;
}

// vary: { flag: { value: { text?, speaker?, props?, sprite?, bg?, sfx? } } }. Every declared value needs an entry
// (an empty {} = same as the base). Entries are checked like beats. Loaded form: flag -> value -> the entry's own
// fields, keyed in declared order so the first key is the unset fallback. Variant props merge over the beat's carried
// props for that beat only; nothing a variant sets carries to the next beat.
function loadVary(v, base, at, decl, manifest, art, cueNames) {
  if (v == null) return null;
  if (typeof v !== 'object' || Array.isArray(v) || !Object.keys(v).length) fail(at, '"vary" must be { flag: { value: {...} } }');
  const out = {};
  for (const [flag, byValue] of Object.entries(v)) {
    const vals = decl[flag];
    if (!vals) fail(at, `vary on undeclared flag "${flag}" (declare it in the root "flags")`);
    if (!byValue || typeof byValue !== 'object' || Array.isArray(byValue)) fail(at, `vary.${flag} must be { value: {...} }`);
    for (const k of Object.keys(byValue)) if (!vals.includes(k)) fail(at, `vary.${flag} has unknown value "${k}" (declared: ${vals.join('|')})`);
    const m = {};
    for (const val of vals) {
      const where = `${at}.vary.${flag}.${val}`;
      if (!Object.hasOwn(byValue, val)) fail(at, `vary.${flag} is missing the variant for "${val}"`);
      const e = byValue[val];
      if (!e || typeof e !== 'object' || Array.isArray(e)) fail(where, 'a variant must be an object');
      for (const k of Object.keys(e)) if (!VARY_KEYS.includes(k)) fail(where, `"${k}" cannot vary (allowed: ${VARY_KEYS.join(', ')})`);
      assetField(e.bg, 'bg', where, manifest, art);
      assetField(e.sprite, 'sprite', where, manifest, art);
      assetField(e.sfx, 'sfx', where, manifest, cueNames);
      if (e.speaker != null && (typeof e.speaker !== 'string' || !e.speaker.trim())) fail(where, 'speaker must be a non-empty string');
      if (e.text != null && typeof e.text !== 'string') fail(where, 'text must be a string');
      if (e.props != null && (typeof e.props !== 'object' || Array.isArray(e.props))) fail(where, 'props must be an object');
      if (e.text != null && words(e.text) > MAX_WORDS) fail(where, `text has ${words(e.text)} words, max ${MAX_WORDS}`);
      parseLine(e.text ?? base.text, where, e.speaker ?? base.speaker);
      const own = {};
      for (const k of VARY_KEYS) if (e[k] != null) own[k] = k === 'props' ? Object.freeze({ ...e.props }) : e[k];
      m[val] = Object.freeze(own);
    }
    out[flag] = Object.freeze(m);
  }
  return Object.freeze(out);
}
// Echo lint: base text naming a pick word must be replaced by a `text` variant for every value of that flag.
function echoLint(text, vary, at) {
  for (const [flag, re] of Object.entries(ECHO)) {
    const hit = re.exec(text);
    if (!hit) continue;
    const m = vary?.[flag];
    if (!m || !Object.values(m).every((e) => e.text != null)) {
      fail(at, `"${hit[0]}" is an echo word: this line needs a text variant per ${flag} value (vary.${flag})`);
    }
  }
}

// What the player sees for this beat under these flags: each varied flag's overlay (unset or unknown value = the
// flag's first declared value). Only look fields change; choices/timer/set are the beat's own.
export function beatView(beat, flags = {}) {
  if (!beat.vary) return beat;
  const view = { ...beat };
  for (const [flag, m] of Object.entries(beat.vary)) {
    const v = flags[flag];
    const e = typeof v === 'string' && Object.hasOwn(m, v) ? m[v] : Object.values(m)[0];
    for (const [k, x] of Object.entries(e)) view[k] = k === 'props' ? Object.freeze({ ...view.props, ...x }) : x;
  }
  if (view.text !== beat.text || view.speaker !== beat.speaker) view.line = parseLine(view.text, `${beat.scene}[${beat.index}]`, view.speaker);
  return Object.freeze(view);
}

function loadChoices(list, at, decl = {}) {
  if (!Array.isArray(list) || !list.length || list.length > SIDES.length) fail(at, `choices must be 1..${SIDES.length} items`);
  if (list.filter((c) => c?.default).length > 1) fail(at, 'only one choice can be the default');
  const sides = new Set();
  return Object.freeze(list.map((c, i) => {
    const where = `${at}.choices[${i}]`;
    if (!c || typeof c !== 'object') fail(where, 'needs text');
    keys(c, 'choice', where);
    if (typeof c.text !== 'string' || !c.text.trim()) fail(where, 'needs text');
    if (words(c.text) > MAX_WORDS) fail(where, `text has ${words(c.text)} words, max ${MAX_WORDS}`);
    if (/\.\s*$/.test(c.text)) fail(where, 'button text ends with "." (actions are fragments, no period)');
    const side = c.side ?? SIDES[i];
    if (!SIDES.includes(side)) fail(where, `side "${side}" is not one of ${SIDES.join('|')}`);
    if (sides.has(side)) fail(where, `two choices on the ${side} side`);
    sides.add(side);
    const parts = Object.freeze(orParts(c.text, where));
    return Object.freeze({ text: c.text, side, go: loadGo(c.go, where, decl), if: declared(decl, flagsField(c.if, where, 'if'), where),
      set: declared(decl, flagsField(c.set, where, 'set'), where), default: !!c.default, parts, plain: plain(parts), hasOr: parts.some((p) => p.or) });
  }));
}

export const beatAt = (scenes, pos) => scenes[pos.s].beats[pos.b];
export const sceneIndex = (scenes, id) => scenes.findIndex((s) => s.id === id);

// Move forward from (s, b) inclusive until a beat that plays under this motion setting. Every beat reached,
// including one reduced motion drops, merges its `set` into the flags.
function settle(scenes, s, b, rm, flags = {}) {
  for (;;) {
    if (s >= scenes.length) return { s: scenes.length - 1, b: scenes.at(-1).beats.length - 1, done: true, flags };
    if (b >= scenes[s].beats.length) { s += 1; b = 0; continue; }
    const beat = scenes[s].beats[b];
    if (beat.set) flags = { ...flags, ...beat.set };
    if (rm && beat.rmAlt === 'skip') { b += 1; continue; }
    return { s, b, done: false, flags };
  }
}

export function start(scenes, { rm = false, at = null, flags = {} } = {}) {
  const i = at == null ? 0 : sceneIndex(scenes, at);
  return settle(scenes, i < 0 ? 0 : i, 0, rm, flags);
}
// ?scene=<id>&beat=<n>: n beats in, clamped to the beats that exist (a huge or junk n never hangs the tab).
export function startAt(scenes, { rm = false, at = null, beat = 0 } = {}) {
  let p = start(scenes, { rm, at });
  const max = scenes.reduce((n, sc) => n + sc.beats.length, 0);
  const n = Math.min(Math.max(0, Math.floor(Number(beat)) || 0), max);
  for (let i = 0; i < n && !p.done; i++) {
    const q = next(scenes, p, rm);
    if (q.done) break;
    p = q;
  }
  return p;
}
export const next = (scenes, pos, rm = false) => (pos.done ? pos : settle(scenes, pos.s, pos.b + 1, rm, pos.flags));
export const enabled = (choice, flags = {}) => matches(choice.if, flags);
// Pick choice i (only if enabled): merge its `set`, then jump to the first matching `go` scene, else carry on.
export function choose(scenes, pos, i, rm = false) {
  const c = pos.done ? null : scenes[pos.s].beats[pos.b].choices?.[i];
  if (!c || !enabled(c, pos.flags)) return pos;
  return take(scenes, pos, c, rm);
}
function take(scenes, pos, c, rm) {
  const flags = c.set ? { ...pos.flags, ...c.set } : pos.flags;
  const go = resolveGo(c.go, flags);
  return go ? start(scenes, { rm, at: go, flags }) : next(scenes, { ...pos, flags }, rm);
}
// Debug tree: stand on the edge's beat ({ s, b, i }) with these flags and take choice i, exactly as choose() would,
// except the choice's own `if` is not checked (a warning is returned instead of a silent no-op).
export function jumpTo(scenes, edge, flags = {}, rm = false) {
  const c = scenes[edge.s]?.beats[edge.b]?.choices?.[edge.i];
  if (!c) throw new Error(`jumpTo: no choice ${edge.s}/${edge.b}/${edge.i}`);
  const pos = take(scenes, { s: edge.s, b: edge.b, done: false, flags: { ...flags } }, c, rm);
  return enabled(c, flags) ? pos : { ...pos, warn: `choice "${c.plain}" has an if that these flags fail (taken anyway)` };
}
// Esc: leave this scene; the flags land on the skipped scene's declared defaults. Skip never walks past a branch:
// if a beat at or after this one has a choice with a `go`, Esc lands on it (and does nothing when already there).
// An ending card (a choice back to scene 1) or a scene that ends in one goes back to start(), never into the next
// scene in file order (red-team R2/R3).
export function skip(scenes, pos, rm = false) {
  if (pos.done) return start(scenes, { rm });
  const sc = scenes[pos.s], first = scenes[0].id;
  const home = (b) => b.choices?.some((c) => goTargets(c.go).includes(first));
  const branch = sc.beats.findIndex((b, i) => i >= pos.b && b.choices?.some((c) => c.go != null) && !home(b));
  if (branch === pos.b) return pos;
  if (branch > pos.b) {
    let flags = pos.flags;
    for (let i = pos.b + 1; i < branch; i++) if (sc.beats[i].set) flags = { ...flags, ...sc.beats[i].set };
    return settle(scenes, pos.s, branch, false, flags);
  }
  if (sc.beats.some(home)) return start(scenes, { rm });
  const p = settle(scenes, pos.s + 1, 0, rm, { ...pos.flags, ...sc.defaults });
  return p.done ? start(scenes, { rm }) : p;
}

// A pick is allowed once the beat's hold has passed.
export const canChoose = (beat, ms) => !!beat.choices && ms >= beat.hold;

// Timer hit 0: the `default` choice, else the pink one; if that one is disabled, the other enabled one; none = -1.
export function timeoutPick(beat, flags = {}) {
  const cs = beat.choices ?? [];
  let i = cs.findIndex((c) => c.default);
  if (i < 0) i = cs.findIndex((c) => c.side === 'pink');
  if (i >= 0 && enabled(cs[i], flags)) return i;
  return cs.findIndex((c, j) => j !== i && enabled(c, flags));
}
// Countdown step: seconds left after dt ms. Frozen (unchanged) while paused, a menu is open, or the tab is hidden.
export const tick = (left, dt, frozen = false) => (frozen ? left : Math.max(0, left - dt / 1000));

// May a click (or key) move on from this beat, `ms` after it appeared? `button` = the START button or a key.
export function canAdvance(beat, ms, { button = false } = {}) {
  if (ms < beat.hold) return false;
  if (beat.wait === 'auto' || beat.wait === 'choice') return false;
  if (beat.wait === 'start') return button;
  return true;
}
