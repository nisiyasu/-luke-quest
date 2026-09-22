# LUKE QUEST｜Graphiti × Session Context Hydration ハイブリッド契約 v3

STATUS: REVIEWED_HYBRID_CANDIDATE
DATE: 2026-09-22
SUPERSEDES: LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v2.md

## 0. 目的

LUKE QUEST長期開発の新Chat復旧を、
GitHub durable state + Graphiti temporal memory + Session Context Hydration の3層で行う。

正しさはGitHubで担保し、
GraphitiはWhy / History / Decision lineage / superseded stateを補う。

## 1. 権限と正本

GitHub:
SSOT / エスエスオーティー / 唯一の正本。

GitHubが最終判定する:
- Current
- READY
- Issue / Sub-issue
- Native Dependency
- Authority
- Write scope
- Decision
- Evidence
- Implementation state

GitHub Projects v2:
管理表示。
Projects v2が一時的に読めなくても、Issue / Sub-issue / Native DependencyがFresh取得できるならRecovery失敗にはしない。

Graphiti:
Temporal Knowledge Graph / テンポラル・ナレッジグラフ / 時系列知識グラフMemory。
Authorityではない。

Session Context Hydration:
Fresh GitHub + Graphiti Historyから新ChatのHot Contextを生成する。

## 2. Recovery Result

PASS:
- GitHub Fresh Reality取得成功
- Current / READY / Authority / Write scope解決
- Graphiti利用可能、またはGitHub durable historyで十分復旧

PASS_DEGRADED_MEMORY:
- GitHub Fresh Reality取得成功
- Graphiti unavailable / stale / query failure
- Contract / Seed / HandoffをHistory fallbackとして使用
- Graphiti不調だけではWorkを止めない

FAIL:
- GitHub Fresh Reality取得不能
- Current / Authority / Write scope解決不能
- Graphitiだけで補完してPASSにしない

Projects v2だけの取得失敗:
NON_FATAL_MANAGEMENT_VIEW_GAP。
Recoveryは継続してよい。

## 3. Graphiti group / database mode

GROUP_ID:
luke-quest-visual-rebuild-v1

DB_MODE:
single configured Neo4j database + explicit group_id filtering

database-per-group routingへ依存しない。

理由:
Graphiti upstreamでgroup_idをdatabase routingへ使う経路にread/write不整合が報告されている期間は、
同一DB内でgroup_idを明示フィルタする方式を採用する。

## 4. Version pin

WRAPPER_VERSION: 2.3.0
GRAPHITI_CORE: 0.30.2
NEO4J_DRIVER: 6.3.1
HTTPX: 0.28.1
PYDANTIC: 2.13.5
PYTHON: 3.12.10
UV: 0.12.15
OLLAMA: 0.34.2
EMBEDDING_MODEL: nomic-embed-text:latest
EMBEDDING_DIGEST: 0a109f422b47e3a30ba2b10eca18548e944e8a23073ee3f3e947efcf3c45e59f

更新時は互換試験必須:
- duplicate ingest
- group isolation
- valid_at / invalid_at
- episode provenance
- UTF-8
- query / chain / health
- disaster rebuild

## 5. Canonical rebuild assets

SPEC_BRANCH:
spec/target-image-to-threejs-20260921

CONTRACT:
specs/001-target-image-threejs/graphiti/LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v3.md

SEED:
specs/001-target-image-threejs/graphiti/luke_quest_visual_rebuild_seed_v2.json

WRAPPER:
specs/001-target-image-threejs/graphiti/chatgpt_graphiti_wrapper_v2.py

MANIFEST:
specs/001-target-image-threejs/graphiti/GRAPHITI_HYDRATION_MANIFEST_v3.json

BUNDLE_VERIFIER:
specs/001-target-image-threejs/graphiti/verify_graphiti_hydration_bundle_v1.py

