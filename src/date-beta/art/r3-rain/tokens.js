// Time-of-day palette tokens (scenes-r3 PLAN.md "Art style" 3), SHARED with G1: the wash / vignette / window / glow
// colours are G1's own TOD (art/r3-station/parts.jsx), so the platform at 5:20 grades exactly like the crossing and the
// rain walk after it. G2/G3 add only what G1 has no use for: lamp head, rain opacity, wet-ground sheen.
// Timeline: crossing 5:30 + rain walk = rain-dusk | rain stops = overcast | her street 7:00 = bluehour |
// home 7:05 + escape 8 PM+ = night | the curry-house exit 3:40 = afternoon.
import { TOD as SHARED } from '../r3-station/parts.jsx';

const EXTRA = {
  afternoon: { lamp: '#fff6e0', rain: null, wet: null },
  overcast: { lamp: '#f4f0e0', rain: ['#e8f0f8', 0.22], wet: '#dfe9f2' },
  'rain-dusk': { lamp: '#ffe2a8', rain: [SHARED['rain-dusk'].rain, 0.34], wet: '#a9bddc' },
  bluehour: { lamp: '#fff0c0', rain: null, wet: '#c9d4ff' },
  night: { lamp: '#fff0c4', rain: null, wet: '#9fb4ff' },
};
export const TOD = Object.fromEntries(Object.entries(SHARED).map(([k, t]) => [k, { ...t, win: t.window, ...EXTRA[k] }]));
export default TOD;
