# REQ-055 — Consumable Shop Sell Foundation

STATUS: VERIFY
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

- Button text states the action and received gold, e.g. `SELL ×1 +4G`.
- Zero-owned sell buttons are disabled.
- Touch target is at least 44 CSS px high and remains inside the existing item card rather than creating another dedicated control panel.

## IMPLEMENTATION

- `addons/consumable-shop-sell.js`
  - uses the existing `s`, `save()`, `render()` and active shop state rather than a second shop model
  - exposes `window.lqSellConsumable(type)` and `window.LQ_SHOP_SELL_STATUS`
  - guards world + `shopInterior` + `shopOpen`
  - clamps malformed/non-positive inventory to a rejected sale
  - preserves existing buy/equipment systems
- `addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-consumable-shop-sell-smoke.js`
  - fail-closed acceptance for valid sale math, save calls, zero/outside-shop rejection, UI presence, disabled zero-stock state and preservation of x1/x3 buying

## CHECKPOINTS

- requirement registration: `58ad1e2687f200d33529010da7932abbee0cc0ff`
- queue activation: `d49b48cdc65468474b30757840e2d204ce8d521b`
- implementation: `2c3d5db7a1997c6188cf7d84592604eefb0c7413`
- dedicated acceptance: `a65ca21b9eb1952bb12fb7e93820c68541506a62`
- touch-smoke timing isolation repair: `4d344310df36355d42b8ed59899a978dcfc78510`

## VERIFICATION

Initial Pages run `34013949081` correctly failed the 390x844 touch regression because the new REQ-055 acceptance mutated shared world state while the pre-existing REQ-001 gesture smoke was still sampling active directions. The REQ-055 assertions themselves were all true; the failure was an acceptance-test timing collision, not a reason to weaken the older P0 gate.

The acceptance was isolated to run after the gesture assertions. Final Pages run `34013983279` then passed:

- sequential patch syntax: PASS
- collision-safe add-on validation: PASS
- static regression: PASS
- add-on contract: PASS
- assembled browser smoke: PASS
- 390x844 floating touch + visible-world geometry: PASS
- upload: PASS
- GitHub Pages deploy: PASS

Public Pages deployment is therefore automated-acceptance complete. Owner physical iPhone shop feel-check remains PENDING.

## TEST REQUIREMENTS

1. herb count 2 / gold 10 -> sell herb once => herb 1 / gold 14 — PASS
2. smoke count 1 / gold 14 -> sell smoke once => smoke 0 / gold 23 — PASS
3. zero inventory -> sale rejected, gold unchanged — PASS
4. sale outside active item shop -> rejected — PASS
5. sell button disabled when owned count is zero — PASS
6. existing x1/x3 buy controls remain present — PASS
7. save is called exactly for valid sales, not rejected sales — PASS
8. assembled browser regression PASS — PASS
9. 390x844 touch/world visual-liveness regression remains PASS — PASS
10. Pages deploy SUCCESS before VERIFY claim — PASS (`34013983279`)

## COMPLETION CONDITION

Automated implementation, dedicated fail-closed browser acceptance, assembled/touch/fullscreen regressions and Pages SUCCESS are satisfied. Owner physical iPhone feel-check remains PENDING, therefore STATUS is VERIFY rather than DONE.

## DO NOT REPEAT

- do not sell equipment in this foundation
- do not mutate buy prices
- do not permit negative inventory
- do not award gold on rejected sale
- do not create a second shop state model
- do not weaken older P0 gesture/fullscreen gates to make new acceptance pass
- do not claim iPhone physical PASS from CI
