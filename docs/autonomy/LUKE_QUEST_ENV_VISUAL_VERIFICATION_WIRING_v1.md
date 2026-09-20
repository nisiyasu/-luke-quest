# LUKE QUEST 環境レーン共通・視覚検証契約 配線 v1

**状態:** CUTOVER READY / 本番切替準備完了  
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`  
**Agent実行プロトコル:** `docs/autonomy/LUKE_QUEST_ENV_GATEWAY_AGENT_PROTOCOL_v1.md`

## 1. Parent配線

- Village Parent #51
- Castle Parent #52
- Dungeon Parent #53

各Parentは共通契約を、実行・証拠・Lease・Fencing・Evidence Adoptionの共通authorityとして参照する。

座標・参照対象については各Parent本文の `FIXED REFERENCE ANCHOR LOCK v1` が引き続き唯一の正本であり、共通契約やGatewayは新しい座標正本を作らない。

## 2. Child継承

各Parent配下のChild IssueはParent経由で共通契約を継承する。  
Child固有のOBJECTIVE / ACCEPTANCE / EVIDENCE REQUIREDはChild Issue自身が正本。

## 3. Scheduled Prompt

既存Scheduled Prompt本文は変更しない。

cutover後の実行経路:

Scheduled Prompt  
→ Parent Environment Issue  
→ Current Child Issue  
→ 共通契約  
→ `LUKE_QUEST_ENV_GATEWAY_AGENT_PROTOCOL_v1.md`  
→ Request Repository `nisiyasu/luke-env-gateway-requests` の `inbox/`  
→ Draft Finalizer / 下書き確定  
→ finalized request  
→ Target Repository Poller  
→ Fenced Gateway  
→ Lane Lease / Fencing  
→ implementation mutation  
→ READ ONLY Visual Evidence Capture  
→ Actions Artifact  
→ AgentによるTarget / Actual実画像比較  
→ Artifact-backed Durable Evidence publication  
→ Evidence Adoption  
→ Child close  
→ Parent Progress update  
→ next Child

Target Repositoryへのdirect writeで403が返ることはcutover後の正常なCredential Boundaryであり、Scheduled Agentは権限復旧を要求せずRequest Channelへ切り替える。

## 4. Credential Boundary

Scheduled Agent:

Target Repository `nisiyasu/-luke-quest`
- read可
- persistent direct write不可

Request Repository `nisiyasu/luke-env-gateway-requests`
- `inbox/<lane>/<request_id>.json` へのdraft追加可
- finalized request / CI結果read可

Request Repository自身のActions:
- draft検証
- SHA256計算
- `requests/` または `evidence-requests/` へのappend-only確定

Target Repository Actions:
- short-lived `GITHUB_TOKEN` をGateway writerとして使用
- Gateway allowlist内だけmutation

Visual Evidence Workflow:
- Target / Issue / Lease / Evidence branchへのwrite不可
- Actions Artifact生成のみ

## 5. Production Gateway構成

Mutation Poller:
`.github/workflows/env-visual-gateway-request-poller.yml`

- 5分間隔
- finalized `requests/<lane>/*.json` のみ読む
- `LQ_ENV_GATEWAY_PRODUCTION_ENABLED=true` のときだけmutationを実行
- receiptは `gateway/request-receipts` へ保存

Evidence Capture Poller:
`.github/workflows/environment-visual-evidence-production.yml`

- 5分間隔
- finalized `evidence-requests/<lane>/*.json` を読む
- active Lease / Epoch / reservation / exact HEADをfresh検証
- eligible requestだけREAD ONLY capture
- Artifact名 `lq-env-evidence-<request_id>`

Durable Evidence:
`evidence/visual-verification`

GatewayがArtifactから直接取込み、AI監査JSONと合わせてappend-only保存する。

## 6. Safety Gate

以下は実測済み。

- Credential Boundary:
  - Request Repo write = SUCCESS
  - Target Repo direct write = 403 DENIED
  - Request Repo → Poller → Target receipt = SUCCESS
- Static Validation = PASS
- Crash Recovery = PASS
- Artifact-backed Full E2E = PASS
- Request Draft Finalizer = PASS
- Evidence Capture Poller要求ゼロ = PASS
- Request Validator = PASS

Production Lane enable前に、同じcommitのStatic / Crash Recovery / Full E2Eが全PASSしていることをfresh確認する。

## 7. Cutover順序

1. 3 Scheduled Automationsを一時停止
2. Credential Boundaryを実測PASS
3. Gateway / Artifact Evidence安全回帰をPASS
4. Request Draft FinalizerをPASS
5. Agent ProtocolをParentへ配線
6. Global mutation Pollerをenable
7. Villageのみ `PRODUCTION_ENABLED=true`
8. VillageでLease Acquire / Release canary
9. direct Target writeが依然403であることを確認
10. Castle / Dungeonを順次enable
11. Scheduled Prompt本文は変更せず3 Automationsを再開
12. 次Scheduled RunがRequest Channel経路を使用することを監査
13. Parent #12 / router / grasslandはOwner明示promotionなしに変更しない

## 8. Canonical本線境界

Environment LaneからOwner明示promotionなしに以下を変更しない。

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

Environment PASSだけではcanonical本線promotion authorityを得ない。
