LUKE_QUEST_GRAPHITI_HYDRATION_HANDOFF_V3_BEGIN

PACKET_ID: LQ-GRAPHITI-HYDRATION-HANDOFF-V3-20260922
STATUS: REVIEWED_HANDOFF_CANDIDATE
DATE: 2026-09-22
RECOVERY_MODE_DEFAULT: READ_ONLY
RECOVERY_PASS_DOES_NOT_AUTHORIZE_WRITE: YES
GITHUB_ROLE: SSOT
GRAPHITI_ROLE: SIDE_CAR_MEMORY_ONLY
GRAPHITI_GROUP_ID: luke-quest-visual-rebuild-v1
GRAPHITI_CONTRACT: specs/001-target-image-threejs/graphiti/LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v2.md
GRAPHITI_SEED: specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json
GRAPHITI_WRAPPER: specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py
GRAPHITI_MANIFEST: specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v2.json

# 0. このPacketの扱い

このPacketはSnapshotでありCurrent authorityではない。
新Chatは必ずGitHub Fresh Realityを取得してからCurrent / READY / Authority / Write scopeを決める。

Packet内のCurrent・Dependency・Worker状態がFresh GitHubと違う場合、Fresh GitHubを採用する。

# 1. 新Chatの最初の実行

Ownerがこのファイルを添付して「続き」と言った場合:

1. START/END markerが各1回だけ存在することを確認
2. Global Bootstrap nisiyasu/daredemo-app#15 をFresh取得
3. repository nisiyasu/-luke-quest のmetadata/default branchをFresh取得
4. Parent #101 / Sub-issues / Native Dependencies / Projects v2をFresh取得
5. spec branch:
   spec/target-image-to-threejs-20260921
   のRequired FilesをFresh取得
6. GitHubだけでCurrent / READY / Authority / Write scopeを解決
7. Graphiti health確認
8. Graphitiが利用可能ならWhy / History / Decision lineageだけをREAD ONLY取得
9. GitHubとGraphitiを照合
10. SESSION_CONTEXT_STATEを生成
11. 通常作業へ復帰

Recovery中はREAD ONLY。
Ownerへ過去説明を要求しない。

# 2. Recovery Result

RECOVERY_RESULTは次の3値:

PASS:
  GitHub Fresh Reality取得成功。
  Authority解決済み。
  Graphiti利用可能またはGitHub durable historyで十分復旧済み。

PASS_DEGRADED_MEMORY:
  GitHub Fresh Reality取得成功。
  Graphitiがoffline/unavailable/stale/query failure。
  GitHub Contract/Seed/HandoffからHistoryを補完。
  Graphiti不調だけではWorkを止めない。

FAIL:
  GitHub Fresh Reality取得不能。
  Current / Authority / Write scopeが解決不能。
  GraphitiだけでPASS扱いしない。

# 3. 目的

LUKE QUESTをOwner承認見本画像から、
iPhoneでプレイ可能な高精細3Dゲーム画面へ再構築する。

旧視覚実装を延命改修せず、
Whiteboxで構図を先に合わせ、
証拠付きGateで前進する。

# 4. 因果履歴Snapshot

SNAPSHOT_OBSERVED_AT: 2026-09-22T22:23:49+09:00

旧視覚実装の構図不一致
→ 継ぎ足し改修をやめる
→ Spec Kitで再構築
→ Parent #101 / Sub-issues #102〜#116 / 114 Tasks
→ 3 Worker READY Pull方式
→ Gatewayを安全な書込み口へ限定
→ Work Graphが過剰に直列化されREADYが枯れる問題を発見
→ 一時的な一本道修復案を廃止
→ READY Leaf並列Work Graph再設計へ

この履歴はSnapshot。
Current判定にはFresh GitHubを使う。

# 5. 現在の設計判断Snapshot

- GitHub IssuesがWork SSOT。
- Sub-issuesは縦分解。
- Native Issue Dependenciesは本当に必要な横依存だけ。
- Projects v2は管理表示であり第二SSOTにしない。
- Worker A/B/Cは固定scene担当ではなくREADY Leaf IssueをPullするPool。
- READY = OPEN + blocked_by 0 + 有効claimなし。
- 別scene間は本当に必要な前提がない限り相互依存させない。
- GatewayはLease / fencing / receiptによる安全な書込み口。
- GatewayはWork Router / Current authorityではない。
- G1 Whitebox構図PASS前にmodel/material/light/decorへ進まない。
- Ownerをdefect detectorにしない。

