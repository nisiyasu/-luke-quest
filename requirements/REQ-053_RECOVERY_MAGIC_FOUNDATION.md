# REQ-053 — Recovery Magic Foundation

STATUS: VERIFY
PRIORITY: P1
TYPE: BATTLE / MAGIC / MP / PLAYER-VISIBLE / STRATEGY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive calls for magic/skills. Fresh audit found the current canonical MP system exposed one offensive battle skill only:

- `蒼閃` / 4 MP;
- persistent `mp` / `mmp` with legacy migration;
- level-up and defeat recovery;
- insufficient MP safely skips the enemy turn.

Existing herbs already provide item healing and poison cure, so the first actual magic action was implemented as a distinct MP-based recovery option rather than duplicating herb identity.

## IMPLEMENTED BEHAVIOR

`addons/recovery-magic.js` now:

1. adds `癒光` as a compact battle command beside the existing MP skill row;
2. costs exactly 5 MP on a valid cast;
3. heals `14 + lv * 3`, capped by missing HP;
4. never cures poison, preserving herbs as the poison-cure item path;
5. at full HP, spends no MP and consumes no enemy turn while logging the reason;
6. with insufficient MP, changes neither HP nor MP and consumes no enemy turn while logging the reason;
7. on a valid cast, heals only to `mh`, logs the actual recovered amount, saves, then delegates the response through the current canonical `enemyTurn()` chain;
8. therefore preserves battle poison and REQ-052 readable normal-enemy behavior in the enemy-response chain;
9. leaves `蒼閃`, MP migration, level-up/defeat recovery, herb behavior, rewards, encounters and story unchanged;
10. keeps UI inside the existing compact skill row instead of introducing a new large iPhone control panel.

Implementation checkpoints:
- requirement registration: `baea8964e7c6646453682b6835608424fcab87c9`
- implementation: `cb2fd86ecd1aeb4f9ce526f250862e497be7733b`
- dedicated acceptance: `1d821476f01f4fff31bdc6f711cd54e7be78318c`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- spell name/cost contract;
- deterministic level-based heal calculation;
- heal cap at missing HP / zero at full HP;
- full-HP and insufficient-MP no-cost/no-turn contracts;
- poison remains distinct and herb cure identity remains active;
- valid casts delegate canonical enemyTurn;
- `蒼閃` MP skill contract remains present;
- REQ-052 readable normal-enemy behavior remains present;
- battle-poison/herb-cure contract remains present.

GitHub Pages workflow run `34011930589`: SUCCESS.

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

- do not replace herbs with magic;
- do not silently cure poison with `癒光`;
- do not bypass canonical enemyTurn after a successful cast;
- do not redesign the MP system or story canon;
- do not claim physical iPhone PASS from automation.
