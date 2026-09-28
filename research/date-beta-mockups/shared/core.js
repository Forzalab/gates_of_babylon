/* date-beta mockups R1 — shared runtime (classic script, works from file:// and the vite dev server).
   - Boards are fixed 1920x1080 stages, scaled to the window. ?b=N shows board N alone (used for screenshots).
   - ?still or prefers-reduced-motion => html.rm => every effect is a hard cut (designed frames, >=500 ms holds).
   - DB.or(text): the OR rule. Every "OR" = her red + 1px offset (+ breath cue in captions). AND (chant only) = pink.
   - DB.step(frames): the shared 8 fps grid. Drawn things advance on 125 ms ticks and hold each pose >= 500 ms. */
(function () {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const DB = (window.DB = {
    Q,
    RM: Q.has('still') || mq.matches,
    TICK: 125, // 8 fps
    HOLD: 500, // minimum hold for any cut / pose
    FLASH: 334, // a "1-frame" flash is held this long (<= 3 Hz)
  });
  const root = document.documentElement;
  root.classList.toggle('rm', DB.RM);
  DB.setRM = (on) => { DB.RM = on; root.classList.toggle('rm', on); };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  DB.esc = esc;
  DB.or = (text, opt = {}) => {
    let h = esc(text).replace(/OR/g, '<span class="or" data-breath>OR</span>');
    if (opt.and) h = h.replace(/AND/g, '<span class="and">AND</span>');
    return h;
  };
  DB.words = (text) => String(text).replace(/^[A-Z ]+:\s*/, '').split(/\s+/).filter(Boolean).length;

  // stepped sequence: frames = [{ms, fn}] ; ms rounded up to the 125 ms grid, and at least HOLD unless flagged
  DB.step = (frames, done) => {
    let i = 0, t = null;
    const run = () => {
      if (i >= frames.length) { done && done(); return; }
      const f = frames[i++];
      f.fn && f.fn();
      const ms = Math.max(f.flash ? DB.FLASH : DB.HOLD, Math.ceil((f.ms || DB.HOLD) / DB.TICK) * DB.TICK);
      t = setTimeout(run, ms);
    };
    run();
    return () => clearTimeout(t);
  };
  DB.wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- boards ----------
  function fit() {
    const solo = document.body.classList.contains('solo');
    document.querySelectorAll('.board').forEach((bd) => {
      const wrap = bd.parentElement;
      if (solo) {
        const k = Math.min(innerWidth / 1920, innerHeight / 1080);
        bd.style.transform = `translate(-50%,-50%) scale(${k})`;
      } else {
        const k = Math.min(1, wrap.clientWidth / 1920);
        bd.style.transform = `scale(${k})`;
        wrap.style.height = `${1080 * k}px`;
      }
    });
  }
  DB.fit = fit;

  function hydrate(scope = document) {
    // art placeholders: <div data-art="nanda" data-face="wide"></div>
    scope.querySelectorAll('[data-art]').forEach((el) => {
      const fn = window.ART && window.ART[el.dataset.art];
      if (!fn) return;
      el.innerHTML = fn({ ...el.dataset });
    });
    // OR rule on any text node container marked data-or
    scope.querySelectorAll('[data-or]').forEach((el) => { el.innerHTML = DB.or(el.textContent, { and: 'and' in el.dataset }); });
    // word-budget check: flags anything over 12 words (never ships)
    scope.querySelectorAll('.line').forEach((el) => {
      const n = DB.words(el.textContent);
      if (n > 12) { el.classList.add('over-budget'); console.warn('over 12 words:', el.textContent); }
    });
  }
  DB.hydrate = hydrate;

  document.addEventListener('DOMContentLoaded', () => {
    const boards = [...document.querySelectorAll('.board')];
    boards.forEach((bd, i) => {
      if (!bd.parentElement.classList.contains('bwrap')) {
        const w = document.createElement('div');
        w.className = 'bwrap';
        bd.replaceWith(w);
        w.appendChild(bd);
      }
      bd.dataset.n = i + 1;
    });
    const b = Q.get('b');
    if (b) {
      document.body.classList.add('solo');
      boards.forEach((bd, i) => { bd.parentElement.hidden = String(i + 1) !== b; });
    }
    hydrate();
    fit();
    addEventListener('resize', fit);
    document.dispatchEvent(new Event('db:ready'));
  });
})();
