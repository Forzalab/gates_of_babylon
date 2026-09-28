// Scene 6, PLATFORM (night, rain). Composition + palette from Tony's ref (blue rain platform, neon city behind glass).
// The AND Line train pulls out to the right; the hanging sign reads 「NEXT: ―― OR ――」 with OR in her red.
// Nanda = a black silhouette under a clear umbrella; her output pin = one pink dot.
// props.train: 'here' | 'gone' (the leave is stepped: 3 poses x 500 ms; reduced motion = hard cut).
// The OR on the sign is always her red (Tony edits 2); the breath cue sits on the beat that reads it.
import Rain, { Skyline } from './Rain.jsx';
import { OrSpans } from '../Say.jsx';
import './alt.css';

function Train() {
  return (
    <g>
      <rect x="0" y="0" width="1100" height="250" rx="26" fill="#d8dde8" />
      <rect x="0" y="150" width="1100" height="20" fill="#ff5fa2" />
      <rect x="0" y="176" width="1100" height="8" fill="#8a5cf6" />
      {[40, 250, 460, 670, 880].map((x) => <rect key={x} x={x} y="36" width="170" height="92" rx="8" fill="#1b2140" />)}
      {[40, 250, 460, 670, 880].map((x) => <rect key={`g${x}`} x={x + 10} y="44" width="60" height="76" fill="#ffe3a8" opacity=".55" />)}
      <rect x="0" y="0" width="1100" height="16" rx="8" fill="#eef1f7" />
      <text x="1080" y="232" textAnchor="end" className="pl-line">AND Line</text>
      <circle cx="16" cy="210" r="12" fill="#ff3355" />
    </g>
  );
}

function Nanda() {
  return (
    <g transform="translate(1340 470)">
      {/* clear umbrella */}
      <path d="M-150 60 Q0 -70 150 60 Z" fill="#cfe3ff" opacity=".22" stroke="#e8f1ff" strokeWidth="4" />
      <line x1="0" y1="-4" x2="0" y2="150" stroke="#e8f1ff" strokeWidth="5" />
      {/* silhouette: hair, coat, legs */}
      <path d="M-40 70 Q-52 20 -8 8 Q36 0 44 44 Q52 86 30 110 L34 150 L-38 150 Q-58 110 -40 70Z" fill="#05060c" />
      <path d="M-46 146 Q-70 260 -60 420 H62 Q76 260 50 146Z" fill="#05060c" />
      <rect x="-40" y="418" width="26" height="140" fill="#05060c" /><rect x="14" y="418" width="26" height="140" fill="#05060c" />
      <path d="M-20 60 Q-70 110 -60 200" stroke="#05060c" strokeWidth="22" fill="none" />
      <circle cx="2" cy="176" r="8" fill="#ff5fa2" className="pin" />
    </g>
  );
}

export default function Platform({ props, rm }) {
  const gone = props.train === 'gone';
  return (
    <div className="art platform">
      <svg viewBox="0 0 1920 1080" role="img" aria-label={`A rainy station platform at night. The AND Line train ${gone ? 'is gone' : 'is leaving'}. A sign reads: next, blank OR blank. A girl waits under an umbrella.`}>
        <defs>
          <linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1030" /><stop offset=".6" stopColor="#1d2f7a" /><stop offset="1" stopColor="#3553c0" />
          </linearGradient>
          <linearGradient id="pl-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#23347e" /><stop offset="1" stopColor="#0b1134" />
          </linearGradient>
          <clipPath id="pl-view"><rect x="0" y="130" width="1920" height="620" /></clipPath>
        </defs>
        <rect width="1920" height="1080" fill="url(#pl-sky)" />
        <Skyline seed={11} base={640} tone="#10194a" />
        <Skyline seed={23} base={700} tone="#172466" lit={['#7fdcff', '#ff9ad0']} />
        {/* the train on the far track: slides out of frame on the stepped clock */}
        <g clipPath="url(#pl-view)">
          <g className={`pl-train${gone ? ' gone' : ''}`}><Train /></g>
        </g>
        {/* rails + edge */}
        <rect x="0" y="720" width="1920" height="40" fill="#0d1440" />
        {[734, 752].map((y) => <rect key={y} x="0" y={y} width="1920" height="5" fill="#8aa4ff" opacity=".6" />)}
        {/* platform floor, tactile strip, reflections */}
        <path d="M0 760 H1920 V1080 H0Z" fill="url(#pl-floor)" />
        <path d="M0 790 H1920 V816 H0Z" fill="#e7cf3a" opacity=".85" />
        {Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 40 + 6} y="795" width="28" height="4" fill="#9c8a1f" />)}
        {Array.from({ length: 12 }, (_, i) => <rect key={`r${i}`} x={i * 170 + 40} y="840" width="10" height="220" fill="#7fb4ff" opacity=".12" />)}
        {/* roof, light tubes, pillars */}
        <rect x="0" y="0" width="1920" height="130" fill="#070b22" />
        {[180, 620, 1060, 1500].map((x) => <rect key={x} x={x} y="112" width="300" height="10" rx="5" fill="#bfe3ff" />)}
        {[80, 1820].map((x) => <rect key={x} x={x} y="130" width="44" height="700" fill="#0b1238" />)}
        {/* the hanging sign */}
        <line x1="760" y1="130" x2="760" y2="210" stroke="#3b4470" strokeWidth="6" /><line x1="1160" y1="130" x2="1160" y2="210" stroke="#3b4470" strokeWidth="6" />
        <rect x="680" y="200" width="560" height="120" rx="8" fill="#101634" stroke="#5b6aa8" strokeWidth="4" />
        <text x="960" y="236" textAnchor="middle" className="pl-sign-jp">次は</text>
        <text x="960" y="298" textAnchor="middle" className="pl-sign"><OrSpans text="NEXT: ―― OR ――" /></text>
        {/* benches */}
        <g fill="#2a3c8e">{[1600, 1720].map((x) => <rect key={x} x={x} y="860" width="100" height="90" rx="10" />)}</g>
        <Nanda />
        <Rain seed={5} rm={rm} y={120} h={720} />
      </svg>
    </div>
  );
}
