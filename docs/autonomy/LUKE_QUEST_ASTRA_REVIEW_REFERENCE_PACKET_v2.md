# LUKE QUEST 環境レーン共通・視覚検証契約
## Astraレビュー用 参照情報パケット v2

**用途:**  
`docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`
をAstraが敵対的・実装可能性レビューする際の補助参照。

**重要:**  
このファイルは契約本文の正本ではない。  
契約本文を上書き・再定義しない。  
ここに書かれたCurrent Stateは、実装レビュー時にはGitHub上のFresh Realityを優先すること。

---

## 1. レビュー対象

Primary Review Target:

`docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`

Astraには、この契約を以下の観点でレビューさせる。

1. 安全性
2. 古いrun / zombie run耐性
3. Lease / Epoch / Fencingの実装可能性
4. GitHub上での原子的または直列化されたmutation実現性
5. Visual Evidenceの再現性
6. 証拠本体の永続性
7. Evidenceの版追跡可能性
8. READ ONLY境界の実効性
9. PASS / Evidence adoptionの時間的整合性
10. 村・城・ダンジョン3レーンの並列実行時の競合耐性
11. 将来レーン追加時の拡張性
12. 過剰設計・不要複雑化がないか
13. 実装開始を止める欠陥が残っていないか

Astraは問題を無理に作らず、
**実際に実装または運用を壊し得る欠陥だけを指摘すること。**

---

## 2. 対象Repository

Repository:

`nisiyasu/-luke-quest`

Canonical default branchはレビュー開始時にGitHubからfresh確認すること。

---

## 3. Environment Lane構成

現在の設計対象は以下の3レーン。

### Village / 村

Parent Program Issue:

`#51 [ENV-VILLAGE] Owner Target Reconstruction Program`

Target Authority:

`references/target-quality/environments/VILLAGE_TARGET_OWNER_20260914.png`

Target Source Branch:

`prototype/modern-3d`

Implementation Lane Branch:

`environment/village`

Child execution order:

- G0 #54
- G1 #55 -> #56
- G2 #57 -> #58 -> #59
- G3 #60 -> #61
- G4 #62 -> #63 -> #64 -> #65
- G5 #66
- G6 #67

---

### Castle / 城内

Parent Program Issue:

`#52 [ENV-CASTLE] Owner Target Reconstruction Program`

Target Authority:

`references/target-quality/environments/CASTLE_INTERIOR_TARGET_OWNER_20260914.png`

Target Source Branch:

`prototype/modern-3d`

Implementation Lane Branch:

`environment/castle`

Child execution order:

- G0 #68
- G1 #69 -> #70
- G2 #71 -> #72 -> #73
- G3 #74
- G4 #75 -> #76 -> #77 -> #78 -> #79
- G5 #80
- G6 #81

---

### Dungeon / ダンジョン

Parent Program Issue:

`#53 [ENV-DUNGEON] Owner Target Reconstruction Program`

Target Authority:

`references/target-quality/environments/DUNGEON_TARGET_OWNER_20260914.png`

Target Source Branch:

`prototype/modern-3d`

Implementation Lane Branch:

`environment/dungeon`

Child execution order:

- G0 #82
- G1 #83 -> #84 -> #85
- G2 #86 -> #87 -> #88 -> #89
- G4 #90 -> #91 -> #92 -> #93
- G5 #94
- G6 #95

---

## 4. Parent Issue側に既に存在する重要契約

Parent Issues #51 / #52 / #53 には、

`FIXED REFERENCE ANCHOR LOCK v1`

が存在する。

基本思想:

- stable component ID
- Target画像上のnormalized ROI
- nearby hard anchors
- depth layer
- reference objectの勝手な差替え禁止
- reference変更は明示的Anchor Revisionとして記録

今回の共通契約は、
この座標契約の新しい正本を作るものではない。

**Parent Issue側を座標・参照対象の正本として維持する。**

Astraは、
共通契約とParent Issueの既存契約が二重正本化していないか確認すること。

---

## 5. Target画像の役割

3枚のOwner Target画像は、

`prototype/modern-3d`

に保存されている。

重要:

Target Source Branchが `prototype/modern-3d` であることは、
Environment implementation branchを
`prototype/modern-3d`
へ固定する意味ではない。

Targetは参照専用authority。

Implementationは各独立Lane Branchで進める。

---

## 6. 独立Laneの狙い

Grassland本線とは分離して、

- grassland: `prototype/modern-3d`
- village: `environment/village`
- castle: `environment/castle`
- dungeon: `environment/dungeon`

とする。

環境LaneはCanonical #12 Routerとは別系統。

