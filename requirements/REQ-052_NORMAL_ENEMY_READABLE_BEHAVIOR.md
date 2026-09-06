# REQ-052 — Readable Normal Enemy Behavior

STATUS: VERIFY
PRIORITY: P1
TYPE: BATTLE / ENEMY-AI / PLAYER-VISIBLE / STRATEGY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive requires enemy AI. Fresh implementation audit found:

- the optional forest boss already has a dedicated, telegraphed multi-turn pattern in `addons/forest-boss-patterns.js` and was not duplicated;
- battle poison already wraps `enemyTurn()` for a small enemy subset and had to remain compatible;
- normal enemies still ultimately used the core `enemyTurn()` behavior: roll one damage value from `s.enemy.a`, optionally halve for guard, then attack;
- normal enemies therefore differed statistically by attack range but did not expose a readable tactical pattern to the player.

## IMPLEMENTED BEHAVIOR

`addons/normal-enemy-readable-behavior.js` now:

1. excludes `苔角の森王` and any future enemy object explicitly marked `isBoss` / `boss`;
2. keeps a battle-local ordinary-enemy turn counter and resets it on a fresh normal encounter / battle exit;
3. classifies existing ordinary enemies conservatively as PRESSURE, BURST, or STEADY metadata;
4. gives PRESSURE enemies a readable stronger attack every third enemy turn;
5. gives BURST enemies a readable stronger attack every fourth enemy turn;
6. gives STEADY enemies no artificial power spike;
7. renders a visible NEXT-turn intent cue, including a clear warning when the next attack is stronger and that guard is useful;
8. reuses the full canonical `enemyTurn(g)` wrapper chain, passing guard through unchanged;
9. temporarily boosts only the current enemy attack-range array for a telegraphed strong turn, restoring the exact original array in `finally`;
10. leaves battle poison in the call chain and leaves optional-boss pattern authority unchanged;
11. changes no enemy roster, reward, encounter rate, story, poison rule, or save schema.

Implementation checkpoints:
- requirement registration: `bc3ee8778cb37ae7eea333cb4a89a8aa050e12a3`
- implementation: `8a5d27d10241087001266fa2d5b8a2a939a8ea8d`
- dedicated acceptance: `6fed36d1beaced2075412c77403599fd22789d3e`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- readable intent/status contract exists;
- canonical enemyTurn and guard passthrough are declared;
- battle-local counter contract exists;
- PRESSURE cadence = 3 and deterministic strong-turn calculation;
- BURST cadence = 4 and deterministic strong-turn calculation;
- STEADY never receives an artificial strong turn;
- range boosting is pure with respect to its input array;
- optional forest boss is excluded while ordinary enemies are not;
- battle-poison contract remains present;
- optional boss telegraph/pattern contract remains present.

GitHub Pages workflow run `34011798629`: SUCCESS.

PASS coverage includes:
- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- PWA / raster transport / approved Luke asset validation;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

Automated implementation completion is satisfied. Physical/subjective iPhone battle-feel verification remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not duplicate the existing optional boss AI;
- do not bypass canonical `enemyTurn()` for damage resolution;
- do not add untelegraphed random power spikes;
- do not change enemy rewards, story, encounter rates, poison, or boss canon;
- do not claim physical iPhone PASS from automation.
