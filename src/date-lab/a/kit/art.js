// PORTED from research/date-beta-mockups/shared/art.js (main's hand-authored SVG sprite) as an ES module for date-lab builder A.
// Changes: no IIFE / no DOM injection (role CSS lives in roles.css), root class art -> ka (so it never collides with date-beta .art).
// Every shape carries a ROLE class (k-*); colours come from CSS vars (roles.css), so each scene can re-grade her.
let uid = 0;
const id = (p) => `${p}${++uid}`;

// Role list -> CSS rules: .k-x { fill: var(--c-x); stroke: var(--s-x, var(--art-stroke)); }
const ROLES = ['hair', 'hair2', 'hairhl', 'skin', 'skin2', 'white', 'iris', 'iris2', 'pupil', 'lash', 'blush', 'mouth',
  'cloth', 'cloth2', 'collar', 'stripe', 'ribbon', 'tie', 'pin', 'tear', 'shade', 'sil', 'eye', 'metal', 'wall', 'wall2',
  'floor', 'floor2', 'glass', 'seat', 'light', 'wood', 'wood2', 'tile', 'cup', 'tea', 'steam', 'plum', 'egg', 'mochi',
  'phone', 'screen', 'xhair', 'xhair2', 'hood', 'hood2', 'cans', 'hand', 'hand2', 'sleeve', 'paper', 'frame', 'candle',
  'flame', 'night', 'shoe', 'shoe2', 'slipper', 'strap', 'accent'];

const mirror = (inner) => `<g transform="translate(600 0) scale(-1 1)">${inner}</g>`;

// ---------- eyes (local coords, centred on 0,0; left eye as drawn, right eye mirrored) ----------
function eye(face, cid) {
  // builder-A addition: a blink pose (closed lids, lash arc only) for the idle-life animation
  if (face === 'closed') return `<path class="k-lash ln fat" d="M-44,6 Q0,30 42,4"/><path class="k-lash ln" d="M38,4 L50,-2"/>`;
  const white = 'M-42,-8 C-28,-31 20,-34 40,-16 C43,12 24,36 0,38 C-25,36 -42,16 -42,-8 Z';
  let s = `<clipPath id="${cid}"><path d="${white}"/></clipPath>`;
  s += `<path class="k-white nostroke" d="${white}"/>`;
  if (face === 'wide') {
    s += `<g clip-path="url(#${cid})"><ellipse class="k-iris nostroke" cx="0" cy="3" rx="15" ry="19"/>
      <ellipse class="k-pupil nostroke" cx="0" cy="3" rx="3.5" ry="4.5"/></g>
      <circle class="k-white nostroke" cx="-5" cy="-3" r="2.2"/>
      <path class="k-lash ln fat" d="M-46,-10 C-31,-38 22,-41 44,-19"/>
      <path class="k-lash ln thin" d="M-34,34 Q0,48 30,32"/>
      <path class="k-lash ln thin" d="M-28,50 Q0,60 24,48"/>`;
    return s;
  }
  const dead = face === 'blank';
  s += `<g clip-path="url(#${cid})">
    <ellipse class="k-iris nostroke" cx="2" cy="4" rx="23" ry="31"/>
    ${dead ? '' : '<ellipse class="k-iris2 nostroke" cx="2" cy="16" rx="17" ry="16"/>'}
    <ellipse class="k-pupil nostroke" cx="2" cy="2" rx="10" ry="15"/>
    ${dead ? '<path class="k-skin nostroke" d="M-50,-44 L50,-44 L50,-4 C22,-14 -22,-14 -50,0 Z"/>' : ''}
  </g>`;
  if (!dead) {
    s += `<circle class="k-white nostroke" cx="-8" cy="-7" r="8.5"/><circle class="k-white nostroke" cx="12" cy="19" r="4"/>`;
    if (face === 'tears') s += `<circle class="k-white nostroke" cx="-14" cy="12" r="3.2"/><circle class="k-white nostroke" cx="8" cy="-12" r="3"/>
      <path class="k-tear ln fat" d="M-30,31 Q0,43 26,30"/>`;
  }
  s += dead
    ? `<path class="k-lash ln fat" d="M-46,-2 C-22,-15 20,-16 44,-7"/><path class="k-lash ln thin" d="M-26,35 Q0,42 22,34"/>`
    : `<path class="k-lash ln fat" d="M-46,-6 C-31,-35 22,-39 42,-18"/><path class="k-lash ln" d="M38,-18 L52,-9"/>
       <path class="k-lash ln thin" d="M-26,35 Q0,42 22,34"/>`;
  return s;
}

