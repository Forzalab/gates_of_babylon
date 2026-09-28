// Builder B: export every variant as { id, track, title, theme, horror (0-5), builder: 'B', Component }.
// Component gets { rm } and draws on a 1920x1080 stage.
import Menu4 from './menu4/Menu4.jsx';
import Menu5 from './menu5/Menu5.jsx';
import Cam4 from './cam4/Cam4.jsx';

export const VARIANTS = [
  { id: 'cam-4', track: 'camera', title: 'Hitchcock: a true dolly-zoom on her door, then on the slippers', theme: 'Hitchcock suspense (show the bomb first) x Saul Bass x the Vertigo effect', horror: 4, builder: 'B', Component: Cam4 },
  { id: 'menu-4', track: 'menu', title: 'Bandersnatch letterbox: the timer drains into her cup', theme: 'Bandersnatch x cinema scope x Ju-On quiet: the timer is hers', horror: 3, builder: 'B', Component: Menu4 },
  { id: 'menu-5', track: 'menu', title: 'Circuit wires: her wire is already soldered', theme: 'Serial Experiments Lain x circuit board: the drag lies, the OR gets desoldered', horror: 3, builder: 'B', Component: Menu5 },
];
