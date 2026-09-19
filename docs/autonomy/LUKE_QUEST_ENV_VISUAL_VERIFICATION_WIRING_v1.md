# LUKE QUEST 環境レーン共通・視覚検証契約 配線 v1

**状態:** ACTIVE WIRING PLAN / 有効配線計画  
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

## 1. Parent配線

- Village Parent #51
- Castle Parent #52
- Dungeon Parent #53

各Parentは共通契約を、実行・証拠・Lease・Fencing・Evidence Adoptionの共通authorityとして参照する。

座標・参照対象については各Parent本文の `FIXED REFERENCE ANCHOR LOCK v1` が引き続き唯一の正本であり、共通契約は新しい座標正本を作らない。

## 2. Child継承

各Parent配下のChild IssueはParent経由で共通契約を継承する。  
Child固有のOBJECTIVE / ACCEPTANCE / EVIDENCE REQUIREDはChild Issue自身が正本。

## 3. Scheduled Prompt

既存Scheduled Promptは変更しない。

Scheduled Prompt  
→ Parent Environment Issue  
→ Current Child Issue  
→ 共通契約  
→ Lane Lease / Fencing  
→ implementation  
→ Visual Evidence  
→ Evidence Adoption  
→ PASS / FAIL  
→ next Child

## 4. Canonical本線境界

Environment LaneからOwner明示promotionなしに以下を変更しない。

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- default/stable integration target

## 5. 新Gateway本番cutover条件

安全基盤TEST-1〜TEST-5、実GitHub API統合試験、production-pin smoke、production-shaped Gateway candidateはPASS済み。

新Gatewayを唯一の永続mutation受付口として本番cutoverするには、さらに以下を満たす。

- Scheduled AgentのTarget Repository direct writeを技術的に拒否できる
- 専用Request ChannelへのwriteだけをAgentへ許可する
- Gateway writerだけがTarget Repositoryへmutationできる
- stale Epoch requestをGateway受付側で拒否できる
- `CREDENTIAL_BOUNDARY_TEST:v1` をdurable PASSとして保存する
- Production Control Branchの `PRODUCTION_ENABLED` をOwner-approved cutoverでのみ有効化する

## 6. Cutover前の既存運用

Owner指示により、Village / Castle / Dungeonの既存Scheduled Runは停止しない。

- Existing Scheduled Prompts: unchanged
- Existing automations: active
- Current Child work: 継続
- New Gateway cutover: pending Credential Boundary
- Legacy executionを新Gateway準拠済みと誤表示しない

安全基盤の構築・隔離試験と、既存環境制作の進行を並行させる。
