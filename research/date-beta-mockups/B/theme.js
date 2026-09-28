/* B — Analog/VHS material layer: scanlines, grain, CRT glass, OSD. Dread = tape wear. */
window.THEME = {
  id: 'B', name: 'Analog VHS',
  overlay(kind, dread) {
    const d = +dread;
    const tc = d === 0 ? '00:11:58:17' : '00:12:00:00';
    const osdPlay = d === 2 ? '◀◀ REW' : d === 1 ? 'PLAY ▶  TRACKING' : 'PLAY ▶';
    const base = '<div class="vhs scan"></div><div class="vhs grain"></div><div class="vhs vig"></div>';
    const wear = (d >= 1 ? '<div class="vhs track" style="top:612px"></div>' : '') + (d === 2 ? '<div class="vhs drop"></div><div class="vhs redmono"></div><div class="vhs track" style="top:188px;height:40px"></div>' : '');
    if (kind === 'mini') return base + wear;
    if (['faces', 'sils', 'details', 'sheet', 'fx', 'ladder'].includes(kind)) return '<div class="vhs scan" style="opacity:.5"></div><div class="vhs grain"></div>';
    const osd = `<div class="vosd play">${osdPlay}</div><div class="vosd tc">${tc}</div><div class="vosd date">SEP 28 2026</div>`;
    return base + wear + osd;
  },
  dreadNotes: [
    '<b>clean tape</b> · warm sepia picture, fine scanlines, PLAY ▶, the timecode runs. Only she is in colour.',
    '<b>worn</b> · a tracking band rolls into frame, chroma bleeds, the timecode sticks at 12:00:00:00.',
    '<b>chewed</b> · dropouts, the picture goes red-mono, OSD reads ◀◀ REW. The subtitle band stays pure black: text never degrades.',
  ],
  extra: {
    hud: (d) => '',
  },
};
