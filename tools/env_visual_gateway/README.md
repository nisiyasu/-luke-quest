# LUKE QUEST Environment Fenced Mutation Gateway v1

**状態:** PRODUCTION CODE INSTALLED / CUTOVER DISABLED

正本契約:

`docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

このディレクトリは、Village / Castle / Dungeon 環境レーンの永続書込みを Fenced Mutation Gateway 経由に統一するための本番候補実装です。

## 現在の重要境界

- コードはmainへ配置してよい。
- Production Control Branch / Evidence Branchは初期化済みでも `PRODUCTION_ENABLED=false` のまま維持する。
- `LQ_ENV_GATEWAY_PRODUCTION_ENABLED` を明示的に有効化するまで本番mutationを実行しない。
- GitHub Actions標準 `GITHUB_TOKEN` はGateway writerに使用しない。
- 本番writerは専用 `LQ_ENV_GATEWAY_WRITER_TOKEN` のみ。
- Scheduled AgentのTarget Repository direct-write capabilityが残っている間は、credential-level cutover完了と判定しない。

## 実装済み保証

- Lane allowlist
- 固定Target Source Commit / Blobのfresh照合
- Lease Epoch / Fencing
- `ACTIVE_OPERATION_ID` によるLane内Operation直列化
- Operation Journal PREPARED → DISPATCHED → terminal state
- expected implementation HEADによるCAS
- Issue comment stable marker reconciliation
- Parent Progress comment ownershipの書込み前検証
- Evidence ID / Adoption IDの保存前予約
- Durable Evidence append-only publication
- 3レーン共有Evidence BranchのCAS retry
- fresh read-back / evidence-set hash
- Visual + Coordinate PASS確認後のみEvidence Adoption
- Adoption後のみChild close
- Child close後のみPASS連動Parent advance
- stale Epoch拒否

## 本番解禁前に残るもの

Credential Boundaryの実効化です。Scheduled AgentがTarget Repositoryへ直接writeできる資格情報を保持したままでは、Gatewayが「唯一の書込み口」になりません。

したがって、現在は既存Environment Scheduled Runを止めず並行稼働させつつ、新Gatewayはcutover待ちとします。既存運用を新Gateway準拠と偽装してはいけません。
