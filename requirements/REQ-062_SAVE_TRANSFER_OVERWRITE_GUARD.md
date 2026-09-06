# REQ-062 — Save Transfer Existing-Progress Overwrite Guard

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SAVE / TRANSFER / DATA-SAFETY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FROM_REQ060_POST_AUDIT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / RISK

REQ-060 correctly rejects invalid transfer codes before state mutation, but a syntactically valid transfer code can currently replace an already-resumable local adventure immediately when IMPORT is pressed.

On iPhone this is a meaningful data-loss risk: a player testing/pasting the wrong valid SAVE CODE could overwrite the browser-local canonical autosave before realizing it.

## 1. REQUIRED BEHAVIOR

- Fresh browser / no resumable local adventure: valid SAVE CODE imports in one deliberate IMPORT action.
- Browser with an existing resumable adventure: first IMPORT action must NOT mutate `s` or canonical autosave.
- First guarded action must clearly warn that the current local adventure will be replaced.
- A second explicit IMPORT action within a bounded confirmation window may proceed.
- Editing/replacing the code after arming must cancel the confirmation.
- Confirmation must expire automatically.
- Invalid transfer code remains rejected by REQ-060 and must never consume/skip the safety contract in a way that mutates state.
- Existing COPY SAVE CODE, manual slots, title import, world/pause import, touch/fullscreen behavior remain intact.

Do not use a modal flow that can strand touch/movement state. Prefer a compact two-step button confirmation in the existing transfer UI.

## 2. COMPATIBILITY

Use REQ-061's resumable-save predicate when available rather than raw localStorage-key existence, because fresh bootstrap title storage is not actual progress.

Fail safe if the validity helper is unavailable: do not silently weaken protection for a real current world/intro/battle state.

## 3. ACCEPTANCE

Automated acceptance must prove:

1. fresh/non-resumable browser allows valid import without guard;
2. existing world save first IMPORT is intercepted with no `s`/localStorage mutation;
3. warning feedback is visible;
4. second action within the confirmation window permits the existing REQ-060 import;
5. code input change disarms the confirmation;
6. confirmation expiry disarms it;
7. malformed code still fails closed;
8. title and pause transfer UIs remain available;
9. manual backup contract remains intact;
10. assembled browser smoke PASS;
11. 390x844 touch/fullscreen regression PASS;
12. Pages deploy SUCCESS.

Physical iPhone feel remains PENDING unless genuinely observed.

## 4. NO-STOP

Completion is a checkpoint, not a stop condition. Fresh-fetch HEAD, synchronize queue/CURRENT, run GATE C, and continue when safe work remains.
