// date-beta: a thin scene player for the v5 script. Scenes live in scenes.json; engine.js sequences them.
// Controls: click / Space / Enter / -> = next, 1 / 2 = pick a choice, Esc or S = skip scene, F = fullscreen, P = pause.
// A choice beat with `timer` counts down (frozen while paused or the tab is hidden) and auto-picks at 0.
// URL: ?scene=<id> starts there (&beat=<n> steps n beats in), ?still forces reduced motion (same as prefers-reduced-motion).
// Gacha (gacha.js): ?seed=N, ?gacha=<tier id> forces a tier, ?pick=N takes choice N on the start beat, ?layers=a,b
// overrides her face layers on a gacha pop (FX / face-layer shots).
// HUD (Hud.jsx): love ribbon + route trail while Nanda is present, a pop after a scored pick, the goal card, the end card.
// NEXT pill on every click beat once its hold has passed; "Click anywhere to continue" big on the goal card (the first
// screen after the Figur collapse), then small in the bottom-left corner; hidden where a click does nothing.
// Focus: while a line, choice or card is up the art behind it blurs + dims (art-only beats stay sharp).
// Secret: ~ (Shift+Backquote) or ?debug opens the branch map (Tree.jsx). While it is open the timer and auto beats freeze
// and game keys are swallowed. Only the map ever reads its saved picks; a normal boot starts fresh.
import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './theme.js';
import baseData from './scenes.json';
import { applyPacks } from './packs/index.js';
import { loadScenes, start, startAt, next, skip, choose, jumpTo, beatAt, beatView, reactView, present, trail, ending, canAdvance, canChoose, enabled, timeoutPick, tick, isAssetId } from './engine.js';
import { nextRunLuck, tierById } from './gacha.js';
import { ART as ART0 } from './art/index.js';
import { GAME } from './game/index.js';
const ART = { ...ART0, ...GAME }; // game art ids (lock-game) own their beat: choices hidden, onPick(i) plays choice i
import { BG_FALLBACK } from './art/fallbacks.js';
import { Say, Choices } from './Say.jsx';
import { Tree } from './Tree.jsx';
import { createVoice } from './voice/index.js';
import { Nanda, speaksNanda, FRAMES } from './Nanda.jsx';
import { Handout, SmileTag, PovFood, PeekBento, useStep } from './SceneA.jsx';
import { Fx } from './Fx.jsx';
import { EmotionFx } from './art/emotion/EmotionFx.jsx';
import { setCrowd, bumpRun, runBucket, getRun, fill } from './meta.js';
import { cardFor, failLine } from './endcard.js';
import crowd from './packs/crowd.json';
import { Hud, HudDefs, GoalCard, EndCard, NextButton } from './Hud.jsx';
import { createSession, bootDebug } from './debug.js';
import manifest from './assets.json';
import { createLoader } from './assets.js';
import './beta.css';
import './fx.css';

const params = new URLSearchParams(location.search);
const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
// ?pack=a,b previews src/date-beta/packs/<name>.json on top of scenes.json (validation stays on).
const PACK_FILES = import.meta.glob(['./packs/*.json', '!./packs/crowd.json'], { eager: true, import: 'default' });
const packOf = (n) => {
  const p = PACK_FILES[`./packs/${n}.json`];
  if (!p) throw new Error(`date-beta: no pack "${n}"`);
  return { name: n, ...p };
};
setCrowd(crowd);
// Normal play: the sprint packs in fixed order. ?pack=a,b replaces the list (preview).
const PLAY = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences', 'variant-v2', 'r3-station', 'r3-rain', 'scene-a', 'interiors', 'curry', 'love', 'gacha'].filter((n) => PACK_FILES[`./packs/${n}.json`]);
const data = applyPacks(baseData, (params.has('pack') ? params.get('pack').split(',').filter(Boolean) : PLAY).map(packOf));
const SCENES = loadScenes(data, { manifest, art: Object.keys(ART) });
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
// The focus blur costs a full-stage filter. A projector laptop that can't hold ~40 fps gets dim + vignette only.
function probeFrames() {
  let n = 0, t0 = 0;
  const step = (t) => {
    if (!n) t0 = t;
    if (++n < 31) requestAnimationFrame(step);
    else if ((t - t0) / 30 > 24) document.documentElement.dataset.lowfx = '';
  };
  setTimeout(() => requestAnimationFrame(step), 1500);
}
if (!RM) probeFrames();
// Voice: Nanda's recorded lines (voice/), one at a time; silent where a line has no file. M = mute.
const VOICE = createVoice(import.meta.env.BASE_URL);
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

