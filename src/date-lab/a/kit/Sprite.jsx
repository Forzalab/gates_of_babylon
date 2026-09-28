// SVG sprite bridges: the ported string art (kit/art.js) dropped into React SVG trees.
// <Nanda> = main's bust (600 x 900 local units) placed with x/y = top-left and s = scale.
import { memo, useMemo } from 'react';
import * as ART from './art.js';

const sized = (svg, w, h) => svg.replace('<svg ', `<svg width="${w}" height="${h}" overflow="visible" `);

export const Nanda = memo(function Nanda({ face = 'smile', pin, blink = false, x = 0, y = 0, s = 1, className = '', flip = false, style }) {
  const html = useMemo(() => sized(ART.nanda({ face, pin, blink }), 600, 900), [face, pin, blink]);
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})${flip ? ' translate(-600 0)' : ''}`;
  return <g className={`ka-bust ${className}`} transform={t} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
});

// Any fragment builder from art.js (sil, cup, steam, plum, egg, mochi, phone, hand, slipper, shoe, nandSym, pin) as a <g className="ka">.
export const Frag = memo(function Frag({ html, className = '', ...rest }) {
  return <g className={`ka ${className}`} {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
});

// A full-frame string scene (sceneKitchen, sceneGenkan, ...) as nested SVG.
export const StrScene = memo(function StrScene({ html, className = '' }) {
  const h = useMemo(() => sized(html, 1920, 1080), [html]);
  return <g className={className} dangerouslySetInnerHTML={{ __html: h }} />;
});

export { ART };
