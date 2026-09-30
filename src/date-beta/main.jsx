// date-beta: a thin scene player for the v5 script. Scenes live in scenes.json; engine.js sequences them.
// Controls: click / Space / Enter / -> = next, 1 / 2 = pick a choice, Esc or S = skip scene, F = fullscreen, P = pause.
// A choice beat with `timer` counts down (frozen while paused or the tab is hidden) and auto-picks at 0.
// URL: ?scene=<id> starts there (&beat=<n> steps n beats in), ?still forces reduced motion (same as prefers-reduced-motion),
// ?love=<n> starts with that score (testing the end cards), ?noblur drops the focus blur (dim + vignette stay).
// Love HUD (Hud.jsx, SPEC research/date-beta-mockups/hud/SPEC.txt): the ribbon shows in scenes where she is present; a scored
// pick plays a reaction frame (pos.react); the goal card sits on rooftop beat 0; an `end` beat shows the result card.
// Secret: ~ (Shift+Backquote) or ?debug opens the branch map (Tree.jsx). While it is open the timer and auto beats freeze
// and game keys are swallowed. Only the map ever reads its saved picks; a normal boot starts fresh.
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './theme.js';
import data from './scenes.json';
import { loadScenes, start, startAt, next, skip, choose, jumpTo, beatAt, beatView, canAdvance, canChoose, enabled, timeoutPick, tick, isAssetId,
  reactView, present, ending, trail } from './engine.js';
import { ART } from './art/index.js';
import { BG_FALLBACK } from './art/fallbacks.js';
import { Say, Choices, NextPill } from './Say.jsx';
import { Hud, Pop, GoalCard, EndCard, HudDefs, ClickHint } from './Hud.jsx';
import { Tree } from './Tree.jsx';
import { Nanda, speaksNanda } from './Nanda.jsx';
import { createSession, bootDebug } from './debug.js';
import manifest from './assets.json';
import { createLoader } from './assets.js';
import './beta.css';

const params = new URLSearchParams(location.search);
const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCENES = loadScenes(data, { manifest, art: Object.keys(ART) });
const GOAL = SCENES.love.goal;
const LOVE0 = Number.isFinite(parseInt(params.get('love'), 10)) ? parseInt(params.get('love'), 10) : null;
// Her face on the result card: full = hearts, near = heart, low = the reveal's cracked heart.
const END_EMOTE = { win: 'hearts', almost: 'heart', low: 'crack' };
export const W = 1920, H = 1080;
const DEBUG = createSession(() => localStorage, SCENES, data.flags ?? {});

// Sound: cue name -> asset id via assets.json (beep if the file is missing). Also exposed for tests + read as a caption.
const ASSETS = createLoader(manifest, import.meta.env.BASE_URL);
ASSETS.preload();
// The Figur click in Logic already counted as a gesture for this origin, so the browser may let sound start now
// (Chrome carries same-origin activation across the navigation). Probe for that; if allowed, unlock without waiting for
// a second click, once the first sound file (rooftop wind) has arrived, so the first beat's sfx plays on arrival.
// Otherwise the loader's own first-gesture unlock stays in charge.
function earlyAudio() {
  let probe;
  try { probe = new (globalThis.AudioContext || globalThis.webkitAudioContext)(); } catch { return; }
  const ok = probe.state === 'running';
  probe.close?.().catch(() => {});
  document.documentElement.dataset.audio = ok ? 'carried' : 'wait-gesture';
  if (!ok) return;
  const first = manifest.assets[manifest.cues[data.scenes[0].beats[0].sfx]]?.path;
  const t0 = performance.now();
  const wait = () => {
    const got = !first || performance.getEntriesByType('resource').some((r) => r.name.endsWith(first) && r.responseEnd > 0);
    if (got || performance.now() - t0 > 3000) setTimeout(() => ASSETS.unlock(), 50); else setTimeout(wait, 50);
  };
  wait();
}
earlyAudio();
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

// Esc while fullscreen (API or F11 / kiosk, where the window fills the screen), or just after leaving it, belongs to the
// browser. S still skips there.
let fullAt = 0;
if (typeof document !== 'undefined') document.addEventListener('fullscreenchange', () => { fullAt = performance.now(); });
const escIsForFullscreen = () => !!document.fullscreenElement || performance.now() - fullAt < 800
  || (innerHeight >= screen.height - 1 && innerWidth >= screen.width - 1);

const startPos = () => startAt(SCENES, { rm: RM, at: params.get('scene'), beat: params.get('beat'), love: LOVE0 });
// The real first screen (the Figur collapse lands here), not a ?scene= deep link: the big "Click anywhere" hint shows on it.
const ONBOARD = !params.get('scene');

