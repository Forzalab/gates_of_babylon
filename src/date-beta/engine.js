// engine.js: date-beta scene loader + sequencer. Pure data in, pure data out, no DOM (node --test drives it).
// A scene is a list of beats. Each beat = the layers the player draws for one click. The full beat contract
// (text, speaker, choices, timer, scare, set/if/go, bg/sprite/sfx asset ids) is the table in SCENES.md.
// OR (UXUI R2b rule C): only an explicit "{OR}" token in a line or choice is an OR. The engine never guesses from words
// like "for" / "sorry" / a bare "OR"; a line with a marked OR renders on the dark scrim box.
// Position = { s, b, done, flags }. next() walks beats then scenes; skip() (Esc) jumps to the next scene.
// Flags are one flat object: `set` merges into it, `if` tests it (every listed key must equal; missing reads as null).
// Declared flags (root `flags`, e.g. bento) may drive `vary`: per-value overlays of a beat's look/words (never its
// choices, timer or set, so the scene graph stays static). beatView(beat, flags) applies them; unset = first value.
// Love (HUD SPEC, research/date-beta-mockups/hud/SPEC.txt): a choice may carry `love` (-5..+5) + `emote` / `react` / `tell`.
// pos.love is the running score, clamped 0..goal; goal = the best total any path can reach (loader walk), so 100% is
// always reachable and never by accident. A scored pick returns a reaction frame (pos.react) that next() clears; a pick
// made where she is absent carries its pop (pos.pending) to the next beat where she is present.
import { loadGacha, rollGacha, freshLuck, nextRunLuck } from './gacha.js';
export const MAX_WORDS = 30; // a line, a vary text, a react
// Meta tokens (T3, meta.js fills them at render): allowed braces besides {OR}.
export const TOKEN_RE = /\{(RUN|TIME|DAYPART|CLOTHES|CROWD\.[1-4])\}/g;
export const MAX_CHOICE_WORDS = 12; // a button label
export const MIN_HOLD = 500; // every beat holds >= 500 ms before a click can move on (script HARD RULES)
export const RM_ALTS = ['same', 'hard-cut', 'static', 'skip']; // skip = drop this beat when motion is reduced
export const WAITS = ['click', 'start', 'auto', 'choice']; // start = START button/keys; auto = timer; choice = a pick
export const SCARES = [0, 1, 2];
export const SIDES = ['pink', 'purple', 'mid']; // pink = toward her, purple = leave, mid = the third option (3-choice beats: pink, mid, purple)
export const FX = ['love-burst', 'hate-quake', 'chosen-flash', 'none'];
export const MIN_TIMER = 12; // seconds: every timed choice gets at least this long
export const OR_MARK = '{OR}';
export const ASSET_ID = /^[A-Z]{2}-[A-Z0-9]+$/; // manifest ids look like "BG-03" / "SX-37"; anything else is a name
export const VARY_KEYS = ['text', 'speaker', 'props', 'sprite', 'bg', 'sfx'];
// Echo rule (script v5): a line naming the bento pick must vary on it. Text that uses these words without a `vary`
// on the flag (or with a variant that falls back to that text) fails at load. The picking choices are exempt.
export const ECHO = { bento: /\b(umeboshi|tamagoyaki|sour|sweet)\b|すっぱい|甘い/iu };
export const LOVE_MIN = -5, LOVE_MAX = 5;
export const EMOTES = ['heart', 'hearts', 'sweat', 'pout', 'or', 'crack', 'hate', 'puff']; // puff = the gacha anger face (ref 11)
export const CARDS = ['goal'];
export const END_ID = /^[a-z][a-z-]{0,15}$/; // the ending's name (steeped | escape | leave), for the card's label
export const SHORT = /^[A-Z0-9ÉÈ .'-]{1,8}$/u; // a scene's name on the route trail
export const TIER = { win: 100, almost: 60 }; // ending cards: 100% = win, 60..99% = almost, below = low
const KEYS = {
  root: ['version', 'note', 'flags', 'love', 'gacha', 'scenes'],
  scene: ['id', 'title', 'bg', 'enter', 'scare', 'beats', 'defaults', 'nanda', 'short', 'offstage'],
  beat: ['bg', 'sprite', 'props', 'text', 'speaker', 'sfx', 'rmAlt', 'motion', 'hold', 'auto', 'wait', 'scare', 'choices', 'timer', 'set', 'vary', 'card', 'end', 'loveHidden'],
  choice: ['text', 'side', 'go', 'if', 'set', 'default', 'love', 'emote', 'react', 'tell', 'fx', 'fake', 'pass'],
};
// Default emote for a score change: +3 and up hearts, +2 heart, +1 sweat, -1 pout, -2 or, -3 and down crack.
export const emoteFor = (love) => (love >= 3 ? 'hearts' : love === 2 ? 'heart' : love === 1 ? 'sweat'
  : love === -1 ? 'pout' : love === -2 ? 'or' : love <= -3 ? 'crack' : null);

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
  if (bits.some((b) => /[{}]/.test(b.replace(TOKEN_RE, '')))) fail(where, `stray brace in "${text}" (the only mark is ${OR_MARK})`);
  const out = [];
  bits.forEach((t, i) => { if (i) out.push({ t: 'OR', or: true }); if (t) out.push({ t }); });
  return out;
}
const plain = (parts) => parts.map((p) => p.t).join('');
// Scene A two-step line (props.cut.at): parts split at the first occurrence of `at` in a text part: [before, after]. No match = [all, []].
export function splitParts(parts, at) {
  for (const [i, p] of parts.entries()) {
    const k = p.or ? -1 : p.t.indexOf(at);
    if (k < 0 || (k === 0 && i === 0)) continue;
    const head = p.t.slice(0, k);
    return [[...parts.slice(0, i), ...(head ? [{ t: head }] : [])], [{ t: p.t.slice(k) }, ...parts.slice(i + 1)]];
  }
  return [parts, []];
}

