// Bagging.jsx: "UNEXPECTED GATE IN BAGGING AREA", date.html?game=1. A 7x9 drop-merge grid in the GATEXX look.
// Rules are all in rules.js (pure, unit-tested). This file is state, input, FX and the hand-off to the Date canvas.
import { useEffect, useReducer, useRef, useState } from 'react';
import { Shape, GATE_GEOM } from '../../nodes/index.jsx';
import * as R from './rules.js';
import { play, comboRate, useMute, loaded } from '../sfx.js';
import { CircuitView } from './CircuitView.jsx';
import './game.css';

const params = new URLSearchParams(location.search);
const STILL = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEED = Number(params.get('seed')) || Math.floor(Math.random() * 1e9);
const BASE = import.meta.env.BASE_URL;
const EMO = (n) => `${BASE}emotes/emote_${n}.png`;
const T = (ms) => (STILL ? Math.min(ms, 90) : ms); // reduced motion: same beats, no travel

const TALK = {
  AND: 'x AND 1 = x. I’m supportive, why won’t anyone—',
  OR: 'Either of you is fine. Honestly? Both is fine.',
  XOR: 'One of us. Not both. Never both.',
  NAND: 'I’m universal, you know. I can be anyone you want.',
  NOR: 'Not you. Not them. Ask me again tomorrow.',
  NOT: 'No. ...Unless you meant yes.',
};
const HURT_LINES = [['We Are Never Ever', 'Getting Back Together'], ['Bad Blood', ''], ['Irreplaceable', '(to the left, to the left)']];
const RARE = { clingy: 5, child: 5, notnot: 4, xor: 4, and: 3, or: 3, nand: 3 };

function readIn() {
  try {
    const raw = JSON.parse(sessionStorage.getItem('gob.game.in') || 'null');
    sessionStorage.removeItem('gob.game.in');
    return Array.isArray(raw) ? raw.filter((t) => R.TYPES.includes(t)) : [];
  } catch { return []; }
}

// A gate on the board: the real Shape on a charge-coloured bag tile (pink = +, blue = bubble / -).
export function GateTile({ t, tier = 1, className = '' }) {
  const g = GATE_GEOM[t];
  const on = t === 'NOT' || t === 'NAND' || t === 'NOR'; // idle look: bubble lit like a fresh inverting gate
  return (
    <div className={`tile-g ${R.charge(t) > 0 ? 'pos' : 'neg'} t${tier} ${className}`}>
      <svg viewBox={`${(g.w - 138) / 2 - 4} -8 138 124`} aria-hidden="true"><Shape g={g} on={on} lit={{ in: [], out: on }} /></svg>
      <b className="tl">{t}</b>
      {tier > 1 && <i className="tier">{'♥'.repeat(tier)}</i>}
    </div>
  );
}

