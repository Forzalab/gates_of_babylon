// cam-1 SHINKAI LIGHT (horror 1). School: Makoto Shinkai (Your Name / 5 cm per Second) x Terrence Malick magic-hour tilt-ups
// x a J-horror stopped clock at the edge of frame (horror 1: one wrong detail, nobody comments).
// Central theme: LIGHT TELLS TIME, EXCEPT HERS. The sky goes noon -> dusk -> night in three held match-cuts; the tower clock never moves.
// Grammar: establishing tilt-up (railing -> sky) with a lens flare whose ghosts ride the light->centre axis, out-of-focus foreground
// petals on a near plane (parallax), a locked-off time-lapse, a sky -> train-window match cut + pull-back, a rack focus from the
// window to a foreground strap and back, a rain-on-lens truck along the platform, a tilt up her stairs into the door lamp's flare.
// RM: one held frame per shot, hard cuts, no flare drift, no fades; the time-lapse keeps its 3 hard cuts (already cuts).
import { rng } from '../../../date-beta/art/util.js';
import Rooftop from '../../../date-beta/art/Rooftop.jsx';
import Train from '../../../date-beta/art/Train.jsx';
import Platform from '../../../date-beta/art/Platform.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import CameraPiece, { parallax, screen } from '../kit/Camera.jsx';
import { camTransform, clamp } from '../kit/time.js';
import { Flare, Petals, LensRain, Bloom } from './lens.jsx';
import './shinkai.css';

const NOON = { clock: 'noon' }, TRAIN = { zoom: false }, GONE = { train: 'gone' }, AJAR = { door: 'ajar' };
const SUN = [1760, -60]; // the sun, just above the rooftop frame, top right (scene coords)

function Stars({ seed = 3, n = 90 }) {
  const rnd = rng(seed);
  return (
    <svg className="fg" viewBox="0 0 1920 1080" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={rnd() * 1920} cy={rnd() * 620} r={0.8 + rnd() * 2.2} fill="#fff" opacity={0.4 + rnd() * 0.6} />)}
      <path d="M1580 150 a70 70 0 1 0 60 110 a56 56 0 1 1 -60 -110Z" fill="#fff6dc" opacity=".92" />
    </svg>
  );
}

// Shinkai cloud streaks, lit from below by the low sun (dusk) — held, they only move on the cuts
function DuskClouds() {
  return (
    <svg className="fg" viewBox="0 0 1920 1080" aria-hidden="true">
      {[[120, 190, 900, 34], [560, 300, 1100, 26], [980, 120, 700, 22], [300, 420, 640, 18]].map(([x, y, w, h], i) => (
        <g key={i}>
          <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={h} fill="#6e3a7e" opacity=".55" />
          <ellipse cx={x + w / 2} cy={y + h * 0.55} rx={w / 2.1} ry={h * 0.35} fill="#ffb48a" opacity=".7" />
        </g>
      ))}
    </svg>
  );
}