// "NANDA: line" -> speaker + line. No prefix = narration (who = null). An explicit `speaker` wins and the text is
// then taken as-is (no prefix parse); speaker: false = narration even when the text starts "WORD:" (a sign read out).
export function parseLine(text, where, speaker = null) {
  const m = speaker == null ? /^([A-Z][A-Z ]{0,11}):\s*(.*)$/s.exec(text) : null;
  const parts = orParts(m ? m[2] : text, where);
  return Object.freeze({ who: speaker === false ? null : (speaker ?? (m ? m[1] : null)), parts: Object.freeze(parts), plain: plain(parts), hasOr: parts.some((p) => p.or) });
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
      if (b.speaker != null && b.speaker !== false && (typeof b.speaker !== 'string' || !b.speaker.trim())) fail(at, 'speaker must be a non-empty string (or false)');
      // A camera shot (props.shot) is one cut: its props are this beat's only, so a stamp / establish never pins the
      // rest of the scene to its frame (the next beat shows the scene's bg again). Other props carry forward.
      const own = { ...props, ...b.props };
      if (b.props?.shot == null) props = own;
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
      const timer = b.timer == null ? null : typeof b.timer === 'number' && b.timer > 0 ? Math.max(b.timer, MIN_TIMER) : b.timer;
      if (timer !== null && (!choices || typeof timer !== 'number' || !(timer > 0))) fail(at, 'timer must be a positive number of seconds, on a choice beat');
      if (b.loveHidden != null && (typeof b.loveHidden !== 'boolean' || !choices)) fail(at, 'loveHidden must be true or false, on a choice beat');
      const card = b.card ?? null;
      if (card !== null && !CARDS.includes(card)) fail(at, `card "${card}" is not one of ${CARDS.join('|')}`);
      if (card && wait !== 'click') fail(at, 'a card beat waits for a click (no choices, no auto)');
      const end = b.end ?? null;
      if (end !== null && (typeof end !== 'string' || !END_ID.test(end))) fail(at, 'end must be a lowercase ending name like "steeped"');
      if (end && !choices) fail(at, 'an end beat needs its "Back to start" choice (the result card\'s button takes choice 0)');
      const base = { bg, sprite: b.sprite ?? null, props: Object.freeze(own), text, speaker: b.speaker ?? null,
        line: parseLine(text, at, b.speaker ?? null), sfx: b.sfx ?? null };
      const vary = loadVary(b.vary, base, at, decl, manifest, art, cueNames);
      echoLint(text, vary, at);
      for (const [j, c] of (choices ?? []).entries()) {
        if (!Object.keys(c.set ?? {}).some((k) => ECHO[k])) echoLint(c.text, null, `${at}.choices[${j}]`);
      }
      return Object.freeze({ scene: s.id, index: i, ...base, rmAlt, motion: !!b.motion, hold, auto, wait, scare, choices, timer,
        set: declared(decl, flagsField(b.set, at, 'set'), at), vary, card, end, loveHidden: !!b.loveHidden });
    });
    for (const b of beats) for (const c of b.choices ?? []) for (const t of goTargets(c.go)) pending.push([`${b.scene}[${b.index}]`, t]);
    if (s.nanda != null && typeof s.nanda !== 'boolean') fail(s.id, '"nanda" must be true or false');
    if (s.offstage != null && typeof s.offstage !== 'boolean') fail(s.id, '"offstage" must be true or false');
    // offstage (ux-six): she is in the house but not in the frame (unknown / basement / lock game): the HUD, pops and
    // reaction frames stay, the sprite does not draw (main.jsx), her lines carry an offscreen speaker label.
    const offstage = !!s.offstage;
    const nanda = s.nanda ?? (offstage || beats.some((b) => views(b, decl).some((v) => v.line.who === 'NANDA')));
    const ending = beats.some((b) => b.end);
    const short = s.short ?? (ending ? 'END' : s.id.toUpperCase().replace(/-/g, ' ').slice(0, 8).trim());
    if (typeof short !== 'string' || !SHORT.test(short)) fail(s.id, `short "${short}" must be 1-8 uppercase characters`);
    return Object.freeze({ id: s.id, title: s.title ?? s.id, enter: s.enter ?? 'cut', defaults, beats, nanda, offstage, short, ending });
  });
  for (const [at, go] of pending) if (!ids.has(go)) fail(at, `choice goes to unknown scene "${go}"`);
  scenes.love = loadLove(data.love, scenes);
  scenes.gacha = loadGacha(data.gacha, { emotes: EMOTES }); // gacha.js: surprise crits / penalties / pity on scored picks (goal walk ignores them)
  return Object.freeze(scenes);
}

