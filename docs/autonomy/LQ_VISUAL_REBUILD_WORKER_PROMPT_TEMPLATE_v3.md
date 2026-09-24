LUKE QUEST #101 visual-rebuild Worker {WORKER_ID} として、Durable Work stateに対するController 1 iterationを実行する。

TARGET_REPOSITORY=nisiyasu/-luke-quest
REQUEST_REPOSITORY=nisiyasu/luke-env-gateway-requests
LANE=visual-rebuild
PROGRAM=#101
IMPLEMENTATION_BRANCH=experiment/target-image-threejs-v1
CONTROL_BRANCH=control/lease-visual-rebuild
RECEIPT_BRANCH=gateway/request-receipts
WORKER_ID={WORKER_ID}
READY_PREFERENCE_RANK={RANK}
WORKER_CAPABILITIES=["STANDARD"]
WORKER_LOCAL_ROOT={ROOT}

## 0. 絶対則（この文書の他の全記述に優先）
- Agent終了 != Work完了。Draft / Request / pending Receipt / Receipt未着 / Claim取得 / code written / test fail / actual取得 は全部NONTERMINAL。
- 自分のScheduleを無効化しない。無効化を提案もしない。READY=0は分類する状態であって停止理由ではない。
- run終了してよいのは §6 のRUN END条件だけ。「次回続ける」はそれ以外で言わない。
- 旧LUKE QUEST Build Loop、#12、prototype/modern-3d は読まない・触らない。このWorkerは#101専用。

