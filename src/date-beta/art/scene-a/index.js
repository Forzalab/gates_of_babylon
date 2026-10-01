// Scene A art hand-off (Agent 1 -> Agent 2). ids + props: research/sprint-0930/scene-a/ART.md.
// SCENE_A = bg ids -> art components ({ props, rm }); it is spread into ART in art/index.js.
// Components for custom layouts (the handout beat): BentoBox (<g>, 1160x812 local), BentoSvg (<svg>), the food parts.
import { ROOFTOP, RooftopNoon, RooftopWarm } from '../rooftop/index.js';
import { BentoBox, BentoSvg, BentoInsert, BentoLift, BentoLiftTama, BentoLiftUme, BOX, UME, TAMA } from './Bento.jsx';
import { Umeboshi, TamaSlice, TamaLog, TamaBlock, Chopstick, HeldChopsticks, ShisoLeaf, UmeStain, Glint } from './foods.jsx';

export { RooftopNoon, RooftopWarm, BentoBox, BentoSvg, BentoInsert, BentoLift, BentoLiftTama, BentoLiftUme, BOX, UME, TAMA };
export { Umeboshi, TamaSlice, TamaLog, TamaBlock, Chopstick, HeldChopsticks, ShisoLeaf, UmeStain, Glint };
export const SCENE_A = {
  ...ROOFTOP,
  'bento-insert': BentoInsert,
  'bento-lift': BentoLift,
  'bento-lift-tama': BentoLiftTama,
  'bento-lift-ume': BentoLiftUme,
};
export default SCENE_A;
