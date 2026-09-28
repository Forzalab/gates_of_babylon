/* HA R2d — props + Nanda NAND-face options. All drawn here in SVG (composition refs only, nothing traced).
   Boards: 1 umeboshi = AND gate  2 tamagoyaki = 74181  3 mochi (+ OR press, hers = red)  4 Nanda options A / B / C. */
(function () {
  'use strict';
  const A = window.ART;
  const host = document.getElementById('boards');
  const INK = '#3a0a26';
  const board = (inner, { label = '', dread = 0, cls = '' } = {}) => `<section class="board ${cls}" data-dread="${dread}">${inner}${label ? `<div class="label">${label}</div>` : ''}</section>`;
  const cap = (t, x, y, dark) => `<div class="abs pcap${dark ? ' dk' : ''}" style="left:${x}px;top:${y}px">${t}</div>`;
  const svg = (vb, body, x, y, w, h) => `<svg class="abs" viewBox="${vb}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:visible">${body}</svg>`;
  let uid = 0; const id = (p) => `${p}${++uid}`;

  /* ---------- 1 UMEBOSHI = AND gate: D body (flat left, round right), wrinkles, 2 stems in, shiso leaf out ---------- */
  function ume({ s = 1, hers = false } = {}) {
    const g = id('ume'), hl = id('umeh');
    const D = 'M-118,-104 C-126,-104 -130,-98 -130,-88 L-130,88 C-130,98 -126,104 -118,104 L10,104 C74,104 120,58 120,0 C120,-58 74,-104 10,-104 Z';
    const top = hers ? ['#ff5a6e', '#d0102c', '#6a0418'] : ['#e8507a', '#b3123e', '#5e0c3a'];
    const wr = 'M-96,-70 C-70,-58 -60,-80 -34,-66 M-40,-30 C-16,-44 4,-20 30,-36 M-100,6 C-76,-8 -56,14 -30,2 M-6,20 C18,6 34,30 62,14 M-84,58 C-58,44 -40,70 -12,56 M24,64 C44,50 64,68 84,48 M50,-72 C66,-60 84,-66 96,-46 M-60,-96 C-50,-84 -30,-92 -20,-84';
    return `<g transform="scale(${s})">
      <defs><radialGradient id="${g}" cx="-.15" cy="-.35" r="1.1"><stop offset="0" stop-color="${top[0]}"/><stop offset=".45" stop-color="${top[1]}"/><stop offset="1" stop-color="${top[2]}"/></radialGradient>
      <radialGradient id="${hl}"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <path d="M-160,-52 C-148,-54 -140,-50 -130,-52" fill="none" stroke="#6b4a22" stroke-width="12" stroke-linecap="round"/>
      <path d="M-160,52 C-148,50 -140,56 -130,52" fill="none" stroke="#6b4a22" stroke-width="12" stroke-linecap="round"/>
      <circle cx="-164" cy="-52" r="8" fill="#8a6a36" stroke="${INK}" stroke-width="3"/><circle cx="-164" cy="52" r="8" fill="#8a6a36" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="0" cy="118" rx="120" ry="14" fill="${INK}" opacity=".18"/>
      <path d="${D}" fill="url(#${g})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="${wr}" fill="none" stroke="${top[2]}" stroke-width="5" stroke-linecap="round" opacity=".75"/>
      <path d="${wr}" transform="translate(2 -5)" fill="none" stroke="#ff9fbf" stroke-width="3" stroke-linecap="round" opacity=".45"/>
      <ellipse cx="-50" cy="-62" rx="46" ry="20" fill="url(#${hl})" transform="rotate(-12 -50 -62)"/>
      <circle cx="-86" cy="-72" r="7" fill="#fff" opacity=".9"/>
      <path d="M118,0 C132,-6 142,-4 150,0" fill="none" stroke="#3c7a2c" stroke-width="9" stroke-linecap="round"/>
      <path d="M146,0 C170,-46 236,-44 262,0 C236,44 170,46 146,0 Z" fill="#5fb548" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150,0 L256,0 M178,0 L194,-20 M178,0 L194,20 M208,0 L222,-18 M208,0 L222,18 M234,0 L244,-12 M234,0 L244,12" fill="none" stroke="#2f6b22" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M150,0 C170,-38 226,-40 250,-10" fill="none" stroke="#b6f09a" stroke-width="3" opacity=".7"/>
    </g>`;
  }
  const andRef = `<path d="M-60,-50 L0,-50 A50,50 0 0 1 0,50 L-60,50 Z M-90,-25 L-60,-25 M-90,25 L-60,25 M50,0 L85,0" fill="none" stroke="#6e3f6c" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  const b1 = board(`
    ${svg('-300 -200 600 400', ume({ s: 1.35 }), 330, 200, 900, 600)}
    ${svg('-120 -80 240 160', andRef, 1360, 150, 360, 240)}
    ${cap('AND (ref)', 1470, 400)}
    ${svg('-300 -200 600 400', ume({ s: 1 }), 1260, 520, 300, 200)}
    ${svg('-300 -200 600 400', ume({ s: 1, hers: true }), 1540, 520, 300, 200)}
    ${cap('bento size', 1300, 740)}${cap('hers (her red)', 1560, 740)}
    ${cap('<b>Umeboshi</b> · a plum first, an AND gate second', 120, 90)}
    <div class="abs note" style="left:120px;top:860px;width:1100px">DEV · D body = AND outline (flat left, round right). Stems = 2 inputs, shiso leaf = output. Wrinkles are 2-tone strokes, no noise texture. Body #E8507A→#B3123E→#5E0C3A, 6 px #3A0A26 line.</div>`,
  { label: '<b>R2d · 1 Umeboshi</b> = AND gate' });

  /* ---------- 2 TAMAGOYAKI = 74181 (24-pin DIP): omelette block, 12 legs a side, nori stamp, bite = notch ---------- */
  function tama({ w = 1100, h = 250 } = {}) {
    const g = id('tg'), bite = id('tb');
    const x0 = -w / 2, y0 = -h / 2;
    const legs = Array.from({ length: 12 }, (_, i) => {
      const x = x0 + 70 + i * ((w - 140) / 11);
      return `<g transform="translate(${x} ${y0 + h})"><rect x="-13" y="-6" width="26" height="54" rx="6" fill="#1f2a1c" stroke="${INK}" stroke-width="3"/>
        <path d="M-13,10 L13,10 M-13,22 L13,22" stroke="#3d5a34" stroke-width="3"/>
        <ellipse cx="0" cy="62" rx="12" ry="17" fill="#fffdf6" stroke="${INK}" stroke-width="3"/><ellipse cx="-3" cy="56" rx="3" ry="6" fill="#fff"/></g>`;
    }).join('');
    const mayo = Array.from({ length: 12 }, (_, i) => {
      const x = x0 + 70 + i * ((w - 140) / 11);
      return `<path transform="translate(${x} ${y0 - 4})" d="M-13,0 C-14,-14 -6,-18 -4,-26 C0,-34 6,-24 4,-18 C12,-16 14,-8 13,0 Z" fill="#fff8e6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    }).join('');
    const layers = [0.2, 0.4, 0.6, 0.8].map((t) => `<path d="M${x0 + 20},${y0 + h * t} C${x0 + w * .3},${y0 + h * t - 8} ${x0 + w * .7},${y0 + h * t + 8} ${x0 + w - 20},${y0 + h * t}" fill="none" stroke="#e6ad2a" stroke-width="4" opacity=".55"/>`).join('');
    const sear = [[.18, .3, 40], [.46, .7, 30], [.74, .35, 36], [.9, .7, 22], [.3, .78, 24]].map(([u, v, r]) => `<ellipse cx="${x0 + w * u}" cy="${y0 + h * v}" rx="${r}" ry="${r * .45}" fill="#d98b1e" opacity=".35"/>`).join('');
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe681"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#f2b624"/></linearGradient>
        <mask id="${bite}"><rect x="${x0 - 50}" y="${y0 - 50}" width="${w + 100}" height="${h + 100}" fill="#fff"/>
        <path d="M${x0 - 10},${-44} C${x0 + 16},-46 ${x0 + 22},-30 ${x0 + 36},-26 C${x0 + 30},-12 ${x0 + 44},0 ${x0 + 34},12 C${x0 + 44},24 ${x0 + 26},40 ${x0 + 12},46 L${x0 - 10},46 Z" fill="#000"/></mask></defs>
      <ellipse cx="0" cy="${y0 + h + 92}" rx="${w / 2}" ry="16" fill="${INK}" opacity=".16"/>
      ${legs}${mayo}
      <g mask="url(#${bite})">
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="34" fill="url(#${g})" stroke="${INK}" stroke-width="6"/>
        ${layers}${sear}
        <rect x="${x0 + 26}" y="${y0 + 14}" width="${w * .6}" height="18" rx="9" fill="#fff6c4" opacity=".75"/>
      </g>
      <path d="M${x0 + 3},-40 C${x0 + 16},-46 ${x0 + 22},-30 ${x0 + 36},-26 C${x0 + 30},-12 ${x0 + 44},0 ${x0 + 34},12 C${x0 + 44},24 ${x0 + 26},40 ${x0 + 3},42" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(${x0 + w * .58} ${y0 + h * .56}) rotate(-2)">
        <rect x="-190" y="-44" width="380" height="88" rx="16" fill="#1f2a1c" stroke="${INK}" stroke-width="4"/>
        <path d="M-176,-30 L176,-30 M-176,30 L176,30" stroke="#35502c" stroke-width="3" opacity=".8"/>
        <text x="0" y="17" text-anchor="middle" style="font:900 50px/1 var(--font-btn,'Nunito');letter-spacing:4px" fill="#fff4c8">SN74181</text>
      </g>
      <path transform="translate(${x0 + w * .2} ${y0 + h * .48}) scale(1.3)" d="M0,10 C-26,-8 -14,-26 0,-12 C14,-26 26,-8 0,10 Z" fill="#e5283c" stroke="#8c0f22" stroke-width="3" stroke-linejoin="round"/>`;
  }
  const swirl = `<g><rect x="-150" y="-110" width="300" height="220" rx="44" fill="#ffd23f" stroke="${INK}" stroke-width="6"/>
    <path d="M0,4 C-16,4 -16,-16 2,-18 C28,-20 34,16 6,26 C-34,40 -60,-2 -40,-34 C-16,-70 64,-58 74,4 C84,62 10,84 -40,70 C-110,50 -120,-40 -76,-72 C-40,-96 60,-98 110,-50" fill="none" stroke="#e39a17" stroke-width="10" stroke-linecap="round"/>
    <path d="M0,4 C-16,4 -16,-16 2,-18 C28,-20 34,16 6,26 C-34,40 -60,-2 -40,-34 C-16,-70 64,-58 74,4 C84,62 10,84 -40,70 C-110,50 -120,-40 -76,-72 C-40,-96 60,-98 110,-50" fill="none" stroke="#fff3a8" stroke-width="3" stroke-linecap="round" transform="translate(-3 -4)" opacity=".8"/>
    <circle cx="-96" cy="-70" r="10" fill="#fff" opacity=".8"/></g>`;
  const b2 = board(`
    ${svg('-640 -200 1280 420', tama(), 130, 180, 1280, 420)}
    ${svg('-180 -140 360 280', swirl, 1470, 190, 360, 280)}
    ${cap('end = layer swirl', 1530, 480)}
    ${svg('-640 -200 1280 420', tama({ w: 520, h: 150 }), 330, 640, 1280 * .62, 420 * .62)}
    ${cap('bento slot (½)', 1180, 770)}
    ${cap('<b>Tamagoyaki</b> · a rolled omelette that is secretly a 74181', 120, 90)}
    <div class="abs note" style="left:120px;top:940px;width:1500px">DEV · 12 legs a side: bottom = nori strips tipped with a rice grain, top = piped mayo. Chip print = nori stamp "SN74181"; ketchup heart = maker logo slot. Pin-1 notch = bite mark, left end.</div>`,
  { label: '<b>R2d · 2 Tamagoyaki</b> = SN74181 (composition ref only)' });

  /* ---------- 3 MOCHI: plain, OR-curve pressed in, hers = scary red only when hers ---------- */
  function mochi({ or = false, hers = false } = {}) {
    const g = id('mg');
    const c = hers ? ['#ff7486', '#e0182f', '#6a0418'] : ['#ffffff', '#ffeef5', '#f3c9da'];
    const orP = 'M-44,-58 C-28,-60 -4,-54 22,-40 C-4,-26 -28,-20 -44,-22 C-34,-34 -34,-46 -44,-58 Z';
    return `<defs><radialGradient id="${g}" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="${c[0]}"/><stop offset=".6" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient></defs>
      <ellipse cx="0" cy="72" rx="104" ry="12" fill="${INK}" opacity=".18"/>
      <path d="M-104,56 C-116,-10 -64,-92 0,-92 C64,-92 116,-10 104,56 C60,76 -60,76 -104,56 Z" fill="url(#${g})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      ${or ? `<path d="${orP}" fill="none" stroke="${hers ? '#5a0414' : '#d9a3bb'}" stroke-width="7" stroke-linejoin="round"/><path d="${orP}" transform="translate(0 3)" fill="none" stroke="${hers ? '#ff8a98' : '#fff'}" stroke-width="3" stroke-linejoin="round" opacity=".9"/>` : ''}
      ${hers ? '' : '<ellipse cx="-40" cy="20" rx="18" ry="8" fill="#ffb3cf" opacity=".8"/><ellipse cx="40" cy="20" rx="18" ry="8" fill="#ffb3cf" opacity=".8"/>'}
      <ellipse cx="-50" cy="-52" rx="16" ry="9" fill="#fff" opacity="${hers ? .55 : .95}" transform="rotate(-30 -50 -52)"/>
      <path d="M-80,50 C-40,60 40,60 80,50" fill="none" stroke="${hers ? '#5a0414' : '#e8b6ca'}" stroke-width="4" opacity=".7"/>`;
  }
  const b3 = board(`
    ${svg('-150 -120 300 220', mochi(), 140, 300, 480, 352)}
    ${svg('-150 -120 300 220', mochi({ or: true }), 720, 300, 480, 352)}
    ${svg('-150 -120 300 220', mochi({ or: true, hers: true }), 1300, 300, 480, 352)}
    ${cap('plain', 330, 700)}${cap('OR pressed in (optional)', 790, 700)}${cap('hers = red, only hers', 1370, 700)}
    ${cap('<b>Mochi</b> · keep it simple', 120, 90)}
    <div class="abs note" style="left:120px;top:860px;width:1500px">DEV · OR curve is a deboss (dark groove + light lip), not a sticker. Red body only when the mochi belongs to her; otherwise always soft white/pink.</div>`,
  { label: '<b>R2d · 3 Mochi</b>' });

  /* ---------- 4 NANDA options: A pin + pupils  B reveal glitch (hard cut)  C both ---------- */
  // NAND symbol at (x,y), half-height r: D body + bubble
  const nand = (x, y, r, fill, stroke = INK, sw = 3) => `<path d="M${x - r},${y - r} L${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} L${x - r},${y + r} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${x + r + r * .32}" cy="${y}" r="${r * .32}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  // overlay on the 600x900 sprite: NAND hair pin over the old pin (372,238); pupils at (244,355)/(356,355)
  const ovPin = (big) => `${nand(372, 236, big ? 26 : 20, '#ff5fa2', INK, 5)}<circle cx="${372 - 8}" cy="${236 - 8}" r="4" fill="#fff"/>`;
  const ovPupils = (lvl) => {
    const r = lvl === 2 ? 11 : 5.5, f = lvl === 2 ? '#f0243f' : '#3a0a26';
    return [244, 356].map((x) => `${lvl === 2 ? `<circle cx="${x}" cy="355" r="17" fill="#1a0610"/>` : ''}${nand(x - r * .3, 355, r, f, lvl === 2 ? '#ffd6e6' : 'none', lvl === 2 ? 2 : 0)}`).join('');
  };
  const spr = (face, ov = '', { x, y, w, clipHead = false } = {}) => {
    const h = w * 1.5;
    return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
      <div class="fill" style="${clipHead ? 'clip-path:inset(53% 0 0 0)' : ''}">${A.nanda({ face })}</div>
      <svg class="fill" viewBox="0 0 600 900" style="overflow:visible">${ov}</svg></div>`;
  };
  // B: the NAND-gate face. D head (flat left, round right), bubble = mouth, input wires = twin-tails.
  const nandFace = `<g>
      <path class="k-hair" d="M170,210 L60,210 C30,210 22,240 26,300 C30,420 70,520 50,700 L100,700 C110,560 90,420 92,300 C92,262 100,250 120,250 L170,250 Z"/>
      <path class="k-hair" d="M170,380 L110,380 C80,380 74,420 78,480 C84,600 120,700 104,860 L154,860 C168,720 138,600 136,480 C136,440 142,420 170,420 Z"/>
      <path class="k-skin" d="M170,130 L300,130 C400,130 470,210 470,312 C470,414 400,494 300,494 L170,494 Z" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>
      <path class="k-hair" d="M170,130 L300,130 C380,130 440,176 462,244 C420,214 380,222 340,206 C300,236 250,222 214,238 C200,222 186,210 170,212 Z"/>
      <ellipse cx="268" cy="316" rx="46" ry="54" fill="#fff" stroke="${INK}" stroke-width="7"/>
      <circle cx="268" cy="322" r="10" fill="#f0243f"/>
      <path d="M190,408 L320,408" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <line x1="470" y1="312" x2="492" y2="312" stroke="${INK}" stroke-width="10"/>
      <circle cx="530" cy="312" r="38" fill="#1a0610" stroke="#f0243f" stroke-width="10"/>
      <path d="M512,300 L520,318 L530,300 L540,318 L548,300" fill="none" stroke="#ffd6e6" stroke-width="4" stroke-linejoin="round"/>
    </g>`;
  const frame = (inner, x, y, w, t, dark) => `<div class="abs pframe${dark ? ' dk' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.5 + 8}px">${inner}</div>${cap(t, x, y + w * 1.5 + 22, dark)}`;
  /* Aleph dialogue portrait (src/date/main.jsx Portrait, copied not imported) as a NAND: same body + output bubble,
     same blush / wink / smile. mode: cute | obsessed (NAND pupils) | horror (blank eyes, her red, hard cut). */
  const HEARTP = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
  const heart = (x, y, sc, f, st = 'none') => `<path d="${HEARTP}" transform="translate(${x} ${y}) scale(${sc})" fill="${f}" stroke="${st}" stroke-width="${st === 'none' ? 0 : 1.2}"/>`;
  const BODY = 'M12 12H58A42 42 0 0 1 58 96H12V85.5A10.5 10.5 0 0 1 12 64.5V43.5A10.5 10.5 0 0 1 12 22.5Z';
  const BULB = (y) => `M-3.94 ${y - 1.44}L10.26 ${y - 5.74}L12.10 ${y - 6}L13.93 ${y - 5.68}L15.57 ${y - 4.82}L16.88 ${y - 3.49}L17.71 ${y - 1.84}L18 ${y}L17.71 ${y + 1.84}L16.88 ${y + 3.49}L15.57 ${y + 4.82}L13.93 ${y + 5.68}L12.10 ${y + 6}L10.26 ${y + 5.74}L-3.94 ${y + 1.44}Z`;
  function portrait(mode = 'cute', px = 200) {
    const h = mode === 'horror', g = id('pg');
    const rim = h ? '#f0243f' : '#d1177f', lit = h ? '#3a0a18' : '#ffc4e6', body = h ? '#1a0610' : '#fff', eyeC = '#6b0f45';
    const bg = h ? `<rect width="300" height="300" rx="18" fill="#12040b"/>` : `<defs><radialGradient id="${g}" cx="45%" cy="55%" r="70%"><stop offset="0" stop-color="#ffd6f0"/><stop offset="1" stop-color="#ff8fd0"/></radialGradient></defs><rect width="300" height="300" rx="18" fill="url(#${g})"/>`;
    const hearts = h ? '' : [[30, 40], [250, 250], [40, 260], [270, 150]].map(([x, y]) => heart(x, y, 1.1, '#ffb3e3')).join('');
    let face;
    if (h) face = `<ellipse cx="44" cy="45" rx="5.4" ry="7" fill="#fff"/><ellipse cx="68" cy="45" rx="5.4" ry="7" fill="#fff"/>
      <circle cx="44" cy="46" r="1.3" fill="#f0243f"/><circle cx="68" cy="46" r="1.3" fill="#f0243f"/>
      <path d="M48 64 L66 64" stroke="#f0243f" stroke-width="2.6" stroke-linecap="round"/>`;
    else {
      const eyeL = mode === 'obsessed' ? `<ellipse cx="44" cy="45" rx="4.2" ry="6" fill="${eyeC}"/>${nand(43.6, 45, 3.4, '#ff8fc8', 'none', 0)}` : `<ellipse cx="44" cy="45" rx="4.2" ry="6" fill="${eyeC}"/><circle cx="45.5" cy="42.5" r="1.5" fill="#fff"/>`;
      face = `${eyeL}<path d="M62 46 Q68 39 74 46" fill="none" stroke="${eyeC}" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="36" cy="60" rx="7" ry="3.6" fill="#ff5fa8" opacity=".55"/><ellipse cx="74" cy="60" rx="7" ry="3.6" fill="#ff5fa8" opacity=".55"/>
      <path d="M50 62 Q57 70 64 62" fill="none" stroke="${eyeC}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    const gate = `<g transform="translate(34 84) scale(1.75)">
      <path d="M-8 33H0M-8 75H0" stroke="${rim}" stroke-width="3"/>
      <path d="${BODY}" fill="${body}"/><path d="M19.5 19.5H58A34.5 34.5 0 0 1 58 88.5H19.5Z" fill="${lit}"/>
      <path d="${BULB(33)}M12 27H21V39H12Z${BULB(75)}M12 69H21V81H12Z" fill="${lit}"/>
      <path d="${BODY}" fill="none" stroke="${rim}" stroke-width="3.2" stroke-linejoin="round"/>
      <circle cx="112" cy="54" r="12" fill="${body}" stroke="${rim}" stroke-width="3.2"/>
      ${face}</g>`;
    const bubble = `<g transform="translate(222 64)"><path d="M-40 -30H40Q52 -30 52 -18V14Q52 26 40 26H-6L-26 44L-20 26H-40Q-52 26 -52 14V-18Q-52 -30 -40 -30Z" fill="${h ? '#1a0610' : '#fff'}" stroke="${h ? '#f0243f' : '#e64aa6'}" stroke-width="3"/>
      ${h ? `<path d="M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z M0 -3 L-3 3 L3 5 L0 10" transform="translate(0 -4) scale(2.2)" fill="none" stroke="#f0243f" stroke-width="1.4" stroke-linejoin="round"/>` : heart(0, -4, 2.2, '#ff7fcf')}</g>`;
    return `<svg viewBox="0 0 300 300" width="${px}" height="${px}" class="nport ${mode}" role="img" aria-label="NAND portrait, ${mode}">${bg}${hearts}${gate}${bubble}</svg>`;
  }
  const W = 220;
  const colA = `${frame(spr('smile', ovPin(false) + ovPupils(1), { x: 0, y: 0, w: W }), 60, 150, W, 'cute')}
    ${frame(spr('wide', ovPin(true) + ovPupils(2), { x: 0, y: 0, w: W }), 300, 150, W, 'horror', true)}`;
  const colB = `${frame(spr('smile', '', { x: 0, y: 0, w: W }), 620, 150, W, 'cute')}
    ${frame(spr('wide', nandFace, { x: 0, y: 0, w: W, clipHead: true }), 860, 150, W, 'CUT ≥500 ms', true)}`;
  const colC = `${frame(spr('smile', ovPin(false), { x: 0, y: 0, w: 170 }), 1180, 150, 170, '1 pin')}
    ${frame(spr('wide', ovPin(true) + ovPupils(2), { x: 0, y: 0, w: 170 }), 1360, 150, 170, '2 pupils', true)}
    ${frame(spr('wide', nandFace, { x: 0, y: 0, w: 170, clipHead: true }), 1540, 150, 170, '3 CUT', true)}
    ${frame(spr('smile', ovPin(false), { x: 0, y: 0, w: 170 }), 1720, 150, 170, '4 back', false)}`;
  const dlgBox = (mode, x, y, line) => `<div class="abs pdlg${mode === 'horror' ? ' dk' : ''}" style="left:${x}px;top:${y}px">${portrait(mode, 150)}<p>${line}</p></div>`;
  const tile = (mode, x, y) => `<div class="abs ptile${mode === 'horror' ? ' dk' : ''}" style="left:${x}px;top:${y}px">${portrait(mode, 76)}<b>Nanda</b><span>${mode === 'horror' ? '0 · 0 · 0' : '♥ online'}</span></div>`;
  const b4 = board(`
    ${cap('<b>A</b> · pin + pupils', 60, 70)}${cap('<b>B</b> · reveal glitch', 620, 70)}${cap('<b>C</b> · both (rec.)', 1180, 70)}
    ${colA}${colB}${colC}
    ${dlgBox('cute', 60, 580, 'Tea? Just one cup.')}${tile('cute', 60, 790)}${tile('obsessed', 300, 790)}
    ${dlgBox('cute', 620, 580, 'Stay a little?')}${dlgBox('horror', 620, 790, 'Stay.')}
    <div class="abs" style="left:1180px;top:590px;display:flex;gap:18px">${['cute', 'obsessed', 'horror', 'cute'].map((m) => portrait(m, 160)).join('')}</div>
    ${cap('portrait: cute · NAND pupils · CUT · back', 1180, 770)}
    ${tile('horror', 1180, 830)}
    <div class="abs note" style="left:1460px;top:830px;width:420px">DEV · Portrait = src/date Portrait copied (not imported), AND body + NAND bubble, blush/wink/smile unchanged. Horror = same face, blank white eyes, red dot, flat mouth, cracked heart. Cut: hold ≥500 ms, ≤3 Hz, stepped; reduced motion = one static swap. Placeholder sprite; alt owns final art.</div>`,
  { label: '<b>R2d · 4 Nanda = NAND</b> · A / B / C over the placeholder sprite + the NAND dialogue portrait' });

  if (host) host.innerHTML = [b1, b2, b3, b4].join('\n');
  window.SHOTS = [1, 2, 3, 4].map((b) => ({ name: `${b}-1024`, b, vw: 1024 }));
})();
