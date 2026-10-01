// art/crowd/CrowdLayer.jsx: the CROWD (the leave ending's "f{OR}ever and ever" chorus). Data + keep-outs: crowd.js.
// Two DOM layers so the depth reads right:
//   <CrowdBack>  far + mid bands, painted after the scene and BEFORE Nanda (she stands in front of them)
//   <CrowdNear>  the near bokeh band, painted where NearLens paints: over the scene + Nanda, under the HUD
// Look (Tony's refs: scribble-hatched head mass, glowing red ring irises, a jagged grin): flat near-black heads, the
// only light is their eyes. Motion: a slow staggered blink + the eyes drift toward Nanda; .rm / reduced motion = still.
import { useMemo } from 'react';
import { buildCrowd, personPath, grinPath } from './crowd.js';
import './crowd.css';

const dly = (s) => ({ animationDelay: `-${s.toFixed(2)}s` });
const dur = (f) => ({ '--cw-dur': `${f.dur.toFixed(2)}s` });

function Eyes({ f, kind }) {
  const { x, y, r } = f;
  const ey = y + r * 0.1, dx = r * 0.4;
  const rx = kind === 'dot' ? Math.max(1.6, r * 0.16) : r * 0.2, ry = kind === 'dot' ? rx * 0.8 : rx * 0.78;
  const look = (f.look ?? 0) * rx * 0.25;
  return (
    <g className="cw-eyes" style={{ ...dly(f.blink), ...dur(f) }}>
      {[-1, 1].map((s) => {
        const cx = x + s * dx;
        if (kind === 'dot') return <ellipse key={s} cx={cx} cy={ey} rx={rx} ry={ry} className="cw-dot" />;
        if (kind === 'glow') return (
          <g key={s}>
            <ellipse cx={cx} cy={ey} rx={rx * 1.9} ry={ry * 1.9} fill="url(#cw-bloom)" />
            <ellipse cx={cx} cy={ey} rx={rx} ry={ry} fill="url(#cw-iris)" />
            <circle className="cw-pupil" cx={cx + look} cy={ey} r={rx * 0.22} fill="#2a0006" />
          </g>
        );
        // ring: the ref1/ref2 eye. Dark lid, glowing iris, two rings, a pin pupil, a white catch-light, a wet streak.
        return (
          <g key={s}>
            <ellipse cx={cx} cy={ey} rx={rx * 3.2} ry={ry * 3} fill="url(#cw-bloom)" />
            <ellipse cx={cx} cy={ey} rx={rx * 1.25} ry={ry * 1.15} fill="#0a0103" />
            <g className="cw-pupil">
              <circle cx={cx + look} cy={ey} r={ry} fill="url(#cw-iris)" />
              <circle cx={cx + look} cy={ey} r={ry * 0.72} fill="none" stroke="#ffb3b3" strokeWidth={ry * 0.07} opacity=".85" />
              <circle cx={cx + look} cy={ey} r={ry * 0.42} fill="none" stroke="#5a0008" strokeWidth={ry * 0.1} />
              <circle cx={cx + look} cy={ey} r={ry * 0.13} fill="#1a0003" />
              <circle cx={cx + look - ry * 0.4} cy={ey - ry * 0.38} r={ry * 0.12} fill="#fff" opacity=".9" />
            </g>
            <path d={`M${cx - rx * 1.3} ${ey - ry * 0.25}Q${cx} ${ey - ry * 1.55} ${cx + rx * 1.3} ${ey - ry * 0.25}`} fill="none" stroke="#000" strokeWidth={ry * 0.32} strokeLinecap="round" />
            <path d={`M${cx + s * rx * 0.55} ${ey + ry * 0.9}q${s * rx * 0.08} ${ry * 1.4} ${-s * rx * 0.05} ${ry * 2.6}`} fill="none" stroke="#ff6b7a" strokeWidth={ry * 0.09} opacity=".45" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Grin({ f }) {
  const g = grinPath(f.x, f.y, f.r);
  return (
    <g className="cw-grin">
      <path d={g.mouth} fill="#5c0410" />
      <path d={g.teeth} fill="none" stroke="#ff4d5e" strokeWidth={Math.max(1.2, f.r * 0.035)} strokeLinejoin="miter" />
    </g>
  );
}

const Defs = () => (
  <defs>
    <radialGradient id="cw-iris">
      <stop offset="0" stopColor="#fff1f1" />
      <stop offset=".25" stopColor="#ff5a5a" />
      <stop offset=".75" stopColor="#e0001c" />
      <stop offset="1" stopColor="#7a0010" />
    </radialGradient>
    <radialGradient id="cw-bloom">
      <stop offset="0" stopColor="#ff1f35" stopOpacity=".75" />
      <stop offset=".45" stopColor="#ff0a28" stopOpacity=".22" />
      <stop offset="1" stopColor="#ff0a28" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="cw-dim" cx="50%" cy="58%" r="70%">
      <stop offset=".18" stopColor="#12030a" stopOpacity="0" />
      <stop offset=".62" stopColor="#12030a" stopOpacity=".62" />
      <stop offset="1" stopColor="#060104" stopOpacity=".92" />
    </radialGradient>
    <linearGradient id="cw-haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a0c18" stopOpacity="0" />
      <stop offset=".55" stopColor="#3a0c18" stopOpacity=".55" />
      <stop offset="1" stopColor="#1a0409" stopOpacity=".9" />
    </linearGradient>
    {/* scribble hatching: diagonal ink strokes over the flat fill, plus a turbulence wobble on the outline (ref3) */}
    <pattern id="cw-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="#4a1220" strokeWidth="1.6" />
    </pattern>
    <pattern id="cw-hatch2" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(-58)">
      <line x1="0" y1="0" x2="0" y2="13" stroke="#2c0a12" strokeWidth="1.2" />
    </pattern>
    <filter id="cw-scribble" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".045 .09" numOctaves="2" seed="7" />
      <feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="cw-haze-blur"><feGaussianBlur stdDeviation="1.1" /></filter>
    <filter id="cw-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

export function CrowdBack({ crowd }) {
  const c = useMemo(() => buildCrowd(crowd), [crowd.density, crowd.seed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="cw-crowd cw-back" data-count={c.count} aria-hidden="true">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="none">
        <Defs />
        <rect width="1920" height="1080" fill="url(#cw-dim)" />
        <g className="cw-far" filter="url(#cw-haze-blur)">
          {c.far.map((f, i) => (
            <g key={i} data-band="far" opacity={f.tone}>
              <path d={personPath(f.x, f.y, f.r, 660)} fill="#24090f" />
            </g>
          ))}
          <rect x="0" y="470" width="1920" height="200" fill="url(#cw-haze)" />
          <g className="cw-far-eyes">{c.far.map((f, i) => <Eyes key={i} f={f} kind="dot" />)}</g>
        </g>
        <g className="cw-mid">
          {c.mid.map((f, i) => (
            <g key={i} data-band="mid" className="cw-sway" style={dly(f.sway)}>
              <g filter="url(#cw-scribble)">
                <path d={personPath(f.x, f.y, f.r, 1100)} fill="#0d0306" />
                <path d={personPath(f.x, f.y, f.r, 1100)} fill="url(#cw-hatch)" opacity=".75" />
                <path d={personPath(f.x, f.y, f.r * 0.92, 1100)} fill="url(#cw-hatch2)" opacity=".6" />
                <path d={personPath(f.x, f.y, f.r, 1100)} fill="none" stroke="#000" strokeWidth="3" />
              </g>
              {f.grin && <Grin f={f} />}
              <g filter="url(#cw-glow)"><Eyes f={f} kind="glow" /></g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function CrowdNear({ crowd }) {
  const c = useMemo(() => buildCrowd(crowd), [crowd.density, crowd.seed]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="cw-crowd cw-front" aria-hidden="true">
      {/* out of focus: the bodies take a heavy CSS blur (bokeh); the eyes a light one so the rings still read */}
      <svg className="cw-near-body" viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="none">
        {c.near.map((f, i) => (
          <g key={i} data-band="near">
            <path d={personPath(f.x, f.y, f.r, 1500)} fill="#050103" />
            {f.grin && <path d={grinPath(f.x, f.y, f.r).mouth} fill="#4a020c" />}
          </g>
        ))}
      </svg>
      <svg className="cw-near-eyes" viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="none">
        {/* gradients come from CrowdBack's <Defs> (the two always mount together: one id set in the document) */}
        {c.near.map((f, i) => <g key={i}>{f.grin && <Grin f={f} />}<Eyes f={f} kind="ring" /></g>)}
      </svg>
    </div>
  );
}
