// G1 STATION + TRAIN (scenes-r3/PLAN.md, Agent 4): art id -> component ({ props, rm }), spread into ART in art/index.js.
// station-gate-r3 = the plan's `station-gate` (that id is already a SHOT alias used by seq-station + variant-v1).
import StationGate from './StationGate.jsx';
import StationAds, { StationAdsInsert } from './StationAds.jsx';
import TrainSun from './TrainSun.jsx';
import TrainRain from './TrainRain.jsx';
import PlatformRain from './PlatformRain.jsx';

export const R3_STATION = {
  'station-gate-r3': StationGate,
  'station-ads': StationAds,
  'station-ads-insert': StationAdsInsert,
  'train-sun': TrainSun,
  'train-rain': TrainRain,
  'platform-rain': PlatformRain,
};
export default R3_STATION;
