# REQ-042 — Adventure Record Accuracy

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / RECORDS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh integrated inventory found that `addons/adventure-records.js` has drifted behind later gameplay systems.

Current record logic:

- `OPTIONAL DONE` counts only `elderCharmComplete` + `forestBountyComplete` and displays `/2`;
- Adventure Journal / COMPLETED now also recognize `lqHerbSampleQuestDone`, making the current side-content completion total 3;
- `TREASURE FINDS` currently hard-codes five legacy flags;
- later canonical exploration systems expose additional persistent find flags through:
  - `LQ_TREASURE_CHEST_STATUS.saveFlags` — 3 treasure chests;
  - `LQ_HIDDEN_FIND_STATUS.flags` — 3 hidden finds;
  - `LQ_ITEM_TREASURE_CACHE_STATUS.flags` — 3 item caches.

Therefore the records screen can under-report real player progress even though the underlying canonical flags are correct.

## REQUIRED IMPLEMENTATION

Repair the records projection only. Do not change gameplay flags or rewards.

1. Preserve existing legacy treasure flags in the count.
2. Add current exploration-system flags dynamically from their published status surfaces.
3. Deduplicate flag names before counting, so a flag can never count twice.
4. Keep the record read-only; never create or set completion flags.
5. Update optional completion to include `lqHerbSampleQuestDone` and display `/3`.
6. Keep existing battle wins / monsters down / areas / level rows unchanged.
7. Keep pause-menu presentation compact and non-interactive.
8. Do not create new treasure, quests, rewards, save schema or progression.

## LOAD-ORDER SAFETY

`adventure-records.js` loads alphabetically before several later exploration add-ons, but its row calculation executes when pause/world rendering occurs after all assembled scripts have loaded. The implementation must resolve external status surfaces at calculation time rather than capturing them once at module initialization.

## AUTOMATED ACCEPTANCE

Expose pure/read-only helpers or status metadata to verify:

- the 5 legacy treasure flag names remain recognized;
- current chest/hidden/cache status flags are dynamically included;
- duplicate flag names are deduplicated;
- true flags count correctly without mutation;
- optional completion recognizes all 3 canonical side-content completion flags;
- `/3` total is reflected in the live presentation contract;
- existing record categories remain.

Dedicated smoke under `lqTouchSmoke` must use synthetic flag/status inputs where possible and fail closed on projection drift.

## COMPLETION CONDITION

Automated completion requires:

- requirement + implementation committed;
- JavaScript syntax PASS;
- static/add-on regression PASS;
- assembled browser smoke PASS;
- dedicated adventure-record accuracy acceptance PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the corrected record on iPhone.

## DO NOT REPEAT

- do not replace canonical treasure/quest systems;
- do not set flags from the records presentation;
- do not remove legacy progress from the count;
- do not hard-code only the latest system and erase older finds;
- do not mark iPhone physical readability PASS from headless CI.