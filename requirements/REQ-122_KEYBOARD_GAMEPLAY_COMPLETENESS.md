# REQ-122 — KEYBOARD GAMEPLAY COMPLETENESS

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / DESKTOP_GAMEPLAY
OWNER_SOURCE: `AUTONOMOUS_DEV_DIRECTIVE.md §9 final game target: キーボード操作`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

LUKE QUESTのfinal game targetにはkeyboard operationが明記されている。Fresh base auditではworld movement/actionにはArrow/WASD + Enter/Spaceがある一方、battle command selectionとworld menu shortcutがkeyboard-onlyで完結していなかった。

Touch authorityを変更せず、desktop keyboardだけでも主要gameplay loopを完結できるようにする。

## 1. SAFETY BOUNDARY

Do not change:

- REQ-021 Tap Anywhere Action
- REQ-001 Dynamic Touch Controller
- pointer/touch handlers
- canonical `attack() / guard() / potion() / runAway()` semantics
- battle damage/balance/turn order
- collision or map transition
- save schema
- story flags
- Chapter 2 or protected story canon

Keyboard handling delegates to existing canonical commands rather than cloning their logic.

## 2. IMPLEMENTED BEHAVIOR

Implementation: `addons/keyboard-gameplay-completeness.js`
Implementation commit: `8de4648085fc6e6fafbfec588771e0216916a00f`

### World

Existing behavior remains:

- Arrow keys / WASD = movement
- Enter / Space = canonical Action

Added:

- `M` = existing `openMenu()`
- `Escape` while a world dialogue/menu dialog is open = close that dialog safely

### Battle

Direct canonical command shortcuts:

- `1` = attack
- `2` = guard
- `3` = herb/current canonical item command
- `4` = run away

Keyboard focus navigation:

- Arrow Left/Right/Up/Down moves focus through the visible battle command buttons without executing a command
- Enter/Space on a focused battle command remains owned by the native button/canonical click path; the add-on does not intercept it and therefore does not double-fire

### Safety

- editable input/textarea/select/contenteditable targets are excluded
- repeated direct `1..4` keydown is ignored
- battle shortcuts are battle-only
- world menu shortcut is world-only
- one guarded global listener is installed
- touch/pointer authorities are unchanged

## 3. AUTOMATED ACCEPTANCE

The assembled `?lqSmoke` path verifies:

1. `1..4` map exactly once to the existing canonical battle functions.
2. repeated direct shortcut keydown is ignored.
3. world `M` delegates to existing `openMenu()`.
4. Escape closes a world dialog without changing story flags.
5. battle arrow focus navigation does not invoke a command.
6. editable targets are excluded.
7. REQ-021/022/001 authorities remain present.

Public gate:

- Pages run `34061342348`: SUCCESS
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

## 4. COMPLETION STATE

IMPLEMENTATION_COMPLETE: YES_AUTOMATED_PUBLIC
KEYBOARD_PHYSICAL_VERIFICATION: PENDING_OPTIONAL
IOS_PHYSICAL_VERIFICATION: NOT_REQUIRED_FOR_KEYBOARD_GATE
TOUCH_REGRESSION_AUTOMATED: PASS

Remain `VERIFY` until a human keyboard feel-check is performed or the project verification policy allows automated/public acceptance to close it.

EOF