// A near-plane hanging strap for the rack focus (drawn big, very close to the lens).
function NearStrap({ pose, blur }) {
  const p = parallax(pose, 2.4);
  return (
    <div className="fg" style={{ transform: camTransform(p), filter: `blur(${blur}px)` }} aria-hidden="true">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">
        <rect x="286" y="-200" width="34" height="520" rx="8" fill="#e6e0cf" stroke="#8d8676" strokeWidth="5" />
        <path d="M303 310 L240 440 Q232 466 262 466 H344 Q374 466 366 440Z" fill="none" stroke="#f4f2ea" strokeWidth="24" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const SHOTS = [
  {
    id: 'tilt-up', dur: 6000, Scene: Rooftop, props: NOON, cut: 'fade',
    keys: [{ t: 0, x: 900, y: 730, s: 1.4 }, { t: 900, x: 900, y: 730, s: 1.4 }, { t: 6000, x: 1010, y: 385, s: 1.4 }],
    sub: [{ at: 1200, text: 'Lunch on the roof. The sky kept its own time.' }],
    layers: ({ pose, t, rm }) => {
      const [lx, ly] = screen(pose, ...SUN);
      return (<>
        <div className="grade g-noon" />
        <Petals pose={pose} t={t} rm={rm} />
        <Flare lx={lx} ly={ly} strength={0.95} uid="f1" />
      </>);
    },
  },
  {
    id: 'time-lapse', dur: 5400, Scene: Rooftop, props: NOON, cut: 'hard',
    keys: [{ t: 0, x: 1010, y: 385, s: 1.4 }, { t: 5400, x: 1010, y: 385, s: 1.4 }],
    sub: [{ at: 0, text: 'Noon.' }, { at: 1800, text: 'Dusk.' }, { at: 3600, text: 'Night. The tower still said twelve.' }],
    layers: ({ local, pose }) => {
      const ph = local < 1800 ? 0 : local < 3600 ? 1 : 2;
      const [lx, ly] = screen(pose, ...SUN);
      return (<>
        {ph === 0 && <><div className="grade g-noon" /><Flare lx={lx} ly={ly} uid="f2" /></>}
        {ph === 1 && <><div className="grade g-dusk" /><DuskClouds /><Flare lx={1500} ly={900} tint="#ffb070" strength={0.8} uid="f3" /></>}
        {/* at night the clock face is the only lit thing in frame, and it still reads 12:00 */}
        {ph === 2 && <><div className="grade g-night" /><Stars /><Bloom spots={[[...screen(pose, 1140, 430), 150 * pose.s, 150 * pose.s, '#ffe6a8']]} opacity={0.6} /></>}
      </>);
    },
  },
  {
    id: 'window', dur: 6600, Scene: Train, props: TRAIN, cut: 'hard',
    // match cut: the night sky becomes the window's dusk sky, then the camera pulls back to find the carriage
    keys: [{ t: 0, x: 620, y: 330, s: 10, blur: 0 }, { t: 500, x: 620, y: 330, s: 10, blur: 0 }, { t: 1500, x: 640, y: 380, s: 3.4, blur: 0, e: 'in' }, { t: 2600, x: 700, y: 520, s: 1.35, blur: 0, e: 'out' }, { t: 3400, x: 700, y: 520, s: 1.35, blur: 6, e: 'sine' },
      { t: 5200, x: 720, y: 530, s: 1.32, blur: 6 }, { t: 6000, x: 730, y: 530, s: 1.3, blur: 0, e: 'sine' }, { t: 6600, x: 735, y: 530, s: 1.3, blur: 0 }],
    rmKey: { x: 700, y: 520, s: 1.35 },
    sub: [{ at: 900, text: 'The AND Line. Home in twelve stops.' }],
    layers: ({ pose, local, rm }) => {
      // rack focus: BG blur rises while the strap sharpens (and back); RM holds the strap soft, BG sharp
      const fg = rm ? 8 : local < 2600 ? 10 : local < 3400 ? 10 * (1 - (local - 2600) / 800) : local < 5200 ? 0 : clamp((local - 5200) / 800) * 10;
      return (<>
        <div className="grade g-dusk-in" />
        <div className="beam" />
        <NearStrap pose={pose} blur={fg} />
      </>);
    },
  },
  {
    id: 'platform', dur: 6600, Scene: Platform, props: GONE, cut: 'fade',
    keys: [{ t: 0, x: 780, y: 560, s: 1.32 }, { t: 6600, x: 1200, y: 520, s: 1.32, e: 'inOut' }],
    sub: [{ at: 700, text: 'Her stop. The rain followed us off the train.' }],
    inScene: () => <Bloom spots={[[330, 117, 220, 40, '#bfe3ff'], [770, 117, 220, 40, '#bfe3ff'], [1210, 117, 220, 40, '#bfe3ff'], [1650, 117, 220, 40, '#bfe3ff'], [960, 260, 300, 70, '#9fb0ff']]} />,
    layers: () => (<><div className="grade g-blue" /><LensRain /></>),
  },
  {
    id: 'her-door', dur: 7000, Scene: Stairs, props: AJAR, cut: 'fade',
    keys: [{ t: 0, x: 640, y: 780, s: 1.5 }, { t: 1000, x: 640, y: 780, s: 1.5 }, { t: 6200, x: 1150, y: 420, s: 1.25 }, { t: 7000, x: 1150, y: 420, s: 1.25 }],
    sub: [{ at: 1400, text: 'Unit 12. Her light was already on.' }, { at: 4600, text: 'NANDA: Obviously you’ll remember.' }],
    inScene: () => <Bloom spots={[[1400, 91, 160, 30, '#fff4d0'], [1575, 510, 40, 300, '#ffcf7a']]} opacity={0.7} />,
    layers: ({ pose }) => {
      const [lx, ly] = screen(pose, 1400, 91);
      return (<><div className="grade g-warm" /><Flare lx={lx} ly={ly} ghost="heart" tint="#ffd9a0" strength={0.8} uid="f4" /></>);
    },
  },
];

export default function Shinkai({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="shinkai" tag="cam-1 · shinkai light" />;
}
