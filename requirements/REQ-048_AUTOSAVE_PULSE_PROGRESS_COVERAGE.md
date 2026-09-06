# REQ-048 — Autosave Pulse Progress Coverage

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / SAVE-FEEDBACK / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## PLAYER-VISIBLE GAP FOUND BY FRESH AUDIT

`addons/autosave-pulse.js` promised a lightweight `AUTOSAVE` pulse after meaningful progress changes, but its signature was an older hard-coded subset.

Later canonical exploration/progress systems expose additional persistent flags already recognized elsewhere by the Adventure Record:

- `LQ_TREASURE_CHEST_STATUS.saveFlags`
- `LQ_HIDDEN_FIND_STATUS.flags`
- `LQ_ITEM_TREASURE_CACHE_STATUS.flags`
- optional completion `lqHerbSampleQuestDone`

A save triggered only by one of those later persistent progress flags could therefore be correctly written while the SAVE feedback signature stayed unchanged, leaving the player without autosave feedback for that meaningful progress.

This was a feedback/projection coverage gap, not save-data loss.

## IMPLEMENTED REPAIR

`addons/autosave-pulse.js` remains presentation-only and keeps canonical `save()` untouched.

It now:

- retains the legacy major-progress flag set for compatibility;
- includes the current optional completion flags, including `lqHerbSampleQuestDone`;
- dynamically resolves later chest / hidden-find / item-cache status arrays when the signature is calculated, avoiding early load-order capture;
- merges all progress flag names through a `Set`, preventing duplicate contribution;
- builds a deterministic `[flagName, boolean]` signature;
- changes the pulse trigger only when map or meaningful progress signature changes;
- leaves identical state silent;
- preserves existing one-at-a-time pulse replacement, timeout cleanup and pointer safety;
- exposes read-only `dynamicProgressFlags()` and `progressSignature()` acceptance helpers plus a no-mutation contract.

No second save system or progress mutation was introduced.

## DEDICATED ACCEPTANCE

Added:

`addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzz-autosave-pulse-progress-coverage-smoke.js`

Under `lqTouchSmoke` it fails closed unless:

- canonical save ownership remains `index.html save()`;
- presentation-only/no-progress-mutation and pointer-safe contracts remain true;
- synthetic later chest, hidden-find and item-cache flags are dynamically included;
- duplicate flag names deduplicate to one;
- `lqHerbSampleQuestDone` is covered;
- an unchanged synthetic state produces an identical signature;
- changing a later exploration flag changes the signature;
- changing the herb-sample completion flag changes the signature.

## VERIFICATION EVIDENCE

- requirement registration: `ab62ddd19a657a4055f34748a762dc497b8a57ab`
- implementation: `1c69e5f849430193abf760ed14ad697eb1506c81`
- dedicated acceptance: `d6c6728adf6ca13ed92682b0049f9a7576468b3d`
- Pages workflow run `34010704113`: SUCCESS
- PASS steps include:
  - sequential JavaScript patch validation
  - collision-safe add-on validation
  - static regression guard
  - add-on contract guard
  - assembled browser smoke
  - 390x844 floating-touch + iPhone world visual-liveness smoke
  - Pages upload/deploy

## COMPLETION CONDITION

Automated implementation completion is satisfied.

Physical/subjective feel remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not redesign the save system;
- do not mutate progress from autosave presentation;
- do not remove legacy save-feedback coverage;
- do not capture later status arrays only once before their add-ons load;
- do not mark physical PASS from CI.