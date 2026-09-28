// contrast.mjs — WCAG 2.x contrast ratios for every HA text/fill pair (node HA/contrast.mjs). Target: >= 7:1 for body/choice text (projector), >= 4.5:1 floor.
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
export const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const PAIRS = [
  // [role, text, fill, min]
  ['PINKBLACK: choice / name tag, #000 bold on pink #FF5FA2', '#000000', '#FF5FA2', 7],
  ['#111 on pink #FF5FA2 (rejected: under 7)', '#111111', '#FF5FA2', 4.5],
  ['R2 legacy: #2A0615 on #FF5FA2', '#2A0615', '#FF5FA2', 4.5],
  ['purple choice: white on purple-deep #5B37C4', '#FFFFFF', '#5B37C4', 7],
  ['white on #6A45D6 (spec R2 proposal)', '#FFFFFF', '#6A45D6', 4.5],
  ['R2 legacy: white on #8A5CF6', '#FFFFFF', '#8A5CF6', 4.5],
  ['her-red name tag (dread 2): white on her-deep', '#FFFFFF', '#B0102C', 7],
  ['R2 legacy: white on #F0243F', '#FFFFFF', '#F0243F', 4.5],
  ['dialogue: plum on chip (dread 0/1)', '#3A1D3F', '#FFF8FB', 7],
  ['dialogue: ink on meat-chip (dread 2)', '#2A0714', '#FFD6E6', 7],
  ['name tag "You": navy on sky', '#10233D', '#BFE3FF', 7],
  ['crowd chant on chip', '#3A1D3F', '#FFF8FB', 7],
  ['caption: white on black band', '#FFFFFF', '#000000', 7],
  ['meta slot: plum on plate', '#3A1D3F', '#FFFAFD', 7],
  ['meta slot on: plate on plum', '#FFFAFD', '#3A1D3F', 7],
  ['replay: struck grey text on stripe (dark stripe)', '#3A3346', '#D6CFE2', 7],
  ['timer secs: plum on plate', '#3A1D3F', '#FFFAFD', 7],
  ['timer secs dread 2: white on near-black', '#FFFFFF', '#1A0610', 7],
  ['phone: white on XOR bubble (purple-deep)', '#FFFFFF', '#5B37C4', 7],
  ['phone: #000 on Nanda bubble (pink)', '#000000', '#FF5FA2', 7],
  ['datasheet: #111 on paper', '#111111', '#F6F1E6', 7],
      ['invalid-pin title: white on her-deep', '#FFFFFF', '#B0102C', 7],
  ['R2b refs: box ink plum-wine on light pink box', '#4A1238', '#FFF0F6', 7],
  ['R2b refs: box ink dread 2 on meat box', '#2A0714', '#FFD6E6', 7],
  ['R2b refs: name tab, white on magenta', '#FFFFFF', '#A3135A', 7],
  ['OR rule C (PROD): OR on scrim', '#FF6B7D', '#1A0710', 7],
  ['OR rule C (PROD): line text on scrim', '#FFE9F1', '#1A0710', 7],
  ['OR rule C: scrim panel vs light pink box (non-text)', '#1A0710', '#FFF0F6', 3],
  ['OR rule C: scrim vs pink choice border (non-text)', '#1A0710', '#FF5FA2', 3],
  ['OR record A: cream on badge #8E0F1E', '#FFF6E8', '#8E0F1E', 7],
  ['OR record B: crimson on box', '#8A0F22', '#FFF0F6', 7],
  ['OR record B: crimson on pink (fails)', '#8A0F22', '#FF5FA2', 3],
  ['OR record D: her-deep on box', '#B0102C', '#FFF0F6', 4.5],
  ['R2 OR legacy: #F0243F on pink choice (the hideous one)', '#F0243F', '#FF5FA2', 1],
  ['AND badge: #000 on pink', '#000000', '#FF5FA2', 7],
  ['date HUD d2: white on scrim', '#FFFFFF', '#1A0710', 7],
  ['skip pill: white text inside plum 7px stroke (stroke vs fill)', '#FFFFFF', '#3A1D3F', 7],
];
if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0;
  console.log('| pair | text | fill | ratio | min | ok |\n|---|---|---|---|---|---|');
  for (const [n, t, f, min] of PAIRS) { const r = ratio(t, f); const ok = r >= min; if (!ok && !/legacy|fails|rejected/.test(n)) bad++; console.log(`| ${n} | ${t} | ${f} | ${r.toFixed(2)}:1 | ${min} | ${ok ? 'yes' : 'NO'} |`); }
  process.exitCode = bad ? 1 : 0;
}
