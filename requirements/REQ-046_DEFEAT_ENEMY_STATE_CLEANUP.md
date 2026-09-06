# REQ-046 — Defeat Enemy-State Cleanup

STATUS: VERIFY
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
- first Pages workflow run `34010304447`: SUCCESS

## INTEGRATED RE-AUDIT — LEGACY / MANUAL BACKUP BOUNDARY

The initial repair was correct for new live defeats, but fresh post-repair audit of `addons/manual-save-slots.js` found another persistence entry point:

- manual backup snapshots the entire `s` object and forces only `screen='world'`;
- a backup created before this repair can legitimately contain stale `enemy` / `ehp` from an old defeat;
- manual load assigns that legacy snapshot back to `s`, forces world, then calls canonical `save()` immediately;
- the first repair only observed a live `battle -> world` transition, so a legacy world snapshot did not pass that detector.

Therefore `VERIFY` was correctly reopened rather than treating the first green run as final proof.

## FINAL HARDENING

`addons/battle-defeat-state-cleanup.js` now treats `enemy` and `ehp` as battle-only persistence state:

- `shouldSanitizeEnemyState(screen)` is true outside battle and false during battle;
- `sanitizeBattleOnlyEnemyState()` clears only stale non-battle `enemy` / `ehp`;
- canonical `save()` is wrapped while preserving arguments/return behavior, so legacy manual loads and any other non-battle persistence boundary are cleaned before storage;
- initialization sanitizes old autosave state forward before the add-on's initial save;
- live battle enemy state and battle saves remain untouched;
- the existing live defeat detector remains in place and persists the cleaned result;
- no manual-backup redesign or second defeat/save system was introduced.

Final hardening commits:

- requirement reopen / legacy boundary: `98a404a65bee29ab80bc8b85a24bf24e0add28da`
- save-boundary implementation: `54d2b36a17acfc77dde728a9d449c0644045735c`
- hardened fail-closed acceptance: `1ffe55366728d15a6aa9594a8cc38b2f62493192`

The dedicated `lqTouchSmoke` acceptance now additionally proves:

- non-battle save sanitization declared;
- non-battle load sanitization declared;
- world/title are sanitized;
- battle is not sanitized;
- canonical live defeat detection still works;
- ordinary battle continuation and unrelated world state are not misclassified.

## FINAL VERIFICATION EVIDENCE

Pages workflow run `34010441091`: SUCCESS.

PASS steps include:

- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

## COMPLETION CONDITION

Automated implementation completion is satisfied for both:

- live defeat transition cleanup; and
- legacy/non-battle save sanitization.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not rewrite canonical defeat recovery;
- do not turn REQ-038 presentation code into a state owner;
- do not clear enemy during live battle;
- do not redesign manual backup slots;
- do not alter poison or progression values;
- do not treat a green live-defeat test alone as proof that legacy snapshots are sanitized;
- do not mark physical PASS from CI.