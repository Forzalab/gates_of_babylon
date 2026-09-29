// Font trials (research only; default fonts unchanged). ?font=<name> sets <html data-font> and lazy-loads that
// trial's CSS, which re-points the font tokens (--font* in logic mode, --cond/--btn in date-beta) and the display face.
// Unknown or missing ?font= loads nothing. See research/font-trials/NOTES.md.
const TRIALS = {
  inter: () => import('./font-trials/inter.css'),
  rounded: () => import('./font-trials/rounded.css'),
  barlow: () => import('./font-trials/barlow.css'),
  grotesk: () => import('./font-trials/grotesk.css'),
};
const name = typeof location !== 'undefined' && new URLSearchParams(location.search).get('font');
if (name && Object.hasOwn(TRIALS, name)) {
  document.documentElement.dataset.font = name;
  TRIALS[name]();
}
