// BG id -> art component name (ART in index.js). Used only while the real file is missing: a file dropped into
// public/date-beta/assets/ always wins (the loader reports it loaded, main.jsx draws the <img>). Pure data, node-testable.
export const BG_FALLBACK = Object.freeze({
  'BG-D1': 'door',      // her door, night: Unit 12, rain past the corridor rail
  'BG-D2': 'teatable',  // sitting room: the tea table, the third cup (props.cups = 4 later)
  'BG-D3': 'genkan',    // the locked room: genkan, chained door, shoes in a row, one empty spot
  'BG-X1': 'cafe',      // XOR Coffee, 7:00 AM
  'BG-03': 'rooftop',   // rooftop sunset slot = the rooftop scene, reused
});