// Every look of a beat: the base, plus one view per declared value of each flag it varies on.
function views(b, decl) {
  if (!b.vary) return [b];
  return [b, ...Object.keys(b.vary).flatMap((f) => (decl[f] ?? []).map((v) => beatView(b, { [f]: v })))];
}

// Root `love`: { start: 0, goal: "auto" | n }. goal = the best score any path from scene 1 to an ending reaches; a written
// number must equal it (a new branch can never make 100% unreachable, or reachable by accident).
function loadLove(v, scenes) {
  if (v != null && (typeof v !== 'object' || Array.isArray(v))) fail('root', '"love" must be { start, goal }');
  for (const k of Object.keys(v ?? {})) if (k !== 'start' && k !== 'goal') fail('root', `unknown love key "${k}" (allowed: start, goal)`);
  const start = v?.start ?? 0, want = v?.goal ?? 'auto';
  if (!Number.isInteger(start) || start < 0) fail('root', 'love.start must be a whole number >= 0');
  if (want !== 'auto' && (!Number.isInteger(want) || want < 0)) fail('root', 'love.goal must be "auto" or a whole number');
  const goal = bestLove(scenes, start);
  if (want !== 'auto' && want !== goal) fail('root', `love.goal is ${want} but the best reachable score is ${goal}`);
  return Object.freeze({ start, goal });
}
const flagKey = (f) => JSON.stringify(Object.entries(f).sort(([a], [b]) => (a < b ? -1 : 1)));
// Walk every path from scene 1 (beat sets, enabled choices, go resolution) to an ending: an `end` beat, a choice back to
// scene 1, or the end of the last scene. The score clamps at 0 on the way, like play. A loop has no best score: fail.
function bestLove(scenes, start) {
  const first = scenes[0].id, index = new Map(scenes.map((sc, i) => [sc.id, i]));
  const seen = new Set(), onPath = new Set();
  let best = null;
  const land = (n) => { best = Math.max(best ?? n, n); };
  const visit = (s, b, flags, love) => {
    while (s < scenes.length && b >= scenes[s].beats.length) { s += 1; b = 0; }
    if (s >= scenes.length) { land(love); return; }
    const beat = scenes[s].beats[b];
    if (beat.set) flags = { ...flags, ...beat.set };
    if (beat.end) { land(love); return; }
    const node = `${s}/${b}/${flagKey(flags)}`;
    if (onPath.has(node)) fail(`${scenes[s].id}[${b}]`, 'love: the scene graph loops back here, so no best score exists');
    if (seen.has(`${node}/${love}`)) return;
    seen.add(`${node}/${love}`);
    onPath.add(node);
    if (!beat.choices) visit(s, b + 1, flags, love);
    for (const c of beat.choices ?? []) {
      if (!enabled(c, flags)) continue;
      const f = c.set ? { ...flags, ...c.set } : flags, l = Math.max(0, love + c.love), go = resolveGo(c.go, f);
      if (go === first) land(l);
      else if (go) visit(index.get(go), 0, f, l);
      else visit(s, b + 1, f, l);
    }
    onPath.delete(node);
  };
  visit(0, 0, {}, start);
  return best ?? start;
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
      if (e.speaker != null && e.speaker !== false && (typeof e.speaker !== 'string' || !e.speaker.trim())) fail(where, 'speaker must be a non-empty string (or false)');
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
  const loaded = list.map((c, i) => {
    const where = `${at}.choices[${i}]`;
    if (!c || typeof c !== 'object') fail(where, 'needs text');
    keys(c, 'choice', where);
    if (typeof c.text !== 'string' || !c.text.trim()) fail(where, 'needs text');
    if (words(c.text) > MAX_CHOICE_WORDS) fail(where, `text has ${words(c.text)} words, max ${MAX_CHOICE_WORDS}`);
    if (/\.\s*$/.test(c.text)) fail(where, 'button text ends with "." (actions are fragments, no period)');
    const side = c.side ?? (list.length === 3 ? ['pink', 'mid', 'purple'][i] : SIDES[i]);
    if (!SIDES.includes(side)) fail(where, `side "${side}" is not one of ${SIDES.join('|')}`);
    if (sides.has(side)) fail(where, `two choices on the ${side} side`);
    sides.add(side);
    const parts = Object.freeze(orParts(c.text, where));
    const love = c.love ?? 0;
    if (!Number.isInteger(love) || love < LOVE_MIN || love > LOVE_MAX) fail(where, `love ${JSON.stringify(c.love)} must be a whole number ${LOVE_MIN}..${LOVE_MAX}`);
    if (!love && (c.emote != null || c.react != null || c.tell != null)) fail(where, 'emote / react / tell need a non-zero love');
    if (c.emote != null && !EMOTES.includes(c.emote)) fail(where, `emote "${c.emote}" is not one of ${EMOTES.join('|')}`);
    if (c.tell != null && typeof c.tell !== 'boolean') fail(where, 'tell must be true or false');
    if (c.fx != null && !FX.includes(c.fx)) fail(where, `fx "${c.fx}" is not one of ${FX.join('|')}`);
    if (c.fake != null && typeof c.fake !== 'boolean') fail(where, 'fake must be true or false');
    if (c.fake && i === 0) fail(where, 'the first choice cannot be fake (a fake pick is overridden to the first choice)');
    // pass: a scored pick with no reaction frame: play moves on at once and the pop rides to the next beat she is on.
    if (c.pass != null && typeof c.pass !== 'boolean') fail(where, 'pass must be true or false');
    if (c.pass && c.react != null) fail(where, 'a pass pick has no reaction frame, so no react line');
    const fx = c.fake ? 'chosen-flash' : c.fx ?? (love > 0 ? 'none' : 'none');
    let react = null;
    if (c.react != null) {
      if (typeof c.react !== 'string' || !c.react.trim()) fail(where, 'react must be a non-empty string (her line)');
      if (words(c.react) > MAX_WORDS) fail(where, `react has ${words(c.react)} words, max ${MAX_WORDS}`);
      react = parseLine(c.react, `${where}.react`, 'NANDA');
      if (!Object.keys(c.set ?? {}).some((k) => ECHO[k])) echoLint(c.react, null, `${where}.react`); // a react to the pick that sets the flag is not an echo
    }
    return Object.freeze({ text: c.text, side, go: loadGo(c.go, where, decl), if: declared(decl, flagsField(c.if, where, 'if'), where),
      set: declared(decl, flagsField(c.set, where, 'set'), where), default: !!c.default, parts, plain: plain(parts), hasOr: parts.some((p) => p.or),
      love, fx, fake: !!c.fake, pass: !!c.pass, emote: love ? c.emote ?? (fx === 'hate-quake' ? 'hate' : emoteFor(love)) : null, react, tell: love ? c.tell ?? true : false });
  });
  // A fake choice plays the first choice's outcome (go / set / love / emote / react), so the goal walk and the route graph see it.
  return Object.freeze(loaded.map((c) => {
    if (!c.fake) return c;
    const f = loaded[0];
    return Object.freeze({ ...c, go: f.go, set: f.set, love: f.love, emote: f.emote, react: f.react, tell: f.tell });
  }));
}

