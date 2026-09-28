// bg id (scenes.json) -> art component. Each takes { props, rm, onStart }.
import Splash from './Splash.jsx';
import Rooftop from './Rooftop.jsx';
import Train from './Train.jsx';
import NaanBoard from './Naan.jsx';
import Blackout from './Blackout.jsx';
// scenes 6-10 (alt account)
import Platform from './Platform.jsx';
import Underpass from './Underpass.jsx';
import ApartmentExt from './ApartmentExt.jsx';
import Stairs from './Stairs.jsx';
import Genkan from './Genkan.jsx';
import './art.css';

export const ART = { splash: Splash, rooftop: Rooftop, train: Train, naan: NaanBoard, blackout: Blackout,
  platform: Platform, underpass: Underpass, apartment: ApartmentExt, stairs: Stairs, genkan: Genkan };
