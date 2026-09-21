# Tasks / タスク: AI見本画像からiPhone高精細3Dゲーム画面を再構築

**前提**: このTask一覧は実装用Work Graphへcompileする正本候補。旧sceneを継ぎ足し改修しない。

## Phase 0: Planning durability / 計画耐久化

- [ ] T001 Owner要件原文を `source/OWNER_REQUIREMENTS_v1.0.md` として不変保存する
- [ ] T002 Spec/Plan/Clarify/ChecklistのcoverageをOwner要件1〜82節へtraceする
- [ ] T003 Spec Kit Analyzeで矛盾・欠落・過剰実装を監査する
- [ ] T004 `DEVELOPMENT_PIPELINE_v1.md` を工程正本として固定する

## Phase 1: Safe reset / 安全な作り直し

- [ ] T005 `prototype/modern-3d` のfresh HEADとdirty/parallel stateを記録する
- [ ] T006 remote archive `archive/pre-target-image-rebuild-20260921` を作成し復旧を実証する
- [ ] T007 新implementation branch `experiment/target-image-threejs-v1` をarchive pointから作る
- [ ] T008 旧視覚sceneのReuseInventoryを作成する
- [ ] T009 [P] player/movement/input/traversal共通基盤の独立性を検証する
- [ ] T010 [P] asset loader/runtime bootstrap/diagnosticsの独立性を検証する
- [ ] T011 旧scene layout/offset/visual patchを新branchから切離す
- [ ] T012 旧コードを戻せるrollback testを実施する

## Phase 2: G0 Reference & measurement foundation

- [ ] T013 G0 Reference Set v1を作成する
- [ ] T014 Canonical Stateを固定する
- [ ] T015 Target imageからP0/P1/P2 landmark catalogを作る
- [ ] T016 normalized ROI/anchor/depth intentを全critical componentへ付与する
- [ ] T017 canonical camera/verification viewを定義する
- [ ] T018 追加2検証視点を定義する
- [ ] T019 visual evidence captureを941x1672/DPR1で固定する
- [ ] T020 overlay/diff生成を実装する
- [ ] T021 landmark measurementを実装する
- [ ] T022 silhouette mask IoU計測を実装する
- [ ] T023 Gate Record/Evidence Set保存形式を実装する
- [ ] T024 G0 evidenceをfresh exact-headで取得しPASS判定する

## Phase 3: Technical Spike

- [ ] T025 Three.js candidate runtimeを最小sceneで起動する
- [ ] T026 [P] WebGPU capability pathをiPhone実機で検証する
- [ ] T027 [P] WebGL 2 fallback pathをiPhone実機で検証する
- [ ] T028 [P] GLB loadingを検証する
- [ ] T029 [P] KTX2/Basis textureを検証する
- [ ] T030 [P] MeshoptとDracoのload-time比較を行う
- [ ] T031 [P] PBR/shadow/instancing/LODを検証する
- [ ] T032 Dynamic Resolutionと品質プリセット切替を検証する
- [ ] T033 30分technical spikeを実行する
- [ ] T034 WebGPU vs WebGL2 adoption decisionを証拠付きで記録する
- [ ] T035 Three.js継続Gateを判定し、未達ならPlayCanvas/Babylon.js比較Issueを発火する

## Phase 4: G1 Whitebox composition

- [ ] T036 gray primitiveだけのground/terrain volumeを作る
- [ ] T037 water/shore/cliff volumeを作る
- [ ] T038 bridge/main architecture volumeを作る
- [ ] T039 tree/background massを作る
- [ ] T040 player proxyを配置する
- [ ] T041 canonical camera/framingをTargetへ合わせる
- [ ] T042 P0 centerを各軸2%以内へ収束させる
- [ ] T043 main screen occupancyを±5%以内へ収束させる
- [ ] T044 horizon/reference lineを2%以内へ収束させる
- [ ] T045 P0 occlusion orderを100%一致させる
- [ ] T046 major silhouette IoUを85%以上へ収束させる
- [ ] T047 G1 Evidence Setを取得し、人間視覚評価と合わせてPASS判定する
- [ ] T048 G1 PASS前のmodel/material/light/decor作業が無いことを監査する

## Phase 5: G2 3D validity

- [ ] T049 canonical + 2 viewsでdepth/occlusion/parallaxを検証する
- [ ] T050 player traversalを検証する
- [ ] T051 camera movementでgeometry破綻が無いことを確認する
- [ ] T052 perceptual reconstructionが必要なAI画像矛盾を記録する
- [ ] T053 重要差異がある場合Owner approval gateを作る
- [ ] T054 G2 Evidence Setを取得しPASS判定する

