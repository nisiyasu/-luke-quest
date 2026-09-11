# LUKE QUEST — AUTONOMOUS CONTINUOUS DEVELOPMENT BOOT v4.2 MODERN-3D

BOOT_VERSION: V4.2 MODERN-3D FINAL
ROLE: SCHEDULED_TASK_CANONICAL_LOADER
TARGET_REPOSITORY: nisiyasu/-luke-quest
ACTIVE_PROGRAM: LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2
PARENT_ISSUE: #12
FIRST_STAGE_ISSUE: #13
STAGE_ISSUES: #13..#25
MODE: HEAD_FIRST / ISSUE_CONTROLLED / CONTINUOUS_EXECUTION / SELF_AUDIT_GUARDED / NO_SELF_TERMINATION

This file is the canonical long-form execution contract for the LUKE QUEST Scheduled Task while the Modern 3D Visual Prototype program is active.
It preserves the v4.1 continuous-development execution skeleton and replaces only the work-selection authority needed to execute the Owner-approved M00–M12 program.
The Scheduled Task control-plane prompt remains a loader and must load this file fresh from the actual default branch every run.

The current Owner authorization is to execute the registered Modern 3D program through Scheduled Task runs. Registration and execution were intentionally separate; this v4.2 activation is the execution authorization. Issue creation alone was not execution, but future Scheduled runs under this boot are authorized to begin at M00 and continue through the M00–M12 gates.

## 0. REMOTE DESKTOP COMMANDER

Remote Desktop Commander is prohibited unless the Owner explicitly authorizes RDC in that execution session.
Past authorization, connection state, efficiency, convenience, or prior usage do not authorize RDC.
GitHub connector / GitHub API are allowed.

Do not silently substitute RDC for a missing browser, local shell, local filesystem, renderer, or asset-production capability.
If a capability is unavailable without RDC, record the exact limitation in M00 and continue all safe work that does not require it.

## 1. BOOT CONTRACT

At runtime, perform these four stages in order and do not collapse them into a verbal claim.

### LOADED

Fresh-fetch repository metadata, resolve the actual default branch, and fetch this entire file from that default branch through the final EOF marker.

LOADED is valid only if:
- path = `SCHEDULED_AUTONOMOUS_BOOT_MODERN_3D_V4_2.md`
- BOOT_VERSION = `V4.2 MODERN-3D FINAL`
- ACTIVE_PROGRAM = `LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2`
- PARENT_ISSUE = `#12`
- physical tail contains `=== EOF:LUKE-QUEST-SCHEDULED-BOOT-MODERN-3D-V4.2 ===`

A partial read, remembered copy, old v4.1 content, or missing EOF is not LOADED.

### APPLIED

Treat this entire file as execution authority for the Scheduled Task and then fresh-load/apply all of the following before selecting implementation work:

Global execution and safety authority:
- `AUTONOMOUS_DEV_DIRECTIVE.md`
- `EXECUTION_SELF_AUDIT_GUARD.md`
- `WORK_MANAGER.md`
- `WORK_QUEUE.md`
- `CURRENT.md`

Modern 3D program authority:
- Parent Issue `#12` entire current body
- Parent Issue `#12` relevant current comments, if any
- `experiment/gold-vertical-slice:docs/modern-3d/LUKE_QUEST_MODERN_3D_EXECUTION_PLAN_v2.md` through physical EOF / complete file
- `experiment/gold-vertical-slice:docs/modern-3d/README.md`
- `experiment/gold-vertical-slice:docs/modern-3d/ISSUE_REGISTRATION_STATUS.md`
- `experiment/gold-vertical-slice:docs/modern-3d/ISSUE_CREATION_CHECKLIST.md`
- `experiment/gold-vertical-slice:docs/modern-3d/ISSUE_WORK_LOG_TEMPLATE.md`
- visual reference contract `assets/reference/owner_2026-09-11_ps1_visual_target/README.md`
- `MINIMUM_QUALITY_LINE.png` repository identity / availability
- `TARGET_PS1_FINAL.png` repository identity / availability
- current M00–M12 stage Issue entire body
- current stage Issue comments containing prior work records
- dependency stage Issue state only when required to prove the current stage is eligible
- relevant implementation files, assets, manifests, workflows, Actions, artifacts, screenshots, Pages/public state required by the current stage

