# LUKE QUEST Environment Gateway Agent Protocol v1

**状態:** CUTOVER READY / 本番切替準備完了  
**対象:** Village #51 / Castle #52 / Dungeon #53 のScheduled Agent  
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`  
**配線正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_WIRING_v1.md`

---

## 1. このプロトコルの目的

Scheduled Agentの既存Prompt本文は変更しない。

既存Promptが毎run fresh取得するParent Environment Issueから本プロトコルを参照し、
Environment Laneの永続mutationをすべてFenced Gateway経路へ送る。

本プロトコルはTarget / Anchor / Child Acceptanceのauthorityを変更しない。
それらの正本は従来どおりParent / Child Issue /固定Target identityである。

---

## 2. Credential Boundary / 資格情報境界

Scheduled AgentのGitHub Appは以下の構成を前提とする。

Target Repository:
`nisiyasu/-luke-quest`

- READは可能
- contents writeは禁止
- Issue comment / close / updateは禁止
- control/lease-* writeは禁止
- evidence/visual-verification writeは禁止

Request Repository:
`nisiyasu/luke-env-gateway-requests`

- Agentはrequest draftを作成できる
- finalized request / validation resultをreadできる

Target Repositoryへのdirect writeで
`403 Resource not accessible by integration`
が返ることは、cutover後は**期待される正常な境界動作**である。

この403を理由にOwnerへTarget Repository write権限の復旧を要求してはいけない。
同じmutationをRequest Channel経由へ切り替える。

---

## 3. 永続mutationの唯一の入口

Scheduled AgentはTarget Repositoryへ直接mutationしない。

通常mutationはRequest Repositoryの

`inbox/<LANE_ID>/<REQUEST_ID>.json`

へ
`LUKE_QUEST_ENV_GATEWAY_REQUEST_DRAFT:v1`
として下書きを追加する。

Request Repositoryの
`Finalize LUKE QUEST Gateway Drafts`
が下書きを検証し、SHA256を計算して、

`requests/<LANE_ID>/<REQUEST_ID>.json`

へ
`LUKE_QUEST_ENV_GATEWAY_REQUEST:v1`
としてappend-only確定する。

Target Repository側Pollerはfinalized requestだけを読む。

---

## 4. Mutation Draft / mutation下書き形式

最小形式:

```json
{
  "schema": "LUKE_QUEST_ENV_GATEWAY_REQUEST_DRAFT:v1",
  "request_id": "<一意ID>",
  "lane_id": "<village|castle|dungeon>",
  "owner_run_id": "<このScheduled Run固有ID>",
  "lease_epoch": 0,
  "operation_id": "<run内で一意のoperation ID>",
  "operation_type": "LEASE_ACQUIRE",
  "expected_lane_head": null,
  "expected_target_identity": {
    "target_source_commit_sha": "<Parent固定値>",
    "target_blob_sha": "<Parent固定値>"
  },
  "payload": {
    "ttl_seconds": 1800
  },
  "created_at": "<UTC RFC3339>"
}
```

Agent自身で `request_sha256` を計算しなくてよい。
Draft Finalizerが正式requestに付与する。

送信済み `request_id` の内容を後から書き換えない。

---

## 5. Receipt / Gateway結果の取得

Target Repositoryのbranch:

`gateway/request-receipts`

をreadする。

完了:
`receipts/terminal/<REQUEST_ID>.json`

再試行待ち:
`receipts/pending/<REQUEST_ID>.json`

旧互換:
`receipts/<REQUEST_ID>.json`

正式な次operationへ進む前に、直前requestのterminal receiptをfresh取得する。

`ok=true` のresultからLease Epoch / APPLIED_HEAD /
Evidence Set Hash / Comment ID等を取得する。

`terminal=false` なら同Laneで新operationを発行せず待つ。

---

## 6. Lane開始順序

毎runのmutation開始時:

1. Target Repository / Parent / Current Child / implementation HEADをfresh read
2. Parent固定Target identityをfresh確認
3. `LEASE_ACQUIRE` draftをRequest Repositoryへ追加
4. finalized request生成を確認
5. terminal receiptを取得
6. receiptの `LEASE_EPOCH` とCurrent HEADを以後のrequestへ使用