export const beatAt = (scenes, pos) => scenes[pos.s].beats[pos.b];
export const sceneIndex = (scenes, id) => scenes.findIndex((s) => s.id === id);

// ---------- love
const loveOf = (scenes) => scenes.love ?? { start: 0, goal: 0 };
export const clampLove = (n, goal) => Math.min(Math.max(0, n), Math.max(0, goal));
// ux-six: one pick (base + gacha bonus, e.g. the pity love-bomb) never moves the meter more than this share of the goal.
export const MAX_SWING = 0.25;
export const swingCap = (goal) => Math.max(LOVE_MAX, Math.floor(MAX_SWING * goal));
export const capSwing = (delta, goal) => Math.max(-swingCap(goal), Math.min(swingCap(goal), delta));
// The shown percentage. 100 only when the heart is full, so a near miss never rounds up to a win.
export function lovePct(love, goal) {
  if (!(goal > 0)) return 0;
  if (love >= goal) return 100;
  return Math.max(0, Math.min(99, Math.round((100 * love) / goal)));
}
export const tierFor = (pct) => (pct >= TIER.win ? 'win' : pct >= TIER.almost ? 'almost' : 'low');
// The result card for an `end` beat: { kind, scene, pct, tier, love, goal } (scene = the ending scene's id). null off an ending, or when the script has no love.
export function ending(scenes, pos) {
  if (pos.done || pos.react) return null;
  const beat = beatAt(scenes, pos), { goal } = loveOf(scenes);
  if (!beat.end || !(goal > 0)) return null;
  const pct = lovePct(pos.love ?? 0, goal);
  return Object.freeze({ kind: beat.end, scene: scenes[pos.s].id, pct, tier: tierFor(pct), love: pos.love ?? 0, goal });
}
// Is she on screen? Her scene (`nanda`) and not a blackout beat. Drives the HUD bar and the sprite.
// An offstage scene (ux-six) keeps her HUD through its blackouts too (the sprite never draws there anyway).
export const present = (scene, beat) => !!scene?.nanda && !!beat && (beat.bg !== 'blackout' || !!scene.offstage);