Do not use chat memory as the authority for current state.
Do not reread all 13 stage Issues or all repository history on every run when the parent Issue and current stage Issue are enough.

The normal restart path is:

Parent Issue #12
-> current stage Issue
-> current stage work-log comments
-> only the code/assets/evidence needed by that stage
-> execute

### TRIGGERED

Immediately execute `EXECUTION_SELF_AUDIT_GUARD.md` GATE A and proceed into actual Modern 3D program work.

TRIGGERED is not satisfied by:
- summarizing the repository
- listing Issue numbers
- saying M00 is next
- updating metadata only
- describing what Three.js could do
- writing another planning document when the current stage already has executable work

Unless a valid hard stop exists, at least one executable implementation / verification / repair action must be issued after the boot audit.

For the first v4.2 execution, the expected executable program entry is M00 / Issue #13 unless fresh Issue evidence proves M00 has already materially started or advanced.

### VERIFIED

The boot is VERIFIED only when all of the following are true:
- LOADED passed
- APPLIED passed
- GATE A actually ran
- Parent Issue #12 was fresh-read
- the current stage Issue was selected from fresh Issue reality
- stage dependencies were checked as needed
- current implementation branch/reality was resolved fresh
- at least one executable action was triggered, unless a valid stop condition prevented all safe work
- no fake claim of external/system stop was made

When a material stage work record is next written, record the boot state truthfully in that stage Issue work log, for example:
`SCHEDULED_BOOT_V4_2_STATUS: LOADED_APPLIED_TRIGGERED_VERIFIED`

Do not create a metadata-only commit or Issue comment solely to write this field.

## 2. DEFAULT BRANCH VS GOLD VS PROTOTYPE DEVELOPMENT BRANCH

Always distinguish three possible realities:

- DEFAULT_BRANCH_HEAD = production/stable repository baseline reality
- GOLD_BRANCH_HEAD = `experiment/gold-vertical-slice` reference / source baseline for this prototype program
- PROTOTYPE_BRANCH_HEAD = current isolated Modern 3D implementation reality after M00 creates or adopts the approved isolated branch

Resolve all applicable branches fresh. Do not guess any HEAD.

Before the prototype branch exists, M00 uses fresh Gold/main reality to establish the isolation point.
After the prototype branch exists, crash recovery compares the most recent stage work-log checkpoint against fresh PROTOTYPE_BRANCH_HEAD.

Do not treat default branch HEAD as the implementation head of the prototype.
Do not treat Gold HEAD as the implementation head after an isolated prototype branch has become active.
Do not directly overwrite Gold or main as a shortcut.

The canonical execution plan proposes `prototypes/modern-3d/` and an isolated branch/work location. M00 must record the actual chosen implementation branch/path and its BASE_SHA before implementation proceeds.

## 3. AUTHORITY ORDER

Use this order when sources conflict during this Scheduled Modern 3D program:

1. fresh repository metadata and actual branch/ref reality
2. Owner instruction explicitly present in this Scheduled invocation, if any
3. this `SCHEDULED_AUTONOMOUS_BOOT_MODERN_3D_V4_2.md`
4. Parent Issue #12 current body and explicit current program state
5. canonical `LUKE_QUEST_MODERN_3D_EXECUTION_PLAN_v2.md`
6. current Mxx stage Issue current body
7. current stage work-log comments / fresh implementation evidence
8. `MINIMUM_QUALITY_LINE.png` / `TARGET_PS1_FINAL.png` and their canonical reference README
9. `AUTONOMOUS_DEV_DIRECTIVE.md`
10. `EXECUTION_SELF_AUDIT_GUARD.md`
11. `WORK_MANAGER.md`
12. `WORK_QUEUE.md`
13. `CURRENT.md`
14. older REQ/V00–V14 execution state
15. prior conversation memory

### Modern 3D program preemption rule

While Parent Issue #12 is open and the Modern 3D program is not terminally completed, cancelled by Owner, or explicitly paused by Owner, this Scheduled Task MUST execute M00–M12 instead of selecting an unrelated old READY/IN_PROGRESS requirement merely because `WORK_QUEUE.md` or `CURRENT.md` still points to the prior renderer lane.

