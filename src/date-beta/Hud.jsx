// Hud.jsx: the love HUD (research/date-beta-mockups/hud/SPEC.txt, variant A + Tony's literal copy pass).
// Ribbon = heart badge (N%), LOVE meter (1 cell = 1 point), the 100% goal, and the route trail (engine.trail).
// Pop = the delta pill + one literal line under the fill head. Goal card = the rules, once per run. End card = the result.
// All static by default (the reduced-motion frame); .play steps in at >= 334 ms per step, nothing loops.
import { lovePct } from './engine.js';
import { cardFor, REAL_ENDINGS, winLine } from './endcard.js';

const HEART = 'M50 88C22 66 4 50 4 28C4 13 16 4 29 4C39 4 46 10 50 17C54 10 61 4 71 4C84 4 96 13 96 28C96 50 78 66 50 88Z';
const CRACK = `${HEART} M50 17L42 36L56 48L45 62L50 88`;
const Line = ({ className, d = HEART }) => <svg className={className} viewBox="0 0 100 92" aria-hidden="true"><path d={d} /></svg>;
const Tri = () => <svg viewBox="0 0 26 30" aria-hidden="true"><path d="M3 3L23 15L3 27Z" /></svg>;
function BigHeart() {
  return (
    <svg className="lv-heart-svg" viewBox="0 0 100 92" aria-hidden="true">
      <path className="rim" d={HEART} /><path className="body" d={HEART} />
      <path className="gloss" d="M24 16C16 17 11 23 11 30C15 25 21 21 29 20C28 18 26 16 24 16Z" />
    </svg>
  );
}

// The gradients the hearts fill with. Rendered once, outside the stage's layout.
export function HudDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="lvHeartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef66b2" /><stop offset=".27" stopColor="#c42a82" /><stop offset=".72" stopColor="#c42a82" /><stop offset="1" stopColor="#8e1860" />
        </linearGradient>
        <linearGradient id="lvLowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6b7d" /><stop offset="1" stopColor="#b0102c" /></linearGradient>
      </defs>
    </svg>
  );
}

