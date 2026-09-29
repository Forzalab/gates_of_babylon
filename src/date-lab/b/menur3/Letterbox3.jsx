// Round-3 letterbox DOOR menus (Builder B). One engine, two variants:
//  mode 'h2' = menu-h2-r3 "Her Time, Her Cut", refined per R2-VERDICT: both options are the SAME fat, high-contrast slab
//              (only colour and squeeze differ), her edit is whole-word swaps on held states (<= 2 glyph changes a
//              second, was 8/s), the edit line is 34 px, and the top bar carries THE ROOM CHOSE PINK n OF N.
//  mode 'h3' = menu-h3-r3 "Her Hold" (menu-h2 letterbox/pour x menu-1-r2 hand-on-card x menu-3-r2 lens gaze): NO text edit.
//              From frame 0 her hand reaches in over the bar's right edge and rests two red-nailed fingertips on the purple
//              box: it stays squeezed and 6 px lower, and hover lifts pink 22 px but purple only 6. The time pours into pink
//              through a NAND-gate nozzle. Timeout = hard cut to her ECU: pupils on the purple box, one held cut later into
//              the lens: "Not him. You." ("The one clicking." under the bar). The options stay full-size under the ECU.
//              Replay: her hair-pin through the picked box, room tally in the top bar, timer live.
// Reduced motion: bars/camera hard-cut, timer = 5 blocks, h2 edit = one hard cut at 3 s, hand = resting pose at once,
// bleed = purple edge frame, cut / ECU = held frames (the ECU is already hard cuts).
// Keys: 1 / 2, <- -> + Enter, R = her cut (h2) / again (h3). Shots: ?state=menu|replay|replay-pink, ?mt=<ms> freezes the clock.
import { useEffect, useMemo, useRef, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { LabRoot, OrText, useLater, param } from '../shared/ui.jsx';
import LitBust from '../shared/LitBust.jsx';
import { play, bed } from '../shared/audio.js';
import { DOOR, openMenu, tick, choose, remaining, secondsLeft, replay, isDisabled } from '../shared/door.js';
import { BigPin } from '../../a/menu2/cards.jsx';
import { purpleLabel3, retyped3, outcome3, slabWidths, pinkPour, heldRemaining, handPose, boxOffset, ECU, ECU_LEAVE, beatAt, tally3 } from './r3.js';
import Hand from './Hand.jsx';
import Ecu from './Ecu.jsx';
import '../menu4/menu4.css';
import '../menur2/menur2.css';
import './menur3.css';

const BARS = { film: 138, menu: 262, clamp: 192 };
const START = param('state');
const MT = param('mt') !== null ? Math.max(0, +param('mt') || 0) : null;
const ET = param('et') !== null ? Math.max(0, +param('et') || 0) : null; // freeze the ECU clock (shots)
const BUST_S = 0.987, BUST_X = 980 - 300 * BUST_S, BUST_Y = 250 - 108 * BUST_S;
const histKey = (mode) => `lab-b-r3-${mode}-history`;
const readHist = (mode) => { try { return JSON.parse(localStorage.getItem(histKey(mode)) || '[]'); } catch { return []; } };
const pushHist = (mode, o) => { try { localStorage.setItem(histKey(mode), JSON.stringify([...readHist(mode), o].slice(-50))); } catch { /* private window */ } };

function Subtitle({ text, bottom }) {
  if (!text) return null;
  const m = /^([A-Z]+):\s*(.*)$/.exec(text);
  return (
    <p className={`m4-sub${m ? ' spoken' : ''}`} style={{ bottom }}>
      {m && <span className="m4-who">{m[1]}</span>}<OrText text={m ? m[2] : text} />
    </p>
  );
}

// Timer: drains leftward; in h3 it pours into the pink slab through her NAND-gate nozzle (drops on the 125 ms grid).
function Timer({ s, rm, spout }) {
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
      {spout && !s.done && (
        <svg className="r3-spout" viewBox="0 0 140 110" aria-hidden="true">
          <path d="M64,19 C16,19 12,56 96,78" fill="none" stroke="#ff5fa2" strokeWidth="10" strokeLinecap="round" />
          {[0, 1, 2].map((k) => <circle key={k} cx={100 + k * 4} cy={80 + ((step + k) % 4) * 7} r={6 - k} fill="#ffd3e6" />)}
        </svg>
      )}
    </>
  );
}

