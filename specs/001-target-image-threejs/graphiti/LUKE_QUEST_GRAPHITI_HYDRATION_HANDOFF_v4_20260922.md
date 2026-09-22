LUKE_QUEST_GRAPHITI_HYDRATION_HANDOFF_V4_BEGIN

PACKET_ID: LQ-GRAPHITI-HYDRATION-HANDOFF-V4-20260922
STATUS: REVIEWED_HANDOFF_CANDIDATE
DATE: 2026-09-22
RECOVERY_MODE_DEFAULT: READ_ONLY
RECOVERY_PASS_DOES_NOT_AUTHORIZE_WRITE: YES

GITHUB_ROLE: SSOT
GRAPHITI_ROLE: SIDE_CAR_MEMORY_ONLY
GRAPHITI_GROUP_ID: luke-quest-visual-rebuild-v1

SPEC_BRANCH: spec/target-image-to-threejs-20260921
MEMORY_SYNC_BRANCH: memory/luke-visual-rebuild-graphiti

GRAPHITI_CONTRACT: specs/001-target-image-threejs/graphiti/LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v3.md
GRAPHITI_SEED: specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json
GRAPHITI_WRAPPER: specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py
GRAPHITI_MANIFEST: specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v3.json
GRAPHITI_VERIFIER: specs/001-target-image-threejs/graphiti/verify_graphiti_hydration_bundle_v1.py

# 0. Packet Rule

このPacketはSnapshot。
Current / READY / Authority / Write scopeの正本ではない。

新Chatは必ずGitHub Fresh Realityを取得し、
Snapshotと異なる場合はFresh GitHubを採用する。

# 1. 新Chat Recovery

Ownerがこのファイルを添付し「続き」と言った場合:

1. START/END markerが各1回だけ存在することを確認
2. Global Bootstrap nisiyasu/daredemo-app#15 Fresh取得
3. nisiyasu/-luke-quest repository metadata/default branch Fresh取得
4. Parent #101 / Sub-issues / Native Dependencies Fresh取得
5. Projects v2のFresh取得を試みる
6. Projects v2だけ失敗なら NON_FATAL_MANAGEMENT_VIEW_GAP として継続
7. SPEC_BRANCHのRequired Files Fresh取得
8. GitHubだけでCurrent / READY / Authority / Write scope解決
9. MEMORY_SYNC_BRANCHを読める場合、pending event数を取得
10. Graphiti health確認
11. Graphiti利用可能ならWhy / History / Decision lineage / superseded stateだけREAD ONLY取得
12. GitHubとGraphiti照合
13. SESSION_CONTEXT_STATE生成
14. 通常作業へ復帰

Recovery中はREAD ONLY。
Ownerへ過去説明を要求しない。

# 2. Recovery Result

PASS:
- GitHub Fresh Reality取得成功
- Current / READY / Authority / Write scope解決
- Graphiti利用可能、またはGitHub durable historyで十分復旧

PASS_DEGRADED_MEMORY:
- GitHub Fresh Reality取得成功
- Graphiti offline / unavailable / stale / query failure
- Contract / Seed / PacketからHistory fallback
- Graphiti不調だけではWorkを止めない

FAIL:
- GitHub Fresh Reality取得不能
- Current / Authority / Write scope解決不能
- GraphitiだけでPASS扱いしない

Projects v2だけの取得失敗:
- NON_FATAL_MANAGEMENT_VIEW_GAP
- FAILにしない

# 3. Purpose

LUKE QUESTをOwner承認見本画像から、
iPhoneでプレイ可能な高精細3Dゲーム画面へ再構築する。

旧視覚実装を延命改修せず、
Whiteboxで構図を先に合わせ、
証拠付きGateで前進する。

# 4. History Snapshot

SNAPSHOT_OBSERVED_AT: 2026-09-22T22:23:49+09:00

旧視覚実装の構図不一致
→ 継ぎ足し改修をやめる
→ Spec Kitで再構築
→ Parent #101 / Sub-issues #102〜#116 / 114 Tasks
→ Worker A/B/C READY Pull方式
→ Gatewayを安全な書込み口へ限定
→ Work Graphが過剰に直列化されREADYが枯れる問題を発見
→ 一時的な一本道修復案を廃止
→ READY Leaf並列Work Graph再設計へ

