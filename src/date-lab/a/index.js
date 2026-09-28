// Builder A: export every variant as { id, track, title, theme, horror (0-5), builder: 'A', Component }.
// Component gets { rm } and draws on a 1920x1080 stage. Shared kit: ./kit (timeline + menu state machine are pure, node-tested).
import Tarot from './menu/Tarot.jsx';
import Truth from './menu/Truth.jsx';
import Ddlc from './menu/Ddlc.jsx';
import Shinkai from './camera/Shinkai.jsx';
import Kubrick from './camera/Kubrick.jsx';
import Kon from './camera/Kon.jsx';

const A = (id, track, title, theme, horror, Component) => ({ id, track, title, theme, horror, builder: 'A', Component });

export const VARIANTS = [
  A('menu-1', 'menu', 'Tarot: her card face-up, yours face-down', 'CLAMP arcana x Suspiria candlelight: fate is dealt by her', 2, Tarot),
  A('menu-2', 'menu', 'Truth table: tick a row, her column is pre-filled', 'Hyouka prop inserts x Wes Anderson planimetric x Suspicion: the output is already written', 1, Truth),
  A('menu-3', 'menu', 'DDLC: she edits the menu while you read it', 'DDLC / Monika x Funny Games x meta-horror: the choice UI is her territory', 5, Ddlc),
  A('cam-1', 'camera', 'Shinkai light: tilt-up, flare, time-lapse, rack focus', 'Shinkai x Malick magic hour x a stopped clock: light tells time, except hers', 1, Shinkai),
  A('cam-2', 'camera', 'Kubrick symmetry: a true one-point dolly, tubes die, she is nearer', 'Kubrick x Evangelion corridor holds x corridor dread: everything in its place', 3, Kubrick),
  A('cam-3', 'camera', 'Satoshi Kon: match cuts + pull-backs, every frame is her frame', 'Perfect Blue / Millennium Actress x image-horror: the shot was a picture she put there', 4, Kon),
];