// ---------- the pin hair clip: a tiny NAND gate whose output bubble is her mood light ----------
function pin(x, y, rot, scale) {
  return `<g class="pin" transform="translate(${x} ${y}) rotate(${rot}) scale(${scale || 1})">
    <circle class="k-pin pinglow nostroke" cx="20" cy="0" r="12"/>
    <path class="k-tie thin" d="M-26,-7 L-18,-7 M-26,7 L-18,7"/>
    <path class="k-tie" d="M-18,-14 L0,-14 A14,14 0 0 1 0,14 L-18,14 Z"/>
    <circle class="k-pin pinbub" cx="20" cy="0" r="5.5"/>
    <path class="k-tie ln thin" d="M26,0 L36,0"/></g>`;
}

// strand zig-zag helper for bangs: [x,y] points, curves bow slightly
function strands(pts) {
  let d = '';
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2 + (y1 > y0 ? 7 : -7), cy = (y0 + y1) / 2;
    d += ` Q${cx},${cy} ${x1},${y1}`;
  }
  return d;
}

// ---------- NANDA bust (viewBox 0 0 600 900). face: smile | blank | tears | wide ----------
function nanda(opt = {}) {
  const eyes = opt.blink ? 'closed' : (opt.face || 'smile');
  const face = opt.face || 'smile';
  const pinState = opt.pin || ({ smile: 'hum', blank: 'off', tears: 'flicker', wide: 'red' })[face];
  const cL = id('eyeL'), cR = id('eyeR');
  const tailL = `<path class="k-hair" d="M192,168 C118,158 58,232 54,342 C50,452 96,522 80,642 C70,722 40,782 60,862 C96,800 120,760 130,690 C140,760 126,822 142,880 C176,800 176,720 166,640 C160,560 176,470 170,380 C168,300 190,238 216,204 Z"/>
    <path class="k-hair2 ln thin" d="M150,232 C98,302 92,420 116,540 M178,262 C142,362 152,482 146,622 M110,640 C98,700 88,760 92,820"/>`;
  const lockL = `<path class="k-hair" d="M186,226 C158,300 162,424 188,506 C204,462 212,400 222,330 C226,288 214,248 186,226 Z"/>`;
  const bangs = 'M174,302 C166,180 226,112 300,112 C374,112 434,180 426,302' + strands([[426, 302], [404, 242], [394, 318], [378, 236], [354, 300], [340, 230], [318, 290], [302, 232], [288, 302], [270, 234], [250, 296], [236, 240], [212, 314], [198, 246], [174, 302]]) + ' Z';
  const mouths = {
    smile: '<path class="k-mouth thin" d="M280,425 Q300,449 320,425 Q300,434 280,425 Z"/>',
    blank: '<path class="k-lash ln thin" d="M289,433 L311,433"/>',
    tears: '<path class="k-lash ln thin" d="M282,436 Q289,428 296,435 Q303,442 310,433"/><path class="k-lash ln thin" d="M310,433 Q317,430 322,423"/>',
    wide: '<path class="k-lash ln thin" d="M272,428 Q300,447 328,428"/><path class="k-mouth thin" d="M290,434 Q300,441 310,434 Z"/>',
  };
  const brows = {
    smile: 'M216,298 Q244,286 272,294 M328,294 Q356,286 384,298',
    blank: 'M218,300 L272,298 M328,298 L382,300',
    tears: 'M216,290 Q246,296 272,282 M328,282 Q354,296 384,290',
    wide: 'M214,286 Q244,272 274,286 M326,286 Q356,272 386,286',
  };
  const tears = face === 'tears' ? `<path class="k-tear" d="M228,388 C223,414 232,432 226,466 C240,444 246,414 240,388 Z"/>
    <path class="k-tear" d="M362,390 C358,410 366,428 360,452 C372,434 376,410 372,390 Z"/>
    <circle class="k-tear" cx="229" cy="486" r="5"/>` : '';
  const blush = (face === 'smile' || face === 'tears') ? `<g class="blush"><ellipse class="k-blush nostroke" cx="230" cy="402" rx="24" ry="10"/><ellipse class="k-blush nostroke" cx="370" cy="402" rx="24" ry="10"/>
    <path class="k-lash ln thin" d="M218,398 l-5,9 M230,398 l-5,9 M242,398 l-5,9 M358,398 l-5,9 M370,398 l-5,9 M382,398 l-5,9"/></g>` : '';
  const gid = id('shadeG');
  const G = `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="392"><stop offset="0" style="stop-color:var(--c-shade)" stop-opacity="1"/><stop offset=".6" style="stop-color:var(--c-shade)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--c-shade)" stop-opacity="0"/></linearGradient>`;
  const shade = face === 'wide' ? `${G}<path fill="url(#${gid})" stroke="none" d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z"/>` : '';
  const shade2 = face === 'wide' ? `<path fill="url(#${gid})" stroke="none" d="${bangs}"/>` : '';
  return `<svg class="ka sprite nanda face-${face} pin-${pinState}" viewBox="0 0 600 900" role="img" aria-label="Nanda, ${face}">
    <g class="tails">${tailL}${mirror(tailL)}</g>
    <path class="k-hair" d="M168,300 C150,180 220,108 300,108 C380,108 450,180 432,300 C444,420 452,560 440,700 L160,700 C148,560 156,420 168,300 Z"/>
    <path class="k-skin" d="M268,440 L268,532 C286,548 314,548 332,532 L332,440 Z"/>
    <path class="k-skin2 nostroke" d="M269,452 C288,500 312,500 331,452 Z"/>
    <path class="k-cloth" d="M118,900 C124,700 170,588 262,540 C284,560 316,560 338,540 C430,588 476,700 482,900 Z"/>
    <path class="k-collar" d="M262,540 C228,560 188,592 160,644 L238,706 L300,626 L362,706 L440,644 C412,592 372,560 338,540 L300,606 Z"/>
    <path class="k-stripe ln thin" d="M178,640 L240,690 L300,616 M422,640 L360,690 L300,616"/>
    <path class="k-ribbon" d="M300,660 L236,628 L242,690 Z M300,660 L364,628 L358,690 Z"/>
    <path class="k-ribbon" d="M290,664 L268,772 L292,756 L300,668 Z M310,664 L332,772 L308,756 L300,668 Z"/>
    <rect class="k-ribbon" x="286" y="648" width="28" height="26" rx="7"/>
    <path class="k-skin" d="M178,284 C178,392 240,456 300,478 C360,456 422,392 422,284 C422,188 178,188 178,284 Z"/>
    ${blush}
    <g transform="translate(244 352) scale(1.12)">${eye(eyes, cL)}</g>
    <g transform="translate(356 352) scale(-1.12 1.12)">${eye(eyes, cR)}</g>
    ${tears}
    <path class="k-lash ln thin" d="M297,398 L302,405"/>
    ${mouths[face]}
    ${shade}
    ${lockL}${mirror(lockL)}
    <path class="k-hair" d="${bangs}"/>
    <path class="k-hairhl nostroke" d="M206,196 C246,170 354,170 394,196 C356,188 244,188 206,206 Z"/>
    <path class="k-hair2 ln thin" d="M300,132 C286,170 280,200 288,300 M300,132 C320,170 328,206 318,290 M252,150 C236,190 234,220 250,296 M348,150 C368,190 370,220 354,300"/>
    ${shade2}
    <path class="k-lash ln brow" d="${brows[face]}"/>
    <path class="k-ribbon" d="M190,180 L156,150 L152,196 Z M190,180 L214,146 L224,190 Z"/><circle class="k-ribbon" cx="190" cy="178" r="11"/>
    <path class="k-ribbon" d="M410,180 L444,150 L448,196 Z M410,180 L386,146 L376,190 Z"/><circle class="k-ribbon" cx="410" cy="178" r="11"/>
    ${pin(372, 238, -24, 2.1)}
  </svg>`;
}

