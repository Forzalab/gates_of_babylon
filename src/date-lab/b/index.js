// Builder B: export every variant as { id, track, title, theme, horror (0-5), builder: 'B', Component }.
// Component gets { rm } and draws on a 1920x1080 stage.
import Menu4 from './menu4/Menu4.jsx';
import Menu5 from './menu5/Menu5.jsx';
import Cam4 from './cam4/Cam4.jsx';
import Cam5 from './cam5/Cam5.jsx';
import Cam6 from './cam6/Cam6.jsx';
import Fx1 from './fx/Fx1.jsx';
import Fx2 from './fx/Fx2.jsx';
import Anim3 from './anim3/Anim3.jsx';
import Anim4 from './anim4/Anim4.jsx';

export const VARIANTS = [
  { id: 'cam-4', track: 'camera', title: 'Hitchcock: a true dolly-zoom on her door, then on the slippers', theme: 'Hitchcock suspense (show the bomb first) x Saul Bass x the Vertigo effect', horror: 4, builder: 'B', Component: Cam4 },
  { id: 'cam-5', track: 'camera', title: 'Found footage: the camera finds her face before you do', theme: 'Ju-On x found footage x Lain OSD: the frame notices her', horror: 5, builder: 'B', Component: Cam5 },
  { id: 'cam-6', track: 'camera', title: 'Anno: static holds, hard cut-ins, serif cards, the gates vote pink', theme: 'Evangelion x Anno cutting: nothing moves, and that is the threat', horror: 3, builder: 'B', Component: Cam6 },
  { id: 'fx-1', track: 'fx', title: 'Demo-path FX reel: every sound has a body', theme: 'Mushishi x Lynch room tone: each SFX gets a visible twin + a caption', horror: 3, builder: 'B', Component: Fx1 },
  { id: 'fx-2', track: 'fx', title: 'The monitor wall: nine effects, full vs still, side by side', theme: 'Kairo (Pulse): a room of CRTs, each playing one effect forever', horror: 2, builder: 'B', Component: Fx2 },
  { id: 'anim-3', track: 'anim', title: 'Junji Ito creep: it only moves when you look away', theme: 'Uzumaki spirals x Weeping-Angel gaze rules: your mouse is your eyes', horror: 5, builder: 'B', Component: Anim3 },
  { id: 'anim-4', track: 'anim', title: 'Paprika parade: every prop morphs and joins her collection', theme: 'Satoshi Kon dream-morph parade: the parade of everything she kept', horror: 3, builder: 'B', Component: Anim4 },
  { id: 'menu-4', track: 'menu', title: 'Bandersnatch letterbox: the timer drains into her cup', theme: 'Bandersnatch x cinema scope x Ju-On quiet: the timer is hers', horror: 3, builder: 'B', Component: Menu4 },
  { id: 'menu-5', track: 'menu', title: 'Circuit wires: her wire is already soldered', theme: 'Serial Experiments Lain x circuit board: the drag lies, the OR gets desoldered', horror: 3, builder: 'B', Component: Menu5 },
];