# 6. 今回の最重要Current候補

Snapshot上のCurrent候補:
READY Leaf並列Work Graph再設計

Fresh復旧時に確認すること:
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

# 7. Graphitiの役割

Graphiti / グラフィティ / 時系列知識グラフMemory は:
- Why
- History
- Decision lineage
- superseded state
- Rule change
- important failure
- Return Path
を補う。

Graphitiは:
- Current authorityではない
- READY判定者ではない
- Write permission判定者ではない

禁止Query:
「今READYは何？」
「今のAuthorityは何？」

推奨Query:
「なぜWork Graph再設計へ移った？」
「どのDecisionが旧案化された？」
「Gatewayの役割をなぜ縮小した？」
「どのFailureからこのRuleが生まれた？」

# 8. Graphiti利用不能時

Graphitiが使えなくてもGitHub Recoveryを継続する。

GRAPHITI_STATUS:
  UNAVAILABLE

MEMORY_CONTEXT_SOURCE:
  GITHUB_SEED_FALLBACK

RECOVERY_RESULT:
  PASS_DEGRADED_MEMORY

Graphiti復旧を待つためにOwnerを止めない。

# 9. GraphitiローカルPoC

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

出力はstdoutではなくUTF-8 JSONファイルを優先してread_fileする。

# 10. Durable Memory Sync

Graphitiへ直接先行Writeしない。

順序:
GitHub正本Write
→ Fresh readback
→ GitHub durable sync event
→ Fresh readback
→ Graphiti sync
→ Graphiti readback
→ GitHub sync receipt

SYNC_ROOT:
specs/001-target-image-threejs/graphiti/sync/

Event:
sync/events/<EVENT_ID>.json

Receipt:
sync/receipts/<EVENT_ID>.json

Pending:
eventあり + receiptなし

Memory Writer:
CONTROL_ONLY

Worker A/B/CはGraphitiへ直接Writeしない。

# 11. Graphiti Memory Gate

保存対象:
- Owner Decision
- Current変更の履歴
- Authority変更の履歴
- Rule変更
- Roadmap/Work Graph変更
- 重要Failure
- 重要Why
- Work間関係変更
- Return Point変更

保存しない:
- 雑談
- 一時ログ
- 冗長な途中推論
- 未検証仮説
- CI逐次ログ
- 中間Screenshotログ
- PAT/password/secret
- 不要な個人情報・機微情報

# 12. Conflict Rule

Current / READY / Authority / Write scope:
GitHub wins.

Graphitiの古いFact:
SUPERSEDEDとしてHistoryに残せる。

Graphitiに新情報があるがGitHub根拠なし:
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
specs/001-target-image-threejs/graphiti/LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v2.md

GRAPHITI_SEED:
specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json

GRAPHITI_WRAPPER:
specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py

GRAPHITI_MANIFEST:
specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v2.json

GATEWAY_RECEIPTS:
branch gateway/request-receipts

LEASE_BRANCH:
control/lease-visual-rebuild

# 14. SESSION_CONTEXT_STATE

新ChatはRecovery後、最低限以下を生成:

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
- WRAPPER_VERSION
- GRAPHITI_CORE_VERSION

# 15. DO NOT

- Packet/Seed/GraphitiをCurrent authorityへ昇格しない。
- 旧#12/#51/#52/#53を新WorkのCurrent authorityへ戻さない。
- 村→城→ダンジョンのような不要なscene間Dependencyを作らない。
- Phase番号だけを理由にDependencyを付けない。
- [P]並列Taskを粗い1 Issueへ埋めたまま3 Worker運用しない。
- READYが無いからblocked Issueを勝手に実行しない。
- Gatewayを司令塔へ膨張させない。
- G1 Whitebox PASS前に装飾で似せない。
- Graphiti不通だけでRecoveryを止めない。
- GitHub不通をGraphitiで代用しない。
- SecretをGraphitiへ保存しない。

# 16. Post-Recovery最初の回答

最低限:
- RECOVERY_RESULT
- Fresh現在地
- Packetとの差分
- SESSION_CONTEXT_STATE
- Graphiti status
- 次の1手

Packet全文は再掲しない。

LUKE_QUEST_GRAPHITI_HYDRATION_HANDOFF_V3_END
