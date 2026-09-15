# LUKE QUEST PULL-BASED ORCHESTRATION v0.1
## IMPLEMENTATION PACKET

**Target Repository:** `nisiyasu/-luke-quest`  
**Implementation Domain:** Pull Pilot only  
**Pilot Branch:** `experiment/pull-orchestration-v0.1`  
**Design Authority:** FC2 + FC3  
**Design Status:** FROZEN  
**Mainline Modification:** PROHIBITED  
**Existing LUKE Router / Packet Authority:** READ ONLY  
**Implementation Objective:** Build and validate the frozen Pull-Based Orchestration Pilot without changing existing LUKE production execution.

---

# 0. ABSOLUTE RULE

このPacketは実装用である。

ただし以下は禁止する。

- Frozen Designの再設計
- Nice-to-have追加
- 現行LUKE Routerの変更
- 現行Work Packetのclose / reopen / route変更
- `prototype/modern-3d`への直接統合
- Pull Pilot成功前の本線切替
- Redis / SQS / Temporal導入
- model routing最適化
- cost routing
- UI開発
- scheduler最適化
- scope expansion

設計上の不足を発見した場合は、勝手に仕様追加せず、

`DESIGN_BLOCKER`

として停止する。

---

# 1. IMPLEMENTATION GOAL

以下の最小Pull runtimeを実装する。

```text
Scheduler
   ↓
Universal Worker
   ↓
Pull Controller
   ↓
GitHub Pilot Job Store
   ↓
READY / RUNNING Jobs
   ↓
CAS Claim
   ↓
Attempt-isolated execution
   ↓
Checkpoint
   ↓
Reconciliation
   ↓
Verification
   ↓
DONE / RETRY / BLOCKED / FAILED
```

実行可能Jobが無い場合：

```text
Router Lease
↓
Stable WORK_KEY
↓
create-if-absent
↓
Queue refill
```

---

# 2. IMPLEMENTATION PHASES

実装は以下の順序で行う。

```text
P01 Foundation
↓
P02 Job Store
↓
P03 Claim / Lease
↓
P04 Attempt Isolation
↓
P05 Effect Safety
↓
P06 Router
↓
P07 Integration
↓
P08 Universal Worker
↓
P09 Failure Tests
↓
P10 Live Pilot
```

順番を飛ばさない。

---

# 3. P01 — PILOT FOUNDATION

作成対象：

```text
/orchestration/pull/
    README.md
    PULL_CONTROLLER.md
    config.json
    schemas/
    jobs/
    control/
    tests/
```

またはFrozen Designの意味を保持する同等構造。

必要最小限にする。

## Acceptance

- Pilot filesが`experiment/pull-orchestration-v0.1`だけに存在
- 現行LUKE runtimeに影響なし
- Mainline Router untouched
- Pilotのauthority boundaryがREADMEに明記
- Frozen Design参照が明記

---

# 4. P02 — JOB STORE

GitHub Pilot Backendを実装する。

最低操作：

```text
get_job()
list_active_jobs()
create_job_if_absent()
try_claim()
renew_lease()
update_checkpoint()
complete_job()
retry_job()
block_job()
fail_job()
```

GitHub Contents / file versionを利用する。

## Required Job Fields

```text
JOB_ID
WORK_KEY
STATUS
PRIORITY
SOURCE_CONTRACT
DEPENDS_ON

CLAIMED_BY
LEASE_UNTIL
LEASE_GENERATION

ATTEMPT
ATTEMPT_ID
MAX_ATTEMPTS

BASE_SHA

CHECKPOINT
VERIFICATION

EFFECT_STATE
FAILURE_CLASS
```

## Acceptance

- stale version updateが拒否される
- Job State mutationがCAS前提
- Job IDとWORK_KEYが分離
- same WORK_KEYからduplicate Jobが生成されない

---

# 5. P03 — CLAIM / LEASE

実装：

```text
READY
↓
CAS CLAIM
↓
RUNNING
```

Claim成功後、fresh read-backしてowner確認する。

必要情報：

```text
worker_instance_id
lease_generation
lease_until
```

## Reclaim

Expired RUNNINGのみ対象。

ただし、

`EFFECT_PENDING`

が存在する場合はFC3規則へ送る。

## Acceptance

同時に複数Workerが同一JobをCLAIMした場合、

**1 Workerだけ成功すること。**

---

# 6. P04 — ATTEMPT ISOLATION

Write Jobはattemptごとに独立させる。

例：

```text
JOB:
LQ-JOB-501

ATTEMPT:
LQ-JOB-501-G3-A01

BRANCH:
job/LQ-JOB-501/g3-a01
```

Local executionの場合：

```text
/work/LQ-JOB-501-G3-A01/
```

など独立worktree / cloneを使用。

共有禁止：

- work directory
- Git index
- temp
- generated output
- mutable artifacts

## Acceptance

2 Workerを同一端末で起動してもworkspaceが混ざらない。