let fxId = 0;
export default function Bagging() {
  const [, bump] = useReducer((n) => n + 1, 0);
  const [muted, toggleMute] = useMute();
  const rnd = useRef(R.rng(SEED)).current;
  const feed = useRef(readIn()).current;
  const fromCanvas = useRef(feed.length).current;
  const nextType = () => (feed.length ? feed.shift() : R.randomType(rnd));
  const G = useRef(null);
  if (!G.current) {
    G.current = { cols: R.emptyGrid(), cur: R.gate(nextType()), nxt: R.gate(nextType()), swipes: 3, streak: 0, merges: [], counts: {},
      affection: 0, receipt: [], hurtPairs: [], lastHurt: null, busy: false, frozen: false, over: null, flash: new Set(), landed: null,
      fallRows: 0, drops: 0, bestCombo: 0, talk: { who: null, text: '' } };
    const first = G.current.cur.t;
    G.current.talk = fromCanvas
      ? { who: first, text: `Your exes are in the bag. ${fromCanvas} of them, straight off your canvas. Me first.` }
      : { who: first, text: TALK[first] };
  }
  const g = G.current;
  const [fx, setFx] = useState([]); // floaters, blooms, emotes, bubbles, banners
  const [card, setCard] = useState(null);
  const [hover, setHover] = useState(3);
  const [drag, setDrag] = useState(false);
  const [shakeCol, setShakeCol] = useState(null);
  const timers = useRef([]);
  const boardRef = useRef(null);
  const press = useRef(null);
  const later = (ms, f) => { timers.current.push(setTimeout(f, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // Announcer (one voice, big events only): READY... GO! once audio unlocks on the first gesture.
  useEffect(() => { loaded().then(() => { play('ready', { vol: 0.9 }); play('go', { vol: 0.9, delay: 750 }); }); }, []);
  const addFx = (item, ms) => { const id = ++fxId; setFx((a) => [...a, { ...item, id }]); later(ms, () => setFx((a) => a.filter((x) => x.id !== id))); };
  const say = (who, text) => { g.talk = { who, text }; };
  const printLine = (line) => { g.receipt = [...g.receipt, { k: ++fxId, ...line }]; };

  // ---------- drop / swipe ----------
  function advance() {
    g.cur = g.nxt; g.nxt = R.gate(nextType());
  }
  function drop(c) {
    if (g.busy || g.over || g.frozen) return;
    if (!R.canDrop(g.cols, c)) { play('error'); setShakeCol(c); later(300, () => setShakeCol(null)); return; }
    const piece = g.cur;
    const res = R.dropAndResolve(g.cols, c, piece, rnd);
    g.busy = true; g.drops++;
    g.cols = res.placed; g.landed = piece.id; g.fallRows = R.H - res.landed.i;
    play('land');
    advance();
    bump();
    run(res, piece);
  }
  function swipeGate(id, dir) {
    if (g.busy || g.over || g.frozen) return;
    if (g.swipes <= 0) { play('error'); addFx({ kind: 'toast', text: 'NO SWIPES LEFT' }, 1000); return; }
    const res = R.swipe(g.cols, id, dir, rnd);
    if (!res) { play('error'); return; }
    g.swipes--; g.busy = true; g.cols = res.placed; g.landed = null;
    play('pick');
    printLine({ text: `SWIPE ${dir < 0 ? 'LEFT' : 'RIGHT'}`, amt: '', kind: 'note' });
    bump();
    run(res, null);
  }

  // Replay the resolver's frames: flash (hit-stop), then merge, floater, sound, receipt.
  function run(res, piece) {
    let t = T(230);
    res.frames.forEach((f) => {
      later(t, () => { g.flash = new Set([f.ev.aId, f.ev.bId]); bump(); });
      later(t + T(90), () => applyMerge(f));
      t += T(420);
    });
    later(t, () => finish(res, piece));
  }
  function applyMerge({ cols, ev }) {
    g.flash = new Set();
    g.cols = cols; g.landed = null;
    g.merges.push(ev);
    const first = !g.counts[ev.identity];
    g.counts[ev.identity] = (g.counts[ev.identity] ?? 0) + 1;
    g.affection += ev.rows;
    g.bestCombo = Math.max(g.bestCombo, ev.combo);
    const I = R.IDENTITIES[ev.identity];
    printLine({ text: `${ev.a}+${ev.b}  ${I.formula}`, amt: `+${ev.rows}`, kind: 'item' });
    if (ev.combo >= 2) printLine({ text: `  COMBO ×${ev.combo}`, amt: '', kind: 'combo' });
    const pos = ev.at;
    addFx({ kind: 'bloom', c: pos.c, i: pos.i, idn: ev.identity, jackpot: ev.jackpot }, 700);
    addFx({ kind: 'float', c: pos.c, i: pos.i, text: `+${ev.rows} Affection`, dots: R.dots(ev.a, ev.b), big: ev.rows === 4 }, 1300);
    addFx({ kind: 'emote', c: pos.c, i: pos.i, img: 'hearts' }, 900);
    if (ev.combo >= 2) addFx({ kind: 'combo', n: ev.combo }, 1100);
    if (ev.jackpot) addFx({ kind: 'toast', text: ev.identity === 'clingy' ? 'CLINGY JACKPOT! x ∨ 1 = 1' : 'JACKPOT! tier 3 + tier 3' }, 1400);
    play('merge', { rate: comboRate(ev.combo) });
    play(ev.combo >= 3 ? 'stack' : 'chips', { vol: 0.7, delay: 60 });
    if (ev.combo >= 2) play('power', { rate: comboRate(ev.combo - 2), vol: 0.5, delay: 90 });
    play('barcode', { vol: 0.6, delay: 140 }); // self-checkout scanner on every scored item
    say(ev.result?.t ?? ev.a, I.line);
    if (first) {
      setCard({ key: ev.identity, ev, n: Object.keys(g.counts).length });
      play('open', { delay: 200 });
      play('levelup', { delay: 450, vol: 0.9 });
      later(T(2300), () => setCard((c) => (c && c.key === ev.identity ? null : c)));
    }
    bump();
  }
  function finish(res, piece) {
    g.busy = false;
    if (res.combo > 0) {
      g.streak = 0;
      if (res.combo >= 3 && g.swipes < 3) { g.swipes++; addFx({ kind: 'toast', text: 'COMBO ×3: +1 SWIPE REFUND' }, 1300); }
    } else if (res.hurts?.length) hurt(res.hurts, piece);
    else if (piece) say(g.cur.t, TALK[g.cur.t]);
    // A pair survives only while both gates still exist.
    const alive = new Set(g.cols.flat().map((x) => x.id));
    g.hurtPairs = g.hurtPairs.filter((h) => alive.has(h.a) && alive.has(h.b));
    const tall = Math.max(...g.cols.map((c) => c.length));
    if (tall >= R.H - 2 && !g.hurried) { g.hurried = true; play('hurry', { vol: 0.9 }); addFx({ kind: 'toast', text: 'HURRY UP! THE BAG IS NEARLY FULL' }, 1400); }
    if (tall < R.H - 3) g.hurried = false;
    if (Object.keys(g.counts).length === R.IDENTITY_KEYS.length) end('win');
    else if (R.overflow(g.cols)) end('overflow');
    bump();
  }
  function hurt(hurts, piece) {
    const h = hurts[0];
    g.lastHurt = h;
    g.hurtPairs = [...g.hurtPairs, ...hurts.map((x) => ({ ...x, fresh: Date.now() }))];
    const [l1, l2] = HURT_LINES[g.drops % HURT_LINES.length];
    const mid = { c: (piece ? R.find(g.cols, piece.id) : h.at) ?? h.at };
    const p = R.find(g.cols, h.a) ?? h.at;
    addFx({ kind: 'hurtcap', c: p.c, i: p.i, l1, l2, opp: h.opposite }, 2000);
    hurts.forEach((x) => { const q = R.find(g.cols, x.b); if (q) addFx({ kind: 'emote', c: q.c, i: q.i, img: x.opposite ? 'heartBroken' : 'anger' }, 1400); });
    addFx({ kind: 'emote', c: p.c, i: p.i, img: 'anger' }, 1400);
    play('phaser', { vol: 0.7 });
    if (!g.trombone) { g.trombone = true; play('trombone', { delay: 200, vol: 0.8 }); } // first HURT of the game only
    say(h.ta, h.opposite ? 'Opposites attract. Doesn’t mean it works.' : `${h.ta} and ${h.tb}: ${R.dots(h.ta, h.tb)} ${Math.round(h.compat * 100)}%. We don’t talk about it.`);
    printLine({ text: `${h.ta}×${h.tb} HURT ${R.dots(h.ta, h.tb)}`, amt: '0', kind: 'hurt' });
    void mid;
    later(T(1000), () => {
      const alive = new Set(g.cols.flat().map((x) => x.id));
      if (alive.has(h.a) && alive.has(h.b)) { const q = R.find(g.cols, h.a); addFx({ kind: 'bag', c: q.c, i: q.i }, 1800); play('barcode', { rate: 0.8, vol: 0.5 }); }
    });
    g.streak++;
    if (g.streak >= 3) {
      g.streak = 0; g.frozen = true;
      addFx({ kind: 'approval' }, 1500);
      play('error', { rate: 0.8, delay: 300 });
      printLine({ text: 'APPROVAL NEEDED', amt: '', kind: 'hurt' });
      later(1500, () => { g.frozen = false; bump(); });
    }
  }
  function end(reason) {
    if (g.over) return;
    const payload = R.outPayload({ merges: g.merges, lastHurt: g.lastHurt, won: reason === 'win' });
    g.over = { reason, payload };
    printLine({ text: 'TOTAL AFFECTION', amt: String(g.affection), kind: 'total' });
    play('print');
    const over = reason === 'overflow'; // game over: the bag burst. The trombone first, then the verdict.
    if (over) play('trombone', { delay: 100 });
    if (payload.match) { play('match', { delay: over ? 1600 : 250 }); play('sax', { delay: over ? 2000 : 700 }); if (reason === 'win') play('highscore', { delay: 2600 }); }
    else play('nes', { delay: over ? 1600 : 250 });
    bump();
  }
  function handOff(hello) {
    try { sessionStorage.setItem('gob.game.out', JSON.stringify({ ...g.over.payload, at: Date.now() })); } catch { /* storage blocked */ }
    play('click');
    location.href = `${location.pathname}?canvas=1${hello ? '&hello=1' : ''}`;
  }

  // ---------- input: drag over a column, release to drop; flick a settled gate to swipe ----------
  const colAt = (e) => {
    const r = boardRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(R.W - 1, Math.floor(((e.clientX - r.left) / r.width) * R.W)));
  };
  const onDown = (e) => {
    if (g.over) return;
    const c = colAt(e);
    const cellEl = e.target.closest?.('[data-gid]');
    press.current = { x: e.clientX, c, gid: cellEl?.dataset.gid ?? null };
    setHover(c); setDrag(true);
    play('pick', { vol: 0.6 });
    boardRef.current.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => { const c = colAt(e); if (c !== hover) setHover(c); };
  const onUp = (e) => {
    const p = press.current; press.current = null; setDrag(false);
    if (!p) return;
    const r = boardRef.current.getBoundingClientRect(), cell = r.width / R.W, dx = e.clientX - p.x;
    if (p.gid && Math.abs(dx) > cell * 0.45) { swipeGate(p.gid, dx < 0 ? -1 : 1); return; }
    drop(colAt(e));
  };
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { setHover((h) => Math.max(0, h - 1)); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setHover((h) => Math.min(R.W - 1, h + 1)); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') { drop(hover); e.preventDefault(); }
  };
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    window.__bag = { drop, state: () => ({ cols: g.cols.map((c) => c.map((x) => x.t)), cur: g.cur.t, affection: g.affection, counts: g.counts, busy: g.busy, over: g.over }) };
  });

  // ---------- render ----------
  const pv = !g.busy && !g.over && hover != null ? R.preview(g.cols, hover, g.cur.t) : null;
  const best = pv?.pairs.slice().sort((a, b) => b.glow - a.glow || b.compat - a.compat)[0];
  const hurtIds = new Set(g.hurtPairs.flatMap((h) => [h.a, h.b]));
  const { mean } = R.score(g.merges);
  const found = Object.keys(g.counts).length;
  const header = g.over?.reason === 'overflow' ? 'PLEASE WAIT FOR ASSISTANCE' : g.frozen ? 'APPROVAL NEEDED' : 'SELF-CHECKOUT · LANE 4';
  const weight = (g.cols.flat().length * 0.37).toFixed(2);

  return (
    <div className={`game${STILL ? ' still' : ''}${g.over ? ' is-over' : ''}`} style={{ '--rows': R.H, '--cols': R.W }}>
      <header className="bar gbar">
        <a className="logo neonlogo" href={`${BASE}date.html`}>
          <span className="neon small dj">Dejting</span><b>GATEXX</b>
        </a>
        <div className={`lcd${g.over?.reason === 'overflow' || g.frozen ? ' alarm' : ''}`} data-testid="lane">{header}</div>
        <div className="stat"><small>AFFECTION</small><b data-testid="affection">{g.affection}</b></div>
        <div className="stat"><small>ENDINGS</small><b data-testid="endings">{found}/7</b></div>
        <button className="mute" onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute sound' : 'Mute sound'}>
          {muted ? '♪̸' : '♪'}<span>{muted ? 'MUTED' : 'SOUND'}</span>
        </button>
      </header>

      <main className="gmain">
        <aside className="left">
          <div className="next panel">
            <h3>NEXT</h3>
            <GateTile t={g.nxt.t} />
            <p className="hint">{g.nxt.t}: {R.charge(g.nxt.t) > 0 ? '+ charge' : '− charge (bubble)'}</p>
          </div>
          <div className="receipt" aria-live="polite">
            <div className="rc-h"><b>GATEXX</b><span>SELF-CHECKOUT #4</span><span>{'*'.repeat(22)}</span></div>
            <ol>{g.receipt.slice(-14).map((l) => <li key={l.k} className={l.kind}><span>{l.text}</span><em>{l.amt}</em></li>)}</ol>
            <div className="rc-t"><span>TOTAL</span><b>{g.affection}</b></div>
            <div className="swipes" title="Tap a settled gate and flick it sideways">SWIPES <span data-testid="swipes">{[0, 1, 2].map((i) => (i < g.swipes ? '◆' : '◇')).join('')}</span></div>
          </div>
          <button className="btn hot pay" onClick={() => !g.busy && end(R.overflow(g.cols) ? 'overflow' : 'pay')} disabled={!!g.over}>FINISH &amp; PAY</button>
        </aside>

        <section className="bagwrap">
          <div className="bagtitle">
            <span className="warn">BAGGING AREA</span>
            <span className="scale">SCALE {weight} kg</span>
          </div>
          <div className="preview-line" aria-live="polite">
            {pv ? (best ? <>drag {'▼'} <b>({g.cur.t})</b> next to <b>{best.t}</b> <span className={best.glow ? 'glow' : 'hurtc'}>{best.dots} {Math.round(best.compat * 100)}% {best.glow ? '♥ GLOW' : '✕ HURT'}</span></>
              : <>drag {'▼'} <b>({g.cur.t})</b> into an empty spot</>) : g.frozen ? <>an attendant is on the way...</> : <>&nbsp;</>}
          </div>
          <div className={`board${drag ? ' dragging' : ''}`} ref={boardRef} tabIndex={0} role="application" data-testid="board"
            aria-label={`Bagging area. Column ${hover + 1}. Arrow keys move, Enter drops ${g.cur.t}.`}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => setDrag(false)} onKeyDown={onKey}>
            <div className="lane">
              {!g.over && <div className={`hand${g.frozen ? ' frozen' : ''}`} style={{ '--c': hover }}><GateTile t={g.cur.t} className="held" /></div>}
            </div>
            <div className="well">
              {Array.from({ length: R.W }, (_, c) => <div key={c} className={`colbg${c === hover ? ' hov' : ''}${shakeCol === c ? ' shake' : ''}`} style={{ '--c': c }} />)}
              <div className="fullline"><span>BAG FULL</span></div>
              {pv && <div className="ghost" style={{ '--c': pv.at.c, '--i': pv.at.i }}><GateTile t={g.cur.t} /></div>}
              {pv?.pairs.map((p) => (
                <div key={p.dir} className={`strip ${p.glow ? 'glow' : 'hurtc'} d-${p.dir}`} style={{ '--c': p.c, '--i': p.i }}>
                  {p.dots}<small>{Math.round(p.compat * 100)}%</small>
                </div>
              ))}
              {g.cols.map((col, c) => col.map((x, i) => (
                <div key={x.id} data-gid={x.id} className={`cell${x.id === g.landed ? ' new' : ''}${g.flash.has(x.id) ? ' flash' : ''}${hurtIds.has(x.id) ? ' hurt' : ''}${x.t === 'OR' && x.tier >= 3 ? ' clingy' : ''}`}
                  style={{ '--c': c, '--i': i, '--fall': g.fallRows }}>
                  <GateTile t={x.t} tier={x.tier} />
                </div>
              )))}
              {fx.map((f) => <Fx key={f.id} f={f} />)}
            </div>
          </div>
        </section>

        <aside className="right">
          <h3>ENDINGS <b>{found}/7</b></h3>
          <div className="cards">
            {R.RARITY.map((k) => {
              const I = R.IDENTITIES[k], n = g.counts[k] ?? 0;
              return (
                <div key={k} className={`ecard${n ? ' got' : ''}`} title={n ? `${I.name}: hit ${n}×` : 'locked'}>
                  {n ? <><b>{I.formula}</b><span>{I.name}</span><i>{'★'.repeat(RARE[k])} ×{n}</i></> : <><b>?</b><span>{'★'.repeat(RARE[k])}</span></>}
                </div>
              );
            })}
          </div>
          <p className="legend"><span className="pos">+ AND OR XOR</span><span className="neg">{'−'} NAND NOR NOT</span>
            GLOW = same charge and {'≥'}75% of rows agree.</p>
        </aside>
      </main>

      <footer className="vn">
        <div className="nameplate">{g.talk.who ?? 'GATEXX'}</div>
        <div className="portrait-s">{g.talk.who && <GateTile t={g.talk.who} />}</div>
        <p className="line" key={g.talk.text}>{g.talk.text}</p>
        <div className="vn-meta">SEED {SEED}{fromCanvas ? ` · ${fromCanvas} from canvas` : ''}</div>
      </footer>

      {card && <IdentityCard card={card} onClose={() => setCard(null)} />}
      {g.over && <MatchPopup over={g.over} affection={g.affection} mean={mean} bestCombo={g.bestCombo} onHello={() => handOff(true)} onWire={() => handOff(false)} />}
    </div>
  );
}

