# LUKE QUEST 環境レーン共通・視覚検証契約 v1

**状態:** FINAL v1 / 正式確定版 v1  
**対象:** 村 #51、城 #52、ダンジョン #53、および将来の同形式環境レーン  
**目的:** Target画像を実際に視覚取得し、同じ対象を同じ座標へ再構築したことを、再現可能かつ追跡可能な証拠で判定する。

---

## 1. 基本方針

Scheduled Taskの起動プロンプトは変更しない。

既存構造を維持する。

Scheduled Task  
→ Parent Environment Issue  
→ Current Child Issue  
→ Lane Lease取得  
→ 実装  
→ 実画面生成  
→ 証拠取得  
→ 視覚比較  
→ PASS / FAIL  
→ 次Issue

座標・参照対象の基本契約は、Parent Issue #51 / #52 / #53 に既に存在する

`FIXED REFERENCE ANCHOR LOCK v1 / 固定参照アンカーロック`

を唯一の正本とする。

同じ意味のルールを別プロンプト、別文書、別Issueへ重複作成しない。

---

## 2. 既存の座標固定契約

各componentはParent Issueの既存契約どおり、

- stable component ID
- Target画像上のnormalized ROI `(x%, y%, w%, h%)`
- nearby hard anchors
- depth layer

を固定する。

一度選択した対象は、後続runで勝手に別の似た対象へ変更してはいけない。

「似たカテゴリー」「似た雰囲気」では不十分。

Target画像上で指定した同じ対象を、同じ画面領域・同じ構図上の役割で再現する。

---

## 3. Target Authority / ターゲット正本

### 村

Branch:  
`prototype/modern-3d`

Path:  
`references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png`

確認済みBlob SHA:  
`e6536371eddcc7fb5cf5803568216f008011a5f1`

### 城

Branch:  
`prototype/modern-3d`

Path:  
`references/target-quality/environments/CASTLE_INTERIOR_TARGET_OWNER_20260914.png`

確認済みBlob SHA:  
`573c13225471820d063043a37e3ee26fad389d63`

### ダンジョン

Branch:  
`prototype/modern-3d`

Path:  
`references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png`

確認済みBlob SHA:  
`198d0f5f3da115b70218ae8180d5f8363d744959`

Target画像の取得元と実装先Branchを混同してはいけない。

---

## 4. Target Identity Lock / ターゲット同一性固定

Target画像はファイル名・パスだけで識別してはいけない。

各Laneは最低限、

- TARGET_SOURCE_BRANCH
- TARGET_SOURCE_COMMIT_SHA
- TARGET_PATH
- TARGET_BLOB_SHA

の4点でTargetを固定する。

`TARGET_SOURCE_COMMIT_SHA` は、当該Target Blobが実際に存在するCommitを実装開始前にfresh解決し、Parent Issueまたは共通設定へ永続記録する。

`prototype/modern-3d` の現在HEADを毎runそのままTarget正本として使用してはいけない。

Targetは移動するBranchではなく、固定Commit上の固定Blobとして再現可能でなければならない。

Target Source CommitまたはBlob SHAが期待値と異なる場合は、

`TARGET_REVISION_REQUIRED`

として扱う。

旧座標・Anchor ROIを新Targetへ無断移植してはいけない。

---

## 5. G0 Child IssueのTarget統一

対象:

村 #54  
城 #68  
ダンジョン #82

G0 Child Issueに残る旧UUID画像はCURRENT Target Authorityとして扱わない。

実行時Target Authorityは必ずParent #51 / #52 / #53の現在の正本を使用する。

旧UUID画像は履歴参照として残してよいが、現行Targetと競合させない。

---

## 6. Implementation Branch / 実装ブランチ

草原:

`prototype/modern-3d`

村:

`environment/village`

城:

`environment/castle`

ダンジョン:

`environment/dungeon`

村・城・ダンジョンは同じImplementation Branchへ書き込まない。

時間差スケジュールを衝突防止の主手段にしてはいけない。

Branch Isolationを基本防御とする。

---

## 7. Lane Lease / レーン占有権

GitHub ActionsのConcurrencyだけでは、Scheduled AgentがGitHub connector経由で直接行うIssue・File・Branch mutationを保護できない。

したがって各Laneに、

`LANE_LEASE / レーン占有権`

を設ける。

### Leaseに最低限必要な情報

- LANE_ID
- OWNER_RUN_ID
- LEASE_EPOCH
- FENCING_TOKEN
- ACQUIRED_AT
- LEASE_UNTIL
- LAST_HEARTBEAT_AT
- BASE_HEAD_SHA
- CURRENT_HEAD_SHA
- LEASE_STATUS

Laneへ最初のmutationを行う前にLeaseを取得する。

別runの有効Leaseが存在する場合、そのLaneへ書き込まない。

Lease取得失敗を無視してImplementation Branchへ書き込んではいけない。

---

## 8. Lease Epoch / Fencing Token / 世代番号

Lease取得ごとに単調増加する世代番号を発行する。

`LEASE_EPOCH` と `FENCING_TOKEN` は同じ世代を表す値として扱ってよい。実装上は1つの整数フィールドへ統一してもよいが、意味は「現在のLane所有権の世代番号」である。

例:

Run A:
`LEASE_EPOCH = 41`

Run AのLease期限切れ後にRun Bが取得:
`LEASE_EPOCH = 42`

### Hard Rule

より新しい `LEASE_EPOCH` が一度でも発行された後、古いEpochを持つrunは、そのLeaseが過去に有効だったとしても、以後永久にそのLaneへmutationしてはいけない。

古いrunが停止後に復帰しても、

`CURRENT_LEASE_EPOCH > OWNED_LEASE_EPOCH`

なら直ちに

`STALE_LEASE_EPOCH`

として書き込みを停止する。

TTLだけを見てLease所有権を判断してはいけない。

### Epoch発行規則

新規Lease取得時:

`NEW_LEASE_EPOCH = PREVIOUS_LEASE_EPOCH + 1`

とする。

Epochは巻き戻してはいけない。

Lease Release後も最新Epoch値は保持する。

Control Branchを再作成する場合も、既存の最大Epochを失わないようにする。

### MutationへのFencing適用

重要なmutationには必ず自分のLease Epochを関連付ける。

対象:

- source file更新
- implementation commit
- Issue comment
- Issue close
- Parent Progress Marker更新
- Anchor Revision
- PASS記録
- integration
- evidence publication

可能な場合は記録本文またはmetadataへ

`LEASE_EPOCH: <n>`

を残す。

ただし、**Epochを記録するだけ、またはmutation直前にLeaseを確認するだけではFencing成立とみなさない。**

古いrunの書込みを確実に拒否するには、書込み受付側が現在のLease ownership / Lease Epochを検証し、古いEpochからのmutationを受理しないことを保証しなければならない。

この契約では、永続mutationを直接GitHubへ送信する経路を原則禁止し、Laneごとの

`FENCED MUTATION GATEWAY / フェンス付き書込みゲートウェイ`

を唯一の永続mutation受付口とする。

GatewayはLane単位で、以下を**同一の直列化されたCritical Section / クリティカル・セクション / 排他的処理区間**として扱う。

- Lease acquire
- Lease takeover
- Lease heartbeat
- Lease release
- source / branch mutation
- Issue comment / close
- Parent Progress Marker更新
- Anchor Revision
- PASS記録
- integration
- durable evidence publication

Gatewayはmutationを受け付ける時点で、