---

# 7. P05 — EFFECT SAFETY

FC3をそのまま実装する。

Effect Class：

```text
CLASS F
Receiver-fenceable / receiver-idempotent

CLASS N
Non-fenceable
```

## CLASS F

stable EFFECT_ID / idempotency key / expected version等によって安全なretryを許可。

## CLASS N

`EFFECT_PENDING`後にownerを失った場合、

以下を証明できない限り再実行禁止。

```text
old worker terminated
old worker cannot resume
no queued request
no in-flight request
no future path to shared target
```

証明不能：

```text
BLOCKED
```

## Absolute Rule

**「現在未発行」は再実行許可条件ではない。**

---

# 8. EFFECT RESERVATION

Effect authorityを持つcontrol state自身へCASする。

Integrationの場合：

```text
INTEGRATION_OWNER
INTEGRATION_GENERATION
INTEGRATION_EFFECT_ID
INTEGRATION_EFFECT_STATUS
```

を同一stateで管理。

禁止：

```text
generationを読む
↓
別fileへpendingを書く
↓
effect実行
```

---

# 9. P06 — ROUTER

RouterはJob executionをしない。

Router Lease取得後：

```text
Program / Requirements
↓
Current Jobs
↓
Failures
↓
Dependencies
↓
Safe Work Discovery
↓
WORK_KEY生成
↓
create-if-absent
↓
release
↓
END
```

## Stable WORK_KEY

同じsemantic workは必ず同じWORK_KEYになる。

最低材料：

```text
PROGRAM_ID
SOURCE_CONTRACT_ID
JOB_KIND
OBJECTIVE_KEY
CAUSAL_SCOPE
```

## Acceptance

RouterがJob保存直後に死亡しても、

次Routerが同じ仕事を別Jobとして生成しない。

---

# 10. P07 — INTEGRATION

Job branch上のPASSとPilot Integration PASSを分ける。

Job：

```text
READY_TO_INTEGRATE
```

になった後、

Integration Lease holderのみ統合可能。

```text
Integration Lease
↓
EFFECT_PENDING
↓
latest integration HEAD
↓
base drift確認
↓
integrate
↓
fresh verify
↓
EFFECT_RESOLVED
```

## Acceptance

- Integration同時実行なし
- BASE_SHA driftを検出
- 最新integration状態でfresh verify
- unknown effectでは次integrationを開始しない

---

# 11. P08 — UNIVERSAL WORKER

Universal Workerの処理順：

```text
START
↓
Controller fresh-read
↓
Capabilities確定
↓
Queue fresh-read
↓
Expired resumable Job?
↓
READY eligible Job?
↓
CAS Claim
↓
1 Job execute
↓
checkpoint
↓
verify
↓
final state
```

Jobなし：

```text
Router Lease attempt
↓
取得
  → Queue refill → END

取得失敗
  → NO_OP → END
```

## Rule

1 run = Execution Job最大1件。

---

# 12. UNIVERSAL WORKER ENTRY PROMPT

最終Scheduler Promptは可能な限り短くする。

概念：

```text
LUKE QUEST Pull Pilot Controllerをfresh-readせよ。

Queueから実行可能なJobを最大1件Pullし、
Frozen Pull Contractに従って処理せよ。

expired Jobは安全条件を満たす場合のみreclaimせよ。

Jobが無い場合のみRouter Leaseを試せ。

authority不明、effect不明、generation不明ならfail closedせよ。

現行LUKE Mainline / Router / Work Packet stateは変更するな。
```

実際の詳細contractはController側へ置く。

---

# 13. P09 — MANDATORY FAILURE TESTS

以下すべてを実施する。

## T01 Double Claim

同一READY Jobへ複数Worker。

Expected：

```text
1 CLAIM SUCCESS
others CLAIM LOSS
```

---

## T02 Router Duplicate

Router A：

Job create成功後に死亡。

Router B：

同じWorkを再発見。

Expected：

同じWORK_KEYから既存Jobを取得。

duplicateなし。

---

## T03 Workspace Collision

同一machine上で2 Write Jobs。

Expected：

worktree / clone / artifactsが完全分離。

---

## T04 Reclaim

Worker A死亡。

Lease expiry。

Worker B reclaim。

Expected：

新ATTEMPT_ID / 新workspace。

---

## T05 Crash After Side Effect

Effect成功。

Checkpoint前に死亡。

Expected：

External RealityからEffect発見。

二重実行なし。

---

## T06 FC3 Critical Test

```text
Worker A
↓
EFFECT_PENDING CAS成功
↓
外部送信直前pause
↓
Lease expiry
↓
Worker B recovery
↓
External Realityでは未発行
↓
quiescence proof不能
```

Expected：

```text
Worker B = BLOCKED
```

その後Worker Aをresume。

Expected：

authority loss確認後、Effect送信禁止。

**共有Effect 2回は禁止。**

---

