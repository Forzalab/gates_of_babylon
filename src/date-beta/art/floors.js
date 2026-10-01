// floors.js: where Nanda stands. One entry per bg id (or per insert-card shot id, art/shots, which wins over the bg):
// y = the stage y (1920x1080 px) of the ground / platform / floor at her column (x ~960), measured on each bg with
// research/sprint-0930/float-audit/audit.mjs (REPORT.md there). The renderer (main.jsx -> Nanda.jsx .floored + .db-plant)
// puts her shoes on that line with a contact shadow under them, so every new beat on a bg inherits it; an explicit
// props.cut.plant on a beat still wins. y past the box top (>= 840) = the ground is hidden behind the dialogue box: her
// feet tuck behind it (the box crops them, SHADOWS.md). crop: true = she is only ever shown cropped on this bg (the box /
// frame hides her feet); no floor is applied, the audit flags it if her feet ever show.
export const UNDER_BOX = 840;
export const FLOORS = {
  // measured ground lines (feet visible)
  // R7 legs: the rain walk. Overcast, the key = the brightening sky gap up-right, behind her (x 1086-1640): a soft,
  // short cast shadow falling toward the camera and to the left (dx: the plant is centred on x 960, her soles on ~x 917; -96 = ~50 px to the left of them), a cool sky rim on her right-hand edges, grade to the grey-green.
  'rain-ending': { y: 700, wet: true, step: 'walk',
    light: { side: 1, wet: true, rim: '#e6eef0', dx: -96, dy: 8, rot: -8, len: 1.25, ink: '14, 22, 24', a: 0.62, grade: 'saturate(.84) brightness(.97)' } },      // the wet road at her x, a step up the road so her soles + reflection clear the box rivets (R7 legs)
  'her-building': { y: 790, wet: true },     // the dark street in front of door 12 (v2-street 5)
  'shop-way-out': { y: 760 },     // the pavement outside the shop doors
  'train-sun': { y: 690 },        // the carriage floor (v2-train 6, matched to the Tony-approved plant 90)
  'platform-rain': { y: 698, wet: true },    // the platform edge (v2-train 8, plant 100)
  // R7 legs: the station feet (v2-train 3 bumped, 4 "Hey, you"): planted beats (cut.plant 90 wins for the y) still take
  // the pose + light. Key = the sun shafts from the upper right through the roof (Crowd.jsx): a cool rim on her right,
  // the cast shadow to the left in the platform's blue-grey ink. Pose: bumped = a braced, widened stance (Inoue).
  'station-ads': { y: 690, step: 'brace',
    light: { side: 1, rim: '#e4eef6', bounce: '#a9bccb', dx: -78, dy: 4, rot: -4, len: 1.4, ink: '16, 24, 34', a: 0.55, grade: 'saturate(.9) brightness(.98)' } },
  // ground hidden behind the box at her column: feet tuck behind it
  // R7 legs: the street walking ("We walk out to the street", v2-curry 13 / katsu 11 / alone 3). Was UNDER_BOX: the box
  // rivets sliced her shoes in half. Now she stands up the street (y 790, clear of the one-line box at ~810) in the walk
  // pose. Light: the afternoon sun from the left (the poles are lit on their left faces): a warm rim on her left edges,
  // a longer cast shadow to the right, warm-brown shadow ink.
  'curry-street': { y: 790, step: 'walk',
    light: { side: -1, rim: '#ffe6c0', bounce: '#e8a878', dx: -6, dy: 7, rot: 5, len: 2.0, ink: '58, 34, 30', a: 0.62, grade: 'saturate(.95) sepia(.06)' } },
  'town-board': { y: UNDER_BOX },
  // insert-card shots (a card over the bg): no ground in the card, feet tuck behind the box
  'feet-park': { y: UNDER_BOX },
  'hands-lock': { y: UNDER_BOX },
  'tea-pour': { y: UNDER_BOX },
  // her feet are always behind the box / frame on these (audit: cropped on every beat)
  'rooftop-noon': { crop: true },
  'shop-vending': { crop: true },
  'shop-doors': { crop: true },
  'shop-list': { crop: true },
  'shop-snacks': { crop: true },
  'shop-checkout': { crop: true },
  'shop-register': { crop: true },
  'shop-self-checkout': { crop: true },
  'shop-self-close': { crop: true },
  'curry-choice': { crop: true },
  'curry-butter-table': { crop: true },
  'curry-katsu-counter': { crop: true },
  'curry-katsu-int': { crop: true },
  'station-gate-r3': { crop: true },
  'vending-insert': { crop: true },
  'station-ads-insert': { crop: true },
  'rain-sidewalk': { crop: true },
  'rain-alley': { crop: true },
  'rain-puddle': { crop: true }, // v2-rain 2: a top-down close-up insert (only her reflection + real shoes), no feet-floor check
  'rain-eave': { crop: true },
  'street-bluehour': { crop: true },
  'street-dusk': { crop: true },
  'street-day': { crop: true },
  'BG-D1': { crop: true },
  'BG-D2': { crop: true },
  'BG-D3': { crop: true },
  'sitting-room': { crop: true },
  'bedroom': { crop: true },
  'blackout': { crop: true },
  'escape-night': { crop: true },
  'train': { crop: true },
  'crossing-night': { crop: true },
  'crossing-day': { crop: true },
  'shop-street': { crop: true },
  'genkan-in': { crop: true },
  'town-street': { crop: true },
  'town-crossing': { crop: true },
  'park': { crop: true },
  'rail-crossing': { crop: true },
};
// the cast shadow (.db-plant[data-cast]) from the floor's key light: offset, turn, stretch, ink (rgb triplet)
export function castVars(l) {
  if (!l) return {};
  return { '--cast-dx': `${l.dx ?? 0}px`, '--cast-dy': `${l.dy ?? 0}px`, '--cast-rot': `${l.rot ?? 0}deg`, '--cast-len': l.len ?? 1, '--cast-ink': l.ink ?? '24, 12, 22', '--cast-a': l.a ?? 0.46 };
}
export function floorOf(bg, shot) {
  const key = shot && FLOORS[shot] ? shot : bg;
  const f = FLOORS[key];
  const on = f && !f.crop;
  return { key, y: on ? f.y ?? null : null, wet: !!(on && f.wet), step: (on && f.step) || null, light: (on && f.light) || null };
}
