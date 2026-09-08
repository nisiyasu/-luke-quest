# REQ-135 — iPhone Battle Command Touch Feedback

PRIORITY: P1
STATUS: IN_PROGRESS
SOURCE: Directive-authorized player-visible continuation selected after REQ-134 moved to VERIFY, with no READY queue rows and remaining BACKLOG restricted to Owner-only formal-art work.

## Purpose
REQ-134 makes the assembled battle command surface physically usable on iPhone. The next safe player-visible step is to make every battle command feel immediately responsive under a finger without changing battle semantics. Touch, mouse, and keyboard users must be able to see which command is being pressed or focused, while disabled/unavailable commands remain clearly distinct.

## Requirements
1. Preserve all existing canonical battle handlers and command semantics.
2. Add a clear press response to REQ-134 battle command buttons using presentation-only CSS/state.
3. Add a visible keyboard `:focus-visible` affordance.
4. Disabled or `aria-disabled=true` commands must be visually distinguishable without becoming interactive.
5. Feedback must work for base attack/guard/item/escape and later assembled skill/item controls that receive the canonical REQ-134 command class.
6. Do not install duplicate click/pointer handlers for battle actions.
7. Do not create world Action or Dynamic Touch ownership from battle command interaction.
8. Respect `prefers-reduced-motion`.
9. Survive repeated `battle()` rerenders and later add-on command insertion.
10. No story, save schema, battle balance, damage, AI, inventory, or command authority changes.

## Acceptance
- JavaScript syntax PASS.
- Dedicated assembled 390×844 browser regression proves:
  - REQ-134 command surface still exists and remains >=48px targets;
  - all assembled battle buttons receive the feedback presentation class;
  - stylesheet contains active/focus-visible/disabled treatment scoped to battle commands;
  - one attack command interaction still dispatches canonical attack exactly once;
  - world Action/movement ownership remains zero;
  - rerendered commands retain feedback integration.
- Existing REQ-134 dedicated regression remains PASS.
- Existing P0 touch/fullscreen regression remains PASS.
- Standard Pages build/deploy SUCCESS with implementation included.
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner checks actual device feel.

## Non-goals
- No new battle command system.
- No haptics/audio authority changes.
- No Chapter 2 work.
- No balance changes.
- No replacement of approved art.