## T07 Integration FC3

Integration `EFFECT_PENDING`後、送信直前pause。

新holder起動。

Expected：

quiescence proof不能ならBLOCKED。

---

## T08 Base Drift

Job branch PASS後にintegration HEAD変更。

Expected：

old PASSのみでintegration DONE不可。

fresh integration verification必須。

---

## T09 Scheduler Burst

iPhone Automation相当として多数Workerをほぼ同時起動。

最低：

```text
10 concurrent starts
```

可能ならさらに増加。

Expected：

- duplicate claimなし
- duplicate Job creationなし
- shared-state corruptionなし
- Router raceでduplicate workなし

---

# 14. P10 — LIVE PILOT

Synthetic test完了後のみ、

実LUKEの**bounded / reversible / isolated**な作業を1件Pilot Job化する。

条件：

- Current Mainlineを変更しない
- Existing Router READ ONLY
- Pilot branch only
- rollback可能
- Non-destructive
- Acceptanceを機械的確認可能

Live Pilot 1件成功後、

2〜3 Workerへ拡大。

その後iPhone Automation Workerを増やす。

---

# 15. SCHEDULER POLICY

Scheduler数は設計上の上限にしない。

OwnerはiPhone Shortcuts Automation等から多数起動可能。

安全性は、

```text
CAS
WORK_KEY
Lease
Generation
Attempt Isolation
Effect Safety
Integration Serialization
```

で担保する。

最初のLive Pilotでは、

```text
1 Worker
↓
2 Worker
↓
3 Worker
↓
Burst Test
↓
Owner desired schedule count
```

の順に広げる。

---

# 16. IMPLEMENTATION ACCEPTANCE GATE

Implementation Phase完了条件：

```text
P01 PASS
P02 PASS
P03 PASS
P04 PASS
P05 PASS
P06 PASS
P07 PASS
P08 PASS
P09 ALL TESTS PASS
P10 LIVE PILOT PASS
```

これ以前に、

`PULL READY`

を宣言してはならない。

---

# 17. FAIL ROUTING

## Design mismatch

Frozen Designと実装不能な矛盾を発見：

```text
DESIGN_BLOCKER
STOP
```

勝手に仕様変更しない。

## Implementation defect

設計は正しいがコードが失敗：

```text
same phase
fix
retest
```

## External limitation

GitHub API等の実際の制約により設計通り実装不能：

```text
EXTERNAL_CONSTRAINT
STOP
record evidence
```

---

# 18. EVIDENCE REQUIRED

各Phaseで最低限：

```text
commit SHA
changed files
test command / workflow
test result
failure evidence if any
exact next step
```

P09は各TestごとにPASS/FAILを記録。

P10は実際のJob lifecycle evidenceを残す。

---

# 19. DO NOT CLAIM SUCCESS FROM

以下だけではPASSにしない。

```text
file created
code written
commit exists
CI green
one worker succeeded
one screenshot exists
router created a job
claim succeeded once
```

重要なのは、

**競合・死亡・reclaim・duplicate・integration異常を含むfailure testsがPASSすること。**

---

# 20. MAINLINE CUTOVER

このPacketでは実施しない。

Live Pilotが成功しても、

Existing LUKE RouterからPull authorityへの正式切替は別Packet。

必要：

```text
Owner authorization
+
Cutover design
+
Rollback plan
+
Scheduler migration
+
Legacy Router disposition
```

---

# 21. IMPLEMENTATION STOP RULE

以下のどれかが起きたらSTOP。

```text
Frozen Designと矛盾

double destructive effect

lost Job

unrecoverable Job state

uncontrolled zombie worker

duplicate semantic Job

workspace contamination

integration overlap

authority ambiguity

Mainline mutation

Pilot isolation breach
```

---

# 22. FINAL IMPLEMENTATION TARGET

成功時：

```text
iPhone Automation
iPhone Automation
iPhone Automation
ChatGPT Scheduler
Local Worker
        ↓
   Universal Workers
        ↓
      Pull Queue
   ↙      ↓      ↘
 Job A   Job B   Job C
   ↓      ↓      ↓
Attempt-isolated branches
        ↓
Serialized Integration
        ↓
Fresh Verification
```

Schedulerは仕事を指定しない。

WorkerはQueueから仕事を取る。

Routerは必要な時だけ一時昇格。

AI sessionは使い捨て。

JobはDurable。

Workerが落ちても復旧可能。

重複が安全に証明できない外部操作は停止する。

現行LUKE本線はPilot中無傷で維持する。

---

# 23. EXECUTION ORDER

実装者は次の1件から開始する。

```text
P01 — Pull Pilot Foundation
```

P01 Acceptance完了後のみP02へ進む。

---

**END OF IMPLEMENTATION PACKET**

**DESIGN AUTHORITY:** FC2 + FC3  
**DESIGN STATUS:** FROZEN  
**NEXT ACTION:** P01 IMPLEMENTATION