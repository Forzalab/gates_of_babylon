// date-beta: a thin scene player for the v5 script. Scenes live in scenes.json; engine.js sequences them.
// Controls: click / Space / Enter / -> = next, 1 / 2 = pick a choice, Esc or S = skip scene, F = fullscreen, P = pause.
// A choice beat with `timer` counts down (frozen while paused or the tab is hidden) and auto-picks at 0.
// URL: ?scene=<id> starts there (&beat=<n> steps n beats in), ?still forces reduced motion (same as prefers-reduced-motion).
// Secret: ~ (Shift+Backquote) or ?debug opens the branch map (Tree.jsx). While it is open the timer and auto beats freeze
// and game keys are swallowed. Only the map ever reads its saved picks; a normal boot starts fresh.
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './theme.js';
import data from './scenes.json';
import { loadScenes, start, next, skip, choose, jumpTo, beatAt, beatView, canAdvance, canChoose, enabled, timeoutPick, tick, isAssetId } from './engine.js';
import { ART } from './art/index.js';
import { Say, Choices } from './Say.jsx';
import { Tree } from './Tree.jsx';
import { createSession, bootDebug } from './debug.js';
import manifest from './assets.json';
import { createLoader } from './assets.js';
import './beta.css';

const params = new URLSearchParams(location.search);
const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENES = loadScenes(data, { manifest, art: Object.keys(ART) });
export const W = 1920, H = 1080;
const DEBUG = createSession(() => localStorage, SCENES, data.flags ?? {});

// Sound: cue name -> asset id via assets.json (beep if the file is missing). Also exposed for tests + read as a caption.
const ASSETS = createLoader(manifest, import.meta.env.BASE_URL);
ASSETS.preload();
function cue(name) { if (name) { document.documentElement.dataset.sfx = name; ASSETS.play(name); } }

function useFit() {
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => setK(Math.min(innerWidth / W, innerHeight / H));
    fit();
    addEventListener('resize', fit);
    document.addEventListener('fullscreenchange', fit);
    return () => { removeEventListener('resize', fit); document.removeEventListener('fullscreenchange', fit); };
  }, []);
  return k;
}

const canFull = typeof document !== 'undefined' && document.fullscreenEnabled;
function toggleFull() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

function startPos() {
  let p = start(SCENES, { rm: RM, at: params.get('scene') });
  for (let i = 0; i < +(params.get('beat') || 0); i++) p = next(SCENES, p, RM);
  return p;
}

