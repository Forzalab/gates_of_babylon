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
import Integrated from './nanda/Integrated.jsx';
import Bench from './nanda/Bench.jsx';
import Kyoani from './anim/Kyoani.jsx';
import Trigger from './anim/Trigger.jsx';
import CupTypes from './menu2/CupTypes.jsx';
import Ddlc2 from './menu2/Ddlc2.jsx';
import Tarot2 from './menu2/Tarot2.jsx';
import FrameFinds from './camera2/FrameFinds.jsx';
import ThirdCup2 from './closeup2/ThirdCup2.jsx';

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
  A('nanda-1', 'nanda', 'Lit like the room: platform, door, genkan, third cup', 'Ghibli/KyoAni compositing x Deakins motivated light x she is closer each time', 2, Integrated),
  A('nanda-2', 'nanda', 'Integration test bench: raw | lit split, 4 scenes', 'VFX compositing dailies x genga/douga comparison sheets: prove she is in the room', 0, Bench),
  A('anim-1', 'anim', 'KyoAni idle life: all 10 scenes + her, the world breathes', 'Kyoto Animation small-motion realism x Ozu pillow shots: the world breathes (and so does she)', 1, Kyoani),
  A('anim-2', 'anim', 'Trigger limited anim: smear, impact frame, focus lines, SFX', 'Studio Trigger / Gainax x Edgar Wright smash cuts: every beat hits like she meant it', 2, Trigger),
  // ---- round 2 ----
  A('menu-h1-r2', 'menu', 'The Cup That Types: her cursor retypes your face-down card', 'hybrid menu-1 x menu-3: tarot candle table x DDLC live edit: she rewrites your card while the candle burns', 4, CupTypes),
  A('menu-3-r2', 'menu', 'DDLC r2: she rewrites YOUR line before the menu exists', 'DDLC / Monika x Funny Games x meta-horror: the choice UI (and your dialogue) is her territory', 5, Ddlc2),
  A('menu-1-r2', 'menu', 'Tarot r2: her hand is on your card; the drawn card is nailed', 'CLAMP arcana x Suspiria candlelight: fate is dealt by her (read without captions)', 2, Tarot2),
  A('closeup-3-r2', 'closeup', 'The third cup r2: her open hand slides it to you', "Ozu low-table x Get Out teacup x Notorious rack focus: it's always three of us (a gentle hand)", 4, ThirdCup2),
  A('cam-h-r2-a', 'camera', 'The Frame Keeps Finding Her (A): camcorder AF + D.ZOOM drive Kon match cuts', 'hybrid cam-3 x cam-5: Satoshi Kon nested frames x Ju-On found footage: you are the one filming, every frame is hers', 5, FrameFinds),
];
