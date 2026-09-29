// Round-3 menu scripts (pure): the same beats as round 2, but every edit is a whole-chunk swap (<= 2 per second).
import { OPTIONS } from '../kit/menu.js';
import { wordEdit } from './chunks.js';

export const STAY = "It's late. Stay.";
const KEEP = "It's late. ";

// menu-h1-r3 "The Cup That Types": the slips on the two cards for a given run.
export function cupScript(run, disabled = [], rm = false) {
  if (run > 1 && disabled.includes('purple')) {
    return { purple: [{ at: 0, text: STAY, sel: 0 }], pink: wordEdit(OPTIONS.pink.text, OPTIONS.pink.text, ' ♡', 1000, { rm }), typing: 'pink', warmFrom: 1 };
  }
  if (run > 1 && disabled.includes('pink')) {
    return { pink: [{ at: 0, text: OPTIONS.pink.text, sel: 0 }], purple: wordEdit(OPTIONS.purple.text, '', OPTIONS.pink.text, 250, { rm }), typing: 'purple', warmFrom: 0 };
  }
  return { pink: [{ at: 0, text: OPTIONS.pink.text, sel: 0 }], purple: wordEdit(OPTIONS.purple.text, KEEP, 'Stay.', 250, { rm }), typing: 'purple', warmFrom: 0 };
}
// Purple picked: she retypes the flipped slip to "It's late. lea—" (you read the old text).
export const leaEdit = (rm) => wordEdit(OPTIONS.purple.text, KEEP, 'lea—', 700, { rm });

// menu-3-r3: MC's own line (cold open), the purple option and the timer label, all chunk swaps.
export const MC_FROM = "It's late. I should go home.";
export const MC_KEEP = "It's late. I should ";
export const mcLine = (rm = false) => wordEdit(MC_FROM, MC_KEEP, 'stay.', 500, { rm });
export function ddlcScript(run, disabled, rm) {
  if (run > 1 && disabled.includes('purple')) {
    return { purple: [{ at: 0, text: OPTIONS.purple.text, sel: 0 }], note: 'you already tried that', pink: wordEdit(OPTIONS.pink.text, OPTIONS.pink.text, ' ♡', 1000, { rm }), label: [] };
  }
  if (run > 1 && disabled.includes('pink')) {
    return { purple: wordEdit(OPTIONS.purple.text, '', OPTIONS.pink.text, 500, { rm }), note: 'you picked this. keep it.', pink: [{ at: 0, text: OPTIONS.pink.text, sel: 0 }], label: [] };
  }
  // purple swaps at 1000..2500 (4 swaps); the label: countdown -> emptied at 3000, typed at 3500 / 4000.
  // Never more than 2 swaps in any second (tested). Before label[0].at the label shows the live countdown.
  return {
    purple: wordEdit(OPTIONS.purple.text, KEEP, 'Stay.', 500, { rm }),
    pink: [{ at: 0, text: OPTIONS.pink.text, sel: 0 }],
    label: wordEdit('', '', 'take your time ♡', 3000, { rm }),
  };
}
