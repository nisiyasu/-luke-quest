# LUKE QUEST｜Graphiti × Session Context Hydration ハイブリッド契約 v2

STATUS: REVIEWED_POC_HYBRID
DATE: 2026-09-22
SUPERSEDES: LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v1.md

## 0. 目的

LUKE QUEST長期開発の新Chat復旧を、
GitHub durable state + Graphiti temporal memory + Session Context Hydration の3層で行う。

この契約の目的は、GitHubのCurrent/Authorityを壊さず、
Why / History / Decision lineage / superseded state を新Chatへ安全に戻すこと。

## 1. 役割分担

### GitHub

SSOT / エスエスオーティー / 唯一の正本。

最終判定対象:
- Issue / Sub-issue
- Native Dependency
- Project control state
- Decision
- Evidence
- Authority
- Task
- Contract
- Implementation state
- Write permission
- READY

Current / READY / Authority / Write scopeは、必ずGitHub Fresh Realityを優先する。

### Graphiti

Temporal Knowledge Graph / テンポラル・ナレッジグラフ / 時系列知識グラフMemory。

役割:
- Why
- History
- Decision lineage
- Rule change
- Current/Authority transitionの履歴
- Work relation changeの履歴
- 重要Failure
- Return Path
- Episode provenance

GraphitiはAuthorityではない。
Graphiti単独でCurrent / READY / Write permissionを確定しない。

### Session Context Hydration

Recovery後にFresh GitHub + Graphiti検索結果から、
新Chat自身のHot Contextとして SESSION_CONTEXT_STATE を生成する。

## 2. 復旧状態機械

RECOVERY_RESULTは3値:

- PASS
  - GitHub Fresh Reality取得成功
  - 必須Authority解決
  - Graphiti利用可能かつ整合、またはGraphitiを使わなくても必要HistoryがGitHub durable stateから回収済み

- PASS_DEGRADED_MEMORY
  - GitHub Fresh Reality取得成功
  - Authority解決
  - Graphitiがoffline / unavailable / stale / query failure
  - GitHub契約・Seed・Handoffから最低限Historyを復旧
  - Graphiti不調だけを理由にWorkを止めない

- FAIL
  - GitHub Fresh Realityを取得できない
  - Authority / Current / Write scopeを解決できない
  - Graphitiだけで補完してPASS扱いしない

## 3. Graphiti group

GROUP_ID: luke-quest-visual-rebuild-v1

Graphiti group_idはMemory namespaceでありGitHub authorityではない。

現行PoCでは、Graphitiのdatabase-per-group routingを使用しない。
単一の設定済みNeo4j databaseへ保存し、すべてのread/writeでgroup_idを明示フィルタする。

理由:
Graphiti upstreamでgroup_idとdatabase routingに関するread/write不整合が報告されている期間は、
database-per-groupに依存しない。

## 4. バージョン固定

WRAPPER_VERSION: 2.1.1
GRAPHITI_CORE: 0.30.2
NEO4J_DRIVER: 6.3.1
HTTPX: 0.28.1
PYDANTIC: 2.13.5

Graphiti / Neo4j更新は自動追従しない。
更新時は少なくとも以下を再検証:
- Seed validation
- duplicate ingest idempotency
- group isolation
- valid_at / invalid_at保持
- episode provenance
- Japanese UTF-8 output
- query / chain / health
- reset-group recovery test

## 5. Seed / Rebuild

Canonical seed:
specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json

Canonical wrapper:
specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py

Manifest:
specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v2.json

ローカルDBを失っても、GitHub上のSeed + Wrapper + Manifestから再構築できること。

SeedはMemory bootstrap/rebuild用。
SeedのSnapshotをCurrent authorityとして使わない。

## 6. Stable ID

Wrapper v2はUUID生成へ必ず以下を含める:

group_id + object kind + object key

別Project / 別groupで同じkeyが存在してもUUIDを共有しない。

v1 Wrapperの kind:key のみのUUID方式は廃止する。

## 7. 新Chat復旧順

1. Handoff packet完全性確認
2. Global Bootstrap / LUKE GitHub durable stateをFresh取得
3. Parent / Sub-issues / Native Dependencies / Projects v2をFresh取得
4. spec / plan / tasks / analyze / issue graphをFresh取得
5. GitHubだけでCurrent / READY / Authority / Write scopeを判定
6. Graphiti healthを確認
7. Graphiti利用可能ならgroup_id限定READ ONLY検索
8. GraphitiからWhy / History / Decision lineage / superseded state / Return Pathだけを取得
9. GitHubとGraphitiを照合
10. 競合はGitHub優先
11. SESSION_CONTEXT_STATEを生成
12. 通常作業へ復帰

Graphitiが使えない場合:
- Step 7〜9をSKIP
- GitHub Seed / Contract / HandoffからHistoryを補完
- PASS_DEGRADED_MEMORYを使用

## 8. Graphiti検索規則

禁止:
- Graphitiへ「今READYは何？」と聞いてWorkを選ぶ
- Graphitiへ「現在のAuthorityは？」と聞いて確定する
- GraphitiのCurrent factだけでIssueをclose/advanceする

