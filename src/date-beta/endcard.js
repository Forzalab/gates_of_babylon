// endcard.js: which card an `end` beat shows, and the fail card's line (sprint 0930 UX fix pack, REPORT-A top 5 / REPORT-B P0).
// Real endings (STEEPED, ESCAPE, ESCAPE?) keep their own ending card at any love %: the story ending IS the payoff.
// The love gate (the fail card) shows only on a real loss: an ending that is not one of those, below 100%.
// 100% on any ending is the win card. Plain JS so node --test can check it.
import { unit } from './gacha.js';

// Scene id -> the ending's own card. `title` = the big word (it is the ending's name), `line` = one short grade-2 line.
export const REAL_ENDINGS = Object.freeze({
  steeped: Object.freeze({ title: 'STEEPED', line: 'You drank. She keeps you now.' }),
  'escape-win': Object.freeze({ title: 'ESCAPE', line: 'You got out. She was already there.' }),
  'escape-timeout': Object.freeze({ title: 'ESCAPE?', line: 'You waited. Now there are four cups.' }),
});

// The fail card's lines. Her voice: yandere, BPD / OCPD (clingy, counting, forgiving, keeping score). Each hints to go
// back and look around, never says how. `at` = the ending scene it fits ('*' = any), `band` = the love band ('*' = any).
// Every (ending, band) pair has 5 candidates, so two seeds or two runs rarely land on the same line.
export const FAIL_LINES = Object.freeze([
  { at: '*', band: '*', text: 'You left a crumb. I noticed. Again?' },
  { at: '*', band: '*', text: "Day {RUN}. You still don't know which door." },
  { at: '*', band: 'low', text: 'I forgive you. I always do. Start over.' },
  { at: '*', band: 'low', text: 'One jar for each try. This is {RUN}.' },
  { at: '*', band: 'almost', text: 'So close. Try the other cup.' },
  { at: '*', band: 'almost', text: 'Almost mine. Look under the table.' },
  { at: 'leave-fu', band: '*', text: "You said leave. I heard 'again'." },
  { at: 'leave-yeah', band: '*', text: 'You said yes. You lied. Noon again.' },
].map(Object.freeze));

// The love band of an ending: 'almost' (60..99%) or 'low' (below 60%). The win tier never reaches the fail card.
export const bandOf = (end) => (end.tier === 'almost' ? 'almost' : 'low');

// 'win' | 'ending' | 'fail' for engine.ending()'s { scene, tier }.
export function cardFor(end) {
  if (end.tier === 'win') return 'win';
  return REAL_ENDINGS[end.scene] ? 'ending' : 'fail';
}

// The lines that fit this ending and band.
export const failPool = (end) => FAIL_LINES.filter((l) => (l.at === '*' || l.at === end.scene) && (l.band === '*' || l.band === bandOf(end)));

// One line, picked by hash(seed, run): the same seed + run shows the same line; a new run (or seed) moves it.
// Returns the raw text; the card fills {RUN} with meta.fill.
export function failLine(end, { seed = 0, run = 1 } = {}) {
  const pool = failPool(end);
  return pool[Math.floor(unit(seed >>> 0, run) * pool.length)].text;
}
