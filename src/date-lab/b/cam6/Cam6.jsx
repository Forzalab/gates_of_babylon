// cam-6 · ANNO / EVANGELION (horror 3). Central theme: "nothing moves, and that is the threat".
// Anno grammar: long static holds where only the rain or a strap moves, power lines + cicadas, HARD cut-ins to one
// detail, big compressed-serif title cards in an L layout, a MAGI-style vote (the three gates all approve her),
// a hexagon warning "PATTERN PINK", and a next-episode card. No camera ever travels: every framing is a cut, so the
// reduced-motion version is the same film (only the 1 Hz warning blink holds solid).
import { useMemo } from 'react';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Platform from '../../../date-beta/art/Platform.jsx';
import Train from '../../../date-beta/art/Train.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { LabRoot, Markup, Sub, OrText, useClock, useShotSound } from '../shared/ui.jsx';
import { build, shotAt, camTransform } from '../shared/timeline.js';
import { ART, placed } from '../shared/art.js';
import './cam6.css';

const hold = (x, y, s) => [[0, { x, y, s }]];
export const SHOTS = build([
  { id: 'card1', kind: 'card', dur: 3000, card: 'ep', cues: [[0, 'cut'], [300, 'breath']] },
  { id: 'poles', kind: 'art', art: 'apartment', dur: 5000, cam: hold(960, 540, 1), beds: ['cicada'], text: 'Four floors. One window lit.', textAt: 1800 },
  { id: 'wires', kind: 'art', art: 'apartment', dur: 1800, cam: hold(560, 250, 3.4), beds: ['cicada'] },
  { id: 'platform', kind: 'art', art: 'platform', dur: 3800, cam: hold(960, 540, 1), beds: ['cicada', 'rain'] },
  { id: 'sign', kind: 'art', art: 'platform', dur: 1600, cam: hold(960, 262, 3.1), beds: ['rain'], cues: [[100, 'breath']] },
  { id: 'card2', kind: 'card', dur: 1800, card: 'kanji', cues: [[0, 'cut']] },
  { id: 'train', kind: 'art', art: 'train', dur: 4600, cam: hold(960, 540, 1), beds: ['hum'], text: "NANDA: Nobody's ever eaten lunch with me twice.", textAt: 1200 },
  { id: 'eye', kind: 'eye', dur: 1400, cues: [[0, 'cut']] },
  { id: 'stairs', kind: 'art', art: 'stairs', dur: 3400, cam: hold(960, 540, 1), beds: ['rain'], text: 'NANDA: This is me. Unit 12.', textAt: 600 },
  { id: 'plate', kind: 'art', art: 'stairs', dur: 1400, cam: hold(1695, 312, 3.6), beds: ['rain'], cues: [[0, 'tick']] },
  { id: 'magi', kind: 'magi', dur: 5200, cues: [[0, 'static'], [400, 'breath'], [900, 'pink'], [1700, 'pink'], [2500, 'pink'], [3200, 'stab']] },
  { id: 'genkan', kind: 'art', art: 'genkan', dur: 2600, cam: hold(960, 540, 1), text: 'Her shoes. Lined up to the millimetre.', cues: [[0, 'door']] },
  { id: 'slippers', kind: 'art', art: 'genkanIn', dur: 2600, cam: hold(960, 540, 1), text: "Men's slippers. Already set out.", cues: [[0, 'thump']] },
  { id: 'card3', kind: 'card', dur: 3600, card: 'next', cues: [[200, 'bell']] },
]);
const BEDS = ['cicada', 'rain', 'hum'];

function Card({ which }) {
  if (which === 'ep') {
    return (
      <div className="c6-card ep" role="img" aria-label="Episode 12: Her door. Just one cup.">
        <p className="l ep1">EPISODE:12</p>
        <p className="l big a">HER</p>
        <p className="l big b">DO<OrText text="OR" breath={false} /></p>
        <p className="l mid">Just one cup.</p>
      </div>
    );
  }
  if (which === 'kanji') {
    return (
      <div className="c6-card kanji" role="img" aria-label="Twelve stops home.">
        <p className="l k1">第拾弐話</p>
        <p className="l k2">十二</p>
        <p className="l k3">TWELVE STOPS HOME</p>
      </div>
    );
  }
  return (
    <div className="c6-card next" role="img" aria-label="Next episode: the third cup.">
      <p className="l n1">NEXT EPISODE:</p>
      <p className="l n2">THE THIRD</p>
      <p className="l n3">CUP</p>
      <p className="l n4">NANDA: Obviously you&apos;ll remember.</p>
    </div>
  );
}