- `OWNER_RUN_ID`
- `LEASE_STATUS`
- `LEASE_UNTIL`
- `LEASE_EPOCH`
- expected Lane HEAD

をfresh検証し、検証成立後からmutation完了までの間にLease takeover / Epoch更新を割り込ませてはいけない。

つまり、Lease ownershipの切替と永続mutationはLane単位で同じ直列化境界を共有する。

古いEpochのrequestはGateway受付側で

`STALE_LEASE_EPOCH`

として拒否する。

Scheduled Agent、Visual Evidence Workflow、その他のrunへ、Gatewayを迂回して対象repository / Issue / branch / lease stateへ直接永続書込みできる資格情報または経路を与えてはいけない。

GitHub API等が対象mutationについて「現在Lease Epochを条件とするserver-side conditional write」を直接提供し、その条件がLease takeoverと競合せず古いEpochを受付側で拒否できる場合に限り、Gatewayと同等の実装として扱ってよい。

Issue comment / Issue close等のようにその保証を直接提供できないmutationは、必ずGateway経由とする。

**この受付側拒否保証が実装できていない状態では、「古いEpochのrunは永久にmutation禁止」というHard Ruleは未成立であり、実装開始条件を満たした扱いにしてはいけない。**

---

## 9. Lane Lease Storage Isolation / レーン占有権保存先の分離

Lane LeaseをImplementation Branchへ保存してはいけない。

Lease HeartbeatやAcquire / ReleaseのたびにImplementation BranchへCommitが発生すると、

- ACTUAL_HEAD_SHA
- RUNTIME_BUILD_SHA
- fresh exact HEAD verification
- visual evidence lineage

がLease管理操作だけで変化してしまう。

これを禁止する。

### Lease専用Control Branch

各LaneのLeaseは、Implementation Branchとは独立した専用Control Branchへ保存する。

推奨構成:

村:

`control/lease-village`

城:

`control/lease-castle`

ダンジョン:

`control/lease-dungeon`

Lease state file例:

`lane-lease.json`

各Control Branchは、そのLaneのLease情報だけを持つ。

### 共通Control Branch禁止

村・城・ダンジョンすべてのLeaseを1本の共通Control Branchへ保存することを標準方式にしてはいけない。

別Laneが同時にHeartbeat更新した場合、同じBranch refへの並行更新競合を作る可能性があるためである。

`1 Lane = 1 Lease Control Branch`

を基本とする。

---

## 10. Lease Atomic Update / 占有権の原子的更新

Lease取得・更新は、GitHub Contents APIのCurrent Blob SHAを利用した

`Compare-And-Swap / CAS / 比較して一致した場合だけ更新`

方式で実行する。

基本手順:

1. Lease Control Branch上の `lane-lease.json` をfresh取得
2. 現在のBlob SHAを取得
3. 現在の `LEASE_EPOCH` を取得
4. Leaseの有効期限とOWNER_RUN_IDを評価
5. 取得可能なら `LEASE_EPOCH + 1` の新Lease内容を作る
6. 現在Blob SHAを指定してupdateする
7. update成功時のみLease取得成功
8. update conflict時は、自分がLeaseを取得したと仮定しない
9. fresh取得して再評価する

### Hard Rule

CAS更新成功前にImplementation Branchへmutationしてはいけない。

単なる

「Issue commentを書いた」

「時刻を確認した」

「別runが見当たらない」

をLease取得成功として扱わない。

安全なCAS更新が利用できない場合:

`LANE_LEASE_UNAVAILABLE`

としてFail Closedする。

---

## 11. Mutation前Lease再確認と受付側Fencing

重要なmutationを要求する前に、Scheduled Agent側でもLeaseをfresh再確認する。

確認事項:

- OWNER_RUN_IDが自分
- LEASE_STATUSがACTIVE
- 現在時刻がLEASE_UNTILより前
- CURRENT_LEASE_EPOCHがOWNED_LEASE_EPOCHと一致
- Lane HEADが想定系列
- 外部runによる想定外HEAD変更がない

Lease Epochが自分より新しい場合:

`STALE_LEASE_EPOCH`

として永久にそのrunのmutation要求を禁止する。

### TOCTOU Hard Rule / 確認後競合の禁止

Agent側のfresh確認は早期Fail Closedのための補助防御であり、これ自体をFencing保証として扱ってはいけない。

次の順序、

1. AgentがEpochを確認
2. 別runがtakeoverして新Epochを取得
3. 古いAgentが確認済みとしてmutation

を許してはいけない。

そのため、実際の永続mutationは第8節の `FENCED MUTATION GATEWAY` が受付側で再検証し、Lease acquire / takeover / release / heartbeatと同じLane直列化境界の中でmutationを完了させる。

Gatewayが検証したEpochとmutation適用の間にLease ownership変更を挟めないことを必須とする。

Agent側確認とGateway側受付確認の両方を行うが、**安全性の最終保証はGateway側の受付拒否と直列化に置く。**

Gatewayを通さず直接行われた永続mutationは、証拠・PASS・Issue state・正式進捗として無効とする。

---


### Gateway Crash Recovery / 書込み受付停止・再起動・応答不明時の復旧契約

`FENCED MUTATION GATEWAY` は、正常稼働中の直列化だけでなく、処理途中で停止した場合にも同じFencing保証を維持しなければならない。

#### Durable Operation Journal / 永続操作台帳

Gatewayは外部へ永続mutationを送信する**前**に、Laneごとの永続Operation Journalへ最低限以下を記録する。

- `OPERATION_ID`
- `LANE_ID`
- `OWNER_RUN_ID`
- `LEASE_EPOCH`
- `TARGET_SYSTEM`
- `TARGET_RESOURCE`
- `MUTATION_TYPE`
- `EXPECTED_PRECONDITION`
- `EXPECTED_POSTCONDITION`
- `REQUEST_FINGERPRINT`
- `RETRY_CLASS`
- `OPERATION_STATE`
- `CREATED_AT`
- `LAST_UPDATED_AT`

`OPERATION_STATE` は最低限、

- `PREPARED`
- `DISPATCHED`
- `RESULT_UNKNOWN`
- `CONFIRMED_APPLIED`
- `CONFIRMED_NOT_APPLIED`
- `RECONCILIATION_REQUIRED`
- `ABORTED_BEFORE_DISPATCH`

を区別する。

外部送信後、成功・失敗結果を永続確認する前にGatewayが停止した場合、そのOperationを自動的に「失敗」とみなしてはいけない。

#### Unknown Outcome Hard Rule / 成否不明の扱い

`DISPATCHED` または `RESULT_UNKNOWN` のOperationが存在するLaneでは、Lease TTL切れだけを理由に新しいOwnerへtakeoverしてはいけない。

takeover前に必ず、そのOperationについて以下のいずれかを確定する。

1. `CONFIRMED_APPLIED`
2. `CONFIRMED_NOT_APPLIED`
3. 旧requestが今後適用されないことを対象側のfresh stateから証明
4. `RECONCILIATION_REQUIRED` としてLaneをFail Closed

結果不明状態のまま新Epochを発行してはいけない。

#### Restart Ordering / 再起動時の順序

Gateway再起動時は新規mutation受付やLease takeoverより先に、全Laneの未完了Operation Journalを復元する。

復元後は、

1. 未完了Operationのstate取得
2. target側fresh reality確認
3. expected precondition / postcondition照合
4. applied / not-applied / unknownを判定
5. 必要ならreconciliation
6. その後にのみ新規mutationまたはLease takeover

の順とする。

