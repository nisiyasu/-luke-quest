# 機能仕様: AI見本画像からiPhone高精細3Dゲーム画面を再構築する

**機能ブランチ**: `spec/target-image-to-threejs-20260921`  
**作成日**: 2026-09-21  
**状態**: Owner要件 v1.0 を基にした Specify 候補  
**正本入力**: `source/OWNER_REQUIREMENTS_v1.0.md`

## 1. 目的

Ownerが指定したAI生成見本画像の視覚的完成形を、iPhone上でプレイ可能な実時間3Dゲーム画面として再構築する。

成功とは、3Dモデルが表示されたこと、ブラウザで起動したこと、高解像度であることではない。次の二つを同時に満たすことを成功とする。

1. 見本画像への視覚収束
2. iPhoneゲームとしての実用性能・安定性・操作可能性

## 2. 今回の垂直スライス正本

初回の対象はLUKE QUESTの王都近郊フィールド1画面とする。

- Repository: `nisiyasu/-luke-quest`
- Target source branch: `prototype/modern-3d`
- Target source commit: `90635ceff9d35d69f80da350df1e6ea0610657dd`
- Target path: `assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png`
- Target blob SHA: `b7281e6580689a7a22cfa3b67d500950e4af7285`
- Canonical comparison viewport: `941x1672`
- DPR: `1`
- Crop: none
- Padding: none
- fullPage: false

このidentityの一部でも異なる画像を、Owner承認なしで正本へ置き換えてはならない。

## 3. 再構築方針

### 3.1 旧視覚実装は改修元にしない

現在の視覚実装は、完成画面へ継ぎ足す改修元として扱わない。

新しい実装作業を開始する前に、現行 `prototype/modern-3d` の復旧点をGit tagまたはarchive branchで保存する。新しい視覚実装は別implementation branchで開始する。

### 3.2 再利用してよいもの

旧実装から再利用してよいのは、視覚構図から独立していることを確認できた共通基盤だけとする。

候補:
- player core
- movement
- input
- camera controlの共通部分
- traversal
- asset loader
- runtime bootstrap
- diagnostics

再利用前に「旧構図・旧座標・旧scene固有状態への依存がない」ことを確認する。

### 3.3 再利用してはいけないもの

次は原則として新しい視覚実装へ持ち込まない。

- 旧画面固有のscene配置
- 旧camera framing補正
- 旧ランドマーク座標
- 旧構図を成立させるための個別offset
- 継ぎ足しで増えたvisual patch
- 旧scene専用CSS/DOM/addon
- ターゲット静止画と無関係な「それっぽさ」を作る装飾

## 4. ユーザーストーリー

### US1: ホワイトボックスで構図を先に一致させる

Ownerは、完成モデルや照明より前に、灰色の単純形状だけを使った初期レベルの画面で、カメラ、P0ランドマーク、大きさ、高低差、前後関係、主建築ボリューム、遠景位置をターゲットへ合わせたい。

**独立検証**:
- 白箱だけのActualをcanonical viewportで撮影する。
- Targetと同一領域比較する。
- P0ランドマーク位置、主要占有率、地平線、遮蔽順序、主要シルエットを測る。
- 構図GateがPASSしない限り本モデル工程へ進めない。

### US2: 3D空間として成立させる

プレイヤーやカメラが動いたときも、基準ショットだけの書き割りではなく、前後関係、奥行き、遮蔽、視差が破綻しない3D空間として成立させたい。

**独立検証**:
- Canonical Reference Viewに加えて最低2つの検証視点を定義する。
- 主要P0/P1対象の前後関係、遮蔽、視差、形状継続性を確認する。

### US3: 見本画像へ段階的に視覚収束させる

Ownerは、モデル、材質、照明、背景密度、画面効果を、前段で合格済みの構図を壊さず見本画像へ近づけたい。

**独立検証**:
- 各GateでTarget / Actual / overlay or diff / landmark measurements / verdict / residual gapを保存する。
- 後段変更で前段の合格条件が崩れた場合、そのGateを再OPENする。

### US4: iPhoneで実際に遊べる

