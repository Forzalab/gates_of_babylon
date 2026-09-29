/* date-beta mockups R1 — page builder. Each variant page is a thin shell:
     <body data-page="ui|sprites|sheet|scenes|fx"> ... theme.js (window.THEME) ... pages.js
   The boards are identical in structure across A/B/C; THEME supplies the material layer (overlay/ornaments)
   and per-board extras. Runs synchronously at the end of <body>, before core.js hydrates + fits. */
(function () {
  'use strict';
  const T = window.THEME || {};
  const { dlg, choices, cap, chrome, cw, pause, phone, notif, pinerr, scale } = window.UI;
  const A = window.ART;
  const x = (k, ...a) => (T.extra && T.extra[k] ? T.extra[k](...a) : '');
  const overlay = (kind, dread) => (T.overlay ? T.overlay(kind, dread) : '');

  function board(inner, { label = '', dread = 0, kind = 'plain', cls = '' } = {}) {
    return `<section class="board ${cls} k-${kind}" data-dread="${dread}" data-kind="${kind}">
      ${inner}${overlay(kind, dread)}${label ? `<div class="label">${label}</div>` : ''}</section>`;
  }
  const sprite = (face, style, extra = {}) => `<div class="abs" style="${style}">${A.nanda({ face, ...extra })}</div>`;
  // a full 1920x1080 frame shrunk into a board (for side-by-side comparisons)
  const mini = (inner, k, style, dread = 0) => `<div class="abs mini" data-dread="${dread}" style="width:${1920 * k}px;height:${1080 * k}px;${style}">
      <div class="abs" style="left:0;top:0;width:1920px;height:1080px;transform:scale(${k});transform-origin:0 0;overflow:hidden;background:var(--bg)">${inner}${overlay('mini', dread)}</div></div>`;

  const doorHUD = (face, dread) => `<div class="fill">${A.sceneDoor()}</div>${sprite(face, 'left:540px;top:96px;width:660px;height:990px')}${x('hud', dread)}`;

  // ------------------------------------------------------------------ UI
  function ui() {
    const b = [];
    b.push(board(`${doorHUD('smile', 0)}
      ${cap('[rain, soft · cicadas]')}
      ${dlg({ who: 'NANDA', text: 'Come in? Just for tea.', dock: 'bl' })}
      ${chrome({ on: ['cc'], faint: true })}`,
    { label: '<b>HUD 1 · dialogue</b> · box docks bottom-left, clear of her pin + the Unit 12 plate', kind: 'hud' }));

    b.push(board(`${doorHUD('smile', 1)}
      ${cap('[kettle clicks, off-screen]', { style: { bottom: 300 } })}
      ${choices({ pink: '"Just one cup."', purple: '"It\'s late. Goodnight."', t: 0.58, secs: '3', state: { pink: 'hover' } })}
      ${chrome({ on: ['cc'], faint: true })}
      <div class="abs note callout" style="right:96px;top:120px;width:560px">timer drains <b>toward pink</b>; the ♥ lands on pink at 0.<br>Pink is wider + first. Keys <b>1</b> / <b>2</b>.<br>No pick = pink. Nobody is ever asked twice.</div>`,
    { label: '<b>HUD 2 · choice</b> · 5 s timer · default = pink (Bandersnatch "no no-choice")', kind: 'hud', dread: 1 }));

    // component states sheet
    const k = 0.5;
    b.push(board(`
      <div class="abs sheetcol" style="left:40px;top:90px;width:600px">
        <div class="tag">dialogue kinds</div>
        <div class="abs" style="left:0;top:60px;width:1200px;height:230px;transform:scale(${k});transform-origin:0 0">${dlg({ who: 'NANDA', text: 'Did you just pun at me? On MY roof?', dock: 'bl', style: { left: 0, bottom: 'auto', top: 30 } })}</div>
        <div class="abs" style="left:0;top:190px;width:1200px;height:230px;transform:scale(${k});transform-origin:0 0">${dlg({ who: 'MC', kind: 'mc', text: 'Technically, rain wasn\'t f-OR-ecast.', dock: 'bl', style: { left: 0, bottom: 'auto', top: 30 } })}</div>
        <div class="abs" style="left:0;top:320px;width:1200px;height:230px;transform:scale(${k});transform-origin:0 0">${dlg({ kind: 'narr', text: 'He doesn\'t blink.', dock: 'bl', style: { left: 0, bottom: 'auto', top: 30 } })}</div>
        <div class="abs" style="left:0;top:450px;width:1200px;height:230px;transform:scale(${k});transform-origin:0 0">${dlg({ who: 'CROWD', kind: 'crowd', text: 'fORever AND ever', and: true, dock: 'bl', style: { left: 0, bottom: 'auto', top: 30 } })}</div>
        <div class="abs" style="left:0;top:580px;width:1200px;height:230px;transform:scale(${k});transform-origin:0 0">${dlg({ kind: 'head', text: 'He came. He came. Act bored.', dock: 'bl', next: false, style: { left: 0, bottom: 'auto', top: 30 } })}</div>
        <div class="abs note" style="left:0;top:720px;width:600px">// her head = <b>director layer</b> (VA + animator). Never shown to the player.</div>
      </div>
      <div class="abs sheetcol" style="left:680px;top:90px;width:1200px">
        <div class="tag">choice states</div>
        ${[['idle', {}, 1, 'idle · 5 s'], ['hover pink', { pink: 'hover' }, 0.7, 'hover / focus (keys 1·2)'], ['picked purple', { purple: 'picked', pink: 'dim' }, 0.4, 'picked purple → bleed 334 ms'],
    ['replay', { purple: 'disabled' }, 0.3, 'replay: purple dead, timer still runs'], ['timeout', { pink: 'picked', purple: 'dim' }, 0, 'timeout → pink fires']].map(([n, s, t, l], i) => `
          <div class="abs" style="left:0;top:${60 + i * 140}px;width:1730px;height:260px;transform:scale(.46);transform-origin:0 0">
            ${choices({ pink: 'Stand up.', purple: 'Stay seated.', t, secs: t ? String(Math.ceil(t * 5)) : '0', state: s, style: { left: 0, right: 0, bottom: 'auto', top: 40 } })}</div>
          <div class="abs note" style="left:820px;top:${92 + i * 140}px;width:380px">${l}</div>`).join('')}
        <div class="tag" style="position:absolute;top:770px;left:0">chrome · captions</div>
        <div class="abs" style="left:0;top:815px;width:1200px;height:90px">${chrome({ on: ['cc'], style: { left: 0, top: 0, right: 'auto' } })}</div>
        <div class="abs" style="left:560px;top:815px;width:900px;height:90px">${chrome({ on: ['cc', 'rm', 'mute'], style: { left: 0, top: 0, right: 'auto' } })}</div>
        <div class="abs" style="left:0;top:895px;width:1300px;height:80px">${cap('[her breath]', { style: { left: 0, bottom: 'auto', top: 0 } })}${cap('[train hum stops]', { style: { left: 300, bottom: 'auto', top: 0 } })}${cap('Nanda (whisper): "…lea—"', { style: { left: 700, bottom: 'auto', top: 0 } })}</div>
      </div>`, { label: '<b>States</b> · same markup in A / B / C, only tokens + material change', kind: 'sheet' }));

    // dread ladder: the chrome itself corrupts
    const lines = ['You\'re late. I saved your seat. Obviously.', 'Nobody\'s ever eaten lunch with me twice.', 'Not you, silly. You. The one clicking.'];
    const faces = ['smile', 'tears', 'wide'];
    b.push(board(`
      ${[0, 1, 2].map((d) => mini(`${doorHUD(faces[d], d)}${dlg({ who: 'NANDA', text: lines[d], dock: 'bl' })}${chrome({ on: ['cc'], faint: true })}`, 0.305, `left:${40 + d * 626}px;top:92px`, d)).join('')}
      ${[0, 1, 2].map((d) => `<div class="abs" data-dread="${d}" style="left:${40 + d * 626}px;top:450px;width:1200px;height:640px;transform:scale(.49);transform-origin:0 0">
        ${dlg({ who: 'NANDA', text: lines[d], dock: 'bl', style: { left: 0, bottom: 'auto', top: 40 } })}
        ${choices({ pink: 'Stay.', purple: 'Leave.', t: [0.8, 0.45, 0.12][d], secs: ['4', '2', '1'][d], state: d === 2 ? { purple: 'disabled' } : {}, style: { left: 0, right: 0, bottom: 'auto', top: 330, width: 1200 } })}</div>
        <div class="abs dreadtag" style="left:${40 + d * 626}px;top:780px">DREAD ${d} · ${['cute', 'crack', 'wrong'][d]}</div>
        <div class="abs note dreadnote" style="left:${40 + d * 626}px;top:840px;width:590px">${(T.dreadNotes || [])[d] || ''}</div>`).join('')}`,
    { label: '<b>Dread ladder</b> · the same box + buttons sicken with the story (not a filter on top)', kind: 'ladder' }));

    // phone
    b.push(board(`<div class="fill dim">${A.sceneTrain({ rows: 2, nanda: false })}</div>
      ${notif({ body: 'seat\'s free now? 🙂', style: { left: 96, top: 90 } })}
      <svg class="abs art" viewBox="0 0 1920 1080" style="left:0;top:0;width:1920px;height:1080px">${A.hand(1180, 1040, 1.3, true)}${A.hand(1740, 1040, 1.3, false)}</svg>
      ${phone({ style: { left: 1180, top: 40 }, msgs: [{ cls: 'in x', text: 'seat\'s free now? 🙂', t: '21:04' }, { cls: 'in x', text: 'she\'s still standing there btw', t: '21:04' }] })}
      ${phone({ ava: 'n', head: 'Nanda ♡', sub: 'online', typing: false, style: { left: 520, top: 170, transform: 'scale(.82) rotate(-4deg)', transformOrigin: '0 0' },
    msgs: [{ cls: 'in n', text: 'home yet?', t: '21:31' }, { cls: 'in n', text: 'home yet? 🙂', t: '21:31' }, { cls: 'in n', text: 'you\'re walking slower. are you tired? i can carry you', t: '21:33' }] })}
      ${cap('[PING]', { style: { left: 96, bottom: 120 } })}
      <div class="abs note callout" style="left:96px;top:300px;width:380px">Figur Talk = our clone.<br>No DatingGameUI art.<br>XOR = purple. Nanda = pink.<br>Diegetic: bubbles live on the phone, never in the box.</div>`,
    { label: '<b>Phone</b> · ping banner → hard zoom to the thread (RM: hard cut)', kind: 'phone', dread: 1 }));

    // system: CW + pause
    b.push(board(`<div class="fill dim">${A.sceneTrain({ rows: 0, nanda: false })}</div>
      ${cw({ style: { left: 96, top: 150 } })}
      ${pause({ sel: 2, style: { left: 1210, top: 150 } })}
      <div class="abs note callout" style="left:96px;top:880px;width:1000px">The warning card is the one <b>honest</b> screen: out-of-world, never corrupts, never pink/purple.</div>`,
    { label: '<b>System</b> · content warning (before START) · Esc pause menu (presenter keys listed)', kind: 'system' }));

    // flowchart
    b.push(board(`<div class="fill">${A.flowchart()}</div>
      <div class="abs note callout" style="left:96px;top:120px;width:470px">Hidden until an ending.<br>Reveal = 3 hard cuts:<br>1 seen · 2 locked "???" · 3 the rewritten node.<br>Even her map obeys the rule: HER DO<span class="or">OR</span>.</div>
      <div class="abs note callout" style="left:1380px;top:280px;width:440px">She edited this one.<br>You never said it.</div>`,
    { label: '<b>The map</b> · the flowchart reveal after an ending', kind: 'flow', dread: 1 }));

    // invalid pin
    b.push(board(`<div class="fill dim">${A.sceneDoor()}</div>${sprite('wide', 'left:1160px;top:96px;width:660px;height:990px')}
      ${pinerr({ style: { left: 200, top: 250 } })}
      ${cap('[a lock clicks]', { style: { left: 200, bottom: 'auto', top: 680 } })}
      <div class="abs note callout" style="left:200px;top:780px;width:880px">Door 💜 "head home" → this. Shake = 4 poses, 125 ms grid, 2 swaps/s, 1 s.<br><b>Still mode:</b> no shake; the border cuts to her red and holds.</div>`,
    { label: '<b>Invalid pin</b> · "Leaving is not an option."', kind: 'pin', dread: 2 }));
    return b;
  }

  // ------------------------------------------------------------------ SPRITES
  function sprites() {
    const b = [];
    const faces = [['smile', 'SMILE', 'pin hums pink · "Good input."'], ['blank', 'BLANK', 'pin off · the 2 s "…fine."'], ['tears', 'CROC TEARS', 'pin flickers · mouth corner lifts'], ['wide', 'WIDE-EYED', 'pin solid red · "Mine."']];
    b.push(board(`<div class="faces">${faces.map(([f, n, d], i) => `<div class="card c-${f}"><div class="cardbg"></div>
      <div class="sp">${A.nanda({ face: f })}</div><div class="cap2"><h3>${n}</h3><p>${d}</p></div></div>`).join('')}</div>`,
    { label: '<b>Nanda</b> · 4 faces · the pin (a tiny NAND gate) is her mood light · <i class="phtag">PLACEHOLDER · swap slot for ALT art</i>', kind: 'faces' }));

    const row = (eyes, nanda = true) => {
      let s = '';
      [['suit', 150], ['girl', 330], ['hat', 510], ['bun', 690], ['suit', 870]].forEach(([kk, xx]) => { s += A.sil(kk, xx, 440, 0.62); });
      if (nanda) s += A.sil('nanda', 1080, 440, 0.62);
      return eyes ? s : s.replace(/<g class="eyes">[\s\S]*?<\/g>/g, '');
    };
    b.push(board(`
      <div class="panel" style="left:60px;top:90px;width:1250px;height:440px"><h3>eyes layer OFF</h3><svg class="art" viewBox="0 0 1250 440">${row(false)}</svg></div>
      <div class="panel p-dark" style="left:60px;top:580px;width:1250px;height:440px"><h3>eyes layer ON (hard cut)</h3><svg class="art" viewBox="0 0 1250 440">${row(true)}</svg></div>
      <div class="panel p-xor" style="left:1360px;top:90px;width:500px;height:930px"><h3>XOR</h3><div class="fill" style="top:40px">${A.xor()}</div>
        <div class="abs note xornote">headphones: hears the other ending<br>one eye covered: sees one side<br>always <b>typing…</b></div></div>`,
    { label: '<b>Silhouettes</b> · red eyes = a separate layer · <b>XOR</b> (purple, never Nanda\'s pink)', kind: 'sils' }));

    const pinStates = [['hum', 'hum · safe'], ['flicker', 'flicker · flustered'], ['off', 'off · blank'], ['red', 'solid red · afraid']];
    b.push(board(`
      <div class="panel" style="left:60px;top:90px;width:900px;height:440px"><h3>the pin, 4 states</h3>
        ${pinStates.map(([s, l], i) => `<div class="abs pinbox pin-${s}" style="left:${30 + i * 215}px;top:90px;width:200px;height:300px">
          <svg class="art" viewBox="-60 -60 120 120" style="width:200px;height:200px">${A.pin(0, 0, 0, 1.6)}</svg><div class="note" style="text-align:center">${l}</div></div>`).join('')}</div>
      <div class="panel" style="left:1000px;top:90px;width:860px;height:440px"><h3>her 3 foods</h3>
        <svg class="art" viewBox="0 0 860 440">${A.egg(170, 220, 2.2)}${A.plum(430, 220, 3)}${A.mochi(690, 220, 2.6)}</svg>
        <div class="abs note" style="left:40px;bottom:24px;right:40px;display:flex;justify-content:space-between"><span>tamagoyaki · SWEET · pink</span><span>umeboshi · SOUR · purple</span><span>mochi · STICKY · hers</span></div></div>
      <div class="panel" style="left:60px;top:580px;width:1800px;height:440px"><h3>MC = hands only</h3>
        <svg class="art" viewBox="0 0 1800 440">
          <g>${A.cup(300, 170, 1.3)}${A.hand(300, 400, 1.0, false)}</g>
          <g>${A.phone(900, 200, 0.85)}${A.hand(812, 420, 0.95, true)}${A.hand(988, 420, 0.95, false)}</g>
          <g><path class="k-wood2 ln fat" d="M1470,300 L1560,90 M1500,310 L1600,104"/>${A.plum(1585, 100, 1.4)}${A.hand(1480, 420, 1.0, false)}</g></svg>
        <div class="abs note" style="left:40px;top:80px;right:40px;display:flex;justify-content:space-around"><span>the third cup</span><span>the phone (her ping)</span><span>chopsticks · the sour pick</span></div></div>`,
    { label: '<b>Details</b> · pin states · food props (the echo rule) · MC hands', kind: 'details' }));
    return b;
  }

  // ------------------------------------------------------------------ SHEET
  function sheet() {
    const sw = (c, n) => `<div class="sw"><i style="background:${c}"></i><span>${n}</span></div>`;
    return [board(`
      <div class="abs sheetN" style="left:40px;top:70px;width:700px;height:1010px">${A.nanda({ face: 'smile' })}</div>
      <div class="abs phtag" style="left:40px;top:1020px">NANDA = PLACEHOLDER · swap slot 600×900 · pin anchor (372, 238) · face + pin = layers</div>
      <div class="abs callout note" style="left:556px;top:160px;width:236px">pin clip = a NAND gate; the output bubble is her mood light</div>
      <div class="abs callout note" style="left:40px;top:120px;width:220px">silver twin-tails, pink bows</div>
      <div class="abs callout note" style="left:40px;top:830px;width:230px">sailor collar = a theme token; ribbon = always pink</div>
      <div class="abs faceRow" style="left:800px;top:90px;width:680px;height:260px">
        ${['smile', 'blank', 'tears', 'wide'].map((f, i) => `<div class="abs fr" style="left:${i * 170}px;top:0;width:160px;height:250px;overflow:hidden"><div class="abs" style="left:-80px;top:-40px;width:320px;height:480px">${A.nanda({ face: f })}</div></div>`).join('')}</div>
      <div class="abs note" style="left:800px;top:360px;width:680px">smile · blank · croc tears · wide-eyed — 1 base PSD, 4 face layers + 4 pin layers</div>
      <div class="abs swatches" style="left:800px;top:450px;width:680px">
        ${sw('var(--pink)', 'PINK #FF5FA2 toward her')}${sw('var(--purple)', 'PURPLE #8A5CF6 leave / XOR')}${sw('var(--her)', 'HER RED #F0243F every OR')}
        ${sw('var(--c-hair)', 'hair')}${sw('var(--c-iris)', 'eyes')}${sw('var(--c-collar)', 'collar')}</div>
      <div class="abs sheetX" style="left:1480px;top:70px;width:420px;height:630px">${A.xor()}</div>
      <div class="abs note" style="left:1520px;top:715px;width:380px"><b>XOR</b> · "Only one of us can be true." Headphones, one eye hidden, always typing.</div>
      <div class="abs sheetH" style="left:800px;top:680px;width:680px;height:380px"><svg class="art" viewBox="0 0 680 420">${A.cup(200, 150, 1.1)}${A.hand(200, 360, 0.85, false)}${A.hand(500, 380, 0.85, true, 'open')}</svg></div>
      <div class="abs note" style="left:800px;top:640px;width:680px"><b>MC</b> = hands only · "Technically." · draws truth tables on napkins</div>
      <div class="abs note tics" style="left:1520px;top:850px;width:380px"><b>Nanda tics</b><br>flips her phone face-down<br>taps two fingers = two inputs<br>never finishes "lea—"<br>repeats "forever" when scared</div>
      ${x('sheet')}`, { label: '<b>Character sheet</b> · Nanda · XOR · MC (hands)', kind: 'sheet' })];
  }

  // ------------------------------------------------------------------ SCENES
  function scenes() {
    const b = [];
    b.push(board(`<div class="fill">${A.sceneTrain({ rows: 4, nanda: true })}</div>${x('train')}
      ${dlg({ who: 'CROWD', kind: 'crowd', text: 'fORever AND ever', and: true, dock: 'tl', next: false, style: { top: 130 } })}
      ${cap('[whispers · 8 voices · hum stops]', { style: { left: 96, top: 340, bottom: 'auto' } })}
      ${chrome({ on: ['cc'], faint: true })}`,
    { label: '<b>2X.5 · the chant</b> · every passenger turned · she is closest · box docks top: the aisle is the shot', kind: 'train', dread: 2 }));

    b.push(board(`<div class="fill">${A.sceneGenkan()}</div>${x('genkan')}
      ${dlg({ who: 'NANDA', text: 'I guessed your size. I\'m never wrong.', dock: 'tl', style: { left: 480, top: 150, width: 1000 } })}
      ${cap('[the door locks behind you]', { style: { left: 480, top: 360, bottom: 'auto' } })}`,
    { label: '<b>Genkan insert</b> · shoes to the millimetre · your slippers, waiting · the shrine = your last circuit', kind: 'genkan', dread: 1 }));

    b.push(board(`<div class="fill">${A.sceneKitchen()}</div>${x('kitchen')}
      <div class="abs steamOR" style="left:1215px;top:350px"><span class="or">OR</span></div>
      ${dlg({ who: 'NANDA', text: 'For Input B. Silly. It\'s always three of us.', dock: 'bl' })}
      ${cap('[a pour · nobody is pouring]', { style: { bottom: 290 } })}`,
    { label: '<b>Y4 · the third cup</b> · nobody poured it · the steam writes <span class="or">OR</span>', kind: 'kitchen', dread: 1 }));

    b.push(board(`<div class="fill steeped">${A.sceneKitchen()}</div>${x('kitchen', 2)}
      <div class="abs steamOR" style="left:1215px;top:350px"><span class="or">OR</span></div>
      ${choices({ pink: 'Drink.', purple: 'Stand up.', t: 0.34, secs: '2', state: { pink: 'hover' } })}
      ${cap('[sound goes underwater]', { style: { bottom: 300 } })}`,
    { label: '<b>STEEPED · the choice</b> · colour already draining to pink · the timer is hers', kind: 'kitchen', dread: 2 }));
    return b;
  }

  // ------------------------------------------------------------------ FX
  function fx() {
    const tiles = [['or', 'the OR renderer'], ['sour', 'sour pucker'], ['adore', 'ADORE ME'], ['rewind', 'the rewind'], ['bleed', '1-frame bleed'], ['rain', 'rain · 8 fps'], ['steeped', 'STEEPED drain'], ['overflow', 'dialogue overflow']];
    return [board(`<div class="fxgrid">${tiles.map(([id, n]) => `<div class="fx" data-fx="${id}"><div class="stage"></div>
      <div class="ctl"><span class="nm">${n}</span><button class="play">▶ play</button><button class="rmt">still</button></div></div>`).join('')}</div>`,
    { label: '<b>Effects</b> · each tile: ▶ play · "still" = the reduced-motion hard-cut version (≥500 ms holds, ≤3 Hz)', kind: 'fx' })];
  }

  const PAGES = { ui, sprites, sheet, scenes, fx };
  const page = document.body.dataset.page;
  const host = document.getElementById('boards');
  if (PAGES[page] && host) host.innerHTML = PAGES[page]().join('\n');
  window.PAGES = PAGES;
})();

