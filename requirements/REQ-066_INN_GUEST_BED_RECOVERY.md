# REQ-066 — Inn Guest Bed Recovery

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: GAMEPLAY / INN / RECOVERY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CAPABILITY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

The South Gate Inn already has a walkable guest room and an interactable bed visual/prop, but the bed currently only displays flavor text. The game also already has one-time forest campfire recovery and shrine recovery semantics.

Make the existing inn guest room function as a reliable repeatable recovery point without inventing a second inn, changing protected story canon, or duplicating recovery authority unnecessarily.

## 1. REQUIRED BEHAVIOR

When the player is in `innGuestRoom`, facing the existing `窓辺のベッド` interaction and no dialogue/menu/battle is active:

- canonical Action on the bed performs an inn rest;
- restore HP to max HP;
- restore MP to max MP when MP exists;
- clear battle-only poison/status that should not persist after a proper rest;
- preserve map/story/equipment/inventory/quest flags and unrelated state;
- save the recovered state through the existing canonical `save()` path;
- show a short recovery dialogue/feedback;
- repeat use is allowed;
- if HP/MP are already full and no recoverable status exists, interaction remains harmless and reports that the player is already rested;
- existing anywhere-tap Action must reach this through canonical `action()` rather than a separate pointer handler;
- leaving/entering the guest room must remain unchanged.

## 2. SAFETY

- Do not create a second room or a second bed object.
- Do not mutate gold/economy in this requirement; this is recovery-capability completion, not inn pricing design.
- Do not alter story/protected canon.
- Do not revive battle enemy state.
- Use `stopMoving()` before recovery so held movement cannot continue through the interaction.
- Preserve REQ-019 campfire/shrine recovery behavior.

## 3. TEST REQUIREMENTS

Automated acceptance must prove at minimum:

1. bed is found through the existing `front()`/current NPC action path;
2. canonical Action on bed recovers HP;
3. canonical Action recovers MP when MP is available;
4. battle-only poison/status is cleared;
5. unrelated flags/inventory/equipment/map position survive;
6. recovery persists through canonical save;
7. repeated/full-state rest is harmless;
8. non-bed guest room props keep original flavor interactions;
9. guest-room entry/exit regression PASS;
10. REQ-021 tap-anywhere / REQ-001 touch regression remains PASS;
11. assembled title/world browser smoke PASS;
12. 390x844 touch/fullscreen regression PASS;
13. Pages deploy SUCCESS.

## 4. NO-FAKE / NO-STOP

- Flavor text alone is not a functional inn recovery point.
- Do not claim iPhone physical PASS from CI.
- Completion is a checkpoint, not a stop condition. Run GATE C and continue when safe work remains.
