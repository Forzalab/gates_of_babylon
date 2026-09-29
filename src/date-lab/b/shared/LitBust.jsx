// Nanda's bust (my port of main's sprite, shared/art.js) composited into a scene's light. Draw inside an <svg class="art">.
// The light maths is Builder A's round-1 rig table (a/kit/integrate.js, imported read-only): every role colour is graded
// toward the scene's ambient + key, a rim band on the lamp side, and a soft cast shadow away from the key.
// x, y = top-left of the 600 x 900 bust box, s = scale. face: smile | blank | tears | wide.
import { useId, useMemo } from 'react';
import { ART, placed } from './art.js';
import { RIGS, gradeVars, shadowDir } from '../../a/kit/integrate.js';

const BLACK = '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0';

export default function LitBust({ face = 'smile', pin, x = 0, y = 0, s = 1, rig: rigName = 'door', rim = true, shadow = true, dim = 1, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const rig = RIGS[rigName];
  const vars = useMemo(() => gradeVars(rigName), [rigName]);
  const html = useMemo(() => placed(ART.nanda({ face, pin }), x, y, 600 * s, 900 * s), [face, pin, x, y, s]);
  const [rx, ry] = rig.rimFrom;
  const rl = Math.hypot(rx, ry) || 1;
  const [sx, sy] = shadowDir(rigName);
  return (
    <g className={`lb-bust ${className}`} style={{ ...vars, filter: dim !== 1 ? `brightness(${dim})` : undefined }}>
      <defs>
        <filter id={`${uid}-rim`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dx={(-rx / rl) * 8} dy={(-ry / rl) * 8} result="off" />
          <feComposite in="SourceAlpha" in2="off" operator="out" result="edge" />
          <feGaussianBlur in="edge" stdDeviation="1.8" result="eb" />
          <feFlood floodColor={rig.rim ?? rig.key} />
          <feComposite in2="eb" operator="in" result="rimc" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="rimc" /><feMergeNode in="rimc" /></feMerge>
        </filter>
        <filter id={`${uid}-sh`} x="-30%" y="-30%" width="160%" height="160%"><feColorMatrix type="matrix" values={BLACK} /><feGaussianBlur stdDeviation="12" /></filter>
      </defs>
      {shadow && <g filter={`url(#${uid}-sh)`} opacity=".5" transform={`translate(${sx * 44} ${sy * 44 + 12})`} dangerouslySetInnerHTML={{ __html: html }} />}
      <g filter={rim ? `url(#${uid}-rim)` : undefined} dangerouslySetInnerHTML={{ __html: html }} />
    </g>
  );
}
