# REQ-069 — New Game Existing-Save Overwrite Guard

STATUS: VERIFY
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

## 5. IMPLEMENTATION / VERIFICATION EVIDENCE

- Added `addons/new-game-save-overwrite-guard.js` as a wrapper over canonical `newGame()`; no second new-game path was created.
- Resumable-save detection uses REQ-061 `LQ_TITLE_CONTINUE_STATUS.hasResumableStoredSave()` when present, with equivalent fail-safe screen parsing fallback.
- With resumable progress, first NEW GAME tap only arms a 10-second confirmation and renders an explicit replacement warning; it does not delete or mutate the raw autosave.
- Second deliberate tap while armed invokes the original canonical `newGame()` path. Non-resumable/bootstrap title remains one-tap.
- CONTINUE and SAVE TRANSFER remain in the DOM while confirmation is armed; leaving title disarms the confirmation.
- Added dedicated acceptance `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-new-game-overwrite-guard-smoke.js` proving first-tap byte preservation, second-tap canonical new-game behavior, non-resumable one-tap behavior, and continued availability of CONTINUE/transfer. Its teardown was adversarially hardened to re-render the restored runtime rather than merely restoring HTML strings.
- Checkpoints:
  - `04fb5db888c032a1057ef113ea6b63997c7c620f` — requirement registration.
  - `43b803e1902f8b6c93e631d5752000999642ecc4` — implementation.
  - `73c69a916dca5329022d7a41bc93daac7b512047` — dedicated acceptance.
  - `f8754b8248c5bde19a38a951909043ce37a9a800` — smoke isolation hardening.
- Pages workflow run `34017974207`: SUCCESS. Sequential patches, collision-safe add-ons, static/contract guards, autosave guard, raster/Luke asset gates, assembled browser smoke, 390x844 touch/fullscreen visual-liveness, upload and Pages deployment all passed.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
