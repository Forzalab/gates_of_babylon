// Nanda V1b "gate-girl", ported from research/date-beta-mockups/HA/ha-nanda.js (girlB, front view; commit 8e5bd62).
// The gate keeps its real NAND orientation (flat back left, curved front right), the face sits on the body like the
// aleph portrait, and the NOT bubble sits at the true output position on the right, read as a side-pony tie.
// Pure SVG string builder (no raster, no AI art). Stages: 1 sweet, 2 clingy, 3 possessive (rule C), 4 reveal.
// Local units: ground point = (0, 0), figure ~300 tall (gate x2), thought bubble above the head.

const HEARTP = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
const BUBBLE = 'M-40 -30H40Q52 -30 52 -18V14Q52 26 40 26H-6L-26 44L-20 26H-40Q-52 26 -52 14V-18Q-52 -30 -40 -30Z';
const BODYB = 'M12 12H58A42 42 0 0 1 58 96H12V85.5A10.5 10.5 0 0 1 12 64.5V43.5A10.5 10.5 0 0 1 12 22.5Z';
const SKIRTB = 'M0 80H120V100H0Z';
const PONYB = 'M106 63C114 78 126 92 119 114C129 106 138 88 131 73C127 66 121 62 115 60Z';
const zig = (pts, b = 4) => pts.slice(1).map(([x1, y1], i) => { const [x0, y0] = pts[i]; return ` Q${(x0 + x1) / 2 + (y1 > y0 ? b : -b)},${(y0 + y1) / 2} ${x1},${y1}`; }).join('');
const FRINGEB = 'M0 0H120V40L100 41' + zig([[100, 41], [90, 27], [80, 38], [68, 26], [56, 37], [44, 26], [33, 37], [23, 28], [16, 38], [12, 34]], 2.4) + 'V0Z';

const SWEET = { body: '#ffffff', body2: '#ffe3f1', rim: '#d1177f', ink: '#6b0f45', blush: '#ff5fa8', lit: '#ffc4e6',
  hair: '#eceef9', hair2: '#aeb3d3', hairhl: '#ffffff', col: '#8a7ff0', col2: '#6152cf', stripe: '#ffffff', bow: '#ff5fa2', sock: '#ffffff',
  shoe: '#5a2350', mood: '#ff5fa2', shadow: '#3a0a26' };
export const PAL = {
  1: SWEET,
  2: { ...SWEET, mood: '#ffd0e4' },
  3: { ...SWEET, ink: '#2a0714', mood: '#f0243f', rim: '#b0105e' },
  4: { body: '#1a0610', body2: '#2a0714', rim: '#f0243f', ink: '#f0243f', blush: 'none', lit: '#f0243f',
    hair: '#35263b', hair2: '#5a4660', hairhl: '#6b5570', col: '#3a0a18', col2: '#f0243f', stripe: '#f0243f', bow: '#b0102c', sock: '#c890a8',
    shoe: '#12040b', mood: '#f0243f', shadow: '#000000', dark: true },
};

