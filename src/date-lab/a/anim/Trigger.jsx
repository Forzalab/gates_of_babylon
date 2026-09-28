// anim-2 TRIGGER LIMITED ANIMATION (horror 2). School: Studio Trigger / Gainax (*Kill la Kill*, *Gurren Lagann*, *Promare*):
// anticipation -> one smear frame -> IMPACT HOLD with boiling focus lines and a flat 2-colour impact frame; big katakana SFX
// x Edgar Wright's smash-cut-on-the-beat x a love-bomb that hits too hard (horror 2: every beat is her beat).
// Central theme: EVERY BEAT HITS LIKE SHE MEANT IT. 5 beats x 3.4 s: the AND Line slams in, the NAAN board punches to NANDA,
// her door bangs open on light, her pin goes KIRA, the men's slippers land "!?".
// Timing per beat: 0-600 anticipation (held), 600-934 smear (one frame held 334 ms), 934-1300 impact frame (flat her-red/black,
// held 366 ms), then the hold with focus lines boiling in 2 poses (500 ms) and a smooth damped camera shake, then settle.
// Safety: one impact frame per 3.4 s beat (well under 3 flashes/s), every flat frame held >= 334 ms.
// RM: no smear, no impact frame, no shake, lines hold still: a hard cut straight to the settled pose + the SFX text.
import Platform from '../../../date-beta/art/Platform.jsx';
import NaanBoard from '../../../date-beta/art/Naan.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { useClock } from '../kit/hooks.js';
import { Nanda } from '../kit/Sprite.jsx';
import { stepAt, camTransform } from '../kit/time.js';
import { Tag, Hud, Sub } from '../kit/ui.jsx';
import './anim.css';

const BEAT = 3400, ANT = 600, SMEAR = 934, IMPACT = 1300;

// focus lines: wedges from the frame edge toward a centre, 2 boiling poses
function Focus({ cx = 960, cy = 540, pose = 0, colour = '#000', inner = 330, n = 64 }) {
  return (
    <svg className="art tg-focus" viewBox="0 0 1920 1080" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const a = ((i + (pose ? 0.5 : 0)) / n) * Math.PI * 2, w = 0.012 + ((i * 7 + pose * 3) % 5) * 0.004;
        const r0 = inner + ((i * 37 + pose * 53) % 120), r1 = 1500;
        const p = (ang, r) => `${cx + Math.cos(ang) * r},${cy + Math.sin(ang) * r}`;
        return <polygon key={i} points={`${p(a, r0)} ${p(a - w, r1)} ${p(a + w, r1)}`} fill={colour} />;
      })}
    </svg>
  );
}
// a smear: the moving thing as a few stretched streaks (one held frame)
function Smear({ kind }) {
  if (kind === 'train') return (
    <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
      {[[590, '#d8dde8', 170], [620, '#ff5fa2', 26], [646, '#8a5cf6', 12], [520, '#1b2140', 60]].map(([y, c, h], i) => <rect key={i} x="-200" y={y} width="1900" height={h} rx={h / 2} fill={c} opacity=".9" />)}
    </svg>
  );
  if (kind === 'zoom') return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><Focus colour="#e60012" inner={120} n={90} /></svg>;
  if (kind === 'door') return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M1180 180 H1580 V840 H1180Z M1580 180 L1920 60 V960 L1580 840Z" fill="#ffcf7a" opacity=".85" /></svg>;
  if (kind === 'kira') return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><path d="M1240 360 L1300 180 L1360 360 L1540 420 L1360 480 L1300 660 L1240 480 L1060 420Z" fill="#fff" /></svg>;
  return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><rect x="0" y="480" width="1920" height="180" fill="#4a5f86" opacity=".8" /></svg>;
}

const BEATS = [
  { id: 'train', smear: 'train', sfx: 'ガタン!', en: 'KA-TANK', sub: 'The AND Line. Right on her time.', focus: [960, 600],
    scene: (settled) => <Platform props={{ train: settled ? 'here' : 'gone' }} rm />, cam: { x: 900, y: 560, s: 1.15 } },
  { id: 'naan', smear: 'zoom', sfx: 'ドン!', en: 'DON', sub: 'NAAN. NAND. NANDA.', focus: [960, 110],
    scene: () => <NaanBoard props={{}} rm={false} />, cam: { x: 960, y: 160, s: 2.1 } },
  { id: 'door', smear: 'door', sfx: 'ガチャ!', en: 'CLACK', sub: 'NANDA: Just tea. Then you can go.', focus: [1380, 510],
    scene: (settled) => <Stairs props={{ door: settled ? 'ajar' : 'shut' }} rm />, cam: { x: 1300, y: 520, s: 1.3 } },
  { id: 'kira', smear: 'kira', sfx: 'キラッ', en: 'KIRA', sub: 'NANDA: GOOD INPUT!', focus: [1290, 420], her: true,
    scene: () => <div className="art tg-pinkbg" />, cam: { x: 960, y: 540, s: 1 } },
  { id: 'slippers', smear: 'slip', sfx: '!?', en: '', sub: "Men's slippers. Already set out.", focus: [1190, 640],
    scene: () => <Genkan props={{ insert: false }} />, cam: { x: 1190, y: 640, s: 2.0 } },
];

export default function Trigger({ rm }) {
  const [t, restart] = useClock({ loop: BEAT * BEATS.length });
  const i = Math.min(BEATS.length - 1, Math.floor(t / BEAT));
  const b = BEATS[i];
  const k = t - i * BEAT;
  const phase = rm ? 'hold' : k < ANT ? 'ant' : k < SMEAR ? 'smear' : k < IMPACT ? 'impact' : 'hold';
  const settled = phase === 'impact' || phase === 'hold';
  // camera: anticipation = a slight pull back (held), hold = the punched-in frame + a damped shake (smooth)
  const dk = k - SMEAR;
  const shake = !rm && dk > 0 && dk < 900 ? Math.sin(dk / 38) * 18 * Math.exp(-dk / 260) : 0;
  const cam = phase === 'ant' ? { ...b.cam, s: b.cam.s * 0.94 } : { ...b.cam, x: b.cam.x + shake / b.cam.s };
  const lines = rm ? 0 : stepAt(t, 2, 500);
  return (
    <div className={`aroot anim trigger beat-${b.id} ph-${phase}`} onClick={restart}>
      <div className="tg-cam" style={{ transform: camTransform(cam) }}>
        {b.scene(settled)}
        {b.her && (
          <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
            <Nanda face={phase === 'ant' ? 'blank' : 'smile'} pin="hum" x={phase === 'ant' ? 520 : 480} y={phase === 'ant' ? 160 : 120} s={phase === 'ant' ? 1.05 : 1.12} flip={false} />
          </svg>
        )}
      </div>
      {phase === 'hold' && <Focus cx={b.focus[0] === 960 ? 960 : 960} cy={540} pose={lines} colour={b.her ? '#fff' : 'rgba(0,0,0,.85)'} />}
      {phase === 'smear' && <Smear kind={b.smear} />}
      {phase === 'impact' && (
        <div className="tg-impact">
          <Focus pose={0} colour="#000" inner={260} n={48} />
          <span>{b.sfx}</span>
        </div>
      )}
      {phase === 'hold' && <div className="tg-sfx" key={b.id}><b>{b.sfx}</b>{b.en && <i>{b.en}</i>}</div>}
      {phase === 'hold' && <Sub text={b.sub} />}
      <Tag>anim-2 · trigger limited anim · {i + 1}/{BEATS.length} {b.id} · {phase}</Tag>
      <Hud><span className="a-chip">click = restart</span></Hud>
    </div>
  );
}
