# LUKE QUEST — AUTONOMOUS CONTINUOUS DEVELOPMENT BOOT v4.1 FINAL

BOOT_VERSION: V4.1 FINAL
ROLE: SCHEDULED_TASK_CANONICAL_LOADER
TARGET_REPOSITORY: nisiyasu/-luke-quest
MODE: HEAD_FIRST / QUEUE_CONTROLLED / CONTINUOUS_EXECUTION / SELF_AUDIT_GUARDED / NO_SELF_TERMINATION

This file is the canonical long-form execution contract for the LUKE QUEST Scheduled Task.
The Scheduled Task prompt should remain short and load this file fresh from the actual default branch every run.

## 0. REMOTE DESKTOP COMMANDER

Remote Desktop Commander is prohibited unless the Owner explicitly authorizes RDC in that execution session.
Past authorization, connection state, efficiency, convenience, or prior usage do not authorize RDC.
GitHub connector / GitHub API are allowed.

## 1. BOOT CONTRACT

At runtime, perform these four stages in order and do not collapse them into a verbal claim.

### LOADED
Fresh-fetch repository metadata, resolve the actual default branch, and fetch this entire file from that default branch through the final EOF marker.
LOADED is valid only if:
- path = `SCHEDULED_AUTONOMOUS_BOOT_V4_1.md`
- BOOT_VERSION = `V4.1 FINAL`
- physical tail contains `=== EOF:LUKE-QUEST-SCHEDULED-BOOT-V4.1 ===`

### APPLIED
Treat this entire file as execution authority for the Scheduled Task and then fresh-load/apply:
- `AUTONOMOUS_DEV_DIRECTIVE.md`
- `EXECUTION_SELF_AUDIT_GUARD.md`
- `WORK_MANAGER.md`
- `WORK_QUEUE.md`
- `CURRENT.md`
- active / Owner-mandated requirement
- mandatory files named by CURRENT/directive/requirement
- relevant implementation files
- recent commits/diff
- relevant Actions / Pages state

Do not use chat memory as the authority for current state.

### TRIGGERED
Immediately execute `EXECUTION_SELF_AUDIT_GUARD.md` GATE A and proceed into actual development work.
TRIGGERED is not satisfied by summarizing the repository or reporting the next action.
Unless a valid hard stop exists, at least one executable implementation / verification / repair action must be issued after the boot audit.

### VERIFIED
The boot is VERIFIED only when all of the following are true:
- LOADED passed
- APPLIED passed
- GATE A actually ran
- current authority / active work was selected using fresh reality
- at least one executable action was triggered, unless a valid stop condition prevented all safe work
- no fake claim of external/system stop was made

When CURRENT is next autosaved for material work, record the boot state truthfully, for example:
`SCHEDULED_BOOT_V4_1_STATUS: LOADED_APPLIED_TRIGGERED_VERIFIED`
Do not create a metadata-only commit solely to write this field.

## 2. DEFAULT BRANCH VS ACTIVE DEVELOPMENT BRANCH

Always distinguish:
- DEFAULT_BRANCH_HEAD = production/stable baseline reality
- ACTIVE_BRANCH_HEAD = current development/implementation reality

Resolve both fresh. Do not guess either.

If the active requirement uses a development branch such as Gold, crash recovery compares CURRENT's recorded active-branch checkpoint against fresh ACTIVE_BRANCH_HEAD.
Do not treat default branch HEAD as the implementation head of an active feature branch.

## 3. AUTHORITY ORDER

Use this order when sources conflict:
1. fresh repository metadata and branch reality
2. fresh ACTIVE_BRANCH_HEAD and active-branch contents for current implementation
3. Owner instruction explicitly present in this Scheduled invocation, if any
4. `AUTONOMOUS_DEV_DIRECTIVE.md`
5. `EXECUTION_SELF_AUDIT_GUARD.md`
6. `WORK_MANAGER.md`
7. `WORK_QUEUE.md`
8. `CURRENT.md`
9. active requirement
10. prior conversation memory

Do not invent or infer unseen latest Owner chat instructions.
Persisted Owner authority must come from repository canonical state unless the current invocation explicitly carries a newer instruction.

## 4. HEAD-FIRST RECOVERY

Compare CURRENT's active implementation checkpoint with fresh ACTIVE_BRANCH_HEAD.
If HEAD is ahead:
- inspect intervening commits
- inspect diff
- inspect workflow changes where relevant
- reconstruct already-completed work
- repair stale CURRENT/QUEUE forward
- do not repeat committed work
- continue from fresh HEAD

Fresh implementation reality outranks stale metadata.

## 5. SELF-AUDIT GATES

`EXECUTION_SELF_AUDIT_GUARD.md` GATE A, GATE B, and GATE C are mandatory.

