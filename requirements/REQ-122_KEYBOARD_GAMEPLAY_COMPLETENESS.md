# REQ-122 — KEYBOARD GAMEPLAY COMPLETENESS

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / DESKTOP_GAMEPLAY
OWNER_SOURCE: `AUTONOMOUS_DEV_DIRECTIVE.md §9 final game target: キーボード操作`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

LUKE QUESTのfinal game targetにはkeyboard operationが明記されている。Fresh base auditではworld movement/actionにはArrow/WASD + Enter/Spaceがある一方、battle command selectionとworld menu shortcutがkeyboard-onlyで完結していない。

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

Keyboard handling must call existing canonical commands rather than clone their logic.

## 2. REQUIRED BEHAVIOR

### World

Existing behavior must remain:

- Arrow keys / WASD = movement
- Enter / Space = canonical Action

Add:

- `M` = existing `openMenu()`
- `Escape` while a world dialogue/menu dialog is open = close that dialog safely

### Battle

Provide direct keyboard command shortcuts:

- `1` = attack
- `2` = guard
- `3` = herb/current canonical item command
- `4` = run away

Also provide keyboard focus navigation for visible battle command buttons:

- Arrow Left/Right/Up/Down moves focus through the battle command grid without executing a command
- Enter/Space on a focused battle command uses the browser/button's canonical click path, with no double-fire from the new listener

### Safety

- no action when editable text/input/textarea/select is active
- repeated keydown must not accidentally invoke a direct battle command repeatedly; direct `1..4` command shortcuts execute only on non-repeat keydown
- no battle shortcut while not in battle
- no world menu shortcut while not in world
- no duplicate global listeners after repeated render

## 3. ACCEPTANCE

Automated smoke must prove:

1. `1..4` map exactly once to the existing canonical battle functions.
2. repeated direct shortcut keydown is ignored.
3. world `M` calls existing `openMenu()`.
4. Escape closes existing world dialog without changing story flags.
5. battle arrow focus navigation does not invoke a command.
6. input/textarea/select/editable targets are excluded.
7. REQ-021/022/001 authorities remain present.
8. assembled browser smoke PASS.
9. 390x844 touch/fullscreen smoke PASS, proving keyboard add-on did not regress iPhone input/layout.
10. Pages deploy SUCCESS.

## 4. COMPLETION

Move to VERIFY only after public Pages SUCCESS.

`IOS_PHYSICAL_VERIFICATION` is not required for keyboard behavior itself, but touch/fullscreen regression must remain automated PASS.

EOF
