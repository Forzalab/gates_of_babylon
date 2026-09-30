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
  'rain-ending': { y: 760 },      // the wet road at her x, just above the box (v2-rain 4)
  'her-building': { y: 790 },     // the dark street in front of door 12 (v2-street 5)
  'shop-way-out': { y: 760 },     // the pavement outside the shop doors
  'train-sun': { y: 690 },        // the carriage floor (v2-train 6, matched to the Tony-approved plant 90)
  'platform-rain': { y: 698 },    // the platform edge (v2-train 8, plant 100)
  'station-ads': { y: 690 },      // the platform under the ads (v2-train 4, plant 90)
  // ground hidden behind the box at her column: feet tuck behind it
  'curry-street': { y: UNDER_BOX },
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
export function floorOf(bg, shot) {
  const key = shot && FLOORS[shot] ? shot : bg;
  const f = FLOORS[key];
  return { key, y: f && !f.crop ? f.y ?? null : null };
}
