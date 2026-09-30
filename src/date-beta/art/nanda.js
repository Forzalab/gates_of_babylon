// Nanda V1b "gate-girl", ported from research/date-beta-mockups/HA/ha-nanda.js (girlB, front view; commit 8e5bd62).
// The gate keeps its real NAND orientation (flat back left, curved front right), the face sits on the body like the
// aleph portrait, and the NOT bubble sits at the true output position on the right, read as a side-pony tie.
// Pure SVG string builder (no raster, no AI art). Stages: 1 sweet, 2 clingy, 3 possessive (rule C), 4 reveal.
// Local units: ground point = (0, 0), figure ~300 tall (gate x2), thought bubble above the head.
// Emotes (HUD SPEC): nandaSVG({ emote, big }) = palette + face + bubble per reaction; sweat + pout are new faces/bubbles.
// `stage` alone (1-4) keeps the old look (heart / hearts / or / crack). `big` = reaction-size bubble.

const HEARTP = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
const BUBBLE = 'M-40 -30H40Q52 -30 52 -18V14Q52 26 40 26H-6L-26 44L-20 26H-40Q-52 26 -52 14V-18Q-52 -30 -40 -30Z';
const BODYB = 'M12 12H58A42 42 0 0 1 58 96H12V85.5A10.5 10.5 0 0 1 12 64.5V43.5A10.5 10.5 0 0 1 12 22.5Z';
const SKIRTB = 'M0 80H120V100H0Z';
const PONYB = 'M106 63C114 78 126 92 119 114C129 106 138 88 131 73C127 66 121 62 115 60Z';
const DROP = 'M0 -11C4 -5 8 0 8 4.5A8 8 0 0 1 -8 4.5C-8 0 -4 -5 0 -11Z';
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
  // cold: her sweet palette drained to grey-violet, red only in the mood light
  5: { ...SWEET, body: '#dcd9e8', body2: '#a9a3c0', rim: '#3a2a55', ink: '#1a1024', blush: 'none', lit: '#b7b0cf', bow: '#5a3a7a',
    col: '#4a3d66', col2: '#2a2040', hair: '#b9b8cc', hair2: '#7d7a98', hairhl: '#dcdbe8', mood: '#f0243f' },
};

