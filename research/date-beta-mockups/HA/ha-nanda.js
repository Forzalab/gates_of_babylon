/* HA R2e — Nanda character design. The gate STANDS UP (teammate + Tony): inputs = legs, D body = torso/skirt, output = head.
   V1 "gate-girl mascot": Nanda IS the NAND. V2 "two forms" (Hatoful): the anime placeholder sprite during the sweet part,
   the gate-girl is her TRUE form, revealed by a hard cut (locked option C: pin + NAND pupils plant it, the cut pays it off).
   Head sub-variants: (a) the NOT bubble IS the round head. (b) Tony's fix: the gate keeps its real NAND orientation
   (flat back left, curved front right), the face sits on the body exactly like the aleph portrait, and the NOT bubble
   sits at its true output position on the right (it reads as a side-pony tie).
   Stages: 1 sweet · 2 clingy · 3 possessive (rule C) · 4 reveal. All SVG drawn here; refs = composition only.
   Boards: 1 aleph analysis · 2 V1a · 3 V1b · 4 V2a · 5 V2b · 6-9 stage x scene per variant · 10 overview grid · 11 the cut (live). */
(function () {
  'use strict';
  const A = window.ART, U = window.UI;
  const host = document.getElementById('boards');
  let uid = 0; const id = (p) => `nn${p}${++uid}`;
  const board = (inner, { label = '', dread = 0, cls = '' } = {}) => `<section class="board nb ${cls}" data-dread="${dread}">${inner}${label ? `<div class="label">${label}</div>` : ''}</section>`;
  const cap = (t, x, y, o = {}) => `<div class="abs pcap${o.dk ? ' dk' : ''}" style="left:${x}px;top:${y}px;${o.style || ''}">${t}</div>`;
  const note = (t, x, y, w) => `<div class="abs note" style="left:${x}px;top:${y}px;width:${w}px">DEV · ${t}</div>`;
  const svgAt = (vb, body, x, y, w, h, cls = '') => `<svg class="abs ${cls}" viewBox="${vb}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:visible">${body}</svg>`;

  const HEARTP = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
  const heart = (x, y, s, f, st = 'none', sw = 0) => `<path d="${HEARTP}" transform="translate(${x} ${y}) scale(${s})" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  // NAND symbol at (x, y), half-height r, pointing right (D + bubble)
  const nand = (x, y, r, fill, stroke = 'none', sw = 0) => `<path d="M${x - r},${y - r} L${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} L${x - r},${y + r} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${x + r + r * .32}" cy="${y}" r="${r * .32}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  // curved bang strands: pts alternate tip / notch; each segment bows sideways a little (soft, not a saw)
  const zig = (pts, b = 4) => pts.slice(1).map(([x1, y1], i) => { const [x0, y0] = pts[i]; return ` Q${(x0 + x1) / 2 + (y1 > y0 ? b : -b)},${(y0 + y1) / 2} ${x1},${y1}`; }).join('');
  const BUBBLE = 'M-40 -30H40Q52 -30 52 -18V14Q52 26 40 26H-6L-26 44L-20 26H-40Q-52 26 -52 14V-18Q-52 -30 -40 -30Z';

  /* ------------------------------------------------------------------ palettes (stage -> colours) */
  const SWEET = { body: '#ffffff', body2: '#ffe3f1', side: '#f6cfe2', rim: '#d1177f', ink: '#6b0f45', blush: '#ff5fa8', lit: '#ffc4e6',
    hair: '#eceef9', hair2: '#aeb3d3', hairhl: '#ffffff', col: '#8a7ff0', col2: '#6152cf', stripe: '#ffffff', bow: '#ff5fa2', sock: '#ffffff',
    shoe: '#5a2350', mood: '#ff5fa2', shadow: '#3a0a26', bub: '#ffffff', bubRim: '#e64aa6' };
  const PAL = {
    1: SWEET,
    2: { ...SWEET, mood: '#ffd0e4' },
    3: { ...SWEET, ink: '#2a0714', mood: '#f0243f', rim: '#b0105e' },
    4: { body: '#1a0610', body2: '#2a0714', side: '#3a0a18', rim: '#f0243f', ink: '#f0243f', blush: 'none', lit: '#f0243f',
      hair: '#35263b', hair2: '#5a4660', hairhl: '#6b5570', col: '#3a0a18', col2: '#f0243f', stripe: '#f0243f', bow: '#b0102c', sock: '#c890a8',
      shoe: '#12040b', mood: '#f0243f', shadow: '#000000', bub: '#1a0610', bubRim: '#f0243f' },
  };

  /* ------------------------------------------------------------------ the face (aleph-relative units: origin = aleph face centre (57,52)) */
  // stage 1 = aleph exactly. Every later stage breaks ONE more of its rules.
  function face(stage, P, o = {}) {
    const ink = P.ink, sw = 2.6;
    const blush = (op, hatch) => P.blush === 'none' ? '' : `<ellipse cx="-21" cy="8" rx="7" ry="3.6" fill="${P.blush}" opacity="${op}"/><ellipse cx="17" cy="8" rx="7" ry="3.6" fill="${P.blush}" opacity="${op}"/>${hatch ? `<path d="M-25,6 l-2,4 M-21,6 l-2,4 M-17,6 l-2,4 M13,6 l-2,4 M17,6 l-2,4 M21,6 l-2,4" stroke="${ink}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>` : ''}`;
    if (stage === 1) {
      return `${blush(.55)}<ellipse cx="-13" cy="-7" rx="4.2" ry="6" fill="${ink}"/><circle cx="-11.5" cy="-9.5" r="1.5" fill="#fff"/>
        <path d="M5,-6 Q11,-13 17,-6" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>
        <path d="M-7,10 Q0,18 7,10" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    }
    if (stage === 2) { // clingy: both eyes open and bigger, pupils turn into NAND shapes, blush deepens
      const eye = (x) => `<ellipse cx="${x}" cy="-7" rx="5.4" ry="7.4" fill="${ink}"/>${nand(x - 1, -6.4, 2.5, '#ff8fc8')}<circle cx="${x + 2}" cy="-11" r="1.4" fill="#fff"/>`;
      return `${blush(.8, true)}${eye(-13)}${eye(11)}<path d="M-8,9 Q0,19.5 8,9" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/>`;
    }
    if (stage === 3) { // possessive: the stare. whites, tiny NAND pupils, no catchlight, heavy lids, the smile runs past the blush
      const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="6" ry="7.2" fill="#fff" stroke="${ink}" stroke-width="1.4"/>${nand(x - .8, -5.2, 2.3, ink)}
        <path d="M${x - 7.4},-7 Q${x},-15.5 ${x + 7.4},-7" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
      return `${blush(.22)}${eye(-13)}${eye(11)}
        <path d="M-20,8 Q0,21 20,8 Q0,14.5 -20,8 Z" fill="${ink}"/><path d="M-20,8 Q0,21 20,8" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`;
    }
    // stage 4, the reveal: blank eyes, a red dot, the mouth is a stitched line
    const eye = (x) => `<ellipse cx="${x}" cy="-6" rx="5.6" ry="7.2" fill="#fff"/><circle cx="${x}" cy="-5" r="1.4" fill="#f0243f"/>`;
    return `${eye(-13)}${eye(11)}<path d="M-17,11 L17,11" stroke="#f0243f" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-12,8.6 v4.8 M-6,8.6 v4.8 M0,8.6 v4.8 M6,8.6 v4.8 M12,8.6 v4.8" stroke="#f0243f" stroke-width="1.3" stroke-linecap="round"/>`;
  }
  // the thought bubble: heart (1) · three hearts (2) · OR on the dark panel = rule C (3) · cracked heart (4)
  function thought(stage, P) {
    const box = `<path d="${BUBBLE}" fill="${stage >= 3 ? '#1a0710' : '#fff'}" stroke="${stage >= 3 ? '#f0243f' : '#e64aa6'}" stroke-width="3" stroke-linejoin="round"/>`;
    if (stage === 1) return box + heart(0, -4, 2.2, '#ff7fcf');
    if (stage === 2) return box + heart(-22, 0, 1.3, '#ff7fcf') + heart(0, -8, 1.7, '#ff5fa2') + heart(23, 0, 1.3, '#ff7fcf');
    if (stage === 3) return box + `<text x="0" y="10" text-anchor="middle" style="font:900 38px/1 var(--font-btn,'Nunito');letter-spacing:1px" fill="#ff6b7d">OR</text>`;
    return box + `<path d="${HEARTP} M0 -3 L-3 3 L3 5 L0 10" transform="translate(0 -4) scale(2.2)" fill="none" stroke="#f0243f" stroke-width="1.4" stroke-linejoin="round"/>`;
  }
  // stage-3 shade: a dark gradient from the top of whatever carries the face
  function shade(clipId, x0, y0, x1, y1) {
    const g = id('sh');
    return `<defs><linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}"><stop offset="0" stop-color="#2a0714" stop-opacity=".62"/><stop offset=".55" stop-color="#2a0714" stop-opacity=".38"/><stop offset="1" stop-color="#2a0714" stop-opacity="0"/></linearGradient></defs>
      <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="url(#${g})" clip-path="url(#${clipId})"/>`;
  }
  const bow = (x, y, rot, s, P) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0,0 L-17,-11 L-15,11 Z M0,0 L17,-11 L15,11 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6" stroke-linejoin="round"/><circle r="5" fill="${P.bow}" stroke="${P.rim}" stroke-width="2.6"/></g>`;
  const glossD = (x, y, rx, ry, rot, P) => P === PAL[4] ? '' : `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y})" fill="#fff" opacity=".75"/>`;
  // a hair/ribbon strand that REACHES a target and wraps it twice (clingy "holds on"): scene or local coords, stroke-built
  function reachRibbon(d, tx, ty, col, rim, w = 16, loop = 30) {
    const loops = `<ellipse cx="${tx}" cy="${ty}" rx="${loop}" ry="${loop * .38}" transform="rotate(-18 ${tx} ${ty})"/><ellipse cx="${tx}" cy="${ty + loop * .5}" rx="${loop * .96}" ry="${loop * .36}" transform="rotate(-14 ${tx} ${ty + loop * .5})"/>`;
    return `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke="${rim}" stroke-width="${w + 7}"/><g stroke="${rim}" stroke-width="${w * .75 + 7}">${loops}</g>
      <path d="${d}" stroke="${col}" stroke-width="${w}"/><g stroke="${col}" stroke-width="${w * .75}">${loops}</g>
      <path d="${d}" stroke="#fff" stroke-width="${w * .22}" opacity=".6" stroke-dasharray="2 18"/></g>`;
  }

  /* ================================================================== (a) STANDING NAND, the bubble IS the head
     local coords: ground y = 0, x = 0 centre. D body 168 wide (gate x2), dome r 84, knobs = the input pins, legs below. */
  const GA = { HEM: -70, WAIST: -122, TOP: -160, APEX: -244, HR: 58, HC: -308 };
  const bodyA = `M-84,${GA.HEM} L-84,${GA.TOP} A84,84 0 0 1 84,${GA.TOP} L84,${GA.HEM} L63,${GA.HEM} A21,21 0 0 1 21,${GA.HEM} L-21,${GA.HEM} A21,21 0 0 1 -63,${GA.HEM} Z`;
  const skirtA = `M-90,${GA.WAIST} L90,${GA.WAIST} L90,${GA.HEM + 30} L-90,${GA.HEM + 30} Z`;
  const tailA = `M-44,-352 C-98,-360 -126,-300 -116,-236 C-110,-190 -124,-150 -108,-108 C-92,-146 -84,-196 -88,-244 C-92,-292 -72,-328 -38,-336 Z`;
  const fringeA = 'M-70,-296 L-70,-380 L70,-380 L70,-296 L60,-298' + zig([[60, -298], [48, -334], [37, -316], [24, -342], [12, -318], [0, -338], [-12, -318], [-24, -342], [-37, -316], [-48, -334], [-60, -298]], 5) + ' Z';
  const locksA = 'M-58,-322 C-48,-300 -52,-276 -42,-258 C-36,-282 -38,-304 -46,-326 Z M58,-322 C48,-300 52,-276 42,-258 C36,-282 38,-304 46,-326 Z';

  function legsA(P, back, dx = 0) {
    const leg = (x) => `<rect x="${x - 6}" y="-56" width="12" height="44" rx="6" fill="${P.sock}" stroke="${P.rim}" stroke-width="4"/>
      ${P === PAL[4] ? `<path d="M${x - 6},-22 h12" stroke="${P.rim}" stroke-width="3"/>` : `<rect x="${x - 6}" y="-48" width="12" height="6" fill="${P.bow}"/>`}
      <path d="M${x - 18},-2 C${x - 18},-14 ${x - 8},-18 ${x},-18 C${x + 8},-18 ${x + 18},-14 ${x + 18},-2 C${x + 18},3 ${x + 12},5 ${x},5 C${x - 12},5 ${x - 18},3 ${x - 18},-2 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="3.5"/>
      ${back ? '' : `<path d="M${x - 14},-11 H${x + 14}" stroke="${P === PAL[4] ? P.rim : P.bow}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${x - 8}" cy="-6" r="2.4" fill="#fff" opacity=".7"/>`}`;
    return leg(-42 + dx) + leg(42 + dx);
  }
  function collarFrontA(P, clip) {
    const flap = 'M-112,-204 L0,-150 L-26,-270 L-112,-270 Z';
    const stripe = 'M-112,-218 L-16,-171 L-38,-270';
    return `<g clip-path="url(#${clip})">
      <path d="${flap}" fill="${P.col}" stroke="${P.rim}" stroke-width="4" stroke-linejoin="round"/><path d="${flap}" transform="scale(-1 1)" fill="${P.col}" stroke="${P.rim}" stroke-width="4" stroke-linejoin="round"/>
      <path d="${stripe}" fill="none" stroke="${P.stripe}" stroke-width="4"/><path d="${stripe}" transform="scale(-1 1)" fill="none" stroke="${P.stripe}" stroke-width="4"/></g>`;
  }
  function skirtFrontA(P, clip) {
    const pl = [-62, -38, -14, 10, 34, 58].map((x) => `M${x},${GA.WAIST + 6} L${x * 1.06 + 2},${GA.HEM + 18}`).join(' ');
    return `<g clip-path="url(#${clip})"><path d="${skirtA}" fill="${P.col}"/><path d="${pl}" stroke="${P.col2}" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M-90,${GA.WAIST} H90" stroke="${P.rim}" stroke-width="4"/></g>`;
  }
  const bowFrontA = (P) => `<g transform="translate(0 -150)"><path d="M0,0 L-28,-16 L-25,15 Z M0,0 L28,-16 L25,15 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M-4,2 L-15,34 L-4,28 Z M4,2 L15,34 L4,28 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="3" stroke-linejoin="round"/><rect x="-7" y="-8" width="14" height="15" rx="4" fill="${P.bow}" stroke="${P.rim}" stroke-width="3"/></g>`;
  const pinClip = (x, y, rot, s, P) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${nand(0, 0, 9, P === PAL[4] ? '#3a0a18' : '#ff5fa2', P.rim, 2.6)}<circle cx="11.9" cy="0" r="2.2" fill="${P.mood}"/></g>`;

  function girlA(o) {
    const { stage = 1, view = 'front', talk = true } = o;
    const P = PAL[stage], cb = id('cb'), ch = id('ch'), gh = id('gh'), gb = id('gb');
    const defs = `<defs><clipPath id="${cb}"><path d="${bodyA}"/></clipPath><clipPath id="${ch}"><circle cx="0" cy="${GA.HC}" r="${GA.HR}"/></clipPath>
      <radialGradient id="${gh}" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${P.body}"/><stop offset="1" stop-color="${P.body2}"/></radialGradient>
      <linearGradient id="${gb}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.body}"/><stop offset="1" stop-color="${P.body2}"/></linearGradient></defs>`;
    const shadow = `<ellipse cx="0" cy="3" rx="118" ry="13" fill="${P.shadow}" opacity=".16"/>`;
    const neck = `<rect x="-9" y="${GA.APEX - 12}" width="18" height="16" fill="${P.lit}" stroke="${P.rim}" stroke-width="4"/>`;
    const tails = (which = 'both') => `${which !== 'r' ? `<path d="${tailA}" fill="${P.hair}" stroke="${P.rim}" stroke-width="4.4" stroke-linejoin="round"/><path d="M-60,-330 C-98,-300 -104,-236 -98,-170" fill="none" stroke="${P.hair2}" stroke-width="3" stroke-linecap="round"/>` : ''}
      ${which !== 'l' ? `<g transform="scale(-1 1)"><path d="${tailA}" fill="${P.hair}" stroke="${P.rim}" stroke-width="4.4" stroke-linejoin="round"/><path d="M-60,-330 C-98,-300 -104,-236 -98,-170" fill="none" stroke="${P.hair2}" stroke-width="3" stroke-linecap="round"/></g>` : ''}`;
    const bows = `${bow(-46, -346, -28, 1.05, P)}${bow(46, -346, 28, 1.05, P)}`;

    if (view === 'side') { // slab edge, facing left; the collar's square back flap sticks out behind
      const slab = `M-26,${GA.HEM} L-26,${GA.TOP - 40} C-26,${GA.APEX - 2} 26,${GA.APEX - 2} 26,${GA.TOP - 40} L26,${GA.HEM} Z`;
      return `${defs}${shadow}
        <path d="M14,-356 C60,-330 58,-260 50,-200 C44,-160 56,-130 46,-108 C34,-140 30,-196 30,-240 C30,-290 22,-320 4,-340 Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="4.4" stroke-linejoin="round"/>
         <g><rect x="-6" y="-74" width="12" height="62" rx="6" fill="${P.sock}" stroke="${P.rim}" stroke-width="4"/>
          <path d="M-30,-2 C-30,-12 -18,-18 -4,-18 L8,-18 C14,-18 16,-10 16,-2 C16,3 12,5 0,5 L-24,5 C-28,5 -30,2 -30,-2 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="3.5"/></g>
        <path d="${slab}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M-26,${GA.WAIST} H26 V${GA.HEM} H-26 Z" fill="${P.col}" stroke="${P.rim}" stroke-width="4"/>
        <path d="M-10,${GA.WAIST + 6} L-11,${GA.HEM} M8,${GA.WAIST + 6} L9,${GA.HEM}" stroke="${P.col2}" stroke-width="3"/>
        <path d="M18,-244 L40,-240 L40,-166 L18,-170 Z" fill="${P.col}" stroke="${P.rim}" stroke-width="4" stroke-linejoin="round"/><path d="M26,-238 L32,-237 L32,-172" fill="none" stroke="${P.stripe}" stroke-width="3"/>
        <path d="M-24,-138 L-44,-150 L-42,-120 Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="3" stroke-linejoin="round"/>
        ${glossD(-10, -214, 8, 18, 0, P)}${neck}
        <circle cx="0" cy="${GA.HC}" r="${GA.HR}" fill="url(#${gh})" stroke="${P.rim}" stroke-width="6"/>
        <g clip-path="url(#${ch})"><path d="M-70,-300 L-70,-380 L80,-380 L80,-240 L22,-240 C26,-280 20,-300 -8,-316 L-30,-318 L-40,-332 L-50,-312 Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M10,-360 C24,-330 30,-300 28,-254 M-20,-362 C-4,-340 6,-322 2,-306" fill="none" stroke="${P.hair2}" stroke-width="3"/></g>
        <circle cx="0" cy="${GA.HC}" r="${GA.HR}" fill="none" stroke="${P.rim}" stroke-width="6"/>
        <g transform="translate(-40 -292) scale(1.32)">${stage === 4 ? `<ellipse cx="0" cy="-6" rx="2.6" ry="7" fill="#fff"/><circle cx="-.6" cy="-5" r="1.2" fill="#f0243f"/>` : `<ellipse cx="0" cy="-6" rx="${stage === 3 ? 3 : 2.6}" ry="${stage === 1 ? 6 : 7.2}" fill="${stage === 3 ? '#fff' : P.ink}" stroke="${P.ink}" stroke-width="${stage === 3 ? 1.2 : 0}"/>`}
          ${P.blush !== 'none' ? `<ellipse cx="-2" cy="8" rx="4" ry="3.4" fill="${P.blush}" opacity=".55"/>` : ''}<path d="M-9,10 Q-6,${stage === 3 ? 16 : 14} -1,12" fill="none" stroke="${P.ink}" stroke-width="2.4" stroke-linecap="round"/></g>
        ${bow(8, -358, 10, 1.05, P)}${pinClip(-26, -344, -24, 1, P)}`;
    }
    if (view === 'back') {
      const flap = `M-72,-238 L72,-238 L72,-150 L-72,-150 Z`, fs = `M-60,-238 L-60,-162 L60,-162 L60,-238`;
      return `${defs}${shadow}${legsA(P, true)}
        <path d="${bodyA}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="6" stroke-linejoin="round"/>
        ${skirtFrontA(P, cb)}
        <g clip-path="url(#${cb})"><path d="${flap}" fill="${P.col}" stroke="${P.rim}" stroke-width="4"/><path d="${fs}" fill="none" stroke="${P.stripe}" stroke-width="4"/></g>
        ${neck}<circle cx="0" cy="${GA.HC}" r="${GA.HR}" fill="${P.hair}" stroke="${P.rim}" stroke-width="6"/>
        <path d="M0,-366 L0,-252 M-28,-356 C-40,-320 -40,-290 -30,-258 M28,-356 C40,-320 40,-290 30,-258" fill="none" stroke="${P.hair2}" stroke-width="3" stroke-linecap="round"/>
        ${tails()}${bows}`;
    }
    const q = view === 'q', sx = q ? .9 : 1, fx = q ? -9 : 0;
    // 3/4: sweep the D back and to the right (stroke pass, then fill pass = the union outline)
    let sweep = '';
    if (q) {
      const N = 10, DX = 24, DY = -6;
      const st = [], fl = [];
      for (let i = N; i >= 1; i--) {
        const t = `translate(${(DX * i) / N} ${(DY * i) / N}) scale(${sx} 1)`;
        st.push(`<path d="${bodyA}" transform="${t}" fill="none" stroke="${P.rim}" stroke-width="12" stroke-linejoin="round"/>`);
        fl.push(`<path d="${bodyA}" transform="${t}" fill="${P.side}"/><path d="${skirtA}" transform="${t}" fill="${P.col2}" clip-path="url(#${cb})"/>`);
      }
      sweep = st.join('') + `<g>${fl.join('')}</g>`;
    }
    const reach = o.reach ? (() => { const [tx, ty] = o.reach; return reachRibbon(`M50,-340 C120,-360 ${(tx + 50) / 2},${Math.min(ty, -340) - 80} ${tx},${ty}`, tx, ty, P.hair, P.rim, 16, 30); })() : '';
    return `${defs}${shadow}
      ${tails(o.reach ? 'l' : q ? 'r' : 'none')}
      ${legsA(P, false)}${sweep}
      <g transform="scale(${sx} 1)">
        <path d="${bodyA}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="6" stroke-linejoin="round"/>
        ${skirtFrontA(P, cb)}${collarFrontA(P, cb)}${bowFrontA(P)}
        ${glossD(-50, -206, 22, 10, -42, P)}<circle cx="-62" cy="-180" r="4" fill="#fff" opacity="${P === PAL[4] ? 0 : .85}"/>
        <path d="${bodyA}" fill="none" stroke="${P.rim}" stroke-width="6" stroke-linejoin="round"/>
      </g>
      ${q && !o.reach ? tails('l') : ''}
      ${neck}
      <circle cx="0" cy="${GA.HC}" r="${GA.HR}" fill="url(#${gh})" stroke="${P.rim}" stroke-width="6"/>
      <g clip-path="url(#${ch})" transform="translate(${fx} 0)">
        <g transform="translate(0 -290) scale(${1.6 * sx} 1.6)">${face(stage, P)}</g>
        ${stage === 3 ? shade(ch, -70, GA.HC - GA.HR, 70, GA.HC + 30) : ''}
        <path d="${locksA}" fill="${P.hair}" stroke="${P.rim}" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="${fringeA}" fill="${P.hair}" stroke="${P.rim}" stroke-width="3.6" stroke-linejoin="round"/>
        <path d="M0,-364 C-8,-346 -12,-332 -8,-322 M0,-364 C8,-346 14,-334 12,-322 M-34,-354 C-38,-344 -40,-336 -38,-326" fill="none" stroke="${P.hair2}" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M-38,-350 C-18,-362 18,-362 38,-350" fill="none" stroke="${P.hairhl}" stroke-width="5" stroke-linecap="round" opacity=".85"/>
      </g>
      <circle cx="0" cy="${GA.HC}" r="${GA.HR}" fill="none" stroke="${P.rim}" stroke-width="6"/>
      ${o.reach ? `${reach}${bow(-46, -346, -28, 1.05, P)}${bow(46, -346, 28, 1.05, P)}` : q ? `${bow(-50, -344, -28, 1.05, P)}${bow(36, -350, 28, .9, P)}` : bows}
      ${pinClip(26 + fx, -342, -22, 1.05, P)}
      ${talk ? `<g transform="translate(118 -394) scale(.82)">${thought(stage, P)}</g>` : ''}`;
  }

  /* ================================================================== (b) the REAL NAND orientation (Tony): flat back left, curved
     front right, face on the body (aleph, 1:1), the NOT bubble at its true output position = a side-pony tie.
     Drawn in gate units (the aleph portrait's own coordinates), then placed: local = gate x2, centred on the D's centroid (x 52). */
  const BODYB = 'M12 12H58A42 42 0 0 1 58 96H12V85.5A10.5 10.5 0 0 1 12 64.5V43.5A10.5 10.5 0 0 1 12 22.5Z';
  const SKIRTB = 'M0 80H120V100H0Z';
  const FRINGEB = 'M0 0H120V40L100 41' + zig([[100, 41], [90, 27], [80, 38], [68, 26], [56, 37], [44, 26], [33, 37], [23, 28], [16, 38], [12, 34]], 2.4) + 'V0Z';
  const PONYB = 'M106 63C114 78 126 92 119 114C129 106 138 88 131 73C127 66 121 62 115 60Z';
  const gatePlace = (inner) => `<g transform="translate(-104 -252) scale(2)">${inner}</g>`; // gate y 96 -> local -60 (legs 60 tall)

  function legsB(P, back) {
    const leg = (x) => `<rect x="${x - 3}" y="94" width="6" height="24" rx="3" fill="${P.sock}" stroke="${P.rim}" stroke-width="2"/>
      ${P === PAL[4] ? '' : `<rect x="${x - 3}" y="99" width="6" height="3" fill="${P.bow}"/>`}
      <path d="M${x - 9},125 C${x - 9},119 ${x - 4},117 ${x},117 C${x + 4},117 ${x + 9},119 ${x + 9},125 C${x + 9},127.5 ${x + 6},128.5 ${x},128.5 C${x - 6},128.5 ${x - 9},127.5 ${x - 9},125 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="1.8"/>
      ${back ? '' : `<path d="M${x - 7},120.8 H${x + 7}" stroke="${P === PAL[4] ? P.rim : P.bow}" stroke-width="1.8" stroke-linecap="round"/>`}`;
    return leg(40) + leg(64);
  }
  function girlB(o) {
    const { stage = 1, view = 'front', talk = true } = o;
    const P = PAL[stage], cb = id('cb'), gb = id('gb');
    const defs = `<defs><clipPath id="${cb}"><path d="${BODYB}"/></clipPath>
      <radialGradient id="${gb}" cx=".42" cy=".4" r=".75"><stop offset="0" stop-color="${P.body}"/><stop offset="1" stop-color="${P.body2}"/></radialGradient></defs>`;
    const shadowG = `<ellipse cx="52" cy="129" rx="58" ry="6.5" fill="${P.shadow}" opacity=".16"/>`;
    const wires = `<path d="M-8 33H0M-8 75H0" stroke="${P.rim}" stroke-width="3" stroke-linecap="round"/><path d="M-3.5 31.5H6.5V34.5H-3.5ZM-3.5 73.5H6.5V76.5H-3.5Z" fill="${P.lit}"/>`;
    const pony = (st = P.rim) => `<path d="${PONYB}" fill="${P.hair}" stroke="${st}" stroke-width="2.2" stroke-linejoin="round"/><path d="M112 70C120 82 126 92 124 104" fill="none" stroke="${P.hair2}" stroke-width="1.5" stroke-linecap="round"/>`;
    const bubbleB = (cx = 112) => `<circle cx="${cx}" cy="54" r="12" fill="${P.bub === '#1a0610' ? '#1a0610' : '#fff'}" stroke="${P.rim}" stroke-width="3.2"/>
      <circle cx="${cx}" cy="54" r="5.2" fill="${P.mood}" opacity="${stage === 2 ? .5 : .9}"/><circle cx="${cx - 4}" cy="50" r="2" fill="#fff" opacity="${stage === 4 ? .25 : .9}"/>`;
    const tie = (cx = 112) => bow(cx - 1, 41.5, 0, .5, P);
    const skirt = `<g clip-path="url(#${cb})"><path d="${SKIRTB}" fill="${P.col}"/>
      <path d="M22 83L21 97M34 83L33.5 97M46 83V97M58 83L58.5 97M70 83L71 96M82 83L83 94" stroke="${P.col2}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M0 80H120" stroke="${P.rim}" stroke-width="2"/><path d="M0 84.5H120" stroke="${P.stripe}" stroke-width="1.6"/></g>`;
    const ribbon = `<g transform="translate(57 81)"><path d="M0 0L-12 -6.5L-11 6.5Z M0 0L12 -6.5L11 6.5Z" fill="${P.bow}" stroke="${P.rim}" stroke-width="1.6" stroke-linejoin="round"/><rect x="-3" y="-3.4" width="6" height="6.8" rx="2" fill="${P.bow}" stroke="${P.rim}" stroke-width="1.4"/></g>`;

    if (view === 'side') { // seen from the right (the bubble side): a slab, the bubble in front of it, the pony hanging
      return gatePlace(`${defs}${shadowG}
        <rect x="49" y="94" width="6" height="24" rx="3" fill="${P.sock}" stroke="${P.rim}" stroke-width="2"/>
        <path d="M44,125 C44,119 48,117 52,117 L58,117 C63,117 65,121 65,125 C65,127.5 62,128.5 58,128.5 L47,128.5 C45,128.5 44,127 44,125 Z" fill="${P.shoe}" stroke="${P.rim}" stroke-width="1.8"/>
        <rect x="39" y="12" width="26" height="84" rx="7" fill="${P.side}" stroke="${P.rim}" stroke-width="3.2"/>
        <path d="M39 80H65V89C65 93 62 96 58 96H46C42 96 39 93 39 89Z" fill="${P.col}" stroke="${P.rim}" stroke-width="2"/>
        <path d="M39 19C39 15 42 12 46 12H58C62 12 65 15 65 19V40L60 36L54 41L48 35L42 40L39 38Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M60 60C68 74 74 90 68 112C77 104 82 86 76 70C72 63 67 58 62 56Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="52" cy="54" r="12" fill="${P.bub === '#1a0610' ? '#1a0610' : '#fff'}" stroke="${P.rim}" stroke-width="3.2"/><circle cx="52" cy="54" r="5.2" fill="${P.mood}" opacity=".9"/><circle cx="48" cy="50" r="2" fill="#fff" opacity=".9"/>
        ${bow(52, 41.5, 0, .5, P)}`);
    }
    if (view === 'back') { // mirrored: flat back on the right, the tie + pony on the left
      return gatePlace(`${defs}${shadowG}${legsB(P, true)}<g transform="translate(112 0) scale(-1 1)">
        ${wires}<path d="${BODYB}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
        <g clip-path="url(#${cb})"><path d="M0 0H120V70L100 72L80 66L60 72L40 66L20 72L0 68Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M30 14C34 30 34 48 30 64M50 12C54 30 54 48 50 66M70 14C76 30 76 48 70 64" fill="none" stroke="${P.hair2}" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M14 66H90V82H14Z" fill="${P.col}" stroke="${P.rim}" stroke-width="2"/><path d="M20 66V77H84V66" fill="none" stroke="${P.stripe}" stroke-width="1.6"/></g>
        ${skirt}<path d="${BODYB}" fill="none" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
        ${pony()}${bubbleB()}${tie()}</g>`);
    }
    const q = view === 'q';
    let sweep = '';
    if (q) { // 3/4: the slab sweeps back to the left (we see the flat back's edge)
      const N = 10, DX = -15, DY = -3, st = [], fl = [];
      for (let i = N; i >= 1; i--) {
        const t = `translate(${(DX * i) / N} ${(DY * i) / N})`;
        st.push(`<path d="${BODYB}" transform="${t}" fill="none" stroke="${P.rim}" stroke-width="6.4" stroke-linejoin="round"/>`);
        fl.push(`<path d="${BODYB}" transform="${t}" fill="${P.side}"/><g transform="${t}"><path d="M0 80H120V100H0Z" fill="${P.col2}" clip-path="url(#${cb})"/><path d="M0 0H120V38H0Z" fill="${P.hair2}" clip-path="url(#${cb})"/></g>`);
      }
      sweep = st.join('') + fl.join('');
    }
    const reach = o.reach ? (() => { const [tx, ty] = o.reach; const gx = (tx + 104) / 2, gy = (ty + 252) / 2; return reachRibbon(`M118,110 C126,140 ${(gx + 120) / 2},${Math.max(gy, 110) + 20} ${gx},${gy}`, gx, gy, P.hair, P.rim, 7, 14); })() : '';
    return gatePlace(`${defs}${shadowG}${legsB(P, false)}${sweep}${wires}
      <path d="${BODYB}" fill="url(#${gb})" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
      <g clip-path="url(#${cb})">
        <g transform="translate(57 52)">${face(stage, P)}</g>
        ${stage === 3 ? shade(cb, 0, 12, 120, 72) : ''}
        <path d="M12 12H22V84H12Z" fill="${P.hair}" stroke="${P.rim}" stroke-width="1.8"/>
        <path d="${FRINGEB}" fill="${P.hair}" stroke="${P.rim}" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M58 13C55 20 53 26 54 34M58 13C62 20 66 26 66 33M36 14C33 22 32 28 33 34" fill="none" stroke="${P.hair2}" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M34 19C46 15 70 15 84 20" fill="none" stroke="${P.hairhl}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
        ${skirt}
      </g>
      ${ribbon}
      <path d="${BODYB}" fill="none" stroke="${P.rim}" stroke-width="3.2" stroke-linejoin="round"/>
      ${glossD(90, 26, 7, 3.4, 40, P)}
      ${o.reach ? reach : pony()}${bubbleB()}${tie()}
      ${pinClip(78, 22, -18, .5, P)}
      ${talk ? `<g transform="translate(104 -14) scale(.57)">${thought(stage, P)}</g>` : ''}`);
  }

  const girl = (o) => (o.head === 'b' ? girlB(o) : girlA(o));
  // place a figure in a 1920x1080 scene: x/y = ground point, s = scale
  const fig = (o, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${girl(o)}</g>`;
  // silhouette of the true form (the V2 cast-shadow clue)
  function silhouette(o, x, y, s, col = '#1a0610', op = .5) {
    const f = id('sil');
    return `<defs><filter id="${f}" x="-20%" y="-20%" width="140%" height="140%"><feFlood flood-color="${col}"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>
      <g filter="url(#${f})" opacity="${op}">${fig({ ...o, talk: false }, x, y, s)}</g>`;
  }

  window.NANDA = { girl, fig, silhouette, face, thought, PAL, nand, heart, reachRibbon };

  /* ================================================================== BOARD 1 — why the aleph face works */
  function alephPortrait(px) { // src/date Portrait (AND), copied as rendered: body + lit pins + face + heart bubble
    const g = id('ap');
    const BODY = 'M12 12H58A42 42 0 0 1 98.666 43.5A10.5 10.5 0 0 1 98.666 64.5A42 42 0 0 1 58 96H12V85.5A10.5 10.5 0 0 1 12 64.5V43.5A10.5 10.5 0 0 1 12 22.5Z';
    return `<svg viewBox="0 0 300 300" width="${px}" height="${px}" role="img" aria-label="the aleph AND portrait">
      <defs><radialGradient id="${g}" cx="45%" cy="55%" r="70%"><stop offset="0" stop-color="#ffd6f0"/><stop offset="1" stop-color="#ff8fd0"/></radialGradient></defs>
      <rect width="300" height="300" rx="18" fill="url(#${g})"/>
      ${[[30, 40], [250, 250], [40, 260], [270, 150]].map(([x, y]) => heart(x, y, 1.1, '#ffb3e3')).join('')}
      <g transform="translate(46 84) scale(1.75)">
        <path d="M-8 33H0M-8 75H0" stroke="#d1177f" stroke-width="3"/>
        <path d="${BODY}" fill="#fff" stroke="#d1177f" stroke-width="3.2" stroke-linejoin="round"/>
        <path d="M-3.5 31.5H6.5V34.5H-3.5ZM-3.5 73.5H6.5V76.5H-3.5ZM104.17 52.5H114.17V55.5H104.17Z" fill="#ffc4e6"/>
        <g transform="translate(57 52)">${face(1, SWEET)}</g></g>
      <g transform="translate(222 64)">${thought(1, SWEET)}</g></svg>`;
  }
  // measured guide overlay on the same 300x300 portrait (gate units x1.75 + (46,84))
  const G = (gx, gy) => [46 + gx * 1.75, 84 + gy * 1.75];
  function alephGuides() {
    const [, eyeY] = G(0, 45), [, mouthY] = G(0, 66), [, topY] = G(0, 12), [, botY] = G(0, 96);
    const [fx0] = G(29, 0), [fx1] = G(81, 0);
    const pin = (n, x, y) => `<g transform="translate(${x} ${y})"><circle r="11" fill="#3a1d3f"/><text y="5" text-anchor="middle" style="font:900 15px/1 var(--font-btn)" fill="#fff">${n}</text></g>`;
    return `<g fill="none" stroke="#3a1d3f" stroke-width="1.6" stroke-dasharray="5 4">
        <path d="M60,${eyeY} H250 M60,${mouthY} H250"/><rect x="${fx0}" y="${G(0, 36)[1]}" width="${fx1 - fx0}" height="${G(0, 70)[1] - G(0, 36)[1]}"/></g>
      <path d="M254,${topY} V${botY}" stroke="#3a1d3f" stroke-width="2"/><path d="M249,${topY} h10 M249,${botY} h10" stroke="#3a1d3f" stroke-width="2"/>
      ${pin(1, 262, eyeY - 6)}${pin(2, G(44, 0)[0] - 26, G(0, 40)[1] - 8)}${pin(5, G(36, 0)[0] - 18, G(0, 60)[1] + 18)}${pin(6, G(57, 0)[0] + 2, G(0, 72)[1] + 16)}${pin(7, 230, 22)}${pin(8, 30, 138)}`;
  }
  function b1() {
    const rules = [
      ['Small, low face.', 'Eye line 39% down, mouth 60%. Face = half the body width. Big forehead = baby schema.'],
      ['One eye, one wink.', 'Solid 1 : 1.4 oval + one catchlight, top right. The wink arc is the personality.'],
      ['Face lighter than the body.', 'Face line 2.6 vs body 3.2 (0.8x), round caps. The silhouette always wins.'],
      ['Wine ink, not black.', '#6B0F45 sits in the same family as the #D1177F rim. Soft, never harsh.'],
      ['Blush widens the face.', '2 : 1 ovals, #FF5FA8 at 55%, level with the smile, outside the eyes.'],
      ['A shy smile.', 'A 14-unit U, narrower than the eye gap. Content, not a grin.'],
      ['Counterweight.', 'Gate low left, heart bubble high right; its tail points at her.'],
      ['The gate stays the gate.', 'Real outline, lit pins. The face is a sticker on it, never a redraw.'],
    ];
    const list = `<div class="abs ncard" style="left:720px;top:130px;width:1110px"><ol>${rules.map(([h, t]) => `<li><b>${h}</b> ${t}</li>`).join('')}</ol></div>`;
    const heads = [1, 2, 3, 4].map((s, i) => {
      const P = PAL[s], bg = s === 4 ? '#1a0710' : s === 3 ? '#3a1d3f' : '#fff0f6';
      return `<div class="abs nhead${s >= 3 ? ' dk' : ''}" style="left:${720 + i * 282}px;top:780px;background:${bg}">
        <svg viewBox="-60 -44 120 88" width="250" height="184"><ellipse cx="0" cy="0" rx="54" ry="40" fill="${P.body}" stroke="${P.rim}" stroke-width="3.2"/>
        <g transform="scale(1.6)">${face(s, P)}</g></svg></div>`;
    }).join('');
    const hl = ['1 sweet · all 8', '2 clingy · breaks 2', '3 possessive · 2 3 4 6', '4 reveal · inverts'];
    return board(`
      ${cap('<b>Why Tony loves the aleph face</b> · the rules we carry over', 60, 50)}
      <div class="abs nframe" style="left:60px;top:130px;width:600px;height:600px">${alephPortrait(590)}</div>
      ${svgAt('0 0 300 300', alephGuides(), 65, 135, 590, 590)}
      ${list}
      ${cap('Horror = break the loved face, one rule per stage', 720, 712)}
      ${heads}
      ${hl.map((t, i) => cap(t, 720 + i * 282, 976, { dk: i >= 2, style: 'font-size:22px;padding:4px 10px' })).join('')}
      ${cap('src/date Portrait, copied (not imported)', 60, 760, { style: 'font-size:22px' })}
      <div class="abs ncard sm" style="left:60px;top:830px;width:600px">Keep 1–8 exactly at stage 1. Clingy: eyes grow, pupils go NAND (rule 2). Possessive: whites, lids, smile past the blush, darker ink (2 3 4 6). Reveal: the palette inverts, the heart cracks.</div>
      ${note('Measured from src/date/main.jsx Portrait + date.css (computed styles): body #FFF / rim #D1177F 3.2, lit pins #FFC4E6, face ink #6B0F45 2.6, blush #FF5FA8 .55, bubble #FFF / #E64AA6 3, heart #FF7FCF, bg #FFD6F0→#FF8FD0 + 4 hearts #FFB3E3. Gate at (46,84) x1.75; face centre = gate (57,52).', 60, 1000, 1800)}`,
    { label: '<b>R2e · 1 aleph analysis</b> · what to keep, what to break' });
  }

  /* ================================================================== BOARDS 2-5 — turnarounds */
  const VIEWS = [['front', 'front'], ['q', '3/4'], ['side', 'side'], ['back', 'back']];
  function turnV1(head) {
    const a = head === 'a';
    const vb = a ? '-190 -440 380 460' : '-150 -330 320 350';
    const views = VIEWS.map(([v, t], i) => `${svgAt(vb, girl({ head, view: v, stage: 1, talk: v === 'front' }), 40 + i * 450, 110, 430, a ? 520 : 470)}${cap(t, 60 + i * 450, 640)}`).join('');
    const stH = a ? 300 : 300;
    const stages = [1, 2, 3, 4].map((s, i) => `<div class="abs nstage${s >= 3 ? ' dk' : ''}" style="left:${60 + i * 450}px;top:710px;width:420px;height:320px">
      ${svgAt(vb, girl({ head, stage: s, talk: true }), 30, a ? 6 : 8, 360, stH)}</div>`).join('');
    const sn = ['1 sweet', '2 clingy', '3 possessive', '4 reveal'];
    const alt = a ? '' : `<div class="abs nstage" style="left:1560px;top:40px;width:330px;height:130px;display:none"></div>`;
    return board(`
      ${cap(`<b>V1${head} · gate-girl mascot</b> · ${a ? 'the NOT bubble IS the head' : 'real NAND orientation · face on the body · the bubble = side-pony tie'}`, 60, 40)}
      ${views}${stages}${alt}
      ${sn.map((t, i) => cap(t, 72 + i * 450, 722, { dk: i >= 2, style: 'font-size:22px;padding:3px 10px' })).join('')}
      ${note(a ? 'D body 168 wide = gate x2, dome r 84. Input knobs = hem bumps, legs hang from them (white socks = the pins), maryjanes = her genkan pair. Output neck = pink lit bar; head = bubble at r 58 (enlarged from r 24: the only proportion we break). Twin-tails + NAND pin clip = the placeholder sprite\'s identity. 3/4 = the D swept back (stroke pass, fill pass). Side = slab edge + the sailor collar\'s square back flap.' : 'Gate drawn in the aleph portrait\'s own units (x2): the face is aleph 1:1. Bubble at the true NAND output (112,54), r 12 = side-pony tie with its bow; the pony = the output wire. Input pins stay aleph\'s lit stubs on the flat back. Legs drop from the flat bottom edge, symmetric about the D centroid (gate x 52).', 60, 1040, 1800)}`,
    { label: `<b>R2e · V1${head}</b> · turnaround + the 4 stages` });
  }

  if (host) host.innerHTML = [b1(), turnV1('a'), turnV1('b')].join('\n');
  window.SHOTS = [];
})();
