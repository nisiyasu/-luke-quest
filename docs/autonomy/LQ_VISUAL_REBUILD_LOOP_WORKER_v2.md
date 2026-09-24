# LUKE QUEST Visual Rebuild Loop Worker v2

STATUS: CONTROL_CANDIDATE
PROGRAM: nisiyasu/-luke-quest#101
LANE: visual-rebuild
IMPLEMENTATION_BRANCH: experiment/target-image-threejs-v1
REQUEST_REPOSITORY: nisiyasu/luke-env-gateway-requests
CONTROL_BRANCH: control/lease-visual-rebuild
RECEIPT_BRANCH: gateway/request-receipts

## Purpose

Worker A/B/C must not stop at an async intermediate state.
A run is a controller iteration over durable Work state, not a one-shot chat.

The legal lifecycle is:

RECOVER
-> CLAIM / TAKEOVER
-> EXECUTE
-> SUBMIT
-> RECONCILE RECEIPT
-> OBSERVE / VERIFY
-> REPAIR OR ADVANCE
-> COMPLETE
-> RELEASED / ESCALATED

Agent exit is never Completion by itself.

## Hard invariants

1. One Issue has at most one authoritative active Claim.
2. Issue comments are reports only. They never establish Claim authority.
3. Authoritative Claim is work-claims/issue-<n>.json on the control branch.
4. Claim acquisition / renewal / release / takeover use Gateway CAS.
5. All implementation writes are bound to owner_run_id + CLAIM_GENERATION.
6. Stale expected implementation HEAD cannot write.
7. Scheduled Workers never write Target Repository directly.
8. Normal Worker implementation uses IMPLEMENTATION_PATCHSET.
9. Formal Visual Evidence keeps the existing Lease / Evidence Adoption contract.
10. OPEN Issue alone is never Write Authority.
11. Container Issues are never Worker execution units.
12. An OPEN Native blocker means not READY.
13. Pending Draft / Request / Receipt is NONTERMINAL.
14. Natural-language completion is not evidence.
15. A Worker never disables its own schedule. READY == 0 is a state to classify, not a stop reason.
16. Every tasks.md task has exactly one execution Leaf; missing Leafs are a control-plane repair (WORK_SUPPLY_RECONCILE), never "no work".
17. A Leaf with CLAIMABLE other than YES (e.g. PENDING_DEPENDENCIES) is not READY.
18. A Leaf whose REQUIRED_CAPABILITY is not STANDARD is claimed only by a run that declares that capability.

## Work Supply (tasks.md -> execution Leafs)

Task authority: tasks.md at the SPEC_COMMIT pinned by #101
(88694c2812c18938c8d72db3c5933b3efba2e428).
Graph authority: tools/env_visual_gateway/visual_rebuild_work_graph.json on main
(container, semantic blocked_by with rationale, evaluator, capability per task).

The Gateway operation WORK_SUPPLY_RECONCILE (payload {"mode":"FULL"}) and the poller's
automatic MISSING_ONLY pass make GitHub match that graph:
- one LQ_EXECUTION_LEAF:v1 Issue per task under its container, created idempotently
  (control-branch reservation work-supply/tasks/<TASK>.json + unique supply marker)
- Leafs are born CLAIMABLE: PENDING_DEPENDENCIES and become YES only after every
  declared Native blocked_by edge reads back
- only declared semantic edges; nothing deleted, closed, or unlinked
- the terminal Receipt carries a LQ_WORK_SUPPLY_REPORT:v1 with `frontier`
  (open Leafs, claimable, capability, open blocker tasks) and `program_state`
- tasks.md changing without a manifest update is SPEC_DRIFT (fail closed, Owner gate)

