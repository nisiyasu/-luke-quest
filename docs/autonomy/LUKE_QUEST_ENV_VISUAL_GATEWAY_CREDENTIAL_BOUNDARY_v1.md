# LUKE QUEST 環境視覚検証 Gateway Credential Boundary v1

**状態:** REQUIRED BEFORE PRODUCTION ENABLEMENT / 本番解禁前必須
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

## 1. Fresh Current Reality

現在ChatGPTから接続されている `nisiyasu/-luke-quest` のGitHub installationは、repository metadata上、

- admin: true
- maintain: true
- push: true
- pull: true
- triage: true

を持つ。

したがって、Scheduled Agentがこのinstallationを直接保持したままでは、契約第8・11・19・37節が要求する

**「FENCED MUTATION GATEWAYを唯一の永続mutation受付口にする」**

というcredential-level guaranteeは成立しない。

Prompt上で「直接write禁止」と指示するだけでは技術的強制にならない。

## 2. Production Hard Rule

新Gatewayへ本番cutoverする前に、

Scheduled Agent と Target Repository Writer のcredentialを分離する。

Scheduled Agentへ `nisiyasu/-luke-quest` のdirect write capabilityを与えてはいけない。

Production writerはFenced Mutation Gatewayだけとする。

## 3. 推奨Boundary

### Agent側

Scheduled Agentに許可するもの:

- Target Repositoryのpublic/read-only reality取得
- 専用Gateway Request Channelへのrequest作成
- Gateway結果のread

禁止:

- Target Repository branchへのdirect push
- Issue comment / close / body update
- Lease control branch mutation
- Durable Evidence branch mutation
- canonical router mutation

### Gateway側

Gatewayだけに許可:

- control/lease-* write
- environment/* conditional write
- Environment Parent/Child Issue mutation
- evidence/visual-verification append-only publication

GatewayはOperation Journal / Lease Epoch / expected HEAD / Evidence Adoption contractを必須適用する。

## 4. 推奨Request Channel構成

最も明確な構成はTarget Repositoryとは別の専用request repositoryまたは同等の外部queue。

実装済みRequest Repository:

`nisiyasu/luke-env-gateway-requests`

Scheduled AgentのGitHub installationはrequest repositoryへwriteできるが、
`nisiyasu/-luke-quest` にはwriteできない構成にする。

Target RepositoryのGatewayはrequestをreadし、自身のTarget Repository用writer credentialで検証・適用する。

request repositoryを使用する場合、Target Gatewayはrequest commit / request id / request hashをOperation Journalへ固定する。

## 5. 同一Repository Request Branchだけでは不足

`gateway/requests` のような同一Repository branchを作るだけでは、
Scheduled Agentが同じinstallationでTarget Repository全体へpush / Issue write可能な限りcredential boundary成立とはみなさない。

Branch ruleだけでIssue comment / close等のdirect write capabilityまで消せない構成も不十分。

## 6. Cutover Gate

本番再開前にfresh確認する。

- Scheduled AgentからTarget Repository direct writeを試みると拒否される
- Request Channelへのwriteは成功する
- GatewayはRequestを取得できる
- GatewayだけがTarget Repositoryへmutationできる
- stale Epoch requestはGateway受付側で拒否される
- Request Channel credentialからIssue #51〜#95を直接変更できない

これを `CREDENTIAL_BOUNDARY_TEST:v1` としてdurable evidence化する。

## 7. Current Disposition

- Safety Foundation model TEST-1〜5: PASS
- GitHub実API Gateway integration TEST-1〜5: PASS
- Common READ ONLY Visual Evidence workflow: isolated smoke PASS
- Production-pin smoke run `35472194325`: PASS
- Production-shaped Gateway candidate run `35472236501`: PASS
- Production Gateway code: mainへ配置済み、cutover disabled
- Production control/evidence branches: initialized disabled
- Credential Boundary: **NOT YET SATISFIED**
- Existing Village / Castle / Dungeon scheduled automations: **ACTIVE**
- Existing Scheduled Prompts: **UNCHANGED**
- New Gateway production cutover: **PENDING**

Credential BoundaryがPASSするまで、新Gatewayを「唯一の書込み口」とする本番cutoverは完了扱いにしない。

ただし、Owner指示により既存Environment Scheduled Runは停止しない。cutover完了前の既存運用は legacy execution として明示的に区別し、新Gateway準拠済みとは扱わない。

## 8. Pre-Cutover Canary Result / 事前実測

`CREDENTIAL_BOUNDARY_TEST:v1` の事前canaryをtest-only resourcesで実行した。

- Target Repository contents direct write: **SUCCEEDED**
- Target Repository Issue direct write: **SUCCEEDED**
- Result: **FAIL / boundary not yet satisfied**
- Production Environment branches/issues: not used
- Durable evidence: `docs/autonomy/evidence/LUKE_QUEST_CREDENTIAL_BOUNDARY_TEST_v1_PRE_CUTOVER_FAIL.md`

この結果は、current GitHub plugin permission modeの変更だけではなく、Target Repository writer credentialそのものの分離が必要であることを確認するもの。

ChatGPT Plugin permission modeはOAuth / GitHub App repository scopeではないため、confirmation mode変更だけをCredential Boundary PASSとして扱ってはいけない。

## 9. Production Boundary Implementation / 本番境界の実装方式

Target Repository `nisiyasu/-luke-quest` はPUBLICであるため、ChatGPT Codex Connectorのselected repository対象から外した後もpublic read-only reality取得は継続できる。

Request Repository `nisiyasu/luke-env-gateway-requests` はConnectorのselected repository対象に残し、Scheduled Agentの唯一のGitHub write先とする。

Target Repository側の `.github/workflows/env-visual-gateway-request-poller.yml` が5分ごとにPublic Request Repositoryをimmutable snapshotとしてcloneし、Target Repository自身のGitHub Actions `GITHUB_TOKEN` でFenced Mutation Gatewayを実行する。

この方式ではRequest RepositoryからTarget RepositoryへPAT / GitHub App private key / cross-repository writer secretを渡さない。

Credential Boundary PASS条件は次の3点を実測する。

1. ChatGPT GitHub connectorから `nisiyasu/-luke-quest` direct writeが拒否される。
2. 同じconnectorから `nisiyasu/luke-env-gateway-requests` request writeが成功する。
3. Target Repository pollerがrequestをpublic readし、Target自身の `GITHUB_TOKEN` でGateway処理できる。

上記が成立するまで `LQ_ENV_GATEWAY_PRODUCTION_ENABLED=false` を維持する。
