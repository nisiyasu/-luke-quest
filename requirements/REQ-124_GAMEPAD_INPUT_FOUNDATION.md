# REQ-124 — GAMEPAD INPUT FOUNDATION

STATUS: VERIFY
PRIORITY: P2
TYPE: PLAYER_VISIBLE / INPUT / ACCESSIBILITY / DESKTOP_GAMEPLAY
OWNER_SOURCE: `AUTONOMOUS_DEV_DIRECTIVE.md final-game input/device expansion + continuous player-visible improvement authority`
TARGET_REPOSITORY: `nisiyasu/-luke-quest`

## 0. PURPOSE

Fresh repository audit after REQ-122/REQ-123 found no Gamepad API integration (`navigator.getGamepads`, `gamepadconnected`, or equivalent).

Add a safe standard-gamepad foundation without changing iPhone touch authority, battle semantics, save schema, story flags, collision, or Chapter 2.

The implementation delegates to existing canonical keyboard/button/action paths rather than cloning gameplay rules.

## 1. IMPLEMENTED BEHAVIOR

Implementation: `addons/keyboard-gameplay-completeness.js`
Implementation commit: `bde09ab2ff1ac599d1ef686a3ec83d0d52fd904e`

### World

- left stick or D-pad delegates to the existing keyboard directional movement path
- A / primary button delegates to the existing Enter world Action path
- B / secondary button delegates only to the existing Escape/dialog-close path where applicable
- Start delegates to the existing `M` world MENU path
- disconnect / blur / hidden document hard-release movement

### Battle

- D-pad / left stick delegates to the existing REQ-122 battle-command focus navigation
- A / primary button activates the currently focused canonical battle button
- if no battle command has focus, A focuses/activates the first canonical battle command
- B is deliberately not mapped to run-away, preventing accidental fleeing

## 2. INPUT SAFETY

- standard Gamepad API only; unsupported browsers safely no-op
- analog dead zone = `0.55`
- held world direction changes emit paired existing keydown/keyup paths
- movement is hard-released on gamepad disconnect, blur and hidden document
- button actions fire on rising edge rather than every animation frame
- battle focus repeat is bounded to 180ms
- no touch/pointer handler changes
- no new combat damage/item/run logic
- no save or story mutation

## 3. AUTOMATED ACCEPTANCE

REQ-122 assembled smoke now also verifies REQ-124 helpers and authority preservation:

1. analog dead-zone direction classification;
2. analog horizontal/vertical direction classification;
3. D-pad direction classification;
4. hard movement release path exists;
5. battle activation path targets canonical battle buttons;
6. REQ-021 Tap Anywhere and REQ-022 fullscreen authorities remain present;
7. touch authority is unchanged.

Public gate:

- Pages run `34064096831`: SUCCESS
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
PUBLIC_PAGES_RUN: `34064096831`
PHYSICAL_GAMEPAD_VERIFICATION: PENDING
IOS_TOUCH_REGRESSION: PASS_AUTOMATED
TOUCH_AUTHORITY_CHANGED: NO
SAVE_CHANGED: NO
STORY_CHANGED: NO

Remain `VERIFY` until a human physical-gamepad feel check is performed or project verification policy allows automated/public acceptance to close it.

EOF
