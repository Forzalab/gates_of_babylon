// anim-4 · PAPRIKA DREAM PARADE (horror 3). Central theme: "the parade of everything she kept".
// Satoshi Kon's Paprika: objects march in a parade that never ends and the dream swallows reality. Here, at every
// scene change the scene's key prop MORPHS into the next scene's prop (4 drawn poses x 500 ms: the clock becomes a
// train strap becomes a NAND gate becomes her umbrella ...) and then hops down into the parade along the bottom of
// the frame. The parade keeps growing: it is her collection of your day. She leads it with a banner:
// fOR-ever AND ever (OR in her red, AND in pink). The backgrounds cross-dissolve like a dream.
// Motion rules: marchers step on the 125 ms grid, bob poses hold 500 ms; the dissolve is a smooth fade.
// Reduced motion: the parade stands still, the morph is one hard cut, the dissolve is a cut.
import { useEffect, useMemo } from 'react';
import Rooftop from '../../../date-beta/art/Rooftop.jsx';
import Train from '../../../date-beta/art/Train.jsx';
import NaanBoard from '../../../date-beta/art/Naan.jsx';
import Platform from '../../../date-beta/art/Platform.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import { LabRoot, Markup, Line, useClock } from '../shared/ui.jsx';
import { play, bed } from '../shared/audio.js';
import { ART } from '../shared/art.js';
import './anim4.css';

// ---------- the props (feet at 0,0, about 150 px tall) ----------
const P = {
  clock: () => (<g><circle cy="-80" r="58" className="p-rim" /><circle cy="-80" r="46" className="p-face" /><path d="M0 -80 V-118 M0 -80 V-110" className="p-hand" /><text y="-54" textAnchor="middle" className="p-figur">Figur</text></g>),
  strap: () => (<g><path d="M0 -150 V-90" className="p-strapline" /><path d="M-34 -10 L0 -90 L34 -10Z" className="p-strap" /></g>),
  gate: () => (<g><path d="M-50 -130 H-6 A34 34 0 0 1 -6 -62 H-50Z" className="p-gate" /><circle cx="36" cy="-96" r="10" className="p-gate" /><circle cx="-30" cy="-102" r="5" className="p-ink" /><circle cx="-14" cy="-102" r="5" className="p-ink" /><path d="M-28 -86 Q-22 -80 -16 -86" className="p-inkline" /></g>),
  umbrella: () => (<g><path d="M-80 -90 Q0 -170 80 -90Z" className="p-umb" /><path d="M0 -150 V-10 q0 14 -14 10" className="p-umbh" /></g>),
  vending: () => (<g><rect x="-42" y="-160" width="84" height="150" rx="6" className="p-vend" /><rect x="-34" y="-150" width="68" height="24" className="p-vendtop" /><text y="-132" textAnchor="middle" className="p-buffer">BUFFER</text>{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-28 + c * 20} y={-116 + r * 22} width="14" height="16" className={`p-can c${(r + c) % 3}`} />))}</g>),
  window: () => (<g><rect x="-60" y="-120" width="120" height="84" className="p-win" /><g transform="translate(0 -36) scale(.13)" dangerouslySetInnerHTML={{ __html: ART.sil('nanda', 0, 0, 1) }} /></g>),
  door: () => (<g><rect x="-44" y="-170" width="88" height="160" className="p-door" /><rect x="-20" y="-150" width="40" height="18" className="p-plate" /><text y="-136" textAnchor="middle" className="p-twelve">12</text><rect x="26" y="-96" width="7" height="30" className="p-knob" /></g>),
  slippers: () => (<g><path d="M-52 -80 q22 -9 44 0 v56 q0 17 -22 17 q-22 0 -22 -17z" className="p-slip" /><path d="M6 -80 q22 -9 44 0 v56 q0 17 -22 17 q-22 0 -22 -17z" className="p-slip" /></g>),
  cups: () => (<g>{[-46, 0, 46].map((x, i) => <g key={x} transform={`translate(${x} ${-i * 4})`}><path d="M-20 -60 H20 L16 -20 Q0 -12 -16 -20Z" className="p-cup" /><ellipse cy="-60" rx="20" ry="5" className="p-tea" /><path d="M-4 -70 q-8 -14 4 -26 q10 -12 -2 -24" className="p-steam" /></g>)}</g>),
};

// the scene loop; each scene's prop morphs into the next one's, then joins the parade
export const DREAM = [
  { id: 'rooftop', prop: 'clock', line: 'The tower keeps your time. Then it keeps you.' },
  { id: 'train', prop: 'strap', line: 'Twelve stops home. Every strap turns to watch.' },
  { id: 'naan', prop: 'gate', line: 'NAND, not bread. It walks now.' },
  { id: 'platform', prop: 'umbrella', line: 'NANDA: One umbrella. Get under. Your shoulder is wet.' },
  { id: 'underpass', prop: 'vending', line: 'Every ad on the wall steps down to follow.' },
  { id: 'apartment', prop: 'window', line: 'NANDA: I left the light on for you.' },
  { id: 'stairs', prop: 'door', line: 'NANDA: Unit 12. Obviously you’ll remember.' },
  { id: 'genkan', prop: 'slippers', line: "Men's slippers. Already set out." },
  { id: 'kitchen', prop: 'cups', line: 'NANDA: For Input B. It’s always three of us.' },
];
export const HOLD = 2600, MORPH = 2000, SCENE = HOLD + MORPH; // morph = 4 poses x 500 ms
const TOTAL = SCENE * DREAM.length;

