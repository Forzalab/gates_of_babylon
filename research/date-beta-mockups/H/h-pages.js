/* H — page builder (fork of shared/pages.js; R1 variants keep theirs).
   Same page set + board order as A/B/C, plus: ui-09 the canonical replay/disabled pick, ui-10 drop-in fit over the
   5 locked engine scenes, scenes-05 the dialogue overflow at full scale (name tag pinned).
   The throughline layer (threads at dread 1, traces at dread 2) sits BETWEEN the backdrop and her sprite,
   so the traces plug into her from behind and never cross her face. */
(function () {
  'use strict';
  const { dlg, choices, cap, chrome, cw, pause, phone, notif, pinerr } = window.UI;
  const A = window.ART;

  const board = (inner, { label = '', dread = 0, kind = 'plain', cls = '' } = {}) => `<section class="board ${cls} k-${kind}" data-dread="${dread}" data-kind="${kind}">
      ${inner}${label ? `<div class="label">${label}</div>` : ''}</section>`;
  const sprite = (face, style, extra = {}) => `<div class="abs" style="${style}">${A.nanda({ face, ...extra })}</div>`;
  const mini = (inner, k, style, dread = 0) => `<div class="abs mini" data-dread="${dread}" style="width:${1920 * k}px;height:${1080 * k}px;${style}">
      <div class="abs" data-dread="${dread}" style="left:0;top:0;width:1920px;height:1080px;transform:scale(${k});transform-origin:0 0;overflow:hidden;background:var(--bg)">${inner}</div></div>`;
  // the throughline: nothing (0) · loose stitched thread from the edges (1) · taut her-red traces into her (2)
  const layer = (d, at, opt = {}) => (d === 1 ? A.threads(opt) : d === 2 ? A.short(at[0], at[1], opt) : '');
  // door HUD: sprite at (540, 96) × 1.1 → her head centre ≈ (870, 459)
  const HEAD = [870, 450];
  const doorHUD = (face, d) => `<div class="fill">${A.sceneDoor()}</div>${layer(d, HEAD, { r: 300 })}${sprite(face, 'left:540px;top:96px;width:660px;height:990px')}`;
  // the engine's old R0 box is still baked into these PNGs: a scrim on the bottom band marks it as "replaced"
  const demoImg = (f) => `<img src="../../date-beta-demo/${f}" alt="" style="position:absolute;left:0;top:0;width:1920px;height:1080px"><div class="scrim"></div>`;

  // ------------------------------------------------------------------ UI
  function ui() {
    const b = [];
    b.push(board(`${doorHUD('smile', 0)}
      ${cap('[rain, soft · cicadas]')}
      ${dlg({ who: 'NANDA', text: 'Come in? Just for tea.', dock: 'bl' })}
      ${chrome({ on: ['cc'] })}`,
    { label: '<b>HUD 1 · dialogue</b> · the box is a chip: U1 · NANDA · bow tied = dread 0', kind: 'hud' }));

    b.push(board(`${doorHUD('smile', 1)}
      ${cap('[kettle clicks, off-screen]', { style: { bottom: 300 } })}
      ${choices({ pink: '"Just one cup."', purple: '"It\'s late. Goodnight."', t: 0.58, secs: '3', state: { pink: 'hover' } })}
      ${chrome({ on: ['cc'] })}
      <div class="abs callout" style="right:96px;top:150px;width:600px">pink is wired in through <b>R1</b> (a pull-up: no input = pink).<br>purple's lead ends in an open pin.<br>timer drains <b>toward pink</b>. Keys 1 · 2.</div>`,
    { label: '<b>HUD 2 · choice</b> · 5 s · the thread creeps in from the edges (dread 1)', kind: 'hud', dread: 1 }));

    // states sheet
    const k = 0.5;
    const sdl = (top, o) => `<div class="abs" style="left:0;top:${top}px;width:1300px;height:260px;transform:scale(${k});transform-origin:0 0">${dlg({ dock: 'bl', ...o, style: { left: 0, bottom: 'auto', top: 50 } })}</div>`;
    b.push(board(`
      <div class="abs" style="left:40px;top:100px;width:620px">
        <div class="tag">dialogue kinds · ref designators</div>
        ${sdl(40, { who: 'NANDA', text: 'Did you just pun at me? On MY roof?' })}
        ${sdl(180, { kind: 'mc', text: 'Technically, rain wasn\'t f-OR-ecast.' })}
        ${sdl(320, { kind: 'narr', text: 'He doesn\'t blink.' })}
        ${sdl(460, { who: 'CROWD', kind: 'crowd', text: 'fORever AND ever', and: true })}
        ${sdl(600, { kind: 'head', text: 'He came. He came. Act bored.', next: false })}
        <div class="abs note" style="left:0;top:790px;width:620px">U1 = her · J1 = you · BUS = the crowd · U1/INT = her head (director layer, never shown)</div>
      </div>
      <div class="abs" style="left:700px;top:100px;width:1180px">
        <div class="tag">choice states</div>
        ${[['idle', {}, 1, 'idle · 5 s'], ['hover', { pink: 'hover' }, 0.7, 'hover / focus · 6 px ring'], ['picked purple', { purple: 'picked', pink: 'dim' }, 0.4, 'picked purple → 334 ms bleed'],
    ['replay', { purple: 'replay' }, 0.3, '<b>replay</b> · greyed, same width, key 2 inert, timer runs'], ['timeout', { pink: 'picked', purple: 'dim' }, 0, 'timeout → pink fires']].map(([n, s, t, l], i) => `
          <div class="abs" style="left:40px;top:${70 + i * 136}px;width:1730px;height:260px;transform:scale(.44);transform-origin:0 0">
            ${choices({ pink: 'Stand up.', purple: 'Stay seated.', t, secs: t ? String(Math.ceil(t * 5)) : '0', state: s, style: { left: 90, right: 90, bottom: 'auto', top: 90 } })}</div>
          <div class="abs note" style="left:800px;top:${108 + i * 136}px;width:380px">${l}</div>`).join('')}
        <div class="tag" style="position:absolute;top:780px;left:0">the ONE meta slot · captions</div>
        <div class="abs" style="left:0;top:826px;width:440px;height:80px">${chrome({ on: ['cc'], style: { left: 0, top: 0, right: 'auto' } })}</div>
        <div class="abs" style="left:460px;top:826px;width:440px;height:80px">${chrome({ on: ['cc', 'rm', 'mute'], style: { left: 0, top: 0, right: 'auto' } })}</div>
        <div class="abs note" style="left:920px;top:830px;width:260px">top-right · 412×72 · 4 max · never faint</div>
        <div class="abs" style="left:0;top:920px;width:1200px;height:70px">${cap('[her breath]', { style: { left: 0, bottom: 'auto', top: 0 } })}${cap('[train hum stops]', { style: { left: 250, bottom: 'auto', top: 0 } })}${cap('Nanda (whisper): "…lea—"', { style: { left: 610, bottom: 'auto', top: 0 } })}</div>
      </div>`, { label: '<b>States</b> · diegetic voice = RC / Bangers · substrate + meta = mono', kind: 'sheet' }));

    // dread ladder
    const lines = ['You\'re late. I saved your seat. Obviously.', 'Nobody\'s ever eaten lunch with me twice.', 'Not you, silly. You. The one clicking.'];
    const faces = ['smile', 'tears', 'wide'];
    const notes = [
      '<b>tied</b> · candy chip, pink bow, pins clean. Purple looks like a real option.',
      '<b>loose</b> · wine ink, stitches inside the chip, the bow slips, thread creeps in. OUT_LEAVE ?',
      '<b>taut</b> · the thread is now her-red traces into her. Solder bridges drip. NC ✕. OR keeps a halo.',
    ];
    b.push(board(`
      ${[0, 1, 2].map((d) => mini(`${doorHUD(faces[d], d)}${dlg({ who: 'NANDA', text: lines[d], dock: 'bl' })}${chrome({ on: ['cc'] })}`, 0.305, `left:${40 + d * 626}px;top:100px`, d)).join('')}
      ${[0, 1, 2].map((d) => `<div class="abs" data-dread="${d}" style="left:${40 + d * 626}px;top:470px;width:1200px;height:640px;transform:scale(.49);transform-origin:0 0">
        ${dlg({ who: 'NANDA', text: lines[d].replace('silly', 'silly') + (d === 2 ? '' : ''), dock: 'bl', style: { left: 0, bottom: 'auto', top: 50 } })}
        ${choices({ pink: 'Stay.', purple: 'OR leave?', t: [0.8, 0.45, 0.12][d], secs: ['4', '2', '1'][d], style: { left: 90, right: 20, bottom: 'auto', top: 380, width: 1090 } })}</div>
        <div class="abs dreadtag" style="left:${40 + d * 626}px;top:800px">DREAD ${d} · ${['cute', 'crack', 'wrong'][d]}</div>
        <div class="abs note" style="left:${40 + d * 626}px;top:862px;width:590px">${notes[d]}</div>`).join('')}`,
    { label: '<b>Dread ladder</b> · one throughline: the ribbon unravels into traces', kind: 'ladder' }));

    // phone
    b.push(board(`<div class="fill dim">${A.sceneTrain({ rows: 2, nanda: false })}</div>
      ${notif({ body: 'seat\'s free now? 🙂', style: { left: 96, top: 120 } })}
      <svg class="abs art" viewBox="0 0 1920 1080" style="left:0;top:0;width:1920px;height:1080px">${A.hand(1180, 1040, 1.3, true)}${A.hand(1740, 1040, 1.3, false)}</svg>
      ${phone({ style: { left: 1180, top: 60 }, msgs: [{ cls: 'in x', text: 'seat\'s free now? 🙂', t: '21:04' }, { cls: 'in x', text: 'she\'s still standing there btw', t: '21:04' }] })}
      ${phone({ ava: 'n', head: 'Nanda ♡', sub: 'online', typing: false, style: { left: 520, top: 190, transform: 'scale(.82) rotate(-4deg)', transformOrigin: '0 0' },
    msgs: [{ cls: 'in n', text: 'home yet?', t: '21:31' }, { cls: 'in n', text: 'home yet? 🙂', t: '21:31' }, { cls: 'in n', text: 'you\'re walking slower. are you tired? i can carry you', t: '21:33' }] })}
      ${cap('[PING]', { style: { left: 96, bottom: 120 } })}
      ${chrome({ on: ['cc'] })}
      <div class="abs callout" style="left:96px;top:330px;width:380px">Figur Talk = our clone.<br>XOR = purple. Nanda = pink.<br>Bubbles live on the phone, never in the chip.</div>`,
    { label: '<b>Phone</b> · ping banner → hard cut to the thread', kind: 'phone', dread: 1 }));

    // CW + pause (datasheet)
    b.push(board(`<div class="fill dim">${A.sceneTrain({ rows: 0, nanda: false })}</div>
      ${cw({ style: { left: 96, top: 150 } })}
      ${pause({ sel: 2, style: { left: 1210, top: 150 } })}
      <div class="abs callout" style="left:96px;top:900px;width:1000px">The datasheet is the one <b>honest</b> paper: mono, black on paper, never corrupts, never pink or purple.</div>`,
    { label: '<b>System</b> · content warning (before START) · Esc = pause (pin table)', kind: 'system' }));

    // flowchart
    b.push(board(`<div class="fill">${A.flowchart()}</div>
      <div class="abs callout" style="left:96px;top:130px;width:470px">Hidden until an ending.<br>Reveal = 3 hard cuts:<br>seen · locked "???" · rewritten.<br>HER DO<span class="or">OR</span>.</div>
      <div class="abs callout" style="left:1380px;top:290px;width:440px">She edited this one.<br>You never said it.</div>`,
    { label: '<b>The map</b> · the flowchart reveal after an ending', kind: 'flow', dread: 1 }));

    // invalid pin: traces reroute to her; the dialog sits on top
    b.push(board(`<div class="fill dim">${A.sceneDoor()}</div>${layer(2, [1490, 450], { r: 300, ends: [[1, -0.5], [1, 0.3], [-0.2, -1], [0.5, -1], [1, 0.8]] })}${sprite('wide', 'left:1160px;top:96px;width:660px;height:990px')}
      ${pinerr({ style: { left: 160, top: 250 } })}
      ${cap('[a lock clicks]', { style: { left: 160, bottom: 'auto', top: 690 } })}
      <div class="abs callout" style="left:160px;top:790px;width:900px">Door 💜 "head home" → this. Shake = 4 poses on the 125 ms grid, 1 s.<br><b>Still:</b> no shake; the border cuts to her red and holds.</div>`,
    { label: '<b>Invalid pin</b> · "Leaving is not an option."', kind: 'pin', dread: 2 }));

    // NEW: the canonical replay / disabled pick, full frame
    b.push(board(`${doorHUD('smile', 1)}
      ${cap('[the kettle, again]', { style: { bottom: 300 } })}
      ${choices({ pink: '"Just one cup."', purple: '"It\'s late. Goodnight."', t: 0.46, secs: '3', state: { purple: 'replay' } })}
      ${chrome({ on: ['cc'] })}
      <div class="abs callout" style="right:96px;top:150px;width:620px"><b>Replay rule</b> (one layout, every theme):<br>· same width, greyed, struck, NC ✕<br>· key 2 / click = inert; a 500 ms red ring, no reflow<br>· the timer keeps running → pink fires<br>· she already knows you said no</div>`,
    { label: '<b>Replay</b> · the disabled pick · Bandersnatch: the clock never stops for you', kind: 'hud', dread: 1 }));

    // NEW: drop-in fit over the locked engine scenes (palette + chrome, no re-skin of the BGs)
    b.push(board(`
      ${mini(`${demoImg('02b-rooftop-noon.png')}${dlg({ who: 'NANDA', text: 'Did you just pun at me? On MY roof?', dock: 'bc', style: { width: 1400 } })}${chrome({ on: ['cc'] })}`, 0.44, 'left:60px;top:100px', 0)}
      ${mini(`${demoImg('03-train-window.png')}${choices({ pink: 'Sit with her.', purple: 'Stand by the door.', t: 0.6, secs: '3' })}${chrome({ on: ['cc'] })}`, 0.44, 'left:1016px;top:100px', 1)}
      ${mini(`${demoImg('04-naan-billboard.png')}${cap('[the ad hums · NAND]', { style: { bottom: 300 } })}${dlg({ kind: 'mc', text: 'Technically, that\'s a NAND gate.', dock: 'bc', style: { width: 1400 } })}${chrome({ on: ['cc'] })}`, 0.44, 'left:60px;top:600px', 1)}
      ${mini(`${demoImg('05d-blackout-ADORE-ME.png')}${cap('[silence] … [static]', { style: { bottom: 120 } })}${chrome({ on: ['cc'] })}`, 0.44, 'left:1016px;top:600px', 2)}`,
    { label: '<b>Drop-in fit</b> · H chrome over the 5 locked engine scenes · no BG re-skin', kind: 'fit' }));
    return b;
  }

  // ------------------------------------------------------------------ SPRITES
  function sprites() {
    const b = [];
    const faces = [['smile', 'SMILE', 'pin hums pink · "Good input."'], ['blank', 'BLANK', 'pin off · the 2 s "…fine."'], ['tears', 'CROC TEARS', 'pin flickers · mouth lifts'], ['wide', 'WIDE-EYED', 'pin solid red · "Mine."']];
    b.push(board(`<div class="faces">${faces.map(([f, n, d]) => `<div class="card c-${f}"><div class="cardbg"></div>
      <div class="sp">${A.nanda({ face: f })}</div><div class="cap2"><h3><small>U1</small>${n}</h3><p>${d}</p></div></div>`).join('')}</div>`,
    { label: '<b>Nanda</b> · 4 faces · the pin (a tiny NAND gate) is her mood light · <i class="phtag">PLACEHOLDER · swap slot for ALT art</i>', kind: 'faces' }));

    const row = (eyes) => {
      let s = '';
      [['suit', 150], ['girl', 330], ['hat', 510], ['bun', 690], ['suit', 870]].forEach(([kk, xx]) => { s += A.sil(kk, xx, 440, 0.62); });
      s += A.sil('nanda', 1080, 440, 0.62);
      return eyes ? s : s.replace(/<g class="eyes">[\s\S]*?<\/g>/g, '');
    };
    b.push(board(`
      <div class="panel" style="left:60px;top:100px;width:1250px;height:430px"><h3>eyes layer OFF</h3><svg class="art" viewBox="0 0 1250 440">${row(false)}</svg></div>
      <div class="panel p-dark" style="left:60px;top:580px;width:1250px;height:440px"><h3>eyes layer ON (hard cut)</h3><svg class="art" viewBox="0 0 1250 440">${row(true)}</svg></div>
      <div class="panel p-xor" style="left:1360px;top:100px;width:500px;height:920px"><h3>XOR</h3><div class="fill" style="top:40px">${A.xor()}</div>
        <div class="abs note xornote">headphones: hears the other ending<br>one eye covered · always <b>typing…</b></div></div>`,
    { label: '<b>Silhouettes</b> · red eyes = a separate layer · <b>XOR</b> = purple, never her pink', kind: 'sils' }));

    const pinStates = [['hum', 'hum · safe'], ['flicker', 'flicker · flustered'], ['off', 'off · blank'], ['red', 'solid red · afraid']];
    b.push(board(`
      <div class="panel" style="left:60px;top:100px;width:900px;height:430px"><h3>the pin, 4 states</h3>
        ${pinStates.map(([s, l], i) => `<div class="abs pinbox pin-${s}" style="left:${24 + i * 216}px;top:90px;width:206px;height:300px">
          <svg class="art" viewBox="-60 -60 120 120" style="width:200px;height:200px">${A.pin(0, 0, 0, 1.6)}</svg><div class="note" style="text-align:center">${l}</div></div>`).join('')}</div>
      <div class="panel" style="left:1000px;top:100px;width:860px;height:430px"><h3>the bow, 3 states</h3>
        ${[0, 1, 2].map((d) => `<div class="abs" data-dread="${d}" style="left:${70 + d * 270}px;top:110px;width:160px;height:220px;${d === 2 ? 'background:#2a0714;border-radius:16px' : ''}"><div style="transform:scale(2);transform-origin:0 0;width:80px;height:110px">${A.bow(d)}</div></div>
          <div class="abs note" style="left:${40 + d * 270}px;top:350px;width:230px;text-align:center">${['tied · 0', 'loose · 1', 'traces · 2'][d]}</div>`).join('')}</div>
      <div class="panel" style="left:60px;top:580px;width:1800px;height:440px"><h3>MC = hands only · her 3 foods</h3>
        <svg class="art" viewBox="0 0 1800 440">
          <g>${A.cup(260, 170, 1.3)}${A.hand(260, 400, 1.0, false)}</g>
          <g>${A.phone(760, 200, 0.85)}${A.hand(672, 420, 0.95, true)}${A.hand(848, 420, 0.95, false)}</g>
          ${A.egg(1150, 230, 2.2)}${A.plum(1400, 230, 3)}${A.mochi(1640, 230, 2.6)}</svg>
        <div class="abs note" style="left:1040px;top:360px;width:720px;display:flex;justify-content:space-between"><span>SWEET · pink</span><span>SOUR · purple</span><span>STICKY · hers</span></div></div>`,
    { label: '<b>Details</b> · pin states · bow states (the throughline) · hands · foods', kind: 'details' }));
    return b;
  }

  // ------------------------------------------------------------------ SHEET
  function sheet() {
    const sw = (c, n) => `<div class="sw"><i style="background:${c}"></i><span>${n}</span></div>`;
    return [board(`
      <div class="abs sheetN" style="left:40px;top:80px;width:700px;height:1000px">${A.nanda({ face: 'smile' })}</div>
      <div class="abs phtag" style="left:40px;top:1024px">NANDA = PLACEHOLDER · swap slot 600×900 · pin anchor (372, 238) · face + pin = layers</div>
      <div class="abs callout" style="left:520px;top:170px;width:260px">pin clip = a NAND gate; the output bubble is her mood light</div>
      <div class="abs callout" style="left:40px;top:830px;width:250px">ribbon + bows = always pink. They are the thread.</div>
      <div class="abs faceRow" style="left:800px;top:100px;width:680px;height:260px">
        ${['smile', 'blank', 'tears', 'wide'].map((f, i) => `<div class="abs fr" style="left:${i * 170}px;top:0;width:160px;height:250px;overflow:hidden;border:4px solid #3a1d3f;border-radius:12px;background:#fffafd"><div class="abs" style="left:-80px;top:-40px;width:320px;height:480px">${A.nanda({ face: f })}</div></div>`).join('')}</div>
      <div class="abs note" style="left:800px;top:370px;width:680px">smile · blank · croc tears · wide — 1 PSD, 4 face + 4 pin layers</div>
      <div class="abs" style="left:800px;top:450px;width:700px">
        ${sw('var(--pink)', 'PINK #FF5FA2 toward')}${sw('var(--purple)', 'PURPLE #8A5CF6 leave')}${sw('var(--her)', 'HER RED #F0243F OR')}
        ${sw('#3a1d3f', 'PLUM #3A1D3F ink')}${sw('#fff8fb', 'CHIP #FFF8FB')}${sw('#000', 'CAPTION #000')}</div>
      <div class="abs" style="left:1480px;top:80px;width:420px;height:630px">${A.xor()}</div>
      <div class="abs note" style="left:1510px;top:720px;width:380px"><b>XOR</b> · "Only one of us can be true."</div>
      <div class="abs" style="left:800px;top:700px;width:680px;height:340px"><svg class="art" viewBox="0 0 680 420">${A.cup(200, 150, 1.1)}${A.hand(200, 360, 0.85, false)}${A.hand(500, 380, 0.85, true, 'open')}</svg></div>
      <div class="abs note" style="left:800px;top:650px;width:680px"><b>MC</b> = hands only · "Technically." · truth tables on napkins</div>
      <div class="abs note" style="left:1510px;top:830px;width:380px"><b>tics</b> · phone face-down · two-finger tap · never finishes "lea—"</div>`,
    { label: '<b>Character sheet</b> · Nanda · XOR · MC (hands)', kind: 'sheet' })];
  }

  // ------------------------------------------------------------------ SCENES
  function scenes() {
    const b = [];
    b.push(board(`<div class="fill">${A.sceneTrain({ rows: 4, nanda: true })}</div>${layer(2, [1230, 420], { r: 190, ends: [[0.25, -1], [-0.25, -1], [0.7, -1], [1, 0.35], [-0.75, -1]] })}
      ${dlg({ who: 'CROWD', kind: 'crowd', text: 'fORever AND ever', and: true, dock: 'tl', next: false, style: { top: 130, width: 1000 } })}
      ${cap('[whispers · 8 voices · hum stops]', { style: { left: 96, top: 360, bottom: 'auto' } })}
      ${chrome({ on: ['cc'] })}`,
    { label: '<b>2X.5 · the chant</b> · every passenger turned · the traces run to her', kind: 'train', dread: 2 }));

    b.push(board(`<div class="fill">${A.sceneGenkan()}</div>${layer(1, null, { paths: ['M0,160 C120,190 170,260 220,330', 'M1920,560 C1840,590 1800,650 1760,690'] })}
      ${dlg({ who: 'NANDA', text: 'I guessed your size. I\'m never wrong.', dock: 'tl', style: { left: 540, top: 150, width: 960 } })}
      ${cap('[the door locks behind you]', { style: { left: 540, top: 380, bottom: 'auto' } })}
      ${chrome({ on: ['cc'] })}`,
    { label: '<b>Genkan</b> · 3 pairs to the millimetre · a 4th slot, yours · slippers · the shrine', kind: 'genkan', dread: 1 }));

    b.push(board(`<div class="fill">${A.sceneKitchen()}</div>${layer(1)}
      <div class="abs steamOR" style="left:1215px;top:350px"><span class="or">OR</span></div>
      ${dlg({ who: 'NANDA', text: 'For Input B. Silly. It\'s always three of us.', dock: 'bl' })}
      ${cap('[a pour · nobody is pouring]', { style: { bottom: 290 } })}
      ${chrome({ on: ['cc'] })}`,
    { label: '<b>Y4 · the third cup</b> · nobody poured it · the steam writes <span class="or">OR</span>', kind: 'kitchen', dread: 1 }));

    b.push(board(`<div class="fill steeped">${A.sceneKitchen()}</div>${layer(2, [1300, 560], { r: 170, ends: [[-1, -0.5], [-1, 0.2], [1, -0.4], [0.2, -1], [-0.4, -1]] })}
      <div class="abs steamOR" style="left:1215px;top:350px"><span class="or">OR</span></div>
      ${choices({ pink: 'Drink.', purple: 'Stand up.', t: 0.34, secs: '2', state: { pink: 'hover' } })}
      ${cap('[sound goes underwater]', { style: { bottom: 300 } })}
      ${chrome({ on: ['cc'] })}`,
    { label: '<b>STEEPED · the choice</b> · every trace runs to Input B · the timer is hers', kind: 'kitchen', dread: 2 }));

    // NEW: overflow at full scale. The chip grows upward; the tag rides its top edge, so it is never covered.
    const ov = ['I\'m not crying.', 'You were going to leave.', 'Everyone leaves.', 'Not you. Right?', 'Right??', 'I made a schedule.', 'He wakes at 7:00.', 'From now on…', 'can we be forever?'];
    b.push(board(`<div class="fill dim">${A.sceneKitchen()}</div>${layer(1)}
      <div class="dlg nanda dock-bl overflow" role="log"><span class="pins top"></span><span class="pins bot"></span>
        <b class="who"><i class="ref">U1</i><span class="nm">NANDA</span></b>
        <span class="bows"><i class="b0">${A.bow(0)}</i><i class="b1">${A.bow(1)}</i><i class="b2">${A.bow(2)}</i></span>
        <div class="stack">${ov.map((t, i) => `<p class="line${i === ov.length - 1 ? ' last' : ''}">${window.DB.or(t)}</p>`).join('')}</div></div>
      ${cap('[7:00 · café hum · a spoon, stirring]', { style: { left: 1320, bottom: 80 } })}
      ${chrome({ on: ['cc'] })}
      <div class="abs callout" style="left:1320px;top:220px;width:500px">Lines stack one per 600 ms (RM: the same hard cuts).<br>The chip grows <b>upward</b>; the tag rides its top edge.<br>At max height the oldest line clips <b>under</b> the tag, never over it.</div>`,
    { label: '<b>LEAVE · 7:00 café</b> · the dialogue overflows · U1 · NANDA stays on top', kind: 'overflow', dread: 1 }));
    return b;
  }

  // ------------------------------------------------------------------ FX
  function fx() {
    const tiles = [['or', 'the OR renderer'], ['sour', 'sour pucker'], ['adore', 'ADORE ME'], ['short', 'the short (dread 2)'], ['bleed', '1-frame bleed'], ['replay', 'replay: dead pick'], ['steeped', 'STEEPED drain'], ['overflow', 'dialogue overflow']];
    return [board(`<div class="fxgrid">${tiles.map(([id, n]) => `<div class="fx" data-fx="${id}"><div class="stage"></div>
      <div class="ctl"><span class="nm">${n}</span><button class="play">▶ play</button><button class="rmt">still</button></div></div>`).join('')}</div>`,
    { label: '<b>Effects</b> · ▶ play · "still" = the RM hard-cut version · a playing button is drawn disabled', kind: 'fx' })];
  }

  const PAGES = { ui, sprites, sheet, scenes, fx };
  const page = document.body.dataset.page;
  const host = document.getElementById('boards');
  if (PAGES[page] && host) host.innerHTML = PAGES[page]().join('\n');
  window.PAGES = PAGES;
  // extra screenshot states (shots.mjs): vw 1024 = projector-width check
  if (page === 'ui') window.SHOTS = [{ name: 'replay-nudge', b: 9, fn: 'hReplayNudge' }, { name: 'ladder-1024', b: 4, vw: 1024 }];
  if (page === 'scenes') window.SHOTS = [{ name: 'genkan-1024', b: 2, vw: 1024 }, { name: 'chant-1024', b: 1, vw: 1024 }];
})();