プレイヤーはSafariまたはホーム画面Webアプリからゲームへ到達し、タッチ操作で遊べる。画質調整や描画経路切替が発生しても、構図、入力、進行が壊れない。

**独立検証**:
- Safari起動
- ホーム画面起動
- safe area
- touch input
- background/resume
- GPU capability fallback
- quality switching
- sustained performance

### US5: 長時間安定して動作する

Ownerは、起動直後だけ速いデモではなく、30分継続・20回再入場を含む実用状態を確認したい。

**独立検証**:
- 30分連続実行
- 20回入退場
- crash/reload/GPU hangの有無
- performance指標

## 5. 機能要件

### 5.1 Reference Set

- FR-001: 見本画像群をReference Setとして版管理する。
- FR-002: 各画像に識別子、元画像、バージョン、担当視覚要素、優先度、使用scene、current/legacyを持たせる。
- FR-003: 複数画像のauthorityを、構図、camera、placement、architecture、color、lighting、material、character、background density、UIごとに明示する。
- FR-004: 新しいReference Setを採用するときは旧版を上書きせずversionを上げる。
- FR-005: AI画像の3D矛盾はPerceptual Reconstructionで解消し、重要差異はOwner承認なしに確定しない。

### 5.2 基準状態・座標・ランドマーク

- FR-006: 基準状態にscene、character position/orientation、camera、time、weather、animation、UI、orientationを固定できる。
- FR-007: P0/P1/P2 landmarkを定義する。
- FR-008: 主要対象を0..1のnormalized screen coordinateで測定可能にする。
- FR-009: stable component IDを維持し、途中で別対象へすり替えない。
- FR-010: depth intentをforeground / midground / background等で記録する。

### 5.3 構図Gate

- FR-011: ホワイトボックス段階でcamera、P0 landmark、size、elevation、occlusion order、main architecture volume、distant placementを検証する。
- FR-012: P0 landmark center differenceは画面幅・高さの2%以内を初期基準とする。
- FR-013: 主対象のscreen occupancy差は±5%以内を初期基準とする。
- FR-014: horizon / major reference line差は2%以内を初期基準とする。
- FR-015: P0 occlusion orderは100%一致を要求する。
- FR-016: 計測可能なmajor silhouetteは初期基準85%以上の重なりを要求する。
- FR-017: Ownerだけがこれらの許容差を緩和できる。

### 5.4 3D成立性

- FR-018: 基準ショットだけ成立する書き割り3Dを原則禁止する。
- FR-019: 視差があるsceneでは最低2つの追加検証視点を持つ。
- FR-020: 追加視点でdepth、occlusion、geometry、parallaxが破綻しない。

### 5.5 視覚収束

- FR-021: 制作順はReference登録→landmark→composition analysis→whitebox→canonical camera→composition compare→3D validity→model→material→lighting/shadow→background density→effects→iPhone→visual/performance diff→convergenceとする。
- FR-022: 構図Gate未合格で本モデル・質感へ進まない。
- FR-023: 3D Gate未合格でArt Gateへ進まない。
- FR-024: 後工程で前工程が壊れた場合は旧PASSを自動維持しない。
- FR-025: AIの「似ている」という感想だけを合格証拠にしない。

### 5.6 iPhone実行

- FR-026: Safari直接起動とホーム画面Webアプリ起動を対象にする。
- FR-027: safe areaに必須UI/操作領域/重要情報を収める。
- FR-028: 内部3D解像度変更時もtouch座標を正しく保つ。
- FR-029: background移行時に不要な高負荷処理を継続しない。
- FR-030: resume時にrender/input/camera/game stateを正常復帰する。
- FR-031: 必要GPU capabilityが無い場合、安全な別経路または明示的unsupported stateへ移行する。

### 5.7 品質制御

- FR-032: High / Balanced / Performance / Autoの品質プリセットを持てる。
- FR-033: 標準はAutoとする。
- FR-034: auto qualityはinternal resolution、effects、shadow、distant precision、background density等を調整できる。
- FR-035: quality changeでcamera/object position/game progression/UI/input/black screenを壊してはならない。
- FR-036: quality stateの短時間往復を抑制する。

### 5.8 Performance / Stability

