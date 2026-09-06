# REQ-043 — Poison Defeat Cleanup

STATUS: IN_PROGRESS
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

But the wrapped `enemyTurn()` does not clear poison when the canonical enemy turn defeats Luke and transitions `battle -> world` with town recovery.

That means a poisoned Luke can be defeated, transported to town, and retain `s.status.poison > 0`. Because the same add-on can render `戦闘毒` in the pause hero, a battle-only ailment can leak into world state after defeat.

This contradicts the existing poison contract and the canonical defeat recovery behavior. No new ailment system is required.

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

- `enemyTurn()` wrapper must preserve arguments and return value.
- Cleanup should be based on before/after screen state, not on duplicating defeat HP thresholds.
- Do not introduce a second defeat state machine.
- REQ-038 defeat presentation must remain able to observe canonical recovery normally.

## AUTOMATED ACCEPTANCE

Add a pure/read-only transition helper or status contract that verifies:

- poison is battle-only;
- victory cleanup remains declared;
- successful escape cleanup remains declared;
- defeat transition cleanup is declared;
- `battle -> world` requires cleanup;
- `battle -> battle` does not require cleanup;
- non-battle transitions do not trigger false cleanup.

Dedicated smoke under `lqTouchSmoke` must fail closed if the cleanup contract regresses.

## COMPLETION CONDITION

Automated completion requires:

- requirement + repair committed;
- JavaScript syntax PASS;
- static/add-on regression PASS;
- assembled browser smoke PASS;
- dedicated poison defeat-cleanup acceptance PASS;
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