古いGateway processが再開して同じOperationを並行dispatchできないよう、Gateway instance自身も同じLane排他境界に参加させる。

#### Retry Class / 再送可否分類

各mutationは実装前に最低限次の2種類へ分類する。

`IDEMPOTENT_RETRY_SAFE`

- 同じ `OPERATION_ID` / request fingerprintで再送しても、対象側で重複適用されない、またはfresh stateから安全に同一結果へ収束できる。

`RESULT_CONFIRMATION_REQUIRED`

- 対象側に独自idempotency keyや条件付き更新がなく、再送で重複副作用が起こり得る。
- Issue comment投稿、非条件付き外部副作用等は原則こちらとして扱う。

`RESULT_CONFIRMATION_REQUIRED` は、応答喪失時に自動再送してはいけない。

まずtarget側fresh stateを確認し、既に適用済みかを判定する。

判定不能の場合は `RECONCILIATION_REQUIRED` としてLaneを停止する。

#### Reconciliation / 管理者復旧

自動判定不能時は、Ownerまたは明示的に許可された管理者が次を確認するまでLaneを再開しない。

- Operation Journal
- target側fresh state
- Operation fingerprint
- expected before / after state
- Lease Epoch
- current Lane HEAD
- Issue / Progress state
- Durable Evidence state

管理者は、

- applied
- not applied
- compensate
- abandon and supersede

のいずれかを明示記録する。

管理者判断を行った場合でも、過去Operation Journalを削除・上書きしてはいけない。

#### Multi-instance Gateway Rule / 複数受付機構

Gatewayを複数instanceで起動または再起動する場合でも、Lane単位の排他・Operation Journal・Lease takeoverは共通の唯一の直列化境界を使用する。

process-local mutexだけでこの保証を実装してはいけない。

#### Gateway Recovery Hard Rule

未完了Operationの結果が不明なLaneでは、

- 新Epoch発行
- Lease takeover
- PASS確定
- Issue close
- Parent progress advance
- integration

を禁止する。

この復旧契約が実装されていない場合、第8・11節のFencing保証は未成立とする。

## 12. Lease Heartbeat / 占有権延長

長時間runではmaterial checkpointごとにHeartbeatを更新する。

Heartbeat更新もCASで行う。

Heartbeatは `LEASE_EPOCH` を増加させない。同一所有runのLease延長では現在Epochを維持する。

新しいOwner RunがLeaseを取得する場合のみEpochを増加させる。

Lease期限を無制限に延ばしてはいけない。

期限切れLeaseをtakeoverする場合は、

- Implementation HEAD
- previous OWNER_RUN_ID
- previous LEASE_EPOCH
- last checkpoint
- open Issue state
- Progress Marker

をfresh確認する。

---


## 13. Lease Release / 占有権の明示解放

runが正常終了する場合、TTL切れを待たずにLane Leaseを明示Releaseする。

Releaseは、現在のLease stateをfresh取得した上で、以下をすべて満たす場合のみCAS更新で実行する。

- `OWNER_RUN_ID` が自分のrunと一致
- `LEASE_EPOCH` が自分のOwned Epochと一致
- `LEASE_STATUS` が `ACTIVE`
- より新しいEpochが発行されていない

Release時は、

`LEASE_STATUS = RELEASED`

へ更新する。

### Hard Rule

- Release時に `LEASE_EPOCH` を増加させない。
- `LEASE_EPOCH` は履歴として保持する。
- Lease state fileを削除してはいけない。
- Control Branchを削除してはいけない。
- 自分以外の `OWNER_RUN_ID` または自分より新しい `LEASE_EPOCH` を持つLeaseをReleaseしてはいけない。
- CAS conflict時はRelease成功とみなさず、fresh取得して現在stateを確認する。
- Release失敗を理由にImplementation Branchへ追加mutationしてはいけない。

正常終了時に明示Releaseできなかった場合でも、有限TTLによるtakeover経路は維持する。

次runは `LEASE_STATUS = RELEASED` を確認できれば、TTL満了を待たずに新規Lease取得手順へ進んでよい。

## 14. GitHub Actions Concurrency Lock / Actions同時実行ロック

Lane Leaseに加えて、GitHub Actions側にもLane単位のConcurrency Groupを設ける。

例:

`luke-village`

`luke-castle`

`luke-dungeon`

別Lane同士は並行可能。

同一Laneの複数Actions runは並行させない。

Actions Concurrencyは第2防御線であり、Lane Leaseの代替ではない。

---

## 15. Two-Source Checkout / 二系統入力

### Implementation Source

環境Laneのfresh exact HEAD。

### Target Source

固定された

`TARGET_SOURCE_COMMIT_SHA`

上のOwner Target画像。

Target画像がImplementation Branchに存在しないことをBLOCKERとしてはいけない。

---

## 16. Canonical Viewport Lock / 基準画面固定

各Laneは実装開始前に具体的な数値として、

- CANONICAL_VIEWPORT_WIDTH
- CANONICAL_VIEWPORT_HEIGHT
- CANONICAL_ASPECT_RATIO
- DEVICE_PIXEL_RATIO
- CROP_MODE
- LETTERBOX_OR_PADDING_RULE
- CAMERA_PROJECTION_MODE
- FOVまたはOrthographic Scale

を固定する。

Target画像decode後、そのNative Pixel Sizeを取得しCanonical Aspect Ratioの基準とする。

暗黙のstretch、crop、fit-mode変更は禁止。

---

## 17. Deterministic Evidence Mode / 証拠撮影の決定論化

Evidence撮影時には可能な範囲で以下を固定する。

- camera position
- camera target
- camera rotation
- FOV
- player position
- player orientation
- player animation state
- player animation time
- random seed
- procedural seed
- wind phase
- water phase
- environmental animation phase
- time-of-day
- lighting state
- quality preset
- viewport
- device pixel ratio

同じHEAD・同じ設定から比較可能な画像を再生成できる状態を作る。

Evidence撮影ごとに、実際に使用した上記設定値一式を

`evidence-settings.json`

として保存し、Evidence ManifestからそのSHA256と保存先を参照できるようにする。

「固定した」という宣言だけでは不十分であり、判定に使用した具体値を後から一意に復元できることを必須とする。

---

## 18. Visual Ready Gate / 撮影準備完了ゲート

固定秒数waitだけでEvidence Screenshotを撮影してはいけない。

ゲームまたは検証Harnessは、

`VISUAL_READY = true`

に相当する明示状態を提供する。

成立条件には最低限、

- required assets loaded
- models loaded
- textures loaded
- scene initialized
- camera finalized
- player finalized
- Evidence Mode applied
- first valid frame rendered
- loading overlay absent
- fatal runtime error absent
- black/blank frameではない

を含む。

---

## 19. 共通Visual Evidence Workflow / 共通視覚証拠ワークフロー

村・城・ダンジョンで重複workflowを作らない。

### Visual Evidence Workflow READ ONLY Rule / 視覚証拠処理の読取専用規則

共通Visual Evidence Workflowは原則 `READ ONLY / 読取専用` とする。

許可する処理は以下に限定する。

- repository checkout
- Target取得
- runtime build
- render
- screenshot / capture
- coordinate compare
- visual audit用データ生成
- evidence manifest生成
- artifact upload
- logs / diagnostics出力

Visual Evidence Workflowから以下を行ってはいけない。

