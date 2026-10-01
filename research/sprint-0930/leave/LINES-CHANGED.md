# M2 leave: dialogue lines changed (old → new)

| where | old | new | why |
|---|---|---|---|
| v2-home 4, new pick "Say goodnight" (react) | (none: v2-home 4 had one button, "Sit down") | NANDA: …Goodnight? It's only 7:10. | Step 1: the home "Say goodnight" pick now exists in live play. It echoes door 3's line, but door 3's `{TIME}` reads the player's real clock, which clashes with the 7:10 PM kitchen stamp one beat earlier. |
