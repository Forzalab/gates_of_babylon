// fx/sound.js: the pure sound director (no DOM, no WebAudio: node tests drive it). research/sprint-0930/sfx-wire/.
// Each shown frame (a beat or a reaction frame) goes through step(): it returns the bed that should be running and the
// one-shots to fire, each with a delay in ms. assets.js plays them (loader.bed / loader.play).
// Sources, in order:
//   1. beat.sfx (the authored cue; lands at sfxAt, the voice-aligned word, else on the cut),
//   2. props.sfx: "cue" | "cue@ms" | [..] (pure scene beats: the vending clunk, the IC beeps, the katsu crunch). Beat-local:
//      engine.carried() never carries it to the next beat,
//   3. events: the love pop (reaction frame or a pending pop, once per pop), its gacha tier, the pick FX (Fx.jsx), and
//      props.underUmbrella under live rain (the canopy drumming).
// Beds (manifest `loop: true`: wind, rain, train-hum, drone, umbrella-rain): ONE at a time. A bed cue starts it (a new bed
// replaces the old one); `silence` ends it; a scene change ends it unless the new scene's frame asks for the same bed at
// once (then it just keeps running: no gap, no second copy). The loader re-asserts the bed every frame (idempotent).
import { rainOf } from './rain.js';

export const LOVE_SFX = { up: 'love-up', down: 'love-down' };
export const GACHA_SFX = { 'love-crit': 'gacha-crit', 'love-bomb': 'love-bomb', anger: 'anger-pop', rage: 'rage-thunder' };
export const FX_SFX = { 'love-burst': 'heart-pop', 'hate-quake': 'hate-quake' }; // chosen-flash: the card only, no sound
export const LOCK_SFX = { match: 'lock-click', win: 'lock-win', lose: 'lock-fail' };
export const UMBRELLA_BED = 'umbrella-rain';
const UMBRELLA_RAIN = ['heavy', 'medium', 'drizzle']; // 'stopping' = a few drops: the canopy goes quiet
const FX_AT = 120; // the heart pop / quake lands just after the chime, so the two read as two sounds

// props.sfx -> [{ cue, at }]. "ic-beep@600" = 600 ms after the cut. Junk entries are dropped (sound is never fatal).
export function propSfx(props) {
  const v = props?.sfx;
  const list = v == null ? [] : Array.isArray(v) ? v : [v];
  const out = [];
  for (const s of list) {
    const m = typeof s === 'string' ? /^([a-z0-9-]+)(?:@(\d+))?$/i.exec(s) : null;
    if (m) out.push({ cue: m[1], at: m[2] ? Number(m[2]) : 0 });
  }
  return out;
}

// the pop's sounds: a gacha tier has its own (it replaces the plain chime), else the chime by the sign of the change
export function popSfx(pop) {
  if (!pop) return [];
  const g = pop.gacha && GACHA_SFX[pop.gacha.fx];
  if (g) return [{ cue: g, at: 0 }];
  if (pop.love > 0) return [{ cue: LOVE_SFX.up, at: 0 }];
  if (pop.love < 0) return [{ cue: LOVE_SFX.down, at: 0 }];
  return [];
}
export const fxSfx = (fx) => (fx && FX_SFX[fx.kind] ? [{ cue: FX_SFX[fx.kind], at: FX_AT }] : []);

// every cue this frame names, in play order (beds and one-shots mixed; step() sorts them)
export function frameCues(beat, sfxAt = 0) {
  if (!beat) return [];
  const out = [];
  if (beat.sfx) out.push({ cue: beat.sfx, at: sfxAt || 0 });
  if (!beat.react) out.push(...propSfx(beat.props)); // a reaction frame re-shows the pick's beat: its one-shots already played
  if (beat.props?.underUmbrella && UMBRELLA_RAIN.includes(rainOf(beat))) out.push({ cue: UMBRELLA_BED, at: 0 });
  return out;
}

// One frame. state = { scene, bed, pop, fx } from the last frame; input = { scene (null = no run: stop), beat, pop, fx, sfxAt }.
// Returns { beds: [{ at, cue|null }] (apply in order), shots: [{ at, cue }], state }.
export function plan(state, { scene = null, beat = null, pop = null, fx = null, sfxAt = 0 } = {}, isBed = () => false) {
  const was = state ?? {};
  const moved = scene !== was.scene;
  let bed = moved ? null : was.bed ?? null, bedAt = 0;
  const shots = [];
  if (scene != null) {
    for (const c of frameCues(beat, sfxAt)) {
      if (c.cue === 'silence') { bed = null; bedAt = c.at; } else if (isBed(c.cue)) { bed = c.cue; bedAt = c.at; } else shots.push(c);
    }
  }
  const newPop = pop && pop !== was.pop, newFx = fx && fx !== was.fx;
  if (newPop) shots.push(...popSfx(pop));
  if (newFx && !(newPop && pop.gacha && GACHA_SFX[pop.gacha.fx])) shots.push(...fxSfx(fx));
  const beds = [];
  // a scene change stops the old bed now, unless the new frame keeps the same bed from its first instant
  if (moved && was.bed && !(bed === was.bed && bedAt === 0)) beds.push({ at: 0, cue: null });
  beds.push({ at: bedAt, cue: bed });
  return { beds, shots, state: { scene, bed, pop: pop ?? was.pop ?? null, fx: fx ?? was.fx ?? null } };
}

// The stateful wrapper the player holds (one per page).
export function createDirector(isBed) {
  let state = {};
  return {
    step(input) { const r = plan(state, input, isBed); state = r.state; return r; },
    get bed() { return state.bed ?? null; },
  };
}

// A tiny event bus for sounds raised inside art/game components (the lock game), which have no beat of their own.
const subs = new Set();
export function emitSfx(cue) { for (const f of subs) { try { f(cue); } catch { /* sound is never fatal */ } } }
export function onSfx(f) { subs.add(f); return () => subs.delete(f); }
