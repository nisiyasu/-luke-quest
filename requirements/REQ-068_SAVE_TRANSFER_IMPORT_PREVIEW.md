# REQ-068 — Save Transfer Import Preview

STATUS: IN_PROGRESS
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
