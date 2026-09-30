// T1b INTERIORS+BASEMENT: art id -> component (each takes { props, rm }). The integrator spreads this map into ART in
// art/index.js (AFTER the `park: Rooftop` fallback, so the real park wins).
import Cellar from './Cellar.jsx';
import Park from './Park.jsx';
import ApartmentTrace from './ApartmentTrace.jsx';
import SittingRoom from './SittingRoom.jsx';
import Bedroom from './Bedroom.jsx';
import GenkanV2 from './GenkanV2.jsx';

export const INTERIORS = { cellar: Cellar, park: Park, 'apartment-trace': ApartmentTrace, 'sitting-room': SittingRoom, bedroom: Bedroom,
  // genkan v2 (alt, cb1ed9a) REPLACES the v1 genkan-in art for genkan-in + story's genkan-talk (no patch needed)
  'genkan-in': GenkanV2, 'genkan-v2': GenkanV2 };
export default INTERIORS;
