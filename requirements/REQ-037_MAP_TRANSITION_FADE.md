# REQ-037 — Map Transition Fade / Scene Change Feedback

STATUS: VERIFY
PRIORITY: P1
TYPE: PRESENTATION / WORLD_TRANSITION / POLISH
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

fresh tree / add-on inventory and latest sequential patch inspection found:
- `ux-v139.js` already provides an original synthesized map-transition SFX cue
- no dedicated visual fade/wipe/scene-transition presentation layer was found by filename inventory or code search
- map changes currently jump immediately between world maps

The next safe player-visible polish gap was therefore a visual scene-change cue that complements the existing v0.139 sound without changing map logic.

## IMPLEMENTATION

`addons/map-transition-fade.js` adds one presentation-only viewport fade when canonical `checkGate()` successfully changes `s.map` while the game remains on the world screen.

Behavior:
- wraps the current final `checkGate()` only to compare before/after map id
- preserves original return value and all map/state semantics
- creates a single fixed full-viewport fade layer
- `pointer-events:none` so the layer cannot steal tap/drag/button input
- repeated transition removes/replaces the prior layer rather than stacking
- animationend cleanup plus 700ms timed fail-safe cleanup
- `prefers-reduced-motion` shortens the animation
- existing map-transition SFX remains owned by `ux-v139.js`; no duplicate sound was added

## MOBILE / ACCESSIBILITY

- CSS animation only; no layout-flow change
- fixed overlay does not shrink gameShell
- pointer-safe
- reduced-motion path exists
- timed cleanup prevents a permanently covered screen if animation events fail

## INPUT / GAMEPLAY SAFETY

- `checkGate()` return value preserved
- `s.map`, `s.x`, `s.y`, story flags, collision and encounter rate unchanged by this add-on
- no `action()` or movement calls
- REQ-001 Dynamic Touch / central stopMoving remains authoritative
- REQ-021 Tap Anywhere and REQ-022/034 fullscreen presentation remain intact

## TEST / VERIFICATION

Dedicated browser acceptance:
- `addons/zzzzzzzzzzzzzzzzz-map-transition-fade-smoke.js`
- smoke-only preview drives two rapid transitions and verifies exactly one active overlay
- verifies `pointer-events:none`, fixed viewport position, two transition dispatches, v0.139 SFX ownership, reduced-motion declaration and cleanup fallback
- smoke cleanup confirms zero remaining fade layers

Checkpoints:
- requirement registration `af60ff3b2379750349c72b7d934795b44675b7a5`
- implementation `1fcc4ae9671209c7d3370d668682a87f1b869133`
- smoke-only probe export `22330f0fec48afbfab9f17215ce6dec0188a5c7d`
- browser acceptance `55b8e245aed51333ff20533bbff183eedadc67e7`
- Pages run `34007224602`: SUCCESS
- sequential syntax/static/add-on/PWA/assets: SUCCESS
- assembled gameplay browser smoke: SUCCESS
- 390x844 floating-touch + black-world visual-liveness smoke: SUCCESS
- upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated completion is satisfied:
- public Pages contains visual map-transition feedback
- automated browser regression proves overlay safety and non-stacking behavior
- existing gameplay/input/fullscreen regressions remain green
- v0.139 transition SFX ownership remains unchanged

Physical/subjective completion remains:
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner judges the transition feel on iPhone.

## DO NOT REPEAT

- do not duplicate v0.139 map-transition SFX
- do not replace canonical gate/map logic
- do not use a clickable/opaque persistent overlay
- do not animate the entire DOM tree or game state
- do not mark physical iPhone feel PASS from headless browser CI