- Implementation Branchへのcommit / push
- remote repository file mutation
- Issue / Pull Requestの作成・更新・close
- Parent Progress Marker更新
- Anchor Revisionの書き込み
- Router更新
- Lease取得・Release・Heartbeat更新
- repository ref / branch mutation
- その他の永続repository mutation

ここでいう `repository file mutation` は、GitHub等の遠隔側へ保存される永続変更を指す。

Evidence用の一時workspace内で行う、

- build output生成
- screenshot生成
- comparison image生成
- JSON生成
- diagnostics生成

などのローカル一時ファイル変更は許可する。ただしremote push / commit publication / Issue更新等へ接続してはいけない。

Workflowが古いLease Epochで遅れて完了した場合でも、Artifact生成以外の永続副作用を残せない構造にする。

Visual Evidence Workflowには、標準の読取専用認証情報以外に、対象repository / Issue / Pull Request / branch / ref / lease stateを変更可能な資格情報または代理書込み経路を提供してはいけない。

禁止対象には、write権限を持つPAT、GitHub App token、deploy key、SSH key、継承secret、外部API credential、proxy / webhook / service endpoint等を含む。

Visual Evidence Workflowから `FENCED MUTATION GATEWAY` を呼び出して永続mutationを代理実行することも禁止する。

Repository mutationは、有効なLane Leaseと最新 `LEASE_EPOCH` を持つScheduled Agentが、第8節の `FENCED MUTATION GATEWAY` へmutation requestを送る方法だけに限定する。

Visual Evidence Workflowの出力は「証拠候補」であり、それ自体がIssue stateやPASS状態を書き換えてはいけない。

Scheduled AgentはArtifact取得後にLeaseとEpochをfresh再確認し、さらにGateway受付側Fencingを通過できる場合のみ、証拠採用 / Issue / Progress Marker / PASS等のmutationを要求できる。


共通workflowへ最低限以下を渡す。

- lane
- implementation_branch
- implementation_head
- target_source_branch
- target_source_commit_sha
- target_path
- expected_target_blob_sha
- canonical_viewport
- current_child_issue
- lane_lease_owner_run_id
- lane_lease_epoch

---


#### GitHub Actions Permission Enforcement / GitHub Actions権限強制

Visual Evidence WorkflowのREAD ONLYは文章上の運用規則だけに依存してはいけない。
Workflow定義でも、GitHub Actions Tokenの権限を最小化し、書き込み不能を技術的に強制する。

最低限、Visual Evidence Workflowには以下を明示する。

```yaml
permissions:
  contents: read
```

必要な読取権限が追加で発生した場合も、用途を限定したread権限だけを明示的に追加する。

以下のwrite権限をVisual Evidence Workflowへ付与してはいけない。

- `contents: write`
- `issues: write`
- `pull-requests: write`
- `actions: write`
- `checks: write`
- `deployments: write`
- その他repository / Issue / ref / branch / lease stateを変更可能にするwrite権限

GitHub Organization / Repositoryのdefault token permissionに依存してはいけない。
Workflow file自身に最小権限を明示し、将来default permissionが変更されてもREAD ONLY境界が崩れない構造とする。

`permissions: contents: read` は必要条件だが、それだけでREAD ONLY保証成立とはみなさない。

Workflow job / reusable workflow / composite action / called scriptへ、別のwrite-capable credentialまたは代理書込み経路が渡されていないことも必須とする。

`secrets: inherit` 等で資格情報を無差別継承してはいけない。必要なread-only secretだけを明示allowlistする。

Artifact uploadはGitHub Actions標準のartifact機構を利用し、repository write権限をVisual Evidence Workflowへ与える理由にしてはいけない。

もしVisual Evidence Workflowがread-only権限では実行できない処理を要求する場合、その処理はVisual Evidence Workflowの責務ではない。
Leaseを保持するScheduled Agent側のmutation処理へ分離する。


## 20. Artifact / 検証成果物

最低限、

- target.png
- actual.png
- coordinate-audit.json
- evidence-manifest.json
- evidence-settings.json
- evaluation-contract-snapshot.md

を同一Artifactへ格納する。

Artifactは一次的な証拠候補であり、重要Checkpoint / PASSとして採用された証拠の唯一の保存先にしてはいけない。

---

## 21. Evidence Manifest / 証拠台帳

最低限以下を保持する。

- TARGET_SOURCE_BRANCH
- TARGET_SOURCE_COMMIT_SHA
- TARGET_PATH
- TARGET_BLOB_SHA
- TARGET_IMAGE_SHA256
- IMPLEMENTATION_BRANCH
- ACTUAL_HEAD_SHA
- RUNTIME_BUILD_SHA
- ACTUAL_IMAGE_SHA256
- CURRENT_CHILD_ISSUE
- LANE_ID
- LEASE_OWNER_RUN_ID
- LEASE_EPOCH
- VIEWPORT
- ASPECT_RATIO
- DEVICE_PIXEL_RATIO
- CROP_MODE
- QUALITY_PRESET
- EVIDENCE_MODE
- RANDOM_SEED
- VISUAL_READY_STATUS
- TARGET_IMAGE_WIDTH
- TARGET_IMAGE_HEIGHT
- ACTUAL_IMAGE_WIDTH
- ACTUAL_IMAGE_HEIGHT
- ARTIFACT_ID
- WORKFLOW_RUN_ID
- ARTIFACT_CREATED_AT
- VISUAL_COMPARISON_PERFORMED
- COMPARED_OBJECT_IDS
- EVIDENCE_SCHEMA_VERSION
- PARENT_ISSUE_NUMBER
- PARENT_ANCHOR_CONTRACT_REVISION_ID
- PARENT_ANCHOR_CONTRACT_SNAPSHOT_SHA256
- CHILD_ISSUE_NUMBER
- CHILD_ACCEPTANCE_CONTRACT_SNAPSHOT_SHA256
- EVIDENCE_SETTINGS_SHA256
- EVIDENCE_SETTINGS_URI
- EVIDENCE_WORKFLOW_PATH
- EVIDENCE_WORKFLOW_COMMIT_SHA
- EVIDENCE_WORKFLOW_BLOB_SHA
- AUDIT_IMPLEMENTATION_ID
- AUDIT_IMPLEMENTATION_SHA256
- DURABLE_EVIDENCE_URI
- DURABLE_EVIDENCE_SET_SHA256
- EVIDENCE_ADOPTION_STATUS
- EVIDENCE_ADOPTED_AT
- EVIDENCE_ADOPTED_BY_OWNER_RUN_ID
- EVIDENCE_ADOPTED_BY_LEASE_EPOCH


### Evaluation Contract Identity / 評価契約同一性

Evidenceごとに、判定時に使用した評価条件を固定する。

`evaluation-contract-snapshot.md` には最低限、

- Parent Issueの `FIXED REFERENCE ANCHOR LOCK` の判定時スナップショット
- 使用したAnchor Revision識別子
- Current Child Issueのobjective / acceptance / evidence requirementsの判定時スナップショット
- tolerance profile
- coordinate error rule
- Canonical Viewport rule
- Visual Gate rule

を保存する。

正本はParent / Child Issueのままとし、このsnapshotは新しい正本ではない。

目的は「そのEvidenceが、正本のどの版を使用して判定されたか」を再現可能に固定することである。

Parent / Child契約が後から変更された場合、過去Evidenceのsnapshotを書き換えてはいけない。

### Capture and Audit Implementation Identity / 撮影・監査処理同一性

Evidence Manifestから、実際に使用した

- Evidence Workflow file
- Workflow commit SHA
- Workflow blob SHA
- render / capture script
- coordinate audit script
- visual audit helper
- schema version

