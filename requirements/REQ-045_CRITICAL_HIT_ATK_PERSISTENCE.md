# REQ-045 — Critical-Hit ATK Persistence Safety

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / BATTLE / SAVE / PROGRESSION / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH INTEGRATED AUDIT

Fresh canonical code inspection confirmed a persistent-stat corruption risk in `addons/critical-hit.js`.

Core `attack()` computes normal damage from `s.atk`, and on a killing blow calls canonical `win()`. Canonical `win()` may:

- level Luke up;
- permanently add `s.atk += 3`;
- transition to world;
- call `render()`;
- canonical `render()` calls `save()` before rendering.

The critical-hit add-on currently implements its +5 critical bonus by temporarily doing:

- `original=s.atk`;
- `s.atk=original+5`;
- call canonical wrapped `attack()`;
- finally `s.atk=original`.

That creates two concrete bugs on a critical killing blow:

1. `win() -> render() -> save()` can persist the temporary +5 `s.atk` into autosave before the `finally` restores runtime state.
2. If the critical killing blow also levels Luke up, canonical `win()` adds the real permanent +3 while ATK is boosted, then the old `finally` resets to the pre-critical `original`, discarding the legitimate level-up ATK gain in live state.

Thus a presentation/combat modifier can corrupt persistent progression depending on whether the critical attack is the killing/level-up blow.

## REQUIRED REPAIR

1. Preserve the existing 10% critical chance and +5 temporary ATK bonus.
2. Preserve canonical `attack()` / `win()` / level-up flow and all wrapper compatibility.
3. Do not duplicate the attack or victory state machine.
4. During a critical sequence, ensure any canonical `save()` persists ATK with the temporary +5 removed.
5. After canonical attack returns, remove only the temporary +5 while preserving any legitimate permanent ATK delta applied by canonical progression during the attack (for example level-up +3).
6. Preserve `save()` arguments and return behavior.
7. Do not affect non-critical attacks or non-critical saves.
8. Expose a pure/read-only normalization contract for fail-closed acceptance.
9. Do not change HP, MP, EXP, gold, enemy HP, equipment, critical rate, critical damage bonus, or level-up values.

## AUTOMATED ACCEPTANCE

Acceptance must prove at minimum:

- critical rate remains 0.10;
- temporary bonus remains +5;
- a boosted ATK value normalizes to canonical ATK by removing exactly +5;
- a critical sequence that receives a +3 canonical progression delta resolves to original ATK +3 after temporary bonus removal;
- save safety and canonical-delta preservation are explicitly declared;
- assembled browser smoke and 390x844 iPhone touch/world visual-liveness remain PASS;
- Pages deployment succeeds.

## COMPLETION CONDITION

Automated completion requires:

- requirement committed;
- minimal critical-hit repair committed;
- dedicated fail-closed acceptance committed;
- JavaScript/static/add-on checks PASS;
- assembled browser smoke PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS;
- queue/current synchronized.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not duplicate canonical `attack()` or `win()`;
- do not make critical +5 permanent;
- do not lose legitimate level-up +3 on critical kills;
- do not mark physical iPhone PASS from CI.