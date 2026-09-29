// Naan scene: the Hot NAAN ad (NaanAd.jsx, 2:1) in a station light-box on a tiled wall. The ad sits in the top
// 780 px, so the dialogue chip (bottom ~300 px) never covers its copy. The platform art proper is a later pass;
// this mount only has to hold the ad. Glitch + reduced-motion rules live in NaanAd.
import NaanAd, { NAAN_AD_W, NAAN_AD_H } from './NaanAd.jsx';

const AD_W = 1480, AD_H = (AD_W * NAAN_AD_H) / NAAN_AD_W, AD_X = (1920 - AD_W) / 2, AD_Y = 40;

export default function NaanBoard({ rm }) {
  return (
    <div className="art naan">
      <svg className="board" viewBox="0 0 1920 1080" role="img"
        aria-label="A lit station ad: Hot NAAN in your area. Naan and curry on a black plate, a curry river with swimming NAND gates.">
        <rect width="1920" height="1080" fill="#2c3a40" />
        {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 90 + 20} x2="1920" y2={i * 90 + 20} stroke="#24323a" strokeWidth="4" />)}
        {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 128 + 40} y1="0" x2={i * 128 + 40} y2="900" stroke="#24323a" strokeWidth="4" />)}
        {/* platform floor + tactile strip */}
        <rect y="900" width="1920" height="180" fill="#8b8a84" />
        <rect y="900" width="1920" height="10" fill="#6d6c67" />
        <rect y="1000" width="1920" height="40" fill="#e6c229" />
        {/* light-box: frame, lit edge, the ad */}
        <rect x={AD_X - 26} y={AD_Y - 26} width={AD_W + 52} height={AD_H + 52} rx="8" fill="#9aa4a8" />
        <rect x={AD_X - 14} y={AD_Y - 14} width={AD_W + 28} height={AD_H + 28} fill="#f4fbf9" />
        <NaanAd x={AD_X} y={AD_Y} width={AD_W} rm={rm} />
        <rect x={AD_X - 26} y={AD_Y + AD_H + 26} width={AD_W + 52} height="10" fill="#1e282d" />
      </svg>
    </div>
  );
}
