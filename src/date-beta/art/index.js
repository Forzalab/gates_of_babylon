// bg id (scenes.json) -> art component. Each takes { props, rm, onStart }.
import Splash from './Splash.jsx';
import Rooftop from './Rooftop.jsx';
import Train from './Train.jsx';
import NaanPlatform from './NaanPlatform.jsx'; // the naan scene: ?platform=v1|v2|v3, default v3
import Blackout from './Blackout.jsx';
import Basement from './Basement.jsx';
import Door from './Door.jsx';
import Genkan from './Genkan.jsx';
import TeaTable from './TeaTable.jsx';
import Cafe from './Cafe.jsx';
import CurryHouse from './CurryHouse.jsx'; // v2-curry: noren, curry menu, clock at 3:00 (UX fix pack)
// the night walk after the blackout (alt account): platform = the naan station at night (NaanPlatform v3)
import Platform from './Platform.jsx';
import Underpass from './Underpass.jsx';
import ApartmentExt from './ApartmentExt.jsx';
import Stairs from './Stairs.jsx';
import GenkanArrival from './GenkanArrival.jsx';
// T1b interiors + basement (sprint-0930): cellar, park, ... (spread LAST so the real park beats obbp's Rooftop fallback)
import { INTERIORS } from './interiors/index.js';
import '../theme.js'; // fonts + --cond/--jp tokens: the art must not depend on the chrome's CSS
import './art.css';

// splash = the old fake-site START page: kept registered (Tony may reuse it), no scene points at it any more.
// naan-platform = the same station under its own name (alt's notes call it that); the naan scene uses `naan`.
import { ROMANCE } from './romance/index.js';
import { SHOTS } from './shots/index.js'; // camera tricks over these ids (closeup / insert / reaction / establish)
import { SCENE_A } from './scene-a/index.js'; // rooftop-noon/-warm + the pink bento shots (scene-a/ART.md)
import { SHOP } from './shop/index.js'; // SHOP rebuild (research/sprint-0930/shop/SHOTLIST.md): shop-* traced shots
import { R3_STATION } from './r3-station/index.js'; // scenes-r3 G1: station-gate-r3, station-ads(-insert), train-sun/-rain, platform-rain
import { R3_RAIN } from './r3-rain/index.js'; // scenes-r3 G2 + G3: the rain walk, her street -> night, curry-street, escape-night
import { CURRY } from './curry/index.js'; // the curry rebuild: street choice + butter-chicken / katsu chains (research/sprint-0930/curry)
import { TOWN } from './town/index.js'; // the town walk to lunch (research/sprint-0930/town): town-street / -crossing / -board
// park: no art yet, falls back to the rooftop (sakura-free sky) so it never renders a grey box.
export const ART = { ...ROMANCE, ...SHOTS, ...SCENE_A, park: Rooftop, splash: Splash, rooftop: Rooftop, train: Train, naan: NaanPlatform, 'naan-platform': NaanPlatform, blackout: Blackout, basement: Basement,
  ...R3_STATION,
  ...R3_RAIN,
  ...CURRY,
  ...SHOP,
  ...TOWN,
  platform: Platform, underpass: Underpass, apartment: ApartmentExt, stairs: Stairs, 'genkan-in': GenkanArrival,
  // fallback art for missing BG files (fallbacks.js maps the ids here)
  door: Door, genkan: Genkan, teatable: TeaTable, cafe: Cafe, 'curry-house': CurryHouse, ...INTERIORS };
