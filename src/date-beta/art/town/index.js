// TOWN (research/sprint-0930/town/NOTES.md): art id -> component, spread into ART in art/index.js. Walk order:
// the street (establishing) -> the crossing -> the billboard. Live = the PURE vtrace shots (+ the street's BOOK cel);
// town-*-hybrid = the older hand-hybrid shots, kept for the comparison.
import { TownStreet, TownStreetBook, TownCrossing, TownBoard, TownStreetHybrid, TownCrossingHybrid, TownBoardHybrid } from './Town.jsx';

export const TOWN = {
  'town-street': TownStreet,
  'town-street-book': TownStreetBook,
  'town-crossing': TownCrossing,
  'town-board': TownBoard,
  'town-street-hybrid': TownStreetHybrid,
  'town-crossing-hybrid': TownCrossingHybrid,
  'town-board-hybrid': TownBoardHybrid,
};
export default TOWN;
