// floors.js: where Nanda stands. One entry per bg id (or per insert-card shot id, art/shots, which wins over the bg):
// y = the stage y (1920x1080 px) of the ground / platform / floor at her column (x ~960), measured on each bg with
// research/sprint-0930/float-audit/audit.mjs (REPORT.md there). The renderer (main.jsx -> Nanda.jsx .floored + .db-plant)
// puts her shoes on that line with a contact shadow under them, so every new beat on a bg inherits it; an explicit
// props.cut.plant on a beat still wins. y past the box top (>= 840) = the ground is hidden behind the dialogue box: her
// feet tuck behind it (the box crops them, SHADOWS.md). crop: true = she is only ever shown cropped on this bg (the box /
// frame hides her feet); no floor is applied, the audit flags it if her feet ever show.
export const UNDER_BOX = 840;
// r5-ume (AUDIT G3, the box ate her feet on ~45 beats): every medium shot now stands her ON a visible floor line above the
// 2-line dialogue box (its pins reach y ~755): FEET = the default line where the bg's ground at her column is not measured
// higher. The focus plane (main.jsx .db-plane) keeps that band of ground sharp, so she reads grounded, not pasted.
export const FEET = 742;
export const FLOORS = {
  // measured ground lines (feet visible)
  'rain-ending': { y: FEET },      // the wet road at her x, just above the box (v2-rain 4)
  'her-building': { y: FEET },     // the dark street in front of door 12 (v2-street 5)
  'shop-way-out': { y: FEET },     // the pavement outside the shop doors
  'train-sun': { y: 690 },        // the carriage floor (v2-train 6, matched to the Tony-approved plant 90)
  'platform-rain': { y: 698 },    // the platform edge (v2-train 8, plant 100)
  'station-ads': { y: 690 },      // the platform under the ads (v2-train 4, plant 90)
  // ground hidden behind the box at her column: feet tuck behind it
  'curry-street': { y: FEET },
  'town-board': { y: FEET },
  // insert-card shots (a card over the bg): no ground in the card, feet tuck behind the box
  'feet-park': { y: FEET },
  'hands-lock': { y: FEET },
  'tea-pour': { y: FEET },
  // her feet are always behind the box / frame on these (audit: cropped on every beat)
  'rooftop-noon': { y: FEET },
  'shop-vending': { y: FEET },
  'shop-doors': { y: FEET },
  'shop-list': { y: FEET },
  'shop-snacks': { y: FEET },
  'shop-checkout': { y: FEET },
  'shop-register': { y: FEET },
  'shop-self-checkout': { y: FEET },
  'shop-self-close': { y: FEET },
  'curry-choice': { y: FEET },
  'curry-butter-table': { y: FEET },
  'curry-katsu-counter': { y: FEET },
  'curry-katsu-int': { y: FEET },
  'station-gate-r3': { y: FEET },
  'vending-insert': { y: FEET },
  'station-ads-insert': { y: FEET },
  'rain-sidewalk': { y: FEET },
  'rain-alley': { y: FEET },
  'rain-eave': { y: FEET },
  'street-bluehour': { y: FEET },
  'street-dusk': { y: FEET },
  'street-day': { y: FEET },
  'BG-D1': { y: FEET },
  'BG-D2': { y: FEET },
  'BG-D3': { y: FEET },
  'sitting-room': { y: 854, book: 745 }, // r5: behind the tea table (the BOOK cel sitting-room-book crops her at its far edge)
  'bedroom': { y: FEET },
  'blackout': { y: FEET },
  'escape-night': { y: FEET },
  'train': { y: FEET },
  'crossing-night': { y: FEET },
  'crossing-day': { y: FEET },
  'shop-street': { y: FEET },
  'genkan-in': { y: FEET },
  'town-street': { y: FEET },
  'town-crossing': { y: FEET },
  'park': { y: FEET },
  'rail-crossing': { y: FEET },
};
export function floorOf(bg, shot) {
  const key = shot && FLOORS[shot] ? shot : bg;
  const f = FLOORS[key];
  return { key, y: f && !f.crop ? f.y ?? null : null, book: f?.book ?? null };
}