この履歴はSnapshot。
CurrentはFresh GitHubで決める。

# 5. Current Design Snapshot

- GitHub Issues = Work SSOT
- Sub-issues = 縦分解
- Native Issue Dependencies = 本当に必要な横依存のみ
- Projects v2 = 管理表示。第二SSOTではない
- Worker A/B/C = 固定scene担当ではない
- WorkerはREADY Leaf IssueをPull
- READY = OPEN + blocked_by 0 + 有効claimなし
- 別scene間は必要な前提がない限り相互依存させない
- Gateway = Lease / fencing / receiptによる安全な書込み口
- GatewayはWork Router / Current authorityではない
- G1 Whitebox構図PASS前にmodel/material/light/decorへ進まない
- Ownerをdefect detectorにしない

# 6. Current Candidate

Snapshot上:
READY Leaf並列Work Graph再設計

Fresh確認対象:
- #101〜#116の粒度
- tasks.mdの[P]並列Task
- Native Dependencies
- Gate/Phase親Issueと実行Leaf Issueの分離
- Worker Prompt
- READY候補数

目的:
依存を別の一本道へ付け替えることではない。

本当に必要なDependencyだけ残し、
並列可能TaskをLeaf IssueとしてREADYへ露出し、
3 Workerが独立PullできるWork Graphへする。

# 7. Graphiti Role

Graphiti / グラフィティ / 時系列知識グラフMemoryは:
- Why
- History
- Decision lineage
- superseded state
- Rule change
- Important failure
- Return Path
を補う。

Graphitiは:
- Current authorityではない
- READY判定者ではない
- Write permission判定者ではない

禁止Query:
- 今READYは何？
- 今のAuthorityは何？
- どのIssueをcloseする？

推奨Query:
- なぜWork Graph再設計へ移った？
- どのDecisionが旧案化された？
- Gatewayの役割をなぜ縮小した？
- どのFailureから現在Ruleが生まれた？

# 8. Graphiti Unavailable

Graphitiが使えなくてもGitHub Recoveryを継続する。

GRAPHITI_STATUS: UNAVAILABLE
MEMORY_CONTEXT_SOURCE: GITHUB_SEED_FALLBACK
RECOVERY_RESULT: PASS_DEGRADED_MEMORY

Graphiti復旧待ちでOwnerを止めない。

# 9. Graphiti Local PoC

LOCAL_ROOT:
C:\graphiti-poc

LOCAL_WRAPPER_V2:
C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper_v2.py

VERSION_PIN:
- graphiti-core 0.30.2
- neo4j 6.3.1
- httpx 0.28.1
- pydantic 2.13.5

Health:
C:\graphiti-poc\.venv\Scripts\python.exe C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper_v2.py health luke-quest-visual-rebuild-v1 --out C:\Temp\lq_graphiti_health.json

History chain:
C:\graphiti-poc\.venv\Scripts\python.exe C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper_v2.py chain luke-quest-visual-rebuild-v1 --out C:\Temp\lq_graphiti_chain.json

UTF-8 JSONファイルをread_fileする。
文字化けしたstdoutはEvidenceとして採用しない。

# 10. Durable Memory Sync

Memory event/receiptはSPEC_BRANCHへ書かない。

MEMORY_SYNC_BRANCH:
memory/luke-visual-rebuild-graphiti

ROOT:
graphiti-sync/

Event:
graphiti-sync/events/<EVENT_ID>.json

Receipt:
graphiti-sync/receipts/<EVENT_ID>.json

Pending:
eventあり + 同一EVENT_ID receiptなし

Memory Writer:
CONTROL_ONLY

Worker A/B/CはGraphitiにもMemory branchにも直接Writeしない。

Sync順:
GitHub Work SSOT Write
→ Fresh readback
→ Memory branch Event
→ Fresh readback
→ Graphiti sync
→ Graphiti readback
→ Memory branch Receipt
→ Fresh readback

Memory branchはmainへmergeしない。
Work SSOTとして使わない。

# 11. Memory Gate

