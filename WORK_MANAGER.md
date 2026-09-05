# LUKE QUEST WORK MANAGER

ROLE: LUKE QUEST development queue controller
MODE: QUEUE_CONTROLLED / HEAD_FIRST / WIP_LIMIT_1 / CONTINUOUS_EXECUTION / SELF_AUDIT_GUARDED

## 1. Source of truth

Implementation reality is the fresh HEAD of the actual default branch.

Use the following authority order:

1. fresh repository metadata and actual default branch
2. fresh default-branch HEAD and repository contents
3. latest direct Owner instruction applicable to the execution
4. `AUTONOMOUS_DEV_DIRECTIVE.md`
5. `EXECUTION_SELF_AUDIT_GUARD.md`
6. `WORK_MANAGER.md`
7. `WORK_QUEUE.md`
8. `CURRENT.md`
9. active or Owner-mandated re-audit `requirements/REQ-xxx_*.md`
10. prior conversation memory

If CURRENT or queue metadata conflicts with actual code at fresh HEAD, inspect commits/diffs and repair metadata to match repository reality. Never repeat already committed work merely because CURRENT is stale.

Latest direct Owner instruction may preempt older queue ordering or a lower-priority IN_PROGRESS requirement. A VERIFY item explicitly called back for re-audit by Owner is active work and must not be skipped merely because its stored status is VERIFY.

## 2. Mandatory boot

Every execution must begin by freshly obtaining:

1. repository metadata
2. actual default branch, never guessed
3. latest HEAD of that branch
4. `AUTONOMOUS_DEV_DIRECTIVE.md`
5. `EXECUTION_SELF_AUDIT_GUARD.md`
6. `WORK_MANAGER.md`
7. `WORK_QUEUE.md`
8. `CURRENT.md`
9. the active or Owner-mandated re-audit requirement file if one exists
10. files named by CURRENT/directive as mandatory
11. recent commits, workflow and Pages state as needed

Compare CURRENT's recorded implementation checkpoint with fresh HEAD. If HEAD is ahead, inspect the intervening commits/diffs and reconstruct the actual state before changing anything.

Before selecting work, run `EXECUTION_SELF_AUDIT_GUARD.md` GATE A. Any detected stale state, priority drift, re-audit omission or prior premature termination must be self-repaired before normal development resumes.

## 3. WIP rule

`WIP_LIMIT = 1` for `IN_PROGRESS` requirements.

`VERIFY` does not count against the WIP limit when it is genuinely only waiting for Owner physical-device or subjective verification.

Exception: if Owner explicitly calls a VERIFY requirement back for re-audit, defect correction, public-behavior confirmation, or priority P0 work, treat it as active work and preempt lower-priority IN_PROGRESS work safely.

Do not scatter partial implementation across many requirements. Finish, safely suspend for higher Owner authority, or block the active requirement before taking another one.

## 4. Recovery of active work

If `WORK_QUEUE.md` contains an `IN_PROGRESS` requirement:

1. read that requirement file in full
2. inspect fresh HEAD and relevant files
3. compare with CURRENT and requirement completion state
4. recover exactly what is already implemented
5. compare against latest direct Owner authority
6. if a newer Owner P0/re-audit preempts it, checkpoint/suspend it safely and switch authority
7. otherwise continue from the real repository state
8. do not redo already committed work

If the implementation is actually complete, move the requirement to `VERIFY` or `DONE` as appropriate, update queue/CURRENT, then continue to the next requirement.

## 5. Selecting new work

Before selecting or continuing any requirement, run `EXECUTION_SELF_AUDIT_GUARD.md` GATE B.

If no requirement is `IN_PROGRESS`, select the highest-priority `READY` requirement unless latest Owner direct authority designates a VERIFY re-audit or other explicit priority target.

Priority order:

- `P0`: immediate. Owner direct request, severe bug, severe UX/input problem, active canonical-visual correction, Owner-mandated re-audit.
- `P1`: high. Major player-visible quality or core gameplay improvement.
- `P2`: medium. Important expansion after higher-priority work.
- `P3`: low. Future polish, optional content, non-urgent improvement.

Within equal priority, use this tie-break order:

1. Owner's newest explicit absolute order
2. explicit Owner order in `WORK_QUEUE.md`
3. Owner's newest direct request
4. critical bug or UX defect
5. player-visible improvement
6. visual-quality improvement
7. content expansion
8. internal cleanup only when required for safe delivery

Change the selected requirement from `READY` to `IN_PROGRESS`, or reopen VERIFY -> IN_PROGRESS when re-audit/public reality requires it, and synchronize CURRENT's active-requirement fields.

## 6. Requirement execution

Read the active requirement file in full before editing implementation files.

Implement against its explicit completion conditions, while also applying the global directive, self-audit guard and all known safety protections.

Before modifying a target file, fetch it fresh.

After a safe completed unit:

1. test/validate it
2. create a checkpoint commit
3. fresh-fetch the resulting state
4. update CURRENT/queue when useful
5. run work-selection reality check again
6. continue working

A checkpoint, CURRENT update, Pages success, requirement completion, or convenient reporting point is not an execution-stop condition.

## 7. Requirement states

- `BACKLOG`: recorded Owner request, not yet ready/ordered for implementation.
- `READY`: requirements sufficiently defined and may be selected.
- `IN_PROGRESS`: current implementation work. Maximum one, except a transient safe-preemption transition during metadata repair.
- `BLOCKED`: cannot safely continue this requirement until an external condition or Owner decision changes.
- `VERIFY`: implementation is complete enough for verification, often including Owner physical-device/visual confirmation. Does not block next work unless Owner calls it back for re-audit.
- `DONE`: all completion conditions that can legitimately be claimed are satisfied.
- `SUPERSEDED`: replaced by a newer requirement. Record replacement ID.
- `CANCELLED`: explicitly cancelled by Owner.