## Phase 6: G3 Model & Material

- [ ] T055 whitebox volumeをproduction modelへ置換する
- [ ] T056 GLB/KTX2/PBR pipelineを適用する
- [ ] T057 tree/grass/stone等のrepeated assetをinstancingする
- [ ] T058 LODを導入する
- [ ] T059 model置換後にG1/G2 regressionを再実行する
- [ ] T060 G3 PASS判定する

## Phase 7: G4 Lighting & Color

- [ ] T061 light directionをTargetへ合わせる
- [ ] T062 brightness/color temperatureを収束させる
- [ ] T063 static backgroundのbaked lighting適用範囲を決める
- [ ] T064 realtime shadowを主役対象へ限定する
- [ ] T065 G1-G3 regressionを再実行する
- [ ] T066 G4 PASS判定する

## Phase 8: G5 Background & Decoration

- [ ] T067 background density/depthをTargetへ合わせる
- [ ] T068 small props/vegetation/detailを追加する
- [ ] T069 high-cost screen effectsを必要最小限で追加する
- [ ] T070 G1-G4 regressionを再実行する
- [ ] T071 G5 PASS判定する

## Phase 9: G6 iPhone runtime

- [ ] T072 Safari direct launchを検証する
- [ ] T073 Home Screen Web App launchを検証する
- [ ] T074 safe areaを検証する
- [ ] T075 touch coordinates/virtual stick/page scroll防止を検証する
- [ ] T076 background/resumeを検証する
- [ ] T077 GPU capability fallback/unsupported stateを検証する
- [ ] T078 High/Balanced/Performance/Autoを実装・検証する
- [ ] T079 quality hysteresisを実装する
- [ ] T080 iPhone 15 Pro相当performanceを測定する
- [ ] T081 iPhone 13相当performanceを測定する
- [ ] T082 20Mbps相当で8秒以内playableを測定する
- [ ] T083 非必須asset failureを検証する
- [ ] T084 30分stability testを実行する
- [ ] T085 20回scene re-entryを実行する
- [ ] T086 G6 PASS判定する

## Phase 10: G7 final convergence

- [ ] T087 iPhone実機でfinal Target/Actualを取得する
- [ ] T088 overlay/diff/landmark/silhouetteを最終計測する
- [ ] T089 12項目human visual reviewを実施する
- [ ] T090 unapproved important differenceを0件にする
- [ ] T091 performance evidenceを確定する
- [ ] T092 visual evidenceを確定する
- [ ] T093 全Gate regressionを実行する
- [ ] T094 G7 PASSと完成候補を判定する

## Phase 11: Work graph / GitHub移行

- [ ] T095 `/speckit.taskstoissues` でTaskをGitHub Issueへcompileする
- [ ] T096 Parent Issueを作成し全Work Unitを紐付ける
- [ ] T097 Sub-issuesで縦方向のGate/Work Unit構造を作る
- [ ] T098 Issue Dependenciesで横方向のblocked-by/blocksを登録する
- [ ] T099 GitHub Projects v2へIssueを投影する
- [ ] T100 Project fieldsにStatus/Priority/Gate/Lane/Work Typeを設定する
- [ ] T101 Issue→Task→Requirement coverage matrixを検証する

## Phase 12: Required Spec Kit Extension / 必要な拡張

- [ ] T102 Coreで不足するSub-issues / Dependencies / Projects v2投影をSpec Kit Extensionとして定義する
- [ ] T103 Extensionにdry-run / idempotency / replay safetyを持たせる
- [ ] T104 Extensionで生成・更新したWork Graphがtasks.md/analyze.mdと100%整合することを検証する

## Phase 13: Agent implementation / 実装

- [ ] T105 Ready Issueだけを実装Agentへ渡す
- [ ] T106 Issueごとにclaim/lease/branch/worktreeを分離する
- [ ] T107 Implementation→Test→Evidence→Review→Fix→PR→Mergeを実行する
- [ ] T108 PASS/Evidence成立後だけIssue closeとParent progressを更新する

## Phase 14: Converge / 最終収束

- [ ] T109 `speckit.converge` でSource Requirements→Spec→Plan→Tasks→Issues→Implementation→Evidenceを照合する
- [ ] T110 未実装requirement、孤立task、孤立issue、証拠不足PASSを0件にする
- [ ] T111 Reference Set/target identity/acceptance thresholdのdriftを監査する
- [ ] T112 不足があればTask/Issueを追加し再実装する
- [ ] T113 再Convergeを実行する
- [ ] T114 Converge PASSを耐久記録し、実装branchの最終統合可否を判定する
