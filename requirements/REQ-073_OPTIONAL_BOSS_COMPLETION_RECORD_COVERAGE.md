# REQ-073 — Optional Boss Completion Record Coverage

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / JOURNAL / OPTIONAL-BOSS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh integrated audit found that the existing optional forest mini-boss `苔角の森王` sets `s.flags.forestMiniBossDefeated=true`, awards the key item `森王の角`, and is explicitly independent optional content. However both existing completion surfaces omit that real completion:

- `addons/adventure-records.js` OPTIONAL DONE counts only three side-content flags.
- `addons/completion-record.js` COMPLETED lists only those same three side-content completions.

A player can therefore defeat a durable optional boss but still see no completed record/count change. Repair presentation coverage only; do not alter boss mechanics, reward, unlock, combat, story or flags.

## 1. REQUIRED BEHAVIOR

- `forestMiniBossDefeated` is counted in ADVENTURE RECORD OPTIONAL DONE.
- OPTIONAL DONE total changes from 3 to 4 and remains derived from the definition list, not a magic display override.
- COMPLETED includes one row for the defeated optional boss, e.g. type `OPTIONAL BOSS`, name `苔角の森王`.
- Before defeat, no boss completion row/count is shown.
- Existing elder charm, forest bounty and herb sample completion coverage remains intact.
- Presentation remains read-only and must not mutate quest/boss/reward/save state.

## 2. TEST REQUIREMENTS

Automated acceptance must prove:
1. all four optional completion flags count exactly four;
2. only boss flag counts exactly one;
3. no flags count zero;
4. COMPLETED builder emits exactly one boss row when defeated;
5. existing three rows remain unchanged;
6. no duplicate completion definitions;
7. no progress mutation;
8. assembled browser smoke PASS;
9. 390x844 touch/fullscreen regression PASS;
10. Pages deploy SUCCESS.

## 3. NO-STOP

Completion is a checkpoint, not a stop condition. Run GATE C and continue if safe useful work remains.
