// Round-2 letterbox DOOR menus (Builder B). One engine, two variants:
//  mode 'm4' = menu-4-r2 "Bandersnatch, improved": the lean is visible before any timeout (pre-poured pink cup, a visible
//              pour spout, the purple box squeezed from the first frame), her real face on the reaction cut-in, her VHS
//              rewind, "ALREADY SEEN" 1.5x re-intro, and on the second replay "THE ROOM CHOSE PINK" from this machine's history.
//  mode 'h2' = menu-h2-r2 "Her Time, Her Cut" (menu-4 x menu-3): the pour-into-pink timer + her red caret parked in the
//              purple label from the first frame; at 3 s the label glitches, she selects "Goodnight." and types "Stay."
//              while the time still drains. After that a click on purple reads as "Stay.". Leave (only before her edit) =
//              bleed, bars clamp, cut-in on her blank face, then SHE CUTS the take: grease-pencil X, splice, re-take
//              with purple struck + CUT while the timer runs.
// Reduced motion: bars/camera hard-cut, timer = 5 blocks, glitch/typing = one hard cut to the finished edit, caret solid,
// bleed = purple edge frame, rewind / cut = one held frame.
// Keys: 1 / 2, <- -> + Enter, R = her rewind / her cut. Shots: ?state=menu|replay|pink|purple, ?mt=<ms> freezes the menu clock.
import { useEffect, useMemo, useRef, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import { LabRoot, Markup, OrText, useLater, param } from '../shared/ui.jsx';
import LitBust from '../shared/LitBust.jsx';
import { play, bed } from '../shared/audio.js';
import { ART } from '../shared/art.js';
import { DOOR, openMenu, tick, choose, remaining, secondsLeft, replay, isDisabled } from '../shared/door.js';
import { purpleLabel, retyped, outcome, pinkFill, widths, tally } from './edit.js';
import '../menu4/menu4.css';
import './menur2.css';

const BARS = { film: 138, menu: 250, clamp: 192 };
const SIL = ART.sil('nanda', 1010, 936, 1.18, { slit: true });
const HIST = 'lab-b-m4r2-history';
const readHist = () => { try { return JSON.parse(localStorage.getItem(HIST) || '[]'); } catch { return []; } };
const pushHist = (o) => { try { localStorage.setItem(HIST, JSON.stringify([...readHist(), o].slice(-50))); } catch { /* private window */ } };

const START = param('state');
const MT = param('mt') !== null ? Math.max(0, +param('mt') || 0) : null;
// her medium shot at the door: scale from the door (A's rig maths: 158 cm girl vs a 200 cm door drawn 660 px, depth 4.9)
const BUST_S = 0.987, BUST_X = 980 - 300 * BUST_S, BUST_Y = 250 - 108 * BUST_S;

function Subtitle({ text, bottom }) {
  if (!text) return null;
  const m = /^([A-Z]+):\s*(.*)$/.exec(text);
  return (
    <p className={`m4-sub${m ? ' spoken' : ''}`} style={{ bottom }}>
      {m && <span className="m4-who">{m[1]}</span>}<OrText text={m ? m[2] : text} />
    </p>
  );
}

// The timer bar drains leftward and POURS into the pink cup through a spout (drops step on the 125 ms grid).
function Timer({ s, rm, pour }) {
  const r = remaining(s);
  if (rm) {
    const n = Math.max(0, secondsLeft(s));
    return (
      <div className="m4-timer blocks" aria-label={`${n} seconds`}>
        {[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}
      </div>
    );
  }
  const step = Math.floor(s.t / 125) % 4;
  return (
    <>
      <div className="m4-timer" aria-label={`${Math.ceil(r * 5)} seconds`}>
        <div className="m4-bar" style={{ width: `${r * 100}%` }} />
        <svg className="m4-head" style={{ left: `${r * 100}%` }} viewBox="-40 -20 80 40" aria-hidden="true">
          <path d="M-18,-12 L0,-12 A12,12 0 0 1 0,12 L-18,12 Z" fill="#1a0610" stroke="#ff5fa2" strokeWidth="3" />
          <circle cx="18" cy="0" r="6" fill="#f0243f" />
        </svg>
      </div>
      {pour && !s.done && (
        <svg className="r2-spout" viewBox="0 0 140 110" aria-hidden="true">
          <path d="M64,19 C16,19 12,56 96,78" fill="none" stroke="#ff5fa2" strokeWidth="10" strokeLinecap="round" />
          {[0, 1, 2].map((k) => <circle key={k} cx={100 + k * 4} cy={80 + ((step + k) % 4) * 7} r={6 - k} fill="#ffd3e6" />)}
        </svg>
      )}
    </>
  );
}

function PurpleText({ s, mode, rm }) {
  if (mode !== 'h2' || isDisabled(s, 'purple')) return <span className="m4-label">{DOOR.options[1].label}</span>;
  const L = purpleLabel(s.t, rm);
  const caret = !s.done && L.stage !== 'select';
  return (
    <span className={`m4-label r2-edit st-${L.stage}`}>
      {L.keep}
      <span className="r2-word">
        <span className="r2-w" data-w={L.word}>{L.word}</span>
        {caret && <i className="r2-caret" />}
      </span>
    </span>
  );
}

function Option({ o, s, focus, rm, mode, onPick, onFocus, width }) {
  const off = isDisabled(s, o.id);
  const r = rm ? Math.max(0, secondsLeft(s)) / 5 : remaining(s);
  const fill = o.id !== 'pink' || off ? 0 : mode === 'm4' ? pinkFill(r) : 1 - r;
  const picked = s.picked === o.id;
  return (
    <button type="button" style={width ? { flex: `0 0 ${width}px` } : undefined}
      className={`m4-opt ${o.id}${off ? ' off' : ''}${focus ? ' focus' : ''}${picked ? ' picked' : ''}`}
      aria-disabled={off} onPointerEnter={onFocus} onClick={(e) => { e.stopPropagation(); onPick(o.id); }}>
      {o.id === 'pink' && <span className="m4-fill" style={{ height: `${fill * 100}%` }} />}
      <span className="m4-key">{o.key}</span>
      {o.id === 'purple' ? <PurpleText s={s} mode={mode} rm={rm} /> : <span className="m4-label">{o.label}</span>}
      {off && <span className="r2-stamp">{mode === 'h2' ? 'CUT' : 'LOCKED'}</span>}
    </button>
  );
}

export default function Letterbox({ rm, mode = 'm4' }) {
  const h2 = mode === 'h2';
  const shotResult = START === 'pink' || START === 'purple';
  const [phase, setPhase] = useState(shotResult ? START : START ? 'menu' : 'intro');
  const [menu, setMenu] = useState(() => {
    const m = openMenu(DOOR, { disabled: START === 'replay' ? ['purple'] : [] });
    if (shotResult) return { ...m, t: 1200, picked: START, done: true, via: 'click' };
    return MT !== null ? { ...m, t: MT } : m;
  });
  const [sub, setSub] = useState(START === 'replay' ? (h2 ? 'NANDA: Take two. From the door.' : 'NANDA: You said goodnight last time.') : START ? DOOR.prompt : '');
  const [focus, setFocus] = useState('pink');
  const [bleed, setBleed] = useState(false);
  const [rew, setRew] = useState(false); // m4: her VHS rewind; h2: her cut (grease pencil)
  const [xk, setXk] = useState(0); // h2 cut: grease-pencil strokes drawn (stepped poses)
  const [scene, setScene] = useState('stairs');
  const [react, setReact] = useState(false);
  const [later, clear] = useLater();
  const round = useRef(START === 'replay' ? 1 : 0);
  const lastSec = useRef(5);
  const [hist, setHist] = useState(readHist);
  const [fast, setFast] = useState(false); // m4: "ALREADY SEEN" 1.5x re-intro

  useEffect(() => {
    bed('rain', true);
    if (START) return undefined;
    later(() => setSub('NANDA: This is me. Unit 12.'), 400);
    later(() => setSub('NANDA: I already boiled the water. This morning.'), 2000);
    later(() => { setSub(DOOR.prompt); setPhase('menu'); }, 4200);
    return undefined;
  }, [later]);

  // the menu clock (the picture keeps playing underneath); ?mt / ?pause freeze it for shots
  useEffect(() => {
    if (phase !== 'menu' || menu.done || MT !== null || param('pause') !== null) return undefined;
    let raf, prev = performance.now();
    const f = (now) => { const dt = now - prev; prev = now; setMenu((s) => tick(s, dt)); raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [phase, menu.done]);

  // heartbeat on the last 3 seconds (<= 1 Hz); h2: her edit has its own sounds
  const editStage = h2 && phase === 'menu' && !isDisabled(menu, 'purple') ? purpleLabel(menu.t, rm).stage : 'none';
  useEffect(() => {
    if (phase !== 'menu' || menu.done) return;
    const n = secondsLeft(menu);
    if (n !== lastSec.current) { lastSec.current = n; if (n <= 3 && n >= 1) play('thump', { gain: 0.5 + (3 - n) * 0.25 }); }
  }, [menu, phase]);
  useEffect(() => {
    if (editStage === 'glitch' || (rm && editStage === 'done')) play('static', { caption: '[the label glitches]' });
    else if (editStage === 'select') play('tick', { caption: '[her click: text selected]' });
    else if (editStage === 'typing') play('tick', { caption: '[she types]' });
  }, [editStage]); // eslint-disable-line react-hooks/exhaustive-deps

  // a pick (click or timeout) -> the ending
  useEffect(() => {
    if (phase !== 'menu' || !menu.done) return;
    const o = outcome(menu, rm, mode);
    if (!h2) { pushHist(o); setHist(readHist()); }
    if (o === 'stay') {
      play('pink');
      setPhase('pink');
      const viaEdit = menu.picked === 'purple';
      setSub(viaEdit ? (menu.via === 'timeout' ? 'NANDA: Same answer, then.' : 'NANDA: You picked Stay. I saw.')
        : menu.via === 'timeout' ? "NANDA: You didn't say no." : 'NANDA: Good input.');
      later(() => play('door'), 700);
      later(() => { setScene('genkan'); setSub("Men's slippers. Already set out."); play('thump'); }, 3000);
    } else {
      play('purple'); play('bleed');
      setPhase('purple');
      setBleed(true);
      later(() => setBleed(false), 334);
      setSub('NANDA: Right. Goodnight. That’s… fine.');
      later(() => { setReact(true); setSub('NANDA: You’re allowed. Text me when you’re home.'); play('thump'); }, 2000);
      later(() => (h2 ? doCut() : doRewind()), 4400);
    }
  }, [menu.done]); // eslint-disable-line react-hooks/exhaustive-deps

  function reopen(line) {
    setRew(false); setXk(0); setReact(false); setScene('stairs');
    round.current += 1;
    lastSec.current = 5;
    setMenu((s) => replay(s.picked ? s : { ...s, picked: 'purple' }));
    setFocus('pink');
    setSub(line);
    if (!h2 && round.current >= 1) {
      // Bandersnatch "already seen": the lines you have heard replay at 1.5x before the choice comes back
      setPhase('intro'); setFast(true);
      later(() => setSub('NANDA: I already boiled the water. This morning.'), rm ? 0 : 900);
      later(() => { setFast(false); setSub(DOOR.prompt); setPhase('menu'); }, rm ? 1400 : 2100);
    } else {
      setPhase('menu');
      later(() => setSub(DOOR.prompt), 2200);
    }
  }

  function doRewind() { // m4: SHE rewinds the tape
    clear();
    setRew(true); setReact(false);
    play('rewind');
    later(() => play('whisper'), 700);
    const line = menu.picked === 'pink' ? 'NANDA: Again? Good. Same answer, then.' : 'NANDA: You said goodnight last time.';
    later(() => reopen(line), rm ? 1000 : 1400);
  }

  function doCut() { // h2: SHE cuts the take (grease pencil X in two held strokes, a splice, then take two)
    clear();
    setRew(true);
    play('static', { caption: '[film stops: a splice]' });
    setXk(1);
    later(() => { setXk(2); play('tick', { caption: '[grease pencil squeak]' }); }, rm ? 0 : 500);
    later(() => play('whisper', { caption: 'whisper: "cut."' }), rm ? 0 : 900);
    later(() => reopen('NANDA: Take two. From the door.'), rm ? 1400 : 1900);
  }

  const pick = (id) => {
    if (phase !== 'menu') return;
    if (isDisabled(menu, id)) { play('static', { caption: h2 ? '[that take was cut]' : '[locked: that one is gone]' }); return; }
    setMenu((s) => choose(s, id));
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      const o = DOOR.options.find((x) => x.key === e.key);
      if (o) pick(o.id);
      else if (e.key === 'ArrowLeft') setFocus('pink');
      else if (e.key === 'ArrowRight') setFocus('purple');
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(focus); }
      else if (e.key === 'r' || e.key === 'R') { if ((phase === 'pink' || phase === 'purple') && !rew) (h2 ? doCut() : doRewind()); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const skipIntro = () => { if (phase === 'intro' && !fast) { clear(); setSub(DOOR.prompt); setPhase('menu'); } };

  const bar = phase === 'menu' ? BARS.menu : phase === 'purple' ? BARS.clamp : BARS.film;
  const top = phase === 'purple' ? BARS.clamp : BARS.film;
  const push = !rm && (phase === 'menu' || phase === 'pink');
  const cam = phase === 'pink' ? 'm4-cam in2' : push ? 'm4-cam in' : 'm4-cam';
  const r = remaining(menu);
  const w = !h2 ? widths(phase === 'menu' ? (rm ? Math.max(0, secondsLeft(menu)) / 5 : r) : 1) : null;
  const pinState = editStage === 'glitch' || editStage === 'select' || editStage === 'typing' || editStage === 'done' ? 'red' : 'hum';
  const face = phase === 'purple' ? 'blank' : 'smile';
  const stairs = useMemo(() => <Stairs props={{ door: phase === 'pink' ? 'ajar' : 'shut' }} rm={rm} />, [phase === 'pink', rm]); // eslint-disable-line react-hooks/exhaustive-deps
  const genkan = useMemo(() => <Genkan props={{ insert: true }} rm={rm} />, [rm]);
  const t = tally(hist);

  return (
    <LabRoot rm={rm} className={`m4 r2 mode-${mode} ph-${phase}${rew ? ' rew' : ''}${react ? ' reacting' : ''}`} captions="tl" onClick={skipIntro}>
      <div className={scene === 'genkan' ? 'm4-cam' : cam}>
        {scene === 'genkan' ? genkan : (
          <>
            {stairs}
            <svg className={`art r2-her${h2 ? '' : ' m4-her'}`} viewBox="0 0 1920 1080" aria-label={h2 ? 'Nanda at her door, lit by the door lamp' : 'Nanda, a silhouette by her door'}>
              {h2
                ? <LitBust rig="door" face={face} pin={phase === 'purple' ? 'off' : pinState} x={BUST_X} y={BUST_Y} s={BUST_S} />
                : <Markup html={SIL} className={phase === 'purple' || (phase === 'menu' && secondsLeft(menu) <= 1) ? 'eyes-on' : ''} />}
            </svg>
            {/* m4: her door lamp throws pink onto HER option, the purple one sits in her shadow */}
            {!h2 && phase === 'menu' && <div className="r2-spill" />}
          </>
        )}
      </div>

      {/* the reaction cut-in: her real face, blank, in the same door light (hard cut in both modes) */}
      {react && !rew && (
        <div className="r2-react" aria-label="Her face, close. Her eyes have no light in them.">
          <div className="r2-react-bg">{stairs}</div>
          <svg className="art" viewBox="0 0 1920 1080">
            <LitBust rig="door" face="blank" pin="off" x={960 - 300 * 2.25} y={500 - 352 * 2.25} s={2.25} shadow={false} dim={h2 ? 1 : 0.5} />
          </svg>
        </div>
      )}
      <div className="m4-grade" />

      {rew && !h2 && (
        <div className="m4-rew" aria-label="rewinding"><div className="band" /><div className="band b2" /><b>◀◀ REW</b></div>
      )}
      {rew && h2 && (
        <div className="r2-cut" aria-label="She cuts the take: a red grease-pencil X across the frame">
          <svg viewBox="0 0 1920 1080">
            {[0, 1].map((k) => <g key={k} className="sprockets">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={k ? 1868 : 22} y={30 + i * 90} width="30" height="44" rx="6" />)}</g>)}
            {xk >= 1 && <path d="M300 250 C700 480 1200 700 1640 860" className="gp" />}
            {xk >= 2 && <path d="M1620 230 C1200 470 760 720 290 870" className="gp" />}
          </svg>
          <b className="r2-splice">✂ CUT · TAKE 2</b>
        </div>
      )}
      <div className={`bleed${bleed ? (rm ? ' edge' : ' on') : ''}`} />
      <div className="m4-bar-top" style={{ height: top }} />
      <div className="m4-bar-bot" style={{ height: bar }} />
      {fast && <p className="r2-seen">▸▸ 1.5× · ALREADY SEEN</p>}
      {!h2 && round.current >= 2 && t.n > 0 && (phase === 'menu' || phase === 'intro') && (
        <p className="r2-room">THE ROOM CHOSE <b>PINK</b> {t.pink} OF {t.n}</p>
      )}
      <Subtitle text={rew ? '' : sub} bottom={bar + 28} />

      {phase === 'menu' && (
        <div className="m4-menu" style={{ height: BARS.menu }}>
          <Timer s={menu} rm={rm} pour={!h2} />
          <div className="m4-opts">
            <Option o={DOOR.options[0]} s={menu} rm={rm} mode={mode} width={w?.pink} focus={focus === 'pink'} onPick={pick} onFocus={() => setFocus('pink')} />
            <span className="m4-or"><OrText text="OR" /></span>
            <Option o={DOOR.options[1]} s={menu} rm={rm} mode={mode} width={w?.purple} focus={focus === 'purple'} onPick={pick} onFocus={() => setFocus('purple')} />
          </div>
          {h2 && !isDisabled(menu, 'purple') && (
            <p className={`r2-typing${retyped(menu.t, rm) ? ' done' : ''}`}>
              {retyped(menu.t, rm) ? <>✎ NANDA edited: <s>Goodnight.</s> → Stay.</> : '✎ NANDA is editing…'}
            </p>
          )}
        </div>
      )}
      {(phase === 'pink' || phase === 'purple') && !rew && (
        <button type="button" className="lab m4-rewbtn" onClick={(e) => { e.stopPropagation(); h2 ? doCut() : doRewind(); }}>
          {h2 ? '✂ R · her cut' : '◀◀ R · her rewind'}
        </button>
      )}
      {phase === 'intro' && !fast && <p className="hint m4-hint">click to skip ▸</p>}
      <p className="m4-slate">{h2 ? 'menu-h2-r2' : 'menu-4-r2'} · {h2 ? 'take' : 'round'} {round.current + 1}{round.current ? ' · replay' : ''}</p>
    </LabRoot>
  );
}
