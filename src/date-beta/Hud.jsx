// Hud.jsx: the love HUD (research/date-beta-mockups/hud/SPEC.txt). Variant A = the top-edge ribbon: the love meter (one
// cell per point, goal = the engine's best reachable score), the route trail and the beat pips. The bar lives only in
// <RibbonA>; <Hud> picks the variant, so swapping to B (the thermometer beside her) is one new component + one line.
// Also: <Pop> (delta pill + tell line after a scored pick), <GoalCard>, <EndCard> (win / almost / low), <HudDefs>.
// Motion is CSS (hud.css): steps of >= 334 ms, nothing loops or pulses; .rm = the final frame, hard cut.
import { Fragment } from 'react';
import { lovePct } from './engine.js';
import { NextPill } from './Say.jsx';
import './hud.css';

// Every player-facing HUD string. DRAFT (Tony's literal copy, Tue 9/29; the "almost" card is ours): edit here.
export const COPY = {
  label: 'LOVE',
  goal: { tag: 'GOAL', title: 'Make Nanda like you.', body: 'Her LOVE score must reach 100%.', strong: ['Each choice changes it.', 'Choose carefully.'],
    plus: 'she liked it', minus: 'she did not like it', button: 'GOT IT' },
  tell: { plus: 'She liked that.', minus: 'She did not like that.' },
  hint: 'Click anywhere to continue',
  end: {
    win: { kicker: 'YOU WIN', title: 'She loves you.', sub: () => 'You drank all her tea. You are not leaving.', button: 'PLAY AGAIN' },
    almost: { kicker: 'SO CLOSE', title: "She'll wait for you.", sub: (pct) => `LOVE ${pct}%. You needed 100%.`, button: 'TRY AGAIN' },
    low: { kicker: 'GAME OVER', title: 'She does not love you enough.', sub: (pct) => `LOVE ${pct}%. You needed 100%.`, button: 'TRY AGAIN' },
  },
};
export const VARIANT = 'A';

const HEART = 'M50 88C22 66 4 50 4 28C4 13 16 4 29 4C39 4 46 10 50 17C54 10 61 4 71 4C84 4 96 13 96 28C96 50 78 66 50 88Z';
const HeartSvg = () => (
  <svg className="lv-heart-svg" viewBox="0 0 100 92" aria-hidden="true">
    <path className="rim" d={HEART} /><path className="body" d={HEART} />
    <path className="gloss" d="M24 16C16 17 11 23 11 30C15 25 21 21 29 20C28 18 26 16 24 16Z" />
  </svg>
);
const HeartLine = () => <svg viewBox="0 0 100 92" aria-hidden="true"><path d={HEART} /></svg>;
const Cracked = () => <svg viewBox="0 0 100 92" aria-hidden="true"><path d={`${HEART} M50 17L42 36L56 48L45 62L50 88`} /></svg>;
const Marker = () => (
  <span className="lv-marker" aria-hidden="true">
    <svg viewBox="0 0 100 92"><path d={HEART} /><path className="in" d={HEART} transform="translate(50 46) scale(.56) translate(-50 -46)" /></svg>
  </span>
);

// The gradients the hearts share. Render once per stage.
export const HudDefs = () => (
  <svg className="lv-defs" width="0" height="0" aria-hidden="true">
    <defs>
      <linearGradient id="lvHeartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ef66b2" /><stop offset=".27" stopColor="#c42a82" />
        <stop offset=".72" stopColor="#c42a82" /><stop offset="1" stopColor="#a31d6c" /></linearGradient>
      <linearGradient id="lvLowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6b7d" /><stop offset="1" stopColor="#b0102c" /></linearGradient>
      <linearGradient id="lvMidFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f27fc0" /><stop offset="1" stopColor="#c42a82" /></linearGradient>
    </defs>
  </svg>
);

// One cell per love point. On a reaction: cells gained = "new" (pale ring), cells lost = "lost" (dark hatch), each
// stepping in one per 334 ms (--i).
function cells(goal, love, react) {
  const from = react ? react.from : love;
  let k = 0;
  return Array.from({ length: goal }, (_, i) => {
    let c = '';
    if (i < love) c = react && react.love > 0 && i >= from ? 'new' : 'on';
    else if (react && react.love < 0 && i < from) c = 'lost';
    const step = c === 'new' || c === 'lost' ? { '--i': k++ } : undefined;
    return <i key={i} className={`lv-cell${c ? ` ${c}` : ''}`} style={step} />;
  });
}

// The route trail: AND Line station dots. done = filled, here = a capsule with the scene's name + one pip per beat
// (n/N over 8 beats), next = hollow, the ending = a heart.
function Trail({ stops, beat, beats }) {
  const at = stops.findIndex((x) => x.state === 'here');
  return (
    <div className="lv-trail" role="img" aria-label={`Scene ${at + 1} of ${stops.length}: ${stops[at]?.short ?? ''}`}>
      {stops.map((x, i) => (
        <Fragment key={`${x.id}${i}`}>
          {i > 0 && <i className="rail" />}
          {x.state === 'here' ? (
            <span className="here">{x.short}
              {beats > 8 ? <span className="count">{beat + 1}/{beats}</span>
                : beats > 1 && <span className="pips">{Array.from({ length: beats }, (_, b) => <i key={b} className={`pip${b <= beat ? ' on' : ''}`} />)}</span>}
            </span>
          ) : x.end ? <i className={`stop end ${x.state}`}><HeartLine /></i> : <i className={`stop ${x.state}`} />}
        </Fragment>
      ))}
    </div>
  );
}

