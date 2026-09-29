// Builder B demo-path effects. Each effect is a scene + its effect layer; `go` (a counter) replays the effect.
// Theme: "every sound has a body" (Mushishi's visible breath x Lynch's room tone): each SFX gets a visual twin
// on screen, so the effect still reads muted, and the caption names the sound.
// Rules: flashes hold >= 334 ms (the SOUR tint is 334 ms, not 300: the flash rule wins), shiver <= 3 Hz,
// drawn motion steps on 125 ms, every effect has a reduced-motion version (static frame + hard cuts, same SFX).
import { useEffect, useMemo, useRef, useState } from 'react';
import Platform from '../../../date-beta/art/Platform.jsx';
import Rooftop from '../../../date-beta/art/Rooftop.jsx';
import Train from '../../../date-beta/art/Train.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import Blackout from '../../../date-beta/art/Blackout.jsx';
import { rng, useStep } from '../../../date-beta/art/util.js';
import { Markup, Line } from '../shared/ui.jsx';
import { play, bed } from '../shared/audio.js';
import { ART } from '../shared/art.js';
import './fx.css';
import './fxui.css';

// run `fn` every time `go` changes (not on mount when go = 0); returns cleanup of timers
function useGo(go, fn) {
  const ids = useRef([]);
  useEffect(() => {
    if (!go) return undefined;
    const later = (f, ms) => { ids.current.push(setTimeout(f, ms)); };
    fn(later);
    return () => { ids.current.forEach(clearTimeout); ids.current = []; };
  }, [go]); // eslint-disable-line react-hooks/exhaustive-deps
}
const cut = (x, y, s) => ({ transform: `translate(960px, 540px) scale(${s}) translate(${-x}px, ${-y}px)`, transformOrigin: '0 0' });

// ---------- 1 rain: heavier foreground streaks + puddle rings, both stepped 2 poses x 500 ms ----------
export function RainFx({ rm, go }) {
  const pose = useStep(2, 4, !rm);
  useEffect(() => { bed('rain', true); return () => bed('rain', false); }, []);
  useGo(go, () => bed('rain', true));
  const r = rng(40 + pose * 7);
  return (
    <div className="fx-scene">
      <Platform props={{ train: 'gone' }} rm={rm} />
      <svg className="art fx-rain" viewBox="0 0 1920 1080" aria-hidden="true">
        {Array.from({ length: 46 }, (_, i) => { const x = r() * 2000, y = r() * 900, l = 90 + r() * 120; return <line key={i} x1={x} y1={y} x2={x - l * 0.22} y2={y + l} />; })}
        {Array.from({ length: 14 }, (_, i) => { const x = 60 + r() * 1800, y = 860 + r() * 200; return <ellipse key={`p${i}`} cx={x} cy={y} rx={10 + pose * 14} ry={3 + pose * 4} className="ring" />; })}
      </svg>
    </div>
  );
}

// ---------- 2 breath on OR: the sign cut-in; her breath fogs the frame like cold glass ----------
export function BreathFx({ rm, go }) {
  const [fog, setFog] = useState(0);
  useGo(go, (later) => { play('breath'); setFog(1); later(() => setFog(rm ? 0 : 2), rm ? 1000 : 700); later(() => setFog(0), 2200); });
  return (
    <div className="fx-scene">
      <div className="fx-cam" style={cut(960, 262, 2.5)}><Platform props={{ train: 'gone' }} rm={rm} /></div>
      <div className={`fx-fog f${fog}`} />
      <div className={`fx-orglow${fog ? ' on' : ''}`} />
    </div>
  );
}

// ---------- 3 the 12:00 bell: the clock snaps to noon; the toll is visible as two rings (stepped) ----------
export function BellFx({ rm, go }) {
  const [ring, setRing] = useState(0);
  const [noon, setNoon] = useState(false);
  useGo(go, (later) => { setNoon(true); play('bell'); setRing(0); later(() => setRing(1), 20); later(() => setRing(0), 1800); });
  return (
    <div className="fx-scene">
      <Rooftop props={{ clock: noon ? 'noon' : 'live' }} rm={rm} />
      {ring > 0 && (
        <svg className={`art fx-bell${rm ? ' still' : ''}`} viewBox="0 0 1920 1080" aria-hidden="true">
          <circle cx="1140" cy="430" r="150" className="r1" /><circle cx="1140" cy="430" r="150" className="r2" />
        </svg>
      )}
    </div>
  );
}

