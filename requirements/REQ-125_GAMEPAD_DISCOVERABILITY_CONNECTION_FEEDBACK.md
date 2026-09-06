# REQ-125 — GAMEPAD DISCOVERABILITY / CONNECTION FEEDBACK

STATUS: IN_PROGRESS
PRIORITY: P2
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / UX
SOURCE_REQUIREMENT: `requirements/REQ-124_GAMEPAD_INPUT_FOUNDATION.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

REQ-124 gives LUKE QUEST a safe Gamepad API foundation, but fresh repository audit found no player-visible indication that a controller is connected or what the primary controls are.

A feature that silently works is difficult to discover and difficult to trust. Add compact, non-interactive connection/control feedback without occupying permanent mobile screen space.

## 1. REQUIRED BEHAVIOR

When a gamepad is actually connected:

- show a compact `PAD` hint overlay
- world hint communicates at least: movement / A action / B back / Start menu
- battle hint communicates at least: D-pad/left-stick selection + A confirm
- hint updates when screen context changes
- hint disappears promptly when the gamepad disconnects

When no gamepad is connected:

- no permanent gamepad UI
- iPhone/touch layout remains unchanged

## 2. SAFETY BOUNDARY

- presentation only; do not alter REQ-124 input semantics
- no pointer interception; overlay must be `pointer-events:none`
- no new gameplay authority
- no save/story/collision/battle-balance changes
- no Chapter 2 work
- do not add a permanent layout row
- respect safe-area placement and small portrait viewport

## 3. AUTOMATED ACCEPTANCE

Verify at minimum:

1. hint can be shown for a synthetic connected-gamepad state;
2. world and battle help text are context-specific;
3. hint is pointer-transparent;
4. disconnected state hides the hint;
5. normal no-gamepad state adds no visible UI;
6. REQ-021/022/001 touch/fullscreen authorities remain preserved;
7. assembled browser and 390x844 regression pass;
8. public Pages deployment succeeds before VERIFY.

## 4. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PUBLIC_PAGES_GATE: PENDING
PHYSICAL_GAMEPAD_UI_VERIFICATION: PENDING
IOS_TOUCH_REGRESSION: REQUIRED_AUTOMATED

EOF
