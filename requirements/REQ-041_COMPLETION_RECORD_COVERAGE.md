# REQ-041 — Completion Record Coverage

STATUS: IN_PROGRESS
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
- `addons/completion-record.js` is explicitly the completed side-content record, but currently lists only the first two completion flags.

Therefore a completed herb-sample quest remains visible as done in ADVENTURE JOURNAL but is absent from the dedicated COMPLETED record. No new quest mechanics or flags are needed.

## REQUIRED IMPLEMENTATION

Extend the existing completion record to cover all currently journaled completed side-content without creating a second completion system.

Required behavior:

1. Keep `completion-record.js` as the single dedicated COMPLETED presentation.
2. Add the existing `s.flags.lqHerbSampleQuestDone` completion state.
3. Display a concise canonical label matching the adventure journal: `森の薬草標本`.
4. Preserve existing `elderCharmComplete` and `forestBountyComplete` rows.
5. Do not mutate quest flags, rewards, inventory, save data, main story or journal state.
6. Do not duplicate unfinished/in-progress quest rows; this surface remains completion history only.
7. Preserve compact pause-menu presentation and iPhone world/fullscreen behavior.
8. Presentation must remain non-interactive and not interfere with MENU/touch controls.

## AUTOMATED ACCEPTANCE

Expose enough read-only status metadata to verify:

- completion record recognizes all three canonical completion flags;
- herb-sample completion is included;
- presentation-only/no state mutation contract;
- no duplicate completion rows for a single flag;
- existing elder charm and forest bounty support remains.

Dedicated smoke under `lqTouchSmoke` should exercise a pure row-builder/status helper rather than permanently mutating quest state.

## COMPLETION CONDITION

Automated completion requires:

- requirement + implementation committed;
- JS syntax PASS;
- static/add-on regression PASS;
- assembled browser smoke PASS;
- dedicated completion coverage acceptance PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees the completed quest list on iPhone.

## DO NOT REPEAT

- do not add a new quest state machine;
- do not rewrite adventure-journal quest authority;
- do not mark unfinished quests complete;
- do not create new rewards;
- do not mark iPhone physical readability PASS from headless CI.