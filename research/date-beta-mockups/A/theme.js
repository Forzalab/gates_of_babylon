/* A — Kawaii Pop material layer: stickers + candy scallops that rot as dread rises. */
window.THEME = {
  id: 'A', name: 'Kawaii Pop',
  overlay(kind, dread) {
    const d = +dread;
    const band = `<div class="scallop top d${d}"></div><div class="scallop bot d${d}"></div>`;
    if (kind === 'mini' || kind === 'fx' || kind === 'sheet' || kind === 'faces' || kind === 'sils' || kind === 'details') return kind === 'mini' ? '' : band;
    const stick = [['♡', 1500, 110, -12], ['✦', 70, 400, 8], ['♡', 1760, 480, 14]];
    const eyes = [['◉', 1500, 110, 0], ['◉', 70, 400, 0], ['◉', 1760, 480, 0]];
    const set = d === 2 ? eyes : stick;
    return band + set.map(([g, x, y, r], i) => `<span class="sticker s${d}" style="left:${x}px;top:${y}px;transform:rotate(${r + (d === 1 ? 20 : 0)}deg)">${g}</span>`).join('');
  },
  extra: {
    hud: (d) => d >= 1 ? '' : '<div class="abs sticker" style="left:1340px;top:200px;font-size:40px">NEW! ♡ date</div>',
  },
};
window.THEME.dreadNotes = [
  '<b>candy</b> · pastel panels, fat plum ink, sticker shadows, ♡ confetti. Reads as a harmless dating sim.',
  '<b>sugar-rot</b> · ink darkens to wine, stitches show inside the box, the ♡ tilts off its peg, scallops sour.',
  '<b>wrong</b> · the candy is meat-pink on black, the ink is her red, ♡ → ◉ eyes, the icing drips off the box. Text stays ≥7:1.',
];
