# LUKE QUEST Credential Boundary Test v2 PASS

**状態:** PASS / 本番cutover前Credential Boundary成立  
**対象:** Village / Castle / Dungeon Environment Gateway  
**実測日:** 2026-09-20 JST

## 1. 結論

Scheduled Agent用GitHub AppはTarget Repository
`nisiyasu/-luke-quest`
のpersistent direct write経路を持たず、

Request Repository
`nisiyasu/luke-env-gateway-requests`
へのrequest writeだけを使用する境界へ切替済み。

Target Repositoryへの永続mutationはTarget Repository Actions上の
Fenced Gatewayだけが実行する。

## 2. 実測結果

### TEST-A Request Repository write

結果: PASS / SUCCESS

- canary:
  `canary/credential-boundary-pass-v2.txt`
- canary commit:
  `fbb0ec6ea381a35ccdbcd86e7047319f34df19bc`

Scheduled Agent側credentialでRequest Repositoryへのwriteが成功した。

### TEST-B Target Repository contents direct write

結果: PASS / DENIED

Target Repositoryへのdirect contents writeを試行し、

`403 Resource not accessible by integration`

で拒否された。

拒否されることが期待結果。
canary fileは作成されていない。

### TEST-C Target Repository Issue direct write

結果: PASS / DENIED

Parent #51へのIssue comment direct writeをFresh試行し、

`403 Resource not accessible by integration`

で拒否された。

canary commentは作成されていない。

### TEST-D Request Repository → Target Poller

結果: PASS

- request:
  `requests/village/credential-boundary-v3.json`
- Request source commit:
  `6d51e8bb6697c7daac833ef7c631594e02572d60`
- Source blob:
  `e0fdaae24b79aa62aec884772af47a2d0562b676`
- Poller run:
  `35476165159`
- receipt:
  `gateway/request-receipts:receipts/terminal/credential-boundary-v3.json`

PollerはRequest Repository snapshotを取得し、Target Gatewayへrequestを渡し、
Target Repository側receiptをdurable保存した。

当時Lane productionはdisabledだったためGatewayは

`RequestRejected: lane production cutover disabled`

をterminal receiptとして返した。

これはpre-cutover canaryとして期待結果であり、
Lane implementation / Lease ownershipには副作用を与えなかった。

### TEST-E Global Poller kill switch

Fresh確認:

`LQ_ENV_GATEWAY_PRODUCTION_ENABLED=false`

本番enable前はFail Closed。

## 3. Safety Regression

Gateway commit:
`ecd60534196adb5d3e95f66ae0247454d807cec3`

同一commitで:

- Static Validation:
  run `35477826614` / SUCCESS
- Crash Recovery:
  run `35477826550` / SUCCESS
- Artifact-backed Full E2E:
  run `35477826628` / SUCCESS

Artifact-backed Full E2Eは隔離resource上で:

- Lease Acquire
- Issue mutation
- Implementation mutation
- Evidence ID / Adoption ID reserve
- Artifact-backed Durable Evidence publication
- fresh read-back
- Evidence Adoption
- Child close
- Parent Progress advance
- Lease Release
- stale Epoch rejection

まで通過した。

## 4. Request Channel Regression

Request Draft Finalizer:

- run `35477994306` / SUCCESS

Evidence Capture Poller request-zero smoke:

- run `35477499193` / SUCCESS

Request Repository Validator:

- latest pre-doc code validation = SUCCESS

## 5. Boundary Hard Rule

cutover後、Scheduled AgentがTarget Repository direct writeで403を受けた場合:

- permission restorationをOwnerへ要求しない
- 403を正常なCredential Boundaryとして扱う
- `LUKE_QUEST_ENV_GATEWAY_AGENT_PROTOCOL_v1.md` に従いRequest Channelへ切り替える

Target Repository direct write capabilityをScheduled Agentへ戻してはいけない。

## 6. Canonical境界

Gateway allowlistはEnvironment Laneだけ。

Owner明示promotionなしに:

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

を変更しない。

**RESULT: CREDENTIAL_BOUNDARY_TEST:v2 = PASS**
