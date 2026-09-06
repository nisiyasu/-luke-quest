# REQ-052 — Readable Normal Enemy Behavior

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BATTLE / ENEMY-AI / PLAYER-VISIBLE / STRATEGY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive requires enemy AI. Fresh implementation audit found:

- the optional forest boss already has a dedicated, telegraphed multi-turn pattern in `addons/forest-boss-patterns.js` and must not be duplicated;
- battle poison already wraps `enemyTurn()` for a small enemy subset and must remain compatible;
- normal enemies still ultimately use the core `enemyTurn()` behavior: roll one damage value from `s.enemy.a`, optionally halve for guard, then attack;
- normal enemies therefore differ statistically by attack range but do not expose a readable tactical pattern to the player.

This requirement adds a narrow normal-enemy behavior layer without changing canon, enemy roster, rewards, encounter rates, poison rules, boss rules, or save format.

## REQUIRED BEHAVIOR

1. Apply only to ordinary enemies, never the optional boss `苔角の森王` or future enemies explicitly marked as bosses.
2. Track a battle-local normal-enemy turn counter that resets on a newly started normal battle and does not leak across battle exit.
3. Assign existing ordinary enemies to conservative behavior archetypes using their existing names only as lookup metadata:
   - PRESSURE: stronger attack on a readable cadence;
   - BURST: stronger attack on a slower cadence;
   - STEADY: ordinary attack cadence with no artificial power spike.
4. A strong attack must be telegraphed in the battle UI before the player commits the preceding action whenever possible.
5. Strong attacks must reuse the canonical `enemyTurn()` chain by temporarily adjusting only the current enemy attack range, then restoring it in `finally`.
6. Existing guard must still reduce the resulting canonical attack.
7. Existing poison wrapper must still tick/inflict through the canonical chain.
8. Optional boss pattern logic must remain authoritative and unchanged.
9. Do not add random hidden special attacks. The player should be able to read the next threat.
10. Keep the behavior small enough that it improves decision-making without turning basic encounters into boss fights.

## ACCEPTANCE

- ordinary battle gets a visible next-action/intent cue;
- PRESSURE and BURST strong-turn calculation is deterministic and exposed as a pure contract;
- STEADY enemies never receive an artificial strong-turn multiplier;
- boss is explicitly excluded;
- strong attack uses temporary attack-range adjustment and restores the original array after canonical enemyTurn returns;
- guard parameter is passed through untouched;
- battle poison and existing wrappers remain in the call chain;
- battle-local counter resets for a fresh normal encounter;
- assembled browser + 390x844 touch/world regression + Pages remain green.

## DO NOT REPEAT

- do not duplicate the existing optional boss AI;
- do not bypass canonical `enemyTurn()` for damage resolution;
- do not add untelegraphed random power spikes;
- do not change enemy rewards, story, encounter rates, poison, or boss canon;
- do not claim physical iPhone PASS from automation.
