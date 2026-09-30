// T1b INTERIORS+BASEMENT: art id -> component (each takes { props, rm }). The integrator spreads this map into ART in
// art/index.js (AFTER the `park: Rooftop` fallback, so the real park wins).
import Cellar from './Cellar.jsx';
import Park from './Park.jsx';
import ApartmentTrace from './ApartmentTrace.jsx';
import SittingRoom from './SittingRoom.jsx';

export const INTERIORS = { cellar: Cellar, park: Park, 'apartment-trace': ApartmentTrace, 'sitting-room': SittingRoom };
export default INTERIORS;
