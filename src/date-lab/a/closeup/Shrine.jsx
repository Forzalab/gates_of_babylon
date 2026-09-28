// closeup-4 THE SHRINE CIRCUIT (horror 3). School: *Mushishi* / *Mononoke* reliquary macro (anime: the sacred small object)
// x Kurosawa's *Ran*-style patient push-in x 4th-wall personal horror (Undertale memory: it knows YOUR time).
// Central theme: SHE ENSHRINES WHAT YOU MAKE. The shrine by her shoes holds "your" circuit; its label carries the viewer's
// real local time, so the room watching the projector sees today, now.
// Shots (17 s loop): (1) genkan: shoes to the millimetre; (2) push in on the shrine, the candle flame steps in 3 held poses;
// (3) ECU: the circuit under glass: inputs "you" and "her", a NAND, the output lamp red, "built today, HH:MM · kept ♡";
// (4) a small umeboshi offering on a dish in front of it (the echo rule): "I keep everything you make."
// Logic mode does not persist circuits yet (no localStorage key exists), so the circuit is a fixed NAND with your clock.
// RM: one held frame per shot, the flame is still.
import { memo, useMemo } from 'react';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import CameraPiece from '../kit/Camera.jsx';
import { stepAt } from '../kit/time.js';
import { NAND_BODY } from '../../../date-beta/art/util.js';
import './closeup.css';

const GENKAN_PROPS = { insert: false };
const FLAMES = ['M0 0 C7 -10 5 -20 0 -28 C-5 -20 -7 -10 0 0Z', 'M0 0 C8 -9 2 -19 2 -29 C-6 -21 -7 -9 0 0Z', 'M0 0 C6 -11 6 -20 -2 -27 C-4 -18 -8 -10 0 0Z'];
const hhmm = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

// "your" circuit, drawn over main's placeholder inside the shrine window (panel box 1418,636 164x122), in scene px
const YourCircuit = memo(function YourCircuit() {
  const time = useMemo(hhmm, []);
  return (
    <g className="sh-circ">
      <rect x="1418" y="636" width="164" height="122" fill="#fbf4e6" stroke="#8a6a44" strokeWidth="3" />
      <g transform="translate(1426 648)">
        <text x="2" y="16" className="sh-lbl">you</text><text x="2" y="68" className="sh-lbl">her</text>
        <circle cx="30" cy="30" r="5" fill="#ff5fa2" /><circle cx="30" cy="80" r="5" fill="#ff5fa2" />
        <path d="M35 30 H60 M35 80 H60" stroke="#2a2330" strokeWidth="2.4" fill="none" />
        <g transform="translate(60 35) scale(.85)"><path d={NAND_BODY} fill="#fff" stroke="#2a2330" strokeWidth="2.8" /><circle cx="48" cy="20" r="5" fill="#fff" stroke="#2a2330" strokeWidth="2.8" /></g>
        <path d="M105 52 H128" stroke="#2a2330" strokeWidth="2.4" />
        <circle cx="136" cy="52" r="9" fill="#f0243f" className="sh-out" />
        <text x="128" y="78" className="sh-lbl">out</text>
        <text x="0" y="104" className="sh-hand">built today, {time} · kept ♡</text>
      </g>
      <rect x="1418" y="636" width="164" height="122" fill="url(#sh-glass)" />
      {/* cover main's placeholder output pin that pokes past the window */}
      <rect x="1583" y="684" width="16" height="26" fill="#c79d6b" />
    </g>
  );
});

function Flame({ t, rm }) {
  const p = rm ? 0 : stepAt(t, 3, 500);
  return (
    <g transform="translate(1500 818)" className="sh-flame">
      <circle r="60" cy="-14" fill="url(#sh-glow)" />
      <path d={FLAMES[p]} fill="#ffb13d" /><path d={FLAMES[p]} transform="scale(.5)" fill="#fff4c9" />
    </g>
  );
}

function Overlay({ t, rm, offering }) {
  return (
    <svg className="art sh-over" viewBox="0 0 1920 1080" aria-hidden="true">
      <defs>
        <radialGradient id="sh-glow"><stop offset="0" stopColor="#ffcf7a" stopOpacity=".7" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
        <linearGradient id="sh-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset=".3" stopColor="#fff" stopOpacity="0" /><stop offset=".6" stopColor="#fff" stopOpacity=".08" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <YourCircuit />
      {/* hide main's candle flame, draw ours (stepped) */}
      <rect x="1486" y="790" width="28" height="28" fill="#c79d6b" opacity="0" />
      <Flame t={t} rm={rm} />
      {offering && <g transform="translate(1440 866)"><ellipse rx="46" ry="12" fill="#f4efe4" stroke="#b8ad99" strokeWidth="3" /><circle cy="-10" r="14" fill="#a8123e" /><ellipse cx="-4" cy="-15" rx="5" ry="3" fill="#e35a7a" /></g>}
    </svg>
  );
}

const SHOTS = [
  { id: 'shoes', dur: 3600, Scene: Genkan, props: GENKAN_PROPS, cut: 'fade', keys: [{ t: 0, x: 900, y: 620, s: 1.15 }, { t: 3600, x: 960, y: 640, s: 1.22, e: 'linear' }],
    sub: [{ at: 300, text: 'Her shoes. Lined up to the millimetre.' }], inScene: ({ local, rm }) => <Overlay t={local} rm={rm} /> },
  { id: 'shrine', dur: 4400, Scene: Genkan, props: GENKAN_PROPS, cut: 'hard', keys: [{ t: 0, x: 1380, y: 700, s: 1.6 }, { t: 4400, x: 1500, y: 705, s: 2.7 }],
    sub: [{ at: 600, text: 'A tiny shrine. Inside: a circuit you built.' }], inScene: ({ local, rm }) => <Overlay t={local} rm={rm} />,
    layers: () => <div className="sh-grade" /> },
  { id: 'your-circuit', dur: 5000, Scene: Genkan, props: GENKAN_PROPS, cut: 'hard', keys: [{ t: 0, x: 1500, y: 697, s: 6.4 }, { t: 5000, x: 1500, y: 697, s: 7.0, e: 'linear' }],
    sub: [{ at: 1400, text: 'MC: …That’s my handwriting.' }], inScene: ({ local, rm }) => <Overlay t={local} rm={rm} />,
    layers: () => <div className="sh-grade" /> },
  { id: 'offering', dur: 4200, Scene: Genkan, props: GENKAN_PROPS, cut: 'hard', keys: [{ t: 0, x: 1480, y: 760, s: 3.0 }, { t: 4200, x: 1480, y: 760, s: 3.1, e: 'linear' }],
    sub: [{ at: 400, text: 'NANDA: I keep everything you make.' }], inScene: ({ local, rm }) => <Overlay t={local} rm={rm} offering />,
    layers: () => <div className="sh-grade" /> },
];

export default function Shrine({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="closeup shrine" tag="closeup-4 · the shrine circuit" bars={70} />;
}
