// stationParts.jsx: reusable station pieces for the naan platform (NaanPlatform.jsx) and any later station scene: dusk palette, sky, clouds, skyline, the ad slot, signs.
// Flat fills + one gradient per sky, like Rooftop / Train. Traced by eye from Tony's 4 BY-NC refs (never committed,
// see research/date-beta-demo/naan/COMPOSITION.txt + CREDITS.txt).
import { rng } from './util.js';

// Dusk palette: Pillow samples from the refs, lifted to flat fills (COMPOSITION.txt lists the raw samples).
export const P = {
  canopy: '#2d2542', canopyLit: '#4a3a66', fascia: '#3b2f55', rib: '#5a4a7e',
  far: '#8a78c8', mid: '#a47bbd', near: '#b4739e', lit: '#eea2c4', shade: '#6d58a0', deep: '#3d2c5e',
  winOn: '#ffd9a8', winOff: '#5c4b8c',
  silver: '#d9c9df', silverShade: '#a693bf', glass: '#34294f', glassSky: '#c889cf',
  floor: '#3b2b58', floorFar: '#4a3868', tactile: '#e0a24e', steel: '#6e5b8e', steelLit: '#b9a6cf', ink: '#1c1830',
};

export function Sky({ id, stops, h = 1080 }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
          {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width="1920" height={h} fill={`url(#${id})`} />
    </>
  );
}

// Dusk cumulus: lit pink top, lilac belly (same outline as the rooftop cloud, so the two scenes rhyme).
export const Cloud = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M0 60 C-10 30 30 10 60 26 C70 -6 130 -12 150 20 C175 0 225 8 228 44 C262 44 272 70 250 80 L10 80 C-8 80 -8 64 0 60Z" fill="#f6b1dc" />
    <path d="M10 80 L250 80 C262 76 268 70 262 64 C230 72 60 74 6 70 C0 76 4 80 10 80Z" fill="#b98ad8" />
  </g>
);

// A row of flat buildings standing on `base`: lit front (pink), a shade side (violet), sparse warm windows.
// b = [x, w, top, side?]. tone: 'far' | 'mid' | 'near'.
export function Blocks({ b, base, tone = 'mid', seed = 1, win = 0.18 }) {
  const rnd = rng(seed);
  const face = { far: P.far, mid: P.mid, near: P.near }[tone];
  const side = { far: '#b48fd0', mid: P.lit, near: '#f4b0c6' }[tone]; // low sun from the right (refs 1 + 2): right faces glow
  return b.map(([x, w, top, sd = 0], i) => {
    const cols = Math.max(1, Math.floor((w - 16) / 26)), rows = Math.max(1, Math.floor((base - top - 20) / 30));
    return (
      <g key={i}>
        <rect x={x} y={top} width={w} height={base - top} fill={face} />
        {sd > 0 && <rect x={x + w} y={top + 6} width={sd} height={base - top - 6} fill={side} />}
        <rect x={x} y={top} width={w} height="6" fill={tone === 'far' ? '#9d8bd6' : P.lit} />
        {tone !== 'far' && Array.from({ length: rows * cols }, (_, k) => {
          const r = Math.floor(k / cols), c = k % cols;
          const on = rnd() < win;
          return <rect key={k} x={x + 10 + c * 26} y={top + 18 + r * 30} width="14" height="16" fill={on ? P.winOn : P.winOff} opacity={on ? 0.9 : 0.55} />;
        })}
      </g>
    );
  });
}

// The Hot NAAN ad. Until the redrawn NaanAd lands (branch naan-ad) this is a placeholder with the billboard's
// proportions (2.2:1) and its colour blocks, so the scene reads the same. Drawn in a 880x400 box, scaled into place.
export function AdSlot({ x, y, w }) {
  const h = w / 2.2;
  return (
    <svg x={x} y={y} width={w} height={h} viewBox="0 0 880 400" className="ad-slot" data-ad="placeholder" aria-hidden="true">
      <rect width="880" height="400" fill="#d4e6df" />
      <path d="M300 88 C420 110 520 140 470 200 C420 250 250 250 300 320 C330 360 480 380 520 400 L300 400 C220 360 170 300 230 250 C300 190 400 190 330 150 C300 130 260 110 300 88Z" fill="#f68413" />
      <rect x="600" y="100" width="260" height="240" fill="#111" stroke="#ff5fa2" strokeWidth="6" />
      <rect width="880" height="88" fill="#ffe100" /><rect y="84" width="880" height="8" fill="#e60012" />
      <text x="440" y="66" textAnchor="middle" className="ad-ph-hl">Hot NAAN in your area</text>
      <rect y="350" width="880" height="50" fill="#111" /><rect y="346" width="880" height="5" fill="#e60012" />
      <text x="20" y="386" className="ad-ph-foot">NAND HOUSE</text>
      <text x="860" y="386" textAnchor="end" className="ad-ph-tag">AD 2.2:1 · placeholder</text>
    </svg>
  );
}