推奨検索:
- なぜWork Graph再設計へ移ったか
- どのDecisionが旧案化されたか
- Gatewayの役割をなぜ縮小したか
- どのFailureから現在のルールが生まれたか
- どこへReturnすべきか

旧query例:
query READY ...
は廃止。

## 9. Episode provenance

Hydrationで採用するGraphiti factは、
可能な限りepisode UUID / episode name / source_description / valid_atを伴うこと。

provenanceが無いfactはHistory補助としてのみ扱い、
重要Decisionの根拠に単独使用しない。

## 10. Memory Gate

Graphitiへ保存してよい:
- Owner Decision
- Current変更の履歴
- Authority変更の履歴
- Rule変更
- Roadmap / Work Graph変更
- 重要Failure
- 重要Why
- Work間関係変更
- Return Point変更

原則保存しない:
- 雑談
- 一時ログ
- 冗長な途中推論
- 未検証仮説
- CI逐次ログ
- 中間スクリーンショットログ
- Token / PAT / password / secret
- 個人情報・機微情報
- GitHubですでに十分追跡でき、Why/History価値がない状態

## 11. Graphiti Sync Writer

MEMORY_SYNC_WRITER: CONTROL_ONLY

Worker A/B/CはGraphitiへ直接Writeしない。
WorkerはGitHub Work SSOTだけを更新する。

CONTROL / Hydration CoordinatorだけがMemory Gate対象をGraphitiへ同期する。

これにより3 WorkerのMemory同時更新競合を避ける。

## 12. Durable Memory Sync Outbox

Graphiti同期対象は先にGitHubへdurable eventとして保存する。

ROOT:
specs/001-target-image-threejs/graphiti/sync/

Event:
sync/events/<EVENT_ID>.json

Receipt:
sync/receipts/<EVENT_ID>.json

Pending判定:
event fileが存在し、同じEVENT_IDのreceipt fileが存在しない。

EVENT_IDは決定的に生成:
SHA256(
  group_id |
  source_repository |
  source_ref |
  event_kind |
  valid_at |
  content_sha256
)

Event fileはimmutable。
Receipt fileもimmutable。
同じEVENT_IDを再作成しない。

## 13. Sync順序

重要状態変更:

1. GitHub正本へWrite
2. Fresh readback
3. GitHub側状態確定
4. Memory Gate対象ならGitHub outbox event作成
5. event fresh readback
6. Graphitiへ同期
7. Graphiti readback / health / provenance確認
8. GitHubへreceipt作成

Graphiti同期失敗:
- GitHub正本をrollbackしない
- eventを削除しない
- receiptを作らない
- Pendingとして次回再試行

Graphiti先行Writeは禁止。

## 14. Idempotency

- Episode key / Event IDは決定的
- Wrapper v2 UUIDはgroup_id込みで決定的
- 同じSeed再投入で件数が増殖してはならない
- retryは同じEVENT_IDを使う
- duplicate eventは新Episodeとして扱わない

## 15. UTF-8 / Output

RDC / PowerShell標準出力だけを正本にしない。

Wrapper v2は --out <path> でUTF-8 JSONをatomic writeできること。
Hydrationで日本語を読む場合、原則としてUTF-8 JSONファイルをread_fileで取得する。

文字化けしたstdoutはMemory Evidenceとして採用しない。

## 16. SnapshotとFresh Reality

Handoff packet / Seed / GraphitiはSnapshot。

Snapshot内の:
- CURRENT
- READY
- dependency
- claim
- Lease
- Worker status
- Project field

は必ず observed_at を持つSnapshotとして扱う。

新ChatはSnapshotをそのままCurrentへ昇格しない。

## 17. Conflict resolution

GraphitiとGitHubが競合した場合:

Current / READY / Authority / Write scope:
  GitHub wins.

Why / History:
  両方を保持し、Graphitiが古ければSUPERSEDEDとして扱う。

Graphitiが新しすぎてGitHubに根拠が無い:
  UNVERIFIED_MEMORYとして扱い、自動採用しない。

必要ならFresh GitHub確定後にCorrection Eventをoutboxへ追加する。

## 18. SESSION_CONTEXT_STATE

必須:
- PURPOSE
- ORIGIN
- WHY_NOW
- HISTORY_CHAIN
- DECISIONS
- CURRENT
- NEXT
- AUTHORITY
- DO_NOT
- OPEN_HOLES
- RETURN_PATH
- DURABLE_POINTERS
- GRAPHITI_CONTEXT

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

## 19. 完全性条件

Handoff fileはSTART markerとEND markerをそれぞれ1回だけ持つ。
途中に旧END markerを残さない。

Manifestで少なくとも:
- Contract SHA256
- Seed SHA256
- Wrapper SHA256
- version pins
を記録する。

## 20. 安全条件

- Graphitiを第二SSOTにしない
- Graphiti不通だけでGitHub Recoveryを止めない
- GitHub Recovery不能ならGraphitiだけでPASSしない
- GraphitiからIssueを自動closeしない
- GraphitiからDependencyを自動変更しない
- GraphitiからWrite authorityを決めない
- SecretをGraphitiへ保存しない
- Seed/HandoffをCurrent authorityにしない
- Memory sync failureをimplementation failureと混同しない

END_OF_DOCUMENT: LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v2