EVENT_REPLAY:
specs/001-target-image-threejs/graphiti/replay_graphiti_sync_events_v1.py

FULL_REQUIREMENTS_LOCK:
specs/001-target-image-threejs/graphiti/requirements-full-lock-v1.txt

環境再構築:
uv venv <venv> --python 3.12
uv pip install --python <venv-python> -r requirements-full-lock-v1.txt

ローカルDBを失ってもGitHubだけから再構築可能であること。

再構築順:
1. Seed投入
2. MEMORY_SYNC_BRANCHの全Eventをvalid_at / observed_at / event_id順に再生
3. health / chain / query-events readback

Receiptの有無を理由にEventを再生対象から除外しない。
Receiptは配信確認であり、Event logは再構築元である。

## 6. Stable ID / Idempotency

UUID:
group_id + object kind + object key

Event ID:
SHA256(
  group_id |
  source_repository |
  source_ref |
  event_kind |
  valid_at |
  content_sha256
)

同じSeed再投入で件数を増殖させない。
retryは同一EVENT_IDを使う。

## 7. Durable Memory Sync Outbox

Memory同期ログはSpec branchへ書かない。

MEMORY_SYNC_BRANCH:
memory/luke-visual-rebuild-graphiti

BRANCH_ROLE:
append-only durable memory sync outbox

MERGE_TO_MAIN:
NO

ROOT:
graphiti-sync/

EVENT:
graphiti-sync/events/<EVENT_ID>.json

RECEIPT:
graphiti-sync/receipts/<EVENT_ID>.json

Pending:
eventあり + 同一EVENT_ID receiptなし

このbranchはWork SSOTではない。
Current / READY / Authority判定に使用しない。

## 8. Memory writer

MEMORY_SYNC_WRITER:
CONTROL_ONLY

Worker A/B/CはGraphitiへ直接Writeしない。
Worker A/B/CはMemory sync branchへ直接Writeしない。

Control/Hydration CoordinatorのみMemory Gate対象を同期する。

## 9. Sync順序

1. GitHub Work SSOTへWrite
2. Fresh readback
3. Memory Gate判定
4. memory branchへimmutable event作成
5. Fresh readback
6. Graphiti sync
7. Graphiti readback / provenance確認
8. memory branchへimmutable receipt作成
9. Fresh readback

失敗時:
- Work SSOTをrollbackしない
- eventを削除しない
- receiptを作らない
- Pendingとして後続runでretry

Graphiti先行Writeは禁止。

## 10. Event / Receipt

EVENT_SCHEMA:
specs/001-target-image-threejs/graphiti/GRAPHITI_SYNC_EVENT_SCHEMA_v2.json

RECEIPT_SCHEMA:
specs/001-target-image-threejs/graphiti/GRAPHITI_SYNC_RECEIPT_SCHEMA_v2.json

event / receiptはappend-only。
既存EVENT_IDを上書きしない。

## 11. Memory Gate

保存してよい:
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

## 12. 新Chat Recovery順

1. Handoff完全性確認
2. Global Bootstrap Fresh取得
3. LUKE repository metadata/default branch Fresh取得
4. Parent / Sub-issues / Native Dependencies Fresh取得
5. Projects v2 Fresh取得を試みる
6. Projects v2だけ失敗ならNON_FATAL_MANAGEMENT_VIEW_GAP
7. spec / plan / tasks / analyze / issue graph Fresh取得
8. GitHubだけでCurrent / READY / Authority / Write scope解決
9. memory sync branchのpending countをFresh取得できれば取得
10. Graphiti health
11. Graphiti利用可能ならHistory/Why/Decision lineageをREAD ONLY取得
12. GitHubとGraphiti照合
13. SESSION_CONTEXT_STATE生成
14. 通常作業へ復帰

## 13. Graphiti検索規則

Baseline causal chain:
chain command

Seed作成後のdurable changes:
events / query-events command