- FR-037: iPhone 15 Pro相当で通常play median 55fps以上、frame time p95 25ms以下を初期目標とする。
- FR-038: iPhone 13相当で通常play median 30fps以上、frame time p95 40ms以下を初期目標とする。
- FR-039: 通常状態で2秒以上連続20fps未満を許容しない。
- FR-040: load後の100ms超停止は高画質標準端末で原則1分1回未満とする。
- FR-041: 30分連続試験でcrash、意図しないreload、永続render停止、復旧不能GPU異常を許容しない。
- FR-042: 主要sceneの入場→退出→再入場を20回以上行っても不安定化しない。

### 5.9 Loading / Failure

- FR-043: progressive loadingを可能にし、全asset取得完了までplay開始を待たせることを前提にしない。
- FR-044: 20Mbps程度の標準networkで8秒以内に操作可能状態を初期目標とする。
- FR-045: 非必須asset1件の取得失敗でgame全体を停止しない。
- FR-046: 起動不能時はwhite screen / infinite loadingではなくcontrolled error stateへ移行する。

### 5.10 Evidence

- FR-047: 主要視覚GateでTarget、Actual、overlay/diff、landmark measurement、verdict、residual gapを保存する。
- FR-048: performance Gateでdevice、OS、launch mode、scene、duration、frame metrics、quality state、anomalyを保存する。
- FR-049: evidenceは実装HEADと結び付ける。
- FR-050: iPhone最終視覚Gateは実機captureを必須とし、PC表示だけでPASSにしない。

## 6. Gate

- G0: Reference Set / target registration / baseline state
- G1: Whitebox composition
- G2: 3D validity
- G3: Model & material
- G4: Lighting & color
- G5: Background & decoration
- G6: iPhone performance / lifecycle / quality
- G7: Final visual convergence

前段GateがFAILまたは再OPENしたら、影響する後段PASSを無効にする。

## 7. 人間視覚評価

5段階でcamera match、composition match、distance impression、architecture、character presence、light direction、light/dark、color temperature、material、background density、world impression、overall impressionを評価する。

この垂直スライスでは、P0/P1に関係する評価項目とoverall impressionは4以上を要求する。数値評価と人間視覚評価の両方を使う。

## 8. 対象外

- story
- quest
- combat system
- enemy AI
- save
- monetization
- multiplayer
- server
- App Store delivery
- music/audio
- general-purpose image-to-3D automation service
- village/castle/dungeon固有実装

## 9. 完成条件

### 視覚基盤完成候補
- P0 composition within tolerance
- major scale within tolerance
- correct occlusion order
- valid 3D in required viewpoints
- color/light pass
- material readability pass
- background density/depth pass
- iPhone physical-device confirmation

### 製品完成候補
- Safari launch pass
- Home Screen launch pass
- GPU capability fallback pass
- high-quality-device performance pass
- minimum-device performance pass
- 30-minute pass
- 20 re-entry pass
- quality change pass
- background/resume pass
- zero unapproved important differences
- visual evidence durable
- performance evidence durable

## 10. 成功指標

- SC-001: P0 landmark中心差は各軸2%以内。
- SC-002: 主対象占有率差は±5%以内。
- SC-003: horizon/reference line差は2%以内。
- SC-004: P0 occlusion order 100%一致。
- SC-005: major silhouette overlap 85%以上。
- SC-006: final visual candidateで必要な人間視覚評価4以上。
- SC-007: iPhone 15 Pro相当performanceがFR-037を満たす。
- SC-008: iPhone 13相当performanceがFR-038/039を満たす。
- SC-009: 30分 stability testで重大異常0。
- SC-010: 20回re-entryで重大異常0。
- SC-011: 20Mbps程度で8秒以内に操作可能状態。
- SC-012: 全主要Gateに必要Evidence Setが存在し、exact implementation HEADへtraceできる。

## 11. Owner決定として追加する方針

- 旧視覚実装は新画面の改修元にしない。
- 旧視覚実装は削除前にGitで復旧可能なarchive/tagを作る。
- 新implementation branchでは、視覚sceneを白箱から作り直す。
- 共通runtimeは依存監査を通ったものだけ選別再利用する。
- 「今あるものを少しずつ直す」ことを既定戦略にしない。
