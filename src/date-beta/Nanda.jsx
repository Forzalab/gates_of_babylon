// Nanda on screen: the V1b gate-girl (art/nanda.js). She stays up for every beat of a scene where she is present
// (engine.present), so she never pops in and out mid-scene. Her bubble shows only on her own lines (talk).
// Her stage follows the beat's dread: scare 0 sweet, 1 clingy, 2 possessive (rule C bubble). A reaction (HUD SPEC)
// overrides it with its emote (heart | hearts | sweat | pout | or | crack) and a big bubble.
import { useMemo } from 'react';
import { nandaSVG, stageFor } from './art/nanda.js';

export function Nanda({ scare = 0, raised = false, emote = null, big = false, talk = true }) {
  const stage = stageFor(scare);
  const svg = useMemo(() => nandaSVG({ stage, emote: emote ?? undefined, big, talk }), [stage, emote, big, talk]);
  return (
    <svg className={`db-nanda stage-${stage}${raised ? ' raised' : ''}`} viewBox="-130 -330 320 345" role="img" aria-label="Nanda"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export const speaksNanda = (line) => line?.who === 'NANDA';
