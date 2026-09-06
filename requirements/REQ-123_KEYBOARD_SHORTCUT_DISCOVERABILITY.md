# REQ-123 — KEYBOARD SHORTCUT DISCOVERABILITY

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / UX
SOURCE_CAPABILITY: `REQ-122_KEYBOARD_GAMEPLAY_COMPLETENESS.md`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## PURPOSE

REQ-122 makes the core gameplay loop keyboard-operable, but keyboard-only players should not need external instructions to discover battle shortcuts or keyboard focus. Add presentation-only discoverability without changing canonical commands or touch layout.

## REQUIRED

- battle command buttons expose compact `1` / `2` / `3` / `4` keyboard badges or equivalent hints while retaining the original Japanese command labels;
- keyboard focus on battle commands is clearly visible with `:focus-visible` presentation;
- hints must not capture pointer events or alter button click targets;
- mobile/touch users must not lose space needed for the existing 390x844 layout;
- reduced-motion safe;
- no battle balance, input authority, save, story, collision or touch-controller mutation.

## ACCEPTANCE

- all four canonical battle command buttons receive correct non-interactive keyboard hints;
- original command labels and `onclick` authorities remain intact;
- focus-visible styling exists;
- REQ-122 status object remains present;
- Tap Anywhere/fullscreen/touch regression remains PASS;
- assembled browser, 390x844, REQ-081, REQ-082 and Pages deploy PASS.

Move to VERIFY only after public Pages SUCCESS.

EOF