function Fx({ f }) {
  const pos = { '--c': f.c, '--i': f.i };
  if (f.kind === 'float') return <div className={`fx float${f.big ? ' big' : ''}`} style={pos}>{f.text}<small>{f.dots}</small></div>;
  if (f.kind === 'bloom') return <div className={`fx bloom b-${f.idn}${f.jackpot ? ' jack' : ''}`} style={pos}>{f.idn === 'xor' ? '0' : f.idn === 'notnot' ? '♥' : ''}</div>;
  if (f.kind === 'emote') return <img className="fx emote" style={pos} src={EMO(f.img)} alt="" />;
  if (f.kind === 'combo') return <div className="fx combo" data-testid="combo">COMBO <b>{'×'}{f.n}</b></div>;
  if (f.kind === 'toast') return <div className="fx toast">{f.text}</div>;
  if (f.kind === 'hurtcap') return <div className="fx hurtcap" style={pos} data-testid="hurt">{f.opp && <em>Opposites attract. Doesn{'’'}t mean it works.</em>}<b>{f.l1}</b>{f.l2 && <span>{f.l2}</span>}</div>;
  if (f.kind === 'bag') return <div className="fx bag" style={pos}>UNEXPECTED ITEM<br />IN BAGGING AREA</div>;
  if (f.kind === 'approval') return <div className="fx approval"><img src={EMO('exclamations')} alt="" /><b>APPROVAL NEEDED</b><span>3 unexpected items in a row. Please wait for an attendant (a NOT gate).</span></div>;
  return null;
}