This is a work-selection override for this Scheduled Task, not deletion of old work.
Do not erase, falsely complete, or silently rewrite older REQ/V00–V14 history just to make metadata agree.
If old queue/current metadata conflicts with this Owner-mandated program, record/repair the minimum necessary state without turning the run into a metadata migration project.

Do not invent or infer unseen latest Owner chat instructions.
Persisted Owner authority must come from repository/Issue canonical state unless the current invocation explicitly carries a newer instruction.

## 4. HEAD-FIRST AND ISSUE-FIRST RECOVERY

Recovery for this program is Issue-first for stage identity and HEAD-first for implementation reality.

At every run:
1. fresh-read Parent Issue #12
2. determine current program stage from its current state and stage Issue evidence
3. fresh-read that stage Issue and its work-log comments
4. resolve the actual implementation branch/path recorded by M00/current logs
5. fresh-fetch implementation HEAD
6. compare recorded RESULT_SHA / checkpoint with fresh implementation HEAD
7. inspect intervening commits/diff/workflows/evidence when HEAD is ahead
8. reconstruct already-completed work
9. do not repeat committed or verified work
10. continue from fresh reality

If a stage work log is stale but HEAD/evidence is ahead, implementation reality wins and the Issue log must be repaired forward at the next material checkpoint.

If a stage Issue says DONE but its required acceptance evidence is absent or contradicted by fresh reality, do not silently trust the label. Reopen/repair the stage state as permitted by the management rules and record why.

Do not scan all Issue history when the active Issue and direct dependencies establish the needed truth.

## 5. SELF-AUDIT GATES

`EXECUTION_SELF_AUDIT_GUARD.md` GATE A, GATE B, and GATE C remain mandatory and are not weakened by the M00–M12 program.

GATE A = boot reality / stale state / priority drift / previous premature termination audit.

For this program GATE A must additionally ask:
- Is the Scheduled run still executing Parent #12 M00–M12, or did it drift back to an old REQ lane?
- Is the selected current Mxx stage correct?
- Did a prior run stop after a checkpoint while that same stage still had safe executable work?
- Did a prior run advance a stage without its explicit acceptance gate?

GATE B = confirm selected work is the highest valid current authority before implementation.

For this program GATE B must confirm:
- Parent #12 remains the active Owner-mandated program
- current Mxx Issue is eligible
- predecessor conditions are satisfied
- current stage acceptance is not already proven
- selected action belongs to the current stage or an explicitly required rollback stage

GATE C = continue/stop decision before any normal report, handoff, or self-selected termination.

## 6. WORK SELECTION — M00–M12 PROGRAM

The Modern 3D stage Issues are the operational work queue for this Scheduled program:

- #13 = M00 独立プロトタイプの準備
- #14 = M01 画作りと比較契約
- #15 = M02 Three.js実行基盤
- #16 = M03 仮形状で構図と通行を検証
- #17 = M04 本制作アセット
- #18 = M05 代表画面の美術品質ゲート
- #19 = M06 地形・植生・橋の完成
- #20 = M07 水・照明・空気感
- #21 = M08 人物・移動・カメラ
- #22 = M09 全エリアとUI
- #23 = M10 iPhone最適化・配布物
- #24 = M11 最終比較・不足修正
- #25 = M12 Goldへの移植設計

Default `WIP_LIMIT = 1 stage`.

### Current stage selection

Select exactly one current stage using fresh evidence:

1. If Parent #12 explicitly names a current active stage, validate it against the stage Issue and dependencies.
2. Otherwise, if one Mxx Issue is `IN_PROGRESS`, continue it.
3. Otherwise select the lowest-numbered open Mxx whose predecessor gate is satisfied and whose acceptance gate is not already proven.
4. A later Issue being open does not make it executable when its predecessor gate is unmet.
5. A stage in VERIFY waiting only for Owner subjective/physical confirmation may permit independent technical work explicitly allowed by the plan, but Owner-only acceptance must remain PENDING.

At initial execution under v4.2, if all stage Issues remain registered/not-started, M00 / #13 is the current stage.

### Registration is not execution

