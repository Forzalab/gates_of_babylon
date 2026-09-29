/* HA — art patches (fork of H/h-art.js: no dimension text, no pin labels, traces enter from the TOP only).
   H — art patches on top of shared/art.js (loaded after it; shared art stays untouched for A/B/C).
   New: shoes that read as shoes (top-down pairs: Mary Janes, loafers, sneakers), guest slippers, a kamidana shrine,
   the genkan scene rebuilt around ONE prop system, and the horror throughline:
     THE RIBBON UNRAVELS INTO TRACES.
     dread 0 = a tied pink bow · dread 1 = the bow loosens, stitched thread creeps in from the frame edge
     dread 2 = the thread is pulled taut into her-red traces that plug into her (vias = knots). */
(function () {
  'use strict';
  const A = window.ART;

  // ---------------- shoes (top-down, toe = -y, heel = +y; one shoe, left foot) ----------------
  const SOLE = 'M0,-104 C26,-104 40,-86 40,-56 C40,-20 34,20 32,50 C30,86 18,100 0,100 C-18,100 -32,86 -34,50 C-36,20 -42,-20 -40,-56 C-40,-86 -26,-104 0,-104 Z';
  const UPPER = 'M0,-95 C21,-95 32,-80 32,-54 C32,-20 27,18 25,46 C23,76 13,88 0,88 C-13,88 -25,76 -27,46 C-29,18 -34,-20 -32,-54 C-32,-80 -21,-95 0,-95 Z';
  function shoe1(kind) {
    if (kind === 'sneaker') return `
      <path class="h-sole" d="${SOLE}"/>
      <path class="h-snk" d="${UPPER}"/>
      <path class="h-lining" d="M0,-6 C15,-6 19,10 19,32 C19,60 12,74 0,74 C-12,74 -19,60 -19,32 C-19,10 -15,-6 0,-6 Z"/>
      <path class="h-lace ln" d="M-16,-58 L16,-46 M16,-58 L-16,-46 M-16,-40 L16,-28 M16,-40 L-16,-28 M-16,-22 L16,-10 M16,-22 L-16,-10"/>
      <path class="h-toecap ln" d="M-24,-78 C-10,-90 10,-90 24,-78"/>`;
    const opening = kind === 'loafer'
      ? 'M0,-40 C19,-40 24,-18 24,16 C24,54 15,74 0,74 C-15,74 -24,54 -24,16 C-24,-18 -19,-40 0,-40 Z'
      : 'M0,-26 C18,-26 22,-6 22,22 C22,56 14,74 0,74 C-14,74 -22,56 -22,22 C-22,-6 -18,-26 0,-26 Z';
    let s = `<path class="h-sole" d="${SOLE}"/><path class="h-leather" d="${UPPER}"/><path class="h-lining" d="${opening}"/>
      <path class="h-shine ln" d="M-16,-80 C-8,-88 6,-88 14,-82"/>`;
    if (kind === 'maryjane') s += `<path class="h-strap" d="M-34,-44 C-12,-52 12,-52 34,-44 L34,-32 C12,-40 -12,-40 -34,-32 Z"/><circle class="h-button" cx="25" cy="-39" r="6"/>`;
    if (kind === 'loafer') s += `<path class="h-strap" d="M-30,-58 C-10,-64 10,-64 30,-58 L30,-46 C10,-52 -10,-52 -30,-46 Z"/><path class="h-slot" d="M-10,-56 L10,-56 L10,-50 L-10,-50 Z"/>`;
    return s;
  }
  // a pair lined up heel-to-tape; perspective = squash in y. Right shoe is the mirror.
  function pair(kind, x, y, s = 1, dashed = false) {
    const one = dashed
      ? `<path class="h-ghost" d="${SOLE}"/>`
      : shoe1(kind);
    return `<g class="shoepair sp-${kind || 'ghost'}" transform="translate(${x} ${y}) scale(${s} ${s * 0.62})">
      <g transform="translate(-50 0)">${one}</g><g transform="translate(50 0) scale(-1 1)">${one}</g></g>`;
  }
  // guest slippers: top-down, toes toward camera (+y), a cover band over the toe half, an embroidered heart
  function slippers(x, y, s = 1) {
    const one = `<path class="h-slipsole" d="M0,-116 C32,-116 46,-94 46,-60 L46,64 C46,104 28,122 0,122 C-28,122 -46,104 -46,64 L-46,-60 C-46,-94 -32,-116 0,-116 Z"/>
      <path class="h-slipband" d="M-50,6 C-50,-22 50,-22 50,6 L50,66 C50,108 30,126 0,126 C-30,126 -50,108 -50,66 Z"/>
      <path class="h-slipedge ln" d="M-50,6 C-50,-22 50,-22 50,6"/>
      <path class="h-heart" d="M0,78 C-20,62 -22,44 -10,40 C-4,38 0,44 0,48 C0,44 4,38 10,40 C22,44 20,62 0,78 Z"/>`;
    return `<g class="slippers" transform="translate(${x} ${y}) scale(${s} ${s * 0.6})">
      <g transform="translate(-58 0)">${one}</g><g transform="translate(58 0) scale(-1 1)">${one}</g></g>`;
  }

  // ---------------- the shrine (kamidana) : ONE labelled circuit, A / B / OUT legible at distance ----------------
  function shrine(x, y) {
    const shide = (sx) => `<path class="h-shide" d="M${sx},18 l18,0 l-8,22 l18,0 l-8,22 l18,0 l-8,24 l-22,0 l8,-22 l-18,0 l8,-22 l-18,0 Z"/>`;
    return `<g class="shrine" transform="translate(${x} ${y})">
      <path class="h-rope" d="M-30,10 C80,40 280,40 390,10 L390,26 C280,58 80,58 -30,26 Z"/>
      <path class="h-ropetw ln" d="M20,22 l10,14 M70,30 l10,14 M120,34 l10,14 M170,36 l10,14 M220,34 l10,14 M270,30 l10,14 M320,22 l10,14"/>
      ${shide(60)}${shide(270)}
      <path class="k-wood2" d="M-10,120 L180,70 L370,120 Z"/>
      <rect class="k-wood" x="10" y="120" width="340" height="250"/>
      <rect class="h-cfr" x="36" y="140" width="288" height="170" rx="6"/>
      <rect class="h-cpaper" x="48" y="152" width="264" height="146"/>
      <g class="h-schem">
        <path class="ln" d="M80,196 L130,196 M80,254 L130,254 M130,170 L170,170 A55,55 0 0 1 170,280 L130,280 Z M236,225 L284,225"/>
        <circle class="ln" cx="232" cy="225" r="7"/>
      </g>
      <rect class="k-wood2" x="-4" y="370" width="368" height="20"/>
      ${A.cup(70, 336, 0.42)}${A.cup(290, 336, 0.42)}${A.plum(180, 350, 0.9)}
      <rect class="k-candle" x="172" y="306" width="16" height="30"/><path class="k-flame" d="M180,288 C190,298 187,306 180,306 C173,306 170,298 180,288 Z"/>
    </g>`;
  }

  // ---------------- GENKAN (hallway view toward the locked front door) ----------------
  function sceneGenkan() {
    let s = `<svg class="art scene genkan h" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      <rect class="k-wall" x="0" y="0" width="1920" height="600"/>
      <rect class="k-wall2" x="0" y="560" width="1920" height="40"/>
      <!-- the front door, locked -->
      <rect class="k-frame" x="120" y="70" width="380" height="530"/>
      <rect class="k-metal" x="146" y="96" width="328" height="504"/>
      <circle class="k-glass" cx="310" cy="190" r="12"/>
      <rect class="k-frame" x="420" y="330" width="34" height="80" rx="10"/>
      <g class="h-lock"><circle cx="437" cy="300" r="22"/><path class="ln" d="M419,300 L455,300"/></g>
      <!-- doma: stone tile, a pink tape line + ruler -->
      <rect class="k-tile" x="0" y="600" width="1920" height="230"/>
      <path class="k-floor2 ln thin" d="M0,690 L1920,690 M0,770 L1920,770 M300,600 L240,830 M700,600 L680,830 M1100,600 L1120,830 M1500,600 L1560,830"/>
      <rect class="h-tape" x="330" y="802" width="1320" height="16"/>`;
    for (let x = 340; x <= 1640; x += 20) s += `<path class="h-tick ln" d="M${x},802 L${x},${x % 100 === 40 ? 788 : 795}"/>`;
    // pairs: heels on the tape, identical 300 mm gaps, the 4th slot is a dashed outline = yours
    const P = [['maryjane', 500], ['loafer', 800], ['sneaker', 1100]];
    P.forEach(([k, x]) => { s += pair(k, x, 740, 1.05); });
    s += pair('', 1400, 740, 1.05, true);
    // the step edge (agari-kamachi) + hallway floor, the slippers turned toward you
    s += `<rect class="k-wood2" x="0" y="830" width="1920" height="44"/>
      <rect class="k-wood" x="0" y="874" width="1920" height="206"/>
      <path class="k-wood2 ln thin" d="M0,940 L1920,940 M0,1010 L1920,1010"/>
      ${slippers(960, 960, 1.05)}
      ${shrine(1530, 150)}
    </svg>`;
    return s;
  }

  // ---------------- the throughline layer ----------------
  // dread 1: loose stitched threads creep in from the frame edges (never reach her)
  function threads(opt = {}) {
    const P = opt.paths || ['M260,0 C270,90 230,160 250,240', 'M620,0 C610,70 650,120 640,180', 'M1320,0 C1330,80 1290,140 1300,200', 'M1680,0 C1670,90 1710,170 1690,260'];
    return `<svg class="h-layer threads" viewBox="0 0 1920 1080">${P.map((d) => `<path class="h-thread" d="${d}"/>`).join('')}</svg>`;
  }
  // dread 2: the thread is pulled taut into her-red traces (45° routing) that end in knots/vias around her
  function short(cx, cy, opt = {}) {
    const R = opt.r || 250;
    // knot directions around her head (never below it: nothing crosses her face); every trace drops in from the ceiling
    const ends = opt.ends || [[-1, -0.35], [-0.55, -1], [0, -1], [0.55, -1], [1, -0.35]];
    const out = ends.map(([dx, dy], i) => {
      const n = Math.hypot(dx, dy), ex = Math.round(cx + (dx / n) * R), ey = Math.round(cy + (dy / n) * R);
      const off = Math.round(dx * 110); // fan out, then one 45° dogleg into the knot
      const sx = ex + off, by = ey - Math.abs(off);
      const d = off ? `M${sx},0 L${sx},${by} L${ex},${ey}` : `M${ex},0 L${ex},${ey}`;
      return `<path class="h-trace-o" d="${d}"/><path class="h-trace" d="${d}"/><circle class="h-knot" cx="${ex}" cy="${ey}" r="13"/>`;
    }).join('');
    return `<svg class="h-layer short" viewBox="0 0 1920 1080">${out}</svg>`;
  }
  // rewind (HA): the traces reroute BACKWARD - they unplug from her and climb back up to the ceiling, frame by frame (0 = in her, 3 = gone)
  function reroute(cx, cy, step, opt = {}) {
    const R = opt.r || 120, k = [1, 0.6, 0.25, 0][step];
    if (!k) return '';
    const ends = [[-1, -0.35], [0, -1], [1, -0.35]];
    return ends.map(([dx, dy]) => {
      const n = Math.hypot(dx, dy), ex = Math.round(cx + (dx / n) * R), ey = Math.round(cy + (dy / n) * R);
      const off = Math.round(dx * 60), sx = ex + off, by = ey - Math.abs(off);
      const tipY = Math.round(by * k); // the trace retracts up its own path
      const d = step === 0 ? (off ? `M${sx},0 L${sx},${by} L${ex},${ey}` : `M${ex},0 L${ex},${ey}`) : `M${sx},0 L${sx},${tipY}`;
      const knot = step === 0 ? `<circle class="h-knot" cx="${ex}" cy="${ey}" r="9"/>` : `<circle class="h-knot" cx="${sx}" cy="${tipY}" r="7"/>`;
      return `<path class="h-trace-o" d="${d}"/><path class="h-trace" d="${d}"/>${knot}`;
    }).join('');
  }
  // the bow on the chip: tied (0) · loosened + stitched tails (1) · unravelled into traces (2)
  function bow(d = 0) {
    const loops = '<path class="h-bow" d="M40,34 C18,8 0,14 2,34 C0,54 18,60 40,34 Z M40,34 C62,8 80,14 78,34 C80,54 62,60 40,34 Z"/><circle class="h-bow" cx="40" cy="34" r="8"/>';
    if (d === 0) return `<svg class="h-bowsvg" viewBox="0 0 80 110">${loops}<path class="h-bow" d="M36,40 L26,72 L36,66 Z M44,40 L54,72 L44,66 Z"/></svg>`;
    if (d === 1) return `<svg class="h-bowsvg" viewBox="0 0 80 110" style="transform:rotate(14deg)">${loops}<path class="h-thread" d="M36,40 C26,64 34,80 20,104 M44,40 C58,60 50,84 64,106"/></svg>`;
    return `<svg class="h-bowsvg" viewBox="0 0 80 110">${loops.replace(/h-bow/g, 'h-bow2')}<path class="h-trace-o" d="M36,40 L36,70 L16,90 L16,110 M44,40 L44,70 L64,90 L64,110"/><path class="h-trace" d="M36,40 L36,70 L16,90 L16,110 M44,40 L44,70 L64,90 L64,110"/></svg>`;
  }

  Object.assign(A, { shoePair: pair, slippers, shrine, sceneGenkan, threads, short, reroute, bow });
})();
