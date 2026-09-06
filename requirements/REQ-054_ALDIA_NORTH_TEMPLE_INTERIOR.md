# REQ-054 — Aldia North Temple Interior

STATUS: VERIFY
PRIORITY: P1
TYPE: WORLD / BUILDING-INTERIOR / CANON-CONSISTENCY / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## FRESH CAPABILITY AUDIT

The final-game directive explicitly requires a temple/building interior. Fresh canonical world audit found that Aldia already contained two direct temple references:

- the traveling elder warns: `北の神殿には近づきすぎるなよ。最近、偉い人ほど笑顔が怖い。`
- the existing `神殿の見習い` says the crystal behaved strangely and mentions Eleanor.

There was no walkable Aldia temple interior in the fresh MAPS/add-on inventory. The setting existed in dialogue but not as a playable place.

## IMPLEMENTED BEHAVIOR

`addons/aldia-north-temple.js` now:

1. adds one clear `北の神殿・正門` at a unique reachable Aldia town coordinate;
2. routes entry through the existing canonical `action()` chain, so keyboard/A/tap-anywhere all share the same interaction path;
3. adds walkable map `aldiaNorthTemple` with safe walls/floor/exit;
4. adds one temple attendant, one blue-white prayer crystal and one offering-slip shelf interaction;
5. reinforces only the mystery already established by town dialogue and does not reveal protected King/Eleanor truth;
6. adds no reward, healing, stat increase, quest completion, shop or mandatory progression gate;
7. exits safely back to an open Aldia tile near the north entrance;
8. registers the interior under `LQ_BUILDING_INTERIORS.aldiaNorthTemple`;
9. exposes `LQ_NORTH_TEMPLE_STATUS` for regression acceptance;
10. adds lightweight temple-specific presentation without creating a second input or world system.

Implementation checkpoints:
- requirement registration: `d06a065242d5730ae463c49900c7d504827723f6`
- interior implementation: `3811cc44aba06a66d5a7d88392f5e7b4d6416a06`
- dedicated acceptance: `ad67d402bae0f80fe2237cfa832930ab9ebc8dbb`
- acceptance-coordinate self-repair: `549e4d9a2b3a97b742b7a195eabf978e04ffe761`

## ACCEPTANCE

Dedicated `lqTouchSmoke` acceptance verifies:
- map exists with expected walkable dimensions;
- town temple door is unique and on a reachable town floor tile;
- attendant / crystal / side prop contracts exist;
- interior exit gate exists;
- town return tile is safe floor;
- no reward or healing was added;
- protected canon remains unchanged;
- canonical Action routing is declared;
- building-interior registry entry exists.

The first manual audit of the new smoke caught a test-only coordinate error (`y=8` instead of the actual exit row `y=9`) before claiming completion; the probe was repaired forward.

GitHub Pages workflow run `34012131433`: SUCCESS.

PASS coverage includes:
- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- PWA / raster transport / approved Luke asset validation;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

Automated implementation completion is satisfied. Physical/subjective iPhone temple look/feel verification remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not invent a second temple if a canonical interior later appears during fresh recovery;
- do not reveal protected plot truth;
- do not add a healing/reward loop merely because this is a temple;
- do not create a separate input system;
- do not claim physical iPhone PASS from automation.
