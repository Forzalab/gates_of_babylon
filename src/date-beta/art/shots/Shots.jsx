// Camera tricks on EXISTING art (no new backgrounds). Each is an art component ({ props, rm }) used as a beat `bg`.
//   closeup   { of, x=960, y=540, zoom=2, tone? }         scale+crop art `of` so (x, y) is the frame centre.
//   insert    { item, of?, caption?, tone='day', tilt? }  hand-drawn object card (items.jsx) over `of` blurred.
//   reaction  { emote='heart', of?, tone? }               Nanda big-face crop + emote + a colour grade per emote.
//   establish { of, from=[x,y], to=[x,y], zoom=1.35, steps=6, every=400 } stepped pan (>= 334 ms/step); rm = holds on `from`.
// ART is read at render time (circular import with ../index.js is safe: never touched at module load).
import { useEffect, useState } from 'react';
import { ART } from '../index.js';
import { Grade } from '../romance/Grade.jsx';
import { nandaSVG } from '../nanda.js';
import { ITEMS, ITEM_LABEL } from './items.jsx';
import './shots.css';

const W = 1920, H = 1080;
const clampC = (v, half, max) => Math.min(max - half, Math.max(half, v));

// The art `of` drawn under a camera: centre (x, y) at zoom z (crop never shows past the art edge).
function Cam({ of, x = 960, y = 540, zoom = 1, props, rm, className = '' }) {
  const Art = ART[of];
  const z = Math.max(1, zoom);
  const cx = clampC(x, W / 2 / z, W), cy = clampC(y, H / 2 / z, H);
  const t = `translate(${W / 2}px, ${H / 2}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
  return (
    <div className={`shot-cam ${className}`}>
      <div className="shot-cam-in" style={{ transform: t }}>{Art ? <Art props={props ?? {}} rm={rm} /> : <div className="shot-void" />}</div>
    </div>
  );
}
const GradeLayer = ({ id, tone, rm, sun, sparkles = 14 }) => (
  <svg className="art shot-grade" viewBox="0 0 1920 1080" aria-hidden="true"><Grade id={id} tone={tone} rm={rm} sun={sun} sparkles={sparkles} /></svg>
);

export function Closeup({ props = {}, rm }) {
  const { of = 'street-day', x, y, zoom = 2, tone } = props;
  return (
    <div className="art shot closeup" role="img" aria-label={`Close-up on ${of}`}>
      <Cam of={of} x={x} y={y} zoom={zoom} props={props.ofProps} rm={rm} />
      <div className="shot-vig" />
      {tone && <GradeLayer id="sh-cu" tone={tone} rm={rm} sparkles={8} />}
    </div>
  );
}

// r5 (AUDIT G8): no beige card and no caption any more. The insert is the SCENE's own art pushed in (a shallow depth of
// field: the trace softly out of focus) with the object cel big and sharp in front of it, on a contact shadow in the
// scene's light: cel over vtrace, the same bg family as the beats around it. Nanda's sprite sits out an insert (main.jsx).
export function Insert({ props = {}, rm }) {
  const { item = 'curry', of = 'crossing-day', tone = 'day', tilt = -3 } = props;
  const Item = ITEMS[item] ?? ITEMS.curry;
  return (
    <div className="art shot insert" role="img" aria-label={`Insert: ${ITEM_LABEL[item] ?? item}`}>
      <Cam of={of} zoom={1.3} rm className="shot-dof" />
      <GradeLayer id="sh-in" tone={tone} rm={rm} sun={[1560, 160]} sparkles={0} />
      <svg className="art" viewBox="0 0 1920 1080">
        <ellipse cx="970" cy="846" rx="430" ry="70" fill="#1a0c14" opacity=".32" />
        <g transform={`rotate(${tilt} 960 520) translate(600 150) scale(1.2)`}><Item pose={props.pose} /></g>
      </svg>
      <div className="shot-vig" />
    </div>
  );
}

// Per-emote grade over the face crop: a wash + a rim tint (Your-Name grade for the warm ones, drained for the cold ones).
const EMO_GRADE = { heart: 'day', hearts: 'day', sweat: 'day', pout: 'dusk', or: 'dusk', crack: 'night', hate: 'night' };
const EMO_WASH = { heart: '#ffb6d9', hearts: '#ff8fc6', sweat: '#bfe6ff', pout: '#ffc27a', or: '#f0243f', crack: '#5a0014', hate: '#4a3d66' };
export function Reaction({ props = {}, rm }) {
  const { emote = 'heart', of = 'street-dusk' } = props;
  const tone = props.tone ?? EMO_GRADE[emote] ?? 'day';
  const svg = nandaSVG({ emote, big: true, talk: true });
  return (
    <div className={`art shot reaction emo-${emote}`} role="img" aria-label={`Nanda close-up, ${emote}`}>
      <Cam of={of} zoom={1.6} rm className="shot-blur" />
      <div className="shot-wash" style={{ background: `radial-gradient(ellipse at 50% 55%, transparent 20%, ${EMO_WASH[emote] ?? '#ffb6d9'}99 100%)` }} />
      <svg className="art shot-face" viewBox="-190 -350 500 281" preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{ __html: svg }} />
      <GradeLayer id="sh-re" tone={tone} rm={rm} sun={[300, 140]} sparkles={emote === 'hate' || emote === 'crack' ? 0 : 18} />
      <div className="shot-bars" />
    </div>
  );
}

export function Establish({ props = {}, rm }) {
  const { of = 'crossing-day', from = [480, 540], to = [1440, 540], zoom = 1.35, steps = 6, every = 400, tone } = props;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (rm) return undefined;
    const t = setInterval(() => setI((k) => (k < steps ? k + 1 : k)), Math.max(334, every));
    return () => clearInterval(t);
  }, [rm, steps, every]);
  const f = steps ? i / steps : 0;
  const x = from[0] + (to[0] - from[0]) * f, y = from[1] + (to[1] - from[1]) * f;
  return (
    <div className="art shot establish" role="img" aria-label={`Establishing pan across ${of}`}>
      <Cam of={of} x={x} y={y} zoom={zoom} props={props.ofProps} rm={rm} />
      <div className="shot-air" />
      <div className="shot-bars" />
      {tone && <GradeLayer id="sh-es" tone={tone} rm={rm} sparkles={10} />}
    </div>
  );
}
