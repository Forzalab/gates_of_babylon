# VISUAL GAPS: storyboard audit of the date-beta play path

Source: `storyboard.mjs` (every beat + reaction frame, `?still`). Routes: love (tamagoyaki, groceries, butter chicken,
tea -> steeped), neutral (umeboshi, library, katsu, stand up -> unknown -> escape-win), hate (neither, alone -> shop,
not hungry, say goodnight -> leave -> leave-fu), timeout (unknown -> lock game timeout), yeah (leave -> leave-yeah).
Pass 1 = sprint/obbp as it was (before sequences.json). Pass 2 = after merging sprint/sequences + art/shots.
Legend: GREY = grey box / missing art, BORROWED = another place's art, CLIP = something cut or covered,
PPT = "PowerPoint": the same frame for 3+ beats, no change of shot.

## Pass 1 (obbp baseline)
No grey boxes on any route: every missing bg has a fallback.

| beats | problem | kind |
|---|---|---|
| park 0-4 (5 beats + 3 reactions) | rooftop clock tower art, the same frame as rooftop 0-6. The date "moves to the park" and nothing changes on screen. | BORROWED, PPT |
| rooftop 0-6 + park 0-4 | 12 beats in one frame: Nanda centre, the same crop. | PPT |
| errand-library 0-4 | a rail crossing. The library is never shown. The book is only talked about. | BORROWED |
| errand-shop 0-5 | shop street, one frame for 6 beats. No groceries or cups are shown. | PPT |
| hungry 0-2 | the big crossing (crossing-day). The food choice has no restaurant and no dish. | BORROWED, PPT |
| town 0-9 | 10 beats on crossing-day, the same frame as hungry. Town 4-6 are 3-4 line text walls. | PPT |
| train 0-1 / naan 0-1 | good: a zoom insert on the ad and a platform wide. The best shot variety in the game. | ok |
| blackout 0-9, escape 9/11, escape-win 4, escape-timeout 1 | a black frame with no text: 5 to 7 empty beats in a row. They read as a bug on a projector. | GREY-ish |
| platform 0-2, station-talk 0-4 | one frame for 8 beats. A figure silhouette stands next to Nanda on every beat. | PPT |
| rain-crossing 0-4 | one frame for 5 beats. The umbrella is never drawn. | PPT |
| walk-home 0-5 | street-day, then dusk at beat 2. The only light change in the game. The key is never drawn. | ok / PPT |
| door 0-3 | stairs (Door fallback), then the door. Rain at the door, but the walk-home before it was dry dusk. | continuity |
| genkan-in 0-2 | fallback genkan art, no Nanda (fine). | ok |
| cup 0-3 / steeped | TeaTable fallback: one frame for 9 beats. | PPT |
| escape-timeout 0 | "The ladder creaks. She's coming down." is shown on the GENKAN art (BG-D3 fallback), not the basement. | wrong art |
| escape 13 lock game | the 4x4 board is small in the middle of a black frame (about 25% of the width). | scale |
| escape-win 6 | the WIN route ends on "GAME OVER, She does not love you enough, 26%". | end card (story) |
| every talk beat | the say box covers Nanda from the chest down. Her bubble collides with the choice bar when choices are raised. | CLIP |
| rooftop 5 / park 4 / town 3 / station-talk 1 | the clock in the lines says 3:15-3:23 AM, but the art is noon sun (rooftop clock at 12). A literal viewer asks "what time is it?". | continuity |
| every scene change | no place or time card anywhere. | RUBRIC A3/B1 |

## Pass 2 (after sequences.json + art/shots)
See the end of this file (appended after the re-run).
