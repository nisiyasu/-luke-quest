# REQ-056 — Base Equipment Shop Comparison

STATUS: IN_PROGRESS
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

## TEST REQUIREMENTS

1. base ATK 7 with 旅人の短剣 -> 青銅の剣 projects 10 (+3)
2. ATK 13 with 鉄の剣 -> 青銅の剣 projects 10 (-3)
3. DEF 0 with 旅人服 -> 革の旅装 projects 2 (+2)
4. DEF 4 with 補強革鎧 -> 革の旅装 projects 2 (-2)
5. comparison does not mutate state or call save
6. existing owned/equipped card state remains
7. existing base purchase controls remain
8. Tier II comparison remains present and unchanged
9. assembled browser regression PASS
10. 390x844 touch/world visual-liveness PASS
11. Pages deploy SUCCESS before VERIFY

## COMPLETION CONDITION

Implementation + fail-closed acceptance + existing equipment regression + assembled browser + 390x844 touch/fullscreen + Pages SUCCESS. Physical iPhone readability check remains PENDING.

## DO NOT REPEAT

- do not create a second equipment state model
- do not alter canonical gear bonuses
- do not hide downgrade deltas
- do not mutate equipment during comparison
- do not claim physical iPhone PASS from CI
