// Small shared UI for builder A: the dialogue line (OR rule via main's Say.jsx), subtitles, HUD chips, fonts.
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/roboto-condensed/400-italic.css';
import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import { Ors, OrSpans, orParts } from '../../../date-beta/Say.jsx';
import { words } from './time.js';
import '../../../date-beta/art/art.css'; // main's scene text styles (clock numerals, ad type, ...)
import './roles.css';
import './a.css';

export { Ors, OrSpans, orParts };

// "NANDA: line" -> speaker chip + line. No prefix = narration. Throws in dev if a click carries > 12 words.
export function Line({ text, className = '' }) {
  if (!text) return null;
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/.exec(text);
  const who = m?.[1], line = m ? m[2] : text;
  if (import.meta.env?.DEV && words(line) > 12) console.warn(`>12 words: ${line}`);
  const hasOr = /OR/.test(line);
  return (
    <div className={`a-line ${who ? `who-${who.toLowerCase()}` : 'narr'} ${className}`} role="status" key={text}>
      {who && <b className="who">{who}</b>}
      <p><Ors text={line} /></p>
      {hasOr && <span className="sr">[her breath]</span>}
    </div>
  );
}

export function Sub({ text, className = '' }) {
  if (!text) return null;
  return <div className={`a-sub ${className}`} key={text}><Ors text={text} /></div>;
}

export function Hud({ children }) {
  return <div className="a-hud" onClick={(e) => e.stopPropagation()}>{children}</div>;
}

export function Tag({ children }) {
  return <div className="a-tag">{children}</div>;
}
