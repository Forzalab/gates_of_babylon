# naan_v2.py: Tony's pick for the naan tear (AUDIT 049, variants/naan-V2): TWO hands, both BEHIND the naan.
#   - the left hand pinches the torn piece from behind: the piece is drawn over its fingertips (layer reorder);
#   - the right hand holds the big naan down: its fingertips tuck UNDER the naan's raised near edge (a flap of the same
#     trace drawn again over the tips, clipped to a band, with a crust edge + a lit rim), so the naan overlaps them.
# Source = the ORIGINAL trace (git show a22d917:public/date-beta/trace/curry/naan-lift.svg), written in place.
# python3 research/sprint-0930/r5-ume/naan_v2.py <original.svg> <out.svg>
import sys

src, out = sys.argv[1], sys.argv[2]
s = open(src).read()
i = s.index('</defs>') + 7
head, b = s[:i], s[i:]
# segments (research/sprint-0930/r5-ume/variants/naan.py): table + naan, dough strands, right hand, piece, left hand
bg, naan, mid, hR, pc, hL = b[0:117], b[117:12342], b[12342:13303], b[13303:29100], b[29100:30202], b[30202:]
end = hL.rindex('</svg>')
hL, tail = hL[:end], hL[end:]
assert naan.startswith('<g') and hR.startswith('<g') and pc.startswith('<g') and hL.startswith('<g')

# the flap: the naan's near edge, lifted over the right hand's four fingertips (nails at y ~ 540-670)
EDGE = 'M1052 548 C1072 532 1092 516 1114 518 C1140 522 1160 566 1230 586 C1270 598 1318 594 1350 570 C1370 554 1388 534 1424 532 C1450 531 1470 538 1484 546'
FLAP = EDGE + ' L1484 760 L1052 760 Z'
clip = f'<clipPath id="r5-flap"><path d="{FLAP}"/></clipPath>'
head = head.replace('</defs>', clip + '</defs>')
flap = naan.replace('id="nbody"', 'id="nbody-r5"').replace('url(#nbody)', 'url(#nbody-r5)')
over = (f'<g clip-path="url(#r5-flap)">{flap}</g>'
        # the flap's own soft shadow on the naan under it is hidden; its lit crust rim + a darker crust line sell the lift
        f'<path d="{EDGE}" fill="none" stroke="#8a5424" stroke-width="7" stroke-linecap="round" opacity=".55" transform="translate(0 5)"/>'
        f'<path d="{EDGE}" fill="none" stroke="#b9803f" stroke-width="5" stroke-linecap="round"/>'
        f'<path d="{EDGE}" fill="none" stroke="#fbf0d4" stroke-width="3" stroke-linecap="round" transform="translate(0 -3)" opacity=".9"/>')
# order: table + naan, strands, right hand, the flap over its tips, left hand, the torn piece over the left fingertips
open(out, 'w').write(head + bg + naan + mid + hR + over + hL + pc + tail)
print(out, len(head + bg + naan + mid + hR + over + hL + pc + tail))
