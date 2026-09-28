/* H — component patches on top of shared/ui.js (A/B/C keep the R1 markup).
   dlg      : the dialogue box is a candy-ceramic IC. Pin-1 notch, pins top + bottom, name tag = ref designator
              (U1 · NANDA / J1 · YOU / BUS · CROWD). The bow on the chip is the horror throughline (tied → loose → traces).
   choices  : pink = wired in through R1 (a pull-up = the default is pink). Purple = a trace that goes nowhere:
              OUT_LEAVE → OUT_LEAVE ? → NC ✕. Replay = the canonical disabled pick (same width, greyed, key 2 inert,
              the timer keeps running toward pink).
   chrome   : ONE meta-chrome slot, top-right, 4 controls max, never corrupts, always ≥ 4.5:1 (no faint state). */
(function () {
  'use strict';
  const U = window.UI, A = window.ART;
  const or = (t, o) => window.DB.or(t, o);
  const st = U.st;
  const REF = { nanda: 'U1', mc: 'J1', crowd: 'BUS', head: 'U1/INT' };
  const NAME = { mc: 'YOU' };

  const bows = () => `<span class="bows" aria-hidden="true"><i class="b0">${A.bow(0)}</i><i class="b1">${A.bow(1)}</i><i class="b2">${A.bow(2)}</i></span>`;

  function dlg({ who, text, kind = 'nanda', dock = 'bl', style, next = true, and = false }) {
    const ref = REF[kind];
    const name = kind === 'head' ? 'her head' : (NAME[kind] || who);
    const tag = name ? `<b class="who">${ref ? `<i class="ref">${ref}</i>` : ''}<span class="nm">${name}</span></b>` : '';
    return `<div class="dlg ${kind} dock-${dock}" style="${st(style)}" role="status">
      <span class="pins top" aria-hidden="true"></span><span class="pins bot" aria-hidden="true"></span>
      ${tag}${kind === 'nanda' ? bows() : ''}<p class="line">${or(text, { and })}</p>
      ${next ? '<span class="next">click ▸</span>' : ''}</div>`;
  }

  const pullup = `<svg class="pullup" viewBox="0 0 80 170" aria-hidden="true">
      <text x="40" y="24" text-anchor="middle" class="rail">♥</text>
      <path class="lead-o" d="M40,34 V58 l-14,7 l28,12 l-28,12 l28,12 l-28,12 l14,7 V142 H80"/>
      <path class="lead" d="M40,34 V58 l-14,7 l28,12 l-28,12 l28,12 l-28,12 l14,7 V142 H80"/>
      <text x="4" y="104" class="r1">R1</text></svg>`;
  const nclead = `<svg class="nclead" viewBox="0 0 70 40" aria-hidden="true"><path class="dash" d="M0,20 H44"/><circle class="open" cx="56" cy="20" r="9"/></svg>`;

  function choices({ pink, purple, t = 0.62, secs = '3', state = {}, style, noTimer = false }) {
    const s = (k) => (state[k] ? ` is-${state[k]}` : '');
    const replay = state.purple === 'disabled' || state.purple === 'replay';
    const net = replay
      ? '<span class="net"><b class="nr">NC ✕</b></span>'
      : '<span class="net"><b class="n0">OUT_LEAVE</b><b class="n1">OUT_LEAVE ?</b><b class="n2">NC ✕</b></span>';
    return `<div class="choices${replay ? ' has-replay' : ''}" style="${st(style)}">
      ${pullup}
      <button class="choice pink is-default${s('pink')}"><span class="key">1</span><span class="line">${or(pink)}</span><span class="def"><i>R1 PULL-UP</i>DEFAULT ♥</span></button>
      <button class="choice purple${replay ? ' is-replay' : s('purple')}"${replay ? ' aria-disabled="true" aria-describedby="rp"' : ''}><span class="key">2</span><span class="line">${or(purple)}</span>${net}${nclead}</button>
      ${replay ? '<div class="replaytag" id="rp">REPLAY · you already said no</div>' : ''}
      ${noTimer ? '' : `<div class="timer" style="--t:${t}"><i></i><span class="secs">${secs}</span><span class="c1">C1 → ♥</span></div>`}
    </div>`;
  }

  // ONE meta-chrome slot. Icons + short labels, solid plate, never faint, never corrupts.
  function chrome({ on = [], style } = {}) {
    const b = (k, icon, label) => `<button class="${on.includes(k) ? 'on' : ''}" aria-pressed="${on.includes(k)}"><span class="ic">${icon}</span><span class="lb">${label}</span></button>`;
    return `<nav class="meta" aria-label="player controls" style="${st(style)}">
      ${b('cc', 'CC', 'CAPS')}${b('rm', '◐', 'STILL')}${b('mute', on.includes('mute') ? '✕' : '♪', on.includes('mute') ? 'MUTED' : 'SOUND')}${b('fs', '⛶', 'FULL')}</nav>`;
  }

  Object.assign(U, { dlg, choices, chrome });
})();
