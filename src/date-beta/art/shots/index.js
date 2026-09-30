// shots/: reusable camera tricks over existing art ids. Spread into ART (art/index.js). Use as a beat `bg` + `props`:
//   { "bg": "closeup",   "props": { "of": "shop-street", "x": 1200, "y": 500, "zoom": 2.2 } }
//   { "bg": "insert",    "props": { "item": "butter-chicken", "of": "crossing-day" } }   items: see ITEMS
//   { "bg": "reaction",  "props": { "emote": "hearts", "of": "street-dusk" } }
//   { "bg": "establish", "props": { "of": "crossing-night", "from": [400, 500], "to": [1500, 420] } }
// Preset ids (no props needed) cover the food/object inserts: insert-curry, insert-butter-chicken, ...
import { createElement } from 'react';
import { Closeup, Insert, Reaction, Establish } from './Shots.jsx';
import { ITEMS } from './items.jsx';

const preset = (C, fixed) => function Preset({ props, rm }) { return createElement(C, { props: { ...fixed, ...props }, rm }); };

export const SHOTS = {
  closeup: Closeup, insert: Insert, reaction: Reaction, establish: Establish,
  ...Object.fromEntries(Object.keys(ITEMS).map((k) => [`insert-${k}`, preset(Insert, { item: k })])),
};
export default SHOTS;
