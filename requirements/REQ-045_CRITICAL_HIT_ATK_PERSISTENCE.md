# REQ-045 — Critical-Hit ATK Persistence Safety

STATUS: VERIFY
PRIORITY: P1
TYPE: BUGFIX / BATTLE / SAVE / PROGRESSION / CONSISTENCY
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## BUG FOUND BY FRESH INTEGRATED AUDIT

Fresh canonical code inspection confirmed a persistent-stat corruption risk in `addons/critical-hit.js`.

Core `attack()` computes normal damage from `s.atk`, and on a killing blow calls canonical `win()`. Canonical `win()` may level Luke up, permanently add `s.atk += 3`, transition to world, call `render()`, and canonical `render()` calls `save()` before rendering.

The previous critical-hit implementation applied its +5 bonus by temporarily raising `s.atk`, calling canonical attack, then restoring the pre-critical value in `finally`.

That created two concrete critical-kill failures:

1. `win() -> render() -> save()` could persist temporary +5 ATK before runtime restoration.
2. If that same critical kill leveled Luke up, canonical +3 was added while boosted, then the old `finally` reset to the pre-critical value and discarded the legitimate +3 in live state.

## IMPLEMENTED REPAIR

`addons/critical-hit.js` keeps the existing canonical attack/victory chain and now makes the temporary stat boost persistence-safe:

- critical rate remains 10%;
- temporary ATK bonus remains +5;
- `criticalActive` marks only the critical attack call stack;
- canonical `save()` is wrapped without replacing the save system;
- when save occurs during a critical stack, ATK is temporarily normalized by exactly -5 for persistence, then restored to the live boosted value after the underlying save returns;
- after canonical attack returns, exactly the temporary +5 is removed from the then-current ATK rather than resetting to the pre-critical snapshot;
- therefore any canonical permanent delta applied during attack, including level-up +3, survives;
- non-critical save/attack behavior passes straight through unchanged;
- `canonicalAtkFromBoosted()` is exposed read-only for acceptance.

No duplicate `attack()` or `win()` state machine was introduced.

## DEDICATED ACCEPTANCE

Added:

`addons/zzzzzzzzzzzzzzzzzzzzzzzzz-critical-atk-persistence-smoke.js`

Under `lqTouchSmoke` it fails closed unless:

- critical rate is 0.10;
- temporary bonus is +5;
- save safety is declared;
- canonical progression-delta preservation is declared;
- boosted 12 normalizes to canonical 7;
- boosted 15 (base 7 + temporary 5 + canonical level gain 3) normalizes to 10, preserving the +3.

## VERIFICATION EVIDENCE

- requirement registration: `b1078e921baf4e4030d966492769c23ccb758803`
- canonical repair: `eedc537bb0dca1d7f8c3188e45624ece5306160d`
- dedicated acceptance: `b11ff36a762647193f2270ce0b5bdd10e432bb50`
- Pages workflow run: `34010189516` / SUCCESS
- PASS steps include:
  - sequential JavaScript patch validation
  - collision-safe add-on validation
  - static regression guard
  - add-on contract guard
  - assembled browser smoke
  - 390x844 floating-touch + iPhone world visual-liveness smoke
  - Pages upload/deploy

## COMPLETION CONDITION

Automated implementation completion is satisfied:

- requirement committed;
- minimal critical-hit persistence repair committed;
- dedicated fail-closed acceptance committed;
- JavaScript/static/add-on checks PASS;
- assembled browser smoke PASS;
- 390x844 touch/world visual-liveness PASS;
- Pages deployment SUCCESS.

Physical/subjective completion remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not duplicate canonical `attack()` or `win()`;
- do not make critical +5 permanent;
- do not lose legitimate level-up +3 on critical kills;
- do not mark physical iPhone PASS from CI.