// NEXT ▸: the glossy pill. Its own click never falls through to the stage (that would advance twice).
export function NextButton({ label = 'NEXT', onClick, className = '' }) {
  return (
    <button type="button" className={`hud-next ${className}`} aria-label={label === 'NEXT' ? 'Next' : label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {label} <Tri />
    </button>
  );
}

// react = the reaction { from, to, love, tell } (or null). Cells between from and to step in (new) or out (lost).
function Cells({ love, goal, react }) {
  const prev = react ? react.from : love;
  let k = 0;
  return Array.from({ length: goal }, (_, i) => {
    let c = '';
    if (i < love) c = react && love > prev && i >= prev ? 'new' : 'on';
    else if (react && love < prev && i < prev) c = 'lost';
    const step = c === 'new' || c === 'lost' ? { '--i': k++ } : undefined;
    return <i key={i} className={`lv-cell ${c}`} style={step} />;
  });
}

function Pop({ react }) {
  const plus = react.love > 0;
  return (
    <div className={`lv-pop ${plus ? 'plus' : 'minus'}`} role="status">
      <b className={`lv-delta${plus ? '' : ' minus'}`}><Line d={plus ? HEART : CRACK} />{plus ? '+' : '−'}{Math.abs(react.love)}</b>
      {react.tell && <span className="lv-tell"><i />{plus ? 'She liked that.' : 'She did not like that.'}</span>}
    </div>
  );
}

function Trail({ trail }) {
  const at = trail.stops.findIndex((s) => s.state === 'here');
  const here = trail.stops[at];
  const out = [];
  trail.stops.forEach((s, i) => {
    if (i) out.push(<i key={`r${i}`} className="rail" />);
    if (s.state === 'here') {
      const pips = trail.beats > 1 && trail.beats <= 8
        ? <span className="pips">{Array.from({ length: trail.beats }, (_, b) => <i key={b} className={`pip${b <= trail.beat ? ' on' : ''}`} />)}</span>
        : trail.beats > 8 ? <span className="count">{trail.beat + 1}/{trail.beats}</span> : null;
      out.push(<span key={i} className="here">{s.short}{pips}</span>);
    } else if (s.end) out.push(<i key={i} className={`stop end${s.state === 'done' ? ' done' : ''}`}><Line /></i>);
    else out.push(<i key={i} className={`stop${s.state === 'done' ? ' done' : ''}`} />);
  });
  return <div className="lv-trail" role="img" aria-label={`Scene ${at + 1} of ${trail.stops.length}: ${here?.short ?? ''}`}>{out}</div>;
}

// The ribbon along the top edge. pop = the reaction to show now (a fresh pick or a pending one), else null.
export function Hud({ love, goal, trail, pop }) {
  const pct = lovePct(love, goal);
  return (
    <div className="hud-a" style={{ '--goal': goal, '--n': love }}>
      <div className="lv-badge"><BigHeart /><b className="lv-num">{pct}%</b></div>
      <span className="lv-label">LOVE</span>
      <div className="lv-meter" role="meter" aria-label="Her heart" aria-valuemin="0" aria-valuemax={goal} aria-valuenow={love}>
        <Cells love={love} goal={goal} react={pop} />
        <span className="lv-marker" aria-hidden="true">
          <svg viewBox="0 0 100 92"><path d={HEART} /><path className="in" d={HEART} transform="translate(50 46) scale(.56) translate(-50 -46)" /></svg>
        </span>
        {pop && <Pop react={pop} />}
      </div>
      <span className={`lv-goal${pct >= 100 ? ' full' : ''}`}><Line />100%</span>
      <i className="lv-sep" />
      <Trail trail={trail} />
    </div>
  );
}

export function GoalCard({ onNext }) {
  return (
    <section className="hud-card" aria-label="Goal">
      <i className="notch" aria-hidden="true" /><b className="tag">GOAL</b>
      <h2>Make Nanda like you.</h2>
      <p>Her LOVE score must reach 100%.<br /><b>Each choice changes it.<br />Choose carefully.</b><Line /></p>
      <div className="legend">
        <b className="lv-delta"><Line />+3</b><span>she liked it</span><i className="gap" />
        <b className="lv-delta minus"><Line d={CRACK} />−2</b><span>she did not like it</span>
      </div>
      <NextButton label="GOT IT" onClick={onNext} />
    </section>
  );
}

// end = engine.ending(): { kind, scene, pct, tier }. endcard.cardFor picks the card: 100% = the win card; a real ending
// (STEEPED / ESCAPE / ESCAPE?) keeps its own ending card at any %; anything else is a real loss = the fail card, whose
// line (endcard.failLine) is picked by seed + run and varies by ending and love band. line = that text, {RUN} filled.
export function EndCard({ end, line = '', onAgain }) {
  const mode = cardFor(end);
  if (mode === 'ending') {
    const e = REAL_ENDINGS[end.scene];
    return (
      <>
        <div className="hud-scrim" aria-hidden="true" />
        <section className="hud-end ending" aria-label={`Ending: ${e.title}`} data-card="ending">
          <p className="kicker">ENDING</p>
          <h2>{e.title}</h2>
          <p className="sub">{e.line}</p>
          <p className="stat"><Line />LOVE {end.pct}%</p>
          <NextButton label="PLAY AGAIN" onClick={onAgain} />
        </section>
      </>
    );
  }
  const win = mode === 'win';
  return (
    <>
      <div className="hud-scrim" aria-hidden="true" />
      <section className={`hud-end ${win ? 'win' : 'low'}`} aria-label={win ? 'You win' : 'Game over'} data-card={mode}>
        <p className="kicker">{win ? 'YOU WIN' : 'GAME OVER'}</p>
        <div className="bigheart">
          {win ? <BigHeart /> : (
            <svg className="low-heart" viewBox="0 0 100 92" aria-hidden="true">
              <defs><clipPath id="lvLowClip"><rect x="0" y={92 - (92 * end.pct) / 100} width="100" height="92" /></clipPath></defs>
              <path className="shell" d={HEART} /><path className="part" d={HEART} clipPath="url(#lvLowClip)" /><path className="crack" d="M50 17L44 26L52 31" />
            </svg>
          )}
          <b className="lv-num">{end.pct}%</b>
        </div>
        <h2>{win ? 'She loves you.' : line}</h2>
        <p className="sub">{win ? winLine(end) : `LOVE ${end.pct}%. You needed 100%.`}</p>
        <NextButton label={win ? 'PLAY AGAIN' : 'TRY AGAIN'} onClick={onAgain} />
      </section>
    </>
  );
}
