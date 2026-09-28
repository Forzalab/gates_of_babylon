// Builder B shared React pieces: the stage root (unlocks sound on the first click, stops it on unmount),
// the sound chrome (visible mute toggle + a caption for every sound), the dialogue line (OR rule + breath),
// a markup helper for the ported SVG sprite, and the clock (rAF, ?t=<s> seek, ?pause freeze for screenshots).
import { useEffect, useRef, useState, useCallback } from 'react';
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import { Ors } from '../../../date-beta/Say.jsx';
import { unlock, onState, onCaption, soundState, setMuted, isMuted, stopAll, play, bed } from './audio.js';
import '../../../date-beta/art/art.css'; // main's scene text styles + the train/genkan camera classes
import './b.css';

const Q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
export const SEEK = Q.has('t') ? Math.max(0, parseFloat(Q.get('t')) * 1000 || 0) : 0;
export const PAUSE = Q.has('pause');
export const param = (k) => Q.get(k);

// ---------- root ----------
export function LabRoot({ rm, className = '', children, onPointerDown, captions = 'tl', chrome = true, ...rest }) {
  useEffect(() => () => stopAll(), []);
  return (
    <div className={`lb${rm ? ' lb-rm' : ''} ${className}`} {...rest}
      onPointerDown={(e) => { unlock(); onPointerDown?.(e); }}>
      {children}
      {chrome && <SoundChrome where={captions} />}
    </div>
  );
}

// ---------- sound chrome ----------
export function SoundChrome({ where = 'tl' }) {
  const [st, setSt] = useState(soundState);
  const [caps, setCaps] = useState([]);
  useEffect(() => onState(setSt), []);
  useEffect(() => onCaption((c) => {
    setCaps((cs) => [...cs.filter((x) => Date.now() - x.at < 2400).slice(-2), { ...c, key: `${c.at}-${Math.random()}` }]);
  }), []);
  useEffect(() => {
    if (!caps.length) return undefined;
    const t = setTimeout(() => setCaps((cs) => cs.filter((x) => Date.now() - x.at < 2400)), 2500);
    return () => clearTimeout(t);
  }, [caps]);
  const label = st === 'locked' ? '♪ SOUND: click to start' : st === 'muted' ? '♪ MUTED · click for sound' : '♪ SOUND ON · click to mute';
  return (
    <>
      <button type="button" className={`lb-mute st-${st}`} aria-pressed={st === 'muted'} title="Sound on/off (M)"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); if (st === 'locked') { unlock(); setMuted(false); } else setMuted(!isMuted()); }}>
        {label}
      </button>
      <div className={`lb-caps at-${where}`} aria-live="polite">
        {caps.map((c) => <p key={c.key} className={`cap cap-${c.id}`}><b>CC</b><span><Ors text={c.text} /></span></p>)}
      </div>
    </>
  );
}

// M toggles mute anywhere on the page.
if (typeof window !== 'undefined' && !window.__labBMuteKey) {
  window.__labBMuteKey = true;
  addEventListener('keydown', (e) => { if ((e.key === 'm' || e.key === 'M') && !e.repeat) { unlock(); setMuted(!isMuted()); } });
}

// ---------- dialogue ----------
// "NANDA: line" -> speaker chip + line; every OR in her red (1px offset) and, once per line, her breath.
export function Line({ text, className = '', breath = true, style }) {
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/.exec(text ?? '');
  const who = m?.[1], line = m ? m[2] : text;
  useEffect(() => { if (breath && text && /OR/.test(line)) play('breath'); }, [text, line, breath]);
  if (!text) return null;
  return (
    <div className={`lb-say${who ? ` who-${who.toLowerCase()}` : ' narration'} ${className}`} style={style} role="status">
      {who && <b className="speaker">{who}</b>}
      <p><Ors text={line} /></p>
    </div>
  );
}

// Cinema subtitle (no VN box): speaker in pink small caps, OR rule + breath.
export function Sub({ text, className = '', style }) {
  if (!text) return null;
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/.exec(text);
  return (
    <p className={`lb-sub${m ? '' : ' narration'} ${className}`} style={style}>
      {m && <span className="who">{m[1]}</span>}<OrText text={m ? m[2] : text} />
    </p>
  );
}

// OR-rule text with a breath the first time it appears.
export function OrText({ text, breath = true }) {
  useEffect(() => { if (breath && /OR/.test(text)) play('breath'); }, [text, breath]);
  return <Ors text={text} />;
}

// ---------- markup (ported SVG sprite strings) ----------
export function Markup({ html, ...rest }) {
  return <g {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}

// ---------- clock ----------
// t in ms since start; loops at `total` when loop; honours ?t=<s> (seek) and ?pause (freeze, for shots).
export function useClock(total, { loop = true, run = true } = {}) {
  const [t, setT] = useState(SEEK);
  const [gen, setGen] = useState(0);
  useEffect(() => {
    if (!run || PAUSE) return undefined;
    let raf;
    const start = performance.now() - (gen ? 0 : SEEK);
    const f = (now) => {
      let tt = now - start;
      tt = loop ? tt % total : Math.min(tt, total);
      setT(tt);
      if (loop || tt < total) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [total, loop, run, gen]);
  const restart = useCallback(() => { setT(0); setGen((g) => g + 1); }, []);
  return [t, restart];
}

// Timeline sound: fire each shot's cues [[ms, id, opts]] once per loop, and hold the beds a shot lists.
// A cue that is more than 600 ms stale (a ?t= seek landed past it) is skipped.
export function useShotSound(shot, local, t, beds = []) {
  const fired = useRef(new Set());
  const lastT = useRef(-1);
  useEffect(() => {
    if (t < lastT.current) fired.current.clear();
    lastT.current = t;
    (shot.cues ?? []).forEach(([ms, id, opts], k) => {
      const key = `${shot.i}:${k}`;
      if (local >= ms && !fired.current.has(key)) { fired.current.add(key); if (local - ms < 600) play(id, opts); }
    });
  });
  useEffect(() => { beds.forEach((b) => bed(b, (shot.beds ?? []).includes(b))); }, [shot.i]); // eslint-disable-line react-hooks/exhaustive-deps
}

// A setTimeout chain that is cancelled on unmount / reset: later(fn, ms).
export function useLater() {
  const ids = useRef([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  const later = useCallback((fn, ms) => { const id = setTimeout(fn, ms); ids.current.push(id); return id; }, []);
  const clear = useCallback(() => { ids.current.forEach(clearTimeout); ids.current = []; }, []);
  return [later, clear];
}

// Pointer -> stage px (the stage is scaled to fit the window).
export function toStage(e, el) {
  const r = el.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * 1920, y: ((e.clientY - r.top) / r.height) * 1080 };
}
