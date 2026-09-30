// EmotionFx.jsx: the gacha FX (engine react.gacha = { id, fx, face, label, bonus, base }). A still backdrop over the scene,
// under Nanda, the dialogue box and the HUD; it stays up for the whole reaction frame and goes with it (a hard cut, no fade).
// Meaning never rides on colour alone: the badge says the tier and the signed number, and is announced once (role=status).
import { useMemo } from 'react';
import { EMOTION_FX } from './index.js';
import './emotion.css';

export function EmotionFx({ gacha }) {
  const art = useMemo(() => (gacha && EMOTION_FX[gacha.fx] ? EMOTION_FX[gacha.fx](gacha) : null), [gacha]);
  if (!art) return null;
  return (
    <div className={`emo-fx emo-${gacha.fx}`} data-gacha={gacha.id}>
      <div className="emo-bg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
      <p className="emo-badge" role="status">{gacha.label}</p>
    </div>
  );
}