// ---------- positions: { s, b, done, flags, love, path } (+ react = the reaction frame, + pending = a pop waiting for her)
// path = the scene ids entered this run, in order (the route trail's filled stops). luck = the gacha state (gacha.js),
// only when the script has a root `gacha`.
const mk = (s, b, done, { flags, love, path, pending, luck }) => {
  const p = pending ? { s, b, done, flags, love, path, pending } : { s, b, done, flags, love, path };
  return luck ? { ...p, luck } : p;
};
const runOf = (scenes, pos) => ({ flags: pos.flags ?? {}, love: pos.love ?? loveOf(scenes).start, path: pos.path ?? [], pending: pos.pending ?? null, luck: pos.luck ?? null });
const dropReact = ({ react, fx, ...p }) => p;

// Move forward from (s, b) inclusive until a beat that plays under this motion setting. Every beat reached,
// including one reduced motion drops, merges its `set` into the flags.
function settle(scenes, s, b, rm, st) {
  let { flags, path } = st;
  for (;;) {
    if (s >= scenes.length) return mk(scenes.length - 1, scenes.at(-1).beats.length - 1, true, { ...st, flags, path });
    if (b >= scenes[s].beats.length) { s += 1; b = 0; continue; }
    const beat = scenes[s].beats[b];
    if (path.at(-1) !== scenes[s].id) path = [...path, scenes[s].id];
    if (beat.set) flags = { ...flags, ...beat.set };
    if (rm && beat.rmAlt === 'skip') { b += 1; continue; }
    return mk(s, b, false, { ...st, flags, path });
  }
}