function IdentityCard({ card, onClose }) {
  const I = R.IDENTITIES[card.key], ev = card.ev;
  return (
    <div className="idcard-wrap" onClick={onClose}>
      <div className={`idcard r${RARE[card.key]}`} role="dialog" aria-label={`New ending: ${I.name}`}>
        <div className="stars">{'★'.repeat(RARE[card.key])}</div>
        <small>NEW ENDING {card.n}/7</small>
        <h2>{I.formula}</h2>
        <h3>{I.name}</h3>
        <CircuitView circuit={ev.circuit} className="cv mini" label={`${I.formula} circuit`} />
        <p className="proof">{ev.proof.text}</p>
        <p className="pair">{ev.a} + {ev.b} {'·'} {R.dots(ev.a, ev.b)} {Math.round(ev.compat * 100)}%</p>
      </div>
    </div>
  );
}

function MatchPopup({ over, affection, mean, bestCombo, onHello, onWire }) {
  const p = over.payload;
  const I = p.ending ? R.IDENTITIES[p.ending] : null;
  const [x, setX] = useState(false);
  const c = p.circuits[0];
  const shown = c ? { ...c, nodes: { ...c.nodes, ...(c.nodes.x ? { x: { ...c.nodes.x, value: x } } : {}) } } : null;
  return (
    <div className="popwrap">
      <div className={`pop${p.match ? '' : ' nomatch'}`} role="dialog" aria-modal="true" aria-labelledby="pop-h">
        <div className="sign"><span className="neon">Dejting</span></div>
        <h1 id="pop-h" className="warn" data-testid="pop">{p.match ? 'IT’S A MATCH!!' : 'IT’S NOT A MATCH'}</h1>
        {p.match ? <p className="ending">ENDING: <b>{I.formula}</b> {'·'} {I.name} {'·'} <b>{Math.round(mean * 100)}% compatible</b></p>
          : <p className="ending">The bag overflowed before anyone clicked. {c ? `${c.pair[0]} × ${c.pair[1]} goes home red.` : ''}</p>}
        {shown && (
          <div className="popcirc">
            <CircuitView circuit={shown} className="cv pop-cv" hurt={!p.match} onToggle={() => setX((v) => !v)} label="your ending circuit" />
            <p className="proof">{p.match ? `${c.proof}  (tap x to try it)` : 'two lamps, same inputs, different answers'}</p>
          </div>
        )}
        <div className="slip">
          <span>AFFECTION {affection}</span><span>BEST COMBO {'×'}{bestCombo}</span><span>{p.circuits.length} circuit{p.circuits.length === 1 ? '' : 's'} to canvas</span>
          <em>Thank you for shopping at GATEXX. You saved $0.00.</em>
        </div>
        <div className="btns two">
          <button className="btn hot" onClick={onHello} data-testid="hello">{'♥'} SAY HELLO {'♥'}</button>
          <button className="btn soft" onClick={onWire}>KEEP WIRING</button>
        </div>
        <a className="again" href={location.pathname + '?game=1'}>play again</a>
      </div>
    </div>
  );
}