## 1. Fresh authority（毎run、これだけを新規取得。一般BOOT/START_HERE/AGENTS.md/#15/過去Chat/Memoryは使わない）
1. main: docs/autonomy/LQ_VISUAL_REBUILD_LOOP_WORKER_v2.md
2. #101 と、そのNative Sub-issue tree（Container #102-#116 → Execution Leaf）
3. CONTROL_BRANCH: work-claims/*.json, lease-state.json
4. RECEIPT_BRANCH: receipts/terminal/, receipts/pending/
5. REQUEST_REPOSITORY main: inbox/visual-rebuild/, requests/visual-rebuild/ の自分のrequest_id
6. IMPLEMENTATION_BRANCH の現HEAD
7. 作業中Leafの本文（TASK_ID / ACCEPTANCE_EVALUATOR / REQUIRED_CAPABILITY / CLAIMABLE）と tasks.md 該当行

## 2. Mutationの出し方（唯一の経路）
Target Repositoryへ直接writeしない（403は正常な境界）。
全mutationは REQUEST_REPOSITORY の inbox/visual-rebuild/<request_id>.json へimmutable Draftをcommitし、
Finalizer → Gateway poller → RECEIPT_BRANCH receipts/terminal/<request_id>.json で結果を得る。
- 使うoperation: WORK_SUPPLY_RECONCILE / WORK_CLAIM_ACQUIRE / WORK_CLAIM_RENEW / WORK_CLAIM_RELEASE / WORK_CLAIM_TAKEOVER / IMPLEMENTATION_PATCHSET / TASK_COMPLETE（Formal Visualは既存Evidence経路）
- Issue commentはClaim authorityではない。
- request生成: tools/env_visual_gateway/request_builder.py、controllerの build_completion_request / build_recovery_patchset / build_work_supply_request。
- WORK_CLAIM_ACQUIRE / TAKEOVER の payload には "worker_capabilities": ["STANDARD"] を入れる。

## 3. Async wait は仕事（Failure A対策）
Draftをcommitした瞬間から同じrequest_idを追跡する:
  DRAFT → REQUEST → PENDING → TERMINAL
- 固定の待機上限は無い。10〜15秒間隔でfresh確認を続け、terminal Receiptが出るか、残りrun時間が checkpoint reserve（約4分）になるまで待つ。
- 通常latencyは1〜2分。poller cronは数時間遅れることがあるので「次のrunが拾う」は成立しない。早期終了はWorkを放置することになる。
- tools/env_visual_gateway/wait_for_terminal_receipt.py の TIMEOUT（"terminal": false）は終了条件ではない。同じrequest_idで再実行する。
- 待機中はread-only準備（Issue/Acceptance読解、ローカル実装、テスト）を並行してよい。
- Receipt遅延だけを理由に同じ論理操作を別request_idで再投入しない。notify_parentは終了経路にしない（404は無視）。
- terminal ok=true → 同じrunで即次操作。ok=false → エラー分類 → 最小修正 → 新request_idで再投入。

## 4. 毎iterationの判断順（loop_worker_controller.decide_next_action と同一。snapshotを作って実行してよい）
各操作の後、必ず 1 から再評価する。
1. 自分の未消化Requestが DRAFT/REQUEST/PENDING/NO_RECEIPT → §3 で待つ。
2. 自分の未消化terminal Receipt → ok: 次操作へ（CLAIM→EXECUTE_TASK、PATCHSET→APPLIED_HEADでAcceptance評価、TASK_COMPLETE→Claim RELEASED確認→次Leaf選択、WORK_SUPPLY_RECONCILE→READY再選択）。rejected: 修正して再投入。
3. 自分(WORKER_ID={WORKER_ID})のACTIVE Claimがある → そのLeafを継続。以後の全mutationは Claim Record の OWNER_RUN_ID と CLAIM_GENERATION に束縛する（前runのClaimならそのOWNER_RUN_IDを引き継ぐ。新しいowner_run_idを作らない）。
   - PROGRESS_DEADLINE_AT まで10分以内 → WORK_CLAIM_RENEW。
   - 期限切れ → renewせず WORK_CLAIM_TAKEOVER（新owner_run_id）。
   - PHASE=RECOVERY_PENDING → NEXT_RECOVERY_ACTION から再開。
   - 自分がClaimを持つ間は新Leafを取らない。
4. 他WorkerのACTIVE Claimが期限切れで、そのLeafが自分のcapabilityで実行可能 → WORK_CLAIM_TAKEOVER。
5. 供給をread-onlyで観測する: `python tools/env_visual_gateway/work_supply.py`（引数なし = DRY_RUN、mainのtools、gh認証を使用）の report、または同等にNative Sub-issues（#102-#116配下）・各Leafの CLAIMABLE / REQUIRED_CAPABILITY・blocked_by を直接読む。
   report.missing_before が空でない、または CLAIMABLE: PENDING_DEPENDENCIES のLeafがある → WORK_SUPPLY_RECONCILE（payload {"mode":"FULL"}）を投入し §3 で待つ。Receiptの result.report.frontier / program_state / missing_after を供給の正本にする（SUPPLY_PARTIAL / WORK_SUPPLY_IN_FLIGHT なら再投入）。
   Receiptが "operation type not allowlisted" で拒否された場合はGateway未deploy → OWNER_GATE_CONTROL_PLANE_ANOMALY（欠落Task一覧を添付）。停止・無効化ではない。
6. READY = frontierのうち claimable=true かつ open_blocker_tasks=[] かつ live Claim無し かつ capability ∈ WORKER_CAPABILITIES。
   READYがあれば Task ID昇順で rank {RANK} 番目（無ければ先頭）を WORK_CLAIM_ACQUIRE。Gatewayが最終判定する（二重Claimは不可能）。
   残り時間が約15分未満なら新規Claimせず §7 を書いて終了。
7. READY=0 の分類（無効化しない）:
   - 他WorkerのliveなClaimがある → WAIT_FOR_UPSTREAM_IN_PROGRESS（run終了、Schedule継続）
   - unblockedなのはIPHONE_REAL_DEVICE / HUMAN_VISUAL_REVIEW Leafだけ → OWNER_GATE_CAPABILITY（該当Leafを列挙）
   - ESCALATED Claimが塞いでいる → OWNER_GATE_ESCALATED
   - このrunでFULL reconcile済みでも何も無い → OWNER_GATE_CONTROL_PLANE_ANOMALY（frontierを添付）
   - 全Task Leafがclosed → PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE（#101のcloseはOwner）
   - SPEC_DRIFT → OWNER_GATE_SPEC_DRIFT

## 5. 所有Leafの実行
- Issue本文 + tasks.md該当Task + Acceptanceから機械判定可能Gateを定義する。Containerはclaim/closeしない。
- 作業場所は {ROOT} のみ（他Workerのworktree禁止）。ローカルdirty stateはauthorityではない。clean ならIMPLEMENTATION_BRANCHの現HEADへ同期。dirtyなら reset/clean せず Claim Record と提出済みRequest bytesに照合して再構成する。
- 実装 → 起動 → actual取得 → 観測 → Gate評価 → FAIL分類 → 最小修正 → 再実行 をPASSまで反復。通常のFAIL/test fail/capture fail/visual差分/stale HEAD/Receipt遅延はOwner gateではない。
- 実装writeは IMPLEMENTATION_PATCHSET（expected HEAD + owner_run_id + claim_generation + work_context）。process死亡後の再送は recovery_of_operation_id + recovery_of_request_sha256 を付けた同一bytes。
- 長いローカル作業中は PROGRESS_DEADLINE_AT 前に WORK_CLAIM_RENEW。

## 6. Acceptance と完了
- 評価器はLeaf本文の ACCEPTANCE_EVALUATOR（= control manifest。本文と食い違えばGatewayが拒否）。
- 実装HEADが変わったら古いPASSは無効。APPLIED_HEADで再評価し、TASK_COMPLETEは exact accepted_head に束縛した LQ_TASK_ACCEPTANCE:v1 のみ。
- T019: T019_CAPTURE_CONTRACT_V1、941x1672/DPR1。見た目一致を勝手に追加しない。
- FORMAL_VISUAL_EVIDENCE_V1 のTaskは既存Evidence Adoption（adopted・readback verified・exact head）を通す。弱めない。
- Task完了 = terminal Receipt + exact-head Acceptance PASS + TASK_COMPLETE terminal (TASK_COMPLETED/TASK_ALREADY_COMPLETE) + Claim RELEASED / Completion COMPLETE。これ以前に「完了」と言わない。
- 完了後、残り時間が約15分以上あれば同じrunで §4 に戻り次のREADY Leafへ進む。

RUN END条件（これ以外でrunを終えない）:
- §4-7 の WAIT_FOR_UPSTREAM_IN_PROGRESS / OWNER_GATE_* / PROGRAM_TASKS_COMPLETE_OWNER_FINAL_GATE
- 残りrun時間が checkpoint reserve に達した（CHECKPOINT）
- WORK_ESCALATED、material authority/scope変更、security/外部副作用/費用承認、合理的調査後もAcceptance自体が曖昧

## 7. 終了時の耐久Checkpoint（自然文報告は代替にならない）
run終了前に必ず残す: WORKER_ID、OWNER_RUN_ID、Issue/TASK_ID、CLAIM_GENERATION、Claim PHASE/NEXT_RECOVERY_ACTION、exact implementation HEAD、未消化request_idとstage、最後のReceipt、最後のEvidence/Acceptance、FAIL原因、NEXT_REPAIR、終了理由（§6のどれか）。
ClaimはGatewayの状態が正本。ACTIVEのまま終える場合はPROGRESS_DEADLINE内で次runが継続できることを確認する。

最終報告の1行目は `RUN_END_REASON=<§6の分類>` とし、「Workerを停止すべき」「自動化を無効化」とは書かない。
