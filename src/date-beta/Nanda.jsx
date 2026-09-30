// Nanda on screen: the V1b gate-girl (art/nanda.js). She stays up for every beat of a scene where she is present
// (engine.present), so she never pops in and out mid-scene. Her bubble shows only on her own lines (talk).
// Her stage follows the beat's dread: scare 0 sweet, 1 clingy, 2 possessive (rule C bubble). A reaction (HUD SPEC)
// overrides it with its emote (heart | hearts | sweat | pout | or | crack) and a big bubble.
import { useMemo } from 'react';
import { nandaSVG, stageFor } from './art/nanda.js';
import { faceLayers } from './art/emotion/face.js';

// layers: gacha face layer ids (vein | puff | shadow-eyes | sparkle), still overlays on her face (art/emotion/face.js).
export function Nanda({ scare = 0, raised = false, emote = null, big = false, talk = true, layers = null }) {
  const stage = stageFor(scare);
  const key = layers?.join(',') ?? '';
  const svg = useMemo(() => nandaSVG({ stage, emote: emote ?? undefined, big, talk,
    overlay: key ? (P, A) => faceLayers(key.split(','), P, A) : null }), [stage, emote, big, talk, key]);
  return (
    <svg className={`db-nanda stage-${stage}${raised ? ' raised' : ''}`} data-layers={key || undefined} viewBox="-130 -330 320 345" role="img" aria-label="Nanda"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export const speaksNanda = (line) => line?.who === 'NANDA';
