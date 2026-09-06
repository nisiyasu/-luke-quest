# REQ-058 — Accessory Equipment Foundation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: EQUIPMENT / SHOP / RPG-SYSTEM / PLAYER-VISIBLE / DIRECTIVE-AUTHORIZED
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## TRIGGER

Fresh equipment audit confirms weapon + armor + Tier II switching/selling/comparison exist and are regression-covered, while `AUTONOMOUS_DEV_DIRECTIVE.md` explicitly names `accessory` as a final-game equipment capability and no accessory implementation exists in fresh HEAD.

The existing armor reconciliation computes `base = current DEF - current armor bonus`, so an independent accessory DEF bonus survives armor swaps rather than being erased. This makes a minimal third equipment slot safe to add without rewriting canonical equipment state.

## PURPOSE

Introduce one real accessory slot as a durable RPG equipment foundation, using additive independent stat reconciliation and existing save/shop/menu systems.

## FOUNDATION ITEM

- 旅人の護符
- price: 60G
- effect: DEF +1 while equipped

This is a generic non-story equipment item and does not reveal or alter protected canon.

## PERSISTENCE

Use existing `s.flags` persistence rather than adding a conflicting top-level equipment schema:

- `lqAccessoryOwned`: array of owned accessory names
- `lqAccessoryEquipped`: equipped accessory name or empty string

The canonical `s.def` contains the active accessory bonus just as it already contains active armor bonus. Equip changes reconcile old accessory bonus -> new accessory bonus by delta.

## REQUIRED BEHAVIOR

- accessory appears as a real item in the active Aldia item shop
- purchase requires 60G, is one-time ownership, and auto-equips when no accessory is equipped
- purchase subtracts gold and adds exactly +1 DEF on first auto-equip
- adventure EQUIPMENT menu gets an accessory row
- equipped accessory can be explicitly removed with `はずす`
- re-equipping owned accessory adds its bonus exactly once
- repeated equip calls must not stack bonus
- armor swaps across base/Tier I/Tier II preserve the accessory bonus
- accessory equip/unequip calls save + render exactly once when valid
- rejected purchase/equip does not mutate state or call save
- weapon/armor ownership arrays and Tier II sell behavior remain untouched

## TEST REQUIREMENTS

1. buy at 60G with DEF4/no accessory => gold0, owned, equipped, DEF5, one save
2. buy with <60G => reject, no mutation/save
3. equip same accessory again => no double DEF stack
4. unequip from DEF5 => DEF4
5. re-equip => DEF5
6. simulate armor change from 補強革鎧 DEF4 + accessory1 to 革の旅装 while keeping accessory => final DEF3, not 2 or 4
7. menu displays accessory row + remove option
8. shop displays accessory card and owned/equipped state
9. existing weapon/armor/Tier II equipment smoke remains PASS
10. assembled browser PASS
11. 390x844 touch/world visual-liveness PASS
12. Pages deploy SUCCESS

## COMPLETION CONDITION

Implementation + fail-closed accessory acceptance + existing equipment regression + assembled/touch/fullscreen + Pages SUCCESS. Physical iPhone equipment-menu/shop readability remains PENDING.

## DO NOT REPEAT

- do not create a second weapon/armor model
- do not store the accessory bonus separately from canonical DEF arithmetic without reconciliation
- do not double-apply bonus on reload/render/re-equip
- do not alter Tier II sell ownership semantics
- do not fabricate protected story lore for the item
- do not claim physical iPhone PASS from CI