// the MAGI vote: three gates deliberate on her proposal; they all approve (illusion of choice)
const MAGI = [
  { id: 'AND · 1', x: 230, y: 250 },
  { id: 'NAND · 2', x: 1130, y: 250 },
  { id: 'NOR · 3', x: 680, y: 610 },
];
function Magi({ local, rm }) {
  const on = (i) => local > 900 + i * 800;
  const warn = local > 3200;
  const blink = rm || Math.floor(local / 500) % 2 === 0; // 1 Hz, each state holds 500 ms
  return (
    <svg className="art c6-magi" viewBox="0 0 1920 1080" role="img" aria-label="Three gates vote on her proposal. All approve.">
      <rect width="1920" height="1080" fill="#050302" />
      <g className="grid">{Array.from({ length: 30 }, (_, i) => <line key={i} x1={i * 70} y1="0" x2={i * 70 - 300} y2="1080" />)}</g>
      <text x="80" y="110" className="hd">PROPOSAL 012 : ENTER. JUST ONE CUP.</text>
      <text x="80" y="160" className="hd2">提訴　審議開始</text>
      {MAGI.map((m, i) => (
        <g key={m.id} transform={`translate(${m.x} ${m.y})`} className={`panel${on(i) ? ' yes' : ''}`}>
          <path d="M0 0 H560 L600 40 V300 H40 L0 260Z" />
          <text x="40" y="80" className="nm"><OrSpansSafe text={m.id} /></text>
          <text x="40" y="200" className="st">{on(i) ? '承認' : '審議中'}</text>
          <text x="40" y="260" className="st2">{on(i) ? 'APPROVE' : 'DELIBERATING'}</text>
        </g>
      ))}
      {warn && blink && (
        <g transform="translate(1540 820)" className="warn">
          <path d="M0 -170 L147 -85 L147 85 L0 170 L-147 85 L-147 -85Z" />
          <text y="-20" textAnchor="middle" className="w1">警告</text>
          <text y="50" textAnchor="middle" className="w2">PATTERN</text>
          <text y="100" textAnchor="middle" className="w3">PINK</text>
        </g>
      )}
      {warn && <text x="80" y="1010" className="res">RESULT: UNANIMOUS. 3 / 3.</text>}
    </svg>
  );
}
// OR inside an SVG text (her red, 1px offset)
function OrSpansSafe({ text }) {
  return text.split(/(OR)/).filter(Boolean).map((t, i) => (t === 'OR' ? <tspan key={i} className="or-svg" dx="1" dy="1">OR</tspan> : <tspan key={i} dy={i ? -1 : 0}>{t}</tspan>));
}

const EYE = placed(ART.nanda({ face: 'blank' }), 0, 0, 600, 900);
function Eye() {
  const s = 7;
  return (
    <svg className="art c6-eye" viewBox="0 0 1920 1080" role="img" aria-label="Her eye, no light in it.">
      <rect width="1920" height="1080" fill="#ffece3" />
      <g transform={`translate(${960 - 300 * s} ${560 - 352 * s}) scale(${s})`}><Markup html={EYE} /></g>
    </svg>
  );
}

export default function Cam6({ rm }) {
  const [t] = useClock(SHOTS.total);
  const { shot, local } = shotAt(SHOTS, t);
  useShotSound(shot, local, t, BEDS);
  const arts = useMemo(() => ({
    apartment: <ApartmentExt rm={rm} />,
    platform: <Platform props={{ train: 'gone' }} rm={rm} />,
    train: <Train props={{ zoom: false }} rm={rm} />,
    stairs: <Stairs props={{ door: 'shut' }} rm={rm} />,
    genkan: <Genkan props={{ insert: false }} rm={rm} />,
    genkanIn: <Genkan key="in" props={{ insert: true }} rm={rm} />,
  }), [rm]);

  let body;
  if (shot.kind === 'card') body = <Card which={shot.card} />;
  else if (shot.kind === 'magi') body = <Magi local={local} rm={rm} />;
  else if (shot.kind === 'eye') body = <Eye />;
  else body = <div className="c6-cam" style={{ transform: camTransform(shot.cam[0][1]) }}>{arts[shot.art]}</div>;

  return (
    <LabRoot rm={rm} className={`c6 k-${shot.kind} s-${shot.id}`} captions="tl">
      {body}
      {shot.kind === 'art' && <div className="c6-grade" />}
      {shot.text && local >= (shot.textAt ?? 0) && <Sub text={shot.text} key={shot.id} className="c6-sub" />}
    </LabRoot>
  );
}
