// anim-1 KYOANI IDLE LIFE (horror 1). School: Kyoto Animation (*Hyouka*, *Violet Evergarden*, *Tamako*) small-motion realism —
// the world keeps breathing when nobody talks — x Ozu "pillow shots" (empty rooms between scenes) x one wrong breath at the end.
// Central theme: THE WORLD BREATHES (AND SO DOES SHE). All 10 of main's scenes + her at the door, 4.4 s each, soft fades between.
// Every drawn motion steps on the 8 fps grid and holds each pose >= 500 ms: petals, cloud drift, a passing pole in the train
// window, curry steam, the OR breathing, puddle rings + umbrella drips, a moth at the tube, a curtain, the door-light sliver,
// candle + dust motes, and Nanda: blinks (500 ms lids), twin-tail sway, breathing shoulders. RM: every overlay holds pose 0,
// main's scenes get rm (rain/straps still), cuts are hard.
import { memo } from 'react';
import { ART as SCENES } from '../../../date-beta/art/index.js';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useClock } from '../kit/hooks.js';
import { Nanda } from '../kit/Sprite.jsx';
import { stepAt, clamp } from '../kit/time.js';
import { rng } from '../../../date-beta/art/util.js';
import { Tag, Hud, Sub } from '../kit/ui.jsx';
import './anim.css';

const HOLD = 4400, FADE = 500;

const Petals = ({ p, n = 14, seed = 4, area = [0, 0, 1920, 900], colour = '#f4c4e4' }) => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const x0 = area[0] + r() * area[2], y0 = area[1] + r() * area[3], sp = 30 + r() * 30;
    const x = x0 + p * 14, y = ((y0 + p * sp) % area[3]) + area[1];
    return <ellipse key={i} cx={x} cy={y} rx="9" ry="5" transform={`rotate(${(i * 40 + p * 35) % 180} ${x} ${y})`} fill={colour} opacity=".9" />;
  });
};

const OVER = {
  splash: ({ p }) => <circle cx="960" cy="690" r={p % 2 ? 150 : 138} fill="none" stroke="#ff5fa2" strokeWidth="6" opacity=".35" />,
  rooftop: ({ p }) => <><g transform={`translate(${p * 6} 0)`} opacity=".0" /><Petals p={p} /></>,
  train: ({ p }) => {
    const x = [1250, 850, 450, 60][p % 4];
    return <g clipPath="url(#an-glass)"><rect x={x} y="200" width="26" height="650" fill="#2e3a3a" /><rect x={x - 30} y="220" width="86" height="10" fill="#2e3a3a" />
      <path d={`M${300 + (p % 4) * 60} 208 L${420 + (p % 4) * 60} 208 L${200 + (p % 4) * 60} 560 L178 560Z`} fill="#fff" opacity=".08" /></g>;
  },
  naan: ({ p }) => [0, 1, 2].map((i) => <path key={i} d={`M${760 + i * 160} ${760 - (p % 3) * 30} c-20 -40 20 -60 0 -100`} stroke="#fff4e0" strokeWidth="8" fill="none" opacity={0.55 - ((p + i) % 3) * 0.15} strokeLinecap="round" />),
  blackout: () => null,
  platform: ({ p }) => <>
    {[[500, 960], [900, 1010], [1500, 990], [240, 1040]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={10 + ((p + i) % 3) * 22} ry={3 + ((p + i) % 3) * 6} fill="none" stroke="#9fb0ff" strokeWidth="2" opacity={0.6 - ((p + i) % 3) * 0.18} />)}
    {[-120, 0, 120].map((dx, i) => <circle key={i} cx={1340 + dx} cy={540 + ((p + i) % 3) * 40} r="4" fill="#cfe3ff" opacity=".8" />)}
    <circle cx="1342" cy="646" r={p % 2 ? 24 : 16} fill="#ff5fa2" opacity=".35" />
  </>,
  underpass: ({ p }) => {
    const [mx, my] = [[380, 100], [470, 150], [330, 160], [420, 90]][p % 4];
    return <><path d={`M${mx} ${my} l-10 -6 l10 3 l10 -3z`} fill="#3a3f3c" /><rect x="1530" y="320" width="330" height="520" fill="#7fe0ff" opacity={p % 2 ? 0.1 : 0.05} /></>;
  },
  apartment: ({ p }) => <path d={`M1090 ${372} q${p % 2 ? 30 : 10} 30 0 60 h-70 v-60z`} fill="#fff0c2" opacity=".7" />,
  stairs: ({ p }) => <>
    <path d={`M${1380 + (p % 3) * 30} ${120 + (p % 2) * 20} l-8 -5 l8 2 l8 -2z`} fill="#2a2a2a" />
    <path d="M1568 180 H1580 V840 H1546Z" fill="#ffcf7a" opacity={p % 2 ? 0.35 : 0.15} />
  </>,
  genkan: ({ p }) => <>
    <path d={['M0 0 C7 -10 5 -20 0 -28 C-5 -20 -7 -10 0 0Z', 'M0 0 C8 -9 2 -19 2 -29 C-6 -21 -7 -9 0 0Z', 'M0 0 C6 -11 6 -20 -2 -27 C-4 -18 -8 -10 0 0Z'][p % 3]} transform="translate(1500 818)" fill="#ffb13d" />
    <Petals p={p} n={18} seed={9} area={[780, 40, 380, 480]} colour="#fff6dc" />
  </>,
};

