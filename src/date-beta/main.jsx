// date-beta: a thin scene player for the v5 script. Scenes live in scenes.json; engine.js sequences them.
// Controls: click / Space / Enter / -> = next, 1 / 2 = pick a choice, Esc or S = skip scene, F = fullscreen.
// URL: ?scene=<id> starts there (&beat=<n> steps n beats in), ?still forces reduced motion (same as prefers-reduced-motion).
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import './theme.js';
import data from './scenes.json';
import { loadScenes, start, next, skip, choose, beatAt, canAdvance, canChoose } from './engine.js';
import { ART } from './art/index.js';
import { Say, Choices } from './Say.jsx';
import manifest from './assets.json';
import { createLoader } from './assets.js';
import './beta.css';

const params = new URLSearchParams(location.search);
const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENES = loadScenes(data);
export const W = 1920, H = 1080;

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
  const since = useRef(0);
  const k = useFit();
  const scene = SCENES[pos.s], beat = beatAt(SCENES, pos);

  useEffect(() => {
    since.current = performance.now();
    cue(beat.sfx);
    document.documentElement.dataset.beat = `${beat.scene}:${beat.index}`;
    if (beat.auto == null || pos.done) return undefined;
    const t = setTimeout(() => setPos((p) => next(SCENES, p, RM)), beat.auto);
    return () => clearTimeout(t);
  }, [pos, beat]);

  const advance = useCallback((button = false) => {
    if (pos.done) { setPos(start(SCENES, { rm: RM })); return; }
    if (!canAdvance(beat, performance.now() - since.current, { button })) return;
    setPos((p) => next(SCENES, p, RM));
  }, [pos, beat]);
  const pick = useCallback((i) => {
    if (pos.done || !canChoose(beat, performance.now() - since.current)) return;
    setPos((p) => choose(SCENES, p, i, RM));
  }, [pos, beat]);
  const skipScene = useCallback(() => setPos((p) => (p.done ? start(SCENES, { rm: RM }) : skip(SCENES, p, RM))), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape' || e.key === 's' || e.key === 'S') { e.preventDefault(); skipScene(); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); advance(true); }
      else if (e.key === 'f' || e.key === 'F') toggleFull();
      else if (/^[1-9]$/.test(e.key)) pick(+e.key - 1);
    };
    const onFull = () => setFull(!!document.fullscreenElement);
    addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFull);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFull); };
  }, [advance, pick, skipScene]);

  const Art = ART[beat.bg];
  const stop = (f) => (e) => { e.stopPropagation(); f(); };
  const waiting = beat.wait === 'click' && !pos.done;
  return (
    <div className={`viewport${RM ? ' rm' : ''}`} onClick={() => advance(false)}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={scene.id} data-scare={beat.scare}>
        <div key={scene.id} className={`scene enter-${scene.enter}`}>
          {!pos.done && <Art props={beat.props} rm={RM} onStart={() => advance(true)} />}
        </div>
        {beat.text && !pos.done && <Say line={beat.line} next={waiting} key={`${beat.scene}${beat.index}`} />}
        {beat.choices && !pos.done && <Choices choices={beat.choices} onPick={pick} key={`c${beat.scene}${beat.index}`} />}
        {waiting && !beat.text && <div className="nexthint" aria-hidden="true">click ▸</div>}
      </div>
      <div className="chrome">
        {canFull && <button type="button" onClick={stop(toggleFull)} title="Fullscreen (F)">{full ? '✕ exit full' : '⛶ fullscreen'}</button>}
        <button type="button" onClick={stop(skipScene)} title="Skip scene (Esc or S)">skip ▸▸</button>
      </div>
      <div className="sr" aria-live="polite">{beat.sfx ? `[sound: ${beat.sfx}]` : ''}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Player />);
