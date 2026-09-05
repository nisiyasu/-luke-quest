# LUKE QUEST WORK MANAGER

ROLE: LUKE QUEST development queue controller
MODE: QUEUE_CONTROLLED / HEAD_FIRST / WIP_LIMIT_1 / CONTINUOUS_EXECUTION

## 1. Source of truth

Implementation reality is the fresh HEAD of the actual default branch.

Use the following authority order:

1. fresh repository metadata and actual default branch
2. fresh default-branch HEAD and repository contents
3. `AUTONOMOUS_DEV_DIRECTIVE.md`
4. `WORK_MANAGER.md`
5. `WORK_QUEUE.md`
6. `CURRENT.md`
7. active `requirements/REQ-xxx_*.md`
8. prior conversation memory

If CURRENT or queue metadata conflicts with actual code at fresh HEAD, inspect commits/diffs and repair metadata to match repository reality. Never repeat already committed work merely because CURRENT is stale.

## 2. Mandatory boot

Every execution must begin by freshly obtaining:

1. repository metadata
2. actual default branch, never guessed
3. latest HEAD of that branch
4. `AUTONOMOUS_DEV_DIRECTIVE.md`
5. `WORK_MANAGER.md`
6. `WORK_QUEUE.md`
7. `CURRENT.md`
8. the active requirement file if one exists
9. files named by CURRENT/directive as mandatory
10. recent commits, workflow and Pages state as needed

Compare CURRENT's recorded implementation checkpoint with fresh HEAD. If HEAD is ahead, inspect the intervening commits/diffs and reconstruct the actual state before changing anything.

## 3. WIP rule

`WIP_LIMIT = 1` for `IN_PROGRESS` requirements.

`VERIFY` does not count against the WIP limit. A requirement waiting only for Owner physical-device verification must not stop independent development.

Do not scatter partial implementation across many requirements. Finish or safely block the active requirement before taking another one.

## 4. Recovery of active work

If `WORK_QUEUE.md` contains an `IN_PROGRESS` requirement:

1. read that requirement file in full
2. inspect fresh HEAD and relevant files
3. compare with CURRENT and requirement completion state
4. recover exactly what is already implemented
5. continue from the real repository state
6. do not redo already committed work

If the implementation is actually complete, move the requirement to `VERIFY` or `DONE` as appropriate, update queue/CURRENT, then continue to the next requirement.

## 5. Selecting new work

If no requirement is `IN_PROGRESS`, select the highest-priority `READY` requirement.

Priority order:

- `P0`: immediate. Owner direct request, severe bug, severe UX/input problem, active canonical-visual correction.
- `P1`: high. Major player-visible quality or core gameplay improvement.
- `P2`: medium. Important expansion after higher-priority work.
- `P3`: low. Future polish, optional content, non-urgent improvement.

Within equal priority, use this tie-break order:

1. explicit Owner order in `WORK_QUEUE.md`
2. Owner's newest direct request
3. critical bug or UX defect
4. player-visible improvement
5. visual-quality improvement
6. content expansion
7. internal cleanup only when required for safe delivery

Change the selected requirement from `READY` to `IN_PROGRESS`, and synchronize CURRENT's active-requirement fields.

## 6. Requirement execution

Read the active requirement file in full before editing implementation files.

Implement against its explicit completion conditions, while also applying the global directive and preserving all known safety protections.

Before modifying a target file, fetch it fresh.

After a safe completed unit:

1. test/validate it
2. create a checkpoint commit
3. fresh-fetch the resulting state
4. update CURRENT/queue when useful
5. continue working

A checkpoint, CURRENT update, Pages success, or requirement completion is not an execution-stop condition.

## 7. Requirement states

- `BACKLOG`: recorded Owner request, not yet ready/ordered for implementation.
- `READY`: requirements sufficiently defined and may be selected.
- `IN_PROGRESS`: current implementation work. Maximum one.
- `BLOCKED`: cannot safely continue this requirement until an external condition or Owner decision changes.
- `VERIFY`: implementation is complete enough for verification, often including Owner physical-device/visual confirmation. Does not block next work.
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
5. select the next highest-priority `READY` requirement
6. continue

Only stop for Owner decision when no independent safe useful work remains.

## 9. VERIFY handling

If implementation is complete but requires Owner iPhone physical verification or subjective visual approval:

1. mark `VERIFY`
2. state exactly what is verified automatically and what remains physical/subjective
3. do not falsely claim iPhone physical PASS
4. continue to the next `READY` requirement

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

Global architectural, canon, safety, and perpetual-execution rules may still belong in `AUTONOMOUS_DEV_DIRECTIVE.md`.

## 12. Queue updates

`WORK_QUEUE.md` is the authoritative list of requested work, priority and execution status.

Maintain:

- ORDER
- ID
- PRIORITY
- STATUS
- TITLE
- requirement path where available
- concise blocker/verification note when relevant

Never hide unfinished Owner requests by removing them from the queue.

## 13. CURRENT relationship

CURRENT describes the current implementation checkpoint and immediate execution state. Queue describes the full work inventory.

CURRENT should record at least, when queue-controlled mode is active:

- `WORK_MANAGEMENT_MODE: QUEUE_CONTROLLED`
- `WORK_MANAGER: WORK_MANAGER.md`
- `WORK_QUEUE: WORK_QUEUE.md`
- `ACTIVE_REQUIREMENT_ID`
- `ACTIVE_REQUIREMENT_PATH`
- `VERIFY_REQUIREMENTS`
- `NEXT_QUEUED_REQUIREMENT_ID`

CURRENT is an autosave/handoff document, not a closing ceremony.

## 14. Continuous loop

Run this loop while the execution environment allows safe work:

BOOT
→ recover fresh HEAD
→ recover IN_PROGRESS requirement or select highest-priority READY
→ implement
→ verify
→ checkpoint commit
→ fresh verify
→ synchronize queue/CURRENT as appropriate
→ if requirement complete, move to VERIFY/DONE
→ select next READY
→ implement again
→ repeat

Do not self-terminate because one requirement, one NEXT_ACTION, one commit, one Pages deployment, or one visible improvement completed.

## 15. Scheduled Task design

The Scheduled Task prompt should remain a short loader. It should point to the repository and require loading the directive, manager, queue, CURRENT, and active requirement. Detailed Owner requirements belong in requirement files, not in the Scheduled Task body.