# PERSISTENT AUTONOMOUS WORK LOOP — VERIFIED SUCCESS CASE

DOCUMENT_ID: LQ-PERSISTENT-AUTONOMOUS-WORK-LOOP-VERIFIED-SUCCESS-20260906
STATUS: VERIFIED_SUCCESS_CASE_PRESERVATION
DATE: 2026-09-06
REPOSITORY: nisiyasu/-luke-quest
CANONICAL_BRANCH_AT_CAPTURE: main
PURPOSE: Preserve the exact operating structure, observed success chain, reusable procedure, known limitations, and prompt reconstruction for the LUKE QUEST autonomous development method that demonstrably worked on 2026-09-06.

---

## 0. EVIDENCE BOUNDARY — DO NOT MIX FACT WITH FUTURE DESIGN

This document deliberately separates:

1. **VERIFIED / OBSERVED** — behavior actually evidenced by repository state, commits, workflow/Pages evidence, and Owner physical-iPhone confirmation.
2. **RECONSTRUCTED / REUSABLE** — an operational loader reconstructed from the verified repository rules. It is not claimed to be the byte-for-byte historical Scheduled Task prompt.
3. **NOT VERIFIED / RETURN POINT** — later ideas that may be valuable but were not part of the proven success case and must be separately designed, tested and validated before being called established behavior.

Never promote item 2 or 3 into “historically proven” merely because it is plausible.

---

## 1. VERIFIED RESULT

The LUKE QUEST autonomous development system demonstrated all of the following in actual repository operation:

- development activity continued across many independent implementation units rather than stopping after the first REQ/commit/checkpoint;
- implementation state was recovered from fresh GitHub repository reality rather than depending only on chat memory;
- WIP was managed through `WORK_QUEUE.md` / requirement state;
- a newer direct Owner P0 defect request was inserted while autonomous development was already working on another requirement;
- the running development process later detected that higher Owner authority from fresh repository state;
- the lower-priority work was safely advanced/closed to VERIFY before preemption rather than abandoned as ambiguous WIP;
- the new Owner P0 became active work;
- the defect was diagnosed and repaired;
- the repair added a stronger regression/visual-liveness gate rather than stopping at a code edit;
- Pages/automated verification succeeded;
- the Owner then confirmed on the physical iPhone that the previously black world/map was visible again: **Owner physical result: “うん、直った”**.

This is the central verified success case.

---

## 2. VERIFIED SUCCESS INCIDENT — OWNER P0 HOT INSERT DURING ACTIVE DEVELOPMENT

### 2.1 Initial public defect evidence

Owner physical-iPhone observation:

- A / MENU / movement controls were visible;
- actual world/map/player presentation was dark/black/not visible;
- a prior cache-bust attempt did not resolve the visible defect.

The defect requirement preserved the direct Owner instruction:

`画面が暗い。直して`

Canonical requirement:

`requirements/REQ-034_IPHONE_BLACK_WORLD_SCREEN.md`

### 2.2 Verified commit chain

The following commit sequence is evidence of the hot-insert/preemption/repair flow:

1. `283a0b419365332a2c86c96bf081b283e027592e`
   - `Enforce REQ-033 outpost runtime acceptance`
   - REQ-033 work was still progressing before the new Owner defect was injected.

2. `d3b46cdb28998ddbc685ad1dbd40728dbe494fbe`
   - `Register Owner P0 iPhone black world screen defect`
   - the new Owner P0 requirement was written into repository state without simultaneously editing the same implementation code being worked by the autonomous lane.

3. `0b0b368263dfd6b42e4f074d989bf0e7f1086f04`
   - `Close REQ-033 implementation to VERIFY before Owner P0 preemption`

4. `7fc830671d35208ff0007e6144a4b486944cb3a6`
   - `Activate Owner P0 black world screen repair`

5. `2711237f6d382b56a0c0b09a6968e122a9404a02`
   - `Preempt queue to Owner P0 REQ-034 black screen repair`

6. `5d010f33f73427b61d8892de01b199a2feaef5ee`
   - `Fix iPhone world visibility and harden visual liveness`

7. `e9cb5bd747370e4fe911afbc3cfb7e7de89b5611`
   - `Gate iPhone world visual liveness in Pages CI`

