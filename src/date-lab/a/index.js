// Builder A: export every variant as { id, track, title, theme, horror (0-5), builder: 'A', Component }.
// Component gets { rm } and draws on a 1920x1080 stage. Shared kit: ./kit (timeline + menu state machine are pure, node-tested).
import Tarot from './menu/Tarot.jsx';
import Truth from './menu/Truth.jsx';
import Ddlc from './menu/Ddlc.jsx';
import Shinkai from './camera/Shinkai.jsx';
import Kubrick from './camera/Kubrick.jsx';
import Kon from './camera/Kon.jsx';
import Bento from './closeup/Bento.jsx';
import Phone from './closeup/Phone.jsx';
import ThirdCup from './closeup/ThirdCup.jsx';
import Shrine from './closeup/Shrine.jsx';
import Pin from './closeup/Pin.jsx';

const A = (id, track, title, theme, horror, Component) => ({ id, track, title, theme, horror, builder: 'A', Component });

export const VARIANTS = [
  A('menu-1', 'menu', 'Tarot: her card face-up, yours face-down', 'CLAMP arcana x Suspiria candlelight: fate is dealt by her', 2, Tarot),
  A('menu-2', 'menu', 'Truth table: tick a row, her column is pre-filled', 'Hyouka prop inserts x Wes Anderson planimetric x Suspicion: the output is already written', 1, Truth),
  A('menu-3', 'menu', 'DDLC: she edits the menu while you read it', 'DDLC / Monika x Funny Games x meta-horror: the choice UI is her territory', 5, Ddlc),
  A('cam-1', 'camera', 'Shinkai light: tilt-up, flare, time-lapse, rack focus', 'Shinkai x Malick magic hour x a stopped clock: light tells time, except hers', 1, Shinkai),
  A('cam-2', 'camera', 'Kubrick symmetry: a true one-point dolly, tubes die, she is nearer', 'Kubrick x Evangelion corridor holds x corridor dread: everything in its place', 3, Kubrick),
  A('cam-3', 'camera', 'Satoshi Kon: match cuts + pull-backs, every frame is her frame', 'Perfect Blue / Millennium Actress x image-horror: the shot was a picture she put there', 4, Kon),
  A('closeup-1', 'closeup', 'Bento pick + SOUR pucker', 'Shokugeki food reaction x Tampopo top-down x the echo rule: what you pick, she packs forever', 1, Bento),
  A('closeup-2', 'closeup', 'Phone face-down, flipped without looking', 'Kuleshov effect x Rear Window inserts x yandere tells: what she hides, she hides without looking', 3, Phone),
  A('closeup-3', 'closeup', 'The third cup: steam writes OR, the cup slides to you', "Ozu low-table x Get Out teacup x Notorious rack focus: it's always three of us (you are Input B)", 4, ThirdCup),
  A('closeup-4', 'closeup', "The shrine circuit: your circuit, today's time, kept", 'Mushishi reliquary macro x patient push-in x 4th-wall memory: she enshrines what you make', 3, Shrine),
  A('closeup-5', 'closeup', 'Her pin states: hum, flicker, red, dark', 'Magical-girl brooch macro x manga two-panel reaction x mood ring: the pin is the truth her face hides', 2, Pin),
];
