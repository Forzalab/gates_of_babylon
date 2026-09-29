// bg id (scenes.json) -> art component. Each takes { props, rm, onStart }.
import Splash from './Splash.jsx';
import Rooftop from './Rooftop.jsx';
import Train from './Train.jsx';
import NaanBoard from './Naan.jsx';
import Blackout from './Blackout.jsx';
import Basement from './Basement.jsx';
import '../theme.js'; // fonts + --cond/--jp tokens: the art must not depend on the chrome's CSS
import './art.css';

// splash = the old fake-site START page: kept registered (Tony may reuse it), no scene points at it any more.
export const ART = { splash: Splash, rooftop: Rooftop, train: Train, naan: NaanBoard, blackout: Blackout, basement: Basement };
