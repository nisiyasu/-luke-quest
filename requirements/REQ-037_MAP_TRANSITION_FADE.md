# REQ-037 — Map Transition Fade / Scene Change Feedback

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PRESENTATION / WORLD_TRANSITION / POLISH
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

fresh tree / add-on inventory and latest sequential patch inspection found:
- `ux-v139.js` already provides an original synthesized map-transition SFX cue
- no dedicated visual fade/wipe/scene-transition presentation layer was found by filename inventory or code search
- map changes currently jump immediately between world maps

The next safe player-visible polish gap is therefore a visual scene-change cue that complements the existing v0.139 sound without changing map logic.

## SCOPE

Add a short non-blocking visual fade for successful world map transitions.

Minimum behavior:
- when canonical `checkGate()` changes `s.map` while remaining on world screen, flash/fade a full-screen presentation layer
- old map logic and coordinates remain untouched
- visual layer must not intercept taps/drags/buttons
- layer cleans itself up after the animation
- repeated rapid transitions must replace/restart one layer rather than accumulate overlays

## MOBILE / ACCESSIBILITY

- use CSS animation only; no large layout reflow
- `pointer-events:none`
- respect `prefers-reduced-motion`: shorten/disable animation while preserving safe transition semantics
- use safe full-viewport fixed overlay without shrinking gameShell
- do not cover the screen permanently if animation events fail; include timed cleanup fallback

## INPUT / GAMEPLAY SAFETY

- do not change `checkGate()` return value
- do not change `s.map`, `s.x`, `s.y`, story flags, collision or encounter rate
- do not call `action()` or movement methods
- REQ-001 Dynamic Touch and central stopMoving semantics remain authoritative
- REQ-021 Tap Anywhere and REQ-022/034 fullscreen layers must remain unchanged
- overlay must be below dialogue/critical UI if needed but above world imagery during its brief fade

## TEST REQUIREMENTS

1. JavaScript syntax PASS
2. a successful map transition creates exactly one fade overlay
3. overlay is fixed/full-viewport and `pointer-events:none`
4. repeated transition replaces/reuses one overlay instead of stacking
5. cleanup fallback exists
6. reduced-motion path exists
7. canonical `checkGate()` state/return semantics preserved
8. REQ-001/021/022/034 integrated mobile regression PASS
9. existing v0.139 transition SFX remains present/owned by v0.139
10. Pages deploy SUCCESS

## COMPLETION CONDITION

- public Pages contains visual map-transition feedback
- automated browser regression proves overlay safety and non-stacking behavior
- no gameplay/input/fullscreen regressions
- iPhone subjective transition feel remains PENDING until Owner physical verification

## DO NOT REPEAT

- do not duplicate v0.139 map-transition SFX
- do not replace canonical gate/map logic
- do not use a clickable/opaque persistent overlay
- do not animate the entire DOM tree or game state
- do not mark physical iPhone feel PASS from headless browser CI