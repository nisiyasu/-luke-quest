# REQ-136 — Battle Log Latest Message Follow

PRIORITY: P1
STATUS: VERIFY
SOURCE: Directive-authorized player-visible continuation selected after fresh HEAD/QUEUE/CURRENT audit found no READY rows and REQ-134/REQ-135 are machine/public green VERIFY items.

## Purpose
REQ-134 intentionally bounds the battle log height on iPhone so battle commands remain usable. The base battle renderer rebuilds the log with the newest five messages, but the bounded scroll container does not guarantee that the newest line is visible after every battle rerender. On a small iPhone viewport, the player can therefore miss the most recent damage, recovery, guard, escape-failure, or skill result unless they manually scroll the log.

Make the assembled battle log follow the latest message automatically whenever the battle DOM is rendered or rebuilt, without changing battle rules, damage, AI, save state, command handlers, world touch ownership, or story canon.

## Requirements
1. During `s.screen === 'battle'`, resolve the live assembled battle log using current compatibility selectors (`.lqBattleScrollableLog`, `.battleLogV10`, `.log`).
2. After a battle render/assembled add-on mutation, place the log viewport at its latest content (`scrollTop = scrollHeight` or equivalent).
3. Preserve REQ-134 bounded scrolling. The player must still be able to manually review earlier visible log lines.
4. Do not install click or pointer handlers for battle commands.
5. Do not mutate `s.log`, HP, MP, enemy state, inventory, turn order, save schema, or story flags.
6. Survive repeated `battle()` rerenders and later add-on DOM replacement.
7. Add semantic `role="log"` and `aria-live="polite"` to the live battle log where safe so assistive technology receives new combat text without changing visible copy.
8. Do not apply log-follow behavior outside battle.
9. Existing REQ-134/REQ-135 command touch behavior and P0 world touch/fullscreen behavior must remain intact.

## Acceptance
- New JavaScript passes syntax validation.
- Assembled browser smoke at 390×844 enters a real synthetic battle and proves:
  - live battle log resolves;
  - the log remains bounded/scrollable under REQ-134;
  - after overflowing content is installed, `scrollTop` reaches the latest content within a small tolerance;
  - after `battle()` rerender, the replacement/current log again follows the newest message;
  - `role=log` and `aria-live=polite` are present;
  - no world Action or movement ownership is created;
  - no battle click/pointer handler is added by REQ-136.
- Existing REQ-134 and REQ-135 regressions remain PASS.
- Standard Pages build/deploy SUCCESS with implementation included.
- IOS_PHYSICAL_VERIFICATION: PENDING until Owner verifies actual iPhone feel/readability.

## Verification — 2026-09-08
- IMPLEMENTATION_CHECKPOINT: `e29b136ff27cec5232cc260d22a0abd47b051e10`
- REQ-136 dedicated workflow run: `34199130632` — SUCCESS.
- 390×844 assembled marker: `pass=true`, `resolved=true`, `bounded=true`, `semantic=true`, `initialLatest=true`, `rerenderResolved=true`, `rerenderBounded=true`, `rerenderLatest=true`, `semanticAfter=true`, `worldExcluded=true`.
- REQ-135 regression under REQ-136: PASS.
- REQ-134 regression under REQ-136: PASS.
- Standard Pages run: `34199130663` — SUCCESS at the same implementation checkpoint.
- Cache-busted public Pages recovery: `34199200909` — SUCCESS at the same implementation checkpoint.
- IOS_PHYSICAL_VERIFICATION: PENDING.

## Non-goals
- No Chapter 2 work.
- No battle balance/damage/AI changes.
- No command layout redesign.
- No new audio/haptic system.
- No approved-art replacement.
