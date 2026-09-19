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

本番Environment Laneを再開する前に、

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

例:

`nisiyasu/luke-quest-agent-requests`

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
- Production control/evidence branches: initialized disabled
- Credential Boundary: **NOT YET SATISFIED**
- Production Environment scheduled automations: **PAUSED**

Credential BoundaryがPASSするまでProduction Environment mutationを再開しない。