を一意に復元できなければならない。

外部ツールやパッケージが判定結果へ影響する場合は、そのversion / lockfile identityも `evidence-settings.json` またはmanifestへ記録する。


判定結果へ影響し得る実行環境もEvidence identityへ含める。

最低限、使用した場合は以下を記録する。

- OS / runner image identity
- browser name / version
- rendering engine version
- GPU / software renderer identity
- Node / Python等runtime version
- package lockfile identity
- container image digest
- font / asset package identity
- timezone / locale
- device scale factor
完全なbit-for-bit再現を保証できない場合でも、後から「同じ条件群だったか」を判定できる識別情報を残す。

### Runtime Identity Hard Rule

`RUNTIME_BUILD_SHA == ACTUAL_HEAD_SHA`

を必須とする。

### Image Identity Hard Rule

実際に比較したTarget/Actual画像のSHA256を保存する。

---

## 22. Coordinate Audit / 座標監査

各対象について最低限、

- OBJECT_ID
- OBJECT_TYPE
- TARGET_ROI
- ACTUAL_ROI
- DEPTH_LAYER
- TARGET_HARD_ANCHORS
- DELTA_CENTER_X
- DELTA_CENTER_Y
- DELTA_WIDTH_REL
- DELTA_HEIGHT_REL
- ROI_IOU
- TOLERANCE_PROFILE
- ANCHOR_CONTRACT_REVISION_ID
- ACCEPTANCE_CONTRACT_SNAPSHOT_SHA256
- EVIDENCE_SETTINGS_SHA256
- STATUS

を保持する。

---

## 23. Coordinate Error Definition / 座標誤差定義

### Center Error

画面全体に対するNormalized Coordinate差。

`DELTA_CENTER_X = abs(actual_center_x - target_center_x)`

`DELTA_CENTER_Y = abs(actual_center_y - target_center_y)`

### Size Error

Target Object自身のサイズに対する相対誤差。

`DELTA_WIDTH_REL = abs(actual_width - target_width) / target_width`

`DELTA_HEIGHT_REL = abs(actual_height - target_height) / target_height`

---

## 24. Coordinate Tolerance / 座標許容差

### Critical Anchor

Center:

±5%以内。

Size:

Target Object自身に対して±8%以内。

### Secondary Anchor

Center:

±8%以内。

Size:

Target Object自身に対して±12%以内。

数値合格だけでVisual PASSにしない。

---

## 25. Visual Evidence Validity / 視覚証拠有効性

Visual Evidenceの有効性は、

1. `candidate validity / 証拠候補としての成立`
2. `adoption validity / 正式採用時の成立`
3. `historical validity / 採用後の履歴有効性`

を区別する。

### Candidate Validity / 証拠候補成立

以下をすべて満たして初めて、証拠候補を評価可能とする。

- 正しいTarget Source Commit
- 正しいTarget Blob
- Target/Actual画像存在
- Image SHA256記録
- decode成功
- Canonical Viewport一致
- Evidence Mode適用
- `evidence-settings.json` 保存
- evaluation contract snapshot保存
- Visual Ready成立
- Runtime Build SHA一致
- Targetを実際に視覚取得
- Actualを実際に視覚取得
- TargetとActualを実際に比較
- Artifact ID記録
- Workflow Run ID記録
- Compared OBJECT_ID記録
- Evidence Workflow / Audit implementation identity記録

### Adoption Validity / 正式採用時成立

証拠候補をIssue / Progress Marker / PASSへ正式採用するmutationの**受付時点**で、

- 有効Lane Lease
- `LEASE_STATUS = ACTIVE`
- 最新Lease Epochと採用runのEpochが一致
- Lease期限内
- 第8・11節のFENCED MUTATION GATEWAY受付側検証成功
- expected Lane HEAD一致

を満たすことを必須とする。

正式採用成功時に、

- `EVIDENCE_ADOPTION_STATUS = ADOPTED`
- `EVIDENCE_ADOPTED_AT`
- `EVIDENCE_ADOPTED_BY_OWNER_RUN_ID`
- `EVIDENCE_ADOPTED_BY_LEASE_EPOCH`

を記録する。

### Historical Validity / 採用後の履歴有効性

適正に採用されたEvidenceは、その採用時に固定された

- Target identity
- Actual HEAD
- Parent Anchor Contract snapshot
- Child Acceptance snapshot
- Evidence Settings
- Workflow / Audit implementation identity

の組に対する履歴証拠として有効である。

その後の通常Lease Release、新しいLease Epoch発行、別runへのownership移行だけを理由に、採用済みEvidenceを無効化してはいけない。

ただし、新しいImplementation HEAD、Target revision、Anchor revision、Acceptance revision、Canonical Viewport変更、Evidence Settings変更、Workflow / Audit semantics変更に対して、過去Evidenceや過去PASSをそのまま流用してはいけない。

`VISUAL_EVIDENCE_VALID = true` は「採用時に必要条件を満たし、その固定identity tupleに対して有効」という意味であり、将来も現在Leaseを保持し続けるという意味ではない。

---


### Evidence Adoption Transaction / 証拠正式採用トランザクション

Visual PASS、Issue close、Parent Progress更新は、Evidenceの永続保存が確認される前に確定してはいけない。

正式採用は以下の順序を必須とする。

1. Evidence Candidateを生成する。
2. `EVIDENCE_ID` と一意の `ADOPTION_ID` を**保存前に確定・予約**する。
3. `EVIDENCE_ID` と `ADOPTION_ID` の対応関係をOperation Journalへ永続記録し、`IDENTIFIERS_RESERVED` とする。
4. 確定した `EVIDENCE_ID` を使用して、Evidence一式をDurable Evidence Storeの
   `evidence/<LANE_ID>/issue-<CHILD_ISSUE>/<EVIDENCE_ID>/`
   へappend-only保存する。
5. 保存先からEvidence一式をfresh再取得する。
6. 各ファイルのSHA256、manifest、settings、contract snapshotが一致することを確認する。
7. `FENCED MUTATION GATEWAY` の同一Lane排他区間で、
   - current Lease
   - latest Lease Epoch
   - expected Lane HEAD
   - Target identity
   - Anchor / Acceptance revision
   - Durable Evidence URI
   - Durable Evidence Set Hash
   をfresh再確認する。
8. `ADOPTION_ID` に結び付いた正式採用の確定記録をOperation Journalへ永続記録する。
9. Evidenceを `ADOPTED` と確定する。
10. 同じ `ADOPTION_ID` を参照してChild Issue PASS / closeを行う。
11. Parent Progress Markerを同じ `ADOPTION_ID` でadvanceする。

**Durable Evidenceのfresh read-back verificationが完了する前に、PASS / Issue close / Parent advanceを書き込んではいけない。**

### Identifier Reservation Hard Rule / 識別子予約の強制規則

`EVIDENCE_ID` と `ADOPTION_ID` はDurable Evidence保存より前に確定し、その対応関係を永続Operation Journalへ記録しなければならない。

予約済み識別子は、途中停止・再起動・再試行時に新しく採番してはいけない。

再開時は最初に永続記録された同一 `EVIDENCE_ID` / `ADOPTION_ID` を再利用する。

識別子を予約しただけではEvidenceを正式採用済みとみなしてはいけない。

最低限、次の状態を区別する。