function PurpleText({ s, mode, rm }) {
  if (mode !== 'h2' || isDisabled(s, 'purple')) return <span className="m4-label">{DOOR.options[1].label}</span>;
  const L = purpleLabel3(s.t, rm);
  const caret = !s.done && L.stage !== 'select';
  return (
    <span className={`m4-label r2-edit st-${L.stage}`}>
      {L.keep}
      <span className="r2-word">
        <span className="r2-w">{L.word}</span>
        {caret && <i className="r2-caret" />}
      </span>
    </span>
  );
}

function Option({ o, s, focus, hover, rm, mode, onPick, onFocus, onHover, width, held }) {
  const off = isDisabled(s, o.id);
  const fill = o.id !== 'pink' || off ? 0 : pinkPour(heldRemaining(s, rm));
  const dy = mode === 'h3' && !off ? boxOffset(o.id, hover, held) : 0;
  return (
    <button type="button" style={{ flex: `0 0 ${width}px`, transform: `translateY(${dy}px)` }}
      className={`m4-opt r3-slab ${o.id}${off ? ' off' : ''}${focus ? ' focus' : ''}${s.picked === o.id ? ' picked' : ''}${held && o.id === 'purple' ? ' held' : ''}`}
      aria-disabled={off} onPointerEnter={() => { onFocus(); onHover(o.id); }} onPointerLeave={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onPick(o.id); }}>
      {o.id === 'pink' && <span className="m4-fill" style={{ height: `${fill * 100}%` }} />}
      <span className="m4-key">{o.key}</span>
      {o.id === 'purple' ? <PurpleText s={s} mode={mode} rm={rm} /> : <span className="m4-label">{o.label}</span>}
      {off && (mode === 'h3'
        ? <span className="r3-pinned" aria-hidden="true"><BigPin /></span>
        : <span className="r2-stamp">CUT</span>)}
    </button>
  );
}

