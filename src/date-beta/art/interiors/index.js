// T1b INTERIORS+BASEMENT: art id -> component (each takes { props, rm }). The integrator spreads this map into ART in
// art/index.js (AFTER the `park: Rooftop` fallback, so the real park wins).
import Cellar from './Cellar.jsx';

export const INTERIORS = { cellar: Cellar };
export default INTERIORS;
