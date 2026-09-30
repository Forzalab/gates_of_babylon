// Say.jsx: the HA chrome for one beat: the dialogue chip, the choice buttons, and the OR rule (UXUI R2b rule C).
// The engine hands over parsed parts ({ t, or }); an OR exists only where the data wrote "{OR}". Nothing here
// pattern-matches words. A line or choice with an OR renders on the dark scrim (#1A0710, OR #FF6B7D, cream text).
import { orParts } from './engine.js';
import { NextButton } from './Hud.jsx';
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

// line = engine beat.line: { who, parts, hasOr }. No speaker = narration. onNext set = the NEXT pill (click beats, after hold).
export function Say({ line, onNext = null }) {
  const who = line.who;
  const cls = ['db-say', who ? `who-${who.toLowerCase().replace(/\s+/g, '-')}` : 'narration', line.hasOr && 'has-or'];
  return (
    <div className={cls.filter(Boolean).join(' ')} role="status">
      <span className="pins top" aria-hidden="true" /><span className="pins bot" aria-hidden="true" />
      {who && <b className="who">{who}</b>}
      <p className="line"><Parts parts={line.parts} /></p>
      {onNext && <NextButton onClick={onNext} />}
    </div>
  );
}

// Glossy choice pills (R2c). Pink = toward her, purple = leave; an OR choice keeps its side on the rim + key (rule C).
// on[i] false = the choice's `if` fails (drawn, not pickable); left = timer seconds remaining (null = no timer).
export function Choices({ choices, onPick, on = [], left = null, total = null, def = -1 }) {
  const chips = choices.some((c) => c.love);
  const timed = left != null && total > 0;
  return (
    <div className={`db-choices n${choices.length}${timed ? ' timed' : ''}`} role="group" aria-label="choose">
      {timed && (
        <div className="db-timebar" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
          <i style={{ width: `${Math.max(0, Math.min(100, (100 * left) / total))}%` }} />
          <span className="db-timer">{Math.ceil(left)}</span>
        </div>
      )}
      {choices.map((c, i) => (
        <button type="button" key={i} className={`db-choice ${c.side}${c.hasOr ? ' has-or' : ''}${timed && i === def ? ' is-default' : ''}`}
          disabled={on[i] === false} aria-label={`${i + 1}: ${c.plain}`} onClick={(e) => { e.stopPropagation(); onPick(i); }}>
          {chips && <LoveChip love={c.love} />}
          <span className="line"><Parts parts={c.parts} /></span>
          {timed && i === def && <span className="db-deftag">default</span>}
        </button>
      ))}
    </div>
  );
}

// The value chip on a choice (hooks into the HUD's heart look: same pink / crack colours). +n = heart, 0 = plain, -n = cracked.
export function LoveChip({ love }) {
  const cls = love > 0 ? 'up' : love < 0 ? 'down' : 'zero';
  return <span className={`db-chip ${cls}`} aria-hidden="true">{love < 0 ? '\u2661' : '\u2665'} {love > 0 ? `+${love}` : love < 0 ? `\u2212${-love}` : '0'}</span>;
}
