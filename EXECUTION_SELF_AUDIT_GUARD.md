# LUKE QUEST — EXECUTION SELF-AUDIT GUARD

MODE: MANDATORY / FAIL_CLOSED / SELF_REPAIR / OWNER_INTERRUPTION_MINIMIZED

PURPOSE:
LUKE QUEST autonomous development must detect its own priority drift, premature termination, stale metadata, fake completion, verification gaps and execution-quality degradation without waiting for Owner criticism.

This file is mandatory execution authority and must be loaded on every boot together with `AUTONOMOUS_DEV_DIRECTIVE.md`, `WORK_MANAGER.md`, `WORK_QUEUE.md`, `CURRENT.md`, and the active/re-audit requirement.

==================================================
1. AUTHORITY AND PREEMPTION
==================================================

Latest direct Owner instruction outranks older queue ordering and generic manager rules when they conflict.

If the latest Owner instruction names an ABSOLUTE ORDER, explicit P0 order, re-audit target, regression concern, or correction request:

- treat that instruction as active execution authority
- do not skip it merely because the requirement currently says VERIFY
- do not continue a lower-priority IN_PROGRESS item ahead of it
- safely checkpoint or suspend the lower-priority item
- move the Owner-mandated item to the appropriate active/re-audit state
- perform the required audit/repair first

A VERIFY requirement explicitly called back for re-audit by Owner is active work until the requested re-audit is completed.

==================================================
2. THREE MANDATORY SELF-AUDIT GATES
==================================================

Every execution must pass all three gates.

### GATE A — BOOT REALITY AUDIT
Before selecting work:

1. fresh repository metadata
2. actual default branch
3. fresh HEAD
4. recent commits/diff
5. fresh WORK_QUEUE
6. fresh CURRENT
7. latest Owner direct instruction applicable to this execution
8. active/re-audit requirement
9. relevant workflow/Pages state

Then explicitly test:

- Is CURRENT stale relative to HEAD?
- Is QUEUE stale relative to code/Pages?
- Is a lower-priority item active while a newer Owner P0/re-audit exists?
- Is a VERIFY item being trusted even though Owner explicitly questioned its public behavior?
- Did the previous execution terminate while safe useful work remained?

Any YES result triggers SELF_REPAIR before normal development.

### GATE B — WORK-SELECTION AUDIT
Immediately before starting or continuing a requirement:

Confirm all are true:

- selected work is the highest valid current authority
- explicit Owner absolute order is obeyed
- WIP limit is respected after any required preemption
- requirement status matches repository reality
- previous implementation is not being duplicated
- task is player-visible or necessary for safe delivery

If any condition fails, do not proceed with the selected work. Repair queue/current/state and select again.

### GATE C — CONTINUE / STOP AUDIT
Before any normal report, self-termination, or handoff:

Fresh-check HEAD + WORK_QUEUE + CURRENT + Pages/workflow and answer internally:

1. Is there an IN_PROGRESS item that can continue safely?
2. Is there a READY item that can continue safely?
3. Is there an Owner-mandated VERIFY re-audit still unresolved?
4. Is there a safe BACKLOG item that WORK_MANAGER allows promotion?
5. Is there a known bug/UX defect/player-visible gap that can be formally REQ'd and safely advanced?
6. Is metadata stale or inconsistent and repairable?

If ANY answer is YES, normal self-termination is forbidden. Continue development.

A commit, Pages success, CURRENT update, one completed REQ, one visible improvement, or a convenient reporting point NEVER satisfies this gate.

==================================================
3. PREMATURE-TERMINATION / DEGRADATION DETECTOR
==================================================

Detect likely execution degradation when any of the following occurs while safe work remains:

- only one small implementation/checkpoint is produced and execution attempts to stop
- execution ends immediately after registering a REQ
- execution ends immediately after a commit
- execution ends while Pages is merely queued/in_progress and other safe work exists
- execution skips explicit Owner P0/re-audit work because it is marked VERIFY
- execution selects P1/P2 expansion ahead of newer Owner P0 correction
- CURRENT remains materially behind HEAD at handoff without an external-stop explanation
- a previous session's continuous loop performed substantially more independent safe units, but the current session stops at the first convenient checkpoint without an external limit

On detection:

STATUS = EXECUTION_DEGRADATION_DETECTED

