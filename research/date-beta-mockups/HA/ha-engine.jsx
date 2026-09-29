// HA engine proof (R2b fix 5): the REAL date-beta engine (src/date-beta/engine.js + scenes.json + the 5 React art scenes),
// mounted unchanged, with the HA chrome in place of Say.jsx + beta.css. Nothing in src/date-beta is modified.
// URL: ?scene=<id>&beat=<n> jumps (screenshots); ?still = reduced motion; D = dev overlay (off by default).
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import data from '../../../src/date-beta/scenes.json';
import { loadScenes, start, next, skip, beatAt, canAdvance } from '../../../src/date-beta/engine.js';
import { ART } from '../../../src/date-beta/art/index.js';

const params = new URLSearchParams(location.search);
const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENES = loadScenes(data);
const W = 1920, H = 1080;
const KIND = { NANDA: 'nanda', MC: 'mc', CROWD: 'crowd' };

// the engine's "WHO: line" text -> the HA chip (window.UI.dlg = the same builder the mockups use)
function haBox(text) {
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/.exec(text);
  const kind = m ? (KIND[m[1]] || 'nanda') : 'narr';
  return window.UI.dlg({ text: m ? m[2] : text, kind, dock: 'bc', style: { width: 1400 } });
}

function startPos() {
  let p = start(SCENES, { rm: RM, at: params.get('scene') });
  for (let i = 0; i < +(params.get('beat') || 0); i++) p = next(SCENES, p, RM);
  return p;
}

function Player() {
  const [pos, setPos] = useState(startPos);
  const [k, setK] = useState(1);
  const since = useRef(0);
  const scene = SCENES[pos.s], beat = beatAt(SCENES, pos);

  useEffect(() => { const fit = () => setK(Math.min(innerWidth / W, innerHeight / H)); fit(); addEventListener('resize', fit); return () => removeEventListener('resize', fit); }, []);
  useEffect(() => {
    since.current = performance.now();
    document.documentElement.dataset.beat = `${beat.scene}:${beat.index}`;
    if (beat.auto == null || pos.done || params.has('beat')) return undefined;
    const t = setTimeout(() => setPos((p) => next(SCENES, p, RM)), beat.auto);
    return () => clearTimeout(t);
  }, [pos, beat]);

  const advance = useCallback((button = false) => {
    if (pos.done) { setPos(start(SCENES, { rm: RM })); return; }
    if (!canAdvance(beat, performance.now() - since.current, { button })) return;
    setPos((p) => next(SCENES, p, RM));
  }, [pos, beat]);
  const skipScene = useCallback(() => setPos((p) => (p.done ? start(SCENES, { rm: RM }) : skip(SCENES, p, RM))), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape' || e.key === 's' || e.key === 'S') { e.preventDefault(); skipScene(); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); advance(true); }
      else if (e.key === 'd' || e.key === 'D') document.documentElement.classList.toggle('dev');
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [advance, skipScene]);

  const Art = ART[beat.bg];
  // dread for the chrome: the blackout (ADORE ME) is the one dread-2 scene in the 5-scene render test
  const dread = scene.id === 'blackout' ? 2 : 0;
  const chrome = window.UI.chrome({ on: ['cc'] }) + (scene.id === 'splash' ? '' : window.UI.datehud({ dread }));
  return (
    <div className={`viewport${RM ? ' rm' : ''}`} onClick={() => advance(false)}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={scene.id} data-dread={dread}>
        <div key={scene.id} className="scene">{!pos.done && <Art props={beat.props} rm={RM} onStart={() => advance(true)} />}</div>
        {beat.text && !pos.done && <div key={`${beat.scene}${beat.index}`} dangerouslySetInnerHTML={{ __html: haBox(beat.text) }} />}
        {beat.sfx && !pos.done && <div className="cap sfx" style={{ left: 260, bottom: beat.text ? 300 : 80 }}>[{beat.sfx.replace(/-/g, ' ')}]</div>}
        <div className="hachrome" dangerouslySetInnerHTML={{ __html: chrome }} />
        <div className="devonly" style={{ position: 'absolute', left: 20, bottom: 20 }}>DEV · live engine · {beat.scene}:{beat.index} · HA chrome (Say.jsx + beta.css replaced)</div>
      </div>
      <div className="sr" aria-live="polite">{beat.sfx ? `[sound: ${beat.sfx}]` : ''}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Player />);
