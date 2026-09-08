# REQ-142 — Adventure Memo Modern Controls Hint

## PRIORITY
P1 / PLAYER-VISIBLE UX

## STATUS
IN_PROGRESS

## PROBLEM
The canonical adventure memo still tells the player `操作：十字キーで移動、Aで会話。` even though the current world input system supports drag-anywhere movement and short-tap canonical Action on iPhone. This stale guidance contradicts the current Owner-approved mobile control model and can make players believe the old fixed controls are required.

## REQUIREMENT
Update only the player-facing adventure memo guidance so it accurately describes both current touch and keyboard controls.

Touch guidance:
- drag on the world to move
- short tap to investigate / talk / canonical Action

Keyboard guidance:
- Arrow / WASD to move
- Enter / Space for canonical Action

## SAFETY
- No new pointer/touch/click handlers.
- No changes to canonical `action()`.
- No changes to Dynamic Touch Controller movement ownership.
- No changes to menu opening/closing semantics.
- No duplicate event authority.
- Existing objective/current-location memo content must remain unchanged.

## ACCEPTANCE
- Adventure memo no longer presents fixed D-pad/A as the only controls.
- Touch guidance matches REQ-021 + REQ-001 behavior.
- Keyboard guidance remains available.
- Existing objective/location text is preserved.
- JS syntax PASS.
- Dedicated smoke PASS.
- Pages/public build PASS.
- P0 touch regression remains PASS.
- IOS_PHYSICAL_VERIFICATION=PENDING.
