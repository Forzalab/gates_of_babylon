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
// the night walk after the blackout (alt account): platform = the naan station at night (NaanPlatform v3)
import Platform from './Platform.jsx';
import Underpass from './Underpass.jsx';
import ApartmentExt from './ApartmentExt.jsx';
import Stairs from './Stairs.jsx';
import GenkanArrival from './GenkanArrival.jsx';
import '../theme.js'; // fonts + --cond/--jp tokens: the art must not depend on the chrome's CSS
import './art.css';

// splash = the old fake-site START page: kept registered (Tony may reuse it), no scene points at it any more.
// naan-platform = the same station under its own name (alt's notes call it that); the naan scene uses `naan`.
import { ROMANCE } from './romance/index.js';
// park: no art yet, falls back to the rooftop (sakura-free sky) so it never renders a grey box.
export const ART = { ...ROMANCE, park: Rooftop, splash: Splash, rooftop: Rooftop, train: Train, naan: NaanPlatform, 'naan-platform': NaanPlatform, blackout: Blackout, basement: Basement,
  platform: Platform, underpass: Underpass, apartment: ApartmentExt, stairs: Stairs, 'genkan-in': GenkanArrival,
  // fallback art for missing BG files (fallbacks.js maps the ids here)
  door: Door, genkan: Genkan, teatable: TeaTable, cafe: Cafe };
