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

Fresh code search and filename/tree inventory found no dedicated level-up presentation module or explicit LEVEL UP feedback surface.

Therefore the progression mechanic itself was not duplicated or changed. The player-visible gap was that a level increase was folded into the normal victory transition without a clear reward moment or before/after stat feedback.

## IMPLEMENTATION

`addons/level-up-feedback.js` adds a presentation-only level-up cue while keeping canonical `win()` as the sole owner of EXP/level/stat mutation.

Behavior:

1. captures pre-win `lv` / `mh` / `atk`;
2. invokes the current final `win()` unchanged and preserves its return value;
3. reads post-win `lv` / `mh` / `atk`;
4. only when level increased, shows a short fixed non-interactive overlay;
5. displays the actual new level and actual max-HP / ATK deltas observed from canonical state;
6. does not award or mutate EXP, HP, ATK, MP, gold, items, skills, equipment or story state itself;
7. overlay is `pointer-events:none`;
8. repeated presentations replace the prior layer rather than stack;
9. animation-end cleanup and timed fallback cleanup are both present;
10. `prefers-reduced-motion` shortens the cue.

Status surface:

`window.LQ_LEVEL_UP_FEEDBACK_STATUS`

records presentation-only ownership, canonical owner `index.html win()`, actual-delta rendering, pointer safety, reduced-motion support, cleanup fallback, active-layer count and smoke preview/cleanup hooks.

Dedicated acceptance:

`addons/zzzzzzzzzzzzzzzzzzz-level-up-feedback-smoke.js`

runs only under `?lqTouchSmoke=1`, drives two preview presentations, verifies one-layer behavior, fixed viewport, pointer safety, actual `LV 2 / +9 HP / +3 ATK` delta rendering, reduced-motion metadata and cleanup, and throws a fail-closed uncaught runtime marker on any contract failure.

## CANONICAL MUTATION CONTRACT

The presentation layer treats these as read-only evidence after `win()`:

- `lv`
- `mh`
- `atk`

If future canonical code changes the exact level-up gains, the player-facing cue renders the actual before/after delta rather than mutating or assuming progression rewards.

## VERIFICATION EVIDENCE

Checkpoints:

- requirement registration: `be879ef2864a8083b4848dad12316f577b5739c9`
- implementation: `5e4b3ad9354d994f2917a860fb65dcbc9b70a7a2`
- dedicated browser acceptance: `4f37cbfbe18a8e850e9ec14fb60804b841f2ce3c`

Pages workflow run `34009085469`: SUCCESS.

Verified in that run:

- sequential JavaScript syntax: SUCCESS
- collision-safe add-ons syntax: SUCCESS
- static regression guard: SUCCESS
- add-on contract guard: SUCCESS
- PWA/assets validation: SUCCESS
- assembled browser world/movement/interaction/battle/save smoke: SUCCESS
- 390x844 floating-touch + fullscreen visible-world regression: SUCCESS
- level-up smoke ran under the same `lqTouchSmoke` assembled page and did not trip its fail-closed runtime marker
- Pages upload/deploy: SUCCESS

## COMPLETION CONDITION

Automated implementation completion is satisfied:

- requirement + implementation committed
- JavaScript syntax PASS
- add-on/static regression PASS
- assembled browser smoke PASS
- dedicated level-up feedback acceptance PASS
- 390x844 floating-touch/world visual-liveness regression PASS
- Pages deployment SUCCESS

Physical/subjective completion remains:

- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner sees/feels the level-up cue on iPhone.

Therefore REQ-039 is `VERIFY`, not DONE.

## DO NOT REPEAT

- do not add a second EXP/level system
- do not mutate progression from the presentation add-on
- do not hard-code a fake reward that can diverge from canonical `win()`
- do not create an input-blocking overlay
- do not mark iPhone physical feel PASS from headless CI