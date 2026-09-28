/* HA — component patches on top of shared/ui.js. H's chip grammar, A's clean surface, ZERO notation in prod.
   PROD RULE: player-facing UI carries no engineering text. No ref designators, no net names, no pin labels,
   no "DEFAULT", no "REPLAY" plate, no measurements. The circuit lives only in SHAPES (chip notch, pins, the pull-up
   squiggle, the open-pin lead, the bow that unravels into traces). Name tags = "Nanda" / "You".
   Team notes live in the DEV overlay (key D / ?dev), off by default: see .dev in theme.css + ha-pages.js. */
(function () {
  'use strict';
  const U = window.UI, A = window.ART;
  const or = (t, o) => window.DB.or(t, o);
  const st = U.st;
  const NAME = { nanda: 'Nanda', mc: 'You' };

  const bows = () => `<span class="bows" aria-hidden="true"><i class="b0">${A.bow(0)}</i><i class="b1">${A.bow(1)}</i><i class="b2">${A.bow(2)}</i></span>`;

  // kinds: nanda · mc · narr (no tag) · crowd (no tag, the shout is the tag) · head (director only, no tag)
  function dlg({ text, kind = 'nanda', dock = 'bl', style, next = true, and = false }) {
    const name = NAME[kind];
    const tag = name ? `<b class="who">${name}</b>` : '';
    return `<div class="dlg ${kind} dock-${dock}${/OR/.test(text) ? ' has-or' : ''}" style="${st(style)}" role="status">
      <span class="pins top" aria-hidden="true"></span><span class="pins bot" aria-hidden="true"></span>
      ${tag}${kind === 'nanda' ? bows() : ''}<p class="line">${or(text, { and })}</p>
      ${next ? '<span class="next" aria-hidden="true">▸</span>' : ''}</div>`;
  }

  // pink's lead: a resistor squiggle from a heart rail (shape only, no label)
  const pullup = `<svg class="pullup" viewBox="0 0 80 170" aria-hidden="true">
      <path class="heart" d="M40,34 C22,20 20,6 30,4 C35,3 40,8 40,12 C40,8 45,3 50,4 C60,6 58,20 40,34 Z"/>
      <path class="lead-o" d="M40,40 V58 l-14,7 l28,12 l-28,12 l28,12 l-28,12 l14,7 V142 H80"/>
      <path class="lead" d="M40,40 V58 l-14,7 l28,12 l-28,12 l28,12 l-28,12 l14,7 V142 H80"/></svg>`;
  // purple's lead: a dashed trace ending in an open pin (shape only)
  const nclead = `<svg class="nclead" viewBox="0 0 70 40" aria-hidden="true"><path class="dash" d="M0,20 H44"/><circle class="open" cx="56" cy="20" r="9"/></svg>`;

  function choices({ pink, purple, t = 0.62, secs = '3', state = {}, style, noTimer = false }) {
    const s = (k) => (state[k] ? ` is-${state[k]}` : '');
    const replay = state.purple === 'disabled' || state.purple === 'replay';
    return `<div class="choices${replay ? ' has-replay' : ''}" style="${st(style)}">
      ${pullup}
      <button class="choice pink is-default${s('pink')}${/OR/.test(pink) ? ' hasor' : ''}"><span class="key">1</span><span class="line">${or(pink)}</span></button>
      <button class="choice purple${/OR/.test(purple) ? ' hasor' : ''}${replay ? ' is-replay' : s('purple')}"${replay ? ' aria-disabled="true" aria-label="already refused"' : ''}><span class="key">2</span><span class="line">${or(purple)}</span>${replay ? '<span class="x" aria-hidden="true">✕</span>' : ''}${nclead}</button>
      ${noTimer ? '' : `<div class="timer" style="--t:${t}"><i></i><span class="secs">${secs}</span></div>`}
    </div>`;
  }

  // meta: TWO corner controls only (top-right). A menu icon (CC / still / sound / full live inside it) + a big skip pill.
  function chrome({ on = [], style, open = false } = {}) {
    const row = (k, label) => `<button class="${on.includes(k) ? 'on' : ''}" aria-pressed="${on.includes(k)}">${label}<span>${on.includes(k) ? 'on' : 'off'}</span></button>`;
    return `<nav class="meta" aria-label="player controls" style="${st(style)}">
      <button class="menu${open ? ' on' : ''}" aria-label="menu" aria-expanded="${open}">☰</button><button class="skip" aria-label="skip scene">skip ▶▶</button></nav>
      ${open ? `<div class="menupop" role="menu">${row('cc', 'Captions')}${row('rm', 'Still mode')}${row('mute', 'Mute')}${row('fs', 'Fullscreen')}</div>` : ''}`;
  }
  // the date HUD tile (top-left): portrait + a heart counter that corrupts. d0 "♥ 4/5" → d2 "LEAVES 0/∞"
  function datehud({ dread = 0, style } = {}) {
    const ct = dread === 2 ? '<b>LEAVES</b> 0/∞' : `<b>♥</b> ${dread === 1 ? '4/5' : '4/5'}`;
    return `<div class="datehud" style="${st(style)}"><div class="pf">${A.nanda({ face: dread === 2 ? 'wide' : 'smile' })}</div><span class="ct">${ct}</span></div>`;
  }
  // sticker hero line: 1-2 per route, <= 5 words, floats over the scene
  const sticker = (text, style) => `<div class="sticker" style="${st(style)}">${or(text)}</div>`;

  // CW + pause: clean paper, the system face, no part numbers
  function cw({ style } = {}) {
    return `<div class="cw" style="${st(style)}"><h2>Before you date</h2>
      <ul><li>Psychological horror, PG-13.</li><li>Obsession, guilt-tripping.</li><li>No gore. No fast flashing.</li><li>Captions on. Still mode: R.</li></ul>
      <div class="row"><button class="btn primary">Continue ▸</button><button class="btn">Still: off</button></div></div>`;
  }
  function pause({ sel = 0, style } = {}) {
    const items = [['Resume', 'Esc'], ['Captions', 'C'], ['Still mode', 'R'], ['Sound', 'M'], ['Skip scene', 'S'], ['Quit', 'Q']];
    return `<div class="pause" style="${st(style)}"><h2>Paused</h2><ol>
      ${items.map(([l, k], i) => `<li class="${i === sel ? 'sel' : ''}">${l}<kbd>${k}</kbd></li>`).join('')}</ol></div>`;
  }
  // her OS: one line, two buttons. "Leave" = the canonical disabled look. No error codes.
  function pinerr({ style, cls = '' } = {}) {
    return `<div class="pinerr ${cls}" style="${st(style)}" role="alertdialog">
      <div class="tb"><span>Figur OS</span><span aria-hidden="true">✕</span></div>
      <div class="bd"><svg class="ic" viewBox="0 0 150 120" aria-hidden="true"><path d="M10,40 L40,40 M10,80 L40,80 M40,20 L75,20 A40,40 0 0 1 75,100 L40,100 Z" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>
        <circle cx="122" cy="60" r="9" fill="none" stroke="var(--her)" stroke-width="7"/></svg>
        <div><div class="msgx">Leaving is not an option.</div></div></div>
      <div class="ft"><button class="btn ok">OK</button><button class="btn dead" aria-disabled="true">Leave</button></div></div>`;
  }
  const notif = ({ style, title = 'XOR', body } = {}) => `<div class="notif" style="${st(style)}">
      <div class="ava" style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--purple-deep);flex:none">${A.xor()}</div>
      <div><div class="app">Figur Talk</div><div class="body"><b>${title}</b> ${or(body)}</div></div></div>`;

  Object.assign(U, { dlg, choices, chrome, cw, pause, pinerr, notif, datehud, sticker });
})();
