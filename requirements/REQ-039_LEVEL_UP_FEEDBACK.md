# REQ-039 — Level-Up Feedback

STATUS: VERIFY
PRIORITY: P1
TYPE: PLAYER_VISIBLE / BATTLE / PROGRESSION / PRESENTATION
OWNER_REQUEST: DIRECTIVE_AUTHORIZED
IOS_PHYSICAL_VERIFICATION: PENDING

## WHY THIS WORK EXISTS

Fresh inventory of the current default-branch implementation found that canonical level progression already exists inside `win()` in `index.html`:

- gained EXP is added to `s.xp`
- when `s.xp >= s.nx`, EXP is reduced by the threshold
- `s.lv` increments
- next EXP threshold increases
- max HP increases by 9 and current HP is restored to max
- ATK increases by 3

The existing `addons/mp-skill-system.js` also extends the canonical win chain so a level-up increases max MP by 2 and fully restores MP.

The progression mechanics were not duplicated or changed. The player-visible gap was that a level increase was folded into the normal victory transition without a clear reward moment or integrated before/after stat feedback.

## IMPLEMENTATION

`addons/level-up-feedback.js` adds a presentation-only level-up cue while keeping the canonical win/progression wrapper chain as the sole owner of EXP/level/stat mutation.

Behavior:

1. captures pre-win `lv` / `mh` / `atk` / `mmp`;
2. invokes the prior canonical `win()` unchanged and preserves its return value;
3. detects the level increase;
4. defers the final post-win snapshot to `requestAnimationFrame`, after later outer progression wrappers have finished;
5. shows a short fixed non-interactive overlay only when level increased;
6. displays the actual new level and actual max-HP / ATK deltas, plus max-MP delta when present;
7. does not award or mutate EXP, HP, ATK, MP, gold, items, skills, equipment or story state itself;
8. overlay is `pointer-events:none`;
9. repeated presentations replace the prior layer rather than stack;
10. animation-end cleanup and timed fallback cleanup are both present;
11. `prefers-reduced-motion` shortens the cue.

## INTEGRATED SELF-AUDIT REPAIR

After the first successful REQ-039 deployment, a deeper assembled add-on order audit found a real integration omission:

- `level-up-feedback.js` loads before `mp-skill-system.js` in the add-on glob order;
- the first REQ-039 implementation captured its post-win snapshot before the outer MP wrapper added max MP +2;
- therefore the cue could show HP/ATK gains but omit the MP gain that actually occurred.

This was repaired forward rather than waiting for Owner criticism:

- checkpoint `4abf5a33b064c11b8e37a84a6399bc39a55e995e`: defer integrated final snapshot and include MP delta when present;
- checkpoint `45e4fa1453475d60d2dca3d40d11814447908171`: extend fail-closed smoke to require `最大MP +2` in the integrated preview contract;
- later assembled-head Pages run `34009469016`: SUCCESS, including JS/add-on/static checks, assembled browser smoke, 390x844 touch/world visual-liveness and deploy.

## STATUS / ACCEPTANCE SURFACE

`window.LQ_LEVEL_UP_FEEDBACK_STATUS` records:

- presentation-only ownership;
- canonical progression owner = `index.html win() + canonical progression wrappers`;
- actual-delta rendering;
- deferred integrated snapshot;
- max-MP delta support when present;
- pointer safety;
- reduced-motion support;
- cleanup fallback;
- active-layer count and smoke preview/cleanup hooks.

Dedicated acceptance:

`addons/zzzzzzzzzzzzzzzzzzz-level-up-feedback-smoke.js`

runs only under `?lqTouchSmoke=1`, drives two preview presentations, verifies one-layer behavior, fixed viewport, pointer safety, actual `LV 2 / 最大HP +9 / ATK +3 / 最大MP +2` delta rendering, reduced-motion metadata and cleanup, and throws a fail-closed uncaught runtime marker on any contract failure.

## CANONICAL MUTATION CONTRACT

The presentation layer treats post-win state as read-only evidence. If future canonical progression wrappers change exact gains, the cue reads the final integrated before/after delta instead of adding a second mutation path.

## VERIFICATION EVIDENCE

Initial checkpoints:

- requirement registration: `be879ef2864a8083b4848dad12316f577b5739c9`
- initial implementation: `5e4b3ad9354d994f2917a860fb65dcbc9b70a7a2`
- initial browser acceptance: `4f37cbfbe18a8e850e9ec14fb60804b841f2ce3c`
- initial Pages run `34009085469`: SUCCESS

Integrated repair checkpoints:

- `4abf5a33b064c11b8e37a84a6399bc39a55e995e`
- `45e4fa1453475d60d2dca3d40d11814447908171`
- assembled-head Pages run `34009469016`: SUCCESS

Verified in the latest integrated run:

- sequential JavaScript syntax: SUCCESS
- collision-safe add-ons syntax: SUCCESS
- static regression guard: SUCCESS
- add-on contract guard: SUCCESS
- PWA/assets validation: SUCCESS
- assembled browser world/movement/interaction/battle/save smoke: SUCCESS
- 390x844 floating-touch + fullscreen visible-world regression: SUCCESS
- integrated level-up smoke did not trip its fail-closed runtime marker
- Pages upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated implementation completion is satisfied after integrated repair.

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees/feels the level-up cue on iPhone.

Therefore REQ-039 remains `VERIFY`, not DONE.

## DO NOT REPEAT

- do not add a second EXP/level system
- do not mutate progression from the presentation add-on
- do not snapshot before later canonical progression wrappers finish
- do not omit actual MP gain from the level-up cue when MP progression exists
- do not hard-code a fake reward that can diverge from canonical progression
- do not create an input-blocking overlay
- do not mark iPhone physical feel PASS from headless CI