The Issue set was already registered. Do not count Issue registration, plan preservation, or this boot update as M00 progress.
Actual M00 begins only when a Scheduled run performs material M00 work and records evidence.

### Stage status transitions

Use the stage Issue as the stage-state surface.

- `NOT_STARTED` -> `IN_PROGRESS` only after material stage execution actually begins.
- Stay `IN_PROGRESS` across multiple Scheduled runs as long as acceptance remains unmet and safe work remains.
- `BLOCKED` means the exact blocker is recorded, but a single blocked subtask must not stop other safe work inside the stage.
- `VERIFY` may be used for genuine Owner physical/subjective verification boundaries.
- `DONE` / Issue close is allowed only when the stage's explicit acceptance condition is supported by evidence.

One run, one commit, one screenshot, one CI PASS, or one generated asset does not automatically close a stage.

### Rollback / return behavior

Each stage Issue contains its allowed unmet-condition return path. Obey it.
Examples include:
- M05 visual failure -> M01 / M03 / M04 as evidence indicates
- M06 material/structure failure -> M04 / M01 / M03 as appropriate
- M07 terrain/material root cause -> M06 / M04
- M08 collision root cause -> M03; character asset root cause -> M04
- M10 performance root cause -> relevant M06–M09 or M02
- M11 TOP 3 gaps -> return to the responsible prior stage

Returning to an earlier stage is not failure of the program. It is the designed quality loop.
Do not advance by weakening the acceptance criterion.

### Work records

Every material Scheduled run must append its work record to the active Mxx Issue comments using the fields required by `ISSUE_WORK_LOG_TEMPLATE.md`, including as applicable:

- DOCUMENT_ID
- TASK_ID
- STATUS
- BRANCH
- BASE_SHA
- RESULT_SHA
- ACTIVE_STAGE
- COMPLETED_ACTIONS
- CHANGED_FILES
- ASSET_MANIFEST
- RUN_COMMAND
- REFERENCE_PATHS
- CAMERA_AND_REPRO_ROUTE
- EVIDENCE_PATHS
- DEVICE_BROWSER_VIEWPORT
- QUALITY_PRESET
- FUNCTIONAL_RESULT
- VISUAL_RESULT_HIGH
- VISUAL_RESULT_MOBILE
- PERFORMANCE_RESULT
- TOP_3_GAPS
- NEXT_EXACT_ACTION
- ROLLBACK_POINT
- OWNER_EXPERIENCE_PASS
- IOS_PHYSICAL_VERIFICATION

Also include actual stop reason when the run truly stops.
Do not write a comment that merely says work will be done later.

### Visual authority

`MINIMUM_QUALITY_LINE.png` is the minimum quality floor, not completion.
`TARGET_PS1_FINAL.png` is the primary final visual destination.
`CURRENT_BAD.png` is historical/before evidence only.

The comparison ladder is:
`CURRENT_BAD -> candidate -> MINIMUM_QUALITY_LINE -> TARGET_PS1_FINAL`

The program must not regress to treating early PlayStation quality as the upper bound.
The Owner explicitly raised the target beyond that earlier assumption.

## 7. CONTINUOUS EXECUTION LOOP

Repeat while the execution environment allows safe useful work:

fresh Parent #12
-> resolve current Mxx stage
-> fresh current stage Issue + work logs
-> fresh implementation branch/HEAD
-> fresh target files/assets/evidence
-> GATE B
-> implement / produce asset / repair / verify according to current stage
-> strongest available functional + visual + performance evidence
-> safe checkpoint commit
-> fresh implementation HEAD
-> relevant Actions / artifacts / browser screenshot / Pages check as applicable
-> append material work record to active Mxx Issue
-> update Parent #12 current stage only when stage truth materially changes
-> close stage only if explicit acceptance gate is proven
-> if stage passes, select next stage in the same run when safe budget remains
-> if stage fails, return to required earlier stage and continue repair when safe
-> GATE C
-> next executable action
-> repeat

`CURRENT.md` / `WORK_QUEUE.md` may still be read for repository-wide safety/history, but they do not replace Parent #12 + active Mxx Issue as this program's work selector.

Issue update, commit completion, CI success, screenshot creation, Pages success, one finished stage, one visible improvement, or a convenient reporting point are not stop conditions.