// Station line sign, JR style (refs 3 + 4): big track number, JP line, EN line. dark = navy box (ref 3), else white (ref 4).
// rods = [[dx, topY]]: hangers from the sign's top edge up into the canopy (topY must land inside the canopy shape).
export function LineSign({ x, y, w, h, num, jp, jp2, en, dark = false, rods }) {
  const bg = dark ? '#1d2c3e' : '#f4f1ea', ink = dark ? '#f4f1ea' : '#1c1830', rim = dark ? '#0e1622' : '#23202c';
  return (
    <g className="np-sign">
      {rods.map(([dx, top]) => <rect key={dx} x={x + dx - 4} y={top} width="8" height={y - top} fill={P.ink} />)}
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx="6" fill={rim} />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={bg} />
      {dark && <rect x={x} y={y} width={w} height="6" fill="#2f4660" />}
      <text x={x + h * 0.36} y={y + h * 0.77} textAnchor="middle" className="sg-num" style={{ fill: ink, fontSize: h * 0.78 }}>{num}</text>
      <rect x={x + h * 0.72} y={y + h * 0.14} width="4" height={h * 0.72} fill={dark ? '#3c5470' : '#c9c3d6'} />
      <text x={x + h * 0.84} y={y + h * 0.36} className="sg-jp" style={{ fill: ink, fontSize: h * 0.22 }}>{jp}</text>
      {jp2 && <text x={x + w - h * 0.1} y={y + h * 0.36} textAnchor="end" className="sg-jp2" style={{ fill: ink, fontSize: h * 0.17 }}>{jp2}</text>}
      <text x={x + h * 0.84} y={y + h * 0.66} className="sg-en" style={{ fill: ink, fontSize: h * 0.16 }}>{en}</text>
    </g>
  );
}

// Station name board (駅名標, ref 2's JR-East style): white, green line band, station number badge.
export function NameBoard({ x, y, w = 400, h = 160, rods }) {
  const g = '#6cbb3c';
  return (
    <g className="np-sign">
      {rods.map(([dx, top]) => <rect key={dx} x={x + dx - 4} y={top} width="8" height={y - top} fill={P.ink} />)}
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="6" fill="#23202c" />
      <rect x={x} y={y} width={w} height={h} fill="#f6f4ee" />
      <g transform={`translate(${x + 18} ${y + 20})`}>
        <rect width="54" height="54" rx="6" fill="#fff" stroke={g} strokeWidth="5" />
        <text x="27" y="23" textAnchor="middle" className="nb-code">JY</text>
        <text x="27" y="46" textAnchor="middle" className="nb-codenum">13</text>
      </g>
      <text x={x + w / 2 + 24} y={y + 66} textAnchor="middle" className="nb-jp">池NOR袋</text>
      <text x={x + w / 2 + 24} y={y + 96} textAnchor="middle" className="nb-en">Ike-NOR-kuro</text>
      <rect x={x} y={y + h - 44} width={w} height="44" fill={g} />
      <rect x={x + w / 2 - 22} y={y + h - 44} width="44" height="44" fill="#4f9a2a" />
      <text x={x + 14} y={y + h - 15} className="nb-next">◀ 目白 Mejiro</text>
      <text x={x + w - 14} y={y + h - 15} textAnchor="end" className="nb-next">Ōtsuka 大塚 ▶</text>
    </g>
  );
}

// Platform vending machine. kind = props.vending (the bento echo): that drink's slot is lit, the rest stay plain.
export function Vending({ x, y, w, h, kind }) {
  const hot = kind === 'tamagoyaki' ? '#ffd23f' : '#d7263d';
  const cols = 5, bw = (w - 16) / cols;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#c8243c" />
      <rect x={x + w - 8} y={y} width="8" height={h} fill="#f28a9a" />
      <rect x={x + 8} y={y + 10} width={w - 16} height={h * 0.5} fill="#f4f1ea" />
      {[0, 1, 2].map((r) => Array.from({ length: cols }, (_, c) => (
        <rect key={`${r}${c}`} x={x + 8 + c * bw + bw * 0.25} y={y + 18 + r * h * 0.16} width={bw * 0.5} height={h * 0.1} rx="2"
          fill={r === 0 && c === 2 ? hot : ['#5b7fc0', '#6fae6a', '#e0a24e', '#a57cc6', '#6c8aa8'][(r + c) % 5]} />
      )))}
      <rect x={x + 8} y={y + h * 0.66} width={w * 0.34} height={h * 0.1} fill="#3a1a22" />
      <rect x={x + w * 0.2} y={y + h * 0.84} width={w * 0.5} height={h * 0.08} fill="#2a1016" />
    </g>
  );
}
