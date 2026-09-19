# LUKE QUEST 環境視覚検証 安全基盤 実装・隔離試験 v1

**状態:** ISOLATED SAFETY FOUNDATION / 隔離安全基盤
**契約:** docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md
**ブランチ:** infra/env-visual-safety-v1

## 1. 目的

契約第37節のTEST-1〜TEST-5を、本番Environment Laneへ副作用を与えず故障注入で検証する。

## 2. 二段階試験

1. foundation.py / run_safety_tests.py による永続状態機械の隔離モデル試験。
2. github_gateway_integration_test.py によるGitHub実APIの隔離統合試験。

## 3. 隔離境界

本番のParent #12、WORK_PACKET_ROUTER、#51〜#95、environment/*、prototype/modern-3dは変更しない。
実API試験はIssue #98と test/env-visual-gateway-state / test/env-visual-gateway-evidence のみに書き込む。

## 4. 本番解禁

CI greenだけで解禁しない。モデルTEST-1〜5と実API統合試験の両方をfresh evidence付きで監査し、Gatewayの実装境界・資格情報境界を確認してから本番配線へ進む。
