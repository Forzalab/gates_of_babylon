// Nanda's ECU eye layer for the Her Hold timeout (menu-h3-r3). Copied from Builder A's menu-3-r2 `EyesEcu`
// (a/menu2/EyesEcu.jsx, credited) and adapted: the pupils take a look VECTOR so they can sit on the purple box
// (down-right, where her hand is) and then snap into the lens; the face is re-centred for a letterbox frame (eyes on the
// frame's centre line, mouth under the bottom bar). The look changes only as ONE held cut, never a tween.
const K = 4.3;
const SW = (px) => px / K;
const WHITE = 'M-42,-8 C-28,-31 20,-34 40,-16 C43,12 24,36 0,38 C-25,36 -42,16 -42,-8 Z';
const INK = '#2a0f28';
const LOOKS = { lens: [0, 0], box: [13, 12], pink: [-10, 8] };

function Eye({ id, dx, dy }) {
  return (
    <>
      <clipPath id={id}><path d={WHITE} /></clipPath>
      <path d={WHITE} fill="#fbf6f4" />
      <g clipPath={`url(#${id})`}>
        <path d="M-50,-40 H50 V-12 C22,-24 -22,-24 -50,-10Z" fill="#e4c9d2" />
        <g transform={`translate(${dx} ${3 + dy})`}>
          <ellipse rx="16" ry="20" fill="#9e0f35" />
          <ellipse rx="12.5" ry="16" fill="none" stroke="#f0243f" strokeWidth={SW(7)} />
          <ellipse cy="7" rx="10" ry="7" fill="#d6337f" opacity=".55" />
          <ellipse rx="2.4" ry="3.2" fill="#12000a" />
        </g>
      </g>
      <path d={WHITE} fill="none" stroke={INK} strokeWidth={SW(6)} />
      <path d="M-47,-9 C-31,-39 22,-42 45,-18" fill="none" stroke={INK} strokeWidth={SW(19)} strokeLinecap="round" />
      <path d="M-34,34 Q0,48 30,32" fill="none" stroke={INK} strokeWidth={SW(8)} strokeLinecap="round" />
      <path d="M-28,50 Q0,60 24,48" fill="none" stroke={INK} strokeWidth={SW(6)} strokeLinecap="round" opacity=".8" />
    </>
  );
}

const STRANDS = [[426, 302], [404, 242], [394, 318], [378, 236], [354, 300], [340, 230], [318, 290], [302, 232], [288, 302], [270, 234], [250, 296], [236, 240], [212, 314], [198, 246], [174, 302]];
const BANGS = `M174,302 C166,180 226,112 300,112 C374,112 434,180 426,302${STRANDS.slice(1).map(([x1, y1], i) => {
  const [x0, y0] = STRANDS[i];
  return ` Q${(x0 + x1) / 2 + (y1 > y0 ? 7 : -7)},${(y0 + y1) / 2} ${x1},${y1}`;
}).join('')} Z`;
const LOCK = 'M186,226 C158,300 162,424 188,506 C204,462 212,400 222,330 C226,288 214,248 186,226 Z';

export default function Ecu({ look = 'lens', cy = 500 }) {
  const [dx, dy] = LOOKS[look] ?? LOOKS.lens;
  return (
    <svg className="r3-ecu" viewBox="0 0 1920 1080" aria-label={look === 'lens' ? 'Nanda, extreme close-up, staring into the lens' : 'Nanda, extreme close-up, her eyes on the purple box'}>
      <defs>
        <linearGradient id="r3e-shade" gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="400">
          <stop offset="0" stopColor="#3a0a22" stopOpacity=".78" /><stop offset=".62" stopColor="#3a0a22" stopOpacity=".5" /><stop offset="1" stopColor="#3a0a22" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="r3e-vig" cx="50%" cy="46%" r="70%"><stop offset=".45" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#05000a" stopOpacity=".75" /></radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="#b9bdd6" />
      <g transform={`translate(960 ${cy}) scale(${K}) translate(-300 -352)`}>
        <path d="M100,100 H500 V600 H100Z" fill="#dfe2f2" />
        <path d="M150,232 C98,302 92,420 116,540 M450,232 C502,302 508,420 484,540" fill="none" stroke="#9ea3c8" strokeWidth={SW(7)} />
        <path d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z" fill="#ffece3" stroke={INK} strokeWidth={SW(9)} />
        <path d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z" fill="url(#r3e-shade)" />
        <g transform="translate(246 352) scale(1.02)"><Eye id="r3e-eL" dx={dx} dy={dy} /></g>
        <g transform="translate(354 352) scale(-1.02 1.02)"><Eye id="r3e-eR" dx={-dx} dy={dy} /></g>
        <path d="M297,398 L302,406" stroke={INK} strokeWidth={SW(7)} strokeLinecap="round" />
        <path d="M272,428 Q300,447 328,428" fill="none" stroke={INK} strokeWidth={SW(8)} strokeLinecap="round" />
        <path d={LOCK} fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} />
        <path d={LOCK} transform="translate(600 0) scale(-1 1)" fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} />
        <path d={BANGS} fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} strokeLinejoin="round" />
        <path d={BANGS} fill="url(#r3e-shade)" />
        <path d="M300,132 C286,170 280,200 288,300 M300,132 C320,170 328,206 318,290 M252,150 C236,190 234,220 250,296 M348,150 C368,190 370,220 354,300" fill="none" stroke="#9ea3c8" strokeWidth={SW(7)} />
        <path d="M214,286 Q244,272 274,286 M326,286 Q356,272 386,286" fill="none" stroke={INK} strokeWidth={SW(15)} strokeLinecap="round" />
        <g transform="translate(372 238) rotate(-24) scale(2.1)">
          <path d="M-18,-14 L0,-14 A14,14 0 0 1 0,14 L-18,14 Z" fill="#fff" stroke={INK} strokeWidth={SW(9) / 2.1} />
          <circle cx="20" cy="0" r="5.5" fill="#f0243f" stroke={INK} strokeWidth={SW(9) / 2.1} />
        </g>
      </g>
      <rect width="1920" height="1080" fill="url(#r3e-vig)" />
    </svg>
  );
}