function Player() {
  const [pos, setPos] = useState(startPos);
  const [boot] = useState(pos); // until the first move the big onboarding hint shows (ONBOARD only)
  const [full, setFull] = useState(false);
  const [paused, setPaused] = useState(false);
  const [left, setLeft] = useState(null); // timer seconds left on this beat, null = no timer
  const [tree, setTree] = useState(() => bootDebug(params, DEBUG));
  const treeRef = useRef(tree);
  treeRef.current = tree;
  const frozen = paused || tree;
  const since = useRef(0);
  const k = useFit();
  const posRef = useRef(pos);
  posRef.current = pos;
  // The beat as this run sees it: `vary` overlays (bento echo) applied; on a reaction frame, the pick's beat with her
  // reply (engine reactView). Memoized on pos so effects don't re-fire.
  const beat = useMemo(() => (pos.react ? reactView(SCENES, pos) : beatView(beatAt(SCENES, pos), pos.flags)), [pos]);
  const scene = SCENES[pos.react ? pos.react.s : pos.s];
  const [ready, setReady] = useState(false); // the beat's hold has passed: NEXT / card buttons cut in

  useEffect(() => {
    since.current = performance.now();
    cue(beat.sfx);
    document.documentElement.dataset.beat = `${beat.scene}:${beat.index}${pos.react ? ':react' : ''}`;
    setLeft(beat.timer && !pos.done ? beat.timer : null);
    setReady(false);
    const t = setTimeout(() => setReady(true), beat.hold);
    return () => clearTimeout(t);
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
      if (e.key === 'Escape' && escIsForFullscreen()) return; // Esc leaving fullscreen is not a skip (demo: no chain-skip)
      if ((e.key === ' ' || e.key === 'Enter') && e.target?.closest?.('button')) return; // a focused button (NEXT) clicks itself
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
  // A loaded file always wins; a missing one draws its registered fallback art (art/fallbacks.js), else the grey box.
  const layer = (v, cls) => {
    const name = isAssetId(v) ? (ASSETS.has(v) ? null : BG_FALLBACK[v]) : v;
    if (!name) return <img className={cls} src={ASSETS.src(v)} alt="" />;
    const Art = ART[name];
    return <Art props={beat.props} rm={RM} onStart={() => advance(true)} />;
  };
  const stop = (f) => (e) => { e.stopPropagation(); f(); };
  const waiting = beat.wait === 'click' && !pos.done;
  const closeTree = useCallback(() => setTree(false), []);
  const jump = useCallback((edge, choices) => {
    ASSETS.unlock();
    const { warn, ...p } = jumpTo(SCENES, edge, choices, RM, posRef.current.love);
    if (warn) console.warn(`date-beta debug: ${warn}`);
    setPaused(false);
    setPos(p);
    setTree(false);
  }, []);
  // What is on screen. here = she is present (the ribbon + her sprite); pop = a reaction, or a pick made while she was away
  // that waits for her; end = the result card on an ending's title beat; card = the goal card.
  const live = !pos.done;
  const here = live && present(scene, beat);
  const end = live ? ending(SCENES, pos) : null;
  const pop = live ? (pos.react ?? (here && pos.pending ? pos.pending : null)) : null;
  const card = live && beat.card === 'goal';
  const say = live && !!beat.text && !end;
  const emote = end ? END_EMOTE[end.tier] : pop ? pop.emote : card ? 'heart' : null;
  // Focus: the art steps back whenever a chip, pop, card or overlay is up (scare-scaled; cards and overlays = "modal").
  const focus = end || card || paused || tree ? 'modal' : say || pop || (live && beat.choices) ? String(beat.scare ?? 0) : undefined;
  return (
    <div className={`viewport${RM ? ' rm' : ''}${params.has('noblur') ? ' no-blur' : ''}`} onClick={() => advance(false)}>
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={scene.id} data-scare={beat.scare}>
        <HudDefs />
        <div key={scene.id} className={`scene enter-${scene.enter}`} data-focus={focus}>
          {live && layer(beat.bg, 'db-bg')}
          {live && beat.sprite && layer(beat.sprite, 'db-sprite')}
        </div>
        <div className="db-vignette" data-focus={focus} aria-hidden="true" />
        {end && <div className="hud-scrim" aria-hidden="true" />}
        {live && (here || speaksNanda(beat.line)) && (
          <Nanda scare={beat.scare} raised={!!beat.choices && !end} emote={emote} big={!!(end || pop)} talk={!!emote || speaksNanda(beat.line)} />
        )}
        {say && <Say line={beat.line} next={waiting && ready && !card} onNext={() => advance(true)} key={`${beat.scene}${beat.index}${pos.react ? 'r' : ''}`} />}
        {beat.choices && live && !end && <Choices choices={beat.choices} onPick={pick} on={beat.choices.map((c) => enabled(c, pos.flags))} left={left} key={`c${beat.scene}${beat.index}`} />}
        {here && <Hud love={pos.love} goal={GOAL} react={pop} trail={trail(SCENES, pos)} ring={card} />}
        {here && pop && <Pop react={pop} goal={GOAL} key={`p${beat.scene}${beat.index}`} />}
        {card && <GoalCard ready={ready} onNext={() => advance(true)} />}
        {end && <EndCard end={end} ready={ready} onAgain={() => pick(0)} />}
        {paused && <div className="db-paused" role="status">paused (P)</div>}
        {waiting && !say && !card && ready && <NextPill className="solo" onClick={() => advance(true)} />}
        {waiting && !paused && <ClickHint big={ONBOARD && pos === boot} key={ONBOARD && pos === boot ? 'big' : 'small'} />}
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
