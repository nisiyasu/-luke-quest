# REQ-141 — Pre-Leon Recovery Schema-Safe Boot

## PRIORITY
P0 / OWNER DIRECT

## STATUS
IN_PROGRESS

## OWNER OBSERVED FAILURE
Physical iPhone still renders black when opening the dedicated pre-Leon recovery path. Owner specifically observed that the clean LV11 save placed immediately before Leon still becomes black and questioned whether the pre-Leon location itself is the problem.

## FRESH ROOT-CAUSE EVIDENCE
The current `?leon-recovery=1` implementation executes in `prelude/autosave-bootstrap-guard.js`, before the base game and all later save migrations/add-ons initialize. It manually constructs a partial save object. This makes the recovery payload schema-fragile as the game evolves and can omit state expected by later runtime modules. The observation therefore does not yet prove that `windStairRidge` itself is defective.

## IMPLEMENTATION INTENT
Replace the one-phase hand-built recovery save with a two-stage schema-safe recovery boot:

1. Prelude stage:
   - detect explicit `?leon-recovery=1` request;
   - preserve the previous canonical save under a timestamped backup key;
   - remove only the canonical `lukeQuestV2` key;
   - set a short-lived `sessionStorage` recovery marker;
   - reload once without `leon-recovery` so the game starts through its normal DEFAULT + migration/add-on initialization path.
2. Late runtime stage:
   - run after normal game/add-on initialization;
   - consume the session marker exactly once;
   - modify only the fields required for the Owner recovery checkpoint: LV11 combat values, Chapter-1 pursuit progress, map/position/facing, and transient battle/dialogue state;
   - preserve all other schema fields produced by the current runtime;
   - save through canonical `save()` and render through canonical `render()`.

## SAFE LOCATION POLICY
Until physical evidence proves `windStairRidge` itself is safe, the staged recovery must start at the already-published predecessor `cloudbreakSaddle`, immediately before the canonical Cloudbreak → Wind Stair transition. This avoids conflating a synthetic-save failure with the destination map while keeping the player one transition from the Leon approach.

Target recovery checkpoint:
- map: `cloudbreakSaddle`
- safe spawn: `(10,2)`
- facing: `up`
- LV: `11`
- HP/MHP: `132/132`
- ATK: `34`
- MP/MMP: `30/30`
- no active enemy/dialogue/menu/shop transient state
- Chapter 1 pursuit flags preserved/advanced only to the state required to reach the existing Wind Stair transition; Chapter 1 climax flags remain incomplete.

## ACCEPTANCE
- Explicit recovery request never constructs a partial canonical save in prelude.
- Previous save is backed up before canonical removal.
- Recovery reload happens at most once per explicit request.
- Late stage starts from the runtime-initialized state and changes only checkpoint fields.
- Canonical `save()` and `render()` are used after applying the checkpoint.
- Recovery begins on `cloudbreakSaddle`, not `windStairRidge`.
- LV11 and combat values match Owner-proven stable play level.
- Existing normal startup without recovery query is unchanged.
- JS syntax / Pages build / existing P0 touch regressions remain PASS.
- `IOS_PHYSICAL_VERIFICATION=PENDING` until Owner tests the deployed path.

## NON-GOALS
- Do not declare `windStairRidge` root cause proven from the prior black screen alone.
- Do not invent Chapter 2 content.
- Do not alter canonical transition/action ownership.
- Do not delete backup saves.
