// anim-3-r2 · JUNJI ITO CREEP, CROWD MODE (horror 5). Round-1 anim-3 (scenes, spirals, gaze + blink grammar) plus the
// verdict's blocking fix: "the room looks away". Nobody in a classroom can see a cursor, so when the mouse is idle the
// ROOM is the eye (./room.js): a big eye at the top drains in 4 held poses over 6 s ("THE ROOM IS WATCHING" -> "the room
// is not looking"), then the screen blinks and the scene takes one step behind the blink. Fully crept scenes hold 6 s
// and the tour moves on by itself, so the piece runs hands-off on a projector. Move the mouse = round-1 hand mode.
// Round-1 self-critique ("overlays stacked on main's art, not Ito linework") answered: from stage 3 the scene itself is
// re-inked (an SVG ink filter: paper + black ink + hatching in the mid-tones); only her red stays red.
// Reduced motion: blink = 400 ms black cut, the room's eye is a static 4-step meter, the ink is a cut.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LabRoot, Line, param, toStage } from '../shared/ui.jsx';
import { play } from '../shared/audio.js';
import { SCENES, MAX } from '../anim3/Anim3.jsx';
import { initRoom, roomTick, roomBlink, eyePose, EYE_TEXT, ROOM } from './room.js';
import '../anim3/anim3.css';
import './anim3r2.css';

const HATCH = `data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><path d='M-3 3 L3 -3 M0 12 L12 0 M9 15 L15 9' stroke='black' stroke-width='2.2'/></svg>")}`;
export function InkFilter({ id = 'a3r2-ink' }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values=".3 .59 .11 0 0  .3 .59 .11 0 0  .3 .59 .11 0 0  0 0 0 1 0" result="g" />
        {/* 8 luminance bins: ink black | hatched grey (night tones) | paper */}
        <feComponentTransfer in="g" result="post">
          <feFuncR type="discrete" tableValues="0.04 0.66 0.66 0.95 0.95 0.96 0.96 0.96" />
          <feFuncG type="discrete" tableValues="0.03 0.62 0.62 0.92 0.92 0.93 0.93 0.93" />
          <feFuncB type="discrete" tableValues="0.04 0.56 0.56 0.85 0.85 0.86 0.86 0.86" />
        </feComponentTransfer>
        <feImage href={HATCH} x="0" y="0" width="12" height="12" result="tile" />
        <feTile in="tile" result="hatch" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="lumA" />
        <feComponentTransfer in="lumA" result="mid"><feFuncA type="discrete" tableValues="0 1 1 0 0 0 0 0" /></feComponentTransfer>
        <feComposite in="hatch" in2="mid" operator="in" result="hm" />
        <feBlend in="hm" in2="post" mode="multiply" result="toned" />
        {/* Ito's pen line: an edge pass on the luminance, drawn in black ink */}
        <feConvolveMatrix in="g" order="3" kernelMatrix="-1 -1 -1  -1 8 -1  -1 -1 -1" preserveAlpha="true" result="edge" />
        <feColorMatrix in="edge" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -0.35" result="edgeA" />
        <feFlood floodColor="#0b0508" result="inkc" />
        <feComposite in="inkc" in2="edgeA" operator="in" result="lines" />
        <feMerge result="inked"><feMergeNode in="toned" /><feMergeNode in="lines" /></feMerge>
        {/* her red survives the ink (every OR stays her red): keep the source wherever it is strongly red/pink */}
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 -1.5 -1.5 0 -0.6" result="redA" />
        <feComposite in="SourceGraphic" in2="redA" operator="in" result="red" />
        <feMerge><feMergeNode in="inked" /><feMergeNode in="red" /></feMerge>
      </filter>
    </svg>
  );
}

// the room's eye: an Ito eye (spiral iris) with a lid that drops in 4 held poses
function RoomEye({ pose, mode, watching, rm }) {
  const lid = [0, 0.38, 0.66, 0.9][pose];
  const text = mode === 'room' ? EYE_TEXT[pose] : watching ? 'YOU ARE WATCHING' : 'you looked away';
  return (
    <div className={`r3-eye m-${mode} p-${pose}${watching ? ' on' : ''}`} aria-live="polite">
      <svg viewBox="-110 -50 220 100" aria-hidden="true">
        <defs><clipPath id="r3-almond"><path d="M-100 0 Q0 -70 100 0 Q0 70 -100 0Z" /></clipPath></defs>
        <path d="M-100 0 Q0 -70 100 0 Q0 70 -100 0Z" className="white" />
        <g clipPath="url(#r3-almond)">
          <circle r="30" className="iris" />
          <path d="M0 0 L3 -1 L4 3 L-2 6 L-8 1 L-5 -8 L6 -10 L13 0 L8 12 L-6 15 L-16 4 L-13 -13 L3 -19 L20 -8" className="spiral" />
          <circle r="7" className="pupil" />
          {!rm || mode === 'room' ? <rect x="-110" y="-60" width="220" height={120 * lid} className="lid" /> : null}
        </g>
        <path d="M-100 0 Q0 -70 100 0 Q0 70 -100 0Z" className="rim" />
      </svg>
      <p>{text}</p>
      {mode === 'room' && <i className="r3-dots">{[0, 1, 2, 3].map((k) => <b key={k} className={k < ROOM.poses - pose ? 'on' : ''} />)}</i>}
    </div>
  );
}

