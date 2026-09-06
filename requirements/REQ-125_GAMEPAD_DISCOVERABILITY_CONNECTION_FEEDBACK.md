# REQ-125 — GAMEPAD DISCOVERABILITY / CONNECTION FEEDBACK

STATUS: VERIFY
PRIORITY: P2
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / UX
SOURCE_REQUIREMENT: `requirements/REQ-124_GAMEPAD_INPUT_FOUNDATION.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

REQ-124 gives LUKE QUEST a safe Gamepad API foundation, but fresh repository audit found no player-visible indication that a controller is connected or what the primary controls are.

A feature that silently works is difficult to discover and difficult to trust. REQ-125 adds compact, non-interactive connection/control feedback without occupying permanent mobile screen space.

## 1. IMPLEMENTED BEHAVIOR

Implementation: `addons/keyboard-gameplay-completeness.js`
Implementation commit: `a0282e51d9826b66a236b04bd07d82ace967adeb`

When a gamepad is connected:

- a compact `PAD接続中` overlay is shown;
- world context communicates movement, A action, B back and Start menu;
- battle context communicates D-pad/stick selection and A confirm;
- hint text follows the current screen context;
- disconnect, blur or hidden-document cleanup hides the hint together with the REQ-124 hard movement release.

When no gamepad is connected:

- the hint is hidden and empty;
- no permanent gamepad layout row is present;
- touch/iPhone layout remains unchanged.

## 2. SAFETY BOUNDARY

- presentation-only hint; REQ-124 input semantics preserved;
- `pointer-events:none` prevents touch/pointer interception;
- fixed compact overlay with safe-area bottom placement;
- no new gameplay authority;
- no save/story/collision/battle-balance changes;
- no Chapter 2 work.

## 3. AUTOMATED ACCEPTANCE

The assembled smoke verifies:

1. synthetic connected world state shows the hint;
2. world text includes Start menu guidance;
3. battle text is context-specific and includes A confirm;
4. computed pointer events are `none`;
5. disconnected state hides the hint;
6. REQ-021 Tap Anywhere and REQ-022 fullscreen authorities remain present;
7. REQ-124 gamepad direction/release/canonical battle-button checks still pass.

Public gate:

- Pages run `34064306307`: SUCCESS
- sequential patches v08-v80: PASS
- sequential patches v81-v120: PASS
- sequential patches v121-plus: PASS
- collision-safe add-ons: PASS
- static regression guard: PASS
- add-on contract guard: PASS
- REQ-063 autosave bootstrap: PASS
- PWA validation: PASS
- raster transport / approved Luke dialogue asset validation: PASS
- assembled browser smoke: PASS
- 390x844 floating touch + iPhone world visual-liveness smoke: PASS
- REQ-081 north cliff road smoke: PASS
- REQ-082 north cliff encounters smoke: PASS
- upload/deploy to GitHub Pages: PASS

## 4. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES_AUTOMATED_PUBLIC
PUBLIC_PAGES_GATE: PASS
PUBLIC_PAGES_RUN: `34064306307`
PHYSICAL_GAMEPAD_UI_VERIFICATION: PENDING
IOS_TOUCH_REGRESSION: PASS_AUTOMATED
TOUCH_AUTHORITY_CHANGED: NO
SAVE_CHANGED: NO
STORY_CHANGED: NO

Remain `VERIFY` until human physical-controller UI confirmation or project verification policy allows automated/public acceptance to close it.

EOF
