# REQ-047 — Critical Final-Blow Feedback

STATUS: VERIFY
PRIORITY: P1
TYPE: BUGFIX / BATTLE / FEEDBACK / PLAYER-VISIBLE
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## PLAYER-VISIBLE GAP FOUND BY FRESH AUDIT

Fresh inspection of `addons/critical-hit.js` after REQ-045 confirmed the critical stat path was persistence-safe, but its visible cue could disappear exactly on a critical killing blow.

Previous sequence:

1. critical wrapper called canonical `attack()`;
2. if enemy HP reached zero, canonical `attack()` synchronously called `win()`;
3. canonical `win()` switched to world and `render()` replaced the battle DOM;
4. only after attack returned, the critical wrapper scheduled `requestAnimationFrame(flash)`;
5. `flash()` returned unless `s.screen==='battle'` and required `.battleScene` to still exist.

Therefore a non-killing critical could show `CRITICAL!`, while the more important final critical hit could lose its dedicated visual feedback because the battle scene had already been destroyed.

REQ-045 remains the authority for critical ATK persistence safety.

## IMPLEMENTED REPAIR

`addons/critical-hit.js` now keeps the critical presentation independent of battle DOM while preserving all REQ-045 stat safety:

- critical rate remains 10%;
- temporary ATK bonus remains +5;
- save-safe temporary ATK normalization and canonical-delta preservation remain unchanged;
- critical cue now renders as a document-level fixed layer rather than inside `.battleScene`;
- the cue no longer requires `s.screen==='battle'` when its deferred frame runs, so a synchronous killing blow/victory transition cannot erase it before presentation;
- each presentation removes an older cue first, preventing stacking;
- cue remains `pointer-events:none`;
- animation-end cleanup plus timeout fallback are retained;
- reduced-motion duration is shortened;
- canonical victory/progression remains synchronous and is not delayed or duplicated.

Implementation commit: `4641ae8fb2c9130e183ed55b135f9ef3a6adaaeb`.

## DEDICATED ACCEPTANCE

Added:

`addons/zzzzzzzzzzzzzzzzzzzzzzzzzzz-critical-final-blow-feedback-smoke.js`

Commit: `0b7daa50e895baf1df317f47da117205f3f2ebf1`.

Under `lqTouchSmoke` it fails closed unless:

- rate remains 0.10;
- bonus remains +5;
- REQ-045 save safety remains declared;
- canonical ATK delta preservation remains declared;
- presentation declares final-blow safety and battle-DOM independence;
- rendered cue is pointer-safe;
- two immediate previews still produce exactly one active cue layer;
- reduced-motion support remains declared;
- preview can render without changing the current screen.

## VERIFICATION EVIDENCE

Pages workflow run `34010537279`: SUCCESS.

PASS steps include:

- sequential JavaScript validation;
- collision-safe add-on validation;
- static regression guard;
- add-on contract guard;
- assembled browser smoke;
- 390x844 floating-touch + iPhone world visual-liveness smoke;
- Pages upload/deploy.

## COMPLETION CONDITION

Automated implementation completion is satisfied.

Physical/subjective feel remains `IOS_PHYSICAL_VERIFICATION=PENDING`.

## DO NOT REPEAT

- do not change critical balance;
- do not re-open the ATK persistence bug fixed by REQ-045;
- do not delay canonical victory just to preserve animation;
- do not attach final-blow feedback only to battle DOM;
- do not mark physical PASS from CI.