// A dedicated ECU layer of Nanda's eyes (menu-3-r2 lens beat). NOT the bust scaled 3x: the geometry is main's sprite face,
// but every line weight is authored for the ECU (lids ~17 px, lower lid ~8 px, face edge ~9 px on the 1920 stage), the
// highlight is removed (yandere stare), the iris is shrunk and re-coloured toward her red, the pupil is a pinpoint.
// `look` = 'mc' (pupils off to screen-left, at MC) | 'you' (dead centre, into the lens). Swapped as ONE held cut, never tweened.
const K = 4.3; // sprite units -> stage px
const SW = (px) => px / K; // author strokes in stage px

const WHITE = 'M-42,-8 C-28,-31 20,-34 40,-16 C43,12 24,36 0,38 C-25,36 -42,16 -42,-8 Z';
const INK = '#2a0f28';

function Eye({ id, dx }) {
  return (
    <>
      <clipPath id={id}><path d={WHITE} /></clipPath>
      <path d={WHITE} fill="#fbf6f4" />
      <g clipPath={`url(#${id})`}>
        {/* upper-lid shadow on the eyeball (reads as depth at ECU size) */}
        <path d="M-50,-40 H50 V-12 C22,-24 -22,-24 -50,-10Z" fill="#e4c9d2" />
        <g transform={`translate(${dx} 3)`}>
          <ellipse rx="16" ry="20" fill="#9e0f35" />
          <ellipse rx="12.5" ry="16" fill="none" stroke="#f0243f" strokeWidth={SW(7)} />
          <ellipse cy="7" rx="10" ry="7" fill="#d6337f" opacity=".55" />
          <ellipse rx="2.4" ry="3.2" fill="#12000a" />
        </g>
      </g>
      <path d={WHITE} fill="none" stroke={INK} strokeWidth={SW(6)} />
      {/* heavy upper lid + outer lash flick, thin lower lid, two tension lines under */}
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

export default function EyesEcu({ look = 'you', pin = 'red' }) {
  const dx = look === 'mc' ? -9 : 0; // local units inside the (mirrored) eye
  return (
    <svg className="ecu full" viewBox="0 0 1920 1080" aria-label="Nanda, extreme close-up, staring into the lens">
      <defs>
        <linearGradient id="ecu-shade" gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="400">
          <stop offset="0" stopColor="#3a0a22" stopOpacity=".78" /><stop offset=".62" stopColor="#3a0a22" stopOpacity=".5" /><stop offset="1" stopColor="#3a0a22" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ecu-pin" cx="0" cy="0" r="1"><stop offset="0" stopColor="#f0243f" stopOpacity=".7" /><stop offset="1" stopColor="#f0243f" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="#cfd2e6" />
      <g transform={`translate(960 590) scale(${K}) translate(-300 -352)`}>
        {/* hair mass behind the face */}
        <path d="M100,100 H500 V600 H100Z" fill="#dfe2f2" />
        <path d="M150,232 C98,302 92,420 116,540 M450,232 C502,302 508,420 484,540" fill="none" stroke="#9ea3c8" strokeWidth={SW(7)} />
        {/* face */}
        <path d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z" fill="#ffece3" stroke={INK} strokeWidth={SW(9)} />
        <path d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z" fill="url(#ecu-shade)" />
        <g transform="translate(246 352) scale(1.02)"><Eye id="ecu-eL" dx={dx} /></g>
        <g transform="translate(354 352) scale(-1.02 1.02)"><Eye id="ecu-eR" dx={-dx} /></g>
        <path d="M297,398 L302,406" stroke={INK} strokeWidth={SW(7)} strokeLinecap="round" />
        <path d="M272,428 Q300,447 328,428" fill="none" stroke={INK} strokeWidth={SW(8)} strokeLinecap="round" />
        <path d="M290,434 Q300,441 310,434 Z" fill="#c93d64" stroke={INK} strokeWidth={SW(5)} />
        {/* side locks + bangs, thick ECU outline */}
        <path d={LOCK} fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} />
        <path d={LOCK} transform="translate(600 0) scale(-1 1)" fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} />
        <path d={BANGS} fill="#e9ebf6" stroke={INK} strokeWidth={SW(9)} strokeLinejoin="round" />
        <path d={BANGS} fill="url(#ecu-shade)" />
        <path d="M300,132 C286,170 280,200 288,300 M300,132 C320,170 328,206 318,290 M252,150 C236,190 234,220 250,296 M348,150 C368,190 370,220 354,300" fill="none" stroke="#9ea3c8" strokeWidth={SW(7)} />
        {/* brows, raised (wide) */}
        <path d="M214,286 Q244,272 274,286 M326,286 Q356,272 386,286" fill="none" stroke={INK} strokeWidth={SW(15)} strokeLinecap="round" />
        {/* her pin (the NAND clip), bubble = mood */}
        <g transform="translate(372 238) rotate(-24) scale(2.1)">
          {pin === 'red' && <circle cx="20" cy="0" r="16" fill="url(#ecu-pin)" />}
          <path d="M-18,-14 L0,-14 A14,14 0 0 1 0,14 L-18,14 Z" fill="#fff" stroke={INK} strokeWidth={SW(9) / 2.1} />
          <circle cx="20" cy="0" r="5.5" fill={pin === 'red' ? '#f0243f' : '#ff5fa2'} stroke={INK} strokeWidth={SW(9) / 2.1} />
        </g>
      </g>
    </svg>
  );
}
