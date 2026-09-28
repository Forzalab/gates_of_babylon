/* date-beta mockups R1 — component builders. Same markup for every theme; the theme's CSS reskins it.
   All copy obeys the 12-words-per-click budget; every OR passes through DB.or(). */
(function () {
  'use strict';
  const or = (t, o) => window.DB.or(t, o);
  const st = (o) => Object.entries(o || {}).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';');

  // dialogue box. kind: nanda | mc | narr | head | crowd
  function dlg({ who, text, kind = 'nanda', dock = 'bl', style, next = true, and = false }) {
    const whoTxt = kind === 'head' ? '// her head' : who;
    return `<div class="dlg ${kind} dock-${dock}" style="${st(style)}" role="status">
      ${whoTxt ? `<b class="who">${whoTxt}</b>` : ''}<p class="line">${or(text, { and })}</p>
      ${next ? '<span class="next">click ▸</span>' : ''}</div>`;
  }

  // choices + the shrinking timer. The timer drains TOWARD pink: when it empties, the heart lands on pink.
  function choices({ pink, purple, t = 0.62, secs = '3', state = {}, style, noTimer = false }) {
    const s = (k) => state[k] ? ` is-${state[k]}` : '';
    return `<div class="choices" style="${st(style)}">
      <button class="choice pink is-default${s('pink')}"><span class="key">1</span><span class="line">${or(pink)}</span><span class="def">DEFAULT ♥</span></button>
      <button class="choice purple${s('purple')}"><span class="key">2</span><span class="line">${or(purple)}</span></button>
      ${noTimer ? '' : `<div class="timer" style="--t:${t}"><i></i><span class="secs">${secs}</span></div>`}
    </div>`;
  }

  const cap = (text, { sfx = true, style } = {}) => `<div class="cap${sfx ? ' sfx' : ''}" style="${st(style)}">${or(text)}</div>`;

  function chrome({ on = [], style, faint = false } = {}) {
    const b = (k, icon, label) => `<button class="${on.includes(k) ? 'on' : ''}" aria-pressed="${on.includes(k)}">${icon}<span>${label}</span></button>`;
    return `<div class="chrome${faint ? ' faint' : ''}" style="${st(style)}">
      ${b('cc', '▭', 'CC')}${b('rm', '◐', 'STILL')}${b('mute', on.includes('mute') ? '🔇' : '🔊', on.includes('mute') ? 'MUTED' : 'SOUND')}${b('fs', '⛶', 'FULL')}</div>`;
  }

  function cw({ style } = {}) {
    return `<div class="cw" style="${st(style)}"><h2>Before you date</h2>
      <ul><li>Psychological horror, PG-13.</li><li>Obsession, gaslighting, guilt-tripping.</li>
      <li>No gore. No flashing faster than 3 per second.</li><li>Captions on. Still mode: press R.</li></ul>
      <div class="row"><button class="btn primary">Continue ▸</button><button class="btn">Still mode: OFF</button><button class="btn">Captions: ON</button></div></div>`;
  }

  function pause({ sel = 0, style } = {}) {
    const items = [['Resume', 'Esc'], ['Captions', 'C', 'ON'], ['Still mode (no motion)', 'R', 'OFF'], ['Sound', 'M', 'ON'], ['Fullscreen', 'F'], ['Skip scene', 'S'], ['Quit to title', 'Q']];
    return `<div class="pause" style="${st(style)}"><h2>Paused</h2><ol>
      ${items.map(([l, k, v], i) => `<li class="${i === sel ? 'sel' : ''}">${l}${v ? ` <span class="val">${v}</span>` : ''}<kbd>${k}</kbd></li>`).join('')}</ol></div>`;
  }

  function phone({ style, head = 'XOR', sub = 'typing…', msgs = [], typing = true, ava = 'x' } = {}) {
    const avatar = ava === 'x' ? `<div class="ava">${window.ART.xor()}</div>` : `<div class="ava" style="background:var(--pink)">${window.ART.nanda({ face: 'smile' })}</div>`;
    return `<div class="phone" style="${st(style)}"><div class="scr">
      <div class="bar">${avatar}<div><div class="who2">${head}</div><div class="sub">${sub}</div></div></div>
      <div class="thread">${msgs.map((m) => `<div class="msg ${m.cls}">${or(m.text)}<span class="t">${m.t || ''}</span></div>`).join('')}
      ${typing ? '<div class="typing">•••</div>' : ''}</div>
      <div class="compose">Figur Talk · message</div></div></div>`;
  }

  const notif = ({ style, app = 'FIGUR TALK · NOTifications', title = 'XOR', body } = {}) => `<div class="notif" style="${st(style)}">
      <div class="ava" style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--purple);flex:none">${window.ART.xor()}</div>
      <div><div class="app">${app}</div><div class="body"><b>${title}</b> ${or(body)}</div></div></div>`;

  function pinerr({ style, cls = '' } = {}) {
    return `<div class="pinerr ${cls}" style="${st(style)}" role="alertdialog">
      <div class="tb"><span>Figur OS — Invalid pin</span><span>✕</span></div>
      <div class="bd"><svg class="ic" viewBox="0 0 150 120"><path d="M10,40 L40,40 M10,80 L40,80 M40,20 L75,20 A40,40 0 0 1 75,100 L40,100 Z" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="round"/>
        <circle cx="122" cy="60" r="9" fill="none" stroke="var(--her)" stroke-width="7"/><path d="M134,48 L146,36 M134,72 L146,84" stroke="var(--her)" stroke-width="6" stroke-linecap="round"/></svg>
        <div><div class="msgx">Leaving is not an option.</div><div class="code">ERR 0x0C · output pin "leave" is not connected</div></div></div>
      <div class="ft"><button class="btn primary" style="background:var(--pink);color:var(--pink-ink)">OK</button><button class="btn" style="background:repeating-linear-gradient(135deg,#4a3d66 0 14px,#3d3257 14px 28px);color:#cfc6e6;text-decoration:line-through 3px">Leave</button></div></div>`;
  }

  const scale = (html, k, style) => `<div class="abs" style="transform:scale(${k});transform-origin:0 0;${st(style)}">${html}</div>`;

  window.UI = { dlg, choices, cap, chrome, cw, pause, phone, notif, pinerr, scale, st };
})();