// ---------- XOR bust: purple bob, one eye under a long lock, headphones with the (+) sign ----------
function xor(opt = {}) {
  const cL = id('xeye');
  const cup = (x) => `<rect class="k-cans" x="${x}" y="236" width="56" height="112" rx="24"/>
    <circle class="k-cloth2 thin" cx="${x + 28}" cy="292" r="17"/><path class="k-cans ln thin" d="M${x + 28},275 L${x + 28},309 M${x + 11},292 L${x + 45},292"/>`;
  return `<svg class="ka sprite xor" viewBox="0 0 600 900" role="img" aria-label="XOR">
    <path class="k-xhair" d="M164,300 C150,176 222,112 300,112 C380,112 452,176 436,300 C446,360 446,420 428,452 L172,452 C154,420 154,360 164,300 Z"/>
    <path class="k-skin" d="M268,440 L268,532 C286,548 314,548 332,532 L332,440 Z"/>
    <path class="k-skin2 nostroke" d="M269,452 C288,500 312,500 331,452 Z"/>
    <path class="k-hood2" d="M200,560 C220,520 262,512 300,540 C338,512 380,520 400,560 C360,600 240,600 200,560 Z"/>
    <path class="k-hood" d="M110,900 C118,690 168,580 240,548 C262,578 338,578 360,548 C432,580 482,690 490,900 Z"/>
    <path class="k-hood2 ln" d="M270,582 L262,700 M330,582 L338,700"/>
    <circle class="k-cloth2" cx="262" cy="708" r="8"/><circle class="k-cloth2" cx="338" cy="708" r="8"/>
    <path class="k-hood2 thin" d="M206,820 L394,820 L380,900 L220,900 Z"/>
    <path class="k-skin" d="M180,286 C180,392 240,456 300,478 C360,456 420,392 420,286 C420,190 180,190 180,286 Z"/>
    <g transform="translate(248 356)"><clipPath id="${cL}"><path d="M-42,-8 C-28,-31 20,-34 40,-16 C43,12 24,36 0,38 C-25,36 -42,16 -42,-8 Z"/></clipPath>
      <path class="k-white thin" d="M-42,-8 C-28,-31 20,-34 40,-16 C43,12 24,36 0,38 C-25,36 -42,16 -42,-8 Z"/>
      <g clip-path="url(#${cL})"><ellipse class="k-iris nostroke" cx="4" cy="6" rx="22" ry="29"/><ellipse class="k-pupil nostroke" cx="4" cy="4" rx="9" ry="13"/>
      <path class="k-skin nostroke" d="M-50,-44 L50,-44 L50,-2 C22,-10 -22,-10 -50,2 Z"/></g>
      <circle class="k-white nostroke" cx="-6" cy="4" r="5"/>
      <path class="k-lash ln fat" d="M-46,0 C-22,-12 20,-13 44,-4"/><path class="k-lash ln thin" d="M-26,35 Q0,42 22,34"/></g>
    <path class="k-lash ln thin" d="M297,398 L302,405"/>
    <path class="k-lash ln thin" d="M284,434 Q302,438 318,424"/>
    <path class="k-xhair" d="M174,300 C164,200 226,128 300,126 C312,170 300,230 262,296 C248,258 240,236 238,226 C226,262 206,286 174,300 Z"/>
    <path class="k-xhair" d="M292,126 C372,124 434,190 430,300 C436,380 432,440 420,486 C402,450 380,420 352,420 C340,440 322,452 300,446 C336,380 334,320 318,262 C312,214 300,170 292,126 Z"/>
    <path class="k-xhair2 ln thin" d="M300,140 C330,210 350,300 336,410 M330,150 C372,220 392,320 380,440 M258,150 C244,200 240,240 244,280"/>
    <path class="k-cans ln" style="stroke-width:calc(var(--art-sw) * 5)" d="M176,258 C164,96 436,96 424,258"/>
    ${cup(146)}${cup(398)}
    <path class="k-accent nostroke" d="M394,262 L402,262 L402,322 L394,322 Z"/>
  </svg>`;
}