const KITCHEN = ART.sceneKitchen();
const ARTS = {
  rooftop: (rm) => <Rooftop props={{ clock: 'noon' }} rm={rm} />, train: (rm) => <Train props={{ zoom: false }} rm={rm} />,
  naan: (rm) => <NaanBoard rm={rm} />, platform: (rm) => <Platform props={{ train: 'gone' }} rm={rm} />,
  underpass: (rm) => <Underpass rm={rm} />, apartment: (rm) => <ApartmentExt rm={rm} />,
  stairs: (rm) => <Stairs props={{ door: 'shut' }} rm={rm} />, genkan: (rm) => <Genkan props={{ insert: false }} rm={rm} />,
  kitchen: () => <div className="a4-kitchen" dangerouslySetInnerHTML={{ __html: KITCHEN }} />,
};

// morph poses: 0 = A, 1 = A squashed + B small, 2 = A small + B stretched, 3 = B
function Morph({ a, b, pose }) {
  const A = P[a], B = P[b];
  const tA = ['scale(1)', 'scale(1.15, .55) rotate(-8)', 'scale(.35, 1.3) rotate(14)', 'scale(0)'][pose];
  const tB = ['scale(0)', 'scale(.4, 1.25) rotate(10)', 'scale(1.2, .7) rotate(-6)', 'scale(1)'][pose];
  return (
    <g transform="translate(960 640) scale(2.3)" className="a4-morph">
      {pose < 3 && <g transform={tA}><A /></g>}
      {pose > 0 && <g transform={tB}><B /></g>}
    </g>
  );
}

function Marcher({ kind, x, bob, leg }) {
  const K = P[kind];
  return (
    <g transform={`translate(${x} ${bob ? 990 : 978}) scale(.62)`}>
      <K />
      <path d={leg ? 'M-14 0 L-22 34 M14 0 L20 34' : 'M-14 0 L-6 34 M14 0 L8 34'} className="p-legs" />
    </g>
  );
}
const LEADER = ART.sil('nanda', 0, 0, 0.3, { slit: true });

export default function Anim4({ rm }) {
  const [t] = useClock(TOTAL);
  const si = Math.floor(t / SCENE) % DREAM.length, local = t % SCENE;
  const cur = DREAM[si], nxt = DREAM[(si + 1) % DREAM.length];
  const morphing = local >= HOLD;
  const pose = morphing ? (rm ? (local - HOLD < MORPH / 2 ? 0 : 3) : Math.min(3, Math.floor((local - HOLD) / 500))) : 0;
  const tick = Math.floor(t / 125); // the 8 fps grid
  const beat = Math.floor(t / 500); // pose holds 500 ms

  useEffect(() => { bed('parade', true); return () => bed('parade', false); }, []);
  useEffect(() => { if (si > 0) play('drum', { caption: `[parade drum: the ${DREAM[si - 1].prop} joins]` }); }, [si]);
  useEffect(() => { if (pose === 1) play('creak', { caption: '[something changes shape]' }); }, [pose]);

  // the parade = every prop collected so far (plus the one that just morphed), marching left to right
  const kept = DREAM.slice(0, si + (pose === 3 ? 1 : 0)).map((d) => d.prop);
  const speed = 26; // px per 125 ms step
  const marchers = kept.map((kind, i) => {
    const x = rm ? 1500 - i * 170 : ((tick * speed + 2600 - i * 170) % 2400) - 240;
    return { kind, x, bob: !rm && (beat + i) % 2 === 1, leg: !rm && (beat + i) % 2 === 0 };
  });
  const leadX = rm ? 1660 : ((tick * speed + 2600 + 190) % 2400) - 240;

  const bgCur = useMemo(() => ARTS[cur.id](rm), [cur.id, rm]);
  const bgNext = useMemo(() => ARTS[nxt.id](rm), [nxt.id, rm]);
  const fade = morphing ? (rm ? (pose >= 3 ? 1 : 0) : Math.min(1, (local - HOLD - 800) / 1200)) : 0;

  return (
    <LabRoot rm={rm} className="a4" captions="tr">
      <div className="a4-bg" key={`c${cur.id}`}>{bgCur}</div>
      {morphing && <div className="a4-bg" style={{ opacity: Math.max(0, fade) }} key={`n${nxt.id}`}>{bgNext}</div>}
      <div className="a4-dream" />
      <svg className="art a4-layer" viewBox="0 0 1920 1080" aria-label={`A dream parade: ${kept.join(', ') || 'empty'}`}>
        {morphing && <Morph a={cur.prop} b={nxt.prop} pose={pose} />}
        <rect x="0" y="1000" width="1920" height="80" className="a4-road" />
        {marchers.map((m, i) => <Marcher key={i} {...m} />)}
        <g transform={`translate(${leadX} 1000)`}>
          <g transform={rm || beat % 2 ? 'translate(0 0)' : 'translate(0 -8)'}><Markup html={LEADER} className="a4-lead" /></g>
          <g transform="translate(-20 -215)">
            <rect x="-230" y="-40" width="460" height="64" rx="8" className="a4-banner" />
            <text textAnchor="middle" y="4" className="a4-bantext">f<tspan className="or-svg" dx="1" dy="1">OR</tspan><tspan dy="-1">ever </tspan><tspan className="and">AND</tspan> ever</text>
          </g>
        </g>
      </svg>
      <Line text={pose === 3 ? nxt.line : cur.line} key={pose === 3 ? `n${nxt.id}` : cur.id} className="a4-line" />
      <p className="a4-count">collected: {kept.length} / {DREAM.length}</p>
    </LabRoot>
  );
}
