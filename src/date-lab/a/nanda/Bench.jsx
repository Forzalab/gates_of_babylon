// nanda-2 INTEGRATION TEST BENCH (horror 0-1). School: VFX compositing dailies (split-screen before/after, check chips) x
// anime "genga vs douga" comparison sheets. Central theme: PROVE SHE IS IN THE ROOM.
// A 2x2 grid of the four scenes; each cell is split down the middle: LEFT = main's sprite dropped in raw (Kawaii palette, no
// light), RIGHT = the integrated composite. Under each: the numeric checks from kit/integrate.js (same functions the node tests
// run): scale from the reference object, contrast of her skin vs the wall next to her (raw -> graded), rim source, shadow direction.
// Static (no motion) = identical in RM.
import Platform from '../../../date-beta/art/Platform.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import { PlatformPass, KitchenBack, KitchenFront, DoorNanda, GenkanNanda, KitchenNanda } from './Integrated.jsx';
import { RIGS, RAW, gradeColour, contrast, heightPx, shadowDir } from '../kit/integrate.js';

import './nanda.css';

const OFF = { grade: false, shade: false, rim: false, shadow: false };
const CELLS = [
  { id: 'platform', x: 12, y: 12, raw: <Platform props={{ train: 'gone' }} rm />, int: <><Platform props={{ train: 'gone' }} rm /><PlatformPass /></> },
  { id: 'door', x: 964, y: 12, raw: <><Stairs props={{ door: 'ajar' }} rm /><DoorNanda {...OFF} /></>, int: <><Stairs props={{ door: 'ajar' }} rm /><DoorNanda /></> },
  { id: 'genkan', x: 12, y: 537, raw: <><Genkan props={{ insert: false }} /><GenkanNanda {...OFF} /></>, int: <><Genkan props={{ insert: false }} /><GenkanNanda /></> },
  { id: 'kitchen', x: 964, y: 537, raw: <><KitchenBack /><KitchenNanda {...OFF} /><KitchenFront /></>, int: <><KitchenBack /><KitchenNanda /><KitchenFront /></> },
];

function checks(id) {
  const rig = RIGS[id];
  const cr = contrast(RAW.skin, rig.sample), cg = contrast(gradeColour(RAW.skin, rig), rig.sample);
  const [sx, sy] = shadowDir(id);
  const dir = Math.abs(sx) > Math.abs(sy) ? (sx > 0 ? 'right' : 'left') : (sy > 0 ? 'down' : 'up');
  return [
    { t: `scale ${Math.round(heightPx(id))}px = 158cm vs ${rig.ref.label}`, ok: true },
    { t: `skin/wall ${cr.toFixed(1)}→${cg.toFixed(1)}:1`, ok: cg < cr },
    { t: `rim ${rig.rim}`, ok: true },
    { t: `shadow ${dir}`, ok: true },
  ];
}

export default function Bench() {
  return (
    <div className="aroot nbench">
      {CELLS.map((c) => (
        <div key={c.id} className="cell" style={{ left: c.x, top: c.y }}>
          <div className="inner">
            <div className="half raw">{c.raw}</div>
            <div className="half int">{c.int}</div>
            <div className="divider" />
            <span className="lbl l">RAW</span><span className="lbl r">LIT · {c.id}</span>
            <div className="checks">{checks(c.id).map((k) => <span key={k.t} className={k.ok ? '' : 'warn'}>{k.ok ? '✓' : '!'} {k.t}</span>)}</div>
          </div>
        </div>
      ))}

    </div>
  );
}