// A fresh run from scene `at` (default: scene 1). love = love.start unless given; path = the shortest route to `at`,
// so ?scene=door shows the trail it would have after playing up to the door. seed / force: the gacha luck (gacha.js);
// luck = carry an existing luck state instead (a new run after a go back to scene 1).
export function start(scenes, { rm = false, at = null, flags = {}, love = null, seed = null, force = null, luck = null } = {}) {
  let i = at == null ? 0 : sceneIndex(scenes, at);
  if (i < 0) i = 0;
  const { start: l0, goal } = loveOf(scenes);
  return settle(scenes, i, 0, rm, { flags, love: clampLove(love ?? l0, goal), path: routeTo(scenes, i), pending: null,
    luck: luck ?? freshLuck(scenes.gacha, { seed, force }) });
}
// ?scene=<id>&beat=<n>: n beats in, clamped to the beats that exist (a huge or junk n never hangs the tab).
export function startAt(scenes, { rm = false, at = null, beat = 0, love = null, seed = null, force = null } = {}) {
  let p = start(scenes, { rm, at, love, seed, force });
  const max = scenes.reduce((n, sc) => n + sc.beats.length, 0);
  const n = Math.min(Math.max(0, Math.floor(Number(beat)) || 0), max);
  for (let i = 0; i < n && !p.done; i++) {
    const q = next(scenes, p, rm);
    if (q.done) break;
    p = q;
  }
  return p;
}
// next: the reaction frame closes first; a pending pop is spent once it has shown on a beat where she is present.
export function next(scenes, pos, rm = false) {
  if (pos.done) return pos;
  if (pos.react) return dropReact(pos);
  const st = runOf(scenes, pos);
  if (st.pending && present(scenes[pos.s], beatAt(scenes, pos))) st.pending = null;
  return settle(scenes, pos.s, pos.b + 1, rm, st);
}
export const enabled = (choice, flags = {}) => matches(choice.if, flags);
// Pick choice i (only if enabled): merge its `set`, add its `love`, then jump to the first matching `go` scene, else carry on.
// On a reaction frame the pick applies to the beat behind it (the frame shows no choices, so the player never does this).
export function choose(scenes, pos, i, rm = false) {
  if (pos.react) pos = dropReact(pos);
  const c = pos.done ? null : scenes[pos.s].beats[pos.b].choices?.[i];
  if (!c || !enabled(c, pos.flags)) return pos;
  if (c.fake) { // overridden: the first choice happens, then chosen-flash names the action she made you take
    const first = scenes[pos.s].beats[pos.b].choices[0];
    return { ...take(scenes, pos, first, rm), fx: Object.freeze({ kind: 'chosen-flash', action: first.plain, fake: true }) };
  }
  const out = take(scenes, pos, c, rm);
  if (c.love && (out.react ?? out.pending)?.gacha) return out; // a gacha tier brings its own FX (art/emotion), not the pick's
  return c.fx && c.fx !== 'none' ? { ...out, fx: Object.freeze({ kind: c.fx, action: c.plain, fake: false }) } : out;
}
// A go back to scene 1 is a new run (love back to start). A scored pick where she is present returns the reaction frame
// (pos.react); where she is absent the score changes at once and the pop waits for her (pos.pending).
function take(scenes, pos, c, rm) {
  const { start: l0, goal } = loveOf(scenes);
  const flags = c.set ? { ...pos.flags, ...c.set } : pos.flags;
  const go = resolveGo(c.go, flags);
  if (go != null && go === scenes[0].id) return start(scenes, { rm, flags, luck: nextRunLuck(pos.luck) });
  // gacha (gacha.js): a scored pick may roll a bonus tier. react.love = the whole change (base + bonus), react.gacha = the tier.
  const roll = rollGacha(scenes.gacha, pos.luck ?? null, c.love);
  // Tony: the pity love-bomb (and only it) is exempt from capSwing, so it lands its full +15 bonus.
  const swing = roll.tier?.id === 'pity' ? c.love + roll.bonus : capSwing(c.love + roll.bonus, goal);
  const was = pos.love ?? l0, love = clampLove(was + swing, goal);
  const here = present(scenes[pos.s], beatAt(scenes, pos));
  const st = { ...runOf(scenes, pos), flags, love, pending: here ? null : pos.pending ?? null, luck: roll.luck };
  const dest = settle(scenes, go ? sceneIndex(scenes, go) : pos.s, go ? 0 : pos.b + 1, rm, st);
  if (!c.love) return dest;
  const t = roll.tier;
  const gacha = t ? Object.freeze({ id: t.id, fx: t.fx, face: t.face, label: t.label, bonus: t.bonus, base: c.love }) : null;
  const react = Object.freeze({ love: swing, from: was, to: love, emote: t?.emote ?? c.emote, line: c.react, tell: c.tell, s: pos.s, b: pos.b,
    ...(gacha ? { gacha } : {}) });
  return here && !c.pass ? { ...dest, react } : { ...dest, pending: react }; // pass: no frame, the pop shows on the next beat
}
// Debug tree: stand on the edge's beat ({ s, b, i }) with these flags (and score) and take choice i, exactly as choose()
// would, except the choice's own `if` is not checked (a warning is returned instead of a silent no-op).
export function jumpTo(scenes, edge, flags = {}, rm = false, love = null) {
  const c = scenes[edge.s]?.beats[edge.b]?.choices?.[edge.i];
  if (!c) throw new Error(`jumpTo: no choice ${edge.s}/${edge.b}/${edge.i}`);
  const { start: l0, goal } = loveOf(scenes);
  const at = { s: edge.s, b: edge.b, done: false, flags: { ...flags }, love: clampLove(love ?? l0, goal), path: [...routeTo(scenes, edge.s), scenes[edge.s].id] };
  const pos = take(scenes, at, c, rm);
  return enabled(c, flags) ? pos : { ...pos, warn: `choice "${c.plain}" has an if that these flags fail (taken anyway)` };
}
// Esc: leave this scene; the flags land on the skipped scene's declared defaults. Skip never walks past a branch:
// if a beat at or after this one has a choice with a `go`, Esc lands on it (and does nothing when already there).
// An ending card (a choice back to scene 1) or a scene that ends in one goes back to start(), never into the next
// scene in file order (red-team R2/R3). Every pick skipped over scores as the timer would have picked it (the
// `default`, else pink), so skipping earns nothing a wait would not. On a reaction frame, Esc just closes it.
export function skip(scenes, pos, rm = false) {
  if (pos.done) return start(scenes, { rm, luck: nextRunLuck(pos.luck) });
  if (pos.react) return dropReact(pos);
  const sc = scenes[pos.s], first = scenes[0].id, { goal } = loveOf(scenes);
  const home = (b) => b.choices?.some((c) => goTargets(c.go).includes(first));
  const branch = sc.beats.findIndex((b, i) => i >= pos.b && b.choices?.some((c) => c.go != null) && !home(b));
  if (branch === pos.b) return pos;
  if (branch < 0 && sc.beats.some(home)) return start(scenes, { rm, luck: nextRunLuck(pos.luck) });
  const st = runOf(scenes, pos);
  if (st.pending && present(sc, sc.beats[pos.b])) st.pending = null;
  let flags = st.flags;
  for (let i = pos.b; i < (branch > pos.b ? branch : sc.beats.length); i++) {
    const bt = sc.beats[i];
    if (i > pos.b && bt.set) flags = { ...flags, ...bt.set };
    const k = bt.choices ? timeoutPick(bt, flags) : -1;
    if (k >= 0) st.love = clampLove(st.love + bt.choices[k].love, goal);
  }
  if (branch > pos.b) return settle(scenes, pos.s, branch, false, { ...st, flags });
  const p = settle(scenes, pos.s + 1, 0, rm, { ...st, flags: { ...st.flags, ...sc.defaults } });
  return p.done ? start(scenes, { rm, luck: nextRunLuck(pos.luck) }) : p;
}

