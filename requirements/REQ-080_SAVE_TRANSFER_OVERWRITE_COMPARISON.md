# REQ-080 — Save Transfer Overwrite Comparison

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / PLAYER-SAFETY / UX
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FOLLOW_THROUGH
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

REQ-062 already prevents one-tap replacement of an existing resumable browser-local adventure. REQ-068/071/079 now shows the incoming SAVE CODE summary and creation time. The remaining safety gap is that the destructive confirmation message does not identify the current local adventure being replaced, making stale-code rollback harder to judge on a small iPhone screen.

## 1. REQUIRED BEHAVIOR

- When REQ-062 arms the second-tap overwrite confirmation, show a compact CURRENT vs IMPORT comparison.
- CURRENT must be derived read-only from the current canonical runtime state/local resumable save; IMPORT must reuse the existing REQ-060/068 validation/preview authorities where available.
- Minimum visible comparison: LV, location, and G for current and imported saves; imported creation time should remain visible through the existing preview.
- Do not create a second import parser or bypass `prepareImportedState()`.
- Do not mutate canonical state/localStorage while merely arming or rendering the comparison.
- The existing 12-second REQ-062 confirmation expiry, code-change disarm, fresh-browser one-step import, invalid-code fail-closed behavior, and final import authority remain unchanged.
- If summary data is unavailable, fall back to the existing safe overwrite warning rather than blocking a valid transfer.
- No protected story spoilers.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. existing resumable progress + valid different SAVE CODE arms confirmation without mutation;
2. armed feedback includes CURRENT and IMPORT summaries with LV/location/G;
3. IMPORT data comes from existing transfer preparation/preview authority;
4. second identical click still executes through the existing authority;
5. changed code and timeout still disarm;
6. fresh/non-resumable browser remains one-step;
7. invalid code remains fail-closed;
8. no duplicate event path/import parser is introduced;
9. assembled browser smoke PASS;
10. 390x844 touch/fullscreen visual-liveness PASS;
11. Pages deploy SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C, and continue while safe useful work remains.
