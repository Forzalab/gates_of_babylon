# TOWN cels (PURE version): the ゲートちゃん billboard is OUR art, a flat hand cel (hand.py's gate_chan) laid on the traced
# board in Town.jsx. Writes public/date-beta/trace/town/gate-chan.svg (a 760x620 board: pastel ground + sparkles + her).
# usage: python3 cels.py   (run from the repo root)
import sys
sys.argv = ['hand.py', '/dev/null', '/dev/null']
sys.path.insert(0, 'research/sprint-0930/town/pipeline')
import hand  # noqa: E402

C = hand.C
body = (f'<rect width="760" height="620" fill="{C["pinkHi"]}"/>'
        f'<path d="M0 120 L760 420 L760 620 L0 620Z" fill="{C["sky"]}" opacity=".7"/>'
        + hand.gate_chan(380, 330, 0.95)
        + ''.join(hand.sparkle(x, y, 26) for x, y in ((90, 110), (660, 150), (120, 470), (640, 500))))
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 620" width="760" height="620">{body}</svg>'
open('public/date-beta/trace/town/gate-chan.svg', 'w').write(svg)
print('gate-chan', len(svg) // 1024, 'KB')
