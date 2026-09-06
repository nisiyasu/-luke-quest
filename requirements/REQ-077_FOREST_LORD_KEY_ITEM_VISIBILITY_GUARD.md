# REQ-077 — Forest Lord Key Item Visibility Guard

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INVENTORY / KEY-ITEM / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CONSISTENCY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. DEFECT / PURPOSE

Fresh audit of `addons/optional-forest-boss.js` found a concrete false-display bug in `addKeyItem()`.

Legacy code checked only `s.keyItems.length` and then rendered `森王の角`. Therefore any unrelated key item in the shared key-item array could make the pause inventory falsely show Forest Lord's Horn even when the boss had never been defeated and that item was not owned.

## 1. REQUIRED BEHAVIOR

- Render/finally retain `森王の角 KEY` only when `s.keyItems` is an array containing that canonical item name.
- An unrelated non-empty key-item array must not leave Forest Lord's Horn visible.
- Existing boss victory reward insertion remains unchanged.
- Existing reward persistence remains unchanged.
- UI projection does not mutate inventory/key items.
- Boss mechanics, unlock, rewards, story and save ownership are unchanged.

## 2. ACCEPTANCE

Automated acceptance proves:
1. empty keyItems does not qualify as Forest Lord Horn ownership;
2. unrelated keyItems only does not qualify and a false chip is removed;
3. `森王の角` ownership is detected and an owned chip is retained;
4. existing legacy duplicate prevention remains intact;
5. visibility enforcement does not mutate keyItems;
6. assembled browser regression PASS;
7. 390x844 touch/fullscreen visual-liveness PASS;
8. Pages deployment SUCCESS.

## 3. IMPLEMENTATION / VERIFICATION EVIDENCE

- Added `addons/forest-lord-key-item-visibility-guard.js` as a collision-safe final-state guard loaded after the legacy optional-boss projection.
- `ownsForestLordHorn()` requires `Array.isArray(keyItems) && keyItems.includes('森王の角')`.
- `enforceForestLordKeyItemVisibility()` removes only a false `.lqBossKeyItem`; it never writes inventory state.
- Existing boss reward and canonical key-item award authority remain in `addons/optional-forest-boss.js`.
- `window.LQ_FOREST_LORD_KEY_ITEM_GUARD_TEST` exposes exact-ownership and enforcement diagnostics.
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-forest-lord-key-item-smoke.js` runs in assembled `?lqSmoke=1`, testing empty/unrelated/owned/non-array states, actual false-chip removal, owned-chip retention, and keyItems non-mutation.
- Checkpoints:
  - `7ae1182e33ac0ccb0bb8cfe9714c21d73d8b1da2` — register REQ-077.
  - `d48caecf4e5e2fe1a4bb9a7f51ec8c1b88ad6920` — add exact-ownership final-state guard.
  - `214317d8f6ffa0fd760cfad29f1b123dd62d9213` — expose deterministic acceptance hook.
  - `13967ce08f4e33d469606bcb92144e05ab23175b` — assembled-browser acceptance gate.
- GitHub Pages workflow run `34019534573`: SUCCESS. Sequential/add-on syntax, static regression, add-on contract, assembled browser smoke, 390x844 floating-touch/fullscreen visual-liveness, upload and Pages deployment all succeeded.
- `IOS_PHYSICAL_VERIFICATION=PENDING`; no physical-device PASS is claimed.

## 4. NO-STOP

Completion is a checkpoint only. Synchronize durable state, run GATE C and continue if safe useful work remains.
