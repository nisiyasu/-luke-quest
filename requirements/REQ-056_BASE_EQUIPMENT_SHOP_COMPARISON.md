# REQ-056 — Base Equipment Shop Comparison

STATUS: VERIFY
PRIORITY: P1
TYPE: SHOP / EQUIPMENT / UX / PLAYER-VISIBLE / DIRECTIVE-AUTHORIZED
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## TRIGGER

Fresh equipment/shop audit found Tier II shop cards already show current stat -> projected stat comparison, while the canonical base-shop equipment cards for 青銅の剣 and 革の旅装 only show static `ATK +3` / `DEF +2` descriptions and ownership state. `AUTONOMOUS_DEV_DIRECTIVE.md` explicitly calls for equipment comparison as shop expansion.

## PURPOSE

Make base equipment purchases readable and reversible-looking before purchase without changing equipment stats, prices, ownership, equip behavior or save state.

## SCOPE

- 青銅の剣: show current ATK -> projected ATK and signed delta
- 革の旅装: show current DEF -> projected DEF and signed delta
- use the same known base/Tier-I/Tier-II bonus chain already audited by REQ-032
- UI-only; no purchase/equip/sell mechanics change

## REQUIRED BEHAVIOR

- comparison appears only on matching canonical equipment cards in the active item shop
- current value reflects currently equipped gear, including Tier II
- projected value removes the current gear bonus and applies the candidate base-shop bonus
- downgrade is explicit, e.g. `13 → 10 (-3)` rather than hiding negative delta
- equal delta is shown clearly as no change
- existing owned/equipped state and buy controls remain intact
- no state mutation, no save call, no price mutation

## IMPLEMENTATION

- `addons/base-equipment-shop-comparison.js`
  - UI-only projection for canonical Tier-I cards
  - same audited bonus chain as REQ-032: weapon 0/3/6, armor 0/2/4
  - explicit positive, negative and zero signed deltas
  - no save/state mutation
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-base-equipment-shop-comparison-smoke.js`
  - fail-closed assembled-browser acceptance for upgrade/downgrade math, no-save behavior, visible comparison, preserved buy controls and Tier II system

## CHECKPOINTS

- requirement registration: `61cb6380c2c5e6ce9d5b17468ee0fc7f2c8205f9`
- implementation: `bbd93b7724329362f0cbfe43cfad671bd9d97901`
- dedicated acceptance: `908db4fe113fa60249b36e73e60c38035851397e`

## VERIFICATION

Pages run `34014165812` for the acceptance checkpoint completed SUCCESS:

- sequential syntax validation: PASS
- collision-safe add-on validation: PASS
- static regression: PASS
- add-on contract: PASS
- existing equipment runtime/browser coverage: PASS through assembled browser smoke
- REQ-056 dedicated browser acceptance: PASS
- 390x844 floating touch + iPhone world visual-liveness: PASS
- upload: PASS
- GitHub Pages deploy: PASS

Physical iPhone readability remains PENDING.

## TEST REQUIREMENTS

1. base ATK 7 with 旅人の短剣 -> 青銅の剣 projects 10 (+3) — PASS
2. ATK 13 with 鉄の剣 -> 青銅の剣 projects 10 (-3) — PASS
3. DEF 0 with 旅人服 -> 革の旅装 projects 2 (+2) — PASS
4. DEF 4 with 補強革鎧 -> 革の旅装 projects 2 (-2) — PASS
5. comparison does not mutate state or call save — PASS
6. existing owned/equipped card state remains — PASS via existing assembled shop/equipment regressions
7. existing base purchase controls remain — PASS
8. Tier II comparison/system remains present — PASS
9. assembled browser regression PASS — PASS
10. 390x844 touch/world visual-liveness PASS — PASS
11. Pages deploy SUCCESS before VERIFY — PASS (`34014165812`)

## COMPLETION CONDITION

Automated implementation, fail-closed acceptance, equipment/browser/touch/fullscreen regressions and Pages SUCCESS are satisfied. Physical iPhone readability remains PENDING, therefore STATUS is VERIFY rather than DONE.

## DO NOT REPEAT

- do not create a second equipment state model
- do not alter canonical gear bonuses
- do not hide downgrade deltas
- do not mutate equipment during comparison
- do not claim physical iPhone PASS from CI