const heart = (x, y, s, f) => `<path d="${HEARTP}" transform="translate(${x} ${y}) scale(${s})" fill="${f}"/>`;
const nand = (x, y, r, fill, stroke = 'none', sw = 0) => `<path d="M${x - r},${y - r} L${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} L${x - r},${y + r} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${x + r + r * 0.32}" cy="${y}" r="${r * 0.32}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const bow = (x, y, s, P) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,0 L-17,-11 L-15,11 Z M0,0 L17,-11 L15,11 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6" stroke-linejoin="round"/><circle r="5" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6"/></g>`;
const pinClip = (x, y, rot, s, P) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${nand(0, 0, 9, P.dark ? '#3a0a18' : '#ff5fa2', P.rim, 2.6)}<circle cx="11.9" cy="0" r="2.2" fill="${P.mood}"/></g>`;

function face(stage, P) {
  const ink = P.ink, sw = 2.6;
  const blush = (op, hatch) => (P.blush === 'none' ? '' : `<ellipse cx="-21" cy="8" rx="7" ry="3.6" fill="${P.blush}" opacity="${op}"/><ellipse cx="17" cy="8" rx="7" ry="3.6" fill="${P.blush}" opacity="${op}"/>${hatch ? `<path d="M-25,6 l-2,4 M-21,6 l-2,4 M-17,6 l-2,4 M13,6 l-2,4 M17,6 l-2,4 M21,6 l-2,4" stroke="${ink}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>` : ''}`);
  if (stage === 1) {
    return `${blush(0.55)}<ellipse cx="-13" cy="-7" rx="4.2" ry="6" fill="${ink}"/><circle cx="-11.5" cy="-9.5" r="1.5" fill="#fff"/>
      <path d="M5,-6 Q11,-13 17,-6" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M-7,10 Q0,18 7,10" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  if (stage === 2) {
    const eye = (x) => `<ellipse cx="${x}" cy="-7" rx="5.4" ry="7.4" fill="${ink}"/>${nand(x - 1, -6.4, 2.5, '#ff8fc8')}<circle cx="${x + 2}" cy="-11" r="1.4" fill="#fff"/>`;
    return `${blush(0.8, true)}${eye(-13)}${eye(11)}<path d="M-8,9 Q0,19.5 8,9" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  if (stage === 3) {
    const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="6" ry="7.2" fill="#fff" stroke="${ink}" stroke-width="1.4"/>${nand(x - 0.8, -5.2, 2.3, ink)}
      <path d="M${x - 7.4},-7 Q${x},-15.5 ${x + 7.4},-7" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
    return `${blush(0.22)}${eye(-13)}${eye(11)}
      <path d="M-20,8 Q0,21 20,8 Q0,14.5 -20,8 Z" fill="${ink}"/><path d="M-20,8 Q0,21 20,8" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="5.6" ry="7.2" fill="#fff"/><circle cx="${x}" cy="-5" r="1.4" fill="#f0243f"/>`;
  return `${eye(-13)}${eye(11)}<path d="M-17,11 L17,11" stroke="#f0243f" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M-12,8.6 v4.8 M-6,8.6 v4.8 M0,8.6 v4.8 M6,8.6 v4.8 M12,8.6 v4.8" stroke="#f0243f" stroke-width="1.3" stroke-linecap="round"/>`;
}

// heart (1) · three hearts (2) · OR on the dark panel = rule C (3) · cracked heart (4)
function thought(stage) {
  const dark = stage >= 3;
  const box = `<path d="${BUBBLE}" fill="${dark ? '#1a0710' : '#fff'}" stroke="${dark ? '#f0243f' : '#e64aa6'}" stroke-width="3" stroke-linejoin="round"/>`;
  if (stage === 1) return box + heart(0, -4, 2.2, '#ff7fcf');
  if (stage === 2) return box + heart(-22, 0, 1.3, '#ff7fcf') + heart(0, -8, 1.7, '#ff5fa2') + heart(23, 0, 1.3, '#ff7fcf');
  if (stage === 3) return `${box}<text x="0" y="10" text-anchor="middle" font-family="Nunito Variable, Nunito, sans-serif" font-weight="900" font-size="38" fill="#ff6b7d">OR</text>`;
  return `${box}<path d="${HEARTP} M0 -3 L-3 3 L3 5 L0 10" transform="translate(0 -4) scale(2.2)" fill="none" stroke="#f0243f" stroke-width="1.4" stroke-linejoin="round"/>`;
}

