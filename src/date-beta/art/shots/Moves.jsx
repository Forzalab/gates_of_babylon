// More shot grammar on existing art (RUBRIC.md menu). All moves are stepped (>= 334 ms per step, no tweening);
// under reduced motion (rm) each holds its LAST frame (the composed end of the move).
//   push     { of, x, y, from=1, to=1.6, steps=5, every=400, tone? }   push-in (dread) / pull-out when from > to
//   rack     { of, emote='heart', focus='her'|'bg' (end state), every=600 } bokeh shift: Nanda foreground <-> background
//   pov      { of, x?, y?, zoom=1.15, blink=true }                    player's eyes: lids blink open, soft edge
//   ots      { of, emote='heart', tone? }                             over the shoulder: your dark shoulder, her mid-frame
//   timelapse{ of, tones=['day','dusk','night'], every=700 }          sky/light passes on one frame (time passing)
//   dutch    { of, x?, y?, zoom=1.4, tilt=-9 }                         the one horror tilt, red-cold grade
//   match    { of, to, x=960, y=540, every=360 }                       iris match cut: closes on (x,y) of `of`, opens on `to`
//   stamp    { of, place, time, ofProps? }                            place/time title card over any art ("SHOP STREET · 3:10 PM")
import { useEffect, useState } from 'react';
import { ART } from '../index.js';
import { Grade } from '../romance/Grade.jsx';
import { nandaSVG } from '../nanda.js';

const W = 1920, H = 1080;
function useSteps(n, every, rm) {
  const [i, setI] = useState(rm ? n : 0);
  useEffect(() => {
    if (rm) { setI(n); return undefined; }
    setI(0);
    const t = setInterval(() => setI((k) => (k < n ? k + 1 : k)), Math.max(334, every));
    return () => clearInterval(t);
  }, [n, every, rm]);
  return i;
}
function View({ of, x = 960, y = 540, zoom = 1, rot = 0, props, rm, style }) {
  const Art = ART[of];
  const z = Math.max(1, zoom);
  const cx = Math.min(W - W / 2 / z, Math.max(W / 2 / z, x)), cy = Math.min(H - H / 2 / z, Math.max(H / 2 / z, y));
  const t = `translate(${W / 2}px, ${H / 2}px) rotate(${rot}deg) scale(${z * (rot ? 1.15 : 1)}) translate(${-cx}px, ${-cy}px)`;
  return (<div className="shot-cam" style={style}><div className="shot-cam-in" style={{ transform: t }}>{Art ? <Art props={props ?? {}} rm={rm} /> : <div className="shot-void" />}</div></div>);
}
const G = ({ id, tone, rm, sparkles = 10 }) => (<svg className="art shot-grade" viewBox="0 0 1920 1080" aria-hidden="true"><Grade id={id} tone={tone} rm={rm} sparkles={sparkles} /></svg>);
const Her = ({ emote = 'heart', x = 960, y = 1000, k = 2.4, style }) => (
  <svg className="art" viewBox="0 0 1920 1080" style={style} aria-hidden="true"><g transform={`translate(${x} ${y}) scale(${k})`} dangerouslySetInnerHTML={{ __html: nandaSVG({ emote, talk: false }) }} /></svg>);

export function Push({ props = {}, rm }) {
  const { of = 'street-day', x = 960, y = 540, from = 1, to = 1.6, steps = 5, every = 400, tone } = props;
  const i = useSteps(steps, every, rm);
  const z = from + (to - from) * (i / steps);
  return (<div className={`art shot push ${to > from ? 'in' : 'out'}`} role="img" aria-label={`${to > from ? 'Push-in' : 'Pull-out'} on ${of}`}>
    <View of={of} x={x} y={y} zoom={z} rm={rm} props={props.ofProps} /><div className="shot-vig" />{tone && <G id="sh-pu" tone={tone} rm={rm} />}</div>);
}

export function Rack({ props = {}, rm }) {
  const { of = 'street-dusk', emote = 'heart', focus = 'her', every = 600 } = props;
  const i = useSteps(1, every, rm);
  const herSharp = (i === 1) === (focus === 'her');
  return (<div className="art shot rack" role="img" aria-label={`Focus shifts to ${focus === 'her' ? 'Nanda' : 'the background'}`}>
    <View of={of} zoom={1.1} rm={rm} style={{ filter: herSharp ? 'blur(12px) brightness(.85)' : 'none' }} />
    <Her emote={emote} x={560} y={1240} k={3.4} style={{ filter: herSharp ? 'none' : 'blur(16px)' }} />
    <G id="sh-ra" tone="dusk" rm={rm} sparkles={24} /></div>);
}