Ownerの明示Promotionなしに、

- Parent #12
- WORK_PACKET_ROUTER:v1
- canonical modern-3d CURRENT_PACKET

をEnvironment Laneから変更しない。

Astraは、
この分離が契約本文のLease / Evidence / Integrationルールと矛盾しないか確認すること。

---

## 7. Scheduled Runの前提

Village / Castle / Dungeonはそれぞれ独立したScheduled Runとして動く。

過去の運用では時間をずらして起動しているが、
**時刻ずらしだけを排他制御として信用しない。**

設計上の安全性は、

- Lane isolation
- Lane Lease
- Lease Epoch
- Fencing
- FENCED MUTATION GATEWAY
- Actions concurrency
- Evidence READ ONLY

で成立させる。

Astraは、
「スケジュールが重ならない前提」が暗黙に残っていないか確認すること。

---

## 8. Lease保存先

Implementation Branch上にLease stateを置くと、
heartbeatだけでImplementation HEADが動くため不適切。

設計ではLaneごとに独立したControl Branchを使用する。

- `control/lease-village`
- `control/lease-castle`
- `control/lease-dungeon`

共有1本のControl Branchにはしない。

目的:

- Lane間のlease commit競合回避
- Implementation HEADの純化
- ACTUAL_HEAD_SHAとLease更新の分離

Astraは、
Control Branch方式がGitHubの実運用で十分安定しているか、
より単純で強い実装手段があるかも評価してよい。

ただし代替案を出す場合は、
現在の契約が保証している性質を落としてはいけない。

---

## 9. Lease Stateで想定する主な項目

最低限:

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

Lease Epoch / Fencing Tokenは、
新しいOwner acquisition時のみ増加する。

heartbeatでは増加しない。

古いEpochのrunは、
新しいEpochが発行された時点で永久にmutation不可とする。

---

## 10. 今回特にレビューしてほしい最重要点

候補7で導入した

`FENCED MUTATION GATEWAY`

が最重要。

背景:

単純な

1. Lease確認
2. mutation

ではTOCTOU競合が残る。

そのため候補7では、
Lease acquire / takeover / heartbeat / releaseと
永続mutationを
**Lane単位の同じ直列化境界**
へ入れる構造にした。

Astraに確認してほしいこと:

1. GitHub API / GitHub Actions / GitHub App等でこのGatewayを現実的に実装可能か
2. Issue comment / Issue close / branch push等まで古いEpochを受付側で拒否可能か
3. Gateway自体のsingle point of failureやdeadlock risk
4. Gateway crash時の回復方法が不足していないか
5. Gatewayの直列化方式とLease takeoverの整合性
6. CASだけでは不足する箇所がどこか
7. もっと単純な実装で同等保証を得られるか

この点で保証が成立しない場合、
「設計としてGO」と判定しないこと。

---

## 11. Visual Evidenceの基本構造

共通Visual Evidence Workflowは、

**READ ONLY / 読取専用**

とする。

許可:

- checkout
- Target取得
- build
- render
- screenshot
- compare
- coordinate audit
- evidence manifest生成
- artifact upload
- diagnostics出力

禁止:

- Implementation Branchへのcommit / push
- Issue更新
- Parent Progress Marker更新
- Anchor Revision更新
- Lease mutation
- branch / ref mutation
- repositoryへの永続mutation
- FENCED MUTATION GATEWAY経由の代理mutation

重要:

Evidence workspace内での

- screenshot生成
- build output生成
- JSON生成
- comparison image生成

などの一時ファイル変更は許可する。

禁止するのは
**remote側に残る永続mutation**。

---

## 12. Visual Evidence Workflowの認証境界

最低限:

```yaml
permissions:
  contents: read
```

を明示。

ただし、
これだけでREAD ONLY成立とはみなさない。

Evidence Workflowには、

- write PAT
- write可能GitHub App token
- deploy key
- SSH key
- write-capable secret
- proxy
- webhook
- external write service
- mutation gateway credential

等を渡さない。

`secrets: inherit`
による無差別継承も禁止。

Astraは、
reusable workflow / composite action / called script経由で
書込み資格情報が漏れる経路がないか確認すること。

---

## 13. Evidence Artifact

共通Artifactには最低限、

- target.png
- actual.png
- coordinate-audit.json
- evidence-manifest.json
- evidence-settings.json
- evaluation-contract-snapshot.md

を含める。

Actions Artifactは一時Evidence Candidate。

重要Checkpoint / PASSの唯一の永続正本にはしない。

---

## 14. Durable Evidence Store

候補7では、

`evidence/visual-verification`

を標準の永続Evidence branchとしている。