const Her = memo(function Her({ blink, sway, breath }) {
  return (
    <>
      <Stairs props={{ door: 'ajar' }} rm />
      <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
        <g transform={`translate(0 ${breath ? -3 : 0})`}>
          <g transform={`rotate(${sway} 980 400)`}><Nanda face="smile" pin="hum" blink={blink} x={680} y={180} s={1.0} /></g>
        </g>
      </svg>
    </>
  );
});

const LIST = [
  ['splash', { collapsed: false }, 'START. A page that waits for you.'],
  ['rooftop', { clock: 'noon' }, 'Petals. Wind. The tower says twelve.'],
  ['train', { zoom: false }, 'Poles pass the window. The straps sway.'],
  ['naan', {}, 'The curry steams. The gates bob.'],
  ['blackout', { phase: 'or' }, ''],
  ['platform', { train: 'gone' }, 'Rain rings the puddles. Her umbrella drips.'],
  ['underpass', {}, 'A moth circles the one good tube.'],
  ['apartment', {}, 'One window. The curtain moves.'],
  ['stairs', { door: 'ajar' }, 'The door light breathes in and out.'],
  ['genkan', { insert: false }, 'Candle. Dust in the hall light.'],
  ['her', {}, 'NANDA: …You were staring. I noticed.'],
];

export default function Kyoani({ rm }) {
  const [t, restart] = useClock({ loop: HOLD * LIST.length });
  const i = Math.min(LIST.length - 1, Math.floor(t / HOLD));
  const local = t - i * HOLD;
  const [id, props, sub] = LIST[i];
  const p = rm ? 0 : stepAt(t, 12, 500);
  const fade = rm ? 0 : Math.max(1 - clamp(local / FADE), clamp((local - (HOLD - FADE)) / FADE));
  const Art = SCENES[id];
  const O = OVER[id];
  // her idle: blink 500 ms every 3 s, tails sway 2 poses (1 s), breath 2 poses (1.5 s)
  const blink = !rm && local % 3000 >= 2500;
  return (
    <div className={`aroot anim kyo scene-${id}`} onClick={restart}>
      {id === 'her' ? <Her blink={blink} sway={rm ? 0 : stepAt(t, 2, 1000) ? 0.6 : -0.6} breath={!rm && stepAt(t, 2, 1500) === 1} />
        : <><Art props={props} rm={rm} onStart={() => {}} />
          <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
            <defs><clipPath id="an-glass"><rect x="178" y="208" width="540" height="634" /><rect x="178" y="432" width="974" height="410" /></clipPath></defs>
            {O && <O p={p} />}
            {id === 'blackout' && null}
          </svg></>}
      {id === 'blackout' && <div className={`kyo-breathe${!rm && stepAt(t, 2, 1000) ? ' in' : ''}`} />}
      {fade > 0 && <div className="camfade" style={{ opacity: fade }} />}
      <Sub text={sub} />
      <Tag>anim-1 · kyoani idle · {i + 1}/{LIST.length} {id}</Tag>
      <Hud><span className="a-chip">click = restart</span></Hud>
    </div>
  );
}
