// Nanda's injury fades in steps (no animation), one step per scene, merged into whatever face layers the beat has:
// v2-train from beat 5 (index 4) = full black eye, v2-rain = 75%, v2-street = 50%, v2-home = the plaster + a faint ~20% bruise.
// M2: the leave scenes after v2-home "Say goodnight" (flag left = home) keep the plaster; left from the rooftop = no injury yet.
const LEAVE = ['leave', 'leave-fu', 'leave-yeah'];
const STEPS = ['black-eye', 'black-eye-75', 'black-eye-50', 'plaster', 'plaster-20'];
export function injuryLayer(scene, beat, flags = {}) {
  if (scene === 'v2-train') return beat >= 4 ? 'black-eye' : null;
  if (scene === 'v2-rain') return 'black-eye-75';
  if (scene === 'v2-street') return 'black-eye-50';
  if (scene === 'v2-home') return 'plaster-20';
  if (LEAVE.includes(scene)) return flags?.left === 'home' ? 'plaster-20' : null;
  return null;
}
export function withInjury(layers, scene, beat, flags = {}) {
  const inj = injuryLayer(scene, beat, flags);
  if (!inj) return layers ?? null;
  const l = (layers ?? []).filter((x) => !STEPS.includes(x));
  return [...l, inj];
}
