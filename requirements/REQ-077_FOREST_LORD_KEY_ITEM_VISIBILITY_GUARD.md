# REQ-077 — Forest Lord Key Item Visibility Guard

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INVENTORY / KEY-ITEM / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit of `addons/optional-forest-boss.js` found a concrete false-display bug in `addKeyItem()`.

Current code checks only `s.keyItems.length` and then renders `森王の角`. Therefore any unrelated key item in the shared key-item array can make the pause inventory falsely show Forest Lord's Horn even when the boss has never been defeated and that item is not owned.

## 1. REQUIRED BEHAVIOR

- Render `森王の角 KEY` only when `s.keyItems` is an array containing exactly that canonical item name.
- An unrelated non-empty key-item array must not render Forest Lord's Horn.
- Existing boss victory reward insertion remains unchanged.
- Existing reward persistence remains unchanged.
- Do not mutate inventory/key items while projecting UI.
- Do not alter boss mechanics, unlock, rewards, story or save ownership.

## 2. ACCEPTANCE

Automated acceptance must prove:
1. empty keyItems => no Forest Lord key-item chip;
2. unrelated keyItems only => no Forest Lord key-item chip;
3. `森王の角` owned => exactly one Forest Lord key-item chip;
4. repeat render does not duplicate chip;
5. UI projection does not mutate keyItems;
6. assembled browser regression PASS;
7. 390x844 touch/fullscreen visual-liveness PASS;
8. Pages deployment SUCCESS.

## 3. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if safe useful work remains.
