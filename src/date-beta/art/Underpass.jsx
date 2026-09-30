// Scene 7, UNDERPASS (地下道). Composition from Tony's refs (tiled walls, fluorescent tubes, a long row of lit ad panels).
// Flat, frontal wall so the ads read straight on. Every brand = Figur or a gate pun (BRAND RULE):
// 「NOT Sweet™ すっぱい！」 umeboshi, 「OR-SON」 convenience store (OR in her red), a 「BUFFER Drinks」 vending machine glow.
// No motion here. Footsteps = an EVEN count cue (scenes.json).
import { OrSpans } from '../Say.jsx';
import './alt.css';

function Tiles() {
  return (
    <g>
      <rect x="0" y="150" width="1920" height="700" fill="#7c847f" />
      {Array.from({ length: 28 }, (_, r) => <line key={`h${r}`} x1="0" y1={150 + r * 26} x2="1920" y2={150 + r * 26} stroke="#616a65" strokeWidth="2" />)}
      {Array.from({ length: 49 }, (_, c) => <line key={`v${c}`} x1={c * 40} y1="150" x2={c * 40} y2="850" stroke="#616a65" strokeWidth="2" />)}
      <rect x="0" y="690" width="1920" height="12" fill="#4d5551" />
      {[0, 1].map((k) => <line key={k} x1="0" y1={640 + k * 26} x2="1920" y2={640 + k * 26} stroke="#566059" strokeWidth="8" strokeLinecap="round" />)}
    </g>
  );
}

// One lit ad box: light frame, poster inside.
function Panel({ x, w = 400, children, glow = '#fff7e0' }) {
  return (
    <g transform={`translate(${x} 250)`}>
      <rect x="-14" y="-14" width={w + 28} height="318" rx="6" fill="#3a3f3c" />
      <rect x="-6" y="-6" width={w + 12} height="302" fill={glow} opacity=".9" />
      <svg x="0" y="0" width={w} height="290" viewBox={`0 0 ${w} 290`}>{children}</svg>
    </g>
  );
}

function NotSweet() {
  return (
    <>
      <rect width="400" height="290" fill="#fff8ea" />
      <rect width="150" height="290" fill="#d7102b" />
      <circle cx="75" cy="150" r="46" fill="#a8123e" /><ellipse cx="62" cy="136" rx="12" ry="8" fill="#e35a7a" />
      <text x="170" y="98" className="up-not">NOT</text>
      <text x="170" y="170" className="up-sweet">Sweet<tspan className="up-tm" dx="4" dy="-36">™</tspan></text>
      <text x="170" y="236" className="up-sour-jp">すっぱい！</text>
      <text x="386" y="276" textAnchor="end" className="up-figur">Figur</text>
    </>
  );
}

function OrSon() {
  return (
    <>
      <rect width="400" height="290" fill="#1f5fbf" />
      {[0, 1, 2, 3].map((i) => <rect key={i} y={196 + i * 20} width="400" height="10" fill="#ffffff" opacity=".85" />)}
      {/* milk-bottle mark = an OR gate body */}
      <path d="M170 18 Q205 18 232 50 Q205 82 170 82 Q184 50 170 18Z" fill="#fff" />
      <text x="200" y="180" textAnchor="middle" className="up-orson"><OrSpans text="{OR}-SON" /></text>
      <text x="200" y="110" textAnchor="middle" className="up-orson-sub">24h · either one, never none</text>
    </>
  );
}

function Buffer() {
  return (
    <g transform="translate(1560 360)">
      <rect x="-30" y="-40" width="330" height="520" rx="20" fill="#7fe0ff" opacity=".18" />
      <rect x="0" y="0" width="270" height="470" rx="8" fill="#e9eef2" stroke="#9aa4ab" strokeWidth="4" />
      <rect x="18" y="18" width="234" height="60" fill="#1e7fd6" />
      <text x="135" y="60" textAnchor="middle" className="up-buffer">BUFFER</text>
      <rect x="18" y="90" width="234" height="200" fill="#bfefff" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
        <g key={`${r}${c}`}>
          <rect x={34 + c * 56} y={104 + r * 62} width="24" height="44" rx="6" fill={['#ff5fa2', '#ffd24a', '#5fd08a', '#8a5cf6'][(r + c) % 4]} />
          {/* a buffer gate glyph on every can: triangle, no bubble */}
          <path d={`M${40 + c * 56} ${118 + r * 62} l12 7 l-12 7z`} fill="#fff" />
        </g>
      )))}
      <text x="135" y="320" textAnchor="middle" className="up-buffer-sub">Drinks · in = out</text>
      <rect x="40" y="380" width="190" height="56" rx="6" fill="#2a3036" />
      <rect x="200" y="330" width="34" height="22" fill="#333" />
    </g>
  );
}

export default function Underpass() {
  return (
    <div className="art underpass">
      <svg viewBox="0 0 1920 1080" role="img" aria-label="A dim tiled underpass. Lit ads: NOT Sweet, sour umeboshi. OR-SON convenience store. A glowing BUFFER Drinks vending machine.">
        <rect width="1920" height="1080" fill="#23262a" />
        {/* ceiling + tubes (one dead) */}
        <rect width="1920" height="150" fill="#2c302f" />
        {[140, 620, 1100, 1580].map((x, i) => <rect key={x} x={x} y="118" width="240" height="14" rx="7" fill={i === 2 ? '#6d726e' : '#f2fbf6'} />)}
        <Tiles />
        {/* the tunnel mouth, far left: stairs up into the rain */}
        <rect x="0" y="150" width="130" height="700" fill="#1a2233" />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x="0" y={500 + i * 44} width={130 - i * 6} height="10" fill="#3a4a66" />)}
        <Panel x={200}><NotSweet /></Panel>
        <Panel x={690} glow="#e8f2ff"><OrSon /></Panel>
        <Panel x={1180} w={300}>
          <rect width="300" height="290" fill="#14100c" />
          <text x="150" y="130" textAnchor="middle" className="up-xor">XOR Coffee</text>
          <text x="150" y="180" textAnchor="middle" className="up-xor-sub">either/or, never both</text>
        </Panel>
        <Buffer />
        {/* floor, tactile strip, wet sheen */}
        <rect x="0" y="850" width="1920" height="230" fill="#4a4d4c" />
        <rect x="0" y="930" width="1920" height="36" fill="#e8c21e" />
        {Array.from({ length: 64 }, (_, i) => <rect key={i} x={i * 30 + 6} y="944" width="18" height="6" fill="#a88a10" />)}
        <rect x="1540" y="850" width="320" height="80" fill="#7fe0ff" opacity=".12" />
        <rect x="200" y="850" width="400" height="60" fill="#fff7e0" opacity=".08" />
      </svg>
    </div>
  );
}
