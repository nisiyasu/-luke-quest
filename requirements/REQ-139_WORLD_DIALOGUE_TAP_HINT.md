# REQ-139 — WORLD DIALOGUE TAP HINT

STATUS: VERIFY
PRIORITY: P1
OWNER_INTENT_SOURCE: REQ-021 Tap Anywhere Action + current Chapter 1 iPhone UX audit

## Problem

The current world dialogue UI still tells the player only `Aで閉じる`, even though REQ-021 makes a short tap on the valid world touch surface equivalent to one canonical `action()`.

On iPhone this creates a player-visible instruction mismatch: the faster touch interaction exists, but the dialogue itself does not tell the player it exists.

## Scope

Presentation-only correction for world dialogue close guidance.

When a world dialogue is visible, replace the stale close hint with wording that makes both valid controls clear:

`タップ / Aで閉じる`

The implementation must:

- preserve canonical `action()` as the sole world Action authority;
- add no new Action path;
- add no pointer/click/touch handler;
- preserve REQ-021 tap/drag arbitration;
- preserve Dynamic Touch Controller behavior;
- preserve dialogue content, speaker, story flags, save data and progression;
- affect world dialogue only;
- not fabricate tap support in menus, battle commands, shop, inventory or other excluded UI.

## Acceptance criteria

1. In assembled public runtime, a world dialogue displays `タップ / Aで閉じる`.
2. The stale world-dialogue-only hint `Aで閉じる` is no longer the complete instruction shown to the player.
3. Closing the dialogue still goes through canonical `action()` behavior already owned by REQ-021/base gameplay.
4. The REQ-139 implementation contains no new pointer, touch or click event handler.
5. Existing P0 touch regression remains green.
6. Existing gameplay/state/save behavior is unchanged.
7. Pages build includes the change and succeeds.
8. iPhone physical verification remains `PENDING` until the Owner checks the public build on device.

## Verification evidence

- Dedicated REQ-139 acceptance workflow: SUCCESS.
- P0 Touch Diagnostic on implementation checkpoint `7e07179369b22b106d0b1e9f28e88481a1a1eae9`: SUCCESS (`34215919409`).
- GitHub Pages deploy on the same implementation checkpoint: SUCCESS (`34215919367`).
- IOS_PHYSICAL_VERIFICATION: PENDING.

## Completion policy

Do not call this IMPLEMENTATION_COMPLETE merely because the text exists in source. Require assembled browser evidence plus Pages/public inclusion. Owner physical iPhone verification is separate and must not be faked.
