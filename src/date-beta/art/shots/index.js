// shots/: reusable camera tricks over existing art ids. Spread into ART (art/index.js). Use as a beat `bg` + `props`:
//   { "bg": "closeup",   "props": { "of": "shop-street", "x": 1200, "y": 500, "zoom": 2.2 } }
//   { "bg": "insert",    "props": { "item": "butter-chicken", "of": "crossing-day" } }   items: see ITEMS
//   { "bg": "reaction",  "props": { "emote": "hearts", "of": "street-dusk" } }
//   { "bg": "establish", "props": { "of": "crossing-night", "from": [400, 500], "to": [1500, 420] } }
// Preset ids (no props needed) cover the food/object inserts: insert-curry, insert-butter-chicken, ...
import { createElement } from 'react';
import { Closeup, Insert, Reaction, Establish } from './Shots.jsx';
import { ITEMS } from './items.jsx';
import { SHOT_ALIASES } from './aliases.js';
import { Push, Rack, Pov, Ots, Timelapse, Dutch, Match, Stamp } from './Moves.jsx';

const preset = (C, fixed) => Object.assign(function Preset({ props, rm }) { return createElement(C, { props: { ...fixed, ...props }, rm }); }, { solo: C.solo });
// solo = the shot owns the frame (main.jsx hides the Nanda sprite and the focus blur): inserts and her big-face reaction.
Insert.solo = true;
Reaction.solo = true;

export const SHOTS = {
  closeup: Closeup, insert: Insert, reaction: Reaction, establish: Establish,
  push: Push, rack: Rack, pov: Pov, ots: Ots, timelapse: Timelapse, dutch: Dutch, match: Match, stamp: Stamp,
  ...Object.fromEntries(Object.keys(ITEMS).map((k) => [`insert-${k}`, preset(Insert, { item: k })])),
};
// sequences.json shot ids (bento-lid, dish-butter, ...) registered as plain art ids too.
const BY_ID = { closeup: Closeup, insert: Insert, reaction: Reaction, establish: Establish };
for (const [id, a] of Object.entries(SHOT_ALIASES)) SHOTS[id] = preset(BY_ID[a.bg], a.props);
export { SHOT_ALIASES };
export default SHOTS;
