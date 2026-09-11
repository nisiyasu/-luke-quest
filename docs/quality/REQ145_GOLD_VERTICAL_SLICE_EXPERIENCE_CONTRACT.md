# REQ-145 Gold Vertical Slice Experience Contract

STATUS: ACTIVE_CHALLENGER
BRANCH: `experiment/gold-vertical-slice`
QUALITY_LEVEL: Q5
BASELINE: `main@7ee5b18eddd5111265b25b106adee2fd3e64175d`

## Slice A — Aldia departure loop

The first challenger slice is deliberately narrow:

1. Aldia town world play
2. talk/investigate without leaving the world surface
3. leave through the south gate
4. read the field route and visual hierarchy immediately
5. fight one normal encounter
6. receive readable combat feedback/reward
7. return to traversal with the next objective still obvious

This slice does not invent Chapter 2 or alter protected Chapter 1 facts.

## Intended player experience

The player should feel within ten seconds that this is a deliberate mobile JRPG, not a webpage containing a map.
World space is dominant. HUD is subordinate. Characters separate from terrain. Interactions look discoverable. Movement space reads at a glance.
Battle should feel like the same product as exploration, with consistent typography, contrast, depth, and feedback hierarchy.

## Must-preserve authorities

- canonical `action()` and REQ-021 tap arbitration
- REQ-001 pointer ownership/dead-zone/central `stopMoving()`
- REQ-022 fullscreen/safe-area/viewport behavior
- canonical movement/collision/map coordinates
- canonical save schema and migrations
- canonical battle damage/reward/progression
- protected Chapter 1 story facts

## Baseline score target

Each checkpoint scores 0–5 on:

- FIRST_10_SECONDS
- WORLD_VISUAL_COHERENCE
- CHARACTER_READABILITY
- UI_HIERARCHY
- MOVEMENT_GAME_FEEL
- INTERACTION_FEEDBACK
- BATTLE_FEEDBACK
- OBJECTIVE_CLARITY
- DRAMATIC_IMPACT
- MOBILE_PERFORMANCE
- INPUT_SAFETY
- SAVE_PROGRESSION_SAFETY

Safety axes may not regress. Player-visible total must beat current main materially, not cosmetically.
