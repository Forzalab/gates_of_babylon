// gacha.js: "gacha / casino love" (Tony, sprint 0930). Pure, no DOM; engine.take() calls rollGacha() on every scored pick.
// Rules come from the root `gacha` key (packs/gacha.json, last in the play order). Schema + how to trigger:
// research/sprint-0930/emotion-fx/SCHEMA.md.
//   ♥ pick (love > 0): the pity tier if armed, else one roll against the `crit` tiers (+5 / +10 surprise crits).
//   💔 pick (love < 0): one roll against the `penalty` tiers (-2 anger / -5 rage). Each 💔 pick grows the streak.
//   pity ("redeem your fault"): after `after` 💔 picks in a row, the next ♥ pick is a guaranteed love-bomb. A ♥ pick resets the streak.
// Deterministic: the roll for pick n of a run is hash(seed, n), so a seed replays the same luck. `force` (debug, ?gacha=<id>)
// makes every roll of that tier's sign land on it.
export const GACHA_FX = ['love-crit', 'love-bomb', 'anger', 'rage'];
export const FACE_LAYERS = ['vein', 'puff', 'shadow-eyes', 'sparkle'];
const TIER_KEYS = ['id', 'bonus', 'rate', 'fx', 'face', 'emote', 'label'];
const ROOT_KEYS = ['seed', 'crit', 'penalty', 'pity'];
const ID = /^[a-z][a-z0-9-]{0,15}$/;

function fail(msg) { throw new Error(`date-beta gacha: ${msg}`); }

// A 32-bit integer hash of (seed, n) mapped to [0, 1). Same inputs, same number, on every engine.
export function unit(seed, n) {
  let h = (Math.imul((seed >>> 0) ^ 0x2545f491, 0x9e3779b1) + Math.imul(n + 1, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function tier(t, at, sign, emotes, withRate) {
  if (!t || typeof t !== 'object' || Array.isArray(t)) fail(`${at}: a tier must be an object`);
  for (const k of Object.keys(t)) if (!TIER_KEYS.includes(k) && !(k === 'after' && !withRate)) fail(`${at}: unknown key "${k}"`);
  if (typeof t.id !== 'string' || !ID.test(t.id)) fail(`${at}: id must be a short lowercase name`);
  if (!Number.isInteger(t.bonus) || Math.sign(t.bonus) !== sign) fail(`${at}: bonus must be a whole number ${sign > 0 ? '> 0' : '< 0'}`);
  if (Math.abs(t.bonus) > 10) fail(`${at}: bonus ${t.bonus} is outside -10..+10`);
  if (withRate && !(typeof t.rate === 'number' && t.rate > 0 && t.rate < 1)) fail(`${at}: rate must be a number between 0 and 1`);
  if (!GACHA_FX.includes(t.fx)) fail(`${at}: fx "${t.fx}" is not one of ${GACHA_FX.join('|')}`);
  const face = t.face ?? [];
  if (!Array.isArray(face) || face.some((f) => !FACE_LAYERS.includes(f))) fail(`${at}: face must list layers from ${FACE_LAYERS.join('|')}`);
  if (t.emote != null && emotes && !emotes.includes(t.emote)) fail(`${at}: emote "${t.emote}" is not one of ${emotes.join('|')}`);
  if (typeof t.label !== 'string' || !t.label.trim() || t.label.length > 24) fail(`${at}: label must be short text (the badge, max 24 chars)`);
  return Object.freeze({ id: t.id, bonus: t.bonus, rate: withRate ? t.rate : 1, fx: t.fx, face: Object.freeze([...face]), emote: t.emote ?? null, label: t.label });
}

// Validate the root `gacha` object. null / undefined = no gacha (the engine plays base love only).
export function loadGacha(g, { emotes = null } = {}) {
  if (g == null) return null;
  if (typeof g !== 'object' || Array.isArray(g)) fail('"gacha" must be an object');
  for (const k of Object.keys(g)) if (!ROOT_KEYS.includes(k)) fail(`unknown key "${k}" (allowed: ${ROOT_KEYS.join(', ')})`);
  if (!Number.isInteger(g.seed) || g.seed < 0) fail('seed must be a whole number >= 0');
  const list = (v, name, sign) => {
    if (!Array.isArray(v)) fail(`${name} must be a list of tiers`);
    const out = v.map((t, i) => tier(t, `${name}[${i}]`, sign, emotes, true));
    const sum = out.reduce((n, t) => n + t.rate, 0);
    if (sum > 1 + 1e-9) fail(`${name}: rates add up to ${sum.toFixed(3)} (max 1)`);
    return Object.freeze(out);
  };
  const crit = list(g.crit ?? [], 'crit', 1), penalty = list(g.penalty ?? [], 'penalty', -1);
  let pity = null;
  if (g.pity != null) {
    pity = tier(g.pity, 'pity', 1, emotes, false);
    if (!Number.isInteger(g.pity.after) || g.pity.after < 1) fail('pity.after must be a whole number >= 1 (the 💔 streak that arms it)');
    pity = Object.freeze({ ...pity, after: g.pity.after });
  }
  const ids = [...crit, ...penalty, ...(pity ? [pity] : [])].map((t) => t.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) fail(`tier id "${dup}" is used twice`);
  return Object.freeze({ seed: g.seed, crit, penalty, pity });
}

export const tierById = (rules, id) => (rules ? [...rules.crit, ...rules.penalty, ...(rules.pity ? [rules.pity] : [])].find((t) => t.id === id) ?? null : null);

// Luck state carried on the position: { seed, n (picks rolled this run), streak (💔 picks in a row), force? }.
export const freshLuck = (rules, { seed = null, force = null } = {}) => {
  if (!rules) return null;
  if (force != null && !tierById(rules, force)) fail(`force: no tier "${force}"`);
  return Object.freeze({ seed: (seed ?? rules.seed) >>> 0, n: 0, streak: 0, ...(force ? { force } : {}) });
};
// A new run (a go back to scene 1): next seed, counters reset, a forced tier stays forced.
export const nextRunLuck = (luck) => (luck ? Object.freeze({ ...luck, seed: (luck.seed + 1) >>> 0, n: 0, streak: 0 }) : null);

const pickTier = (tiers, u) => {
  let acc = 0;
  for (const t of tiers) { acc += t.rate; if (u < acc) return t; }
  return null;
};
// One scored pick. love = the choice's base love (never 0 here). Returns { tier (frozen tier or null), bonus, luck, u }.
export function rollGacha(rules, luck, love) {
  if (!rules || !luck || !love) return { tier: null, bonus: 0, luck, u: null };
  const u = unit(luck.seed, luck.n), n = luck.n + 1;
  let t = null, streak;
  const forced = luck.force ? tierById(rules, luck.force) : null;
  if (love > 0) {
    if (forced && forced.bonus > 0) t = forced;
    else if (rules.pity && luck.streak >= rules.pity.after) t = rules.pity;
    else t = pickTier(rules.crit, u);
    streak = 0;
  } else {
    t = forced && forced.bonus < 0 ? forced : pickTier(rules.penalty, u);
    streak = luck.streak + 1;
  }
  return { tier: t, bonus: t ? t.bonus : 0, luck: Object.freeze({ ...luck, n, streak }), u };
}
