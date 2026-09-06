# REQ-068 — Save Transfer Import Preview

STATUS: VERIFY
PRIORITY: P1
TYPE: SAVE / CROSS-BROWSER / PLAYER-UX / SAFETY
OWNER_REQUEST: DIRECT_FOLLOW_THROUGH_FROM_CROSS_BROWSER_SAVE_TRANSFER
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Cross-browser transfer now supports SAVE CODE, file load and native share. Before an imported adventure can overwrite or replace local progress, show the player what valid transfer data contains so the choice is understandable rather than blind.

## 1. REQUIRED BEHAVIOR

- Existing SAVE TRANSFER boxes show a compact non-mutating preview when the textarea contains a valid transfer code.
- Preview uses the existing REQ-060 validation/normalization authority; it must not parse into a parallel unsafe state path.
- Show only player-safe summary fields such as LV, location/map label, HP/MP and G.
- Invalid/unsupported code shows no fake adventure summary and never mutates canonical state.
- File load automatically refreshes the same preview because REQ-064 already populates the existing textarea/input path.
- Existing REQ-062 overwrite guard remains the authority for final import confirmation.
- No second save schema and no direct import merge.

## 2. SAFETY

- Preview is read-only.
- Do not call `save()`, assign `s`, merge flags, modify localStorage or consume inventory/economy.
- Do not expose protected story secrets beyond state already represented by the player's own portable save.
- Unknown map labels fall back safely to the map id or a neutral label.

## 3. TEST REQUIREMENTS

Automated acceptance must prove valid preview summary, invalid fail-closed behavior, no canonical-state mutation, file/input event compatibility, no duplicate preview nodes/listeners, existing SAVE CODE/file/native-share flows preserved, assembled browser smoke PASS, 390x844 regression PASS and Pages deploy SUCCESS.

## 4. NO-STOP

Completion is a checkpoint. Do not stop while another safe useful requirement can be selected.

## 5. IMPLEMENTATION / VERIFICATION EVIDENCE

- Added `addons/save-transfer-preview.js` as a read-only view over the existing REQ-060 `prepareImportedState()` validation/normalization authority.
- Valid SAVE CODE input now renders `IMPORT PREVIEW` with LV, location/map label, HP/MP and G before the existing IMPORT action is used.
- Invalid input renders only a neutral validation warning and no fake state summary.
- REQ-064 file load already dispatches the textarea `input` event, so file imports automatically use the same preview path without a parallel file parser.
- No `save()`, localStorage write, canonical `s` assignment, inventory/economy mutation or second transfer schema was added.
- Added dedicated acceptance `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-save-transfer-preview-smoke.js`, proving valid preview fields, invalid fail-closed handling, canonical-state immutability, input-event refresh and no duplicate preview nodes.
- Checkpoints:
  - `cd248f46ea5041960d92dac0b844a2bd95258a1c` — requirement registration.
  - `cddb443bcc09eff6daed15f1f19b19dbd2ffdab8` — implementation.
  - `e174cee5829660b77535bfdffccd0f2fd13aeb45` — dedicated acceptance.
- Pages workflow run `34017799386`: SUCCESS. Sequential patches, add-on/static/contract gates, REQ-063 guard, assembled browser smoke, 390x844 touch/fullscreen visual-liveness, upload and Pages deploy all passed.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device claim is made.