/* live input demo on the ui page (not in ?b= screenshot mode): HUD 2's timer really runs; 1 / 2 pick; Esc = pause. */
document.addEventListener('db:ready', () => {
  'use strict';
  if (document.body.dataset.page !== 'ui' || document.body.classList.contains('solo')) return;
  const hud2 = document.querySelectorAll('.board')[1];
  if (!hud2) return;
  const bar = hud2.querySelector('.timer'), secs = hud2.querySelector('.timer .secs');
  const pink = hud2.querySelector('.choice.pink'), purple = hud2.querySelector('.choice.purple');
  let t = 1, done = false;
  const pick = (el, other) => {
    if (done) return; done = true;
    el.classList.add('is-picked'); other.classList.add('is-dim');
    if (el === purple) { const b = document.createElement('div'); b.className = 'abs fill'; b.style.cssText = 'background:rgba(138,92,246,.6);z-index:70'; hud2.appendChild(b); setTimeout(() => b.remove(), window.DB.RM ? 500 : 334); }
    setTimeout(() => { done = false; t = 1; el.classList.remove('is-picked'); other.classList.remove('is-dim'); }, 2500);
  };
  setInterval(() => {
    if (done) return;
    t = Math.max(0, t - 0.125 / 5);
    bar.style.setProperty('--t', t); secs.textContent = Math.ceil(t * 5);
    if (t === 0) pick(pink, purple);
  }, 125);
  pink.addEventListener('click', () => pick(pink, purple));
  purple.addEventListener('click', () => pick(purple, pink));
  let pauseEl = null;
  addEventListener('keydown', (e) => {
    if (e.key === '1') pick(pink, purple);
    if (e.key === '2') pick(purple, pink);
    if (e.key === 'Escape') {
      if (pauseEl) { pauseEl.remove(); pauseEl = null; return; }
      pauseEl = document.createElement('div'); pauseEl.className = 'abs fill'; pauseEl.style.cssText = 'background:rgba(0,0,0,.55);z-index:80';
      pauseEl.innerHTML = window.UI.pause({ style: { left: 650, top: 180 } });
      hud2.appendChild(pauseEl);
    }
  });
});
