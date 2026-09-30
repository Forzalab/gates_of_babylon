// CURRY scene rebuild (sprint-0930, plan fizzy-dreaming-clover): art id -> component ({ props, rm }). Spread into ART.
// Shot order, refs, lines: research/sprint-0930/curry/SHOTLIST.md. Traces: public/date-beta/trace/curry/<id>.svg.
// Pipeline: research/sprint-0930/curry/pipeline/prep.py -> romance/pipeline/trace.py (24 colours, 0.3 scale) -> hand pass here.
// Alt's CurryHouse.jsx (`curry-house`) is untouched and stays registered.
import { CurryChoice, CurryButterDoor, CurryButterInt, CurryButterTable, CurryThali, CurryNaanLift, CurrySauce, CurryNaanDip, CurryNaanFeed, CurryButterBite, CurryLassi, CurryNapkin } from './Butter.jsx';
import { CurryKatsuDoor, CurryKatsuInt, CurryKatsuCounter, CurryKatsuDish, CurryKatsuCut, CurryKatsuPour, CurryKatsuClose, CurryKatsuFeed, CurryKatsuBite, CurryKatsuWater, CurryKatsuNapkin, CurryNapkinFold } from './Katsu.jsx';

export const CURRY = {
  'curry-choice': CurryChoice,
  'curry-butter-door': CurryButterDoor, 'curry-butter-int': CurryButterInt, 'curry-butter-table': CurryButterTable,
  'curry-thali': CurryThali, 'curry-naan-lift': CurryNaanLift, 'curry-sauce': CurrySauce, 'curry-naan-dip': CurryNaanDip,
  'curry-naan-feed': CurryNaanFeed, 'curry-butter-bite': CurryButterBite, 'curry-lassi': CurryLassi, 'curry-napkin': CurryNapkin,
  'curry-katsu-door': CurryKatsuDoor, 'curry-katsu-int': CurryKatsuInt, 'curry-katsu-counter': CurryKatsuCounter,
  'curry-katsu-dish': CurryKatsuDish, 'curry-katsu-cut': CurryKatsuCut, 'curry-katsu-pour': CurryKatsuPour, 'curry-katsu-close': CurryKatsuClose,
  'curry-katsu-feed': CurryKatsuFeed, 'curry-katsu-bite': CurryKatsuBite, 'curry-katsu-water': CurryKatsuWater,
  'curry-katsu-napkin': CurryKatsuNapkin, 'curry-napkin-fold': CurryNapkinFold,
};
export default CURRY;