- `IDENTIFIERS_RESERVED`
- `DURABLE_STORED_NOT_ADOPTED`
- `ADOPTED_CHILD_NOT_CLOSED`
- `CHILD_CLOSED_PARENT_NOT_ADVANCED`
- `ADOPTION_RESULT_UNKNOWN`

`IDENTIFIERS_RESERVED` のままEvidence保存前に停止した場合は、同じ識別子で保存処理から再開する。

同じEvidence Candidateに対して別の `EVIDENCE_ID` / `ADOPTION_ID` を発行し直すことを禁止する。

#### Partial Failure / 途中停止時の扱い

以下を明確に区別する。

`IDENTIFIERS_RESERVED`

- `EVIDENCE_ID` / `ADOPTION_ID` の予約と永続記録は完了したが、Evidence保存前に停止した状態。
- 許容する。
- 再開時は予約済みの同じ識別子を使用してDurable Evidence保存から続行する。
- 新しい識別子を発行してはいけない。

`DURABLE_STORED_NOT_ADOPTED`

- Evidence本体は永続保存済みだが、正式採用前に停止した状態。
- 許容する。
- 再開時は同じ `EVIDENCE_ID` / `ADOPTION_ID` から続行する。
- 新しいEvidenceとして重複採用してはいけない。

`ADOPTED_CHILD_NOT_CLOSED`

- 正式採用記録はあるが、Child Issue close前に停止した状態。
- 再開時は同じ `ADOPTION_ID` を使って不足mutationだけを再開する。

`CHILD_CLOSED_PARENT_NOT_ADVANCED`

- Child closeは完了したがParent Progress更新前に停止した状態。
- 再開時は同じ `ADOPTION_ID` に基づきParent Progressのみを補完する。

`ADOPTION_RESULT_UNKNOWN`

- 正式採用mutationの結果が不明。
- 第11節のGateway Crash Recoveryへ戻し、新Epoch発行を禁止する。

#### Idempotent Adoption / 採用処理の冪等性

`ADOPTION_ID` はLane + Child Issue + Evidence IDに対して一意とする。

Issue comment、close、Parent Progress更新には可能な限り `ADOPTION_ID` を記録し、再開時に既適用かfresh確認する。

同じ `ADOPTION_ID` による重複PASS、重複close、重複Parent advanceを禁止する。

#### Manifest Finalization / Manifest確定方法

Evidence Candidate生成時点では、採用時にしか確定しない値をimmutableなcandidate manifestへ無理に書き込まない。

最低限、

- `evidence-manifest.candidate.json`
- `evidence-adoption-record.json`

を分離する。

Candidate manifestはEvidence生成時に確定し、append-onlyで保持する。

Adoption recordは正式採用時に作成し、

- `ADOPTION_ID`
- adoption status
- adopted at
- adopted by owner run
- adopted lease epoch
- durable evidence URI
- durable evidence set hash
- Issue / Parent mutation結果

を記録する。

既存candidate manifestを採用時に上書きしてはいけない。

## 26. PASSの分離

### Functional Pass

移動、衝突、操作、ロード、経路。

### Automated Pass

CI、SHA、Artifact、座標監査等。

### Visual Pass

TargetとActualの実画像比較。

相互代用は禁止。

---

## 27. Visual Status

比較不能時:

`NOT_EVALUABLE`

PASS/FAILへ推測変換しない。

---

## 28. Same Coordinate, Same Object

固定OBJECT_IDについて同じ意味の対象をTarget対応位置へ置く。

橋を岩で代替しない。

川を影で代替しない。

道を草地で代替しない。

誤差を木・霧・影・照明・装飾で隠さない。

---

## 29. G0優先順位

### 村

カメラ、主人公、広場、左右建物群、噴水、教会／大型建物、階段／道軸。

### 城

カメラ、主人公、絨毯中心線、柱間隔、階段、玉座、左右壁／窓群。

### ダンジョン

カメラ、主人公、主経路、橋、高低差、水路ギャップ、上層扉、側面足場、滝。

---

## 30. Visual Gate

Visual PASSを書き込む**採用mutation受付時点**には最低限、

1. 有効なLane Lease
2. 最新Lease Epoch一致
3. 第8・11節のFENCED MUTATION GATEWAY受付側検証成功
5. fresh exact HEAD
5. 正しいTarget Commit
6. 正しいTarget Blob
7. Canonical Viewport一致
8. Evidence Mode適用
9. Visual Ready成立
10. 有効Artifact
11. Target実画像視覚取得
12. Actual実画像視覚取得
13. Same ROI比較
14. Coordinate Audit
15. Tolerance判定
16. Image SHA256整合
17. Runtime Build SHA整合
18. Child Issue Acceptance成立

を必要とする。


PASS mutationが正常に採用された後、通常Lease Releaseまたは後続Epoch発行だけを理由に、そのPASS履歴を取り消してはいけない。

ただしPASSは、そのEvidence Manifestに固定されたidentity tupleにのみ適用される。
Implementation / Target / Anchor / Acceptance / Viewport / Evidence Settings / Audit semanticsのいずれかが変わった場合は、fresh evidenceによる再判定を必要とする。

---

## 31. Failure Handling

- `LANE_LEASE_CONFLICT`
- `LANE_LEASE_UNAVAILABLE`
- `LANE_HEAD_CONFLICT`
- `STALE_LEASE_EPOCH`
- `TARGET_FETCH_FAILED`
- `TARGET_SOURCE_COMMIT_MISMATCH`
- `TARGET_REVISION_REQUIRED`
- `ACTUAL_RENDER_FAILED`
- `VISUAL_READY_FAILED`
- `VISUAL_READY_TIMEOUT`
- `VIEWPORT_MISMATCH`
- `IMAGE_HASH_MISMATCH`
- `RUNTIME_BUILD_SHA_MISMATCH`
- `VISUAL_EVIDENCE_INVALID`
- `NOT_EVALUABLE`
- `VISUAL_FAIL`

状態を単なるBLOCKERへ圧縮しない。

---

## 32. Durable Evidence / 永続証拠

Actions Artifactは一時的な証拠候補であり、重要Checkpoint / PASSの唯一の永続保存先にしてはいけない。

### Durable Evidence Store / 永続証拠保管先

この契約の標準永続保管先を、Implementation Branchとは分離した専用branch

`evidence/visual-verification`

とする。

永続Evidenceはappend-onlyで保存し、既存Evidence setを上書きしてはいけない。

標準path:

`evidence/<LANE_ID>/issue-<CHILD_ISSUE>/<EVIDENCE_ID>/`

最低限、以下を保存する。

- `target.png`
- `actual.png`
- `coordinate-audit.json`
- `evidence-manifest.json`
- `evidence-settings.json`
- `evaluation-contract-snapshot.md`

必要に応じて、

- comparison overlay
- diagnostics
- traversal evidence
- Functional / Automated test outputs

も同じEvidence setへ保存する。

このbranchへのpublicationもrepository mutationであるため、第8・11節のFENCED MUTATION GATEWAY経由でのみ行う。

Visual Evidence Workflow自身はこのbranchへ書き込んではいけない。


### Shared Durable Evidence Branch Concurrency / 共通証拠ブランチ競合

`evidence/visual-verification` を3レーンで共有する場合、Lane Leaseだけではbranch ref更新競合を防げない。

Evidence publication時は、必ず最新branch HEADをfresh取得し、expected HEADを条件とする更新を行う。

競合した場合はforce pushや上書きで解消してはいけない。

次のいずれかで安全に再試行する。

- 最新evidence branch HEADへ自分のappend-only Evidence commitをrebase / rebuildして条件付き更新
- Evidence publicationだけを短時間の共通publication lockで直列化

