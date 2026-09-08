# REQ-137 — Battle Victory Reward Summary

PRIORITY: P1
STATUS: IN_PROGRESS
SOURCE: Directive-authorized player-visible continuation after REQ-136 public verification. Fresh battle-flow audit found canonical `winBase()` appends the defeat/EXP/G line to `s.log` and then immediately leaves battle for world dialogue, so the newly appended reward line can be invisible to the player.

## Purpose
A player must be able to see what they earned when a battle ends. Preserve the canonical battle reward logic exactly, but surface the already-computed enemy name / EXP / G reward in the existing victory dialogue after `winBase()` completes.

## Requirements
1. Preserve canonical `winBase()` as the only authority for XP, G, boss flags, enemy cleanup, battle state, save-relevant state, and victory resolution.
2. Capture the defeated enemy's already-defined `n`, `xp`, and `g` immediately before calling canonical `winBase()`.
3. After canonical `winBase()` returns successfully, when its victory dialogue is active, append one concise reward line containing the defeated enemy name plus the exact canonical EXP and G amounts.
4. Preserve the existing first victory dialogue line `戦闘勝利！` and any canonical boss/story progression.
5. Do not award XP/G a second time. Do not mutate HP/MP, enemy stats, inventory, turn order, encounter tables, difficulty, save schema, or Chapter 1 story facts.
6. Do not add click/pointer/touch handlers and do not create world Action/Movement ownership.
7. Do not display a reward summary when no valid defeated enemy was present or when canonical `winBase()` fails.
8. Must survive repeated battles without wrapper multiplication or duplicated reward lines.
9. Existing REQ-134/135/136 battle touch/log behavior and P0 world input/fullscreen behavior must remain intact.

## Acceptance
- New JavaScript passes syntax validation.
- 390×844 assembled browser smoke performs a synthetic normal victory and proves:
  - canonical XP increases exactly once by the enemy reward;
  - canonical G increases exactly once by the enemy reward;
  - screen returns to world according to canonical flow;
  - existing `戦闘勝利！` dialogue remains;
  - visible dialogue includes exactly one reward summary with expected enemy name / EXP / G;
  - no duplicate summary appears after rendering again;
  - no world Action or movement ownership is created by REQ-137;
  - REQ-137 adds no click/pointer handlers.
- REQ-136 / REQ-135 / REQ-134 regressions remain PASS.
- Standard Pages build/deploy SUCCESS with implementation included.
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner verifies actual iPhone presentation.

## Non-goals
- No reward rebalance.
- No new victory animation/audio/haptics.
- No Chapter 2 work.
- No story rewrite.
- No formal-art substitution.
