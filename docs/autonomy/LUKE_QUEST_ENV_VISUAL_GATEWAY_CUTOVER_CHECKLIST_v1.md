# LUKE QUEST Environment Gateway Cutover Checklist v1

**状態:** IN-REPO PREPARATION COMPLETE / CREDENTIAL BOUNDARY PENDING  
**契約正本:** `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

## 1. すでに完了しているもの

- FINAL v1契約をmainへ保存
- Parent #51 / #52 / #53への共通契約配線
- Scheduled Promptは無変更
- Canonical Viewport `941 x 1672 / DPR=1` 固定
- Safety Foundation TEST-1〜5 PASS
- GitHub実API TEST-1〜5 PASS
- Common READ ONLY Visual Evidence v2 PASS
- production-pin smoke `35472194325` PASS
- production-shaped Gateway candidate `35472236501` PASS
- production Gateway static validation `35473092417` PASS
- production Gateway v1 full isolated E2E `35473334725` PASS / artifact `10593617003`
- production Control Branch 3本初期化
- Durable Evidence Branch初期化
- production Gateway本体をmainへ配置
- Request Schema / Request Builder配置
- Gateway workflowはread-only `GITHUB_TOKEN` + 専用writer secret方式で配置
- production enable variable未設定のためcutoverはFail Closed

## 2. 現在の唯一のHard Blocker

Scheduled Agentが使用しているGitHub接続は、現状 `nisiyasu/-luke-quest` へdirect write可能。

このままではGatewayを唯一の永続mutation受付口として技術的に強制できない。

これはrepository内コードだけでは解消できないcredential boundaryである。

## 3. Cutoverに必要な資格情報構成

### Scheduled Agent

Target Repository `nisiyasu/-luke-quest`:

- READは許可
- branch pushは禁止
- Issue comment / close / updateは禁止
- control/lease-* writeは禁止
- evidence/visual-verification writeは禁止

専用Request Channel:

- request作成のみ許可
- Gateway結果readを許可

### Gateway

Target Repository:

- environment/village, environment/castle, environment/dungeon
- control/lease-village, control/lease-castle, control/lease-dungeon
- evidence/visual-verification
- Parent #51/#52/#53 と children #54〜#95

だけを契約allowlist内でwriteする。

Gateway writer credentialは `LQ_ENV_GATEWAY_WRITER_TOKEN` として専用管理する。

## 4. CREDENTIAL_BOUNDARY_TEST:v1

cutover前に以下を実測し、全PASSをdurable保存する。

1. Scheduled Agent credentialでTarget Repository branch writeを試す → **拒否**
2. Scheduled Agent credentialでParent/Child Issue mutationを試す → **拒否**
3. Scheduled Agent credentialでRequest Channelへrequestを書く → **成功**
4. Gatewayが同requestを取得・hash照合 → **成功**
5. Gateway writerでallowlisted test mutation → **成功**
6. stale Lease Epoch request → **拒否**
7. Gateway以外のcredentialからcontrol/evidence write → **拒否**
8. Parent #12 / WORK_PACKET_ROUTER / grasslandがGateway allowlist外であること → **拒否**

## 5. Cutover順序

1. Credential Boundaryを設定
2. `CREDENTIAL_BOUNDARY_TEST:v1` を隔離対象で実行
3. 全PASS evidenceを保存
4. Control Branchの `PRODUCTION_ENABLED` はまだfalseのまま確認
5. Gateway writer secretを設定
6. Request Channel consumerを有効化
7. 1レーンだけdry-run request
8. direct writeがないことを監査
9. Owner-approved cutoverとしてproduction enable
10. Village / Castle / Dungeonを順次Gateway経路へ切替
11. 切替後もScheduled Prompt本文は変更しない
12. Parent #12 / router / grasslandはOwner明示promotionなしに変更しない

## 6. 現在の運用

Credential Boundary完成までは、

- Village / Castle / Dungeonの既存Scheduled RunはACTIVE
- Existing Scheduled PromptはUNCHANGED
- 既存Lane制作は継続
- 新GatewayはCUTOVER DISABLED
- 既存運用を新Gateway準拠済みとは表示しない


## 7. Pre-Cutover Boundary Evidence

Current boundary canary: **FAIL**

- direct contents canary commit: `0c293c5b96ac9e03f4839cc5cf781e0f6b463d09`
- direct Issue canary comment: `5745772476`
- durable record: `docs/autonomy/evidence/LUKE_QUEST_CREDENTIAL_BOUNDARY_TEST_v1_PRE_CUTOVER_FAIL.md`

次に必要なのはコード修正ではなくCredential Boundary設定変更。その変更後に同じテストを再実行し、direct writeがDENIEDへ反転することを必須とする。
