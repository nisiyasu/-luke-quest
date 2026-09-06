# REQ-053 — Recovery Magic Foundation

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BATTLE / MAGIC / MP / PLAYER-VISIBLE / STRATEGY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive calls for magic/skills. Fresh audit found the current canonical MP system exposes one offensive battle skill only:

- `蒼閃` / 4 MP;
- persistent `mp` / `mmp` with legacy migration;
- level-up and defeat recovery;
- insufficient MP safely skips the enemy turn.

There is no actual magic action yet. Existing herbs provide item healing and poison cure, so a first spell should create a distinct tactical option rather than duplicate the herb exactly.

## REQUIRED BEHAVIOR

1. Add one conservative recovery spell named `癒光` as a battle command.
2. Cost: 5 MP.
3. Heal amount: deterministic from current level, `14 + lv * 3`, capped by missing HP.
4. `癒光` does NOT cure poison; herbs retain the item/status-cure identity.
5. If HP is already full, do not spend MP and do not consume an enemy turn; show a clear battle-log message.
6. If MP is insufficient, do not change HP/MP and do not consume an enemy turn; show a clear battle-log message.
7. On a valid cast:
   - subtract exactly 5 MP;
   - heal only up to `mh`;
   - log the actual healed amount;
   - save the state;
   - delegate the enemy response through the current canonical `enemyTurn()` chain so guard/poison/REQ-052 readable behavior remain authoritative.
8. Do not alter `蒼閃`, MP migration, level-up recovery, defeat recovery, herb behavior, poison cure, enemy rewards or encounter rates.
9. Keep UI compact on iPhone and do not create a new large control panel.

## ACCEPTANCE

- pure heal calculation is exposed and deterministic;
- heal caps at missing HP;
- full HP and insufficient MP are no-cost/no-enemy-turn paths;
- valid cast spends exactly 5 MP and then uses canonical enemyTurn;
- poison is not cleared by the spell;
- existing `蒼閃` button remains present;
- REQ-052 normal-enemy behavior and poison contracts remain present;
- assembled browser + 390x844 touch/world regression + Pages remain green.

## DO NOT REPEAT

- do not replace herbs with magic;
- do not silently cure poison with `癒光`;
- do not bypass canonical enemyTurn after a successful cast;
- do not redesign the MP system or story canon;
- do not claim physical iPhone PASS from automation.
