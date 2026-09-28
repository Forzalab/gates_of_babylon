// anim-3 · JUNJI ITO CREEP (horror 5). Central theme: "it only moves when you are not looking".
// Uzumaki spirals + Weeping-Angel rules on eight demo-path scenes. Your mouse is your gaze. While you look at the
// scene's anchor nothing moves. Look away for 2.5 s, or blink (click / Space), and the scene takes one step:
// more silhouettes on the railing, the curry river winds into a spiral, every window becomes hers, her door opens
// a notch, the slippers multiply. Changes are hard cuts behind your blink (never a slide); each step holds >= 2.5 s.
// Ito's crosshatch darkens the corners as the scene creeps. ←/→ change scene. ?scene=<id>&stage=<n> for shots.
// Reduced motion: the blink is a hard cut to black (400 ms) instead of lids; everything else is already a cut.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Rooftop from '../../../date-beta/art/Rooftop.jsx';
import Train from '../../../date-beta/art/Train.jsx';
import NaanBoard from '../../../date-beta/art/Naan.jsx';
import Platform from '../../../date-beta/art/Platform.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { LabRoot, Markup, Line, param, toStage } from '../shared/ui.jsx';
import { play } from '../shared/audio.js';
import { ART } from '../shared/art.js';
import './anim3.css';

export const MAX = 4, AWAY_MS = 2500;

