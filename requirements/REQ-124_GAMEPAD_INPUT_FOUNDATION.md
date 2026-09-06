# REQ-124 — GAMEPAD INPUT FOUNDATION

STATUS: IN_PROGRESS
PRIORITY: P2
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / DESKTOP_GAMEPLAY
OWNER_SOURCE: `AUTONOMOUS_DEV_DIRECTIVE.md final-game input/device expansion + continuous player-visible improvement authority`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

Fresh repository audit after REQ-122/REQ-123 found no Gamepad API integration (`navigator.getGamepads`, `gamepadconnected`, or equivalent).

Add a safe standard-gamepad foundation without changing iPhone touch authority, battle semantics, save schema, story flags, collision, or Chapter 2.

The implementation must delegate to existing canonical keyboard/button/action paths rather than clone gameplay rules.

## 1. REQUIRED BEHAVIOR

### World

- left stick or D-pad = existing directional movement path
- A / primary button = existing world Action path
- B / secondary button = existing Escape/dialog-close path where applicable
- Start = existing world MENU path
- disconnect / blur / hidden document = release movement immediately

### Battle

- D-pad / left stick = existing battle-command keyboard focus navigation
- A / primary button = activate the currently focused canonical battle button
- if no battle command has focus, A may focus/activate the first canonical battle command rather than invent a separate attack implementation
- B must not silently map to run-away; accidental fleeing is prohibited

## 2. INPUT SAFETY

- standard Gamepad API only; unsupported browsers must no-op safely
- analog dead zone required
- held direction must not create runaway movement after disconnect, screen transition, dialogue, blur or visibilitychange
- button actions fire on rising edge, not every animation frame
- battle focus repeat must be bounded
- no touch/pointer handler changes
- no new combat damage/item/run logic
- no save or story mutation

## 3. IMPLEMENTATION STRATEGY

Prefer extending the already-loaded keyboard gameplay integration layer so gamepad events delegate to the same canonical paths proven by REQ-122.

Do not add a second gameplay authority.

## 4. AUTOMATED ACCEPTANCE

At minimum verify:

1. analog/dead-zone direction classification;
2. D-pad direction classification;
3. primary/secondary/start edge handling is single-fire;
4. movement release path exists for disconnect/blur/visibility;
5. battle activation uses canonical battle button/click authority;
6. unsupported Gamepad API is safe;
7. REQ-021 Tap Anywhere, REQ-022 fullscreen and REQ-001 Dynamic Touch authorities remain unchanged;
8. JavaScript syntax and assembled browser smoke pass;
9. 390x844 touch/fullscreen regression remains pass;
10. public Pages deployment succeeds before VERIFY.

## 5. COMPLETION STATE

IMPLEMENTATION_COMPLETE: NO
PUBLIC_PAGES_GATE: PENDING
PHYSICAL_GAMEPAD_VERIFICATION: PENDING
IOS_TOUCH_REGRESSION: REQUIRED_AUTOMATED

EOF
