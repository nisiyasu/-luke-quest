# REQ-058 — Accessory Equipment Foundation

STATUS: VERIFY
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

## IMPLEMENTATION

- `addons/accessory-equipment.js`
  - one durable accessory slot layered onto canonical DEF
  - `旅人の護符` 60G / DEF +1
  - persistence through `s.flags.lqAccessoryOwned` / `s.flags.lqAccessoryEquipped`
  - purchase/shop guard, auto-equip, explicit unequip/re-equip and delta-safe DEF reconciliation
  - existing shop card + EQUIPMENT menu integration
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-accessory-equipment-smoke.js`
  - fail-closed acceptance for purchase, no-stack equip, unequip/re-equip, cross-tier armor preservation, insufficient-gold rejection, shop/menu UI and existing equipment contract

## CHECKPOINTS

- requirement registration: `b6b88822acad314aec8ea2845c9d3ccbeb3fd868`
- implementation: `d1edb4b85b5fdefa5e42c08e8d7614b2fcf98bc7`
- dedicated acceptance: `916a700ddb40dafd6201ef8e8d1b3bdef8383697`

## VERIFICATION

Pages run `34014440476` for the acceptance checkpoint completed SUCCESS:

- sequential syntax validation: PASS
- collision-safe add-on validation: PASS
- static regression: PASS
- add-on contract: PASS
- existing equipment assembled-browser coverage: PASS
- REQ-058 dedicated accessory acceptance: PASS
- 390x844 floating touch + iPhone world visual-liveness: PASS
- upload: PASS
- GitHub Pages deploy: PASS

Physical iPhone equipment-menu/shop readability remains PENDING.

## TEST REQUIREMENTS

1. buy at 60G with DEF4/no accessory => gold0, owned, equipped, DEF5, one save — PASS
2. buy with <60G => reject, no mutation/save — PASS
3. equip same accessory again => no double DEF stack — PASS
4. unequip from DEF5 => DEF4 — PASS
5. re-equip => DEF5 — PASS
6. simulate armor change from 補強革鎧 DEF4 + accessory1 to 革の旅装 while keeping accessory => final DEF3, not 2 or 4 — PASS
7. menu displays accessory row + remove option — PASS
8. shop displays accessory card and owned/equipped state — PASS
9. existing weapon/armor/Tier II equipment smoke remains PASS — PASS
10. assembled browser PASS — PASS
11. 390x844 touch/world visual-liveness PASS — PASS
12. Pages deploy SUCCESS — PASS (`34014440476`)

## COMPLETION CONDITION

Automated implementation, fail-closed accessory acceptance, existing equipment/browser/touch/fullscreen regressions and Pages SUCCESS are satisfied. Physical iPhone equipment-menu/shop readability remains PENDING, therefore STATUS is VERIFY rather than DONE.

## DO NOT REPEAT

- do not create a second weapon/armor model
- do not store the accessory bonus separately from canonical DEF arithmetic without reconciliation
- do not double-apply bonus on reload/render/re-equip
- do not alter Tier II sell ownership semantics
- do not fabricate protected story lore for the item
- do not claim physical iPhone PASS from CI
