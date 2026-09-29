// menu-4 · BANDERSNATCH LETTERBOX (horror 3). Central theme: "the timer is hers".
// Cinema letterbox (2.39:1) over her door; the choice sits in the bottom bar while the picture keeps playing.
// The timer bar does not shrink to the centre like Netflix's: it DRAINS INTO the pink option, which fills up
// like a cup. Silence = consent: at 0 the pink option is full and picks itself. Purple = 334 ms bleed, the bars
// clamp tighter (2.39 -> 2.76:1), her eyes open, and SHE rewinds the tape: the replay has purple disabled
// while the timer still runs. Reduced motion: letterbox + bars hard-cut, the timer is 5 blocks that drop one a
// second, rewind = one held frame. Keys: 1 / 2 or <- -> + Enter; R = rewind. ?state=menu|replay|pink|purple for shots.
import { useEffect, useMemo, useRef, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import { LabRoot, Markup, OrText, useLater, param } from '../shared/ui.jsx';
import { play, bed } from '../shared/audio.js';
import { ART } from '../shared/art.js';
import { DOOR, openMenu, tick, choose, remaining, secondsLeft, replay, isDisabled } from '../shared/door.js';
import './menu4.css';

const BARS = { film: 138, menu: 250, clamp: 192 };
const NANDA = ART.sil('nanda', 1010, 936, 1.18, { slit: true });

function Subtitle({ text, bottom }) {
  if (!text) return null;
  const m = /^([A-Z]+):\s*(.*)$/.exec(text);
  return (
    <p className={`m4-sub${m ? ' spoken' : ''}`} style={{ bottom }}>
      {m && <span className="m4-who">{m[1]}</span>}<OrText text={m ? m[2] : text} />
    </p>
  );
}

function Timer({ s, rm }) {
  const r = remaining(s);
  if (rm) {
    const n = Math.max(0, secondsLeft(s));
    return (
      <div className="m4-timer blocks" aria-label={`${n} seconds`}>
        {[0, 1, 2, 3, 4].map((i) => <i key={i} className={i < n ? 'on' : ''} />)}
      </div>
    );
  }
  return (
    <div className="m4-timer" aria-label={`${Math.ceil(r * 5)} seconds`}>
      <div className="m4-bar" style={{ width: `${r * 100}%` }} />
      {/* the drain head: her pin, pulling the time toward pink */}
      <svg className="m4-head" style={{ left: `${r * 100}%` }} viewBox="-40 -20 80 40" aria-hidden="true">
        <path d="M-18,-12 L0,-12 A12,12 0 0 1 0,12 L-18,12 Z" fill="#1a0610" stroke="#ff5fa2" strokeWidth="3" />
        <circle cx="18" cy="0" r="6" fill="#f0243f" />
      </svg>
    </div>
  );
}

function Option({ o, s, focus, rm, onPick, onFocus }) {
  const off = isDisabled(s, o.id);
  const fill = o.id === 'pink' ? (rm ? 1 - Math.max(0, secondsLeft(s)) / 5 : 1 - remaining(s)) : 0;
  const picked = s.picked === o.id;
  return (
    <button type="button" className={`m4-opt ${o.id}${off ? ' off' : ''}${focus ? ' focus' : ''}${picked ? ' picked' : ''}`}
      aria-disabled={off} onPointerEnter={onFocus} onClick={(e) => { e.stopPropagation(); onPick(o.id); }}>
      {o.id === 'pink' && <span className="m4-fill" style={{ height: `${fill * 100}%` }} />}
      <span className="m4-key">{o.key}</span>
      <span className="m4-label">{o.label}</span>
    </button>
  );
}

const START = param('state');

export default function Menu4({ rm }) {
  const [phase, setPhase] = useState(START === 'pink' || START === 'purple' ? START : START ? 'menu' : 'intro');
  const [menu, setMenu] = useState(() => {
    const m = openMenu(DOOR, { disabled: START === 'replay' ? ['purple'] : [] });
    return START === 'pink' || START === 'purple' ? { ...m, t: 1200, picked: START, done: true, via: 'click' } : m;
  });
  const [sub, setSub] = useState(START === 'replay' ? 'NANDA: You said goodnight last time.' : START ? DOOR.prompt : '');
  const [focus, setFocus] = useState('pink');
  const [bleed, setBleed] = useState(false);
  const [rew, setRew] = useState(false);
  const [scene, setScene] = useState('stairs');
  const [react, setReact] = useState(false); // the reaction cut-in on her face after purple
  const [later, clear] = useLater();
  const round = useRef(START === 'replay' ? 1 : 0);
  const lastSec = useRef(5);

  // intro: two subtitles, then the menu opens (click skips ahead)
  useEffect(() => {
    bed('rain', true);
    if (START) return undefined;
    later(() => setSub('NANDA: This is me. Unit 12.'), 400);
    later(() => setSub('NANDA: I already boiled the water. This morning.'), 2000);
    later(() => { setSub(DOOR.prompt); setPhase('menu'); }, 4200);
    return undefined;
  }, [later]);

  // the timer: runs whenever the menu is open (the picture keeps playing underneath)
  useEffect(() => {
    if (phase !== 'menu' || menu.done || param('pause') !== null) return undefined;
    let raf, prev = performance.now();
    const f = (now) => {
      const dt = now - prev; prev = now;
      setMenu((s) => tick(s, dt));
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [phase, menu.done]);

  // heartbeat on the last 3 seconds (<= 1 Hz)
  useEffect(() => {
    if (phase !== 'menu' || menu.done) return;
    const n = secondsLeft(menu);
    if (n !== lastSec.current) { lastSec.current = n; if (n <= 3 && n >= 1) play('thump', { gain: 0.5 + (3 - n) * 0.25 }); }
  }, [menu, phase]);

  // a pick (click or timeout) -> the result beat
  useEffect(() => {
    if (phase !== 'menu' || !menu.done) return;
    const id = menu.picked;
    if (id === 'pink') {
      play('pink');
      setPhase('pink');
      setSub(menu.via === 'timeout' ? "NANDA: You didn't say no." : 'NANDA: Good input.');
      later(() => play('door'), 700);
      later(() => { setScene('genkan'); setSub("Men's slippers. Already set out."); play('thump'); }, 3000);
    } else {
      play('purple'); play('bleed');
      setPhase('purple');
      setBleed(true);
      later(() => setBleed(false), 334);
      setSub('NANDA: Right. Goodnight. That’s… fine.');
      later(() => { setReact(true); setSub('NANDA: You’re allowed. Text me when you’re home.'); play('thump'); }, 2000);
      later(() => doRewind('purple'), 4200);
    }
  }, [menu.done]); // eslint-disable-line react-hooks/exhaustive-deps

  function doRewind() {
    clear();
    setRew(true);
    setReact(false);
    play('rewind');
    later(() => play('whisper'), 700);
    later(() => {
      setRew(false);
      setScene('stairs');
      round.current += 1;
      lastSec.current = 5;
      setMenu((s) => replay(s.picked ? s : { ...s, picked: 'purple' }));
      setPhase('menu');
      setFocus('pink');
      setSub(menu.picked === 'pink' ? 'NANDA: Again? Good. Same answer, then.' : 'NANDA: You said goodnight last time.');
      later(() => setSub(DOOR.prompt), 2200);
    }, rm ? 1000 : 1400);
  }

  const pick = (id) => {
    if (phase !== 'menu') return;
    if (isDisabled(menu, id)) { play('static', { caption: '[locked: that one is gone]' }); return; }
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
      else if (e.key === 'r' || e.key === 'R') { if (phase === 'pink' || phase === 'purple') doRewind(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const skipIntro = () => { if (phase === 'intro') { clear(); setSub(DOOR.prompt); setPhase('menu'); } };

  const bar = phase === 'menu' ? BARS.menu : phase === 'purple' ? BARS.clamp : BARS.film;
  const top = phase === 'purple' ? BARS.clamp : BARS.film;
  const push = !rm && (phase === 'menu' || phase === 'pink');
  const cam = phase === 'pink' ? 'm4-cam in2' : react ? 'm4-cam face' : push ? 'm4-cam in' : 'm4-cam';
  const stairs = useMemo(() => <Stairs props={{ door: phase === 'pink' ? 'ajar' : 'shut' }} rm={rm} />, [phase === 'pink', rm]); // eslint-disable-line react-hooks/exhaustive-deps
  const genkan = useMemo(() => <Genkan props={{ insert: true }} rm={rm} />, [rm]);

  return (
    <LabRoot rm={rm} className={`m4 ph-${phase}${rew ? ' rew' : ''}`} captions="tl" onClick={skipIntro}>
      <div className={scene === 'genkan' ? 'm4-cam' : cam}>
        {scene === 'genkan' ? genkan : (
          <>
            {stairs}
            <svg className="art m4-her" viewBox="0 0 1920 1080" aria-label="Nanda, a silhouette by her door">
              <Markup html={NANDA} className={phase === 'purple' || (phase === 'menu' && secondsLeft(menu) <= 1) ? 'eyes-on' : ''} />
            </svg>
          </>
        )}
      </div>
      <div className="m4-grade" />
      {rew && (
        <div className="m4-rew" aria-label="rewinding">
          <div className="band" /><div className="band b2" />
          <b>◀◀ REW</b>
        </div>
      )}
      <div className={`bleed${bleed ? (rm ? ' edge' : ' on') : ''}`} />
      <div className="m4-bar-top" style={{ height: top }} />
      <div className="m4-bar-bot" style={{ height: bar }} />
      <Subtitle text={rew ? '' : sub} bottom={bar + 28} />

      {phase === 'menu' && (
        <div className="m4-menu" style={{ height: BARS.menu }}>
          <Timer s={menu} rm={rm} />
          <div className="m4-opts">
            <Option o={DOOR.options[0]} s={menu} rm={rm} focus={focus === 'pink'} onPick={pick} onFocus={() => setFocus('pink')} />
            <span className="m4-or"><OrText text="OR" /></span>
            <Option o={DOOR.options[1]} s={menu} rm={rm} focus={focus === 'purple'} onPick={pick} onFocus={() => setFocus('purple')} />
          </div>
        </div>
      )}
      {(phase === 'pink' || phase === 'purple') && !rew && (
        <button type="button" className="lab m4-rewbtn" onClick={(e) => { e.stopPropagation(); doRewind(); }}>◀◀ R · her rewind</button>
      )}
      {phase === 'intro' && <p className="hint m4-hint">click to skip ▸</p>}
      <p className="m4-slate">menu-4 · round {round.current + 1}{round.current ? ' · replay' : ''}</p>
    </LabRoot>
  );
}