// ---------- silhouettes (local origin = feet centre, height ~600 at scale 1); eyes on their own layer ----------
const SIL = {
  suit: 'M-44,-498 C-44,-560 44,-560 44,-498 C44,-462 26,-440 0,-440 C-26,-440 -44,-462 -44,-498 Z M-96,-418 C-60,-440 60,-440 96,-418 C112,-320 110,-190 92,0 L-92,0 C-110,-190 -112,-320 -96,-418 Z',
  girl: 'M-58,-470 C-66,-560 66,-560 58,-470 C62,-420 54,-380 40,-360 L-40,-360 C-54,-380 -62,-420 -58,-470 Z M-80,-400 C-50,-424 50,-424 80,-400 C96,-330 100,-260 104,-210 L136,-60 L-136,-60 L-104,-210 C-100,-260 -96,-330 -80,-400 Z M-60,-60 L-50,0 L-20,0 L-24,-60 Z M24,-60 L20,0 L50,0 L60,-60 Z',
  hat: 'M-70,-520 L70,-520 L50,-540 C40,-580 -40,-580 -50,-540 Z M-42,-520 C-44,-470 -30,-440 0,-440 C30,-440 44,-470 42,-520 Z M-100,-416 C-60,-442 60,-442 100,-416 C118,-320 116,-190 96,0 L-96,0 C-116,-190 -118,-320 -100,-416 Z',
  bun: 'M0,-600 C22,-600 30,-578 22,-562 C50,-552 52,-500 44,-482 C40,-450 22,-436 0,-436 C-22,-436 -40,-450 -44,-482 C-52,-500 -50,-552 -22,-562 C-30,-578 -22,-600 0,-600 Z M-86,-414 C-50,-436 50,-436 86,-414 C104,-300 112,-160 120,0 L-120,0 C-112,-160 -104,-300 -86,-414 Z',
  nanda: 'M-50,-470 C-58,-560 58,-560 50,-470 C54,-430 40,-410 0,-404 C-40,-410 -54,-430 -50,-470 Z M-52,-530 C-110,-540 -150,-460 -140,-360 C-132,-280 -160,-220 -140,-140 C-112,-200 -108,-260 -104,-330 C-100,-400 -80,-470 -46,-500 Z M52,-530 C110,-540 150,-460 140,-360 C132,-280 160,-220 140,-140 C112,-200 108,-260 104,-330 C100,-400 80,-470 46,-500 Z M-82,-396 C-50,-420 50,-420 82,-396 C98,-320 100,-250 104,-200 L132,-60 L-132,-60 L-104,-200 C-100,-250 -98,-320 -82,-396 Z M-56,-60 L-46,0 L-18,0 L-22,-60 Z M22,-60 L18,0 L46,0 L56,-60 Z',
};
const EYES = { suit: -500, girl: -472, hat: -490, bun: -490, nanda: -476 };
function sil(kind, x, y, s, opt = {}) {
  const ey = EYES[kind];
  const pinDot = kind === 'nanda' ? `<circle class="k-pin pinbub nostroke" cx="52" cy="-528" r="9"/>` : '';
  return `<g class="sil sil-${kind}" transform="translate(${x} ${y}) scale(${s})">
    <path class="k-sil" d="${SIL[kind]}"/>${pinDot}
    <g class="eyes"><ellipse class="k-eye nostroke" cx="-17" cy="${ey}" rx="10" ry="${opt.slit ? 3.5 : 7}"/><ellipse class="k-eye nostroke" cx="17" cy="${ey}" rx="10" ry="${opt.slit ? 3.5 : 7}"/></g></g>`;
}