標準path:

`evidence/<LANE_ID>/issue-<CHILD_ISSUE>/<EVIDENCE_ID>/`

最低限保存:

- target.png
- actual.png
- coordinate-audit.json
- evidence-manifest.json
- evidence-settings.json
- evaluation-contract-snapshot.md

Gate PASS、Parent最終PASS、重要Checkpoint等は
自動削除・自動失効させない。

Astraには特に、

1. Git repositoryを画像Evidenceの永続保管先にすることの妥当性
2. repository size増大
3. Git LFSの必要性
4. immutable / append-only保証
5. branch protection
6. Evidence garbage collection policy
7. migration方法

をレビューさせる。

必要なら、
より適切な永続ストレージを提案してよい。

ただし、
IssueにURIだけ残りEvidence本体が消える構造へ戻してはいけない。

---

## 15. Evidence再現性

Evidenceごとに、

`evidence-settings.json`

へ実際の撮影条件を保存する。

例:

- viewport width / height
- aspect ratio
- DPR
- crop
- padding
- projection
- FOV / ortho scale
- camera transform
- player transform
- animation frame / time
- random seed
- procedural seed
- lighting state
- time state
- wind / water state
- deterministic evidence mode parameters

「固定した」という宣言だけでは不足。

実際の値一式を後から復元可能にする。

---

## 16. 評価条件の版固定

正本はParent / Child Issueのまま。

Evidenceでは、

`evaluation-contract-snapshot.md`

として判定時に使用した内容をsnapshotする。

含めるもの:

- Parent FIXED REFERENCE ANCHOR LOCK
- Anchor Revision ID
- Child objective
- Child acceptance
- Child evidence requirement
- tolerance profile
- coordinate error rule
- Canonical Viewport rule
- Visual Gate rule

snapshotは正本ではない。

目的は、
**過去Evidenceが正本のどの版で評価されたか**
を再現するため。

---

## 17. Workflow / Audit実装版

Evidence Manifestから、

- Evidence Workflow path
- Workflow commit SHA
- Workflow blob SHA
- render / capture script identity
- coordinate audit implementation identity
- visual audit helper identity
- schema version
- relevant package / lockfile identity

を一意に復元できること。

Astraは、
これで十分か、
container image digestやbrowser version等も必須化すべきか評価すること。

---

## 18. Evidence Adoptionの時間的区別

候補7では3状態を分離する。

### Candidate Validity

Artifactとして正しく生成・比較可能。

### Adoption Validity

Issue / PASS / Progressへ正式採用する時点で、

- Active Lease
- current Lease Epoch
- expected HEAD
- Fenced Gateway受付成功

が必要。

### Historical Validity

正しく採用されたEvidenceは、
通常のLease Releaseや新Epoch発行だけでは無効にならない。

ただし、

- Implementation HEAD
- Target
- Anchor Revision
- Acceptance
- Viewport
- Evidence Settings
- Workflow / Audit semantics

が変わった後へ、
過去PASSをそのまま流用してはいけない。

Astraは、
この時間軸の分離に矛盾がないか確認すること。

---

## 19. Visual PASSの考え方

以下は別物。

- Functional PASS
- Automated PASS
- Visual PASS

CI SUCCESSはVisual PASSではない。

Screenshot取得だけでもVisual PASSではない。

TargetとActualを実際に取得し、
同一対象・同一ROIで比較し、
座標監査と視覚監査を行う。

画像を取得・decode・表示・比較できなければ、

`NOT_EVALUABLE`

であり、
PASSでもFAILでもない。

---

## 20. Parent Issue / G0 Child Issue

Astraが実装可能性まで確認する場合、
最低限以下をfresh参照するとよい。

### Parent

- #51 Village
- #52 Castle
- #53 Dungeon

### G0 Child

- #54 Village G0
- #68 Castle G0
- #82 Dungeon G0

理由:

共通契約が依存する

- Anchor Lock
- acceptance
- evidence requirements
- current target reference
- composition-first rule

が実際のIssue構造と整合しているか確認できる。

必要なら後続Childも読むが、
全Childを最初から読むことは必須ではない。

---

## 21. Existing Visual Evidence Workflow

実装レビュー時には、
Repository内の既存Visual Evidence関連workflowもfresh確認する。

見るべき点:

- permissions
- checkout source branch
- target source branch
- implementation branch
- artifact upload
- screenshot mechanism
- browser / renderer
- workflow_dispatch
- concurrency
- secrets
- reusable workflow
- called scripts
- commit / push capability
- Issue write capability

設計が良くても、
既存workflowの権限や責務が違えば、
migration planが必要。

---

