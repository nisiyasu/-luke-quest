# LUKE QUEST Environment Gateway Production Cutover Record v1

**状態:** PRODUCTION ACTIVE / 本番稼働
**実施日:** 2026-09-20 JST
**対象:** Village / Castle / Dungeon Environment Lanes
**Validated Main SHA:** `9fe93d5c1e2776c008107ebf9f775f6dff065acb`

## 1. Safety Regression

同一main SHAで本番enable直前に再実行し、全PASS。

- Static Validation: run `35478763596` / SUCCESS
- Crash Recovery: run `35478760961` / SUCCESS
- Artifact-backed Full E2E: run `35478758922` / SUCCESS

## 2. Credential Boundary

本番enable後もScheduled Agent側GitHub connectorから
`nisiyasu/-luke-quest` へのdirect contents writeは

`403 Resource not accessible by integration`

で拒否された。

この拒否は期待結果。
Target Repository direct write capabilityをScheduled Agentへ戻してはいけない。

Request Repository:
`nisiyasu/luke-env-gateway-requests`

へのdraft writeはSUCCESS。

## 3. Global Poller

Repository variable:

`LQ_ENV_GATEWAY_PRODUCTION_ENABLED=true`

Mutation Poller:
`.github/workflows/env-visual-gateway-request-poller.yml`

Evidence Capture Poller:
`.github/workflows/environment-visual-evidence-production.yml`

## 4. Village Live Canary

Lane:
`control/lease-village`

- PRODUCTION_ENABLED: true
- Acquire draft finalizer: run `35478894405` / SUCCESS
- Acquire poller: run `35478908355` / SUCCESS
- Acquire request: `cutover-village-acquire-20260920-v1`
- Lease Epoch: 1
- Implementation HEAD: `b040b0fa8e8ee9b1cbbd075b309c2eac65edce04`
- Release draft finalizer: run `35478936874` / SUCCESS
- Release poller: run `35478964219` / SUCCESS
- Release request: `cutover-village-release-20260920-v1`

Final:
- LEASE_STATUS: RELEASED
- ACTIVE_OPERATION_ID: null

## 5. Castle Live Canary

Lane:
`control/lease-castle`

- PRODUCTION_ENABLED: true
- Acquire draft finalizer: run `35479007940` / SUCCESS
- Acquire poller: run `35479031608` / SUCCESS
- Acquire request: `cutover-castle-acquire-20260920-v1`
- Lease Epoch: 1
- Implementation HEAD: `6512e08e5c7524ed34b5dac9fa83581ec11a1b32`
- Release draft finalizer: run `35479058017` / SUCCESS
- Release poller: run `35479073515` / SUCCESS
- Release request: `cutover-castle-release-20260920-v1`

Final:
- LEASE_STATUS: RELEASED
- ACTIVE_OPERATION_ID: null

## 6. Dungeon Live Canary

Lane:
`control/lease-dungeon`

- PRODUCTION_ENABLED: true
- Acquire draft finalizer: run `35479109850` / SUCCESS
- Acquire poller: run `35479175378` / SUCCESS
- Acquire request: `cutover-dungeon-acquire-20260920-v1`
- Lease Epoch: 1
- Implementation HEAD: `10d28270119ecdac73bd7d2a468f78cc84c761b8`
- Release draft finalizer: run `35479204787` / SUCCESS
- Release poller: run `35479226596` / SUCCESS
- Release request: `cutover-dungeon-release-20260920-v1`

Final:
- LEASE_STATUS: RELEASED
- ACTIVE_OPERATION_ID: null

## 7. Scheduled Automations

既存Prompt本文とscheduleは変更していない。

- LUKE 村づくり: enabled
- LUKE 城づくり: enabled
- LUKE ダンジョン: enabled

各runはParent Issue commentsから
`ENV_GATEWAY_CUTOVER_PROTOCOL:v1`
と
`docs/autonomy/LUKE_QUEST_ENV_GATEWAY_AGENT_PROTOCOL_v1.md`
をfresh取得し、Target Repository direct writeではなくRequest Channelを使用する。

## 8. Production State

全3Lane:

- `PRODUCTION_ENABLED=true`
- `GATEWAY_CUTOVER_STATUS=FENCED_GATEWAY_PRODUCTION_ACTIVE`
- `LEASE_STATUS=RELEASED`
- `ACTIVE_OPERATION_ID=null`

## 9. Canonical Boundary

Owner明示promotionなしに以下へwriteしない。

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

**RESULT: ENVIRONMENT GATEWAY PRODUCTION CUTOVER = ACTIVE**
