// LitNanda: main's sprite composited into a scene's light (kit/integrate.js rigs). Four passes, each toggleable for A/B tests:
//   grade  - role colours re-derived for the scene (multiply toward ambient + key lift)
//   shade  - a key-direction gradient multiplied over her silhouette only (form shading; alpha-masked by the sprite itself)
//   rim    - an SVG edge filter: the sprite's alpha minus itself shifted away from the light = a thin band on the lit side
//            (backlit rigs: an all-round rim from an eroded alpha)
//   shadow - a blurred, black copy of her offset away from the key (bust: onto the wall; silhouette: a long floor shadow)
// Draw inside a 1920x1080 SVG. kind 'bust' = x/y top-left + s; kind 'sil' = x/y feet centre + s.
import { useId } from 'react';
import { Nanda, Frag, ART } from './Sprite.jsx';
import { RIGS, gradeVars, shadowDir } from './integrate.js';

const WHITE = '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0';
const BLACK = '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0';

function Body({ kind, face, pin, x, y, s, flip }) {
  if (kind === 'sil') return <Frag html={ART.sil('nanda', x, y, s)} className="lit-sil" />;
  return <Nanda face={face} pin={pin} x={x} y={y} s={s} flip={flip} />;
}

export default function LitNanda({ rig: rigName, kind = 'bust', face = 'smile', pin, x, y, s, flip = false,
  grade = true, shade = true, rim = true, shadow = true, shadowDist = 40, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const rig = RIGS[rigName];
  const vars = grade ? gradeVars(rigName) : {};
  const [rx, ry] = rig.rimFrom;
  const rl = Math.hypot(rx, ry) || 1;
  const [sx, sy] = shadowDir(rigName);
  const [kx, ky] = rig.keyFrom;
  const body = { kind, face, pin, x, y, s, flip };
  const silStyle = kind === 'sil' && grade ? { '--c-sil': rig.backlit ? '#1a120e' : '#05060c' } : {};
  return (
    <g className={`lit ${className}`} style={{ ...vars, ...silStyle }}>
      <defs>
        <filter id={`${uid}-rim`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          {rig.backlit
            ? <><feMorphology in="SourceAlpha" operator="erode" radius="4" result="er" /><feComposite in="SourceAlpha" in2="er" operator="out" result="edge" /></>
            : <><feOffset in="SourceAlpha" dx={(-rx / rl) * 7} dy={(-ry / rl) * 7} result="off" /><feComposite in="SourceAlpha" in2="off" operator="out" result="edge" /></>}
          <feGaussianBlur in="edge" stdDeviation="1.6" result="eb" />
          <feFlood floodColor={rig.rim ?? rig.key} />
          <feComposite in2="eb" operator="in" result="rimc" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="rimc" /><feMergeNode in="rimc" /></feMerge>
        </filter>
        <filter id={`${uid}-white`}><feColorMatrix type="matrix" values={WHITE} /></filter>
        <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="160%"><feColorMatrix type="matrix" values={BLACK} /><feGaussianBlur stdDeviation="10" /></filter>
        <mask id={`${uid}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><g filter={`url(#${uid}-white)`}><Body {...body} /></g></mask>
        <linearGradient id={`${uid}-shade`} x1={0.5 + kx * 0.5} y1={0.5 + ky * 0.5} x2={0.5 - kx * 0.5} y2={0.5 - ky * 0.5}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".55" stopColor={rig.ambient} stopOpacity=".15" /><stop offset="1" stopColor={rig.ambient} stopOpacity=".7" />
        </linearGradient>
      </defs>
      {shadow && kind === 'bust' && <g filter={`url(#${uid}-shadow)`} opacity=".45" transform={`translate(${sx * shadowDist} ${sy * shadowDist + 10})`}><Body {...body} /></g>}
      {shadow && kind === 'sil' && (
        <g filter={`url(#${uid}-shadow)`} opacity=".55" transform={`translate(${x} ${y}) scale(1 -0.55) skewX(${-sx * 25}) translate(${-x} ${-y})`}><Body {...body} /></g>
      )}
      <g filter={rim ? `url(#${uid}-rim)` : undefined}><Body {...body} /></g>
      {shade && <rect x="0" y="0" width="1920" height="1080" fill={`url(#${uid}-shade)`} mask={`url(#${uid}-mask)`} style={{ mixBlendMode: 'multiply' }} />}
    </g>
  );
}