const heart = (x, y, s, f) => `<path d="${HEARTP}" transform="translate(${x} ${y}) scale(${s})" fill="${f}"/>`;
const nand = (x, y, r, fill, stroke = 'none', sw = 0) => `<path d="M${x - r},${y - r} L${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} L${x - r},${y + r} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${x + r + r * 0.32}" cy="${y}" r="${r * 0.32}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const bow = (x, y, s, P) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,0 L-17,-11 L-15,11 Z M0,0 L17,-11 L15,11 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6" stroke-linejoin="round"/><circle r="5" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6"/></g>`;
const pinClip = (x, y, rot, s, P) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${nand(0, 0, 9, P.dark ? '#3a0a18' : '#ff5fa2', P.rim, 2.6)}<circle cx="11.9" cy="0" r="2.2" fill="${P.mood}"/></g>`;

// ---- faces (face coords: origin = aleph face centre). 1-4 = the engine's stages, verbatim. sweat + pout = NEW.
const blushOf = (P, op, hatch, rx = 7, ry = 3.6) => (P.blush === 'none' ? '' : `<ellipse cx="-21" cy="8" rx="${rx}" ry="${ry}" fill="${P.blush}" opacity="${op}"/><ellipse cx="17" cy="8" rx="${rx}" ry="${ry}" fill="${P.blush}" opacity="${op}"/>${hatch ? `<path d="M-25,6 l-2,4 M-21,6 l-2,4 M-17,6 l-2,4 M13,6 l-2,4 M17,6 l-2,4 M21,6 l-2,4" stroke="${P.ink}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>` : ''}`);
const FACES = {
  // NEW hate (angry, cold): flat dead eyes (bars), slanted brows, a flat mouth, a vein mark. No blush.
  hate: (P, sw) => `<path d="M-19,-6 H-7 M5,-6 H17" stroke="${P.ink}" stroke-width="${sw + 1.2}" stroke-linecap="round"/>
      <path d="M-20,-13 L-6,-9 M18,-13 L4,-9" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-7,12 H7" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M20,-20 l4,3 M24,-20 l-4,3" stroke="#f0243f" stroke-width="2" stroke-linecap="round"/>`,
  1: (P, sw) => `${blushOf(P, 0.55)}<ellipse cx="-13" cy="-7" rx="4.2" ry="6" fill="${P.ink}"/><circle cx="-11.5" cy="-9.5" r="1.5" fill="#fff"/>
      <path d="M5,-6 Q11,-13 17,-6" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M-7,10 Q0,18 7,10" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>`,
  2: (P, sw) => {
    const eye = (x) => `<ellipse cx="${x}" cy="-7" rx="5.4" ry="7.4" fill="${P.ink}"/>${nand(x - 1, -6.4, 2.5, '#ff8fc8')}<circle cx="${x + 2}" cy="-11" r="1.4" fill="#fff"/>`;
    return `${blushOf(P, 0.8, true)}${eye(-13)}${eye(11)}<path d="M-8,9 Q0,19.5 8,9" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
  },
  3: (P) => {
    const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="6" ry="7.2" fill="#fff" stroke="${P.ink}" stroke-width="1.4"/>${nand(x - 0.8, -5.2, 2.3, P.ink)}
      <path d="M${x - 7.4},-7 Q${x},-15.5 ${x + 7.4},-7" fill="none" stroke="${P.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
    return `${blushOf(P, 0.22)}${eye(-13)}${eye(11)}
      <path d="M-20,8 Q0,21 20,8 Q0,14.5 -20,8 Z" fill="${P.ink}"/><path d="M-20,8 Q0,21 20,8" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/>`;
  },
  4: () => {
    const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="5.6" ry="7.2" fill="#fff"/><circle cx="${x}" cy="-5" r="1.4" fill="#f0243f"/>`;
    return `${eye(-13)}${eye(11)}<path d="M-17,11 L17,11" stroke="#f0243f" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-12,8.6 v4.8 M-6,8.6 v4.8 M0,8.6 v4.8 M6,8.6 v4.8 M12,8.6 v4.8" stroke="#f0243f" stroke-width="1.3" stroke-linecap="round"/>`;
  },
  // NEW sweat (+1, flustered): both eyes open and round, a wobbly smile, hatch blush. The drop sits outside the clip (see DECOR).
  sweat: (P, sw) => {
    const eye = (x) => `<ellipse cx="${x}" cy="-7" rx="4.2" ry="5.6" fill="${P.ink}"/><circle cx="${x + 1.5}" cy="-9.5" r="1.4" fill="#fff"/>`;
    return `${blushOf(P, 0.7, true)}${eye(-13)}${eye(11)}<path d="M-8,11 Q-5,8 -2.5,11 Q0,14 2.5,11 Q5,8 8,11" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
  },
  // NEW puff (gacha anger, ref 11): open glaring eyes (flat lids slanting down to the centre), pouting brows angled down to
  // the centre, a squashed mouth. Cheeks, blush hatching and the teardrop are the `puff` face layer (art/emotion/face.js).
  puff: (P, sw) => {
    const eye = (x, d) => `<path d="M${x - 5.5 * d},-10.5 L${x + 5.5 * d},-7.5 Q${x + 5 * d},1 ${x},1 Q${x - 5.5 * d},1 ${x - 5.5 * d},-10.5 Z" fill="${P.ink}"/><circle cx="${x + 1.4 * d}" cy="-3" r="1.4" fill="#fff"/>`;
    return `${eye(-13, 1)}${eye(11, -1)}<path d="M-21,-17 L-8,-12 M19,-17 L6,-12" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round"/>
      <path d="M-7,12 Q-3.5,9.6 0,12 Q3.5,9.6 7,12 Q3.5,14.6 0,13.2 Q-3.5,14.6 -7,12 Z" fill="#e05a8a" stroke="${P.ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
  },
  // NEW pout (-1, hurt): eyes squeezed shut (> <), brows pinched, cheeks puffed (big blush), a small pursed mouth.
  pout: (P, sw) => `${blushOf(P, 0.85, false, 8.5, 5)}
      <path d="M-18,-10 L-10,-6.5 L-18,-3" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16,-10 L8,-6.5 L16,-3" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-19,-16 L-9,-13 M17,-16 L7,-13" stroke="${P.ink}" stroke-width="2" stroke-linecap="round"/>
      <path d="M-5,13 Q-2.5,9.5 0,12 Q2.5,9.5 5,13" fill="none" stroke="${P.ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`,
};

