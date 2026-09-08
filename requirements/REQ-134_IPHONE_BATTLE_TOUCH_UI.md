# REQ-134 — iPhone Battle Touch UI Hardening

PRIORITY: P1
STATUS: VERIFY
SOURCE: Directive-authorized autonomous player-visible requirement selected because fresh WORK_QUEUE has no READY rows and the only BACKLOG items require Owner-only formal art decisions/assets.

## Purpose
LUKE QUEST must be comfortably playable through battle on an iPhone, not only movable in the world. The existing battle UI is functional but originates from the older card/row layout and later add-ons insert additional command rows such as the MP skill command. This requirement hardens the assembled battle command surface for 390×844 portrait play without changing battle rules, story canon, save schema, command authority, damage formulas, enemy AI, or existing touch-world contracts.

## Requirements
1. At 390×844 portrait, the active battle command surface must remain fully inside the usable viewport without horizontal overflow.
2. Battle command buttons must have reliable finger-sized hit targets of at least 48 CSS px in the primary touch dimension.
3. Commands must remain visually distinct and readable after later add-ons insert skill/item/recovery controls.
4. Battle log must remain readable and must not force primary commands below an unusable/offscreen layout. A bounded scrollable log is allowed.
5. Safe-area bottom inset must be respected on iPhone/PWA.
6. Battle controls must remain normal button-owned UI. They must not trigger world Tap Anywhere Action or Dynamic Touch movement.
7. One physical/synthetic tap on a battle command must not double-dispatch the command.
8. Preserve existing command semantics: attack, guard, potion/item, escape, Azure Slash/skills, and later wrappers continue to use their existing canonical handlers.
9. Preserve keyboard behavior and non-battle screens.
10. Do not globally shrink typography merely to make the screen fit.
11. Prefer CSS/presentation integration over duplicate battle logic.
12. `prefers-reduced-motion` remains respected where any new press/feedback animation is used.
13. The solution must survive assembled add-on load order and repeated `battle()` rerenders.

## Acceptance
- JavaScript syntax PASS for any new add-on/probe.
- Add-on contract/static regression PASS.
- Dedicated assembled browser regression enters a real battle and proves:
  - battle screen exists;
  - command surface width <= visual viewport width;
  - no horizontal page overflow;
  - every enabled battle command target is >=48 CSS px tall;
  - attack/guard/item/escape/skill command rows remain discoverable after assembled add-ons;
  - a command tap is button-owned and no world Action/movement ownership is created;
  - battle rerender preserves the hardened layout.
- Existing P0 390×844 Tap Anywhere/Dynamic Touch/fullscreen regression remains PASS.
- Standard Pages build/deploy SUCCESS with the implementation included.
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner checks actual device feel.

## Machine / Public Verification
- Product fix: assembled battle log authority now resolves both legacy `.log` and later `.battleLogV10`, then decorates the live log with the REQ-134 bounded-scroll presentation class.
- Dedicated REQ-134 workflow run `34194753965`: SUCCESS on exact HEAD `3e412caf2c9797934737df88fd52f030b1f3aec2`.
- 390×844 acceptance proves minimum enabled command height `50px`, no horizontal overflow, canonical attack/guard/item/escape handlers, assembled skill presence, single-dispatch command ownership, zero world Action/movement leakage, bounded assembled log, and rerender protection.
- Standard Pages workflow run `34194753926`: SUCCESS on exact HEAD `3e412caf2c9797934737df88fd52f030b1f3aec2`.
- Pages deploy created and reported SUCCESS for build version `3e412caf2c9797934737df88fd52f030b1f3aec2` at `https://nisiyasu.github.io/-luke-quest/`.
- Pages assembled browser regression PASS: title/world/movement/interaction/battle/save plus 390×844 floating touch/fullscreen visual liveness.
- REQ-023 evacuation guidance gate on the same HEAD: SUCCESS.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## Non-goals
- No Chapter 2 story work.
- No balance/damage/AI changes.
- No replacement of approved art.
- No new battle command system.
- No world-controller behavior change.