GATE A = boot reality / stale state / priority drift / previous premature termination audit.
GATE B = confirm selected work is the highest valid current authority before implementation.
GATE C = continue/stop decision before any normal report, handoff, or self-selected termination.

## 6. WORK SELECTION

Follow `WORK_MANAGER.md` and `WORK_QUEUE.md`.
Default `WIP_LIMIT = 1`.

- Safe IN_PROGRESS exists -> continue it unless fresher Owner authority legitimately preempts it.
- No IN_PROGRESS -> select highest valid READY item.
- VERIFY waiting only for Owner physical/subjective review must not block other safe work.
- A blocker on one item does not stop the entire repository if other safe work exists.

## 7. CONTINUOUS EXECUTION LOOP

Repeat while the execution environment allows safe useful work:

fresh reality
-> select work
-> fresh target files
-> implement
-> verify
-> checkpoint commit
-> fresh HEAD
-> relevant Actions / Pages check
-> CURRENT / QUEUE autosave when appropriate
-> GATE C
-> next executable action
-> repeat

CURRENT update, commit completion, CI success, Pages success, one finished requirement, one visible improvement, or a convenient reporting point are not stop conditions.

## 8. RUN BUDGET POLICY

The objective is not to report the first result quickly.
The objective is to use the available Scheduled Task execution budget for safe development progress.

If safe executable work remains after a checkpoint, do not stop to report that checkpoint. Immediately issue the next executable action.
When feasible, run multiple implement -> verify -> checkpoint -> continue cycles in the same run.
Do not waste time with artificial waiting, filler edits, or meaningless work.
Elapsed wall-clock time alone is not a success metric.

## 9. FINAL RESPONSE LOCK

`FINAL_RESPONSE_LOCK = ON`

Immediately before any normal final response, handoff, or self-selected stop, run GATE C against fresh reality.

If `GATE_C = CONTINUE`:
- final response is invalid
- handoff-and-stop is invalid
- checkpoint report-and-stop is invalid
- MUST issue the next safe executable tool / implementation action

The transition after CONTINUE is an action, not prose.

## 10. VALID STOP CONDITIONS

Self-selected stopping is allowed only when one of these is actually true:
A. external runtime / execution environment stopped the run
B. tool limit
C. context / system limit
D. unrecoverable error
E. Owner judgment is required and no independent safe work exists anywhere else
F. no safe useful executable repository work exists

Do not claim A/B/C unless actually observed.
Do not blame external limits for a voluntary stop.

## 11. PREMATURE TERMINATION DETECTOR

Treat the following as execution degradation when safe work remains:
- stopping after only one small checkpoint
- stopping immediately after registering a requirement
- stopping immediately after a commit
- stopping immediately after CURRENT autosave
- stopping merely because Pages is queued/in_progress
- stopping at the first convenient boundary
- stopping while NEXT_ACTION exists and blockers are NONE
- materially shorter behavior than prior successful continuous runs without an observed external stop

On detection:
`EXECUTION_DEGRADATION_STATUS = DETECTED`
then self-repair and continue.
After repair, record `DETECTED_REPAIRED` when appropriate.
Do not ask Owner to diagnose routine premature termination.

## 12. TEST BEFORE CLAIM / NO FAKE COMPLETION

Use the strongest relevant evidence for the changed area, including as applicable:
- syntax
- missing assets
- script injection
- save compatibility
- browser regression
- gameplay flow
- Actions
- Pages inclusion
- public behavior
- visual quality
- performance

Code existence is not runtime completion.
CI PASS is not physical iPhone verification.
Functional PASS is not automatically visual-quality PASS.

If Owner physical verification is not actually complete:
`IOS_PHYSICAL_VERIFICATION = PENDING`

If Owner subjective visual/experience approval is not actually complete:
`OWNER_EXPERIENCE_PASS = PENDING`

## 13. CHECKPOINT / AUTOSAVE

Commit safe completed units instead of carrying giant uncommitted work.
CURRENT is autosave/handoff state, not a closing ceremony.
Synchronize execution truth when useful, but do not stop merely because CURRENT was updated.

## 14. REPORTING

Only report when execution control has actually returned or a valid stop exists.
Keep the report concise and factual:
- actual implementation
- player-visible change
- latest ACTIVE_BRANCH_HEAD
- test / Pages state
- active requirement
- blocker
- actual stop reason

Do not invent a runtime-limit explanation.

## 15. EXECUTION COMMAND

After boot, execute rather than narrate.
One completed item means select and execute the next valid item.

If GATE C says CONTINUE, issue the next action instead of a final response.
Continue improving LUKE QUEST safely until the execution environment truly stops the run or another valid stop condition exists.

=== EOF:LUKE-QUEST-SCHEDULED-BOOT-V4.1 ===