// ---- Scene A faces (research/sprint-0930/scene-a/FACES.md; refs 12-15). Same face coords as above, her palette's ink,
// her blush pink. Picked by id (nandaSVG({ face })), never by emote, so the engine's emote list does not change.
// Each may bring still decor outside her body clip (FACE_DECOR, gate units): drops, flicks, hearts.
const bigEye = (x, y, rx, ry, P, lash = true) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${P.ink}"/>
      <ellipse cx="${x}" cy="${y + ry * 0.38}" rx="${rx * 0.72}" ry="${ry * 0.45}" fill="#b8508a" opacity=".55"/>
      <circle cx="${x + rx * 0.34}" cy="${y - ry * 0.4}" r="${rx * 0.42}" fill="#fff"/><circle cx="${x - rx * 0.38}" cy="${y + ry * 0.36}" r="${rx * 0.2}" fill="#fff"/>
      <path d="M${x - rx * 1.15},${y - ry * 0.55} Q${x},${y - ry * 1.45} ${x + rx * 1.15},${y - ry * 0.55}" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/>
      ${lash ? `<path d="M${x + rx * 1.05 * Math.sign(x || 1)},${y - ry * 0.62} l${2.6 * Math.sign(x || 1)},-2.2" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/>` : ''}`;
// vertical hatch blush (ref 14): 3-4 short strokes per cheek over a faint flush
const hatchV = (P, op = 0.35) => (P.blush === 'none' ? '' : `<ellipse cx="-21" cy="8" rx="7.5" ry="3.6" fill="${P.blush}" opacity="${op}"/><ellipse cx="17" cy="8" rx="7.5" ry="3.6" fill="${P.blush}" opacity="${op}"/>`)
  + `<path d="M-25,5.5 v4.5 M-22,5 v5 M-19,5 v5 M-16,5.5 v4.5 M13,5.5 v4.5 M16,5 v5 M19,5 v5 M22,5.5 v4.5" stroke="${P.ink}" stroke-width="1" stroke-linecap="round" opacity=".62"/>`;
// the ref 13 blush band: one hot band across both cheeks and the nose, /// hatch on each side
const band = (P, op = 0.62) => (P.blush === 'none' ? '' : `<ellipse cx="-2" cy="6" rx="30" ry="6.2" fill="${P.blush}" opacity="${op}"/>`)
  + `<path d="M-26,9.5 l3,-6 M-22,9.5 l3,-6 M-18,9.5 l3,-6 M12,9.5 l3,-6 M16,9.5 l3,-6 M20,9.5 l3,-6" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round" opacity=".75"/>`;
