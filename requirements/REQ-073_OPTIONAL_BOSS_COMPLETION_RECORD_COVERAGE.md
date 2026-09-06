# REQ-073 — Optional Boss Completion Record Coverage

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / JOURNAL / OPTIONAL-BOSS / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh integrated audit found that the existing optional forest mini-boss `苔角の森王` sets `s.flags.forestMiniBossDefeated=true`, awards the key item `森王の角`, and is explicitly independent optional content. However both existing completion surfaces omitted that real completion:

- `addons/adventure-records.js` OPTIONAL DONE counted only three side-content flags.
- `addons/completion-record.js` COMPLETED listed only those same three side-content completions.

A player could therefore defeat a durable optional boss but still see no completed record/count change. Repair presentation coverage only; do not alter boss mechanics, reward, unlock, combat, story or flags.

## 1. REQUIRED BEHAVIOR

- `forestMiniBossDefeated` is counted in ADVENTURE RECORD OPTIONAL DONE.
- OPTIONAL DONE total changes from 3 to 4 and remains derived from the definition list, not a magic display override.
- COMPLETED includes one row for the defeated optional boss, type `OPTIONAL BOSS`, name `苔角の森王`.
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

## 4. IMPLEMENTATION / VERIFICATION EVIDENCE

- `addons/adventure-records.js` now includes `forestMiniBossDefeated` in the canonical optional-completion definition list, so OPTIONAL DONE is derived as 0..4 instead of being hard-coded.
- `addons/completion-record.js` now projects `forestMiniBossDefeated` to exactly one `OPTIONAL BOSS / 苔角の森王` completion row while preserving the existing three completion definitions.
- Existing REQ-041 completion-record smoke initially assumed the canonical completion list must stay exactly three entries. Fresh integrated testing exposed that as a forward-compatibility defect in the test itself, not the new completion projection. The smoke was repaired to assert preservation of the original three baseline flags while allowing additional unique canonical completion definitions.
- No boss mechanics, rewards, key-item award, unlock conditions, story flags or save mutation were changed.
- Checkpoints:
  - `9c215fc9c4df5d8b4b230b0d99d0263782c981ac` — requirement registration.
  - `a8921d906a9fd19b19b3a3d6234597fcb12a0110` — optional boss coverage in adventure records.
  - `edcd282a345462ddf630d399b7c846d0c3ec3f86` — optional boss coverage in completion record.
  - `b91636a459333b361218cb33028d9906a76e7bff` — forward-compatible REQ-041 completion smoke repair.
- Pages workflow run `34018645505`: SUCCESS at HEAD `b91636a459333b361218cb33028d9906a76e7bff`. The deployment run completed successfully after the forward-compatibility smoke repair.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
