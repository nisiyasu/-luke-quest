# REQ-069 — New Game Existing-Save Overwrite Guard

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / TITLE / DATA-LOSS-PREVENTION / PLAYER-UX
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FOLLOW_THROUGH_FROM_SAVE_PORTABILITY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Fresh base-code audit found that title `newGame()` immediately executes `localStorage.removeItem('lukeQuestV2')`. When a resumable adventure exists, a single accidental tap on `冒険をはじめる` can destroy the local continuation that REQ-060 through REQ-068 worked to make portable and recoverable.

## 1. REQUIRED BEHAVIOR

- If no resumable save exists, NEW GAME remains one-tap and unchanged.
- If a resumable save exists, first NEW GAME tap must not delete or mutate that save.
- First tap arms a short explicit destructive confirmation and clearly warns that current local progress will be replaced.
- Only a second deliberate tap within the confirmation window may invoke the canonical existing `newGame()` implementation.
- Confirmation expires automatically and is disarmed by leaving title/re-rendering into a non-title screen.
- CONTINUE and SAVE TRANSFER remain available while confirmation is armed.
- Do not create a second new-game implementation; wrap the canonical existing function.

## 2. SAFETY

- Use REQ-061 resumable-save authority when available rather than raw storage-key existence.
- Never delete autosave on the first guarded tap.
- Never alter save-transfer schema or import behavior.
- Existing title bootstrap/non-resumable save must not create a fake destructive warning.

## 3. TEST REQUIREMENTS

Automated acceptance must prove: resumable first tap preserves raw save bytes; second confirmed tap follows canonical new-game path; confirmation expiry/disarm is safe; non-resumable title remains one-tap; CONTINUE/transfer remain present on first tap; assembled browser smoke PASS; 390x844 regression PASS; Pages deploy SUCCESS.

## 4. NO-STOP

Completion is a checkpoint, not a stop condition.
