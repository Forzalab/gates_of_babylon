// bg id (scenes.json) -> art component. Each takes { props, rm, onStart }.
import Splash from './Splash.jsx';
import Rooftop from './Rooftop.jsx';
import Train from './Train.jsx';
import NaanBoard from './Naan.jsx';
import Blackout from './Blackout.jsx';
import './art.css';

export const ART = { splash: Splash, rooftop: Rooftop, train: Train, naan: NaanBoard, blackout: Blackout };
