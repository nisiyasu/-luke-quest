# REQ-123 — KEYBOARD SHORTCUT DISCOVERABILITY

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / UX
SOURCE_CAPABILITY: `REQ-122_KEYBOARD_GAMEPLAY_COMPLETENESS.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## PURPOSE

REQ-122 made the core gameplay loop keyboard-operable. REQ-123 makes the battle keyboard commands discoverable in the game itself without changing canonical commands or touch layout.

## IMPLEMENTATION

Implementation: `addons/keyboard-shortcut-discoverability.js`
Implementation commit: `94e2321c80e59a204bd204ab272ee3349e5931a6`

- canonical battle buttons retain their original Japanese labels and original `onclick` authorities;
- compact `1` / `2` / `3` / `4` badges are attached to attack / guard / herb / run buttons;
- badges are `aria-hidden` presentation only and `pointer-events:none`;
- keyboard focus receives a clear `:focus-visible` outline/glow;
- coarse-pointer/mobile presentation reduces badge emphasis rather than consuming new layout space;
- reduced-motion safe;
- no battle balance, save, story, collision, touch-controller or canonical command mutation.

## AUTOMATED ACCEPTANCE

The assembled `?lqSmoke` gate verifies:

- exactly four canonical battle command buttons are discovered;
- correct `1..4` mapping;
- hints are presentation-only and pointer-transparent;
- original `attack() / guard() / potion() / runAway()` onclick authorities remain intact;
- `:focus-visible` styling exists;
- REQ-122 keyboard authority remains loaded;
- Tap Anywhere and iPhone fullscreen authorities remain loaded.

Public gate:

- Pages run `34061537485`: SUCCESS
- sequential JS validation: PASS
- collision-safe add-ons: PASS
- static regression guard: PASS
- add-on contract guard: PASS
- autosave bootstrap / PWA / raster transport / approved Luke dialogue asset checks: PASS
- assembled browser smoke: PASS
- 390x844 floating touch + iPhone world visual-liveness smoke: PASS
- REQ-081: PASS
- REQ-082: PASS
- upload/deploy: PASS

## COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES_AUTOMATED_PUBLIC
KEYBOARD_PHYSICAL_VERIFICATION: PENDING_OPTIONAL
IOS_PHYSICAL_VERIFICATION: NOT_REQUIRED_FOR_KEYBOARD_GATE
TOUCH_REGRESSION_AUTOMATED: PASS

Remain `VERIFY` until human keyboard feel-check or project verification policy permits automated/public acceptance to close it.

EOF