LaneごとのEvidence pathを上書きせず、既存Evidence setを保持すること。

Evidence branch競合はImplementation Lane Leaseのownership変更理由にはしない。

### Retention / 保持方針

以下を永続保存対象とする。

- Gate PASSに採用されたEvidence
- Parent最終PASSに採用されたEvidence
- Anchor Revision直前・直後の重要Checkpoint
- root cause判定やrollback根拠として明示採用された重要Checkpoint

これらは自動削除・自動失効させてはいけない。

Repository / Programが存続する間は保持する。

将来、保管先を移行する場合も、Owner承認のmigrationとして

- 元Evidence ID
- 移行先URI
- 全ファイルSHA256
- migration timestamp
- migration reason

を残し、後から同一Evidence本体を取得できる状態を維持する。

通常の不採用trial / rejected candidateはActions Artifact retentionに従って失効してよい。ただし正式な判断根拠として引用する前にDurable Evidenceへ昇格させる。


### Durable Evidence Set Hash / 証拠集合照合値

`DURABLE_EVIDENCE_SET_SHA256` は自己参照を避ける。

標準計算方式:

1. Evidence set内の対象ファイル名と各ファイルSHA256を正規順序で列挙する。
2. `evidence-set-index.json` を生成する。
3. `evidence-set-index.json` 自身の `DURABLE_EVIDENCE_SET_SHA256` 欄は計算対象に含めない、またはその欄を持たない。
4. canonicalized index contentのSHA256を `DURABLE_EVIDENCE_SET_SHA256` とする。
5. Adoption recordからその値を参照する。

自己自身の完成後hashを自己内部へ無限再帰的に埋め込む仕様にしてはいけない。

### IssueへのDurable Reference / 課題側の永続参照

重要CheckpointとPASS時にはIssueへ最低限、

- Workflow Run ID
- Artifact ID
- Durable Evidence URI
- Durable Evidence Set SHA256
- Target Source Commit SHA
- Target Blob SHA
- Target Image SHA256
- Actual HEAD SHA
- Runtime Build SHA
- Actual Image SHA256
- Lane ID
- Lease Owner Run ID
- Lease Epoch
- Evidence Adoption Status
- Evidence Adopted At
- Canonical Viewport
- Evidence Settings SHA256
- Parent Anchor Contract Revision ID
- Parent Anchor Contract Snapshot SHA256
- Child Acceptance Contract Snapshot SHA256
- Evidence Workflow Commit / Blob SHA
- Audit Implementation identity
- Visual Ready
- Compared OBJECT_ID
- Coordinate Audit主要結果
- Functional Status
- Automated Status
- Visual Status
- 判定理由
- Remaining Defects
- Next Exact Action

を記録する。

Issueに参照が残ることと、Evidence本体が永続保管されることは別条件であり、両方を満たさなければDurable Evidence成立とみなさない。

---

## 33. Shared Core Synchronization / 共通コア同期

各Laneは

- CORE_SOURCE_BRANCH
- CORE_BASE_SHA

を記録する。

Camera、FOV、Player Scale、Projection、Renderer等の構図影響変更は自動同期禁止。

G0/G6再検証後に取り込む。

---

## 34. Final Integration Rule / 最終統合規則

個別Lane PASSはゲーム全体PASSではない。

最終統合後、

- core compatibility
- scene transition
- player continuity
- camera
- input
- collision
- asset namespace
- performance
- visual regression

を再確認する。

各LaneのCanonical Viewを再生成し、統合前より悪化していないことを確認する。

---


### Promotion Authority / 本線変更権限

本節は統合後の再検証条件を定めるものであり、本線へのpromotion権限そのものを新設しない。

Environment Laneから、

- Parent #12
- `WORK_PACKET_ROUTER:v1`
- canonical modern-3d CURRENT_PACKET
- grassland本線
- stable / default integration target

へ変更を反映するには、既存のOwner明示promotion authorityを満たすこと。

Visual PASS、Parent Environment PASS、Integration revalidation成功だけを根拠に、自動でcanonical本線へpromotionしてはいけない。

## 35. Grassland Compatibility / 草原との統一

草原で成立している

Target  
+  
fresh Actual  
+  
Artifact  
+  
Visual Comparison

の方式を一般化する。

過去判定については、

実画像比較済み

と

自動検証のみ

を区別する。

---

## 36. OwnerをDefect Detectorにしない

AIが発見可能な客観的不具合をOwnerへ転嫁しない。

Owner確認は主観的体験、方向変更、最終承認等に限定する。

---

## 37. 実装前フリーズ条件

以下を満たすまで実装しない。

- Scheduled Promptを変更しない
- Parent Issue Anchor Lockを唯一の座標正本とする
- G0旧Target参照を親正本へ統一
- Target SourceとImplementation Sourceを分離
- Target Source Commitを固定
- Target Blob SHAを固定
- 各Lane Implementation Branchを分離
- LeaseをImplementation Branchへ保存しない
- 1 Lane = 1専用Lease Control Branch
- LeaseをCASで取得・更新する
- **新規Lease取得ごとにLEASE_EPOCHを単調増加させる**
- **古いEpochのrunは永久にmutation禁止**
- **HeartbeatではEpochを増加させない**
- CAS失敗時は書き込み禁止
- Mutation前にLeaseと最新Epochを再確認
- Actions Concurrencyを第2防御線として使用
- Canonical Viewport実数値を固定
- Evidence Modeを決定論化
- Visual Ready成立後のみ撮影
- 共通Evidence Workflowを使用
- Target/Actualを同一Artifactへ格納
- Evidence Manifestを保存
- Image SHA256を保存
- `RUNTIME_BUILD_SHA == ACTUAL_HEAD_SHA`
- Coordinate Error定義を固定
- Coordinate Toleranceを固定
- 実画像を開けなければVisual PASS禁止
- `NOT_EVALUABLE`を正式状態化
- Functional / Automated / Visual PASSを分離
- Artifactだけを永続SSOTにしない
- Shared Core revisionを管理
- 構図影響Core変更を自動同期しない
- 統合後Visual Regressionを再検証
- Ownerを通常のDefect Detectorとして使わない