const LOVE0 = params.has('love') && Number.isFinite(Number(params.get('love'))) ? Number(params.get('love')) : null; // ?love=N (testing)
// Gacha luck (gacha.js): ?seed=N replays a seed, else a new seed per boot; ?gacha=<tier id> forces that tier (shots / testing).
const SEED = params.has('seed') && Number.isInteger(Number(params.get('seed'))) ? Number(params.get('seed')) : (Math.random() * 2 ** 31) >>> 0;
const FORCE = tierById(SCENES.gacha, params.get('gacha')) ? params.get('gacha') : null; // an unknown id is ignored, never a boot crash
// ?pick=N (testing / shots): take choice N (1-based) on the start beat, so a URL can open straight on a reaction frame.
const PICK = Number(params.get('pick')) - 1;
const LAYERS = params.has('layers') ? params.get('layers').split(',').filter(Boolean) : null; // ?layers=vein,puff: override her face layers on a gacha pop (shots)
const startPos = () => {
  const p = startAt(SCENES, { rm: RM, at: params.get('scene'), beat: params.get('beat'), love: LOVE0, seed: SEED, force: FORCE });
  return PICK >= 0 && !p.done && beatAt(SCENES, p).choices?.[PICK] ? choose(SCENES, p, PICK, RM) : p;
};

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
  const stageRef = useRef(null);
  const [ready, setReady] = useState(false); // the beat's hold has passed (NEXT shows)
  // On a reaction frame the scene is the pick's scene, even when the pick already jumped on.
  const scene = SCENES[pos.react ? pos.react.s : pos.s];
  // The beat as this run sees it: the reaction frame, else the beat with `vary` overlays (bento echo) applied.
  // Memoized on pos so effects don't re-fire.
  const beat = useMemo(() => reactView(SCENES, pos) ?? beatView(beatAt(SCENES, pos), { ...pos.flags, run: runBucket() }), [pos]);
  const here = !pos.done && present(scene, beat);
  const pop = pos.react ?? (here && pos.pending ? pos.pending : null);
  const end = ending(SCENES, pos);
  const card = !pos.done && beat.card === 'goal';
  // Scene A camera + chrome (props.cut, SCENES.md): frame, face (face2 after the step), a two-step line (lead / at),
  // sharp (no focus blur), handout (bento = the choices), tag (the one choice drawn as the NEXT pill).
  const cut = beat.props?.cut ?? {};
  // A reaction frame on the handout keeps her medium shot (the box is gone); every other frame holds through its react.
  const frame = !FRAMES.includes(cut.frame) || (beat.react && cut.frame === 'handout') ? 'medium' : cut.frame;
  const lead = !beat.react && cut.lead ? cut.lead : null;
  const splitAt = !beat.react && cut.at ? cut.at : null;
  const stepped = useStep(lead || splitAt ? Math.max(500, cut.step ?? 600) : 0, pos);
  const face = beat.react ? null : (stepped && cut.face2) || cut.face || null;
  const tag = !!(cut.tag && beat.choices?.length === 1 && !beat.react);
  const handout = !!(cut.handout && beat.choices && !beat.react);

  // Meta loop (meta.js): each arrival at the first scene (boot or a loop back) is a new run; `run` feeds vary/if.
  const atFirst = !pos.done && pos.s === 0;
  useEffect(() => { if (atFirst) bumpRun(); }, [atFirst]);
  useEffect(() => {
    since.current = performance.now();
    cue(beat.sfx);
    document.documentElement.dataset.beat = `${beat.scene}:${beat.index}`;
    setLeft(beat.timer && !pos.done ? beat.timer : null);
    setReady(false);
    const t = setTimeout(() => setReady(true), beat.hold ?? 0);
    return () => clearTimeout(t);
  }, [pos, beat]);
  // Voice: each new beat (or reaction frame) stops the last line and plays its own, if recorded.
  const [vmuted, setVmuted] = useState(VOICE.muted);
  useEffect(() => VOICE.subscribe(setVmuted), []);
  useEffect(() => {
    if (pos.done || end) VOICE.stop();
    else if (lead) VOICE.show(beat.scene, lead, beat.line?.plain);
    else VOICE.show(beat.scene, beat.line?.plain);
  }, [pos, beat, end, lead]);
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

  const pick = useCallback((i) => {
    if (pos.done || paused || !canChoose(beat, performance.now() - since.current)) return;
    setPos((p) => choose(SCENES, p, i, RM));
  }, [pos, beat, paused]);
  const advance = useCallback((button = false) => {
    if (pos.done) { setPos(start(SCENES, { rm: RM, luck: nextRunLuck(pos.luck) })); return; }
    if (paused) return;
    if (end) { if (button) pick(0); return; } // the end card: its button / Space / Enter = play again (choice 0)
    if (tag) { pick(0); return; } // the smile tag stands where NEXT does: a click / Space / Enter takes it
    if (!canAdvance(beat, performance.now() - since.current, { button })) return;
    setPos((p) => next(SCENES, p, RM));
  }, [pos, beat, paused, end, pick, tag]);
  const skipScene = useCallback(() => setPos((p) => skip(SCENES, p, RM)), []); // skip() on a done run = a new run (keeps the luck going)

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Backquote' && e.shiftKey) { e.preventDefault(); if (!e.repeat) setTree((v) => !v); return; }
      if (treeRef.current) return; // the map owns the keyboard (its own handler does Esc + Tab)
      if (e.repeat) return;
      if (e.key === 'Escape' && escIsForFullscreen()) return; // Esc leaving fullscreen is not a skip (demo: no chain-skip)
      if (e.key === 'Escape' || e.key === 's' || e.key === 'S') { e.preventDefault(); skipScene(); }
      else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); advance(true); }
      else if (e.key === 'f' || e.key === 'F') toggleFull();
      else if (e.key === 'p' || e.key === 'P') setPaused((v) => !v);
      else if (e.key === 'm' || e.key === 'M') VOICE.setMuted(!VOICE.muted);
      else if (/^[1-9]$/.test(e.key)) pick(+e.key - 1);
    };
    const onFull = () => setFull(!!document.fullscreenElement);
    addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFull);
    return () => { removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFull); };
  }, [advance, pick, skipScene]);

  // bg / sprite: a manifest id draws the asset image (grey placeholder if missing); a name draws the art component.
  // A loaded file always wins; a missing one draws its registered fallback art (art/fallbacks.js), else the grey box.
  // A props.shot beat frames the beat's own bg: it goes in as props.home (art/shots/index.js), used when the shot has no `of`.
  const layer = (v, cls, props = beat.props) => {
    const name = isAssetId(v) ? (ASSETS.has(v) ? null : BG_FALLBACK[v]) : v;
    if (!name) return <img className={cls} src={ASSETS.src(v)} alt="" />;
    const Art = ART[name];
    return <Art props={props} rm={RM} onStart={() => advance(true)} onPick={(i) => setPos((p) => (p.done ? p : choose(SCENES, p, i, RM)))} />;
  };
  const stop = (f) => (e) => { e.stopPropagation(); f(); };
  const waiting = beat.wait === 'click' && !pos.done;
  const onNext = waiting && ready && !card && !paused ? () => advance(true) : null;
  const focus = !pos.done && !GAME[beat.bg] && !cut.sharp && !!(beat.text || beat.choices || card || end);
  const hint = waiting && !paused; // only where a click does something (never on choice or auto beats)
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
      <HudDefs />
      <div ref={stageRef} className={`stage${focus ? ' focus' : ''}${card ? ' is-goal' : ''} frame-${frame}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }}
        data-scene={scene.id} data-scare={beat.scare}>
        <div key={scene.id} className={`scene enter-${scene.enter}`}>
          {!pos.done && (ART[beat.props?.shot] /* props.shot = art/shots id over the beat's bg */
            ? layer(beat.props.shot, 'db-bg', { home: isAssetId(beat.bg) ? BG_FALLBACK[beat.bg] : beat.bg, ...beat.props })
            : layer(beat.bg, 'db-bg'))}
          {!pos.done && beat.sprite && layer(beat.sprite, 'db-sprite')}
        </div>
        <div className="db-focus" aria-hidden="true" />
        {pop?.gacha && <EmotionFx gacha={pop.gacha} key={`${pop.s}/${pop.b}`} /> /* gacha tier: still backdrop for the reaction frame */}
        <Fx fx={pos.fx} rm={RM} stageRef={stageRef} />
        {end && <EndCard end={end} line={fill(failLine(end, { seed: pos.luck?.seed ?? SEED, run: getRun() }))} onAgain={() => pick(0)} />}
        {!pos.done && (here || speaksNanda(beat.line)) && (frame !== 'off' || end) && (
          <Nanda scare={beat.scare} raised={!!beat.choices && !end && frame === 'medium' && !tag} emote={end ? (cardFor(end) === 'fail' ? 'crack' : 'hearts') : pop?.emote}
            big={!!(pop || end)} talk={!!(speaksNanda(beat.line) || pop || end || card)} layers={end || !pop?.gacha ? null : LAYERS ?? pop.gacha.face}
            face={end ? null : face} frame={end ? 'medium' : frame} />
        )}
        {!pos.done && !end && frame === 'pov' && <PovFood food={cut.food} />}
        {!pos.done && !end && frame === 'peek' && <PeekBento food={cut.food} />}
        {handout && !pos.done && !end && <Handout choices={beat.choices} map={cut.handout} onPick={pick} on={beat.choices.map((c) => enabled(c, pos.flags))} left={left} total={beat.timer} def={timeoutPick(beat, pos.flags)} hidden={beat.loveHidden} key={`h${beat.scene}${beat.index}`} />}
        {beat.text && !pos.done && !end && <Say line={beat.line} onNext={onNext} lead={lead} at={splitAt} stepped={stepped} key={`${beat.scene}${beat.index}${beat.react ? 'r' : ''}`}
          action={tag ? <SmileTag choice={beat.choices[0]} onPick={pick} /> : null} />}
        {beat.choices && !tag && !handout && !pos.done && !end && !GAME[beat.bg] && <Choices later={!stepped} choices={beat.choices} onPick={pick} on={beat.choices.map((c) => enabled(c, pos.flags))} left={left} total={beat.timer} def={timeoutPick(beat, pos.flags)} hidden={beat.loveHidden} key={`c${beat.scene}${beat.index}`} />}
        {here && <Hud love={pos.love ?? 0} goal={SCENES.love.goal} trail={trail(SCENES, pos)} pop={pop} />}
        {card && <GoalCard onNext={() => advance(true)} />}
        {onNext && !beat.text && <NextButton className="solo" onClick={onNext} />}
        {hint && <div className={`db-hint${card ? ' big' : ''}`}>Click anywhere to continue</div>}
        {paused && <div className="db-paused" role="status">paused (P)</div>}
      </div>
      <div className="chrome">
        {/* The way back to Logic mode. The only way in is the Figur wordmark there (src/collapse.js). */}
        <a href={import.meta.env.BASE_URL} onClick={(e) => e.stopPropagation()} title="Back to Logic mode">◂ LOGIC</a>
        {canFull && <button type="button" onClick={stop(toggleFull)} title="Fullscreen (F)">{full ? '✕ exit full' : '⛶ fullscreen'}</button>}
        <button type="button" onClick={stop(() => VOICE.setMuted(!vmuted))} title="Voice on/off (M)" aria-pressed={vmuted}>{vmuted ? '🔇 voice off' : '🔊 voice'}</button>
        <button type="button" onClick={stop(skipScene)} title="Skip scene (Esc or S)">skip ▸▸</button>
      </div>
      {tree && <Tree scenes={SCENES} decl={data.flags ?? {}} sess={DEBUG} k={k} here={scene.id} onJump={jump} onClose={closeTree} />}
      <div className="sr" aria-live="polite">{beat.sfx ? `[sound: ${beat.sfx}]` : ''}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Player />);
