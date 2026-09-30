// T1a ROMANCE-SCENES: art id -> component (each takes { props, rm }). The integrator merges this map into art/index.js.
import { StreetDay, StreetDusk } from './Street.jsx';
import RailCrossing from './RailCrossing.jsx';
import ShopStreet from './ShopStreet.jsx';
import { CrossingDay, CrossingNight } from './Crossings.jsx';

export const ROMANCE = {
  'street-day': StreetDay, 'street-dusk': StreetDusk, 'shop-street': ShopStreet,
  'rail-crossing': RailCrossing, 'crossing-day': CrossingDay, 'crossing-night': CrossingNight,
};
export default ROMANCE;