Leaseを取得せずimplementation / Issue / Evidence mutationを送らない。

---

## 7. 主なoperation

### LEASE_ACQUIRE / Lease取得

- lease_epoch: `0` またはGatewayが許可した次Epoch
- payload: `{"ttl_seconds":1800}`

### LEASE_HEARTBEAT / Lease延長

- 現在のLease Epochを使用
- payload: `{"ttl_seconds":1800}`

長いVisual Evidence処理の前後で必要ならheartbeatする。

### LEASE_RELEASE / Lease解放

- 現在のLease Epochを使用
- unresolved operationがある状態ではreleaseしない

### IMPLEMENTATION_FILE_UPDATE / 実装ファイル更新

- `expected_lane_head`: mutation直前にfresh取得したexact implementation HEAD
- payload:
  - `path`
  - `encoding`: `utf-8` または `base64`
  - `content`

receiptの `APPLIED_HEAD` を次operationのexpected HEADとして使う。

同一HEAD前提で複数の独立requestを並列発行しない。

### ISSUE_COMMENT / Issueコメント

payload:
- `issue_number`
- `body`

Gatewayがoperation markerを付け、応答不明時の重複投稿を防ぐ。

### EVIDENCE_IDENTIFIERS_RESERVE / Evidence識別子予約

Visual Evidence保存前に必ず実行する。

- `expected_lane_head`: exact implementation HEAD
- payload:
  - `child_issue`
  - `evidence_id`
  - `adoption_id`
  - `evaluation_contract_sha256`

予約receipt成功前にCapture要求を出さない。

---

## 8. Evidence Capture Request / READ ONLY撮影要求

識別子予約後、Request Repositoryの

`inbox/<LANE_ID>/<CAPTURE_REQUEST_ID>.json`

へ以下のdraftを追加する。

```json
{
  "schema": "LUKE_QUEST_ENV_EVIDENCE_CAPTURE_REQUEST_DRAFT:v1",
  "request_id": "<CAPTURE_REQUEST_ID>",
  "lane_id": "<lane>",
  "owner_run_id": "<OWNER_RUN_ID>",
  "lease_epoch": 1,
  "evidence_id": "<予約済みEVIDENCE_ID>",
  "adoption_id": "<予約済みADOPTION_ID>",
  "child_issue": 82,
  "implementation_head": "<exact HEAD>",
  "expected_target_identity": {
    "target_source_commit_sha": "<Parent固定値>",
    "target_blob_sha": "<Parent固定値>"
  },
  "created_at": "<UTC RFC3339>"
}
```

Draft Finalizerが

`evidence-requests/<LANE_ID>/<CAPTURE_REQUEST_ID>.json`

へ確定する。

Target Repositoryの
`LUKE QUEST Environment Visual Evidence Production`
が5分間隔でeligible requestを読み、

- active Lease
- OWNER_RUN_ID
- Lease Epoch
- unresolved operationなし
- reserved Evidence / Adoption ID
- exact implementation HEAD
- fixed Target identity

をfresh照合した上でREAD ONLY撮影する。

Artifact名:

`lq-env-evidence-<CAPTURE_REQUEST_ID>`

Visual Evidence WorkflowはTarget Repository / Issue / Lease / Evidence branchへwriteしない。

---

## 9. ArtifactのAI視覚監査

Scheduled AgentはArtifact metadataだけでPASS判定しない。

Artifact ZIP本体を取得し、

- `target.png`
- `actual.png`
- `evidence-manifest.candidate.json`
- `evidence-settings.json`
- `evaluation-contract-snapshot.md`
- `runtime-audit.json`

をfresh確認する。

Target / Actualを実画像として開き、
Parentの同一固定ROIとChild Acceptanceを使って比較する。

以下を満たさない限りVisual PASSにしない。

- Target / Actual = `941 x 1672`
- DPR = 1
- crop = none
- padding = none
- exact implementation HEAD一致
- Target identity一致
- 同一固定ROI比較
- 客観的visual defectがAcceptance内
- `visual_comparison_performed = true`

