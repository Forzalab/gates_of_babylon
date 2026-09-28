// nanda-1 LIT LIKE THE ROOM (horror 2). School: Ghibli/KyoAni compositing (cel over painted BG, matched by colour script) x
// Roger Deakins motivated light (every light on her comes from a source in the shot) x "she is closer each time" dread.
// Central theme: SHE BELONGS IN EVERY ROOM — main's sprite composited into platform -> door -> genkan -> third cup, lit by
// each room's own sources (kit/integrate.js rigs -> kit/Lit.jsx passes: grade, form shade, rim, cast shadow).
// Scale is computed from a reference object in each scene (bench, door, hall doorway, teacup), never eyeballed.
// RM: one held frame per shot, hard cuts.
import { memo } from 'react';
import Platform from '../../../date-beta/art/Platform.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import CameraPiece from '../kit/Camera.jsx';
import LitNanda from '../kit/Lit.jsx';
import { StrScene, ART } from '../kit/Sprite.jsx';
import { bustScale, silScale } from '../kit/integrate.js';
import './nanda.css';

// main's platform silhouette (Platform.jsx), re-traced so we can rim-light it and give it a wet-floor reflection
const PL_SIL = ['M-40 70 Q-52 20 -8 8 Q36 0 44 44 Q52 86 30 110 L34 150 L-38 150 Q-58 110 -40 70Z', 'M-46 146 Q-70 260 -60 420 H62 Q76 260 50 146Z',
  'M-40 418 h26 v140 h-26z', 'M14 418 h26 v140 h-26z'];
export function PlatformPass({ rim = true, reflect = true }) {
  return (
    <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
      <defs>
        <filter id="pl-rim" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset in="SourceAlpha" dx="6" dy="2" result="o" /><feComposite in="SourceAlpha" in2="o" operator="out" result="e" />
          <feGaussianBlur in="e" stdDeviation="1.5" result="eb" /><feFlood floodColor="#9fc8ff" /><feComposite in2="eb" operator="in" result="r" />
          <feMerge><feMergeNode in="r" /><feMergeNode in="r" /></feMerge>
        </filter>
        <linearGradient id="pl-refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060c" stopOpacity=".55" /><stop offset="1" stopColor="#05060c" stopOpacity="0" /></linearGradient>
      </defs>
      {reflect && (
        <g transform="translate(1340 1028) scale(1 -0.5) translate(0 -558)" style={{ filter: 'blur(3px)' }}>
          {PL_SIL.map((d) => <path key={d} d={d} fill="#0b1440" opacity=".7" />)}
          <circle cx="2" cy="176" r="10" fill="#ff5fa2" opacity=".5" />
        </g>
      )}
      {rim && <g transform="translate(1340 470)" filter="url(#pl-rim)">{PL_SIL.map((d) => <path key={d} d={d} fill="#05060c" />)}</g>}
      <circle cx="1342" cy="646" r="26" fill="#ff5fa2" opacity=".35" style={{ filter: 'blur(8px)' }} />
    </svg>
  );
}

const KITCHEN = ART.sceneKitchen();
// the kitchen split in two planes so she can sit BEHIND the table: back = whole room, front = the table + cups only
export const KitchenBack = memo(function KitchenBack() { return <svg className="art nd-kitchen" viewBox="0 0 1920 1080" aria-hidden="true"><StrScene html={KITCHEN} /></svg>; });
export function KitchenFront() {
  return (
    <svg className="art nd-kitchen" viewBox="0 0 1920 1080" aria-hidden="true">
      <defs><clipPath id="nd-table"><path d="M120 500 L1800 500 L1920 1080 L0 1080 Z" /></clipPath></defs>
      <g clipPath="url(#nd-table)"><StrScene html={KITCHEN} /></g>
    </svg>
  );
}

// placements, derived from the rigs' scale
export const PLACE = {
  door: (() => { const s = bustScale('door'); return { s, x: 980 - 300 * s, y: 250 - 108 * s }; })(),
  genkan: { s: silScale('genkan'), x: 970, y: 548 },
  kitchen: (() => { const s = bustScale('kitchen'); return { s, x: 960 - 300 * s, y: 150 - 108 * s }; })(),
};

export function DoorNanda(p) { return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><LitNanda rig="door" {...PLACE.door} face="smile" pin="hum" {...p} /></svg>; }
export function GenkanNanda(p) { return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><LitNanda rig="genkan" kind="sil" {...PLACE.genkan} {...p} /></svg>; }
export function KitchenNanda(p) { return <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><LitNanda rig="kitchen" {...PLACE.kitchen} face="smile" pin="red" {...p} /></svg>; }

const SHOTS = [
  { id: 'platform', dur: 5600, Scene: Platform, props: { train: 'gone' }, cut: 'fade', keys: [{ t: 0, x: 1200, y: 640, s: 1.35 }, { t: 5600, x: 1260, y: 640, s: 1.5, e: 'linear' }],
    sub: [{ at: 500, text: 'Her stop. She waited in the rain.' }], inScene: () => <PlatformPass /> },
  { id: 'door', dur: 5600, Scene: Stairs, props: { door: 'ajar' }, cut: 'fade', keys: [{ t: 0, x: 1100, y: 560, s: 1.0 }, { t: 5600, x: 1100, y: 540, s: 1.1, e: 'linear' }],
    sub: [{ at: 500, text: 'NANDA: This is me. Unit 12.' }], inScene: () => <DoorNanda /> },
  { id: 'genkan', dur: 5600, Scene: Genkan, props: { insert: false }, cut: 'fade', keys: [{ t: 0, x: 960, y: 540, s: 1.0 }, { t: 5600, x: 970, y: 470, s: 1.3, e: 'linear' }],
    sub: [{ at: 500, text: 'NANDA: Shoes off. The hall light is for you.' }], inScene: () => <GenkanNanda /> },
  { id: 'third-cup', dur: 6200, Scene: KitchenBack, props: {}, cut: 'fade', keys: [{ t: 0, x: 960, y: 480, s: 1.05 }, { t: 6200, x: 960, y: 420, s: 1.25, e: 'linear' }],
    sub: [{ at: 600, text: "NANDA: Drink while it's warm." }], inScene: () => <><KitchenNanda /><KitchenFront /></> },
];

export default function Integrated({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="nanda-int" tag="nanda-1 · lit like the room" />;
}