// ---------- 4 SOUR: squash scaleY .92 + a 3 Hz shiver + yellow-green tint 334 ms + squeak ----------
export function SourFx({ rm, go }) {
  const [k, setK] = useState(0); // 0 rest, 1 squash, 2 shiver +, 3 shiver -, 4 release
  useGo(go, (later) => {
    play('sour');
    if (rm) { setK(9); later(() => setK(0), 334); return; }
    setK(1); later(() => setK(2), 110); later(() => setK(3), 277); later(() => setK(4), 334); later(() => setK(0), 480);
  });
  const tf = { 1: 'scaleY(.92)', 2: 'scaleY(.92) translateX(5px)', 3: 'scaleY(.92) translateX(-5px)', 4: 'scaleY(.96)' }[k] ?? 'none';
  const train = useMemo(() => <Train props={{ zoom: true }} rm={rm} />, [rm]);
  return (
    <div className="fx-scene">
      <div className="fx-squash" style={{ transform: tf }}>{train}</div>
      <div className={`fx-sour${k ? ' on' : ''}`} />
    </div>
  );
}

// ---------- 5 purple bleed: pick purple -> one 334 ms step of purple (not a flicker) ----------
export function BleedFx({ rm, go }) {
  const [on, setOn] = useState(false);
  useGo(go, (later) => { play('purple'); play('bleed'); setOn(true); later(() => setOn(false), 334); });
  return (
    <div className="fx-scene">
      <Stairs props={{ door: 'shut' }} rm={rm} />
      <div className="fx-chips"><span className="chip pink">Just one cup.</span><span className={`chip purple${on ? ' pressed' : ''}`}>It&apos;s late. Goodnight.</span></div>
      <div className={`bleed${on ? (rm ? ' edge' : ' on') : ''}`} />
    </div>
  );
}

// ---------- 6 heartbeat thump: the vignette closes on each beat (<= 1 Hz) and the frame bumps ----------
export function ThumpFx({ rm, go, auto = true }) {
  const [beat, setBeat] = useState(0);
  const hit = () => { play('thump', { silentCaption: false }); setBeat((b) => b + 1); };
  useGo(go, hit);
  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setBeat((b) => b + 1), 1400); // visual-only idle pulse, 0.7 Hz
    return () => clearInterval(id);
  }, [auto]);
  const [pulse, setPulse] = useState(false);
  useEffect(() => { if (!beat) return undefined; setPulse(true); const t = setTimeout(() => setPulse(false), 334); return () => clearTimeout(t); }, [beat]);
  const gk = useMemo(() => <Genkan props={{ insert: true }} rm={rm} />, [rm]);
  return (
    <div className="fx-scene">
      <div className="fx-bump" style={{ transform: pulse && !rm ? 'scale(1.018)' : 'none' }}>{gk}</div>
      <div className={`fx-vig${pulse ? ' on' : ''}`} />
    </div>
  );
}

// ---------- the third-cup kitchen (main's sprite scene) ----------
const KITCHEN = ART.sceneKitchen();
const CUPS_ONLY = `<svg class="art" viewBox="0 0 1920 1080">${ART.cup(620, 560, 1.3)}${ART.cup(960, 540, 1.3)}${ART.cup(1300, 570, 1.4, { third: true })}</svg>`;
function Kitchen() { return <div className="fx-kitchen" dangerouslySetInnerHTML={{ __html: KITCHEN }} />; }

// ---------- 7 steam OR: the third cup's steam writes OR, rises, fades (RM: a static OR, 1 s, hard cuts) ----------
export function SteamFx({ rm, go }) {
  const [on, setOn] = useState(0);
  useGo(go, (later) => { play('steam'); play('breath'); setOn(1); later(() => setOn(0), rm ? 1000 : 2600); });
  return (
    <div className="fx-scene fx-warm">
      <Kitchen />
      {on > 0 && (
        <svg className={`art fx-steam${rm ? ' still' : ''}`} viewBox="0 0 1920 1080" role="img" aria-label="The steam writes OR.">
          <g transform="translate(1250 330)">
            <path d="M40 -10 C-10 -10 -12 80 40 80 C92 80 90 -10 40 -10Z" />
            <path d="M120 80 V-10 C170 -12 178 34 124 38 L170 80" />
          </g>
        </svg>
      )}
    </div>
  );
}

