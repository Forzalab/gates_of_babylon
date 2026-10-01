# M2 leave audit (before -> after)

Routes: roof-fu, roof-yeah, home-fu, home-yeah, played live from scene 1 (`shoot.mjs`, ?seed=1&run=1&fx=full, 1920x1080).
Shots: `before/<route>/`, `after/<route>/`. 0 page errors on all 4 routes after the fixes. 429/429 tests, build green.

## Fixed
| # | where | before | after | commit |
|---|---|---|---|---|
| 1 | every choice beat on a crop bg (leave 2/3, v2-home 4, ...) | waist-up Nanda fixed at `bottom: 470px` (tuned for 2-line boxes): over a 1-line box her cut hem hung ~56 px above it = floating | main.jsx measures the box top into `--boxtop`; the hem hangs 14 px behind it on any box height | 6809100 |
| 2 | leave-yeah 4 "Wide. The café. Every table has two cups. Every cup has your name." | a zoom-in on Nanda; both tables were behind the box; one cup in the whole café | a true wide pan, sharp, no Nanda: two tables, two "you" cups each (`Cafe.jsx` props.cups) | 9b56b9e |

## Open (for Tony)
- CROWD lines (leave-fu 2-3, leave-yeah 2-3): "CROWD" speaks but only Nanda is on screen. Options: café patrons art, or relabel the speaker. Not changed.
- The fail card shows the generic "You left a crumb." on seed 1 run 1 for both leave endings; the leave-specific lines ("You said leave. I heard 'again'." / "You said yes. You lied. Noon again.") only come up on other seeds/runs. Not changed (random by design).
- Leave voice lines are recorded but not wired: see research/sprint-1001/voice/GAPS.md.
