// Nanda on screen: the V1b gate-girl (art/nanda.js). She is up for every beat of a scene she is in (engine `present`),
// and on any NANDA line. Her stage follows the beat's dread (scare 0 sweet, 1 clingy, 2 possessive, rule C bubble);
// `emote` (a reaction, the goal card, an ending) overrides it with that face + bubble, `big` = the reaction-size bubble.
// talk = false: no bubble (she stands by through MC / narration beats). The pink rim-light is CSS (.db-nanda).
import { useMemo } from 'react';
import { nandaSVG, stageFor, EMOTES } from './art/nanda.js';

export function Nanda({ scare = 0, raised = false, emote = null, big = false, talk = true }) {
  const stage = stageFor(scare);
  const e = emote && EMOTES[emote] ? emote : null;
  const svg = useMemo(() => nandaSVG({ stage, emote: e ?? undefined, big, talk }), [stage, e, big, talk]);
  const pal = e ? EMOTES[e].pal : stage;
  return (
    <svg className={`db-nanda stage-${pal}${raised ? ' raised' : ''}`} viewBox="-130 -330 320 345" role="img"
      aria-label={e ? `Nanda (${e})` : 'Nanda'} dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

export const speaksNanda = (line) => line?.who === 'NANDA';
