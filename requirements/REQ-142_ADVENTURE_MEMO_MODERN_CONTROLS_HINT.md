# REQ-142 — Adventure Memo Modern Controls Hint

## PRIORITY
P1 / PLAYER-VISIBLE UX

## STATUS
VERIFY

## PROBLEM
The canonical adventure memo told the player `操作：十字キーで移動、Aで会話。` even though the current world input system supports drag-anywhere movement and short-tap canonical Action on iPhone. This stale guidance contradicted the current Owner-approved mobile control model and could make players believe the old fixed controls were required.

## IMPLEMENTED REQUIREMENT
The player-facing adventure memo now accurately describes both current touch and keyboard controls.

Touch guidance:
- drag on the world to move
- short tap to investigate / talk / canonical Action

Keyboard guidance:
- Arrow / WASD to move
- Enter / Space for canonical Action

Implementation wraps canonical `openMenu()`, calls it first, then replaces only the stale controls sentence inside the `冒険メモ` dialogue. Objective and current-location text remain canonical and unchanged.

## SAFETY
- No new pointer/touch/click handlers.
- No changes to canonical `action()`.
- No changes to Dynamic Touch Controller movement ownership.
- No changes to menu opening/closing semantics.
- No duplicate event authority.
- Existing objective/current-location memo content remains unchanged.

## VERIFICATION EVIDENCE
- Implementation/gate head: `8e7638be6752e271309dd23c50f9a71b7201b652`.
- Dedicated REQ-142 Adventure Memo Controls Gate run `34226908113`: SUCCESS.
- Exact product-head Pages run `34226908028`: SUCCESS.
- P0 Touch Diagnostic run `34227266577`: SUCCESS on descendant metadata head `4125bf13b49e93734020167aced53503a2e3a916` after permanently adding REQ-142 files to the P0 watch set.
- Dedicated smoke verifies touch drag hint, short-tap Action hint, Arrow/WASD, Enter/Space, stale fixed-control line removal, objective/location preservation, exactly one decoration render, and zero added input handlers.
- `IOS_PHYSICAL_VERIFICATION=PENDING`.

## ACCEPTANCE
- [x] Adventure memo no longer presents fixed D-pad/A as the only controls.
- [x] Touch guidance matches REQ-021 + REQ-001 behavior.
- [x] Keyboard guidance remains available.
- [x] Existing objective/location text is preserved.
- [x] JS syntax PASS.
- [x] Dedicated smoke PASS.
- [x] Pages/public build PASS.
- [x] P0 touch regression PASS.
- [ ] IOS_PHYSICAL_VERIFICATION=PENDING.
