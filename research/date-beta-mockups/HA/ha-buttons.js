/* HA R2c — the glossy button set (composition ref: Tony's stock sheet, redrawn in CSS/SVG). Boards:
   1 the full set (pills, 9 round icons, choice states)  2 in context (HUD choice + meta)  3 dread 2 + OR (rule C) + refused. */
(function () {
  'use strict';
  const { gicon, gpill, choices, chrome, datehud, dlg } = window.UI;
  const A = window.ART;
  const host = document.getElementById('boards');
  const board = (inner, { label = '', dread = 0, cls = '' } = {}) => `<section class="board ${cls}" data-dread="${dread}">${inner}${label ? `<div class="label">${label}</div>` : ''}</section>`;
  const icons = ['play', 'pause', 'stop', 'back', 'check', 'list', 'retry', 'gear', 'grid'];
  const one = (html, x, y, w = 1300) => `<div class="abs choices" style="left:${x}px;top:${y}px;width:${w}px;right:auto;bottom:auto;display:block">${html}</div>`;
  const b1 = board(`
    <div class="abs" style="left:110px;top:110px;display:flex;gap:56px">${gpill('Yes')}${gpill('No', { cls: 'purple' })}${gpill('Play')}</div>
    <div class="abs" style="left:110px;top:320px;display:grid;grid-template-columns:repeat(3,112px);gap:58px">${icons.map((k) => gicon(k)).join('')}</div>
    <div class="abs" style="left:700px;top:320px;display:grid;gap:56px">${gpill('Menu', { style: { width: 460 } })}${gpill('Options', { cls: 'purple', style: { width: 460 } })}${gpill('Exit', { cls: 'is-pressed', style: { width: 460 } })}${gpill('Leave', { cls: 'is-refused', style: { width: 460 } })}</div>
    <div class="abs" style="left:1260px;top:320px;display:grid;grid-template-columns:repeat(2,112px);gap:58px">${gicon('play', { cls: 'purple' })}${gicon('pause', { cls: 'is-pressed' })}${gicon('stop', { cls: 'is-refused' })}${gicon('check', { cls: 'hasor' })}</div>
    <div class="abs note" style="left:1260px;top:720px;width:560px">DEV · row: pink · purple · pressed (sinks 8 px) · refused (grey, struck, ✕) · dark (rule C body). All states = class swaps, hard cuts in RM.</div>`,
  { label: '<b>R2c buttons</b> · pill + cream rim + drop + glossy body + highlight band · Nunito 900 white, 1 px #3A0A26 outline', cls: 'gbg' });
  const st = (s) => ({ left: 90, right: 90, bottom: 'auto', top: s });
  const b2 = board(`
    ${one(choices({ pink: 'Just one cup.', purple: 'It\'s late. Goodnight.', noTimer: true, style: st(0) }), 130, 90, 1660)}
    ${one(choices({ pink: 'Just one cup.', purple: 'It\'s late. Goodnight.', noTimer: true, state: { pink: 'picked', purple: 'dim' }, style: st(0) }), 130, 330, 1660)}
    ${one(choices({ pink: 'Just one cup.', purple: 'It\'s late. Goodnight.', noTimer: true, state: { purple: 'replay' }, style: st(0) }), 130, 570, 1660)}
    ${one(choices({ pink: 'fORever.', purple: 'OR leave?', noTimer: true, style: st(0) }), 130, 810, 1660)}
    <div class="abs note" style="left:40px;top:40px">DEV · idle · pink pressed · purple refused (replay) · OR choices = rule C dark body, same rim</div>`,
  { label: '<b>Choice states</b>', cls: 'gbg' });
  const door = `<div class="fill">${A.sceneDoor()}</div><div class="abs" style="left:540px;top:96px;width:660px;height:990px">${A.nanda({ face: 'smile' })}</div>`;
  const b3 = board(`${door}${choices({ pink: 'Just one cup.', purple: 'It\'s late. Goodnight.', t: 0.58, secs: '3', state: { pink: 'hover' } })}${datehud({ dread: 0 })}${chrome({ on: ['cc'] })}`, { label: '<b>In context</b> · HUD choice + ☰ + skip' });
  const door2 = `<div class="fill">${A.sceneDoor()}</div>${A.short(870, 450, { r: 300 })}<div class="abs" style="left:540px;top:96px;width:660px;height:990px">${A.nanda({ face: 'wide' })}</div>`;
  const b4 = board(`${door2}${choices({ pink: 'Stay.', purple: 'OR leave?', t: 0.2, secs: '1' })}${datehud({ dread: 2 })}${chrome({ on: ['cc'] })}`, { label: '<b>Dread 2</b> · rim goes meat-pink on her red · OR choice on rule C', dread: 2 });
  if (host) host.innerHTML = [b1, b2, b3, b4].join('\n');
  window.SHOTS = [{ name: 'set-1024', b: 1, vw: 1024 }, { name: 'hud-1024', b: 3, vw: 1024 }];
})();
