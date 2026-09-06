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

## IMPLEMENTED REPAIR

Added `addons/battle-defeat-state-cleanup.js` as a collision-safe consistency layer:

- canonical `enemyTurn()` remains the sole owner of defeat trigger and recovery transition;
- `isCanonicalDefeatRecovery(beforeScreen,state)` detects only battle -> world / town / full-HP / 宿屋主人 recovery;
- after that canonical transition returns, only `s.enemy` and `s.ehp` are normalized to `null` / `0`;
- cleaned state is persisted through canonical `save()`;
- ordinary battle turns are untouched;
- REQ-038 presentation still receives its captured pre-defeat enemy name;
- later poison/MP wrappers continue to observe the same battle -> world transition;
- no victory/escape/progression/balance logic was duplicated.

## DEDICATED ACCEPTANCE

Added:

`addons/zzzzzzzzzzzzzzzzzzzzzzzzzz-defeat-enemy-state-cleanup-smoke.js`

Under `lqTouchSmoke` it fails closed unless:

- canonical recovery ownership remains `index.html enemyTurn()`;
- cleanup fields are exactly represented by `enemy` and `ehp` contract entries;
- clean-state persistence is declared;
- ordinary battle preservation is declared;
- canonical defeat recovery is detected;
- ordinary battle continuation and unrelated world state are not misclassified.

## VERIFICATION EVIDENCE

- requirement registration: `a9cf390ec8245d62bbe5305e8f9c7a3fbb28f447`
- implementation: `46fd855fc792aeeba3c3b4ae4769b15ce6daccd9`
- dedicated acceptance: `445289b1c08fa55d66879f572b3d28332756ee46`
- Pages workflow run: `34010304447` / SUCCESS
- PASS steps include JavaScript/add-on/static validation, assembled browser smoke, 390x844 floating-touch + iPhone world visual-liveness, upload and Pages deploy.

## COMPLETION CONDITION

Automated implementation completion is satisfied.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not rewrite canonical defeat recovery;
- do not turn REQ-038 presentation code into a state owner;
- do not clear enemy during live battle;
- do not alter poison or progression values;
- do not mark physical PASS from CI.