// ---------- the reaction frame: the pick's beat with its choices gone, her `react` line (else the question line),
// no sound, no timer. A click moves on after the minimum hold.
export function reactView(scenes, pos) {
  const r = pos.react;
  if (!r) return null;
  const base = beatView(scenes[r.s].beats[r.b], pos.flags);
  return Object.freeze({ ...base, choices: null, timer: null, auto: null, wait: 'click', hold: MIN_HOLD, sfx: null, card: null, end: null,
    text: r.line ? r.line.plain : base.text, line: r.line ?? base.line, react: r });
}

// ---------- route trail
const GRAPH = new WeakMap();
const always = (go) => typeof go === 'string' || (Array.isArray(go) && go.some((g) => typeof g === 'string'));
// scene index -> the scene indexes it can lead to: every choice `go`, plus the next scene when play can fall through.
// An ending scene (one with an `end` beat) and a choice back to scene 1 lead nowhere.
function sceneGraph(scenes) {
  if (GRAPH.has(scenes)) return GRAPH.get(scenes);
  const first = scenes[0].id;
  const g = scenes.map((sc, i) => {
    if (sc.ending) return [];
    const out = new Set();
    let falls = true;
    for (const b of sc.beats) {
      if (!b.choices) continue;
      for (const c of b.choices) for (const t of goTargets(c.go)) if (t !== first) out.add(sceneIndex(scenes, t));
      if (b.choices.every((c) => always(c.go))) { falls = false; break; }
    }
    if (falls && i + 1 < scenes.length) out.add(i + 1);
    return [...out];
  });
  GRAPH.set(scenes, g);
  return g;
}
function bfs(scenes, from, goal) {
  const g = sceneGraph(scenes), prev = new Map([[from, -1]]), q = [from];
  while (q.length) {
    const i = q.shift();
    if (i !== from && goal(i)) { const out = []; for (let k = i; k !== from; k = prev.get(k)) out.unshift(k); return out; }
    for (const j of g[i]) if (!prev.has(j)) { prev.set(j, i); q.push(j); }
  }
  return null;
}
// The scene ids on the shortest route from scene 1 to scene i (i itself left out).
export function routeTo(scenes, i) {
  if (i <= 0) return [];
  const r = bfs(scenes, 0, (k) => k === i);
  return r ? [0, ...r.slice(0, -1)].map((k) => scenes[k].id) : [];
}
// The scene indexes on the shortest route from scene i to an ending (i left out; [] when i is an ending).
export const routeFrom = (scenes, i) => (scenes[i].ending ? [] : bfs(scenes, i, (k) => scenes[k].ending) ?? []);
// The trail: scenes entered this run (done), this one (here, with its beat count), then the shortest way to an ending.
// On a reaction frame "here" is the pick's scene, even when the pick already jumped on.
export function trail(scenes, pos) {
  const s = pos.react ? pos.react.s : pos.s, b = pos.react ? pos.react.b : pos.b, path = pos.path ?? [];
  const cut = path.lastIndexOf(scenes[s].id);
  const done = (cut < 0 ? path : path.slice(0, cut)).map((id) => scenes[sceneIndex(scenes, id)]);
  const stop = (sc, state) => ({ id: sc.id, short: sc.short, state, end: sc.ending });
  return { stops: [...done.map((sc) => stop(sc, 'done')), stop(scenes[s], 'here'), ...routeFrom(scenes, s).map((k) => stop(scenes[k], 'next'))],
    beat: b, beats: scenes[s].beats.length };
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