8. `0d59369c20fd242e3fd0f48cd833386e8b18af55`
   - paint-aware visual gate repair after the strengthened fail-closed check exposed an overly narrow detector.

9. Pages workflow recorded by REQ-034:
   - run `34006670133`: SUCCESS
   - assembled browser smoke: SUCCESS
   - iPhone-sized floating-touch + visible-world geometry/paint smoke: SUCCESS
   - Pages upload/deploy: SUCCESS

10. Owner physical-iPhone confirmation after deployment:
   - `うん、直った`

### 2.3 Why this matters

This sequence demonstrates more than “AI fixed a bug.” It demonstrates a reusable operating property:

**A new high-authority Owner requirement can be persisted into the shared repository while autonomous work is active; the autonomous lane can later discover it from fresh state, safely preempt lower work, execute it, verify it, strengthen regression protection, and continue.**

---

## 3. VERIFIED ARCHITECTURAL COMPONENTS

The success depended on a set of repository-resident control surfaces working together.

### 3.1 GitHub HEAD = implementation reality

`WORK_MANAGER.md` explicitly defines fresh default-branch HEAD and repository contents as higher authority than stale CURRENT/chat memory.

Observed implication:

- later sessions/runs can reconstruct what was actually committed;
- stale handoff text does not force already-completed work to be repeated;
- externally injected Owner requirements become discoverable through a fresh reality read.

### 3.2 `WORK_QUEUE.md` = durable work inventory

Purpose:

- persistent list of requested work;
- priority/status/order;
- WIP state;
- VERIFY/BLOCKED/READY/IN_PROGRESS history.

This prevents the worklist from existing only inside a single model session.

### 3.3 `requirements/REQ-xxx_*.md` = durable unit specification

Material Owner requests are preserved as requirement files instead of being left only in chat.

For the verified black-screen success, the dedicated requirement recorded:

- physical symptom;
- Owner authority and P0 priority;
- diagnostic minimums;
- required acceptance;
- root-cause class;
- implementation repair;
- automated evidence;
- what must NOT be falsely claimed;
- physical verification status.

### 3.4 `CURRENT.md` = autosave/handoff, not final report

`WORK_MANAGER.md` explicitly treats CURRENT as execution checkpoint state rather than a closing ceremony.

The important design property is that CURRENT may be stale, and fresh HEAD wins. The next boot must repair forward from repository reality instead of trusting CURRENT blindly.

### 3.5 `WORK_MANAGER.md` = queue controller and continuous-work contract

Verified rules include:

- mandatory fresh boot;
- WIP limit = 1 IN_PROGRESS requirement;
- Owner latest direct request can preempt lower work;
- lower work must be safely checkpointed/suspended/advanced before switching;
- active requirement must be read before implementation;
- after a completed unit: validate → commit → fresh-fetch → synchronize → select again → continue;
- a commit, CURRENT update, Pages success, requirement completion or reporting point is **not** a stop condition;
- blockers do not automatically stop unrelated safe work;
- VERIFY awaiting physical/subjective Owner confirmation does not block all further work;
- Scheduled Task is intended to be a short loader, with detailed requirements living in repository files.

### 3.6 `EXECUTION_SELF_AUDIT_GUARD.md` = anti-degradation layer

The self-audit guard provides three gates:

- **GATE A — BOOT REALITY AUDIT**
  - fresh metadata/default branch/HEAD/commits/queue/current/Owner authority/active requirement/workflow state;
  - detect stale CURRENT, stale QUEUE, priority drift, untrusted VERIFY, prior premature termination.

- **GATE B — WORK-SELECTION AUDIT**
  - selected work must be highest valid authority;
  - WIP must be respected;
  - status must match repository reality;
  - do not duplicate prior implementation.

- **GATE C — CONTINUE / STOP AUDIT**
  - before reporting/stopping, ask whether any IN_PROGRESS, READY, Owner re-audit, promotable BACKLOG, known safe defect/gap, or repairable metadata work remains;
  - if any safe useful executable work remains, normal self-termination is forbidden.

It also defines execution degradation, including:

- stopping after one small unit;
- stopping immediately after REQ registration;
- stopping immediately after a commit;
- stopping merely while Pages is queued/in-progress;
- skipping newer Owner P0 because older work is already active;
- choosing P1/P2 expansion ahead of newer P0 correction;
- leaving materially stale CURRENT without external-stop explanation.

### 3.7 CI / Pages / runtime acceptance = “code exists” is not completion

The black-screen incident proved that previous structural checks were insufficient. The repair strengthened acceptance to test actual visual liveness at an iPhone-sized viewport.

REQ-034 records the important lesson:

- DOM existence is not proof of visible presentation;
- visible world/player geometry and viewport intersection matter;
- full-screen control planes must not become opaque;
- actual map paint needs detection;
- headless success is still not physical-iPhone confirmation.

---

## 4. VERIFIED EXECUTION LOOP

The operational loop preserved by `WORK_MANAGER.md` is:

```text
BOOT
→ GATE A self-audit
→ repair stale/violating state
→ recover / preempt / select correct work
→ GATE B selection audit
→ implement
→ verify
→ checkpoint commit
→ fresh verify
→ synchronize queue/CURRENT as appropriate
→ select next valid work
→ implement again
→ repeat
```

Critical semantic change from earlier short-lived runs:

```text
OLD FAILURE SHAPE
one task succeeds
→ report
→ stop

VERIFIED SUCCESS SHAPE
one task succeeds
→ checkpoint
→ fresh reality check
→ select next safe work
→ continue
```

**Completion of one unit is an event inside the loop, not the loop termination condition.**

---

## 5. VERIFIED BOOT / RECOVERY PROCEDURE

Every execution should obtain fresh reality in this order before trusting older state:

1. repository metadata;
2. actual default branch;
3. latest HEAD;
4. `AUTONOMOUS_DEV_DIRECTIVE.md`;
5. `EXECUTION_SELF_AUDIT_GUARD.md`;
6. `WORK_MANAGER.md`;
7. `WORK_QUEUE.md`;
8. `CURRENT.md`;
9. active or Owner-mandated re-audit requirement;
10. files required by CURRENT/directive;
11. recent commits/diff/workflow/Pages state as needed.

Then:

- compare CURRENT checkpoint to fresh HEAD;
- if HEAD is ahead, inspect intervening commits/diffs;
- reconstruct repository reality;
- repair stale queue/current metadata forward;
- do not redo already committed work merely because handoff state is old.

This is the restartability mechanism. The method does **not** require an immortal model session to preserve the work.

---

## 6. VERIFIED WORK-SELECTION / PREEMPTION PROCEDURE

Normal case:

1. recover the existing IN_PROGRESS item;
2. read its requirement fully;
3. inspect implementation reality;
4. continue it if it remains highest valid authority.

Owner P0 hot-insert case:

1. persist the materially distinct Owner request as a dedicated requirement;
2. give it correct P0/direct-Owner authority metadata;
3. make the request discoverable through repository work state;
4. on next fresh selection/reality audit, compare active work with latest Owner authority;
5. safely checkpoint/suspend/advance lower-priority work;
6. respect WIP=1;
7. activate the Owner P0;
8. implement and verify it;
9. keep physical verification pending when automation cannot legitimately prove physical behavior;
10. continue the normal work loop after the P0 reaches a valid checkpoint/state.

The verified incident demonstrates that this pattern worked for REQ-033 → REQ-034.

---

## 7. VERIFIED ERROR / BLOCKER BEHAVIOR

The control rules do not treat one blocked requirement as automatic project-wide termination.

For a blocker:

1. record the exact blocker;
2. preserve repository in a safe/playable state;
3. mark the requirement BLOCKED when appropriate;
4. synchronize queue/current;
5. select the next safe valid work item;
6. continue if independent useful work exists.

The self-audit guard also requires repair-forward behavior instead of concealing mistakes or deleting history.

The black-screen repair is also evidence that a failed/insufficient test should improve the verification system, not merely lead to a patch.

---

## 8. WHAT THE SCHEDULER DID AND DID NOT PROVE

### Verified

- GitHub commit history shows sustained autonomous implementation activity across many separate units over a much longer period than the earlier few-minute runs.
- The method did not voluntarily stop after each REQ/commit/checkpoint during this successful period.
- Repository persistence made continued/resumed work possible.

### NOT verified

