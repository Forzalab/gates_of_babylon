// Round-2 letterbox menus, pure parts (node --test drives them).
// HER EDIT (menu-h2-r2): on the menu's own clock, the purple label is hers after 3 s.
//   0 .. 3000   "It's late. Goodnight."  (her red caret already parked after it: the tell from the first frame)
//   3000 .. 3375 glitch: the word splits in her red/pink (one held state, 375 ms >= 334 ms)
//   3375 .. 3875 her caret selects "Goodnight." (one held state, 500 ms)
//   3875 ..      "Stay." typed one key per 125 ms (8 fps grid) -> done at 4375, before the 5 s timeout
//   reduced motion: one hard cut at 3000 to the finished edit ("Goodnight." struck, "Stay." in), held.
export const EDIT = Object.freeze({ glitchAt: 3000, selectAt: 3375, typeAt: 3875, key: 125, keep: "It's late. ", from: 'Goodnight.', to: 'Stay.' });
export const editDone = EDIT.typeAt + (EDIT.to.length - 1) * EDIT.key; // 4375

// What the purple label shows at menu time t.
export function purpleLabel(t, rm = false) {
  const { keep, from, to } = EDIT;
  if (t < EDIT.glitchAt) return { keep, word: from, stage: 'clean', struck: '' };
  if (rm) return { keep, word: to, stage: 'done', struck: from };
  if (t < EDIT.selectAt) return { keep, word: from, stage: 'glitch', struck: '' };
  if (t < EDIT.typeAt) return { keep, word: from, stage: 'select', struck: '' };
  const n = Math.min(to.length, Math.floor((t - EDIT.typeAt) / EDIT.key) + 1);
  return { keep, word: to.slice(0, n), stage: n >= to.length ? 'done' : 'typing', struck: from };
}
// Once she has started typing, the purple button no longer says goodbye: a click on it reads as "Stay."
export const retyped = (t, rm = false) => (rm ? t >= EDIT.glitchAt : t >= EDIT.typeAt);

// Which ending a settled menu plays: 'stay' (pink, or purple after her edit, or a timeout) or 'leave'.
export function outcome(s, rm = false, mode = 'h2') {
  if (!s.done) return null;
  if (s.picked === 'pink') return 'stay';
  if (mode === 'h2' && s.picked === 'purple' && retyped(s.t, rm)) return 'stay';
  return 'leave';
}

// MENU-4-R2 LEAN: the lean toward pink is visible before any timeout.
//  - the pink cup opens already PRE-POURED (22 %), then fills with the time
//  - the two boxes are unequal from the first frame and diverge: pink grows, purple is squeezed
export const PREPOUR = 0.3;
export const pinkFill = (r) => PREPOUR + (1 - PREPOUR) * (1 - r); // r = remaining 1 -> 0
export function widths(r, total = 1260) {
  const pink = Math.round(730 + (880 - 730) * (1 - r));
  return { pink, purple: total - pink };
}

// "The room chose pink": a tally of endings seen on this machine (Bandersnatch's end-of-film stats).
export function tally(history) {
  const pink = history.filter((h) => h === 'stay').length;
  return { pink, n: history.length, pct: history.length ? Math.round((pink / history.length) * 100) : 0 };
}
