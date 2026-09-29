// Nanda on screen: the V1b gate-girl (art/nanda.js), drawn whenever the beat's speaker is NANDA (the "NANDA:" prefix or
// an explicit `speaker`). Her stage follows the beat's dread: scare 0 sweet, 1 clingy, 2 possessive (rule C bubble).
import { useMemo } from 'react';
import { nandaSVG, stageFor } from './art/nanda.js';

export function Nanda({ scare = 0 }) {
  const stage = stageFor(scare);
  const svg = useMemo(() => nandaSVG({ stage }), [stage]);
  return (
    <svg className={`db-nanda stage-${stage}`} viewBox="-130 -330 320 345" role="img" aria-label="Nanda"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export const speaksNanda = (line) => line?.who === 'NANDA';