## 22. Existing Scheduled Prompts

Environment Scheduled Promptは、
既存方針として不用意に変更しない。

現在の設計思想:

Scheduled Prompt
→ Parent Environment Issue
→ Current Child Issue
→ Lane Lease
→ implementation
→ render
→ evidence
→ visual comparison
→ PASS / FAIL
→ next Issue

詳細契約はGitHub側のIssue / Contractに置き、
Scheduled Promptを巨大な正本にしない。

Astraは、
契約導入のためにPrompt改変が本当に必要か、
またはGitHub側authorityだけで十分かを確認すること。

---

## 23. Grasslandとの互換性

Grassland本線には既にVisual Evidence Artifact経路が存在する。

Grasslandの過去Evidenceには、

- 実画像を取得し直接比較したもの
- automated evidence中心のもの

が混在し得る。

この契約を導入しても、
過去のEvidenceを自動的に全てVisual PASSへ格上げしない。

将来Grasslandへ適用する場合も、
Evidence identityと再監査条件を守る。

---

## 24. Astraにやらせないこと

レビュー中に以下を勝手に行わせない。

- implementation
- GitHub Issue書込み
- branch変更
- workflow変更
- Scheduled Prompt変更
- Parent #12 Router変更
- Environment Parent Issueの書換え
- 自動修正
- BOOT
- Canonical Program state変更

このレビューはまず

`DESIGN / IMPLEMENTABILITY REVIEW ONLY`

とする。

---

## 25. Astraの期待出力

Astraには以下の形式で返させるとよい。

### A. 結論

- GO
- GO WITH REQUIRED FIXES
- NO-GO

のいずれか。

### B. Blocking Issues

実装開始を止める問題だけ。

各Issueごとに、

- 問題
- 発生シナリオ
- 壊れる保証
- 修正案
- 修正しない場合の影響

### C. Non-Blocking Improvements

実装開始を止めない改善。

### D. Implementation Feasibility

特に、

- FENCED MUTATION GATEWAY
- GitHub Issue mutation
- Git branch mutation
- Lease takeover
- Durable Evidence publication
- READ ONLY Evidence Workflow

について、
GitHub上で実装可能か。

### E. Overengineering Check

保証を落とさず、
不要な複雑化を削れる箇所があるか。

### F. Final Freeze Recommendation

契約をそのままFreezeしてよいか。

---

## 26. 最重要レビュー原則

Astraは、

**「もっと厳密にできる」だけの理由でIssueを作らない。**

次のどれかに該当する場合だけBlocking Issueとする。

- stale / zombie runが永続状態を壊せる
- wrong evidenceをPASSへ採用できる
- Evidenceが後から復元不能
- 過去Evidenceの判定条件が特定不能
- READ ONLY境界を突破可能
- concurrent runでstate corruptionが起こり得る
- 契約条件がGitHub上で実装不能
- deadlock / permanent blockが現実的に発生する
- Parent / Child authorityが二重化する
- PASS semanticsが時間軸上で矛盾する

単なる好み、
命名、
軽微な表現、
将来最適化だけで
Freezeを止めない。

---

## 27. Astraへ渡す最小セット

最小構成:

1. `docs/autonomy/LUKE_QUEST_ENV_VISUAL_VERIFICATION_CONTRACT_v1.md`
2. この `Astraレビュー用 参照情報パケット v1`

実装可能性までfresh確認させる場合は、
Astra自身にGitHubから次をREAD ONLYで取得させる。

3. Parent #51 / #52 / #53
4. G0 #54 / #68 / #82
5. Relevant Visual Evidence workflows
6. Lane branch / control branchの現状
7. Target image path / blob identity
8. Relevant Scheduled Prompt内容

---

## 28. 判定上の注意

この参照情報パケットは、
Current Repository Realityの代替ではない。

GitHub上の実態と競合した場合は、
fresh repository realityを優先する。

ただし契約本文の設計意図を変更する場合は、
「実態が違うから」と黙って解釈変更せず、
設計変更候補として明示すること。

---

## 29. 正式確定後の状態

契約本文はAstraの必須修正を反映し、`FINAL v1 / 正式確定版 v1` として確定した。

本番Environment Laneの自律mutationは、契約第37節の隔離安全試験 TEST-1〜TEST-5 がfresh evidence付きで全PASSするまで有効化しない。

Scheduled Promptは変更しない。

Parent #51 / #52 / #53 から共通契約を参照する配線とし、Parent側の `FIXED REFERENCE ANCHOR LOCK v1` を座標・参照対象の唯一の正本として維持する。

---

**END OF ASTRA REVIEW REFERENCE PACKET v2**