const startScene = Math.max(0, SCENES.findIndex((s) => s.id === param('scene')));
const startStage = Math.min(MAX, Math.max(0, parseInt(param('stage') ?? '0', 10) || 0));
const START_ROOM = param('room') !== null ? Math.max(0, +param('room') || 0) : 0; // ?room=<ms> seeds the room clock (shots)

export default function Anim3R2({ rm }) {
  const root = useRef(null);
  const [si, setSi] = useState(startScene);
  const [stages, setStages] = useState(() => SCENES.map((_, i) => (i === startScene ? startStage : 0)));
  const [lid, setLid] = useState(false);
  const [gaze, setGaze] = useState(null);
  const [room, setRoomState] = useState(() => ({ ...initRoom(), sinceStep: START_ROOM }));
  const roomRef = useRef(room);
  const setRoom = useCallback((v) => { const n = typeof v === 'function' ? v(roomRef.current) : v; roomRef.current = n; setRoomState(n); }, []);
  const moved = useRef(false);
  const onAnchor = useRef(false);
  const sc = SCENES[si], k = stages[si];

  // the change lands while the eyes are shut (lids 150 ms, change at 180 ms, open at 420 ms; RM = 400 ms black)
  const blink = useCallback((what = 'step', cap) => {
    if (lid) return;
    play('lid', cap ? { caption: cap } : undefined);
    setLid(true);
    setTimeout(() => {
      if (what === 'next') {
        setSi((i) => { const n = (i + 1) % SCENES.length; setStages((st) => st.map((v, j) => (j === n ? 0 : v))); return n; });
      } else {
        setStages((st) => st.map((v, i) => (i === si ? Math.min(MAX, v + 1) : v)));
        play('creak');
      }
    }, 180);
    setTimeout(() => setLid(false), rm ? 400 : 420);
  }, [lid, rm, si]);

  // the room clock ticks on the 8 fps grid
  useEffect(() => {
    if (param('pause') !== null) return undefined;
    const id = setInterval(() => {
      const [n, action] = roomTick(roomRef.current, 125, { moved: moved.current, onAnchor: onAnchor.current, atMax: stages[si] >= MAX });
      moved.current = false;
      roomRef.current = n;
      setRoom(n);
      if (action) blink(action, action === 'next' ? '[the room blinks: next scene]' : '[the room blinks]');
    }, 125);
    return () => clearInterval(id);
  }, [si, stages, blink]);

  const onMove = (e) => {
    const p = toStage(e, root.current);
    setGaze(p);
    moved.current = true;
    onAnchor.current = Math.hypot(p.x - sc.anchor[0], p.y - sc.anchor[1]) < 280;
  };
  const manualBlink = useCallback(() => { setRoom(roomBlink); if (stages[si] < MAX) blink('step'); }, [blink, si, stages]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowRight') setSi((i) => (i + 1) % SCENES.length);
      else if (e.key === 'ArrowLeft') setSi((i) => (i + SCENES.length - 1) % SCENES.length);
      else if (e.key === ' ') { e.preventDefault(); manualBlink(); }
      else if (e.key === 'r' || e.key === 'R') setStages((st) => st.map((v, i) => (i === si ? 0 : v)));
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [si, manualBlink]);
  const firstScene = useRef(true);
  useEffect(() => { if (firstScene.current) { firstScene.current = false; return; } setRoom(roomBlink); }, [si, setRoom]);

  const art = useMemo(() => sc.art(rm), [sc, rm]);
  const handMode = room.mode === 'hand';
  const watching = handMode && gaze && Math.hypot(gaze.x - sc.anchor[0], gaze.y - sc.anchor[1]) < 280;
  const ink = k >= 3 ? ' inked' : k === 2 ? ' greyed' : '';

  return (
    <LabRoot rm={rm} className={`a3 r3 st-${k} mode-${room.mode}`} captions="tl">
      <InkFilter />
      <div ref={root} className="a3-hit" onPointerMove={onMove} onPointerLeave={() => setGaze(null)} onClick={manualBlink}>
        <div className={`a3-art${ink}`} key={sc.id}>{art}</div>
        <svg className={`art a3-over${ink}`} viewBox="0 0 1920 1080" aria-label={`${sc.label}, creep stage ${k} of ${MAX}`}>{sc.over(k)}</svg>
        <div className="r3-corners" style={{ opacity: 0.1 + k * 0.14 }} />
        {handMode && gaze && <div className={`a3-gaze${watching ? ' on' : ''}`} style={{ left: gaze.x, top: gaze.y }} />}
      </div>
      <RoomEye pose={eyePose(room)} mode={room.mode} watching={!!watching} rm={rm} />
      {rm ? lid && <div className="a3-black" /> : <><div className={`a3-lid top${lid ? ' shut' : ''}`} /><div className={`a3-lid bot${lid ? ' shut' : ''}`} /></>}
      <Line text={sc.line} key={sc.id} className="a3-line" />
      <nav className="a3-nav" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        {SCENES.map((s, i) => <button type="button" key={s.id} className={`lab${i === si ? ' on' : ''}`} onClick={() => setSi(i)}>{s.label} <i>{'●'.repeat(stages[i])}{'○'.repeat(MAX - stages[i])}</i></button>)}
      </nav>
      <p className="hint r3-hint">{handMode ? 'your mouse is your eyes · click = blink' : 'hands off: it moves when the room looks away · space = blink'}</p>
    </LabRoot>
  );
}
