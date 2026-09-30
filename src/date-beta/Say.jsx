// Say.jsx: the HA chrome for one beat: the dialogue chip, the choice buttons, and the OR rule (UXUI R2b rule C).
// The engine hands over parsed parts ({ t, or }); an OR exists only where the data wrote "{OR}". Nothing here
// pattern-matches words. A line or choice with an OR renders on the dark scrim (#1A0710, OR #FF6B7D, cream text).
import { orParts } from './engine.js';
// Class names are prefixed `db-` so they can never collide with art classes (R2b finding 2: the art used `.or`).

export function Parts({ parts }) {
  return parts.map((p, i) => (p.or ? <span key={i} className="db-or">OR</span> : p.t));
}

// SVG twin of <Parts> for signage inside art: tspans in a <text>, OR offset 1 px. Same explicit "{OR}" mark.
export function OrSpans({ text }) {
  const parts = orParts(text, 'svg text');
  return parts.map((p, i) => (p.or ? <tspan key={i} className="db-or-svg" dx="1" dy="1">OR</tspan>
    : <tspan key={i} dy={i && parts[i - 1].or ? -1 : 0}>{p.t}</tspan>));
}

// NEXT ▸ (HUD SPEC): the HA glossy pill, one notch darker so white text holds 4.5:1. On the chip it straddles the bottom-right
// edge (mirror of the name tag); the goal / end cards reuse it (GOT IT, PLAY AGAIN, TRY AGAIN). Click = the same as
// Space / Enter / -> (the player's keys skip a focused button so one press never moves twice).
export function NextPill({ label = 'NEXT', onClick, className = '' }) {
  return (
    <button type="button" className={`db-next${className ? ` ${className}` : ''}`} aria-label={label === 'NEXT' ? 'Next line' : label}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      {label}<svg viewBox="0 0 26 30" aria-hidden="true"><path d="M3 3L23 15L3 27Z" /></svg>
    </button>
  );
}

// line = engine beat.line: { who, parts, hasOr }. No speaker = narration. next = show NEXT (a click beat past its hold).
export function Say({ line, next = false, onNext }) {
  const who = line.who;
  const cls = ['db-say', who ? `who-${who.toLowerCase().replace(/\s+/g, '-')}` : 'narration', line.hasOr && 'has-or'];
  return (
    <div className={cls.filter(Boolean).join(' ')} role="status">
      <span className="pins top" aria-hidden="true" /><span className="pins bot" aria-hidden="true" />
      {who && <b className="who">{who}</b>}
      <p className="line"><Parts parts={line.parts} /></p>
      {next && <NextPill onClick={onNext} />}
    </div>
  );
}

// Glossy choice pills (R2c). Pink = toward her, purple = leave; an OR choice keeps its side on the rim + key (rule C).
// on[i] false = the choice's `if` fails (drawn, not pickable); left = timer seconds remaining (null = no timer).
export function Choices({ choices, onPick, on = [], left = null }) {
  return (
    <div className="db-choices" role="group" aria-label="choose">
      {left != null && <span className="db-timer" aria-live="off">{Math.ceil(left)}</span>}
      {choices.map((c, i) => (
        <button type="button" key={i} className={`db-choice ${c.side}${c.hasOr ? ' has-or' : ''}`}
          disabled={on[i] === false} aria-label={`${i + 1}: ${c.plain}`} onClick={(e) => { e.stopPropagation(); onPick(i); }}>
          <span className="line"><Parts parts={c.parts} /></span>
        </button>
      ))}
    </div>
  );
}