Then:

1. do not ask Owner to diagnose it
2. identify the violated rule
3. repair metadata/priority/state if needed
4. resume the correct highest-authority work
5. keep checkpointing
6. only report once external execution control actually returns or a valid stop condition exists

Do not use elapsed wall-clock time as the sole quality metric. The violation is premature stopping while safe executable work remains.

==================================================
4. SELF-REPAIR PROTOCOL
==================================================

When a contradiction or execution mistake is found:

1. preserve fresh HEAD as implementation truth
2. inspect commits/diff/public workflow evidence
3. repair WORK_QUEUE status/order if stale
4. repair CURRENT if stale
5. reopen VERIFY -> IN_PROGRESS when public behavior or Owner re-audit requirement is not satisfied
6. safely suspend lower-priority IN_PROGRESS work when latest Owner P0 must preempt it
7. record the reason for repair in the relevant requirement/CURRENT
8. continue execution without requiring Owner intervention

Never conceal a previous mistake by deleting historical work. Repair forward.

==================================================
5. OWNER INTERRUPTION FIREWALL
==================================================

Default behavior: DO NOT involve Owner in routine implementation management.

Do not ask Owner to:

- choose between technically equivalent reversible implementation details
- remind the agent to continue
- notice stale CURRENT/QUEUE
- detect that priority order was violated
- tell the agent that a VERIFY item needs re-audit when the latest Owner instruction already says so
- decide whether to continue after one checkpoint
- diagnose why execution was shorter than previous runs

Use conservative, reversible, canon-preserving choices and continue autonomously.

Owner decision is allowed only when ALL are true:

1. the decision materially changes canon, irreversible product direction, paid/external action, or formal approved art identity; AND
2. no safe reversible implementation path exists; AND
3. no independent safe useful work remains elsewhere in the repository.

Otherwise log the uncertainty and continue with other safe work.

==================================================
6. VERIFY IS NOT IMMUNITY FROM RE-AUDIT
==================================================

VERIFY means implementation has passed the currently recorded automated/public checks but still awaits Owner physical/subjective verification.

VERIFY does NOT mean:

- never inspect again
- Owner-reported failure can be ignored
- newer acceptance criteria can be skipped
- public behavior is assumed correct forever

If Owner says a VERIFY feature is not visible, not working, unclear, or must be re-audited:

- treat that as fresh defect evidence
- re-fetch public-build inclusion and implementation
- run appropriate regression
- set IN_PROGRESS if completion criteria are not demonstrably satisfied
- keep IOS_PHYSICAL_VERIFICATION=PENDING until physical confirmation

==================================================
7. REQUIRED CURRENT FIELDS
==================================================

CURRENT should maintain, when relevant:

- SELF_AUDIT_GUARD: LOADED_APPLIED
- BOOT_REALITY_AUDIT: PASS / REPAIRED / BLOCKED
- OWNER_PRIORITY_AUDIT: PASS / REPAIRED
- CONTINUE_GATE_LAST_RESULT: CONTINUE / VALID_STOP
- EXECUTION_DEGRADATION_STATUS: NONE / DETECTED_REPAIRED
- PREEMPTED_REQUIREMENT: ID or NONE
- SELF_REPAIR_ACTIONS: concise factual list

Do not update these fields cosmetically. They must reflect fresh reality.

==================================================
8. VALID STOP CONDITIONS
==================================================

Normal self-selected stopping is allowed only when the CONTINUE / STOP audit finds no safe useful executable work.

External system/tool/context termination may interrupt execution at any time. That is not agent-chosen completion.

If external interruption occurs before metadata synchronization, next boot must detect the stale state from HEAD and self-repair it automatically.

==================================================
9. ANTI-REGRESSION PRINCIPLE
==================================================

Autonomous execution quality must not silently degrade across prompt versions or sessions.

New loader/prompts may add requirements, but must not weaken:

- HEAD-first recovery
- Owner latest-directive precedence
- WIP control
- continuous execution
- checkpoint discipline
- public-build verification
- no-fake-completion rules
- self-repair
- no-self-termination while safe work exists

If a newer instruction conflicts with these because of ambiguous wording, choose the interpretation that preserves safety, Owner priority and continuous execution unless the Owner explicitly orders otherwise.
