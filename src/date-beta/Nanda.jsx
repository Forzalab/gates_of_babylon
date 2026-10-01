// Nanda on screen: the V1b gate-girl (art/nanda.js). She stays up for every beat of a scene where she is present
// (engine.present), so she never pops in and out mid-scene. Her bubble shows only on her own lines (talk).
// Her stage follows the beat's dread: scare 0 sweet, 1 clingy, 2 possessive (rule C bubble). A reaction (HUD SPEC)
// overrides it with its emote (heart | hearts | sweat | pout | or | crack) and a big bubble.
// Scene A (research/sprint-0930/scene-a/FACES.md): `face` swaps her face by id (art/nanda.js SCENE_FACES) and `frame`
// picks the camera: medium (default) | handout | pov | peek | close = the same sprite, placed/sized by CSS (hard cuts,
// no motion); eyes = an extreme close-up (a cropped viewBox filling the stage). Big frames drop the thought bubble.
// reach (props.cut.reach, R5 park): her upper pin reaches out at the viewer (art/nanda.js reachArm).
import { useMemo } from 'react';
import { nandaSVG, stageFor } from './art/nanda.js';
import { faceLayers } from './art/emotion/face.js';

const VIEW = { medium: '-130 -330 320 345', eyes: '-65 -188 150 84.375' };
export const FRAMES = ['off', 'medium', 'handout', 'pov', 'eyes', 'peek', 'close'];
const BUBBLE = new Set(['medium', 'pov']);

// layers: gacha face layer ids (vein | puff | shadow-eyes | sparkle), still overlays on her face (art/emotion/face.js).
export function Nanda({ scare = 0, raised = false, emote = null, big = false, talk = true, layers = null, face = null, frame = 'medium', planted = 0, floor = 0, reach = false, wet = false, step = null, lit = null }) {
  const stage = stageFor(scare);
  const key = layers?.join(',') ?? '';
  const bubble = talk && BUBBLE.has(frame);
  const svg = useMemo(() => nandaSVG({ stage, emote: emote ?? undefined, big, talk: bubble, face, reach,
    step, lit, overlay: key ? (P, A) => faceLayers(key.split(','), P, A) : null }), [stage, emote, big, bubble, key, face, reach, step, lit]);
  // the water copy: with a step pose each foot mirrors about its own contact (nanda.js legsSVG refl)
  const rsvg = useMemo(() => (wet && step ? nandaSVG({ stage, emote: emote ?? undefined, big, talk: bubble, face, reach, step, lit, refl: true,
    overlay: key ? (P, A) => faceLayers(key.split(','), P, A) : null }) : svg), [svg, wet, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const cls = `db-nanda stage-${stage} frame-${frame}${raised ? ' raised' : ''}${planted ? ' planted' : ''}${floor ? ' floored' : ''}`;
  const pos = floor ? { '--floor': `${floor}px` } : planted ? { '--plant': `${planted}px` } : undefined;
  return (<>
    <svg className={cls} style={lit?.grade ? { ...pos, filter: lit.grade } : pos} data-layers={key || undefined} data-face={face ?? undefined}
      viewBox={VIEW[frame] ?? VIEW.medium} preserveAspectRatio={frame === 'eyes' ? 'xMidYMid slice' : undefined} role="img"
      aria-label={frame === 'eyes' ? 'Nanda, extreme close-up on her eyes' : 'Nanda'} dangerouslySetInnerHTML={{ __html: svg }} />
    {wet && floor && frame === 'medium' ? <svg className={`${cls} refl`} style={pos} viewBox={VIEW.medium} aria-hidden="true" dangerouslySetInnerHTML={{ __html: rsvg }} /> : null}
  </>);
}

export const speaksNanda = (line) => line?.who === 'NANDA';