export default function Letterbox3({ rm, mode = 'h3' }) {
  const h2 = mode === 'h2', h3 = mode === 'h3';
  const ecuStart = START === 'ecu' && mode === 'h3'; // shots: open straight on the timeout ECU
  const [phase, setPhase] = useState(ecuStart ? 'ecu' : START ? 'menu' : 'intro');
  const [menu, setMenu] = useState(() => {
    const dis = START === 'replay' ? ['purple'] : START === 'replay-pink' ? ['pink'] : [];
    const m = openMenu(DOOR, { disabled: dis });
    if (ecuStart) return { ...m, t: DOOR.timeout, picked: 'pink', via: 'timeout', done: true };
    return MT !== null ? { ...m, t: MT } : m;
  });
  const replayLine = h2 ? 'NANDA: Take two. From the door.' : 'NANDA: Again? Your pick is pinned.';
  const [sub, setSub] = useState(START?.startsWith('replay') ? replayLine : START ? DOOR.prompt : '');
  const [focus, setFocus] = useState('pink');
  const [hover, setHover] = useState(null);
  const [bleed, setBleed] = useState(false);
  const [rew, setRew] = useState(false); // h2: her cut
  const [xk, setXk] = useState(0);
  const [scene, setScene] = useState('stairs');
  const [react, setReact] = useState(false);
  const [ecu, setEcu] = useState(ecuStart ? { beats: ECU, t: ET ?? 0 } : null); // h3: { beats, t }
  const [lift, setLift] = useState(false); // h3: she lets go
  const [later, clear] = useLater();
  const round = useRef(START?.startsWith('replay') ? 1 : 0);
  const lastSec = useRef(5);
  const [hist, setHist] = useState(() => readHist(mode));

  useEffect(() => {
    bed('rain', true);
    if (START) return undefined;
    later(() => setSub('NANDA: This is me. Unit 12.'), 400);
    later(() => setSub('NANDA: I already boiled the water. This morning.'), 2000);
    later(() => { setSub(DOOR.prompt); setPhase('menu'); }, 4200);
    return undefined;
  }, [later]);

  // the menu clock; ?mt / ?pause freeze it for shots
  useEffect(() => {
    if (phase !== 'menu' || menu.done || MT !== null || param('pause') !== null) return undefined;
    let raf, prev = performance.now();
    const f = (now) => { const dt = now - prev; prev = now; setMenu((s) => tick(s, dt)); raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [phase, menu.done]);

  // the ECU clock (h3); ?et freezes it
  useEffect(() => {
    if (!ecu || ET !== null) return undefined;
    let raf; const t0 = performance.now();
    const f = (now) => { setEcu((e) => (e ? { ...e, t: now - t0 } : e)); raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [ecu?.beats]); // eslint-disable-line react-hooks/exhaustive-deps
  const beat = ecu ? beatAt(ecu.beats, ecu.t) : null;
  useEffect(() => {
    if (!beat) return;
    if (beat.end) { endEcu(); return; }
    setSub(beat.line);
    if (beat.look === 'lens') play('cut', { caption: '[hard cut: her eyes, on you]' });
    else play('thump');
  }, [beat?.at, ecu?.beats]); // eslint-disable-line react-hooks/exhaustive-deps

  // heartbeat on the last 3 seconds (<= 1 Hz)
  const editStage = h2 && phase === 'menu' && !isDisabled(menu, 'purple') ? purpleLabel3(menu.t, rm).stage : 'none';
  useEffect(() => {
    if (phase !== 'menu' || menu.done) return;
    const n = secondsLeft(menu);
    if (n !== lastSec.current) { lastSec.current = n; if (n <= 3 && n >= 1) play('thump', { gain: 0.5 + (3 - n) * 0.25 }); }
  }, [menu, phase]);
  useEffect(() => {
    if (editStage === 'glitch' || (rm && editStage === 'done')) play('static', { caption: '[the label glitches]' });
    else if (editStage === 'select') play('tick', { caption: '[her click: a word selected]' });
    else if (editStage === 'done') play('tick', { caption: '[she replaces the word]' });
  }, [editStage]); // eslint-disable-line react-hooks/exhaustive-deps
  // h3: her nails land on the box
  const hp = handPose(phase === 'menu' ? menu.t : 9999, rm);
  useEffect(() => { if (h3 && phase === 'menu' && hp === 2 && !isDisabled(menu, 'purple')) play('tick', { caption: '[two nails tap the box]' }); }, [hp === 2, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  function stayEnding(line) {
    play('pink');
    setPhase('pink');
    setSub(line);
    later(() => play('door'), 700);
    later(() => { setScene('genkan'); setSub("Men's slippers. Already set out."); play('thump'); }, 3000);
  }

  // a pick (click or timeout) -> the ending
  useEffect(() => {
    if (phase !== 'menu' || !menu.done) return;
    const o = outcome3(menu, rm, mode);
    pushHist(mode, o); setHist(readHist(mode));
    if (h3) {
      if (o === 'stay' && menu.via === 'timeout') { play('cut'); setPhase('ecu'); setEcu({ beats: ECU, t: ET ?? 0 }); return; }
      if (o === 'stay') { stayEnding('NANDA: Good input.'); return; }
      play('purple'); play('bleed');
      setLift(true); setBleed(true);
      later(() => setBleed(false), 334);
      later(() => { setPhase('ecu'); setEcu({ beats: ECU_LEAVE, t: ET ?? 0 }); }, rm ? 0 : 400);
      return;
    }
    if (o === 'stay') {
      const viaEdit = menu.picked === 'purple';
      stayEnding(viaEdit ? (menu.via === 'timeout' ? 'NANDA: Same answer, then.' : 'NANDA: You picked Stay. I saw.')
        : menu.via === 'timeout' ? "NANDA: You didn't say no." : 'NANDA: Good input.');
    } else {
      play('purple'); play('bleed');
      setPhase('purple');
      setBleed(true);
      later(() => setBleed(false), 334);
      setSub('NANDA: Right. Goodnight. That’s… fine.');
      later(() => { setReact(true); setSub('NANDA: You’re allowed. Text me when you’re home.'); play('thump'); }, 2000);
      later(() => doCut(), 4400);
    }
  }, [menu.done]); // eslint-disable-line react-hooks/exhaustive-deps

  function endEcu() {
    const leave = ecu?.beats === ECU_LEAVE;
    setEcu(null);
    if (leave) reopen(replayLine);
    else { setPhase('pink'); later(() => play('door'), 300); later(() => { setScene('genkan'); setSub("Men's slippers. Already set out."); play('thump'); }, 2200); setSub('NANDA: Come in. Shoes off.'); }
  }

  function reopen(line) {
    clear();
    setRew(false); setXk(0); setReact(false); setScene('stairs'); setLift(false); setEcu(null);
    round.current += 1;
    lastSec.current = 5;
    setMenu((s) => replay(s.picked ? s : { ...s, picked: 'purple' }));
    setFocus('pink');
    setSub(line);
    setPhase('menu');
    later(() => setSub(DOOR.prompt), 2200);
  }

  function doCut() { // h2: SHE cuts the take
    clear();
    setRew(true);
    play('static', { caption: '[film stops: a splice]' });
    setXk(1);
    later(() => { setXk(2); play('tick', { caption: '[grease pencil squeak]' }); }, rm ? 0 : 500);
    later(() => play('whisper', { caption: 'whisper: "cut."' }), rm ? 0 : 900);
    later(() => reopen(replayLine), rm ? 1400 : 1900);
  }

  const again = () => (h2 ? doCut() : reopen(replayLine));

  const pick = (id) => {
    if (phase !== 'menu') return;
    if (isDisabled(menu, id)) { play('static', { caption: h2 ? '[that take was cut]' : '[pinned: that one is gone]' }); return; }
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
      else if (e.key === 'r' || e.key === 'R') { if ((phase === 'pink' || phase === 'purple') && !rew) again(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const skipIntro = () => { if (phase === 'intro') { clear(); setSub(DOOR.prompt); setPhase('menu'); } };

  const showMenu = phase === 'menu' || phase === 'ecu';
  const bar = showMenu ? BARS.menu : phase === 'purple' ? BARS.clamp : BARS.film;
  const top = phase === 'purple' ? BARS.clamp : BARS.film;
  const push = !rm && (phase === 'menu' || phase === 'pink');
  const cam = phase === 'pink' ? 'm4-cam in2' : push ? 'm4-cam in' : 'm4-cam';
  const w = slabWidths(heldRemaining(menu, rm));
  const pinState = h3 ? (phase === 'menu' && secondsLeft(menu) <= 2 ? 'red' : 'hum') : editStage !== 'clean' && editStage !== 'none' ? 'red' : 'hum';
  const face = phase === 'purple' ? 'blank' : 'smile';
  const stairs = useMemo(() => <Stairs props={{ door: phase === 'pink' ? 'ajar' : 'shut' }} rm={rm} />, [phase === 'pink', rm]); // eslint-disable-line react-hooks/exhaustive-deps
  const genkan = useMemo(() => <Genkan props={{ insert: true }} rm={rm} />, [rm]);
  const t = tally3(hist);
  const holding = h3 && showMenu && !isDisabled(menu, 'purple');
  const under = beat?.under;

  return (
    <LabRoot rm={rm} className={`m4 r2 r3 mode-${mode} ph-${phase}${rew ? ' rew' : ''}${react ? ' reacting' : ''}`} captions="tl" onClick={skipIntro}>
      <div className={scene === 'genkan' ? 'm4-cam' : cam}>
        {scene === 'genkan' ? genkan : (
          <>
            {stairs}
            <svg className="art r2-her" viewBox="0 0 1920 1080" aria-label="Nanda at her door, lit by the door lamp">
              <LitBust rig="door" face={face} pin={phase === 'purple' ? 'off' : pinState} x={BUST_X} y={BUST_Y} s={BUST_S} />
            </svg>
          </>
        )}
      </div>

      {/* h2 reaction cut-in: her real face, blank (hard cut) */}
      {react && !rew && (
        <div className="r2-react" aria-label="Her face, close. Her eyes have no light in them.">
          <div className="r2-react-bg">{stairs}</div>
          <svg className="art" viewBox="0 0 1920 1080">
            <LitBust rig="door" face="blank" pin="off" x={960 - 300 * 2.25} y={500 - 352 * 2.25} s={2.25} shadow={false} />
          </svg>
        </div>
      )}
      {/* h3 ECU: hard cut, the menu stays full-size underneath */}
      {phase === 'ecu' && beat && !beat.end && (
        <div className="r3-ecuwrap"><Ecu look={beat.look} /></div>
      )}
      <div className="m4-grade" />

      {rew && (
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
      {t.n > 0 && (phase === 'menu' || phase === 'intro' || phase === 'ecu') && (
        <p className="r3-room">THE ROOM CHOSE <b>PINK</b> {t.pink} OF {t.n}</p>
      )}
      <Subtitle text={rew ? '' : sub} bottom={bar + 28} />

      {showMenu && (
        <div className="m4-menu" style={{ height: BARS.menu }}>
          <Timer s={menu} rm={rm} spout={h3} />
          <div className="m4-opts r3-opts">
            <Option o={DOOR.options[0]} s={menu} rm={rm} mode={mode} width={w.pink} focus={focus === 'pink'} hover={hover === 'pink'} held={false}
              onPick={pick} onFocus={() => setFocus('pink')} onHover={setHover} />
            <span className="m4-or"><OrText text="OR" /></span>
            <Option o={DOOR.options[1]} s={menu} rm={rm} mode={mode} width={w.purple} focus={focus === 'purple'} hover={hover === 'purple'} held={holding && !lift}
              onPick={pick} onFocus={() => setFocus('purple')} onHover={setHover} />
          </div>
          {h2 && !isDisabled(menu, 'purple') && (
            <p className={`r3-edit${retyped3(menu.t, rm) ? ' done' : ''}`}>
              {retyped3(menu.t, rm) ? <>✎ NANDA edited: <s>Goodnight.</s> → Stay.</> : '✎ NANDA is editing…'}
            </p>
          )}
          {h3 && under && <p className="r3-under">{under}</p>}
          {h3 && phase === 'menu' && isDisabled(menu, 'purple') && <p className="r3-under dim">you already tried that</p>}
        </div>
      )}
      {h3 && showMenu && (holding || lift) && <Hand pose={lift ? 'lift' : hp} />}
      {(phase === 'pink' || phase === 'purple') && !rew && (
        <button type="button" className="lab m4-rewbtn" onClick={(e) => { e.stopPropagation(); again(); }}>
          {h2 ? '✂ R · her cut' : '↺ R · again'}
        </button>
      )}
      {phase === 'intro' && <p className="hint m4-hint">click to skip ▸</p>}
      <p className="m4-slate">menu-{mode}-r3 · {h2 ? 'take' : 'round'} {round.current + 1}{round.current ? ' · replay' : ''}</p>
    </LabRoot>
  );
}
