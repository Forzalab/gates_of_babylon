// Nanda's injury fades in steps (no animation), one step per scene, merged into whatever face layers the beat has:
// v2-train from beat 5 (index 4) = full black eye, v2-rain = 75%, v2-street = 50%, v2-home = the plaster + a faint ~20% bruise.
const STEPS = ['black-eye', 'black-eye-75', 'black-eye-50', 'plaster', 'plaster-20'];
// After v2-home the plaster stays on through the tea and the escape (WT03), but only on a run that came through v2-home
// (path = pos.path, the scenes entered this run): cup is also reached from genkan-talk, where she was never hurt.
const AFTER_HOME = ['cup', 'steeped', 'unknown', 'escape', 'escape-win', 'escape-timeout'];
export function injuryLayer(scene, beat, path = []) {
  if (scene === 'v2-train') return beat >= 4 ? 'black-eye' : null;
  if (scene === 'v2-rain') return 'black-eye-75';
  if (scene === 'v2-street') return 'black-eye-50';
  if (scene === 'v2-home') return 'plaster-20';
  if (AFTER_HOME.includes(scene) && path?.includes('v2-home')) return 'plaster-20';
  return null;
}
export function withInjury(layers, scene, beat, path = []) {
  const inj = injuryLayer(scene, beat, path);
  if (!inj) return layers ?? null;
  const l = (layers ?? []).filter((x) => !STEPS.includes(x));
  return [...l, inj];
}
