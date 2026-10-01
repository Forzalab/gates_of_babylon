import { useEffect, useRef, useState } from 'react';
import { ScrollCues } from './Palette.jsx';

// The truth table's scrolling box: sticky header, windowed rows, live row, click-to-set, arrow keys, scroll cues, bottom fade.
// Shared by the inline cell and the full-table popup (Truth.jsx). Only a window of rows is rendered, so 13 switches
// (8,192 rows) stay cheap. `limit(el)` = the lowest y (px) the box may reach; the box is trimmed to whole rows above it.
export default function TTBox({ rows, ins, heads, live, setSwitches, fig, classic, limit, focusLive = false }) {
  const box = useRef(null);
  const [rowH, setRowH] = useState(40), [top, setTop] = useState(0), [boxH, setBoxH] = useState(400);
  const [more, setMore] = useState({ up: false, down: false, left: false, right: false }); // palette's scroll cues: only where rows / columns remain
  const cues = (el) => {
    const m = { up: el.scrollTop > 1, down: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
      left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 };
    setMore((o) => (Object.keys(m).some((k) => m[k] !== o[k]) ? m : o));
    // The bottom fade is a mask, which also hides the native horizontal scrollbar. Tell the CSS how tall that strip is, so the fade ends above it.
    const sb = `${el.offsetHeight - el.clientHeight}px`;
    el.style.setProperty('--sb', sb); el.parentElement.style.setProperty('--sb', sb); // the wrap too, so the bottom cue sits above the strip
  };
  useEffect(() => {
    const el = box.current; if (!el) return;
    const tr = el.querySelector('tbody tr:not(.pad)'); if (tr) setRowH(tr.getBoundingClientRect().height || 40);
    const head = el.querySelector('thead')?.getBoundingClientRect().height || 0;
    el.style.maxHeight = '';                       // re-read the CSS cap
    // cap = the CSS max-height, but never past the limit (inline: 32u above the row-03 rule, the same margin as under TRUTH TABLE).
    // The box holds whole rows. Was: capped only when the rows overflowed 100vh, so a taller row 02 let 8-16 rows run to the cell's bottom rule.
    const room = limit(el) - el.getBoundingClientRect().top;
    const cap = Math.min(parseFloat(getComputedStyle(el).maxHeight), room);
    const sb = el.offsetHeight - el.clientHeight; // horizontal scrollbar strip: sits below the whole rows, not inside them
    if (el.scrollHeight > cap + 0.5) el.style.maxHeight = `${head + Math.floor((cap - head - sb) / rowH) * rowH + sb}px`;
    setBoxH(el.clientHeight);
    cues(el);
    // Tony: the table snapped back while scrolling. This effect ran after EVERY render, and a scroll re-renders (setTop):
    // clearing maxHeight each time shrank/regrew the box and clamped scrollTop. Re-measure only when the table or the frame changes.
  }, [rows, fig, rowH]); // eslint-disable-line react-hooks/exhaustive-deps
  const first = Math.max(0, Math.floor(top / rowH) - 2), last = Math.min(rows.length, first + Math.ceil(boxH / rowH) + 5);
  // Keep the live row in view when the switches change.
  useEffect(() => {
    const el = box.current; if (!el) return;
    const head = el.querySelector('thead')?.getBoundingClientRect().height || 0;
    el.style.scrollPaddingTop = `${head}px`; // manual scrolling snaps rows under the sticky header, never half a row
    const y = live * rowH, fit = Math.floor((el.clientHeight - head) / rowH); // whole rows that fit
    const firstShown = Math.round(el.scrollTop / rowH);
    if (live < firstShown) el.scrollTop = y;
    else if (live >= firstShown + fit) el.scrollTop = (live - fit + 1) * rowH; // always a whole-row boundary
  }, [live, rowH]);
  // Popup open: focus goes to the live row, once it is rendered (the scroll above may need a frame to bring it into the window).
  useEffect(() => {
    if (!focusLive) return;
    let n = 0, id;
    const go = () => { const r = box.current?.querySelector('tr.live'); if (r) r.focus({ preventScroll: true }); else if (n++ < 20) id = requestAnimationFrame(go); };
    id = requestAnimationFrame(go);
    return () => cancelAnimationFrame(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cls = (h) => ({ A: 'hA', B: 'hB' })[h];
  const kind = (j) => (j < ins.length ? 'k-S' : 'k-L'); // column kind: switch (input) or lamp (output)
  const stop = live >= first && live < last ? live : first;
  return (
    <div className="tt-wrap">
      <div className={`tt ${classic ? 'classic' : ''} ${more.down ? 'fd' : ''}`} ref={box} onScroll={(e) => { setTop(e.currentTarget.scrollTop); cues(e.currentTarget); }}>
        <table style={{ '--n': heads.length }} role="grid" aria-label="Truth table rows; arrow keys set the switches">
          <thead><tr>
            {heads.map((h, j) => h === 'OUT' && classic
              ? <th key={h} className={kind(j)} scope="col" aria-label="OUT"><span className="sr">OUT</span><span aria-hidden="true"><span className="hO">O</span><span className="hU">U</span><span className="hT">T</span></span></th>
              : <th key={h} className={kind(j)} scope="col"><span className={classic ? cls(h) : undefined}>{h}</span></th>)}
          </tr></thead>
          <tbody>
            {first > 0 && <tr className="pad" style={{ height: first * rowH }} aria-hidden="true" />}
            {rows.slice(first, last).map((row, k) => {
              const i = first + k;
              return (
                <tr key={i} className={i === live ? 'live' : ''} tabIndex={i === stop ? 0 : -1}
                  aria-selected={i === live} data-row={i}
                  onClick={() => setSwitches(ins, row.slice(0, ins.length))}
                  onKeyDown={(e) => {
                    const go = (j) => { if (j < 0 || j >= rows.length) return; e.preventDefault();
                      setSwitches(ins, rows[j].slice(0, ins.length));
                      requestAnimationFrame(() => box.current?.querySelector(`tr[data-row="${j}"]`)?.focus()); };
                    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i - 1);
                    else if (e.key === 'Home') go(0); else if (e.key === 'End') go(rows.length - 1);
                    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSwitches(ins, row.slice(0, ins.length)); } }}>
                  {row.map((b, j) => <td key={j} className={kind(j)}>{fig(b)}</td>)}
                </tr>
              );
            })}
            {last < rows.length && <tr className="pad" style={{ height: (rows.length - last) * rowH }} aria-hidden="true" />}
          </tbody>
        </table>
      </div>
      <ScrollCues more={{ ...more, up: false }} onWheel={(e) => box.current?.scrollBy(e.shiftKey ? { left: e.deltaY || e.deltaX } : { top: e.deltaY, left: e.deltaX })} />
    </div>
  );
}
