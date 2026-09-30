// scenes-r3 G2 RAIN WALK + G3 HER STREET -> NIGHT (Agent 5): art id -> component ({ props, rm }). Spread into ART.
// Refs, pipeline, deltas: research/sprint-0930/scenes-r3/G23-NOTES.md. Palette tokens (shared): ./tokens.js.
import RainSidewalk from './RainSidewalk.jsx';
import RainAlley from './RainAlley.jsx';
import RainEave from './RainEave.jsx';
import RainEnding from './RainEnding.jsx';
import StreetBluehour from './StreetBluehour.jsx';
import HerBuilding from './HerBuilding.jsx';
import CurryStreet from './CurryStreet.jsx';
import EscapeNight from './EscapeNight.jsx';

export const R3_RAIN = {
  'rain-sidewalk': RainSidewalk, 'rain-alley': RainAlley, 'rain-eave': RainEave, 'rain-ending': RainEnding,
  'street-bluehour': StreetBluehour, 'her-building': HerBuilding, 'curry-street': CurryStreet,
  'escape-night': EscapeNight,
};
export default R3_RAIN;