export function Pov({ props = {}, rm }) {
  const { of = 'street-day', x = 960, y = 540, zoom = 1.15, blink = true } = props;
  const i = useSteps(blink ? 3 : 0, 360, rm);
  const lid = blink ? [540, 300, 120, 0][i] : 0;
  return (<div className="art shot pov" role="img" aria-label={`Your view: ${of}`}>
    <View of={of} x={x} y={y} zoom={zoom} rm={rm} props={props.ofProps} />
    <div className="shot-pov-edge" />
    <div className="shot-lid top" style={{ height: lid }} /><div className="shot-lid bot" style={{ height: lid }} /></div>);
}

export function Ots({ props = {}, rm }) {
  const { of = 'street-dusk', emote = 'heart', tone = 'dusk' } = props;
  return (<div className="art shot ots" role="img" aria-label="Over your shoulder, Nanda faces you">
    <View of={of} zoom={1.25} rm={rm} style={{ filter: 'blur(4px)' }} />
    <Her emote={emote} x={1060} y={1120} k={2.6} />
    <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
      <path d="M-40 1080 V620 Q60 470 260 460 Q420 450 520 560 Q600 650 640 1080Z" className="shot-shoulder" />
      <path d="M150 470 Q180 300 330 290 Q470 300 470 450 Q440 520 330 530 Q220 530 150 470Z" className="shot-shoulder" />
    </svg>
    <G id="sh-ot" tone={tone} rm={rm} sparkles={8} /></div>);
}

export function Timelapse({ props = {}, rm }) {
  const { of = 'street-day', tones = ['day', 'dusk', 'night'], every = 700 } = props;
  const i = useSteps(tones.length - 1, every, rm);
  return (<div className="art shot timelapse" role="img" aria-label={`Time passes: ${tones.join(' to ')}`}>
    <View of={of} rm={rm} style={{ filter: ['none', 'sepia(.35) saturate(1.3) hue-rotate(-12deg)', 'brightness(.45) saturate(.8) hue-rotate(200deg)'][Math.min(i, 2)] }} />
    <G id={`sh-tl${i}`} tone={tones[i]} rm={rm} sparkles={i === 2 ? 30 : 8} /></div>);
}

export function Dutch({ props = {}, rm }) {
  const { of = 'basement', x = 960, y = 540, zoom = 1.4, tilt = -9 } = props;
  return (<div className="art shot dutch" role="img" aria-label={`Tilted view of ${of}`}>
    <View of={of} x={x} y={y} zoom={zoom} rot={tilt} rm={rm} style={{ filter: 'saturate(.6) contrast(1.15)' }} />
    <div className="shot-wash" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #5a0014cc 100%)' }} /></div>);
}

export function Match({ props = {}, rm }) {
  const { of = 'crossing-day', to = 'street-dusk', x = 960, y = 540, every = 360 } = props;
  const i = useSteps(5, every, rm);
  const r = [1200, 420, 90, 90, 420, 1200][i];
  const src = i < 3 ? of : to;
  return (<div className="art shot match" role="img" aria-label={`Match cut from ${of} to ${to}`}>
    <View of={src} rm={rm} style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }} /></div>);
}

export function Stamp({ props = {}, rm }) {
  const { of = 'shop-street', place = 'SHOP STREET', time = '3:10 PM' } = props;
  const Art = ART[of];
  // r5: a stamp may frame a detail of its place (zoom > 1 at x, y): HER HOME on her shoes in their perfect line
  return (<div className="art shot stamp" role="img" aria-label={`${place}, ${time}`}>
    {Art && (props.zoom > 1 ? <View of={of} x={props.x} y={props.y} zoom={props.zoom} props={props.ofProps ?? {}} rm={rm} /> : <Art props={props.ofProps ?? {}} rm={rm} />)}
    {props.air !== false && <div className="shot-air" />}
    <div className="shot-stamp"><b>{place}</b><i>·</i><span>{time}</span></div></div>);
}