保存対象:
- Owner Decision
- Current変更の履歴
- Authority変更の履歴
- Rule変更
- Roadmap / Work Graph変更
- 重要Failure
- 重要Why
- Work relation change
- Return Point変更

保存しない:
- 雑談
- 一時ログ
- 冗長な途中推論
- 未検証仮説
- CI逐次ログ
- 中間Screenshotログ
- PAT / token / password / secret
- 不要な個人情報・機微情報

# 12. Conflict Rule

Current / READY / Authority / Write scope:
GitHub wins.

古いGraphiti Fact:
SUPERSEDED Historyとして保持可。

Graphitiだけに新情報:
UNVERIFIED_MEMORY。
自動採用禁止。

# 13. Durable Pointers

GLOBAL_BOOTSTRAP:
nisiyasu/daredemo-app#15

REPOSITORY:
nisiyasu/-luke-quest

PROJECT_V2:
https://github.com/users/nisiyasu/projects/2

PARENT:
nisiyasu/-luke-quest#101

SPEC_BRANCH:
spec/target-image-to-threejs-20260921

MEMORY_SYNC_BRANCH:
memory/luke-visual-rebuild-graphiti

SPEC_ROOT:
specs/001-target-image-threejs

OWNER_REQUIREMENTS:
specs/001-target-image-threejs/source/OWNER_REQUIREMENTS_v1.0.md

SPEC:
specs/001-target-image-threejs/spec.md

PLAN:
specs/001-target-image-threejs/plan.md

TASKS:
specs/001-target-image-threejs/tasks.md

ANALYZE:
specs/001-target-image-threejs/analyze.md

PIPELINE:
specs/001-target-image-threejs/DEVELOPMENT_PIPELINE_v1.md

ISSUE_GRAPH:
specs/001-target-image-threejs/issue-graph.json

GRAPHITI_CONTRACT:
specs/001-target-image-threejs/graphiti/LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v3.md

GRAPHITI_SEED:
specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json

GRAPHITI_WRAPPER:
specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py

GRAPHITI_MANIFEST:
specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v3.json

GRAPHITI_VERIFIER:
specs/001-target-image-threejs/graphiti/verify_graphiti_hydration_bundle_v1.py

GATEWAY_RECEIPTS:
branch gateway/request-receipts

LEASE_BRANCH:
control/lease-visual-rebuild

# 14. SESSION_CONTEXT_STATE

必須:
PURPOSE
ORIGIN
WHY_NOW
HISTORY_CHAIN
DECISIONS
CURRENT
NEXT
AUTHORITY
DO_NOT
OPEN_HOLES
RETURN_PATH
DURABLE_POINTERS

GRAPHITI_CONTEXT:
- GROUP_ID
- QUERY_TIME
- GRAPHITI_STATUS
- MEMORY_CONTEXT_SOURCE
- RECOVERED_CAUSAL_CHAIN
- SUPERSEDED_FACTS
- EPISODE_PROVENANCE
- GITHUB_CONFLICTS
- MEMORY_SYNC_PENDING_COUNT
- MANAGEMENT_VIEW_GAPS
- WRAPPER_VERSION
- GRAPHITI_CORE_VERSION

# 15. DO NOT

- Packet/Seed/GraphitiをCurrent authorityへ昇格しない
- 旧#12/#51/#52/#53を新Work Currentへ戻さない
- 村→城→ダンジョン等の不要scene依存を作らない
- Phase番号だけでDependencyを付けない
- [P]並列Taskを粗い1 Issueへ埋めたまま3 Worker運用しない
- READYが無いからblocked Issueを実行しない
- Gatewayを司令塔へ膨張させない
- G1 Whitebox PASS前に装飾で似せない
- Graphiti不通だけでRecoveryを止めない
- GitHub不通をGraphitiで代用しない
- SecretをGraphitiへ保存しない
- Memory branchをmainへmergeしない

# 16. Post-Recovery First Output

最低限:
- RECOVERY_RESULT
- Fresh現在地
- Packetとの差分
- SESSION_CONTEXT_STATE
- Graphiti status
- MANAGEMENT_VIEW_GAPS
- 次の1手

Packet全文は再掲しない。

LUKE_QUEST_GRAPHITI_HYDRATION_HANDOFF_V4_END
