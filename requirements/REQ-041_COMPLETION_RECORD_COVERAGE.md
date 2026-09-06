# REQ-041 — Completion Record Coverage

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / JOURNAL / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh integrated inventory found a consistency gap between two existing canonical presentation surfaces:

- `addons/adventure-journal.js` tracks three side-content lines:
  - `elderCharmComplete` — 旅好きの老人の銀留め具
  - `forestBountyComplete` — 森の討伐依頼
  - `lqHerbSampleQuestDone` — 森の薬草標本
- `addons/completion-record.js` was explicitly the completed side-content record, but listed only the first two completion flags.

Therefore a completed herb-sample quest could remain visible as done in ADVENTURE JOURNAL but absent from the dedicated COMPLETED record. No new quest mechanics or flags were needed.

## IMPLEMENTATION

`addons/completion-record.js` remains the single dedicated COMPLETED presentation and now uses one `COMPLETION_DEFS` definition table covering:

- `elderCharmComplete` — 旅人の銀留め具
- `forestBountyComplete` — 魔物の森・安全確認
- `lqHerbSampleQuestDone` — 森の薬草標本

A pure `completionRows(flags)` builder filters completed entries and is reused by the live pause-menu presentation and smoke acceptance.

Safety:

- quest flags are read-only;
- no rewards/inventory/save/story mutation;
- unfinished quests are not emitted;
- each flag has one definition, preventing duplicate completion rows;
- existing compact pause-menu placement remains;
- presentation remains non-interactive.

Status surface:

`window.LQ_COMPLETION_RECORD_STATUS`

records presentation-only ownership, all three canonical completion flags, existing elder/bounty coverage, herb-sample coverage, pure row builder and no-quest-mutation contract.

Dedicated acceptance:

`addons/zzzzzzzzzzzzzzzzzzzzz-completion-record-coverage-smoke.js`

runs under `?lqTouchSmoke=1`, exercising the pure builder with all-three / herb-only / none inputs and verifying:

- all three canonical completions are represented;
- existing two completions remain;
- herb sample resolves to `森の薬草標本`;
- no duplicate flags;
- empty state emits no false completed rows;
- no quest mutation contract.

Failure triggers a fail-closed uncaught runtime marker consumed by the existing workflow detector.

## VERIFICATION EVIDENCE

Checkpoints:

- requirement registration: `3eb2b66840a72cc6e681d144314b26d5895893fe`
- implementation: `a6469fd3e0c226b452b60c4f0aa1f9312bcaae2d`
- dedicated acceptance: `4d0ae57b5b2b0f12748fc3f459df31316a85ad0f`

Pages run `34009418972` at the dedicated acceptance checkpoint: SUCCESS.
A later assembled-head run `34009469016`, containing REQ-041 plus the subsequent integrated HUD self-repairs, also completed SUCCESS.

Latest integrated verification passed:

- sequential JavaScript syntax;
- collision-safe add-ons syntax;
- static regression guard;
- add-on contract guard;
- PWA/assets validation;
- assembled browser gameplay smoke;
- completion coverage fail-closed smoke;
- 390x844 floating-touch/world visual-liveness;
- upload and Pages deployment.

## COMPLETION CONDITION

Automated completion is satisfied.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the completed quest list on iPhone.

Therefore REQ-041 is `VERIFY`, not DONE.

## DO NOT REPEAT

- do not add a new quest state machine;
- do not rewrite adventure-journal quest authority;
- do not mark unfinished quests complete;
- do not create new rewards;
- do not remove previously supported completion rows;
- do not mark iPhone physical readability PASS from headless CI.