function Player() {
  const [pos, setPos] = useState(startPos);
  const [full, setFull] = useState(false);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(null); // timer seconds left on this beat, null = no timer
  const [tree, setTree] = useState(() => bootDebug(params, DEBUG));
  const treeRef = useRef(tree);
  treeRef.current = tree;
  const frozen = paused || tree;
  const since = useRef(0);
  const k = useFit();
  const scene = SCENES[pos.s];
  // The beat as this run sees it: `vary` overlays (bento echo) applied. Memoized on pos so effects don't re-fire.
  const beat = useMemo(() => beatView(beatAt(SCENES, pos), pos.flags), [pos]);

  useEffect(() => {
    since.current = performance.now();
    cue(beat.sfx);
    document.documentElement.dataset.beat = `${beat.scene}:${beat.index}`;
    setLeft(beat.timer && !pos.done ? beat.timer : null);
  }, [pos, beat]);
  // Auto beats wait while the map is open (the full wait restarts when it closes).
  useEffect(() => {
    if (beat.auto == null || pos.done || tree) return undefined;
    const t = setTimeout(() => setPos((p) => next(SCENES, p, RM)), beat.auto);
    return () => clearTimeout(t);
  }, [pos, beat, tree]);

  // Timer: step on real elapsed time; paused or hidden tab = frozen. At 0, pick once (no pick if nothing is enabled).
  const hasTimer = left != null;
  useEffect(() => {
    if (!hasTimer) return undefined;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now(), dt = now - last;
      last = now;
      setLeft((l) => (l == null ? l : tick(l, dt, frozen || document.hidden)));
    }, 100);
    return () => clearInterval(id);
  }, [hasTimer, frozen]);
  useEffect(() => {
    if (left !== 0 || pos.done) return;
    setLeft(null);
    const i = timeoutPick(beat, pos.flags);
    if (i >= 0) setPos((p) => choose(SCENES, p, i, RM));
  }, [left, pos, beat]);

  const advance = useCallback((button = false) => {
    if (pos.done) { setPos(start(SCENES, { rm: RM })); return; }
    if (paused) return;
    if (!canAdvance(beat, performance.now() - since.current, { button })) return;
    setPos((p) => next(SCENES, p, RM));
  }, [pos, beat, paused]);
  const pick = useCallback((i) => {
    if (pos.done || paused || !canChoose(beat, performance.now() - since.current)) return;
    setPos((p) => choose(SCENES, p, i, RM));
  }, [pos, beat, paused]);
  const skipScene = useCallback(() => setPos((p) => (p.done ? start(SCENES, { rm: RM }) : skip(SCENES, p, RM))), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Backquote' && e.shiftKey) { e.preventDefault(); if (!e.repeat) setTree((v) => !v); return; }
      if (treeRef.current) return; // the map owns the keyboard (its own handler does Esc + Tab)
      if (e.repeat) return;
      if (e.key === 'Escape' || e.key === 's' || e.key === 'S') { e.preventDefault(); skipScene(); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); advance(true); }
      else if (e.key === 'f' || e.key === 'F') toggleFull();
      else if (e.key === 'p' || e.key === 'P') setPaused((v) => !v);
      else if (/^[1-9]$/.test(e.key)) pick(+e.key - 1);
    };
    const onFull = () => setFull(!!document.fullscreenElement);
    addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFull);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFull); };
  }, [advance, pick, skipScene]);

  // bg / sprite: a manifest id draws the asset image (grey placeholder if missing); a name draws the art component.
  const layer = (v, cls) => (isAssetId(v) ? <img className={cls} src={ASSETS.src(v)} alt="" />
    : (() => { const Art = ART[v]; return <Art props={beat.props} rm={RM} onStart={() => advance(true)} />; })());
  const stop = (f) => (e) => { e.stopPropagation(); f(); };
  const waiting = beat.wait === 'click' && !pos.done;
  const closeTree = useCallback(() => setTree(false), []);
  const jump = useCallback((edge, choices) => {
    ASSETS.unlock();
    const { warn, ...p } = jumpTo(SCENES, edge, choices, RM);
    if (warn) console.warn(`date-beta debug: ${warn}`);
    setPaused(false);
    setPos(p);
    setTree(false);
  }, []);
  return (
    <div className={`viewport${RM ? ' rm' : ''}`} onClick={() => advance(false)}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={scene.id} data-scare={beat.scare}>
        <div key={scene.id} className={`scene enter-${scene.enter}`}>
          {!pos.done && layer(beat.bg, 'db-bg')}
          {!pos.done && beat.sprite && layer(beat.sprite, 'db-sprite')}
        </div>
        {beat.text && !pos.done && <Say line={beat.line} next={waiting} key={`${beat.scene}${beat.index}`} />}
        {beat.choices && !pos.done && <Choices choices={beat.choices} onPick={pick} on={beat.choices.map((c) => enabled(c, pos.flags))} left={left} key={`c${beat.scene}${beat.index}`} />}
        {paused && <div className="db-paused" role="status">paused (P)</div>}
        {waiting && !beat.text && <div className="nexthint" aria-hidden="true">click ▸</div>}
      </div>
      <div className="chrome">
        {/* The way back to Logic mode. The only way in is the Figur wordmark there (src/collapse.js). */}
        <a href={import.meta.env.BASE_URL} onClick={(e) => e.stopPropagation()} title="Back to Logic mode">◂ LOGIC</a>
        {canFull && <button type="button" onClick={stop(toggleFull)} title="Fullscreen (F)">{full ? '✕ exit full' : '⛶ fullscreen'}</button>}
        <button type="button" onClick={stop(skipScene)} title="Skip scene (Esc or S)">skip ▸▸</button>
      </div>
      {tree && <Tree scenes={SCENES} decl={data.flags ?? {}} sess={DEBUG} k={k} here={scene.id} onJump={jump} onClose={closeTree} />}
      <div className="sr" aria-live="polite">{beat.sfx ? `[sound: ${beat.sfx}]` : ''}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Player />);
