/* date-beta mockups R1 — effects demo engine. Each effect has setup() (idle frame) and play(stage, still).
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
        <div class="fxmsg">every "${or('OR')}" = her red · 1 px offset · breath</div>`; },
      play: (s) => {
        const slot = s.querySelector('.orslot');
        seq(s, [[DB.HOLD, () => { slot.innerHTML = 'OR'; }], [1500, () => { slot.innerHTML = or('OR'); cap(s, '[her breath]', 1500); }]]);
      },
    },
    sour: {
      setup: (s) => { s.innerHTML = `<div class="squash">${svg(`${A().plum(220, 170, 4.2)}`)}<div class="fxline">NANDA: Sour, ne?</div></div><div class="tint"></div>`; },
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
    rewind: {
      setup: (s) => { s.innerHTML = `<div class="rw">${svg(`<rect class="k-wall" width="440" height="400"/>${A().sil('suit', 120, 400, 0.5)}${A().sil('nanda', 300, 400, 0.55)}
          <g transform="translate(220 90)"><circle class="k-paper" r="44"/><path class="k-lash ln fat hand-m" d="M0,0 L0,-32"/><path class="k-lash ln fat" d="M0,0 L0,-24"/></g>`)}</div>
          <div class="osd">PLAY ▶</div><div class="band"></div><div class="crt"></div>`; },
      play: (s, still) => {
        const osd = s.querySelector('.osd'), band = s.querySelector('.band'), crt = s.querySelector('.crt'), hand = s.querySelector('.hand-m');
        const rot = (d) => hand.setAttribute('transform', `rotate(${d})`);
        if (still) {
          seq(s, [[1000, () => { crt.className = 'crt line'; osd.textContent = '◀◀ REW'; }], [1500, () => { crt.className = 'crt'; rot(-90); osd.textContent = 'PLAY ▶'; cap(s, 'whisper: "again?"', 1500); }], [0, () => rot(0)]]);
          return;
        }
        const f = [[DB.HOLD, () => { osd.textContent = '◀◀ REW'; band.className = 'band on'; }]];
        for (let i = 1; i <= 6; i++) f.push([DB.TICK * 2, () => { band.style.top = `${i * 15}%`; rot(-i * 15); }]);
        f.push([250, () => { band.className = 'band'; crt.className = 'crt squeeze'; }], [700, () => { crt.className = 'crt line'; }],
          [1500, () => { crt.className = 'crt'; osd.textContent = 'PLAY ▶'; cap(s, 'whisper: "again?"', 1500); }], [0, () => { rot(0); band.style.top = '0'; }]);
        seq(s, f);
      },
    },
    bleed: {
      setup: (s) => { s.innerHTML = `<div class="bleedbtns"><span class="chip pink">Stand up.</span><span class="chip purple">Stay seated.</span></div><div class="bleed"></div><div class="fxmsg">pick purple → the frame goes purple for 334 ms (one step)</div>`; },
      play: (s, still) => {
        const b = s.querySelector('.bleed'), p = s.querySelector('.chip.purple');
        p.classList.add('pressed');
        seq(s, [[still ? DB.HOLD : DB.FLASH, () => { b.className = still ? 'bleed edge' : 'bleed on'; }], [DB.HOLD, () => { b.className = 'bleed'; }], [0, () => p.classList.remove('pressed')]]);
      },
    },
    rain: {
      setup: (s) => {
        let lines = '';
        for (let i = 0; i < 70; i++) { const xx = (i * 67) % 460, yy = (i * 131) % 420; lines += `<path class="k-steam ln" d="M${xx},${yy} l-8,30"/>`; }
        s.innerHTML = `<div class="rainbg">${svg(`<rect class="k-night" width="440" height="400"/><rect class="k-wall" x="40" y="160" width="140" height="240"/><rect class="k-light" x="80" y="200" width="40" height="50"/>
          <rect class="k-wall2" x="250" y="120" width="160" height="280"/>${A().sil('nanda', 330, 420, 0.45)}`)}</div><div class="rainlayer">${svg(lines, '0 0 440 400')}</div>`;
      },
      play: (s, still) => {
        const L = s.querySelector('.rainlayer');
        cap(s, '[rain]', 4000);
        if (still) return; // still mode: the static streaks ARE the rain
        for (let i = 1; i <= 32; i++) later(s, () => { L.style.transform = `translate(${-(i % 4) * 4}px, ${(i % 4) * 26}px)`; }, i * DB.TICK);
        later(s, () => { L.style.transform = ''; }, 33 * DB.TICK);
      },
    },
    steeped: {
      setup: (s) => { s.innerHTML = `<div class="st">${svg(`<rect class="k-wall" width="440" height="400"/><path class="k-wood" d="M0,230 L440,230 L440,400 L0,400 Z"/>${A().cup(100, 230, 0.8)}${A().cup(220, 222, 0.8)}${A().cup(340, 232, 0.85)}`)}</div>
        <div class="st ghost">${svg(`${A().cup(100, 230, 0.8)}${A().cup(220, 222, 0.8)}${A().cup(340, 232, 0.85)}`)}</div><div class="fxline">NANDA: Rest. I'll do the remembering.</div>`; },
      play: (s, still) => {
        s.dataset.steep = '0';
        cap(s, '[sound goes underwater]', 3200);
        seq(s, [[still ? DB.HOLD * 2 : 1200, () => { s.dataset.steep = '1'; }], [still ? DB.HOLD * 2 : 1200, () => { s.dataset.steep = '2'; }], [still ? DB.HOLD * 2 : 1400, () => { s.dataset.steep = '3'; }], [0, () => { s.dataset.steep = '0'; }]]);
      },
    },
    overflow: {
      setup: (s) => { s.innerHTML = '<div class="ovbox"><b class="who">NANDA</b><div class="ovlines"><p>I\'m not crying.</p></div></div>'; },
      play: (s) => {
        const L = s.querySelector('.ovlines');
        L.innerHTML = '';
        const lines = ['I\'m not crying.', 'You were going to leave.', 'Everyone leaves.', 'Not you. Right?', 'Right?', 'Right??', 'I made a schedule.', 'He wakes at 7:00.', 'From now on…', 'can we be forever?'];
        lines.forEach((t, i) => later(s, () => { const p = document.createElement('p'); p.innerHTML = or(t); if (i === lines.length - 1) p.className = 'last'; L.appendChild(p); }, i * 600));
        later(s, () => { L.innerHTML = '<p>I\'m not crying.</p>'; }, lines.length * 600 + 2200);
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
      tile.querySelector('.play').addEventListener('click', () => { clear(stage); stage.className = 'stage'; delete stage.dataset.steep; fx.setup(stage); fx.play(stage, tile.classList.contains('rm-on')); });
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