const squint = (P, w = 3) => `<path d="M-19,-11 L-9,-6 L-19,-1" fill="none" stroke="${P.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15,-11 L5,-6 L15,-1" fill="none" stroke="${P.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const SCENE_FACES = ['anya-smile', 'blush-embarrassed', 'heart-laugh', 'content', 'big-eyes-peek'];
Object.assign(FACES, {
  // ref 14: huge glossy eyes (2 highlights, lash flick), a tiny nose tick, a wide flat closed smile, hatch blush
  'anya-smile': (P) => `${hatchV(P)}${bigEye(-13, -5, 6, 7.6, P)}${bigEye(11, -5, 6, 7.6, P)}
      <path d="M-1,3 v2.4" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M-13,11.5 Q-1,15.5 11,11.5" fill="none" stroke="${P.ink}" stroke-width="1.9" stroke-linecap="round"/>`,
  // ref 13 >///<: squeezed chevron eyes, a hot band with /// hatch, a wobbly flustered mouth (drops + flicks = decor)
  'blush-embarrassed': (P, sw) => `${band(P)}${squint(P, sw)}
      <path d="M-7,13 q1.75,-3 3.5,0 q1.75,3 3.5,0 q1.75,-3 3.5,0 q1.75,3 3.5,0" fill="none" stroke="${P.ink}" stroke-width="${sw * 0.8}" stroke-linecap="round" stroke-linejoin="round"/>`,
  // ref 15 + ref 13 laugh: >< eyes, raised brows, a tall open mouth with a tongue, red blush bands (hearts = decor)
  'heart-laugh': (P, sw) => `${band(P, 0.75)}${squint(P, sw + 0.4)}
      <path d="M-20,-17 Q-14,-20 -8,-17 M4,-17 Q10,-20 16,-17" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M-11,7 Q-1,9 9,7 Q8,21 -1,22 Q-10,21 -11,7Z" fill="${P.ink}" stroke="${P.ink}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M-7,17.5 Q-1,13.5 5,17.5 Q3,20.6 -1,20.8 Q-5,20.6 -7,17.5Z" fill="#ff7fa8"/>`,
  // ref 12 "Content": closed happy arcs, a small soft smile, a plain soft blush
  content: (P, sw) => `${blushOf(P, 0.5)}
      <path d="M-19,-4 Q-13,-12 -7,-4 M5,-4 Q11,-12 17,-4" fill="none" stroke="${P.ink}" stroke-width="${sw + 0.4}" stroke-linecap="round"/>
      <path d="M-5,10 Q-1,13.6 3,10" fill="none" stroke="${P.ink}" stroke-width="${sw * 0.8}" stroke-linecap="round"/>`,
  // the watching-you-eat stare: even bigger eyes than anya-smile, raised brows, a tiny closed mouth
  'big-eyes-peek': (P) => `${blushOf(P, 0.4)}${bigEye(-14, -3, 7.6, 9.8, P)}${bigEye(12, -3, 7.6, 9.8, P)}
      <path d="M-4,12 Q-1,13.6 2,12" fill="none" stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round"/>`,
});
const DROPS = (pts) => pts.map(([x, y, s]) => `<path d="${DROP}" transform="translate(${x} ${y}) scale(${s})" fill="#8fd3ff" stroke="#1f5f96" stroke-width="${(1.6 / s).toFixed(2)}" stroke-linejoin="round"/><ellipse cx="${x - s * 2}" cy="${y + s * 2}" rx="${s * 1.4}" ry="${s * 2.2}" fill="#fff" opacity=".8"/>`).join('');
const FLICKS = (pts, ink) => pts.map(([x, y, r]) => `<path d="M${x - 3.4},${y - 3} L${x + 3.4},${y - 3} L${x},${y + 3.4}Z" transform="rotate(${r} ${x} ${y})" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>`).join('');
export const FACE_DECOR = {
  // the ref 13 sweat row: three drops stepping down past her right temple, two flick triangles over her head
  'blush-embarrassed': (P) => DROPS([[96, 8, 0.7], [104, 20, 0.58], [109, 32, 0.48]]) + FLICKS([[26, -2, -18], [36, -8, 10]], P.ink),
  // ref 15 hearts floating round her head (still), ref 13's flicks
  'heart-laugh': () => [[-8, 4, 0.62, -14], [8, -12, 0.5, 10], [104, 6, 0.66, 16], [120, 30, 0.44, -10], [-12, 40, 0.42, 12]]
    .map(([x, y, s, r]) => `<path d="${HEARTP}" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="#ff7fb8" stroke="#c21a6a" stroke-width="${(1.4 / s).toFixed(2)}"/>`).join('')
    + FLICKS([[30, -2, -16], [42, -8, 12]], '#6b0f45'),
};

