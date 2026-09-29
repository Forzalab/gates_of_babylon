// Round-3 letterbox menus, pure parts (node --test drives them). Two modes share one engine (Letterbox3.jsx):
//   'h2' = menu-h2-r3 "Her Time, Her Cut", refined: her edit is WORD swaps, never faster than 2 glyph changes a second.
//   'h3' = menu-h3-r3 "Her Hold": no text edit at all. Her hand holds the purple box down; timeout = ECU into the lens.
import { secondsLeft, remaining } from '../shared/door.js';

// ---------- h2: her edit, as whole-word swaps on held states (>= 500 ms each => <= 2 glyph swaps per second) ----------
//   0 .. 3000     "It's late. Goodnight."   her red caret + NANDA flag parked after it from the first frame
//   3000 .. 3500  glitch: the word splits into her red / pink (one held state)
//   3500 .. 4000  her caret selects "Goodnight." (one held state)
//   4000 ..       "Stay." lands as ONE word (no per-key typing); the edit line reads NANDA edited: Goodnight. -> Stay.
//   reduced motion: one hard cut at 3000 straight to the finished edit.
export const EDIT3 = Object.freeze({ glitchAt: 3000, selectAt: 3500, swapAt: 4000, keep: "It's late. ", from: 'Goodnight.', to: 'Stay.' });

export function purpleLabel3(t, rm = false) {
  const { keep, from, to } = EDIT3;
  if (t < EDIT3.glitchAt) return { keep, word: from, stage: 'clean' };
  if (rm) return { keep, word: to, stage: 'done' };
  if (t < EDIT3.selectAt) return { keep, word: from, stage: 'glitch' };
  if (t < EDIT3.swapAt) return { keep, word: from, stage: 'select' };
  return { keep, word: to, stage: 'done' };
}
export const retyped3 = (t, rm = false) => t >= (rm ? EDIT3.glitchAt : EDIT3.swapAt);

// Every moment the purple label's look changes (glyphs or their state), sampled on the 8 fps grid.
export function labelChanges(labelAt, t0 = 0, t1 = 5000, step = 125) {
  const out = [];
  let prev = null;
  for (let t = t0; t <= t1; t += step) {
    const L = labelAt(t);
    const k = `${L.word}|${L.stage}`;
    if (prev !== null && k !== prev) out.push(t);
    prev = k;
  }
  return out;
}
// Largest number of changes inside any half-open 1 s window.
export function maxPerSecond(times) {
  let best = 0;
  for (const a of times) best = Math.max(best, times.filter((b) => b >= a && b < a + 1000).length);
  return best;
}

// ---------- the two slabs: same fat, high-contrast build; only colour and squeeze differ ----------
// Pink grows as the time pours into it, purple is squeezed. Total row width is fixed.
export function slabWidths(r, total = 1320) {
  const pink = Math.round(690 + (780 - 690) * (1 - r));
  return { pink, purple: total - pink };
}
export const PREPOUR3 = 0.3;
export const pinkPour = (r) => PREPOUR3 + (1 - PREPOUR3) * (1 - r);
// Reduced motion: the timer reads in whole seconds only.
export const heldRemaining = (s, rm) => (rm ? Math.max(0, secondsLeft(s)) / 5 : remaining(s));

// ---------- h3: her hold ----------
// Her hand enters in held poses (>= 500 ms, on the 125 ms grid) and rests two fingertips on the purple box.
export const HAND = Object.freeze({ poses: [0, 500], press: 6, liftPink: 22, liftPurple: 6 });
export const handPose = (t, rm = false) => (rm ? 2 : t < HAND.poses[1] ? 1 : 2);
// How far a box sits (px, + = down): her fingers keep the purple one pressed; hover lifts pink 22, purple only 6.
export function boxOffset(id, hover, held = true) {
  if (id === 'pink') return hover ? -HAND.liftPink : 0;
  const rest = held ? HAND.press : 0;
  return hover ? rest - HAND.liftPurple : rest;
}

// The timeout ECU: pupils on the purple box, then ONE held cut into the lens. Options stay visible under it.
export const ECU = Object.freeze([
  { at: 0, look: 'box', line: "NANDA: You didn't say no." },
  { at: 1500, look: 'lens', line: 'NANDA: Not him. You.', under: 'The one clicking.' },
  { at: 4200, end: true },
]);
// The leave ECU (purple clicked): she looks at the box you pressed, then at you.
export const ECU_LEAVE = Object.freeze([
  { at: 0, look: 'box', line: 'NANDA: Right. Goodnight. That’s… fine.' },
  { at: 1800, look: 'lens', line: 'NANDA: Text me when you’re home.', under: 'I’ll know if you don’t.' },
  { at: 4400, end: true },
]);
export const beatAt = (beats, t) => beats.filter((b) => b.at <= t).pop();

// Which ending a settled menu plays. h2: purple after her edit reads Stay. Both: the timer never picks leave.
export function outcome3(s, rm = false, mode = 'h2') {
  if (!s.done) return null;
  if (s.picked === 'pink' || s.via === 'timeout') return 'stay';
  if (mode === 'h2' && s.picked === 'purple' && retyped3(s.t, rm)) return 'stay';
  return 'leave';
}

// "THE ROOM CHOSE PINK n OF N": endings seen on this machine.
export function tally3(history) {
  const pink = history.filter((h) => h === 'stay').length;
  return { pink, n: history.length };
}
