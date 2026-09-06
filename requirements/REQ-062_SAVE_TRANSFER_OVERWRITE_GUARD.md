# REQ-062 — Save Transfer Existing-Progress Overwrite Guard

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / TRANSFER / DATA-SAFETY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FROM_REQ060_POST_AUDIT
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / RISK

REQ-060 correctly rejects invalid transfer codes before state mutation, but a syntactically valid transfer code could replace an already-resumable local adventure immediately when IMPORT was pressed.

On iPhone this was a meaningful data-loss risk: a player testing/pasting the wrong valid SAVE CODE could overwrite the browser-local canonical autosave before realizing it.

## 1. REQUIRED BEHAVIOR

- Fresh browser / no resumable local adventure: valid SAVE CODE imports in one deliberate IMPORT action.
- Browser with an existing resumable adventure: first IMPORT action does NOT mutate `s` or canonical autosave.
- First guarded action clearly warns that the current local adventure will be replaced.
- A second explicit IMPORT action within a bounded confirmation window may proceed.
- Editing/replacing the code after arming cancels confirmation.
- Confirmation expires automatically.
- Invalid transfer code remains rejected by REQ-060 without state mutation.
- Existing COPY SAVE CODE, manual slots, title import, world/pause import, touch/fullscreen behavior remain intact.

## 2. IMPLEMENTATION

### `addons/transfer-import-overwrite-guard.js`

- confirmation window: 12 seconds;
- uses REQ-061 `hasResumableStoredSave()` when available, with a fail-safe intro/world/battle fallback;
- validates the incoming transfer through REQ-060 `prepareImportedState()` before arming overwrite confirmation;
- capture-phase interception of `.lqTransfer .import` prevents the first valid overwrite from reaching the existing import listener;
- first guarded press records a code hash + expiry and displays an explicit second-press warning;
- second matching press inside the window disarms the guard and allows the canonical REQ-060 import path to execute;
- editing the textarea disarms confirmation;
- timeout expiry disarms confirmation and shows expiry feedback;
- malformed/invalid codes never get promoted into an overwrite confirmation bypass.

### `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-transfer-overwrite-guard-smoke.js`

Fail-closed acceptance covers:
- existing save first-click no-mutation interception;
- visible warning;
- second-click import;
- input-change disarm;
- expiry/re-arm logic;
- malformed code REQ-060 fail-closed behavior;
- fresh-title single-action import;
- title/pause transfer UI presence;
- manual backup preservation.

## 3. CHECKPOINTS

- requirement registration: `11ad46e6d1fbca43a40fe60618d2d1730bcd2fcf`
- implementation: `634e6287b333ea2d7644df616a8f606a7757ec85`
- dedicated acceptance: `38c3d61e399a51b81c4bf8e49ba33a0cd8495bc3`
- exact queue-history self-repair + VERIFY synchronization: `8873fada6835ce7eb58c13191e792e96658945da`

## 4. VERIFICATION

Authoritative Pages workflow run `34015640423`: SUCCESS.

Observed successful stages:
- sequential JavaScript validation: PASS;
- collision-safe add-on validation: PASS;
- static regression guard: PASS;
- add-on contract guard: PASS;
- PWA/raster/Luke asset validation: PASS;
- assembled browser smoke including REQ-062 dedicated fail-closed runtime acceptance: PASS;
- 390x844 floating-touch + iPhone world visual-liveness regression: PASS;
- Pages upload: PASS;
- Pages deploy: PASS.

Physical iPhone overwrite-confirmation feel remains `IOS_PHYSICAL_VERIFICATION=PENDING` and is not claimed by automation.

## 5. ACCEPTANCE

1. fresh/non-resumable browser allows valid import without guard — PASS
2. existing world save first IMPORT intercepted with no `s`/localStorage mutation — PASS
3. warning feedback visible — PASS
4. second action within confirmation window permits REQ-060 import — PASS
5. code input change disarms confirmation — PASS
6. confirmation expiry/re-arm logic — PASS
7. malformed code remains fail closed — PASS
8. title and pause transfer UIs remain available — PASS
9. manual backup contract remains intact — PASS
10. assembled browser smoke — PASS
11. 390x844 touch/fullscreen regression — PASS
12. Pages deploy — PASS (`34015640423`)

## 6. SELF-AUDIT / QUEUE REPAIR

During REQ-062 queue synchronization, an update accidentally shortened/reworded historical NOTE cells for existing requirements. `EXECUTION_DEGRADATION_DETECTED` was raised immediately.

Repair was performed from the known-good pre-REQ-062 `WORK_QUEUE.md` at commit `5e3c1b73acae03ef08157a222fc84ced8c1f75a9`: all prior rows and status/selection/invariant text were restored from that exact source, then only the REQ-062 row was added and advanced to VERIFY. The repair checkpoint is `8873fada6835ce7eb58c13191e792e96658945da`.

## 7. NO-STOP

Completion is a checkpoint, not a stop condition. Fresh-fetch HEAD, synchronize CURRENT, run GATE C, and continue when safe work remains.