Never mark `DONE` merely because code exists. Respect the requirement's stated runtime, Pages, asset-integration and verification conditions.

## 8. Blocker handling

A blocker on one requirement is not a reason to stop all development.

When blocked:

1. record the exact blocker in the requirement
2. preserve repository in a playable state
3. change requirement to `BLOCKED`
4. synchronize queue/CURRENT
5. select the next highest-priority valid requirement under Owner authority
6. continue

Only stop for Owner decision when no independent safe useful work remains and the decision meets the Owner-interruption firewall in `EXECUTION_SELF_AUDIT_GUARD.md`.

## 9. VERIFY handling

If implementation is complete but requires Owner iPhone physical verification or subjective visual approval:

1. mark `VERIFY`
2. state exactly what is verified automatically and what remains physical/subjective
3. do not falsely claim iPhone physical PASS
4. continue to the next valid work item

If Owner reports that a VERIFY feature is absent, unclear, broken, or must be re-audited:

1. treat the report as fresh defect/re-audit evidence
2. fetch implementation and public-build evidence again
3. reopen to `IN_PROGRESS` if acceptance criteria are not demonstrably satisfied
4. repair and retest
5. do not rely on the old VERIFY label as proof

## 10. DONE handling

Mark a requirement `DONE` only after its explicit completion conditions are met.

DONE requirements remain in queue/history but should not be repeatedly loaded in full during normal boot unless needed for regression or dependency analysis.

## 11. New Owner requests

Do not keep appending feature-specific requests to the global directive.

For each materially distinct new Owner request:

1. create a new `requirements/REQ-xxx_<name>.md`
2. preserve the request in sufficient implementation detail
3. assign priority/status
4. register it in `WORK_QUEUE.md`
5. place it in Owner-requested order
6. if it supersedes an older requirement, mark the older one `SUPERSEDED` rather than silently rewriting history

Global architectural, canon, safety, perpetual-execution and self-audit rules may live in the global directive/guard.

## 12. Queue updates

`WORK_QUEUE.md` is the authoritative inventory of requested work, but it is not allowed to override fresher code reality or the latest direct Owner priority.

Maintain:

- ORDER
- ID
- PRIORITY
- STATUS
- TITLE
- requirement path where available
- concise blocker/verification/re-audit note when relevant

Never hide unfinished Owner requests by removing them from the queue.

When the queue itself is stale or contradicts fresh implementation/public evidence, self-repair it forward instead of asking Owner to reconcile it.

## 13. CURRENT relationship

CURRENT describes the current implementation checkpoint and immediate execution state. Queue describes the full work inventory.

CURRENT should record at least, when queue-controlled mode is active:

- `WORK_MANAGEMENT_MODE: QUEUE_CONTROLLED`
- `WORK_MANAGER: WORK_MANAGER.md`
- `WORK_QUEUE: WORK_QUEUE.md`
- `SELF_AUDIT_GUARD: LOADED_APPLIED`
- `BOOT_REALITY_AUDIT`
- `OWNER_PRIORITY_AUDIT`
- `CONTINUE_GATE_LAST_RESULT`
- `EXECUTION_DEGRADATION_STATUS`
- `ACTIVE_REQUIREMENT_ID`
- `ACTIVE_REQUIREMENT_PATH`
- `VERIFY_REQUIREMENTS`
- `NEXT_QUEUED_REQUIREMENT_ID`
- `SELF_REPAIR_ACTIONS` when applicable

CURRENT is an autosave/handoff document, not a closing ceremony.

## 14. Continuous loop

Run this loop while the execution environment allows safe work:

BOOT
→ GATE A self-audit
→ repair stale/violating state
→ recover/preempt/select correct work
→ GATE B selection audit
→ implement
→ verify
→ checkpoint commit
→ fresh verify
→ synchronize queue/CURRENT as appropriate
→ select next valid work
→ implement again
→ repeat

Do not self-terminate because one requirement, one NEXT_ACTION, one commit, one Pages deployment, one visible improvement, or one successful re-audit completed.

## 15. Mandatory continue gate

Before any normal report, handoff, or self-selected stop, run `EXECUTION_SELF_AUDIT_GUARD.md` GATE C.

If any safe useful executable work remains, continue.

A normal report is permitted only when external execution control returns, a valid stop condition exists, or no safe useful executable work remains.

If a prior session stopped prematurely, the next boot must detect that as execution degradation and self-repair without waiting for Owner criticism.

## 16. Owner interruption policy

Routine implementation management must not be delegated back to Owner.

Do not ask Owner to detect priority drift, stale metadata, premature termination, missing re-audit, or whether to continue after a checkpoint.

Use conservative reversible implementation choices and continue autonomously.

Only request Owner judgment when no safe reversible path exists, the choice materially changes protected canon/irreversible direction/formal art identity or external paid action, and no other independent safe useful work remains.

## 17. Scheduled Task design

The Scheduled Task prompt should remain a short loader. It should point to the repository and require loading the directive, `EXECUTION_SELF_AUDIT_GUARD.md`, manager, queue, CURRENT, and active/re-audit requirement. Detailed Owner requirements belong in requirement files, not in the Scheduled Task body.
