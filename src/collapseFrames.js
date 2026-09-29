// collapseFrames.js: pure timeline + pile data for the Figur collapse (collapse.js). No DOM, no imports (node --test).
export const FRAME_MS = 500;
export const FLOOR_MS = 334; // WCAG 2.3.1: <= 3 flashes per second
export const FRAMES = [
  { id: 'f1', name: 'tilt', cue: 'collapse-tilt' },
  { id: 'f2', name: 'slip', cue: 'collapse-slip' },
  { id: 'f3', name: 'fall', cue: 'collapse-fall' },
  { id: 'f4', name: 'glitch', cue: 'collapse-glitch' },
  { id: 'f5', name: 'void', cue: 'collapse-void' },
];
export const VOID_MS = 1000; // f5 + silence before the cut
export const GLITCH_TILES = [0, 5, 14];

// Steps: { at (ms), frame, cue } per frame, then { at, go: true } = the cut into Date.
export function timeline() {
  const steps = FRAMES.map((f, i) => ({ at: i * FRAME_MS, frame: f.id, cue: f.cue }));
  steps.push({ at: steps.at(-1).at + VOID_MS, go: true });
  return steps;
}

// House-of-cards pile: tile index (row-major 4x4) -> end pose in tile units from the bottom-left. Authored, not random.
// [x (tiles from the left), lift (tiles up from the bottom edge), rotate deg]
export const PILE = {
  12: [-0.2, 0.85, -6], 13: [0.55, 0.8, 4], 14: [1.35, 0.9, -3], 15: [2.1, 0.82, 7], 8: [2.85, 0.88, -5], 9: [3.35, 0.8, 3],
  10: [0.2, 1.45, 12], 11: [1.0, 1.5, -9], 4: [1.7, 1.42, 15], 5: [2.5, 1.48, -11], 6: [3.1, 1.4, 8],
  7: [0.75, 2.05, -18], 0: [1.55, 2.1, 20], 1: [2.35, 2.0, -14],
  2: [1.3, 2.75, 62], 3: [1.9, 2.75, -62], // the two cards leaning on each other at the top
};
export const PILE_F4 = { 3: [2.6, 2.25, -8] }; // f4: one card of the top pair gives way
