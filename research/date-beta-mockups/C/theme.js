/* C — Circuit material layer: copper traces + vias along the board edges, mounting holes, status LEDs, silkscreen ID.
   Dread 1 = overheated (scorch rings, amber LEDs). Dread 2 = shorted: extra traces reroute from every edge toward U1 (her pin). */
(function () {
  const via = (x, y, r = 9) => `<circle class="via" cx="${x}" cy="${y}" r="${r}"/>`;
  const tr = (d, w = '') => `<path class="tr ${w}" d="${d}"/>`;
  // edge bundles: stay inside the 72 px side margins so no trace ever crosses a face or a text slot
  const edges = () => [
    tr('M0,250 H22 L40,268 V520 L22,538 H0'), tr('M0,290 H6 V500'), tr('M58,600 V760 L40,778 V820'), via(58, 600), via(40, 820),
    tr('M1920,130 H1898 L1880,148 V300 L1898,318 H1920'), tr('M1862,340 V440'), via(1862, 340), via(1862, 440),
    tr('M0,960 H30 L60,990 H200', 'w'), via(200, 990, 12),
  ].join('');
  const holes = () => `<circle class="hole" cx="44" cy="1036" r="18"/><circle class="hole" cx="1876" cy="1036" r="18"/>`;
  const leds = (d) => {
    const c = [['g', 'o', 'o'], ['g', 'a', 'a'], ['r', 'r', 'r']][d];
    return ['PWR', 'HER', 'ACT'].map((n, i) => `<rect class="led ${c[i]}" x="16" y="${120 + i * 34}" width="20" height="20"/><text x="44" y="${138 + i * 34}" style="font-size:16px">${n}</text>`).join('');
  };
  const id = (d) => `<text transform="translate(1906 900) rotate(-90)" style="font-size:18px">FIGUR DATE-β · REV 0.${3 + d} · U1 = NANDA</text>`;
  const scorch = () => `<defs><radialGradient id="scorch"><stop offset="0" stop-color="#1a0d03" stop-opacity=".85"/><stop offset=".6" stop-color="#6a3a10" stop-opacity=".35"/><stop offset="1" stop-color="#6a3a10" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="scorch" cx="40" cy="520" rx="70" ry="50"/><ellipse class="scorch" cx="1880" cy="300" rx="80" ry="56"/><ellipse class="scorch" cx="200" cy="990" rx="60" ry="40"/>`;
  // shorted: every edge trace bends toward U1 and stops in a ring of vias around her
  const reroute = (cx, cy) => {
    const R = 330, ends = [[-1, -0.35], [-1, 0.25], [1, -0.3], [1, 0.3], [-0.45, -1], [0.5, -1]];
    return ends.map(([dx, dy]) => {
      const n = Math.hypot(dx, dy), ex = cx + (dx / n) * R, ey = cy + (dy / n) * R;
      const sx = dx < 0 ? 0 : dx > 0.9 ? 1920 : ex, sy = Math.abs(dx) > 0.9 ? ey : 0;
      const mx = Math.abs(dx) > 0.9 ? (sx + ex) / 2 : ex, my = Math.abs(dx) > 0.9 ? sy : (sy + ey) / 2;
      return tr(`M${sx},${sy} L${mx},${my} L${ex},${ey}`) + via(ex, ey, 10);
    }).join('');
  };
  const U1 = { hud: [949, 358], pin: [1569, 358] };

  window.THEME = {
    id: 'C', name: 'Circuit',
    overlay(kind, dread) {
      const d = +dread;
      if (kind === 'fx') return `<div class="pcb"><svg viewBox="0 0 1920 1080">${id(d)}</svg></div>`;
      if (['faces', 'sils', 'details', 'sheet', 'ladder', 'flow'].includes(kind)) return `<div class="pcb"><svg viewBox="0 0 1920 1080">${holes()}${id(d)}</svg></div>`;
      const u = U1[kind] || (kind === 'mini' ? U1.hud : null);
      return `<div class="pcb"><svg viewBox="0 0 1920 1080">${d >= 1 ? scorch() : ''}${edges()}${d === 2 && u ? reroute(u[0], u[1]) : ''}${holes()}${leds(d)}${id(d)}</svg></div>`;
    },
    dreadNotes: [
      '<b>clean board</b> · green mask, copper traces, white silkscreen. The box is a chip; her LED is the only pink part.',
      '<b>overheated</b> · copper browns, the chip glows amber, scorch rings bloom, "OUT_LEAVE ?" gets a question mark.',
      '<b>shorted</b> · every trace reroutes to U1, solder bridges the pins, purple reads NC ✕. Text stays on black epoxy.',
    ],
    extra: {
      hud: (d) => [
        '<div class="refdes" style="left:1216px;top:470px">U1<br><small>NANDA-01 · 3V3 ♥</small></div>',
        '<div class="refdes hot" style="left:1216px;top:470px">U1<br><small>NANDA-01 · 71 °C</small></div>',
        '<div class="refdes short" style="left:1216px;top:470px">U1 ⚠ SHORT</div>',
      ][+d] || '',
    },
  };
})();
