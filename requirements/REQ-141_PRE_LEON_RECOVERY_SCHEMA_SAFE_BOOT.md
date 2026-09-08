# REQ-141 — Pre-Leon Recovery Schema-Safe Boot

## PRIORITY
P0 / OWNER DIRECT

## STATUS
VERIFY

## OWNER OBSERVED FAILURE
Physical iPhone still renders black when opening the dedicated pre-Leon recovery path. Owner specifically observed that the clean LV11 save placed immediately before Leon still becomes black and questioned whether the pre-Leon location itself is the problem.

## FRESH ROOT-CAUSE EVIDENCE
The previous `?leon-recovery=1` implementation executed in `prelude/autosave-bootstrap-guard.js`, before the base game and all later save migrations/add-ons initialized. It manually constructed a partial save object. This made the recovery payload schema-fragile as the game evolved and could omit state expected by later runtime modules. The observation therefore did not prove that `windStairRidge` itself was defective.

Fresh map/progression inspection also confirmed that the published `windStairRidge` map is structurally valid and that the canonical Cloudbreak → Wind Stair transition already has a dedicated progression gate. The physical black-screen cause remains unproven until Owner retries the new recovery path.

## IMPLEMENTED FIX
The one-phase hand-built recovery save has been replaced by a two-stage schema-safe recovery boot:

1. Prelude stage:
   - detects explicit `?leon-recovery=1` request;
   - preserves the previous canonical save under a timestamped backup key;
   - removes only the canonical `lukeQuestV2` key;
   - sets a short-lived `sessionStorage` recovery marker;
   - reloads once without `leon-recovery` so the game starts through its normal DEFAULT + migration/add-on initialization path.
2. Late runtime stage:
   - runs after normal game/add-on initialization;
   - consumes the session marker exactly once;
   - modifies only the fields required for the Owner recovery checkpoint: LV11 combat values, Chapter-1 pursuit progress, map/position/facing, and transient battle/dialogue state;
   - preserves unrelated/current/future schema fields produced by the runtime;
   - saves through canonical `save()` and renders through canonical `render()`.

## SAFE LOCATION POLICY
Until physical evidence proves `windStairRidge` itself is safe, recovery now starts at the already-published predecessor `cloudbreakSaddle`, immediately before the canonical Cloudbreak → Wind Stair transition. This separates synthetic-save failure from destination-map failure while keeping the player one transition from the Leon approach.

Target recovery checkpoint:
- map: `cloudbreakSaddle`
- safe spawn: `(10,2)`
- facing: `up`
- LV: `11`
- HP/MHP: `132/132`
- ATK: `34`
- MP/MMP: `30/30`
- no active enemy/dialogue/menu/shop transient state
- Chapter 1 pursuit flags advanced to the existing approach state; Chapter 1 climax flags remain incomplete.

## IMPLEMENTATION CHECKPOINT
- `473bd3df98a26660875c00103487f9fcd11695bf` — schema-safe two-stage recovery + dedicated smoke correction.

## VERIFICATION EVIDENCE
- Dedicated REQ-141 gate run `34226073276`: SUCCESS.
- Stage-1 smoke verifies exact prior-save backup, canonical-key removal, one-shot session marker and query removal.
- Stage-2 smoke begins with an intentionally extended runtime-shaped save and verifies unrelated/future schema fields survive the recovery unchanged.
- Stage-2 smoke verifies canonical save/render/stop each execute exactly once and recovery lands at `cloudbreakSaddle (10,2)` with Owner-proven LV11 combat values.
- Standard Pages run `34226073258`: SUCCESS on the same implementation HEAD, including the repository's assembled-game/browser regression suite and deployment.
- Existing REQ-121 canonical Cloudbreak → Wind Stair transition remains the transition authority; no new input or transition authority was added.
- `IOS_PHYSICAL_VERIFICATION=PENDING`.

## ACCEPTANCE
- [x] Explicit recovery request never constructs a partial canonical save in prelude.
- [x] Previous save is backed up before canonical removal.
- [x] Recovery reload is staged as a one-shot session flow.
- [x] Late stage starts from the runtime-initialized state and changes only checkpoint/progression fields.
- [x] Unrelated/future schema sentinel fields survive automated recovery smoke.
- [x] Canonical `save()` and `render()` are used after applying the checkpoint.
- [x] Recovery begins on `cloudbreakSaddle`, not `windStairRidge`.
- [x] LV11 and combat values match Owner-proven stable play level.
- [x] Existing normal startup without recovery query remains outside the recovery branch.
- [x] JS syntax / dedicated gate PASS.
- [x] Pages build/deployment PASS.
- [ ] Owner physical iPhone verification remains PENDING.

## NON-GOALS
- Do not declare `windStairRidge` root cause proven from the prior black screen alone.
- Do not claim the physical black-screen issue fixed until Owner verifies it on iPhone.
- Do not invent Chapter 2 content.
- Do not alter canonical transition/action ownership.
- Do not delete backup saves.
