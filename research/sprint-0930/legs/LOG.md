# R7 LEGS: iteration log
Rubric: 1 anatomy (2), 2 contact (2), 3 pose (1), 4 shoe (1), 5 cast shadow (1), 6 reflection/bounce (1), 7 grade (1), 8 UI (1).

## 1. v2-rain 2 puddle shoes: DONE before the restart (774e847), compare 01.

## 2. v2-rain 4 rain walk (rain-ending)
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before | 2 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 5 | - |
| 1 | walk pose, sole lip, per-sole contact, rim, grade, cast shadow | 2 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 7 | yes |
| 2 | feet converge on the line of travel; the back foot mirrored about its own contact; darker contact | 2 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 8 | yes |
| 3 | cast shadow under her soles (dx -96), to the front-left; a wet meniscus at each contact | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 9 | yes |
| 4 | front toe lift 1.1 -> 0.45: the heel contact sits tight on the meniscus (no gap) | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 10 | PASS |

Left: the "you" pair is not in frame (the player is the POV camera on every medium shot).

## 3. Street walking: v2-curry 13 "We walk out to the street" (curry-street; also katsu 11, alone 3)
v2-street 0-5 show no feet live (her feet are under the box / she is offstage on door 12), so the street-walking shot with
legs on screen is the walk-out onto the curry street.
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before: floor UNDER_BOX, the box rivets slice her shoes in half, no ground | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 3 | - |
| 1 | floor y 790 up the street (clear of the box), walk pose, sun from the left (lit pole faces): warm rim, cast to the right | 2 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 8 | yes |
| 2 | floor bounce (warm on the shins + a line on the toe caps), longer darker cast | 2 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 8 | reverted the toe-cap line (read as a 2nd strap) |
| 3 | 2 without the toe-cap line; back-foot contact 0.7 -> 0.85 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 9 | PASS |

Left: the street's ground at y 790 is soft (the bg is blurred there), so contact keeps 1 of 2.

## 4. Station feet: v2-train 3 "Two men bump into her" (station-ads, planted 90; also v2-train 4)
The crowd's legs are all under the box (Crowd.jsx); the feet on screen are hers.
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before (with the shared sole/contact fix): a statue on a "bumped" line, a magenta pool centred off her feet | 2 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 5 | - |
| 1 | planted beats keep the floor's pose + light; 'brace' stance (wider base, pins splayed); sun shafts up-right: cool rim, cast to the left in blue-grey ink; grade | 2 | 2 | 1 | 1 | 1 | 0 | 1 | 1 | 9 | yes |
| 2 | a cool floor bounce on the shins | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 10 | PASS |

## Fixes found on the way
- The grade was an inline `filter` on her svg, which overrode the stage's focus glow (`.stage.focus .db-nanda`). It is
  now an inner `<g style=filter>`, so the focus plane / drop-shadow stay as they were (rain walk + street re-shot).
- Float audit: town 12 / errand-shop 8 (raised waist-up crops) showed two pin stubs under the hem. Those crops now draw
  no legs at all (Nanda.jsx waistUp), and the audit counts a waist-up crop as cropped. Float audit: 0 flags.

## Contact sheet 1 (shots 2-4): compare/contact-sheet-1.jpg
Same shoe model, sole lip and pin length in all three; the shadow family follows each scene (soft cool-left in the
drizzle, long warm-right in the afternoon street, cool-left under the station shafts). The refs' cast shadows are
harder (ref 04, low sun); ours stay soft because none of these three keys is a hard low sun. Consistent: OK.

## 5. rooftop 2 "Her shoes by the fence. Toes pointed at you." (rooftop-noon)
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before: the line is about her shoes, the box hides them (rooftop-noon is a crop bg) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | - |
| 1 | per-beat floor (props.cut.floor = rooftop-fence, y 786 on the tile deck); 'shy' uchimata stance (knees + toes in 7 deg); noon sun front-left: short crisp cast right, warm rim left, deck bounce | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 9 | yes |
| 2 | toe-in 7 -> 4 deg, shoes 1.5 u apart (they were crossing at the toes) | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 10 | PASS |

## 6. v2-shop 12 "The shop bell rings. You carry the bags. She holds your sleeve." (shop-way-out)
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before: soles ON the two-line box's rivets (760 vs ~772), the contact hidden; static | 2 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 4 | - |
| 1 | floor 742 (clear of the rivets), walk pose, sun behind the camera front-left: shadow falls back + right, warm rim left, pavement bounce | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 9 | PASS |

Left: the bg is soft at y 742 (blurred facade base), contact keeps 1 of 2.

## 7. v2-train 6 "12 stops to her home." (train-sun, planted)
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before: soles on the 3-line box's rivets (683 vs 689), static in a moving carriage | 2 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 4 | - |
| 1 | plant 90 -> 72 (floor entry 690 -> 670 to match, float audit 0); brace stance; low sun from the right windows: long cast left, orange rim, warm bounce, grade | 2 | 2 | 1 | 1 | 0 | 1 | 1 | 1 | 9 | yes: PASS |
| 2 | darker cast ink (a .55 -> .72) | 2 | 2 | 1 | 1 | 0 | 1 | 1 | 1 | 9 | kept (equal; still hard to read on the dark-brown floor) |

v2-train 8 (platform-rain): her feet are behind the box on every take (plant 100, a 2-line box): no legs on screen, N/A.

## Contact sheet 2 (shots 5-7 against 2-4): compare/contact-sheet-2.jpg
One shoe model, one pin length in all six; three stances (walk, brace, shy) read apart at thumbnail size; each scene's
shadow ink comes from its own floor (cool blue deck, grey pavement, brown carriage). Weakest: the carriage cast (dark
on dark). Consistent: OK.

## 8. The park walk-out: v2-park 4 "Two pairs of shoes walk out of the park. Hers stay close to yours." (insert feet/park)
| it | change | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | total | kept |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | before: a beige oval plate in mid-frame, pink stub shoes (not her canon: no pins), leg stumps ending in mid-air, no light | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | - |
| 1 | full-frame waist-down cutaway (FeetWalk.jsx): her own sprite at 11 px/u in the walk pose, your jeans + sneakers in step, path ground, cast shadows front-left, rims right | 2 | 1 | 1 | 1 | 0 | 1 | 0 | 1 | 7 | yes (the stage focus blur softened every cel) |
| 2 | the focus blur skips this scene (its trace is pre-blurred): the cels are crisp | 2 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 8 | yes |
| 3 | your legs narrower + separated, a seam on the front leg, darker casts, the leg dapples (grey blobs) out | 2 | 2 | 1 | 0 | 1 | 1 | 1 | 1 | 9 | yes |
| 4 | the jeans drawn after each shoe: the hem breaks over the tongue | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 10 | yes |
| 5 | the toe-off sneaker's sole narrowed to its upper (it read as a skateboard) | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 10 | PASS |

Left for Tony (no 6th iteration): a wide gap between her pair and yours in the middle; "hers stay close" would want yours
~100 px further left. The light-ray wedge under her front shoe is the park grade's flare (GradeLayer), not a shadow.
