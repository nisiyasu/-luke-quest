# REQ-138 — Battle Level-Up Summary

PRIORITY: P1
STATUS: VERIFY
SOURCE: Directive-authorized player-visible continuation after REQ-137. Fresh canonical `win()` audit shows level-up state (`s.lv`, `s.nx`, recalculated stats, full HP/MP) is applied inside the XP loop but no level-up result is surfaced in the post-victory dialogue.

## Purpose
When a victory causes one or more level-ups, tell the player immediately in the existing post-victory dialogue without changing any canonical progression math or reward mutation.

## Requirements
1. Preserve the current wrapped `win()` chain as the sole authority for XP, level, next-XP threshold, stat recalculation, HP/MP restoration, gold, wins, story flags, enemy cleanup, and world transition.
2. Capture pre-victory level before invoking the current canonical/wrapped `win()` chain; read post-victory level only after it returns successfully.
3. If post-victory level is greater than pre-victory level and a valid post-victory `s.dialog` exists, append exactly one concise level-up line showing the actual transition, e.g. `レベルアップ！ LV3 → LV4`.
4. Support multi-level gains by showing the actual before/after levels once, not one line per loop iteration.
5. If no level-up occurred, append nothing.
6. Preserve canonical victory narration and the REQ-137 defeated-enemy / EXP / G reward summary.
7. Do not mutate XP, `s.lv`, `s.nx`, derived stats, HP/MP, gold, wins, inventory, encounter balance, save schema, or story facts.
8. Do not add click/pointer/touch handlers and do not create world Action/Movement ownership.
9. Repeated battles and repeated rendering must not multiply wrappers or duplicate the level-up line.
10. Existing REQ-137/136/135/134 and P0 behavior must remain intact.

## Acceptance
- New JavaScript passes syntax validation.
- 390×844 assembled browser smoke proves a synthetic victory crossing one level threshold:
  - level changes exactly according to canonical `win()`;
  - XP carry and gold/win reward remain canonical exactly once;
  - post-victory dialogue visibly contains exactly one `LV before → LV after` summary;
  - REQ-137 reward summary remains visible exactly once;
  - canonical victory dialogue remains non-empty;
  - rerender does not duplicate the level-up summary;
  - a second synthetic no-level victory produces no level-up line;
  - no world Action or Movement ownership is created;
  - REQ-138 adds no click/pointer/touch handlers.
- REQ-137 / REQ-136 / REQ-135 / REQ-134 regression smokes remain PASS.
- Standard Pages build/deploy SUCCESS with implementation included.
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner verifies actual iPhone presentation.

## Verification checkpoint
- Implementation/public checkpoint: `5d8fce09794709815fec5c11e62db4401d970778`.
- Dedicated acceptance: `REQ-138 Battle Level-Up Summary` run `34210780072` — SUCCESS.
- Exact-head Pages: `Deploy LUKE QUEST to GitHub Pages` run `34210779801` — SUCCESS.
- Acceptance verified canonical level mutation, XP carry, gold/win exactly once, exactly one visible level-up summary, REQ-137 reward-summary coexistence, rerender idempotence, no false summary on a no-level second victory, and no world Action/Movement ownership from REQ-138.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## Non-goals
- No progression rebalance.
- No new level-up animation/audio/haptics.
- No stat-allocation system.
- No Chapter 2 work.
- No story rewrite.
