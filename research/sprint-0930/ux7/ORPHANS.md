# Orphan voice-manifest entries (M7a)

Method: normalize each manifest text (voice.js `norm`) and compare to every string in packs/*.json + scenes.json (tags stripped). 233 entries, 13 had no exact match; each checked by hand.

## Removed (no scene, test, or script references them)
- `v2-train` beat `3 run 1` -> `06-v2-train/033_3-run-1.mp3` ("Twelve stops. I count them on my fingers. See?") - line no longer exists in any pack.
- `v2-train` beat `N 3` -> `narration/v2-train/298_3.mp3` ("Two men bump her bag. They laugh.") - scene now says "...bump into her..." (new take exists).
Also removed from voice/timing.json, and the two mp3 files from public/. Also removed from research/sprint-0930/voice/audio-manifest.json (a test requires it to mirror the slim manifest).
- park-4 narration (`253_4`) was already dropped by r6 earlier; nothing left.

## Not orphans (false positives of the script; token/markup differences, still played)
rooftop 6, rooftop N 10, platform N 2, leave-fu/leave-yeah N 2-3 (`{OR}` token), v2-train 5 crowd (`{wavy:}` spans).

## Flagged, NOT removed (text drift: scene wording differs from the take, so the lookup misses -> silent)
- steeped 3 (`059_3`): scene "いつまでも一緒。…F{OR}ever. ね？" vs take "…Forever. Neee?"
- escape-timeout 4 (u)/(t) (`066_4-u`, `067_4-t`): scene "…ね？" vs take "…Neee?" (route B, other agent's lane)
Decision for Tony: re-record, or change the scene text back to match.
