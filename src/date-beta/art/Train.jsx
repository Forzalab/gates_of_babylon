// Train interior, day (composition + palette from Tony's CC0 ref 7a955d70: big window left, red bench right).
// The hanging ad (中吊り) is the umeboshi echo: 「NOT Sweet™」 「すっぱい！」 SOUR! by Figur.
// props.zoom: the camera pushes in on the ad (smooth 1.6 s; reduced motion = hard cut to the crop).
// Straps sway on the stepped clock: 4 poses, 500 ms each (8 fps grid, 4 ticks a pose). Reduced motion: still.
import { rng, useStep } from './util.js';

function Land() {
  const rnd = rng(41);
  return (
    <g id="tr-land">
      <rect x="0" y="0" width="1400" height="1000" fill="url(#tr-sky)" />
      {/* cumulus bank */}
      {/* three cumulus heads on a flat base, sky left open above (ref: ~55% sky) */}
      {[[330, 150], [700, 210], [1060, 130]].map(([cx, span], k) => Array.from({ length: 9 }, (_, i) => {
        const x = cx - span / 2 + (i / 8) * span + (rnd() - 0.5) * 20, r = 26 + rnd() * 22 + (4 - Math.abs(i - 4)) * 9;
        return <circle key={`${k}-${i}`} cx={x} cy={566 - r * 0.8} r={r} fill="#f7fbf5" />;
      }))}
      {Array.from({ length: 30 }, (_, i) => <circle key={`b${i}`} cx={180 + i * 36} cy={560} r={18 + rnd() * 12} fill="#f7fbf5" />)}
      <rect x="170" y="560" width="1040" height="22" fill="#f7fbf5" />
      <path d="M170 576 H1210 V600 H170Z" fill="#d0e7d3" />
      <path d="M178 612 L260 586 L360 598 L470 560 L560 590 L640 572 L760 600 L870 566 L980 596 L1080 580 L1160 600 V620 H178Z" fill="#7f9fc0" />
      <path d="M178 620 L300 604 L420 614 L560 598 L700 618 L860 606 L1000 620 L1160 610 V628 H178Z" fill="#5f86a8" />
      <rect x="170" y="626" width="1040" height="240" fill="#9fd48f" />
      <rect x="170" y="648" width="1040" height="44" fill="#c7eea0" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={170 + i * 170} y1="700" x2={120 + i * 200} y2="860" stroke="#8cc57d" strokeWidth="5" />)}
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={180 + i * 22} cy={616 + (i % 3) * 3} r={16 + (i % 4) * 4} fill="#4e7a3c" />)}
      <rect x="980" y="560" width="8" height="140" fill="#2e3a3a" /><rect x="962" y="572" width="44" height="6" fill="#2e3a3a" />
      <rect x="640" y="632" width="46" height="26" fill="#f1ede2" /><path d="M634 634 L663 616 L692 634Z" fill="#b24a3a" />
      {/* hedge */}
      <rect x="170" y="780" width="1040" height="90" fill="#3f6b2e" />
      {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={180 + i * 31} cy={782 + (i % 2) * 10} r={22 + (i % 3) * 5} fill={i % 3 ? '#5f8f45' : '#6fa152'} />)}
    </g>
  );
}

function Strap({ x, deg }) {
  return (
    <g transform={`rotate(${deg} ${x} 66)`}>
      <rect x={x - 9} y="66" width="18" height="190" rx="4" fill="#e6e0cf" stroke="#8d8676" strokeWidth="3" />
      <path d={`M${x} 250 L${x - 34} 318 Q${x - 38} 332 ${x - 22} 332 H${x + 22} Q${x + 38} 332 ${x + 34} 318Z`} fill="none" stroke="#f4f2ea" strokeWidth="13" strokeLinejoin="round" />
    </g>
  );
}

function Ad() {
  return (
    <g transform="translate(720 118)">
      <rect width="660" height="310" fill="#fff8ea" stroke="#b0123e" strokeWidth="6" />
      {/* left: onigiri + umeboshi */}
      <rect x="3" y="3" width="228" height="304" fill="#d7102b" />
      <text x="117" y="78" textAnchor="middle" className="ad-ume">梅</text>
      <ellipse cx="150" cy="150" rx="46" ry="22" transform="rotate(-30 150 150)" fill="#3f8f3a" />
      <path d="M117 100 C140 100 206 196 200 232 C196 256 38 256 34 232 C28 196 94 100 117 100Z" fill="#ffffff" stroke="#e8dccb" strokeWidth="3" />
      <path d="M58 206 H176 L190 252 C160 262 74 262 44 252Z" fill="#1d2b22" />
      <circle cx="117" cy="170" r="32" fill="#a8123e" />
      <path d="M100 160 q8 8 0 18 M122 150 q-6 14 4 26 M134 168 q-8 6 -4 16" stroke="#7a0a2a" strokeWidth="3" fill="none" />
      <ellipse cx="106" cy="158" rx="9" ry="6" fill="#e35a7a" />
      {/* centre: NOT Sweet™, the NOT-gate brand mark */}
      <text x="250" y="120" className="ad-not">NOT</text>
      <text x="252" y="196" className="ad-sweet">Sweet<tspan className="ad-tm" dx="8" dy="-46">™</tspan></text>
      <text x="252" y="232" className="ad-small">梅干しおにぎり ¥150</text>
      <g transform="translate(252 250)">
        <path d="M0 0 L40 20 L0 40Z" fill="none" stroke="#b0123e" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="48" cy="20" r="7" fill="none" stroke="#b0123e" strokeWidth="5" />
        <text x="66" y="34" className="ad-figur">Figur</text>
      </g>
      {/* right: すっぱい！ vertical + SOUR! */}
      <text x="616" y="22" className="ad-sour-jp" writingMode="tb">すっぱい！</text>
      <g transform="rotate(-8 506 268)">
        <rect x="444" y="242" width="124" height="54" rx="8" fill="#d7102b" />
        <text x="506" y="282" textAnchor="middle" className="ad-sour">SOUR!</text>
      </g>
      <text x="418" y="112" className="ad-bang">‼</text>
    </g>
  );
}