// VARIANT A: the top-edge ribbon, x 32..1580 (clear of the chrome chips), meter left edge at stage x 242 (see hud.css).
export function RibbonA({ love, goal, react = null, trail, ring = false }) {
  const pct = lovePct(love, goal);
  return (
    <div className={`hud-a${ring ? ' ring' : ''}`} style={{ '--goal': goal, '--n': love }}>
      <div className="lv-badge"><HeartSvg /><b className="lv-num">{pct}%</b></div>
      <span className="lv-label">{COPY.label}</span>
      <div className="lv-meter" role="meter" aria-label="Her heart" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={love} aria-valuetext={`${pct}%`}>
        {cells(goal, love, react)}<Marker />
      </div>
      <span className={`lv-goal${pct >= 100 ? ' full' : ''}`}><HeartLine />100%</span>
      <i className="lv-sep" />
      <Trail {...trail} />
    </div>
  );
}

// The bar, whichever variant is live. goal 0 (a script with no love) = nothing to show.
export function Hud(props) {
  if (!(props.goal > 0)) return null;
  return <RibbonA {...props} />;
}

// The pop after a scored pick: the delta pill, hung from the fill head under the ribbon, + the tell line.
export function Pop({ react, goal }) {
  if (!(goal > 0)) return null;
  const plus = react.love > 0, tell = plus ? COPY.tell.plus : COPY.tell.minus;
  const delta = `${plus ? '+' : '−'}${Math.abs(react.love)}`;
  return (
    <div className={`lv-pop ${plus ? 'plus' : 'minus'}`} role="status" aria-label={react.tell ? `${delta}. ${tell}` : delta}
      style={{ '--n': react.to, '--goal': goal }}>
      <b className={`lv-delta${plus ? '' : ' minus'}`}>{plus ? <HeartLine /> : <Cracked />}{delta}</b>
      {react.tell && <span className="lv-tell"><i />{tell}</span>}
    </div>
  );
}

// Onboarding: big on the first screen, then small for the rest of the game (click beats only; the player decides).
export const ClickHint = ({ big }) => <p className={`db-hint ${big ? 'big' : 'small'}`} aria-hidden={!big}>{COPY.hint} ▸</p>;

// The goal card (rooftop beat 0, right after the Figur collapse). The notch points up at the meter.
export function GoalCard({ ready, onNext }) {
  const g = COPY.goal;
  return (
    <section className="hud-card" aria-label="Goal">
      <i className="notch" aria-hidden="true" /><b className="tag">{g.tag}</b>
      <h2>{g.title}</h2>
      <p>{g.body}<br /><b>{g.strong[0]}<br />{g.strong[1]}</b><HeartLine /></p>
      <div className="legend">
        <b className="lv-delta"><HeartLine />+3</b><span>{g.plus}</span><i className="gap" />
        <b className="lv-delta minus"><Cracked />−2</b><span>{g.minus}</span>
      </div>
      {ready && <NextPill label={g.button} onClick={onNext} />}
    </section>
  );
}

// A heart filled from the bottom to pct (the almost / low cards).
function PartHeart({ pct, dark }) {
  const y = 92 - (92 * pct) / 100;
  return (
    <svg className={`part-heart${dark ? ' dark' : ''}`} viewBox="0 0 100 92" aria-hidden="true">
      <defs><clipPath id="lvPartClip"><rect x="0" y={y} width="100" height={92 - y} /></clipPath></defs>
      <path className="shell" d={HEART} /><path className="part" d={HEART} clipPath="url(#lvPartClip)" />
      {dark && <path className="crack" d="M50 17L44 26L52 31" />}
    </svg>
  );
}

// The result card on an ending's title beat. end = engine ending(): { kind, pct, tier }. The button takes the beat's
// "Back to start" choice (rooftop, love 0).
export function EndCard({ end, ready, onAgain }) {
  const c = COPY.end[end.tier], win = end.tier === 'win', dark = end.tier === 'low';
  return (
    <section className={`hud-end ${end.tier}${dark ? ' dark' : ''}`} aria-label={`${c.kicker}: ${c.title}`} data-ending={end.kind}>
      <p className="kicker">{c.kicker}</p>
      <div className="bigheart">{win ? <HeartSvg /> : <PartHeart pct={end.pct} dark={dark} />}<b className="lv-num">{end.pct}%</b></div>
      <h2>{c.title}</h2>
      <p className="sub">{c.sub(end.pct)}</p>
      {ready && <NextPill label={c.button} onClick={onAgain} />}
    </section>
  );
}
