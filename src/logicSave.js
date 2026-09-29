// logicSave.js: keep the Logic circuit across the trip into Date (red-team R6). The Figur collapse saves
// { circuit, view } to sessionStorage; "◂ LOGIC" in Date links back and App boots from it. Tab-scoped, never throws.
export const LOGIC_KEY = 'gob.logic.v1';

const ok = (v) => v && typeof v === 'object' && v.circuit && typeof v.circuit.nodes === 'object' && typeof v.circuit.wires === 'object'
  && Array.isArray(v.view) && v.view.every((n) => n && typeof n.id === 'string' && n.position && Number.isFinite(n.position.x) && Number.isFinite(n.position.y));

export function saveLogic(storage, circuit, view) {
  try {
    // Only what the view needs to redraw: id, type, position, data (React Flow adds measured/selected etc.).
    const v = view.map(({ id, type, position, data }) => ({ id, type, position: { x: position.x, y: position.y }, data: data ?? {} }));
    storage?.setItem(LOGIC_KEY, JSON.stringify({ circuit, view: v }));
    return true;
  } catch { return false; }
}

export function loadLogic(storage) {
  try {
    const v = JSON.parse(storage?.getItem(LOGIC_KEY) ?? 'null');
    return ok(v) ? v : null;
  } catch { return null; }
}

// Highest numeric suffix among ids like "w12" / "sg_7", so new parts never reuse a restored id.
export const maxSuffix = (ids, re) => ids.reduce((m, id) => { const x = re.exec(id); return x ? Math.max(m, +x[1]) : m; }, 0);
