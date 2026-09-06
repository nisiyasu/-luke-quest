# REQ-043 — Poison Defeat Cleanup

STATUS: VERIFY
PRIORITY: P1
TYPE: BUGFIX / BATTLE / STATUS-AILMENT / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY INTEGRATED SELF-AUDIT

`addons/battle-poison-status.js` explicitly defines poison as battle-only and states that poison is cleared when battle ends.

Fresh code inspection confirms cleanup on:

- victory through wrapped `win()`;
- successful `runAway()`;
- successful smoke-bomb escape;
- herb cure.

But the wrapped `enemyTurn()` did not clear poison when the canonical enemy turn defeats Luke and transitions `battle -> world` with town recovery.

That meant a poisoned Luke could be defeated, transported to town, and retain `s.status.poison > 0`. Because the same add-on can render `戦闘毒` in the pause hero, a battle-only ailment could leak into world state after defeat.

This contradicted the existing poison contract and the canonical defeat recovery behavior. No new ailment system was required.

## REQUIRED REPAIR

1. Preserve the existing poison mechanic, chance, damage, turn count and herb behavior.
2. Preserve canonical defeat recovery owned by the existing `enemyTurn()` chain.
3. Detect a transition from battle to world caused during the poison `enemyTurn()` wrapper.
4. Clear poison when that battle-ending transition occurs.
5. Do not clear poison during an ordinary enemy turn that remains in battle.
6. Do not change HP recovery, map, coordinates, gold, EXP, encounter grace, items, saves, defeat feedback or battle balance.
7. Keep existing victory/run/smoke cleanup behavior intact.
8. Update the public status/acceptance surface so defeat cleanup is explicitly testable.

## LOAD / WRAPPER SAFETY

- `enemyTurn()` wrapper preserves arguments and return value.
- Cleanup is based on before/after screen state, not on duplicating defeat HP thresholds.
- No second defeat state machine was introduced.
- REQ-038 defeat presentation remains able to observe canonical recovery normally.

## IMPLEMENTED REPAIR

`addons/battle-poison-status.js` now:

- records `beforeScreen` before delegating to the canonical enemy-turn chain;
- calls the canonical wrapped `enemyTurn()` unchanged;
- clears poison only when `battleEnded(beforeScreen, s.screen)` detects that the enemy turn actually ended battle;
- leaves ordinary `battle -> battle` turns untouched;
- exposes `cleanup.defeat=true` and the pure `battleEnded(before, after)` helper on `window.LQ_STATUS_AILMENT_STATUS.poison` for read-only acceptance.

Dedicated acceptance add-on:

- `addons/zzzzzzzzzzzzzzzzzzzzzzz-poison-defeat-cleanup-smoke.js`
- active only under `lqTouchSmoke`;
- fails closed if battle-only status, victory/escape/smoke/defeat cleanup declarations, `battle -> world` cleanup classification, ordinary battle continuation, or unrelated transition classification regress.

## AUTOMATED ACCEPTANCE

Verified:

- poison remains battle-only;
- victory cleanup remains declared;
- successful escape cleanup remains declared;
- smoke-bomb cleanup remains declared;
- defeat transition cleanup is declared;
- `battle -> world` requires cleanup;
- `battle -> battle` does not require cleanup;
- non-battle transitions do not trigger false cleanup;
- dedicated fail-closed smoke is included in the assembled `lqTouchSmoke` acceptance surface.

## VERIFICATION EVIDENCE

- requirement registration: `fada911b47d75189b2e7ad16d982aadccc4d6a59`
- implementation repair: `d0ea70a4638e86677142e5d372a6dbc926540344`
- dedicated acceptance checkpoint: `feaa55dd44d0678edaeefb899b5ade3d28a11e9a`
- Pages workflow run `34009787755`: SUCCESS
- workflow steps PASS:
  - JavaScript sequential patch validation
  - collision-safe add-on validation
  - static regression guard
  - add-on contract guard
  - assembled browser smoke
  - 390x844 floating-touch + iPhone world visual-liveness smoke
  - Pages upload/deploy

## COMPLETION CONDITION

Automated completion is satisfied:

- requirement + repair committed;
- JavaScript/static/add-on validation PASS;
- assembled browser smoke PASS;
- dedicated poison defeat-cleanup acceptance PASS as part of the touch-smoke surface;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner happens to verify poisoned defeat behavior on iPhone; automated correctness must not be called physical PASS.

## DO NOT REPEAT

- do not redesign poison;
- do not add a second defeat recovery path;
- do not make poison persist intentionally outside battle;
- do not clear poison on every enemy turn;
- do not mark physical iPhone PASS from headless CI.