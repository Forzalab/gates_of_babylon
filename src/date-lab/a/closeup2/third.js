// closeup-3-r2 timing, pure (node-tested). The last shot: her OPEN hand slides the saucer toward the lens in held poses,
// then turns palm-up beside it ("for you"). Every pose is on the 8 fps grid and holds >= 500 ms. RM = the last pose, one cut.
export const PUSH_DUR = 5200;
export const PUSH = [
  { at: 0, push: 0, hand: 'back' },    // fingertips on the saucer rim
  { at: 1000, push: 1, hand: 'back' }, // slid once
  { at: 1500, push: 2, hand: 'back' }, // slid again, right under the lens
  { at: 2250, push: 2, hand: 'palm' }, // lets go, turns palm up: the cup is yours
];
export const PUSH_SUB = [
  { at: 400, text: 'NANDA: For Input B. Silly.' },
  { at: 2500, text: "NANDA: It's always three of us." },
];
export function pushAt(local, rm) {
  if (rm) return PUSH.at(-1);
  let cur = PUSH[0];
  for (const p of PUSH) if (local >= p.at) cur = p;
  return cur;
}
// where the hand's knuckle line sits (cup-group coords, before the push scale) and how it lies on the table
export const HAND = {
  back: { x: 1530, y: 672, rot: -16 },
  palm: { x: 1486, y: 716, rot: -14, squash: 0.82 }, // lifted a little and tilted to you: the palm shows
  s: 0.85,
  squash: 0.62, // the table plane at the Ozu low angle (cup rims are ~0.24; a hand lifted a little reads at 0.5)
};
