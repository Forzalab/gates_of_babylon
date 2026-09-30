// Nanda on screen: the V1b gate-girl (art/nanda.js). She stays up for every beat of a scene where she is present
// (engine.present), so she never pops in and out mid-scene. Her bubble shows only on her own lines (talk).
// Her stage follows the beat's dread: scare 0 sweet, 1 clingy, 2 possessive (rule C bubble). A reaction (HUD SPEC)
// overrides it with its emote (heart | hearts | sweat | pout | or | crack) and a big bubble.
// Scene A (research/sprint-0930/scene-a/FACES.md): `face` swaps her face by id (art/nanda.js SCENE_FACES) and `frame`
// picks the camera: medium (default) | handout | pov | peek | close = the same sprite, placed/sized by CSS (hard cuts,
// no motion); eyes = an extreme close-up (a cropped viewBox filling the stage). Big frames drop the thought bubble.
import { useMemo } from 'react';
import { nandaSVG, stageFor } from './art/nanda.js';
import { faceLayers } from './art/emotion/face.js';

const VIEW = { medium: '-130 -330 320 345', eyes: '-65 -188 150 84.375' };
export const FRAMES = ['off', 'medium', 'handout', 'pov', 'eyes', 'peek', 'close', 'reach']; // reach (r5): her medium close-up on the right, one pin arm thrust toward the lens
const BUBBLE = new Set(['medium', 'pov']);

// layers: gacha face layer ids (vein | puff | shadow-eyes | sparkle), still overlays on her face (art/emotion/face.js).
// arms / pose / tilt (r5): her pin arms, the kneel pose and a lean (art/nanda.js); data from props.cut.
export function Nanda({ scare = 0, raised = false, emote = null, big = false, talk = true, layers = null, face = null, frame = 'medium', planted = 0, floor = 0, arms = null, pose = null, tilt = 0, dx = 0 }) {
  const stage = stageFor(scare);
  const key = layers?.join(',') ?? '';
  const bubble = talk && BUBBLE.has(frame);
  const armKey = arms ? JSON.stringify(arms) : '';
  const svg = useMemo(() => nandaSVG({ stage, emote: emote ?? undefined, big, talk: bubble, face, arms: armKey ? JSON.parse(armKey) : null, pose, tilt,
    overlay: key ? (P, A) => faceLayers(key.split(','), P, A) : null }), [stage, emote, big, bubble, key, face, armKey, pose, tilt]);
  return (
    <svg className={`db-nanda stage-${stage} frame-${frame}${raised ? ' raised' : ''}${pose ? ` pose-${pose}` : ''}${planted ? ' planted' : ''}${floor ? ' floored' : ''}`} style={{ ...(floor ? { '--floor': `${floor}px` } : planted ? { '--plant': `${planted}px` } : {}), ...(dx ? { translate: `${dx}px 0` } : {}) }} data-layers={key || undefined} data-face={face ?? undefined}
      viewBox={VIEW[frame] ?? VIEW.medium} preserveAspectRatio={frame === 'eyes' ? 'xMidYMid slice' : undefined} role="img"
      aria-label={frame === 'eyes' ? 'Nanda, extreme close-up on her eyes' : 'Nanda'} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export const speaksNanda = (line) => line?.who === 'NANDA';
