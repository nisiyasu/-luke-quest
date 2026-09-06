# REQ-109 — 北追跡ルート・コンパス

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYABILITY / ORIENTATION / JOURNAL UX
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
CREATED_AT: 2026-09-07 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main
IOS_PHYSICAL_VERIFICATION: PENDING

## 1. FRESH PROBLEM EVIDENCE

Fresh HEAD `c4f7ea13f199d60be055e8546f05b6530d6946a9` contains multiple public northern pursuit intervals and local clue markers. This materially improves playability, but the route now spans several maps. A player returning after a break can still need to reconstruct:

- where they currently are,
- what the immediate local investigation target is,
- whether progress currently means searching locally or returning north,
- which direction is the safe backtrack.

The Owner previously reported the north evacuation route as unclear. The game should not require memory of a walkthrough.

## 2. PURPOSE

Add a compact, spoiler-safe `NORTH ROUTE COMPASS` inside the existing Adventure Journal / pause menu for the northern pursuit route.

It must answer, at a glance:

1. CURRENT AREA
2. NOW — the immediate player task
3. FORWARD — direction / type of next movement without naming undiscovered future locations
4. BACK — safe backtrack direction

This is an orientation aid, not a new quest/state system.

## 3. WORLD / IPHONE CONSTRAINT

Do NOT consume additional world viewport space.

- No new fixed HUD bar.
- No new world-bottom panel.
- No new floating button.
- No world pointer handler.
- UI exists only inside the existing MENU / Adventure Journal.
- iPhone world remains viewport-primary under REQ-022.

## 4. SPOILER-SAFE ROUTE COVERAGE

Cover the canonical northern pursuit maps that exist in fresh HEAD, including:

- evacuation / evacRoute
- northCliffRoad
- windcutPass
- northRidgeApproach
- windShelf
- skylineTraverse
- cloudbreakSaddle

For each covered map:

- derive visible area name from canonical `MAPS[map].name` where available;
- expose only information already justified by current state / current local objective;
- never reveal the name of an undiscovered future map;
- never reveal hidden Leon / Glenn / Eleanor / Elysia truth.

Special evacuation behavior:

- before `withdrawProofSeen`: NOW must direct the player to the withdrawal-order clue, not the north exit;
- after `withdrawProofSeen`: NOW/FORWARD must immediately switch to returning to the north exit.

For later northern route maps, NOW may reuse the already spoiler-safe `Adventure Journal` main objective.

## 5. PRESENTATION

Inside pause / Adventure Journal:

- compact card, readable at iPhone portrait width;
- CURRENT AREA is visually distinct;
- NOW is the strongest row;
- FORWARD and BACK are concise direction rows;
- no animation required;
- presentation DOM must be pointer-safe and must not block pause buttons or scrolling;
- section must not render on unrelated maps.

## 6. STATE / SAVE / CANON

- No new required story flag.
- No save schema change.
- No persistent route-history field.
- Derive entirely from current `s.map`, existing flags, canonical map metadata and existing spoiler-safe objective authority.
- Do not change gate/collision/battle/reward/item/enemy logic.

## 7. INPUT SAFETY

Protect REQ-021 / REQ-022 / REQ-001:

- no new pointerdown/move/up/cancel world authority;
- Tap Anywhere remains canonical `action()` exactly once;
- drag remains Movement and release no Action;
- central `stopMoving()` and visibility/blur/rerender transition safeguards remain unchanged;
- MENU/button/link/input exclusion behavior remains unchanged.

## 8. FAIL-CLOSED ACCEPTANCE

Dedicated late assembled-browser acceptance must verify at minimum:

- registry covers all current north-route map ids above;
- unknown/unrelated map returns no compass model;
- area name is canonical;
- evacuation before proof targets the clue;
- evacuation after proof immediately targets north exit;
- Cloudbreak and at least one earlier ridge map reuse a valid spoiler-safe current objective;
- no future map name is leaked in FORWARD text;
- actual pause-menu DOM contains one compass on a covered map;
- DOM contains CURRENT / NOW / FORWARD / BACK semantics;
- actual section is inside pause panel / Journal context;
- section and decorative children are pointer-safe;
- pause buttons remain present and usable;
- no duplicate compass after repeated render;
- closing/leaving pause or changing to unrelated map leaves no stale compass;
- save schema / required story flags unchanged;
- P0 input/fullscreen public status remains present.

Broken REQ-109 must emit the existing fatal North-route smoke failure marker before Pages upload/deploy.

## 9. PUBLIC COMPLETION GATE

Before VERIFY:

- JavaScript syntax PASS
- static regression PASS
- add-on contract PASS
- dedicated REQ-109 acceptance PASS
- assembled browser PASS
- 390x844 Touch/Fullscreen PASS
- visibilitychange regression PASS
- existing North-route / REQ-107 / REQ-108 regressions PASS
- Pages workflow SUCCESS on complete implementation HEAD
- public build inclusion PASS

## 10. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES
PAGES_VERIFIED: YES
IOS_PHYSICAL_VERIFICATION: PENDING

Implementation checkpoint: `b8199732e36c9c3cf1f13513ccf44852661c475f`
Pages workflow: `34046783044` / SUCCESS

Implemented as `addons/north-route-compass.js`, injected by the existing Pages add-on assembly. The compass is Journal-only, derives its current area from canonical `MAPS`, reuses the spoiler-safe Adventure Journal objective for later route maps, switches evacuation guidance immediately after `withdrawProofSeen`, adds no world pointer authority, adds no save schema, and preserves the P0 Touch/Fullscreen surface.

Automated public gate confirmed JavaScript/add-on validation, static regression, assembled browser smoke, 390x844 floating Touch/Fullscreen smoke, REQ-081 north-cliff regression, REQ-082 encounter regression, artifact upload and Pages deploy all SUCCESS. Physical iPhone confirmation remains Owner-only and is not claimed.

## 11. NO-STOP

Registration, implementation, commit, Pages success, CURRENT autosave or any single checkpoint is not an autonomous stop condition.
