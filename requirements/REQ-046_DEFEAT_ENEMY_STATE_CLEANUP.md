# REQ-046 — Defeat Enemy-State Cleanup

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / BATTLE / DEFEAT / SAVE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH CANONICAL AUDIT

Fresh canonical `index.html` inspection shows that `enemyTurn()` handles defeat by restoring HP, moving Luke to town, switching `screen='world'`, setting recovery dialogue, and rendering/saving.

Unlike canonical victory and successful escape, that defeat branch does **not** clear `s.enemy` or `s.ehp`.

Therefore the post-defeat world autosave can retain the defeated battle's enemy object and enemy HP even though the player is no longer in battle. The world renderer currently ignores those fields and the next `startBattle()` overwrites them, so this can remain visually silent while still making persistent state contradict the actual screen.

REQ-038 intentionally remained presentation-only and did not repair canonical battle state. REQ-043/044 only own poison cleanup. This requirement closes the separate stale enemy-state boundary without changing defeat balance or presentation.

## REQUIRED REPAIR

1. Preserve canonical defeat trigger, HP recovery, town map, coordinates, encounter grace and宿屋 recovery dialogue.
2. Preserve REQ-038 defeat presentation and REQ-043/044 poison behavior.
3. Detect only the canonical battle -> town recovery transition.
4. After that transition, clear stale `s.enemy` and set `s.ehp=0`.
5. Persist the cleaned state after canonical defeat handling returns.
6. Do not add a second defeat state machine.
7. Do not clear enemy state during an ordinary battle turn.
8. Do not change victory/escape/boss reward/EXP/gold/equipment/status balance.
9. Expose a read-only cleanup contract for fail-closed acceptance.

## AUTOMATED ACCEPTANCE

Acceptance must prove:

- canonical recovery signature remains battle -> world / town / full HP /宿屋 dialogue;
- cleanup owns only stale enemy/ehp fields;
- enemy object is cleared and ehp normalized after detected recovery;
- ordinary battle continuation is not classified as defeat recovery;
- existing assembled browser and 390x844 iPhone touch/world visual-liveness tests remain PASS;
- Pages deploy succeeds.

## COMPLETION CONDITION

Automated completion requires requirement + implementation + dedicated acceptance committed, all relevant CI/browser/touch checks PASS, Pages SUCCESS, and queue/current synchronized.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not rewrite canonical defeat recovery;
- do not turn REQ-038 presentation code into a state owner;
- do not clear enemy during live battle;
- do not alter poison or progression values;
- do not mark physical PASS from CI.