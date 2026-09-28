/* HA fork of H/h-fx.js: no notation in tiles (tile notes = DEV overlay), rewind restyled as traces rerouting backward, rain cut.
   H fork of shared/fx.js: rewind + rain tiles → short + replay; overflow keeps the tag on top; playing buttons are drawn disabled.
   date-beta mockups R1 — effects demo engine. Each effect has setup() (idle frame) and play(stage, still).
   Full motion: drawn things step on the 125 ms grid, cuts hold >= 500 ms, flashes hold 334 ms, <= 3 Hz.
   Still (reduced motion): a designed set of hard-cut frames, same sound cues (as captions). */
(function () {
  'use strict';
  const DB = window.DB, A = () => window.ART;
  const or = (t) => DB.or(t);
  const cap = (stage, text, ms = 1500) => {
    const c = document.createElement('div');
    c.className = 'fxcap';
    c.innerHTML = or(text);
    stage.appendChild(c);
    if (ms) setTimeout(() => c.remove(), ms);
    return c;
  };
  const svg = (inner, vb = '0 0 440 400') => `<svg class="art" viewBox="${vb}" style="position:absolute;inset:0;width:100%;height:100%">${inner}</svg>`;
  const timers = new WeakMap();
  const later = (stage, fn, ms) => { const t = setTimeout(fn, ms); (timers.get(stage) || timers.set(stage, []).get(stage)).push(t); };
  const clear = (stage) => { (timers.get(stage) || []).forEach(clearTimeout); timers.set(stage, []); };
  const seq = (stage, frames) => { let t = 0; frames.forEach(([ms, fn]) => { later(stage, fn, t); t += ms; }); };

  const FX = {
    or: {
      setup: (s) => { s.innerHTML = `<div class="fxsign"><small>FIGUR WEATHER</small><div class="big">f-<span class="orslot">${or('OR')}</span>-ecast</div></div>
        <div class="fxrow"><span class="chip pink">f${or('OR')}ever</span><span class="chip purple">${or('OR')} leave?</span></div>
        <div class="fxmsg devonly">every "${or('OR')}" = her red · 1 px offset · breath</div>`; },
      play: (s) => {
        const slot = s.querySelector('.orslot');
        seq(s, [[DB.HOLD, () => { slot.innerHTML = 'OR'; }], [1500, () => { slot.innerHTML = or('OR'); cap(s, '[her breath]', 1500); }]]);
      },
    },
    sour: {
      setup: (s) => { s.innerHTML = `<div class="squash">${svg(`${A().plum(220, 170, 4.2)}`)}<div class="fxline">Sour, ne?</div></div><div class="tint"></div>`; },
      play: (s, still) => {
        const q = s.querySelector('.squash'), tint = s.querySelector('.tint');
        cap(s, '[sour squeak]', 1400);
        if (still) { seq(s, [[DB.HOLD, () => tint.classList.add('on')], [0, () => tint.classList.remove('on')]]); return; }
        seq(s, [[DB.FLASH, () => { tint.classList.add('on'); q.style.transform = 'scaleY(.92)'; }],
          [DB.TICK, () => { q.style.transform = 'scaleY(.92) translateX(5px)'; }], [DB.TICK, () => { q.style.transform = 'scaleY(.92) translateX(-5px)'; }],
          [DB.TICK, () => { q.style.transform = 'scaleY(.92)'; tint.classList.remove('on'); }], [0, () => { q.style.transform = ''; }]]);
      },
    },
    adore: {
      setup: (s) => { s.innerHTML = '<div class="adore"><span class="w">f-</span><span class="o">OR</span><span class="w">-ecast</span></div>'; },
      play: (s, still) => {
        const box = s.querySelector('.adore');
        const put = (h) => { box.innerHTML = h; };
        const o = `<span class="o">${or('OR')}</span>`;
        if (still) {
          seq(s, [[800, () => put(o)], [800, () => put(`<span>AD</span>${o}`)], [2000, () => put(`<span>AD</span>${o}<span>E ME</span>`)], [1000, () => { put(''); s.classList.add('black'); cap(s, '[silence] … [static]', 1000); }], [0, () => s.classList.remove('black')]]);
          return;
        }
        seq(s, [[700, () => put(`<span class="w out">f-</span>${o}<span class="w out">-ecast</span>`)], [600, () => put(o)],
          [600, () => put(`<span class="fadein">D</span>${o}`)], [600, () => put(`<span class="fadein">A</span><span>D</span>${o}`)],
          [600, () => put(`<span>AD</span>${o}<span class="fadein">E</span>`)], [2000, () => put(`<span>AD</span>${o}<span>E</span><span class="fadein">&nbsp;ME</span>`)],
          [1000, () => { put(''); s.classList.add('black'); cap(s, '[silence] … [static]', 1000); }], [0, () => s.classList.remove('black')]]);
      },
    },
    short: {
      // the throughline in one tile: bow tied → loose thread → taut her-red traces into her. Hard cuts only (both modes).
      setup: (s) => {
        const sil = A().sil('nanda', 220, 420, 0.55);
        s.innerHTML = `<div class="shortst" data-step="0">${svg(`<rect class="k-wall" width="440" height="400"/>
          <g class="g1"><path class="h-thread" d="M0,90 C60,100 90,150 120,190"/><path class="h-thread" d="M440,120 C380,140 360,190 330,220"/></g>
          <g class="g2"><path class="h-trace-o" d="M0,120 H90 L150,170"/><path class="h-trace" d="M0,120 H90 L150,170"/><circle class="h-knot" cx="150" cy="170" r="9"/>
            <path class="h-trace-o" d="M440,150 H360 L300,190"/><path class="h-trace" d="M440,150 H360 L300,190"/><circle class="h-knot" cx="300" cy="190" r="9"/>
            <path class="h-trace-o" d="M180,0 V60 L200,90"/><path class="h-trace" d="M180,0 V60 L200,90"/><circle class="h-knot" cx="200" cy="90" r="9"/></g>
          ${sil}`)}<div class="fxline"><span class="bowslot">${A().bow(0)}</span>Stay.</div></div>`;
      },
      play: (s, still) => {
        const st = s.querySelector('.shortst'), slot = s.querySelector('.bowslot');
        const to = (n) => { st.dataset.step = n; slot.innerHTML = A().bow(n); };
        const h = still ? 1000 : 700;
        seq(s, [[h, () => to(0)], [h, () => to(1)], [h * 2, () => { to(2); cap(s, '[a hum, like a wire]', h * 2); }], [0, () => to(0)]]);
        return h * 4;
      },
    },
    replay: {
      // the canonical disabled pick: same width, greyed, NC ✕, key 2 inert (a 500 ms red ring), the timer keeps running.
      setup: (s) => {
        s.innerHTML = `<div class="rpl" data-dread="1"><div class="chip pink rpk">1 Stay.</div><div class="chip rpdead">2 <s>Leave.</s> ✕</div>
          <div class="rpbar"><i style="--t:1"></i></div><div class="rpsecs">5</div></div>`;
      },
      play: (s, still) => {
        const bar = s.querySelector('.rpbar i'), secs = s.querySelector('.rpsecs'), dead = s.querySelector('.rpdead'), pk = s.querySelector('.rpk');
        const step = still ? 1000 : 125, n = 5000 / step, f = [];
        for (let i = 1; i <= n; i++) {
          f.push([step, () => { const t = 1 - i / n; bar.style.setProperty('--t', t); secs.textContent = Math.ceil(t * 5); }]);
          if (i === Math.round(n * 0.4)) f.push([0, () => { dead.classList.add('nudge'); cap(s, '[2 · nothing happens]', 1500); later(s, () => dead.classList.remove('nudge'), 500); }]);
        }
        f.push([1500, () => { pk.classList.add('pressed'); cap(s, '[pink chime · detuned]', 1500); }], [0, () => { pk.classList.remove('pressed'); bar.style.setProperty('--t', 1); secs.textContent = '5'; }]);
        seq(s, f);
        return 5000 + 1500;
      },
    },
    rewind: {
      // HA rewind: no VHS. The traces reroute BACKWARD: they unplug from her and climb back into the ceiling (4 hard cuts), then "again?".
      setup: (s) => {
        const sil = A().sil('nanda', 220, 420, 0.55);
        const fr = (n) => `<g class="fr f${n}">${A().reroute(220, 200, n)}</g>`;
        s.innerHTML = `<div class="rwst" data-step="0">${svg(`<rect class="k-wall dark" width="440" height="400"/>${fr(0)}${fr(1)}${fr(2)}${fr(3)}${sil}`)}</div><div class="fxline rwline">Stay.</div>`;
      },
      play: (s, still) => {
        const st = s.querySelector('.rwst'), line = s.querySelector('.rwline');
        const h = still ? 1000 : 625; // 5 ticks per frame on the 8 fps grid; still = 1 s holds
        cap(s, '[a wire, winding back]', h * 3);
        seq(s, [[h, () => { st.dataset.step = 1; }], [h, () => { st.dataset.step = 2; }], [h, () => { st.dataset.step = 3; }],
          [h * 2, () => { line.innerHTML = 'Again?'; }], [0, () => { st.dataset.step = 0; line.innerHTML = 'Stay.'; }]]);
        return h * 5;
      },
    },
    bleed: {
      setup: (s) => { s.innerHTML = `<div class="bleedbtns"><span class="chip pink">Stand up.</span><span class="chip purple">Stay seated.</span></div><div class="bleed"></div><div class="fxmsg devonly">pick purple → the frame goes purple for 334 ms (one step)</div>`; },
      play: (s, still) => {
        const b = s.querySelector('.bleed'), p = s.querySelector('.chip.purple');
        p.classList.add('pressed');
        seq(s, [[still ? DB.HOLD : DB.FLASH, () => { b.className = still ? 'bleed edge' : 'bleed on'; }], [DB.HOLD, () => { b.className = 'bleed'; }], [0, () => p.classList.remove('pressed')]]);
      },
    },
    steeped: {
      setup: (s) => { s.innerHTML = `<div class="st">${svg(`<rect class="k-wall" width="440" height="400"/><path class="k-wood" d="M0,230 L440,230 L440,400 L0,400 Z"/>${A().cup(100, 230, 0.8)}${A().cup(220, 222, 0.8)}${A().cup(340, 232, 0.85)}`)}</div>
        <div class="st ghost">${svg(`${A().cup(100, 230, 0.8)}${A().cup(220, 222, 0.8)}${A().cup(340, 232, 0.85)}`)}</div><div class="fxline">Rest. I'll do the remembering.</div>`; },
      play: (s, still) => {
        s.dataset.steep = '0';
        cap(s, '[sound goes underwater]', 3200);
        seq(s, [[still ? DB.HOLD * 2 : 1200, () => { s.dataset.steep = '1'; }], [still ? DB.HOLD * 2 : 1200, () => { s.dataset.steep = '2'; }], [still ? DB.HOLD * 2 : 1400, () => { s.dataset.steep = '3'; }], [0, () => { s.dataset.steep = '0'; }]]);
      },
    },
    overflow: {
      // the chip grows upward; the tag rides its top edge, so no line can cover it. At max height old lines clip UNDER the tag.
      setup: (s) => { s.innerHTML = '<div class="ovbox"><b class="who">Nanda</b><div class="ovlines"><p>I\'m not crying.</p></div></div>'; },
      play: (s) => {
        const L = s.querySelector('.ovlines');
        L.innerHTML = '';
        const lines = ['I\'m not crying.', 'You were going to leave.', 'Everyone leaves.', 'Not you. Right?', 'Right?', 'Right??', 'I made a schedule.', 'He wakes at 7:00.', 'From now on…', 'can we be forever?'];
        lines.forEach((t, i) => later(s, () => { const p = document.createElement('p'); p.innerHTML = or(t); if (i === lines.length - 1) p.className = 'last'; L.appendChild(p); }, i * 600));
        later(s, () => { L.innerHTML = '<p>I\'m not crying.</p>'; }, lines.length * 600 + 2200);
        return lines.length * 600 + 2200;
      },
    },
  };

  function init() {
    document.querySelectorAll('.fx[data-fx]').forEach((tile) => {
      const id = tile.dataset.fx, stage = tile.querySelector('.stage'), fx = FX[id];
      if (!fx) return;
      const rmBtn = tile.querySelector('.rmt');
      const setRM = (on) => { tile.classList.toggle('rm-on', on); rmBtn.classList.toggle('on', on); rmBtn.textContent = on ? 'still ✓' : 'still'; };
      setRM(DB.RM);
      fx.setup(stage);
      rmBtn.addEventListener('click', () => { setRM(!tile.classList.contains('rm-on')); clear(stage); fx.setup(stage); });
      const playBtn = tile.querySelector('.play');
      playBtn.addEventListener('click', () => {
        clear(stage); stage.className = 'stage'; delete stage.dataset.steep; fx.setup(stage);
        const ms = fx.play(stage, tile.classList.contains('rm-on')) || 4500;
        // drawn disabled state while the effect runs (striped + struck, not just faded); back to ▶ when done
        playBtn.disabled = true; playBtn.textContent = '▶ playing'; rmBtn.disabled = true;
        later(stage, () => { playBtn.disabled = false; playBtn.textContent = '▶ play'; rmBtn.disabled = false; }, ms);
      });
    });
  }
  window.fxPlayAll = () => document.querySelectorAll('.fx .play').forEach((b) => b.click());
  window.fxStillAll = () => document.querySelectorAll('.fx').forEach((t) => { if (!t.classList.contains('rm-on')) t.querySelector('.rmt').click(); });
  window.SHOTS = document.body.dataset.page === 'fx' ? [
    { name: 'play-t0700', b: 1, fn: 'fxPlayAll', wait: 700 },
    { name: 'play-t1900', b: 1, fn: 'fxPlayAll', wait: 1900 },
    { name: 'play-t3200', b: 1, fn: 'fxPlayAll', wait: 3200 },
    { name: 'still-t0700', b: 1, rm: true, fn: 'fxPlayAll', wait: 700 },
    { name: 'still-t2300', b: 1, rm: true, fn: 'fxPlayAll', wait: 2300 },
  ] : (window.SHOTS || []);
  document.addEventListener('db:ready', init);
})();
