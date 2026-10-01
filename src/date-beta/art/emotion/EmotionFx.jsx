// EmotionFx.jsx: the gacha FX (engine react.gacha = { id, fx, face, label, bonus, base }). A still backdrop over the scene,
// under Nanda, the dialogue box and the HUD; it stays up for the whole reaction frame and goes with it (a hard cut, no fade).
// Meaning never rides on colour alone: the badge says the tier and the signed number, and is announced once (role=status).
import { useEffect, useMemo, useRef } from 'react';
import { EMOTION_FX } from './index.js';
import './emotion.css';

export function EmotionFx({ gacha }) {
  const art = useMemo(() => (gacha && EMOTION_FX[gacha.fx] ? EMOTION_FX[gacha.fx](gacha) : null), [gacha]);
  const ref = useRef(null);
  // Anger vein "grows a bit": ONE stepped swap small -> big after 600 ms (>= 500 ms per step, then it holds; 0 tweens).
  // The flag sits on the stage so Nanda's face-layer vein swaps in the same frame. Reduced motion: CSS shows big only.
  useEffect(() => {
    const stage = ref.current?.parentElement;
    if (!stage) return undefined;
    const t = setTimeout(() => stage.setAttribute('data-emo-step', 'big'), 600);
    return () => { clearTimeout(t); stage.removeAttribute('data-emo-step'); };
  }, [art]);
  if (!art) return null;
  return (
    <div ref={ref} className={`emo-fx emo-${gacha.fx}`} data-gacha={gacha.id}>
      <div className="emo-bg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
      <p className="emo-badge" role="status">{gacha.label}</p>
    </div>
  );
}