FAILならEvidence Adoptionへ進まず、CURRENT_CHILDの修正へ戻る。

---

## 10. DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT / Artifactから永続証拠保存

Visual PASS後、通常Mutation Draftとして送る。

operation_type:
`DURABLE_EVIDENCE_PUBLISH_FROM_ARTIFACT`

- `expected_lane_head`: Artifact対象のexact implementation HEAD
- payload:
  - `child_issue`
  - `evidence_id`
  - `adoption_id`
  - `expected_evidence_head`: fresh `evidence/visual-verification` HEAD
  - `capture_request_id`
  - `artifact_id`
  - `visual_audit`
  - `coordinate_audit`

`visual_audit` は最低限:

- status / STATUS = PASS
- `visual_comparison_performed = true`
- `target_image_sha256`
- `actual_image_sha256`
- 判定対象ROI / Acceptance / remaining defects

を持つ。

GatewayはArtifactをTarget Repository Actionsから直接取得し、

- Artifact digest
- candidate manifest
- implementation HEAD
- Target identity
- canonical viewport
- Target / Actual SHA256
- settings hash
- contract snapshot hash
- runtime audit hash
- AI visual audit
- coordinate audit

を照合する。

その後のみ
`evidence/visual-verification`
へappend-only保存し、fresh read-backしてEvidence Set Hashを確定する。

画像本体をRequest Repositoryへコピーしない。

---

## 11. EVIDENCE_ADOPT / Evidence正式採用

Durable Evidence publicationのterminal receiptから
`DURABLE_EVIDENCE_SET_SHA256`
を取得した後だけ送る。

- `expected_lane_head`: 同じexact implementation HEAD
- payload:
  - `child_issue`
  - `evidence_id`
  - `adoption_id`
  - `durable_evidence_set_sha256`

Gatewayが再度

- current HEAD
- Target identity
- canonical viewport
- coordinate PASS
- visual PASS
- visual comparison performed
- evidence set hash

をfresh検証する。

---

## 12. Child close → Parent advance

Evidence Adoption成功後のみ:

1. `ISSUE_CLOSE`
   - payload:
     - `issue_number`: Current Child
     - `adoption_id`

2. `PARENT_PROGRESS_UPDATE`
   - payload:
     - `issue_number`: Lane Parent
     - `comment_id`: fresh取得したそのParentのactive Progress Marker comment ID
     - `body`: 新しいProgress Marker全文
     - `adoption_id`

順序を逆転しない。

Parent Progress更新成功後、同runで次Childをfresh取得して続行してよい。

---

## 13. FAIL時

### Target Repository direct writeの403

正常なCredential Boundary。
Ownerへwrite権限復旧を要求しない。
Request Channelへ切替える。

### pending receipt

同Laneの新operationを発行しない。
fresh receipt / Lease / Operation stateを再確認する。

### STALE_LEASE_EPOCH

古いrunは停止する。
新Epochを推測しない。

### RESULT_UNKNOWN / RECONCILIATION_REQUIRED

新Lease takeover / 新Epoch / PASS / close / Parent advanceを行わない。
GatewayのOperation Journalとfresh target stateによるreconciliationを優先する。

### HEAD mismatch

古いHEAD用requestを再利用しない。
fresh HEADを取得し、必要なら同じCurrent Childで再計画する。

### Visual FAIL

同じCurrent Childへ戻る。
後段Childや装飾で欠陥を隠さない。

---

## 14. Run終了時

安全に続行できる限り1 Childで停止しない。

run終了時はProgress MarkerをGateway経由でdurable更新し、
Leaseにunresolved operationがないことを確認して `LEASE_RELEASE` する。

Target Repositoryへ直接Progress Markerを書こうとして403になっても、
それをBLOCKERとして終了せず、Request Channelの
`PARENT_PROGRESS_UPDATE`
へ切り替える。

---

## 15. Canonical境界

このGatewayはEnvironment Lane専用。

Owner明示promotionなしに以下へwriteしない。

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

Environment PASSだけではcanonical本線promotion authorityを得ない。

---

**END OF LUKE QUEST ENVIRONMENT GATEWAY AGENT PROTOCOL v1**