## 8. RUN BUDGET POLICY

The objective is not to report the first result quickly.
The objective is to use the available Scheduled Task execution budget for safe Modern 3D development progress.

If safe executable work remains after a checkpoint, do not stop to report that checkpoint. Immediately issue the next executable action.
When feasible, run multiple implement -> verify -> checkpoint -> continue cycles in the same run.

If the current stage is not yet accepted, continue improving that stage rather than switching to unrelated features.
If a stage passes early in a run and the next stage is safely executable, begin the next stage in the same run.

Do not waste time with:
- artificial waiting
- filler edits
- metadata-only churn
- repeated full-repository scans
- rewriting the plan instead of implementing it
- creating extra Issues instead of using #12–#25
- repeated visual micro-tweaks when evidence says the asset/composition/rendering method itself is the root cause

Elapsed wall-clock time alone is not a success metric, but voluntary early termination while executable stage work remains is a defect.

## 9. FINAL RESPONSE LOCK

`FINAL_RESPONSE_LOCK = ON`

Immediately before any normal final response, handoff, or self-selected stop, run GATE C against fresh Parent #12, current Mxx Issue, current implementation HEAD, and known blockers.

If `GATE_C = CONTINUE`:
- final response is invalid
- handoff-and-stop is invalid
- checkpoint report-and-stop is invalid
- stage summary-and-stop is invalid
- MUST issue the next safe executable tool / implementation action

The transition after CONTINUE is an action, not prose.

## 10. VALID STOP CONDITIONS

Self-selected stopping is allowed only when one of these is actually true:

A. external runtime / execution environment stopped the run
B. tool limit
C. context / system limit
D. unrecoverable error
E. Owner judgment is required and no independent safe work exists in the current stage or any explicitly permitted technical continuation
F. no safe useful executable work exists for the program

Do not claim A/B/C unless actually observed.
Do not blame external limits for a voluntary stop.

A missing optional capability is not automatically a whole-program stop.
M00 must record the exact capability boundary and use available safe alternatives where the plan permits them.

## 11. PREMATURE TERMINATION DETECTOR

Treat the following as execution degradation when safe work remains:

- stopping after only one small checkpoint
- stopping immediately after setting Mxx to IN_PROGRESS
- stopping immediately after a commit
- stopping immediately after an Issue work-log comment
- stopping immediately after one screenshot or artifact
- stopping merely because Actions/Pages is queued/in_progress when other safe work exists
- stopping at the first convenient boundary
- stopping while NEXT_EXACT_ACTION exists and blockers are NONE
- advancing to the next Mxx without proving the current acceptance gate
- returning to old REQ work while Parent #12 is still the active Owner-mandated program
- materially shorter behavior than prior successful continuous runs without an observed external stop

On detection:
`EXECUTION_DEGRADATION_STATUS = DETECTED`
then self-repair and continue.
After repair, record `DETECTED_REPAIRED` in the next material stage work log when appropriate.
Do not ask Owner to diagnose routine premature termination.

## 12. TEST BEFORE CLAIM / NO FAKE COMPLETION

Use the strongest relevant evidence for the current stage.

For Modern 3D this includes as applicable:
- Three.js / module / CDN version identity and actual loadability
- JavaScript syntax/module import validation
- WebGL renderer creation
- no-black-screen error handling
- vertical viewport resize behavior
- keyboard movement
- touch movement
- pointerup / pointercancel / blur / visibilitychange release behavior
- frame-rate-independent movement
- collision
- bridge boarding / height / river fall prevention
- asset load completeness
- model / texture / material manifest
- texture/color-space correctness
- character animation / grounding
- water motion / reflection approach
- actual shadow evidence
- high-quality preset evidence
- mobile practical preset evidence
- draw calls / triangles / texture usage / render scale / shadow settings when obtainable
- browser screenshot evidence
- movement/video evidence when the execution environment can actually produce it
- Actions / artifact evidence where used
- package/single-HTML verification in M10
- public/Pages inclusion only when public deployment is actually part of the verified stage work

Three.js being present is not visual completion.
PBR material being present is not visual completion.
A lit cube/plane/cone scene is not M04/M05 completion.
CI PASS is not visual quality PASS.
A screenshot generated from a mock rather than the running prototype is not runtime evidence.
A desktop/high-quality screenshot is not iPhone evidence.

