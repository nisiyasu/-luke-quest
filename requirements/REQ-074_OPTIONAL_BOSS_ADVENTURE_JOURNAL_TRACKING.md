# REQ-074 — Optional Boss Adventure Journal Tracking

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / JOURNAL / OPTIONAL-BOSS / SPOILER-SAFE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit after REQ-073 found a distinct player-facing gap. The optional boss `苔角の森王` now appears in completion records after defeat, but the active ADVENTURE JOURNAL does not track the optional objective after the player has physically discovered the giant hoofprints.

The boss must remain spoiler-safe: do not reveal it before the existing `forestMiniBossWarned` discovery flag is set.

## 1. REQUIRED BEHAVIOR

- Before `forestMiniBossWarned`, the journal must not reveal the optional boss objective.
- After `forestMiniBossWarned` and before `forestMiniBossDefeated`, SIDE QUESTS must show a clear optional objective telling the player to investigate the giant hoofprints again.
- After `forestMiniBossDefeated`, the same thread becomes a completed row for `苔角の森王`.
- Existing elder charm, forest bounty and herb sample rows remain unchanged.
- Journal projection is read-only. It must not set/clear boss, bounty, reward, inventory, key-item or story flags.
- No change to boss unlock, battle, reward, story or protected canon.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. no pre-discovery spoiler row;
2. discovered/not-defeated state exposes the repeat-investigation objective;
3. defeated state exposes exactly one completed boss row;
4. original three side-quest definition families remain present;
5. boss journal projection depends on existing flags only;
6. syntax/static/add-on contracts remain PASS;
7. assembled browser regression remains PASS;
8. 390x844 touch/fullscreen visual-liveness remains PASS;
9. Pages deploy SUCCESS.

## 3. NO-STOP

REQ completion is a checkpoint only. Fresh-fetch HEAD, synchronize queue/CURRENT as needed, run GATE C and continue to the next safe useful work.
