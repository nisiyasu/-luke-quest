# REQ-057 — Stackable Shop Sell Quantity

STATUS: IN_PROGRESS
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

## TEST REQUIREMENTS

1. herb 4 / gold10 -> sell x3 => herb1 / gold22 / one save
2. smoke 3 / gold10 -> sell x3 => smoke0 / gold37 / one save
3. herb2 -> x3 rejected, no save/gold change
4. qty2 or other unsupported qty rejected
5. out-of-shop x3 rejected
6. x1 API remains functional
7. UI contains sell x1/x3 for both consumables
8. x3 disabled below 3 owned
9. existing buy x1/x3 remains
10. REQ-055 smoke remains PASS
11. assembled browser PASS
12. 390x844 touch/world visual-liveness PASS
13. Pages deploy SUCCESS

## COMPLETION CONDITION

Implementation + fail-closed acceptance + REQ-055 regression + assembled/touch/fullscreen + Pages SUCCESS. Physical iPhone feel-check remains PENDING.

## DO NOT REPEAT

- do not oversell inventory
- do not silently clamp an invalid x3 request into a smaller sale
- do not call save on rejected sale
- do not create a second sell price table
- do not change equipment selling
- do not claim physical iPhone PASS from CI