// ---- thought bubbles. heart / hearts / OR / crack = the engine's stage bubbles, verbatim. sweat + pout = NEW.
const box = (dark) => `<path d="${BUBBLE}" fill="${dark ? '#1a0710' : '#fff'}" stroke="${dark ? '#f0243f' : '#e64aa6'}" stroke-width="3" stroke-linejoin="round"/>`;
const BUBBLES = {
  heart: () => box(false) + heart(0, -4, 2.2, '#ff7fcf'),
  hearts: () => box(false) + heart(-22, 0, 1.3, '#ff7fcf') + heart(0, -8, 1.7, '#ff5fa2') + heart(23, 0, 1.3, '#ff7fcf'),
  or: () => `${box(true)}<text x="0" y="10" text-anchor="middle" font-family="Nunito Variable, Nunito, sans-serif" font-weight="900" font-size="38" fill="#ff6b7d">OR</text>`,
  crack: () => `${box(true)}<path d="${HEARTP} M0 -3 L-3 3 L3 5 L0 10" transform="translate(0 -4) scale(2.2)" fill="none" stroke="#f0243f" stroke-width="1.4" stroke-linejoin="round"/>`,
  // a big sweat drop + two small motion ticks (static shapes, nothing moves)
  sweat: () => `${box(false)}<path d="${DROP}" transform="translate(4 -2) scale(1.9)" fill="#8fd3ff" stroke="#1f5f96" stroke-width="1.3" stroke-linejoin="round"/>
      <ellipse cx="-1" cy="4" rx="3" ry="5" fill="#fff" opacity=".85"/><path d="M-26,-14 l-8,-6 M-28,0 h-10" stroke="#1f5f96" stroke-width="3" stroke-linecap="round"/>`,
  // the anime anger mark, in her red
  hate: () => `${box(true)}<g stroke="#f0243f" stroke-width="6" stroke-linecap="round" fill="none"><path d="M-14,-14 L14,14 M14,-14 L-14,14"/></g>`,
  pout: () => `${box(false)}<g stroke="#d1173f" stroke-width="5.5" stroke-linecap="round" fill="none" transform="translate(0 -2)">
      <path d="M-5,-17 Q-5,-5 -17,-5"/><path d="M5,-17 Q5,-5 17,-5"/><path d="M-5,17 Q-5,5 -17,5"/><path d="M5,17 Q5,5 17,5"/></g>`,
};

// emote -> palette stage, face, bubble. `stage` alone (1-4) keeps the engine's current behaviour.
export const EMOTES = {
  heart: { pal: 1, face: 1, bubble: 'heart' },
  hearts: { pal: 2, face: 2, bubble: 'hearts' },
  sweat: { pal: 1, face: 'sweat', bubble: 'sweat' },
  pout: { pal: 1, face: 'pout', bubble: 'pout' },
  or: { pal: 3, face: 3, bubble: 'or' },
  crack: { pal: 4, face: 4, bubble: 'crack' },
  hate: { pal: 5, face: 'hate', bubble: 'hate', aura: true },
  puff: { pal: 1, face: 'puff', bubble: 'pout' },
};

// Face anchors for overlay layers (art/emotion/face.js), in gate units (the figure's own coords, before the x2 scale).
// Face centre (57, 52); the face builders' eye / cheek coords + that offset. Measured off BODYB / FRINGEB above.
export const ANCHORS = Object.freeze({
  face: [57, 52], eyeL: [44, 45], eyeR: [68, 45], cheekL: [36, 60], cheekR: [76, 60], mouth: [57, 64],
  temple: [30, 22], air: [-8, 6], tear: [77, 49], brow: 12,
  eyeBand: { x: [14, 100], y: [30, 56] },
  halo: [[-6, 14, 11], [118, 12, 7], [-14, 62, 6], [106, 100, 8], [30, -2, 5]],
});
const STAGE_EMOTE = { 1: 'heart', 2: 'hearts', 3: 'or', 4: 'crack' };