// ---------- 8 CRT static: the picture collapses to a white line, then static (2 frames, 2 Hz max) ----------
export function StaticFx({ rm, go }) {
  const [ph, setPh] = useState(0); // 0 picture, 1 squeeze, 2 line, 3 static
  useGo(go, (later) => {
    play('static');
    if (rm) { setPh(2); later(() => setPh(0), 900); return; }
    setPh(1); later(() => setPh(2), 250); later(() => setPh(3), 750); later(() => setPh(0), 1750);
  });
  const nf = useStep(2, 4, ph === 3);
  return (
    <div className="fx-scene">
      <div className={`fx-crt p${ph}`}><Blackout props={{ phase: 'adoreme' }} /></div>
      {ph === 2 && <div className="fx-line" />}
      {ph === 3 && <svg className="art fx-noise" viewBox="0 0 480 270" preserveAspectRatio="none" aria-hidden="true">
        <filter id={`fxn${nf}`}><feTurbulence baseFrequency=".9" numOctaves="1" seed={nf + 3} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="480" height="270" filter={`url(#fxn${nf})`} />
      </svg>}
    </div>
  );
}

// ---------- 9 STEEPED: colour drains to pink, double vision, slow blinks, the sound goes underwater ----------
export function SteepFx({ rm, go }) {
  const [st, setSt] = useState(0); // 0 clear, 1 pink, 2 double, 3 lids closing, 4 lids open, 5 lids closing
  useGo(go, (later) => {
    play('muffle'); play('thump', { gain: 0.5 });
    if (rm) { setSt(2); later(() => setSt(5), 1800); later(() => { setSt(0); play('surface'); }, 3400); return; }
    setSt(1); later(() => setSt(2), 1200); later(() => { setSt(3); play('thump', { gain: 0.4 }); }, 3000); later(() => setSt(4), 4200);
    later(() => { setSt(5); play('thump', { gain: 0.3 }); }, 5600); later(() => { setSt(0); play('surface'); }, 7600);
  });
  useEffect(() => () => play('surface', { silentCaption: true, ramp: 0.05 }), []);
  return (
    <div className={`fx-scene fx-steep s${st}${rm ? ' still' : ''}`}>
      <div className="fx-steep-img"><Kitchen /></div>
      {st >= 2 && <div className="fx-ghost" dangerouslySetInnerHTML={{ __html: CUPS_ONLY }} />}
      <div className="fx-lid top" /><div className="fx-lid bot" />
    </div>
  );
}

// the demo-path beats (fx-1 reel + fx-2 wall)
export const BEATS = [
  { id: 'rain', label: 'rain', C: RainFx, text: 'Her stop. The rain followed us off the train.', spec: 'rain: 2 stepped poses x 500 ms + puddle rings + rain bed · RM: one still pose' },
  { id: 'breath', label: 'breath on OR', C: BreathFx, text: 'The sign says NEXT: this OR that. It never picks.', spec: 'OR in her red, 1px offset · breath SFX + fog on the glass 0.7 s · RM: fog holds 1 s, hard cut' },
  { id: 'bell', label: '12:00 bell', C: BellFx, text: 'The tower stops at 12:00. It stays there.', spec: 'clock hard-cuts to noon · bell SFX + 2 rings stepped (8 fps) · RM: one still ring' },
  { id: 'sour', label: 'SOUR', C: SourFx, text: 'NANDA: Sour, ne?', spec: 'squash scaleY .92 + shiver 3 Hz + yellow-green tint 334 ms + squeak · RM: static tint 334 ms' },
  { id: 'bleed', label: 'purple bleed', C: BleedFx, text: "It's late. Goodnight.", spec: 'purple pick: one 334 ms step of purple + low bell · RM: a purple edge frame 334 ms' },
  { id: 'thump', label: 'heartbeat', C: ThumpFx, text: "Men's slippers. Already set out.", spec: 'thump SFX + vignette closes 334 ms + 1.8% bump · idle pulse 0.7 Hz · RM: vignette only' },
  { id: 'steam', label: 'steam OR', C: SteamFx, text: 'NANDA: For Input B. Silly. It’s always three of us.', spec: 'steam writes OR in her red, rises 2.4 s on 8 fps steps · RM: static OR 1 s, hard cuts · breath both' },
  { id: 'static', label: 'CRT static', C: StaticFx, text: '', spec: 'squeeze to a white line 250 ms, hold 500 ms, static 2 frames at 2 Hz · RM: held line frame' },
  { id: 'steeped', label: 'STEEPED', C: SteepFx, text: "NANDA: Rest. I'll do the remembering.", spec: 'drain to pink + double vision + 2 slow blinks (0.4 Hz) + mix lowpass 380 Hz · RM: static blur + cuts' },
];

export { Line };
