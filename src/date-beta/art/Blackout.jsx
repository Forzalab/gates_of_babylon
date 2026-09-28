// Blackout: the rooftop's "f-OR-ecast" returns in the dark. Letters fade, OR stays last in her red,
// OR slowly grows into ADORE ME, holds, dims, then a HARD cut to pure black.
// OR is pinned to the centre: left letters sit right-aligned in the left half, right letters left-aligned in the right.
// Reduced motion: the sequencer skips the in-between phases (OR -> ADOR -> ADORE ME) and .rm kills every transition.
const ORDER = ['dark', 'forecast', 'or', 'dor', 'ador', 'adore', 'adoreme', 'fade', 'cut'];

export default function Blackout({ props }) {
  const n = ORDER.indexOf(props.phase ?? 'dark');
  const past = (p) => n >= ORDER.indexOf(p);
  const on = (c) => (c ? ' on' : '');
  return (
    <div className={`art blackout phase-${props.phase}`} role="img" aria-label={past('adoreme') && n < 8 ? 'ADORE ME' : past('forecast') && n < 8 ? 'forecast' : 'darkness'}>
      {n < ORDER.indexOf('cut') && (
        <div className={`word${on(past('forecast'))}${past('fade') ? ' dim' : ''}`}>
          <span className="half left">
            <span className={`l old${on(!past('or'))}`}>f-</span>
            <span className="new"><span className={`l${on(past('ador'))}`}>A</span><span className={`l${on(past('dor'))}`}>D</span></span>
          </span>
          <span className="core">OR</span>
          <span className="half right">
            <span className={`l old${on(!past('or'))}`}>-ecast</span>
            <span className="new"><span className={`l${on(past('adore'))}`}>E</span><span className={`l${on(past('adoreme'))}`}>&nbsp;ME</span></span>
          </span>
        </div>
      )}
    </div>
  );
}
