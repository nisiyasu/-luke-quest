# LUKE QUEST Request Channel Pre-Cutover Canary v1

**状態:** PASS / request intake path verified while production mutation remained disabled
**実施日:** 2026-09-20 JST

## Purpose

専用Request RepositoryからTarget RepositoryのFenced Mutation Gatewayへ、
request identityを保持したまま取り込めることを実GitHub APIで確認する。

本canaryではproduction mutationを有効化しない。
期待結果はRequest取得成功、Target側production-disabled拒否、receipt永続化である。

## Source

- Request Repository: `nisiyasu/luke-env-gateway-requests`
- Source commit: `8b351a56bb2a84efcdb5b9a93fd9e1723ec594bd`
- Source path: `requests/village/request-channel-precutover-canary-v1.json`
- Source blob: `ee02e089b548ac55852abf276d604acf2e8b9c41`
- Request ID: `request-channel-precutover-canary-v1`
- Operation ID: `request-channel-precutover-canary-op`
- Request SHA-256: `b8c4d7f8ede34c758e1b80c7aa1ee0df0e8990766a5f890c34e73dde17d7f597`

## Observed Result

- Public Request Repository read: PASS
- Request path/lane identity read: PASS
- Request canonical hash validation path: PASS
- Target Gateway invocation: reached
- Production mutation: NOT EXECUTED
- Rejection reason: `lane production cutover disabled`
- Receipt persistence: PASS
- Receipt branch: `gateway/request-receipts`
- Receipt path: `receipts/request-channel-precutover-canary-v1.json`

Receiptにはsource repository / source commit / source path / source blob /
request hash / operation idが保存され、request provenanceを復元できる。

## Safety Meaning

このPASSはCredential Boundary完成を意味しない。
Scheduled AgentからTarget Repositoryへのdirect write capabilityは、
別途 `CREDENTIAL_BOUNDARY_TEST:v1` でDENIEDへ反転する必要がある。

本canaryが証明するのは、Request Channel配線とprovenance固定が
production-disabled状態で実API経由により成立したことだけである。
