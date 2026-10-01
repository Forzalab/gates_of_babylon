// TOWN (research/sprint-0930/town/NOTES.md): art id -> component, spread into ART in art/index.js. Walk order:
// the street (establishing) -> the crossing -> the billboard. Live = the PURE vtrace shots (+ the street's BOOK cel);
// town-*-hybrid = the older hand-hybrid shots, kept for the comparison.
import { TownStreetBook, TownStreetHybrid, TownCrossingHybrid, TownBoardHybrid } from './Town.jsx';
import { TownStreetSW, TownCrossingSW, TownBoardSW } from './Sandwich.jsx';

export const TOWN = {
  'town-street': TownStreetSW, // live = the SANDWICH (research/sprint-0930/sandwich); TownStreet etc. = the pure-only before
  'town-street-book': TownStreetBook,
  'town-crossing': TownCrossingSW,
  'town-board': TownBoardSW,
  'town-street-hybrid': TownStreetHybrid,
  'town-crossing-hybrid': TownCrossingHybrid,
  'town-board-hybrid': TownBoardHybrid,
};
export default TOWN;
