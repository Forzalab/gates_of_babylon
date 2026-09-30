// HER LIST (the v2-shop mini-game, brain _drift 2026-09-30T0200 alt spec): pure rules, no DOM, so node --test drives it.
// 3 aisles reached by hard cut. Each: her list item, a shelf of 3-4 items (keys 1-4), a stepped "She is waiting" timer.
// A wrong pick (or the timer running out) raises her mood level for the rest of the game: 1 pout, 2 OCPD shelf
// straighten, 3+ BPD split. The run ends in one score bucket = the index of the game beat's choice (its love value).
export const SECS = 12; // per aisle; 3 x 12 s + the holds stays under the 45 s budget
export const HOLD = { right: 1500, wrong: 1400, split: 900 }; // ms, every frame >= 334 ms (stepped, no motion)

export const ROUNDS = [
  { id: 'produce', aisle: 'AISLE 1 · VEGETABLES', want: 'carrots', bg: 'shop-aisle-produce', close: 'shop-carrots',
    items: [
      { id: 'carrots', label: 'Carrots', ok: true },
      { id: 'daikon', label: 'White radish' },
      { id: 'potato', label: 'Sweet potato' },
      { id: 'jar', label: 'KEMEY jar', aside: 'Why is her name on a jar? Put it back.' },
    ],
    right: 'Carrots! You read my list. ♡' },
  { id: 'eggs', aisle: 'AISLE 2 · EGGS + MILK', want: 'eggs', bg: 'shop-aisle-eggs', close: 'shop-eggs-rack',
    items: [
      { id: 'milk', label: 'Milk' },
      { id: 'eggs', label: 'Eggs', ok: true },
      { id: 'natto', label: 'Natto beans' },
    ],
    right: 'Eggs. For your lunch tomorrow. ♡',
    rightRolls: 'Eggs. For the egg rolls. You remember. ♡' },
  { id: 'cups', aisle: 'AISLE 3 · CUPS', want: 'three cups', bg: 'shop-aisle-cups', close: 'shop-cups-front',
    items: [
      { id: 'one', label: 'One cup' },
      { id: 'pair', label: 'Two cups', aside: 'Two? Then who is the third cup for?' },
      { id: 'three', label: 'Three cups', ok: true },
    ],
    right: 'Three cups. One for you. Two for me. ♡' },
];

// her mood line per level (1 = first wrong pick of the game)
export const MOOD = [
  null,
  { face: 'pout', layers: ['puff'], line: 'Oh. That is not on my list.' },
  { face: 'vein', layers: ['vein'], line: 'She puts it back. She lines up the whole shelf. "It goes here. Always here."', bg: 'shop-tea-tins' },
  { face: 'split', layers: ['shadow-eyes'], line: 'You forgot me already?', sweet: 'Ehehe. Try again, ne? ♡' },
];
export const moodOf = (wrongs) => MOOD[Math.min(wrongs, 3)];
export const TIMEOUT_LINE = 'She is done waiting. She takes it herself.';

// Score bucket = the game beat's choice index: 0 = two or more wrong (love -2), 1 = one wrong (+2), 2 = none (+3).
export const bucket = (wrongs) => (wrongs <= 0 ? 2 : wrongs === 1 ? 1 : 0);

// keys 1-4 -> the shelf slot (null when the key is not a slot on this shelf)
export function keySlot(key, n) {
  if (!/^[1-9]$/.test(key)) return null;
  const i = +key - 1;
  return i < n ? i : null;
}

// One pick: returns the next state. state = { r, wrongs, done } ; a right pick moves on, a wrong one only counts.
export function pickItem(state, slot) {
  const round = ROUNDS[state.r];
  const item = round?.items[slot];
  if (!item || state.done) return { ...state, last: null };
  if (item.ok) {
    const r = state.r + 1;
    return { ...state, r, done: r >= ROUNDS.length, last: { ok: true, round: round.id, item: item.id } };
  }
  return { ...state, wrongs: state.wrongs + 1, last: { ok: false, round: round.id, item: item.id } };
}

// The timer ran out: it counts as a wrong pick, and she takes the right item herself (the game moves on).
export function timeOut(state) {
  const r = state.r + 1;
  return { ...state, wrongs: state.wrongs + 1, r, done: r >= ROUNDS.length, last: { ok: false, timeout: true, round: ROUNDS[state.r]?.id } };
}

export const fresh = () => ({ r: 0, wrongs: 0, done: false, last: null });