Do **not** record any of the following as established fact without separate evidence:

- that one specific scheduler invocation ran continuously from 09:30 onward;
- that the platform guarantees unlimited or endless single-session execution;
- that 25 minutes is or is not a universal platform execution limit in every environment;
- exact scheduler internal `last_run_time` from prior attempted reads, because those reads did not return usable evidence;
- that overlapping future scheduler invocations are automatically serialized by the platform.

The safe reusable claim is narrower:

**The repository-driven loop successfully continued much longer than the earlier short-stop behavior, and its persistent state makes restart/resume possible even when an execution environment eventually stops.**

---

## 9. HISTORICAL PROMPT PRESERVATION STATUS

### 9.1 Exact historical Scheduled Task body

`NOT RECOVERED AS BYTE-EXACT HISTORICAL TEXT IN THIS PRESERVATION PASS.`

This must remain explicit. Do not later claim that a reconstructed loader below is the exact historical body unless the original prompt is independently recovered and matched.

### 9.2 Why the method is still recoverable

The detailed behavior is not dependent on a long Scheduled Task prompt because the repository now contains the durable execution contract:

- `AUTONOMOUS_DEV_DIRECTIVE.md`
- `EXECUTION_SELF_AUDIT_GUARD.md`
- `WORK_MANAGER.md`
- `WORK_QUEUE.md`
- `CURRENT.md`
- active `requirements/REQ-xxx_*.md`

`WORK_MANAGER.md` explicitly says the Scheduled Task prompt should remain a short loader and detailed Owner requirements should live in requirement files.

---

## 10. RECONSTRUCTED REUSABLE LOADER — NOT CLAIMED AS HISTORICAL VERBATIM

The following prompt is a reconstruction from the **verified current repository rules**. It is saved so that future AI sessions do not lose the operational recipe. It must be labeled RECONSTRUCTED when reused.

```text
LUKE QUEST — PERSISTENT AUTONOMOUS WORK LOOP LOADER
MODE: CONTINUOUS / HEAD_FIRST / QUEUE_CONTROLLED / SELF_AUDIT_GUARDED
REPOSITORY: nisiyasu/-luke-quest

Freshly obtain the repository metadata, actual default branch, latest HEAD and recent repository reality. Do not trust stale chat memory over fresh repository state.

Load and apply, in authority order where applicable:
- AUTONOMOUS_DEV_DIRECTIVE.md
- EXECUTION_SELF_AUDIT_GUARD.md
- WORK_MANAGER.md
- WORK_QUEUE.md
- CURRENT.md
- the active or Owner-mandated re-audit requirements/REQ-xxx_*.md
- relevant implementation/test/workflow/Pages evidence

Run EXECUTION_SELF_AUDIT_GUARD GATE A before selecting work. Repair stale CURRENT/QUEUE, priority drift, omitted Owner re-audit, or prior premature termination from fresh HEAD reality.

Respect WIP_LIMIT=1. Recover current IN_PROGRESS work unless newer direct Owner authority/P0/re-audit preempts it. If preempted, safely checkpoint/suspend/advance the lower work before switching.

Before implementation run GATE B. Implement the highest valid current authority, verify it, checkpoint it, fresh-fetch reality, synchronize state where needed, and then select the next safe useful work.

Do not self-terminate merely because one NEXT_ACTION, one REQ, one commit, one CURRENT update, one Pages success, one visible improvement, or one convenient checkpoint completed.

Before any normal report/handoff/self-selected stop run GATE C. If any safe useful executable work remains, continue. External tool/context/system termination may interrupt the run; on the next boot recover from fresh HEAD and continue without redoing committed work.

Do not claim physical-iPhone PASS unless Owner physically confirms it. Do not claim DONE merely because code exists.
```

This loader intentionally delegates the detailed rules to repository-resident canonical files, reducing prompt drift and making the method portable.

---

## 11. MINIMUM PORTABLE PATTERN EXTRACTED FROM THE VERIFIED CASE

A future project may call this pattern:

**Persistent Autonomous Work Loop**

Minimum proven structural ingredients:

1. **Fresh Reality / SSOT**
   - authoritative repository or equivalent durable system state.

2. **Durable Work Queue**
   - priority, state, WIP and inventory outside a transient model session.