let uid = 0;
// One figure as an SVG fragment (no <svg> wrapper). ids are unique per call so several can share a page.
// overlay(P, ANCHORS) -> { under, over }: extra still layers (the gacha face layers). under = inside the body clip after
// the face, before the fringe; over = after the figure, before the bubble.
// face: a Scene A face id (SCENE_FACES) or any FACES key; it replaces the emote's face (the palette + bubble stay the emote's).
export function nandaSVG({ stage = 1, emote, talk = true, big = false, overlay = null, face = null } = {}) {
  const E0 = EMOTES[emote ?? STAGE_EMOTE[stage]] ?? EMOTES.heart;
  const E = face != null && FACES[face] ? { ...E0, face } : E0;
  const s = E.pal, P = PAL[s], n = ++uid, cb = `nd-cb${n}`, gb = `nd-gb${n}`, sh = `nd-sh${n}`;
  const legs = [40, 64].map((x) => `<rect x="${x - 3}" y="94" width="6" height="24" rx="3" fill="${P.sock}" stroke="${P.rim}" stroke-width="2"/>
    ${P.dark ? '' : `<rect x="${x - 3}" y="99" width="6" height="3" fill="${P.bow}"/>`}
    <path d="M${x - 9},125 C${x - 9},119 ${x - 4},117 ${x},117 C${x + 4},117 ${x + 9},119 ${x + 9},125 C${x + 9},127.5 ${x + 6},128.5 ${x},128.5 C${x - 6},128.5 ${x - 9},127.5 ${x - 9},125 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="1.8"/>
    <path d="M${x - 7},120.8 H${x + 7}" stroke="${P.dark ? P.rim : P.bow}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
  const shade = s === 3 ? `<defs><linearGradient id="${sh}" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="72"><stop offset="0" stop-color="#2a0714" stop-opacity=".62"/><stop offset=".55" stop-color="#2a0714" stop-opacity=".38"/><stop offset="1" stop-color="#2a0714" stop-opacity="0"/></linearGradient></defs><rect x="0" y="12" width="120" height="60" fill="url(#${sh})"/>` : '';
  const sweatDrop = E.face === 'sweat' ? `<path d="${DROP}" transform="translate(27 30) scale(.62)" fill="#8fd3ff" stroke="#1f5f96" stroke-width="2"/>` : '';
  const k = big ? 0.74 : 0.57;
  const ov = overlay ? overlay(P, ANCHORS) : { under: '', over: '' };
  const gate = `<defs><clipPath id="${cb}"><path d="${BODYB}"/></clipPath>
      <radialGradient id="${gb}" cx=".42" cy=".4" r=".75"><stop offset="0" stop-color="${P.body}"/><stop offset="1" stop-color="${P.body2}"/></radialGradient></defs>
    ${E.aura ? `<radialGradient id="au${n}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#12040b" stop-opacity="0"/><stop offset=".6" stop-color="#12040b" stop-opacity=".55"/><stop offset="1" stop-color="#f0243f" stop-opacity="0"/></radialGradient><ellipse cx="58" cy="60" rx="98" ry="112" fill="url(#au${n})" class="nd-aura"/>` : ''}
    <ellipse cx="52" cy="129" rx="58" ry="6.5" fill="${P.shadow}" opacity=".16"/>${legs}
    <path d="M-8 33H0M-8 75H0" stroke="${P.rim}" stroke-width="3" stroke-linecap="round"/><path d="M-3.5 31.5H6.5V34.5H-3.5ZM-3.5 73.5H6.5V76.5H-3.5Z" fill="${P.lit}"/>
    <path d="${BODYB}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
    <g clip-path="url(#${cb})">
      <g transform="translate(57 52)">${FACES[E.face](P, 2.6)}</g>${shade}${ov.under ?? ''}
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
    <circle cx="112" cy="54" r="5.2" fill="${P.mood}" opacity="${s === 2 ? 0.5 : 0.9}"/><circle cx="108" cy="50" r="2" fill="#fff" opacity="${s === 4 ? 0.25 : 0.9}"/>
    ${bow(111, 41.5, 0.5, P)}${pinClip(78, 22, -18, 0.5, P)}${sweatDrop}${FACE_DECOR[E.face]?.(P) ?? ''}${ov.over ?? ''}
    ${talk ? `<g transform="translate(${big ? 100 : 104} ${big ? -22 : -14}) scale(${k})">${BUBBLES[E.bubble]()}</g>` : ''}`;
  return `<g transform="translate(-104 -252) scale(2)">${gate}</g>`;
}

// scare 0 -> sweet, 1 -> clingy, 2 -> possessive. The reveal (4) is only ever asked for by name.
export const stageFor = (scare) => [1, 2, 3][scare] ?? 1;
