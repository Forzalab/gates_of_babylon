# R7 LEGS: audit per shot (5-master lens)

## The shared fix (nanda.js `legsSVG`, used by every Nanda shot)
- **Before:** both pins dead straight on one line, both shoes identical domes, no sole, one wide shadow ellipse for
  both feet. Every shot read as a statue standing, even when the text says she walks; on dark floors the feet floated.
- **Loomis/Bridgman:** her canon is kept (pin 6x24, shoe 18x11.5 gate units = her chibi 2.5-head body). The walk changes
  only the angles and the foreshortening, never the lengths.
- **Nishiya:** the shoe now has a dark sole lip (its thickness shows at the toe), the pink strap, a small toe-cap sheen.
- **Inoue:** `step: 'walk'` = the contact pose walking toward the camera. The front leg heel-strikes (nearer = lower,
  toe lifted, more sole showing); the back leg pushes off (farther = higher, heel up, a shorter slanted pin, only the toe
  on the ground). The feet converge on the line of travel; the front shoe overlaps the back one.
- **Contact:** a soft pool + a near-black occlusion line per sole; on wet floors a pale meniscus line at the contact.
- **Shinkai:** `light` per floor (floors.js): a rim on the lit side of the pins + domes, a cast shadow pushed / turned /
  stretched away from the key (`.db-plant[data-cast]`) in the scene's shadow ink, a grade filter on her sprite.
  On wet floors the reflection mirrors each foot about its own contact (the back leg is re-placed in the water copy).

## 2. v2-rain 4 (rain-ending), the rain walk
- Anatomy: the canon was fine, but a static stand on a "walk" line (Inoue: 0).
- Contact: one blurry pool, no dark at the soles; the reflection hung off one line for both feet.
- Light: the key is the sky gap up-right behind her, overcast and soft, so the shadow is short, soft, toward the camera
  and left. It was a centred radial at x 960 while her soles sit at ~x 893.
- Grade: her magenta/plum ran hotter than the grey-green drizzle.
- UI: clear of the box (soles 700, box top 775).

## 3. v2-curry 13 (curry-street), the street walking
- UI: the floor was UNDER_BOX, so the box rivets cut both shoes across the middle (the worst UI fit on the route).
- Contact: none (no ground). Pose: static on a "we walk out" line.
- Light: afternoon sun from the left (every pole is lit on its left face) = a warm rim on her left edges, a long cast
  shadow to the right, warm-brown shadow ink, a warm floor bounce on the shins.

## 4. v2-train 3 (station-ads), the station feet
- Pose: a static stand on "Two men bump into her" (Inoue: a bump = a caught-balance, widened base).
- Light: the sun shafts come down from the upper right through the roof; the pool was magenta-tinted and centred at
  x 960, 40 px right of her soles. Grade: hotter than the blue-grey platform. The crowd's feet are all behind the box.
