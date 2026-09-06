# REQ-103 — Windcut Pass Landmark Lighting Continuity

STATUS: IN_PROGRESS
PRIORITY: P1
OWNER_SOURCE: AUTONOMOUS_DEV_DIRECTIVE / WORK_QUEUE selection rule 8 after fresh audit of player-visible unfinished coverage
CREATED_AT: 2026-09-06 Asia/Tokyo
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH: main

## 1. Problem

`windcutPass` is already a canonical walkable continuation area with route guidance, regional battle background, area title, ambient layer, cloud shadows, terrain footsteps, and journal continuity.

Fresh HEAD audit found that `addons/world-landmark-lighting.js` only covers `town`, `forest`, and `observation`.

Therefore the newest first-chapter route can visually lose the landmark-lighting depth language used elsewhere, even though its actual clue / sign / north-boundary objects are already canonical and player-visible.

This is a presentation continuity gap, not a gameplay-gate defect.

## 2. Goal

Give Windcut Pass a restrained cold high-altitude landmark-light treatment that makes the existing route landmarks easier to read without introducing a new story clue, new interactable, new required flag, new reward, or new collision rule.

The lighting must remain subordinate to the map and must not turn the pass into a brightly lit town.

## 3. Required behavior

On `windcutPass`:

- add presentation-only landmark glints to existing meaningful route positions
- prioritize the tilted sign / north-boundary route readability rather than decorative random lights
- use a cold / wind-exposed visual treatment distinct from warm town lamps, forest campfire, and hostile observation torches
- do not intercept pointer input
- do not change canonical `action()` behavior
- do not change collision or map transition gates
- do not add save flags
- do not mutate story state

## 4. Regression requirements

Preserve all existing `world-landmark-lighting.js` behavior:

- town lamps remain 4
- forest camp glow remains 1
- forest camp spent/rest state remains reflected
- observation hostile torches remain 4
- unknown maps continue to receive no landmark lights
- existing map rendering continues to remove/rebuild lighting without duplication
- reduced-motion behavior remains safe

## 5. Verification contract

Add a late fail-closed smoke contract that verifies at minimum:

- runtime landmark-light status API is present
- `windcutPass` has the intended cold landmark coverage
- existing town / forest / observation counts are unchanged
- unknown map fallback remains empty
- coverage is presentation-only / pointer-safe

The smoke must not mutate gameplay state.

## 6. Public completion gate

Do not claim IMPLEMENTATION_COMPLETE merely because source code exists.

Required before moving to VERIFY:

- JavaScript / static guards PASS
- add-on contract PASS
- assembled browser smoke PASS
- 390x844 touch/fullscreen regression PASS
- GitHub Pages workflow SUCCESS on a HEAD containing this implementation
- deployed build includes the updated landmark-lighting add-on and smoke

IOS_PHYSICAL_VERIFICATION may remain PENDING for subjective visual feel.

## 7. Protected boundaries

Do not change:

- protected story canon
- `withdrawProofSeen` authority
- `northCliffRoad` / `windcutPass` transition gates
- canonical NPC texts or clue meaning
- encounter behavior
- save schema
- REQ-021 / REQ-022 / REQ-001 unified touch behavior

## 8. Completion state

IMPLEMENTATION_COMPLETE: NO
PAGES_VERIFIED: NO
IOS_PHYSICAL_VERIFICATION: PENDING