let uid = 0;
// One figure as an SVG fragment (no <svg> wrapper). ids are unique per call so several can share a page.
export function nandaSVG({ stage = 1, talk = true } = {}) {
  const P = PAL[stage] ?? SWEET, n = ++uid, cb = `nd-cb${n}`, gb = `nd-gb${n}`, sh = `nd-sh${n}`;
  const legs = [40, 64].map((x) => `<rect x="${x - 3}" y="94" width="6" height="24" rx="3" fill="${P.sock}" stroke="${P.rim}" stroke-width="2"/>
    ${P.dark ? '' : `<rect x="${x - 3}" y="99" width="6" height="3" fill="${P.bow}"/>`}
    <path d="M${x - 9},125 C${x - 9},119 ${x - 4},117 ${x},117 C${x + 4},117 ${x + 9},119 ${x + 9},125 C${x + 9},127.5 ${x + 6},128.5 ${x},128.5 C${x - 6},128.5 ${x - 9},127.5 ${x - 9},125 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="1.8"/>
    <path d="M${x - 7},120.8 H${x + 7}" stroke="${P.dark ? P.rim : P.bow}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
  const shade = stage === 3 ? `<defs><linearGradient id="${sh}" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="72"><stop offset="0" stop-color="#2a0714" stop-opacity=".62"/><stop offset=".55" stop-color="#2a0714" stop-opacity=".38"/><stop offset="1" stop-color="#2a0714" stop-opacity="0"/></linearGradient></defs><rect x="0" y="12" width="120" height="60" fill="url(#${sh})"/>` : '';
  const gate = `<defs><clipPath id="${cb}"><path d="${BODYB}"/></clipPath>
      <radialGradient id="${gb}" cx=".42" cy=".4" r=".75"><stop offset="0" stop-color="${P.body}"/><stop offset="1" stop-color="${P.body2}"/></radialGradient></defs>
    <ellipse cx="52" cy="129" rx="58" ry="6.5" fill="${P.shadow}" opacity=".16"/>${legs}
    <path d="M-8 33H0M-8 75H0" stroke="${P.rim}" stroke-width="3" stroke-linecap="round"/><path d="M-3.5 31.5H6.5V34.5H-3.5ZM-3.5 73.5H6.5V76.5H-3.5Z" fill="${P.lit}"/>
    <path d="${BODYB}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
    <g clip-path="url(#${cb})">
      <g transform="translate(57 52)">${face(stage, P)}</g>${shade}
      <path d="M12 12H22V84H12Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="1.8"/>
      <path d="${FRINGEB}" fill="${P.hair}" stroke="${P.rim}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M58 13C55 20 53 26 54 34M58 13C62 20 66 26 66 33M36 14C33 22 32 28 33 34" fill="none" stroke="${P.hair2}" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M34 19C46 15 70 15 84 20" fill="none" stroke="${P.hairhl}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
      <path d="${SKIRTB}" fill="${P.col}"/>
      <path d="M22 83L21 97M34 83L33.5 97M46 83V97M58 83L58.5 97M70 83L71 96M82 83L83 94" stroke="${P.col2}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M0 80H120" stroke="${P.rim}" stroke-width="2"/><path d="M0 84.5H120" stroke="${P.stripe}" stroke-width="1.6"/>
    </g>
    <g transform="translate(57 81)"><path d="M0 0L-12 -6.5L-11 6.5Z M0 0L12 -6.5L11 6.5Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="1.6" stroke-linejoin="round"/><rect x="-3" y="-3.4" width="6" height="6.8" rx="2" fill="${P.bow}" stroke="${P.rim}" stroke-width="1.4"/></g>
    <path d="${BODYB}" fill="none" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
    ${P.dark ? '' : '<ellipse cx="90" cy="26" rx="7" ry="3.4" transform="rotate(40 90 26)" fill="#fff" opacity=".75"/>'}
    <path d="${PONYB}" fill="${P.hair}" stroke="${P.rim}" stroke-width="2.2" stroke-linejoin="round"/><path d="M112 70C120 82 126 92 124 104" fill="none" stroke="${P.hair2}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="112" cy="54" r="12" fill="${P.dark ? '#1a0610' : '#fff'}" stroke="${P.rim}" stroke-width="3.2"/>
    <circle cx="112" cy="54" r="5.2" fill="${P.mood}" opacity="${stage === 2 ? 0.5 : 0.9}"/><circle cx="108" cy="50" r="2" fill="#fff" opacity="${stage === 4 ? 0.25 : 0.9}"/>
    ${bow(111, 41.5, 0.5, P)}${pinClip(78, 22, -18, 0.5, P)}
    ${talk ? `<g transform="translate(104 -14) scale(.57)">${thought(stage)}</g>` : ''}`;
  return `<g transform="translate(-104 -252) scale(2)">${gate}</g>`;
}

// scare 0 -> sweet, 1 -> clingy, 2 -> possessive. The reveal (4) is only ever asked for by name.
export const stageFor = (scare) => [1, 2, 3][scare] ?? 1;