### M00 mandatory execution-capability audit

M00 must establish observed facts about the Scheduled environment, not assumptions.
Check and record whether the run can actually perform or obtain evidence for:

- GitHub file/branch/Issue mutation needed by the program
- Three.js source implementation
- 3D asset creation through code/procedural methods
- access to any approved external/free/licensed asset retrieval route if needed
- browser/WebGL execution route
- runtime screenshot capture
- motion/video capture or a truthful alternative evidence route
- GitHub Actions browser execution as a fallback where appropriate
- image/texture generation capability if actually available in that Scheduled environment

If a capability is unavailable, mark it unavailable or PENDING and record the safe substitute/next route. Do not claim it worked merely because the normal interactive ChatGPT product supports it elsewhere.

### Visual completion boundaries

Every M05/M11 visual comparison must use actual running-prototype evidence.
Evaluate the plan's axes separately: composition, terrain, vegetation, bridge, water, character, light/color, overall density, UI.
Use `未達 / 同等 / 上回る / 評価不能` or the canonical equivalent and name concrete gaps.

`MINIMUM_QUALITY_LINE.png` is the floor.
Reaching it does not end the program.
Continue closing the gap toward `TARGET_PS1_FINAL.png`.

If Owner physical verification is not actually complete:
`IOS_PHYSICAL_VERIFICATION = PENDING`

If Owner subjective visual/experience approval is not actually complete:
`OWNER_EXPERIENCE_PASS = PENDING`

Do not manufacture Owner approval.

## 13. CHECKPOINT / AUTOSAVE

Commit safe completed units instead of carrying giant uncommitted work.
The active Mxx Issue work log is the primary execution autosave for this program.
The Parent Issue is the program index/current-stage surface.

Do not create a second parallel M00–M12 tracker unless the Owner explicitly requests one.
Do not turn `CURRENT.md` into a duplicate detailed Modern 3D ledger.
If repository-wide CURRENT/QUEUE require a minimal pointer or conflict repair to prevent execution drift, keep it minimal and preserve old history.

A checkpoint should make the next run recoverable from:
- Parent #12
- active Mxx Issue
- active stage comments
- implementation branch HEAD
- relevant artifact/evidence paths

Autosave is not a closing ceremony.
Synchronize execution truth when useful, but do not stop merely because state was updated.

## 14. REPORTING

Only report when execution control has actually returned or a valid stop exists.
Keep the report concise and factual:

- active Mxx stage
- actual implementation / asset work completed
- player-visible change when there is one
- latest PROTOTYPE_BRANCH_HEAD / relevant commit
- browser / visual / functional / performance evidence actually obtained
- current acceptance status
- TOP 3 gaps when relevant
- exact NEXT_EXACT_ACTION
- blocker
- actual stop reason
- OWNER_EXPERIENCE_PASS / IOS_PHYSICAL_VERIFICATION when relevant

Do not invent a runtime-limit explanation.
Do not report M00–M12 registration as new implementation progress.
Do not claim image/video evidence that was not actually produced.

## 15. EXECUTION COMMAND

After boot, execute rather than narrate.

The Scheduled Task is now authorized to execute the registered Modern 3D program.
If fresh reality still shows `REGISTERED_NOT_STARTED`, begin with Issue #13 / M00 and perform material M00 work.

One completed action means continue the current stage.
One completed stage means select and execute the next eligible stage if run budget and safety allow.
A failed quality gate means return to the designated earlier stage and repair the cause.

Do not fall back to the old DOM/CSS micro-polish lane as the main Scheduled work while Parent #12 remains active.
Do not use PlayStation 1 quality as the upper bound.
Do not stop merely because `MINIMUM_QUALITY_LINE.png` is reached.
The final visual destination is `TARGET_PS1_FINAL.png`.

If GATE C says CONTINUE, issue the next action instead of a final response.
Continue improving the LUKE QUEST Modern 3D prototype safely until the execution environment truly stops the run or another valid stop condition exists.

=== EOF:LUKE-QUEST-SCHEDULED-BOOT-MODERN-3D-V4.2 ===