export default function Train({ props, rm }) {
  const pose = useStep(4, 4, !rm);
  const deg = [0, 1.4, 0, -1.4][pose];
  return (
    <div className={`art train cam${props.zoom ? ' zoom' : ''}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label="Inside a train on a sunny day. An umeboshi ad hangs from the ceiling: NOT Sweet, SOUR.">
        <defs>
          <linearGradient id="tr-sky" x1="0" y1="200" x2="0" y2="640" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2f6fb0" /><stop offset=".55" stopColor="#7cbbea" /><stop offset="1" stopColor="#d7ecf2" />
          </linearGradient>
          <clipPath id="tr-glass"><rect x="178" y="208" width="974" height="634" /></clipPath>
          <clipPath id="tr-glass2"><rect x="1462" y="236" width="236" height="330" /></clipPath>
        </defs>
        <rect width="1920" height="1080" fill="#3b3a33" />
        {/* ceiling + luggage rack + light */}
        <rect width="1920" height="124" fill="#262a2b" />
        {Array.from({ length: 50 }, (_, i) => <line key={i} x1={i * 40 - 20} y1="84" x2={i * 40 + 40} y2="124" stroke="#6f7777" strokeWidth="6" />)}
        <rect x="0" y="120" width="1920" height="10" fill="#8d9696" />
        <rect x="260" y="24" width="1400" height="16" rx="8" fill="#e9efe6" />
        {/* big window */}
        <rect x="140" y="170" width="1050" height="710" rx="10" fill="#a3abab" />
        <rect x="170" y="200" width="990" height="650" fill="#5c6363" />
        <g clipPath="url(#tr-glass)"><Land /></g>
        <rect x="170" y="566" width="990" height="26" fill="#a3abab" /><rect x="170" y="566" width="990" height="6" fill="#d7dddc" />
        <path d="M300 208 L420 208 L200 560 L178 560 L178 400Z M470 208 L520 208 L260 842 L210 842Z" fill="#ffffff" opacity=".10" clipPath="url(#tr-glass)" />
        <rect x="120" y="872" width="1090" height="40" fill="#8f9797" /><rect x="120" y="872" width="1090" height="7" fill="#c9d0cf" />
        {/* small window right */}
        <rect x="1440" y="214" width="280" height="374" rx="10" fill="#a3abab" />
        <g clipPath="url(#tr-glass2)"><use href="#tr-land" transform="translate(1180 -30)" /></g>
        <rect x="1440" y="150" width="330" height="44" rx="6" fill="#f4f2ea" />
        <text x="1456" y="182" className="line-name">AND Line</text>
        <line x1="1590" y1="172" x2="1750" y2="172" stroke="#ff5fa2" strokeWidth="6" />
        {[1600, 1636, 1672, 1708, 1744].map((x) => <circle key={x} cx={x} cy="172" r="7" fill="#fff" stroke="#ff5fa2" strokeWidth="4" />)}
        {/* wall under window, fold table + book */}
        <rect x="0" y="912" width="1920" height="100" fill="#34332d" />
        <rect x="330" y="912" width="320" height="22" fill="#7d8585" />
        <rect x="390" y="888" width="190" height="26" rx="3" fill="#e9dcc0" /><rect x="390" y="906" width="190" height="8" fill="#b9a77f" />
        {/* bench */}
        <path d="M1230 640 Q1230 610 1262 610 H1920 V830 H1230Z" fill="#833545" />
        <rect x="1230" y="610" width="690" height="26" rx="13" fill="#9c4556" />
        {[1360, 1500, 1640, 1780].map((x) => <line key={x} x1={x} y1="640" x2={x} y2="826" stroke="#6e2b3a" strokeWidth="5" />)}
        <path d="M1196 846 Q1196 826 1220 826 H1920 V940 H1196Z" fill="#a44a5c" />
        <rect x="1196" y="826" width="724" height="12" rx="6" fill="#b85d6e" />
        <rect x="1210" y="940" width="710" height="72" fill="#2a1c1f" />
        <rect x="0" y="1010" width="1920" height="70" fill="#1c1f20" />
        {/* strap bar, straps, the hanging ad */}
        <rect x="0" y="56" width="1920" height="12" rx="6" fill="#b9c1c1" />
        <line x1="770" y1="66" x2="770" y2="120" stroke="#b9c1c1" strokeWidth="4" /><line x1="1330" y1="66" x2="1330" y2="120" stroke="#b9c1c1" strokeWidth="4" />
        <Ad />
        {[250, 480, 1830].map((x) => <Strap key={x} x={x} deg={deg} />)}
      </svg>
    </div>
  );
}
