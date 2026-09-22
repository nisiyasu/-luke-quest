# LUKE QUEST｜Graphiti × Session Context Hydration ハイブリッド契約 v1

STATUS: ADOPTED_POC_HYBRID
DATE: 2026-09-22

## 目的

LUKE QUEST長期開発の新Chat復旧を、
GitHub durable stateだけに頼る方式から、
GitHub + Graphiti + Session Context Hydration の3層へ拡張する。

## 役割分担

### GitHub
SSOT / エスエスオーティー / 唯一の正本。

正本対象:
- Issue / Sub-issue
- Dependency
- Decision
- Evidence
- Authority
- Task
- Contract
- Implementation state

Current / READY / Write authorityの最終判定はGitHub Fresh Realityを優先する。

### Graphiti
Temporal Knowledge Graph / テンポラル・ナレッジグラフ / 時系列知識グラフMemory。

保存対象:
- Why
- History
- Decision lineage
- Rule change
- Current/Authority transition
- Work relation change
- Important failure
- Return path
- Episode provenance

GraphitiはAuthorityではない。
GitHubと競合した場合、Current / READY / Authority / Write permissionはGitHubを採用する。

### Session Context Hydration
Recovery PASS後に、
Fresh GitHub + Graphiti検索結果から、
新Chat自身のHot Contextとして SESSION_CONTEXT_STATE を生成する。

## Graphiti group

GROUP_ID: luke-quest-visual-rebuild-v1

Canonical rebuild seed:
specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v1.json

Local PoC:
C:\graphiti-poc

Wrapper:
C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper.py

## 新Chat復旧順

1. Handoff packet完全性確認
2. Global Bootstrap / LUKE GitHub durable stateをFresh取得
3. #101 / #102〜#116 / Native Sub-issues / Native Dependencies / Projects v2をFresh取得
4. spec / plan / tasks / analyze / issue graphをFresh取得
5. Graphiti group luke-quest-visual-rebuild-v1 をREAD ONLY検索
6. GraphitiからWhy / History / Decision lineage / superseded state / Return Pathを取得
7. GitHubとGraphitiを照合
8. Current / READY / Authority / Write scopeに競合があればGitHub優先
9. Graphitiの誤記憶・古い状態はCurrent authorityにしない
10. Recovery PASS後にSESSION_CONTEXT_STATEを生成
11. 通常作業へ復帰

## Graphiti検索例

chain:
C:\graphiti-poc\.venv\Scripts\python.exe C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper.py chain luke-quest-visual-rebuild-v1

query:
C:\graphiti-poc\.venv\Scripts\python.exe C:\graphiti-poc\scripts\chatgpt_graphiti_wrapper.py query READY luke-quest-visual-rebuild-v1

## SESSION_CONTEXT_STATE必須項目

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
GRAPHITI_CONTEXT

GRAPHITI_CONTEXTには最低限:
- 使用group_id
- 検索日時
- 取得した重要因果
- superseded/invalidated fact
- episode provenance
- GitHubとの競合有無

を残す。

## Memory Gate

Graphitiへ保存してよいもの:
- Owner Decision
- Current変更
- Authority変更
- Rule変更
- Roadmap/Work Graph変更
- 重要Failure
- 重要Why
- Work間関係変更
- Return Point変更

原則保存しない:
- 雑談
- 一時ログ
- 冗長な途中推論
- 検証前の仮説
- 同じFactの大量重複
- CIの細かな逐次ログ
- スクリーンショット生成のたびの中間状態

## Write order

重要状態変更時は必ず:

1. GitHub正本へ永続Write
2. Fresh readback
3. GitHub側の状態確定
4. Memory Gate対象ならGraphiti episode/factへ同期
5. Graphiti同期失敗時は GitHub正本をrollbackしない
6. MEMORY_SYNC_PENDING として再同期対象にする

Graphiti先行WriteでGitHub正本を後追いさせない。

## 現在のLUKE Current

CURRENT:
READY Leaf並列Work Graph再設計

理由:
#101〜#116が粗粒度かつ過剰に直列化され、
tasks.mdの[P]並列TaskがREADY Leaf Issueとして露出していない。

NEXT:
- 全Dependencyを必要性ベースで再判定
- 不要Dependency削除
- [P]並列Taskを必要に応じLeaf Issue化
- Gate Issueを親/集約用途へ寄せる
- 3 Workerが複数READYをPullできることをFresh検証
- Worker Promptの旧WORK_GRAPH_REPAIR_GATEを更新
- その後Whitebox実装へ復帰

## 既知のsuperseded state

旧:
#102 → #113 → #114 → #115 → #103 の一本道修復案

状態:
SUPERSEDED / 旧案

理由:
Owner指摘により、依存を別の一本道へ付け替えるだけでは本質解にならず、
必要Dependencyだけ残し、並列TaskをLeaf READYへ露出する必要があると判明。

## 安全条件

- Graphitiを第二SSOTにしない
- Graphitiが古いCurrentを返しても自動適用しない
- Graphiti検索不能でもGitHub Recoveryは継続可能
- GitHub Recovery不能ならGraphitiだけでPASSしない
- Memory同期失敗を実装進行の成功条件に混ぜない
- GraphitiからIssueを自動closeしない
- GraphitiからDependencyを自動変更しない
- GraphitiからWrite authorityを決めない

END_OF_DOCUMENT: LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v1
