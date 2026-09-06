# REQ-072 — Accessory Shop Sell Foundation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: EQUIPMENT / SHOP / PLAYER-VISIBLE / ECONOMY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED_FINAL_GAME_CAPABILITY
IOS_PHYSICAL_VERIFICATION: PENDING

## 0. PURPOSE

Fresh equipment audit found an asymmetry: Tier II weapon/armor already support shop selling, while REQ-058 accessories support buy/equip/unequip but have no sell path. Complete the accessory equipment lifecycle without changing protected canon or inventing a second accessory system.

## 1. REQUIRED BEHAVIOR

- Existing accessory `旅人の護符` can be sold at the existing equipment shop for 30G (50% of 60G purchase price).
- Only owned accessories can be sold.
- Equipped accessory cannot be sold; player must unequip first.
- Successful sale removes exactly one owned accessory, adds exactly the configured sell value, persists through canonical `save()`, and re-renders.
- Selling must not alter base armor/weapon equipment, inventory consumables, map/story flags or DEF beyond the fact that an equipped accessory is already disallowed from selling.
- Re-buy after selling remains possible through the existing REQ-058 buy authority.
- Do not duplicate or replace REQ-058 accessory ownership/equip authority.

## 2. UI

- Add an ACCESSORY subsection to the existing shop SELL area only when an accessory is owned.
- Show accessory name, sell value, and equipped state.
- Equipped accessory sell button is disabled.
- Avoid duplicate rows after repeated render/world calls.

## 3. TEST REQUIREMENTS

Automated acceptance must prove:
1. unowned accessory sell is rejected;
2. equipped accessory sell is rejected with gold/ownership/DEF unchanged;
3. unequipped owned accessory sells for exactly 30G;
4. other equipment/inventory/story state is preserved;
5. sold accessory can be re-bought through existing REQ-058 authority when funds/shop state allow;
6. duplicate SELL UI is not created after rerenders;
7. assembled browser smoke PASS;
8. equipment regression PASS;
9. 390x844 touch/fullscreen regression PASS;
10. Pages deploy SUCCESS.

## 4. NO-STOP

Completion is a checkpoint, not a stop condition. Run GATE C and continue if safe useful work remains.
