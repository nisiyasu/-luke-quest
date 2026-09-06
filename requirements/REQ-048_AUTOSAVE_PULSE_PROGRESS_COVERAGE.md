# REQ-048 — Autosave Pulse Progress Coverage

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / SAVE-FEEDBACK / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## PLAYER-VISIBLE GAP FOUND BY FRESH AUDIT

`addons/autosave-pulse.js` promises a lightweight `SAVE` pulse after meaningful save/progress changes, but its signature is an older hard-coded subset:

- map / coordinates
- story flag count
- five legacy chest/hidden flags
- gold / herb / smoke counts

Later canonical exploration/progress systems now expose additional persistent flags that are already recognized by the Adventure Record:

- `LQ_TREASURE_CHEST_STATUS.saveFlags`
- `LQ_HIDDEN_FIND_STATUS.flags`
- `LQ_ITEM_TREASURE_CACHE_STATUS.flags`
- optional completion `lqHerbSampleQuestDone`

A save triggered only by one of those later persistent progress flags can therefore be correctly written to storage while the SAVE feedback signature remains unchanged, so the player receives no autosave pulse for that meaningful progress.

This is a feedback/projection coverage gap, not a save-data loss bug.

## REQUIRED REPAIR

1. Keep canonical `save()` as the only persistence owner.
2. Keep autosave pulse presentation-only and pointer-safe.
3. Extend the signature using current canonical status surfaces dynamically, not by copying every new flag into a second permanent list.
4. Retain legacy flag coverage for compatibility.
5. Deduplicate combined flag names.
6. Include current optional completion flags that are meaningful progress but may not affect the old signature.
7. Do not pulse on a genuinely identical save state.
8. Preserve existing rate limiting and visual cleanup.
9. Expose a read-only signature/coverage contract for fail-closed acceptance.

## AUTOMATED ACCEPTANCE

Acceptance must prove:

- canonical save ownership unchanged;
- later chest/hidden/cache arrays contribute dynamically;
- duplicate flag names are deduplicated;
- toggling a later exploration flag changes the signature;
- toggling `lqHerbSampleQuestDone` changes the signature;
- unchanged synthetic state produces identical signatures;
- presentation remains no-progress-mutation / pointer-safe;
- assembled browser and 390x844 iPhone touch/world visual-liveness remain PASS;
- Pages deployment succeeds.

## COMPLETION CONDITION

Requirement + minimal projection repair + dedicated acceptance committed, relevant CI/browser/touch checks PASS, Pages SUCCESS, queue/current synchronized.

Physical/subjective feel remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not redesign the save system;
- do not mutate progress from autosave presentation;
- do not remove legacy save-feedback coverage;
- do not capture later status arrays only once before their add-ons load;
- do not mark physical PASS from CI.