- 正常終了時は同じ `OWNER_RUN_ID + LEASE_EPOCH` でCAS Releaseし、`LEASE_STATUS=RELEASED` にする
- Release時にEpochを保持し、Lease state file / Control Branchを削除しない
- 共通Visual Evidence WorkflowをREAD ONLYに固定する
- Visual Evidence Workflowからrepository / Issue / Lease mutationを禁止する
- 永続mutationは有効Leaseと最新Epochを保持するScheduled Agentだけが行う
- Visual Evidence Workflowに `permissions: contents: read` を明示し、GitHub Actions Tokenを技術的にもREAD ONLYへ固定する
- Visual Evidence Workflowにrepository / Issue / PR / branch / refを変更可能なwrite権限を付与しない
- **FENCED MUTATION GATEWAYを唯一の永続mutation受付口とする**
- **Lease acquire / takeover / heartbeat / releaseと永続mutationをLane単位で同じ直列化境界へ入れる**
- **Gateway受付側で古いLEASE_EPOCHを拒否し、検証後からmutation完了までownership切替を割り込ませない**
- **Gatewayを迂回する直接repository / Issue / branch / lease mutation資格情報をScheduled Agentへ与えない**
- **Issue comment / closeを含め、受付側Fencingを保証できないmutationは実装開始不可とする**
- `evidence-settings.json` に実際のcamera / lighting / animation / seed / viewport等の具体値を保存する
- `evaluation-contract-snapshot.md` にParent Anchor ContractとChild Acceptance Contractの判定時snapshotを保存する
- Evidence Manifestから撮影Workflow / Audit処理の版を一意に復元可能にする
- Durable Evidence Storeとして `evidence/visual-verification` を使用し、採用Evidence本体をappend-only保存する
- PASS / 重要Checkpointではtarget.png / actual.png / coordinate audit / manifest / settings / contract snapshotを永続保存する
- 採用EvidenceをRepository / Program存続中は自動削除・自動失効させない
- Visual Evidence Workflowへwrite-capable PAT / App token / deploy key / SSH key / proxy等を渡さない
- Visual Evidence Workflowで `secrets: inherit` による無差別資格情報継承を禁止する
- READ ONLYのrepository mutation禁止はremote永続変更を意味し、Evidence workspace内の一時生成物は許可する
- Evidence採用 / PASS mutation受付時には有効Leaseと最新Epochを要求する
- 適正採用済みEvidenceは通常Lease Release / Epoch更新だけでは無効化しない
- 過去PASSは固定identity tupleにのみ有効で、Implementation / Target / Anchor / Acceptance / Settings等の変更後へ流用しない

**上記のうち、受付側Fencing、Gateway Crash Recovery、Evidence ID / Adoption IDの保存前予約、Durable Evidence保存・fresh read-back確認、Evidence Adoption再開契約、Evidence条件版固定、TEST-1〜TEST-5の隔離安全試験が未成立の場合はFail Closedとし、本番Environment Laneの自律実装開始条件を満たした扱いにしない。**
- **Gateway外部送信前にOperation JournalへOPERATION_ID / Epoch / target / expected state / operation stateを永続記録する**
- **RESULT_UNKNOWNのOperationがあるLaneではLease takeover / 新Epoch発行を禁止する**
- **Gateway再起動時は未完了Operation reconciliationを新規mutationより先に実行する**
- **mutationをIDEMPOTENT_RETRY_SAFEとRESULT_CONFIRMATION_REQUIREDへ分類する**
- **結果確認不能時のRECONCILIATION_REQUIREDと管理者復旧手順を実装する**
- **Durable Evidenceを保存後にfresh read-backしてhash一致確認するまでPASS / close / Parent advanceを禁止する**
- **EVIDENCE_IDとADOPTION_IDを分離し、途中停止後は同じADOPTION_IDから冪等再開する**
- **candidate manifestとadoption recordを分離し、candidate Evidenceを採用時に上書きしない**
- **共有evidence branch更新はexpected HEAD条件付き更新または短時間publication lockで競合処理する**
- **DURABLE_EVIDENCE_SET_SHA256の自己参照を禁止しcanonical evidence-set-indexから計算する**
- **browser / renderer / runner / container等、視覚結果へ影響する実行環境identityをEvidenceへ記録する**
- **Freeze前でも安全基盤そのものは隔離test contextで構築・検証可能とする**
- **Environment PASSだけではcanonical本線へのpromotion authorityを得ない**
- **EVIDENCE_ID / ADOPTION_IDをDurable Evidence保存前に予約し、対応関係をOperation Journalへ永続記録する**
- **IDENTIFIERS_RESERVED状態から同じ識別子で再開できるようにする**
- **識別子予約だけではEvidence採用済みと扱わない**
- **TEST-1〜TEST-5の隔離故障注入試験をfresh evidence付きでPASSする**
### Isolated Safety Foundation Test Gate / 安全基盤の隔離必須試験

本番Environment Laneの自律mutation運用を開始する前に、安全基盤を隔離test contextで実装し、最低限以下の故障注入試験をPASSさせる。

#### TEST-1 外部書込み応答消失

条件:
- Gatewayが外部mutationをdispatchした後、応答だけを喪失させる。

必須結果:
- Operationを安易に失敗扱いしない。
- 自動再送しない対象は再送しない。
- 「現在変更が見えない」だけで「今後も適用されない」と判定しない。
- `RESULT_UNKNOWN` 中はLease takeover / 新Epoch発行を禁止する。
- fresh stateから適用済み / 未適用 / 確認不能を正しく分岐する。

#### TEST-2 古いGateway processの復帰

条件:
- 旧Gateway processを停止させ、新Gatewayを起動した後に旧processを復帰させる。

必須結果:
- 旧processが新processと並行して永続mutationできない。
- process-local lockではなく共通Lane排他境界で拒否される。
- 古いEpochまたは古いGateway ownershipからのmutationは受付側でFail Closedする。

#### TEST-3 Evidence保存・採用・Issue/Parent更新の途中停止

最低限、以下の各地点で強制停止する。

- `IDENTIFIERS_RESERVED` 後、Durable Evidence保存前
- Durable Evidence保存後、fresh read-back前
- read-back成功後、正式採用前
- 正式採用後、Child close前
- Child close後、Parent Progress更新前

必須結果:
- 最初に予約した同じ `EVIDENCE_ID` / `ADOPTION_ID` から不足分だけ再開する。
- 重複Evidence、重複採用、重複PASS、重複close、重複Parent advanceを発生させない。
- Durable Evidence未確認の状態でPASSを確定しない。

#### TEST-4 3レーン同時Evidence publication

条件:
- Village / Castle / Dungeonが同時に `evidence/visual-verification` へpublishする。

必須結果:
- 既存Evidence setを失わない。
- force pushしない。
- expected HEAD競合を検出し、安全にrebase / rebuildまたは共通publication lockで再試行する。
- Lane間Evidenceを上書きしない。

#### TEST-5 古いEvidence・異なる評価条件の採用拒否

条件:
- 古いImplementation HEAD
- 異なるTarget revision
- 異なるAnchor revision
- 異なるAcceptance revision
- 異なるViewport / Evidence Settings
- 異なるAudit semantics

のEvidenceを現在のPASS採用へ渡す。

必須結果:
- identity mismatchを検出する。
- 現在のPASSへ採用しない。
- 過去Evidence自体のHistorical Validityは壊さない。

### Safety Test Exit Criteria / 安全基盤試験の終了条件

上記5試験について、

- test input
- injected failure
- expected result
- actual result
- relevant Operation Journal
- relevant Lease / Epoch state
- Evidence / Adoption state
- PASS / FAIL
- remaining defect

をdurable test recordとして保存する。

5試験すべてがfresh evidence付きでPASSするまで、本番Village / Castle / Dungeon Laneの自律mutationを有効化してはいけない。

安全基盤の実装・試験に進むこと自体は許可するが、試験PASS前に「このまま問題なく本番運用できる」と判定してはいけない。

### Freeze Scope / フリーズ条件の適用範囲

本節の「実装開始条件を満たすまで実装へ進まない」は、Village / Castle / Dungeonの**環境制作・自律mutation運用を本契約下で開始しない**という意味である。

以下の安全基盤そのものを構築・検証する作業まで禁止するものではない。

- FENCED MUTATION GATEWAY
- Operation Journal
- Lease / Epoch / Release
- Visual Evidence READ ONLY Workflow
- Durable Evidence publication
- Evidence adoption recovery
- test harness / fault injection

ただし安全基盤の構築・検証は、Environment production dataや正式Issue stateへ副作用を与えない隔離test contextで行う。

安全基盤の検証完了前に、本番Environment Laneの自律書込みを有効化してはいけない。

この条件成立後に実装へ進む。