# REQ-042 — Adventure Record Accuracy

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / RECORDS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh integrated inventory found that `addons/adventure-records.js` had drifted behind later gameplay systems.

Before repair:

- `OPTIONAL DONE` counted only `elderCharmComplete` + `forestBountyComplete` and displayed `/2`;
- Adventure Journal / COMPLETED also recognize `lqHerbSampleQuestDone`, making the current side-content completion total 3;
- `TREASURE FINDS` hard-coded five legacy flags;
- later canonical exploration systems expose additional persistent find flags through:
  - `LQ_TREASURE_CHEST_STATUS.saveFlags` — 3 treasure chests;
  - `LQ_HIDDEN_FIND_STATUS.flags` — 3 hidden finds;
  - `LQ_ITEM_TREASURE_CACHE_STATUS.flags` — 3 item caches.

Therefore the records screen could under-report real player progress even though underlying canonical flags were correct.

## IMPLEMENTATION

`addons/adventure-records.js` remains a read-only records projection and now:

1. preserves the five legacy treasure flag names;
2. resolves later exploration-system status surfaces at calculation time, avoiding module-load-order capture bugs;
3. merges chest / hidden-find / item-cache flag arrays dynamically;
4. deduplicates all flag names through a Set before counting;
5. counts only truthy flags from the supplied/current `s.flags`;
6. recognizes all three optional completion flags, including `lqHerbSampleQuestDone`;
7. displays `OPTIONAL DONE x/3` using the canonical optional definition length;
8. leaves battles won / monsters down / areas / level rows unchanged;
9. writes no progress, rewards, quest flags, treasure flags or save data.

Status surface:

`window.LQ_ADVENTURE_RECORD_STATUS`

exposes presentation-only ownership, the five legacy treasure flags, three optional flags, optional total, pure/dynamic flag-list and counting helpers, and `noProgressMutation:true`.

## LOAD-ORDER SAFETY

`adventure-records.js` loads before several later exploration add-ons. Dynamic status arrays are therefore read inside `treasureFlagList(source)` each time the record is calculated, not captured at module initialization. By the time the pause/world record is rendered in the assembled game, later add-ons are available.

## DEDICATED ACCEPTANCE

`addons/zzzzzzzzzzzzzzzzzzzzzz-adventure-record-accuracy-smoke.js` runs under `?lqTouchSmoke=1` and verifies:

- presentation-only/no-mutation contract;
- five legacy treasure definitions remain;
- all three optional completion flags are present;
- synthetic chest/hidden/cache status arrays are dynamically merged;
- duplicate flag names are deduplicated;
- synthetic true-flag counts are correct;
- optional 3/3 and herb-only helper behavior;
- live assembled status surfaces contribute current chest, hidden-find and item-cache flags;
- live list remains unique;
- existing record categories remain.

Any failed condition triggers a fail-closed uncaught runtime marker consumed by the existing browser workflow error detector.

## VERIFICATION EVIDENCE

Checkpoints:

- requirement registration: `7fb67848cccbd48528ec444e8671656387b63bfb`
- implementation: `c7d159b148190128dde0c504bf687c160b8a502a`
- dedicated acceptance: `a2d96384ba48dd6b47e061b74f19be3a7d37ee7a`

Pages workflow run `34009625492`: SUCCESS.

Verified in that run:

- sequential JavaScript syntax: SUCCESS
- collision-safe add-ons syntax: SUCCESS
- static regression guard: SUCCESS
- add-on contract guard: SUCCESS
- PWA/assets validation: SUCCESS
- assembled browser world/movement/interaction/battle/save smoke: SUCCESS
- dedicated adventure-record accuracy smoke did not trip its fail-closed runtime marker
- 390x844 floating-touch + fullscreen visible-world regression: SUCCESS
- Pages upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated completion is satisfied.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the corrected ADVENTURE RECORD on iPhone.

Therefore REQ-042 is `VERIFY`, not DONE.

## DO NOT REPEAT

- do not replace canonical treasure/quest systems
- do not set flags from the records presentation
- do not remove legacy progress from the count
- do not capture later add-on status arrays only once at module initialization
- do not hard-code only the latest system and erase older finds
- do not mark iPhone physical readability PASS from headless CI