// ---------- MC = hands only ----------
function hand(x, y, s, flip, holding) {
  // back of a right hand coming up from the bottom edge, fingers curled over whatever it holds
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;
  return `<g class="hand" transform="${t}">
    <path class="k-sleeve" d="M-70,260 L-60,90 C-40,70 40,66 64,86 L84,260 Z"/>
    <path class="k-hand" d="M-56,96 C-70,40 -64,-20 -40,-50 L40,-60 C62,-40 70,20 60,96 Z"/>
    ${holding === 'open' ? `
    <rect class="k-hand" x="-50" y="-150" width="26" height="120" rx="13" transform="rotate(-8 -37 -40)"/>
    <rect class="k-hand" x="-20" y="-176" width="26" height="146" rx="13"/>
    <rect class="k-hand" x="10" y="-168" width="26" height="138" rx="13"/>
    <rect class="k-hand" x="38" y="-138" width="24" height="108" rx="12" transform="rotate(8 50 -40)"/>` : `
    <rect class="k-hand" x="-46" y="-104" width="26" height="70" rx="13"/>
    <rect class="k-hand" x="-18" y="-116" width="26" height="82" rx="13"/>
    <rect class="k-hand" x="10" y="-110" width="26" height="76" rx="13"/>
    <rect class="k-hand" x="36" y="-92" width="24" height="60" rx="12"/>`}
    <path class="k-hand" d="M-44,-6 C-86,-20 -98,-64 -84,-86 C-70,-96 -58,-80 -50,-54 C-44,-40 -36,-30 -30,-24 Z"/>
    <path class="k-hand2 ln thin" d="M-20,-30 L-20,-10 M8,-30 L8,-8 M34,-28 L34,-10"/></g>`;
}

// ---------- props ----------
const cup = (x, y, s, opt = {}) => `<g class="cup${opt.third ? ' third' : ''}" transform="translate(${x} ${y}) scale(${s})">
    <ellipse class="k-shade nostroke" cx="0" cy="84" rx="62" ry="12"/>
    <path class="k-cup" d="M-46,0 L46,0 L38,74 C24,86 -24,86 -38,74 Z"/>
    <path class="k-cup2 k-accent ln thin" d="M-43,24 L43,24"/>
    <ellipse class="k-cup" cx="0" cy="0" rx="46" ry="11"/>
    <ellipse class="k-tea nostroke" cx="0" cy="2" rx="40" ry="8"/></g>`;
const steam = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="k-steam ln" d="M-14,0 C-30,-30 6,-50 -8,-86 C-20,-116 10,-130 0,-160 M14,-6 C0,-30 30,-54 16,-84"/></g>`;
const plum = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle class="k-plum" cx="0" cy="0" r="20"/><path class="k-lash ln thin" d="M-8,-8 C-2,-2 -10,6 -4,12 M6,-10 C10,0 4,6 10,10"/><ellipse class="k-white nostroke" cx="-7" cy="-9" rx="5" ry="3" opacity=".7"/></g>`;
const egg = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect class="k-egg" x="-34" y="-20" width="68" height="40" rx="12"/><path class="k-egg2 k-accent ln thin" d="M-14,-18 C-30,-8 -24,14 -8,16 M8,-18 C-8,-8 -2,14 14,16"/></g>`;
const mochi = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="k-mochi" d="M-30,14 C-34,-10 -18,-24 0,-24 C18,-24 34,-10 30,14 C20,22 -20,22 -30,14 Z"/><ellipse class="k-blush nostroke" cx="0" cy="-6" rx="10" ry="5"/></g>`;
const shoe = (x, y, s, cls = 'k-shoe') => `<g transform="translate(${x} ${y}) scale(${s})">
    <path class="${cls}" d="M0,0 C-2,-24 18,-40 48,-40 L112,-34 C138,-30 150,-14 150,0 Z"/><path class="k-shoe2 thin" d="M-4,0 L154,0 L154,8 L-4,8 Z"/><path class="k-shoe2 ln thin" d="M40,-40 C52,-22 80,-22 96,-36"/></g>`;
