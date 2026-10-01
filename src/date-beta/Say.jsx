// Say.jsx: the HA chrome for one beat: the dialogue chip, the choice buttons, and the OR rule (UXUI R2b rule C).
// The engine hands over parsed parts ({ t, or }); an OR exists only where the data wrote "{OR}". Nothing here
// pattern-matches words. A line or choice with an OR renders on the dark scrim (#1A0710, OR #FF6B7D, cream text).
import { orParts, splitParts } from './engine.js';
import { fill } from './meta.js';
import { NextButton } from './Hud.jsx';
// Class names are prefixed `db-` so they can never collide with art classes (R2b finding 2: the art used `.or`).

// train-r4 styled spans (engine SPANS): wavy = italic + a teal wavy underline; hat = bold orange + a small cap-icon chip.
// The words stay real text (screen readers + OCR read them); the cap chip is decoration (aria-hidden).
const CapIcon = () => (
  <svg className="db-cap" viewBox="0 0 24 16" aria-hidden="true" focusable="false">
    <path d="M3 11C3 5 7 2 12 2s9 3 9 9Z" fill="currentColor" /><path d="M1 11h22v2.5H1Z" fill="currentColor" /><circle cx="12" cy="2.4" r="1.6" fill="#fff" />
  </svg>
);
export function Parts({ parts }) {
  return parts.map((p, i) => (p.or ? <span key={i} className="db-or">OR</span>
    : p.span === 'hat' ? <span key={i} className="db-span db-hat"><span className="db-hat-chip" aria-hidden="true"><CapIcon /></span>{fill(p.t)}</span>
      : p.span ? <em key={i} className={`db-span db-${p.span}`}>{fill(p.t)}</em> : fill(p.t)));
}

// SVG twin of <Parts> for signage inside art: tspans in a <text>, OR offset 1 px. Same explicit "{OR}" mark.
export function OrSpans({ text }) {
  const parts = orParts(text, 'svg text');
  return parts.map((p, i) => (p.or ? <tspan key={i} className="db-or-svg" dx="1" dy="1">OR</tspan>
    : <tspan key={i} dy={i && parts[i - 1].or ? -1 : 0}>{p.t}</tspan>));
}

// line = engine beat.line: { who, parts, hasOr }. No speaker = narration. onNext set = the NEXT pill (click beats, after hold).
// Scene A two-step lines (props.cut, SceneA.jsx): `lead` = a line shown on top first, the beat's line reveals under it
// once `stepped`; `at` = split the beat's line at that text, the rest reveals in place once `stepped`. Hidden parts keep
// their space (visibility), so the box never jumps. action = drawn where NEXT sits (the smile tag) when there is no NEXT.
export function Say({ line, onNext = null, lead = null, at = null, stepped = true, action = null, label }) {
  const who = line.who;
  const cls = ['db-say', who ? `who-${who.toLowerCase().split(/[\s(]+/)[0]}` : 'narration', who && /\(/.test(who) && 'offscreen', line.hasOr && 'has-or', lead && 'two-step'];
  const [head, tail] = at ? splitParts(line.parts, at) : [line.parts, []];
  return (
    <div className={cls.filter(Boolean).join(' ')} role="status" data-step={lead || at ? (stepped ? '2' : '1') : undefined}>
      <span className="pins top" aria-hidden="true" /><span className="pins bot" aria-hidden="true" />
      {who && <b className="who">{who}</b>}
      {lead && <p className="line lead"><Parts parts={orParts(lead, 'lead')} /></p>}
      {lead ? <p className={`line${stepped ? '' : ' db-later'}`}><Parts parts={line.parts} /></p>
        : <p className="line"><Parts parts={head} />{tail.length > 0 && <span className={stepped ? 'db-now' : 'db-later'}><Parts parts={tail} /></span>}</p>}
      {onNext ? <NextButton label={label} onClick={onNext} /> : action}
    </div>
  );
}


// Glossy choice pills (R2c). Pink = toward her, purple = leave; an OR choice keeps its side on the rim + key (rule C).
// on[i] false = the choice's `if` fails (drawn, not pickable); left = timer seconds remaining (null = no timer).
// later: drawn but invisible until a two-step line has stepped (keeps the layout still; no jump when they appear).
// ux-six: the first beat with hidden chips shows a one-time legend (once per page load, on that beat only).
let legendAt = null;
// order[slot] = the choice index shown in that slot (run 1 shuffles it, main.jsx); blind = no chips (run 1).
export function Choices({ choices, onPick, on = [], left = null, total = null, def = -1, hidden = false, later = false, beatKey = null, order = null, blind = false }) {
  const chips = !blind && choices.some((c) => c.love);
  if (hidden && chips && legendAt == null) legendAt = beatKey ?? '';
  const legend = hidden && chips && legendAt === (beatKey ?? '');
  const timed = left != null && total > 0;
  return (
    <div className={`db-choices n${choices.length}${timed ? ' timed' : ''}${later ? ' db-later' : ''}`} role="group" aria-label="choose" aria-hidden={later || undefined}>
      {timed && (
        <div className="db-timebar" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
          <i style={{ width: `${Math.max(0, Math.min(100, (100 * left) / total))}%` }} />
          <span className="db-timer">TIME ⏳ {Math.ceil(left)}</span>
        </div>
      )}
      {legend && <div className="db-legend" role="note"><b>?? </b>= hidden, find out</div>}
      {(order ?? choices.map((_, i) => i)).map((i, slot) => { const c = choices[i]; return (
        <button type="button" key={i} className={`db-choice ${c.side}${c.hasOr ? ' has-or' : ''}${timed && i === def ? ' is-default' : ''}`}
          disabled={on[i] === false} aria-label={`${slot + 1}: ${fill(c.plain)}`} onClick={(e) => { e.stopPropagation(); onPick(i); }}>
          {chips && <LoveChip love={c.love} hidden={hidden} />}
          <span className="line"><Parts parts={c.parts} /></span>
          {timed && i === def && <span className="db-deftag">default</span>}
        </button>
      ); })}
    </div>
  );
}

// The value chip on a choice (hooks into the HUD's heart look: same pink / crack colours). +n = heart, 0 = plain, -n = cracked.
// hidden (beat `loveHidden`): the number reads "??" (same chip, same colours; the score still changes on the pick).
export function LoveChip({ love, hidden = false }) {
  const cls = love > 0 ? 'up' : love < 0 ? 'down' : 'zero';
  return <span className={`db-chip ${cls}`} aria-hidden="true">{love < 0 ? '\u2661' : '\u2665'} {hidden ? '??' : love > 0 ? `+${love}` : love < 0 ? `\u2212${-love}` : '0'}</span>;
}