/* live demo on the ui page (not in ?b= screenshot mode): HUD 2 + Replay timers really run; 1 / 2 pick; Esc = pause. */
document.addEventListener('db:ready', () => {
  'use strict';
  if (document.body.dataset.page !== 'ui') return;
  const boards = document.querySelectorAll('.board');
  // screenshot hook: replay board, key 2 pressed (the inert nudge)
  window.hReplayNudge = () => { const p = boards[8] && boards[8].querySelector('.choice.purple'); if (p) p.classList.add('is-nudge'); };
  if (document.body.classList.contains('solo')) return;
  const run = (bd, replay) => {
    if (!bd) return;
    const bar = bd.querySelector('.timer'), secs = bd.querySelector('.timer .secs');
    const pink = bd.querySelector('.choice.pink'), purple = bd.querySelector('.choice.purple');
    let t = 1, done = false;
    const pick = (el, other) => {
      if (done) return; done = true;
      el.classList.add('is-picked'); other.classList.add('is-dim');
      if (el === purple) { const f = document.createElement('div'); f.className = 'abs fill'; f.style.cssText = 'background:rgba(138,92,246,.6);z-index:70'; bd.appendChild(f); setTimeout(() => f.remove(), window.DB.RM ? 500 : 334); }
      setTimeout(() => { done = false; t = 1; el.classList.remove('is-picked'); other.classList.remove('is-dim'); }, 2500);
    };
    const nudge = () => { purple.classList.add('is-nudge'); setTimeout(() => purple.classList.remove('is-nudge'), 500); };
    const step = window.DB.RM ? 1000 : 125;
    setInterval(() => {
      if (done) return;
      t = Math.max(0, t - step / 1000 / 5);
      bar.style.setProperty('--t', t); secs.textContent = Math.ceil(t * 5);
      if (t === 0) pick(pink, purple);
    }, step);
    pink.addEventListener('click', () => pick(pink, purple));
    purple.addEventListener('click', () => (replay ? nudge() : pick(purple, pink)));
    return { pink: () => pick(pink, purple), purple: () => (replay ? nudge() : pick(purple, pink)) };
  };
  const h2 = run(boards[1], false), rp = run(boards[8], true);
  let pauseEl = null;
  addEventListener('keydown', (e) => {
    if (e.key === '1') { h2.pink(); rp.pink(); }
    if (e.key === '2') { h2.purple(); rp.purple(); }
    if (e.key === 'Escape') {
      if (pauseEl) { pauseEl.remove(); pauseEl = null; return; }
      pauseEl = document.createElement('div'); pauseEl.className = 'abs fill'; pauseEl.style.cssText = 'background:rgba(0,0,0,.55);z-index:80';
      pauseEl.innerHTML = window.UI.pause({ style: { left: 650, top: 180 } });
      boards[1].appendChild(pauseEl);
    }
  });
});
