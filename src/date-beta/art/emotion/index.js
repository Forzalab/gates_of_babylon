// art/emotion: the gacha emotion art (research/sprint-0930/emotion-fx/, SCHEMA.md there).
// EMOTION_FX: gacha fx id -> ({ tier }) => static SVG string (1920x1080 backdrop). FACE layers: see face.js (stage 3).
import { loveCritSVG, loveBombSVG, angerSVG, rageSVG } from './fx.js';

export const EMOTION_FX = {
  'love-crit': ({ bonus = 5 } = {}) => loveCritSVG({ big: bonus >= 10 }),
  'love-bomb': () => loveBombSVG(),
  anger: () => angerSVG(),
  rage: () => rageSVG(),
};
