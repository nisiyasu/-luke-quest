# REQ-046 — Defeat Enemy-State Cleanup

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / BATTLE / DEFEAT / SAVE / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH CANONICAL AUDIT

Fresh canonical `index.html` inspection showed that `enemyTurn()` handles defeat by restoring HP, moving Luke to town, switching `screen='world'`, setting recovery dialogue, and rendering/saving.

Unlike canonical victory and successful escape, that defeat branch did not clear `s.enemy` or `s.ehp`.

Therefore the post-defeat world autosave could retain the defeated battle's enemy object and enemy HP even though the player was no longer in battle. The world renderer ignored those fields and the next `startBattle()` overwrote them, so this could remain visually silent while persistent state contradicted the actual screen.

REQ-038 remains presentation-only; REQ-043/044 remain poison owners. This requirement closes only the stale enemy-state boundary.

## FIRST REPAIR

`addons/battle-defeat-state-cleanup.js` was added as a collision-safe consistency layer:

- canonical `enemyTurn()` remains the sole owner of defeat trigger and recovery transition;
- `isCanonicalDefeatRecovery(beforeScreen,state)` detects only battle -> world / town / full-HP / 宿屋主人 recovery;
- after that canonical transition returns, only `s.enemy` and `s.ehp` are normalized to `null` / `0`;
- cleaned state is persisted through canonical `save()`;
- ordinary battle turns are untouched;
- REQ-038 presentation still receives its captured pre-defeat enemy name;
- later poison/MP wrappers continue to observe the same battle -> world transition;
- no victory/escape/progression/balance logic was duplicated.

Initial evidence:

- requirement registration: `a9cf390ec8245d62bbe5305e8f9c7a3fbb28f447`
- first implementation: `46fd855fc792aeeba3c3b4ae4769b15ce6daccd9`
- first dedicated acceptance: `445289b1c08fa55d66879f572b3d28332756ee46`
- Pages workflow run `34010304447`: SUCCESS

## INTEGRATED RE-AUDIT — LEGACY / MANUAL BACKUP BOUNDARY

The initial repair was correct for *new live defeats*, but fresh post-repair audit of `addons/manual-save-slots.js` found another persistence entry point:

- manual backup snapshots the entire `s` object and forces only `screen='world'`;
- a backup created before this repair can legitimately contain stale `enemy` / `ehp` from an old defeat;
- manual load assigns that legacy snapshot back to `s`, forces world, then calls canonical `save()` immediately;
- the first repair only observes a live `battle -> world` transition, so a legacy world snapshot does not pass that detector.

Therefore `VERIFY` was reopened. Live defeat cleanup alone is not a complete migration boundary for battle-only enemy state.

## REQUIRED HARDENING

1. Keep the live defeat cleanup and canonical defeat ownership intact.
2. Treat `enemy` / `ehp` as battle-only state for persistence purposes.
3. When canonical state is not `screen==='battle'`, sanitize stale enemy state before it is persisted.
4. Sanitize stale non-battle state on add-on initialization as well, so old autosaves are repaired forward.
5. Preserve legitimate enemy/ehp during battle and during battle saves.
6. Preserve canonical `save()` arguments/return behavior; do not create a second save system.
7. Preserve REQ-038 defeat presentation, REQ-043/044 poison cleanup, MP defeat recovery, rewards and progression.
8. Extend fail-closed acceptance to prove non-battle sanitization and battle preservation.

## COMPLETION CONDITION

Automated completion now requires both:

- live defeat transition cleanup; and
- legacy/non-battle save sanitization.

Then all JavaScript/static/add-on checks, assembled browser smoke, 390x844 touch/world visual-liveness and Pages deployment must succeed, with queue/current synchronized.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not rewrite canonical defeat recovery;
- do not turn REQ-038 presentation code into a state owner;
- do not clear enemy during live battle;
- do not redesign manual backup slots;
- do not alter poison or progression values;
- do not treat a green live-defeat test as proof that legacy snapshots are sanitized;
- do not mark physical PASS from CI.