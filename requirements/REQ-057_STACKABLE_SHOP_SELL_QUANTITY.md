# REQ-057 — Stackable Shop Sell Quantity

STATUS: VERIFY
PRIORITY: P1
TYPE: SHOP / ECONOMY / UX / PLAYER-VISIBLE / DIRECTIVE-AUTHORIZED
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## TRIGGER

REQ-055 established safe one-unit consumable selling. Fresh shop audit shows the same cards already support x1/x3 buying, leaving selling asymmetrically one-at-a-time.

## PURPOSE

Add fast x3 selling for canonical stackable consumables while keeping REQ-055 as the single sell-state authority and preventing oversell/free-gold behavior.

## SCOPE

- 薬草: SELL x1 / SELL x3 at 4G each
- 煙玉: SELL x1 / SELL x3 at 9G each
- x3 is enabled only when at least 3 are owned
- no equipment selling changes

## REQUIRED BEHAVIOR

- retain `lqSellConsumable(type)` as the canonical x1 compatibility API
- add quantity-aware sale through the same sell implementation, not a second economy model
- qty accepts only 1 or 3
- x3 requires owned >=3; otherwise reject without mutation/save/gold
- valid x3 decrements exactly 3, adds exactly unitPrice*3, calls save once, rerenders once
- zero/insufficient inventory and out-of-shop calls reject safely
- existing x1 selling and x1/x3 buying remain intact

## IMPLEMENTATION

- `addons/consumable-shop-sell.js`
  - retains `lqSellConsumable(type)` as x1 compatibility API
  - adds `lqSellConsumableQty(type, qty)` using the same `SELL_META`, shop guard, save/render path and prices
  - accepts only qty 1 or 3 and rejects insufficient stock instead of silently clamping
  - renders SELL x1 / SELL x3 buttons on the existing consumable card; x3 is disabled below three owned
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-stackable-shop-sell-quantity-smoke.js`
  - fail-closed acceptance for x3 math, save-count discipline, invalid quantity, insufficient stock, shop guard, x1 compatibility and UI/buy-control preservation

## CHECKPOINTS

- requirement registration: `14ea0e8b565e2fbad3ae9248c9c4a060df727c8f`
- implementation: `d5cf9057c1e81440e772c8dd1ad71b805fa0f480`
- dedicated acceptance: `ffa0a2b046e7fa1fdc3fbfade92e694338e4a654`

## VERIFICATION

Pages run `34014292725` for the acceptance checkpoint completed SUCCESS:

- sequential syntax validation: PASS
- collision-safe add-on validation: PASS
- static regression: PASS
- add-on contract: PASS
- REQ-055 existing x1 sell acceptance: PASS through assembled browser suite
- REQ-057 dedicated x3 sell acceptance: PASS
- assembled browser smoke: PASS
- 390x844 floating touch + iPhone world visual-liveness: PASS
- upload: PASS
- GitHub Pages deploy: PASS

Physical iPhone shop feel/readability remains PENDING.

## TEST REQUIREMENTS

1. herb 4 / gold10 -> sell x3 => herb1 / gold22 / one save — PASS
2. smoke 3 after herb sale -> sell x3 => smoke0 / gold49 / one additional save — PASS
3. herb2 -> x3 rejected, no save/gold change — PASS
4. qty2 or other unsupported qty rejected — PASS
5. out-of-shop x3 rejected — PASS
6. x1 API remains functional — PASS
7. UI contains sell x1/x3 for both consumables — PASS
8. x3 disabled below 3 owned — PASS
9. existing buy x1/x3 remains — PASS
10. REQ-055 smoke remains PASS — PASS
11. assembled browser PASS — PASS
12. 390x844 touch/world visual-liveness PASS — PASS
13. Pages deploy SUCCESS — PASS (`34014292725`)

## COMPLETION CONDITION

Automated implementation, fail-closed acceptance, REQ-055 regression, assembled/touch/fullscreen validation and Pages SUCCESS are satisfied. Physical iPhone feel-check remains PENDING, therefore STATUS is VERIFY rather than DONE.

## DO_NOT REPEAT

- do not oversell inventory
- do not silently clamp an invalid x3 request into a smaller sale
- do not call save on rejected sale
- do not create a second sell price table
- do not change equipment selling
- do not claim physical iPhone PASS from CI
