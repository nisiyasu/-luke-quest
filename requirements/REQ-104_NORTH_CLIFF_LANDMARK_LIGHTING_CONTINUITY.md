# REQ-104 — North Cliff Landmark Lighting Continuity

STATUS: IN_PROGRESS
PRIORITY: P1
OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE / WORK_QUEUE selection rule 8 after fresh adjacent-route coverage audit
CREATED_AT: 2026-09-06 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main

## 1. Problem

Fresh HEAD audit after REQ-103 confirms `addons/world-landmark-lighting.js` now covers town, forest, observation and windcutPass, but canonical `northCliffRoad` still has zero landmark-light coverage.

North Cliff Road already has canonical route landmarks including the broken safety stake and the north-turn boundary. The route therefore has guidance, battle/title/ambient/cloud/footstep continuity, but lacks the same restrained visual landmark-readability layer now present in the adjacent Windcut Pass.

This is a presentation continuity gap only.

## 2. Goal

Add restrained cliff-route landmark glints to existing canonical North Cliff Road landmarks so the player can read the dangerous route and next northward direction without a walkthrough, new clue, or new gameplay gate.

## 3. Required behavior

On `northCliffRoad`:

- add presentation-only landmark glints to the existing broken safety stake `(15,12)` and north-turn boundary `(10,1)`
- use a distinct but compatible cold/stone exposed-route style; do not make the route look like a town or torch-lit dungeon
- do not intercept pointer input
- do not alter canonical `action()`
- do not change collision, encounters or transition gates
- do not add save flags or story state

## 4. Regression requirements

Preserve:

- town lights = 4
- forest camp = 1 and spent/rest state
- observation hostile torches = 4
- windcutPass glints = 2 at its canonical REQ-103 landmarks
- unknown map fallback = empty
- render cleanup/rebuild without duplicate light nodes
- reduced-motion safety
- REQ-021 / REQ-022 / REQ-001 unified touch behavior

## 5. Verification contract

Add a late fail-closed smoke that verifies:

- `northCliffRoad` has exactly two intended route landmark glints
- coordinates match canonical broken stake `(15,12)` and north boundary `(10,1)`
- REQ-103 windcutPass coverage remains exactly two `wind` glints
- existing town/forest/observation counts remain unchanged
- unknown map fallback remains empty
- lighting remains presentation-only and pointer-safe

No gameplay mutation in the smoke.

## 6. Public completion gate

Before VERIFY:

- JavaScript/static validation PASS
- add-on contract PASS
- assembled browser smoke PASS
- 390x844 touch/fullscreen regression PASS
- GitHub Pages SUCCESS on a HEAD containing implementation + smoke
- deployed build inclusion PASS

IOS_PHYSICAL_VERIFICATION remains PENDING until Owner physical confirmation.

## 7. Protected boundaries

Do not change protected story canon, `withdrawProofSeen`, northCliffRoad/windcutPass transition authority, NPC clue meaning, encounter behavior, save schema, or P0 input/fullscreen behavior.

## 8. Completion state

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING
