# REQ-146 — Field Camera Pullback / Reference-Quality World Framing

- ID: `REQ-146`
- PRIORITY: `P0 / OWNER_DIRECT / ABSOLUTE_NEXT`
- STATUS: `VERIFY`
- CREATED_AT: `2026-09-09 JST`
- IMPLEMENTED_AT: `2026-09-09 JST`
- IMPLEMENTATION_SHA: `739d9771c21ea440f8e5e545e8cc3b5e858973fc`
- TYPE: `VISUAL_QUALITY / FIELD_CAMERA / IPHONE_WORLD`
- IOS_PHYSICAL_VERIFICATION: `PENDING`

## 1. OWNER DIRECT REQUEST

Owner requested 「もう一段階引いた絵にしよう」 using the three Owner-provided screenshots as visual references. The target is materially more surrounding world at once, not merely higher resolution.

## 2. CANONICAL REFERENCE ASSETS

- `assets/reference/owner_2026-09-09_field_scale/ref-01-wide-architecture.jpg`
- `assets/reference/owner_2026-09-09_field_scale/ref-02-field-ui.jpg`
- `assets/reference/owner_2026-09-09_field_scale/ref-03-pulled-back-field.jpg`
- `assets/reference/owner_2026-09-09_field_scale/README.md`

## 3. IMPLEMENTATION

`addons/zzzzz-req146-field-pullback.js` provides a presentation-only iPhone portrait framing override with `PORTRAIT_SCALE=.78`, replacing the older `.88` portrait framing result. Logical map/tile/input coordinates remain unchanged. The addon recenters/clamps the scaled world, preserves a minimum upper HUD clearance, reapplies after canonical render, and responds to resize/orientation/visualViewport resize.

Protected authorities remain unchanged: canonical action/touch/save/story/battle/progression/map transition.

## 4. MACHINE / PUBLIC EVIDENCE

Implementation commit: `739d9771c21ea440f8e5e545e8cc3b5e858973fc`.

Post-commit GitHub Actions include successful cache-busted Pages recovery and successful iOS WebKit live diagnostic on the exact implementation SHA. This establishes public pipeline inclusion and WebKit machine liveness, but does not constitute Owner physical-iPhone approval.

## 5. REMAINING OWNER EVIDENCE

The original requirement requested three same-coordinate before/after captures. That subjective/reference-quality comparison has not been falsely claimed complete. Machine/public evidence is sufficient to move the implementation out of active WIP, while final visual judgment remains Owner-side.

Owner should verify on physical iPhone that:

- the field is clearly one step more pulled back;
- Luke/NPC/interactable readability remains acceptable;
- tap/drag spatial behavior feels correct;
- the result moves toward the three reference compositions rather than merely making sprites smaller.

## 6. STATUS DECISION

`VERIFY` is appropriate because the code is implemented and public machine pipelines are green, while subjective visual acceptance and physical iPhone verification remain pending. Do not claim reference-quality PASS until Owner experience review.
