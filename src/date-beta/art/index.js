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
import '../theme.js'; // fonts + --cond/--jp tokens: the art must not depend on the chrome's CSS
import './art.css';

// splash = the old fake-site START page: kept registered (Tony may reuse it), no scene points at it any more.
export const ART = { splash: Splash, rooftop: Rooftop, train: Train, naan: NaanPlatform, blackout: Blackout, basement: Basement,
  // fallback art for missing BG files (fallbacks.js maps the ids here)
  door: Door, genkan: Genkan, teatable: TeaTable, cafe: Cafe };