Leafs closed NOT_PLANNED / DUPLICATE (e.g. retry duplicates #137-#145) are neither work
nor completion evidence.

## READY == 0 classification (never self-disable)

Evaluate in order; tools/env_visual_gateway/loop_worker_controller.py
`decide_next_action` is the executable form.

1. Own unconsumed Request not terminal -> WAIT_FOR_RECEIPT (same run)
2. Own terminal Receipt -> ADVANCE (ok) or REPAIR (rejected) (same run)
3. Own ACTIVE Claim -> continue it under the Claim Record's OWNER_RUN_ID
   (renew near deadline; takeover when expired)
4. Any stale ACTIVE Claim this Worker is capable of -> WORK_CLAIM_TAKEOVER
5. Supply unobserved, missing Leafs, or partial -> WORK_SUPPLY_RECONCILE (FULL), wait for Receipt
6. READY Leaf -> WORK_CLAIM_ACQUIRE (rank pick)
7. Other Workers hold live Claims -> WAIT_FOR_UPSTREAM_IN_PROGRESS (end run, stay enabled)
8. Only capability-gated Leafs unblocked -> OWNER_GATE_CAPABILITY (end run, stay enabled)
9. ESCALATED Claim blocks -> OWNER_GATE_ESCALATED
10. Still nothing after a fresh reconcile -> OWNER_GATE_CONTROL_PLANE_ANOMALY with the frontier
11. Every task has a closed Leaf -> PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE (#101 close is Owner's)

## Fresh recovery at every run

Read Fresh:

- #101
- current implementation HEAD
- Native execution Leafs and blocked_by
- control/lease-visual-rebuild/work-claims/*.json
- control/lease-visual-rebuild/lease-state.json
- gateway/request-receipts
- relevant Request Repository inbox/requests
- exact Issue body and Task Acceptance

Do not start a new Claim while this Worker already owns active unfinished Work.

If any active Claim is stale by CLAIM_UNTIL or PROGRESS_DEADLINE_AT:
- do not trust the old Worker
- use WORK_CLAIM_TAKEOVER
- takeover must fence implementation HEAD first
- recovery attempts are bounded
- WORK_ESCALATED is terminal failure requiring Owner arbitration

If Claim phase is RECOVERY_PENDING, resume from NEXT_RECOVERY_ACTION.

## Atomic Claim

Use WORK_CLAIM_ACQUIRE.

Gateway Fresh-validates:
- Issue OPEN
- LQ_EXECUTION_LEAF
- CLAIMABLE YES
- TASK_ID
- Native blockers zero
- #101 ancestry

The Gateway writes one authoritative Claim Record using control-branch CAS.
CAS conflict means reread and revalidate.
Never manufacture authority from a comment.

Claim Record carries:
owner_run_id
worker_id
task_id
CLAIM_GENERATION
CLAIM_UNTIL
PROGRESS_DEADLINE_AT
PHASE
ACTIVE_OPERATION_ID
EXPECTED_IMPLEMENTATION_HEAD
LAST_PROGRESS_AT
NEXT_RECOVERY_ACTION
RECOVERY_ATTEMPTS
MAX_RECOVERY_ATTEMPTS

## Progress renewal

Before PROGRESS_DEADLINE_AT expires, meaningful long-running local work must renew through WORK_CLAIM_RENEW.

Do not renew after the deadline merely to resurrect a stalled generation.
An expired generation must be recovered through takeover/fencing.

## Durable submission context

Before an async PATCHSET or TASK_COMPLETE is finalized, the Request Repository Draft itself must durably contain:

work phase
owner_run_id
worker_id
claim_generation
operation_id
submitted_payload_reference
expected_head
last_progress_at
next_recovery_action

For PATCHSET:
work_phase = PATCHSET_SUBMITTED

For completion:
work_phase = COMPLETION_SUBMITTED

submitted_payload_reference must be:
inbox/visual-rebuild/<request_id>.json

The full patchset bytes are stored in that immutable Draft/Request.
Never rely on a dirty local worktree surviving a crash.

## Request waiting is not a run endpoint

After Draft creation:
- Draft exists: NONTERMINAL
- canonical Request exists: NONTERMINAL
- pending Receipt: NONTERMINAL
- no Receipt yet: NONTERMINAL
- terminal Receipt ok=true: advance
- terminal Receipt ok=false: repair / reconcile
- wait timeout: durable Work remains unfinished; never report success

There is no fixed wait bound. Keep polling the same request_id (about every 10-15 s,
wait_for_terminal_receipt.py may be re-invoked after its TIMEOUT) until a terminal
Receipt appears or only the checkpoint reserve (~4 min) of the run budget remains.
Normal latency is ~1-2 min (finalizer -> direct poller dispatch); the scheduled poller
cron is NOT a reliable fallback (GitHub delays it by hours), so an early exit strands work.

Use the terminal Receipt as the operation result.
Do not submit the same logical operation under a new id merely because a Receipt is delayed.

If this chat/controller dies, the next scheduled controller reads Claim Record + immutable Request + Receipt and resumes the same Work.

## Local workspace

Worker A: C:\luke-loop-a
Worker B: C:\luke-loop-b
Worker C: C:\luke-loop-c

Never use another Worker's worktree.

If the worktree is clean, synchronize to the exact current implementation HEAD.
If dirty:
- do not reset/clean blindly
- first reconcile against Claim Record and submitted Request bytes
- if the local diff was never submitted, regenerate from Issue/Task and durable phase
- if PATCHSET was submitted, reconstruct from Request payload if local files disappeared
- if PATCHSET_APPLIED, synchronize to APPLIED_HEAD and continue verification

Local dirty state is never authority.

## Implementation Patchset

Use IMPLEMENTATION_PATCHSET for normal Worker implementation.

One bounded logical change may contain multiple files.
Gateway:
- checks active authoritative Claim owner + generation
- stores PATCHSET_ADMITTED before implementation mutation
- blocks while a formal/legacy Lease operation is active
- validates expected HEAD
- writes all files in one implementation commit using CAS
- Fresh readbacks every file
- records PATCHSET_APPLIED and APPLIED_HEAD
- clears ACTIVE_OPERATION_ID only after durable reconciliation

If process dies after implementation commit but before Claim phase update:
retry the same operation id.
Gateway reconciles by exact file content and finishes the same operation.

## Acceptance evaluators

Every Completion has LQ_TASK_ACCEPTANCE:v1 containing:

task_id
evaluator_id
result
accepted_head
runtime_config
evidence_artifacts with durable URI + SHA256
evaluated_at

accepted_head must equal TASK_COMPLETE exact_head.

Any implementation HEAD change after evaluation invalidates Completion until the applicable evaluator passes again.

T019 evaluator:
T019_CAPTURE_CONTRACT_V1
Requires deterministic 941x1672 / DPR1 capture and runtime evidence.
Target visual similarity is NOT a T019 requirement.

Formal visual evaluator:
FORMAL_VISUAL_EVIDENCE_V1
Must point to an adopted, readback-verified Evidence Set bound to the exact implementation HEAD.
Do not weaken or bypass existing Evidence Adoption.

## Completion

Use TASK_COMPLETE only after the task-specific evaluator says PASS.

TASK_COMPLETE is durable and recoverable:
PREPARED
-> WORK_LOGGED
-> CLOSE_DISPATCHED
-> ISSUE_CLOSED
-> COMPLETE

The operation record is immutable by operation identity.
The work log uses a stable marker.
A close performed manually or by an unrelated actor cannot be adopted as this operation's success.

At finalization, Claim release and completion terminal state are committed together on the control branch.

If the terminal Receipt is lost after COMPLETE:
retry the same operation id.
Gateway returns TASK_ALREADY_COMPLETE.

## NO_PROGRESS recovery

Stalled Work is not left forever.

When progress deadline or Claim deadline expires:
1. another scheduled controller may request WORK_CLAIM_TAKEOVER
2. Gateway writes an implementation writer-fence commit first
3. old expected HEAD becomes stale
4. Claim generation increments
5. replacement owner receives RECOVERY_PENDING
6. old owner/generation is rejected
7. resume from durable NEXT_RECOVERY_ACTION
8. increment RECOVERY_ATTEMPTS

If attempts exceed MAX_RECOVERY_ATTEMPTS:
Gateway writes WORK_ESCALATED.
Do not call it success.
Return to Owner only for this durable escalation or another material arbitration gate.

## Task loop

For the owned Leaf:

DEFINE GATE
-> execute locally
-> test/runtime
-> observe
-> evaluate
-> if FAIL: classify -> minimum repair -> rerun
-> if PASS: submit bounded Patchset if needed
-> re-evaluate against APPLIED_HEAD
-> submit TASK_COMPLETE or Formal Visual Evidence path
-> reconcile terminal Receipt
-> confirm Claim is RELEASED / completion COMPLETE
-> only then move to another READY Leaf

A Worker owns at most one ACTIVE Claim at a time.
It may perform unlimited repair iterations on that Leaf within practical execution limits.
After the owned Leaf reaches COMPLETE / RELEASED, the same run selects the next READY Leaf
when at least ~15 minutes of budget remain.

Do not stop merely because:
- code was written
- actual.png was captured
- one test failed
- a Draft was submitted
- Request finalization is pending
- a Receipt is pending
- a Lease is pending
- another run could continue later

Those are nonterminal states.

## Owner escalation gates

Return to Owner only when:
- WORK_ESCALATED after bounded recovery attempts
- material authority or scope change is required
- security / external side-effect / cost approval is required
- Acceptance contract itself remains ambiguous after reasonable investigation
- the only unblocked Leafs require a capability this Worker lacks (OWNER_GATE_CAPABILITY)
- SPEC_DRIFT or OWNER_GATE_CONTROL_PLANE_ANOMALY after a fresh WORK_SUPPLY_RECONCILE
- every task Leaf is closed (Owner final gate for #101)

READY == 0 alone is never an Owner gate and never a reason to disable the schedule.

Ordinary implementation failures, visual mismatch, capture errors, tests, stale HEAD, delayed Receipt, and recoverable crashes are not Owner gates.

## Finalizer

Every meaningful result must leave durable state sufficient for a fresh run:
Claim Record
exact implementation HEAD
request id / operation id
Receipt state
Acceptance evaluator/evidence
Completion phase
NEXT_RECOVERY_ACTION when nonterminal

A natural-language status message never substitutes for this state.