3. **Durable Requirement Units**
   - sufficiently detailed acceptance/authority/context for each material request.

4. **Checkpoint/Handoff State**
   - useful autosave, but subordinate to fresh implementation reality.

5. **Explicit Authority Order**
   - especially latest direct Owner priority vs older generic work.

6. **WIP Control**
   - prevent uncontrolled scattering across many partial tasks.

7. **Self-Audit Gates**
   - boot reality, work selection, continue/stop.

8. **Continue Gate**
   - success of one unit is not a stop condition while safe work remains.

9. **Repair Forward / Restartability**
   - external stop is survivable because the next run reconstructs from durable state.

10. **Real Acceptance Evidence**
    - tests/public runtime/physical checks appropriate to what is actually being claimed.

11. **Owner Hot-Insert Path**
    - a durable high-priority Owner request can be inserted into shared state and discovered on a later fresh selection pass.

These are extracted from the successful LUKE QUEST implementation. Their transfer to another project still requires adaptation and testing in that project.

---

## 12. FAILURE MODES THIS PRESERVATION MUST PREVENT

Future AI must not reduce this history to vague statements such as:

- “there was once a successful autonomous run”;
- “a scheduled task continued development somehow”;
- “details of the prompt are unknown”;
- “it probably used a 25-minute session”;
- “the black screen was fixed by cache busting”;
- “CI passing automatically proved the iPhone was fixed.”

Instead, use the exact control files, requirement, commit chain, Pages evidence and Owner physical confirmation recorded here.

---

## 13. RETURN POINT — FUTURE OWNER DECISION LANE CONCEPT (NOT VERIFIED)

The following is intentionally quarantined from the verified method.

Owner has proposed a future extension for stricter projects such as BTC:

- detect when work reaches an actually undecided matter;
- verify that it is not already decided in canonical sources;
- determine whether AI is authorized to decide it;
- if Owner authority is required, persist a dedicated Owner-decision request;
- block only the affected work where possible;
- continue other independent safe work;
- surface pending Owner decisions when the Owner later interacts with the main chat;
- present context, choices, pros/cons and AI recommendation;
- after Owner decision, persist the decision and resume work.

STATUS OF THIS SECTION:

`CONCEPT / OWNER REQUIREMENT / RETURN POINT / NOT YET VALIDATED`

Do not claim this behavior is already implemented or proven by the LUKE QUEST success case. Design, test and validation must happen separately after this verified-success preservation is complete.

---

## 14. CANONICAL EVIDENCE POINTERS

Primary live operational files:

- `AUTONOMOUS_DEV_DIRECTIVE.md`
- `EXECUTION_SELF_AUDIT_GUARD.md`
- `WORK_MANAGER.md`
- `WORK_QUEUE.md`
- `CURRENT.md`
- `requirements/REQ-034_IPHONE_BLACK_WORLD_SCREEN.md`
- `.github/workflows/pages.yml`
- `addons/zzzz-iphone-fullscreen-world-ui.js`

Critical success commits:

- Owner P0 registration: `d3b46cdb28998ddbc685ad1dbd40728dbe494fbe`
- prior work safe close: `0b0b368263dfd6b42e4f074d989bf0e7f1086f04`
- P0 activation: `7fc830671d35208ff0007e6144a4b486944cb3a6`
- queue preemption: `2711237f6d382b56a0c0b09a6968e122a9404a02`
- world visibility repair: `5d010f33f73427b61d8892de01b199a2feaef5ee`
- visual-liveness CI gate: `e9cb5bd747370e4fe911afbc3cfb7e7de89b5611`
- paint-aware gate repair: `0d59369c20fd242e3fd0f48cd833386e8b18af55`
- verified Pages run recorded in REQ-034: `34006670133`

Physical public result:

- Owner confirmation after deployment: `うん、直った`

---

## 15. PRESERVATION RULE

This document is a historical/reusable-method record. Future architectural experimentation must not silently rewrite VERIFIED facts into stronger claims.

When new capabilities are proposed:

- label them CONCEPT / TEST / VERIFIED separately;
- preserve the evidence boundary;
- append new successful evidence only after actual validation;
- never erase the distinction between a desired mechanism and an observed one.
