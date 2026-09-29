// Text with the trailing `sel` chars in her red selection (the one held swap before her edit deletes them).
import { Ors } from '../kit/ui.jsx';
import './sel.css';

export default function Sel({ text, sel }) {
  if (!sel) return <Ors text={text} />;
  return <><Ors text={text.slice(0, text.length - sel)} /><mark className="hsel">{text.slice(text.length - sel)}</mark></>;
}
