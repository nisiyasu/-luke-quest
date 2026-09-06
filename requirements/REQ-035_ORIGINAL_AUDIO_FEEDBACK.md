# REQ-035 — Original Audio Feedback / SE foundation

STATUS: SUPERSEDED
PRIORITY: P1
TYPE: AUDIO / PLAYER_FEEDBACK / POLISH / ACCESSIBILITY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
SUPERSEDED_BY: EXISTING_IMPLEMENTATION `ux-v83.js` + `ux-v138.js` + `addons/audio-dedup-v138.js`

## SELF-AUDIT CORRECTION

This requirement was registered after an incomplete filename/code-search inventory incorrectly concluded that no audio implementation existed.

A deeper fresh repository inventory immediately found existing canonical audio work:

- `ux-v83.js`: original Web Audio door / chest / clue SFX plus `LQ_sfx` integration
- `ux-v138.js`: original exploration interaction SFX and `action()` integration
- `addons/audio-dedup-v138.js`: collision-safe ownership/dedup so legacy and v0.138 exploration sounds do not double-fire

Therefore implementing this requirement would duplicate already committed functionality and violate the HEAD-first / DO_NOT_REPEAT rules.

## DISPOSITION

- No duplicate SE implementation will be added.
- Existing audio implementation remains canonical.
- This row/file is retained as an audit trail instead of deleting or rewriting history.
- Future audio work must inventory existing v0.83/v0.138 ownership before changing the sound stack.

## DO NOT REPEAT

- Do not trust code-search no-result as proof that a capability is absent.
- Inventory filenames/directories and known sequential patch history before registering a new final-game capability.
- Do not add a second exploration `action()` SFX wrapper that would duplicate v0.138 ownership.