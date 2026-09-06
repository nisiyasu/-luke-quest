# REQ-047 — Critical Final-Blow Feedback

STATUS: IN_PROGRESS
PRIORITY: P1
TYPE: BUGFIX / BATTLE / FEEDBACK / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## PLAYER-VISIBLE GAP FOUND BY FRESH AUDIT

Fresh inspection of `addons/critical-hit.js` after REQ-045 confirms the critical stat path is now persistence-safe, but its visible cue can disappear exactly on a critical killing blow.

Current sequence:

1. critical wrapper calls canonical `attack()`;
2. if enemy HP reaches zero, canonical `attack()` synchronously calls `win()`;
3. canonical `win()` switches to world and `render()` replaces the battle DOM;
4. only after the attack returns, critical wrapper schedules `requestAnimationFrame(flash)`;
5. `flash()` immediately returns unless `s.screen==='battle'`, and also requires `.battleScene` to still exist.

Therefore a non-killing critical can show `CRITICAL!`, while the more important final critical hit can lose its dedicated visual feedback because the battle scene has already been destroyed.

This requirement repairs presentation only. REQ-045 remains the authority for critical ATK persistence safety.

## REQUIRED REPAIR

1. Preserve critical rate 10% and temporary ATK bonus +5.
2. Preserve REQ-045 save-safety and canonical-delta preservation.
3. Do not delay or duplicate canonical victory/progression.
4. Make the critical cue survive the synchronous battle -> world transition on a killing blow.
5. Keep the cue pointer-safe, non-stacking and self-cleaning.
6. Prefer a document-level fixed presentation layer so it is not destroyed with `.battleScene`.
7. Preserve reduced-motion accessibility.
8. Do not show the cue for non-critical attacks.
9. Expose a read-only presentation contract / smoke preview for fail-closed acceptance.

## AUTOMATED ACCEPTANCE

Acceptance must prove:

- critical rate and +5 bonus unchanged;
- REQ-045 save/delta safety remains declared;
- presentation is battle-DOM-independent / final-blow-safe;
- cue layer is pointer-safe and self-cleaning;
- smoke preview can render the cue even when current screen is not battle;
- repeated preview does not stack multiple cue layers;
- assembled browser smoke and 390x844 iPhone world/touch liveness remain PASS;
- Pages deployment succeeds.

## COMPLETION CONDITION

Requirement + minimal presentation repair + dedicated acceptance committed, relevant CI/browser/touch tests PASS, Pages SUCCESS, queue/current synchronized.

Physical/subjective feel remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not change critical balance;
- do not re-open the ATK persistence bug fixed by REQ-045;
- do not delay canonical victory just to preserve animation;
- do not attach final-blow feedback only to battle DOM;
- do not mark physical PASS from CI.