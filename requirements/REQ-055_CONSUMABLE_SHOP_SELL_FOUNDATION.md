# REQ-055 — Consumable Shop Sell Foundation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: SHOP / ECONOMY / PLAYER-VISIBLE / DIRECTIVE-AUTHORIZED
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## TRIGGER

Fresh final-game capability audit found the Aldia item shop already has real purchase UI, owned-state cards, stackable herb/smoke purchases and a walkable stock room, while `AUTONOMOUS_DEV_DIRECTIVE.md` §36 explicitly lists `sell` as the next shop-system expansion. No existing sell add-on or sell requirement exists in fresh HEAD.

## PURPOSE

Turn the existing shop from buy-only into a minimal two-way consumable economy without changing protected story canon or equipment ownership semantics.

## SCOPE

Add safe one-unit selling for the two stackable canonical consumables already sold by the item shop:

- 薬草: sell 1 for 4G
- 煙玉: sell 1 for 9G

These are exactly half of the current canonical buy prices (8G / 18G) and do not create arbitrage.

Equipment selling is intentionally excluded because equipment ownership/equip state has separate persistence and downgrade semantics.

## REQUIRED BEHAVIOR

- Sell controls appear only in the actual Aldia item-shop purchase UI (`shopInterior`, `shopOpen`, world screen).
- A sell button is available on the existing herb and smoke-bomb item cards.
- Selling one owned consumable decrements that inventory count by exactly 1.
- Gold increases by exactly the configured sell price.
- The canonical `save()` path is invoked after a valid sale.
- UI rerenders immediately so owned count and gold update.
- Selling with zero inventory does nothing and cannot create negative inventory or free gold.
- Calling the sell API outside the active shop does nothing.
- Existing buy controls, equipment, story flags, battle state and save schema are not changed.

## UX

- Button text must state the action and received gold, e.g. `SELL ×1 +4G`.
- Zero-owned sell buttons are disabled.
- Touch target should remain usable on iPhone and visually distinct from buy controls without creating another full-width control panel.

## TEST REQUIREMENTS

1. herb count 2 / gold 10 -> sell herb once => herb 1 / gold 14
2. smoke count 1 / gold 10 -> sell smoke once => smoke 0 / gold 19
3. zero herb -> sale rejected, gold unchanged
4. sale outside active item shop -> rejected
5. sell button disabled when owned count is zero
6. existing x1/x3 buy controls remain present
7. save is called exactly for valid sales, not rejected sales
8. assembled browser regression PASS
9. 390x844 touch/world visual-liveness regression remains PASS
10. Pages deploy SUCCESS before VERIFY claim

## COMPLETION CONDITION

Implementation + dedicated fail-closed browser acceptance + existing assembled/touch/fullscreen regressions + Pages SUCCESS. Owner physical iPhone feel-check remains PENDING.

## DO NOT REPEAT

- do not sell equipment in this foundation
- do not mutate buy prices
- do not permit negative inventory
- do not award gold on rejected sale
- do not create a second shop state model
- do not claim iPhone physical PASS from CI