// an Archimedean spiral centred at (0,0): turns, outer radius
export function spiral(turns, r, n = 240) {
  let d = '';
  for (let k = 0; k <= n; k++) {
    const t = k / n, a = t * turns * Math.PI * 2, rr = t * r;
    d += `${k ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
  }
  return d;
}
const Spiral = ({ x, y, r, turns = 4, w = 6, cls = '' }) => <path transform={`translate(${x} ${y})`} d={spiral(turns, r)} className={`a3-spiral ${cls}`} style={{ strokeWidth: w }} />;
const sil = (kind, x, y, s) => ART.sil(kind, x, y, s, { slit: true });
const KINDS = ['suit', 'girl', 'hat', 'bun'];

// Each scene: art, anchor (where you must keep looking), a line, and the overlay for a creep stage 0..MAX.
export const SCENES = [
  { id: 'rooftop', label: 'rooftop', anchor: [1140, 430], line: 'Lunch on the roof. The tower keeps your time.',
    art: (rm) => <Rooftop props={{ clock: 'noon' }} rm={rm} />,
    over: (k) => (
      <>
        {Array.from({ length: k * 3 }, (_, i) => <Markup key={i} html={sil(KINDS[i % 4], 620 + i * 110, 952, 0.34)} />)}
        {k >= 2 && <Spiral x={180} y={505} r={60 + k * 25} turns={3 + k} w={5} cls="cloud" />}
        {k >= 3 && <Spiral x={1690} y={200} r={50 + k * 20} turns={2 + k} w={5} cls="cloud" />}
      </>
    ) },
  { id: 'train', label: 'train', anchor: [1050, 290], line: 'Nobody reads the ads. You read this one.',
    art: (rm) => <Train props={{ zoom: false }} rm={rm} />,
    over: (k) => (
      <>
        {Array.from({ length: k * 2 }, (_, i) => <Markup key={i} html={sil(KINDS[(i + 1) % 4], 1330 + i * 120, 960, 0.62)} />)}
        {k >= 1 && <Spiral x={902} y={317} r={18 + k * 8} turns={2 + k} w={3} cls="ink" />}
      </>
    ) },
  { id: 'naan', label: 'naan', anchor: [1640, 500], line: "MC: Technically, that's a NAND gate. Not bread.",
    art: (rm) => <NaanBoard rm={rm} />,
    over: (k) => (k ? (
      <>
        <Spiral x={860} y={640} r={90 + k * 70} turns={2 + k * 1.5} w={10 + k * 2} cls="curry" />
        {k >= 3 && <Spiral x={860} y={640} r={60 + k * 50} turns={3 + k} w={4} cls="cream" />}
      </>
    ) : null) },
  { id: 'platform', label: 'platform', anchor: [1340, 560], line: 'The sign says NEXT: this OR that. It never picks.',
    art: (rm) => <Platform props={{ train: 'gone' }} rm={rm} />,
    over: (k) => (
      <>
        {Array.from({ length: k }, (_, i) => <Markup key={i} html={sil('nanda', 1040 - i * 260, 1040 + i * 40, 0.55 + i * 0.25)} />)}
        {k >= 4 && <Spiral x={960} y={262} r={40} turns={4} w={4} cls="ink" />}
      </>
    ) },
  { id: 'underpass', label: 'underpass', anchor: [960, 700], line: 'Your steps, her steps. Always an even count.',
    art: (rm) => <Underpass rm={rm} />,
    over: (k) => (
      <>
        {[400, 900, 1400, 1760].slice(0, k).map((x, i) => (
          <g key={i}><Spiral x={x} y={400} r={70} turns={5} w={5} cls="eye" /><circle cx={x} cy={400} r="12" className="a3-pupil" /></g>
        ))}
      </>
    ) },
  { id: 'apartment', label: 'her building', anchor: [1290, 300], line: "NANDA: That's mine. I left the light on for you.",
    art: (rm) => <ApartmentExt rm={rm} />,
    over: (k) => {
      const wins = [];
      for (let f = 0; f < 4; f++) for (let u = 0; u < 3; u++) wins.push([520 + 60 + u * 290, 250 + f * 170 + 24]);
      const n = [0, 3, 6, 9, 11][k];
      return wins.filter((w) => !(w[0] === 1160 && w[1] === 274)).slice(0, n).map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="150" height="70" className="a3-lit" />
          <g transform={`translate(${x + 75} ${y + 70}) scale(0.1)`} dangerouslySetInnerHTML={{ __html: sil('nanda', 0, 0, 1) }} />
        </g>
      ));
    } },
  { id: 'stairs', label: 'her door', anchor: [420, 700], line: 'NANDA: Just tea. Then you can go.',
    art: (rm) => <Stairs props={{ door: 'shut' }} rm={rm} />,
    over: (k) => (k ? (
      <g>
        <path d={`M${1580 - k * 26} 180 H1580 V840 H${1580 - k * 26 - 20}Z`} className="a3-gap" />
        {k >= 3 && <ellipse cx={1580 - k * 13} cy="470" rx="9" ry={k >= 4 ? 16 : 5} className="a3-eyegap" />}
      </g>
    ) : null) },
  { id: 'genkan', label: 'genkan', anchor: [1500, 720], line: "Men's slippers. Already set out.",
    art: (rm) => <Genkan props={{ insert: false }} rm={rm} />,
    over: (k) => (
      <>
        {Array.from({ length: [0, 2, 4, 7, 10][k] }, (_, i) => {
          const x = 70 + i * 100, y = 590;
          return <g key={i} transform={`translate(${x} ${y}) scale(.5)`} className="a3-slip"><path d="M0 10 q40 -16 80 0 v100 q0 30 -40 30 q-40 0 -40 -30z" /><path d="M100 10 q40 -16 80 0 v100 q0 30 -40 30 q-40 0 -40 -30z" /></g>;
        })}
        {k >= 4 && <Spiral x={1500} y={700} r={120} turns={6} w={3} cls="ink" />}
      </>
    ) },
];

// crosshatch in the corners, denser with each stage (Ito's ink)
function Hatch({ k }) {
  return (
    <svg className="art a3-hatch" viewBox="0 0 1920 1080" aria-hidden="true" style={{ opacity: 0.12 + k * 0.13 }}>
      <defs>
        <pattern id="a3-h1" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="14" /></pattern>
        <pattern id="a3-h2" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-55)"><line x1="0" y1="0" x2="0" y2="11" /></pattern>
        <radialGradient id="a3-vg" cx="50%" cy="50%" r="75%"><stop offset=".6" stopColor="#000" /><stop offset="1" stopColor="#fff" /></radialGradient>
        <mask id="a3-m"><rect width="1920" height="1080" fill="url(#a3-vg)" /></mask>
      </defs>
      <g mask="url(#a3-m)"><rect width="1920" height="1080" fill="url(#a3-h1)" />{k >= 2 && <rect width="1920" height="1080" fill="url(#a3-h2)" />}</g>
    </svg>
  );
}

const startScene = Math.max(0, SCENES.findIndex((s) => s.id === param('scene')));
const startStage = Math.min(MAX, Math.max(0, parseInt(param('stage') ?? '0', 10) || 0));

export default function Anim3({ rm }) {
  const root = useRef(null);
  const [si, setSi] = useState(startScene);
  const [stages, setStages] = useState(() => SCENES.map((_, i) => (i === startScene ? startStage : 0)));
  const [lid, setLid] = useState(false);
  const [gaze, setGaze] = useState(null);
  const lastLook = useRef(performance.now());
  const lastStep = useRef(performance.now());
  const sc = SCENES[si], k = stages[si];

  const step = useCallback((why) => {
    setStages((st) => st.map((v, i) => (i === si ? Math.min(MAX, v + 1) : v)));
    lastStep.current = performance.now();
    if (why === 'away') play('creak');
  }, [si]);

  const blink = useCallback(() => {
    if (lid) return;
    play('lid');
    setLid(true);
    setTimeout(() => { if (stages[si] < MAX) step('blink'); }, 180); // the change lands while your eyes are shut
    setTimeout(() => setLid(false), rm ? 400 : 420);
  }, [lid, rm, si, stages, step]);

  // look-away clock: if the gaze is off the anchor for AWAY_MS, the scene creeps one step
  useEffect(() => {
    if (param('pause') !== null) return undefined;
    const id = setInterval(() => {
      const now = performance.now();
      if (stages[si] >= MAX) return;
      if (now - lastLook.current > AWAY_MS && now - lastStep.current > AWAY_MS) step('away');
    }, 250);
    return () => clearInterval(id);
  }, [si, stages, step]);

  const onMove = (e) => {
    const p = toStage(e, root.current);
    setGaze(p);
    if (Math.hypot(p.x - sc.anchor[0], p.y - sc.anchor[1]) < 280) lastLook.current = performance.now();
  };
  useEffect(() => {
    lastLook.current = performance.now(); lastStep.current = performance.now();
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowRight') setSi((i) => (i + 1) % SCENES.length);
      else if (e.key === 'ArrowLeft') setSi((i) => (i + SCENES.length - 1) % SCENES.length);
      else if (e.key === ' ') { e.preventDefault(); blink(); }
      else if (e.key === 'r' || e.key === 'R') setStages((st) => st.map((v, i) => (i === si ? 0 : v)));
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [si, blink]);

  const art = useMemo(() => sc.art(rm), [sc, rm]);
  const watching = gaze && Math.hypot(gaze.x - sc.anchor[0], gaze.y - sc.anchor[1]) < 280;

  return (
    <LabRoot rm={rm} className={`a3 st-${k}`} captions="tl">
      <div ref={root} className="a3-hit" onPointerMove={onMove} onPointerLeave={() => setGaze(null)} onClick={blink}>
        <div className="a3-art" key={sc.id}>{art}</div>
        <svg className="art a3-over" viewBox="0 0 1920 1080" aria-label={`${sc.label}, creep stage ${k} of ${MAX}`}>{sc.over(k)}</svg>
        <Hatch k={k} />
        {gaze && <div className={`a3-gaze${watching ? ' on' : ''}`} style={{ left: gaze.x, top: gaze.y }} />}
      </div>
      {rm ? lid && <div className="a3-black" /> : <><div className={`a3-lid top${lid ? ' shut' : ''}`} /><div className={`a3-lid bot${lid ? ' shut' : ''}`} /></>}
      <Line text={sc.line} key={sc.id} className="a3-line" />
      <nav className="a3-nav" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        {SCENES.map((s, i) => <button type="button" key={s.id} className={`lab${i === si ? ' on' : ''}`} onClick={() => setSi(i)}>{s.label} <i>{'●'.repeat(stages[i])}{'○'.repeat(MAX - stages[i])}</i></button>)}
      </nav>
      <p className="hint a3-hint">your mouse is your eyes · look away and it moves · click = blink</p>
    </LabRoot>
  );
}