Hydrationはbaseline chainだけでなく、Memory branch EventとGraphiti sync eventsも確認する。

禁止:
- 「今READYは何？」
- 「今のAuthorityは何？」
- 「どのIssueをcloseする？」

Graphitiに聞く:
- なぜ現在案へ移ったか
- どのDecisionがsupersededか
- どのFailureが現在Ruleを生んだか
- Return Pointは何か

## 14. Provenance

Hydrationへ採用する重要Factは可能な限り:
- episode UUID
- episode name
- source_description
- valid_at
を伴う。

provenance無しFactは補助扱い。

## 15. UTF-8 / portability / external config

Wrapperは--outでUTF-8 JSONをatomic writeする。

Secret/configはGitHubへ保存しない。
Fresh cloneからWrapperを使う場合:
- --env-file <local-path>
または
- GRAPHITI_ENV_FILE
を使う。

env file必須:
- NEO4J_URI
- NEO4J_USER
- NEO4J_PASSWORD

optional:
- OLLAMA_BASE_URL
- EMBEDDING_URL
- EMBEDDING_MODEL

既定:
- OLLAMA_BASE_URL=http://127.0.0.1:11434
- EMBEDDING_URL=<OLLAMA_BASE_URL>/v1/embeddings
- EMBEDDING_MODEL=nomic-embed-text:latest

Seed ingest前にWrapperが:
- Ollama version
- embedding model name
- embedding digest
をbaselineと照合する。

不一致時:
- Graphiti ingestをfail closed
- GitHub RecoveryはPASS_DEGRADED_MEMORYで継続可能
- 明示re-baselineなしに別Embeddingで再構築しない

RDC/PowerShell stdoutの文字化け結果をMemory evidenceへ採用しない。

Graphiti bundleはGitでLF固定する。
別PC cloneでSHA256が改行変換により壊れないようにする。

## 16. Bundle integrity

Manifestで:
- Contract SHA256
- Seed SHA256
- Wrapper SHA256
- Handoff SHA256
- Event/Receipt Schema SHA256
- requirements lock SHA256
- verifier SHA256
を固定する。

Rebuild前にVerifier PASS必須。
Embedding rebuild前にembedding-health PASS必須。

Handoff START/END markerは各1回のみ。

## 17. Disaster rebuild test

最低限:
1. clean temporary directoryへspec branchをfresh clone/fetch
2. MEMORY_SYNC_BRANCHもfresh取得
3. Manifest integrity検証
4. external env fileを明示指定
5. Test groupへSeed投入
6. 同Seedを2回投入
7. Memory Eventを全件replay
8. replayを再実行してもcount不変確認
9. invalid_at確認
10. episode provenance確認
11. query-eventsでpost-seed Event検索確認
12. Test group cleanup

actual groupの本番復旧では:
Seed → 全Event replay が完全な再構築単位。

ローカル既存ファイルだけでPASS判定しない。

## 18. Conflict resolution

GitHub vs Graphiti:

Current / READY / Authority / Write scope:
GitHub wins。

Why / History:
Graphitiを補助採用可能。

Graphitiのみ新情報:
UNVERIFIED_MEMORY。

古いGraphiti Current:
SUPERSEDED historyとして保持可能。

## 19. SESSION_CONTEXT_STATE

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

## 20. 安全条件

- Graphitiを第二SSOTにしない
- Seed/HandoffをCurrent authorityにしない
- Projects v2障害だけでRecoveryをFAILにしない
- Graphiti不通だけでWorkを止めない
- GitHub不通をGraphitiで代用しない
- GraphitiからIssueをcloseしない
- GraphitiからDependencyを変更しない
- GraphitiからWrite authorityを決めない
- Memory sync failureをimplementation failureと混同しない
- Memory sync branchをmainへmergeしない

END_OF_DOCUMENT: LUKE_QUEST_GRAPHITI_HYDRATION_HYBRID_CONTRACT_v3
