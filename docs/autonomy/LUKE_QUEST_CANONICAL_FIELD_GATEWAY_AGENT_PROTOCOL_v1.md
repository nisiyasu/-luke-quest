# LUKE QUEST Canonical Field Gateway Agent Protocol v1

**状態:** CUTOVER CANDIDATE / 草原本線Gateway切替候補  
**対象:** Parent #12 / WORK_PACKET_ROUTER:v1 / prototype/modern-3d  
**Request Repository:** `nisiyasu/luke-env-gateway-requests`

## 1. Transport Boundary / 書込み経路

Scheduled Build LoopはTarget Repository `nisiyasu/-luke-quest` をfresh readしてよいが、
persistent direct writeを行わない。

Target Repositoryへのdirect contents / Issue mutationで
`403 Resource not accessible by integration`
が返ることはCredential Boundaryの正常動作であり、Ownerへwrite権限復旧を要求してはいけない。

永続mutationは必ずRequest Repositoryの

`field-inbox/<REQUEST_ID>.json`

へ
`LUKE_QUEST_CANONICAL_FIELD_GATEWAY_REQUEST_DRAFT:v1`
として追加する。

Request Repository自身のFinalizerがSHA256と固定Program identityを付与し、

`field-requests/<REQUEST_ID>.json`

へappend-only確定する。

Target Repository側
`LUKE QUEST Canonical Field Gateway Request Poller`
だけが正式requestを処理する。

## 2. Fixed Authority / 固定authority

- PROGRAM_ID: `LQ-MODERN-3D-VISUAL-PROTOTYPE-20260911-V2`
- Parent: #12
- Router comment: `5646492352`
- Implementation branch: `prototype/modern-3d`
- Target: `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png`
- Gateway control branch: `control/lease-canonical-field`
- Receipt branch: `gateway/canonical-field-request-receipts`

Gatewayはfresh `WORK_PACKET_ROUTER:v1` を読み、
その `CURRENT_PACKET_ISSUE` だけをIssue mutation対象として許可する。

#26〜#50を静的に全部write可能にはしない。

## 3. Run Start / 実行開始

mutation開始時:

1. canonical bootをfresh load
2. Parent #12をfresh read
3. router comment `5646492352` をfresh read
4. CURRENT_PACKET Issueをfresh read
5. implementation branch HEADをfresh read
6. `LEASE_ACQUIRE` draftを `field-inbox/` へ追加
7. Finalizer完了をfresh確認
8. Receipt branchのterminal receiptをfresh確認
9. 返却された `LEASE_EPOCH` / implementation HEADを後続requestへ使用

Lease取得前にimplementation / Issue / router mutationを送らない。

## 4. Draft common fields

```json
{
  "schema": "LUKE_QUEST_CANONICAL_FIELD_GATEWAY_REQUEST_DRAFT:v1",
  "request_id": "<unique>",
  "lane_id": "field",
  "owner_run_id": "<this scheduled run id>",
  "lease_epoch": 0,
  "operation_id": "<unique operation id>",
  "operation_type": "LEASE_ACQUIRE",
  "expected_lane_head": null,
  "payload": {},
  "created_at": "<UTC RFC3339>"
}
```

Agent自身でSHA256やTarget identityを計算しない。
Request Repository Finalizerが固定値を付与する。

## 5. Allowed Operations / 許可operation

### LEASE_ACQUIRE
payload:
`{"ttl_seconds":1800}`

### LEASE_HEARTBEAT
長いActions / Artifact監査の前後で必要なら延長する。

### LEASE_RELEASE
unresolved operationがないことを確認してrun終了時に解放する。

### ROUTER_ASSERT
fresh router / Current Packet / implementation HEADの整合を確認するread-only operation。
本番cutover canaryにも使用する。

### IMPLEMENTATION_FILE_UPDATE
- branchはGatewayが `prototype/modern-3d` に固定する
- `expected_lane_head` はmutation直前のexact HEAD
- payload:
  - `path`
  - `encoding`: `utf-8` または `base64`
  - `content`

receiptの `APPLIED_HEAD` を次operationへ引き継ぐ。

### ISSUE_COMMENT
payload:
- `issue_number`: fresh routerのCURRENT_PACKET_ISSUEのみ
- `body`

Gateway operation marker付きで書き込み、応答不明時の二重投稿を防ぐ。

### CURRENT_PACKET_STATE
fresh routerのCurrent Packetだけをopen/closedへ変更できる。

close時は先にGateway経由のevidence/work-log commentを保存し、その
`evidence_comment_operation_id`
をpayloadへ指定する。

### EVIDENCE_WORKFLOW_DISPATCH
Current Packetの証拠検証に必要な専用allowlisted workflowだけを明示起動する。\n\n必須:\n- `expected_lane_head`: mutation直前の `prototype/modern-3d` exact HEAD\n- payload `workflow`: Gateway固定allowlist内のみ\n- payload `expected_current_packet_issue`: fresh routerのCurrent Packetと一致\n\nGatewayはdispatch直前にfresh implementation HEADとCurrent Packetを再検証し、workflowへexact HEADを入力する。任意workflow名、任意ref、stale HEADは拒否する。\n\n### ROUTER_UPDATE
更新可能なのはParent #12 comment `5646492352` だけ。

payload必須:
- `expected_router_body_sha256`
- `expected_current_packet_issue`
- `transition_type`: `PASS_ADVANCE | FAIL_ROUTE | STATE_REFRESH`
- `body`: WORK_PACKET_ROUTER:v1全文

Gatewayはfresh router hash、Program ID、Parent #12、Router version、
new CURRENT_PACKET_IDとtarget Issue本文のPACKET_ID一致を検証する。

`PASS_ADVANCE` は旧Current Packetが既にclosedでなければ拒否する。

## 6. Receipts / 結果

Receipt branch:
`gateway/canonical-field-request-receipts`

完了:
`receipts/terminal/<REQUEST_ID>.json`

待機:
`receipts/pending/<REQUEST_ID>.json`

次operationへ進む前に直前のterminal receiptをfresh確認する。

## 7. Evidence / Actions

GitHub Actions run / artifactはpublic readでfresh取得してよい。

CI SUCCESSやArtifact存在だけでPacket PASSにしない。
Current PacketのEVIDENCE REQUIRED / STOP RULEに従い、
必要な画像・runtime・interaction evidenceを実際に検査する。

Actionsがimplementation branch pushで起動する場合はGatewayの
`IMPLEMENTATION_FILE_UPDATE`
後のexact HEAD runを追跡する。

将来、明示dispatchが必要なPacketが出た場合は、任意workflow dispatchを
勝手に開放せず専用allowlisted operationを追加して安全試験する。

## 8. Router Safety / router安全境界

- Issue comment/state mutationはfresh Current Packetだけ
- Router updateは固定commentだけ
- stale router hashは拒否
- stale Lease Epochは拒否
- old Scheduled Runは新Epochを推測しない
- RESULT_UNKNOWN / RECONCILIATION_REQUIRED中は新Lease takeoverしない
- main/default branchへ実装writeしない
- Village / Castle / Dungeon control/evidence authorityへ触れない

## 9. Run End

safe executable workが残る限り1操作で停止しない。

終了時:
1. Current Packetへ必要なwork recordをGateway経由で保存
2. router/current packet/headをfresh確認
3. unresolved operationなしを確認
4. `LEASE_RELEASE`
5. terminal receiptをfresh確認

Target Repository direct writeの403をblockerとして終了してはいけない。
Request Channelへ切り替えて継続する。

**END OF LUKE QUEST CANONICAL FIELD GATEWAY AGENT PROTOCOL v1**