const slipper = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path class="k-slipper" d="M0,-40 C0,-80 30,-96 60,-96 C90,-96 120,-80 120,-40 L120,90 C120,110 100,120 60,120 C20,120 0,110 0,90 Z"/>
    <path class="k-cloth2 k-slipper" d="M-6,-44 C-6,-100 126,-100 126,-44 L126,0 C90,-14 30,-14 -6,0 Z"/></g>`;
const phone = (x, y, s, inner = '') => `<g transform="translate(${x} ${y}) scale(${s})"><rect class="k-phone" x="-80" y="-160" width="160" height="320" rx="22"/><rect class="k-screen nostroke" x="-68" y="-138" width="136" height="276" rx="10"/>${inner}</g>`;

// tiny NAND schematic (the shrine's "your last circuit")
const nandSym = (x, y, s, cls = 'k-lash') => `<g transform="translate(${x} ${y}) scale(${s})">
    <path class="${cls} ln" d="M-60,-20 L-30,-20 M-60,20 L-30,20 M-30,-40 L0,-40 A40,40 0 0 1 0,40 L-30,40 Z M50,0 L80,0"/><circle class="${cls} ln" cx="45" cy="0" r="6"/></g>`;

// ---------- SCENES (1920x1080) ----------
// Train carriage looking down the aisle; every passenger has turned to camera. Nanda closest.
function sceneTrain(opt = {}) {
  const vx = 960, vy = 470;
  let s = `<svg class="ka scene train" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
    <rect class="k-wall" x="0" y="0" width="1920" height="1080"/>
    <path class="k-light" d="M0,0 L1920,0 L1110,380 L810,380 Z"/>
    <path class="k-floor" d="M0,1080 L1920,1080 L1110,600 L810,600 Z"/>
    <path class="k-floor2 ln thin" d="M960,600 L960,1080 M885,600 L620,1080 M1035,600 L1300,1080"/>
    <rect class="k-wall2" x="810" y="380" width="300" height="220"/>
    <rect class="k-glass" x="880" y="410" width="160" height="110" rx="6"/>
    <path class="k-metal ln" d="M960,410 L960,600"/>`;
  // side windows (trapezoids receding)
  const winL = [[0, 150, 250, 560], [300, 250, 460, 520], [520, 318, 610, 500], [650, 352, 700, 486]];
  for (const [x0, y0, x1, y1] of winL) {
    const t0 = y0, b0 = 1080 - y0 - 380, t1 = vy - (vy - t0) * (1 - (x1 - x0) / 900), b1 = y1;
    s += `<path class="k-night" d="M${x0},${t0} L${x1},${t0 + (x1 - x0) * 0.45} L${x1},${b1} L${x0},${b0 + 280} Z"/>`;
    s += `<path class="k-night" d="M${1920 - x0},${t0} L${1920 - x1},${t0 + (x1 - x0) * 0.45} L${1920 - x1},${b1} L${1920 - x0},${b0 + 280} Z"/>`;
  }
  // benches
  s += `<path class="k-seat" d="M0,760 L760,560 L790,600 L0,900 Z"/><path class="k-seat" d="M1920,760 L1160,560 L1130,600 L1920,900 Z"/>`;
  // rails + straps
  s += `<path class="k-metal ln fat" d="M0,160 L840,400 M1920,160 L1080,400"/>`;
  const straps = [[140, 200, 1], [420, 280, 0.72], [640, 342, 0.5], [780, 382, 0.34]];
  for (const [x, y, k] of straps) {
    for (const X of [x, 1920 - x]) s += `<g transform="translate(${X} ${y}) scale(${k})"><path class="k-strap ln" d="M0,0 L0,90"/><path class="k-strap ln fat" d="M0,90 L-28,150 L28,150 Z"/></g>`;
  }
  s += `<rect class="k-light" x="760" y="30" width="400" height="14" rx="7" opacity=".9"/>`;
  // passengers: far -> near
  const rows = opt.rows ?? 4;
  const P = [
    [[900, 590, 0.24, 'hat'], [1020, 592, 0.24, 'girl'], [960, 596, 0.22, 'suit']],
    [[780, 660, 0.4, 'bun'], [1140, 662, 0.4, 'suit'], [1040, 652, 0.36, 'hat'], [860, 650, 0.36, 'girl']],
    [[560, 780, 0.64, 'suit'], [1370, 790, 0.66, 'girl'], [740, 760, 0.58, 'hat'], [1190, 764, 0.58, 'bun']],
    [[260, 1010, 1.02, 'girl'], [1680, 1020, 1.06, 'suit'], [470, 990, 0.9, 'bun']],
  ];
  for (let r = 0; r < rows && r < P.length; r++) for (const [x, y, k, kind] of P[r]) s += sil(kind, x, y, k, { slit: opt.slit });
  if (opt.nanda !== false) s += sil('nanda', 1230, 1180, 1.5, {});
  s += '</svg>';
  return s;
}

// Genkan insert: her shoes lined to the millimetre, men's slippers already waiting, the tiny shrine.
function sceneGenkan(opt = {}) {
  let s = `<svg class="ka scene genkan" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
    <rect class="k-wall" x="0" y="0" width="1920" height="640"/>
    <rect class="k-wall2" x="0" y="0" width="1920" height="70"/>
    <path class="k-wood" d="M0,470 L1920,470 L1920,640 L0,640 Z"/>
    <path class="k-wood2 ln thin" d="M0,520 L1920,520 M0,576 L1920,576"/>
    <rect class="k-wood2" x="0" y="628" width="1920" height="40"/>
    <rect class="k-tile" x="0" y="668" width="1920" height="412"/>
    <path class="k-floor2 ln thin" d="M0,780 L1920,780 M0,900 L1920,900 M0,1020 L1920,1020 M240,668 L240,1080 M560,668 L560,1080 M880,668 L880,1080 M1200,668 L1200,1080 M1520,668 L1520,1080"/>
    <rect class="k-frame" x="120" y="70" width="330" height="400"/><rect class="k-glass" x="150" y="100" width="270" height="340"/>
    <path class="k-metal ln fat" d="M392,270 L392,320"/>`;
  // measurement ticks: OCPD ruler along the step edge
  for (let x = 520; x <= 1520; x += 40) s += `<path class="k-accent ln thin tick" d="M${x},668 L${x},${x % 200 === 120 ? 690 : 680}"/>`;
  // her shoes, 3 pairs, identical gaps
  [[560, 820], [860, 820], [1160, 820]].forEach(([x, y]) => { s += shoe(x, y, 1.1) + shoe(x + 20, y + 40, 1.1); });
  // the men's slippers, up on the wood, turned toward the door = toward you
  s += slipper(720, 520, 0.9) + slipper(860, 520, 0.9);
  // the shrine by the shoes
  s += `<g class="shrine" transform="translate(1540 150)">
      <path class="k-wood2" d="M-40,0 L330,0 L300,-40 L-10,-40 Z"/>
      <rect class="k-wood" x="-20" y="0" width="330" height="330"/>
      <rect class="k-frame" x="20" y="30" width="250" height="190"/>
      <rect class="k-paper" x="34" y="44" width="222" height="162"/>
      ${nandSym(150, 118, 1.2)}
      <text class="k-lash nostroke lbl" x="52" y="102" font-size="22">A</text><text class="k-lash nostroke lbl" x="52" y="150" font-size="22">B</text>
      ${cup(60, 250, 0.5)}${cup(230, 250, 0.5)}${plum(145, 272, 0.9)}
      <rect class="k-candle" x="136" y="190" width="18" height="46"/><path class="k-flame" d="M145,166 C156,178 152,190 145,190 C138,190 134,178 145,166 Z"/>
      <rect class="k-wood2" x="-30" y="330" width="350" height="18"/></g>`;
  s += '</svg>';
  return s;
}

// Third-cup kitchen: three cups, nobody poured the third. Steam writes OR.
function sceneKitchen(opt = {}) {
  let s = `<svg class="ka scene kitchen" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
    <rect class="k-wall" x="0" y="0" width="1920" height="1080"/>
    <rect class="k-wall2" x="0" y="380" width="1920" height="120"/>
    <rect class="k-frame" x="180" y="60" width="440" height="290"/><rect class="k-night" x="204" y="84" width="392" height="242"/>
    <path class="k-frame ln" d="M400,84 L400,326"/>
    <g class="clock" transform="translate(860 170)"><circle class="k-paper" r="74"/>
      <path class="k-lash ln fat" d="M0,0 L0,-52 M0,0 L0,-38"/><circle class="k-lash" r="6"/><text class="k-accent nostroke lbl" x="0" y="42" text-anchor="middle" font-size="20">Figur</text></g>
    <rect class="k-metal" x="1420" y="40" width="340" height="500" rx="16"/><path class="k-wall2 ln" d="M1420,210 L1760,210"/>
    <rect class="k-paper" x="1470" y="250" width="110" height="130"/>${plum(1525, 296, 1)}<text class="k-lash nostroke lbl" x="1525" y="358" text-anchor="middle" font-size="22">SOUR</text>
    <rect class="k-paper" x="1600" y="80" width="130" height="96"/><text class="k-lash nostroke lbl" x="1612" y="116" font-size="20">7:00 wake</text><text class="k-lash nostroke lbl" x="1612" y="148" font-size="20">7:05 tea</text>
    <path class="k-wood" d="M120,500 L1800,500 L1920,1080 L0,1080 Z"/>
    <path class="k-wood2 ln thin" d="M90,640 L1830,640 M50,800 L1870,800"/>`;
  s += cup(620, 560, 1.3) + cup(960, 540, 1.3) + cup(1300, 570, 1.4, { third: true });
  s += steam(620, 540, 0.8) + steam(960, 520, 0.8);
  s += `<g class="plate" transform="translate(300 700)"><ellipse class="k-cup" cx="0" cy="0" rx="130" ry="32"/>${plum(-44, -10, 1.15)}${plum(8, -16, 1.15)}${plum(52, -6, 1.15)}</g>`;
  s += hand(1600, 1020, 1.2, false, 'open');
  s += '</svg>';
  return s;
}

// Door / stairs backdrop for the HUD board
function sceneDoor() {
  let s = `<svg class="ka scene door" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
    <rect class="k-night" x="0" y="0" width="1920" height="1080"/>
    <rect class="k-wall" x="220" y="0" width="1480" height="1080"/>
    <rect class="k-wall2" x="220" y="0" width="1480" height="60"/>
    <rect class="k-frame" x="1100" y="200" width="420" height="760"/>
    <rect class="k-metal" x="1130" y="230" width="360" height="730"/>
    <rect class="k-paper" x="1250" y="290" width="120" height="50"/><text class="k-lash nostroke lbl" x="1310" y="325" text-anchor="middle" font-size="26">12</text>
    <rect class="k-frame" x="1150" y="560" width="40" height="80" rx="8"/>
    <circle class="k-light" cx="960" cy="110" r="36"/>
    <path class="k-metal ln fat" d="M220,1000 L1700,1000"/>
    <path class="k-metal ln" d="M220,900 L1080,900 M260,900 L260,1000 M420,900 L420,1000 M580,900 L580,1000 M740,900 L740,1000 M900,900 L900,1000 M1060,900 L1060,1000"/>
    <rect class="k-paper" x="300" y="200" width="240" height="160"/>
    <text class="k-lash nostroke lbl" x="420" y="262" text-anchor="middle" font-size="30">NOR-mal</text><text class="k-lash nostroke lbl" x="420" y="302" text-anchor="middle" font-size="22">Pharmacy · 24h</text>`;
  for (let i = 0; i < 40; i++) { const x = (i * 97) % 1920, y = (i * 211) % 1080; s += `<path class="k-steam ln thin rain" d="M${x},${y} l-10,40"/>`; }
  s += '</svg>';
  return s;
}

// Flowchart (the hidden map). Nodes: id, x, y, label, state (seen|locked|rewritten|here)
function flowchart(opt = {}) {
  const N = [
    ['start', 960, 70, 'START', 'seen'], ['roof', 960, 190, 'ROOFTOP', 'seen'],
    ['ume', 780, 300, 'umeboshi', 'seen'], ['egg', 1140, 300, 'tamagoyaki', 'dim'],
    ['train', 960, 410, 'TRAIN · chant', 'seen'], ['door', 960, 520, 'HER DOOR', 'here'],
    ['in', 620, 640, 'go in', 'seen'], ['home', 1300, 640, 'head home', 'seen'],
    ['cup', 620, 750, 'third cup', 'seen'], ['cafe', 1300, 750, 'café 7:00', 'locked'],
    ['steep', 470, 880, 'STEEPED', 'seen'], ['escape', 770, 880, 'ESCAPE', 'locked'],
    ['fu', 1150, 880, 'LEAVE', 'locked'], ['yeah', 1450, 880, 'FOREVER', 'locked'],
    ['q', 960, 990, '???', 'locked'], ['promise', 1560, 190, '"I\'ll stay. Forever."', 'rewritten'],
  ];
  const E = [['start', 'roof'], ['roof', 'ume'], ['roof', 'egg'], ['ume', 'train'], ['egg', 'train'], ['train', 'door'], ['door', 'in'], ['door', 'home'],
    ['in', 'cup'], ['home', 'cafe'], ['cup', 'steep'], ['cup', 'escape'], ['cafe', 'fu'], ['cafe', 'yeah'], ['fu', 'q'], ['yeah', 'q'], ['roof', 'promise']];
  const at = Object.fromEntries(N.map((n) => [n[0], n]));
  let s = `<svg class="ka flow" viewBox="0 0 1920 1080">`;
  for (const [a, b] of E) {
    const A = at[a], B = at[b], my = (A[2] + B[2]) / 2;
    const cls = (B[4] === 'locked' ? 'e-locked' : B[4] === 'rewritten' ? 'e-rw' : 'e-seen');
    s += `<path class="edge ${cls} ln" d="M${A[1]},${A[2] + 26} C${A[1]},${my} ${B[1]},${my} ${B[1]},${B[2] - 26}"/>`;
  }
  for (const [nid, x, y, label, st] of N) {
    const w = Math.max(150, label.length * 17 + 40);
    const txt = st === 'locked' ? '???' : label;
    s += `<g class="node n-${st}" data-node="${nid}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-26" width="${w}" height="52"/>
      <text x="0" y="9" text-anchor="middle">${txt.replace(/OR/g, '<tspan class="or-svg" dx="1" dy="1">OR</tspan><tspan dy="-1"></tspan>')}</text></g>`;
  }
  s += '</svg>';
  return s;
}

export { nanda, xor, sil, hand, cup, steam, plum, egg, mochi, shoe, slipper, phone, nandSym, pin,
  sceneTrain, sceneGenkan, sceneKitchen, sceneDoor, flowchart, ROLES };
