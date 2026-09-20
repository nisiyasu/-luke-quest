# LUKE QUEST Environment Gateway Cutover Checklist v2

**状態:** CUTOVER READY / PRODUCTION DISABLED  
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`  
**Agent実行プロトコル:** `docs/autonomy/LUKE_QUEST_ENV_GATEWAY_AGENT_PROTOCOL_v1.md`  
**Credential Boundary証拠:** `docs/autonomy/evidence/LUKE_QUEST_CREDENTIAL_BOUNDARY_TEST_v2_PASS.md`

## 1. 完了済み

- FINAL v1契約をmainへ保存
- Parent #51 / #52 / #53への共通契約配線
- Canonical Viewport `941 x 1672 / DPR=1` 固定
- Safety Foundation TEST-1〜5 PASS
- GitHub API統合試験 PASS
- Credential Boundary v2 PASS
  - Request Repo write SUCCESS
  - Target contents direct write 403
  - Target Issue direct write 403
  - Request → Poller → Target receipt SUCCESS
- production Gateway static validation PASS
- production Gateway crash recovery PASS
- Artifact-backed production Gateway Full E2E PASS
- production Control Branch 3本初期化
- Durable Evidence Branch初期化
- Request Repository稼働
- Request Draft Finalizer稼働
- Request Validator稼働
- Evidence Capture Poller稼働
- Actions Artifact ZIPをScheduled Agent側から取得可能と実測
- Target / Actual PNG本体をAgent側で実画像として開けることを実測
- Artifact-backed Durable Evidence import実装
- Artifact digest / manifest / HEAD / Target identity / viewport / image hash検証実装
- Evidence publication後のfresh read-back実装
- Gateway本体変更時にStatic / Crash / Full E2Eが自動再実行される配線
- Existing Scheduled Prompt本文は未変更
- Village / Castle / Dungeon automationsはcutover中のため一時停止済み

## 2. Writer構成

### Scheduled Agent

Target Repository:
`nisiyasu/-luke-quest`

- READのみ
- contents writeなし
- Issue writeなし

Request Repository:
`nisiyasu/luke-env-gateway-requests`

- `inbox/` へdraft write
- finalized request / CI read

### Request Repository Actions

- draft validation
- canonical SHA256生成
- finalized requestをappend-only確定

### Target Repository Gateway

専用長期PATは使用しない。

Target Repository Actionsの短命 `GITHUB_TOKEN` をwriterとして使用する。

write可能範囲はGatewayコードのLane / Issue / Branch allowlistで制限する。

### Visual Evidence Workflow

- Target / Issue / Lease / Evidence branch persistent writeなし
- Actions Artifact生成のみ

## 3. Cutover直前Fresh Gate

Production enable直前に以下を全確認する。

- Global variable `LQ_ENV_GATEWAY_PRODUCTION_ENABLED=false`
- Village `control/lease-village`:
  - `PRODUCTION_ENABLED=false`
  - `LEASE_STATUS=RELEASED`
  - `ACTIVE_OPERATION_ID=null`
- Castle `control/lease-castle`: 同条件
- Dungeon `control/lease-dungeon`: 同条件
- Static Validation最新 = PASS
- Crash Recovery最新 = PASS
- Full E2E最新 = PASS
- Request Finalizer最新 = PASS
- Request Validator最新 = PASS
- Credential Boundary direct writes = DENIED
- Parent #12 / router / grasslandに未承認変更なし

1つでも満たさなければFail Closed。

## 4. Production Cutover順序

1. 3 Scheduled Automationsが一時停止中であることを確認
2. Parent #51 / #52 / #53へAgent Protocolを配線
3. Global Poller variableを `true`
4. VillageのみControl Branch `PRODUCTION_ENABLED=true`
5. Village Request Channel経由で `LEASE_ACQUIRE` canary
6. terminal receiptでLease取得をfresh確認
7. 同Epochで `LEASE_RELEASE` canary
8. Control BranchがRELEASEDへ戻ったことをfresh確認
9. Target direct contents / Issue writeが引き続き403であることを確認
10. Castle `PRODUCTION_ENABLED=true`
11. Dungeon `PRODUCTION_ENABLED=true`
12. 3 Lane Control Branchのfresh状態を確認
13. Existing Scheduled Prompt本文は変更せずAutomationsを再開
14. 最初の各Scheduled Runを監査
15. direct write試行ではなくRequest Channelを使うことを確認
16. Evidence Capture → Artifact取得 → AI実画像監査 → Artifact-backed Durable Evidenceの実runを確認
17. Parent Progress Markerへcutover完了状態をGateway経由で反映

## 5. First Live Run Acceptance

各Lane最初の再開runで最低限確認:

- Target / Parent / Current Childをfresh read
- direct Target writeを行わない
- Request draftが `inbox/` に作成される
- Draft Finalizerが正式requestを生成
- Mutation Pollerがterminal receiptを返す
- Lease Epochをreceiptから使用
- implementation mutationはexpected HEAD付き
- Evidence Capture要求は予約済みEvidence / Adoption IDを使用
- ArtifactのTarget / Actual本体をAgentが取得
- `941 x 1672` で同一ROI visual audit
- FAILならChildをadvanceしない
- PASSならArtifact-backed Durable Evidence → Adoption → close → Parent updateの順序
- run終了時にunresolved operationなしでLease Release

## 6. Rollback / Kill Switch

異常時:

1. Global variable
   `LQ_ENV_GATEWAY_PRODUCTION_ENABLED=false`
2. 3 Automations停止
3. unresolved Operation Journalをfresh確認
4. RESULT_UNKNOWN / RECONCILIATION_REQUIREDがあるLaneはtakeover禁止
5. Control Branchを手動で上書きして誤魔化さない
6. Gateway / receipt / target fresh stateからreconcile

既存direct-write credentialをScheduled Agentへ戻すことをrollback手段にしない。

## 7. Canonical本線境界

Owner明示promotionなしに:

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

を変更しない。

Environment PASSだけではcanonical本線promotion authorityを得ない。

## 8. 現在の次操作

Production enable前Fresh Gateを再取得し、
全PASSならVillage 1レーンcanaryへ進む。
